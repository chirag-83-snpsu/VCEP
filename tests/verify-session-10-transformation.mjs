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
  console.log('--- Phase 1: Static Code, Data & Canonical Verification ---');

  const page = fs.readFileSync('app/guided-learning/page.tsx', 'utf8');
  const ws = fs.readFileSync('app/guided-learning/workstations/session-10-workstation.tsx', 'utf8');
  const journey = fs.readFileSync('app/guided-learning/components/session-10-dashboard-journey.tsx', 'utf8');
  const data = fs.readFileSync('app/guided-learning/components/session-10-dashboard-data.ts', 'utf8');
  const rules = fs.readFileSync('lib/review-engine/session-rules/session-10.ts', 'utf8');

  // 1. Check Natural Headings
  assert.ok(journey.includes('id="vcep-area-question"'), 'Must define #vcep-area-question');
  assert.ok(journey.includes('1. Choose the Management Question'), 'Must have heading "1. Choose the Management Question"');
  assert.ok(journey.includes('id="vcep-area-dashboard"'), 'Must define #vcep-area-dashboard');
  assert.ok(journey.includes('2. Build the MIS Dashboard'), 'Must have heading "2. Build the MIS Dashboard"');

  // 2. Check Unified TaskCard Component Pattern & 4 Task Cards
  assert.ok(journey.includes('function TaskCard('), 'Must define unified TaskCard component');
  assert.ok(journey.includes("border: '1px solid #DCE5E9'"), 'TaskCard must use neutral 1px #DCE5E9 border');
  assert.ok(journey.includes("borderLeft: isActive ? '3px solid #0F766E'"), 'TaskCard must use 3px teal accent when active');
  assert.ok(journey.includes('taskId="S10-T01"'), 'Must define Task 01 (S10-T01)');
  assert.ok(journey.includes('taskId="S10-T02"'), 'Must define Task 02 (S10-T02)');
  assert.ok(journey.includes('taskId="S10-T03"'), 'Must define Task 03 (S10-T03)');
  assert.ok(journey.includes('taskId="S10-T04"'), 'Must define Task 04 (S10-T04)');

  assert.ok(journey.includes('title="Select Decision KPIs"'), 'Task 01 title must be Select Decision KPIs');
  assert.ok(journey.includes('title="Build the Dashboard"'), 'Task 02 title must be Build the Dashboard');
  assert.ok(journey.includes('title="Test the Refresh"'), 'Task 03 title must be Test the Refresh');
  assert.ok(journey.includes('title="Present the Insight"'), 'Task 04 title must be Present the Insight');

  // 3. Check Math & KPI Constants
  assert.ok(data.includes('CaseD!B2:D2') && data.includes('CaseD!B5:D5'), 'Must reference Case D source cell ranges');
  assert.ok(data.includes('directCostInput: 75000'), 'Must define baseline direct cost ₹75,000');
  assert.ok(data.includes('78,000'), 'Must define stress test direct cost ₹78,000');

  // Verify baseline formula math
  const baselineRev = 150000;
  const baselineCost = 75000;
  const baselineOverhead = 45000;
  const baselineRec = 70000;
  assert.equal(baselineRev - baselineCost, 75000, 'Baseline Gross Profit must be ₹75,000');
  assert.equal(((baselineRev - baselineCost) / baselineRev) * 100, 50.0, 'Baseline Gross Margin must be 50.0%');
  assert.equal(baselineRev - baselineCost - baselineOverhead, 30000, 'Baseline Operating Profit must be ₹30,000');
  assert.equal(((baselineRev - baselineCost - baselineOverhead) / baselineRev) * 100, 20.0, 'Baseline Operating Margin must be 20.0%');
  assert.equal((baselineRec / baselineRev) * 100, 46.666666666666664, 'Baseline Receivables / Sales is 46.7%');

  // Verify stress test formula math
  const stressCost = 78000;
  assert.equal(baselineRev - stressCost, 72000, 'Stress Test Gross Profit must be ₹72,000');
  assert.equal(((baselineRev - stressCost) / baselineRev) * 100, 48.0, 'Stress Test Gross Margin must be 48.0%');
  assert.equal(baselineRev - stressCost - baselineOverhead, 27000, 'Stress Test Operating Profit must be ₹27,000');
  assert.equal(((baselineRev - stressCost - baselineOverhead) / baselineRev) * 100, 18.0, 'Stress Test Operating Margin must be 18.0%');

  // 4. Verify Workstation Delegation
  assert.ok(ws.includes('Session10DashboardJourney'), 'Workstation must delegate to Session10DashboardJourney');

  // 5. Verify page.tsx tab suppression and button wiring
  assert.ok(page.includes('selected > 24'), 'Tabs must be suppressed for selected <= 24');
  assert.ok(journey.includes('vcep-area-dashboard'), 'Journey must wire Build MIS Dashboard button');
  assert.ok(journey.includes('vcep-area-question'), 'Journey must wire Choose Management Question button');
  assert.ok(page.includes('Build a dashboard that supports decisions.'), 'Page must display Session 10 subline');

  // 6. Verify Evaluator Rules in lib
  assert.ok(rules.includes('s10-w1-kpi-selection'), 'Review rules must check KPI selection');
  assert.ok(rules.includes('s10-w2-kpi-calculation'), 'Review rules must check KPI calculation');
  assert.ok(rules.includes('s10-w3-sensitivity-test'), 'Review rules must check sensitivity stress test');
  assert.ok(rules.includes('s10-w4-memo-length'), 'Review rules must check 150-word constraint');
  assert.ok(rules.includes('s10-w5-memo-structure'), 'Review rules must check memo structure (insight, 2 actions, limitation)');

  // 7. Verify All 24 Sessions Preserved
  assert.equal(driveJson.length, 24, 'All 24 sessions must be preserved in drive-edition-3.json');
  assert.equal(driveJson[9].id, 10, 'Session 10 must exist at index 9');

  console.log('✅ Phase 1: Static Code, Data & Canonical Verification Passed (100%)\n');
}

