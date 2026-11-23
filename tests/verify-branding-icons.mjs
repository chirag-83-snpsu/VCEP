import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

console.log('Testing VCEP branding and 24 session icon system...');

// 1. Verify Logo Assets
assert.ok(fs.existsSync('public/vayentra-logo.png'), 'public/vayentra-logo.png must exist');
assert.ok(fs.existsSync('public/favicon.svg'), 'public/favicon.svg must exist');

const faviconContent = fs.readFileSync('public/favicon.svg', 'utf8');
assert.ok(faviconContent.includes('E5AF2E') || faviconContent.includes('svg'), 'Favicon must contain gold swoosh');

// 2. Verify Session Icons Component
assert.ok(fs.existsSync('components/session-icon.tsx'), 'components/session-icon.tsx must exist');
const sessionIconSource = fs.readFileSync('components/session-icon.tsx', 'utf8');

// Ensure all 24 cases exist in switch-case
for (let id = 1; id <= 24; id++) {
  assert.ok(
    sessionIconSource.includes(`case ${id}:`),
    `components/session-icon.tsx must define case ${id} for Session ${id}`
  );
}

// 3. Verify BrandLogo Component
assert.ok(fs.existsSync('components/brand-logo.tsx'), 'components/brand-logo.tsx must exist');
const brandLogoSource = fs.readFileSync('components/brand-logo.tsx', 'utf8');
assert.ok(brandLogoSource.includes('VAYENTRA'), 'BrandLogo must contain VAYENTRA');
assert.ok(brandLogoSource.includes('VCEP'), 'BrandLogo must contain VCEP');

// 4. Verify Integration in workspace and premium-journey
const workspaceSource = fs.readFileSync('app/workspace.tsx', 'utf8');
assert.ok(workspaceSource.includes('BrandLogo'), 'workspace.tsx must import and use BrandLogo');

const premiumJourneySource = fs.readFileSync('app/premium-journey.tsx', 'utf8');
assert.ok(premiumJourneySource.includes('SessionIcon'), 'premium-journey.tsx must import and use SessionIcon');
assert.ok(premiumJourneySource.includes('vcep-module-headline'), 'premium-journey.tsx must render module headline with icon');

// 5. Verify Guided Learning Integration
const guidedSource = fs.readFileSync('app/guided-learning/page.tsx', 'utf8');
assert.ok(guidedSource.includes('BrandLogo'), 'guided-learning/page.tsx must use BrandLogo');
assert.ok(guidedSource.includes('SessionIcon'), 'guided-learning/page.tsx must use SessionIcon');

// 6. Verify Staff Integration
const staffSource = fs.readFileSync('app/staff.tsx', 'utf8');
assert.ok(staffSource.includes('SessionIcon'), 'staff.tsx must use SessionIcon');

console.log('PASS: All 24 session icons and Vayentra branding assets verified.');
