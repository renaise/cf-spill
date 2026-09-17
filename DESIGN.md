# Design

Written 2026-09-17 from the built world, not ahead of it.

## The world

Paper, not screen. Ground is white, ink is near-black, structure is carried by
hairline rules rather than cards, shadows, or fills. The surface reads as a
document that happens to be interactive.

The brief pinned this world: "akin to Codex / OpenAI's marketing brand." A
brief-pinned direction beats the concept roll, and the roll (seed `e2f5b73e`,
assignment index 5) was run and set aside on that basis, not skipped.

It refuses the dark high-density "intelligence terminal" that diligence tools
default to. Spill is read by an investor on a phone in daylight, often mid-
conversation, before a meeting — that physical scene forces light, and the
previous black build was fighting it.

### Raised by two challengers it beat

Both raises are discipline, not clothes. One world owns the page.

**Seven-segment displays** donate *absence is drawn as deliberately as light*.
Unlit segments in that world are designed, not omitted. In Spill, UNSUPPORTED is
the honest default and most records will carry it, so it renders in full ink —
never grey, never dimmed — and gets a mark of its own rather than the absence of
one. Dimming it would tell the reader it mattered less than the others.

**The glazier's colour-field partition** donates *colour reserved, carried by a
field*. Status colour lives in a bordered field sized to its own label, not in a
dot scattered across a neutral ground. Nothing else on the surface is allowed a
hue at all.

## Tokens

| Token | Value | Use |
|---|---|---|
| `--paper` | `#ffffff` | Ground |
| `--raise` | `#fafafa` | Document blocks, pressed rows |
| `--ink` | `#0d0d0d` | Primary text, filled controls |
| `--ink-2` | `#5d5d5d` | Secondary text |
| `--ink-3` | `#8f8f8f` | Labels, timestamps |
| `--rule` | `#e6e6e6` | Every border |
| `--rule-2` | `#f1f1f1` | Interior hairlines |

Four reserved hues, one per status, and no fifth:

| Status | Hue | Field | Mark |
|---|---|---|---|
| SUPPORTED | `#0f7a43` | `#f1f8f3` / `#cfe6d8` | filled |
| CONTRADICTED | `#a84a06` | `#fdf4ed` / `#f0dcc9` | filled |
| UNSUPPORTED | `#0d0d0d` | `--raise` / `--rule` | hollow |
| UNCHECKABLE | `#8f8f8f` | `--raise` / `--rule` | hollow |

## The mark

A filled square means a document is on file. A hollow ring means none was found.
The mark encodes *whether a document exists*, never whether the news is good:
SUPPORTED and CONTRADICTED both have documents and are both filled. Both shapes
are drawn at 8–9px, the same size, for the reason above.

## Type

Marketing surfaces (`index.html`, `landing.html`) load **Archivo** — a
grotesque in the Akzidenz line, the honest free stand-in for Söhne, which the
pinned brand uses and which is licensed.

The app (`app/index.html`) keeps a system grotesque stack, `"Helvetica Neue",
Helvetica, -apple-system, …`. This is deliberate and should not be "fixed": the
app is an Operate surface, where system stacks are appropriate, and it is a
self-contained PWA that must not acquire a webfont request. The mechanical
detector flags this stack; the reason it is wrong here is recorded rather than
silenced.

Monospace (`ui-monospace, SFMono-Regular, Menlo`) is reserved for two things
only: source documents, and small uppercase labels at `.1–.13em` tracking.
Monospace is never body copy.

Display sits at `font-weight:500` with `-.026em` to `-.034em` tracking. Nothing
on any surface is bolder than 600.

## Composition

Hairline rules separate everything; there are no shadows and no filled cards
except document blocks on `--raise`. Marketing containers cap at 1120px with a
24px gutter (18px under 640px). Section padding runs `clamp(56px, 9vh, 104px)`.

Controls are pill buttons at 36–40px, either solid ink or white with a hairline
that darkens to ink on hover. One button system, two variants.

## Surfaces

**`landing.html`** — Persuade. Hero, then a real record shown rather than
described, then the rule, then the four states, then the close. The demo record
is fictional and carries a dashed SAMPLE field.

**`index.html`** — Persuade. The app running live in a 393 × 852 frame with the
gestures named beside it. Frame scales in four steps below 1035px of viewport
height and hides below 520px wide, along with the sentence describing it.

**`app/index.html`** — Operate. A forum list of records; a record opens on its
own screen. Filter chips, five nav slots, a raised solid compose circle.

## Standing prohibitions

No vote column, no counts, no scores, no ranking, anywhere. The only number in
the product counts documents.

No fifth hue. No gradient, no shadow, no glow.

The SAMPLE banner and the per-card SAMPLE field are driven off one `live` flag
and cannot disagree. Neither is removable while samples are showing.

UNSUPPORTED is never rendered as a disabled or muted state.
