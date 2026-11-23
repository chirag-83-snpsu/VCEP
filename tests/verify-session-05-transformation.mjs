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

  const s05Data = fs.readFileSync('app/guided-learning/components/session-05-accounting-data.ts', 'utf8');
  const s05Comp = fs.readFileSync('app/guided-learning/components/session-05-accounting-journey.tsx', 'utf8');
  const pageTsx = fs.readFileSync('app/guided-learning/page.tsx', 'utf8');
  const s05Rules = fs.readFileSync('lib/review-engine/session-rules/session-05.ts', 'utf8');

  // 1. Verify Opening Balances & Target Journal Sum
  assert.ok(s05Data.includes('OPENING_BANK_DEBIT = 100000'), 'Must define OPENING_BANK_DEBIT = 100000');
  assert.ok(s05Data.includes('OPENING_CAPITAL_CREDIT = 100000'), 'Must define OPENING_CAPITAL_CREDIT = 100000');
  assert.ok(s05Data.includes('TARGET_JOURNAL_TOTAL = 208500'), 'Must define TARGET_JOURNAL_TOTAL = 208500');

  // 2. Verify 12 Case A Vouchers (A01 - A12)
  for (let i = 1; i <= 12; i++) {
    const docId = `A${String(i).padStart(2, '0')}`;
    assert.ok(s05Data.includes(`docId: '${docId}'`), `Must include Case A voucher ${docId}`);
  }

  // 3. Verify Two Natural Headings in Component
  assert.ok(s05Comp.includes('id="vcep-area-transactions"'), 'Must have Heading 1: Read the Source Transactions');
  assert.ok(s05Comp.includes('id="vcep-area-journal"'), 'Must have Heading 2: Prepare the Journal');

  // 4. Verify Unified TaskCard Component Pattern & 4 Task Cards
  assert.ok(s05Comp.includes('function TaskCard('), 'Must define unified TaskCard component');
  assert.ok(s05Comp.includes("border: '1px solid #DCE5E9'"), 'TaskCard must use neutral 1px #DCE5E9 border');
  assert.ok(s05Comp.includes("borderLeft: isActive ? '3px solid #0F766E'"), 'TaskCard must use 3px teal accent when active');
  assert.ok(s05Comp.includes('taskId="S05-T01"'), 'Must define Task 01 (S05-T01)');
  assert.ok(s05Comp.includes('taskId="S05-T02"'), 'Must define Task 02 (S05-T02)');
  assert.ok(s05Comp.includes('taskId="S05-T03"'), 'Must define Task 03 (S05-T03)');
  assert.ok(s05Comp.includes('taskId="S05-T04"'), 'Must define Task 04 (S05-T04)');

  assert.ok(s05Comp.includes('title="Review Source Records"'), 'Task 01 title must be Review Source Records');
  assert.ok(s05Comp.includes('title="Classify Transactions"'), 'Task 02 title must be Classify Transactions');
  assert.ok(s05Comp.includes('title="Record Journal Entries"'), 'Task 03 title must be Record Journal Entries');
  assert.ok(s05Comp.includes('title="Resolve Evidence Exceptions"'), 'Task 04 title must be Resolve Evidence Exceptions');

  // 5. Verify Accounting Traps Mentioned in UI
  assert.ok(s05Comp.includes('Trap 1: A05 Receivable Collection'), 'Must have A05 receivable collection trap');
  assert.ok(s05Comp.includes('Trap 2: A09 Customer Advance'), 'Must have A09 unearned advance liability trap');
  assert.ok(s05Comp.includes('Trap 3: A12 Equipment Purchase'), 'Must have A12 equipment capitalization trap');
  assert.ok(s05Comp.includes('Trap 4: A07 & A08 Accruals'), 'Must have A07/A08 accrual wages trap');

  // 6. Verify Page.tsx Wiring
  assert.ok(pageTsx.includes('Session05AccountingJourney'), 'Must import Session05AccountingJourney in page.tsx');
  assert.ok(pageTsx.includes('selected > 24'), 'Must hide v3-tabs for sessions 1-24');
  assert.ok(pageTsx.includes('Prepare the Journal →'), 'Must have top Prepare Journal action button');

  // 7. Verify Review Rules
  assert.ok(s05Rules.includes('s05-w1-register'), 'Must include s05-w1-register check');
  assert.ok(s05Rules.includes('s05-w2-balance'), 'Must include s05-w2-balance check');
  assert.ok(s05Rules.includes('s05-w3-advance-logic'), 'Must include s05-w3-advance-logic check');
  assert.ok(s05Rules.includes('s05-w4-receivable-logic'), 'Must include s05-w4-receivable-logic check');
  assert.ok(s05Rules.includes('s05-w5-equipment-logic'), 'Must include s05-w5-equipment-logic check');

  // 8. Verify All 24 Sessions Preserved
  assert.equal(driveJson[0].id, 1, 'Session 01 must be preserved');
  assert.equal(driveJson[1].id, 2, 'Session 02 must be preserved');
  assert.equal(driveJson[2].id, 3, 'Session 03 must be preserved');
  assert.equal(driveJson[3].id, 4, 'Session 04 must be preserved');
  assert.equal(driveJson[4].id, 5, 'Session 05 must be preserved');
  assert.equal(driveJson.length, 24, 'All 24 sessions must be preserved');

  console.log('✅ Static Verification Passed (100%)\n');
}

