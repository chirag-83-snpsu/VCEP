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

  const s03Data = fs.readFileSync('app/guided-learning/components/session-03-communication-data.ts', 'utf8');
  const s03Comp = fs.readFileSync('app/guided-learning/components/session-03-communication-journey.tsx', 'utf8');
  const pageTsx = fs.readFileSync('app/guided-learning/page.tsx', 'utf8');
  const s03Rules = fs.readFileSync('lib/review-engine/session-rules/session-03.ts', 'utf8');

  // 1. Verify Word Limits & Constants
  assert.ok(s03Data.includes('MAX_CLARIFY_WORDS = 120'), 'Must define MAX_CLARIFY_WORDS = 120');
  assert.ok(s03Data.includes('MAX_PROGRESS_WORDS = 40'), 'Must define MAX_PROGRESS_WORDS = 40');
  assert.ok(s03Data.includes('MAX_ESCALATION_WORDS = 70'), 'Must define MAX_ESCALATION_WORDS = 70');

  // 2. Verify Sample Customer Billings with Missing Payment Records
  assert.ok(s03Data.includes('SAMPLE_CUSTOMER_BILLINGS'), 'Must define SAMPLE_CUSTOMER_BILLINGS');
  assert.ok(s03Data.includes('Apex Retail Distributors Ltd'), 'Must include Apex Retail account');
  assert.ok(s03Data.includes('UNAVAILABLE'), 'Must flag payment ledger status as UNAVAILABLE');

  // 3. Verify Two Natural Headings in Component
  assert.ok(s03Comp.includes('id="vcep-area-request"'), 'Must have Heading 1: Understand the Manager’s Request');
  assert.ok(s03Comp.includes('id="vcep-area-compose"'), 'Must have Heading 2: Compose the Response');

  // 4. Verify 3 Unified Premium Bordered Task Cards & IDs
  assert.ok(s03Comp.includes('taskId="S03-T01"'), 'Must define taskId S03-T01');
  assert.ok(s03Comp.includes('TASK 01') && s03Comp.includes('Clarify the Request'), 'Must have Task 01 Clarify the Request');

  assert.ok(s03Comp.includes('taskId="S03-T02"'), 'Must define taskId S03-T02');
  assert.ok(s03Comp.includes('TASK 02') && s03Comp.includes('Report Your Progress'), 'Must have Task 02 Report Your Progress');

  assert.ok(s03Comp.includes('taskId="S03-T03"'), 'Must define taskId S03-T03');
  assert.ok(s03Comp.includes('TASK 03') && s03Comp.includes('Escalate the Risk'), 'Must have Task 03 Escalate the Risk');

  // 5. Verify TaskCard Design Specs: 1px border, 16px radius, 3px teal accent, why-matters disclosure
  assert.ok(s03Comp.includes('function TaskCard'), 'Must define reusable TaskCard component');
  assert.ok(s03Comp.includes('#DCE5E9'), 'Must use neutral 1px #DCE5E9 border');
  assert.ok(s03Comp.includes('#0F766E'), 'Must use brand teal #0F766E');
  assert.ok(s03Comp.includes('#17245C'), 'Must use navy #17245C');
  assert.ok(s03Comp.includes('Why this matters') || s03Comp.includes('whyMatters'), 'Must provide collapsible theory disclosure');

  // 6. Verify Tone Detection
  assert.ok(s03Data.includes('detectSpeculativeWords'), 'Must export detectSpeculativeWords');
  assert.ok(s03Comp.includes('clarifyToneIssues'), 'Must audit tone on clarification email');

  // 7. Verify Page.tsx Wiring
  assert.ok(pageTsx.includes('Session03CommunicationJourney'), 'Must import Session03CommunicationJourney in page.tsx');
  assert.ok(pageTsx.includes('selected > 24'), 'Must hide v3-tabs for sessions 1-24');
  assert.ok(s03Comp.includes('Compose the Response →') || s03Comp.includes('Compose the Response &rarr;'), 'Must have top compose action link');

  // 8. Verify Review Rules
  assert.ok(s03Rules.includes('s03-w1-clarify'), 'Must include s03-w1-clarify check');
  assert.ok(s03Rules.includes('s03-w2-progress'), 'Must include s03-w2-progress check');
  assert.ok(s03Rules.includes('s03-w3-escalation'), 'Must include s03-w3-escalation check');
  assert.ok(s03Rules.includes('s03-w4-tone'), 'Must include s03-w4-tone check');

  // 9. Verify Sessions 01, 02 and all sessions are preserved
  assert.equal(driveJson[0].id, 1, 'Session 01 must be preserved');
  assert.equal(driveJson[1].id, 2, 'Session 02 must be preserved');
  assert.equal(driveJson[2].id, 3, 'Session 03 must be preserved');
  assert.equal(driveJson.length, 24, 'All 24 sessions must be preserved');

  console.log('✅ Static Verification Passed (100%)\n');
}

