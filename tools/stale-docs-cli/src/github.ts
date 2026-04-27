import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import type { Repo, FileCommit } from './types.js';

const execAsync = promisify(exec);

/**
 * Execute a gh CLI command and return parsed JSON output
 */
async function gh<T>(args: string): Promise<T> {
  try {
    const { stdout } = await execAsync(`gh ${args}`, {
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer for large outputs
    });
    return JSON.parse(stdout);
  } catch (error: unknown) {
    const err = error as { stderr?: string; message?: string };
    if (err.stderr?.includes('gh auth login')) {
      throw new Error('Not authenticated. Run: gh auth login');
    }
    throw new Error(`gh CLI error: ${err.stderr || err.message}`);
  }
}

/**
 * Execute a gh CLI command and return raw output
 */
async function ghRaw(args: string): Promise<string> {
  try {
    const { stdout } = await execAsync(`gh ${args}`, {
      maxBuffer: 10 * 1024 * 1024,
    });
    return stdout.trim();
  } catch (error: unknown) {
    const err = error as { stderr?: string; message?: string };
    throw new Error(`gh CLI error: ${err.stderr || err.message}`);
  }
}

/**
 * Check if gh CLI is authenticated
 */
export async function checkAuth(): Promise<boolean> {
  try {
    await execAsync('gh auth status');
    return true;
  } catch {
    return false;
  }
}

/**
 * Get authenticated user's login
 */
export async function getUser(): Promise<string> {
  const result = await gh<{ login: string }>('api user --jq .login');
  return result.login || (await ghRaw('api user --jq .login'));
}

/**
 * Fetch all repos for the authenticated user
 */
export async function fetchRepos(includeArchived: boolean): Promise<Repo[]> {
  // Use gh repo list which is simpler and handles pagination
  const archivedFlag = includeArchived ? '' : '--no-archived';
  const result = await ghRaw(
    `repo list --limit 1000 ${archivedFlag} --json name,nameWithOwner,defaultBranchRef,url,isArchived,pushedAt`
  );

  const repoData = JSON.parse(result) as Array<{
    name: string;
    nameWithOwner: string;
    defaultBranchRef: { name: string } | null;
    url: string;
    isArchived: boolean;
    pushedAt: string;
  }>;

  const repos: Repo[] = [];
  for (const repo of repoData) {
    if (!repo.defaultBranchRef) continue; // Skip empty repos
    
    repos.push({
      name: repo.name,
      fullName: repo.nameWithOwner,
      defaultBranch: repo.defaultBranchRef.name,
      url: repo.url,
      isArchived: repo.isArchived,
      pushedAt: repo.pushedAt,
    });
  }

  return repos;
}

/**
 * Get documentation files in a repo
 */
export async function getDocFiles(repo: Repo): Promise<string[]> {
  const docPatterns = [
    'README.md',
    'README.MD',
    'readme.md',
    'CHANGELOG.md',
    'CONTRIBUTING.md',
    'docs/**/*.md',
    '**/*.md',
  ];

  try {
    // Get all files in the repo
    const result = await ghRaw(
      `api repos/${repo.fullName}/git/trees/${repo.defaultBranch}?recursive=1 --jq '.tree[].path'`
    );

    const files = result.split('\n').filter(Boolean);
    
    // Filter to markdown files
    return files.filter((f) => 
      f.endsWith('.md') || f.endsWith('.MD')
    );
  } catch {
    return [];
  }
}

/**
 * Get file content from a repo
 */
export async function getFileContent(repo: Repo, path: string): Promise<string> {
  try {
    const content = await ghRaw(
      `api repos/${repo.fullName}/contents/${encodeURIComponent(path)} --jq '.content' | base64 -d`
    );
    return content;
  } catch {
    // Fallback: use raw URL
    const rawUrl = `https://raw.githubusercontent.com/${repo.fullName}/${repo.defaultBranch}/${path}`;
    const result = await ghRaw(`api ${rawUrl}`);
    return result;
  }
}

/**
 * Get last commit date for a file
 */
export async function getFileLastCommit(repo: Repo, path: string): Promise<FileCommit | null> {
  try {
    const result = await gh<Array<{
      sha: string;
      commit: {
        message: string;
        committer: { date: string };
      };
    }>>(`api repos/${repo.fullName}/commits?path=${encodeURIComponent(path)}&per_page=1`);

    if (!result.length) return null;

    const commit = result[0];
    return {
      path,
      lastModified: new Date(commit.commit.committer.date),
      lastCommitSha: commit.sha,
      lastCommitMessage: commit.commit.message.split('\n')[0],
    };
  } catch {
    return null;
  }
}

/**
 * Get commits for multiple files efficiently
 */
export async function getFilesLastCommits(
  repo: Repo,
  paths: string[]
): Promise<Map<string, FileCommit>> {
  const results = new Map<string, FileCommit>();
  
  // Process in batches to avoid rate limiting
  const batchSize = 5;
  for (let i = 0; i < paths.length; i += batchSize) {
    const batch = paths.slice(i, i + batchSize);
    const promises = batch.map((path) => getFileLastCommit(repo, path));
    const commits = await Promise.all(promises);
    
    for (let j = 0; j < batch.length; j++) {
      const commit = commits[j];
      if (commit) {
        results.set(batch[j], commit);
      }
    }
  }

  return results;
}

/**
 * Check if a URL is reachable
 */
export async function checkUrl(url: string): Promise<{ ok: boolean; reason?: string }> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: AbortSignal.timeout(10000),
    });
    
    if (response.ok) {
      return { ok: true };
    }
    return { ok: false, reason: `HTTP ${response.status}` };
  } catch (error: unknown) {
    const err = error as { name?: string; message?: string };
    if (err.name === 'TimeoutError') {
      return { ok: false, reason: 'Timeout' };
    }
    return { ok: false, reason: err.message || 'Network error' };
  }
}

/**
 * Check if a file exists in the repo
 */
export async function fileExists(repo: Repo, path: string): Promise<boolean> {
  try {
    await ghRaw(`api repos/${repo.fullName}/contents/${encodeURIComponent(path)} --jq '.sha'`);
    return true;
  } catch {
    return false;
  }
}
