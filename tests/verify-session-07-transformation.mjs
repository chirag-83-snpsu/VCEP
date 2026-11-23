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

  const s07Data = fs.readFileSync('app/guided-learning/components/session-07-cleaning-data.ts', 'utf8');
  const s07Comp = fs.readFileSync('app/guided-learning/components/session-07-cleaning-journey.tsx', 'utf8');
  const pageTsx = fs.readFileSync('app/guided-learning/page.tsx', 'utf8');
  const s07Rules = fs.readFileSync('lib/review-engine/session-rules/session-07.ts', 'utf8');

  // 1. Verify Core Financial & Cleaning Constants
  assert.ok(s07Data.includes('RAW_TOTAL_VOLUME_INR = 44000'), 'Must define RAW_TOTAL_VOLUME_INR = 44000');
  assert.ok(s07Data.includes('TARGET_CLEAN_TOTAL_INR = 25000'), 'Must define TARGET_CLEAN_TOTAL_INR = 25000');
  assert.ok(s07Data.includes('TARGET_EXCEPTIONS_TOTAL_INR = 19000'), 'Must define TARGET_EXCEPTIONS_TOTAL_INR = 19000');
  assert.ok(s07Data.includes('TARGET_ASHA_TOTAL_INR = 17000'), 'Must define TARGET_ASHA_TOTAL_INR = 17000');
  assert.ok(s07Data.includes('TARGET_BEACON_TOTAL_INR = 8000'), 'Must define TARGET_BEACON_TOTAL_INR = 8000');

  // 2. Verify Two Natural Headings in Component
  assert.ok(s07Comp.includes('id="vcep-area-raw"'), 'Must have Heading 1: Inspect the Raw Receipts');
  assert.ok(s07Comp.includes('id="vcep-area-clean"'), 'Must have Heading 2: Clean, Validate & Report');

  // 3. Verify Unified TaskCard Component Pattern & 4 Task Cards
  assert.ok(s07Comp.includes('function TaskCard('), 'Must define unified TaskCard component');
  assert.ok(s07Comp.includes("border: '1px solid #DCE5E9'"), 'TaskCard must use neutral 1px #DCE5E9 border');
  assert.ok(s07Comp.includes("borderLeft: isActive ? '3px solid #0F766E'"), 'TaskCard must use 3px teal accent when active');
  assert.ok(s07Comp.includes('taskId="S07-T01"'), 'Must define Task 01 (S07-T01)');
  assert.ok(s07Comp.includes('taskId="S07-T02"'), 'Must define Task 02 (S07-T02)');
  assert.ok(s07Comp.includes('taskId="S07-T03"'), 'Must define Task 03 (S07-T03)');
  assert.ok(s07Comp.includes('taskId="S07-T04"'), 'Must define Task 04 (S07-T04)');

  assert.ok(s07Comp.includes('title="Inspect Raw Receipts"'), 'Task 01 title must be Inspect Raw Receipts');
  assert.ok(s07Comp.includes('title="Find Data Issues"'), 'Task 02 title must be Find Data Issues');
  assert.ok(s07Comp.includes('title="Clean and Quarantine"'), 'Task 03 title must be Clean and Quarantine');
  assert.ok(s07Comp.includes('title="Verify the Totals"'), 'Task 04 title must be Verify the Totals');

  // 4. Verify Raw Immutability & Anti-Zeroing Stand in UI
  assert.ok(s07Comp.includes('Raw Immutability Rule'), 'Must include Raw Immutability Rule');
  assert.ok(s07Comp.includes('Rule 2: Anti-Zeroing Stand'), 'Must include Anti-Zeroing Stand');

  // 5. Verify Page.tsx Wiring
  assert.ok(pageTsx.includes('Session07CleaningJourney'), 'Must import Session07CleaningJourney in page.tsx');
  assert.ok(pageTsx.includes('selected > 24'), 'Must hide v3-tabs for sessions 1-24');
  assert.ok(pageTsx.includes('Clean, Validate & Report →'), 'Must have top Clean, Validate & Report action button');

  // 6. Verify Review Rules
  assert.ok(s07Rules.includes('s07-w1-approved-clean'), 'Must include s07-w1-approved-clean check');
  assert.ok(s07Rules.includes('s07-w2-quarantine-register'), 'Must include s07-w2-quarantine-register check');
  assert.ok(s07Rules.includes('s07-w3-reconciliation-proof'), 'Must include s07-w3-reconciliation-proof check');
  assert.ok(s07Rules.includes('s07-w4-sumifs'), 'Must include s07-w4-sumifs check');
  assert.ok(s07Rules.includes('s07-t2-zeroing-stand'), 'Must include s07-t2-zeroing-stand check');

  // 7. Verify All 24 Sessions Preserved
  assert.equal(driveJson[0].id, 1, 'Session 01 must be preserved');
  assert.equal(driveJson[1].id, 2, 'Session 02 must be preserved');
  assert.equal(driveJson[2].id, 3, 'Session 03 must be preserved');
  assert.equal(driveJson[3].id, 4, 'Session 04 must be preserved');
  assert.equal(driveJson[4].id, 5, 'Session 05 must be preserved');
  assert.equal(driveJson[5].id, 6, 'Session 06 must be preserved');
  assert.equal(driveJson[6].id, 7, 'Session 07 must be preserved');
  assert.equal(driveJson.length, 24, 'All 24 sessions must be preserved');

  console.log('✅ Static Verification Passed (100%)\n');
}

