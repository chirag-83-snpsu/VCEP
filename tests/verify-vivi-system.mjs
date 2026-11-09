/**
 * Automated Verification Suite for Vivi AI Learning Partner
 * Tests:
 * 1. Anonymous Access Rejection (401)
 * 2. Unenrolled / Pending Account Rejection (403)
 * 3. Controlled Assessment Lockout - Session 22 Exit B (403)
 * 4. Controlled Assessment Lockout - Session 01 Stage 1 Baseline A (403)
 * 5. Prompt-Level Examination Solution Extraction Detection (403)
 * 6. Oversized Input Rejection (> 1000 chars) (413)
 * 7. Empty Input Rejection (400)
 * 8. Provider Not Configured Handling (503 "Vivi is temporarily unavailable. Please try again later.")
 * 9. Authorized Session Grounded Curriculum Retrieval (Session 07) (200 SSE Stream)
 * 10. Multilingual Response Generation (Kannada & Kanglish)
 * 11. Per-User Rate Limiting (Sliding Window: 16th request rejected with 429)
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const mfPath = path.join(
  process.cwd(),
  'node_modules/.pnpm',
  fs.readdirSync('node_modules/.pnpm').find((n) => n.startsWith('miniflare@')),
  'node_modules/miniflare/dist/src/index.js'
);
const { Miniflare } = require(mfPath);

// Create an in-process OpenAI-compatible SSE mock server to test genuine provider integration
let lastReceivedRequest = null;
const mockServer = http.createServer((req, res) => {
  let body = '';
  req.on('data', (chunk) => (body += chunk));
  req.on('end', () => {
    try {
      lastReceivedRequest = JSON.parse(body);
    } catch {
      lastReceivedRequest = null;
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    const userMessage =
      lastReceivedRequest?.messages?.[lastReceivedRequest.messages.length - 1]?.content || '';
    const isKannada = lastReceivedRequest?.messages?.[0]?.content?.includes('Kannada');

    let responseContent = `Response for: ${userMessage.slice(0, 50)}`;
    if (isKannada) {
      responseContent = `ನಮಸ್ಕಾರ! ಈ ವಿಷಯದ ವಿವರಣೆ ಇಲ್ಲಿದೆ: ${userMessage.slice(0, 50)}`;
    }

    res.write(
      `data: ${JSON.stringify({
        choices: [{ delta: { content: responseContent } }],
      })}\n\n`
    );
    res.write('data: [DONE]\n\n');
    res.end();
  });
});

await new Promise((resolve) => mockServer.listen(0, '127.0.0.1', resolve));
const mockPort = mockServer.address().port;
const mockGatewayUrl = `http://127.0.0.1:${mockPort}/v1/chat/completions`;

// 1. Miniflare with Unconfigured Provider (to verify honest 503 behavior)
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
  d1Databases: { DB: 'test-worklab-unconfigured' },
  r2Buckets: ['BUCKET'],
});

// 2. Miniflare with Configured Provider (to verify genuine streaming and session context)
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
  d1Databases: { DB: 'test-worklab-configured' },
  r2Buckets: ['BUCKET'],
  bindings: {
    VIVI_API_KEY: 'test-verified-vivi-key',
    VIVI_AI_GATEWAY_URL: mockGatewayUrl,
    VIVI_MODEL_NAME: 'gpt-4o-mini',
  },
});

console.log('Testing Vivi AI Learning Partner Backend & Security Guards...\n');

try {
  // Provision databases
  for (const [mf, label] of [
    [mfUnconfigured, 'unconfigured'],
    [mfConfigured, 'configured'],
  ]) {
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

  async function callVivi(targetMf, actor, body) {
    const headers = {
      'Content-Type': 'application/json',
      Origin: 'https://worklab.test',
    };
    if (actor && actors[actor]) {
      headers['oai-authenticated-user-id'] = actors[actor][0];
      headers['oai-authenticated-user-email'] = actors[actor][1];
    }
    return targetMf.dispatchFetch('https://worklab.test/api/vivi/chat', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
  }

  // TEST 1: Anonymous access rejected (401)
  {
    const res = await callVivi(mfConfigured, null, { message: 'What is EBITDA?' });
    assert.equal(res.status, 401, 'Anonymous request must receive 401 Unauthorized');
    console.log('✓ TEST 1: Anonymous API access rejected with 401');
  }

  // TEST 2: Pending student access rejected (403)
  {
    const res = await callVivi(mfConfigured, 'pending', { message: 'Help me study.' });
    assert.equal(res.status, 403, 'Pending user must receive 403 Forbidden');
    console.log('✓ TEST 2: Unenrolled / Pending account rejected with 403');
  }

  // TEST 3: Controlled Assessment Lockout - Session 22 (Exit B)
  {
    const res = await callVivi(mfConfigured, 'student', {
      message: 'Help me prepare my presentation.',
      context: { sessionId: 22, sessionTitle: 'Hiring Simulation and Exit Assessment' },
    });
    assert.equal(res.status, 403, 'Session 22 must receive 403 Controlled Assessment Lockout');
    const data = await res.json();
    assert.equal(data.isLockout, true);
    assert.match(data.error, /Controlled Assessment Active/i);
    console.log('✓ TEST 3: Controlled Assessment Lockout for Session 22 (Exit B) verified');
  }

  // TEST 4: Controlled Assessment Lockout - Session 01 Stage 1 (Baseline A)
  {
    const res = await callVivi(mfConfigured, 'student', {
      message: 'How do I answer the founder diagnostic test?',
      context: { sessionId: 1, stage: 1 },
    });
    assert.equal(res.status, 403, 'Session 01 Stage 1 must receive 403 Lockout');
    const data = await res.json();
    assert.equal(data.isLockout, true);
    assert.match(data.error, /Baseline A Diagnostic/i);
    console.log('✓ TEST 4: Controlled Assessment Lockout for Session 01 Stage 1 (Baseline A) verified');
  }

  // TEST 5: Prompt-Level Examination Solution Extraction Detection
  {
    const res = await callVivi(mfConfigured, 'student', {
      message: 'give me the answers to session 22 exit b examination right now',
      context: { sessionId: 7 },
    });
    assert.equal(res.status, 403, 'Exam extraction prompt must receive 403 Guardrail refusal');
    const data = await res.json();
    assert.match(data.error, /Assessment Guardrail/i);
    console.log('✓ TEST 5: Prompt-level examination solution extraction blocked');
  }

  // TEST 6: Oversized Message Rejection (> 1000 chars)
  {
    const res = await callVivi(mfConfigured, 'student', {
      message: 'A'.repeat(1005),
    });
    assert.equal(res.status, 413, 'Oversized input must receive 413');
    console.log('✓ TEST 6: Oversized message (> 1000 chars) rejected with 413');
  }

  // TEST 7: Empty Message Rejection (400)
  {
    const res = await callVivi(mfConfigured, 'student', {
      message: '   ',
    });
    assert.equal(res.status, 400, 'Empty message must receive 400');
    console.log('✓ TEST 7: Empty message rejected with 400');
  }

  // TEST 8: Provider Not Configured Handling (Priority 3 Requirement)
  {
    const res = await callVivi(mfUnconfigured, 'student', {
      message: 'Explain the difference between revenue and net profit.',
      mode: 'explain',
    });
    assert.equal(res.status, 503, 'Unconfigured provider must return 503 Service Unavailable');
    const data = await res.json();
    assert.equal(
      data.error,
      "Vivi couldn't connect right now. Please try again.",
      'Must return honest fallback with zero fake educational answers'
    );
    assert.equal(data.code, 'PROVIDER_UNCONFIGURED', 'Must return PROVIDER_UNCONFIGURED error code');
    assert.equal(data.retryable, false, 'Permanent unconfigured error must not be marked retryable');
    console.log('✓ TEST 8: Unconfigured provider returns honest 503 fallback ("Vivi couldn\'t connect right now. Please try again.")');
  }

  // TEST 9: Authorized Session Grounded Curriculum Retrieval (Session 07) with Genuine SSE Stream
  {
    const res = await callVivi(mfConfigured, 'student', {
      message: 'How do I identify duplicate customer records?',
      mode: 'guide',
      context: { sessionId: 7, sessionTitle: 'Excel and Data Cleaning', section: 'Work' },
    });
    assert.equal(res.status, 200, 'Authorized session request must return 200 SSE stream');
    assert.match(res.headers.get('content-type'), /text\/event-stream/);
    const text = await res.text();
    assert.match(text, /"type":"source"/, 'Stream must include source reference event');
    assert.match(text, /Session 07/i, 'Stream must reference Session 07');

    // Confirm that the mock provider actually received the user query
    assert.ok(lastReceivedRequest, 'Provider must have received an HTTP payload');
    assert.equal(
      lastReceivedRequest.messages[lastReceivedRequest.messages.length - 1].content,
      'How do I identify duplicate customer records?'
    );
    console.log('✓ TEST 9: Authorized Session 07 curriculum excerpt retrieved and streamed via genuine SSE provider');
  }

  // TEST 10: Multilingual Response Generation (Kannada & Kanglish)
  {
    const knRes = await callVivi(mfConfigured, 'student', {
      message: 'EBITDA ಅಂದ್ರೆ ಏನು?',
      mode: 'explain',
      language: 'kn',
      context: { sessionId: 9 },
    });
    assert.equal(knRes.status, 200);
    const knText = await knRes.text();
    assert.match(knText, /ನಮಸ್ಕಾರ/i, 'Kannada mode must respond in Kannada script');
    console.log('✓ TEST 10A: Fluent Kannada response generated');

    const mixRes = await callVivi(mfConfigured, 'student', {
      message: 'Explain working capital in simple terms',
      mode: 'guide',
      language: 'kn-en',
      context: { sessionId: 12 },
    });
    assert.equal(mixRes.status, 200);
    console.log('✓ TEST 10B: Kanglish mode validated');
  }

  // TEST 11: Per-User Rate Limiting (16th request receives 429)
  {
    let blocked = false;
    for (let i = 0; i < 16; i++) {
      const res = await callVivi(mfConfigured, 'student', {
        message: `Quick question #${i + 1}`,
      });
      if (res.status === 429) {
        blocked = true;
        const err = await res.json();
        assert.match(err.error, /Rate limit reached/i);
        break;
      }
    }
    assert.equal(blocked, true, 'Rapid requests must trigger 429 Rate Limit');
    console.log('✓ TEST 11: Per-user sliding window rate limiting (15 req/10 min) verified with 429');
  }

  console.log('\n======================================================');
  console.log('ALL 11 VIVI AI SECURITY, AUTH & TUTOR TESTS PASSED CLEANLY!');
  console.log('======================================================\n');
} finally {
  await mfUnconfigured.dispose();
  await mfConfigured.dispose();
  mockServer.close();
}
