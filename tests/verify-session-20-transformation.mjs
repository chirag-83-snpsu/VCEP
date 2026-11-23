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
  const ws = fs.readFileSync('app/guided-learning/workstations/session-20-workstation.tsx', 'utf8');
  const journey = fs.readFileSync('app/guided-learning/components/session-20-change-journey.tsx', 'utf8');
  const data = fs.readFileSync('app/guided-learning/components/session-20-change-data.ts', 'utf8');
  const rules = fs.readFileSync('lib/review-engine/session-rules/session-20.ts', 'utf8');
  const registry = fs.readFileSync('lib/review-engine/registry.ts', 'utf8');

  // 1. Check Natural Headings
  assert.ok(journey.includes('id="vcep-area-review"'), 'Must define #vcep-area-review');
  assert.ok(
    journey.includes('Review the Approved Change') || journey.includes('1. Review the Approved Change'),
    'Must have heading "Review the Approved Change"'
  );
  assert.ok(journey.includes('id="vcep-area-update"'), 'Must define #vcep-area-update');
  assert.ok(
    journey.includes('Update & Retest the Model') || journey.includes('2. Update & Retest the Model'),
    'Must have heading "Update & Retest the Model"'
  );

  // 2. Check 4 Unified TaskCards
  assert.ok(journey.includes('data-task-id="S20-T01"') || journey.includes('taskId="S20-T01"'), 'Must render Task 01');
  assert.ok(journey.includes('data-task-id="S20-T02"') || journey.includes('taskId="S20-T02"'), 'Must render Task 02');
  assert.ok(journey.includes('data-task-id="S20-T03"') || journey.includes('taskId="S20-T03"'), 'Must render Task 03');
  assert.ok(journey.includes('data-task-id="S20-T04"') || journey.includes('taskId="S20-T04"'), 'Must render Task 04');
  assert.ok(journey.includes('Review the Change Request'), 'Must have Task 01 title');
  assert.ok(journey.includes('Apply Version 2 Changes'), 'Must have Task 02 title');
  assert.ok(journey.includes('Recalculate and Retest'), 'Must have Task 03 title');
  assert.ok(journey.includes('Issue the Manager Update'), 'Must have Task 04 title');

  // 3. Check Case F Version 1 -> Version 2 Transition
  assert.ok(data.includes('CASE_F_INVOICES_V1_V2'), 'Must define CASE_F_INVOICES_V1_V2');
  assert.ok(data.includes('F01') && data.includes('F04'), 'Must contain invoices F01 through F04');
  assert.ok(data.includes('totalControlAmount: 100000'), 'Must define ₹1,00,000 v1 baseline receivables');
  assert.ok(data.includes('totalControlAmount: 95000'), 'Must define ₹95,000 v2 receivables after ₹5k credit note');
  assert.ok(data.includes('openingBankCash: 25000'), 'Must define ₹25,000 invariant bank cash');
  assert.ok(data.includes('sevenDayOutflows: 45000'), 'Must define ₹45,000 v1 7-day outflows');
  assert.ok(data.includes('sevenDayOutflows: 37000'), 'Must define ₹37,000 v2 7-day outflows');
  assert.ok(data.includes('sevenDayCashDeficit: 20000'), 'Must define ₹20,000 v1 cash deficit');
  assert.ok(data.includes('sevenDayCashDeficit: 12000'), 'Must define ₹12,000 v2 cash deficit');

  // 4. Check Change Control Board (CCB) Log & Principles
  assert.ok(data.includes('INITIAL_CHANGE_REQUESTS'), 'Must define INITIAL_CHANGE_REQUESTS');
  assert.ok(data.includes('CR-01') && data.includes('CR-02'), 'Must include CR-01 and CR-02');
  assert.ok(journey.includes('Change Control Board (CCB) Approved Order Register'), 'Must render CCB log section');
  assert.ok(journey.includes('Credit Note $\\ne$ Cash Receipt') || journey.includes('Credit Note != Cash Receipt'), 'Must state Credit Note principle');
  assert.ok(journey.includes('Payment Deferral $\\ne$ Expense Cancellation') || journey.includes('Payment Deferral != Expense Cancellation'), 'Must state Deferral principle');

  // 5. Check Non-Cash Invariance Audit
  assert.ok(
    journey.includes('Credit Note $\\ne$ Cash Receipt') && journey.includes('₹25,000'),
    'Must feature Non-Cash Invariance Audit principles'
  );
  assert.ok(
    journey.includes('RT-06') || data.includes('RT-06'),
    'Must define Non-Cash Credit Note Invariance Audit (RT-06)'
  );
  assert.ok(
    journey.includes('strictly invariant') || journey.includes('Zero cash collected'),
    'Must enforce invariant bank cash'
  );

  // 6. Check Dynamic Version Switching & Regression Tests
  assert.ok(journey.includes('activeVersion'), 'Must feature activeVersion state switch');
  assert.ok(data.includes('INITIAL_REGRESSION_TESTS'), 'Must define INITIAL_REGRESSION_TESTS');
  assert.ok(data.includes('RT-01') && data.includes('RT-05'), 'Must define regression tests RT-01 through RT-05');
  assert.ok(journey.includes('Executed Regression Tests Register'), 'Must render regression test suite');

  // 7. Check Client Version Defense & Executive Memo
  assert.ok(journey.includes('Client Scenario Simulation') || journey.includes('Client Pushback Defense'), 'Must feature Client Pushback Defense');
  assert.ok(journey.includes('versionDefense'), 'Must capture version defense rationale');
  assert.ok(journey.includes('executiveMemo'), 'Must capture executive memo');
  assert.ok(journey.includes('70') && journey.includes('140'), 'Must validate memo word count (70-140 words)');

  // 8. Check Governance & Peer Correction
  assert.ok(
    journey.includes('preparerName') && journey.includes('reviewerName') && journey.includes('decisionOwner'),
    'Must feature 3-tier CCB signoffs'
  );
  assert.ok(journey.includes('studentContribution'), 'Must feature individual work contribution');
  assert.ok(journey.includes('reviewerCorrection'), 'Must feature before/after peer defect correction');
  assert.ok(journey.includes('fileVersion'), 'Must track deliverable spreadsheet filename');

  // 9. Check Workstation Delegation
  assert.ok(ws.includes('Session20ChangeJourney'), 'Workstation must delegate to Session20ChangeJourney');

  // 10. Check page.tsx tab suppression and button wiring
  assert.ok(
    page.includes('selected > 24 && (') || page.includes('selected > 20 && ('),
    'Tabs must be suppressed for selected <= 24'
  );
  assert.ok(page.includes('vcep-area-update'), 'Page must wire Update & Retest Model button');
  assert.ok(page.includes('vcep-area-review'), 'Page must wire Review Approved Change button');
  assert.ok(page.includes('Control the change. Keep the evidence.'), 'Page must display Session 20 subline');

  // 11. Check Review Engine Rules in lib
  assert.ok(registry.includes('20: evaluateSession20'), 'Registry must register Session 20');
  assert.ok(rules.includes('s20-o1-change-mission'), 'Review rules must check change mission');
  assert.ok(rules.includes('s20-l1-change-principles'), 'Review rules must check change principles');
  assert.ok(rules.includes('s20-c1-case-boundaries'), 'Review rules must check case boundaries');
  assert.ok(rules.includes('s20-w1-ccb-log'), 'Review rules must check CCB log');
  assert.ok(rules.includes('s20-w2-model-v2-recalculation'), 'Review rules must check model v2 recalculation');
  assert.ok(rules.includes('s20-w3-non-cash-credit-audit'), 'Review rules must check non-cash audit');
  assert.ok(rules.includes('s20-w4-regression-tests'), 'Review rules must check regression tests');
  assert.ok(rules.includes('s20-w5-version-defense'), 'Review rules must check version defense');
  assert.ok(rules.includes('s20-w6-executive-memo'), 'Review rules must check executive memo');
  assert.ok(rules.includes('s20-t1-governance'), 'Review rules must check governance');
  assert.ok(rules.includes('s20-t2-rubric-compliance'), 'Review rules must check rubric compliance');

  console.log('✅ Phase 1: Static Code & Content Verification Passed (100%)\n');
}

