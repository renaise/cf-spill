-- Cracked. A record is a claim plus at least one openable source.
-- The one-source minimum is enforced in the API, not here, so the refusal can
-- carry a reason string. This schema is the shape; index.js is the gate.

CREATE TABLE IF NOT EXISTS records (
  id            TEXT PRIMARY KEY,
  claim         TEXT NOT NULL,
  claimant      TEXT NOT NULL,
  made_where    TEXT NOT NULL,
  made_url      TEXT NOT NULL,
  archive_url   TEXT,
  made_at       TEXT,
  status        TEXT NOT NULL CHECK (status IN ('SUPPORTED','UNSUPPORTED','CONTRADICTED','UNCHECKABLE')),
  would_change  TEXT NOT NULL,
  created_at    TEXT NOT NULL,
  hidden        INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS checks (
  id         TEXT PRIMARY KEY,
  record_id  TEXT NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  what       TEXT NOT NULL,
  says       TEXT NOT NULL,
  url        TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- Guideline 1.2 requires a report path and timely action. It is also just correct.
CREATE TABLE IF NOT EXISTS reports (
  id         TEXT PRIMARY KEY,
  record_id  TEXT NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  reason     TEXT NOT NULL,
  detail     TEXT,
  created_at TEXT NOT NULL,
  resolved   INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_records_created ON records(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_checks_record   ON checks(record_id);
CREATE INDEX IF NOT EXISTS idx_reports_open    ON reports(resolved, created_at DESC);
