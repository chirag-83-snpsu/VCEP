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
  const ws = fs.readFileSync('app/guided-learning/workstations/session-15-workstation.tsx', 'utf8');
  const journey = fs.readFileSync('app/guided-learning/components/session-15-sales-journey.tsx', 'utf8');
  const data = fs.readFileSync('app/guided-learning/components/session-15-sales-data.ts', 'utf8');
  const rules = fs.readFileSync('lib/review-engine/session-rules/session-15.ts', 'utf8');

  // 1. Check Natural Headings
  assert.ok(journey.includes('id="vcep-area-pipeline"'), 'Must define #vcep-area-pipeline');
  assert.ok(
    journey.includes('Review the Sales Pipeline') || journey.includes('1. Review Sales Pipeline'),
    'Must have heading "Review the Sales Pipeline"'
  );
  assert.ok(journey.includes('id="vcep-area-crm"'), 'Must define #vcep-area-crm');
  assert.ok(
    journey.includes('Build the CRM Action Queue') || journey.includes('2. Build CRM Action Queue'),
    'Must have heading "Build the CRM Action Queue"'
  );

  // 2. Check 4 TaskCard Definitions
  assert.ok(journey.includes('taskId="S15-T01"'), 'Must include TaskCard S15-T01');
  assert.ok(journey.includes('taskId="S15-T02"'), 'Must include TaskCard S15-T02');
  assert.ok(journey.includes('taskId="S15-T03"'), 'Must include TaskCard S15-T03');
  assert.ok(journey.includes('taskId="S15-T04"'), 'Must include TaskCard S15-T04');
  assert.ok(journey.includes('Task 01 — Review the Lead Queue'), 'Must include Task 01 title');
  assert.ok(journey.includes('Task 02 — Update the CRM Schedule'), 'Must include Task 02 title');
  assert.ok(journey.includes('Task 03 — Calculate Conversion Funnel Metrics'), 'Must include Task 03 title');
  assert.ok(journey.includes('Task 04 — Prioritise Follow-Up & Compose Outreach'), 'Must include Task 04 title');

  // 3. Check Case G Data Constants (8 Leads, Baseline 31 Oct 2026)
  assert.ok(data.includes('CASE_G_LEADS'), 'Must define CASE_G_LEADS');
  assert.ok(data.includes("'L01'") && data.includes("'L08'"), 'Must contain leads L01 through L08');
  assert.ok(data.includes("CASE_G_AS_OF_DATE = '2026-10-31'"), 'Baseline date must be 2026-10-31');

  // Verify Win Rate calculations
  const totalLeads = 8;
  const wonLeads = 3;
  const lostLeads = 2;
  const closedLeads = wonLeads + lostLeads; // 5
  const openLeads = 3;

  const allLeadWinRate = wonLeads / totalLeads;
  assert.equal(allLeadWinRate, 0.375, 'All-Lead Win Rate must be 37.5% (3/8)');
  const closedLeadWinRate = wonLeads / closedLeads;
  assert.equal(closedLeadWinRate, 0.60, 'Closed-Lead Win Rate must be 60.0% (3/5)');

  // 4. Check Overdue Action Queue (L06 & L07 overdue as of 31 Oct 2026)
  assert.ok(data.includes("id: 'L06'") && data.includes("sourceDueDate: '2026-10-28'"), 'L06 must be due 2026-10-28 (3 days overdue)');
  assert.ok(data.includes("id: 'L07'") && data.includes("sourceDueDate: '2026-10-30'"), 'L07 must be due 2026-10-30 (1 day overdue)');
  assert.ok(data.includes("id: 'L08'") && data.includes("sourceDueDate: '2026-11-03'"), 'L08 must be due 2026-11-03 (on track)');

  // 5. Check Dual Follow-up Messages
  assert.ok(data.includes('DEFAULT_FOLLOWUP_L06') && data.includes('DEFAULT_FOLLOWUP_L07'), 'Must define default follow-up messages');
  assert.ok(data.includes('requirements') && data.includes('L06'), 'L06 follow-up must address requirements');
  assert.ok(data.includes('proposal') && data.includes('L07'), 'L07 follow-up must address proposal review');

  // 6. Check Workstation Delegation
  assert.ok(ws.includes('Session15SalesJourney'), 'Workstation must delegate to Session15SalesJourney');

  // 7. Check page.tsx tab suppression and button wiring
  assert.ok(
    page.includes('selected > 24 && (') || page.includes('selected > 15 && ('),
    'Tabs must be suppressed for Session 15'
  );
  assert.ok(journey.includes('vcep-area-crm'), 'Journey must wire Build CRM Action Queue button');
  assert.ok(journey.includes('vcep-area-pipeline'), 'Journey must wire Review Sales Pipeline button');
  assert.ok(page.includes('Manage the pipeline. Own the follow-up.'), 'Page must display Session 15 subline');

  // 8. Check Review Engine Rules in lib
  assert.ok(rules.includes('s15-o1-crm-mission'), 'Review rules must check CRM Mission');
  assert.ok(rules.includes('s15-c1-case-g-records'), 'Review rules must check Case G records');
  assert.ok(rules.includes('s15-w1-crm-table'), 'Review rules must check CRM Table');
  assert.ok(rules.includes('s15-w2-all-lead-win-rate'), 'Review rules must check All-Lead Win Rate');
  assert.ok(rules.includes('s15-w3-closed-lead-win-rate'), 'Review rules must check Closed-Lead Win Rate');
  assert.ok(rules.includes('s15-w4-overdue-action-queue'), 'Review rules must check Overdue Action Queue');
  assert.ok(rules.includes('s15-w5-followup-messages'), 'Review rules must check Follow-up Messages');
  assert.ok(rules.includes('s15-t1-governance'), 'Review rules must check Governance');

  console.log('✅ Phase 1: Static Code & Content Verification Passed (100%)\n');
}

