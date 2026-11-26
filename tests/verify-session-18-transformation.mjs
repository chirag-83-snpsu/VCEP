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
  const ws = fs.readFileSync('app/guided-learning/workstations/session-18-workstation.tsx', 'utf8');
  const journey = fs.readFileSync('app/guided-learning/components/session-18-planning-journey.tsx', 'utf8');
  const data = fs.readFileSync('app/guided-learning/components/session-18-planning-data.ts', 'utf8');
  const rules = fs.readFileSync('lib/review-engine/session-rules/session-18.ts', 'utf8');
  const registry = fs.readFileSync('lib/review-engine/registry.ts', 'utf8');

  // 1. Check Natural Headings
  assert.ok(journey.includes('id="vcep-area-solution"'), 'Must define #vcep-area-solution');
  assert.ok(journey.includes('Select the Feasible Solution') || journey.includes('1. Select the Feasible Solution'), 'Must have heading "Select the Feasible Solution"');
  assert.ok(journey.includes('id="vcep-area-plan"'), 'Must define #vcep-area-plan');
  assert.ok(journey.includes('Plan Tasks & Acceptance Tests') || journey.includes('2. Plan Tasks & Acceptance Tests'), 'Must have heading "Plan Tasks & Acceptance Tests"');

  // 2. Check 4 Unified TaskCards
  assert.ok(journey.includes('function TaskCard('), 'Must define unified TaskCard component');
  assert.ok(journey.includes('Task 01 — Compare Solutions'), 'Must define Task 01');
  assert.ok(journey.includes('Task 02 — Define the Scope'), 'Must define Task 02');
  assert.ok(journey.includes('Task 03 — Set Acceptance Tests'), 'Must define Task 03');
  assert.ok(journey.includes('Task 04 — Plan Ten Working Days'), 'Must define Task 04');
  assert.ok(journey.includes('S18-T01') && journey.includes('S18-T04'), 'Must have task IDs S18-T01 through S18-T04');

  // 3. Check Case F Grounding & Capstone Constraints
  assert.ok(data.includes('CASE_F_INVOICES'), 'Must define CASE_F_INVOICES');
  assert.ok(data.includes('F01') && data.includes('F04'), 'Must contain invoices F01 through F04');
  assert.ok(data.includes('net7DayDeficit: 20000'), 'Must define ₹20,000 net 7-day deficit');
  assert.ok(data.includes('totalReceivables: 100000'), 'Must define ₹1,00,000 control total');
  assert.ok(data.includes('maxStudentHours: 6.0') || data.includes('maxStudentHours: 6'), 'Must enforce max 6.0 student hours');
  assert.ok(data.includes('maxWorkingDays: 10'), 'Must enforce 10 working days');

  // 4. Check Architectural Option Evaluation
  assert.ok(data.includes('SOLUTION_OPTIONS'), 'Must define SOLUTION_OPTIONS');
  assert.ok(data.includes('Option A: Dynamic Spreadsheet Prototype'), 'Must define Option A Dynamic Spreadsheet');
  assert.ok(data.includes('Option B: Static Slide-Only Presentation'), 'Must define Option B Static Slide');
  assert.ok(journey.includes('handleSelectSolution'), 'Must have interactive solution selection');

  // 5. Check Scope Discipline Selector
  assert.ok(data.includes('INITIAL_SCOPE_ITEMS'), 'Must define INITIAL_SCOPE_ITEMS');
  assert.ok(data.includes('must-have') && data.includes('nice-to-have') && data.includes('exclusion'), 'Must separate must-have, nice-to-have, and exclusion');
  assert.ok(data.includes('Direct Production System Writes'), 'Must prohibit direct production system writes');
  assert.ok(data.includes('Automated External Sending'), 'Must prohibit automated external email sending');

  // 6. Check 10-Day WBS & 6.0h Workload Cap
  assert.ok(data.includes('INITIAL_WBS_TASKS'), 'Must define INITIAL_WBS_TASKS');
  assert.ok(journey.includes('CAPSTONE_CONSTRAINTS.maxStudentHours'), 'Must govern max individual student hours');
  assert.ok(journey.includes('RACI Matrix'), 'Must feature RACI designations');

  // 7. Check 5 Binary Acceptance Criteria
  assert.ok(data.includes('INITIAL_ACCEPTANCE_CRITERIA'), 'Must define INITIAL_ACCEPTANCE_CRITERIA');
  assert.ok(data.includes('AC1') && data.includes('AC5'), 'Must define AC1 through AC5');
  assert.ok(journey.includes('GATE PASSED') && journey.includes('GATE FAILED'), 'Must support binary pass/fail gate states');

  // 8. Check Risk Register & Handover Protocol
  assert.ok(data.includes('INITIAL_RISK_REGISTER'), 'Must define INITIAL_RISK_REGISTER');
  assert.ok(journey.includes('handoverNotes'), 'Must support client handover protocol');

  // 9. Check Workstation Delegation
  assert.ok(ws.includes('Session18PlanningJourney'), 'Workstation must delegate to Session18PlanningJourney');

  // 10. Check page.tsx tab suppression and button wiring
  assert.ok(page.includes('selected > 24 && (') || page.includes('selected > 18 && ('), 'Tabs must be suppressed for selected <= 18');
  assert.ok(journey.includes('vcep-area-plan'), 'Journey must wire Plan Tasks & Acceptance Tests button');
  assert.ok(journey.includes('vcep-area-solution'), 'Journey must wire Select Feasible Solution button');
  assert.ok(page.includes('Choose a solution. Plan the delivery.'), 'Page must display Session 18 subline');

  // 11. Check Review Engine Rules in lib
  assert.ok(registry.includes('18: evaluateSession18'), 'Registry must register Session 18');
  assert.ok(rules.includes('s18-o1-planning-mission'), 'Review rules must check planning mission');
  assert.ok(rules.includes('s18-l1-architecture-evaluation'), 'Review rules must check architecture evaluation');
  assert.ok(rules.includes('s18-c1-case-boundaries'), 'Review rules must check case boundaries');
  assert.ok(rules.includes('s18-w1-solution-selection'), 'Review rules must check solution selection');
  assert.ok(rules.includes('s18-w2-scope-discipline'), 'Review rules must check scope discipline');
  assert.ok(rules.includes('s18-w3-wbs-schedule'), 'Review rules must check WBS schedule');
  assert.ok(rules.includes('s18-w4-acceptance-tests'), 'Review rules must check acceptance tests');
  assert.ok(rules.includes('s18-w5-risk-handover'), 'Review rules must check risk and handover');
  assert.ok(rules.includes('s18-t1-governance'), 'Review rules must check governance');
  assert.ok(rules.includes('s18-t2-rubric-compliance'), 'Review rules must check rubric compliance');

  console.log('✅ Phase 1: Static Code & Content Verification Passed (100%)\n');
}

