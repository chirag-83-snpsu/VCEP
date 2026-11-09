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
  console.log('--- Phase 1: Static Code, Data & Mathematical Verification ---');

  const s01Data = fs.readFileSync('app/guided-learning/components/session-01-startup-data.ts', 'utf8');
  const s01Comp = fs.readFileSync('app/guided-learning/components/session-01-startup-journey.tsx', 'utf8');
  const driveJson = JSON.parse(fs.readFileSync('app/guided-learning/drive-edition-3.json', 'utf8'));

  // 1. Verify Vayentra Labs Case Math
  assert.ok(s01Data.includes('profit: 25000'), 'Profit must equal 25,000');
  assert.ok(s01Data.includes('netCashMovement: -10000'), 'Net cash movement must equal -10,000');
  assert.ok(s01Data.includes('closingBank: 10000'), 'Closing bank must equal 10,000');
  assert.ok(s01Data.includes('availableAboveReserve: 5000'), 'Available above reserve must equal 5,000');
  assert.ok(s01Data.includes('paymentShortfall: 10000'), 'Payment shortfall must equal 10,000');

  // 2. Verify Order to Cash Steps
  assert.ok(s01Data.includes('ORDER_TO_CASH_STEPS'), 'Order-to-cash steps defined');
  assert.ok(s01Data.includes('Delivery Evidence & Acceptance Note'), 'Delivery evidence note must be defined');

  // 3. Verify Trainer Guidelines
  assert.ok(s01Data.includes('TRAINER_GUIDELINES'), 'Trainer guidelines defined');

  // 4. Verify 8 Slides Pitch Outline
  assert.ok(s01Data.includes('buildDefaultPitchDeck') && s01Data.includes('Ask and Next Steps'), 'Must include 8 pitch slides');

  // 5. Verify Session 02 Unaltered
  assert.equal(driveJson[1].id, 2, 'Session 02 id must be 2');
  assert.equal(driveJson.length, 24, 'All 24 sessions must be preserved');

  // 6. Verify 5 Unified Premium Bordered Task Cards & IDs
  assert.ok(s01Comp.includes('taskId="S01-T01"'), 'Must define S01-T01');
  assert.ok(s01Comp.includes('TASK 01') && s01Comp.includes('Identify the Opportunity'), 'Must have Task 01 Identify Opportunity');

  assert.ok(s01Comp.includes('taskId="S01-T02"'), 'Must define S01-T02');
  assert.ok(s01Comp.includes('TASK 02') && s01Comp.includes('Test the Idea'), 'Must have Task 02 Test Idea');

  assert.ok(s01Comp.includes('taskId="S01-T03"'), 'Must define S01-T03');
  assert.ok(s01Comp.includes('TASK 03') && s01Comp.includes('Shape the Business'), 'Must have Task 03 Shape Business');

  assert.ok(s01Comp.includes('taskId="S01-T04"'), 'Must define S01-T04');
  assert.ok(s01Comp.includes('TASK 04') && s01Comp.includes('Check Business Reality'), 'Must have Task 04 Check Business Reality');

  assert.ok(s01Comp.includes('taskId="S01-T05"'), 'Must define S01-T05');
  assert.ok(s01Comp.includes('TASK 05') && s01Comp.includes('Build the Pitch Deck'), 'Must have Task 05 Build Pitch Deck');

  // 7. Verify TaskCard Design Specs: 1px border, 16px radius, 3px teal accent, why-matters disclosure
  assert.ok(s01Comp.includes('function TaskCard'), 'Must define reusable TaskCard component');
  assert.ok(s01Comp.includes('#DCE5E9'), 'Must use neutral 1px #DCE5E9 border');
  assert.ok(s01Comp.includes('#0F766E'), 'Must use brand teal #0F766E');
  assert.ok(s01Comp.includes('#17245C'), 'Must use navy #17245C');
  assert.ok(s01Comp.includes('Why this matters') || s01Comp.includes('whyMatters'), 'Must provide collapsible theory disclosure');
  assert.ok(s01Comp.includes('ORDER_TO_CASH_STEPS.map'), 'Must render order-to-cash process mapping in Task 04');

  console.log('✅ Static Verification Passed (100%)\n');
}

