import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { generateInvitationToken } from '../lib/auth-crypto.server.ts';

const ownerEmail = 'vayentragurukula@gmail.com';

// Locate local Miniflare D1 database file
const d1Dir = path.resolve('.wrangler/state/v3/d1/miniflare-D1DatabaseObject');
if (!fs.existsSync(d1Dir)) {
  console.error('Error: Local D1 database directory not found. Please ensure the dev server has been started.');
  process.exit(1);
}

const sqliteFiles = fs.readdirSync(d1Dir).filter((f) => f.endsWith('.sqlite') && !f.startsWith('metadata'));
if (sqliteFiles.length === 0) {
  console.error('Error: No active SQLite database found in .wrangler state.');
  process.exit(1);
}

const dbPath = path.join(d1Dir, sqliteFiles[0]);

async function main() {
  const { token, tokenHash } = await generateInvitationToken();
  const invId = crypto.randomUUID();
  const now = new Date().toISOString();
  const expires = new Date(Date.now() + 7 * 86400000).toISOString();

  // Invalidate previous invitations and insert the new admin invitation token
  const sql = `
    UPDATE invitations SET used = 1 WHERE lower(email) = '${ownerEmail}' AND used = 0;
    INSERT INTO invitations (id, email, token_hash, role, cohort, expires, used, created)
    VALUES ('${invId}', '${ownerEmail}', '${tokenHash}', 'admin', 'cohort_alpha', '${expires}', 0, '${now}');
  `;

  const tmpSql = path.resolve('.wrangler/tmp_admin_invite.sql');
  fs.writeFileSync(tmpSql, sql);
  try {
    execSync(`sqlite3 "${dbPath}" < "${tmpSql}"`);
  } finally {
    if (fs.existsSync(tmpSql)) fs.unlinkSync(tmpSql);
  }

  console.log('\n============================================================');
  console.log(' VCEP Administrator Activation Link Generated Successfully');
  console.log('============================================================');
  console.log('Email:    ' + ownerEmail);
  console.log('Role:     Administrator');
  console.log('Validity: 7 days');
  console.log('\nOpen this URL in your browser to set your personal password:');
  console.log(`http://localhost:5173/activate?token=${token}\n`);
  console.log('Once set, you can sign in directly at http://localhost:5173/signin');
  console.log('============================================================\n');
}

main().catch((err) => {
  console.error('Failed to issue admin invite:', err);
  process.exit(1);
});
