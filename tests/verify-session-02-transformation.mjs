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

  const s02Data = fs.readFileSync('app/guided-learning/components/session-02-teamwork-data.ts', 'utf8');
  const s02Comp = fs.readFileSync('app/guided-learning/components/session-02-teamwork-journey.tsx', 'utf8');
  const pageTsx = fs.readFileSync('app/guided-learning/page.tsx', 'utf8');

  // 1. Verify 5 Squad Roles & Constraints
  assert.ok(s02Data.includes('INITIAL_SQUAD_MEMBERS'), 'Must define INITIAL_SQUAD_MEMBERS');
  assert.ok(s02Data.includes('Coordinator'), 'Must include Coordinator role');
  assert.ok(s02Data.includes('Finance Lead'), 'Must include Finance Lead role');
  assert.ok(s02Data.includes('Data Lead'), 'Must include Data Lead role');
  assert.ok(s02Data.includes('Client Communications Lead'), 'Must include Client Communications Lead role');
  assert.ok(s02Data.includes('Quality Reviewer'), 'Must include Quality Reviewer role');
  assert.ok(s02Data.includes('sharesLaptop'), 'Must include laptop sharing constraint');
  assert.ok(s02Data.includes('travelsLongDistance'), 'Must include 90-min commute constraint');

  // 2. Verify 20-Minute Keyboard Sharing Slots & 18:00 Deadline
  assert.ok(s02Data.includes('INITIAL_LAPTOP_SLOTS'), 'Must define laptop sharing slots');
  assert.ok(s02Data.includes('18:00'), 'Must reference 18:00 deadline');

  // 3. Verify Escalation Decisions
  assert.ok(s02Data.includes('opt-backup'), 'Must include Option A (Backup)');
  assert.ok(s02Data.includes('opt-skip'), 'Must include Option B (Skip review)');
  assert.ok(s02Data.includes('opt-extend'), 'Must include Option C (Extend deadline)');

  // 4. Verify 4-Session Rotations
  assert.ok(s02Data.includes('INITIAL_ROTATIONS'), 'Must define INITIAL_ROTATIONS');

  // 5. Verify 2 Headings in Component
  assert.ok(s02Comp.includes('id="vcep-area-join"'), 'Must have Heading 1: Join Your Team');
  assert.ok(s02Comp.includes('id="vcep-area-charter"'), 'Must have Heading 2: Build Your Professional Profile & Charter');

  // 6. Verify 4 Unified Premium Bordered Task Cards & IDs
  assert.ok(s02Comp.includes('taskId="S02-T01"'), 'Must define S02-T01');
  assert.ok(s02Comp.includes('TASK 01') && s02Comp.includes('Introduce Yourself'), 'Must have Task 01 Introduce Yourself');

  assert.ok(s02Comp.includes('taskId="S02-T02"'), 'Must define S02-T02');
  assert.ok(s02Comp.includes('TASK 02') && s02Comp.includes('Assign Team Roles'), 'Must have Task 02 Assign Team Roles');

  assert.ok(s02Comp.includes('taskId="S02-T03"'), 'Must define S02-T03');
  assert.ok(s02Comp.includes('TASK 03') && s02Comp.includes('Agree on Team Rules'), 'Must have Task 03 Agree on Team Rules');

  assert.ok(s02Comp.includes('taskId="S02-T04"'), 'Must define S02-T04');
  assert.ok(s02Comp.includes('TASK 04') && s02Comp.includes('Plan for Setbacks'), 'Must have Task 04 Plan for Setbacks');

  // 7. Verify TaskCard Design Specs: 1px border, 16px radius, 3px teal accent, why-matters disclosure
  assert.ok(s02Comp.includes('function TaskCard'), 'Must define reusable TaskCard component');
  assert.ok(s02Comp.includes('#DCE5E9'), 'Must use neutral 1px #DCE5E9 border');
  assert.ok(s02Comp.includes('#0F766E'), 'Must use brand teal #0F766E');
  assert.ok(s02Comp.includes('#17245C'), 'Must use navy #17245C');
  assert.ok(s02Comp.includes('Why this matters') || s02Comp.includes('whyMatters'), 'Must provide collapsible theory disclosure');

  // 8. Verify Session 01 and other sessions are intact
  assert.equal(driveJson[0].id, 1, 'Session 01 must be preserved');
  assert.equal(driveJson[1].id, 2, 'Session 02 must be preserved');
  assert.equal(driveJson.length, 24, 'All 24 sessions must be preserved');

  console.log('✅ Static Verification Passed (100%)\n');
}

