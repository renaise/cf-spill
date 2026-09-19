# Design

Written 2026-09-17 from the built world, not ahead of it.

## The world

Reddit at night. Ground `#0b0e0f`, cards `#141a1c` on a 1px `#242e31` hairline
at 12px radius, one neutral grotesk, monospace reserved for documents and small
labels.

It is a forum whose rows are people, and it still refuses to score them. The one
move every "review the founder" product makes — summing verdicts into a number
under a face — is the move this declines.

## Profiles are derived, never stored

A person exists here because a claim of theirs was filed, not the other way
round. `profiles()` groups the current record set by handle at render time. There
is no profile table, nothing to edit, and nothing that outlives its records.

**A profile card never tallies status.** It carries the person, their role, org
and handle, a plain count of records, and then each claim as its own row with its
own status field. A count of records is a fact about the record set; a breakdown
by status under someone's face is a score on a human being, and the product's own
rule is that status describes the claim and never the person. The rules screen
says it, the profile note under each name repeats it in plain words, and the card
is built so it cannot quietly drift.

## Colour and the state mark

Four reserved hues, one per status, and nothing else on the surface gets one:
SUPPORTED `#4ec77f`, CONTRADICTED `#f08a3c`, UNSUPPORTED `#e8eced`,
UNCHECKABLE `#6b787c`. Each rides a tinted field on the claim row rather than a
scattered dot.

A filled square means a document is on file. A hollow ring means none was found.
The mark encodes *whether a document exists*, never whether the news is good, so
SUPPORTED and CONTRADICTED are both filled. Both shapes draw at 8px, the same
size: UNSUPPORTED is the honest default and most records carry it, and rendering
it as a dimmed state would say it mattered less.

## Layout

One reading column, 680px, 760px above 1180px.

Under 900px the app is a phone: bottom bar, filter row beneath the header.
At 900px and up the bottom bar becomes a 232px left rail with labels, the
compose control becomes a labelled button at the top of it, and the column
centres in the space that remains. The filter row shares the column so it lines
up with the cards it filters.

## Type

A system grotesque, `"Helvetica Neue", Helvetica, -apple-system, …`. The app is a
self-contained PWA and must not acquire a webfont request. Monospace
(`ui-monospace, SFMono-Regular, Menlo`) is reserved for source documents, small
uppercase labels, handles and dates — never body copy.

## Surfaces

**`app/index.html`** — Operate. The web app: profile cards, a profile screen,
a record screen, the archive, the rules, and the file sheet. Responsive from
phone to desktop.

**`index.html`** — the root, which redirects to `./app/` so the app is what the
bare URL serves. The phone-frame prototype page it used to hold is retired.

**`landing.html`** — Persuade, and the one surface still in the light
Codex/OpenAI world pinned on 2026-09-17. A light marketing page in front of a
dark app is a deliberate split, not drift; say so or flip it, but do not
half-flip it.

## Standing prohibitions

No vote column, no counts, no scores, no ranking, anywhere. The only number in
the product counts documents.

No fifth hue. No gradient, no shadow, no glow.

The SAMPLE banner and the per-card SAMPLE field are driven off one `live` flag
and cannot disagree. Neither is removable while samples are showing.

UNSUPPORTED is never rendered as a disabled or muted state.
