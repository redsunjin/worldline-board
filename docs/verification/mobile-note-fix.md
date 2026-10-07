# Scale note overlap repair — local evidence

UTC 2026-10-06. Original PR head: `a920ce2d742c0bcbba11e2306645455a7b446e65`. Tested final code commit: `cbd85f8fd68c79867d6eee240320b582042a15bf`; later evidence-only commit does not change executable code. Mac mini, Node 24.18.0/npm 11.16.0, isolated headed Playwright Chrome 154, http://127.0.0.1:4187/. No public deployment observations are attributed to this code.

## Problem and repair

At 390×844 the absolute scale note overlapped sigma tick labels by ~6.7px and crossed the landing ball. A 844px landscape regression also reproduced ~3.9px overlap. Put the note in normal document flow below the SVG at every width; mobile stage grows to accommodate it while the SVG remains 430px. Colors, sigma geometry, trace data and meaning are unchanged.

[Before 390](screenshots/mobile-note/before-390.png) · [After 390](screenshots/mobile-note/after-390.png) · [After review 390](screenshots/mobile-note/after-review-390.png) · [After 844](screenshots/mobile-note/after-844.png).

## Fresh results

- `npm run ci`: boundary 7 files; **38 passed, 0 failed/skipped**. Includes note normal-flow contract regression. [CI](mobile-note-ci.txt).
- Official Playwright skill wrapper: `--session=pr11verify open http://127.0.0.1:4187 --headed`, `run-code --filename=/tmp/pr11-acceptance.cjs`: **28/28 functional checks pass** at 1280×900, 390×844, 844×390. Both examples match supplied sigma, worldline states and review outcome. Pause/resume/reset/details, repeated run, in-flight viewport changes, delayed immediate Start and latest-request example switches pass. [Results](mobile-note-browser-results.json).
- Three additional original checks pass: horizontal card scrolling 1→330px, resize after result retains +0.45σ, example switch interrupts motion to READY with zero balls.
- Back/Forward returns READY with enabled motion controls. Mobile browser-only missing-deviation fixture shows —; missing-worldlines hides fan with no cards; closed fixture preserves active/open/closed. Fixtures intercept sanitized local JSON responses only; repository examples are unchanged.
- `run-code --filename=scripts/mobile-note-regression.cjs`: **7/7 widths pass** (320,360,390,430,720,844,1280; landscape height390 at width844). Note starts below sigma labels; SVG remains430px at mobile widths. At390: label bottom990.284, note top993.984 (3.7px gap); at844: label bottom1313.813, note top1333.891 (20.1px gap). [Raw geometry](mobile-note-geometry.txt).
- Independent read-only code review of final code commit found no blocking defect. Final before/after visual inspection confirms note/tick separation on 390 and landscape844; palette and trace-supplied outcomes preserved.

## Limitations and human gate

Actual phone touch/hardware rotation and Safari remain NOT RUN. No protected Vercel access, deployment mapping, merge or manual deployment. Existing mobile Result sigma/copy spacing remains very tight (~1.1px bounding-box overlap on review), explicitly left for human review as outside the note/tick repair. Overall visual acceptance, physical-device checks and M4 remain gated on human review; this record is not production acceptance. Remote exact-head CI is checked after push and reported separately.

Subsequent [Result readability repair](result-layout-fix.md) resolves the previously recorded sigma/copy spacing issue and preserves the scale-note repair; device/Safari/human gates remain open.
