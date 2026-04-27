import * as path from 'node:path';
import type { Repo, FileCommit, StalenessIssue } from './types.js';
import { getDocFiles, getFilesLastCommits } from './github.js';

// Code file extensions to track
const CODE_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
  '.py', '.pyw',
  '.go',
  '.rs',
  '.java', '.kt', '.scala',
  '.cs', '.fs',
  '.rb',
  '.php',
  '.swift',
  '.c', '.cpp', '.cc', '.h', '.hpp',
  '.vue', '.svelte',
]);

/**
 * Check if a file is a code file
 */
function isCodeFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return CODE_EXTENSIONS.has(ext);
}

/**
 * Get related code files for a documentation file.
 * 
 * Proximity rules:
 * - README.md relates to all code in same directory
 * - docs/foo.md relates to src/foo.* or lib/foo.*
 * - CHANGELOG.md relates to package.json, Cargo.toml, etc.
 */
function getRelatedCodePaths(docPath: string, allFiles: string[]): string[] {
  const docDir = path.dirname(docPath);
  const docName = path.basename(docPath, path.extname(docPath)).toLowerCase();
  
  const related: string[] = [];

  for (const file of allFiles) {
    if (!isCodeFile(file)) continue;

    const fileDir = path.dirname(file);
    const fileName = path.basename(file, path.extname(file)).toLowerCase();

    // Rule 1: Same directory
    if (fileDir === docDir) {
      related.push(file);
      continue;
    }

    // Rule 2: README relates to all immediate children code files
    if (docName === 'readme') {
      // README.md in root relates to src/, lib/, etc.
      if (docDir === '.' || docDir === '') {
        if (fileDir.startsWith('src') || fileDir.startsWith('lib')) {
          // Only top-level files in src/lib
          if (!fileDir.includes('/') || fileDir.split('/').length <= 2) {
            related.push(file);
          }
        }
      }
      continue;
    }

    // Rule 3: docs/feature.md relates to src/feature.* or lib/feature.*
    if (docDir.startsWith('docs')) {
      const srcPath = `src/${fileName}`;
      const libPath = `lib/${fileName}`;
      if (file.startsWith(srcPath) || file.startsWith(libPath)) {
        related.push(file);
      }
      continue;
    }

    // Rule 4: Component docs relate to component code
    // e.g., components/Button/README.md relates to components/Button/*.tsx
    if (docName === 'readme' && fileDir.startsWith(docDir)) {
      related.push(file);
    }
  }

  return related;
}

/**
 * Find package/manifest files that CHANGELOG should relate to
 */
function getManifestFiles(allFiles: string[]): string[] {
  const manifests = [
    'package.json',
    'Cargo.toml',
    'pyproject.toml',
    'setup.py',
    'go.mod',
    'pom.xml',
    'build.gradle',
    'Gemfile',
  ];
  
  return allFiles.filter((f) => manifests.includes(path.basename(f)));
}

/**
 * Detect staleness issues in a repository
 */
export async function detectStaleness(
  repo: Repo,
  staleDays: number,
  allFiles: string[]
): Promise<StalenessIssue[]> {
  const issues: StalenessIssue[] = [];
  
  // Get documentation files
  const docFiles = allFiles.filter((f) => 
    f.endsWith('.md') || f.endsWith('.MD')
  );

  if (docFiles.length === 0) {
    return issues;
  }

  // Get code files
  const codeFiles = allFiles.filter(isCodeFile);
  
  if (codeFiles.length === 0) {
    return issues;
  }

  // Get last commit dates for all relevant files
  const relevantFiles = new Set<string>();
  
  for (const doc of docFiles) {
    relevantFiles.add(doc);
    
    const docName = path.basename(doc, path.extname(doc)).toLowerCase();
    
    // Special case: CHANGELOG relates to manifest files
    if (docName === 'changelog') {
      for (const manifest of getManifestFiles(allFiles)) {
        relevantFiles.add(manifest);
      }
    } else {
      for (const code of getRelatedCodePaths(doc, codeFiles)) {
        relevantFiles.add(code);
      }
    }
  }

  const commits = await getFilesLastCommits(repo, Array.from(relevantFiles));
  
  // Check each doc against related code
  for (const doc of docFiles) {
    const docCommit = commits.get(doc);
    if (!docCommit) continue;

    const docName = path.basename(doc, path.extname(doc)).toLowerCase();
    
    let relatedCode: string[];
    if (docName === 'changelog') {
      relatedCode = getManifestFiles(allFiles);
    } else {
      relatedCode = getRelatedCodePaths(doc, codeFiles);
    }

    // Find the most recently modified related code file
    let newestCode: FileCommit | null = null;
    
    for (const codePath of relatedCode) {
      const codeCommit = commits.get(codePath);
      if (!codeCommit) continue;
      
      if (!newestCode || codeCommit.lastModified > newestCode.lastModified) {
        newestCode = codeCommit;
      }
    }

    if (!newestCode) continue;

    // Check if code is newer than docs by threshold
    const daysBehind = Math.floor(
      (newestCode.lastModified.getTime() - docCommit.lastModified.getTime()) / 
      (1000 * 60 * 60 * 24)
    );

    if (daysBehind >= staleDays) {
      issues.push({
        type: 'proximity',
        docPath: doc,
        docLastModified: docCommit.lastModified,
        relatedCodePath: newestCode.path,
        codeLastModified: newestCode.lastModified,
        daysBehind,
      });
    }
  }

  return issues;
}
