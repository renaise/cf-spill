// The tests assert on the reason strings a person actually reads, so the copy in the
// UI and the behaviour of the gate cannot drift apart.
import { canFile } from './src/index.js';
import assert from 'node:assert';

let pass = 0, fail = 0;
const t = (name, fn) => {
  try { fn(); pass++; console.log('  ok   ' + name); }
  catch (e) { fail++; console.log('  FAIL ' + name + '\n       ' + e.message); }
};

const valid = {
  claim: 'We crossed $4M ARR last month.',
  claimant: 'A Founder, Example Inc',
  made_where: 'Conference keynote',
  made_url: 'https://example.com/talk',
  status: 'UNSUPPORTED',
  would_change: 'A bank statement covering the period.',
  checks: [],
};

console.log('\ncanFile');

t('accepts a minimal honest record', () => {
  assert.equal(canFile(valid).ok, true);
});

t('UNSUPPORTED may carry no document', () => {
  assert.equal(canFile({ ...valid, status: 'UNSUPPORTED', checks: [] }).ok, true);
});

t('UNCHECKABLE may carry no document', () => {
  assert.equal(canFile({ ...valid, status: 'UNCHECKABLE', checks: [] }).ok, true);
});

t('CONTRADICTED without a document is refused', () => {
  const r = canFile({ ...valid, status: 'CONTRADICTED', checks: [] });
  assert.equal(r.ok, false);
  assert.match(r.reason, /owes a document/);
  assert.match(r.reason, /UNSUPPORTED/);
});

t('SUPPORTED without a document is refused', () => {
  const r = canFile({ ...valid, status: 'SUPPORTED', checks: [] });
  assert.equal(r.ok, false);
  assert.match(r.reason, /owes a document/);
});

t('intent words are not available as a status', () => {
  const r = canFile({ ...valid, status: 'FRAUD' });
  assert.equal(r.ok, false);
  assert.match(r.reason, /intent cannot be sourced/);
});

t('a source without a link is refused', () => {
  const r = canFile({ ...valid, status: 'CONTRADICTED', checks: [{ what: 'Filing', says: 'Incorporated 2026', url: '' }] });
  assert.equal(r.ok, false);
  assert.match(r.reason, /not a source/);
});

t('a non-http source link is refused', () => {
  const r = canFile({ ...valid, status: 'CONTRADICTED', checks: [{ what: 'Filing', says: 'x', url: 'javascript:alert(1)' }] });
  assert.equal(r.ok, false);
});

t('a claim with nowhere it was said is refused', () => {
  const r = canFile({ ...valid, made_url: '' });
  assert.equal(r.ok, false);
  assert.match(r.reason, /nothing to archive/);
});

t('a record with no flip condition is refused', () => {
  const r = canFile({ ...valid, would_change: '' });
  assert.equal(r.ok, false);
  assert.match(r.reason, /prosecution, not a record/);
});

// The ordering guarantee. This record is both over-length AND asserts CONTRADICTED
// with no document. It must fail on the dangerous one.
t('danger is checked before cheap validation', () => {
  const r = canFile({ ...valid, status: 'CONTRADICTED', checks: [], claim: 'x'.repeat(5000) });
  assert.equal(r.ok, false);
  assert.match(r.reason, /owes a document/, 'a length failure masked the missing document');
});

t('a valid CONTRADICTED record with a document passes', () => {
  const r = canFile({
    ...valid, status: 'CONTRADICTED',
    checks: [{ what: 'Delaware filing', says: 'Incorporation date 2026-01-19', url: 'https://example.com/filing' }],
  });
  assert.equal(r.ok, true);
  assert.equal(r.value.checks.length, 1);
});

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
