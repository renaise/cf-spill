// Spill API.
//
// The product rule and the legal position are the same object: a record is a public
// claim plus documents anyone can open. This file is where that rule is enforced. It
// is deliberately a gate that refuses with a reason, not a checklist that warns: the
// reason string is what a person reads AND what the tests assert on, so the two cannot
// drift apart.
//
// Checks run in order of danger. Filing a CONTRADICTED record with no document is the
// worst thing this API could do, so it is checked before cheap things like field
// lengths, which would otherwise mask it.

const STATUSES = ['SUPPORTED', 'UNSUPPORTED', 'CONTRADICTED', 'UNCHECKABLE'];

// SUPPORTED and CONTRADICTED assert something about the world, so they owe a document.
// UNSUPPORTED means "nothing found either way" and UNCHECKABLE means "no public record
// could settle this" -- both are honest answers that legitimately carry no corroborating
// source. The archived original claim is required in every case regardless.
const NEEDS_DOCUMENT = new Set(['SUPPORTED', 'CONTRADICTED']);

const MAX = { claim: 600, claimant: 200, made_where: 200, would_change: 400, what: 200, says: 2000 };

const httpUrl = v => {
  if (typeof v !== 'string' || !v.trim()) return null;
  let u;
  try { u = new URL(v.trim()); } catch { return null; }
  return (u.protocol === 'https:' || u.protocol === 'http:') ? u.toString() : null;
};

const str = v => (typeof v === 'string' ? v.trim() : '');

/**
 * The gate. Returns { ok: true, value } or { ok: false, reason }.
 * `reason` is written for a person and is surfaced verbatim in the UI.
 */
function canFile(body) {
  const claim = str(body.claim);
  const claimant = str(body.claimant);
  const madeWhere = str(body.made_where);
  const madeUrl = httpUrl(body.made_url);
  const archiveUrl = body.archive_url ? httpUrl(body.archive_url) : null;
  const status = str(body.status).toUpperCase();
  const wouldChange = str(body.would_change);

  const rawChecks = Array.isArray(body.checks) ? body.checks : [];
  const checks = [];
  for (const c of rawChecks) {
    const url = httpUrl(c && c.url);
    const what = str(c && c.what);
    const says = str(c && c.says);
    if (url && what && says) checks.push({ what, says, url });
  }

  // --- most dangerous first ---

  if (!STATUSES.includes(status)) {
    return { ok: false, reason: `Status must be one of ${STATUSES.join(', ')}. Words about intent, like FRAUD or LIE, are never available: intent cannot be sourced, so it cannot be published.` };
  }

  if (rawChecks.length > checks.length) {
    return { ok: false, reason: 'Every source needs all three of: what was checked, what the source literally says, and an http or https link. A source without a link is not a source.' };
  }

  if (NEEDS_DOCUMENT.has(status) && checks.length === 0) {
    return { ok: false, reason: `A ${status} record asserts something about the world, so it owes a document. Attach at least one source with what was checked, what it says, and a link anyone can open. If you found nothing, the honest status is UNSUPPORTED.` };
  }

  if (!madeUrl) {
    return { ok: false, reason: 'A record needs a link to where the claim was made. Without it there is nothing to archive, so there is nothing to check.' };
  }

  if (!claim) return { ok: false, reason: 'The claim must be quoted verbatim. Paraphrasing a claim and then checking the paraphrase is how a record becomes wrong.' };
  if (!claimant) return { ok: false, reason: 'A record needs the person or company that made the claim.' };
  if (!madeWhere) return { ok: false, reason: 'A record needs where the claim was made, such as the venue, publication, or platform.' };
  if (!wouldChange) return { ok: false, reason: 'Name the document that would change this status. A record without one is a prosecution, not a record.' };

  for (const [field, limit] of Object.entries(MAX)) {
    const v = { claim, claimant, made_where: madeWhere, would_change: wouldChange }[field];
    if (v !== undefined && v.length > limit) {
      return { ok: false, reason: `${field.replace(/_/g, ' ')} is longer than ${limit} characters.` };
    }
  }
  for (const c of checks) {
    if (c.what.length > MAX.what) return { ok: false, reason: `A source description is longer than ${MAX.what} characters.` };
    if (c.says.length > MAX.says) return { ok: false, reason: `A source quote is longer than ${MAX.says} characters.` };
  }

  return {
    ok: true,
    value: { claim, claimant, made_where: madeWhere, made_url: madeUrl, archive_url: archiveUrl, made_at: str(body.made_at) || null, status, would_change: wouldChange, checks },
  };
}

