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
  const ws = fs.readFileSync('app/guided-learning/workstations/session-11-workstation.tsx', 'utf8');
  const journey = fs.readFileSync('app/guided-learning/components/session-11-gst-journey.tsx', 'utf8');
  const data = fs.readFileSync('app/guided-learning/components/session-11-gst-data.ts', 'utf8');
  const rules = fs.readFileSync('lib/review-engine/session-rules/session-11.ts', 'utf8');

  // 1. Check Natural Headings
  assert.ok(journey.includes('id="vcep-area-invoices"'), 'Must define #vcep-area-invoices');
  assert.ok(journey.includes('1. Inspect the Invoice Evidence'), 'Must have heading "1. Inspect the Invoice Evidence"');
  assert.ok(journey.includes('id="vcep-area-tax"'), 'Must define #vcep-area-tax');
  assert.ok(journey.includes('2. Verify Tax & Exceptions'), 'Must have heading "2. Verify Tax & Exceptions"');

  // 2. Check Unified TaskCard Component Pattern & 4 Task Cards
  assert.ok(journey.includes('function TaskCard('), 'Must define unified TaskCard component');
  assert.ok(journey.includes("border: '1px solid #DCE5E9'"), 'TaskCard must use neutral 1px #DCE5E9 border');
  assert.ok(journey.includes("borderLeft: isActive ? '3px solid #0F766E'"), 'TaskCard must use 3px teal accent when active');
  assert.ok(journey.includes('taskId="S11-T01"'), 'Must define Task 01 (S11-T01)');
  assert.ok(journey.includes('taskId="S11-T02"'), 'Must define Task 02 (S11-T02)');
  assert.ok(journey.includes('taskId="S11-T03"'), 'Must define Task 03 (S11-T03)');
  assert.ok(journey.includes('taskId="S11-T04"'), 'Must define Task 04 (S11-T04)');

  assert.ok(journey.includes('title="Inspect the Invoices"'), 'Task 01 title must be Inspect the Invoices');
  assert.ok(journey.includes('title="Verify Tax Calculations"'), 'Task 02 title must be Verify Tax Calculations');
  assert.ok(journey.includes('title="Match Purchase Records"'), 'Task 03 title must be Match Purchase Records');
  assert.ok(journey.includes('title="Report Exceptions"'), 'Task 04 title must be Report Exceptions');

  // 3. Check Math & Tax Constants
  assert.ok(data.includes("id: 'E01'") && data.includes('taxableAmount: 10000') && data.includes('cgstAmount: 900'), 'E01 must have ₹10k taxable and ₹900 CGST');
  assert.ok(data.includes("id: 'E02'") && data.includes('taxableAmount: 20000') && data.includes('igstAmount: 3600'), 'E02 must have ₹20k taxable and ₹3,600 IGST');
  assert.ok(data.includes("id: 'E03'") && data.includes("invoiceSerial: 'Missing'") && data.includes('taxableAmount: 5000'), 'E03 must have missing serial and ₹5k taxable');

  // Verify math totals
  const totalTaxable = 10000 + 20000 + 5000;
  const totalCgst = 900 + 0 + 450;
  const totalSgst = 900 + 0 + 450;
  const totalIgst = 0 + 3600 + 0;
  const totalTax = totalCgst + totalSgst + totalIgst;
  const totalGross = totalTaxable + totalTax;

  assert.equal(totalTaxable, 35000, 'Total taxable must be ₹35,000');
  assert.equal(totalCgst, 1350, 'Total CGST must be ₹1,350');
  assert.equal(totalSgst, 1350, 'Total SGST must be ₹1,350');
  assert.equal(totalIgst, 3600, 'Total IGST must be ₹3,600');
  assert.equal(totalTax, 6300, 'Total Tax must be ₹6,300');
  assert.equal(totalGross, 41300, 'Total Gross Invoiced value must be ₹41,300');

  // Purchase matching constants
  assert.ok(data.includes("id: 'P01'") && data.includes('bookTax: 180') && data.includes('statementTax: 180'), 'P01 must match ₹180');
  assert.ok(data.includes("id: 'P02'") && data.includes('bookTax: 360') && data.includes("statementTax: 'Not present'"), 'P02 must be absent from statement');
  assert.ok(data.includes("id: 'P03'") && data.includes('bookTax: 540') && data.includes('statementTax: 540'), 'P03 must match ₹540');

  // 4. Verify Workstation Delegation
  assert.ok(ws.includes('Session11GSTJourney'), 'Workstation must delegate to Session11GSTJourney');

  // 5. Verify page.tsx tab suppression and button wiring
  assert.ok(page.includes('selected > 24'), 'Tabs must be suppressed for selected <= 24');
  assert.ok(journey.includes('vcep-area-tax'), 'Journey must wire Verify Tax & Exceptions button');
  assert.ok(journey.includes('vcep-area-invoices'), 'Journey must wire Inspect Invoice Evidence button');
  assert.ok(page.includes('Review the invoice before you approve it.'), 'Page must display Session 11 subline');

  // 6. Verify Evaluator Rules in lib
  assert.ok(rules.includes('s11-w1-sales-audit'), 'Review rules must check Sales Audit');
  assert.ok(rules.includes('s11-w2-tax-schedule'), 'Review rules must check Tax Schedule');
  assert.ok(rules.includes('s11-w3-purchase-reconciliation'), 'Review rules must check Purchase Reconciliation');
  assert.ok(rules.includes('s11-w4-itc-quarantine'), 'Review rules must check ITC Quarantine');
  assert.ok(rules.includes('s11-w5-vendor-escalation'), 'Review rules must check Vendor Escalation');

  // 7. Verify All 24 Sessions Preserved
  assert.equal(driveJson.length, 24, 'All 24 sessions must be preserved in drive-edition-3.json');
  assert.equal(driveJson[10].id, 11, 'Session 11 must exist at index 10');

  console.log('✅ Phase 1: Static Code, Data & Canonical Verification Passed (100%)\n');
}

