/**
 * Automated Verification Suite for Vivi Voice Assistant (Phases 1-11)
 *
 * Verifies:
 * 1. Speech Text Normalization (Greetings, Accounting, Finance Acronyms, Currency, Formulas, Kannada)
 * 2. Anonymous Access Rejection (401)
 * 3. Pending Enrolment Rejection (403)
 * 4. Controlled Assessment Lockout - Session 22 Exit B (403)
 * 5. Controlled Assessment Lockout - Session 01 Stage 1 Baseline (403)
 * 6. Empty Input Validation (400)
 * 7. Oversized Input Validation (> 2,500 chars) (413)
 * 8. Speech Speed Options Validation (0.85, 0.95, 1.10)
 * 9. Unconfigured TTS Provider Fallback (Structured 200 JSON with normalizedText for Web Speech API)
 * 10. Configured Cloud TTS Stream (audio/mpeg with model: 'tts-1', voice: 'nova')
 * 11. Rate Limiting Protection (429 on excessive bursts)
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';
import { normalizeEducationalSpeech } from '../lib/vivi/vivi-speech-normalizer.ts';

const require = createRequire(import.meta.url);
const mfPath = path.join(
  process.cwd(),
  'node_modules/.pnpm',
  fs.readdirSync('node_modules/.pnpm').find((n) => n.startsWith('miniflare@')),
  'node_modules/miniflare/dist/src/index.js'
);
const { Miniflare } = require(mfPath);

console.log('🧪 Starting Vivi Voice Assistant Verification Suite...\n');

// ============================================================================
// PART 1: Unit Verification of Speech Normalizer (Tests 1 - 6)
// ============================================================================
console.log('--- PART 1: Speech Normalizer Tests ---');

// Test 1: Welcome Greeting Normalization
const greetingRaw = '**Hi, I am Vivi! Your Voice & AI Learning Partner.**\n\nI can explain corporate commerce concepts, guide you through workstation formulas, or speak directly with you! Tap the microphone to talk or choose a topic below.';
const greetingNorm = normalizeEducationalSpeech(greetingRaw, 'en');
assert(!greetingNorm.includes('**'), 'Test 1 Failed: Markdown bold tokens not stripped');
assert(greetingNorm.includes('Hi, I am Vivi! Your Voice & AI Learning Partner.'), 'Test 1 Failed: Missing greeting title');
console.log('✅ Test 1 Passed: Welcome greeting normalized cleanly.');

// Test 2: Accounting Terminology & Indian Currency
const accountingRaw = 'Record the machinery purchase: Dr. Machinery A/c ₹25,00,000, Cr. Bank Loan ₹15,00,000, Cr. Cash ₹10,00,000. Balance Sheet total increases by ₹15 Lakhs.';
const accountingNorm = normalizeEducationalSpeech(accountingRaw, 'en');
assert(!accountingNorm.includes('₹'), 'Test 2 Failed: ₹ symbol not normalized');
assert(accountingNorm.includes('rupees'), 'Test 2 Failed: Currency word "rupees" missing');
assert(accountingNorm.includes('Debit Machinery Account'), 'Test 2 Failed: Dr. / A/c not expanded to Debit / Account');
assert(accountingNorm.includes('Credit Bank Loan'), 'Test 2 Failed: Cr. not expanded to Credit');
console.log('✅ Test 2 Passed: Accounting terminology and Indian currency formatted naturally.');

// Test 3: Financial Metrics & Acronym Cadence
const financeRaw = 'Compare EBITDA, CAGR, ROI, and COGS for FY 2024-25. Review the P&L statement, BRS, and GST ITC.';
const financeNorm = normalizeEducationalSpeech(financeRaw, 'en');
assert(financeNorm.includes('E-bit-da'), 'Test 3 Failed: EBITDA not expanded to E-bit-da');
assert(financeNorm.includes('cag-er'), 'Test 3 Failed: CAGR not expanded to cag-er');
assert(financeNorm.includes('R-O-I'), 'Test 3 Failed: ROI not hyphenated for letter pacing');
assert(financeNorm.includes('P and L'), 'Test 3 Failed: P&L not expanded to P and L');
assert(financeNorm.includes('G-S-T'), 'Test 3 Failed: GST not hyphenated for clear letter pronunciation');
console.log('✅ Test 3 Passed: Financial acronyms and metrics formatted with natural educational cadence.');

// Test 4: Professional Communication Formatting
const commsRaw = 'Here is the draft:\n- Subject: Invoice #1042 Reminder\n- Dear Client,\n- Please settle the overdue balance of ₹45,000 by Friday.\n\nThank you.';
const commsNorm = normalizeEducationalSpeech(commsRaw, 'en');
assert(!commsNorm.includes('#1042'), 'Test 4 Failed: # symbol not expanded or stripped');
assert(commsNorm.includes('Number 1042'), 'Test 4 Failed: # not expanded to Number');
assert(!commsNorm.includes('- '), 'Test 4 Failed: Bullet markers not removed');
console.log('✅ Test 4 Passed: Professional email draft formatted with natural pauses and polite cadence.');

// Test 5: Mixed English-Kannada Content
const kannadaRaw = 'GST ಎಂದರೇನು? Goods and Services Tax ಬಗ್ಗೆ ವಿವರಿಸಿ. ₹5,000 ತೆರಿಗೆ ಲೆಕ್ಕಾಚಾರ.';
const kannadaNorm = normalizeEducationalSpeech(kannadaRaw, 'kn');
assert(!kannadaNorm.includes('₹'), 'Test 5 Failed: ₹ symbol not converted in Kannada mode');
assert(kannadaNorm.includes('ರೂಪಾಯಿ'), 'Test 5 Failed: Kannada currency ರೂಪಾಯಿ missing');
console.log('✅ Test 5 Passed: Kannada currency and mixed script preserved naturally.');

// Test 6: Multi-paragraph Long Answer Handling
const longTextRaw = 'Paragraph one explains working capital management and operating cycles.\n\nParagraph two details accounts receivable factoring and inventory turnover ratio = COGS / Average Inventory.\n\nParagraph three summarizes cash flow forecasting.';
const longTextNorm = normalizeEducationalSpeech(longTextRaw, 'en');
assert(longTextNorm.includes('equals cogs divided by Average Inventory'), 'Test 6 Failed: Formula not expanded');
assert(longTextNorm.includes('...'), 'Test 6 Failed: Inter-paragraph pause ellipsis missing');
console.log('✅ Test 6 Passed: Multi-paragraph long answers segmented with natural pauses.\n');

// ============================================================================
// PART 2: End-to-End API Security & TTS Provider Integration Tests
// ============================================================================
console.log('--- PART 2: End-to-End API & Security Tests ---');

// Setup mock OpenAI TTS server
let lastTtsRequest = null;
const mockTtsServer = http.createServer((req, res) => {
  let body = '';
  req.on('data', (chunk) => (body += chunk));
  req.on('end', () => {
    try {
      lastTtsRequest = JSON.parse(body);
    } catch {
      lastTtsRequest = null;
    }

    if (req.url === '/v1/audio/speech' && req.method === 'POST') {
      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': '128',
      });
      // Send mock MP3 audio bytes (128 bytes of silence/header)
      const mockAudio = Buffer.alloc(128, 0xff);
      res.end(mockAudio);
      return;
    }

    res.writeHead(404);
    res.end();
  });
});

await new Promise((resolve) => mockTtsServer.listen(0, '127.0.0.1', resolve));
const mockTtsPort = mockTtsServer.address().port;
const mockTtsGatewayUrl = `http://127.0.0.1:${mockTtsPort}/v1/audio/speech`;

// Configure Miniflare instances
const mfUnconfigured = new Miniflare({
  modules: [
    { type: 'ESModule', path: path.resolve('dist/server/index.js') },
    ...fs
      .readdirSync('dist/server', { recursive: true })
      .filter((n) => n.endsWith('.js') && n !== 'index.js')
      .map((n) => ({ type: 'ESModule', path: path.resolve('dist/server', n) })),
  ],
  compatibilityDate: '2026-05-15',
  compatibilityFlags: ['nodejs_compat'],
  d1Databases: { DB: 'test-vivi-voice-unconfigured' },
  r2Buckets: ['BUCKET'],
  bindings: {
    SITE_OWNER_EMAIL: 'vayentragurukula@gmail.com',
  },
});

const mfConfigured = new Miniflare({
  modules: [
    { type: 'ESModule', path: path.resolve('dist/server/index.js') },
    ...fs
      .readdirSync('dist/server', { recursive: true })
      .filter((n) => n.endsWith('.js') && n !== 'index.js')
      .map((n) => ({ type: 'ESModule', path: path.resolve('dist/server', n) })),
  ],
  compatibilityDate: '2026-05-15',
  compatibilityFlags: ['nodejs_compat'],
  d1Databases: { DB: 'test-vivi-voice-configured' },
  r2Buckets: ['BUCKET'],
  bindings: {
    SITE_OWNER_EMAIL: 'vayentragurukula@gmail.com',
    OPENAI_API_KEY: 'test-openai-key-for-tts',
    OPENAI_BASE_URL: `http://127.0.0.1:${mockTtsPort}/v1`,
  },
});

try {
  // Provision test databases
  for (const mf of [mfUnconfigured, mfConfigured]) {
    const db = await mf.getD1Database('DB');
    const sql = fs.readFileSync('drizzle/0000_sudden_anthem.sql', 'utf8');
    for (const statement of sql
      .split('--> statement-breakpoint')
      .map((s) => s.trim())
      .filter(Boolean)) {
      await db.prepare(statement).run();
    }

    const now = new Date().toISOString();
    await db.prepare("INSERT OR REPLACE INTO cohorts VALUES('cohort_alpha', 'College Alpha', 'open', ?)").bind(now).run();
    await db.prepare("INSERT OR REPLACE INTO roster VALUES('student@example.edu', 'Pooja Hegde', 'student', 'cohort_alpha', 'STU-01', 1)").run();
    await db.prepare("INSERT OR REPLACE INTO roster VALUES('pending@example.edu', 'Ravi Kumar', 'pending', 'cohort_alpha', 'STU-02', 0)").run();
    await db.prepare("INSERT OR REPLACE INTO roster VALUES('vayentragurukula@gmail.com', 'Admin User', 'admin', 'cohort_alpha', 'ADM-01', 1)").run();

    for (let s = 1; s <= 24; s++) {
      await db
        .prepare('INSERT OR REPLACE INTO assignments VALUES(?, ?, ?, ?, ?)')
        .bind(`cohort_alpha:${s}`, 'cohort_alpha', s, '2099-12-31T23:59:59Z', '2020-01-01T00:00:00Z')
        .run();
    }
  }

  const actors = {
    student: ['stu-01', 'student@example.edu'],
    pending: ['stu-02', 'pending@example.edu'],
    admin: ['adm-01', 'vayentragurukula@gmail.com'],
  };

  async function callViviSpeech(targetMf, actor, body) {
    const headers = {
      'Content-Type': 'application/json',
      Origin: 'https://worklab.test',
    };
    if (actor && actors[actor]) {
      headers['oai-authenticated-user-id'] = actors[actor][0];
      headers['oai-authenticated-user-email'] = actors[actor][1];
    }
    return targetMf.dispatchFetch('https://worklab.test/api/vivi/speech', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
  }

  // Test A: Anonymous Access Rejection (401)
  const resAnon = await callViviSpeech(mfUnconfigured, null, { text: 'Hello' });
  assert.equal(resAnon.status, 401, 'Test A Failed: Anonymous speech request must be rejected with 401');
  console.log('✅ Test A Passed: Anonymous speech request rejected with HTTP 401.');

  // Test B: Pending Account Rejection (403)
  const resPending = await callViviSpeech(mfUnconfigured, 'pending', { text: 'Hello' });
  assert.equal(resPending.status, 403, 'Test B Failed: Pending unenrolled student must be rejected with 403');
  console.log('✅ Test B Passed: Pending student account rejected with HTTP 403.');

  // Test C: Controlled Assessment Lockout - Session 22 Exit B (403)
  const resLockout22 = await callViviSpeech(mfUnconfigured, 'student', {
    text: 'Explain the answer for the exit exam.',
    sessionId: 22,
    stage: 'Exit B',
  });
  assert.equal(resLockout22.status, 403, 'Test C Failed: Session 22 Exit B must be locked out with 403');
  const lockoutData22 = await resLockout22.json();
  assert.equal(lockoutData22.code, 'CONTROLLED_ASSESSMENT_LOCKOUT', 'Test C Failed: Missing lockout code');
  console.log('✅ Test C Passed: Session 22 Exit B strictly locked out from speech generation (HTTP 403).');

  // Test D: Controlled Assessment Lockout - Session 01 Stage 1 Baseline (403)
  const resLockout01 = await callViviSpeech(mfUnconfigured, 'student', {
    text: 'What is the diagnostic answer?',
    sessionId: 1,
    stage: 1,
  });
  assert.equal(resLockout01.status, 403, 'Test D Failed: Session 01 Stage 1 must be locked out with 403');
  console.log('✅ Test D Passed: Session 01 Stage 1 Baseline Diagnostic locked out (HTTP 403).');

  // Test E: Empty Text Rejection (400)
  const resEmpty = await callViviSpeech(mfUnconfigured, 'student', { text: '   ' });
  assert.equal(resEmpty.status, 400, 'Test E Failed: Empty text must return 400');
  console.log('✅ Test E Passed: Empty speech text rejected with HTTP 400.');

  // Test F: Oversized Text Rejection (413)
  const resOversized = await callViviSpeech(mfUnconfigured, 'student', { text: 'A'.repeat(2501) });
  assert.equal(resOversized.status, 413, 'Test F Failed: Oversized text (>2500 chars) must return 413');
  console.log('✅ Test F Passed: Oversized text (>2,500 chars) rejected with HTTP 413.');

  // Test G: Unconfigured Provider Graceful Fallback (200 JSON with normalizedText)
  const resFallback = await callViviSpeech(mfUnconfigured, 'student', {
    text: 'Calculate Gross Margin for **₹5,00,000** sales.',
    speed: 0.95,
  });
  assert.equal(resFallback.status, 200, 'Test G Failed: Unconfigured provider should return 200 fallback');
  const fallbackJson = await resFallback.json();
  assert.equal(fallbackJson.mode, 'client_synthesis', 'Test G Failed: fallback mode mismatch');
  assert(!fallbackJson.normalizedText.includes('₹'), 'Test G Failed: Fallback text must be pre-normalized');
  assert(fallbackJson.normalizedText.includes('500000 rupees'), 'Test G Failed: Currency missing in fallback text');
  console.log('✅ Test G Passed: Unconfigured cloud TTS gracefully provides pre-normalized text for client Web Speech synthesis.');

  // Test H: Configured Cloud TTS Streaming Audio (audio/mpeg, nova voice, 0.95 speed)
  const resCloud = await callViviSpeech(mfConfigured, 'student', {
    text: 'Welcome to your Guided Learning session on working capital.',
    speed: 0.95,
  });
  assert.equal(resCloud.status, 200, 'Test H Failed: Configured cloud TTS should return 200 audio stream');
  assert(resCloud.headers.get('content-type')?.includes('audio/mpeg'), 'Test H Failed: Content-Type must be audio/mpeg');
  const audioBytes = await resCloud.arrayBuffer();
  assert.equal(audioBytes.byteLength, 128, 'Test H Failed: Expected 128 audio stream bytes from mock TTS');
  assert.equal(lastTtsRequest?.model, 'tts-1', 'Test H Failed: Model must be tts-1');
  assert.equal(lastTtsRequest?.voice, 'nova', 'Test H Failed: Voice must be signature female voice "nova"');
  assert.equal(lastTtsRequest?.speed, 0.95, 'Test H Failed: Default speed must be 0.95');
  console.log('✅ Test H Passed: Cloud TTS endpoint streams audio/mpeg using signature female voice "nova" at 0.95x speed.');

  // Test I: Speed Variations (0.85x, 0.95x, 1.10x)
  for (const targetSpeed of [0.85, 0.95, 1.10]) {
    const resSpeed = await callViviSpeech(mfConfigured, 'student', {
      text: 'Testing speed variations.',
      speed: targetSpeed,
    });
    assert.equal(resSpeed.status, 200);
    assert.equal(lastTtsRequest?.speed, targetSpeed, `Test I Failed: Requested speed ${targetSpeed} was not forwarded`);
  }
  console.log('✅ Test I Passed: Speeds 0.85x (Slow), 0.95x (Standard), and 1.10x (Fast) correctly verified.');

  // Test J: Per-User Rate Limiting
  let rejectedAt = -1;
  for (let i = 1; i <= 20; i++) {
    const res = await callViviSpeech(mfConfigured, 'student', {
      text: `Rate limit test iteration ${i}`,
    });
    if (res.status === 429) {
      rejectedAt = i;
      break;
    }
  }
  assert(rejectedAt > 0 && rejectedAt <= 16, `Test J Failed: Rate limit expected by request 16, but was ${rejectedAt}`);
  console.log(`✅ Test J Passed: Rate limiting properly triggered at request #${rejectedAt} with HTTP 429.`);

  console.log('\n======================================================');
  console.log('🎉 ALL VIVI VOICE VERIFICATION TESTS PASSED (100%)');
  console.log('======================================================\n');
} finally {
  await mfUnconfigured.dispose();
  await mfConfigured.dispose();
  mockTtsServer.close();
}
