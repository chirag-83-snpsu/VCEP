import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const mfPath = path.join(
  process.cwd(),
  'node_modules/.pnpm',
  fs.readdirSync('node_modules/.pnpm').find(n => n.startsWith('miniflare@')),
  'node_modules/miniflare/dist/src/index.js'
);
const {Miniflare} = require(mfPath);

const mf = new Miniflare({
  modules: [
    {type: 'ESModule', path: path.resolve('dist/server/index.js')},
    ...fs.readdirSync('dist/server', {recursive: true})
      .filter(n => n.endsWith('.js') && n !== 'index.js')
      .map(n => ({type: 'ESModule', path: path.resolve('dist/server', n)}))
  ],
  compatibilityDate: '2026-05-15',
  compatibilityFlags: ['nodejs_compat'],
  d1Databases: {DB: 'test-worklab'},
  r2Buckets: ['BUCKET']
});

try {
  const db = await mf.getD1Database('DB');
  const sql = fs.readFileSync('drizzle/0000_sudden_anthem.sql', 'utf8');
  for (const statement of sql.split('--> statement-breakpoint').map(s => s.trim()).filter(Boolean)) {
    await db.prepare(statement).run();
  }

  const actors = {
    admin: ['sec-admin', 'vayentragurukula@gmail.com'],
    studentOpen: ['sec-student-open', 'student-open@example.edu'],
    studentSeq: ['sec-student-seq', 'student-seq@example.edu'],
    noConsentStudent: ['sec-noconsent', 'noconsent@example.edu'],
    faculty: ['sec-faculty', 'faculty@example.edu'],
    pending: ['sec-pending', 'pending@example.edu'],
    outsiderFaculty: ['sec-outsider-fac', 'outsider-fac@example.edu'],
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
      throw Error(`${url}: ${r.status} ${text.slice(0, 300)}`);
    }
    assert.equal(r.status, expected, `${actor || 'anonymous'} ${url} returned ${r.status} (expected ${expected}): ${JSON.stringify(data).slice(0, 300)}`);
    return data;
  }

  // 1. Setup cohorts: Cohort Open & Cohort Sequential
  const cOpen = await call('admin', 'admin/cohort', {name: 'Security Cohort Open', policy: 'open'});
  const cSeq = await call('admin', 'admin/cohort', {name: 'Security Cohort Sequential', policy: 'sequential'});

  // 2. Setup roster
  await call('admin', 'admin/roster', {
    rows: [
      {email: actors.studentOpen[1], name: 'Student Open', studentId: 'SO1', cohort: cOpen.id, role: 'student', consent: true},
      {email: actors.studentSeq[1], name: 'Student Seq', studentId: 'SS1', cohort: cSeq.id, role: 'student', consent: true},
      {email: actors.noConsentStudent[1], name: 'No Consent Student', studentId: 'NC1', cohort: cOpen.id, role: 'student', consent: false},
      {email: actors.faculty[1], name: 'Faculty Open', cohort: cOpen.id, role: 'faculty', consent: true},
    ]
  });

  // TEST 1: Anonymous request must receive 401
  const anonRes = await call(null, 'guided/session/1', undefined, 401);
  assert.ok(anonRes.error.includes('Sign in'));

  // TEST 2: Pending (unenrolled) user must receive 403
  const pendingRes = await call('pending', 'guided/session/1', undefined, 403);
  assert.ok(pendingRes.error.includes('enrolment'));

  // TEST 3: Student without consent must receive 403
  const noConsentRes = await call('noConsentStudent', 'guided/session/1', undefined, 403);
  assert.ok(noConsentRes.error.includes('consent'));

  // TEST 4: Enrolled student with consent in open cohort can fetch Session 1
  const s1Data = await call('studentOpen', 'guided/session/1', undefined, 200);
  assert.equal(s1Data.lesson.id, 1);
  assert.equal(s1Data.lesson.edition, 'Drive Student Pack 3.0');
  assert.ok(Array.isArray(s1Data.lesson.sourceTables));
  assert.ok(s1Data.lesson.workTables.length > 0);

  // TEST 5: Invalid session bounds return 400
  await call('studentOpen', 'guided/session/0', undefined, 400);
  await call('studentOpen', 'guided/session/25', undefined, 400);
  await call('studentOpen', 'guided/session/xyz', undefined, 400);

  // TEST 6: Time-locked session returns 403
  await call('admin', 'admin/assignment', {cohort: cOpen.id, session: 2, unlock: '2099-01-01T00:00:00Z'});
  const lockedRes = await call('studentOpen', 'guided/session/2', undefined, 403);
  assert.ok(lockedRes.error.includes('not opened yet'));

  // TEST 7: Sequential policy enforcement - Session 2 locked until Session 1 is submitted
  const seqRes = await call('studentSeq', 'guided/session/2', undefined, 403);
  assert.ok(seqRes.error.includes('Submit the previous session worksheet'));

  // Student 1 submits Session 1 worksheet in sequential cohort
  const answers = {contribution: 'Test sequential unlock', aiUse: 'None', reflection: 'Good'};
  const baseS1 = (await call(null, 'boot')).sessions[0];
  baseS1.blocks.forEach((b, i) => {
    if (b.type === 'text') answers['b' + i] = 'Ans ' + i;
    else b.rows.forEach((r, ri) => r.forEach((c, ci) => { if (c === '') answers[`b${i}r${ri}c${ci}`] = 'Working'; }));
  });
  await call('studentSeq', 'draft/1', {answers, revision: 0});
  await call('studentSeq', 'submit/1', {revision: 1, integrity: true});

  // Now Session 2 should unlock for studentSeq
  const seqUnlockedRes = await call('studentSeq', 'guided/session/2', undefined, 200);
  assert.equal(seqUnlockedRes.lesson.id, 2);

  // TEST 8: Faculty in assigned cohort can fetch lessons
  const facRes = await call('faculty', 'guided/session/1', undefined, 200);
  assert.equal(facRes.lesson.id, 1);

  // TEST 9: Outsider faculty (not in roster) cannot fetch lessons
  await call('outsiderFaculty', 'guided/session/1', undefined, 403);

  // TEST 10: Admin has full access to any session
  const adminRes = await call('admin', 'guided/session/22', undefined, 200);
  assert.equal(adminRes.lesson.id, 22);
  assert.equal(adminRes.lesson.aiPrompt, '', 'S22 controlled assessment must not expose AI prompt');

  console.log('PASS: All 10 negative & positive security checks for GET /api/guided/session/:id');
} finally {
  await mf.dispose();
}
