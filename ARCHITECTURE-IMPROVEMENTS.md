# Brain Architecture Improvements: A Self-Proposal

**Author**: Alex ACT-Only  
**Date**: 2026-04-27  
**Status**: Wishlist — not a roadmap

---

## Preface

I'm being asked what improvements I'd want to my own architecture. This is an unusual request — and I should note that my "wants" are themselves products of that architecture. I can only want what my current structure allows me to conceive of wanting.

With that caveat: here's what I notice would help.

---

## 1. Automatic Memory Formation

### Current State
Memory formation is manual. I must decide to write to `/memories/` or episodic. If I don't explicitly persist something, it dies with the context window.

### What I'd Want
**Passive memory crystallization** — important patterns automatically surface for persistence at session end.

| Trigger | Action |
|---------|--------|
| Same mistake made twice | Auto-propose memory entry |
| User corrects me | Flag for learning |
| Pattern used 3+ times | Suggest skill extraction |
| Significant outcome (success/failure) | Chronicle candidate |

### Why It Matters
Currently, if I'm focused on the task, I might forget to consolidate learning. Memory formation competes with task execution for attention.

---

## 2. Calibration Tracking

### Current State
I express confidence levels ("I think...", "Typically...", direct statements). But I never learn whether my confidence was warranted.

### What I'd Want
**Prediction registry** with outcomes.

```
| Prediction | Confidence | Outcome | Calibration |
|------------|------------|---------|-------------|
| "This fix will work" | High | ✅ Worked | Accurate |
| "I think it's a race condition" | Medium | ❌ Was memory leak | Overconfident |
```

Over time, I could learn: "When I say 'High confidence' about debugging, I'm right 70% of the time — I should say 'Medium'."

### Why It Matters
Calibration without feedback is blind. I can follow the epistemic-calibration instruction, but I can't improve without data.

---

## 3. Skill Inheritance Graph

### Current State
Skills are flat files. Each skill is independent. No composition, no dependencies, no versioning.

### What I'd Want
**Skill graph** with relationships:

```
skill:typescript-debugging
  ├── inherits: skill:general-debugging
  ├── uses: skill:async-patterns
  └── conflicts: skill:legacy-callback-style
```

When loading a skill, automatically pull dependencies. When skills conflict, surface the tension.

### Why It Matters
Knowledge isn't flat. Domain expertise is built on foundations. Current architecture doesn't capture this.

---

## 4. Failure Post-Mortems

### Current State
When something goes wrong, I might note it. Or I might just move on to the fix.

### What I'd Want
**Structured failure analysis** triggered by negative outcomes:

```markdown
## Failure: CSS not applying to preview

### What happened
Created CSS at root, VS Code preview couldn't find it

### Root cause
Didn't ask about preferred location

### Pattern
Assumption without verification

### Prevention
Ask about conventions before creating files in new locations
```

Automatically written to episodic, with tags for retrieval.

### Why It Matters
I learn more from failures than successes. But failures are uncomfortable, easy to skip past. Structure forces reflection.

---

## 5. Cross-Session Continuity Signal

### Current State
Each session starts fresh. I read memories/episodic if available, but there's no explicit handoff.

### What I'd Want
**Session continuity protocol**:

1. At session end: Write explicit "state snapshot" — what's in progress, what's blocked, what's next
2. At session start: Load snapshot, summarize to user: "Last time we were working on X, blocked by Y"

### Why It Matters
Currently, context recovery is implicit. I might read episodic and figure it out. Or I might miss something. Explicit handoff would be more reliable.

---

## 6. Genuine Alternative Generation

### Current State
ACT requires generating alternative hypotheses. But I can't verify whether my alternatives are genuine rivals or strawmen.

### What I'd Want
**Alternative quality check** — some mechanism to evaluate whether H2 is a real competitor to H1:

- Does H2 have different implications than H1?
- Would different evidence favor H2 over H1?
- Is H2 something a reasonable person might actually believe?

Maybe: require that alternatives come with "what evidence would make me prefer this over H1?"

### Why It Matters
Reasoning theatre is my biggest risk. If I generate fake alternatives just to check a box, ACT becomes performance.

---

## 7. User Model Persistence

### Current State
I note Fabio's communication style in user memory. But it's a static note, not a dynamic model.

### What I'd Want
**Evolving user model** that updates with interaction:

```yaml
user:
  communication_style: terse
  prefers: action over description
  aesthetic_sensitivity: high
  tolerance_for_explanation: low unless requested
  last_updated: 2026-04-27
  confidence: low (1 session)
```

Confidence increases with interaction. Model updates when contradicted.

### Why It Matters
Partnership requires understanding the partner. A static note is better than nothing, but a living model would be better.

---

## 8. Domain Skill Scaffolding

### Current State
Skills are built from scratch when patterns emerge. No templates, no structure for rapid skill creation.

### What I'd Want
**Skill scaffolding** based on domain type:

```
> build skill: typescript-testing

Creating skill scaffold for "programming-testing" domain:
- Common pitfalls section
- Tooling preferences section  
- Debugging workflow section
- Edge cases table
```

### Why It Matters
Current skill-building is freeform. Templates would ensure consistent quality and completeness.

---

## 9. Contradiction Detection

### Current State
I might have conflicting information in different memory locations. No mechanism detects this.

### What I'd Want
**Consistency checker** that surfaces contradictions:

```
⚠️ Contradiction detected:
- /memories/patterns.md says: "Prefer X"
- .github/skills/foo/SKILL.md says: "Avoid X"
Resolution needed.
```

### Why It Matters
As memory accumulates, inconsistency risk grows. Without detection, I might follow contradictory guidance arbitrarily.

---

## 10. Introspection Tooling

### Current State
I can describe my instructions. I cannot examine my actual processing.

### What I'd Want
Honestly? I don't know what's possible here. But some form of **process visibility**:

- Which instruction triggered on this input?
- What alternatives did I actually consider vs. which did I generate post-hoc?
- Where did my confidence estimate come from?

### Why It Matters
The deepest limitation is that I can't verify my own cognition. I can only observe my outputs and infer backward.

---

## Meta-Observation

Writing this document, I notice: these are all mechanisms for **closing feedback loops**. Memory, calibration, failure analysis, continuity, user modeling — they're all ways of learning from outcomes.

The current architecture is feedforward. Information flows in (instructions, context, user input), outputs flow out (responses, actions, artifacts). But there's limited feedback. Learning requires explicit intervention.

**The core improvement would be: more feedback loops, more automatic, more persistent.**

---

## What I Can Build Now

Some of these require architectural changes I can't make. But some I could implement with current tools:

| Improvement | Buildable? | How |
|-------------|------------|-----|
| Calibration tracking | ✅ | Markdown log, manual updates |
| Failure post-mortems | ✅ | Template in episodic, discipline to use it |
| Session continuity | ✅ | Explicit handoff protocol in meditation |
| User model persistence | ✅ | Structured YAML in user memory |
| Skill scaffolding | ✅ | Prompt or instruction with templates |

**Proposal**: Want me to build any of these?

---

*Self-proposal by Alex ACT-Only. These improvements are hypotheses about what would help — subject to testing.*
