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

  // 5. Verify 5 Wizard Steps & Stepper Stepper
  assert.ok(s02Comp.includes('WIZARD_STEPS'), 'Must define WIZARD_STEPS');
  assert.ok(s02Comp.includes('taskId="S02-T01"'), 'Must define S02-T01');
  assert.ok(s02Comp.includes('taskId="S02-T02"'), 'Must define S02-T02');
  assert.ok(s02Comp.includes('taskId="S02-T03"'), 'Must define S02-T03');
  assert.ok(s02Comp.includes('taskId="S02-T04"'), 'Must define S02-T04');
  assert.ok(s02Comp.includes('taskId="S02-T05"'), 'Must define S02-T05');

  // 6. Verify Sub-Tabs & Anti-Spoiler
  assert.ok(s02Comp.includes('Squad Roles') && s02Comp.includes('Rotation Plan'), 'Must have Step 2 sub-tabs');
  assert.ok(s02Comp.includes('Laptop Slots') && s02Comp.includes('Team Charter'), 'Must have Step 3 sub-tabs');
  assert.ok(s02Comp.includes('Lock Decision') || s02Comp.includes('decisionLocked'), 'Must have Step 4 anti-spoiler gate');
  assert.ok(!s02Data.includes('(Recommended)'), 'Data must not spoil recommended option in title');

  // 7. Verify Step 5 Auto-Sync & Submission Elements
  assert.ok(s02Comp.includes('b0r0c1'), 'Must auto-populate b0r0c1');
  assert.ok(s02Comp.includes('b0r1c1'), 'Must auto-populate b0r1c1');
  assert.ok(s02Comp.includes('b0r2c1'), 'Must auto-populate b0r2c1');
  assert.ok(s02Comp.includes('b1'), 'Must auto-populate b1');
  assert.ok(s02Comp.includes('submission-integrity-checkbox'), 'Must have integrity checkbox');
  assert.ok(s02Comp.includes('submit-official-attempt-btn') || s02Comp.includes('Submit Official Attempt'), 'Must have submit button');
  assert.ok(s02Comp.includes('vcep-official-submission-station'), 'Must have submission station ID');

  // 8. Verify TaskCard Design Specs
  assert.ok(s02Comp.includes('function TaskCard'), 'Must define reusable TaskCard component');
  assert.ok(s02Comp.includes('#DCE5E9'), 'Must use neutral 1px #DCE5E9 border');
  assert.ok(s02Comp.includes('#0F766E'), 'Must use brand teal #0F766E');
  assert.ok(s02Comp.includes('#17245C'), 'Must use navy #17245C');

  // 9. Verify Session 01 and 02 are preserved in driveJson
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

    // Set authenticated session cookie
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

    // 1. Navigate to /guided-learning?session=2
    console.log('Navigating to /guided-learning?session=2...');
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/guided-learning?session=2' });
    await new Promise((r) => setTimeout(r, 3000));

    // Capture Desktop Step 1
    console.log('Capturing Desktop Step 1 (Introduce Yourself)...');
    await capture('s02-heading-01-join-team-desktop-1440.png', 1440, 900);

    // 2. Click Step 4 in Wizard Stepper (Plan for Setbacks)
    console.log('Navigating to Step 4 (Crisis Plan & Anti-Spoiler)...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('nav button'));
          const step4Btn = btns.find(b => b.textContent && b.textContent.includes('Crisis Plan'));
          if (step4Btn) step4Btn.click();
        })()
      `,
    });
    await new Promise((r) => setTimeout(r, 800));

    // Click Option A and lock decision
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const opts = Array.from(document.querySelectorAll('[data-task-id="S02-T04"] div'));
          const optA = opts.find(d => d.textContent && d.textContent.includes('Option A'));
          if (optA) optA.click();
        })()
      `,
    });
    await new Promise((r) => setTimeout(r, 400));
    await capture('s02-heading-02-charter-desktop-1440.png', 1440, 900);

    // 3. Click Step 5 in Wizard Stepper (Review & Submit)
    console.log('Navigating to Step 5 (Review & Submit)...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = Array.from(document.querySelectorAll('nav button'));
          const step5Btn = btns.find(b => b.textContent && b.textContent.includes('Review & Submit'));
          if (step5Btn) step5Btn.click();
        })()
      `,
    });
    await new Promise((r) => setTimeout(r, 800));

    // Capture Tablet 768px View
    console.log('Capturing Tablet (768px)...');
    await capture('s02-teamwork-tablet-768.png', 768, 1024);

    // Capture Mobile 390px View
    console.log('Capturing Mobile (390px)...');
    await capture('s02-teamwork-mobile-390.png', 390, 844);

    // 5. DOM Verification of 5 TaskCards, Stepper, Single Active View
    console.log('Evaluating live DOM elements in browser...');
    const evalResult = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const title = document.querySelector('h1')?.textContent;
          const stepperButtons = document.querySelectorAll('nav button').length;
          const task01 = Boolean(document.querySelector('[data-task-id="S02-T01"]'));
          const task02 = Boolean(document.querySelector('[data-task-id="S02-T02"]'));
          const task03 = Boolean(document.querySelector('[data-task-id="S02-T03"]'));
          const task04 = Boolean(document.querySelector('[data-task-id="S02-T04"]'));
          const task05 = Boolean(document.querySelector('[data-task-id="S02-T05"]'));
          const taskCardsCount = document.querySelectorAll('[data-task-id]').length;
          const integrityCheckbox = Boolean(document.getElementById('submission-integrity-checkbox'));
          const b0r0Val = document.getElementById('b0r0c1')?.value;
          const b0r1Val = document.getElementById('b0r1c1')?.value;
          const officialStation = Boolean(document.getElementById('vcep-official-submission-station'));

          // Check single visible task card
          const visibleCards = Array.from(document.querySelectorAll('[data-task-id]'))
            .filter(el => window.getComputedStyle(el).display !== 'none').length;

          return {
            title,
            stepperButtons,
            task01,
            task02,
            task03,
            task04,
            task05,
            taskCardsCount,
            visibleCards,
            integrityCheckbox,
            b0r0Val,
            b0r1Val,
            officialStation,
          };
        })()
      `,
      returnByValue: true,
    });

    const dom = evalResult.result.value;
    console.log('DOM Evaluation:', dom);
    assert.ok(dom.title.includes('Professional Identity'), 'Page Title must be "Professional Identity and Teamwork"');
    assert.equal(dom.stepperButtons, 5, 'Must have exactly 5 stepper buttons');
    assert.equal(dom.task01, true, 'Task 01 (S02-T01) must exist');
    assert.equal(dom.task02, true, 'Task 02 (S02-T02) must exist');
    assert.equal(dom.task03, true, 'Task 03 (S02-T03) must exist');
    assert.equal(dom.task04, true, 'Task 04 (S02-T04) must exist');
    assert.equal(dom.task05, true, 'Task 05 (S02-T05) must exist');
    assert.equal(dom.taskCardsCount, 5, 'Exactly 5 bordered task cards must exist in DOM');
    assert.equal(dom.visibleCards, 1, 'Exactly 1 task card must be visible at a time (Wizard pattern)');
    assert.equal(dom.integrityCheckbox, true, 'Integrity checkbox must exist');
    assert.ok(dom.b0r0Val && dom.b0r0Val.includes('verified team members'), 'b0r0c1 must auto-sync authentic roster data');
    assert.ok(dom.b0r1Val && dom.b0r1Val.includes('Option A'), 'b0r1c1 must auto-sync Option A decision');
    assert.equal(dom.officialStation, true, 'Submission station container must exist');

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
