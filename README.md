# Cracked

Founder claims, and the receipts that check them.

Public claims about revenue, headcount, and funding are made constantly and
checked almost never. When someone does check, the work happens in a group chat
and is lost. Cracked keeps it: one page per claim, the source attached.

**The rule:** every post pairs a claim with a document anyone can open. No source,
no post. Names are optional; the source carries the weight.

## This repo

`index.html` is the landing page: self-contained, no build step, no dependencies, no
external assets. Every path is relative, so it renders correctly whether it is served
from a user path or a bare domain.

`app/` is the product, a single-file PWA on the same terms. It runs on fictional sample
records until an archive API is configured, and says so in a banner that is only removed
once real records have actually loaded.

`ios/` is a Capacitor shell around `app/`, so the native build and the web build serve
the same files. After changing anything in `app/`, run `npx cap sync ios`. See
TESTFLIGHT.md for what remains before a build can be distributed.

## Deploying

GitHub Pages, `main` branch, root. Served at `renaise.github.io/cf-spill/`.

The repo is `cf-spill`; the product is **Cracked**. They are deliberately different
names. Note that `cf-spill` is also the name of the gateway skill.

To serve from a bare `cf-spill.github.io`, the repo would need to be renamed to
`cf-spill.github.io` and transferred to a GitHub org named `cf-spill`. Both are
one-command changes. Every path in `index.html` is relative, so the page renders
correctly at any URL either way.

A custom domain is set in `CNAME` when one is registered.

Codex Foundry, 2026.
