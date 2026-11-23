/**
 * Regression: the Guided Learning submission prompt must use the real sign-in
 * route, and return to the same session after authentication.
 * Run from repository root: node tests/verify-guided-submission-link.mjs
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const page = readFileSync('app/guided-learning/page.tsx', 'utf8');
const signin = readFileSync('app/signin/page.tsx', 'utf8');
assert.doesNotMatch(page, /href=\{\x60\/?\?signin=1\x60\}/, 'Legacy nonfunctional sign-in link must not remain');
assert.match(page, /\/signin\?return_to=\$\{encodeURIComponent\(/, 'Submission sign-in must preserve the requested session');
assert.match(signin, /safeRelativeReturnPath/, 'Sign-in must sanitize return_to');
console.log('PASS: Guided Learning submission sign-in uses the valid protected return route.');
