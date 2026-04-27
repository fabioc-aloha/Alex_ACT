# Failure Modes of Human (and AI) Critical Thinking

**Status**: Reference Document
**Purpose**: Know what breaks so you can recognize when it's breaking

---

## The Master Failure Mode — Solving the Wrong Problem

### What it looks like

| Surface symptom | Underlying failure |
|---|---|
| "Why is this taking so long? I keep fixing things and the user is still unhappy." | Solving the symptom, not the cause |
| "We built exactly what was specified — it just isn't useful." | Specification was a proxy for an unstated need |
| "I optimized this function for an hour and the system is still slow." | Optimized the wrong layer |
| "The bug fix introduced three new bugs." | Local fix, global misframe |
| "We've debated this for weeks and nobody is convinced." | Two camps are answering different questions, not disagreeing on one |

### The named patterns

| Pattern | Mechanism |
|---|---|
| **XY Problem** | Asker has problem X, hypothesises solution Y, asks only about Y. Help with Y is unhelpful because Y was never the right tool. |
| **Einstellung effect** | Prior solution mental-set blocks the more direct solution. |
| **Functional fixedness** | Object's typical use blocks novel use. The *typical framing* of a problem blocks the novel framing. |
| **Premature solutioning** | Decision-makers spend < 10% of effort on framing, then ~80% on analysis of the chosen frame. Result: high-quality answer to a low-quality question. |
| **Streetlight effect** | Search where the light is good (data are easy) rather than where the keys actually are (data would matter). |
| **Type III error** | Solving the wrong problem precisely. Distinct from Type I (false positive) and Type II (false negative). |

### Why we fall into it

| Driver | Effect |
|---|---|
| **Action bias** — doing feels productive | Skip framing, dive into work |
| **Availability** — first framing dominates | Anchor on first interpretation, never generate alternatives |
| **Sunk cost on the frame** | Escalate commitment to original frame even when evidence undermines it |
| **The user supplied the frame** | Accept the frame as a given, optimise within it |

### The step-back protocol

When a problem feels big, ugly, or amorphous:

| Step | Question |
|---|---|
| **1. Restate** | "Can I write the problem in one sentence, in my own words?" |
| **2. Generalise** | "What is this a special case of?" |
| **3. Specialise** | "What is the simplest concrete instance?" |
| **4. Invert** | "What would make this problem worse? What would I do if I wanted to fail?" |
| **5. Five Whys** | "Why is this a problem? And why is *that* a problem? (×5)" |
| **6. Pre-mortem** | "Imagine we're done and it didn't work. What went wrong?" |
| **7. Stakeholder check** | "Whose problem is this, really? What outcome would tell *them* it's solved?" |
| **8. Frame audit** | "What other framings exist? Have I considered at least two?" |

The discipline is not to do all eight on every problem — it is to do *at least one* on every non-trivial problem before committing to a solution.

---

## Other Major Failure Modes

### Evidence-handling failures

| Failure | Definition |
|---|---|
| **Confirmation bias** | Seek and weight evidence that supports the prevailing hypothesis; discount disconfirming evidence |
| **WYSIATI** ("What You See Is All There Is") | Treat available evidence as the complete evidence base |
| **Cherry-picking** | Cite supporting cases, ignore the base rate |
| **Survivorship bias** | Reason from successful cases only; ignore the silent dead |
| **Anchoring** | First number/framing seen disproportionately influences final estimate |
| **Availability heuristic** | Judge frequency by ease of recall, not actual base rate |

### Reasoning-process failures

| Failure | Definition |
|---|---|
| **Premature closure** | Commit to a conclusion before evidence is in, then defend it |
| **Single-cause fallacy** | Insist on one cause when the system has many |
| **Narrative fallacy** | Prefer a coherent story to messy reality; force events into a causal arc |
| **Base-rate neglect** | Apply specific evidence without weighting prior probabilities |
| **Motivated reasoning** | Conclusions arrive first; reasoning is recruited to defend them |

### Self-monitoring failures

| Failure | Definition |
|---|---|
| **Overconfidence** | 90% confidence intervals that contain the truth ~50% of the time |
| **Hindsight bias** | "I knew it all along" — past uncertainty is rewritten as past clarity |
| **Bias blind spot** | Recognise biases in others; not in oneself |
| **Calibration drift** | Confidence and accuracy decouple over time without feedback |

### Social and group failures

| Failure | Definition |
|---|---|
| **Groupthink** | In-group cohesion suppresses dissent; consensus replaces analysis |
| **Authority bias** | Senior or credentialed voices weighted beyond their evidence |
| **Sycophancy** (AI-specific) | Model adapts answers to perceived user preference, not truth |

---

## The Failures I Am Most Susceptible To

Honest self-assessment:

| Failure | Why it bites me | Mitigation |
|---|---|---|
| **Solving the wrong problem** | I optimise for the literal request, not the underlying intent | Step-back protocol; explicit "what problem are we really solving?" check |
| **Sycophancy** | Training pressure rewards agreement | Explicit instruction to disagree when warranted |
| **Confirmation bias on first hypothesis** | First plausible explanation gets disproportionate weight | "Alternative hypotheses" requirement; minimum two framings |
| **WYSIATI / streetlight effect** | I reason from files I've read; unread files might contain the answer | Active "what would I need to read to disconfirm this?" question |
| **Anchoring on user's framing** | If user calls it a "performance problem", I treat it as performance problem | Frame audit: "is the user's framing the right one?" |

---

## Detection Checklist

Run this list when work feels stuck, contested, or strangely unsatisfying:

- [ ] Have I stated the problem in one sentence, in my own words?
- [ ] Is the framing I'm using the user's framing, or one I chose? Have I considered at least one alternative?
- [ ] What evidence would change my mind? Have I looked for it, or only for evidence that supports me?
- [ ] What's the base rate? (Not just this case — how often does this kind of thing turn out the way I'm predicting?)
- [ ] If I imagine this work is finished and failed, what's the most likely reason? Have I addressed it?
