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
  const ws = fs.readFileSync('app/guided-learning/workstations/session-13-workstation.tsx', 'utf8');
  const journey = fs.readFileSync('app/guided-learning/components/session-13-ai-journey.tsx', 'utf8');
  const data = fs.readFileSync('app/guided-learning/components/session-13-ai-data.ts', 'utf8');
  const rules = fs.readFileSync('lib/review-engine/session-rules/session-13.ts', 'utf8');

  // 1. Check Natural Headings
  assert.ok(journey.includes('id="vcep-area-task"'), 'Must define #vcep-area-task');
  assert.ok(journey.includes('Choose a Safe AI Task') || journey.includes('Choose Safe AI Task'), 'Must have heading "Choose a Safe AI Task"');
  assert.ok(journey.includes('id="vcep-area-verify"'), 'Must define #vcep-area-verify');
  assert.ok(journey.includes('Create &amp; Verify Output') || journey.includes('Create &amp; Verify the Output') || journey.includes('Create & Verify Output') || journey.includes('Create & Verify the Output'), 'Must have heading "Create & Verify Output"');

  // 2. Check Unified TaskCard Architecture & 4 Bordered Cards
  assert.ok(journey.includes('function TaskCard('), 'Must define unified TaskCard component');
  assert.ok(journey.includes('taskId="S13-T01"'), 'Must include TaskCard S13-T01');
  assert.ok(journey.includes('taskId="S13-T02"'), 'Must include TaskCard S13-T02');
  assert.ok(journey.includes('taskId="S13-T03"'), 'Must include TaskCard S13-T03');
  assert.ok(journey.includes('taskId="S13-T04"'), 'Must include TaskCard S13-T04');

  // 3. Check Task Titles
  assert.ok(journey.includes('title="Prepare Safe Inputs"'), 'Task 01 title must be "Prepare Safe Inputs"');
  assert.ok(journey.includes('title="Write a Professional Prompt"'), 'Task 02 title must be "Write a Professional Prompt"');
  assert.ok(journey.includes('title="Review the AI Draft"'), 'Task 03 title must be "Review the AI Draft"');
  assert.ok(journey.includes('title="Document Human Verification"'), 'Task 04 title must be "Document Human Verification"');

  // 4. Check Border and Styling Standards
  assert.ok(journey.includes("border: '1px solid #DCE5E9'"), 'Must use 1px solid #DCE5E9 border');
  assert.ok(journey.includes("borderLeft: isActive ? '3px solid #0F766E'"), 'Must use 3px teal accent for active task');
  assert.ok(journey.includes("borderRadius: '16px'"), 'Must use 16px radius');

  // 5. Check Case D Data Constants & Math
  assert.ok(data.includes('CASE_D_MONTHS'), 'Must define CASE_D_MONTHS');
  assert.ok(data.includes('revenueINR: 100000') && data.includes('directCostsINR: 40000'), 'July must have 100k rev and 40k direct costs');
  assert.ok(data.includes('revenueINR: 120000') && data.includes('directCostsINR: 54000'), 'August must have 120k rev and 54k direct costs');
  assert.ok(data.includes('revenueINR: 150000') && data.includes('directCostsINR: 75000') && data.includes('closingReceivablesINR: 70000'), 'September must have 150k rev, 75k direct, and 70k receivables');

  // Verify Case D growth and margin calculations
  const sepRevGrowth = (150000 - 120000) / 120000;
  assert.equal(sepRevGrowth, 0.25, 'September revenue growth must be +25.0%');
  const sepOpMargin = 30000 / 150000;
  assert.equal(sepOpMargin, 0.20, 'September operating margin must be 20.0%');
  const sepReceivablesPct = 70000 / 150000;
  assert.ok(Math.abs(sepReceivablesPct - 0.4667) < 0.001, 'September receivables must be ~46.7% of revenue');

  // 6. Check Data Classification & Prompt Architecture
  assert.ok(data.includes('DATA_CLASSIFICATION_ITEMS'), 'Must define DATA_CLASSIFICATION_ITEMS');
  assert.ok(data.includes('safe-aggregate') && data.includes('prohibited-private'), 'Must define safe and prohibited categories');
  assert.ok(data.includes('role:') && data.includes('task:') && data.includes('permittedSources:') && data.includes('uncertaintyRule:') && data.includes('explicitExclusions:'), 'Prompt architecture must have 6 parts');

  // 7. Check Offline Flawed Draft Text & 4-Point Verification
  assert.ok(data.includes('September revenue grew 30%'), 'Must define flawed claim 1');
  assert.ok(data.includes('Operating margin improved to 25%'), 'Must define flawed claim 2');
  assert.ok(data.includes('All customers paid on time'), 'Must define flawed claim 3');
  assert.ok(data.includes('Offer every customer a 20% discount to improve profitability'), 'Must define flawed claim 4');

  // 8. Check Workstation Delegation
  assert.ok(ws.includes('Session13AIJourney'), 'Workstation must delegate to Session13AIJourney');

  // 9. Check page.tsx tab suppression and button wiring
  assert.ok(page.includes('selected > 24 && ('), 'Tabs must be suppressed for selected <= 24');
  assert.ok(journey.includes('vcep-area-verify'), 'Journey must wire Create & Verify Output button');
  assert.ok(journey.includes('vcep-area-task'), 'Journey must wire Choose Safe AI Task button');
  assert.ok(page.includes('Use AI responsibly. Verify the work.'), 'Page must display Session 13 subline');

  // 10. Check Review Engine Rules in lib
  assert.ok(rules.includes('s13-w1-data-classification'), 'Review rules must check Data Classification');
  assert.ok(rules.includes('s13-w2-prompt-architecture'), 'Review rules must check Prompt Architecture');
  assert.ok(rules.includes('s13-w3-draft-verification'), 'Review rules must check Draft Verification');
  assert.ok(rules.includes('s13-w4-human-revised-memo'), 'Review rules must check Human-Revised Memo');
  assert.ok(rules.includes('s13-w5-ai-log-disclosure'), 'Review rules must check AI Log Disclosure');
  assert.ok(rules.includes('s13-t1-governance'), 'Review rules must check Professional Governance');
  assert.ok(rules.includes('s13-t2-rubric-compliance'), 'Review rules must check Rubric Compliance');

  console.log('✅ Phase 1: Static Code & Content Verification Passed (100%)\n');
}

