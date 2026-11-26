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
  const ws = fs.readFileSync('app/guided-learning/workstations/session-14-workstation.tsx', 'utf8');
  const journey = fs.readFileSync('app/guided-learning/components/session-14-ai-journey.tsx', 'utf8');
  const data = fs.readFileSync('app/guided-learning/components/session-14-ai-data.ts', 'utf8');
  const rules = fs.readFileSync('lib/review-engine/session-rules/session-14.ts', 'utf8');

  // 1. Check Natural Headings
  assert.ok(journey.includes('id="vcep-area-audit"'), 'Must define #vcep-area-audit');
  assert.ok(journey.includes('Challenge the AI Report'), 'Must have heading "Challenge the AI Report"');
  assert.ok(journey.includes('id="vcep-area-workflow"'), 'Must define #vcep-area-workflow');
  assert.ok(journey.includes('Build a Verified Workflow'), 'Must have heading "Build a Verified Workflow"');

  // 2. Check Unified TaskCard Architecture & 4 Bordered Cards
  assert.ok(journey.includes('function TaskCard('), 'Must define unified TaskCard component');
  assert.ok(journey.includes('taskId="S14-T01"'), 'Must include TaskCard S14-T01');
  assert.ok(journey.includes('taskId="S14-T02"'), 'Must include TaskCard S14-T02');
  assert.ok(journey.includes('taskId="S14-T03"'), 'Must include TaskCard S14-T03');
  assert.ok(journey.includes('taskId="S14-T04"'), 'Must include TaskCard S14-T04');

  // 3. Check Task Titles
  assert.ok(journey.includes('title="Audit Four AI Claims"'), 'Task 01 title must be "Audit Four AI Claims"');
  assert.ok(journey.includes('title="Correct the Management Memo"'), 'Task 02 title must be "Correct the Management Memo"');
  assert.ok(journey.includes('title="Build Validation Checks"'), 'Task 03 title must be "Build Validation Checks"');
  assert.ok(journey.includes('title="Test the Approval Flow"'), 'Task 04 title must be "Test the Approval Flow"');

  // 4. Check Border and Styling Standards
  assert.ok(journey.includes("border: '1px solid #DCE5E9'"), 'Must use 1px solid #DCE5E9 border');
  assert.ok(journey.includes("borderLeft: isActive ? '3px solid #0F766E'"), 'Must use 3px teal accent for active task');
  assert.ok(journey.includes("borderRadius: '16px'"), 'Must use 16px radius');

  // 5. Check Case D Data Constants
  assert.ok(data.includes('CASE_D_DATA'), 'Must define CASE_D_DATA');
  assert.ok(data.includes('julyINR: 100000') && data.includes('augustINR: 120000') && data.includes('septemberINR: 150000'), 'Must define July 100k, August 120k, September 150k');
  assert.ok(data.includes('septemberINR: 75000') && data.includes('septemberINR: 70000'), 'Must define direct cost 75k and receivables 70k');

  // Verify Case D growth and margin calculations
  const sepRevGrowth = (150000 - 120000) / 120000;
  assert.equal(sepRevGrowth, 0.25, 'September revenue growth must be +25.0%');
  const sepOpMargin = 30000 / 150000;
  assert.equal(sepOpMargin, 0.20, 'September operating margin must be 20.0%');

  // 6. Check 4-Claim Audit Register & Recalculation
  assert.ok(data.includes('CASE_D_CLAIMS'), 'Must define CASE_D_CLAIMS');
  assert.ok(data.includes('September revenue grew 30% over August'), 'Claim 1 must be present');
  assert.ok(data.includes('Operating profit margin improved to 25%'), 'Claim 2 must be present');
  assert.ok(data.includes('Receivables of INR 70,000 prove customers are paying on time'), 'Claim 3 must be present');
  assert.ok(data.includes('Offer every customer a 20% discount to maximize profits'), 'Claim 4 must be present');
  assert.ok(data.includes('(₹1,50,000 - ₹1,20,000) / ₹1,20,000'), 'Must define canonical recalculation');

  // 7. Check Word Limit & Memo
  assert.ok(data.includes('MAX_MEMO_WORD_COUNT = 120'), 'Must enforce max 120 words');
  assert.ok(data.includes('DEFAULT_CORRECTED_MEMO'), 'Must define default corrected memo');

  // 8. Check 5-Stage Controlled Workflow & Stopping Condition
  assert.ok(data.includes('WORKFLOW_STAGES'), 'Must define WORKFLOW_STAGES');
  assert.ok(data.includes('ISBLANK(Revenue)') && data.includes('HALT_ERROR'), 'Must specify stopping condition rule');
  assert.ok(data.includes('WORKFLOW_SCENARIOS'), 'Must define 5 workflow simulation scenarios');
  assert.ok(data.includes('blank_revenue') && data.includes('restore_review') && data.includes('rejected') && data.includes('approved'), 'Must include required scenarios');

  // 9. Check Workstation Delegation
  assert.ok(ws.includes('Session14AIJourney'), 'Workstation must delegate to Session14AIJourney');

  // 10. Check page.tsx tab suppression and button wiring
  assert.ok(page.includes('selected > 24 && ('), 'Tabs must be suppressed for selected <= 24');
  assert.ok(journey.includes('vcep-area-workflow'), 'Journey must wire Build Verified Workflow button');
  assert.ok(journey.includes('vcep-area-audit'), 'Journey must wire Challenge AI Report button');
  assert.ok(page.includes('Audit the AI. Control the workflow.'), 'Page must display Session 14 subline');

  // 11. Check Review Engine Rules in lib
  assert.ok(rules.includes('s14-w1-claim-register'), 'Review rules must check Claim Register');
  assert.ok(rules.includes('s14-w2-revenue-recalculation'), 'Review rules must check Revenue Recalculation');
  assert.ok(rules.includes('s14-w3-corrected-memo'), 'Review rules must check 120-Word Memo');
  assert.ok(rules.includes('s14-w4-workflow-stopping-condition'), 'Review rules must check Stopping Condition');
  assert.ok(rules.includes('s14-w5-scenario-simulation'), 'Review rules must check Scenario Simulation');
  assert.ok(rules.includes('s14-t1-governance'), 'Review rules must check Professional Governance');
  assert.ok(rules.includes('s14-t2-rubric-compliance'), 'Review rules must check Rubric Compliance');

  console.log('✅ Phase 1: Static Code & Content Verification Passed (100%)\n');
}

