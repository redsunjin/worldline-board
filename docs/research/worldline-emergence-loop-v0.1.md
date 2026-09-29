# Worldline Emergence Loop v0.1

Status: Research branch only  
Branch: `research/emergence-loop-v0-1`  
Baseline: `main@b417daebaec23be555b423bc71c9d936ee3dee0a`

## 0. Separation rule

This research must remain separate from the current normal-distribution / sigma-based Board work.

Do not mix this document into the implementation sequence in `docs/00-current-status-and-plan.md`.

The current Board track continues to focus on:

- Galton Board as a visual metaphor;
- supplied deviation / μ / σ;
- visual motion separated from semantic trace;
- trace-supplied worldlines;
- public renderer UX.

This research track explores a different question:

> How can an agent system deliberately generate unusual variants, reject bad ones, and evolve useful survivors into new baselines?

No production behavior should be changed from this branch until the concept has been evaluated independently.

---

## 1. Problem statement

For many operational tasks, there is already a sufficiently defined answer space:

- code must satisfy tests;
- policy must satisfy explicit conditions;
- data must satisfy validation;
- a workflow must meet its specification;
- a candidate must fit known constraints.

For these tasks, fast semantic judgment can reduce wasted search.

A Jev-like evaluator can be useful here because the task is not primarily to invent a new world. It is to find or validate a good answer inside an already defined space.

But this is different from:

- creative discovery;
- research;
- invention;
- reframing a problem;
- finding a new strategy;
- producing a useful exception to an existing rule.

The research question is therefore not:

> How do we make the current answer-finding loop more random?

It is:

> How do we create a second loop whose job is to produce and evaluate useful deviation from the current baseline?

---

## 2. Two-loop model

### A. Exploit Loop — known answer space

```text
Problem
  ↓
Candidate
  ↓
Rule / Test / Jev
  ↓
Accept / Reject
  ↓
Execution
```

Purpose:

- speed;
- consistency;
- constraint satisfaction;
- low-error repetition;
- reliable execution.

The evaluator is optimized for correctness against existing criteria.

### B. Explore Loop — new answer space

```text
Current Baseline
      ↓
Mutation / Reframe / Combination
      ↓
Variant Candidates
      ↓
Verification Gates
   ┌──┴─────────────┐
 Reject        Surviving Variant
                    ↓
                Experiment
                    ↓
               Evidence
                    ↓
            Adopt / Hold / Reject
                    ↓
              New Baseline
```

Purpose:

- novelty;
- discovering useful exceptions;
- creating alternate strategies;
- testing new assumptions;
- evolving the baseline.

The evaluator is not the generator.

---

## 3. Core distinction

### Known-answer judgment

A known-answer problem has an external or previously agreed evaluation frame.

Examples:

- tests pass;
- contract is satisfied;
- policy is followed;
- data is valid;
- requirements are met.

The system should minimize unnecessary variation.

### Emergent discovery

An emergence problem does not yet have a complete answer frame.

Useful output may initially look like:

- an outlier;
- a contradiction;
- an odd combination;
- a failed answer with one interesting property;
- a hallucinated connection;
- a minority hypothesis.

The important point is not to trust the outlier.

The important point is to **route it into a different verification workflow**.

---

## 4. Hallucination as raw material, not truth

LLM hallucination should not be promoted as evidence.

However, in an explicitly exploratory stage it can be treated as one source of mutation.

Possible labels:

- Variant
- Mutation
- Outlier Candidate
- Speculative Candidate
- Novel Hypothesis

Avoid using `hallucination` as the formal state name because it mixes:

1. unsupported factual error;
2. useful speculative recombination.

The system should preserve that distinction.

A speculative candidate must never inherit factual confidence merely because it is novel.

---

## 5. Proposed agent roles

### Mutation Agent

Goal: produce meaningful deviation from the current baseline.

Mutation operators may include:

- invert an assumption;
- change one constraint;
- combine two distant approaches;
- search for an exception;
- deliberately optimize for a different objective;
- generate an adversarial alternative;
- reinterpret the problem boundary;
- preserve a failed candidate's useful component.

This agent should not be rewarded for matching the baseline.

### Critic / Constraint Gate

Goal: remove obviously invalid candidates cheaply.

Checks:

- internal contradiction;
- known hard constraints;
- safety / policy constraints;
- specification violations;
- impossible dependencies;
- unsupported factual assertions.

A Jev-like semantic evaluator can participate here, but it is only one gate.

### Evidence Agent

Goal: convert a surviving hypothesis into testable evidence.

Possible tools:

- code execution;
- simulation;
- retrieval;
- data analysis;
- unit/integration tests;
- external APIs;
- human experiment;
- A/B test;
- controlled prototype.

### Curator / Evolution Agent

Goal: decide what happens after evidence arrives.

Possible outcomes:

- reject;
- archive;
- hold for later;
- refine;
- split into sub-variants;
- adopt experimentally;
- promote to baseline.

This role should compare the candidate against the current baseline, not merely judge it in isolation.

---

## 6. Candidate lifecycle

Proposed research states:

```text
BASELINE
   ↓
MUTATION
   ↓
CANDIDATE
   ↓
CONSTRAINT_CHECK
   ├─→ REJECTED
   └─→ SURVIVOR
          ↓
       EXPERIMENT
          ↓
       EVIDENCE
       ├─→ REJECTED
       ├─→ HELD
       ├─→ REFINED
       └─→ ADOPTED
               ↓
          NEW_BASELINE
```

The key lifecycle idea:

