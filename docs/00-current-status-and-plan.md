# Worldline Board — Current Status & Next Plan

Last updated: 2026-09-25  
Baseline: `main@04d9b7db8a4a24ef6ba893186cefa4b833c3e5f1`

This document is the current planning baseline for the public **Worldline Board** repository.

## 1. Product boundary

Worldline Board is the public, provider-neutral renderer for sanitized `BoardTrace` data.

It may render:

- deviation from a supplied baseline;
- μ / ±σ guides;
- code / judgment / policy / human review / terminal semantic events;
- optional trace-supplied worldlines;
- user-facing Sigma Drop interactions.

It must not contain:

- Jev API calls or API keys;
- private Worldline Engine workflow logic;
- private state projection;
- production routing thresholds;
- live private evaluation reports;
- fabricated historical distributions or histograms;
- invented worldlines that were not supplied by the trace.

`worldline-engine` remains the runtime / judgment source of truth.

## 2. What is already complete

### Renderer and contract

- Public `BoardTrace v0` schema exists.
- Semantic trace steps are rendered.
- Human-review pause is represented.
- Terminal branch state is represented.
- Optional sanitized `worldlines[]` is supported.
- Missing worldlines are not synthesized.

### Sigma semantics

- μ / ±σ visual guides exist.
- Deviation peg and sigma guides use the same coordinate scale.
- A deviation-bearing step uses the sigma scale regardless of semantic step kind.
- Judgment / policy / branch horizontal placement is explicitly documented as semantic layout, not sigma and not future probability.

### Result-first experience

Current public flow:

```text
READY → SIGMA DROP → RESULT → WORLDLINES → TRACE DETAILS
```

- Main result emphasizes the supplied deviation first.
- Confidence and judgment distributions are secondary in Trace details.
- READY screen now explains the product before developer controls.
- Main action is **Start Sigma Drop**.
- Example / Step / Reset remain available under **Advanced controls**.

### Worldline presentation

- Result can reveal trace-supplied possible worldlines.
- Worldline states include `open`, `active`, `paused`, and `closed`.
- Branch colors visually separate paths.
- Color, glow, thickness, or position must not be described as objective future-event likelihood.

### Tone and visual language

Current main tokens:

| Meaning | Color |
| --- | --- |
| Deep background | `#08121F` |
| Surface | `#111C2A` |
| Normal / baseline / code | `#74ADFF` |
| Ambiguity / judgment / elevated | `#A47CFF` |
| Policy / routing | `#7F91FF` |
| Human attention | `#FF9A64` |
| High deviation / branch emphasis | `#FF5E7F` |
| Critical deviation | `#FF4668` |

The visual direction follows the original dark-navy Sigma Drop concept with restrained glow.

### Mobile

- Mobile Board stage is explicitly capped at 430px.
- Scene geometry is rebuilt from the rendered mobile width + 430px height.
- Orientation / resize relayout is supported.
- Worldline supporting cards swipe horizontally instead of creating a long vertical stack.

## 3. Important problem still unresolved

The main conceptual problem is now clear:

> **The moving ball still follows the semantic trace.**

Current implementation draws the semantic path and advances the ball from semantic peg to semantic peg.

That creates three incorrect impressions:

1. the route was physically predetermined;
2. Galton collisions are equivalent to judgment/workflow decisions;
3. the ball's left/right movement has semantic or probabilistic meaning.

This conflicts with the intended Worldline metaphor.

The public experience should not be a workflow-player disguised as a Galton Board.

## 4. New design decision

### Visual Motion ≠ Semantic Trace

From this baseline onward:

**The visual drop path and the semantic execution trace are separate layers.**

#### Visual motion

The ball may move through decorative Galton pegs using a physics-inspired or pseudo-random-looking path.

That motion:

- is decorative / experiential;
- does not represent model calls;
- does not represent policy routing;
- does not represent probability;
- does not choose a worldline.

The only semantic constraint on the visual drop is the final landing target derived from the trace-supplied deviation.

