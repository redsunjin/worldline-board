# Worldline Board

**A Galton-board-inspired visualizer for decision traces, uncertainty, and branching workflows.**

Worldline Board turns a structured execution trace into an interactive **Sigma Drop**: a ball moves through meaningful decision pegs while cosmetic Galton pegs provide visual motion.

> Visual peg ≠ model call. Only semantic trace events are decisions.

## What this repository is

This is the **public, provider-neutral visualization layer**.

It renders:
- code/statistical steps;
- model/judgment steps;
- policy/routing steps;
- human-review pauses;
- terminal branches.

It does **not** contain:
- Jev API keys or API calls;
- private Worldline Engine workflow definitions;
- production routing thresholds;
- live evaluation reports;
- private state-projection rules.

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

## Deploy

This repository is designed as a static site and can be deployed directly to Vercel with no secrets.

[Deploy with Vercel](https://vercel.com/new/clone?repository-url=https://github.com/redsunjin/worldline-board)

No provider API key is required or expected in this public project.

## License

Apache-2.0.
