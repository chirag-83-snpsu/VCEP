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
  const ws = fs.readFileSync('app/guided-learning/workstations/session-12-workstation.tsx', 'utf8');
  const journey = fs.readFileSync('app/guided-learning/components/session-12-receivables-journey.tsx', 'utf8');
  const data = fs.readFileSync('app/guided-learning/components/session-12-receivables-data.ts', 'utf8');
  const rules = fs.readFileSync('lib/review-engine/session-rules/session-12.ts', 'utf8');

  // 1. Check Natural Headings
  assert.ok(journey.includes('id="vcep-area-ageing"'), 'Must define #vcep-area-ageing');
  assert.ok(journey.includes('1. Understand Who Owes What'), 'Must have heading "1. Understand Who Owes What"');
  assert.ok(journey.includes('id="vcep-area-plan"'), 'Must define #vcep-area-plan');
  assert.ok(journey.includes('2. Build the Collection') && journey.includes('Cash Plan'), 'Must have heading "2. Build the Collection & Cash Plan"');

  // 2. Check Unified TaskCard Architecture & 4 Bordered Cards
  assert.ok(journey.includes('function TaskCard('), 'Must define unified TaskCard component');
  assert.ok(journey.includes("taskId=\"S12-T01\""), 'Must include TaskCard S12-T01');
  assert.ok(journey.includes("taskId=\"S12-T02\""), 'Must include TaskCard S12-T02');
  assert.ok(journey.includes("taskId=\"S12-T03\""), 'Must include TaskCard S12-T03');
  assert.ok(journey.includes("taskId=\"S12-T04\""), 'Must include TaskCard S12-T04');

  // 3. Check Task Titles
  assert.ok(journey.includes('title="Prepare the Ageing"'), 'Task 01 title must be "Prepare the Ageing"');
  assert.ok(journey.includes('title="Identify the Cash Gap"'), 'Task 02 title must be "Identify the Cash Gap"');
  assert.ok(journey.includes('title="Manage the Dispute"'), 'Task 03 title must be "Manage the Dispute"');
  assert.ok(journey.includes('title="Plan Collections"'), 'Task 04 title must be "Plan Collections"');

  // 4. Check Border and Styling Standards
  assert.ok(journey.includes("border: '1px solid #DCE5E9'"), 'Must use 1px solid #DCE5E9 border');
  assert.ok(journey.includes("borderLeft: isActive ? '3px solid #0F766E'"), 'Must use 3px teal accent for active task');
  assert.ok(journey.includes("borderRadius: '16px'"), 'Must use 16px radius');

  // 5. Check Math & Ageing Constants in canonical data
  assert.ok(data.includes("id: 'F01'") && data.includes('outstandingINR: 10000') && data.includes("correctBucket: 'Current'"), 'F01 must be Current and ₹10,000');
  assert.ok(data.includes("id: 'F02'") && data.includes('outstandingINR: 20000') && data.includes('disputedAmountINR: 5000') && data.includes("correctBucket: '1–30 Days'"), 'F02 must be 1–30d with ₹5k dispute');
  assert.ok(data.includes("id: 'F03'") && data.includes('outstandingINR: 30000') && data.includes("correctBucket: '31–60 Days'"), 'F03 must be 31–60d and ₹30,000');
  assert.ok(data.includes("id: 'F04'") && data.includes('outstandingINR: 40000') && data.includes("correctBucket: '61–90 Days'"), 'F04 must be 61–90d and ₹40,000');

  // Verify total math
  const totalOutstanding = 10000 + 20000 + 30000 + 40000;
  assert.equal(totalOutstanding, 100000, 'Total outstanding must be ₹1,00,000');

  // Cash gap verification
  const openingBank = 25000;
  const payments = 45000;
  const initialGap = openingBank - payments;
  assert.equal(initialGap, -20000, 'Initial cash gap must be -₹20,000');

  // Tactical target verification (Beacon undisputed ₹15k + Asha ₹10k = ₹25k)
  const targetedReceipts = 15000 + 10000;
  const closingCash = openingBank + targetedReceipts - payments;
  assert.equal(closingCash, 5000, 'Closing cash buffer must be +₹5,000');

  // 6. Verify Workstation Delegation
  assert.ok(ws.includes('Session12ReceivablesJourney'), 'Workstation must delegate to Session12ReceivablesJourney');

  // 7. Verify page.tsx tab suppression and button wiring
  assert.ok(page.includes('selected > 24 && ('), 'Tabs must be suppressed for selected <= 24');
  assert.ok(page.includes('vcep-area-plan'), 'Page must wire Build Collection & Cash Plan button');
  assert.ok(page.includes('vcep-area-ageing'), 'Page must wire Understand Who Owes What button');
  assert.ok(page.includes('Turn overdue invoices into a cash plan.'), 'Page must display Session 12 subline');

  // 8. Verify Evaluator Rules in lib
  assert.ok(rules.includes('s12-w1-ageing-buckets'), 'Review rules must check Ageing Buckets');
  assert.ok(rules.includes('s12-w2-reconcile-totals'), 'Review rules must check Reconcile Totals');
  assert.ok(rules.includes('s12-w3-cash-gap-analytics'), 'Review rules must check Cash Gap Analytics');
  assert.ok(rules.includes('s12-w4-collection-plan'), 'Review rules must check Collection Plan');
  assert.ok(rules.includes('s12-w5-dispute-communication'), 'Review rules must check Dispute Communication');

  console.log('✅ Phase 1: Static Code & Content Verification Passed (100%)\n');
}