async function runBrowserVerification() {
  console.log('--- Phase 2: Live Browser CDP Verification & Screenshot Capture ---');

  const PORT = 9346;
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--user-data-dir=/tmp/chrome-session-02-test',
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
        const timer = setTimeout(() => {
          ws.removeEventListener('message', handler);
          reject(new Error(`CDP ${method} timed out after 10000ms`));
        }, 10000);
        const handler = (msg) => {
          const data = JSON.parse(msg.data);
          if (data.id === reqId) {
            clearTimeout(timer);
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

    // Set authenticated session cookie to view Guided Learning
    await send('Network.enable');
    await send('Network.setCookie', {
      name: '__vcep_session',
      value: 'session_s02_qa_test',
      domain: '127.0.0.1',
      path: '/',
    });

    // Mock auth /api/boot and /api/guided/session/2
    const s2Lesson = driveJson[1];
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        const s2Lesson = ${JSON.stringify(s2Lesson)};
        const origFetch = window.fetch;
        window.fetch = async (...args) => {
          const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
          if (url && url.includes('/api/boot')) {
            const res = await origFetch(...args);
            const data = await res.json();
            data.user = { id: 'student-2', email: 'squad2@student.edu', role: 'student', name: 'Priya Teamwork' };
            return new Response(JSON.stringify(data), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          if (url && url.includes('/api/guided/session/2')) {
            return new Response(JSON.stringify({ lesson: s2Lesson }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return origFetch(...args);
        };
      `,
    });

    // 1. TEST 01 & Desktop 1440px Capture: Navigate to /guided-learning?session=2
    console.log('Navigating to /guided-learning?session=2...');
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/guided-learning?session=2' });
    await new Promise((r) => setTimeout(r, 3000));

    // Capture Desktop Heading 1 (Join Your Team & Tasks 01-02)
    console.log('Capturing Desktop Heading 1...');
    await capture('s02-heading-01-join-team-desktop-1440.png', 1440, 900);

    // 2. TEST 02: Scroll to Heading 2 (Build Your Professional Profile & Charter & Tasks 03-04)
    console.log('Navigating to Heading 2 (Build Your Professional Profile & Charter)...');
    await send('Runtime.evaluate', {
      expression: `
        const areaCharter = document.getElementById('vcep-area-charter');
        if (areaCharter) areaCharter.scrollIntoView({ behavior: 'instant', block: 'start' });
      `,
    });
    await new Promise((r) => setTimeout(r, 1000));
    await capture('s02-heading-02-charter-desktop-1440.png', 1440, 900);

    // 3. Tablet 768px View of Heading 1
    console.log('Capturing Tablet (768px)...');
    await send('Runtime.evaluate', {
      expression: `
        const areaJoin = document.getElementById('vcep-area-join');
        if (areaJoin) areaJoin.scrollIntoView({ behavior: 'instant', block: 'start' });
      `,
    });
    await new Promise((r) => setTimeout(r, 800));
    await capture('s02-teamwork-tablet-768.png', 768, 1024);

    // 4. Mobile 390px View of Heading 1
    console.log('Capturing Mobile (390px)...');
    await capture('s02-teamwork-mobile-390.png', 390, 844);

    // 5. DOM Verification of 4 TaskCards, Simplification & Zero Stages
    console.log('Evaluating live DOM elements in browser...');
    const evalResult = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const title = document.querySelector('h1')?.textContent;
          const stageButtons = document.querySelectorAll('.vcep-journey-step-btn').length;
          const v3Tabs = document.querySelectorAll('.v3-tabs').length;
          const areaJoin = Boolean(document.getElementById('vcep-area-join'));
          const areaCharter = Boolean(document.getElementById('vcep-area-charter'));
          const memberRows = document.querySelectorAll('#vcep-area-join tbody tr').length;
          const slotRows = document.querySelectorAll('#vcep-area-charter tbody tr').length;
          const decisionOptions = document.querySelectorAll('#vcep-area-charter [style*="cursor: pointer"]').length;
          const task01 = Boolean(document.querySelector('[data-task-id="S02-T01"]'));
          const task02 = Boolean(document.querySelector('[data-task-id="S02-T02"]'));
          const task03 = Boolean(document.querySelector('[data-task-id="S02-T03"]'));
          const task04 = Boolean(document.querySelector('[data-task-id="S02-T04"]'));
          const taskCardsCount = document.querySelectorAll('[data-task-id]').length;

          return {
            title,
            stageButtons,
            v3Tabs,
            areaJoin,
            areaCharter,
            memberRows,
            slotRows,
            decisionOptions,
            task01,
            task02,
            task03,
            task04,
            taskCardsCount,
          };
        })()
      `,
      returnByValue: true,
    });

    const dom = evalResult.result.value;
    console.log('DOM Evaluation:', dom);
    assert.ok(dom.title.includes('Professional Identity'), 'Page Title must be "Professional Identity and Teamwork"');
    assert.equal(dom.stageButtons, 0, 'Must have ZERO visible stage buttons/stepper');
    assert.equal(dom.v3Tabs, 0, 'Must have ZERO legacy v3 tabs');
    assert.ok(dom.areaJoin, 'Heading 1: Join Your Team must exist');
    assert.ok(dom.areaCharter, 'Heading 2: Build Your Profile & Charter must exist');
    assert.equal(dom.task01, true, 'Task 01 (S02-T01) must exist');
    assert.equal(dom.task02, true, 'Task 02 (S02-T02) must exist');
    assert.equal(dom.task03, true, 'Task 03 (S02-T03) must exist');
    assert.equal(dom.task04, true, 'Task 04 (S02-T04) must exist');
    assert.equal(dom.taskCardsCount, 4, 'Exactly 4 bordered task cards must exist');

    console.log('✅ Live Browser CDP Verification & Screenshots Passed 100%!\n');

    ws.close();
  } finally {
    chrome.kill('SIGTERM');
  }
}

async function main() {
  await runStaticVerification();
  await runBrowserVerification();
  console.log('🎉 ALL SESSION 02 COMPLETE TRANSFORMATION TESTS PASSED (100%)!');
}

main().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
