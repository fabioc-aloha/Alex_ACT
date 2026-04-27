import chalk from 'chalk';
import type { RepoAuditResult, StalenessIssue, DeadLinkIssue } from './types.js';

/**
 * Format a date as relative time
 */
function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

/**
 * Format a staleness issue
 */
function formatStalenessIssue(issue: StalenessIssue): string {
  return [
    `  ${chalk.yellow('⚠')} ${chalk.bold(issue.docPath)}`,
    `    ${chalk.dim('Last updated:')} ${formatRelativeDate(issue.docLastModified)}`,
    `    ${chalk.dim('Code changed:')} ${issue.relatedCodePath} (${formatRelativeDate(issue.codeLastModified)})`,
    `    ${chalk.dim('Behind by:')} ${chalk.red(`${issue.daysBehind} days`)}`,
  ].join('\n');
}

/**
 * Format a dead link issue
 */
function formatDeadLinkIssue(issue: DeadLinkIssue): string {
  return [
    `  ${chalk.red('✗')} ${chalk.bold(issue.docPath)}`,
    `    ${chalk.dim('Dead link:')} ${issue.link}`,
    `    ${chalk.dim('Reason:')} ${issue.reason}`,
  ].join('\n');
}

/**
 * Print results to console
 */
export function printResults(results: RepoAuditResult[]): void {
  const totalRepos = results.length;
  const reposWithIssues = results.filter((r) => r.issues.length > 0).length;
  const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0);
  const totalStaleness = results.reduce(
    (sum, r) => sum + r.issues.filter((i) => i.type === 'proximity').length,
    0
  );
  const totalDeadLinks = results.reduce(
    (sum, r) => sum + r.issues.filter((i) => i.type === 'dead-link').length,
    0
  );
  const errors = results.filter((r) => r.error).length;

  console.log('');
  console.log(chalk.bold('═══════════════════════════════════════════════════════════'));
  console.log(chalk.bold('                    STALE DOCS AUDIT REPORT                 '));
  console.log(chalk.bold('═══════════════════════════════════════════════════════════'));
  console.log('');

  // Summary
  console.log(chalk.bold('Summary'));
  console.log(chalk.dim('─────────────────────────────────────────────────────────────'));
  console.log(`  Repos scanned:     ${totalRepos}`);
  console.log(`  Repos with issues: ${reposWithIssues > 0 ? chalk.yellow(reposWithIssues) : chalk.green(0)}`);
  console.log(`  Total issues:      ${totalIssues > 0 ? chalk.yellow(totalIssues) : chalk.green(0)}`);
  console.log(`    Stale docs:      ${totalStaleness > 0 ? chalk.yellow(totalStaleness) : chalk.green(0)}`);
  console.log(`    Dead links:      ${totalDeadLinks > 0 ? chalk.red(totalDeadLinks) : chalk.green(0)}`);
  if (errors > 0) {
    console.log(`  Errors:            ${chalk.red(errors)}`);
  }
  console.log('');

  // Per-repo results (only repos with issues)
  const reposToShow = results.filter((r) => r.issues.length > 0 || r.error);

  if (reposToShow.length === 0) {
    console.log(chalk.green('✓ All documentation is up to date!'));
    console.log('');
    return;
  }

  console.log(chalk.bold('Issues by Repository'));
  console.log(chalk.dim('─────────────────────────────────────────────────────────────'));

  for (const result of reposToShow) {
    console.log('');
    console.log(chalk.bold.blue(result.repo.fullName));
    console.log(chalk.dim(`  ${result.repo.url}`));

    if (result.error) {
      console.log(chalk.red(`  Error: ${result.error}`));
      continue;
    }

    const stalenessIssues = result.issues.filter((i): i is StalenessIssue => i.type === 'proximity');
    const linkIssues = result.issues.filter((i): i is DeadLinkIssue => i.type === 'dead-link');

    if (stalenessIssues.length > 0) {
      console.log('');
      console.log(chalk.yellow(`  Stale Documentation (${stalenessIssues.length})`));
      for (const issue of stalenessIssues) {
        console.log(formatStalenessIssue(issue));
      }
    }

    if (linkIssues.length > 0) {
      console.log('');
      console.log(chalk.red(`  Dead Links (${linkIssues.length})`));
      for (const issue of linkIssues) {
        console.log(formatDeadLinkIssue(issue));
      }
    }
  }

  console.log('');
  console.log(chalk.dim('─────────────────────────────────────────────────────────────'));
}

/**
 * Output results as JSON
 */
export function printJson(results: RepoAuditResult[]): void {
  const output = {
    summary: {
      totalRepos: results.length,
      reposWithIssues: results.filter((r) => r.issues.length > 0).length,
      totalIssues: results.reduce((sum, r) => sum + r.issues.length, 0),
      stalenessIssues: results.reduce(
        (sum, r) => sum + r.issues.filter((i) => i.type === 'proximity').length,
        0
      ),
      deadLinkIssues: results.reduce(
        (sum, r) => sum + r.issues.filter((i) => i.type === 'dead-link').length,
        0
      ),
    },
    repos: results.map((r) => ({
      name: r.repo.fullName,
      url: r.repo.url,
      issues: r.issues,
      error: r.error,
    })),
  };

  console.log(JSON.stringify(output, null, 2));
}
