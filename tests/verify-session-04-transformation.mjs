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

  const s04Data = fs.readFileSync('app/guided-learning/components/session-04-meeting-data.ts', 'utf8');
  const s04Comp = fs.readFileSync('app/guided-learning/components/session-04-meeting-journey.tsx', 'utf8');
  const pageTsx = fs.readFileSync('app/guided-learning/page.tsx', 'utf8');
  const s04Rules = fs.readFileSync('lib/review-engine/session-rules/session-04.ts', 'utf8');

  // 1. Verify Authority Constants & Limits
  assert.ok(s04Data.includes('OPERATIONS_LEAD_LIMIT_INR = 2000'), 'Must define OPERATIONS_LEAD_LIMIT_INR = 2000');
  assert.ok(s04Data.includes('SUBSTITUTE_FEE_INR = 4000'), 'Must define SUBSTITUTE_FEE_INR = 4000');
  assert.ok(s04Data.includes("MANAGER_SYNC_TIME = '15:00'"), 'Must define MANAGER_SYNC_TIME = 15:00');
  assert.ok(s04Data.includes("CLIENT_DELIVERY_TIME = '17:00'"), 'Must define CLIENT_DELIVERY_TIME = 17:00');

  // 2. Verify 5 Squad Roles
  assert.ok(s04Data.includes('INITIAL_MEETING_ROLES'), 'Must define INITIAL_MEETING_ROLES');
  assert.ok(s04Data.includes('Operations Lead'), 'Must include Operations Lead role');
  assert.ok(s04Data.includes('Procurement Lead'), 'Must include Procurement Lead role');
  assert.ok(s04Data.includes('Client Communications Lead'), 'Must include Client Communications Lead role');
  assert.ok(s04Data.includes('General Manager (Approver)'), 'Must include General Manager role');
  assert.ok(s04Data.includes('Minute-Taker & RACI Owner'), 'Must include Minute-Taker role');

  // 3. Verify Two Natural Headings in Component
  assert.ok(s04Comp.includes('id="vcep-area-crisis"'), 'Must have Heading 1: Understand the Delivery Crisis');
  assert.ok(s04Comp.includes('id="vcep-area-meeting"'), 'Must have Heading 2: Run the Meeting & Record Actions');

  // 4. Verify 4 Unified Premium Bordered Task Cards & IDs
  assert.ok(s04Comp.includes('taskId="S04-T01"'), 'Must define taskId S04-T01');
  assert.ok(s04Comp.includes('TASK 01') && s04Comp.includes('Prepare the Agenda'), 'Must have Task 01 Prepare the Agenda');

  assert.ok(s04Comp.includes('taskId="S04-T02"'), 'Must define taskId S04-T02');
  assert.ok(s04Comp.includes('TASK 02') && s04Comp.includes('Run the Meeting'), 'Must have Task 02 Run the Meeting');

  assert.ok(s04Comp.includes('taskId="S04-T03"'), 'Must define taskId S04-T03');
  assert.ok(s04Comp.includes('TASK 03') && s04Comp.includes('Record Decisions and Actions'), 'Must have Task 03 Record Decisions and Actions');

  assert.ok(s04Comp.includes('taskId="S04-T04"'), 'Must define taskId S04-T04');
  assert.ok(s04Comp.includes('TASK 04') && s04Comp.includes('Update the Manager'), 'Must have Task 04 Update the Manager');

  // 5. Verify TaskCard Design Specs: 1px border, 16px radius, 3px teal accent, why-matters disclosure
  assert.ok(s04Comp.includes('function TaskCard'), 'Must define reusable TaskCard component');
  assert.ok(s04Comp.includes('#DCE5E9'), 'Must use neutral 1px #DCE5E9 border');
  assert.ok(s04Comp.includes('#0F766E'), 'Must use brand teal #0F766E');
  assert.ok(s04Comp.includes('#17245C'), 'Must use navy #17245C');
  assert.ok(s04Comp.includes('Why this matters') || s04Comp.includes('whyMatters'), 'Must provide collapsible theory disclosure');

  // 6. Verify 4 Agenda Items & RACI Actions in Data
  assert.ok(s04Data.includes('INITIAL_AGENDA_ITEMS'), 'Must define INITIAL_AGENDA_ITEMS');
  assert.ok(s04Data.includes('INITIAL_RACI_ACTIONS'), 'Must define INITIAL_RACI_ACTIONS');

  // 7. Verify Page.tsx Wiring
  assert.ok(pageTsx.includes('Session04MeetingJourney'), 'Must import Session04MeetingJourney in page.tsx');
  assert.ok(pageTsx.includes('selected > 24'), 'Must hide v3-tabs for sessions 1-24');
  assert.ok(s04Comp.includes('Run Meeting & Record Actions →') || s04Comp.includes('Run Meeting & Actions &rarr;'), 'Must have top navigation action link');

  // 8. Verify Review Rules
  assert.ok(s04Rules.includes('s04-w1-agenda'), 'Must include s04-w1-agenda check');
  assert.ok(s04Rules.includes('s04-w2-decision-board'), 'Must include s04-w2-decision-board check');
  assert.ok(s04Rules.includes('s04-w3-action-tracker'), 'Must include s04-w3-action-tracker check');
  assert.ok(s04Rules.includes('s04-w4-dnb'), 'Must include s04-w4-dnb check');

  // 9. Verify Sessions 01, 02, 03, 04 and all sessions are preserved
  assert.equal(driveJson[0].id, 1, 'Session 01 must be preserved');
  assert.equal(driveJson[1].id, 2, 'Session 02 must be preserved');
  assert.equal(driveJson[2].id, 3, 'Session 03 must be preserved');
  assert.equal(driveJson[3].id, 4, 'Session 04 must be preserved');
  assert.equal(driveJson.length, 24, 'All 24 sessions must be preserved');

  console.log('✅ Static Verification Passed (100%)\n');
}

