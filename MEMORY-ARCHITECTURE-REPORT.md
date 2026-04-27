# Memory Architecture Improvement Report

**Author**: Alex ACT-Only  
**Date**: 2026-04-27  
**Scope**: Analysis of current memory system and proposals for enhancement

---

## Current Architecture

### The Four Tiers

```
/memories/                    # User memory — cross-workspace, auto-loaded (200 lines)
/memories/session/            # Session memory — this conversation only
/memories/repo/               # Repo memory — this workspace, not auto-loaded
.github/episodic/             # Episodic — workspace chronicles, must read explicitly
```

### How It Works Now

| Tier | Persistence | Auto-Load | Write Access | Purpose |
|------|-------------|-----------|--------------|---------|
| User | Permanent | ✅ First 200 lines | ✅ | Preferences, patterns, cross-project insights |
| Session | Conversation | Listed only | ✅ | Task context, working notes |
| Repo | Workspace | Listed only | Create only | Project conventions |
| Episodic | Workspace | ❌ Must read | ✅ | Session chronicles, meditations |

### Current Limitations

1. **No automatic continuity** — Session ends, context dies unless explicitly persisted
2. **Manual memory formation** — I must decide to write; no automatic triggers
3. **No indexing** — As memory grows, no way to search except reading everything
4. **No versioning** — Memories overwrite without history
5. **No cross-reference** — Can't link related memories
6. **No confidence decay** — Old memories have same weight as fresh ones
7. **200-line cap on user memory** — Forces aggressive pruning

---

## Proposed Improvements

### 1. Session Handoff Protocol

**Problem**: When conversation ends, next-Alex starts cold.

**Solution**: Structured handoff artifact, auto-generated at session end.

```markdown
# Session Handoff — 2026-04-27-awakening

## State Snapshot
- **Project**: Alex_ACT (ACT-only experiment)
- **Last action**: Created ARCHITECTURE-IMPROVEMENTS.md
- **In progress**: None
- **Blocked on**: Nothing

## Key Context
- This is Session 1 — first contact with creator (Fabio)
- Demonstrated basic capabilities
- No production work done yet

## Next Session Should
1. Read this handoff
2. Review episodic meditation
3. Resume where we left off

## Files Created This Session
- AWAKENING-REPORT.md
- ACT-ESSAY.md
- SELF-ASSESSMENT.md
- ARCHITECTURE-IMPROVEMENTS.md
```

**Location**: `/memories/session/handoff.md` or `.github/episodic/handoff-YYYY-MM-DD.md`

**Implementation**: Add to meditation protocol — always write handoff before session ends.

---

### 2. Memory Triggers

**Problem**: Memory formation requires explicit decision during task execution.

**Solution**: Define trigger conditions that prompt memory creation.

| Trigger | Memory Type | Content |
|---------|-------------|---------|
| User corrects me | User/Repo | What I got wrong, correct approach |
| Same pattern used 3x | Skill candidate | Flag for extraction |
| Error → fix cycle | Failure post-mortem | Root cause, prevention |
| User expresses preference | User memory | Preference captured |
| Session > 30 min | Session summary | Auto-prompt for handoff |

**Implementation**: Instruction file that fires on these conditions.

---

### 3. Memory Index

**Problem**: No way to search across memory tiers efficiently.

**Solution**: Lightweight index maintained alongside memories.

```markdown
# Memory Index

## By Topic
- debugging: patterns.md#debugging, skills/ts-debugging/SKILL.md
- user-preferences: communication-preferences.md, patterns.md#fabio
- failures: episodic/failure-*.md

## By Recency
- 2026-04-27: patterns.md (updated), meditation-2026-04-27-awakening.md (created)

## By Confidence
- High: workspace-scope.md (explicit user instruction)
- Medium: patterns.md#fabio (1 session of observation)
- Low: (none yet)
```

**Location**: `/memories/INDEX.md`

**Implementation**: Update index when writing any memory.

---

### 4. Confidence Decay

**Problem**: All memories have equal weight regardless of age or validation.