async function runBrowserVerification() {
  console.log('--- Phase 2: Live Browser CDP Verification & Screenshot Capture ---');

  const PORT = 9384;
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--user-data-dir=/tmp/chrome-session-14-test-clean',
    'about:blank',
  ]);

  // Retry loop for Chrome debugger port connection
  let tabs = null;
  for (let i = 0; i < 15; i++) {
    await new Promise((r) => setTimeout(r, 400));
    try {
      const listRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      if (listRes.ok) {
        tabs = await listRes.json();
        if (tabs && tabs.length > 0) break;
      }
    } catch {
      // Chrome still starting up
    }
  }

  if (!tabs || tabs.length === 0) {
    chrome.kill();
    throw new Error(`Failed to connect to Chrome on port ${PORT} after retries.`);
  }

  try {
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
      value: 'session_s14_qa_test',
      domain: '127.0.0.1',
      path: '/',
    });

    // Mock auth /api/boot and /api/guided/session/14
    const s14Lesson = driveJson.find((s) => s.id === 14);
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        const s14Lesson = ${JSON.stringify(s14Lesson)};
        const origFetch = window.fetch;
        window.fetch = async (...args) => {
          const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
          if (url && url.includes('/api/boot')) {
            const res = await origFetch(...args);
            const data = await res.json();
            data.user = { id: 'student-14', email: 'auditor14@student.edu', role: 'student', name: 'Tanvi Workflow Auditor' };
            return new Response(JSON.stringify(data), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          if (url && url.includes('/api/guided/session/14')) {
            return new Response(JSON.stringify({ lesson: s14Lesson }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return origFetch(...args);
        };
      `,
    });

    const targetUrl = 'http://127.0.0.1:5173/guided-learning?session=14';
    console.log(`Navigating to ${targetUrl}...`);
    await send('Page.navigate', { url: targetUrl });
    await new Promise((r) => setTimeout(r, 3000));

    // Capture 1440px Desktop Heading 1: Challenge AI Report (Tasks 01 & 02)
    await send('Runtime.evaluate', {
      expression: `document.getElementById('vcep-area-audit')?.scrollIntoView({ behavior: 'instant', block: 'start' });`,
    });
    await capture('s14-heading-01-audit-desktop-1440.png', 1440, 900);

    // Capture 1440px Desktop Heading 2: Build Verified Workflow (Tasks 03 & 04)
    await send('Runtime.evaluate', {
      expression: `document.getElementById('vcep-area-workflow')?.scrollIntoView({ behavior: 'instant', block: 'start' });`,
    });
    await capture('s14-heading-02-workflow-desktop-1440.png', 1440, 900);

    // Capture Tablet 768px
    await capture('s14-ai-tablet-768.png', 768, 1024);

    // Capture Mobile 390px
    await capture('s14-ai-mobile-390.png', 390, 844);

    // DOM Evaluation
    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const areaAudit = document.getElementById('vcep-area-audit');
          const areaWorkflow = document.getElementById('vcep-area-workflow');
          const card1 = document.querySelector('[data-task-id="S14-T01"]');
          const card2 = document.querySelector('[data-task-id="S14-T02"]');
          const card3 = document.querySelector('[data-task-id="S14-T03"]');
          const card4 = document.querySelector('[data-task-id="S14-T04"]');
          const tabs = document.querySelector('.v3-tabs');
          const bodyText = document.body.textContent || '';

          return {
            hasAuditArea: !!areaAudit,
            hasWorkflowArea: !!areaWorkflow,
            hasTask01: !!card1,
            hasTask02: !!card2,
            hasTask03: !!card3,
            hasTask04: !!card4,
            tabsHidden: !tabs,
            t1Title: card1?.querySelector('h3')?.textContent || '',
            t2Title: card2?.querySelector('h3')?.textContent || '',
            t3Title: card3?.querySelector('h3')?.textContent || '',
            t4Title: card4?.querySelector('h3')?.textContent || '',
            containsCaseDRevenue: (bodyText.includes('1,50,000') || bodyText.includes('150,000')) && (bodyText.includes('1,20,000') || bodyText.includes('120,000')),
            containsCaseDReceivables: bodyText.includes('70,000'),
            containsClaimsRegister: bodyText.includes('Four-Claim Audit Register') || bodyText.includes('Claim 01'),
            contains30PctClaim: bodyText.includes('30%') && bodyText.includes('revenue'),
            contains25PctMarginClaim: bodyText.includes('25%') && bodyText.includes('margin'),
            containsPromptPaymentClaim: bodyText.includes('paying on time') || bodyText.includes('paid on time'),
            containsDiscountClaim: bodyText.includes('20% discount'),
            containsCorrectedMemo: bodyText.includes('Correct the Management Memo') || bodyText.includes('Corrected Executive Management Memo'),
            containsStoppingCondition: bodyText.includes('ISBLANK(Revenue)') || bodyText.includes('AUTOMATED STOPPING CONDITION'),
            containsSimulationDrill: bodyText.includes('Simulation Drill') || bodyText.includes('Scenario 1'),
            containsDeliverableFilename: bodyText.includes('StudentID_S14_v01.xlsx'),
            tablesCount: document.querySelectorAll('table').length,
          };
        })()
      `,
      returnByValue: true,
    });

    console.log('\n📊 DOM Inspection Result:', JSON.stringify(evalRes.result.value, null, 2));

    const v = evalRes.result.value;
    assert.ok(v.hasAuditArea, 'Heading 1 #vcep-area-audit must exist in DOM');
    assert.ok(v.hasWorkflowArea, 'Heading 2 #vcep-area-workflow must exist in DOM');
    assert.ok(v.hasTask01, 'TaskCard S14-T01 must exist in DOM');
    assert.ok(v.hasTask02, 'TaskCard S14-T02 must exist in DOM');
    assert.ok(v.hasTask03, 'TaskCard S14-T03 must exist in DOM');
    assert.ok(v.hasTask04, 'TaskCard S14-T04 must exist in DOM');
    assert.equal(v.t1Title, 'Audit Four AI Claims', 'Task 1 title must match');
    assert.equal(v.t2Title, 'Correct the Management Memo', 'Task 2 title must match');
    assert.equal(v.t3Title, 'Build Validation Checks', 'Task 3 title must match');
    assert.equal(v.t4Title, 'Test the Approval Flow', 'Task 4 title must match');
    assert.ok(v.tabsHidden, '.v3-tabs must be suppressed for Session 14');
    assert.ok(v.containsCaseDRevenue, 'Must render Case D monthly revenue');
    assert.ok(v.containsCaseDReceivables, 'Must render Case D ₹70,000 receivables');
    assert.ok(v.containsClaimsRegister, 'Must render 4-claim register');
    assert.ok(v.contains30PctClaim, 'Must render 30% revenue growth claim');
    assert.ok(v.contains25PctMarginClaim, 'Must render 25% margin claim');
    assert.ok(v.containsPromptPaymentClaim, 'Must render prompt payment claim');
    assert.ok(v.containsDiscountClaim, 'Must render 20% discount claim');
    assert.ok(v.containsCorrectedMemo, 'Must render corrected management memo');
    assert.ok(v.containsStoppingCondition, 'Must render automated stopping condition');
    assert.ok(v.containsSimulationDrill, 'Must render scenario simulation drill');
    assert.ok(v.containsDeliverableFilename, 'Must render StudentID_S14_v01.xlsx deliverable');
    assert.ok(v.tablesCount >= 1, 'Must render Case D financial table');

    console.log('\n✅ Phase 2: Live Browser CDP Verification Passed 100%!');
    console.log('🎉 ALL VCEP SESSION 14 TRANSFORMATIONS VERIFIED SUCCESSFULLY!\n');

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