// --- http plumbing ---

function cors(origin, env) {
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  const ok = origin && allowed.includes(origin);
  return {
    'access-control-allow-origin': ok ? origin : allowed[0] || '*',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': 'content-type',
    'access-control-max-age': '86400',
    'vary': 'origin',
  };
}

const json = (data, status, headers) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', ...headers } });

async function listRecords(env, filter) {
  const where = filter === 'open' ? "AND status IN ('UNSUPPORTED','UNCHECKABLE')" : '';
  const { results } = await env.DB.prepare(
    `SELECT * FROM records WHERE hidden = 0 ${where} ORDER BY created_at DESC LIMIT 100`
  ).all();
  if (!results.length) return [];

  const ids = results.map(r => r.id);
  const { results: checks } = await env.DB.prepare(
    `SELECT * FROM checks WHERE record_id IN (${ids.map(() => '?').join(',')}) ORDER BY created_at`
  ).bind(...ids).all();

  const byRecord = new Map();
  for (const c of checks) {
    if (!byRecord.has(c.record_id)) byRecord.set(c.record_id, []);
    byRecord.get(c.record_id).push({ what: c.what, says: c.says, url: c.url });
  }
  return results.map(r => ({ ...r, hidden: undefined, checks: byRecord.get(r.id) || [] }));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const headers = cors(request.headers.get('origin'), env);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });

    try {
      if (url.pathname === '/health') {
        return json({ ok: true, service: 'spill-api' }, 200, headers);
      }

      if (url.pathname === '/records' && request.method === 'GET') {
        return json({ records: await listRecords(env, url.searchParams.get('filter')) }, 200, headers);
      }

      if (url.pathname === '/records' && request.method === 'POST') {
        let body;
        try { body = await request.json(); }
        catch { return json({ error: 'Body must be JSON.' }, 400, headers); }

        const gate = canFile(body);
        if (!gate.ok) return json({ error: gate.reason }, 422, headers);

        const v = gate.value;
        const id = crypto.randomUUID();
        const now = new Date().toISOString();

        const stmts = [
          env.DB.prepare(
            `INSERT INTO records (id, claim, claimant, made_where, made_url, archive_url, made_at, status, would_change, created_at)
             VALUES (?,?,?,?,?,?,?,?,?,?)`
          ).bind(id, v.claim, v.claimant, v.made_where, v.made_url, v.archive_url, v.made_at, v.status, v.would_change, now),
          ...v.checks.map(c =>
            env.DB.prepare(`INSERT INTO checks (id, record_id, what, says, url, created_at) VALUES (?,?,?,?,?,?)`)
              .bind(crypto.randomUUID(), id, c.what, c.says, c.url, now)
          ),
        ];
        await env.DB.batch(stmts);
        return json({ id, record: { ...v, id, created_at: now } }, 201, headers);
      }

      const report = url.pathname.match(/^\/records\/([\w-]+)\/report$/);
      if (report && request.method === 'POST') {
        let body;
        try { body = await request.json(); } catch { body = {}; }
        const reason = str(body.reason);
        if (!reason) return json({ error: 'A report needs a reason.' }, 422, headers);

        const exists = await env.DB.prepare('SELECT id FROM records WHERE id = ?').bind(report[1]).first();
        if (!exists) return json({ error: 'No such record.' }, 404, headers);

        await env.DB.prepare(
          'INSERT INTO reports (id, record_id, reason, detail, created_at) VALUES (?,?,?,?,?)'
        ).bind(crypto.randomUUID(), report[1], reason.slice(0, 200), str(body.detail).slice(0, 2000) || null, new Date().toISOString()).run();

        return json({ ok: true }, 201, headers);
      }

      const one = url.pathname.match(/^\/records\/([\w-]+)$/);
      if (one && request.method === 'GET') {
        const r = await env.DB.prepare('SELECT * FROM records WHERE id = ? AND hidden = 0').bind(one[1]).first();
        if (!r) return json({ error: 'No such record.' }, 404, headers);
        const { results: checks } = await env.DB.prepare('SELECT what, says, url FROM checks WHERE record_id = ? ORDER BY created_at').bind(one[1]).all();
        return json({ record: { ...r, hidden: undefined, checks } }, 200, headers);
      }

      return json({ error: 'Not found.' }, 404, headers);
    } catch (err) {
      return json({ error: 'Server error.', detail: String(err && err.message || err) }, 500, headers);
    }
  },
};

export { canFile };