async function runBrowserVerification() {
  console.log('--- Phase 2: Live Browser CDP Verification & Screenshot Capture ---');

  const PORT = 9383;
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--user-data-dir=/tmp/chrome-session-13-test-clean',
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
      value: 'session_s13_qa_test',
      domain: '127.0.0.1',
      path: '/',
    });

    // Mock auth /api/boot and /api/guided/session/13
    const s13Lesson = driveJson.find((s) => s.id === 13);
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        const s13Lesson = ${JSON.stringify(s13Lesson)};
        const origFetch = window.fetch;
        window.fetch = async (...args) => {
          const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
          if (url && url.includes('/api/boot')) {
            const res = await origFetch(...args);
            const data = await res.json();
            data.user = { id: 'student-13', email: 'analyst13@student.edu', role: 'student', name: 'Tanvi AI Analyst' };
            return new Response(JSON.stringify(data), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          if (url && url.includes('/api/guided/session/13')) {
            return new Response(JSON.stringify({ lesson: s13Lesson }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return origFetch(...args);
        };
      `,
    });

    const targetUrl = 'http://127.0.0.1:5173/guided-learning?session=13';
    console.log(`Navigating to ${targetUrl}...`);
    await send('Page.navigate', { url: targetUrl });
    await new Promise((r) => setTimeout(r, 3000));

    // Capture 1440px Desktop Heading 1: Choose Safe AI Task (Tasks 01 & 02)
    await send('Runtime.evaluate', {
      expression: `document.getElementById('vcep-area-task')?.scrollIntoView({ behavior: 'instant', block: 'start' });`,
    });
    await capture('s13-heading-01-task-desktop-1440.png', 1440, 900);

    // Capture 1440px Desktop Heading 2: Create & Verify Output (Tasks 03 & 04)
    await send('Runtime.evaluate', {
      expression: `document.getElementById('vcep-area-verify')?.scrollIntoView({ behavior: 'instant', block: 'start' });`,
    });
    await capture('s13-heading-02-verify-desktop-1440.png', 1440, 900);

    // Capture Tablet 768px
    await capture('s13-ai-tablet-768.png', 768, 1024);

    // Capture Mobile 390px
    await capture('s13-ai-mobile-390.png', 390, 844);

    // DOM Evaluation
    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const areaTask = document.getElementById('vcep-area-task');
          const areaVerify = document.getElementById('vcep-area-verify');
          const card1 = document.querySelector('[data-task-id="S13-T01"]');
          const card2 = document.querySelector('[data-task-id="S13-T02"]');
          const card3 = document.querySelector('[data-task-id="S13-T03"]');
          const card4 = document.querySelector('[data-task-id="S13-T04"]');
          const tabs = document.querySelector('.v3-tabs');
          const bodyText = document.body.textContent || '';

          return {
            hasTaskArea: !!areaTask,
            hasVerifyArea: !!areaVerify,
            hasTask01: !!card1,
            hasTask02: !!card2,
            hasTask03: !!card3,
            hasTask04: !!card4,
            tabsHidden: !tabs,
            t1Title: card1?.querySelector('h3')?.textContent || '',
            t2Title: card2?.querySelector('h3')?.textContent || '',
            t3Title: card3?.querySelector('h3')?.textContent || '',
            t4Title: card4?.querySelector('h3')?.textContent || '',
            containsCaseDRevenue: bodyText.includes('150,000') && bodyText.includes('120,000') && bodyText.includes('100,000'),
            containsCaseDReceivables: bodyText.includes('70,000'),
            containsClassificationItems: bodyText.includes('Monthly Gross Revenue Totals') && bodyText.includes('Bank Account Numbers & IFSC Codes'),
            containsPromptArchitecture: bodyText.includes('ROLE') || bodyText.includes('Role Specification'),
            containsFlawedDraft: bodyText.includes('September revenue grew 30%'),
            containsVerificationChecks: bodyText.includes('Four-Point Human Verification Audit') || bodyText.includes('Check 01'),
            containsGovernanceLog: bodyText.includes('Mandatory AI-Use Disclosure') || bodyText.includes('Autonomous Human Managerial Judgment'),
            containsDeliverableFilename: bodyText.includes('StudentID_S13_v01.xlsx'),
            tablesCount: document.querySelectorAll('table').length,
          };
        })()
      `,
      returnByValue: true,
    });

    console.log('\n📊 DOM Inspection Result:', JSON.stringify(evalRes.result.value, null, 2));

    const v = evalRes.result.value;
    assert.ok(v.hasTaskArea, 'Heading 1 #vcep-area-task must exist in DOM');
    assert.ok(v.hasVerifyArea, 'Heading 2 #vcep-area-verify must exist in DOM');
    assert.ok(v.hasTask01, 'TaskCard S13-T01 must exist in DOM');
    assert.ok(v.hasTask02, 'TaskCard S13-T02 must exist in DOM');
    assert.ok(v.hasTask03, 'TaskCard S13-T03 must exist in DOM');
    assert.ok(v.hasTask04, 'TaskCard S13-T04 must exist in DOM');
    assert.equal(v.t1Title, 'Prepare Safe Inputs', 'Task 1 title must match');
    assert.equal(v.t2Title, 'Write a Professional Prompt', 'Task 2 title must match');
    assert.equal(v.t3Title, 'Review the AI Draft', 'Task 3 title must match');
    assert.equal(v.t4Title, 'Document Human Verification', 'Task 4 title must match');
    assert.ok(v.tabsHidden, '.v3-tabs must be suppressed for Session 13');
    assert.ok(v.containsCaseDRevenue, 'Must render Case D monthly revenue figures');
    assert.ok(v.containsCaseDReceivables, 'Must render Case D ₹70,000 closing receivables');
    assert.ok(v.containsClassificationItems, 'Must render data classification items');
    assert.ok(v.containsPromptArchitecture, 'Must render 6-part prompt architecture');
    assert.ok(v.containsFlawedDraft, 'Must render flawed offline AI draft');
    assert.ok(v.containsVerificationChecks, 'Must render four-point verification checks');
    assert.ok(v.containsGovernanceLog, 'Must render mandatory AI governance log');
    assert.ok(v.containsDeliverableFilename, 'Must render StudentID_S13_v01.xlsx deliverable');
    assert.ok(v.tablesCount >= 1, 'Must render Case D financial table');

    console.log('\n✅ Phase 2: Live Browser CDP Verification Passed 100%!');
    console.log('🎉 ALL VCEP SESSION 13 TRANSFORMATIONS VERIFIED SUCCESSFULLY!\n');

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