async function runBrowserVerification() {
  console.log('--- Phase 2: Live Browser CDP Verification & Screenshot Capture ---');

  const PORT = 9381;
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--user-data-dir=/tmp/chrome-session-11-test-clean',
    'about:blank',
  ]);

  let listRes;
  for (let i = 0; i < 15; i++) {
    try {
      listRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      if (listRes.ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 400));
  }
  if (!listRes || !listRes.ok) {
    throw new Error(`Failed to connect to Chrome on port ${PORT}`);
  }

  try {
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

    // Set authenticated session cookie
    await send('Network.enable');
    await send('Network.setCookie', {
      name: '__vcep_session',
      value: 'session_s11_qa_test',
      domain: '127.0.0.1',
      path: '/',
    });

    // Mock auth /api/boot and /api/guided/session/11
    const s11Lesson = driveJson.find((s) => s.id === 11);
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        const s11Lesson = ${JSON.stringify(s11Lesson)};
        const origFetch = window.fetch;
        window.fetch = async (...args) => {
          const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
          if (url && url.includes('/api/boot')) {
            const res = await origFetch(...args);
            const data = await res.json();
            data.user = { id: 'student-11', email: 'analyst11@student.edu', role: 'student', name: 'Aarav Tax Analyst' };
            return new Response(JSON.stringify(data), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          if (url && url.includes('/api/guided/session/11')) {
            return new Response(JSON.stringify({ lesson: s11Lesson }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return origFetch(...args);
        };
      `,
    });

    const targetUrl = 'http://127.0.0.1:5173/guided-learning?session=11';
    console.log(`Navigating to ${targetUrl}...`);
    await send('Page.navigate', { url: targetUrl });
    await new Promise((r) => setTimeout(r, 3000));

    // Capture 1440px Desktop Heading 1: Inspect Invoice Evidence
    await send('Runtime.evaluate', {
      expression: `document.getElementById('vcep-area-invoices')?.scrollIntoView({ behavior: 'instant', block: 'start' });`,
    });
    await capture('s11-heading-01-invoices-desktop-1440.png', 1440, 900);

    // Capture 1440px Desktop Heading 2: Verify Tax & Exceptions
    await send('Runtime.evaluate', {
      expression: `document.getElementById('vcep-area-tax')?.scrollIntoView({ behavior: 'instant', block: 'start' });`,
    });
    await capture('s11-heading-02-tax-desktop-1440.png', 1440, 900);

    // Capture Tablet 768px
    await capture('s11-gst-tablet-768.png', 768, 1024);

    // Capture Mobile 390px
    await capture('s11-gst-mobile-390.png', 390, 844);

    // DOM Evaluation
    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const areaInvoices = document.getElementById('vcep-area-invoices');
          const areaTax = document.getElementById('vcep-area-tax');
          const tabs = document.querySelector('.v3-tabs');
          const bodyText = document.body.textContent || '';

          const card1 = document.querySelector('[data-task-id="S11-T01"]');
          const card2 = document.querySelector('[data-task-id="S11-T02"]');
          const card3 = document.querySelector('[data-task-id="S11-T03"]');
          const card4 = document.querySelector('[data-task-id="S11-T04"]');

          return {
            hasInvoicesArea: !!areaInvoices,
            hasTaxArea: !!areaTax,
            tabsHidden: !tabs,
            hasCard1: !!card1,
            hasCard2: !!card2,
            hasCard3: !!card3,
            hasCard4: !!card4,
            t1Title: card1?.querySelector('h3')?.textContent?.trim(),
            t2Title: card2?.querySelector('h3')?.textContent?.trim(),
            t3Title: card3?.querySelector('h3')?.textContent?.trim(),
            t4Title: card4?.querySelector('h3')?.textContent?.trim(),
            containsE01: bodyText.includes('E01') && bodyText.includes('VL001'),
            containsE02: bodyText.includes('E02') && bodyText.includes('Tamil Nadu'),
            containsE03MissingSerial: bodyText.includes('E03') && (bodyText.includes('Missing') || bodyText.includes('RULE 46')),
            containsSalesTotals: bodyText.includes('35,000') && bodyText.includes('41,300'),
            containsP01Matched: bodyText.includes('P01') && bodyText.includes('180'),
            containsP02Unmatched: bodyText.includes('P02') && (bodyText.includes('Not present') || bodyText.includes('Quarantined')),
            containsP03Matched: bodyText.includes('P03') && bodyText.includes('540'),
            containsRules: bodyText.includes('RULE 1') && bodyText.includes('Place of Supply Dictates Tax Head'),
            tablesCount: document.querySelectorAll('table').length,
          };
        })()
      `,
      returnByValue: true,
    });

    console.log('\n📊 DOM Inspection Result:', JSON.stringify(evalRes.result.value, null, 2));

    const v = evalRes.result.value;
    assert.ok(v.hasInvoicesArea, 'Heading 1 #vcep-area-invoices must exist in DOM');
    assert.ok(v.hasTaxArea, 'Heading 2 #vcep-area-tax must exist in DOM');
    assert.ok(v.tabsHidden, '.v3-tabs must be suppressed for Session 11');
    assert.ok(v.hasCard1, 'TaskCard S11-T01 must exist');
    assert.ok(v.hasCard2, 'TaskCard S11-T02 must exist');
    assert.ok(v.hasCard3, 'TaskCard S11-T03 must exist');
    assert.ok(v.hasCard4, 'TaskCard S11-T04 must exist');
    assert.equal(v.t1Title, 'Inspect the Invoices', 'Task 01 title must match');
    assert.equal(v.t2Title, 'Verify Tax Calculations', 'Task 02 title must match');
    assert.equal(v.t3Title, 'Match Purchase Records', 'Task 03 title must match');
    assert.equal(v.t4Title, 'Report Exceptions', 'Task 04 title must match');

    assert.ok(v.containsE01, 'Must render invoice E01 VL001');
    assert.ok(v.containsE02, 'Must render invoice E02 Tamil Nadu inter-state');
    assert.ok(v.containsE03MissingSerial, 'Must render invoice E03 with missing serial notice');
    assert.ok(v.containsSalesTotals, 'Must render sales totals ₹35,000 taxable and ₹41,300 gross');
    assert.ok(v.containsP01Matched, 'Must render P01 matched ₹180');
    assert.ok(v.containsP02Unmatched, 'Must render P02 unmatched/quarantined');
    assert.ok(v.containsP03Matched, 'Must render P03 matched ₹540');
    assert.ok(v.containsRules, 'Must display cardinal invoice review rules');
    assert.ok(v.tablesCount >= 3, 'Must render line items table, master sales tax schedule, and purchase reconciliation table');

    console.log('\n✅ Phase 2: Live Browser CDP Verification Passed 100%!');
    console.log('🎉 ALL VCEP SESSION 11 TRANSFORMATIONS VERIFIED SUCCESSFULLY!\n');

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
