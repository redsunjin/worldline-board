# Visual Language

Worldline Board should feel like a small scientific instrument that is inviting enough to touch.

The visual direction follows the original Sigma Drop concept: deep navy surfaces, quiet Galton pegs, and a small set of luminous accent colors that become stronger only when the meaning becomes stronger.

## Core tokens

| Role | Token | Hex | Use |
| --- | --- | --- | --- |
| Night background | `--bg` | `#08121F` | Page and deep stage |
| Surface | `--panel` | `#111C2A` | Cards and controls |
| Cool / baseline | `--blue` | `#74ADFF` | Normal deviation, code/statistical events, cool branch |
| Ambiguity | `--violet` | `#A47CFF` | Judgment, elevated deviation, middle branch |
| Routing | `--indigo` | `#7F91FF` | Policy/routing |
| Human attention | `--orange` | `#FF9A64` | Human review and explicit attention |
| High deviation / branch accent | `--coral` | `#FF5E7F` | High deviation, strong visual emphasis, warm branch |
| Critical accent | `--coral-hot` | `#FF4668` | Critical deviation only |
| Decorative peg | `--peg` | `#6E7F94` | Non-semantic Galton texture |

## Meaning rules

1. **Deviation color has meaning.** Normal is blue, elevated is violet, high/critical moves toward coral.
2. **Semantic event color has meaning.** Code/statistics, judgment, policy, human review, and branch each keep a stable accent.
3. **Worldline hue does not mean probability.** Blue/violet/coral are used to separate concurrent paths so the eye can follow them.
4. **Inactive information stays quiet.** Decorative pegs, labels, borders, and closed paths use slate and lower opacity.
5. **Glow is reserved for focus.** The moving ball, current deviation, active worldline, and current semantic peg may glow. Static chrome should not.

## Tone

Prefer short, human-facing result language:

- “Within the usual range”
- “A little outside the usual range”
- “Well outside the usual range”

Keep engine terminology in Trace details. The main surface should answer what changed and what paths remain open before exposing workflow internals.

## Probability boundary

Colors, line thickness, glow intensity, and screen position must never be described as objective future-event likelihood. If the trace supplies confidence or a judgment distribution, it remains evidence in Trace details.
