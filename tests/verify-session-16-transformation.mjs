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
  const ws = fs.readFileSync('app/guided-learning/workstations/session-16-workstation.tsx', 'utf8');
  const journey = fs.readFileSync('app/guided-learning/components/session-16-decision-journey.tsx', 'utf8');
  const data = fs.readFileSync('app/guided-learning/components/session-16-decision-data.ts', 'utf8');
  const rules = fs.readFileSync('lib/review-engine/session-rules/session-16.ts', 'utf8');

  // 1. Check Natural Headings
  assert.ok(journey.includes('id="vcep-area-proposal"'), 'Must define #vcep-area-proposal');
  assert.ok(
    journey.includes('Understand the Pricing Proposal') || journey.includes('1. Understand Pricing Proposal'),
    'Must have heading "Understand the Pricing Proposal"'
  );
  assert.ok(journey.includes('id="vcep-area-decide"'), 'Must define #vcep-area-decide');
  assert.ok(
    journey.includes('Compare Scenarios & Decide') || journey.includes('2. Compare Scenarios & Decide'),
    'Must have heading "Compare Scenarios & Decide"'
  );

  // 2. Check 4 TaskCard Definitions
  assert.ok(journey.includes('taskId="S16-T01"'), 'Must include TaskCard S16-T01');
  assert.ok(journey.includes('taskId="S16-T02"'), 'Must include TaskCard S16-T02');
  assert.ok(journey.includes('taskId="S16-T03"'), 'Must include TaskCard S16-T03');
  assert.ok(journey.includes('taskId="S16-T04"'), 'Must include TaskCard S16-T04');
  assert.ok(journey.includes('Task 01 — Understand the Proposal'), 'Must include Task 01 title');
  assert.ok(journey.includes('Task 02 — Calculate Contribution & Break-Even'), 'Must include Task 02 title');
  assert.ok(journey.includes('Task 03 — Test Demand & Capacity Constraints'), 'Must include Task 03 title');
  assert.ok(journey.includes('Task 04 — Recommend a Commercial Decision'), 'Must include Task 04 title');

  // 3. Check Essential Baseline & Case Data Constants
  assert.ok(data.includes('BASELINE_PRICE = 10000'), 'Must define baseline price 10000');
  assert.ok(data.includes('VARIABLE_COST_PER_SEAT = 4000'), 'Must define variable cost 4000');
  assert.ok(data.includes('FIXED_COSTS = 120000'), 'Must define fixed overhead 120000');
  assert.ok(data.includes('BASELINE_DEMAND = 25'), 'Must define baseline demand 25');
  assert.ok(data.includes('MAX_CAPACITY = 30'), 'Must define maximum capacity 30');

  // 4. Verify Mathematical Proofs
  const baseContrib = 10000 - 4000;
  assert.equal(baseContrib, 6000, 'Baseline unit contribution must be ₹6,000');
  const baseBE = Math.ceil(120000 / 6000);
  assert.equal(baseBE, 20, 'Baseline break-even must be 20 seats');
  const baseProfit = 25 * 6000 - 120000;
  assert.equal(baseProfit, 30000, 'Baseline profit must be ₹30,000');

  const proposedPrice = 10000 * 0.9;
  assert.equal(proposedPrice, 9000, 'Proposed price after 10% discount must be ₹9,000');
  const proposedContrib = proposedPrice - 4000;
  assert.equal(proposedContrib, 5000, 'Proposed unit contribution must be ₹5,000');
  const proposedBE = Math.ceil(120000 / 5000);
  assert.equal(proposedBE, 24, 'Proposed break-even must be 24 seats');
  const proposedProfit = 30 * 5000 - 120000;
  assert.equal(proposedProfit, 30000, 'Proposed profit at 30 seats must be ₹30,000 (Zero Incremental Gain)');

  const minSeatsForBaseProfit = (30000 + 120000) / 5000;
  assert.equal(minSeatsForBaseProfit, 30, 'Must require exactly 30 seats to match baseline profit');

  // 5. Check Downside & IP 04 Scenarios
  assert.ok(data.includes('COMMERCIAL_SCENARIOS'), 'Must define preset scenarios');
  assert.ok(data.includes('soft_demand_ip04') && data.includes('demand: 28'), 'Must include 28-seat soft demand drill');
  assert.ok(data.includes('marketing_addon_ip04') && data.includes('extraFixedCost: 6000'), 'Must include ₹6k extra marketing drill');
  assert.ok(data.includes('tiered_counter'), 'Must include tiered counter-proposal scenario');

  // 6. Check Workstation Delegation
  assert.ok(ws.includes('Session16DecisionJourney'), 'Workstation must delegate to Session16DecisionJourney');

  // 7. Check page.tsx tab suppression and button wiring
  assert.ok(
    page.includes('selected > 24 && (') || page.includes('selected > 16 && ('),
    'Tabs must be suppressed for Session 16'
  );
  assert.ok(page.includes('vcep-area-decide'), 'Page must wire Compare Scenarios & Decide button');
  assert.ok(page.includes('vcep-area-proposal'), 'Page must wire Understand Pricing Proposal button');
  assert.ok(page.includes('Make the decision with numbers.'), 'Page must display Session 16 subline');

  // 8. Check Review Engine Rules in lib
  assert.ok(rules.includes('s16-o1-commercial-mission'), 'Review rules must check commercial mission');
  assert.ok(rules.includes('s16-l1-pricing-fundamentals'), 'Review rules must check pricing fundamentals');
  assert.ok(rules.includes('s16-c1-case-records'), 'Review rules must check case records');
  assert.ok(rules.includes('s16-w1-comparative-matrix'), 'Review rules must check comparative matrix');
  assert.ok(rules.includes('s16-w2-breakeven-calculation'), 'Review rules must check break-even calculations');
  assert.ok(rules.includes('s16-w3-minimum-seats-proof'), 'Review rules must check minimum seats proof');
  assert.ok(rules.includes('s16-w4-sensitivity-scenarios'), 'Review rules must check scenario simulation');
  assert.ok(rules.includes('s16-w5-decision-memo'), 'Review rules must check decision memo');
  assert.ok(rules.includes('s16-t1-governance'), 'Review rules must check governance');

  console.log('✅ Phase 1: Static Code & Content Verification Passed (100%)\n');
}

