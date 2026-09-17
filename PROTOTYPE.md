# Cracked — prototype notes

Started 2026-09-17. What the root URL now serves, what the app measured when it
was inspected, and what is still wrong with it.

## What is at each URL

`renaise.github.io/cf-spill/` is the mobile prototype: the real app in a
393 × 852 phone frame, with the gestures named beside it. It loads `app/` in an
iframe rather than showing screenshots, so it cannot drift from what ships.

`renaise.github.io/cf-spill/app/` is the app itself, full screen.

`renaise.github.io/cf-spill/landing.html` is the pitch page that used to be at
the root. Nothing was deleted; it moved and both the prototype and the footer
link to it.

The frame scales down in four steps once the viewport is shorter than 1035px,
so the bottom nav is never the part that falls off the screen. Below 520px wide
the frame is hidden entirely, along with the sentence that describes it, because
the bezel would be wider than the phone drawing it.

It carries no drawn notch. A notch sat over the sample banner and cut the word
FICTIONAL out of it. The banner is the one thing on the screen that may not be
obscured, so the decoration went.

## Screens

Four records load from sample data. Each record is one full screen and pages
sideways from the claim to the source.

The feed, the source page, the status filter menu, the archive grid, the rules,
and the file sheet. Five nav slots: feed, archive, compose, notices, rules.

## Measured, not eyeballed

Taken from the live page at 393 × 852, deviceScaleFactor 3.

| Part | Box |
|---|---|
| Record | 393 × 852 |
| Caption | y 664–754 |
| Rail | y 483–692 |
| Dots | y 771–776 |
| Nav | y 788–852 |
| Compose | 44 × 44 |

The compose button is square, so its 999px radius renders a circle. That was the
first thing checked, because it was 46 × 34 until this week and a 999px radius on
an oblong gives an oblong.

## Where it follows Sora, and where it does not

Matched: the centered selector with its chevron and menu card, the right action
rail, the bottom-left avatar and caption block, the centered page dots, the five
nav slots with a raised white compose circle, and the status pill sitting bottom
right above the nav.

Deliberately different, and they should stay different:

No counts under the rail icons. The rules screen argues for this directly — a
crowd cannot vote a document into existence, and ranking claims by popularity
would make Cracked a publisher rather than a record.

No follow badge on the caption avatar, and no people glyph in the top right.
Sora's is a social graph. There isn't one here, so that slot opens the rules.

No letterboxed media band. A claim is text.

## Known defects

**The install bar covers the record byline and the status chip.** It sits at
`nav + bot + 14px`, which puts it over y 708–774; the caption runs to 754. The
second line of the byline and the SUPPORTED / CONTRADICTED chip are both behind
it. The chip is the whole point of a record, so this is the one worth fixing
first. It is web-only and dismissible, and it does not appear in the native
build.

**Archive cells are 9/16 holding three lines.** Roughly 70% of each cell is
empty. The ratio is right for Sora because Sora's grid is video thumbnails.

**A long toast can reach the caption.** Its `max-width` is `100% - 28px`, so it
can extend to x 14 while the caption runs to x 331. It clears the page dots by
9px, which was the constraint that set its height, but nothing stops it
horizontally.

**The claim page carries a lot of empty black.** The claim is centered in a page
padded 64px top and 190px above the nav. Sora fills that area with video. This
may be correct for a text record and may not; it needs a look with real claims
of varying length rather than four sample ones.

## Rebuilding the screenshots

The inspection used puppeteer-core out of `~/FOUNDRY HUB/gstack/node_modules`
against the Chrome for Testing binary in `~/.cache/puppeteer/chrome`. Set the
viewport with `setViewport`, never `--window-size`, which distorts `vh` and
therefore every safe-area calculation in the app.
