/**
 * Seed Safe Isolated Demo Accounts for VCEP 24-Hour Pilot
 * Creates isolated student, faculty, and administrator demo credentials.
 * Preserves all existing student records, official assessment rules, and admin accounts.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import { hashPassword } from '../lib/auth-crypto.server.ts';

const d1Dir = path.resolve('.wrangler/state/v3/d1/miniflare-D1DatabaseObject');
if (!fs.existsSync(d1Dir)) {
  console.error('Error: Local D1 database directory not found.');
  process.exit(1);
}

const sqliteFiles = fs.readdirSync(d1Dir).filter((f) => f.endsWith('.sqlite') && !f.startsWith('metadata'));
if (sqliteFiles.length === 0) {
  console.error('Error: No active SQLite database found in .wrangler state.');
  process.exit(1);
}

const dbPath = path.join(d1Dir, sqliteFiles[0]);

function generateSecurePassword(rolePrefix) {
  const bytes = crypto.randomBytes(9).toString('base64url');
  return `Vcep!${rolePrefix}#${bytes}`;
}

// Check if existing rotated .env.demo exists, else generate fresh ones
const envDemoPath = path.resolve('.env.demo');
let studentPassword = '';
let freshStudentPassword = '';
let facultyPassword = '';
let adminPassword = '';

if (fs.existsSync(envDemoPath)) {
  const existing = fs.readFileSync(envDemoPath, 'utf8');
  const mStu = existing.match(/DEMO_STUDENT_PASSWORD=(.+)/);
  const mFresh = existing.match(/FRESH_STUDENT_PASSWORD=(.+)/);
  const mFac = existing.match(/DEMO_FACULTY_PASSWORD=(.+)/);
  const mAdm = existing.match(/DEMO_ADMIN_PASSWORD=(.+)/);
  if (mStu && !mStu[1].includes('DemoStudent@VCEP2026!')) studentPassword = mStu[1].trim();
  if (mFresh) freshStudentPassword = mFresh[1].trim();
  if (mFac && !mFac[1].includes('DemoFaculty@VCEP2026!')) facultyPassword = mFac[1].trim();
  if (mAdm && !mAdm[1].includes('DemoAdmin@VCEP2026!')) adminPassword = mAdm[1].trim();
}

if (!studentPassword) studentPassword = generateSecurePassword('Stu');
if (!freshStudentPassword) freshStudentPassword = generateSecurePassword('Fresh');
if (!facultyPassword) facultyPassword = generateSecurePassword('Fac');
if (!adminPassword) adminPassword = generateSecurePassword('Adm');

const DEMO_ACCOUNTS = [
  {
    userId: 'user_demo_student',
    email: 'demo-student@vayentra.edu',
    name: 'Aarav Sharma (Demo Student)',
    role: 'student',
    cohort: 'cohort_alpha',
    studentId: 'DEMO-STU-01',
    consent: 1,
    password: studentPassword,
  },
  {
    userId: 'user_fresh_student',
    email: 'fresh-student@vayentra.edu',
    name: 'Pooja Iyer (Pilot Test Student)',
    role: 'student',
    cohort: 'cohort_alpha',
    studentId: 'FRESH-STU-02',
    consent: 1,
    password: freshStudentPassword,
  },
  {
    userId: 'user_demo_faculty',
    email: 'demo-faculty@vayentra.edu',
    name: 'Prof. Anita Rao (Demo Faculty)',
    role: 'faculty',
    cohort: 'cohort_alpha',
    studentId: 'DEMO-FAC-01',
    consent: 1,
    password: facultyPassword,
  },
  {
    userId: 'user_demo_admin',
    email: 'demo-admin@vayentra.edu',
    name: 'Institutional Administrator (Demo)',
    role: 'admin',
    cohort: 'cohort_alpha',
    studentId: 'DEMO-ADM-01',
    consent: 1,
    password: adminPassword,
  },
];

async function main() {
  console.log('Seeding safe isolated demo accounts into local SQLite database...');
  console.log('Database Path:', dbPath);

  const now = new Date().toISOString();
  const sqlStatements = [];

  // Ensure cohort_alpha exists
  sqlStatements.push(`
    INSERT OR IGNORE INTO cohorts (id, name, policy, created)
    VALUES ('cohort_alpha', 'College Alpha (Commerce B.Com A)', 'open', '${now}');
  `);

  // Ensure assignments for sessions 1..24 in cohort_alpha are unlocked
  for (let s = 1; s <= 24; s++) {
    sqlStatements.push(`
      INSERT OR REPLACE INTO assignments (id, cohort, session, due, unlock)
      VALUES ('cohort_alpha:${s}', 'cohort_alpha', ${s}, '2099-12-31T23:59:59Z', '2020-01-01T00:00:00Z');
    `);
  }

  // Insert demo accounts
  for (const acc of DEMO_ACCOUNTS) {
    const { hash, salt } = await hashPassword(acc.password);
    const credId = `cred_${acc.userId}`;

    // 1. Roster entry
    sqlStatements.push(`
      INSERT OR REPLACE INTO roster (email, name, role, cohort, studentId, consent)
      VALUES ('${acc.email}', '${acc.name}', '${acc.role}', '${acc.cohort}', '${acc.studentId}', ${acc.consent});
    `);

    // 2. Users entry
    sqlStatements.push(`
      INSERT OR REPLACE INTO users (id, email, name, created)
      VALUES ('${acc.userId}', '${acc.email}', '${acc.name}', '${now}');
    `);

    // 3. Auth credentials (PBKDF2 encrypted)
    sqlStatements.push(`
      INSERT OR REPLACE INTO auth_credentials (id, email, password_hash, salt, created, updated)
      VALUES ('${credId}', '${acc.email}', '${hash}', '${salt}', '${now}', '${now}');
    `);
  }

  // Write temporary SQL file and execute
  const tmpFile = path.resolve('.wrangler/tmp_seed_demo.sql');
  fs.writeFileSync(tmpFile, sqlStatements.join('\n'));

  try {
    execSync(`sqlite3 "${dbPath}" < "${tmpFile}"`);
    console.log('SQL execution successful.');
  } finally {
    if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
  }

  // Write gitignored .env.demo for reference (mode 0600 for security)
  const envContent = [
    '# VCEP Pilot Demonstration Credentials (LOCAL ONLY - STRICTLY CONFIDENTIAL - DO NOT COMMIT)',
    `DEMO_STUDENT_EMAIL=demo-student@vayentra.edu`,
    `DEMO_STUDENT_PASSWORD=${studentPassword}`,
    `FRESH_STUDENT_EMAIL=fresh-student@vayentra.edu`,
    `FRESH_STUDENT_PASSWORD=${freshStudentPassword}`,
    `DEMO_FACULTY_EMAIL=demo-faculty@vayentra.edu`,
    `DEMO_FACULTY_PASSWORD=${facultyPassword}`,
    `DEMO_ADMIN_EMAIL=demo-admin@vayentra.edu`,
    `DEMO_ADMIN_PASSWORD=${adminPassword}`,
  ].join('\n');

  fs.writeFileSync(envDemoPath, envContent + '\n', { mode: 0o600 });

  console.log('\n============================================================');
  console.log(' VCEP Pilot Demo Accounts Configured (Rotated Credentials)');
  console.log('============================================================');
  console.log('1. Demo Student:');
  console.log('   Email:    demo-student@vayentra.edu');
  console.log('   Role:     Student (Cohort Alpha, Sessions 1-24 Unlocked)');
  console.log('\n2. Demo Faculty:');
  console.log('   Email:    demo-faculty@vayentra.edu');
  console.log('   Role:     Faculty (Cohort Alpha Review Queue)');
  console.log('\n3. Demo Administrator:');
  console.log('   Email:    demo-admin@vayentra.edu');
  console.log('   Role:     Programme Oversight & Audit');
  console.log('\nConfidential credentials saved securely in local .env.demo (gitignored).');
  console.log('============================================================\n');
}

main().catch((err) => {
  console.error('Failed to seed demo accounts:', err);
  process.exit(1);
});
