#!/usr/bin/env node
import { program } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import type { Repo, RepoAuditResult, AuditOptions } from './types.js';
import { checkAuth, fetchRepos, getDocFiles } from './github.js';
import { detectStaleness } from './staleness.js';
import { checkAllLinks } from './links.js';
import { printResults, printJson } from './reporter.js';

const VERSION = '1.0.0';

/**
 * Audit a single repository
 */
async function auditRepo(
  repo: Repo,
  options: AuditOptions,
  spinner: ReturnType<typeof ora>
): Promise<RepoAuditResult> {
  const result: RepoAuditResult = {
    repo,
    issues: [],
    docsChecked: 0,
    linksChecked: 0,
  };

  try {
    if (options.verbose) {
      spinner.text = `Auditing ${repo.fullName}...`;
    }

    // Get all files in repo
    const docFiles = await getDocFiles(repo);
    result.docsChecked = docFiles.length;

    if (docFiles.length === 0) {
      return result;
    }

    // Get all files for context
    const allFilesRaw = await import('./github.js').then((m) =>
      m.getDocFiles(repo).catch(() => [])
    );

    // This is a simplification - in reality we'd need to fetch all files
    // For now, we'll work with what we have
    const allFiles = docFiles; // Placeholder

    // Check staleness
    if (options.checkStaleness) {
      const stalenessIssues = await detectStaleness(repo, options.staleDays, allFiles);
      result.issues.push(...stalenessIssues);
    }

    // Check dead links
    if (options.checkLinks) {
      const { issues: linkIssues, linksChecked } = await checkAllLinks(
        repo,
        docFiles,
        allFiles
      );
      result.issues.push(...linkIssues);
      result.linksChecked = linksChecked;
    }
  } catch (error: unknown) {
    const err = error as { message?: string };
    result.error = err.message || 'Unknown error';
  }

  return result;
}

/**
 * Main audit function
 */
async function runAudit(options: AuditOptions & { json?: boolean }): Promise<void> {
  const spinner = ora('Checking authentication...').start();

  // Check auth
  const isAuthed = await checkAuth();
  if (!isAuthed) {
    spinner.fail('Not authenticated. Run: gh auth login');
    process.exit(1);
  }
  spinner.succeed('Authenticated');

  // Fetch repos
  spinner.start('Fetching repositories...');
  let repos: Repo[];
  try {
    repos = await fetchRepos(options.includeArchived);
    spinner.succeed(`Found ${repos.length} repositories`);
  } catch (error: unknown) {
    const err = error as { message?: string };
    spinner.fail(`Failed to fetch repos: ${err.message}`);
    process.exit(1);
  }

  if (repos.length === 0) {
    console.log(chalk.yellow('No repositories found.'));
    return;
  }

  // Audit repos
  spinner.start(`Auditing ${repos.length} repositories...`);
  const results: RepoAuditResult[] = [];
  let completed = 0;

  // Process repos with concurrency limit
  const queue = [...repos];
  const active: Promise<void>[] = [];

  async function processNext(): Promise<void> {
    const repo = queue.shift();
    if (!repo) return;

    const result = await auditRepo(repo, options, spinner);
    results.push(result);
    completed++;

    if (!options.json) {
      spinner.text = `Auditing repositories... (${completed}/${repos.length})`;
    }

    await processNext();
  }

  // Start initial batch
  for (let i = 0; i < Math.min(options.concurrency, repos.length); i++) {
    active.push(processNext());
  }

  await Promise.all(active);
  spinner.succeed(`Audited ${repos.length} repositories`);

  // Output results
  if (options.json) {
    printJson(results);
  } else {
    printResults(results);
  }

  // Exit with error code if issues found
  const hasIssues = results.some((r) => r.issues.length > 0);
  if (hasIssues) {
    process.exit(1);
  }
}

// CLI setup
program
  .name('stale-docs')
  .description('Audit GitHub repos for stale documentation')
  .version(VERSION);

program
  .command('audit')
  .description('Run documentation audit on all your repositories')
  .option('-d, --stale-days <days>', 'Days threshold for staleness', '30')
  .option('--no-links', 'Skip dead link checking')
  .option('--no-staleness', 'Skip staleness checking')
  .option('--include-archived', 'Include archived repositories')
  .option('-c, --concurrency <n>', 'Number of repos to audit in parallel', '3')
  .option('-v, --verbose', 'Show detailed progress')
  .option('--json', 'Output results as JSON')
  .action(async (opts) => {
    const options: AuditOptions & { json?: boolean } = {
      staleDays: parseInt(opts.staleDays, 10),
      checkLinks: opts.links !== false,
      checkStaleness: opts.staleness !== false,
      includeArchived: opts.includeArchived || false,
      concurrency: parseInt(opts.concurrency, 10),
      verbose: opts.verbose || false,
      json: opts.json || false,
    };

    await runAudit(options);
  });

program
  .command('check')
  .description('Quick check - alias for audit')
  .action(() => {
    program.commands.find((c) => c.name() === 'audit')?.parse();
  });

// Default command
program
  .action(() => {
    program.commands.find((c) => c.name() === 'audit')?.parse(['node', 'stale-docs', 'audit']);
  });

program.parse();
