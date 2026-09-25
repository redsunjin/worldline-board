# Worldline Board

**A Galton-board-inspired visualizer for sanitized decision traces, deviation, and branching workflows.**

Worldline Board turns a structured execution trace into an interactive **Sigma Drop**. The public experience is result-first:

```text
READY → SIGMA DROP → RESULT → WORLDLINES → TRACE DETAILS
```

The main surface shows the trace-supplied deviation from a supplied baseline. The default entry point keeps developer controls secondary: one primary Sigma Drop action comes first, while example selection, step-through, and reset live under Advanced controls. The detailed view explains the semantic events that followed.

> σ guides describe deviation only. Later horizontal routing is semantic layout, not probability.

> Visual peg ≠ model call. Only semantic trace events are decisions.

## What this repository is

This is the **public, provider-neutral visualization layer**.

It renders:
- code/statistical steps;
- model/judgment steps;
- policy/routing steps;
- human-review pauses;
- terminal branches;
- trace-supplied deviation against μ / ±σ guides;
- optional trace-supplied worldlines after the result.

It does **not** contain:
- Jev API keys or API calls;
- private Worldline Engine workflow definitions;
- production routing thresholds;
- live evaluation reports;
- private state-projection rules;
- synthetic histograms or invented baseline data.

Judgment confidence and distributions may be shown in **Trace details** when supplied by the trace. They are evidence attached to the trace, not objective future-event probabilities.

## Quick start

```bash
npm test
npm run dev
```

Then open:

```text
http://127.0.0.1:4173
```

## Public trace contract

The renderer consumes a small `BoardTrace` JSON contract. See:

- `schema/board-trace-v0.schema.json`
- `examples/steady.json`
- `examples/human-review.json`

Any system can produce this contract: rule engines, AI agents, LLM workflows, human processes, or private decision engines.

The board renders only what the sanitized contract supplies. If historical distribution data is not present, the board does not fabricate a histogram. If worldlines are absent, it does not invent branches.

## Visual language

The public UI follows the original dark-navy Sigma Drop direction: cool blue for baseline/normal states, violet for ambiguity, coral for larger deviations and branch emphasis, and orange for human attention. Branch hues separate paths visually; they never encode probability. See `docs/visual-language.md`.

## Deploy

This repository is designed as a static site and can be deployed directly to Vercel with no secrets.

Maintainer deployment: in Vercel choose **Add New → Project → Import Git Repository** and select `redsunjin/worldline-board`.

For third parties who want their own copy, the standard Vercel Deploy Button / clone flow can also be used.

No provider API key is required or expected in this public project.

## License

Apache-2.0.
