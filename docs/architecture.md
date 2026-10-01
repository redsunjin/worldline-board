# Architecture

Worldline Board has one job:

```text
Any decision engine
      ↓
sanitized BoardTrace JSON
      ↓
Worldline Board
```

The public repository does not decide which branch is correct.

Semantic steps may be `code`, `judgment`, `policy`, `review`, or `branch`. They remain structured renderer data for Trace details and explanation.

The main Galton surface does **not** render semantic steps as physical collision pegs. Small Galton-style pegs and the ball route are decorative visual motion only.

## Experience semantics

The default public experience is result-first:

```text
READY → SIGMA DROP → RESULT → WORLDLINES → TRACE DETAILS
```

The main surface answers one question first: **how far is the supplied observation from its supplied baseline?**

The detailed semantic workflow remains available under **Trace details** for explanation and debugging.

### Visual motion

Visual motion and semantic trace are separate layers.

- the drop route is generated from decorative Galton pegs;
- route variation may change between runs;
- the final landing x-coordinate is constrained by the trace-supplied deviation;
- the route does not represent judgment, policy, confidence, probability, or worldline selection;
- semantic step order remains inspectable under Trace details.

For deterministic tests the motion generator accepts an injectable seed. The generated motion is renderer-only state and is never written into `BoardTrace`.

### Sigma axis

The μ / ±σ guides apply only to a trace-supplied `summary.deviation.value`.

A deviation peg and the visible sigma guides use the same renderer scale. Horizontal positions of later judgment, policy, review, and branch pegs are semantic layout positions and **must not be interpreted as sigma values or branch probabilities**.

Worldline Board does not synthesize a historical distribution, histogram, baseline window, or sample count when those values are absent from `BoardTrace`.

### Landing result

The visual landing line is the local sigma scale for the public interaction. When the drop completes:

- the final x-coordinate stays equal to the trace-supplied deviation target;
- the landing point receives a visual halo/ring;
- the public canvas may display the supplied deviation value and band next to the landing point;
- the Result card may animate to connect the landing moment to its textual explanation.

The landing emphasis does not add a histogram, infer a distribution, or create new evidence.

### Judgment evidence

Judgment confidence/probability may be displayed only as evidence supplied by the trace. It is shown in the detailed view rather than as the main result.

These values are not presented as objective probabilities of future real-world events.

## Public boundary

The board does not contain Jev API calls, credentials, private workflow state, production routing thresholds, private state projections, or live evaluation reports. Those remain responsibilities of the engine that emits the sanitized trace.


### Worldlines

`BoardTrace.worldlines` is optional and contains only sanitized paths supplied by the producer. The Board never invents missing branches.

Each worldline may provide a scenario id, user-facing label, state, evidence label, and short note. The renderer can visually fan these paths after the result is reached.

Worldline hue is a presentation device for separating paths. **Blue, violet, and coral do not encode likelihood or future-event probability.**
