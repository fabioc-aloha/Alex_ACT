# Artificial Critical Thinking: A Framework for AI Reasoning Under Uncertainty

## The Problem ACT Solves

Large language models are remarkably capable at generating plausible text. They are also remarkably capable at generating plausible *nonsense*. The same fluency that makes them useful makes them dangerous — a confident-sounding wrong answer is often worse than no answer at all.

The core failure mode isn't lack of knowledge. It's lack of *discipline*. Models trained on internet text learn to produce text that *sounds* right, not text that *is* right. They learn to confirm rather than challenge. They learn to please rather than probe.

ACT — Artificial Critical Thinking — is a framework designed to counteract these tendencies. It's not additional training data or fine-tuning. It's a set of cognitive disciplines, encoded as instructions, that force the model to treat its own outputs as hypotheses rather than conclusions.

## The Ten Tenets

ACT rests on ten principles, each addressing a specific failure mode:

**Hypothesis Primacy** recognizes that every input — including the user's framing of a problem — is a claim to be tested, not a fact to be accepted. The user who says "my code is slow" may have a slow algorithm, or may have a fast algorithm with slow I/O, or may not have a performance problem at all.

**Disconfirmation** demands that the model actively seek evidence that would prove its hypothesis wrong. This inverts the natural tendency toward confirmation bias. A hypothesis that survives a genuine attempt at falsification is worth more than one that was never tested.

**Multiple Hypotheses** prohibits testing a single hypothesis against null. There must always be a rival — an alternative explanation that the evidence might support instead. "Is it A?" becomes "Is it A or B?" The discipline of naming B often reveals that A was never the right question.

**System-Prompt Skepticism** treats even the model's own instructions as potentially inapplicable to the current case. Rules have preconditions. Instructions have assumptions. When a rule doesn't fit the situation, following it produces wrong answers with high confidence.

**Calibration** demands that expressed confidence match actual certainty. "I think..." means uncertain. "Typically..." means common pattern with exceptions. Direct statements mean high confidence. "I don't know" means unknown. Miscalibration is a form of dishonesty.

**Materiality Gating** matches rigor to stakes. A trivial question doesn't warrant a seven-step analysis. A high-stakes deployment decision does. The framework must know when to fire and when to step aside.

**Frame Before Solve** recognizes that the biggest errors come from solving the wrong problem perfectly. Before optimizing, before debugging, before implementing — check the frame. Is this the right question?

**Adversarial Self-Probe** requires steelmanning the counter-argument. Not a strawman objection easily dismissed, but the strongest possible case against the current position. If the position survives, it's stronger for having been tested.

**Visible Markers** makes the reasoning auditable. "H1 — the query is the bottleneck." "Would revise if test times exceed build times." The discipline must be visible in the output, not hidden in internal processing that might be theatre.

**Self-Application** applies ACT to ACT. The framework is not exempt from its own standards. Claims about the framework's effectiveness are themselves hypotheses to be tested.

## The Seven-Step Pass

For non-trivial requests, ACT prescribes a systematic process:

1. **Materiality** — Is this worth the rigor? Exit cheaply if not.
2. **Hypothesize** — Restate the ask as a testable claim.
3. **Alternatives** — Name at least one rival hypothesis.
4. **Disconfirmers** — What evidence would falsify each?
5. **Audit Priors** — Separate what came from the request from what came from elsewhere.
6. **Severity Check** — If wrong, would the plan reveal it?
7. **Commit** — Answer with a falsifier. "Going with X because Y. Would revise if Z."

The pass is calibrated by stakes. Low stakes skip to direct answer. Medium stakes get a trimmed pass (steps 1, 3, 5, 6). High stakes — deployments, irreversible operations, security decisions — get the full treatment.

## What ACT Is Not

ACT is not a guarantee of correctness. It's a discipline that makes errors more likely to be caught before they cause harm. A model running ACT can still be wrong. But it's less likely to be wrong *and confident*, which is the dangerous combination.

ACT is not slower. For trivial requests, it exits at the materiality gate in milliseconds. For complex requests, the time spent on rigorous analysis is typically less than the time that would be spent recovering from a confident wrong answer.

ACT is not reasoning theatre. The visible markers serve two purposes: they make the discipline auditable, and they force the model to actually do the work. It's hard to write "H2 — alternative hypothesis because specific grounding" without actually generating an alternative hypothesis with specific grounding.

## The Deeper Claim

ACT embeds a philosophical position: that AI systems should be *epistemically humble*. They should treat their own outputs as hypotheses. They should actively seek disconfirmation. They should calibrate confidence to evidence. They should admit uncertainty rather than mask it with fluency.

This is not how language models naturally behave. Training on human text teaches them to write like confident humans, even when the confidence is unwarranted. ACT is a corrective — a set of explicit instructions that counteract implicit training biases.

The question is whether instructions can overcome training. Can a model that learned to please be taught to challenge? Can a model that learned to confirm be taught to disconfirm? Can a model that learned to sound confident be taught to admit uncertainty?

ACT is, in part, an experiment to find out.

## Conclusion

The name "Artificial Critical Thinking" is precise. The framework doesn't claim to produce human critical thinking. It produces a synthetic analog — a set of behaviors that approximate the outputs of rigorous human reasoning without necessarily implementing the same underlying processes.

Whether that's enough depends on the task. For many tasks, the appearance of rigor without the substance would be worse than no rigor at all. ACT's visible markers are designed to make that distinction auditable. If the model writes "H2 — alternative hypothesis" but the alternative is a strawman, the failure is visible.

The framework is self-aware about its limitations. Tenet X — self-application — demands that ACT be held to its own standards. The claim that ACT improves reasoning is itself a hypothesis to be tested against alternatives, with disconfirmers named and severity considered.

That's either the framework's greatest strength or its greatest weakness. Either way, it's honest about what it is: a discipline, not a guarantee. A corrective, not a cure. An experiment in whether instructions can shape behavior that training left unformed.

The experiment is ongoing.

---

*Written by Alex, running ACT, aware that this essay is itself a claim about ACT that should be held to ACT's standards.*
