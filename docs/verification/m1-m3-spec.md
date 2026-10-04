# M1–M3 browser acceptance specification

Date: 2026-10-04. Baseline: main@7703383. Scope: verification plus the minimal interrupted-load regression repair below; M4 remains gated on human review.

## Management criteria

One bounded milestone progresses requirements → specification → isolated branch → fresh tests → browser evidence → independent review → human decision. Automated checks, browser observations, deployment mapping and human acceptance are separate gates. No merge or manual deployment is authorized by this record.

## Acceptance

- Fresh `npm run ci` passes on the tested checkout.
- Desktop 1280×900 and mobile 390×844: steady and human-review traces complete decorative Drop → Result → supplied Worldlines; final sigma and worldline states match supplied data.
- Two runs retain the same landing target; pause/resume, rapid clicks, Reset, example switching, Step and disclosure controls leave no stale result or duplicate ball.
- Resize during/after motion to 390×844 / 844×390 and back preserves alignment and outcome.
- Temporary sanitized missing-deviation and missing-worldlines variants are only served locally, never committed or sent to production.
- Main palette, immutable semantic data and public/private boundary remain unchanged.
- Evidence records tested commit, environment, browser, dimensions, observations, screenshots and explicit limitations. Deployment status alone is not UX evidence.

## Human gate

A partial evidence draft may be published for inspection, but is not acceptance-ready. All specified browser cases and exact deployment mapping must be completed before human acceptance can unlock the M4 specification. Product completion and production acceptance are not inferred.

## Interrupted-load repair (scope amendment)

Public browser verification found that switching examples and immediately clicking Start could leave DROPPING with a READY result and no ball. A later click displayed Resume despite READY. The existing asynchronous load cleared the motion timer before its fetch, but not a timer created while awaiting that fetch.

Repair criteria: disable motion/Step/Reset while a load is pending; only the latest requested example may commit its data or alter loading controls; discard prior motion; preserve trace content; handle failed loads without stale selection; preserve pause/resume and one-timer behavior after a successful switch. Deterministic app lifecycle tests and full CI are required. This is a correctness repair, not M4. Final browser regression against the exact candidate remains required before acceptance.