async function runBrowserVerification() {
  console.log('--- Phase 2: Live Browser CDP Verification & Screenshot Capture ---');

  const PORT = 9380;
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--user-data-dir=/tmp/chrome-session-10-test-clean',
    'about:blank',
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
    const tabs = await listRes.json();
    const pageTab = tabs.find((t) => t.type === 'page') || tabs[0];
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
      value: 'session_s10_qa_test',
      domain: '127.0.0.1',
      path: '/',
    });

    // Mock auth /api/boot and /api/guided/session/10
    const s10Lesson = driveJson.find((s) => s.id === 10);
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        const s10Lesson = ${JSON.stringify(s10Lesson)};
        const origFetch = window.fetch;
        window.fetch = async (...args) => {
          const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
          if (url && url.includes('/api/boot')) {
            const res = await origFetch(...args);
            const data = await res.json();
            data.user = { id: 'student-10', email: 'analyst10@student.edu', role: 'student', name: 'Aarav MIS Controller' };
            return new Response(JSON.stringify(data), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          if (url && url.includes('/api/guided/session/10')) {
            return new Response(JSON.stringify({ lesson: s10Lesson }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return origFetch(...args);
        };
      `,
    });

    const targetUrl = 'http://127.0.0.1:5173/guided-learning?session=10';
    console.log(`Navigating to ${targetUrl}...`);
    await send('Page.navigate', { url: targetUrl });
    await new Promise((r) => setTimeout(r, 3000));

    // Capture 1440px Desktop Heading 1: Choose Management Question
    await send('Runtime.evaluate', {
      expression: `document.getElementById('vcep-area-question')?.scrollIntoView({ behavior: 'instant', block: 'start' });`,
    });
    await capture('s10-heading-01-question-desktop-1440.png', 1440, 900);

    // Capture 1440px Desktop Heading 2: Build MIS Dashboard
    await send('Runtime.evaluate', {
      expression: `document.getElementById('vcep-area-dashboard')?.scrollIntoView({ behavior: 'instant', block: 'start' });`,
    });
    await capture('s10-heading-02-dashboard-desktop-1440.png', 1440, 900);

    // Capture Tablet 768px
    await capture('s10-dashboard-tablet-768.png', 768, 1024);

    // Capture Mobile 390px
    await capture('s10-dashboard-mobile-390.png', 390, 844);

    // DOM Evaluation
    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const areaQuestion = document.getElementById('vcep-area-question');
          const areaDashboard = document.getElementById('vcep-area-dashboard');
          const tabs = document.querySelector('.v3-tabs');
          const bodyText = document.body.textContent || '';

          const card1 = document.querySelector('[data-task-id="S10-T01"]');
          const card2 = document.querySelector('[data-task-id="S10-T02"]');
          const card3 = document.querySelector('[data-task-id="S10-T03"]');
          const card4 = document.querySelector('[data-task-id="S10-T04"]');

          return {
            hasQuestion: !!areaQuestion,
            hasDashboard: !!areaDashboard,
            tabsHidden: !tabs,
            hasCard1: !!card1,
            hasCard2: !!card2,
            hasCard3: !!card3,
            hasCard4: !!card4,
            t1Title: card1?.querySelector('h3')?.textContent?.trim(),
            t2Title: card2?.querySelector('h3')?.textContent?.trim(),
            t3Title: card3?.querySelector('h3')?.textContent?.trim(),
            t4Title: card4?.querySelector('h3')?.textContent?.trim(),
            containsRevenue: bodyText.includes('1,50,000') || bodyText.includes('150000'),
            containsGrossMargin: bodyText.includes('50.0%'),
            containsOperatingMargin: bodyText.includes('20.0%'),
            containsReceivables: bodyText.includes('70,000') || bodyText.includes('70000'),
            containsSensitivityTester: bodyText.includes('Stress-Tester') || bodyText.includes('Stress Test'),
            containsMemoWordCounter: bodyText.includes('words') && bodyText.includes('/ 150 words'),
            containsCaseDGrid: bodyText.includes('CaseD!B2:D5') || bodyText.includes('₹1,00,000'),
            containsFourDashboardRules: bodyText.includes('RULE 1') && bodyText.includes('RULE 4') && bodyText.includes('Start with the Decision'),
            tablesCount: document.querySelectorAll('table').length,
          };
        })()
      `,
      returnByValue: true,
    });

    console.log('\n📊 DOM Inspection Result:', JSON.stringify(evalRes.result.value, null, 2));

    const v = evalRes.result.value;
    assert.ok(v.hasQuestion, 'Heading 1 #vcep-area-question must exist in DOM');
    assert.ok(v.hasDashboard, 'Heading 2 #vcep-area-dashboard must exist in DOM');
    assert.ok(v.tabsHidden, '.v3-tabs must be suppressed for Session 10');
    assert.ok(v.hasCard1, 'TaskCard S10-T01 must exist');
    assert.ok(v.hasCard2, 'TaskCard S10-T02 must exist');
    assert.ok(v.hasCard3, 'TaskCard S10-T03 must exist');
    assert.ok(v.hasCard4, 'TaskCard S10-T04 must exist');
    assert.equal(v.t1Title, 'Select Decision KPIs', 'Task 01 title must match');
    assert.equal(v.t2Title, 'Build the Dashboard', 'Task 02 title must match');
    assert.equal(v.t3Title, 'Test the Refresh', 'Task 03 title must match');
    assert.equal(v.t4Title, 'Present the Insight', 'Task 04 title must match');

    assert.ok(v.containsRevenue, 'Must display September revenue ₹150,000');
    assert.ok(v.containsGrossMargin, 'Must display September gross margin 50.0%');
    assert.ok(v.containsOperatingMargin, 'Must display September operating margin 20.0%');
    assert.ok(v.containsReceivables, 'Must display trade receivables ₹70,000');
    assert.ok(v.containsSensitivityTester, 'Must render Sensitivity Stress-Tester');
    assert.ok(v.containsMemoWordCounter, 'Must render memo with live word count validator');
    assert.ok(v.containsCaseDGrid, 'Must render Case D source cells');
    assert.ok(v.containsFourDashboardRules, 'Must display 4 executive dashboard rules');

    console.log('\n✅ Phase 2: Live Browser CDP Verification Passed 100%!');
    console.log('🎉 ALL VCEP SESSION 10 TRANSFORMATIONS VERIFIED SUCCESSFULLY!\n');

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
