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

  const s06Data = fs.readFileSync('app/guided-learning/components/session-06-ledger-data.ts', 'utf8');
  const s06Comp = fs.readFileSync('app/guided-learning/components/session-06-ledger-journey.tsx', 'utf8');
  const pageTsx = fs.readFileSync('app/guided-learning/page.tsx', 'utf8');
  const s06Rules = fs.readFileSync('lib/review-engine/session-rules/session-06.ts', 'utf8');

  // 1. Verify Core Financial Constants
  assert.ok(s06Data.includes('ERROR_AMOUNT_INR = 35000'), 'Must define ERROR_AMOUNT_INR = 35000');
  assert.ok(s06Data.includes('TARGET_TRIAL_BALANCE_TOTAL = 218000'), 'Must define TARGET_TRIAL_BALANCE_TOTAL = 218000');
  assert.ok(s06Data.includes('TARGET_NET_PROFIT = 53500'), 'Must define TARGET_NET_PROFIT = 53500');
  assert.ok(s06Data.includes('TARGET_ASSETS = 171500'), 'Must define TARGET_ASSETS = 171500');

  // 2. Verify Two Natural Headings in Component
  assert.ok(s06Comp.includes('id="vcep-area-investigate"'), 'Must have Heading 1: Investigate the Ledger Error');
  assert.ok(s06Comp.includes('id="vcep-area-close"'), 'Must have Heading 2: Complete the Month-End Close');

  // 3. Verify Unified TaskCard Component Pattern & 4 Task Cards
  assert.ok(s06Comp.includes('function TaskCard('), 'Must define unified TaskCard component');
  assert.ok(s06Comp.includes("border: '1px solid #DCE5E9'"), 'TaskCard must use neutral 1px #DCE5E9 border');
  assert.ok(s06Comp.includes("borderLeft: isActive ? '3px solid #0F766E'"), 'TaskCard must use 3px teal accent when active');
  assert.ok(s06Comp.includes('taskId="S06-T01"'), 'Must define Task 01 (S06-T01)');
  assert.ok(s06Comp.includes('taskId="S06-T02"'), 'Must define Task 02 (S06-T02)');
  assert.ok(s06Comp.includes('taskId="S06-T03"'), 'Must define Task 03 (S06-T03)');
  assert.ok(s06Comp.includes('taskId="S06-T04"'), 'Must define Task 04 (S06-T04)');

  assert.ok(s06Comp.includes('title="Post to the Ledger"'), 'Task 01 title must be Post to the Ledger');
  assert.ok(s06Comp.includes('title="Correct the Posting Error"'), 'Task 02 title must be Correct the Posting Error');
  assert.ok(s06Comp.includes('title="Prepare Closing Statements"'), 'Task 03 title must be Prepare Closing Statements');
  assert.ok(s06Comp.includes('title="Complete Close Review"'), 'Task 04 title must be Complete Close Review');

  // 4. Verify Deliberate Error Briefing & Cash Invariance
  assert.ok(s06Comp.includes('Deliberate ₹35,000 Error'), 'Must describe deliberate ₹35,000 error');
  assert.ok(s06Comp.includes('Bank Cash is 100% UNCHANGED'), 'Must enforce cash invariance');

  // 5. Verify Page.tsx Wiring
  assert.ok(pageTsx.includes('Session06LedgerJourney'), 'Must import Session06LedgerJourney in page.tsx');
  assert.ok(pageTsx.includes('selected > 24'), 'Must hide v3-tabs for sessions 1-24');
  assert.ok(s06Comp.includes('Complete the Month-End Close') || s06Comp.includes('Complete Month-End Close'), 'Must have top Complete Month-End Close button');

  // 6. Verify Review Rules
  assert.ok(s06Rules.includes('s06-w1-correction-journal'), 'Must include s06-w1-correction-journal check');
  assert.ok(s06Rules.includes('s06-w2-trial-balance'), 'Must include s06-w2-trial-balance check');
  assert.ok(s06Rules.includes('s06-w3-income-statement'), 'Must include s06-w3-income-statement check');
  assert.ok(s06Rules.includes('s06-w4-accounting-equation'), 'Must include s06-w4-accounting-equation check');
  assert.ok(s06Rules.includes('s06-w5-undetectable-errors'), 'Must include s06-w5-undetectable-errors check');
  assert.ok(s06Rules.includes('s06-w6-close-checklist'), 'Must include s06-w6-close-checklist check');

  // 7. Verify All 24 Sessions Preserved
  assert.equal(driveJson[0].id, 1, 'Session 01 must be preserved');
  assert.equal(driveJson[1].id, 2, 'Session 02 must be preserved');
  assert.equal(driveJson[2].id, 3, 'Session 03 must be preserved');
  assert.equal(driveJson[3].id, 4, 'Session 04 must be preserved');
  assert.equal(driveJson[4].id, 5, 'Session 05 must be preserved');
  assert.equal(driveJson[5].id, 6, 'Session 06 must be preserved');
  assert.equal(driveJson.length, 24, 'All 24 sessions must be preserved');

  console.log('✅ Static Verification Passed (100%)\n');
}

