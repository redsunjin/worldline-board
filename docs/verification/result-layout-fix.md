# Narrow Result readability repair

Local Mac verification: 2026-10-07 UTC. Before PR head `0286b1b3263764db346d2250b98c1d5dba838a33`; final tested code/test commit `74175ed163be50728a6771ac610a45f68fa6fd62`. Subsequent evidence-only commit does not alter executable code. Mac mini, isolated headed Chrome154, localhost4187, Node24.18/npm11.16. Official Playwright CLI skill path; no installed WebKit/Safari/phone verification.

421–430px previously let sigma paint over the body copy (~36px ×34px overlap); 320–390px had ~1.1px touching. At720px and below Result now stacks sigma above its explanation, gap18px. Remove the420px fixed96px two-column override. Wider layouts, colors, trace meaning and state transitions are preserved. Existing scale-note normal-flow repair remains intact.

[Before430](screenshots/result-layout/before-430.png) · [After430](screenshots/result-layout/after-430.png) · [Long explanation320](screenshots/result-layout/long-copy-320.png) · [Desktop breakpoint721](screenshots/result-layout/after-721.png).

Fresh `npm run ci`: boundary7; **39/39 tests**, zero failure/skip. [CI](result-layout-ci.txt).

`playwright-cli --session=pr11readability run-code --filename=scripts/result-readability-regression.cjs`: **36/36 actual browser layout checks**. Both examples at320,360,390,419,420,421,430,431,719,720,721,844×390,1280. Long rendered heading/body stress fixture at320,421,430,720,721; local response-intercept missing-deviation fixture at320,390,421,430,721. Each checks actual sigma/copy separation, card containment and no document horizontal overflow, with screenshots. Actual minimum mobile gap11.515625px; previous scale-note/tick minimum3.7px maintained when deviation exists. Long copy is synthetic DOM text applied after relayout, not trace-supplied content. [Geometry](result-layout-geometry.json).

Existing actual browser functional suite rerun on final CSS: **28/28 checks pass**, plus original three checks: mobile horizontal cards1→330px, completed resize retains result, in-motion switch clears ball/returnsREADY. **31/31 total original checks**. Delayed immediateStart, rapid latest-example switching, pause/resume/reset/details, repeats, supplied sigma and worldline states preserved. Additional Back/Forward and mobile missing-deviation/missing-worldlines/closed cases pass. [Functional results](result-layout-functional.json). Commands use official CLI wrapper and /tmp/pr11-acceptance.cjs, /tmp/pr11-more.cjs; new layout regression is committed for reuse.

Independent read-only code review found no blocking defect; actual after images inspected at430,320 long copy,721 breakpoint. No remaining reproduced Result overlap in the tested cases. Browser functional checks do not replace human experience review.

NOT RUN: Safari, WebKit (engine absent), actual iPhone/physical touch and hardware rotation, immutable deployment SHA mapping or production UX. No new tool install, security changes, merge, manual deployment or M4 expansion. Human review of overall flow/visual experience and physical device remains required. Remote exact-head CI is checked after push and reported separately.
