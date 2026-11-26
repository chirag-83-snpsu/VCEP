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
  const ws = fs.readFileSync('app/guided-learning/workstations/session-19-workstation.tsx', 'utf8');
  const journey = fs.readFileSync('app/guided-learning/components/session-19-execution-journey.tsx', 'utf8');
  const data = fs.readFileSync('app/guided-learning/components/session-19-execution-data.ts', 'utf8');
  const rules = fs.readFileSync('lib/review-engine/session-rules/session-19.ts', 'utf8');
  const registry = fs.readFileSync('lib/review-engine/registry.ts', 'utf8');

  // 1. Check Natural Headings
  assert.ok(journey.includes('id="vcep-area-build"'), 'Must define #vcep-area-build');
  assert.ok(journey.includes('Build the Approved Solution') || journey.includes('1. Build the Approved Solution'), 'Must have heading "Build the Approved Solution"');
  assert.ok(journey.includes('id="vcep-area-test"'), 'Must define #vcep-area-test');
  assert.ok(journey.includes('Test & Record Evidence') || journey.includes('2. Test & Record Evidence'), 'Must have heading "Test & Record Evidence"');

  // 2. Check 4 Unified TaskCard Structures
  assert.ok(journey.includes('function TaskCard('), 'Must define unified TaskCard component');
  assert.ok(journey.includes('taskId="S19-T01"'), 'Must define Task 01: S19-T01');
  assert.ok(journey.includes('taskId="S19-T02"'), 'Must define Task 02: S19-T02');
  assert.ok(journey.includes('taskId="S19-T03"'), 'Must define Task 03: S19-T03');
  assert.ok(journey.includes('taskId="S19-T04"'), 'Must define Task 04: S19-T04');
  assert.ok(journey.includes('title="Build Version 1"'), 'Task 01 title must be Build Version 1');
  assert.ok(journey.includes('title="Run Acceptance Tests"'), 'Task 02 title must be Run Acceptance Tests');
  assert.ok(journey.includes('title="Fix and Retest"'), 'Task 03 title must be Fix and Retest');
  assert.ok(journey.includes('title="Prepare the Handover"'), 'Task 04 title must be Prepare the Handover');
  assert.ok(journey.includes('Why this matters'), 'TaskCard must include Why this matters rationale');

  // 3. Check Case F Version 1 Raw Records & Baseline
  assert.ok(data.includes('CASE_F_RAW_RECORDS'), 'Must define CASE_F_RAW_RECORDS');
  assert.ok(data.includes('F01') && data.includes('F04'), 'Must contain invoices F01 through F04');
  assert.ok(data.includes('totalControlAmount: 100000'), 'Must define ₹1,00,000 total invoice control total');
  assert.ok(data.includes('disputedAmount: 5000'), 'Must isolate ₹5,000 Beacon debit note dispute');
  assert.ok(data.includes('undisputedAmount: 95000'), 'Must define ₹95,000 net collectible');
  assert.ok(data.includes('net7DayCashDeficit: 20000'), 'Must define ₹20,000 net cash deficit');

  // 4. Check Date Boundary Sensitivity Engine
  assert.ok(data.includes('calculateDaysOverdue'), 'Must provide calculateDaysOverdue helper');
  assert.ok(data.includes('classifyAgeingBucket'), 'Must provide classifyAgeingBucket helper');
  assert.ok(journey.includes('asOfDate'), 'Must feature dynamic as-of date parameter');
  assert.ok(journey.includes('handleSetAsOfDate'), 'Must feature date sensitivity boundary test');

  // 5. Check Edge-Case Exception Simulator
  assert.ok(journey.includes('handleToggleDuplicateSimulation'), 'Must feature duplicate ID simulator');
  assert.ok(journey.includes('handleToggleBlankSimulation'), 'Must feature blank amount simulator');
  assert.ok(journey.includes('STOP CONDITION TRIGGERED') || journey.includes('INJECT DUPLICATE F02'), 'Must render exception warnings');

  // 6. Check 5 Acceptance Tests from Session 18
  assert.ok(data.includes('INITIAL_ACCEPTANCE_TESTS'), 'Must define INITIAL_ACCEPTANCE_TESTS');
  assert.ok(data.includes('AT-01') && data.includes('AT-05'), 'Must define acceptance tests AT-01 through AT-05');
  assert.ok(journey.includes('PASS') && journey.includes('FAIL'), 'Must support pass/fail status updates');

  // 7. Check Individual Work Contribution & Peer Correction
  assert.ok(journey.includes('studentContribution'), 'Must feature individual work contribution breakdown');
  assert.ok(journey.includes('reviewerCorrection'), 'Must feature before/after peer defect correction');
  assert.ok(journey.includes('handoverSummary'), 'Must support reviewer sign-off notes');

  // 8. Check Workstation Delegation
  assert.ok(ws.includes('Session19ExecutionJourney'), 'Workstation must delegate to Session19ExecutionJourney');

  // 9. Check page.tsx tab suppression and button wiring
  assert.ok(page.includes('selected > 24 && (') || page.includes('selected > 19 && ('), 'Tabs must be suppressed for selected <= 19');
  assert.ok(journey.includes('vcep-area-test'), 'Journey must wire Test & Record Evidence button');
  assert.ok(journey.includes('vcep-area-build'), 'Journey must wire Build Approved Solution button');
  assert.ok(page.includes('Build the prototype. Prove it works.'), 'Page must display Session 19 subline');

  // 10. Check Review Engine Rules in lib
  assert.ok(registry.includes('19: evaluateSession19'), 'Registry must register Session 19');
  assert.ok(rules.includes('s19-o1-execution-mission'), 'Review rules must check execution mission');
  assert.ok(rules.includes('s19-l1-qa-principles'), 'Review rules must check QA principles');
  assert.ok(rules.includes('s19-c1-case-boundaries'), 'Review rules must check case boundaries');
  assert.ok(rules.includes('s19-w1-prototype-prototype'), 'Review rules must check prototype implementation');
  assert.ok(rules.includes('s19-w2-date-sensitivity'), 'Review rules must check date sensitivity');
  assert.ok(rules.includes('s19-w3-acceptance-tests'), 'Review rules must check acceptance tests');
  assert.ok(rules.includes('s19-w4-exception-handling'), 'Review rules must check exception handling');
  assert.ok(rules.includes('s19-w5-peer-correction'), 'Review rules must check peer correction');
  assert.ok(rules.includes('s19-t1-governance'), 'Review rules must check governance');
  assert.ok(rules.includes('s19-t2-rubric-compliance'), 'Review rules must check rubric compliance');

  console.log('✅ Phase 1: Static Code & Content Verification Passed (100%)\n');
}

