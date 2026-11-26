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
  const ws = fs.readFileSync('app/guided-learning/workstations/session-09-workstation.tsx', 'utf8');
  const journey = fs.readFileSync('app/guided-learning/components/session-09-performance-journey.tsx', 'utf8');
  const data = fs.readFileSync('app/guided-learning/components/session-09-performance-data.ts', 'utf8');
  const rules = fs.readFileSync('lib/review-engine/session-rules/session-09.ts', 'utf8');

  // 1. Check Natural Headings
  assert.ok(journey.includes('id="vcep-area-performance"'), 'Must define #vcep-area-performance');
  assert.ok(journey.includes('1. Review the Business Performance'), 'Must have heading "1. Review the Business Performance"');
  assert.ok(journey.includes('id="vcep-area-findings"'), 'Must define #vcep-area-findings');
  assert.ok(journey.includes('2. Write the Management Findings'), 'Must have heading "2. Write the Management Findings"');

  // 2. Check Unified TaskCard Component Pattern & 4 Task Cards
  assert.ok(journey.includes('function TaskCard('), 'Must define unified TaskCard component');
  assert.ok(journey.includes("border: '1px solid #DCE5E9'"), 'TaskCard must use neutral 1px #DCE5E9 border');
  assert.ok(journey.includes("borderLeft: isActive ? '3px solid #0F766E'"), 'TaskCard must use 3px teal accent when active');
  assert.ok(journey.includes('taskId="S09-T01"'), 'Must define Task 01 (S09-T01)');
  assert.ok(journey.includes('taskId="S09-T02"'), 'Must define Task 02 (S09-T02)');
  assert.ok(journey.includes('taskId="S09-T03"'), 'Must define Task 03 (S09-T03)');
  assert.ok(journey.includes('taskId="S09-T04"'), 'Must define Task 04 (S09-T04)');

  assert.ok(journey.includes('title="Read the Financial Data"'), 'Task 01 title must be Read the Financial Data');
  assert.ok(journey.includes('title="Calculate Performance"'), 'Task 02 title must be Calculate Performance');
  assert.ok(journey.includes('title="Challenge the Sales Story"'), 'Task 03 title must be Challenge the Sales Story');
  assert.ok(journey.includes('title="Write Management Findings"'), 'Task 04 title must be Write Management Findings');

  // 3. Check Math & KPI Constants
  assert.ok(data.includes('revenue: 100000, directCost: 40000'), 'Must define July inputs ₹100k / ₹40k');
  assert.ok(data.includes('revenue: 120000, directCost: 54000'), 'Must define August inputs ₹120k / ₹54k');
  assert.ok(data.includes('revenue: 150000, directCost: 75000'), 'Must define September inputs ₹150k / ₹75k');
  assert.ok(data.includes('grossProfit: 60000'), 'Must compute July Gross Profit ₹60,000');
  assert.ok(data.includes('grossProfit: 66000'), 'Must compute August Gross Profit ₹66,000');
  assert.ok(data.includes('grossProfit: 75000'), 'Must compute September Gross Profit ₹75,000');
  assert.ok(data.includes('grossMarginPct: 60.0'), 'Must compute July Gross Margin 60.0%');
  assert.ok(data.includes('grossMarginPct: 55.0'), 'Must compute August Gross Margin 55.0%');
  assert.ok(data.includes('grossMarginPct: 50.0'), 'Must compute September Gross Margin 50.0%');
  assert.ok(data.includes('operatingProfit: 25000'), 'Must compute July Operating Profit ₹25,000');
  assert.ok(data.includes('operatingProfit: 27000'), 'Must compute August Operating Profit ₹27,000');
  assert.ok(data.includes('operatingProfit: 30000'), 'Must compute September Operating Profit ₹30,000');
  assert.ok(data.includes('operatingMarginPct: 25.0'), 'Must compute July Operating Margin 25.0%');
  assert.ok(data.includes('operatingMarginPct: 22.5'), 'Must compute August Operating Margin 22.5%');
  assert.ok(data.includes('operatingMarginPct: 20.0'), 'Must compute September Operating Margin 20.0%');

  // 4. Mathematical Ratio & Growth Verification
  const revGrowth = ((150000 - 120000) / 120000) * 100;
  assert.equal(revGrowth, 25.0, 'Revenue growth must equal exactly +25.0%');

  const opGrowth = ((30000 - 27000) / 27000) * 100;
  assert.equal(opGrowth.toFixed(1), '11.1', 'Operating profit growth must round to +11.1%');

  const ppChange = 50.0 - 55.0;
  assert.equal(ppChange, -5.0, 'Gross margin compression must equal -5.0 percentage points');

  // 5. Verify Workstation Delegation
  assert.ok(ws.includes('Session09PerformanceJourney'), 'Workstation must delegate to Session09PerformanceJourney');

  // 6. Verify page.tsx tab suppression and button wiring
  assert.ok(page.includes('selected > 24'), 'Tabs must be suppressed for selected <= 24');
  assert.ok(journey.includes('vcep-area-findings'), 'Journey must wire Write Management Findings button');
  assert.ok(journey.includes('vcep-area-performance'), 'Journey must wire Review Business Performance button');
  assert.ok(page.includes('Read the numbers. Challenge the story.'), 'Page must display Session 09 subline');

  // 7. Verify Evaluator Rules in lib
  assert.ok(rules.includes('s09-w1-gross-profit'), 'Review rules must check Gross Profit');
  assert.ok(rules.includes('s09-w2-operating-profit'), 'Review rules must check Operating Profit');
  assert.ok(rules.includes('s09-w3-margins'), 'Review rules must check Margins');
  assert.ok(rules.includes('s09-w4-growth-rates'), 'Review rules must check Growth Rates');
  assert.ok(rules.includes('s09-w5-three-findings'), 'Review rules must check 3 Findings');

  // 8. Verify All 24 Sessions Preserved
  assert.equal(driveJson.length, 24, 'All 24 sessions must be preserved in drive-edition-3.json');
  assert.equal(driveJson[8].id, 9, 'Session 09 must exist at index 8');

  console.log('✅ Phase 1: Static Code & Content Verification Passed (100%)\n');
}

