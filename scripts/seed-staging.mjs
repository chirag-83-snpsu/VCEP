/**
 * Synthetic Staging Seed Generator for VCEP v1.0
 * Generates mock cohorts, faculty, and synthetic test students (0 real PII).
 * Usage: node scripts/seed-staging.mjs [--output=staging-seed.sql]
 */
import fs from 'node:fs';
import path from 'node:path';

const now = new Date().toISOString();

const cohorts = [
  { id: 'cohort_alpha', name: 'College Alpha (Commerce B.Com A)', policy: 'open', created: now },
  { id: 'cohort_beta', name: 'College Beta (Commerce BBA B)', policy: 'sequential', created: now }
];

const roster = [
  // College Alpha Roster
  { email: 'student-alpha1@example.edu', name: 'Aarav Sharma', role: 'student', cohort: 'cohort_alpha', studentId: 'CA-2026-001', consent: 1 },
  { email: 'student-alpha2@example.edu', name: 'Ananya Iyer', role: 'student', cohort: 'cohort_alpha', studentId: 'CA-2026-002', consent: 1 },
  { email: 'student-noconsent@example.edu', name: 'Rohan Gupta', role: 'student', cohort: 'cohort_alpha', studentId: 'CA-2026-003', consent: 0 },
  { email: 'faculty-alpha@example.edu', name: 'Prof. Anita Rao', role: 'faculty', cohort: 'cohort_alpha', studentId: 'FAC-A-01', consent: 1 },

  // College Beta Roster
  { email: 'student-beta1@example.edu', name: 'Diya Patel', role: 'student', cohort: 'cohort_beta', studentId: 'CB-2026-001', consent: 1 },
  { email: 'student-beta2@example.edu', name: 'Kabir Verma', role: 'student', cohort: 'cohort_beta', studentId: 'CB-2026-002', consent: 1 },
  { email: 'faculty-beta@example.edu', name: 'Prof. Suresh Nair', role: 'faculty', cohort: 'cohort_beta', studentId: 'FAC-B-01', consent: 1 },

  // Administrator
  { email: 'vayentragurukula@gmail.com', name: 'VCEP Programme Administrator', role: 'admin', cohort: 'cohort_alpha', studentId: 'ADMIN-01', consent: 1 }
];

const statements = [];

// Cohorts
for (const c of cohorts) {
  statements.push(`INSERT OR REPLACE INTO cohorts (id, name, policy, created) VALUES ('${c.id}', '${c.name}', '${c.policy}', '${c.created}');`);
}

// Roster
for (const r of roster) {
  statements.push(`INSERT OR REPLACE INTO roster (email, name, role, cohort, studentId, consent) VALUES ('${r.email}', '${r.name}', '${r.role}', '${r.cohort}', '${r.studentId}', ${r.consent});`);
}

// Assignments for Cohort Alpha (All unlocked)
for (let s = 1; s <= 24; s++) {
  statements.push(`INSERT OR REPLACE INTO assignments (id, cohort, session, due, unlock) VALUES ('cohort_alpha:${s}', 'cohort_alpha', ${s}, '2099-12-31T23:59:59Z', '2020-01-01T00:00:00Z');`);
}

// Assignments for Cohort Beta (Session 1 unlocked, Session 2+ sequential)
for (let s = 1; s <= 24; s++) {
  statements.push(`INSERT OR REPLACE INTO assignments (id, cohort, session, due, unlock) VALUES ('cohort_beta:${s}', 'cohort_beta', ${s}, '2099-12-31T23:59:59Z', '2020-01-01T00:00:00Z');`);
}

const outputPath = path.resolve('drizzle/staging-seed.sql');
fs.writeFileSync(outputPath, statements.join('\n') + '\n');
console.log(`Successfully generated synthetic staging seed at ${outputPath} (${statements.length} SQL statements).`);