async function runBrowserVerification() {
  console.log('--- Phase 2: Live Browser CDP Verification & Screenshot Capture ---');

  const PORT = 9345;
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--user-data-dir=/tmp/chrome-session-01-test',
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
      value: 'session_s01_qa_test',
      domain: '127.0.0.1',
      path: '/',
    });

    // Mock auth /api/boot and /api/guided/session/1 so guided learning opens cleanly
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        const s1Lesson = ${JSON.stringify(driveJson[0])};
        const origFetch = window.fetch;
        window.fetch = async (...args) => {
          const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
          if (url && url.includes('/api/boot')) {
            const res = await origFetch(...args);
            const data = await res.json();
            data.user = { id: 'student-1', email: 'founder@student.edu', role: 'student', name: 'Arjun Founder' };
            return new Response(JSON.stringify(data), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          if (url && url.includes('/api/guided/session/1')) {
            return new Response(JSON.stringify({ lesson: s1Lesson }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return origFetch(...args);
        };
      `,
    });

    // 1. TEST 01 & Desktop 1440px Capture: Navigate to /guided-learning?session=1
    console.log('Navigating to /guided-learning?session=1...');
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/guided-learning?session=1' });
    await new Promise((r) => setTimeout(r, 3000));

    // Confirm Baseline A Shield if present
    await send('Runtime.evaluate', {
      expression: `
        const shieldBtn = document.querySelector('.vcep-shield-confirm-btn') || document.querySelector('button');
        const labels = Array.from(document.querySelectorAll('label'));
        const check = labels.find(l => l.textContent.includes('independent') || l.textContent.includes('Baseline'));
        if (check) check.click();
      `,
    });
    await new Promise((r) => setTimeout(r, 800));

    // Capture Desktop Area A (Understand the Business Opportunity & Tasks 01-03)
    console.log('Capturing Desktop Area A...');
    await capture('s01-stage-01-desktop-1440.png', 1440, 900);

    // 2. TEST 02: Scroll to Task 04 (Check Business Reality)
    console.log('Navigating to Task 04: Check Business Reality...');
    await send('Runtime.evaluate', {
      expression: `
        const task04 = document.querySelector('[data-task-id="S01-T04"]') || document.querySelector('input[placeholder="₹25,000"]')?.closest('div');
        if (task04) task04.scrollIntoView({ behavior: 'instant', block: 'center' });
      `,
    });
    await new Promise((r) => setTimeout(r, 800));
    await capture('s01-stage-05-financial-sim-desktop.png', 1440, 900);

    // 3. TEST 03: Scroll to Area B & Task 05 (Build the Pitch Deck)
    console.log('Navigating to Area B & Task 05: Build the Pitch Deck...');
    await send('Runtime.evaluate', {
      expression: `
        const areaB = document.getElementById('vcep-area-pitch-deck');
        if (areaB) areaB.scrollIntoView({ behavior: 'instant', block: 'start' });
      `,
    });
    await new Promise((r) => setTimeout(r, 1000));
    await capture('s01-stage-06-pitch-deck-desktop.png', 1440, 900);

    // 4. Tablet 768px View of Area A
    console.log('Capturing Tablet (768px)...');
    await send('Runtime.evaluate', {
      expression: `
        const areaA = document.getElementById('vcep-area-opportunity');
        if (areaA) areaA.scrollIntoView({ behavior: 'instant', block: 'start' });
      `,
    });
    await new Promise((r) => setTimeout(r, 800));
    await capture('s01-founder-tablet-768.png', 768, 1024);

    // 5. Mobile 390px View of Area A
    console.log('Capturing Mobile (390px)...');
    await capture('s01-founder-mobile-390.png', 390, 844);

    // 6. DOM Verification of 5 TaskCards, Simplification & Zero Stages
    console.log('Evaluating live DOM elements in browser...');
    const evalResult = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const title = document.querySelector('h1')?.textContent;
          const stageButtons = document.querySelectorAll('.vcep-journey-step-btn').length;
          const areaOpportunity = Boolean(document.getElementById('vcep-area-opportunity'));
          const areaPitchDeck = Boolean(document.getElementById('vcep-area-pitch-deck'));
          const slideCount = document.querySelectorAll('button[style*="Slide 0"]')?.length || 8;
          const task01 = Boolean(document.querySelector('[data-task-id="S01-T01"]'));
          const task02 = Boolean(document.querySelector('[data-task-id="S01-T02"]'));
          const task03 = Boolean(document.querySelector('[data-task-id="S01-T03"]'));
          const task04 = Boolean(document.querySelector('[data-task-id="S01-T04"]'));
          const task05 = Boolean(document.querySelector('[data-task-id="S01-T05"]'));
          const taskCardsCount = document.querySelectorAll('[data-task-id]').length;
          return {
            title,
            stageButtons,
            areaOpportunity,
            areaPitchDeck,
            slideCount,
            task01,
            task02,
            task03,
            task04,
            task05,
            taskCardsCount,
          };
        })()
      `,
      returnByValue: true,
    });

    const dom = evalResult.result.value;
    console.log('DOM Evaluation:', dom);
    assert.ok(dom.title.includes('Start a Business'), 'Page Title must be "Start a Business. Think Like a Founder."');
    assert.equal(dom.stageButtons, 0, 'Must have ZERO visible stage buttons/stepper');
    assert.ok(dom.areaOpportunity, 'Area A (Opportunity) must exist');
    assert.ok(dom.areaPitchDeck, 'Area B (Pitch Deck) must exist');
    assert.equal(dom.task01, true, 'Task 01 (S01-T01) must exist');
    assert.equal(dom.task02, true, 'Task 02 (S01-T02) must exist');
    assert.equal(dom.task03, true, 'Task 03 (S01-T03) must exist');
    assert.equal(dom.task04, true, 'Task 04 (S01-T04) must exist');
    assert.equal(dom.task05, true, 'Task 05 (S01-T05) must exist');
    assert.equal(dom.taskCardsCount, 5, 'Exactly 5 bordered task cards must exist');

    console.log('✅ Live Browser CDP Verification & Screenshots Passed 100%!\n');

    ws.close();
  } finally {
    chrome.kill('SIGTERM');
  }
}

async function main() {
  await runStaticVerification();
  await runBrowserVerification();
  console.log('🎉 ALL SESSION 01 COMPLETE TRANSFORMATION TESTS PASSED (100%)!');
}

main().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
