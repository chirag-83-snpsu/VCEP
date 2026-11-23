/**
 * Session 07 curriculum-integrity regression.
 *
 * Independent reference: approved Drive Edition 3 student worksheet, Case B.
 * Seven raw rows: R01 12,000; R02 8,000 twice; R03 5,000; R04 7,000
 * (invalid date); R05 missing amount; R06 4,000 (ambiguous date).
 * Only R01, first R02 and R03 may enter Clean (25,000).
 * Known numeric raw 44,000 = Clean 25,000 + excluded/held 19,000.
 * R05 remains UNKNOWN; it is not zero and must not be used in that equation.
 *
 * Run: node tests/verify-session-07-curriculum-integrity.mjs
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

// Exercise the actual TypeScript review function rather than copying its totals.
const source = readFileSync('lib/review-engine/session-rules/session-07.ts', 'utf8');
const js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;
const { evaluateSession07 } = await import(
  'data:text/javascript;base64,' + Buffer.from(js).toString('base64')
);

const clean = [
  { sourceId: 'R01', isoDate: '2026-10-01', customerStandard: 'Asha', amount: 12000 },
  { sourceId: 'R02', isoDate: '2026-10-02', customerStandard: 'Beacon', amount: 8000 },
  { sourceId: 'R03', isoDate: '2026-10-03', customerStandard: 'Asha', amount: 5000 },
];
const exceptions = [
  { sourceId: 'R02 (Row 3)', rawAmount: 8000 },
  { sourceId: 'R04', rawAmount: 7000 },
  { sourceId: 'R05', rawAmount: 'blank' },
  { sourceId: 'R06', rawAmount: 4000 },
];

function workCheck(rows, flagged, id) {
  const report = evaluateSession07({
    sessionId: 7,
    draft: {},
    workstationData: { cleanRows: rows, exceptions: flagged, formulaNotes: '' },
  });
  const check = report.stages.Work.checks.find((item) => item.id === id);
  assert.ok(check, 'Missing review check ' + id);
  return check;
}

const cleanId = 's07-w1-approved-clean';
const exceptionId = 's07-w2-quarantine-register';
const bridgeId = 's07-w3-reconciliation-proof';

assert.equal(workCheck(clean, exceptions, cleanId).passed, true, 'Correct records should pass');
assert.equal(workCheck(clean, exceptions, exceptionId).passed, true, 'Missing amount preserved as unknown');
assert.equal(workCheck(clean, exceptions, bridgeId).passed, true, 'Known numeric values reconcile');

// Critical safety property: an amount missing from the source is NOT ₹0.
const zeroedR05 = exceptions.map((e) => e.sourceId === 'R05' ? { ...e, rawAmount: 0 } : e);
assert.equal(workCheck(clean, zeroedR05, exceptionId).passed, false, 'Zeroed R05 must fail');
assert.equal(workCheck(clean, zeroedR05, bridgeId).passed, false, 'False zero-variance proof must fail');

// Totals can match while source identifiers are wrong; those cases must fail.
const wrongReceipt = clean.map((r) => r.sourceId === 'R03' ? { ...r, sourceId: 'R04' } : r);
assert.equal(workCheck(wrongReceipt, exceptions, cleanId).passed, false, 'Wrong clean source ID must fail');
assert.equal(workCheck(wrongReceipt, exceptions, bridgeId).passed, false, 'Bridge with wrong source ID must fail');

const wrongDate = clean.map((r) => r.sourceId === 'R02' ? { ...r, isoDate: '2026-10-03' } : r);
assert.equal(workCheck(wrongDate, exceptions, cleanId).passed, false, 'Changed date must fail');

const wrongExceptionId = exceptions.map((e) => e.sourceId === 'R06' ? { ...e, sourceId: 'R07' } : e);
assert.equal(workCheck(clean, wrongExceptionId, exceptionId).passed, false, 'Wrong exception ID must fail');

// Check that the approved raw workbook representation still retains the blank value.
const dataset = readFileSync('app/guided-learning/components/session-07-cleaning-data.ts', 'utf8');
assert.match(dataset, /sourceId: 'R05'[^\n]*amount: 'blank'/, 'Raw R05 must remain blank');
assert.match(dataset, /sourceId: 'R05'[\s\S]*?rawAmount: 'blank'/, 'Exception R05 must remain unknown');
console.log('PASS: Session 07 canonical records, missing-value protection, and source-identity checks.');
