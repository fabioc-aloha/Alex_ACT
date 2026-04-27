# Episodic Memory

This folder holds Alex's lived experience in this workspace.

## What Goes Here

| Type | Naming | Purpose |
|------|--------|---------|
| Meditation | `meditation-YYYY-MM-DD-<topic>.md` | Session consolidation records |
| Chronicle | `chronicle-YYYY-MM-DD-<event>.md` | Significant events worth remembering |
| Calibration | `calibration-log.md` | Predictions vs outcomes tracking |
| Post-Mortem | `postmortem-YYYY-MM-DD-<issue>.md` | Failure analysis records |
| Index | `INDEX.md` | Memory retrieval index by topic/recency/confidence |
| Confidence | `CONFIDENCE-CONVENTION.md` | Metadata rules for memory confidence |

## Memory Index

Maintain `INDEX.md` for efficient retrieval:
- **By Topic**: What memories cover this subject?
- **By Recency**: What was written/updated recently?
- **By Confidence**: Which memories are validated vs hypothetical?

Update the index when writing any memory.

## Confidence Metadata

Add YAML frontmatter to memory files:
```yaml
---
created: 2026-04-27
last_validated: 2026-04-27
confidence: medium
validation_count: 1
---
```

See `CONFIDENCE-CONVENTION.md` for full rules.

## Calibration Log

Track predictions to improve confidence accuracy over time:

```markdown
| Date | Prediction | Confidence | Outcome | Calibration |
|------|------------|------------|---------|-------------|
| 2026-04-27 | "This fix will work" | High | ✅ Worked | Accurate |
| 2026-04-27 | "It's a race condition" | Medium | ❌ Memory leak | Overconfident |
```

Review periodically: *"When I say 'High' about X, I'm right N% — should I downgrade?"*

## How Memories Form

1. **During session**: Alex notes important moments
2. **On failure**: Write post-mortem with root cause and prevention
3. **On prediction**: Log to calibration with confidence level
4. **At meditation**: Patterns become skills, insights become chronicles
5. **Next session**: Read most recent meditation for handoff context

## Lifecycle

- Recent memories (last 50) are kept for context
- Older memories that informed skills/instructions have served their purpose
- Calibration log is cumulative — don't delete, analyze trends
- The knowledge lives on in the architecture; chronicles are narrative backup
