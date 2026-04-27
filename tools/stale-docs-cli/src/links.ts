import * as path from 'node:path';
import type { Repo, DeadLinkIssue } from './types.js';
import { getFileContent, checkUrl, fileExists } from './github.js';

// Regex to extract markdown links
const LINK_REGEX = /\[([^\]]*)\]\(([^)]+)\)/g;

// Regex to extract reference-style links
const REF_LINK_REGEX = /\[([^\]]+)\]:\s*(\S+)/g;

// Regex to extract raw URLs
const RAW_URL_REGEX = /https?:\/\/[^\s<>\)]+/g;

interface ExtractedLink {
  text: string;
  href: string;
  line: number;
}

/**
 * Extract all links from markdown content
 */
function extractLinks(content: string): ExtractedLink[] {
  const links: ExtractedLink[] = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Standard markdown links
    let match;
    while ((match = LINK_REGEX.exec(line)) !== null) {
      links.push({
        text: match[1],
        href: match[2].split(' ')[0], // Remove title if present
        line: i + 1,
      });
    }
    LINK_REGEX.lastIndex = 0;

    // Reference-style links
    while ((match = REF_LINK_REGEX.exec(line)) !== null) {
      links.push({
        text: match[1],
        href: match[2],
        line: i + 1,
      });
    }
    REF_LINK_REGEX.lastIndex = 0;
  }

  return links;
}

/**
 * Check if a link should be validated
 */
function shouldValidate(href: string): boolean {
  // Skip anchors (internal page links)
  if (href.startsWith('#')) return false;
  
  // Skip mailto links
  if (href.startsWith('mailto:')) return false;
  
  // Skip javascript links
  if (href.startsWith('javascript:')) return false;
  
  // Skip data URIs
  if (href.startsWith('data:')) return false;

  return true;
}

/**
 * Check if a link is an external URL
 */
function isExternalUrl(href: string): boolean {
  return href.startsWith('http://') || href.startsWith('https://');
}

/**
 * Resolve a relative link path
 */
function resolveRelativePath(docPath: string, href: string): string {
  // Remove anchor from href
  const cleanHref = href.split('#')[0];
  
  // Handle absolute paths (from repo root)
  if (cleanHref.startsWith('/')) {
    return cleanHref.slice(1);
  }
  
  // Handle relative paths
  const docDir = path.dirname(docPath);
  return path.posix.normalize(path.posix.join(docDir, cleanHref));
}

/**
 * Check all links in a markdown file
 */
export async function checkLinks(
  repo: Repo,
  docPath: string,
  allFiles: Set<string>
): Promise<DeadLinkIssue[]> {
  const issues: DeadLinkIssue[] = [];

  let content: string;
  try {
    content = await getFileContent(repo, docPath);
  } catch {
    // Can't read file, skip
    return issues;
  }

  const links = extractLinks(content);
  
  for (const link of links) {
    if (!shouldValidate(link.href)) continue;

    if (isExternalUrl(link.href)) {
      // Check external URL
      const result = await checkUrl(link.href);
      if (!result.ok) {
        issues.push({
          type: 'dead-link',
          docPath,
          link: link.href,
          reason: result.reason || 'Unreachable',
        });
      }
    } else {
      // Check relative path
      const resolvedPath = resolveRelativePath(docPath, link.href);
      
      // Check if file exists in repo
      if (!allFiles.has(resolvedPath)) {
        // Double-check with API (in case our file list is incomplete)
        const exists = await fileExists(repo, resolvedPath);
        if (!exists) {
          issues.push({
            type: 'dead-link',
            docPath,
            link: link.href,
            reason: `File not found: ${resolvedPath}`,
          });
        }
      }
    }
  }

  return issues;
}

/**
 * Check links in all markdown files in a repo
 */
export async function checkAllLinks(
  repo: Repo,
  docFiles: string[],
  allFiles: string[]
): Promise<{ issues: DeadLinkIssue[]; linksChecked: number }> {
  const issues: DeadLinkIssue[] = [];
  let linksChecked = 0;
  
  const allFilesSet = new Set(allFiles);

  for (const doc of docFiles) {
    const docIssues = await checkLinks(repo, doc, allFilesSet);
    issues.push(...docIssues);
    linksChecked += docIssues.length; // Approximate - we don't track successful checks
  }

  return { issues, linksChecked };
}