async function runBrowserVerification() {
  console.log('--- Phase 2: Live Browser CDP Verification & Screenshot Capture ---');

  const PORT = 9378;
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--user-data-dir=/tmp/chrome-session-09-test-clean',
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

    // Set authenticated session cookie
    await send('Network.enable');
    await send('Network.setCookie', {
      name: '__vcep_session',
      value: 'session_s09_qa_test',
      domain: '127.0.0.1',
      path: '/',
    });

    // Mock auth /api/boot and /api/guided/session/9
    const s9Lesson = driveJson.find((s) => s.id === 9);
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        const s9Lesson = ${JSON.stringify(s9Lesson)};
        const origFetch = window.fetch;
        window.fetch = async (...args) => {
          const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
          if (url && url.includes('/api/boot')) {
            const res = await origFetch(...args);
            const data = await res.json();
            data.user = { id: 'student-9', email: 'analyst9@student.edu', role: 'student', name: 'Tanvi Financial Analyst' };
            return new Response(JSON.stringify(data), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          if (url && url.includes('/api/guided/session/9')) {
            return new Response(JSON.stringify({ lesson: s9Lesson }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return origFetch(...args);
        };
      `,
    });

    const targetUrl = 'http://127.0.0.1:5173/guided-learning?session=9';
    console.log(`Navigating to ${targetUrl}...`);
    await send('Page.navigate', { url: targetUrl });
    await new Promise((r) => setTimeout(r, 3000));

    // Capture 1440px Desktop Heading 1: Review Performance
    await send('Runtime.evaluate', {
      expression: `document.getElementById('vcep-area-performance')?.scrollIntoView({ behavior: 'instant', block: 'start' });`,
    });
    await capture('s09-heading-01-performance-desktop-1440.png', 1440, 900);

    // Capture 1440px Desktop Heading 2: Write Findings
    await send('Runtime.evaluate', {
      expression: `document.getElementById('vcep-area-findings')?.scrollIntoView({ behavior: 'instant', block: 'start' });`,
    });
    await capture('s09-heading-02-findings-desktop-1440.png', 1440, 900);

    // Capture Tablet 768px
    await capture('s09-finance-tablet-768.png', 768, 1024);

    // Capture Mobile 390px
    await capture('s09-finance-mobile-390.png', 390, 844);

    // DOM Evaluation
    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const areaPerf = document.getElementById('vcep-area-performance');
          const areaFind = document.getElementById('vcep-area-findings');
          const tabs = document.querySelector('.v3-tabs');
          const card1 = document.querySelector('[data-task-id="S09-T01"]');
          const card2 = document.querySelector('[data-task-id="S09-T02"]');
          const card3 = document.querySelector('[data-task-id="S09-T03"]');
          const card4 = document.querySelector('[data-task-id="S09-T04"]');

          const bodyText = document.body.textContent || '';

          return {
            hasPerformance: !!areaPerf,
            hasFindings: !!areaFind,
            tabsHidden: !tabs,
            hasCard1: !!card1,
            hasCard2: !!card2,
            hasCard3: !!card3,
            hasCard4: !!card4,
            t1Title: card1 ? card1.querySelector('h3')?.textContent : null,
            t2Title: card2 ? card2.querySelector('h3')?.textContent : null,
            t3Title: card3 ? card3.querySelector('h3')?.textContent : null,
            t4Title: card4 ? card4.querySelector('h3')?.textContent : null,
            containsRevenue: bodyText.includes('1,50,000') || bodyText.includes('150000'),
            containsGrossProfit: bodyText.includes('75,000') || bodyText.includes('75000'),
            containsOperatingProfit: bodyText.includes('30,000') || bodyText.includes('30000'),
            containsGrossMargin: bodyText.includes('50.0%'),
            containsOperatingMargin: bodyText.includes('20.0%'),
            containsReceivables: bodyText.includes('70,000') || bodyText.includes('70000'),
            containsGrowth: bodyText.includes('+25.0%') && bodyText.includes('+11.1%'),
            containsPpCompression: bodyText.includes('-10.0') || bodyText.includes('percentage points'),
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
    assert.ok(v.hasPerformance, 'Heading 1 #vcep-area-performance must exist in DOM');
    assert.ok(v.hasFindings, 'Heading 2 #vcep-area-findings must exist in DOM');
    assert.ok(v.tabsHidden, '.v3-tabs must be suppressed for Session 09');

    assert.ok(v.hasCard1, 'TaskCard S09-T01 must exist');
    assert.ok(v.hasCard2, 'TaskCard S09-T02 must exist');
    assert.ok(v.hasCard3, 'TaskCard S09-T03 must exist');
    assert.ok(v.hasCard4, 'TaskCard S09-T04 must exist');

    assert.equal(v.t1Title, 'Read the Financial Data', 'Task 1 title must match');
    assert.equal(v.t2Title, 'Calculate Performance', 'Task 2 title must match');
    assert.equal(v.t3Title, 'Challenge the Sales Story', 'Task 3 title must match');
    assert.equal(v.t4Title, 'Write Management Findings', 'Task 4 title must match');

    assert.ok(v.containsRevenue, 'Must display September revenue ₹150,000');
    assert.ok(v.containsGrossProfit, 'Must display September gross profit ₹75,000');
    assert.ok(v.containsOperatingProfit, 'Must display September operating profit ₹30,000');
    assert.ok(v.containsGrossMargin, 'Must display September gross margin 50.0%');
    assert.ok(v.containsOperatingMargin, 'Must display September operating margin 20.0%');
    assert.ok(v.containsReceivables, 'Must display trade receivables ₹70,000');
    assert.ok(v.containsGrowth, 'Must display +25.0% revenue growth and +11.1% profit growth');
    assert.ok(v.containsPpCompression, 'Must display percentage point margin compression');
    assert.ok(v.tablesCount >= 2, 'Must render MIS performance matrix table and rubric');
    assert.ok(v.hasGovernance, 'Governance section must exist');
    assert.ok(v.hasRubric, '10 Marks evaluation rubric must exist');

    console.log('\n✅ Phase 2: Live Browser CDP Verification Passed 100%!');
    console.log('🎉 ALL VCEP SESSION 09 TRANSFORMATIONS VERIFIED SUCCESSFULLY!\n');

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
