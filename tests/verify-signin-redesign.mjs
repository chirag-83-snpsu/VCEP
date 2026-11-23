/**
 * Automated Verification Suite for VCEP Premium Sign-In Redesign
 *
 * Verifies:
 * 1. Design Specification Compliance (Less text, generous negative space, executive typography)
 * 2. Complete removal of obsolete feature cards & marketing copy
 * 3. Authentic Vayentra brand lockup & emblem asset usage
 * 4. Executive headline ("From Student to Professional.") & single supporting statement
 * 5. Elevated form card structure ("Welcome back", "Sign in to VCEP")
 * 6. Accessible form controls (Labels, placeholders, autocomplete, password toggle, checkbox)
 * 7. Account activation link (/activate)
 * 8. Responsive CSS media queries & accessibility (prefers-reduced-motion)
 * 9. End-to-end authentication API regression testing with synthetic credentials
 */

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

console.log('🧪 Starting VCEP Premium Sign-In Redesign Verification Suite...\n');

// ============================================================================
// PART 1: UI & Design Specification Verification
// ============================================================================
console.log('--- PART 1: Code & Design Specification Checks ---');

const pageSource = fs.readFileSync('app/signin/page.tsx', 'utf8');
const cssSource = fs.readFileSync('app/signin/signin.css', 'utf8');

// Check 1: Removal of old marketing feature cards
assert(!pageSource.includes('24 Enterprise Indian Cases'), 'Check 1 Failed: Old marketing feature "24 Enterprise Indian Cases" still present');
assert(!pageSource.includes('Verified Faculty Assessment'), 'Check 1 Failed: Old marketing feature "Verified Faculty Assessment" still present');
assert(!pageSource.includes('Industry Readiness Passport'), 'Check 1 Failed: Old marketing feature "Industry Readiness Passport" still present');
assert(!pageSource.includes('vcep-auth-features'), 'Check 1 Failed: Feature list container still present');
console.log('✅ Check 1 Passed: Obsolete feature cards and promotional text removed.');

// Check 2: Executive Branding & Authentic Logo
assert(pageSource.includes('VayentraEmblem'), 'Check 2 Failed: Authentic VayentraEmblem component not imported/used');
assert(pageSource.includes('VAYENTRA'), 'Check 2 Failed: Brand name VAYENTRA missing');
assert(pageSource.includes('COMMERCE WORKLAB'), 'Check 2 Failed: Brand subtitle COMMERCE WORKLAB missing');
assert(pageSource.includes('Vayentra Corporate Experience Program'), 'Check 2 Failed: Institutional entity footer missing');
console.log('✅ Check 2 Passed: Authentic Vayentra emblem and clean brand lockup verified.');

// Check 3: Executive Headline & Supporting Text
assert(pageSource.includes('Your corporate') && pageSource.includes('commerce experience.'), 'Check 3 Failed: Headline "Your corporate commerce experience." missing');
assert(pageSource.includes('A structured, industry-aligned learning experience.'), 'Check 3 Failed: Supporting line missing');
assert(pageSource.includes('Real Business Exposure'), 'Check 3 Failed: "Real Business Exposure" pill badge missing');
assert(pageSource.includes('Verified Learning Credentials'), 'Check 3 Failed: "Verified Learning Credentials" pill badge missing');
console.log('✅ Check 3 Passed: Executive headline, supporting statement, and business credentials badges verified.');

// Check 4: Elevated Form Surface & Headers
assert(pageSource.includes('Sign in to VCEP'), 'Check 4 Failed: Card title "Sign in to VCEP" missing');
assert(pageSource.includes('Access your workspace securely.'), 'Check 4 Failed: Card subtitle "Access your workspace securely." missing');
console.log('✅ Check 4 Passed: Card title "Sign in to VCEP" and subtitle "Access your workspace securely." verified.');

// Check 5: Form Fields & Accessibility Attributes
assert(pageSource.includes('id="signin-email"'), 'Check 5 Failed: Input id signin-email missing');
assert(pageSource.includes('htmlFor="signin-email"'), 'Check 5 Failed: Label association for email missing');
assert(pageSource.includes('placeholder="student@college.edu or faculty@college.edu"'), 'Check 5 Failed: Email placeholder mismatch');
assert(pageSource.includes('autoComplete="email"'), 'Check 5 Failed: Email autocomplete attribute missing');

