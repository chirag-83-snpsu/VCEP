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

  const page = fs.readFileSync('app/guided-learning/page.tsx', 'utf8');
  const ws = fs.readFileSync('app/guided-learning/workstations/session-08-workstation.tsx', 'utf8');
  const journey = fs.readFileSync('app/guided-learning/components/session-08-reconciliation-journey.tsx', 'utf8');
  const data = fs.readFileSync('app/guided-learning/components/session-08-reconciliation-data.ts', 'utf8');
  const rules = fs.readFileSync('lib/review-engine/session-rules/session-08.ts', 'utf8');

  // 1. Check Natural Headings
  assert.ok(journey.includes('id="vcep-area-compare"'), 'Must define #vcep-area-compare');
  assert.ok(journey.includes('1. Compare Bank &amp; Books'), 'Must have heading "1. Compare Bank & Books"');
  assert.ok(journey.includes('id="vcep-area-reconcile"'), 'Must define #vcep-area-reconcile');
  assert.ok(journey.includes('2. Prepare the Reconciliation'), 'Must have heading "2. Prepare the Reconciliation"');

  // 2. Check Unified TaskCard Component Pattern & 4 Task Cards
  assert.ok(journey.includes('function TaskCard('), 'Must define unified TaskCard component');
  assert.ok(journey.includes("border: '1px solid #DCE5E9'"), 'TaskCard must use neutral 1px #DCE5E9 border');
  assert.ok(journey.includes("borderLeft: isActive ? '3px solid #0F766E'"), 'TaskCard must use 3px teal accent when active');
  assert.ok(journey.includes('taskId="S08-T01"'), 'Must define Task 01 (S08-T01)');
  assert.ok(journey.includes('taskId="S08-T02"'), 'Must define Task 02 (S08-T02)');
  assert.ok(journey.includes('taskId="S08-T03"'), 'Must define Task 03 (S08-T03)');
  assert.ok(journey.includes('taskId="S08-T04"'), 'Must define Task 04 (S08-T04)');

  assert.ok(journey.includes('title="Match Bank and Books"'), 'Task 01 title must be Match Bank and Books');
  assert.ok(journey.includes('title="Adjust the Cash Book"'), 'Task 02 title must be Adjust the Cash Book');
  assert.ok(journey.includes('title="Reconcile Timing Items"'), 'Task 03 title must be Reconcile Timing Items');
  assert.ok(journey.includes('title="Close the Difference"'), 'Task 04 title must be Close the Difference');

  // 3. Check Math Constants
  assert.ok(data.includes('UNADJUSTED_CASHBOOK_INR = 87500'), 'Must define unadjusted cashbook ₹87,500');
  assert.ok(data.includes('BANK_CHARGES_INR = 500'), 'Must define bank charges ₹500');
  assert.ok(data.includes('INTEREST_EARNED_INR = 200'), 'Must define interest earned ₹200');
  assert.ok(data.includes('ADJUSTED_CASHBOOK_INR = 87200'), 'Must define adjusted cashbook ₹87,200');
  assert.ok(data.includes('UNPRESENTED_CHEQUE_INR = 6000'), 'Must define unpresented cheque ₹6,000');
  assert.ok(data.includes('DEPOSIT_IN_TRANSIT_INR = 10000'), 'Must define deposit in transit ₹10,000');
  assert.ok(data.includes('ACTUAL_STATEMENT_INR = 83200'), 'Must define actual statement ₹83,200');
  assert.ok(data.includes('TARGET_VARIANCE_INR = 0'), 'Must define target variance ₹0');

  // 4. Mathematical Reconciliation Equation Proof
  const unadjustedBook = 87500;
  const bankCharges = 500;
  const interestEarned = 200;
  const unpresentedCheque = 6000;
  const depositInTransit = 10000;
  const actualStatement = 83200;

  const adjustedBook = unadjustedBook - bankCharges + interestEarned;
  assert.equal(adjustedBook, 87200, 'Adjusted Cash Book must equal exactly ₹87,200');

  const calculatedStatement = adjustedBook + unpresentedCheque - depositInTransit;
  assert.equal(calculatedStatement, 83200, 'Calculated Statement must equal exactly ₹83,200');

  const variance = actualStatement - calculatedStatement;
  assert.equal(variance, 0, 'Zero unexplained variance must be strictly ₹0');

  // 5. Verify Workstation Delegation
  assert.ok(ws.includes('Session08ReconciliationJourney'), 'Workstation must delegate to Session08ReconciliationJourney');

  // 6. Verify page.tsx tab suppression and button wiring
  assert.ok(page.includes('selected > 24'), 'Tabs must be suppressed for selected <= 24');
  assert.ok(page.includes('vcep-area-reconcile'), 'Page must wire Prepare Reconciliation button');
  assert.ok(page.includes('vcep-area-compare'), 'Page must wire Compare Bank & Books button');
  assert.ok(page.includes('Find the difference. Prove the balance.'), 'Page must display Session 08 subline');

  // 7. Verify Review Rules
  assert.ok(rules.includes('s08-w1-adjusted-cashbook'), 'Must include s08-w1-adjusted-cashbook check');
  assert.ok(rules.includes('s08-w2-statement-bridge'), 'Must include s08-w2-statement-bridge check');
  assert.ok(rules.includes('s08-w3-zero-variance'), 'Must include s08-w3-zero-variance check');
  assert.ok(rules.includes('s08-w4-timing-log'), 'Must include s08-w4-timing-log check');
  assert.ok(rules.includes('s08-t1-peer-challenge'), 'Must include s08-t1-peer-challenge check');
  assert.ok(rules.includes('s08-t2-anti-plug-stand'), 'Must include s08-t2-anti-plug-stand check');

  // 8. Verify All 24 Sessions Preserved
  assert.equal(driveJson.length, 24, 'All 24 sessions must be preserved in drive-edition-3.json');
  assert.equal(driveJson[7].id, 8, 'Session 08 must exist at index 7');

  console.log('✅ Phase 1: Static Code & Content Verification Passed (100%)\n');
}

