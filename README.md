# Cracked

Founder claims, and the receipts that check them.

Public claims about revenue, headcount, and funding are made constantly and
checked almost never. When someone does check, the work happens in a group chat
and is lost. Cracked keeps it: one page per claim, the source attached.

**The rule:** every post pairs a claim with a document anyone can open. No source,
no post. Names are optional; the source carries the weight.

## This repo

A single self-contained `index.html`. No build step, no dependencies, no external
assets. Every path is relative, so the page renders correctly whether it is served
from a user path or a bare domain.

## Deploying

GitHub Pages, `main` branch, root. Currently served from a project path. To move it
to the bare `cf-cracked.github.io` URL, create a GitHub org named `cf-cracked` and
transfer this repo to it. The repo name already matches, so no rename or edits are
needed.

A custom domain is set in `CNAME` when one is registered.

Codex Foundry, 2026.
