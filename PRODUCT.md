# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Investors doing diligence. Someone about to write a check or take a meeting,
checking a founder's public numbers before they commit. They arrive with a
specific name or a specific claim in mind, usually from a pitch, a podcast, or a
post they just read, and they want to know within a minute whether a document
backs it.

Secondary, and not the design target: the person filing a record. Filing is open
to anyone.

## Product Purpose

Founders state revenue, headcount and funding in public, constantly, with
nothing attached. Almost none of it is ever checked. When someone does check,
the work takes twenty minutes across the Delaware registry, Wayback, and an
archived job post, then it is pasted into a group chat of nine people and lost
by morning. The next person starts from zero.

Spill keeps that work. One record per claim, the source attached, open to
anyone. Success is a person finding an existing record instead of redoing the
search.

## Positioning

The rule is the product: every record pairs a public claim with a document
anyone can open. No source, no record. A neighboring product cannot truthfully
copy this while also running on rumor, engagement, or user reports, because the
rule is enforced in the API's gate rather than in a moderation policy.

Status describes the claim against the documents and never the person. It is a
four-value enum — SUPPORTED, UNSUPPORTED, CONTRADICTED, UNCHECKABLE — and
FRAUD, LIE, and FALSE are deliberately unavailable, because intent cannot be
sourced and therefore cannot be published. Most records should be UNSUPPORTED,
which is the honest default and not an accusation.

## Operating Context

Read on a phone, usually from a shared link or mid-conversation, often while the
claim is still being made. The sources are public records: Delaware franchise
tax filings, SEC Form D, archived team pages, cached job postings, Wayback
snapshots.

Filing happens after a search that has already been done by hand, so the file
form's job is to capture work that exists rather than prompt new work.

## Capabilities and Constraints

Live now, open to read and open to file.

- Single-file PWA at `app/`, no build step, no dependencies, no external assets,
  every path relative.
- Archive API is a Cloudflare Worker plus D1 (`spill-api`, database `spill`) on
  the LLC Cloudflare account. The app reaches it through `window.SPILL_API`.
- The gate refuses with a reason string rather than a boolean, and `api/test.mjs`
  asserts on those exact strings so the copy a person reads and the behavior of
  the API cannot drift apart. 12 tests.
- Checks run in order of danger, so a cheap validation failure cannot mask a
  dangerous one.
- Every record carries a report path, reachable from the record itself.
- No accounts, no identity verification, no image uploads, no stored identity
  documents. This is a deliberate security posture and should not change.
- No counts, no votes, no scores, no ranking, no trending anywhere in the
  product.
- No claims about private individuals, and no words about intent.
- `ios/` is a Capacitor shell around `app/`; nothing has been distributed.

## Brand Commitments

Name: **Spill**. The repo is `cf-spill` and `cf-spill` is also the Codex Foundry
gateway skill that prepares records; the app is where they land. The product was
called Cracked until 2026-09-17.

Owned by Codex Foundry. Commercial, not the 501(c)(3); no money, traffic, or
funders cross that wall.

The user has released every prior identity constraint for this rebrand: the
cracked-egg mark, the yolk yellow, and the current naming are all open. The
product rules above are not.

Binding visual direction volunteered with the rebrand request: the site should
feel akin to Codex / OpenAI's marketing brand.

## Evidence on Hand

- The archive is **empty**. Zero records. Nothing may present invented records,
  founders, companies, numbers, quotes, or counts as real.
- Fictional sample records exist in `app/index.html` as the offline fallback
  only. They are labeled SAMPLE in a banner and per card, driven off the same
  flag, and that labeling is not removable while samples are showing.
- No customers, no testimonials, no press, no usage figures, no funding. None
  may be implied.
- Real assets: the current egg mark (inline SVG), app icons at `app/icon-*.png`.
- `api/README.md` states the rule precisely and is accurate.

## Product Principles

1. **The rule is the interface.** Every screen should make "claim plus openable
   document" obvious without explaining it.
2. **Refuse with a reason.** Where the product says no, it says why, in the
   words a person reads, and the test asserts on those words.
3. **Never rank.** No popularity signal may enter the product, because a crowd
   cannot vote a document into existence and ranking would make Spill a
   publisher rather than a record.
4. **Say what is true, including "nothing."** An empty archive, an unsupported
   claim, and an uncheckable one are all honest states and are shown as
   themselves rather than filled in.
5. **Hold nothing worth stealing.** No identities, no images, no documents of
   record about people. The archive points at public sources instead of copying
   them.

## Accessibility & Inclusion

No product-specific standard established. Baseline: the app is read one-handed
on a phone, so targets, contrast against black or white, and text scaling are
live concerns rather than a checklist item.
