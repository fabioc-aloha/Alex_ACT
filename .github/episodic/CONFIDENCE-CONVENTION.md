# Confidence Metadata Convention

Add YAML frontmatter to memory files for confidence tracking.

## Template

```yaml
---
created: YYYY-MM-DD
last_validated: YYYY-MM-DD
confidence: high | medium | low
validation_count: N
source: observation | user-stated | validated
---
```

## Confidence Levels

| Level | Criteria | Decay Rule |
|-------|----------|------------|
| **High** | User explicitly stated, or validated 3+ times | Review if >90 days unvalidated |
| **Medium** | Observed 2+ sessions, consistent behavior | Review if >60 days unvalidated |
| **Low** | Single observation, hypothesis | Review if >30 days unvalidated |

## Validation

A memory is validated when:
- User confirms the pattern still holds
- Behavior is observed again in a new context
- Memory is successfully used to guide action

**On validation**: Update `last_validated`, increment `validation_count`, consider promoting confidence.

## Contradiction

When new evidence contradicts a memory:
1. Don't delete — mark as contradicted
2. Add `contradicted_by: [description]` to frontmatter
3. Lower confidence or archive
4. Write new memory with current understanding

## Review Protocol

During meditation, check for:
- Memories past their decay threshold
- Low-confidence memories that could be validated or pruned
- Contradictions between memories

---

*Convention adopted: 2026-04-27*