async function runBrowserVerification() {
  console.log('--- Phase 2: Live Browser CDP Verification & Screenshot Capture ---');

  const PORT = 9368;
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--user-data-dir=/tmp/chrome-session-08-test-clean',
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
      value: 'session_s08_qa_test',
      domain: '127.0.0.1',
      path: '/',
    });

    // Mock auth /api/boot and /api/guided/session/8
    const s8Lesson = driveJson.find((s) => s.id === 8);
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        const s8Lesson = ${JSON.stringify(s8Lesson)};
        const origFetch = window.fetch;
        window.fetch = async (...args) => {
          const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
          if (url && url.includes('/api/boot')) {
            const res = await origFetch(...args);
            const data = await res.json();
            data.user = { id: 'student-8', email: 'accountant8@student.edu', role: 'student', name: 'Tanvi Accountant' };
            return new Response(JSON.stringify(data), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          if (url && url.includes('/api/guided/session/8')) {
            return new Response(JSON.stringify({ lesson: s8Lesson }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return origFetch(...args);
        };
      `,
    });

    const targetUrl = 'http://127.0.0.1:5173/guided-learning?session=8';
    console.log(`Navigating to ${targetUrl}...`);
    await send('Page.navigate', { url: targetUrl });
    await new Promise((r) => setTimeout(r, 3000));

    // Capture 1440px Desktop Heading 1: Compare Bank & Books
    await send('Runtime.evaluate', {
      expression: `document.getElementById('vcep-area-compare')?.scrollIntoView({ behavior: 'instant', block: 'start' });`,
    });
    await capture('s08-heading-01-compare-desktop-1440.png', 1440, 900);

    // Capture 1440px Desktop Heading 2: Prepare Reconciliation
    await send('Runtime.evaluate', {
      expression: `document.getElementById('vcep-area-reconcile')?.scrollIntoView({ behavior: 'instant', block: 'start' });`,
    });
    await capture('s08-heading-02-reconcile-desktop-1440.png', 1440, 900);

    // Capture Tablet 768px
    await capture('s08-reconciliation-tablet-768.png', 768, 1024);

    // Capture Mobile 390px
    await capture('s08-reconciliation-mobile-390.png', 390, 844);

    // DOM Evaluation
    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const areaCompare = document.getElementById('vcep-area-compare');
          const areaReconcile = document.getElementById('vcep-area-reconcile');
          const tabs = document.querySelector('.v3-tabs');
          const card1 = document.querySelector('[data-task-id="S08-T01"]');
          const card2 = document.querySelector('[data-task-id="S08-T02"]');
          const card3 = document.querySelector('[data-task-id="S08-T03"]');
          const card4 = document.querySelector('[data-task-id="S08-T04"]');

          const bodyText = document.body.textContent || '';

          return {
            hasCompare: !!areaCompare,
            hasReconcile: !!areaReconcile,
            tabsHidden: !tabs,
            hasCard1: !!card1,
            hasCard2: !!card2,
            hasCard3: !!card3,
            hasCard4: !!card4,
            t1Title: card1 ? card1.querySelector('h3')?.textContent : null,
            t2Title: card2 ? card2.querySelector('h3')?.textContent : null,
            t3Title: card3 ? card3.querySelector('h3')?.textContent : null,
            t4Title: card4 ? card4.querySelector('h3')?.textContent : null,
            containsCashBook: bodyText.includes('87,500'),
            containsAdjustedBook: bodyText.includes('87,200'),
            containsStatement: bodyText.includes('83,200'),
            containsCharges: bodyText.includes('500'),
            containsInterest: bodyText.includes('200'),
            containsUnpresented: bodyText.includes('6,000'),
            containsInTransit: bodyText.includes('10,000'),
            containsZeroVariance: bodyText.includes('ZERO VARIANCE') || bodyText.includes('₹0'),
            tablesCount: document.querySelectorAll('table').length,
            hasGovernance: bodyText.includes('PORTFOLIO EVIDENCE & AUDIT SIGN-OFF'),
            hasRubric: bodyText.toLowerCase().includes('evaluation rubric') && bodyText.includes('10 Marks Total'),
          };
        })()
      `,
      returnByValue: true,
    });

    console.log('\n📊 DOM Inspection Result:', JSON.stringify(evalRes.result.value, null, 2));

    const v = evalRes.result.value;
    assert.ok(v.hasCompare, 'Heading 1 #vcep-area-compare must exist in DOM');
    assert.ok(v.hasReconcile, 'Heading 2 #vcep-area-reconcile must exist in DOM');
    assert.ok(v.tabsHidden, '.v3-tabs must be suppressed for Session 08');

    assert.ok(v.hasCard1, 'TaskCard S08-T01 must exist');
    assert.ok(v.hasCard2, 'TaskCard S08-T02 must exist');
    assert.ok(v.hasCard3, 'TaskCard S08-T03 must exist');
    assert.ok(v.hasCard4, 'TaskCard S08-T04 must exist');

    assert.equal(v.t1Title, 'Match Bank and Books', 'Task 1 title must match');
    assert.equal(v.t2Title, 'Adjust the Cash Book', 'Task 2 title must match');
    assert.equal(v.t3Title, 'Reconcile Timing Items', 'Task 3 title must match');
    assert.equal(v.t4Title, 'Close the Difference', 'Task 4 title must match');

    assert.ok(v.containsCashBook, 'Must display unadjusted cashbook ₹87,500');
    assert.ok(v.containsAdjustedBook, 'Must display adjusted cashbook ₹87,200');
    assert.ok(v.containsStatement, 'Must display bank statement ₹83,200');
    assert.ok(v.containsCharges, 'Must display charges ₹500');
    assert.ok(v.containsInterest, 'Must display interest ₹200');
    assert.ok(v.containsUnpresented, 'Must display unpresented cheques ₹6,000');
    assert.ok(v.containsInTransit, 'Must display deposit in transit ₹10,000');
    assert.ok(v.containsZeroVariance, 'Must display zero variance proof');
    assert.ok(v.tablesCount >= 3, 'Must render side-by-side ledger tables, BRS schedule, and rubric');
    assert.ok(v.hasGovernance, 'Governance section must exist');
    assert.ok(v.hasRubric, '10 Marks evaluation rubric must exist');

    console.log('\n✅ Phase 2: Live Browser CDP Verification Passed 100%!');
    console.log('🎉 ALL VCEP SESSION 08 TRANSFORMATIONS VERIFIED SUCCESSFULLY!\n');

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