async function runBrowserVerification() {
  console.log('--- Phase 2: Live Browser CDP Verification & Screenshot Capture ---');

  const PORT = 9387;
  const chromeDir = `/tmp/chrome-session-18-test-clean-${Date.now()}`;
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

    await new Promise((resolve) => ws.addEventListener('open', resolve, { once: true }));

    await send('Page.enable');
    await send('DOM.enable');
    await send('Runtime.enable');
    await send('Network.enable');

    // Set authenticated session cookie
    await send('Network.setCookie', {
      name: '__vcep_session',
      value: 'session_s18_qa_test',
      domain: '127.0.0.1',
      path: '/',
    });

    // Mock auth /api/boot and /api/guided/session/18
    const s18Lesson = driveJson.find((s) => s.id === 18);
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        const s18Lesson = ${JSON.stringify(s18Lesson)};
        const origFetch = window.fetch;
        window.fetch = async (...args) => {
          const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
          if (url && url.includes('/api/boot')) {
            const res = await origFetch(...args);
            const data = await res.json();
            data.user = { id: 'student-18', email: 'planning18@student.edu', role: 'student', name: 'Lead Project Modeler' };
            return new Response(JSON.stringify(data), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          if (url && url.includes('/api/guided/session/18')) {
            return new Response(JSON.stringify({ lesson: s18Lesson }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return origFetch(...args);
        };
      `,
    });

    console.log('Navigating to http://127.0.0.1:5173/guided-learning?session=18...');
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/guided-learning?session=18' });
    await new Promise((r) => setTimeout(r, 3500));

    async function captureViewport(filename, width, height, scrollSelector = null) {
      await send('Emulation.setDeviceMetricsOverride', {
        width,
        height,
        deviceScaleFactor: 2,
        mobile: width <= 640,
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

    // 1. Desktop 1440px - Heading 1 (Select Feasible Solution)
    await captureViewport('s18-heading-01-solution-desktop-1440.png', 1440, 900, '#vcep-area-solution');

    // 2. Desktop 1440px - Heading 2 (Plan Tasks & Acceptance Tests)
    await captureViewport('s18-heading-02-plan-desktop-1440.png', 1440, 900, '#vcep-area-plan');

    // 3. Tablet 768px
    await captureViewport('s18-planning-tablet-768.png', 768, 1024, '#vcep-area-solution');

    // 4. Mobile 390px
    await captureViewport('s18-planning-mobile-390.png', 390, 844, '#vcep-area-solution');

    // DOM Assertions Verification
    const evalResult = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const solutionArea = document.getElementById('vcep-area-solution');
          const planArea = document.getElementById('vcep-area-plan');
          const tabs = document.querySelector('.v3-tabs');
          const pageText = document.body.textContent || '';
          const taskCards = document.querySelectorAll('article[data-task-id]');

          return {
            hasSolutionArea: !!solutionArea,
            hasPlanArea: !!planArea,
            tabsHidden: !tabs,
            taskCardsCount: taskCards.length,
            hasTask01: !!document.querySelector('[data-task-id="S18-T01"]'),
            hasTask02: !!document.querySelector('[data-task-id="S18-T02"]'),
            hasTask03: !!document.querySelector('[data-task-id="S18-T03"]'),
            hasTask04: !!document.querySelector('[data-task-id="S18-T04"]'),
            task01Title: pageText.includes('Task 01 — Compare Solutions'),
            task02Title: pageText.includes('Task 02 — Define the Scope'),
            task03Title: pageText.includes('Task 03 — Set Acceptance Tests'),
            task04Title: pageText.includes('Task 04 — Plan Ten Working Days'),
            containsSolutionOptions: pageText.includes('Option A: Dynamic Spreadsheet') && pageText.includes('Option B: Static Slide-Only'),
            containsScopeDiscipline: pageText.includes('Scope Discipline') && pageText.includes('Must-Have') && pageText.includes('Exclusion'),
            containsWbsTable: pageText.includes('10-Day Work Breakdown Structure') && pageText.includes('Priya Sharma') && pageText.includes('RACI'),
            containsAcceptanceGates: pageText.includes('The Five Binary (Pass/Fail) Acceptance Gates') && pageText.includes('GATE PASSED'),
            containsRiskRegister: pageText.includes('Project Risk Register') && pageText.includes('Attempted Live Production System Writes'),
            containsHandoverProtocol: pageText.includes('Client Handover Protocol') && (pageText.includes('production system writes') || Array.from(document.querySelectorAll('textarea')).some(t => t.value.includes('production'))),
            containsGovernance: pageText.includes('Preparer') && pageText.includes('Reviewer') && pageText.includes('Decision Owner'),
            containsRubricCard: pageText.includes('Automatic Project Charter Review') && pageText.includes('Rubric Score'),
            tablesCount: document.querySelectorAll('table').length,
          };
        })()
      `,
      returnByValue: true,
    });

    console.log('\n📊 DOM Inspection Result:', JSON.stringify(evalResult.result.value, null, 2));

    const v = evalResult.result.value;
    assert.strictEqual(v.hasSolutionArea, true, 'Must render #vcep-area-solution');
    assert.strictEqual(v.hasPlanArea, true, 'Must render #vcep-area-plan');
    assert.strictEqual(v.tabsHidden, true, 'Legacy tabs must be hidden for Session 18');
    assert.strictEqual(v.taskCardsCount, 4, 'Must render exactly 4 bordered TaskCards');
    assert.ok(v.hasTask01 && v.task01Title, 'Must render Task 01: Compare Solutions');
    assert.ok(v.hasTask02 && v.task02Title, 'Must render Task 02: Define the Scope');
    assert.ok(v.hasTask03 && v.task03Title, 'Must render Task 03: Set Acceptance Tests');
    assert.ok(v.hasTask04 && v.task04Title, 'Must render Task 04: Plan Ten Working Days');
    assert.strictEqual(v.containsSolutionOptions, true, 'Must display Option A and Option B solution comparison');
    assert.strictEqual(v.containsScopeDiscipline, true, 'Must render scope discipline selector');
    assert.strictEqual(v.containsWbsTable, true, 'Must render 10-day WBS table with RACI');
    assert.strictEqual(v.containsAcceptanceGates, true, 'Must render 5 binary acceptance criteria');
    assert.strictEqual(v.containsRiskRegister, true, 'Must render project risk register');
    assert.strictEqual(v.containsHandoverProtocol, true, 'Must render client handover protocol');
    assert.strictEqual(v.containsGovernance, true, 'Must render governance fields');
    assert.strictEqual(v.containsRubricCard, true, 'Must render review engine and rubric score');
    assert.ok(v.tablesCount >= 2, 'Must render at least 2 tables (WBS + Risk Register)');

    console.log('\n✅ Phase 2: Live Browser CDP Verification Passed 100%!');
    console.log('🎉 ALL VCEP SESSION 18 TRANSFORMATIONS VERIFIED SUCCESSFULLY!\n');

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
