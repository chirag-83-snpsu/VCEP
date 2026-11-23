import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const mfPath = path.join(
  process.cwd(),
  'node_modules/.pnpm',
  fs.readdirSync('node_modules/.pnpm').find(n => n.startsWith('miniflare@')),
  'node_modules/miniflare/dist/src/index.js'
);
const { Miniflare } = require(mfPath);

// 1. Static webroot leak test
assert.equal(
  fs.existsSync('public/downloads'),
  false,
  'FAIL: public/downloads directory must not exist in public webroot'
);

// 2. Archive preservation & recoverability test
assert.ok(
  fs.existsSync('curriculum/archive/downloads/VCEP_Student_Session_Packs.zip'),
  'FAIL: VCEP_Student_Session_Packs.zip must be preserved in curriculum/archive/downloads/'
);
assert.ok(
  fs.existsSync('curriculum/archive/downloads/SHA256SUMS.txt'),
  'FAIL: SHA256SUMS.txt manifest missing in archive'
);

// 3. Git exclusion test
const ignoreDrive = execSync('git check-ignore app/guided-learning/drive-edition-3.json', { encoding: 'utf8' }).trim();
assert.equal(ignoreDrive, 'app/guided-learning/drive-edition-3.json', 'FAIL: drive-edition-3.json must be ignored by Git');

const ignoreArchive = execSync('git check-ignore curriculum/archive/downloads/VCEP_Student_Session_Packs.zip', { encoding: 'utf8' }).trim();
assert.ok(ignoreArchive.includes('curriculum/archive/'), 'FAIL: curriculum/archive must be ignored by Git');

// 4. API Authorization & Gatekeeping tests via Miniflare
const mf = new Miniflare({
  modules: [
    { type: 'ESModule', path: path.resolve('dist/server/index.js') },
    ...fs.readdirSync('dist/server', { recursive: true })
      .filter(n => n.endsWith('.js') && n !== 'index.js')
      .map(n => ({ type: 'ESModule', path: path.resolve('dist/server', n) }))
  ],
  compatibilityDate: '2026-05-15',
  compatibilityFlags: ['nodejs_compat'],
  d1Databases: { DB: 'test-worklab' },
  r2Buckets: ['BUCKET']
});

