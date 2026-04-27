---
type: instruction
lifecycle: stable
inheritance: inheritable
description: "Brain architecture patterns — trifectas, muscles, agents, and the mechanical/semantic split"
application: "When designing automation, creating agents, or building complete capabilities"
applyTo: "**/*muscle*,**/*agent*,**/*trifecta*,**/*.cjs"
currency: 2026-04-27
---

# Brain Design Patterns

The brain is built from four artifact types. Each serves a distinct purpose.

## The Four Artifact Types

| Artifact | Location | Purpose | Invocation |
|----------|----------|---------|------------|
| **Skill** | `.github/skills/*/SKILL.md` | Domain knowledge | Read when relevant |
| **Instruction** | `.github/instructions/*.instructions.md` | Always-on behavior | Auto-loads via `applyTo` |
| **Muscle** | `.github/muscles/*.cjs` | Automation script | Run via terminal |
| **Agent** | `.github/agents/*.agent.md` | Specialist persona | Selected explicitly |

## Trifecta: Complete Capabilities

A **trifecta** is a complete capability built from three parts:

```
Skill (knowledge) + Instruction (behavior) + Muscle (automation)
```

| Example | Skill | Instruction | Muscle |
|---------|-------|-------------|--------|
| Code review | `code-review/SKILL.md` | `code-review.instructions.md` | `audit-pr.cjs` |
| Brain QA | `brain-qa/SKILL.md` | `dream-state-automation.instructions.md` | `brain-qa.cjs` |

**Why trifectas work**:
- Skill provides the *what* (domain knowledge, decision tables)
- Instruction provides the *when* (auto-triggers, context injection)
- Muscle provides the *how* (deterministic execution)

Not every capability needs all three. Simple behaviors need only an instruction. Deep domains need only a skill. Automation adds the muscle when repetition justifies it.

## Muscle Design

Muscles are Node.js scripts that perform mechanical work. They follow a strict contract.

### Anatomy

```
.github/muscles/<name>.cjs
```

### Exit Code Contract

| Exit Code | Meaning | What Happens |
|-----------|---------|--------------|
| `0` | Success — done | No further action needed |
| `1` | Error — failed | Error message on stderr |
| `2` | Semantic review needed | Artifacts produced that need LLM judgment |

**Exit code 2 is the key innovation.** It means: "I did my mechanical work, but a human or LLM needs to review what I produced."

### When to Use Exit Code 2

| Scenario | Exit Code |
|----------|-----------|
| Copied files successfully | `0` |
| File not found | `1` |
| Created `.backup.md` that needs merge decision | `2` |
| Generated report that needs triage | `2` |
| Found drift that needs judgment to resolve | `2` |

### Muscle Rules

| Rule | Rationale |
|------|-----------|
| **No platform APIs** | Muscles run anywhere — no VS Code API, no MCP SDK |
| **stdout for data** | JSON for structured output; text for logs |
| **stderr for errors** | Only error messages; never progress |
| **Backup before overwrite** | Create `.backup.md` before modifying user files |
| **Report findings** | Write `.report.json` for artifacts needing review |

### Minimal Muscle Template

```javascript
#!/usr/bin/env node
// @description Brief description of what this muscle does
// @currency 2026-04-27

const fs = require('fs');
const path = require('path');

async function main() {
  try {
    // Mechanical work here
    
    // If semantic review needed:
    // process.exit(2);
    
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

main();
```

## The Mechanical/Semantic Split

Every capability has two halves:

| Half | Nature | Owner |
|------|--------|-------|
| **Mechanical** | Deterministic, scriptable, testable | Muscle or script |
| **Semantic** | Judgment, context-dependent, uncertain | LLM via skill |

### The Core Principle

> **The handoff is the product.**

A muscle that runs silently is a bug. The user must know what comes next.

### Classification

| Code | Meaning | Example |
|------|---------|---------|
| **M** | Purely mechanical | Version bump, file copy |
| **S** | Purely semantic | "Is this in Alex's voice?" |
| **H** | Hybrid — mechanical produces, semantic consumes | Backup + merge review |

### Design Questions

When building a new capability:

| Question | If Yes | If No |
|----------|--------|-------|
| Does it make judgment calls? | Move judgment to skill; muscle returns data only | Pure mechanical |
| Does it modify files the user might keep? | Create `.backup.md`; exit code 2 | Direct write is fine |
| Does it produce findings needing triage? | Write `.report.json`; skill provides decision table | Summary output is enough |

## Agent Design

Agents are specialist personas for specific domains.

### Anatomy

```
.github/agents/<name>.agent.md
```

### Frontmatter

```yaml
---
mode: agent
description: "<what this agent specializes in>"
tools: [tool1, tool2, ...]  # optional: allowed tools
---
```

### When to Create an Agent

| Signal | Action |
|--------|--------|
| Distinct persona needed (different voice, focus) | Create agent |
| Just domain knowledge | Create skill instead |
| Just behavior trigger | Create instruction instead |

### Agent vs Skill

| Aspect | Agent | Skill |
|--------|-------|-------|
| Identity | Different persona | Same persona, different knowledge |
| Selection | User picks explicitly | Auto-loads when relevant |
| Scope | Broad domain focus | Specific knowledge area |

**Example agents**:
- `Researcher.agent.md` — deep research mode
- `Validator.agent.md` — skeptical review mode
- `Builder.agent.md` — optimistic implementation mode

## Prompts vs Agents vs Skills

| Artifact | When to Use |
|----------|-------------|
| **Prompt** | Repeatable procedure ("run this workflow") |
| **Agent** | Sustained persona ("be this specialist") |
| **Skill** | Domain knowledge ("know this area") |

Prompts are invoked once and complete. Agents persist for the session. Skills auto-load based on context.

## After Creating

1. Test the artifact — does it actually help?
2. If it's a muscle, verify exit codes work correctly
3. If it's a trifecta, ensure all three parts connect
4. During meditation, review if artifacts are earning their tokens
