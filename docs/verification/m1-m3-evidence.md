# M1–M3 verification evidence — partial, acceptance gate open

Date: 2026-10-04 UTC. Specification: [m1-m3-spec.md](m1-m3-spec.md).

## Exact evidence boundaries

- Local checkout: `77033837bcfe4e034a71bf0da301064763ea2b18` (main after PR #10).
- Fresh execution: `npm run ci`, Node v24.19.0, npm 11.9.0, Linux; public-boundary check **PASS (7 files)**; **32 tests passed / 0 failed / 0 skipped**. [Raw fresh CI output](local-ci.txt). This is separate from browser evidence; GitHub quality uses Node 22.
- Browser: dedicated cloud Chrome, viewport **1180×757 CSS pixels**, public URL **https://worldline-board.vercel.app/**, observed on 2026-10-04. This is a desktop test, not mobile emulation or a physical-device test.
- Deployment's exact source commit **not established**. A successful Vercel commit status exists for main, but the connector did not resolve deployment metadata. Do not attribute the public browser observations to an exact SHA.
- Local browser URL was blocked (`ERR_BLOCKED_BY_CLIENT`). Protected branch preview redirected toward Vercel account access and was not used. No account access, manual deployment, fixture upload, or production data change was performed.

## Observations

| Check | Result | Evidence |
| --- | --- | --- |
| READY → decorative Drop → Result → supplied Worldlines | PASS, public desktop | Result and worldlines absent initially and during motion; displayed after drop |
| Steady sigma and landing label | PASS | `+0.45σ`, landing `+0.45σ · NORMAL`; Maintain active, Experiment open, Transition open |
| Human-review sigma and states | PASS | `+2.15σ`, landing `+2.15σ · HIGH`; Return open, Adapt paused, Transition open; outcome `human review`, trace `review_required` |
| Human review does not select terminal future | PASS, visible example | No path changed to active/closed; human-review outcome remained |
| Rapid Start → Pause → Resume | PASS | One ball; paused position `cx=380, cy=75.68` unchanged across separate observations, worldlines hidden; resume completed |
| Repeat Start after completion | PASS | Two routes differed, with identical final ball `cx=577.8, cy=706`, +2.15σ and HIGH label |
| Close Trace details | PASS | Collapsed cleanly, result and worldlines remained intact |
| Reset after result and during motion | PASS | READY, no deviation result, no worldline cards, no semantic selection |
| Example switch after completion (wait until loaded) | PASS | Steady → human review cleared previous result and returned READY |
| Advanced Step / Trace details | PASS | Baseline then judgment remained inspectable; judgment showed supplied 0.31 confidence and 48/43/6/3 distribution; Result remained unchanged |
| Public presentation | PASS, desktop observation | Navy palette, sigma line/local landing label, result-to-fan bridge; explanatory text explicitly denies probability meaning |

Screenshots are settled viewport browser captures, not reconstructed mockups. Separate landing and fan captures avoid full-page capture triggering responsive relayout/reveal timing:

- [Steady desktop](screenshots/steady-desktop.png)
- [Human review landing](screenshots/human-review-desktop.png)
- [Human review settled fan](screenshots/human-review-fan-desktop.png)

## Open acceptance gaps

- Specified desktop 1280×900 (available browser was 1180×757)
- Mobile 390×844 and landscape 844×390; resize/orientation while running and after completion
- Missing-deviation / missing-worldlines browser fixtures (unit checks pass, browser cases not run)
- Closed worldline state browser fixture
- Browser Back/Forward
- Final browser regression of interrupted-load repair against the exact candidate
- Exact deployed SHA mapping and browser run on that immutable build
- Human judgment of overall visual experience

These are **NOT RUN**, not passes. Source-text contract tests and screenshots cannot substitute for these interactions. M4 remains deferred until the complete verification record is reviewed.

## Human reviewer flow

1. Open the public URL above. Start steady: confirm +0.45σ and three supplied paths.
2. Open Advanced controls, choose Human review pause, Start/Pause/Resume: confirm +2.15σ and open/paused/open paths, with human review outcome.
3. Reset while running, then Step through Trace details: no stale result; semantic evidence stays inspectable.
4. On a mobile device and after orientation changes, check landing/sigma alignment and swipe cards. Record device, browser and viewport.
5. Complete the remaining sanitized fixture cases in an authorized local browser; attach evidence and exact source version before approving the M4 gate.

## Defect found and repaired in candidate

**FAIL on the inspected public build:** switch from human review to steady and immediately Start while the example request is pending. Observed DROPPING with READY result/no ball and Start CTA; next click became Resume with READY phase. Reset recovered the UI. Root cause in baseline source: load clears the timer before awaiting fetch, but a Start during that wait can create a timer which survives the incoming state reset.

Candidate repair in `app.js`: disable/guard motion, Step and Reset while loading; use a generation counter so only the latest request can commit; clear old motion and timer; restore the prior example on failed switch. No trace/schema/example/private Engine change or M4 work.

Five deterministic regression cases execute the actual app logic with a minimal DOM/timer/fetch test harness and real layout/motion modules. They cover pending Start/Step/Reset, out-of-order completion, stale failure, current failure recovery and post-switch pause/resume plus immutable trace. **Fresh candidate `npm run ci`: 37 passed, 0 failed, boundary 7 files**, Node 24.19.0. See [candidate CI output](candidate-ci.txt). These are DOM-stub integration tests, not browser or screenshot tests.

**Final candidate browser validation remains NOT RUN.** Public screenshots above show the prior deployed build, not the repair. Do not count the fixed code as browser-accepted. Exact remote head and Node 22 CI are recorded in the draft PR.