#### Semantic meaning

The semantic trace remains authoritative for:

- judgment;
- policy;
- human review;
- branch state;
- supplied evidence;
- supplied worldlines.

Those details belong in **Trace details** and explanatory layers, not in the ball's physical route.

## 5. Target public experience

The next target interaction is:

```text
READY
  ↓
free visual drop through decorative pegs
  ↓
land at supplied deviation position
  ↓
highlight σ result
  ↓
reveal trace-supplied worldlines from the result
  ↓
optional Trace details
```

The user should feel:

> “This observation landed here relative to its usual range.  
> From this state, these paths remain open.”

They should not feel:

> “The engine predicted a fixed future and the ball replayed that path.”

## 6. Next implementation plan

### M1 — Separate drop motion from semantic trace

Goal: remove semantic peg-to-peg movement from the main Sigma Drop animation.

Work:

- introduce a dedicated visual-drop motion model;
- use decorative pegs only for the drop animation;
- converge the final animation position to the trace-supplied deviation x-coordinate;
- stop using `semanticPegs[]` as the ball animation path;
- keep semantic trace data available for Trace details;
- do not alter BoardTrace schema unless required.

Acceptance criteria:

- two runs may visibly take different decorative routes while landing at the same supplied deviation;
- route variation never changes the trace result;
- semantic step order remains inspectable in Trace details;
- no visual motion value is labeled as confidence or probability.

### M2 — Landing → Result transition

Goal: make the landing itself explain the sigma result.

Work:

- emphasize the landing point;
- reveal the deviation label at landing;
- transition directly into the Result card;
- keep μ / ±σ meaning visually local to deviation.

Acceptance criteria:

- user can identify the final deviation without opening Trace details;
- no fabricated histogram or historical distribution appears.

### M3 — Result → Worldlines continuity

Goal: make possible worldlines feel like they open from the observed state.

Work:

- visually connect the result anchor to the worldline fan;
- reveal only `worldlines[]` supplied by the trace;
- use state styling for open / active / paused / closed;
- preserve the rule that hue separates paths but does not encode likelihood.

Acceptance criteria:

- absent `worldlines[]` means no invented fan;
- Human Review can keep multiple paths visually open/paused;
- active/open styling does not imply a numeric future probability.

### M4 — Trace details repositioning

Goal: keep explainability without turning the main screen back into a debugger.

Work:

- semantic step sequence remains in Trace details;
- optionally add a compact semantic timeline there;
- remove any remaining main-canvas visual that implies semantic pegs are physical Galton collisions.

## 7. Test strategy for the next phase

Required tests:

- same deviation always lands on the same sigma target;
- visual route can vary without changing semantic output;
- no visual route field is written back into BoardTrace;
- traces without worldlines never generate synthetic worldlines;
- review-required traces do not auto-select a terminal future;
- mobile and desktop landing targets remain aligned with the sigma scale;
- public-boundary checks continue to reject private engine concerns.

For deterministic CI, visual variation should be testable through an injectable seed or motion source even if production runs appear different to users.

## 8. Explicit non-goals for the next phase

Do not add:

- real Jev calls;
- Engine execution inside Board;
- probability-based future prediction;
- fake normal-distribution histograms;
- user data ingestion / baseline calculation;
- arbitrary worldline generation by the Board;
- broad new product features before the motion/meaning separation is correct.

## 9. Completed change sequence

Recent completed milestones on `main`:

- PR #1 — result-first Sigma Drop and sigma-axis semantics
- PR #2 — trace-supplied worldlines and visual language
- PR #3 — compact mobile visual flow
- PR #4 — explicit mobile SVG height / geometry fix
- PR #5 — user-first READY experience

## 10. Next work item

The next implementation branch should contain **one conceptual change only**:

> **M1 — Visual Motion ≠ Semantic Trace**

Do not start M2/M3 redesign at the same time.

First prove that the ball can visually fall through the Galton field without following the semantic workflow, while still landing exactly on the trace-supplied deviation.
