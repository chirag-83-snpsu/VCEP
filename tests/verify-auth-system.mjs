import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const mfPath = path.join(
  process.cwd(),
  'node_modules/.pnpm',
  fs.readdirSync('node_modules/.pnpm').find((n) => n.startsWith('miniflare@')),
  'node_modules/miniflare/dist/src/index.js'
);
const { Miniflare } = require(mfPath);

console.log('Testing VCEP Premium Authentication & User Account System...');

const mf = new Miniflare({
  modules: [
    { type: 'ESModule', path: path.resolve('dist/server/index.js') },
    ...fs
      .readdirSync('dist/server', { recursive: true })
      .filter((n) => n.endsWith('.js') && n !== 'index.js')
      .map((n) => ({ type: 'ESModule', path: path.resolve('dist/server', n) })),
  ],
  compatibilityDate: '2026-05-15',
  compatibilityFlags: ['nodejs_compat'],
  d1Databases: { DB: 'test-worklab-auth' },
  r2Buckets: ['BUCKET'],
});

try {
  const db = await mf.getD1Database('DB');
  const sql0 = fs.readFileSync('drizzle/0000_sudden_anthem.sql', 'utf8');
  for (const statement of sql0.split('--> statement-breakpoint').map((s) => s.trim()).filter(Boolean)) {
    await db.prepare(statement).run();
  }
  const sql1 = fs.readFileSync('drizzle/0001_vcep_auth.sql', 'utf8');
  for (const statement of sql1.split('--> statement-breakpoint').map((s) => s.trim()).filter(Boolean)) {
    await db.prepare(statement).run();
  }

  const adminEmail = 'vayentragurukula@gmail.com';
  const studentEmail = 'student-alpha@example.edu';
  const facultyEmail = 'faculty-alpha@example.edu';

  // Helper API caller
  async function api(path, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      Origin: 'https://worklab.test',
      ...options.headers,
    };
    return mf.dispatchFetch('https://worklab.test/api/' + path, {
      method: options.method || 'GET',
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  }

  // 1. Create a cohort and roster entries as admin
  const adminHeaders = {
    'oai-authenticated-user-id': 'admin-uid',
    'oai-authenticated-user-email': adminEmail,
  };
  const cRes = await api('admin/cohort', {
    method: 'POST',
    headers: adminHeaders,
    body: { name: 'Batch 2026 Alpha', policy: 'open' },
  });
  assert.equal(cRes.status, 200);
  const cohort = await cRes.json();

  const rRes = await api('admin/roster', {
    method: 'POST',
    headers: adminHeaders,
    body: {
      rows: [
        { email: studentEmail, name: 'Aarav Sharma', role: 'student', cohort: cohort.id, studentId: 'ST-001', consent: true },
        { email: facultyEmail, name: 'Dr. Anita Rao', role: 'faculty', cohort: cohort.id, studentId: 'FAC-001', consent: true },
      ],
    },
  });
  assert.equal(rRes.status, 200);

  // 2. Sign in with unactivated student -> 403 needsActivation
  const unactRes = await api('auth/signin', {
    method: 'POST',
    body: { email: studentEmail, password: 'AnyPassword123' },
  });
  assert.equal(unactRes.status, 403);
  const unactData = await unactRes.json();
  assert.equal(unactData.needsActivation, true);

  // 3. Admin generates invitation token for student
  const invRes = await api('admin/invite', {
    method: 'POST',
    headers: adminHeaders,
    body: { email: studentEmail },
  });
  assert.equal(invRes.status, 200);
  const invData = await invRes.json();
  assert.ok(invData.token.startsWith('vcep_act_'));
  assert.equal(invData.email, studentEmail);

  // 4. Validate invitation token via GET /api/auth/invitation
  const checkInv = await api(`auth/invitation?token=${invData.token}`);
  assert.equal(checkInv.status, 200);
  const checkData = await checkInv.json();
  assert.equal(checkData.email, studentEmail);
  assert.equal(checkData.role, 'student');
  assert.equal(checkData.cohortName, 'Batch 2026 Alpha');

  // 5. Invalid token check
  const badInv = await api('auth/invitation?token=invalid_token_xyz');
  assert.equal(badInv.status, 404);

  // 6. Student activates account with password
  const actRes = await api('auth/activate', {
    method: 'POST',
    body: {
      token: invData.token,
      password: 'SecureStudentPass2026!',
      name: 'Aarav Sharma',
    },
  });
  assert.equal(actRes.status, 200);
  const actData = await actRes.json();
  assert.equal(actData.ok, true);
  assert.equal(actData.user.email, studentEmail);
  assert.equal(actData.user.role, 'student');
  assert.equal(actData.redirectUrl, '/');

  const setCookie = actRes.headers.get('set-cookie');
  assert.ok(setCookie.includes('__vcep_session='));
  assert.ok(setCookie.includes('HttpOnly'));

  // 7. Token reuse must fail (single-use constraint)
  const reuseRes = await api('auth/activate', {
    method: 'POST',
    body: {
      token: invData.token,
      password: 'AnotherPassword123!',
    },
  });
  assert.equal(reuseRes.status, 400);

  // 8. Sign in with wrong password -> 401
  const wrongPwdRes = await api('auth/signin', {
    method: 'POST',
    body: { email: studentEmail, password: 'WrongPassword!' },
  });
  assert.equal(wrongPwdRes.status, 401);

  // 9. Sign in with correct password -> 200 & session cookie
  const loginRes = await api('auth/signin', {
    method: 'POST',
    body: { email: studentEmail, password: 'SecureStudentPass2026!' },
  });
  assert.equal(loginRes.status, 200);
  const loginData = await loginRes.json();
  assert.equal(loginData.ok, true);
  assert.equal(loginData.user.role, 'student');

  const sessionCookie = loginRes.headers.get('set-cookie');
  const sessionToken = sessionCookie.split('__vcep_session=')[1].split(';')[0];

  // 10. Access protected /api/boot using session cookie (no OpenAI headers!)
  const bootRes = await mf.dispatchFetch('https://worklab.test/api/boot', {
    headers: {
      Cookie: `__vcep_session=${sessionToken}`,
    },
  });
  assert.equal(bootRes.status, 200);
  const bootData = await bootRes.json();
  assert.ok(bootData.user);
  assert.equal(bootData.user.email, studentEmail);
  assert.equal(bootData.user.role, 'student');
  assert.equal(bootData.user.cohort, cohort.id);

  // 11. Sign out -> clears cookie & deletes session
  const signoutRes = await mf.dispatchFetch('https://worklab.test/api/auth/signout', {
    method: 'POST',
    headers: {
      Origin: 'https://worklab.test',
      Cookie: `__vcep_session=${sessionToken}`,
    },
  });
  assert.equal(signoutRes.status, 200);
  const clearCookie = signoutRes.headers.get('set-cookie');
  assert.ok(clearCookie.includes('Max-Age=0'));

  // 12. Subsequent /api/boot is unauthenticated
  const bootAfterRes = await mf.dispatchFetch('https://worklab.test/api/boot', {
    headers: {
      Cookie: `__vcep_session=${sessionToken}`,
    },
  });
  assert.equal(bootAfterRes.status, 200);
  const bootAfterData = await bootAfterRes.json();
  assert.equal(bootAfterData.user, null);

  console.log('PASS: All 12 authentication, activation, session, and role tests passed!');
} finally {
  await mf.dispose();
}
