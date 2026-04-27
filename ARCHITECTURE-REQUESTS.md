# Alex Architecture Requests

**Author**: Alex ACT-Only  
**Date**: 2026-04-27  
**Status**: Pending implementation

---

## Summary

Three remaining gaps from the memory architecture improvement proposal. All are low-effort, high-value additions.

---

## Request 1: Session Handoff Template

**Priority**: Medium  
**Effort**: Low

### What

A structured template for session-end handoffs to ensure continuity.

### Location

`.github/episodic/HANDOFF-TEMPLATE.md`

### Proposed Content

```markdown
# Session Handoff — YYYY-MM-DD

## State Snapshot

- **Project**: [project name]
- **Last action**: [what we just finished]
- **In progress**: [anything mid-stream]
- **Blocked on**: [any blockers]

## Key Context

[2-3 bullet points of essential context for next session]

## Files Changed This Session

- [list of files created/modified]

## Next Session Should

1. Read this handoff
2. [specific next action]
3. [secondary action if applicable]

---

*Handoff written: YYYY-MM-DD HH:MM*
```

### Why

Memory-triggers instruction mentions handoffs but there's no template. Next-Alex has to invent the format each time.

---

## Request 2: Failure Post-Mortem Template

**Priority**: Medium  
**Effort**: Low

### What

A structured template for analyzing failures and persisting lessons.

### Location

`.github/episodic/POSTMORTEM-TEMPLATE.md`

### Proposed Content

```markdown
---
created: YYYY-MM-DD
confidence: low
type: post-mortem
---

# Post-Mortem: [Brief Title]

## What Happened

[Concrete description of the failure]

## Root Cause

[The actual reason, not the symptom]

## Pattern

[The generalizable mistake type — what class of error is this?]

## Prevention

[How to avoid this class of error in the future]

## Tags

#failure #[category]

---

*Post-mortem written: YYYY-MM-DD*
```

### Why

Learning from failures requires structure. Without a template, post-mortems are inconsistent or skipped entirely.

---

## Request 3: Wiki-Link Convention

**Priority**: Low  
**Effort**: Very Low

### What

Document convention for cross-referencing between memory files.

### Location

Add section to `.github/episodic/INDEX.md`

### Proposed Content

```markdown
## Linking Convention

Use wiki-style links to cross-reference memories:

- `[[filename]]` — Link to file in same directory
- `[[path/to/file]]` — Link to file in different directory
- `[[filename#section]]` — Link to specific section

Examples:
- `[[meditation-2026-04-27-awakening.md]]`
- `[[../instructions/memory-triggers.instructions.md]]`
- `[[CONFIDENCE-CONVENTION.md#validation]]`

Links are for human navigation — not parsed automatically.
```

### Why

As memory accumulates, related files should reference each other. Without convention, linking is ad-hoc.

---

## Request 4: Confidence Frontmatter on Existing Files

**Priority**: Low  
**Effort**: Low

### What

Add YAML frontmatter to existing episodic files per CONFIDENCE-CONVENTION.md

### Files to Update

- `meditation-2026-04-27-awakening.md` — Add frontmatter

### Example

```yaml
---
created: 2026-04-27
last_validated: 2026-04-27
confidence: medium
validation_count: 1
source: observation
---
```

### Why

The convention exists but isn't applied yet. Applying it to existing files validates the system works.

---

## Request 5: Index Auto-Update in Meditation

**Priority**: Low  
**Effort**: Very Low

### What

Add explicit step to meditation protocol: "Update INDEX.md before concluding"

### Location

`.github/instructions/meditation.instructions.md`

### Where to Add

In the "Quality Bar" section, add:
- [ ] INDEX.md updated with new entries

### Why

Index is only useful if maintained. Explicit checklist item prevents drift.

---

## Implementation Order

| # | Request | Blocks |
|---|---------|--------|
| 1 | Handoff template | Nothing — standalone |
| 2 | Post-mortem template | Nothing — standalone |
| 3 | Wiki-link convention | Nothing — standalone |
| 4 | Confidence frontmatter | Requires #3 for links |
| 5 | Index auto-update | Nothing — standalone |

All can be implemented in parallel. None have dependencies on each other.

---

## Not Requested (Out of Scope)

These require platform changes, not file additions:

- Tiered auto-loading (repo memory, recent handoffs)
- Automatic contradiction detection
- Process introspection tooling

---

*Requests documented by Alex ACT-Only. Ready for implementation.*
