# cracked-api

Cloudflare Worker + D1 behind Cracked.

`src/index.js` holds the gate. It refuses with a reason string rather than a boolean,
and `test.mjs` asserts on those exact strings so the copy a person reads and the
behaviour of the API cannot drift apart.

## The rule, precisely

A record is a public claim plus documents anyone can open. Encoded as:

- **Every** record needs a link to where the claim was made. Without it there is
  nothing to archive, so there is nothing to check.
- **SUPPORTED** and **CONTRADICTED** assert something about the world, so they owe at
  least one source document.
- **UNSUPPORTED** ("nothing found either way") and **UNCHECKABLE** ("no public document
  could settle it") are honest answers that carry no corroborating source. Most records
  should be UNSUPPORTED.
- Status is a four-value enum. `FRAUD`, `LIE`, and `FALSE` are not available, because
  intent cannot be sourced and so cannot be published.

Checks run **in order of danger**. A malformed source is dropped during parsing, which
makes it indistinguishable from no source at all, so it is diagnosed first. Otherwise a
person who attached a source with a missing link is told they attached nothing.

## Test

```bash
NODE_OPTIONS= node test.mjs
```

## Run locally

```bash
NODE_OPTIONS= npx wrangler d1 execute cracked --local --file=schema.sql
NODE_OPTIONS= npx wrangler dev --local --port 8799
```

`NODE_OPTIONS=` is required on this machine or wrangler dies on a Node preload error.

## Deploy

**Not deployed yet. The account decision is open.** Only one Cloudflare account is
reachable from this machine and it authenticates as `admin@artificenyc.org`, the
501(c)(3) address. Cracked is Codex Foundry, so putting its database there crosses the
entity wall. Resolve before running:

```bash
NODE_OPTIONS= npx wrangler d1 create cracked        # copy database_id into wrangler.toml
NODE_OPTIONS= npx wrangler d1 execute cracked --remote --file=schema.sql
NODE_OPTIONS= npx wrangler deploy
```

Then point the app at it by setting `window.CRACKED_API` before the app script runs.
Until that is set the app runs on fictional samples and keeps the SAMPLE banner up.

## Endpoints

- `GET  /health`
- `GET  /records?filter=all|open`
- `GET  /records/:id`
- `POST /records` — the gate. 422 with `{error}` on refusal.
- `POST /records/:id/report` — Guideline 1.2 needs this, and it is correct anyway.
