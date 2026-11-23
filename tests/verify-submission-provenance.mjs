/**
 * VCEP submission-safety regression.
 * Run: node tests/verify-submission-provenance.mjs
 * Does not read or modify any database.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const station = readFileSync('app/guided-learning/components/official-submission-station.tsx', 'utf8');
const start = station.indexOf('  // Copy only an actual student-written response');
const end = station.indexOf('  // Save Cloud Draft', start);
assert.ok(start >= 0 && end > start, 'Explicit provenance-based synchronization required');
const sync = station.slice(start, end);

assert.match(sync, /session === 1 \|\| session === 22/, 'No automatic Baseline A or Exit B answer transfer');
assert.match(sync, /draftAnswers\[workKey\]/, 'Only actual task data may be copied');
assert.match(sync, /b0r0c1: 'work-prompt:0'/, 'Verified Session 03 clarification mapping');
assert.match(sync, /b0r1c1: 'work-prompt:1'/, 'Verified Session 03 progress mapping');
assert.match(sync, /b0r2c1: 'work-prompt:2'/, 'Verified Session 03 escalation mapping');
assert.doesNotMatch(sync, /updateIfEmpty\(/, 'Remove hardcoded worked-solution autofill');
assert.doesNotMatch(sync, /INR \d|₹\d|\b(b1|contribution|aiUse|reflection)\s*:\s*'[^']+/, 'No prewritten answers/declarations');
assert.match(station, /Only your own completed responses may be transferred/, 'Explain provenance to students');

for (const file of ['tests/verify-pilot-e2e.mjs', 'scripts/test-live-browser-acceptance.mjs']) {
  const src = readFileSync(file, 'utf8');
  assert.doesNotMatch(src, /DELETE FROM\s+(?:submissions|drafts|uploads)/i, file + ' must not delete historic student records');
  assert.match(src, /VCEP_ALLOW_E2E_WRITES/, file + ' requires explicit permission to write official records');
}
const e2e = readFileSync('tests/verify-pilot-e2e.mjs', 'utf8');
assert.doesNotMatch(e2e, /DemoStudent@VCEP2026!|DemoFaculty@VCEP2026!/, 'Remove exposed password fallbacks');
console.log('PASS: Student-authored submission provenance, controlled assessment protection, no destructive E2E cleanup.');