> An outlier is not a success state.  
> A surviving, evidenced outlier may become a new baseline.

---

## 7. Relation to Galton / sigma metaphor

This research should not claim that real creative work follows a normal distribution.

The useful metaphor is narrower:

- the center represents the currently familiar solution space;
- distance from the center represents deviation from the current baseline;
- most deviations may be useless;
- some distant candidates may survive verification;
- an adopted survivor can change what becomes "normal" next.

Conceptual cycle:

```text
Current Normal
    ↓
Variation
    ↓
Outlier Candidate
    ↓
Verification
    ↓
Surviving Variant
    ↓
Adoption
    ↓
New Normal
```

This is an evolutionary metaphor, not a statistical claim about creativity.

---

## 8. Critical design principle

Do not reward novelty directly.

If the optimizer rewards only "distance from the baseline", the system will learn to generate nonsense.

A useful candidate must satisfy at least two dimensions:

```text
novelty / deviation
        +
validity / evidence
```

A third dimension may be required depending on the domain:

```text
utility / value
```

Therefore the exploration score, if one is ever introduced, must not collapse into a single unexamined probability.

For v0.1 this research should avoid defining a production score.

---

## 9. Possible workflow

A first experimental workflow could be:

```text
1. Capture current baseline
2. Generate N variants with different mutation operators
3. Deduplicate near-identical candidates
4. Apply hard constraint gates
5. Apply semantic critique
6. Select a small survivor set
7. Convert each survivor into a falsifiable experiment
8. Run available tests / simulations / retrieval
9. Compare evidence against baseline
10. Human review for ambiguous survivors
11. Adopt, hold, refine, or reject
12. Record why an adopted variant changed the baseline
```

Important:

The purpose of step 5 is not to choose the "most likely future".

It is to remove or annotate weak candidates before expensive experiments.

---

## 10. Minimum research objects

A future experimental contract may need objects similar to:

```text
Baseline
Candidate
Mutation
ConstraintResult
Critique
Experiment
Evidence
Decision
Adoption
```

Possible candidate fields:

```text
candidateId
parentBaselineId
mutationOperator
claim
assumptions[]
constraints[]
noveltyNotes[]
verificationPlan[]
status
```

This is intentionally not part of `BoardTrace v0`.

Do not add it to the public Board contract during this research phase.

---

## 11. What Jev may do

Potential roles for Jev:

- classify whether a candidate violates semantic criteria;
- compare a candidate with a baseline;
- detect contradiction;
- detect missing justification;
- prioritize which variants deserve expensive verification;
- classify experiment results.

Jev should not be assumed to:

- prove factual truth;
- replace external evidence;
- generate objective probabilities of future success;
- decide alone that an outlier is an innovation.

---

## 12. Research risks

### Novelty collapse

Mutation agents generate superficial wording changes instead of meaningful variants.

### Nonsense explosion

The system produces too many invalid candidates because deviation is rewarded without constraints.

### Evaluator conservatism

The critic rejects every genuinely new idea because it differs from the baseline.

### Evaluator bias reinforcement

A semantic evaluator can reproduce the assumptions of the current baseline and suppress useful exceptions.

### False evidence

A candidate survives because verification relies on another model rather than independent evidence.

### Premature promotion

A successful local experiment is promoted to a global baseline too quickly.

### Trace pollution

Exploration metadata leaks into the public Board and is mistaken for probability or runtime truth.

---

## 13. Research safeguards

- mutation and evaluation roles must be separate;
- at least one verification gate should be independent of the generator;
- factual claims require evidence outside pure generation;
- rejection reasons must be recorded;
- adoption requires comparison with the baseline;
- ambiguous survivors should support human review;
- promoted baselines should keep lineage to the prior baseline;
- public Board contracts remain unchanged until a separate design review.

---

## 14. Research milestones

### R0 — Concept contract

Define:

- baseline;
- mutation;
- survivor;
- evidence;
- adoption;
- rejection;
- lineage.

No runtime changes.

### R1 — Offline fixture experiment

Create a small set of static examples:

- obviously bad mutation;
- superficially novel mutation;
- useful but uncertain mutation;
- surviving experimentally useful mutation.

Evaluate whether the workflow separates them coherently.

### R2 — Multi-agent prototype

Prototype:

- one Mutation Agent;
- one Critic;
- one Evidence/Experiment step;
- one Curator.

Run only in an isolated experimental harness.

### R3 — Metrics

Study:

- survivor rate;
- duplicate rate;
- rejection reason distribution;
- experiment cost;
- percentage promoted after evidence;
- baseline improvement versus control.

Do not use "novelty score" alone as the success metric.

### R4 — Board visualization research

Only after R0–R3:

Explore whether the public Board should visualize:

- candidate lineage;
- rejected variants;
- surviving variants;
- baseline shifts.

This is not approved for production Board implementation yet.

---

## 15. Branch boundary

This branch is intentionally isolated from the current Board implementation track.

Allowed here:

- research documents;
- fixture concepts;
- experimental schemas outside `BoardTrace`;
- non-production prototypes;
- evaluation notes.

Not allowed here without a new decision:

- changing current Sigma Drop behavior;
- changing `BoardTrace v0`;
- changing production renderer semantics;
- merging emergence concepts into the current M1 motion work;
- presenting variants as probabilities.

---

## 16. Next action for this branch

Next work should be **R0 — Concept Contract**, not implementation.

Create a small experimental contract for:

```text
Baseline → Mutation → Candidate → Verification → Survivor → Adoption
```

Then test that contract with 3–5 offline fixtures before building an agent workflow.