try {
  const db = await mf.getD1Database('DB');
  const sql = fs.readFileSync('drizzle/0000_sudden_anthem.sql', 'utf8');
  for (const statement of sql.split('--> statement-breakpoint').map(s => s.trim()).filter(Boolean)) {
    await db.prepare(statement).run();
  }

  const actors = {
    admin: ['prot-admin', 'vayentragurukula@gmail.com'],
    studentOpen: ['prot-student-open', 'student-open@example.edu'],
    studentSeq: ['prot-student-seq', 'student-seq@example.edu'],
    noConsent: ['prot-noconsent', 'noconsent@example.edu'],
    pending: ['prot-pending', 'pending@example.edu'],
    faculty: ['prot-faculty', 'faculty@example.edu'],
  };

  async function call(actor, url, body, expected = 200) {
    const headers = {};
    if (actor) {
      headers['oai-authenticated-user-id'] = actors[actor][0];
      headers['oai-authenticated-user-email'] = actors[actor][1];
    }
    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
      headers.Origin = 'https://worklab.test';
    }
    const r = await mf.dispatchFetch('https://worklab.test/api/' + url, {
      method: body === undefined ? 'GET' : 'POST',
      headers,
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    const text = await r.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { rawText: text };
    }
    assert.equal(r.status, expected, `${actor || 'anonymous'} ${url} returned ${r.status} (expected ${expected}): ${JSON.stringify(data).slice(0, 300)}`);
    return data;
  }

  // Setup cohorts: Open & Sequential
  const cOpen = await call('admin', 'admin/cohort', { name: 'Prot Cohort Open', policy: 'open' });
  const cSeq = await call('admin', 'admin/cohort', { name: 'Prot Cohort Sequential', policy: 'sequential' });

  // Setup roster
  await call('admin', 'admin/roster', {
    rows: [
      { email: actors.studentOpen[1], name: 'Student Open', studentId: 'PO1', cohort: cOpen.id, role: 'student', consent: true },
      { email: actors.studentSeq[1], name: 'Student Seq', studentId: 'PS1', cohort: cSeq.id, role: 'student', consent: true },
      { email: actors.noConsent[1], name: 'No Consent', studentId: 'NC1', cohort: cOpen.id, role: 'student', consent: false },
      { email: actors.faculty[1], name: 'Faculty Open', cohort: cOpen.id, role: 'faculty', consent: true },
    ]
  });

  // TEST 5: Anonymous single worksheet request -> 401
  const anonTemplateRes = await call(null, 'template/1', undefined, 401);
  assert.ok(anonTemplateRes.error.includes('Sign in'));

  // TEST 6: Anonymous bulk ZIP download request -> 401
  const anonZipRes = await call(null, 'template/all', undefined, 401);
  assert.ok(anonZipRes.error.includes('Sign in'));

  // TEST 7: Pending user single worksheet request -> 403
  const pendingRes = await call('pending', 'template/1', undefined, 403);
  assert.ok(pendingRes.error.includes('enrolment'));

  // TEST 8: Enrolled student without consent -> 403
  const noConsentRes = await call('noConsent', 'template/1', undefined, 403);
  assert.ok(noConsentRes.error.includes('consent'));

  // TEST 9: Enrolled student with consent in open cohort -> 200 OK (returns valid DOCX)
  const studentTemplateReq = await mf.dispatchFetch('https://worklab.test/api/template/1', {
    headers: {
      'oai-authenticated-user-id': actors.studentOpen[0],
      'oai-authenticated-user-email': actors.studentOpen[1],
    }
  });
  assert.equal(studentTemplateReq.status, 200);
  assert.ok(studentTemplateReq.headers.get('content-type').includes('wordprocessingml'));
  const docxBytes = new Uint8Array(await studentTemplateReq.arrayBuffer());
  assert.equal(docxBytes[0], 80); // 'P'
  assert.equal(docxBytes[1], 75); // 'K'

  // TEST 10: Time-locked session download -> 403
  await call('admin', 'admin/assignment', { cohort: cOpen.id, session: 2, unlock: '2099-01-01T00:00:00Z' });
  const timeLockedRes = await call('studentOpen', 'template/2', undefined, 403);
  assert.ok(timeLockedRes.error.includes('not opened yet'));

  // TEST 11: Sequential progression lock on worksheet download
  const seqLockedRes = await call('studentSeq', 'template/2', undefined, 403);
  assert.ok(seqLockedRes.error.includes('Submit the previous session worksheet'));

  // Submit Session 1 for sequential student
  const answers = { contribution: 'Worksheet download test', aiUse: 'None', reflection: 'Good' };
  const baseS1 = (await call(null, 'boot')).sessions[0];
  baseS1.blocks.forEach((b, i) => {
    if (b.type === 'text') answers['b' + i] = 'Ans ' + i;
    else b.rows.forEach((r, ri) => r.forEach((c, ci) => { if (c === '') answers[`b${i}r${ri}c${ci}`] = 'Working'; }));
  });
  await call('studentSeq', 'draft/1', { answers, revision: 0 });
  await call('studentSeq', 'submit/1', { revision: 1, integrity: true });

  // Now Session 2 is sequentially unlocked for studentSeq
  const studentSeqUnlocked = await mf.dispatchFetch('https://worklab.test/api/template/2', {
    headers: {
      'oai-authenticated-user-id': actors.studentSeq[0],
      'oai-authenticated-user-email': actors.studentSeq[1],
    }
  });
  assert.equal(studentSeqUnlocked.status, 200);

  // TEST 12: Admin bulk ZIP download -> 200 OK with all 24 sessions
  const adminZipReq = await mf.dispatchFetch('https://worklab.test/api/template/all', {
    headers: {
      'oai-authenticated-user-id': actors.admin[0],
      'oai-authenticated-user-email': actors.admin[1],
    }
  });
  assert.equal(adminZipReq.status, 200);
  assert.ok(adminZipReq.headers.get('content-type').includes('zip'));
  const { unzipSync } = await import('fflate');
  const zipParts = unzipSync(new Uint8Array(await adminZipReq.arrayBuffer()));
  assert.equal(Object.keys(zipParts).length, 24, 'Admin bulk zip must contain all 24 session worksheets');

  console.log('PASS: All 12 curriculum protection and authorized download checks passed.');
} finally {
  await mf.dispose();
}
