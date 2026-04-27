export interface Repo {
  name: string;
  fullName: string;
  defaultBranch: string;
  url: string;
  isArchived: boolean;
  pushedAt: string;
}

export interface FileCommit {
  path: string;
  lastModified: Date;
  lastCommitSha: string;
  lastCommitMessage: string;
}

export interface StalenessIssue {
  type: 'proximity';
  docPath: string;
  docLastModified: Date;
  relatedCodePath: string;
  codeLastModified: Date;
  daysBehind: number;
}

export interface DeadLinkIssue {
  type: 'dead-link';
  docPath: string;
  link: string;
  reason: string;
}

export type AuditIssue = StalenessIssue | DeadLinkIssue;

export interface RepoAuditResult {
  repo: Repo;
  issues: AuditIssue[];
  docsChecked: number;
  linksChecked: number;
  error?: string;
}

export interface AuditOptions {
  staleDays: number;
  checkLinks: boolean;
  checkStaleness: boolean;
  includeArchived: boolean;
  concurrency: number;
  verbose: boolean;
}