async function runBrowserVerification() {
  console.log('--- Phase 2: Live Browser CDP Verification & Screenshot Capture ---');

  const PORT = 9387;
  const chromeDir = `/tmp/chrome-session-19-test-clean-${Date.now()}`;
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
          const res = JSON.parse(msg.data);
          if (res.id === reqId) {
            ws.removeEventListener('message', handler);
            if (res.error) reject(res.error);
            else resolve(res.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: reqId, method, params }));
      });
    }

    await new Promise((resolve) => ws.addEventListener('open', resolve));

    await send('Page.enable');
    await send('DOM.enable');
    await send('Runtime.enable');
    await send('Network.enable');

    // Set authenticated session cookie
    await send('Network.setCookie', {
      name: '__vcep_session',
      value: 'session_s19_qa_test',
      domain: '127.0.0.1',
      path: '/',
    });

    // Mock auth /api/boot and /api/guided/session/19
    const s19Lesson = driveJson.find((s) => s.id === 19);
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        const s19Lesson = ${JSON.stringify(s19Lesson)};
        const origFetch = window.fetch;
        window.fetch = async (...args) => {
          const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
          if (url && url.includes('/api/boot')) {
            const res = await origFetch(...args);
            const data = await res.json();
            data.user = { id: 'student-19', email: 'execution19@student.edu', role: 'student', name: 'Lead QA Engineer' };
            return new Response(JSON.stringify(data), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          if (url && url.includes('/api/guided/session/19')) {
            return new Response(JSON.stringify({ lesson: s19Lesson }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return origFetch(...args);
        };
      `,
    });

    console.log('Navigating to http://127.0.0.1:5173/guided-learning?session=19...');
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/guided-learning?session=19' });
    await new Promise((r) => setTimeout(r, 3500));

    async function captureViewport(filename, width, height, scrollSelector = null) {
      await send('Emulation.setDeviceMetricsOverride', {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: width < 600,
      });
      await new Promise((r) => setTimeout(r, 600));

      if (scrollSelector) {
        await send('Runtime.evaluate', {
          expression: `
            const el = document.querySelector('${scrollSelector}');
            if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
          `,
        });
        await new Promise((r) => setTimeout(r, 600));
      }

      const shot = await send('Page.captureScreenshot', { format: 'png' });
      const buf = Buffer.from(shot.data, 'base64');
      fs.writeFileSync(path.join(outDirDocs, filename), buf);
      fs.writeFileSync(path.join(outDirArtifact, filename), buf);
      console.log(`📸 Saved screenshot: ${filename} (${width}x${height})`);
    }

    // 1. Desktop 1440px - Heading 1 (Build the Approved Solution)
    await captureViewport('s19-heading-01-build-desktop-1440.png', 1440, 900, '#vcep-area-build');

    // 2. Desktop 1440px - Heading 2 (Test & Record Evidence)
    await captureViewport('s19-heading-02-test-desktop-1440.png', 1440, 900, '#vcep-area-test');

    // 3. Tablet 768px
    await captureViewport('s19-execution-tablet-768.png', 768, 1024, '#vcep-area-build');

    // 4. Mobile 390px
    await captureViewport('s19-execution-mobile-390.png', 390, 844, '#vcep-area-build');

    // DOM Assertions Verification
    const evalResult = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const buildArea = document.getElementById('vcep-area-build');
          const testArea = document.getElementById('vcep-area-test');
          const tabs = document.querySelector('.v3-tabs');
          const pageText = document.body.textContent || '';
          const taskCards = document.querySelectorAll('article[data-task-id]');

          return {
            hasBuildArea: !!buildArea,
            hasTestArea: !!testArea,
            tabsHidden: !tabs,
            taskCardsCount: taskCards.length,
            hasTask01: !!document.querySelector('[data-task-id="S19-T01"]'),
            hasTask02: !!document.querySelector('[data-task-id="S19-T02"]'),
            hasTask03: !!document.querySelector('[data-task-id="S19-T03"]'),
            hasTask04: !!document.querySelector('[data-task-id="S19-T04"]'),
            task01Title: pageText.includes('Build Version 1'),
            task02Title: pageText.includes('Run Acceptance Tests'),
            task03Title: pageText.includes('Fix and Retest'),
            task04Title: pageText.includes('Prepare the Handover'),
            containsWhyThisMatters: pageText.includes('Why this matters'),
            containsCaseFRecords: pageText.includes('F01') && pageText.includes('Asha Logistics') && pageText.includes('₹10,000'),
            containsDateSensitivity: pageText.includes('Dynamic Ageing Model & Boundary Sensitivity Simulator') && pageText.includes('31 Oct 2026') && pageText.includes('01 Nov 2026'),
            containsExceptionSimulator: pageText.includes('Edge-Case Exception Injection Simulator') && pageText.includes('INJECT DUPLICATE F02'),
            containsAcceptanceTests: pageText.includes('Five Executed Acceptance Tests Register') && pageText.includes('AT-01') && pageText.includes('Normal source'),
            containsPeerCorrection: pageText.includes('Peer Reviewer Correction') && pageText.includes('My Specific Deliverable Contribution'),
            containsGovernance: pageText.includes('Preparer') && pageText.includes('Reviewer') && pageText.includes('Decision Owner'),
            containsRubricCard: pageText.includes('Automatic Quality Assurance Review') && pageText.includes('Rubric Score'),
            tablesCount: document.querySelectorAll('table').length,
          };
        })()
      `,
      returnByValue: true,
    });

    console.log('\n📊 DOM Inspection Result:', JSON.stringify(evalResult.result.value, null, 2));

    const v = evalResult.result.value;
    assert.strictEqual(v.hasBuildArea, true, 'Must render #vcep-area-build');
    assert.strictEqual(v.hasTestArea, true, 'Must render #vcep-area-test');
    assert.strictEqual(v.tabsHidden, true, 'Legacy tabs must be hidden for Session 19');
    assert.strictEqual(v.taskCardsCount, 4, 'Must render exactly 4 bordered TaskCards');
    assert.ok(v.hasTask01 && v.task01Title, 'Must render Task 01: Build Version 1');
    assert.ok(v.hasTask02 && v.task02Title, 'Must render Task 02: Run Acceptance Tests');
    assert.ok(v.hasTask03 && v.task03Title, 'Must render Task 03: Fix and Retest');
    assert.ok(v.hasTask04 && v.task04Title, 'Must render Task 04: Prepare the Handover');
    assert.strictEqual(v.containsWhyThisMatters, true, 'Must render collapsible Why this matters buttons');
    assert.strictEqual(v.containsCaseFRecords, true, 'Must display Case F raw records');
    assert.strictEqual(v.containsDateSensitivity, true, 'Must render date boundary sensitivity test');
    assert.strictEqual(v.containsExceptionSimulator, true, 'Must render exception simulator');
    assert.strictEqual(v.containsAcceptanceTests, true, 'Must render 5 formal acceptance tests');
    assert.strictEqual(v.containsPeerCorrection, true, 'Must render peer defect correction');
    assert.strictEqual(v.containsGovernance, true, 'Must render governance fields');
    assert.strictEqual(v.containsRubricCard, true, 'Must render review engine and rubric score');
    assert.ok(v.tablesCount >= 3, 'Must render at least 3 tables (Raw records + Dynamic schedule + Acceptance tests)');

    console.log('\n✅ Phase 2: Live Browser CDP Verification Passed 100%!');
    console.log('🎉 ALL VCEP SESSION 19 TRANSFORMATIONS VERIFIED SUCCESSFULLY!\n');

    ws.close();
  } finally {
    chrome.kill();
  }
}

async function main() {
  await runStaticVerification();
  await runBrowserVerification();
}

main().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