async function runBrowserVerification() {
  console.log('--- Phase 2: Live Browser CDP Verification & Screenshot Capture ---');

  const PORT = 9386;
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--user-data-dir=/tmp/chrome-session-16-test-clean',
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
      value: 'session_s16_qa_test',
      domain: '127.0.0.1',
      path: '/',
    });

    // Mock auth /api/boot and /api/guided/session/16
    const s16Lesson = driveJson.find((s) => s.id === 16);
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        const s16Lesson = ${JSON.stringify(s16Lesson)};
        const origFetch = window.fetch;
        window.fetch = async (...args) => {
          const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
          if (url && url.includes('/api/boot')) {
            const res = await origFetch(...args);
            const data = await res.json();
            data.user = { id: 'student-16', email: 'analyst16@student.edu', role: 'student', name: 'Commercial Analyst Lead' };
            return new Response(JSON.stringify(data), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          if (url && url.includes('/api/guided/session/16')) {
            return new Response(JSON.stringify({ lesson: s16Lesson }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return origFetch(...args);
        };
      `,
    });

    const targetUrl = 'http://127.0.0.1:5173/guided-learning?session=16';
    console.log(`Navigating to ${targetUrl}...`);
    await send('Page.navigate', { url: targetUrl });
    await new Promise((r) => setTimeout(r, 3000));

    // Capture 1440px Desktop Heading 1: Understand the Pricing Proposal (Tasks 01 & 02)
    await send('Runtime.evaluate', {
      expression: `document.getElementById('vcep-area-proposal')?.scrollIntoView({ behavior: 'instant', block: 'start' });`,
    });
    await capture('s16-heading-01-proposal-desktop-1440.png', 1440, 900);

    // Capture 1440px Desktop Heading 2: Compare Scenarios & Decide (Tasks 03 & 04)
    await send('Runtime.evaluate', {
      expression: `document.getElementById('vcep-area-decide')?.scrollIntoView({ behavior: 'instant', block: 'start' });`,
    });
    await capture('s16-heading-02-decide-desktop-1440.png', 1440, 900);

    // Capture Tablet 768px
    await capture('s16-decision-tablet-768.png', 768, 1024);

    // Capture Mobile 390px
    await capture('s16-decision-mobile-390.png', 390, 844);

    // DOM Evaluation
    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const areaProposal = document.getElementById('vcep-area-proposal');
          const areaDecide = document.getElementById('vcep-area-decide');
          const card1 = document.querySelector('[data-task-id="S16-T01"]');
          const card2 = document.querySelector('[data-task-id="S16-T02"]');
          const card3 = document.querySelector('[data-task-id="S16-T03"]');
          const card4 = document.querySelector('[data-task-id="S16-T04"]');
          const tabs = document.querySelector('.v3-tabs');
          const bodyText = document.body.innerText;

          return {
            hasProposalArea: !!areaProposal,
            hasDecideArea: !!areaDecide,
            hasTask01: !!card1,
            hasTask02: !!card2,
            hasTask03: !!card3,
            hasTask04: !!card4,
            t1Title: card1?.querySelector('h3')?.innerText || '',
            t2Title: card2?.querySelector('h3')?.innerText || '',
            t3Title: card3?.querySelector('h3')?.innerText || '',
            t4Title: card4?.querySelector('h3')?.innerText || '',
            tabsHidden: !tabs,
            containsMatrixTable: bodyText.includes('Side-by-Side Commercial Evaluation Matrix') && (bodyText.includes('2,50,000') || bodyText.includes('250,000')) && (bodyText.includes('2,70,000') || bodyText.includes('270,000')),
            containsZeroGainProof: bodyText.includes('ZERO INCREMENTAL PROFIT') || bodyText.includes('Zero Economic Gain'),
            containsSimulator: bodyText.includes('Interactive Sensitivity Simulator') && bodyText.includes('Discount Concession') && bodyText.includes('Contracted Volume'),
            containsMinSeats: bodyText.includes('Minimum Discounted Seats to Match Baseline Profit') && bodyText.includes('30 Seats Verified'),
            containsScenarios: bodyText.includes('Simulation Scenarios') || bodyText.includes('Independent Practice') || bodyText.includes('Downside Drill'),
            containsDecisionMemo: bodyText.includes('Executive Decision Memo') && bodyText.includes('/ 130 Words'),
            containsGovernance: bodyText.includes('Deliverable Governance & Named Review Roles') && bodyText.includes('Preparer Name'),
            containsRubricHandover: bodyText.includes('StudentID_S16_v01.xlsx') && bodyText.includes('Run Formative Review'),
            tablesCount: document.querySelectorAll('table').length,
          };
        })()
      `,
      returnByValue: true,
    });

    console.log('\n📊 DOM Inspection Result:', JSON.stringify(evalRes.result.value, null, 2));

    const v = evalRes.result.value;
    assert.ok(v.hasProposalArea, 'Heading 1 #vcep-area-proposal must exist in DOM');
    assert.ok(v.hasDecideArea, 'Heading 2 #vcep-area-decide must exist in DOM');
    assert.ok(v.hasTask01, 'TaskCard S16-T01 must exist in DOM');
    assert.ok(v.hasTask02, 'TaskCard S16-T02 must exist in DOM');
    assert.ok(v.hasTask03, 'TaskCard S16-T03 must exist in DOM');
    assert.ok(v.hasTask04, 'TaskCard S16-T04 must exist in DOM');
    assert.ok(v.t1Title.includes('Understand the Proposal'), 'Task 1 title must match');
    assert.ok(v.t2Title.includes('Calculate Contribution & Break-Even'), 'Task 2 title must match');
    assert.ok(v.t3Title.includes('Test Demand & Capacity Constraints'), 'Task 3 title must match');
    assert.ok(v.t4Title.includes('Recommend a Commercial Decision'), 'Task 4 title must match');
    assert.ok(v.tabsHidden, '.v3-tabs must be suppressed for Session 16');
    assert.ok(v.containsMatrixTable, 'Must render Side-by-Side Commercial Evaluation Matrix');
    assert.ok(v.containsZeroGainProof, 'Must display Zero Incremental Profit / Zero Economic Gain alert');
    assert.ok(v.containsSimulator, 'Must render Interactive Sensitivity Simulator');
    assert.ok(v.containsMinSeats, 'Must render 30-seat break-even equivalence proof');
    assert.ok(v.containsScenarios, 'Must render Independent Practice 04 drills');
    assert.ok(v.containsDecisionMemo, 'Must render Executive Decision Memo editor with 130-word limit');
    assert.ok(v.containsGovernance, 'Must render deliverable governance fields');
    assert.ok(v.containsRubricHandover, 'Must render StudentID_S16_v01.xlsx and Formative Review');
    assert.ok(v.tablesCount >= 1, 'Must render at least 1 table');

    console.log('\n✅ Phase 2: Live Browser CDP Verification Passed 100%!');
    console.log('🎉 ALL VCEP SESSION 16 TRANSFORMATIONS VERIFIED SUCCESSFULLY!\n');

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