async function runBrowserVerification() {
  console.log('--- Phase 2: Live Browser CDP Verification & Screenshot Capture ---');

  const PORT = 9357;
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--user-data-dir=/tmp/chrome-session-07-test-clean',
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
      value: 'session_s07_qa_test',
      domain: '127.0.0.1',
      path: '/',
    });

    // Mock auth /api/boot and /api/guided/session/7
    const s7Lesson = driveJson[6];
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        const s7Lesson = ${JSON.stringify(s7Lesson)};
        const origFetch = window.fetch;
        window.fetch = async (...args) => {
          const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
          if (url && url.includes('/api/boot')) {
            const res = await origFetch(...args);
            const data = await res.json();
            data.user = { id: 'student-7', email: 'analyst7@student.edu', role: 'student', name: 'Tanvi Analyst' };
            return new Response(JSON.stringify(data), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          if (url && url.includes('/api/guided/session/7')) {
            return new Response(JSON.stringify({ lesson: s7Lesson }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return origFetch(...args);
        };
      `,
    });

    // 1. Desktop 1440px Capture: Navigate to /guided-learning?session=7
    console.log('Navigating to /guided-learning?session=7...');
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/guided-learning?session=7' });
    await new Promise((r) => setTimeout(r, 3000));

    // Capture Desktop Heading 1 (Inspect the Raw Receipts)
    await capture('s07-heading-01-raw-desktop-1440.png', 1440, 900);

    // Scroll down to Heading 2 (Clean, Validate & Report)
    await send('Runtime.evaluate', {
      expression: `
        const el = document.getElementById('vcep-area-clean');
        if (el) el.scrollIntoView({ behavior: 'instant' });
      `,
    });
    await new Promise((r) => setTimeout(r, 600));

    // Capture Desktop Heading 2 (Clean, Validate & Report)
    await capture('s07-heading-02-clean-desktop-1440.png', 1440, 900);

    // 2. Tablet 768px Capture
    await send('Runtime.evaluate', {
      expression: `
        const el = document.getElementById('vcep-area-raw');
        if (el) el.scrollIntoView({ behavior: 'instant' });
      `,
    });
    await capture('s07-cleaning-tablet-768.png', 768, 1024);

    // 3. Mobile 390px Capture
    await capture('s07-cleaning-mobile-390.png', 390, 844);

    // 4. Verify DOM Elements
    const domCheck = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const areaRaw = document.getElementById('vcep-area-raw');
          const areaClean = document.getElementById('vcep-area-clean');
          const v3Tabs = document.querySelector('.v3-tabs');
          const card1 = document.querySelector('[data-task-id="S07-T01"]');
          const card2 = document.querySelector('[data-task-id="S07-T02"]');
          const card3 = document.querySelector('[data-task-id="S07-T03"]');
          const card4 = document.querySelector('[data-task-id="S07-T04"]');

          const bodyText = document.body.textContent || '';
          const hasRawVolume = bodyText.includes('44,000');
          const hasCleanVolume = bodyText.includes('25,000');
          const hasExceptionsVolume = bodyText.includes('19,000');
          const hasAsha = bodyText.includes('17,000');
          const hasBeacon = bodyText.includes('8,000');
          const hasZeroProof = bodyText.includes('44,000 = ₹25,000 + ₹19,000');
          const tablesCount = document.querySelectorAll('table').length;
          const hasGovernance = bodyText.includes('Portfolio Governance & Audit Trail');
          const hasRubric = bodyText.toLowerCase().includes('assessment rubric') && bodyText.includes('10 Marks Total');

          return {
            hasAreaRaw: !!areaRaw,
            hasAreaClean: !!areaClean,
            tabsHidden: !v3Tabs,
            hasCard1: !!card1,
            hasCard2: !!card2,
            hasCard3: !!card3,
            hasCard4: !!card4,
            t1Title: card1 ? card1.querySelector('h3')?.textContent : null,
            t2Title: card2 ? card2.querySelector('h3')?.textContent : null,
            t3Title: card3 ? card3.querySelector('h3')?.textContent : null,
            t4Title: card4 ? card4.querySelector('h3')?.textContent : null,
            hasRawVolume,
            hasCleanVolume,
            hasExceptionsVolume,
            hasAsha,
            hasBeacon,
            hasZeroProof,
            tablesCount,
            hasGovernance,
            hasRubric,
          };
        })()
      `,
      returnByValue: true,
    });

    console.log('📊 DOM Inspection Result:', domCheck.result.value);
    const res = domCheck.result.value;

    assert.ok(res.hasAreaRaw, 'Heading 1 (Inspect the Raw Receipts) must exist');
    assert.ok(res.hasAreaClean, 'Heading 2 (Clean, Validate & Report) must exist');
    assert.ok(res.tabsHidden, 'v3-tabs must be hidden for Session 07');

    assert.ok(res.hasCard1, 'TaskCard S07-T01 must exist');
    assert.ok(res.hasCard2, 'TaskCard S07-T02 must exist');
    assert.ok(res.hasCard3, 'TaskCard S07-T03 must exist');
    assert.ok(res.hasCard4, 'TaskCard S07-T04 must exist');

    assert.equal(res.t1Title, 'Inspect Raw Receipts', 'Task 1 title must match');
    assert.equal(res.t2Title, 'Find Data Issues', 'Task 2 title must match');
    assert.equal(res.t3Title, 'Clean and Quarantine', 'Task 3 title must match');
    assert.equal(res.t4Title, 'Verify the Totals', 'Task 4 title must match');

    assert.ok(res.hasRawVolume, 'Raw volume ₹44,000 must exist');
    assert.ok(res.hasCleanVolume, 'Clean volume ₹25,000 must exist');
    assert.ok(res.hasExceptionsVolume, 'Exceptions volume ₹19,000 must exist');
    assert.ok(res.hasAsha, 'Asha total ₹17,000 must exist');
    assert.ok(res.hasBeacon, 'Beacon total ₹8,000 must exist');
    assert.ok(res.hasZeroProof, 'Zero-variance proof (₹44k = ₹25k + ₹19k) must exist');
    assert.ok(res.tablesCount >= 2, 'Must have at least 2 tables (Raw grid + Clean/Exceptions)');
    assert.ok(res.hasGovernance, 'Governance section must exist');
    assert.ok(res.hasRubric, '10 Marks rubric must exist');

    console.log('✅ Browser End-to-End Verification Passed 100%!\n');

    ws.close();
  } finally {
    chrome.kill();
  }
}

async function run() {
  await runStaticVerification();
  await runBrowserVerification();
}

run().catch((err) => {
  console.error('❌ Verification Failed:', err);
  process.exit(1);
});
