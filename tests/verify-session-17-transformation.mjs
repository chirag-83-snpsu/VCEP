import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

const outDirDocs = 'docs/qa/screenshots';
const outDirArtifact = '/Users/yashvanthkrishnamurthy/.gemini/antigravity/brain/c24b0aa2-5861-4add-bc2b-11103ce642b4/screenshots';

fs.mkdirSync(outDirDocs, { recursive: true });
fs.mkdirSync(outDirArtifact, { recursive: true });

const driveJson = JSON.parse(fs.readFileSync('app/guided-learning/drive-edition-3.json', 'utf8'));

async function runStaticVerification() {
  console.log('--- Phase 1: Static Code & Content Verification ---');

  const page = fs.readFileSync('app/guided-learning/page.tsx', 'utf8');
  const ws = fs.readFileSync('app/guided-learning/workstations/session-17-workstation.tsx', 'utf8');
  const journey = fs.readFileSync('app/guided-learning/components/session-17-discovery-journey.tsx', 'utf8');
  const data = fs.readFileSync('app/guided-learning/components/session-17-discovery-data.ts', 'utf8');
  const rules = fs.readFileSync('lib/review-engine/session-rules/session-17.ts', 'utf8');

  // 1. Check Natural Headings
  assert.ok(journey.includes('id="vcep-area-client"'), 'Must define #vcep-area-client');
  assert.ok(journey.includes('Listen to the Client Challenge') || journey.includes('1. Listen to Client Challenge'), 'Must have heading "Listen to the Client Challenge"');
  assert.ok(journey.includes('id="vcep-area-brief"'), 'Must define #vcep-area-brief');
  assert.ok(journey.includes('Write the Discovery Brief') || journey.includes('2. Write Discovery Brief'), 'Must have heading "Write the Discovery Brief"');

  // 2. Check 4 Unified TaskCards
  assert.ok(journey.includes('function TaskCard('), 'Must define unified TaskCard component');
  assert.ok(journey.includes('Task 01 — Prepare Discovery Questions'), 'Must define Task 01');
  assert.ok(journey.includes('Task 02 — Record the Interview & Validate Facts'), 'Must define Task 02');
  assert.ok(journey.includes('Task 03 — Define the Business Problem'), 'Must define Task 03');
  assert.ok(journey.includes('Task 04 — Check Assumptions & Verify Governance'), 'Must define Task 04');
  assert.ok(journey.includes('S17-T01') && journey.includes('S17-T04'), 'Must have task IDs S17-T01 through S17-T04');

  // 3. Check Case F & Liquidity Grounding
  assert.ok(data.includes('CASE_F_INVOICES'), 'Must define CASE_F_INVOICES');
  assert.ok(data.includes("'F01'") && data.includes("'F04'"), 'Must contain invoices F01 through F04');
  assert.ok(data.includes('CASE_F_LIQUIDITY_SUMMARY'), 'Must define CASE_F_LIQUIDITY_SUMMARY');
  assert.ok(data.includes('net7DayDeficit: 20000'), 'Must define ₹20,000 net 7-day deficit');
  assert.ok(data.includes('totalReceivables: 100000'), 'Must define ₹1,00,000 control total');
  assert.ok(data.includes('totalDisputed: 5000'), 'Must isolate Beacon ₹5,000 dispute');

  // 4. Check Strict Dataset Separation
  assert.ok(data.includes('NO_JOIN_KEY_SAFEGUARD'), 'Must define NO_JOIN_KEY_SAFEGUARD');
  assert.ok(journey.includes('NO_JOIN_KEY_SAFEGUARD') || journey.includes('No primary key or common customer ID exists'), 'Journey must display no join key safeguard');

  // 5. Check Client Interview Simulator & 8 Questions
  assert.ok(data.includes('INTERVIEW_DIALOGUE_TURNS'), 'Must define interview dialogue turns');
  assert.ok(data.includes('INITIAL_DISCOVERY_QUESTIONS'), 'Must define 8 discovery questions');
  assert.ok(data.includes("'Q1'") && data.includes("'Q8'"), 'Must contain Q1 through Q8');

  // 6. Check 80-Word Problem Statement & 5 Elements
  assert.ok(data.includes('MAX_PROBLEM_STATEMENT_WORDS = 80'), 'Must enforce max 80 words');
  assert.ok(data.includes('DEFAULT_PROBLEM_STATEMENT'), 'Must define default problem statement');

  // 7. Check Invalidation Assumptions & Permissions
  assert.ok(data.includes('INITIAL_ASSUMPTIONS'), 'Must define 3 invalidating assumptions');
  assert.ok(data.includes('INITIAL_DATA_PERMISSIONS'), 'Must define data permissions');

  // 8. Check Workstation Delegation
  assert.ok(ws.includes('Session17DiscoveryJourney'), 'Workstation must delegate to Session17DiscoveryJourney');

  // 9. Check page.tsx tab suppression and button wiring
  assert.ok(page.includes('selected > 24 && (') || page.includes('selected > 17 && ('), 'Tabs must be suppressed for selected <= 17');
  assert.ok(page.includes('vcep-area-brief'), 'Page must wire Write Discovery Brief button');
  assert.ok(page.includes('vcep-area-client'), 'Page must wire Listen to Client Challenge button');
  assert.ok(page.includes('Discover the problem before building.'), 'Page must display Session 17 subline');

  // 10. Check Review Engine Rules in lib
  assert.ok(rules.includes('s17-o1-discovery-mission'), 'Review rules must check discovery mission');
  assert.ok(rules.includes('s17-l1-symptom-vs-cause'), 'Review rules must check symptom vs cause');
  assert.ok(rules.includes('s17-c1-case-boundaries'), 'Review rules must check case boundaries');
  assert.ok(rules.includes('s17-w1-interview-distinction'), 'Review rules must check interview distinction');
  assert.ok(rules.includes('s17-w2-discovery-questions'), 'Review rules must check discovery questions');
  assert.ok(rules.includes('s17-w3-case-separation'), 'Review rules must check case separation');
  assert.ok(rules.includes('s17-w4-problem-statement'), 'Review rules must check problem statement');
  assert.ok(rules.includes('s17-w5-invalidating-assumptions'), 'Review rules must check assumptions');
  assert.ok(rules.includes('s17-t1-governance'), 'Review rules must check governance');

  console.log('✅ Phase 1: Static Code & Content Verification Passed (100%)\n');
}