async function runBrowserVerification() {
  console.log('--- Phase 2: Live Browser CDP Verification & Screenshot Capture ---');

  const PORT = 9355;
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--user-data-dir=/tmp/chrome-session-05-test-clean',
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

      await new Promise((r) => setTimeout(r, 700));

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
      value: 'session_s05_qa_test',
      domain: '127.0.0.1',
      path: '/',
    });

    // Mock auth /api/boot and /api/guided/session/5
    const s5Lesson = driveJson[4];
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        const s5Lesson = ${JSON.stringify(s5Lesson)};
        const origFetch = window.fetch;
        window.fetch = async (...args) => {
          const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
          if (url && url.includes('/api/boot')) {
            const res = await origFetch(...args);
            const data = await res.json();
            data.user = { id: 'student-5', email: 'accountant5@student.edu', role: 'student', name: 'Rohan Accounts' };
            return new Response(JSON.stringify(data), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          if (url && url.includes('/api/guided/session/5')) {
            return new Response(JSON.stringify({ lesson: s5Lesson }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return origFetch(...args);
        };
      `,
    });

    // 1. Desktop 1440px Capture: Navigate to /guided-learning?session=5
    console.log('Navigating to /guided-learning?session=5...');
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/guided-learning?session=5' });
    await new Promise((r) => setTimeout(r, 3000));

    // Capture Desktop Heading 1 (Read Source Transactions) & Tasks 01 & 02
    await capture('s05-heading-01-transactions-desktop-1440.png', 1440, 900);

    // Scroll down to Heading 2 (Prepare the Journal) & Tasks 03 & 04
    await send('Runtime.evaluate', {
      expression: `
        const el = document.getElementById('vcep-area-journal');
        if (el) el.scrollIntoView({ behavior: 'instant' });
      `,
    });
    await new Promise((r) => setTimeout(r, 600));

    // Capture Desktop Heading 2 (Prepare Journal)
    await capture('s05-heading-02-journal-desktop-1440.png', 1440, 900);

    // 2. Tablet 768px Capture
    await send('Runtime.evaluate', {
      expression: `
        const el = document.getElementById('vcep-area-transactions');
        if (el) el.scrollIntoView({ behavior: 'instant' });
      `,
    });
    await capture('s05-accounting-tablet-768.png', 768, 1024);

    // 3. Mobile 390px Capture
    await capture('s05-accounting-mobile-390.png', 390, 844);

    // 4. Verify DOM Elements
    const domCheck = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const areaTrans = document.getElementById('vcep-area-transactions');
          const areaJournal = document.getElementById('vcep-area-journal');
          const v3Tabs = document.querySelector('.v3-tabs');
          const card1 = document.querySelector('[data-task-id="S05-T01"]');
          const card2 = document.querySelector('[data-task-id="S05-T02"]');
          const card3 = document.querySelector('[data-task-id="S05-T03"]');
          const card4 = document.querySelector('[data-task-id="S05-T04"]');

          const bodyText = document.body.textContent || '';
          const openingEq = bodyText.includes('Bank Dr ₹1,00,000 = Capital Cr ₹1,00,000');
          const targetBal = bodyText.includes('2,08,500');
          const voucherA01 = bodyText.includes('A01') && bodyText.includes('Apex Retail Distributors Ltd');
          const trapAdvance = bodyText.includes('Trap 2: A09 Customer Advance');
          const trapCap = bodyText.includes('Trap 3: A12 Equipment Purchase');
          const journalTable = !!document.querySelector('table');
          const selects = document.querySelectorAll('table select').length;
          const hasGovernance = bodyText.includes('Portfolio Governance & Audit Trail');
          const hasRubric = bodyText.toLowerCase().includes('assessment rubric') && bodyText.includes('10 Marks Total');

          return {
            hasAreaTransactions: !!areaTrans,
            hasAreaJournal: !!areaJournal,
            tabsHidden: !v3Tabs,
            hasCard1: !!card1,
            hasCard2: !!card2,
            hasCard3: !!card3,
            hasCard4: !!card4,
            t1Title: card1 ? card1.querySelector('h3')?.textContent : null,
            t2Title: card2 ? card2.querySelector('h3')?.textContent : null,
            t3Title: card3 ? card3.querySelector('h3')?.textContent : null,
            t4Title: card4 ? card4.querySelector('h3')?.textContent : null,
            hasOpeningEq: openingEq,
            hasTargetBal: targetBal,
            hasVoucherA01: voucherA01,
            hasTrapAdvance: trapAdvance,
            hasTrapCap: trapCap,
            hasJournalTable: journalTable,
            selectsCount: selects,
            hasGovernance: hasGovernance,
            hasRubric: hasRubric,
          };
        })()
      `,
      returnByValue: true,
    });

    console.log('📊 DOM Inspection Result:', domCheck.result.value);
    const r = domCheck.result.value;
    assert.ok(r.hasAreaTransactions, 'Heading 1 (Read Source Transactions) must exist');
    assert.ok(r.hasAreaJournal, 'Heading 2 (Prepare the Journal) must exist');
    assert.ok(r.tabsHidden, 'v3-tabs must be hidden for Session 05');
    assert.ok(r.hasCard1, 'TaskCard S05-T01 must exist');
    assert.ok(r.hasCard2, 'TaskCard S05-T02 must exist');
    assert.ok(r.hasCard3, 'TaskCard S05-T03 must exist');
    assert.ok(r.hasCard4, 'TaskCard S05-T04 must exist');
    assert.equal(r.t1Title, 'Review Source Records', 'Task 01 title must match');
    assert.equal(r.t2Title, 'Classify Transactions', 'Task 02 title must match');
    assert.equal(r.t3Title, 'Record Journal Entries', 'Task 03 title must match');
    assert.equal(r.t4Title, 'Resolve Evidence Exceptions', 'Task 04 title must match');
    assert.ok(r.hasOpeningEq, 'Opening balance equation (Bank Dr ₹100,000 = Capital Cr ₹100,000) must exist');
    assert.ok(r.hasTargetBal, 'Target balance ₹2,08,500 must exist');
    assert.ok(r.hasVoucherA01, 'Voucher A01 details must exist');
    assert.ok(r.hasTrapAdvance, 'A09 customer advance trap must exist');
    assert.ok(r.hasTrapCap, 'A12 equipment capitalization trap must exist');
    assert.ok(r.hasJournalTable, 'General journal table must exist');
    assert.ok(r.selectsCount >= 24, 'Must have account selector dropdowns for 12 rows (2 per row)');
    assert.ok(r.hasGovernance, 'Portfolio Governance section must exist');
    assert.ok(r.hasRubric, '10-Point Assessment rubric must exist');

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