async function runBrowserVerification() {
  console.log('--- Phase 2: Live Browser CDP Verification & Screenshot Capture ---');

  const PORT = 9348;
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--user-data-dir=/tmp/chrome-session-03-test-clean',
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

      await new Promise((r) => setTimeout(r, 800));

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
      value: 'session_s03_qa_test',
      domain: '127.0.0.1',
      path: '/',
    });

    // Mock auth /api/boot and /api/guided/session/3
    const s3Lesson = driveJson[2];
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        const s3Lesson = ${JSON.stringify(s3Lesson)};
        const origFetch = window.fetch;
        window.fetch = async (...args) => {
          const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
          if (url && url.includes('/api/boot')) {
            const res = await origFetch(...args);
            const data = await res.json();
            data.user = { id: 'student-3', email: 'comm3@student.edu', role: 'student', name: 'Rohan Analyst' };
            return new Response(JSON.stringify(data), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          if (url && url.includes('/api/guided/session/3')) {
            return new Response(JSON.stringify({ lesson: s3Lesson }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return origFetch(...args);
        };
      `,
    });

    // 1. Desktop 1440px Capture: Navigate to /guided-learning?session=3
    console.log('Navigating to http://127.0.0.1:5173/guided-learning?session=3...');
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/guided-learning?session=3' });
    await new Promise((r) => setTimeout(r, 3000));

    // Capture Desktop Heading 1 (Understand the Manager's Request)
    await capture('s03-heading-01-request-desktop-1440.png', 1440, 900);

    // Scroll down to Heading 2 (Compose the Response & Task Cards)
    await send('Runtime.evaluate', {
      expression: `
        const el = document.getElementById('vcep-area-compose');
        if (el) el.scrollIntoView({ behavior: 'instant' });
      `,
    });
    await new Promise((r) => setTimeout(r, 600));

    // Capture Desktop Heading 2 (Compose the Response)
    await capture('s03-heading-02-compose-desktop-1440.png', 1440, 900);

    // 2. Tablet 768px Capture
    await send('Runtime.evaluate', {
      expression: `
        const el = document.getElementById('vcep-area-request');
        if (el) el.scrollIntoView({ behavior: 'instant' });
      `,
    });
    await capture('s03-communication-tablet-768.png', 768, 1024);

    // 3. Mobile 390px Capture
    await capture('s03-communication-mobile-390.png', 390, 844);

    // 4. Verify DOM Elements
    const domCheck = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const areaReq = document.getElementById('vcep-area-request');
          const areaComp = document.getElementById('vcep-area-compose');
          const v3Tabs = document.querySelector('.v3-tabs');
          const managerMemo = document.body.innerText.includes('Send the best customers report today');
          const timeline = document.body.innerText.includes('11:00 AM') && document.body.innerText.includes('16:00 PM');
          const customerTable = document.body.innerText.includes('Apex Retail Distributors Ltd');
          
          const card1 = document.querySelector('[data-task-id="S03-T01"]');
          const card2 = document.querySelector('[data-task-id="S03-T02"]');
          const card3 = document.querySelector('[data-task-id="S03-T03"]');

          const hasT1Title = document.body.innerText.includes('TASK 01') && document.body.innerText.includes('Clarify the Request');
          const hasT2Title = document.body.innerText.includes('TASK 02') && document.body.innerText.includes('Report Your Progress');
          const hasT3Title = document.body.innerText.includes('TASK 03') && document.body.innerText.includes('Escalate the Risk');
          const hasGovernance = document.body.innerText.includes('Portfolio Governance, Peer Review');
          const hasRubric = document.body.innerText.toLowerCase().includes('assessment rubric') || document.body.textContent.includes('Assessment Rubric');

          return {
            hasAreaRequest: !!areaReq,
            hasAreaCompose: !!areaComp,
            tabsHidden: !v3Tabs,
            hasManagerMemo: managerMemo,
            hasTimeline: timeline,
            hasCustomerTable: customerTable,
            hasCard1: !!card1,
            hasCard2: !!card2,
            hasCard3: !!card3,
            hasT1Title,
            hasT2Title,
            hasT3Title,
            hasGovernance,
            hasRubric,
          };
        })()
      `,
      returnByValue: true,
    });

    console.log('📊 DOM Inspection Result:', domCheck.result.value);
    assert.ok(domCheck.result.value.hasAreaRequest, 'Heading 1 (Understand Request) must exist');
    assert.ok(domCheck.result.value.hasAreaCompose, 'Heading 2 (Compose Response) must exist');
    assert.ok(domCheck.result.value.tabsHidden, 'v3-tabs must be hidden for Session 03');
    assert.ok(domCheck.result.value.hasManagerMemo, 'Simulated manager email memo must exist');
    assert.ok(domCheck.result.value.hasTimeline, 'Timeline from 11:00 to 16:00 must exist');
    assert.ok(domCheck.result.value.hasCustomerTable, 'Customer billing table with locked payment data must exist');
    assert.ok(domCheck.result.value.hasCard1, 'TaskCard S03-T01 must exist in DOM');
    assert.ok(domCheck.result.value.hasCard2, 'TaskCard S03-T02 must exist in DOM');
    assert.ok(domCheck.result.value.hasCard3, 'TaskCard S03-T03 must exist in DOM');
    assert.ok(domCheck.result.value.hasT1Title, 'Task 01 title must be visible');
    assert.ok(domCheck.result.value.hasT2Title, 'Task 02 title must be visible');
    assert.ok(domCheck.result.value.hasT3Title, 'Task 03 title must be visible');
    assert.ok(domCheck.result.value.hasGovernance, 'Governance section must be visible');
    assert.ok(domCheck.result.value.hasRubric, '10-point rubric must be visible');

    console.log('✅ Browser End-to-End Verification Passed 100%!\n');

    ws.close();
  } finally {
    chrome.kill();
  }
}

async function main() {
  console.log('================================================================');
  console.log('VCEP SESSION 03 TRANSFORMATION VERIFICATION SUITE');
  console.log('================================================================\n');

  await runStaticVerification();
  await runBrowserVerification();

  console.log('🎉 ALL VCEP SESSION 03 REDESIGN CHECKS COMPLETED SUCCESSFULLY!');
}

main().catch((err) => {
  console.error('❌ Verification Failed:', err);
  process.exit(1);
});
