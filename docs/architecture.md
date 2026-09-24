# Architecture

Worldline Board has one job:

```text
Any decision engine
      ↓
BoardTrace JSON
      ↓
Worldline Board
```

The public repository does not decide which branch is correct.

Semantic steps may be `code`, `judgment`, `policy`, `review`, or `branch`. Only these trace steps become large semantic pegs.

Small Galton-style filler pegs are decorative. They are never model calls or workflow decisions.

Judgment confidence/probability can be displayed as evidence supplied by the trace. Board geometry is not an objective future-event probability.
