# Spill — prototype notes

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

## The archive is real

`spill-api` is deployed on the LLC Cloudflare account
(`c672230f...`, token at `~/.cf-llc-token`) at
`https://spill-api.delicate-cloud-00a7.workers.dev`, with D1 database `spill`
(`8561d078-d7bf-4f39-988c-60af8ff1ab1e`) and the schema applied. The app points
at it through `window.SPILL_API`.

It holds no records. The app says so: the SAMPLE banner is down, the feed reads
"The archive is open / No records have been filed yet", and the archive header
reads "No records filed yet". An archive that answers counts as live even with
zero rows, because an empty archive is a true statement and invented records in
its place would not be. The samples are only the offline fallback now, reached
when the archive cannot be reached at all.

Filing the first records is a person's job, not the agent's. `/cf-spill`
retrieves and structures a claim record; a human publishes it.

The write path is proven by `api/test.mjs` (12 passing), not by writing to the
live archive. Deploy with `NODE_OPTIONS= npx wrangler deploy` from `api/`, and
`NODE_OPTIONS=` is required on this machine or wrangler dies on a Node preload
error.

## Screens

Four records load from sample data. Each record is one full screen and pages
sideways from the claim to the source.

The feed, the source page, the status filter menu, the archive grid, the rules,
and the file sheet. Five nav slots: feed, archive, compose, notices, rules.

## The UI is a forum

Rebuilt 2026-09-17 from the Sora full-screen pager into a scrolling forum.

Mobbin has no Tea. Two searches for it returned QUITTR, Glassdoor, Reddit, Lex,
Flo and BFF; the App Store listing rate-limited and the Play listing came back
truncated. So the references are the Reddit and Glassdoor screens Mobbin did
return, not Tea.

A post card carries, in order: a byline row with the claimant and the date, the
claim as the title, the status as a tag, the source document as a three-line
excerpt, and an action row. Tapping the title or the source count opens the
record on its own screen, with the claim, the full document and what would
change the status.

Filter chips replaced the dropdown. They run across one scrolling row under the
wordmark, the way Reddit's category rail does, and carry a status dot each.

**Reddit's vote column is deliberately absent.** Spill does not rank records,
and the rules screen says why: a crowd cannot vote a document into existence,
and ranking claims by popularity would make this a publisher rather than a
record. The only number in the action row is a count of documents, which is a
fact about the record rather than a verdict on it.

**Tea's model is not adopted, only its shape.** Tea carries anonymous claims
about private individuals. Spill's rules refuse exactly that, and refuse any
claim about intent, which is what the four-value status enum exists to enforce.
Tea was also breached in July 2025 — roughly 72,000 images including about
13,000 photo IDs from identity verification, off a misconfigured storage bucket,
and later over 1.1 million direct messages. Spill stores no images and no
identity documents, and should not start.

The archive tab is a dense two-line list of the same records rather than a grid
of squares. The square grid was a Sora artifact and read mostly empty.

## Measured, not eyeballed

Taken from the live page at 393 × 852, deviceScaleFactor 3.

| Part | Box |
|---|---|
| Nav | y 788–852 |
| Compose | 44 × 44 |

The compose button is square, so its 999px radius renders a circle. It was
46 × 34 until this week, and a 999px radius on an oblong gives an oblong.

The caption, rail and dots measurements are gone with the pager they belonged
to.

## What Sora left behind

The five nav slots with a raised white compose circle survive the rebuild. So
does the top-right slot opening the rules rather than a social graph, since
there is no social graph here.

## Fixed 2026-09-17

**The install bar covered the record byline and the status chip.** It now claims
space through a `--strip` token instead of floating over the record. Everything
positioned off the nav — the caption, the rail, the dots, the toast, the page
padding, the archive — also clears `--strip`, so the record rides above the strip
rather than under it. `showInstall()` measures the rendered strip and sets the
token from it, because the iOS copy runs to two lines and the Chrome copy to one;
the 58px in the stylesheet is only a fallback. Showing and hiding both go through
`showInstall()` / `hideInstall()` so the strip and the space it claims cannot
disagree.

**Archive cells were 9/16 holding three lines,** roughly 70% empty. They are
square now, 121 × 121 at 393 wide. The 9/16 ratio is right for Sora because
Sora's grid is video stills.

**A long toast reached the caption.** Sora's pill sits at the caption's height
because it says one word; these say whole sentences. The toast now rides above
the caption at `nav + bot + strip + 132px`, with `right:62px` keeping it off the
rail. This is a deliberate departure from Sora's exact position.

Verified by assertion rather than by eye: with the strip forced on and a long
toast showing, install × caption, install × chip, install × dots, toast ×
caption, toast × chip and toast × rail all report no intersection.

## Still open

**The claim page carries a lot of empty black.** The claim is centered in a page
padded 64px top and 190px above the nav. Sora fills that area with video. This
may be correct for a text record and may not; it needs a look with real claims
of varying length rather than four sample ones.

## Rebuilding the screenshots

The inspection used puppeteer-core out of `~/FOUNDRY HUB/gstack/node_modules`
against the Chrome for Testing binary in `~/.cache/puppeteer/chrome`. Set the
viewport with `setViewport`, never `--window-size`, which distorts `vh` and
therefore every safe-area calculation in the app.
