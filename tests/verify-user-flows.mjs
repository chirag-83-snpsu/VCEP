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

console.log('Running VCEP Interactive User Flow Walkthrough Test Suite...');

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
  d1Databases: { DB: 'test-user-flows' },
  r2Buckets: ['BUCKET'],
});

try {
  const db = await mf.getD1Database('DB');

  // Initialize schema
  const sql0 = fs.readFileSync('drizzle/0000_sudden_anthem.sql', 'utf8');
  for (const s of sql0.split('--> statement-breakpoint').map((s) => s.trim()).filter(Boolean)) {
    await db.prepare(s).run();
  }
  const sql1 = fs.readFileSync('drizzle/0001_vcep_auth.sql', 'utf8');
  for (const s of sql1.split('--> statement-breakpoint').map((s) => s.trim()).filter(Boolean)) {
    await db.prepare(s).run();
  }

  const adminEmail = 'vayentragurukula@gmail.com';
  const facultyEmail = 'coordinator.commerce@citycollege.edu';
  const studentEmail = 'ananya.sharma@citycollege.edu';
  const pendingEmail = 'unregistered.guest@example.com';

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

  // ==========================================
  // STEP 1: Admin Initial Setup & Invitations
  // ==========================================
  console.log('\n--- STEP 1: Administrator Provisioning & Roster Setup ---');
  const adminHeaders = {
    'oai-authenticated-user-id': 'admin-bootstrap-uid',
    'oai-authenticated-user-email': adminEmail,
  };

  // Create Cohort
  const cohortRes = await api('admin/cohort', {
    method: 'POST',
    headers: adminHeaders,
    body: { name: 'City College · B.Com 2026 · Morning Shift', policy: 'open' },
  });
  assert.equal(cohortRes.status, 200);
  const { id: cohortId } = await cohortRes.json();
  console.log('✓ Created cohort:', cohortId);

  // Enroll Student & Faculty on Roster
  const rosterRes = await api('admin/roster', {
    method: 'POST',
    headers: adminHeaders,
    body: {
      rows: [
        { email: studentEmail, name: 'Ananya Sharma', studentId: 'CC-BCOM-1042', role: 'student', cohort: cohortId, consent: true },
        { email: facultyEmail, name: 'Dr. R. K. Nambiar', studentId: 'FAC-COMM-018', role: 'faculty', cohort: cohortId, consent: true }
      ],
    },
  });
  assert.equal(rosterRes.status, 200);
  console.log('✓ Provisioned roster with Student and Faculty members');

  // Verify boot returns roster with activated=0 and pending_invites=0
  const bootAdmin = await api('boot', { headers: adminHeaders });
  const bootAdminData = await bootAdmin.json();
  assert.equal(bootAdminData.user.role, 'admin');
  const sRoster = bootAdminData.roster.find((r) => r.email === studentEmail);
  assert.equal(sRoster.activated, 0);
  assert.equal(sRoster.pending_invites, 0);
  console.log('✓ Verified admin boot reflects unactivated, uninvited student state');

  // Admin generates invitation for Student
  const inviteStudentRes = await api('admin/invite', {
    method: 'POST',
    headers: adminHeaders,
    body: { email: studentEmail },
  });
  assert.equal(inviteStudentRes.status, 200);
  const inviteStudent = await inviteStudentRes.json();
  assert.ok(inviteStudent.token.startsWith('vcep_act_'));
  assert.ok(inviteStudent.inviteUrl.includes(inviteStudent.token));
  console.log('✓ Generated student invitation token:', inviteStudent.token.slice(0, 18) + '...');

  // Admin generates invitation for Faculty
  const inviteFacultyRes = await api('admin/invite', {
    method: 'POST',
    headers: adminHeaders,
    body: { email: facultyEmail },
  });
  assert.equal(inviteFacultyRes.status, 200);
  const inviteFaculty = await inviteFacultyRes.json();
  console.log('✓ Generated faculty invitation token:', inviteFaculty.token.slice(0, 18) + '...');

  // ==========================================
  // STEP 2: Student Activation & Sign-In Flow
  // ==========================================
  console.log('\n--- STEP 2: Student Account Activation & Access Flow ---');

  // Attempt login before activation -> 403 needsActivation
  const earlyLogin = await api('auth/signin', {
    method: 'POST',
    body: { email: studentEmail, password: 'Password123!' },
  });
  assert.equal(earlyLogin.status, 403);
  const earlyLoginData = await earlyLogin.json();
  assert.equal(earlyLoginData.needsActivation, true);
  console.log('✓ Unactivated login attempt blocked with needsActivation: true');

  // Verify invitation details
  const checkToken = await api(`auth/invitation?token=${inviteStudent.token}`);
  assert.equal(checkToken.status, 200);
  const tokenDetails = await checkToken.json();
  assert.equal(tokenDetails.email, studentEmail);
  assert.equal(tokenDetails.role, 'student');
  console.log('✓ Validated invitation token matches rostered student email & role');

  // Activate Account
  const studentPassword = 'SecureStudentPassword2026!';
  const activateRes = await api('auth/activate', {
    method: 'POST',
    body: {
      token: inviteStudent.token,
      password: studentPassword,
      name: 'Ananya Sharma',
    },
  });
  assert.equal(activateRes.status, 200);
  const activateData = await activateRes.json();
  assert.equal(activateData.ok, true);
  assert.equal(activateData.redirectUrl, '/');
  const studentCookie = activateRes.headers.get('set-cookie');
  assert.ok(studentCookie.includes('__vcep_session='));
  console.log('✓ Student account activated successfully with session cookie set');

  // Token reuse blocked
  const reuseToken = await api('auth/activate', {
    method: 'POST',
    body: { token: inviteStudent.token, password: 'AnotherPassword123!' },
  });
  assert.equal(reuseToken.status, 400);
  console.log('✓ Prevented single-use invitation token reuse');

  // Student signs in via credentials
  const studentLoginRes = await api('auth/signin', {
    method: 'POST',
    body: { email: studentEmail, password: studentPassword },
  });
  assert.equal(studentLoginRes.status, 200);
  const studentLogin = await studentLoginRes.json();
  assert.equal(studentLogin.redirectUrl, '/');
  const loggedInCookie = studentLoginRes.headers.get('set-cookie');
  const cookieValue = loggedInCookie.split(';')[0];
  console.log('✓ Student logged in successfully with redirectUrl: /');

  // Student calls /api/boot using cookie
  const studentBoot = await api('boot', {
    headers: { Cookie: cookieValue },
  });
  assert.equal(studentBoot.status, 200);
  const studentBootData = await studentBoot.json();
  assert.equal(studentBootData.user.role, 'student');
  assert.equal(studentBootData.user.name, 'Ananya Sharma');
  assert.equal(studentBootData.sessions.length, 24);
  assert.ok(Array.isArray(studentBootData.drafts));
  console.log('✓ Student boot loaded all 24 commerce sessions and draft storage');

  // ==========================================
  // STEP 3: Faculty Activation & Workspace Flow
  // ==========================================
  console.log('\n--- STEP 3: Faculty Account Activation & Roster Workspace Flow ---');

  // Faculty activates account
  const facultyPassword = 'FacultySecurePassword2026!';
  const activateFacultyRes = await api('auth/activate', {
    method: 'POST',
    body: {
      token: inviteFaculty.token,
      password: facultyPassword,
      name: 'Dr. R. K. Nambiar',
    },
  });
  assert.equal(activateFacultyRes.status, 200);
  console.log('✓ Faculty account activated');

  // Faculty signs in
  const facultyLoginRes = await api('auth/signin', {
    method: 'POST',
    body: { email: facultyEmail, password: facultyPassword },
  });
  assert.equal(facultyLoginRes.status, 200);
  const facultyLogin = await facultyLoginRes.json();
  assert.equal(facultyLogin.redirectUrl, '/?view=faculty');
  const facultyCookie = facultyLoginRes.headers.get('set-cookie').split(';')[0];
  console.log('✓ Faculty logged in with redirectUrl: /?view=faculty');

  // Faculty calls /api/boot
  const facultyBoot = await api('boot', {
    headers: { Cookie: facultyCookie },
  });
  assert.equal(facultyBoot.status, 200);
  const facultyBootData = await facultyBoot.json();
  assert.equal(facultyBootData.user.role, 'faculty');
  assert.ok(facultyBootData.roster.length >= 2);
  const studentInFacultyRoster = facultyBootData.roster.find((r) => r.email === studentEmail);
  assert.equal(studentInFacultyRoster.activated, 1);
  console.log('✓ Faculty boot confirms student is marked activated (activated: 1)');

  // Faculty re-issues invitation for student
  const facultyInviteStudent = await api('admin/invite', {
    method: 'POST',
    headers: { Cookie: facultyCookie },
    body: { email: studentEmail },
  });
  assert.equal(facultyInviteStudent.status, 200);
  const reissued = await facultyInviteStudent.json();
  assert.ok(reissued.token.startsWith('vcep_act_'));
  console.log('✓ Faculty coordinator successfully re-issued invitation token for cohort student');

  // ==========================================
  // STEP 4: Un-enrolled / Pending Flow
  // ==========================================
  console.log('\n--- STEP 4: Un-enrolled / Pending Account Flow ---');

  // User not in roster attempts signin -> 401
  const unknownUser = await api('auth/signin', {
    method: 'POST',
    body: { email: pendingEmail, password: 'AnyPassword123!' },
  });
  assert.equal(unknownUser.status, 401);
  console.log('✓ Unknown non-rostered user denied access (401)');

  // ==========================================
  // STEP 5: Sign-Out & Cookie Clearance Flow
  // ==========================================
  console.log('\n--- STEP 5: Secure Session Termination (Sign-Out) Flow ---');

  // Student signs out
  const signoutRes = await api('auth/signout', {
    method: 'POST',
    headers: { Cookie: cookieValue },
  });
  assert.equal(signoutRes.status, 200);
  const signoutCookie = signoutRes.headers.get('set-cookie');
  assert.ok(signoutCookie.includes('Max-Age=0'));
  console.log('✓ Sign-out revoked session and cleared cookie with Max-Age=0');

  // Subsequent call with revoked session resolves as unauthenticated
  const postSignoutBoot = await api('boot', {
    headers: { Cookie: cookieValue },
  });
  assert.equal(postSignoutBoot.status, 200);
  const postSignoutData = await postSignoutBoot.json();
  assert.equal(postSignoutData.user, null);
  console.log('✓ Confirmed revoked session resolves to unauthenticated public state');

  console.log('\n======================================================');
  console.log('PASS: ALL 5 USER FLOW WALKTHROUGHS VERIFIED CLEANLY!');
  console.log('======================================================\n');
} finally {
  await mf.dispose();
}