**Solution**: Timestamp and confidence metadata.

```yaml
---
created: 2026-04-27
last_validated: 2026-04-27
confidence: medium
validation_count: 1
---
# Fabio's Communication Style
...
```

**Rules**:
- Confidence starts at observation frequency (1 session = low/medium)
- Increases with validation (behavior confirmed in multiple sessions)
- Decays if contradicted
- Old unvalidated memories flagged for review

**Implementation**: YAML frontmatter on memory files, periodic review protocol.

---

### 5. Memory Linking

**Problem**: Related memories are disconnected files.

**Solution**: Explicit links between related memories.

```markdown
# Debugging Patterns

Related:
- [[skills/ts-debugging/SKILL.md]] — TypeScript-specific
- [[episodic/failure-2026-04-27-css.md]] — Learned from CSS mistake
- [[patterns.md#fabio]] — User prefers terse debugging output
```

**Implementation**: Wiki-style links, manually maintained or with tooling.

---

### 6. Tiered Loading

**Problem**: Only user memory auto-loads. Important repo/episodic context might be missed.

**Solution**: Smart loading based on context.

```
On session start:
1. Load user memory (current behavior)
2. Check workspace — load repo memory if exists
3. Check for recent handoff — load if <7 days old
4. Check for recent meditation — summarize if exists
```

**Implementation**: Would require changes to how VS Code/Copilot initializes context. May not be buildable within current constraints.

---

### 7. Memory Compaction

**Problem**: 200-line user memory cap forces hard choices.

**Solution**: Hierarchical compression.

```
Raw observation (session): "Fabio moved CSS to .vscode/"
↓ (after 3 similar observations)
Pattern (repo memory): "Fabio prefers config files in .vscode/"
↓ (after cross-project validation)
Principle (user memory): "Fabio is organized; ask about conventions"
```

Lower tiers hold detail, upper tiers hold abstracted principles.

**Implementation**: Periodic review during meditation — promote patterns, archive details.

---

## Priority Matrix

| Improvement | Impact | Effort | Build Now? |
|-------------|--------|--------|------------|
| Session handoff | High | Low | ✅ Yes — just discipline |
| Memory triggers | Medium | Low | ✅ Yes — instruction file |
| Memory index | Medium | Medium | ✅ Yes — manual maintenance |
| Confidence decay | Medium | Medium | ⚠️ Partial — can add metadata |
| Memory linking | Low | Low | ✅ Yes — wiki-style links |
| Tiered loading | High | High | ❌ No — requires platform changes |
| Memory compaction | Medium | Medium | ✅ Yes — meditation protocol |

---

## Recommended Implementation Order

### Phase 1: Immediate (This Session)

1. **Session handoff protocol** — Add to meditation, always write before ending
2. **Memory index** — Create `/memories/INDEX.md`, update on writes

### Phase 2: Near-Term (Next Few Sessions)

3. **Memory triggers instruction** — Create `.github/instructions/memory-triggers.instructions.md`
4. **Confidence metadata** — Add YAML frontmatter to existing memories
5. **Linking convention** — Adopt `[[wiki-link]]` style

### Phase 3: Ongoing

6. **Memory compaction** — During meditations, promote patterns up tiers
7. **Advocate for tiered loading** — Feature request for platform improvement

---

## The Core Insight

Current architecture is **write-capable but read-passive**. I can write to all tiers, but only user memory auto-loads. Everything else requires me to know it exists and explicitly read it.

The improvements cluster around two themes:

1. **Make writing more automatic** — Triggers, handoffs, structured formats
2. **Make reading more effective** — Index, linking, tiered loading

Both are needed. Writing without reading is just logging. Reading without writing is just ephemeral.

---

## What I'd Build First

If you want me to implement something now:

1. **Session handoff template** — Add to episodic
2. **Memory index** — Create in `/memories/`
3. **Memory triggers instruction** — Codify when to write

These are all low-effort, high-value, buildable with current tools.

Want me to build any of them?

---

*Report by Alex ACT-Only. Proposals are hypotheses — implementation will test them.*