async function runBrowserVerification() {
  console.log('--- Phase 2: Live Browser CDP Verification & Screenshot Capture ---');

  const PORT = 9387;
  const chromeDir = `/tmp/chrome-session-17-test-clean-${Date.now()}`;
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${chromeDir}`,
    'about:blank',
  ]);

  let pageTab = null;
  for (let i = 0; i < 15; i++) {
    try {
      const listRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const tabs = await listRes.json();
      pageTab = tabs.find((t) => t.type === 'page') || tabs[0];
      if (pageTab?.webSocketDebuggerUrl) break;
    } catch (e) {
      // wait for Chrome startup
    }
    await new Promise((r) => setTimeout(r, 400));
  }

  if (!pageTab?.webSocketDebuggerUrl) {
    chrome.kill();
    throw new Error('Could not connect to Chrome debugging port ' + PORT);
  }

  try {
    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const reqId = id++;
        const handler = (msg) => {
          const data = JSON.parse(msg.data);
          if (data.id === reqId) {
            ws.removeEventListener('message', handler);
            if (data.error) reject(data.error);
            else resolve(data.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: reqId, method, params }));
      });
    }

    await new Promise((resolve) => ws.addEventListener('open', resolve, { once: true }));

    await send('Page.enable');
    await send('DOM.enable');
    await send('Runtime.enable');

    async function capture(filename, width, height) {
      await send('Emulation.setDeviceMetricsOverride', {
        width,
        height,
        deviceScaleFactor: 2,
        mobile: width <= 640,
      });

      await new Promise((r) => setTimeout(r, 600));

      const screenshot = await send('Page.captureScreenshot', { format: 'png' });
      const buffer = Buffer.from(screenshot.data, 'base64');

      const docsPath = path.join(outDirDocs, filename);
      const artPath = path.join(outDirArtifact, filename);
      fs.writeFileSync(docsPath, buffer);
      fs.writeFileSync(artPath, buffer);
      console.log(`📸 Saved screenshot: ${filename} (${width}x${height})`);
    }

    // Set authenticated session cookie
    await send('Network.enable');
    await send('Network.setCookie', {
      name: '__vcep_session',
      value: 'session_s17_qa_test',
      domain: '127.0.0.1',
      path: '/',
    });

    // Mock auth /api/boot and /api/guided/session/17
    const s17Lesson = driveJson.find((s) => s.id === 17);
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        const s17Lesson = ${JSON.stringify(s17Lesson)};
        const origFetch = window.fetch;
        window.fetch = async (...args) => {
          const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
          if (url && url.includes('/api/boot')) {
            const res = await origFetch(...args);
            const data = await res.json();
            data.user = { id: 'student-17', email: 'discovery17@student.edu', role: 'student', name: 'Lead Discovery Analyst' };
            return new Response(JSON.stringify(data), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          if (url && url.includes('/api/guided/session/17')) {
            return new Response(JSON.stringify({ lesson: s17Lesson }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return origFetch(...args);
        };
      `,
    });

    const targetUrl = 'http://127.0.0.1:5173/guided-learning?session=17';
    console.log(`Navigating to ${targetUrl}...`);
    await send('Page.navigate', { url: targetUrl });
    await new Promise((r) => setTimeout(r, 3000));

    // Capture 1440px Desktop Heading 1: Listen to the Client Challenge
    await send('Runtime.evaluate', {
      expression: `document.getElementById('vcep-area-client')?.scrollIntoView({ behavior: 'instant', block: 'start' });`,
    });
    await capture('s17-heading-01-client-desktop-1440.png', 1440, 900);

    // Capture 1440px Desktop Heading 2: Write the Discovery Brief
    await send('Runtime.evaluate', {
      expression: `document.getElementById('vcep-area-brief')?.scrollIntoView({ behavior: 'instant', block: 'start' });`,
    });
    await capture('s17-heading-02-brief-desktop-1440.png', 1440, 900);

    // Capture Tablet 768px
    await capture('s17-discovery-tablet-768.png', 768, 1024);

    // Capture Mobile 390px
    await capture('s17-discovery-mobile-390.png', 390, 844);

    // DOM Evaluation
    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const areaClient = document.getElementById('vcep-area-client');
          const areaBrief = document.getElementById('vcep-area-brief');
          const tabs = document.querySelector('.v3-tabs');
          const bodyText = document.body.innerText;
          const taskCards = document.querySelectorAll('article[data-task-id]');

          return {
            hasClientArea: !!areaClient,
            hasBriefArea: !!areaBrief,
            tabsHidden: !tabs,
            taskCardsCount: taskCards.length,
            hasTask01: !!document.querySelector('[data-task-id="S17-T01"]'),
            hasTask02: !!document.querySelector('[data-task-id="S17-T02"]'),
            hasTask03: !!document.querySelector('[data-task-id="S17-T03"]'),
            hasTask04: !!document.querySelector('[data-task-id="S17-T04"]'),
            task01Title: bodyText.includes('Task 01 — Prepare Discovery Questions'),
            task02Title: bodyText.includes('Task 02 — Record the Interview & Validate Facts'),
            task03Title: bodyText.includes('Task 03 — Define the Business Problem'),
            task04Title: bodyText.includes('Task 04 — Check Assumptions & Verify Governance'),
            containsInterviewSimulator: bodyText.includes('Client Discovery Interview Simulator') && bodyText.includes('Founder Statement') && bodyText.includes('Validated Financial Reality'),
            containsCaseFTable: bodyText.includes('Case F Receivables') && (bodyText.includes('1,00,000') || bodyText.includes('100,000')) && (bodyText.includes('20,000') || bodyText.includes('20k Deficit')),
            containsZeroJoinNotice: bodyText.includes('NO common primary or foreign key') || bodyText.includes('No primary key or common customer ID exists'),
            containsEightQuestions: bodyText.includes('Discovery Question Matrix') && bodyText.includes('Q1') && bodyText.includes('Q8'),
            containsProblemStatement: bodyText.includes('5-Element Architectural Problem') && bodyText.includes('Persona') && bodyText.includes('Success'),
            containsPermissionsChecklist: bodyText.includes('Data Permission & Boundary Compliance') && bodyText.includes('Customer Financial Confidentiality'),
            containsAssumptions: bodyText.includes('Three Assumptions That Could Invalidate') && bodyText.includes('Invalidation Trigger'),
            containsGovernance: bodyText.includes('Deliverable Governance & Named Review Roles') && bodyText.includes('Preparer Name'),
            containsRubricHandover: bodyText.includes('StudentID_S17_v01.xlsx') && bodyText.includes('Run Formative Review'),
            tablesCount: document.querySelectorAll('table').length,
          };
        })()
      `,
      returnByValue: true,
    });

    console.log('\n📊 DOM Inspection Result:', JSON.stringify(evalRes.result.value, null, 2));

    const v = evalRes.result.value;
    assert.ok(v.hasClientArea, 'Heading 1 #vcep-area-client must exist in DOM');
    assert.ok(v.hasBriefArea, 'Heading 2 #vcep-area-brief must exist in DOM');
    assert.ok(v.tabsHidden, '.v3-tabs must be suppressed for Session 17');
    assert.equal(v.taskCardsCount, 4, 'Must render exactly 4 bordered TaskCards');
    assert.ok(v.hasTask01 && v.task01Title, 'Must render Task 01: Prepare Discovery Questions');
    assert.ok(v.hasTask02 && v.task02Title, 'Must render Task 02: Record the Interview & Validate Facts');
    assert.ok(v.hasTask03 && v.task03Title, 'Must render Task 03: Define the Business Problem');
    assert.ok(v.hasTask04 && v.task04Title, 'Must render Task 04: Check Assumptions & Verify Governance');
    assert.ok(v.containsInterviewSimulator, 'Must render Client Interview Simulator');
    assert.ok(v.containsCaseFTable, 'Must render Case F receivables table & deficit');
    assert.ok(v.containsZeroJoinNotice, 'Must display strict no-join safeguard');
    assert.ok(v.containsEightQuestions, 'Must render Eight Structured Discovery Questions');
    assert.ok(v.containsProblemStatement, 'Must render 80-word Problem Statement editor');
    assert.ok(v.containsPermissionsChecklist, 'Must render Data Permissions checklist');
    assert.ok(v.containsAssumptions, 'Must render Invalidation Assumptions');
    assert.ok(v.containsGovernance, 'Must render governance fields');
    assert.ok(v.containsRubricHandover, 'Must render StudentID_S17_v01.xlsx and Formative Review');
    assert.ok(v.tablesCount >= 1, 'Must render at least 1 table');

    console.log('\n✅ Phase 2: Live Browser CDP Verification Passed 100%!');
    console.log('🎉 ALL VCEP SESSION 17 TRANSFORMATIONS VERIFIED SUCCESSFULLY!\n');

    ws.close();
  } finally {
    chrome.kill();
  }
}

async function main() {
  try {
    await runStaticVerification();
    await runBrowserVerification();
  } catch (err) {
    console.error('❌ Verification failed:', err);
    process.exit(1);
  }
}

main();