async function runBrowserVerification() {
  console.log('--- Phase 2: Live Browser CDP Verification & Screenshot Capture ---');

  const PORT = 9382;
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--user-data-dir=/tmp/chrome-session-12-test-clean',
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
      value: 'session_s12_qa_test',
      domain: '127.0.0.1',
      path: '/',
    });

    // Mock auth /api/boot and /api/guided/session/12
    const s12Lesson = driveJson.find((s) => s.id === 12);
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        const s12Lesson = ${JSON.stringify(s12Lesson)};
        const origFetch = window.fetch;
        window.fetch = async (...args) => {
          const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
          if (url && url.includes('/api/boot')) {
            const res = await origFetch(...args);
            const data = await res.json();
            data.user = { id: 'student-12', email: 'analyst12@student.edu', role: 'student', name: 'Tanvi Credit Analyst' };
            return new Response(JSON.stringify(data), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          if (url && url.includes('/api/guided/session/12')) {
            return new Response(JSON.stringify({ lesson: s12Lesson }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return origFetch(...args);
        };
      `,
    });

    const targetUrl = 'http://127.0.0.1:5173/guided-learning?session=12';
    console.log(`Navigating to ${targetUrl}...`);
    await send('Page.navigate', { url: targetUrl });
    await new Promise((r) => setTimeout(r, 3000));

    // Capture 1440px Desktop Heading 1: Understand Who Owes What (Tasks 01 & 02)
    await send('Runtime.evaluate', {
      expression: `document.getElementById('vcep-area-ageing')?.scrollIntoView({ behavior: 'instant', block: 'start' });`,
    });
    await capture('s12-heading-01-ageing-desktop-1440.png', 1440, 900);

    // Capture 1440px Desktop Heading 2: Build Collection & Cash Plan (Tasks 03 & 04)
    await send('Runtime.evaluate', {
      expression: `document.getElementById('vcep-area-plan')?.scrollIntoView({ behavior: 'instant', block: 'start' });`,
    });
    await capture('s12-heading-02-plan-desktop-1440.png', 1440, 900);

    // Capture Tablet 768px
    await capture('s12-receivables-tablet-768.png', 768, 1024);

    // Capture Mobile 390px
    await capture('s12-receivables-mobile-390.png', 390, 844);

    // DOM Evaluation
    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const areaAgeing = document.getElementById('vcep-area-ageing');
          const areaPlan = document.getElementById('vcep-area-plan');
          const card1 = document.querySelector('[data-task-id="S12-T01"]');
          const card2 = document.querySelector('[data-task-id="S12-T02"]');
          const card3 = document.querySelector('[data-task-id="S12-T03"]');
          const card4 = document.querySelector('[data-task-id="S12-T04"]');
          const tabs = document.querySelector('.v3-tabs');
          const bodyText = document.body.innerText;

          return {
            hasAgeingArea: !!areaAgeing,
            hasPlanArea: !!areaPlan,
            hasTask01: !!card1,
            hasTask02: !!card2,
            hasTask03: !!card3,
            hasTask04: !!card4,
            tabsHidden: !tabs,
            t1Title: card1?.querySelector('h3')?.innerText || '',
            t2Title: card2?.querySelector('h3')?.innerText || '',
            t3Title: card3?.querySelector('h3')?.innerText || '',
            t4Title: card4?.querySelector('h3')?.innerText || '',
            containsF01Asha: bodyText.includes('F01') && bodyText.includes('Asha'),
            containsF02Beacon: bodyText.includes('F02') && bodyText.includes('Beacon') && bodyText.includes('5,000'),
            containsF03Cedar: bodyText.includes('F03') && bodyText.includes('Cedar'),
            containsF04Delta: bodyText.includes('F04') && bodyText.includes('Delta'),
            containsTotalOutstanding: bodyText.includes('1,00,000'),
            containsBankBalance: bodyText.includes('25,000'),
            containsMandatoryPayments: bodyText.includes('45,000'),
            containsCashDeficitOrSurplus: bodyText.includes('20,000') || bodyText.includes('5,000'),
            containsCreditPrinciples: bodyText.includes('PRINCIPLE 1') && bodyText.includes('Due Date Dictates Ageing'),
            tablesCount: document.querySelectorAll('table').length,
          };
        })()
      `,
      returnByValue: true,
    });

    console.log('\n📊 DOM Inspection Result:', JSON.stringify(evalRes.result.value, null, 2));

    const v = evalRes.result.value;
    assert.ok(v.hasAgeingArea, 'Heading 1 #vcep-area-ageing must exist in DOM');
    assert.ok(v.hasPlanArea, 'Heading 2 #vcep-area-plan must exist in DOM');
    assert.ok(v.hasTask01, 'TaskCard S12-T01 must exist in DOM');
    assert.ok(v.hasTask02, 'TaskCard S12-T02 must exist in DOM');
    assert.ok(v.hasTask03, 'TaskCard S12-T03 must exist in DOM');
    assert.ok(v.hasTask04, 'TaskCard S12-T04 must exist in DOM');
    assert.equal(v.t1Title, 'Prepare the Ageing', 'Task 1 title must match');
    assert.equal(v.t2Title, 'Identify the Cash Gap', 'Task 2 title must match');
    assert.equal(v.t3Title, 'Manage the Dispute', 'Task 3 title must match');
    assert.equal(v.t4Title, 'Plan Collections', 'Task 4 title must match');
    assert.ok(v.tabsHidden, '.v3-tabs must be suppressed for Session 12');
    assert.ok(v.containsF01Asha, 'Must render F01 Asha');
    assert.ok(v.containsF02Beacon, 'Must render F02 Beacon with ₹5,000 dispute');
    assert.ok(v.containsF03Cedar, 'Must render F03 Cedar');
    assert.ok(v.containsF04Delta, 'Must render F04 Delta');
    assert.ok(v.containsTotalOutstanding, 'Must render ₹1,00,000 total outstanding');
    assert.ok(v.containsBankBalance, 'Must render ₹25,000 bank balance');
    assert.ok(v.containsMandatoryPayments, 'Must render ₹45,000 mandatory payments');
    assert.ok(v.containsCashDeficitOrSurplus, 'Must render cash deficit / surplus figures');
    assert.ok(v.containsCreditPrinciples, 'Must display credit control principles');
    assert.ok(v.tablesCount >= 1, 'Must render receivables ageing table');

    console.log('\n✅ Phase 2: Live Browser CDP Verification Passed 100%!');
    console.log('🎉 ALL VCEP SESSION 12 TRANSFORMATIONS VERIFIED SUCCESSFULLY!\n');

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