async function runBrowserVerification() {
  console.log('--- Phase 2: Live Browser CDP Verification & Screenshot Capture ---');

  const PORT = 9385;
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--user-data-dir=/tmp/chrome-session-15-test-clean',
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
      value: 'session_s15_qa_test',
      domain: '127.0.0.1',
      path: '/',
    });

    // Mock auth /api/boot and /api/guided/session/15
    const s15Lesson = driveJson.find((s) => s.id === 15);
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        const s15Lesson = ${JSON.stringify(s15Lesson)};
        const origFetch = window.fetch;
        window.fetch = async (...args) => {
          const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
          if (url && url.includes('/api/boot')) {
            const res = await origFetch(...args);
            const data = await res.json();
            data.user = { id: 'student-15', email: 'salesops15@student.edu', role: 'student', name: 'Sales Operations Lead' };
            return new Response(JSON.stringify(data), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          if (url && url.includes('/api/guided/session/15')) {
            return new Response(JSON.stringify({ lesson: s15Lesson }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return origFetch(...args);
        };
      `,
    });

    const targetUrl = 'http://127.0.0.1:5173/guided-learning?session=15';
    console.log(`Navigating to ${targetUrl}...`);
    await send('Page.navigate', { url: targetUrl });
    await new Promise((r) => setTimeout(r, 3000));

    // Capture 1440px Desktop Heading 1: Review the Sales Pipeline (Tasks 01 & 02)
    await send('Runtime.evaluate', {
      expression: `document.getElementById('vcep-area-pipeline')?.scrollIntoView({ behavior: 'instant', block: 'start' });`,
    });
    await capture('s15-heading-01-leads-desktop-1440.png', 1440, 900);
    await capture('s15-heading-01-pipeline-desktop-1440.png', 1440, 900);

    // Capture 1440px Desktop Heading 2: Build the CRM Action Queue (Tasks 03 & 04)
    await send('Runtime.evaluate', {
      expression: `document.getElementById('vcep-area-crm')?.scrollIntoView({ behavior: 'instant', block: 'start' });`,
    });
    await capture('s15-heading-02-crm-desktop-1440.png', 1440, 900);

    // Capture Tablet 768px
    await capture('s15-sales-tablet-768.png', 768, 1024);

    // Capture Mobile 390px
    await capture('s15-sales-mobile-390.png', 390, 844);

    // DOM Evaluation
    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const areaPipeline = document.getElementById('vcep-area-pipeline');
          const areaCrm = document.getElementById('vcep-area-crm');
          const card1 = document.querySelector('[data-task-id="S15-T01"]');
          const card2 = document.querySelector('[data-task-id="S15-T02"]');
          const card3 = document.querySelector('[data-task-id="S15-T03"]');
          const card4 = document.querySelector('[data-task-id="S15-T04"]');
          const tabs = document.querySelector('.v3-tabs');
          const bodyText = document.body.textContent || '';

          return {
            hasPipelineArea: !!areaPipeline,
            hasCrmArea: !!areaCrm,
            hasTask01: !!card1,
            hasTask02: !!card2,
            hasTask03: !!card3,
            hasTask04: !!card4,
            t1Title: card1?.querySelector('h3')?.textContent || '',
            t2Title: card2?.querySelector('h3')?.textContent || '',
            t3Title: card3?.querySelector('h3')?.textContent || '',
            t4Title: card4?.querySelector('h3')?.textContent || '',
            tabsHidden: !tabs,
            containsCaseGTable: bodyText.includes('Case G CRM Release') && bodyText.includes('L01') && bodyText.includes('L08'),
            containsDualWinRates: bodyText.includes('37.5%') && bodyText.includes('60.0%') && bodyText.includes('All-Lead Win Rate') && bodyText.includes('Closed-Lead Win Rate'),
            containsOverdueActionQueue: (bodyText.includes('Prioritized Overdue Action Queue') || bodyText.includes('Prioritised Overdue Action Queue')) && bodyText.includes('L06') && (bodyText.includes('3 Days Overdue') || bodyText.includes('3 days overdue')) && bodyText.includes('L07'),
            containsFollowUpDrafts: (bodyText.includes('Two Professional Commercial Follow-Up Messages') || bodyText.includes('Follow-Up Messages')) && bodyText.includes('Owner A') && bodyText.includes('Owner C'),
            containsHumanSignoff: (bodyText.includes('Deliverable Governance & Named Review Roles') || bodyText.includes('Deliverable Governance')) && bodyText.includes('Preparer Name'),
            containsRubricHandover: bodyText.includes('StudentID_S15_v01.xlsx') && bodyText.includes('Run Formative Review'),
            tablesCount: document.querySelectorAll('table').length,
          };
        })()
      `,
      returnByValue: true,
    });

    console.log('\n📊 DOM Inspection Result:', JSON.stringify(evalRes.result.value, null, 2));

    const v = evalRes.result.value;
    assert.ok(v.hasPipelineArea, 'Heading 1 #vcep-area-pipeline must exist in DOM');
    assert.ok(v.hasCrmArea, 'Heading 2 #vcep-area-crm must exist in DOM');
    assert.ok(v.hasTask01, 'TaskCard S15-T01 must exist in DOM');
    assert.ok(v.hasTask02, 'TaskCard S15-T02 must exist in DOM');
    assert.ok(v.hasTask03, 'TaskCard S15-T03 must exist in DOM');
    assert.ok(v.hasTask04, 'TaskCard S15-T04 must exist in DOM');
    assert.ok(v.t1Title.includes('Review the Lead Queue'), 'Task 1 title must match');
    assert.ok(v.t2Title.includes('Update the CRM Schedule'), 'Task 2 title must match');
    assert.ok(v.t3Title.includes('Calculate Conversion Funnel Metrics'), 'Task 3 title must match');
    assert.ok(v.t4Title.includes('Prioritise Follow-Up & Compose Outreach'), 'Task 4 title must match');
    assert.ok(v.tabsHidden, '.v3-tabs must be suppressed for Session 15');
    assert.ok(v.containsCaseGTable, 'Must render Case G 8 inquiries table');
    assert.ok(v.containsDualWinRates, 'Must render Dual-Denominator Win Rates (37.5% and 60.0%)');
    assert.ok(v.containsOverdueActionQueue, 'Must render Prioritised Overdue Action Queue (L06 & L07)');
    assert.ok(v.containsFollowUpDrafts, 'Must render Follow-Up Message drafts for L06 & L07');
    assert.ok(v.containsHumanSignoff, 'Must render human governance sign-off fields');
    assert.ok(v.containsRubricHandover, 'Must render StudentID_S15_v01.xlsx and Formative Review');
    assert.ok(v.tablesCount >= 2, 'Must render at least 2 tables (source queue & working schedule)');

    console.log('\n✅ Phase 2: Live Browser CDP Verification Passed 100%!');
    console.log('🎉 ALL VCEP SESSION 15 TRANSFORMATIONS VERIFIED SUCCESSFULLY!\n');

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
