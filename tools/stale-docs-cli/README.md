# stale-docs-cli

Audit your GitHub repositories for stale documentation.

## Features

- **Proximity staleness detection**: Flags documentation files that haven't been updated when related code changes
- **Dead link checking**: Validates both internal and external links in markdown files
- **Uses GitHub CLI**: Authenticates via `gh auth` - no API tokens to manage

## Prerequisites

- Node.js 18+
- GitHub CLI (`gh`) installed and authenticated

```bash
# Install gh CLI: https://cli.github.com/
gh auth login
```

## Installation

```bash
npm install
npm run build
```

## Usage

```bash
# Audit all your repos
npm start

# Or after building:
node dist/index.js audit

# With options
node dist/index.js audit --stale-days 14 --no-links --verbose

# JSON output for CI
node dist/index.js audit --json
```

## Options

| Option | Default | Description |
|--------|---------|-------------|
| `-d, --stale-days <days>` | 30 | Days threshold for staleness |
| `--no-links` | false | Skip dead link checking |
| `--no-staleness` | false | Skip staleness checking |
| `--include-archived` | false | Include archived repositories |
| `-c, --concurrency <n>` | 3 | Repos to audit in parallel |
| `-v, --verbose` | false | Show detailed progress |
| `--json` | false | Output as JSON |

## How Staleness Detection Works

Documentation is considered stale when:

1. **README.md** hasn't been updated but code in the same directory (or `src/`, `lib/`) has changed
2. **docs/feature.md** hasn't been updated but `src/feature.*` or `lib/feature.*` has changed
3. **CHANGELOG.md** hasn't been updated but `package.json`, `Cargo.toml`, etc. has changed

The default threshold is 30 days - if code changed 30+ days after the last doc update, it's flagged.

## Exit Codes

- `0`: All documentation is up to date
- `1`: Issues found (stale docs or dead links)

## Example Output

```
═══════════════════════════════════════════════════════════
                    STALE DOCS AUDIT REPORT
═══════════════════════════════════════════════════════════

Summary
─────────────────────────────────────────────────────────────
  Repos scanned:     42
  Repos with issues: 3
  Total issues:      5
    Stale docs:      3
    Dead links:      2

Issues by Repository
─────────────────────────────────────────────────────────────

user/awesome-project
  https://github.com/user/awesome-project

  Stale Documentation (1)
  ⚠ README.md
    Last updated: 3 months ago
    Code changed: src/index.ts (2 weeks ago)
    Behind by: 75 days

  Dead Links (1)
  ✗ docs/api.md
    Dead link: https://old-api.example.com/docs
    Reason: HTTP 404
```

## License

MIT
