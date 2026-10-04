# Worldline Board — Current Status & Next Plan

Last updated: 2026-10-04 (UTC)  
Source baseline: [`main@bc2a8eec8bc83aac5e276fdd76df7164cf537421`](https://github.com/redsunjin/worldline-board/commit/bc2a8eec8bc83aac5e276fdd76df7164cf537421), rechecked on 2026-10-04  
Historical baseline entering M1: `main@b417daebaec23be555b423bc71c9d936ee3dee0a`

This document is the current planning baseline for the public **Worldline Board** repository.


## 완료

**Implementation is merged; browser/production acceptance remains separate.**

- M1, decorative motion separated from semantic trace: [PR #7](https://github.com/redsunjin/worldline-board/pull/7), merged.
- M2, Landing → Result transition: [PR #8](https://github.com/redsunjin/worldline-board/pull/8), merged.
- M3, Result → Worldlines continuity: [PR #9](https://github.com/redsunjin/worldline-board/pull/9), merged on 2026-10-03. The source baseline above is its merge commit.
- **Code inspection (2026-10-04):** `src/drop-motion.mjs` generates renderer-only seeded motion; `app.js` uses the supplied deviation at landing and displays the fan only after completion when trace-supplied worldlines exist. This is source evidence, not a browser test.
- **Stored execution evidence:** [quality run 37091141306](https://github.com/redsunjin/worldline-board/actions/runs/37091141306), on the exact source baseline, passed on 2026-10-03. Its `npm run ci` log records the public-boundary check passing (7 files scanned) and **32 tests passed, 0 failed** on Node 22.
- **Saved test coverage:** `tests/drop-motion.test.mjs` and `tests/trace-layout.test.mjs` exercise motion/layout behavior. Landing, worldline, mobile, READY, and motion-separation contract tests also inspect source text. Those checks do not render the browser or establish visual acceptance.

## 미검증

- The combined **Drop → Result → Worldlines** flow has not been freshly exercised in a desktop/mobile browser as part of this status alignment.
- Pause/resume, repeated runs, reset, example switching, resize/orientation changes, and the final appearance of each worldline state still need recorded browser evidence.
- The source commit's Vercel status reports success, but that status alone does not establish which production URL was inspected or prove production UX acceptance.
- **Fresh execution in this documentation change:** no local `npm run ci` or browser/production test was run. The CI result above is an existing run whose logs were re-read on 2026-10-04. Any CI triggered by this documentation PR is separate evidence.
- M4 is deferred. Merged M1–M3 implementation must not be relabeled as end-to-end verified until the acceptance record below exists.

## 다음 작업 1개

**Verify and record the merged M1–M3 Drop → Result → Worldlines flow before starting M4.**

Acceptance criteria for this one verification task:

- Record the tested commit, date, URL/environment, browser, desktop viewport, and mobile viewport. If testing a deployment, establish its commit; report any unknown mapping.
- Run `npm run ci` against that checkout and attach the result separately from browser observations.
- Exercise `examples/steady.json` and `examples/human-review.json`; use sanitized test fixtures for missing deviation and missing `worldlines[]` cases. Do not publish fixtures or alter production data for this check.
- Confirm decorative route variation preserves the supplied final sigma target; the landing label and Result agree with the trace on desktop and mobile.
- Confirm supplied worldlines appear only after Result, retain their supplied states, and are not synthesized when absent. A review-required trace must not auto-select a terminal future.
- Confirm no deviation is fabricated when absent, and that animation order, hue, glow, width, and position introduce no probability/ranking claim.
- Check pause/resume, repeated Start, Reset, example switching, and resize/orientation during and after a drop for stale results, duplicate motion, or misaligned geometry. Keep Advanced Step / Trace details inspectable.
- Save concise pass/fail observations and screenshots (or reproduction steps for failures) in the verification PR, then sync this baseline. Only after review of that evidence may **M4 — Trace details repositioning** become the next implementation item.

The verification task does not authorize a new deployment, merge, Engine change, or M4 implementation.

## Reference: scope and implementation record

The sections below preserve product decisions and implementation history. “Implemented” means present in the source baseline; verification status is defined above.

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

## 2. Implemented renderer capabilities

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

## 3. Resolved conceptual debt

M1 resolved the earlier structural problem where the moving ball followed the semantic trace.

The public canvas now uses a renderer-only decorative route and converges on the trace-supplied deviation target. Judgment, policy, review, and branch events remain semantic data for Trace details instead of becoming physical Galton collisions.

The remaining UX debt entering M2 was different: the landing point and the sigma result were spatially disconnected. M2 addresses that by moving the visible sigma scale to the landing line and revealing the supplied deviation directly at the final point.

## 4. Established design decision

### Visual Motion ≠ Semantic Trace

The implementation preserves this rule:

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

The interaction to verify is:

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

## 6. Milestone implementation record

### M1 — Separate drop motion from semantic trace — IMPLEMENTED

Goal: remove semantic peg-to-peg movement from the main Sigma Drop animation.

Implementation now uses a dedicated seeded visual-drop generator. The public canvas follows decorative Galton motion and converges on the trace-supplied deviation target. Semantic steps remain available for Advanced Step / Trace details but are no longer drawn as the physical ball route.

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

### M2 — Landing → Result transition — IMPLEMENTED

Goal: make the landing itself explain the sigma result.

Implementation now positions the sigma guide at the actual visual landing line, adds a trace-colored landing halo/ring, reveals a `+N.NNσ · BAND` label at the final point, and gives the Result card a short focused transition.

Work:

- emphasize the landing point;
- reveal the deviation label at landing;
- transition directly into the Result card;
- keep μ / ±σ meaning visually local to deviation.

Acceptance criteria:

- user can identify the final deviation without opening Trace details;
- no fabricated histogram or historical distribution appears.

### M3 — Result → Worldlines continuity — IMPLEMENTED

Goal: make possible worldlines feel like they open from the observed state.

Implementation now visually bridges the Result card into the worldline fan, labels the fan origin from the supplied deviation, and reveals trace-supplied paths/cards in sequence. The sequence is presentation only and does not rank or score the paths.

Work:

- visually connect the result anchor to the worldline fan;
- reveal only `worldlines[]` supplied by the trace;
- use state styling for open / active / paused / closed;
- preserve the rule that hue separates paths but does not encode likelihood.

Acceptance criteria:

- absent `worldlines[]` means no invented fan;
- Human Review can keep multiple paths visually open/paused;
- active/open styling does not imply a numeric future probability.

### M4 — Trace details repositioning — DEFERRED

Gate: review the M1–M3 verification evidence before writing the M4 implementation spec.

Goal: keep explainability without turning the main screen back into a debugger.

Work:

- semantic step sequence remains in Trace details;
- optionally add a compact semantic timeline there;
- remove any remaining main-canvas visual that implies semantic pegs are physical Galton collisions.

## 7. Regression requirements

Preserve these requirements when verifying the baseline and when later implementing M4:

- same deviation always lands on the same sigma target;
- visual route can vary without changing semantic output;
- no visual route field is written back into BoardTrace;
- traces without worldlines never generate synthetic worldlines;
- review-required traces do not auto-select a terminal future;
- mobile and desktop landing targets remain aligned with the sigma scale;
- public-boundary checks continue to reject private engine concerns.

For deterministic CI, visual variation should be testable through an injectable seed or motion source even if production runs appear different to users.

## 8. Explicit non-goals

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
- PR #6 — canonical baseline and motion/meaning plan
- PR #7 — M1 decorative motion / semantic trace separation
- PR #8 — M2 Landing → Result transition
- PR #9 — M3 Result → Worldlines continuity

## 10. Working loop and status synchronization

Follow **requirements → spec → branch → test → review → sync**:

1. **Requirements:** select the one next task above and preserve the public/private boundary.
2. **Spec:** record scope, non-goals, fixtures, acceptance criteria, and required evidence before implementation.
3. **Branch:** create one focused branch from the verified `main` baseline; keep unrelated conceptual changes separate.
4. **Test:** record the exact commit and distinguish code inspection, saved test/run evidence, and fresh execution. Report passed, failed, and not-run checks separately.
5. **Review:** open a draft PR with the evidence and any gaps. A review request does not grant merge or deployment approval.
6. **Sync:** after an authorized change or reviewed verification result, update this canonical document and the README pointer together: 완료 / 미검증 / 다음 작업 1개.

M4 remains the later implementation candidate, not a second active next task. Do not add new Engine behavior.