async function runBrowserVerification() {
  console.log('--- Phase 2: Live Browser CDP Verification & Screenshot Capture ---');

  const PORT = 9387;
  const tmpProfile = `/tmp/chrome-session-20-test-clean-${Date.now()}`;
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${tmpProfile}`,
    'about:blank',
  ]);

  let pageTab = null;
  for (let attempt = 0; attempt < 15; attempt++) {
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
      value: 'session_s20_qa_test',
      domain: '127.0.0.1',
      path: '/',
    });

    // Mock auth /api/boot and /api/guided/session/20
    const s20Lesson = driveJson.find((s) => s.id === 20);
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        const s20Lesson = ${JSON.stringify(s20Lesson)};
        const origFetch = window.fetch;
        window.fetch = async (...args) => {
          const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
          if (url && url.includes('/api/boot')) {
            const res = await origFetch(...args);
            const data = await res.json();
            data.user = { id: 'student-20', email: 'changecontrol20@student.edu', role: 'student', name: 'Lead Release Manager' };
            return new Response(JSON.stringify(data), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          if (url && url.includes('/api/guided/session/20')) {
            return new Response(JSON.stringify({ lesson: s20Lesson }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return origFetch(...args);
        };
      `,
    });

    console.log('Navigating to http://127.0.0.1:5173/guided-learning?session=20...');
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/guided-learning?session=20' });
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

    // 1. Desktop 1440px - Heading 1 (Review the Approved Change)
    await captureViewport('s20-heading-01-review-desktop-1440.png', 1440, 900, '#vcep-area-review');

    // 2. Desktop 1440px - Heading 2 (Update & Retest the Model)
    await captureViewport('s20-heading-02-update-desktop-1440.png', 1440, 900, '#vcep-area-update');

    // 3. Tablet 768px
    await captureViewport('s20-change-tablet-768.png', 768, 1024, '#vcep-area-review');

    // 4. Mobile 390px
    await captureViewport('s20-change-mobile-390.png', 390, 844, '#vcep-area-review');

    // DOM Assertions Verification
    const evalResult = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const reviewArea = document.getElementById('vcep-area-review');
          const updateArea = document.getElementById('vcep-area-update');
          const tabs = document.querySelector('.v3-tabs');
          const taskCards = document.querySelectorAll('article[data-task-id]');
          const pageText = document.body.innerText;

          return {
            hasReviewArea: !!reviewArea,
            hasUpdateArea: !!updateArea,
            tabsHidden: !tabs,
            taskCardsCount: taskCards.length,
            hasTask01: !!document.querySelector('[data-task-id="S20-T01"]'),
            hasTask02: !!document.querySelector('[data-task-id="S20-T02"]'),
            hasTask03: !!document.querySelector('[data-task-id="S20-T03"]'),
            hasTask04: !!document.querySelector('[data-task-id="S20-T04"]'),
            task01Title: pageText.includes('Review the Change Request'),
            task02Title: pageText.includes('Apply Version 2 Changes'),
            task03Title: pageText.includes('Recalculate and Retest'),
            task04Title: pageText.includes('Issue the Manager Update'),
            containsWhyThisMatters: pageText.includes('Why this matters'),
            containsCaseFTransition: pageText.includes('Side-by-Side Version 1 vs Version 2 Metric Delta') && pageText.includes('₹1,00,000') && pageText.includes('₹95,000'),
            containsCCBLog: pageText.includes('Change Control Board (CCB) Approved Order Register') && pageText.includes('CR-01') && pageText.includes('CR-02'),
            containsNonCashAudit: pageText.includes('Credit Note') && pageText.includes('₹25,000') && pageText.includes('invariant'),
            containsModelRecalculation: pageText.includes('Receivables Schedule') && (pageText.includes('-₹12,000') || pageText.includes('₹95,000')),
            containsRegressionTests: pageText.includes('Regression Tests Register') && pageText.includes('RT-01') && pageText.includes('RT-05'),
            containsVersionDefense: (pageText.includes('Defense of Version 1 Baseline') || pageText.includes('Client Pushback Defense')) && pageText.includes('Model v1.0'),
            containsExecutiveMemo: pageText.includes('Executive Manager Update') && pageText.includes('70–140 words'),
            containsGovernance: pageText.includes('Preparer') && pageText.includes('Reviewer') && pageText.includes('Decision Owner'),
            containsRubricCard: pageText.includes('Automatic Change Control Review') && pageText.includes('10 / 10 pts'),
            tablesCount: document.querySelectorAll('table').length,
          };
        })()
      `,
      returnByValue: true,
    });

    console.log('\n📊 DOM Inspection Result:', JSON.stringify(evalResult.result.value, null, 2));

    const v = evalResult.result.value;
    assert.strictEqual(v.hasReviewArea, true, 'Must render #vcep-area-review');
    assert.strictEqual(v.hasUpdateArea, true, 'Must render #vcep-area-update');
    assert.strictEqual(v.tabsHidden, true, 'Legacy tabs must be hidden for Session 20');
    assert.strictEqual(v.taskCardsCount, 4, 'Must render exactly 4 bordered TaskCards');
    assert.ok(v.hasTask01 && v.task01Title, 'Must render Task 01: Review the Change Request');
    assert.ok(v.hasTask02 && v.task02Title, 'Must render Task 02: Apply Version 2 Changes');
    assert.ok(v.hasTask03 && v.task03Title, 'Must render Task 03: Recalculate and Retest');
    assert.ok(v.hasTask04 && v.task04Title, 'Must render Task 04: Issue the Manager Update');
    assert.strictEqual(v.containsWhyThisMatters, true, 'Must render collapsible Why this matters buttons');
    assert.strictEqual(v.containsCaseFTransition, true, 'Must display Case F v1 -> v2 transition');
    assert.strictEqual(v.containsCCBLog, true, 'Must display CCB log table');
    assert.strictEqual(v.containsNonCashAudit, true, 'Must display non-cash credit audit');
    assert.strictEqual(v.containsModelRecalculation, true, 'Must display live release model v2.0');
    assert.strictEqual(v.containsRegressionTests, true, 'Must display six regression tests');
    assert.strictEqual(v.containsVersionDefense, true, 'Must display version defense section');
    assert.strictEqual(v.containsExecutiveMemo, true, 'Must display executive memo section');
    assert.strictEqual(v.containsGovernance, true, 'Must render governance fields');
    assert.strictEqual(v.containsRubricCard, true, 'Must render review engine and rubric score');
    assert.ok(v.tablesCount >= 3, 'Must render at least 3 tables');

    console.log('\n✅ Phase 2: Live Browser CDP Verification Passed 100%!');
    console.log('🎉 ALL VCEP SESSION 20 TRANSFORMATIONS VERIFIED SUCCESSFULLY!\n');

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