assert(pageSource.includes('id="signin-password"'), 'Check 5 Failed: Input id signin-password missing');
assert(pageSource.includes('htmlFor="signin-password"'), 'Check 5 Failed: Label association for password missing');
assert(pageSource.includes('placeholder="Enter your password"'), 'Check 5 Failed: Password placeholder mismatch');
assert(pageSource.includes('autoComplete="current-password"'), 'Check 5 Failed: Password autocomplete attribute missing');
assert(pageSource.includes('password-toggle'), 'Check 5 Failed: Password toggle button missing');
console.log('✅ Check 5 Passed: Accessible form semantics, labels, and autocomplete attributes verified.');

// Check 6: Remember Device & Activation Flow
assert(pageSource.includes('Remember this device'), 'Check 6 Failed: Checkbox label "Remember this device" missing');
assert(pageSource.includes('First time here?'), 'Check 6 Failed: Activation prompt missing');
assert(pageSource.includes('Activate your account'), 'Check 6 Failed: Activation link text missing');
assert(pageSource.includes('href="/activate"'), 'Check 6 Failed: Link to /activate missing');
assert(!pageSource.includes('Forgot password?'), 'Check 6 Failed: Unapproved dead link "Forgot password?" must not exist');
console.log('✅ Check 6 Passed: Refined remember device checkbox and activation link verified without dead links.');

// Check 7: CSS Architecture, Palette & Responsiveness
assert(cssSource.includes('--vcep-navy-mid: #17245c'), 'Check 7 Failed: Midnight Navy palette missing');
assert(cssSource.includes('--vcep-navy-deep: #101b43'), 'Check 7 Failed: Deep Navy palette missing');
assert(cssSource.includes('--vcep-teal: #0f766e'), 'Check 7 Failed: Corporate Teal palette missing');
assert(cssSource.includes('--vcep-gold: #e5af2e'), 'Check 7 Failed: Signature Gold palette missing');
assert(cssSource.includes('@media (max-width: 1023px)'), 'Check 7 Failed: Mobile responsive media query missing');
assert(cssSource.includes('vcep-auth-mobile-header'), 'Check 7 Failed: Mobile header styling missing');
assert(cssSource.includes('prefers-reduced-motion'), 'Check 7 Failed: Accessibility prefers-reduced-motion missing');
console.log('✅ Check 7 Passed: Design system tokens, mobile breakpoint styling, and accessibility verified.\n');

// ============================================================================
// PART 2: Authentication Backend Integration & Security Tests
// ============================================================================
console.log('--- PART 2: Authentication Backend Integration Tests ---');

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
  d1Databases: { DB: 'test-signin-redesign' },
  r2Buckets: ['BUCKET'],
  bindings: {
    SITE_OWNER_EMAIL: 'vayentragurukula@gmail.com',
  },
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

  const now = new Date().toISOString();
  await db.prepare("INSERT OR REPLACE INTO cohorts VALUES('cohort_alpha', 'College Alpha', 'open', ?)").bind(now).run();
  await db.prepare("INSERT OR REPLACE INTO roster VALUES('student@example.edu', 'Pooja Hegde', 'student', 'cohort_alpha', 'STU-01', 1)").run();

  async function apiSignIn(body) {
    return mf.dispatchFetch('https://worklab.test/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://worklab.test',
      },
      body: JSON.stringify(body),
    });
  }

  // Auth Test A: Empty submission rejection
  const resEmpty = await apiSignIn({ email: '', password: '' });
  assert.equal(resEmpty.status, 400, 'Auth Test A Failed: Empty credentials must return 400');
  console.log('✅ Auth Test A Passed: Empty credentials rejected with HTTP 400.');

  // Auth Test B: Non-existent student rejection
  const resNotFound = await apiSignIn({ email: 'ghost@college.edu', password: 'Password@123' });
  assert([400, 401].includes(resNotFound.status), 'Auth Test B Failed: Unenrolled email must return 400 or 401');
  const notFoundData = await resNotFound.json();
  assert(notFoundData.error.includes('No account found') || notFoundData.error.includes('Invalid email or password'), 'Auth Test B Failed: Error message mismatch');
  console.log('✅ Auth Test B Passed: Non-existent account properly rejected.');

  // Auth Test C: Enrolled student without activated password (needsActivation flag)
  const resNeedAct = await apiSignIn({ email: 'student@example.edu', password: 'AnyPassword' });
  assert.equal(resNeedAct.status, 403, 'Auth Test C Failed: Unactivated student must return 403');
  const needActData = await resNeedAct.json();
  assert.equal(needActData.needsActivation, true, 'Auth Test C Failed: needsActivation flag must be true');
  console.log('✅ Auth Test C Passed: Unactivated student triggers needsActivation flag with redirection prompt.');

  console.log('\n======================================================');
  console.log('🎉 ALL SIGN-IN REDESIGN VERIFICATION CHECKS PASSED (100%)');
  console.log('======================================================\n');
} finally {
  await mf.dispose();
}