async function runBrowserVerification() {
  console.log('--- Phase 2: Live Browser CDP Verification & Screenshot Capture ---');

  const PORT = 9351;
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--user-data-dir=/tmp/chrome-session-04-test-clean',
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
      value: 'session_s04_qa_test',
      domain: '127.0.0.1',
      path: '/',
    });

    // Mock auth /api/boot and /api/guided/session/4
    const s4Lesson = driveJson[3];
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        const s4Lesson = ${JSON.stringify(s4Lesson)};
        const origFetch = window.fetch;
        window.fetch = async (...args) => {
          const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
          if (url && url.includes('/api/boot')) {
            const res = await origFetch(...args);
            const data = await res.json();
            data.user = { id: 'student-4', email: 'lead4@student.edu', role: 'student', name: 'Ananya Chair' };
            return new Response(JSON.stringify(data), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          if (url && url.includes('/api/guided/session/4')) {
            return new Response(JSON.stringify({ lesson: s4Lesson }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return origFetch(...args);
        };
      `,
    });

    // 1. Desktop 1440px Capture: Navigate to /guided-learning?session=4
    console.log('Navigating to http://127.0.0.1:5173/guided-learning?session=4...');
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/guided-learning?session=4' });
    await new Promise((r) => setTimeout(r, 3000));

    // Capture Desktop Heading 1 (Understand Delivery Crisis & Task 01)
    await capture('s04-heading-01-crisis-desktop-1440.png', 1440, 900);

    // Scroll down to Heading 2 (Run Meeting & Record Actions & Tasks 02-04)
    await send('Runtime.evaluate', {
      expression: `
        const el = document.getElementById('vcep-area-meeting');
        if (el) el.scrollIntoView({ behavior: 'instant' });
      `,
    });
    await new Promise((r) => setTimeout(r, 600));

    // Capture Desktop Heading 2 (Run Meeting & Actions)
    await capture('s04-heading-02-meeting-desktop-1440.png', 1440, 900);

    // 2. Tablet 768px Capture
    await send('Runtime.evaluate', {
      expression: `
        const el = document.getElementById('vcep-area-crisis');
        if (el) el.scrollIntoView({ behavior: 'instant' });
      `,
    });
    await capture('s04-meetings-tablet-768.png', 768, 1024);

    // 3. Mobile 390px Capture
    await capture('s04-meetings-mobile-390.png', 390, 844);

    // 4. Verify DOM Elements
    const domCheck = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const areaCrisis = document.getElementById('vcep-area-crisis');
          const areaMeeting = document.getElementById('vcep-area-meeting');
          const v3Tabs = document.querySelector('.v3-tabs');
          const crisisText = document.body.innerText.includes('17:00 IST') && document.body.innerText.includes('₹4,000 Extra');
          const authorityLimits = document.body.innerText.includes('₹2,000 Max') && document.body.innerText.includes('15:00 Today');

          const card1 = document.querySelector('[data-task-id="S04-T01"]');
          const card2 = document.querySelector('[data-task-id="S04-T02"]');
          const card3 = document.querySelector('[data-task-id="S04-T03"]');
          const card4 = document.querySelector('[data-task-id="S04-T04"]');

          const hasT1Title = document.body.innerText.includes('TASK 01') && document.body.innerText.includes('Prepare the Agenda');
          const hasT2Title = document.body.innerText.includes('TASK 02') && document.body.innerText.includes('Run the Meeting');
          const hasT3Title = document.body.innerText.includes('TASK 03') && document.body.innerText.includes('Record Decisions and Actions');
          const hasT4Title = document.body.innerText.includes('TASK 04') && document.body.innerText.includes('Update the Manager');

          const hasGovernance = document.body.innerText.includes('Portfolio Governance, Peer Review');
          const hasRubric = document.body.innerText.toLowerCase().includes('assessment rubric') || document.body.textContent.includes('Assessment Rubric');

          return {
            hasAreaCrisis: !!areaCrisis,
            hasAreaMeeting: !!areaMeeting,
            tabsHidden: !v3Tabs,
            hasCrisisText: crisisText,
            hasAuthorityLimits: authorityLimits,
            hasCard1: !!card1,
            hasCard2: !!card2,
            hasCard3: !!card3,
            hasCard4: !!card4,
            hasT1Title,
            hasT2Title,
            hasT3Title,
            hasT4Title,
            hasGovernance,
            hasRubric,
          };
        })()
      `,
      returnByValue: true,
    });

    console.log('📊 DOM Inspection Result:', domCheck.result.value);
    assert.ok(domCheck.result.value.hasAreaCrisis, 'Heading 1 (Delivery Crisis) must exist');
    assert.ok(domCheck.result.value.hasAreaMeeting, 'Heading 2 (Run Meeting & Record Actions) must exist');
    assert.ok(domCheck.result.value.tabsHidden, 'v3-tabs must be hidden for Session 04');
    assert.ok(domCheck.result.value.hasCrisisText, 'Delivery crisis and ₹4,000 extra fee text must exist');
    assert.ok(domCheck.result.value.hasAuthorityLimits, 'Operations lead ₹2,000 limit and 15:00 manager availability must exist');
    assert.ok(domCheck.result.value.hasCard1, 'TaskCard S04-T01 must exist in DOM');
    assert.ok(domCheck.result.value.hasCard2, 'TaskCard S04-T02 must exist in DOM');
    assert.ok(domCheck.result.value.hasCard3, 'TaskCard S04-T03 must exist in DOM');
    assert.ok(domCheck.result.value.hasCard4, 'TaskCard S04-T04 must exist in DOM');
    assert.ok(domCheck.result.value.hasT1Title, 'Task 01 title must be visible');
    assert.ok(domCheck.result.value.hasT2Title, 'Task 02 title must be visible');
    assert.ok(domCheck.result.value.hasT3Title, 'Task 03 title must be visible');
    assert.ok(domCheck.result.value.hasT4Title, 'Task 04 title must be visible');
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
  console.log('VCEP SESSION 04 TRANSFORMATION VERIFICATION SUITE');
  console.log('================================================================\n');

  await runStaticVerification();
  await runBrowserVerification();

  console.log('🎉 ALL VCEP SESSION 04 REDESIGN CHECKS COMPLETED SUCCESSFULLY!');
}

main().catch((err) => {
  console.error('❌ Verification Failed:', err);
  process.exit(1);
});
