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

Semantic steps may be `code`, `judgment`, `policy`, `review`, or `branch`. Only these trace steps become large semantic pegs.

Small Galton-style filler pegs are decorative. They are never model calls or workflow decisions.

## Experience semantics

The default public experience is result-first:

```text
READY → SIGMA DROP → RESULT → TRACE DETAILS
```

The main surface answers one question first: **how far is the supplied observation from its supplied baseline?**

The detailed semantic workflow remains available under **Trace details** for explanation and debugging.

### Sigma axis

The μ / ±σ guides apply only to a trace-supplied `summary.deviation.value`.

A deviation peg and the visible sigma guides use the same renderer scale. Horizontal positions of later judgment, policy, review, and branch pegs are semantic layout positions and **must not be interpreted as sigma values or branch probabilities**.

Worldline Board does not synthesize a historical distribution, histogram, baseline window, or sample count when those values are absent from `BoardTrace`.

### Judgment evidence

Judgment confidence/probability may be displayed only as evidence supplied by the trace. It is shown in the detailed view rather than as the main result.

These values are not presented as objective probabilities of future real-world events.

## Public boundary

The board does not contain Jev API calls, credentials, private workflow state, production routing thresholds, private state projections, or live evaluation reports. Those remain responsibilities of the engine that emits the sanitized trace.