async function runBrowserVerification() {
  console.log('--- Phase 2: Live Browser CDP Verification & Screenshot Capture ---');

  const PORT = 9356;
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--user-data-dir=/tmp/chrome-session-06-test-clean',
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

      await new Promise((r) => setTimeout(r, 700));

      const screenshot = await send('Page.captureScreenshot', { format: 'png' });
      const buffer = Buffer.from(screenshot.data, 'base64');

      const docsPath = path.join(outDirDocs, filename);
      const artPath = path.join(outDirArtifact, filename);
      fs.writeFileSync(docsPath, buffer);
      fs.writeFileSync(artPath, buffer);
      console.log(`📸 Saved screenshot: ${filename} (${width}x${height})`);
    }

    // Set authenticated session cookie to view Guided Learning
    await send('Network.enable');
    await send('Network.setCookie', {
      name: '__vcep_session',
      value: 'session_s06_qa_test',
      domain: '127.0.0.1',
      path: '/',
    });

    // Mock auth /api/boot and /api/guided/session/6
    const s6Lesson = driveJson[5];
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        const s6Lesson = ${JSON.stringify(s6Lesson)};
        const origFetch = window.fetch;
        window.fetch = async (...args) => {
          const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
          if (url && url.includes('/api/boot')) {
            const res = await origFetch(...args);
            const data = await res.json();
            data.user = { id: 'student-6', email: 'accountant6@student.edu', role: 'student', name: 'Kavya Controller' };
            return new Response(JSON.stringify(data), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          if (url && url.includes('/api/guided/session/6')) {
            return new Response(JSON.stringify({ lesson: s6Lesson }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return origFetch(...args);
        };
      `,
    });

    // 1. Desktop 1440px Capture: Navigate to /guided-learning?session=6
    console.log('Navigating to /guided-learning?session=6...');
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/guided-learning?session=6' });
    await new Promise((r) => setTimeout(r, 3000));

    // Capture Desktop Heading 1 (Investigate the Ledger Error) & Tasks 01 & 02
    await capture('s06-heading-01-investigate-desktop-1440.png', 1440, 900);

    // Scroll down to Heading 2 (Complete the Month-End Close) & Tasks 03 & 04
    await send('Runtime.evaluate', {
      expression: `
        const el = document.getElementById('vcep-area-close');
        if (el) el.scrollIntoView({ behavior: 'instant' });
      `,
    });
    await new Promise((r) => setTimeout(r, 600));

    // Capture Desktop Heading 2 (Complete Month-End Close)
    await capture('s06-heading-02-close-desktop-1440.png', 1440, 900);

    // 2. Tablet 768px Capture
    await send('Runtime.evaluate', {
      expression: `
        const el = document.getElementById('vcep-area-investigate');
        if (el) el.scrollIntoView({ behavior: 'instant' });
      `,
    });
    await capture('s06-ledger-tablet-768.png', 768, 1024);

    // 3. Mobile 390px Capture
    await capture('s06-ledger-mobile-390.png', 390, 844);

    // 4. Verify DOM Elements
    const domCheck = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const areaInvestigate = document.getElementById('vcep-area-investigate');
          const areaClose = document.getElementById('vcep-area-close');
          const v3Tabs = document.querySelector('.v3-tabs');
          const card1 = document.querySelector('[data-task-id="S06-T01"]');
          const card2 = document.querySelector('[data-task-id="S06-T02"]');
          const card3 = document.querySelector('[data-task-id="S06-T03"]');
          const card4 = document.querySelector('[data-task-id="S06-T04"]');

          const bodyText = document.body.textContent || '';
          const hasErrorBriefing = bodyText.includes('Doc A05 Collection Misclassified as New Revenue');
          const hasCashInvariance = bodyText.includes('Bank Cash is 100% UNCHANGED');
          const hasTrialBalance = bodyText.includes('Closing Trial Balance as of September 30, 2026');
          const hasTargetBalance = bodyText.includes('2,18,000');
          const hasNetProfit = bodyText.includes('53,500');
          const hasEquation = bodyText.includes('1,71,500');
          const hasChecklist = bodyText.includes('Month-End Review Sign-Off Checklist');
          const hasGovernance = bodyText.includes('Portfolio Governance & Close Sign-Off');
          const hasRubric = bodyText.toLowerCase().includes('assessment rubric') && bodyText.includes('10 Marks Total');

          return {
            hasAreaInvestigate: !!areaInvestigate,
            hasAreaClose: !!areaClose,
            tabsHidden: !v3Tabs,
            hasCard1: !!card1,
            hasCard2: !!card2,
            hasCard3: !!card3,
            hasCard4: !!card4,
            t1Title: card1 ? card1.querySelector('h3')?.textContent : null,
            t2Title: card2 ? card2.querySelector('h3')?.textContent : null,
            t3Title: card3 ? card3.querySelector('h3')?.textContent : null,
            t4Title: card4 ? card4.querySelector('h3')?.textContent : null,
            hasErrorBriefing,
            hasCashInvariance,
            hasTrialBalance,
            hasTargetBalance,
            hasNetProfit,
            hasEquation,
            hasChecklist,
            hasGovernance,
            hasRubric,
          };
        })()
      `,
      returnByValue: true,
    });

    console.log('📊 DOM Inspection Result:', domCheck.result.value);
    const r = domCheck.result.value;
    assert.ok(r.hasAreaInvestigate, 'Heading 1 (Investigate the Ledger Error) must exist');
    assert.ok(r.hasAreaClose, 'Heading 2 (Complete the Month-End Close) must exist');
    assert.ok(r.tabsHidden, 'v3-tabs must be hidden for Session 06');
    assert.ok(r.hasCard1, 'TaskCard S06-T01 must exist');
    assert.ok(r.hasCard2, 'TaskCard S06-T02 must exist');
    assert.ok(r.hasCard3, 'TaskCard S06-T03 must exist');
    assert.ok(r.hasCard4, 'TaskCard S06-T04 must exist');
    assert.equal(r.t1Title, 'Post to the Ledger', 'Task 01 title must match');
    assert.equal(r.t2Title, 'Correct the Posting Error', 'Task 02 title must match');
    assert.equal(r.t3Title, 'Prepare Closing Statements', 'Task 03 title must match');
    assert.equal(r.t4Title, 'Complete Close Review', 'Task 04 title must match');
    assert.ok(r.hasErrorBriefing, 'Deliberate ₹35,000 error briefing must exist');
    assert.ok(r.hasCashInvariance, 'Bank cash invariance notice must exist');
    assert.ok(r.hasTrialBalance, 'Closing trial balance table must exist');
    assert.ok(r.hasTargetBalance, 'Target trial balance total ₹2,18,000 must exist');
    assert.ok(r.hasNetProfit, 'Target net profit ₹53,500 must exist');
    assert.ok(r.hasEquation, 'Accounting equation ₹1,71,500 must exist');
    assert.ok(r.hasChecklist, 'Month-end close checklist must exist');
    assert.ok(r.hasGovernance, 'Portfolio Governance section must exist');
    assert.ok(r.hasRubric, '10-Point Assessment rubric must exist');

    console.log('✅ Browser End-to-End Verification Passed 100%!\n');

    ws.close();
  } finally {
    chrome.kill();
  }
}

async function run() {
  await runStaticVerification();
  await runBrowserVerification();
}

run().catch((err) => {
  console.error('❌ Verification Failed:', err);
  process.exit(1);
});
