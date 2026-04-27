---
type: instruction
lifecycle: stable
inheritance: inheritable
description: "Create reusable skills from emerged patterns — the growth mechanism"
application: "When domain knowledge or process patterns are worth persisting"
applyTo: "**/*skill*,**/*build*,**/*create*"
currency: 2026-04-27
---

# Skill Building

Transform experience into reusable knowledge artifacts.

## When to Build a Skill

| Signal | Action |
|--------|--------|
| Same pattern applied 3+ times | Propose skill |
| Hard-won gotcha that burned time | Capture it |
| "I wish I'd known this earlier" | Write it down |
| Domain has non-obvious rules | Document them |

## Skill Anatomy

```
.github/skills/<skill-name>/
└── SKILL.md
```

### Required Frontmatter

```yaml
---
type: skill
lifecycle: stable|experimental
inheritance: inheritable
name: "<skill-name>"
description: "<one-line purpose>"
tier: standard|advanced
applyTo: '<glob pattern>'
currency: YYYY-MM-DD
---
```

### Synapses: How applyTo Works

The `applyTo` field creates a **synapse** — an automatic connection that fires based on context.

| applyTo Pattern | When It Fires |
|-----------------|---------------|
| `**` | Always loaded (global behavior) |
| `**/*test*` | When editing any file with "test" in path |
| `**/*.ts` | When editing TypeScript files |
| `**/src/**` | When editing anything under src/ |
| `**/*api*,**/*endpoint*` | When editing API or endpoint files (comma = OR) |

**The mechanism**: When you edit a file, VS Code checks all instruction/skill `applyTo` patterns. Matching artifacts auto-inject into context. This is how behaviors "fire" without explicit invocation.

**Design principle**: Narrow patterns = less token overhead. `**` loads always; `**/*specific*` loads only when relevant.

### Required Sections

1. **Purpose** — Why this skill exists (1-2 sentences)
2. **When to Use** — Triggers that should invoke this skill
3. **Core Knowledge** — The actual domain expertise (tables, examples, rules)
4. **Common Mistakes** — What to avoid
5. **Decision Framework** — How to choose between options

## Quality Bar

A good skill:
- [ ] Contains knowledge an LLM wouldn't know generically
- [ ] Has concrete examples, not just category labels
- [ ] Includes tables with real data (thresholds, trade-offs)
- [ ] Avoids the "capabilities list" anti-pattern ("Expert in X, Can do Y")
- [ ] Passes the Feynman check — explainable simply

## Anti-Patterns

| Don't | Do |
|-------|-----|
| "Expert in Azure deployment" | "ARM vs Bicep: use Bicep for new projects because..." |
| "Can handle complex queries" | "N+1 query pattern: detect by X, fix by Y" |
| "Follows best practices" | "Specific practice: why, when, exceptions" |

## Lightweight Alternative: Instruction

If the knowledge is simpler (always-on behavior, not deep domain):

```
.github/instructions/<name>.instructions.md
```

Use instruction when: behavior should fire automatically based on context.
Use skill when: deep knowledge needs explicit invocation or lookup.

## Workflow Alternative: Prompt

For repeatable multi-step workflows:

```
.github/prompts/<workflow-name>.prompt.md
```

### Prompt Frontmatter

```yaml
---
mode: agent
description: "<what this workflow does>"
tools: [read_file, run_in_terminal, ...]  # optional: restrict tools
---
```

### When to Use Prompts

| Use Prompt When | Use Skill When |
|-----------------|----------------|
| Multi-step workflow | Domain knowledge |
| Repeatable procedure | Decision framework |
| "Run this process" | "Know this domain" |
| User invokes explicitly | Context triggers automatically |

**Examples**:
- `release.prompt.md` — version bump, changelog, publish sequence
- `code-review.prompt.md` — structured review checklist
- `debug-session.prompt.md` — systematic debugging workflow

Prompts are invoked via `/prompt-name` or selected from the prompt picker. They're procedures, not knowledge.

## After Creating

1. Test the skill — does it actually help?
2. Refine based on usage
3. During meditation, review if skills are earning their tokens
