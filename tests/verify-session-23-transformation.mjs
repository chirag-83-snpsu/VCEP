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
  const ws = fs.readFileSync('app/guided-learning/workstations/session-23-workstation.tsx', 'utf8');
  const journey = fs.readFileSync('app/guided-learning/components/session-23-presentation-journey.tsx', 'utf8');
  const data = fs.readFileSync('app/guided-learning/components/session-23-presentation-data.ts', 'utf8');
  const rules = fs.readFileSync('lib/review-engine/session-rules/session-23.ts', 'utf8');
  const registry = fs.readFileSync('lib/review-engine/registry.ts', 'utf8');

  // 1. Check Natural Headings (NOT tabs, NOT stages)
  assert.ok(journey.includes('id="vcep-area-management"'), 'Must define #vcep-area-management');
  assert.ok(
    journey.includes('Choose What Management Needs') || journey.includes('1. Choose What Management Needs'),
    'Must have heading "Choose What Management Needs"'
  );
  assert.ok(journey.includes('id="vcep-area-rehearsal"'), 'Must define #vcep-area-rehearsal');
  assert.ok(
    journey.includes('Rehearse Your Demonstration') || journey.includes('2. Rehearse Your Demonstration'),
    'Must have heading "Rehearse Your Demonstration"'
  );

  // 2. Check Unified Premium Bordered TaskCards (4 Tasks)
  assert.ok(journey.includes('taskId="S23-T01"'), 'Must declare TaskCard S23-T01');
  assert.ok(journey.includes('taskId="S23-T02"'), 'Must declare TaskCard S23-T02');
  assert.ok(journey.includes('taskId="S23-T03"'), 'Must declare TaskCard S23-T03');
  assert.ok(journey.includes('taskId="S23-T04"'), 'Must declare TaskCard S23-T04');
  assert.ok(journey.includes('Structure the Story'), 'Must feature Task 01 title');
  assert.ok(journey.includes('Build the Presentation'), 'Must feature Task 02 title');
  assert.ok(journey.includes('Test the Live Demonstration'), 'Must feature Task 03 title');
  assert.ok(journey.includes('Practise the Defence'), 'Must feature Task 04 title');
  assert.ok(journey.includes('Why this matters'), 'Must feature accessible collapsible Why this matters');

  // 3. Executive Constraints: 7-min pitch, 3-min demo, 8-min Q&A, Supervised Usability
  assert.ok(journey.includes('Seven-Minute Squad Presentation with Three-Minute Live Demo Inside'), 'Must state 7m presentation with 3m demo');
  assert.ok(journey.includes('Supervised Usability'), 'Must emphasize supervised usability judgment');
  assert.ok(journey.includes('Strict Max 6 Slides'), 'Must enforce max 6 slides');

  // 4. 6-Slide Presentation Deck Builder
  assert.ok(data.includes('INITIAL_SLIDES'), 'Must define INITIAL_SLIDES');
  assert.ok(data.includes('The Liquidity Challenge: ₹20,000 Deficit'), 'Must cover Slide 2 liquidity challenge');
  assert.ok(data.includes('Model v2.0 Architecture & Approved Changes'), 'Must cover Slide 3 Model v2.0 architecture');
  assert.ok(data.includes('Live Working Demonstration (3 Minutes)'), 'Must cover Slide 4 live demo');
  assert.ok(data.includes('Commercial Decision: The 10% Discount Trap'), 'Must cover Slide 5 commercial decision');
  assert.ok(data.includes('Governance, Scope Boundaries & Reviewer Handover'), 'Must cover Slide 6 governance');

  // 5. One-Page Executive Summary
  assert.ok(data.includes('INITIAL_EXEC_SUMMARY'), 'Must define INITIAL_EXEC_SUMMARY');
  assert.ok(journey.includes('Business Problem Context'), 'Must include problem context section');
  assert.ok(journey.includes('Source Records & Baseline Evidence'), 'Must include source evidence section');
  assert.ok(journey.includes('Working Demonstration Method'), 'Must include working demo method section');
  assert.ok(journey.includes('Commercial Decision & Counter-Proposal'), 'Must include commercial decision section');
  assert.ok(journey.includes('Scope Boundaries & Relational Limits'), 'Must include scope limits section');
  assert.ok(journey.includes('Next Steps & Supervised Handover'), 'Must include next steps section');

  // 6. 7-Minute Rehearsal Outline & Stopwatch
  assert.ok(data.includes('INITIAL_AGENDA'), 'Must define INITIAL_AGENDA');
  assert.ok(data.includes('0:00 – 1:00') && data.includes('2:00 – 5:00'), 'Must define exact agenda timing blocks');
  assert.ok(journey.includes('formatTimer') && journey.includes('isTimerRunning'), 'Must provide interactive stopwatch');

  // 7. Refresh-Demo Simulator
  assert.ok(journey.includes('demoRehearsal'), 'Must feature demoRehearsal state');
  assert.ok(journey.includes('2026-10-31') && journey.includes('2026-11-01'), 'Must toggle 31-Oct and 01-Nov');
  assert.ok(journey.includes('1–30 Days Overdue'), 'Must show dynamic aging bucket shift');
  assert.ok(journey.includes('Invariant at ₹95,000') || journey.includes('₹95,000'), 'Must verify control total invariance');

  // 8. Three Tough Reviewer Challenge Questions
  assert.ok(data.includes('INITIAL_CHALLENGES'), 'Must define INITIAL_CHALLENGES');
  assert.ok(data.includes('CH-01') && data.includes('CH-02') && data.includes('CH-03'), 'Must cover CH-01 to CH-03');
  assert.ok(data.includes('10% discount on all 30 seats'), 'Must challenge 10% discount trap');
  assert.ok(data.includes('Beacon Logistics refuses to pay'), 'Must challenge Beacon default contingency');
  assert.ok(data.includes('combine the CRM sales pipeline'), 'Must challenge CRM data boundary join');

  // 9. Source & Scope Permissions
  assert.ok(data.includes('INITIAL_PERMISSIONS'), 'Must define INITIAL_PERMISSIONS');
  assert.ok(data.includes('Case G CRM Data Boundary Isolation'), 'Must verify CRM data isolation');
  assert.ok(data.includes('6.0-Hour Student Effort Cap Compliance'), 'Must verify 6.0h effort cap');

  // 10. Governance & Three-Tier Signoffs
  assert.ok(journey.includes('preparerName') && journey.includes('reviewerName') && journey.includes('decisionOwner'), 'Must feature 3-tier signoffs');
  assert.ok(journey.includes('studentContribution'), 'Must feature student contribution');
  assert.ok(journey.includes('reviewerCorrection'), 'Must feature peer defect correction');
  assert.ok(journey.includes('fileVersion'), 'Must feature deliverable file');

  // 11. Workstation Delegation
  assert.ok(ws.includes('Session23PresentationJourney'), 'Workstation must delegate to Session23PresentationJourney');

  // 12. Page.tsx tab suppression and button wiring
  assert.ok(page.includes('selected > 24 && (') || page.includes('selected > 23 && ('), 'Tabs must be suppressed');
  assert.ok(journey.includes('vcep-area-rehearsal'), 'Journey must wire Rehearse Demonstration button');
  assert.ok(journey.includes('vcep-area-management'), 'Journey must wire Choose Management Needs button');
  assert.ok(page.includes('Present the work. Defend the decision.'), 'Page must display Session 23 subline');

  // 13. Review Engine Rules in lib
  assert.ok(registry.includes('23: evaluateSession23'), 'Registry must register Session 23');
  assert.ok(rules.includes('s23-o1-presentation-mission'), 'Review rules must check presentation mission');
  assert.ok(rules.includes('s23-l1-executive-needs'), 'Review rules must check executive deck structure');
  assert.ok(rules.includes('s23-c1-case-boundaries'), 'Review rules must check case permissions');
  assert.ok(rules.includes('s23-w1-slide-deck'), 'Review rules must check slide deck');
  assert.ok(rules.includes('s23-w2-exec-summary'), 'Review rules must check executive summary');
  assert.ok(rules.includes('s23-w3-rehearsal-timer'), 'Review rules must check rehearsal timer');
  assert.ok(rules.includes('s23-w4-reviewer-defense'), 'Review rules must check reviewer defense');
  assert.ok(rules.includes('s23-t1-governance'), 'Review rules must check governance');
  assert.ok(rules.includes('s23-t2-rubric-compliance'), 'Review rules must check rubric compliance');

  console.log('✅ Phase 1: Static Code & Content Verification Passed (100%)\n');
}

async function runBrowserVerification() {
  console.log('--- Phase 2: Live Browser CDP Verification & Screenshot Capture ---');

  const PORT = 9388;
  const tmpDir = `/tmp/chrome-session-23-test-clean-${Date.now()}`;
  fs.mkdirSync(tmpDir, { recursive: true });

  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${tmpDir}`,
    'about:blank',
  ]);

  let tabs = null;
  for (let i = 0; i < 15; i++) {
    try {
      const listRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      if (listRes.ok) {
        tabs = await listRes.json();
        if (tabs && tabs.length > 0) break;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 400));
  }

  assert.ok(tabs && tabs.length > 0, `Chrome debugger failed to start on port ${PORT}`);

  try {
    const pageTab = tabs.find((t) => t.type === 'page') || tabs[0];
    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const reqId = id++;
        const handler = (msg) => {
          const res = JSON.parse(msg.data);
          if (res.id === reqId) {
            ws.removeEventListener('message', handler);
            if (res.error) reject(res.error);
            else resolve(res.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: reqId, method, params }));
      });
    }

    await new Promise((resolve) => ws.addEventListener('open', resolve));

    await send('Page.enable');
    await send('DOM.enable');
    await send('Runtime.enable');
    await send('Network.enable');

    // Set authenticated session cookie
    await send('Network.setCookie', {
      name: '__vcep_session',
      value: 'session_s23_qa_test',
      domain: '127.0.0.1',
      path: '/',
    });

    // Mock auth /api/boot and /api/guided/session/23
    const s23Lesson = driveJson.find((s) => s.id === 23);
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        const s23Lesson = ${JSON.stringify(s23Lesson)};
        const origFetch = window.fetch;
        window.fetch = async (...args) => {
          const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
          if (url && url.includes('/api/boot')) {
            const res = await origFetch(...args);
            const data = await res.json();
            data.user = { id: 'student-23', email: 'presentation23@student.edu', role: 'student', name: 'Squad Presenter' };
            return new Response(JSON.stringify(data), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          if (url && url.includes('/api/guided/session/23')) {
            return new Response(JSON.stringify({ lesson: s23Lesson }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return origFetch(...args);
        };
      `,
    });

    console.log('Navigating to http://127.0.0.1:5173/guided-learning?session=23...');
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/guided-learning?session=23' });
    await new Promise((r) => setTimeout(r, 3500));

    async function captureViewport(filename, width, height, scrollSelector = null) {
      await send('Emulation.setDeviceMetricsOverride', {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: width < 600,
      });
      await new Promise((r) => setTimeout(r, 600));

      if (scrollSelector) {
        await send('Runtime.evaluate', {
          expression: `
            const el = document.querySelector('${scrollSelector}');
            if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
          `,
        });
        await new Promise((r) => setTimeout(r, 600));
      }

      const shot = await send('Page.captureScreenshot', { format: 'png' });
      const buffer = Buffer.from(shot.data, 'base64');
      const docsPath = path.join(outDirDocs, filename);
      const artifactPath = path.join(outDirArtifact, filename);
      fs.writeFileSync(docsPath, buffer);
      fs.writeFileSync(artifactPath, buffer);
      console.log(`Saved screenshot: ${docsPath} & ${artifactPath}`);
    }

    // 1. Desktop - Heading 1: Choose What Management Needs
    console.log('Capturing Desktop - Heading 1 (#vcep-area-management)...');
    await captureViewport('s23-heading-01-management-desktop-1440.png', 1440, 900, '#vcep-area-management');

    // 2. Desktop - Heading 2: Rehearse Your Demonstration
    console.log('Capturing Desktop - Heading 2 (#vcep-area-rehearsal)...');
    await captureViewport('s23-heading-02-rehearsal-desktop-1440.png', 1440, 900, '#vcep-area-rehearsal');

    // 3. Tablet - 768px
    console.log('Capturing Tablet (768px)...');
    await captureViewport('s23-presentation-tablet-768.png', 768, 1024, '#vcep-area-management');

    // 4. Mobile - 390px
    console.log('Capturing Mobile (390px)...');
    await captureViewport('s23-presentation-mobile-390.png', 390, 844, '#vcep-area-management');

    // Validate DOM Elements Live
    console.log('Validating DOM state in browser...');
    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const management = document.querySelector('#vcep-area-management');
          const rehearsal = document.querySelector('#vcep-area-rehearsal');
          const title = (document.querySelector('.v3-topline h1') || document.querySelector('h1'))?.textContent?.trim();
          const subtitle = (document.querySelector('.v3-topline p') || document.querySelector('.v3-topline div p'))?.textContent?.trim();
          const taskCards = document.querySelectorAll('article[data-task-id]');
          const taskIds = Array.from(taskCards).map(el => el.getAttribute('data-task-id'));
          const whyButtons = Array.from(document.querySelectorAll('button')).filter(b => b.textContent?.includes('Why this matters'));
          const tabs = document.querySelector('.v3-tabs');
          const tables = document.querySelectorAll('table');
          return {
            hasManagement: !!management,
            hasRehearsal: !!rehearsal,
            title,
            subtitle,
            hasTabs: !!tabs,
            taskCardsCount: taskCards.length,
            taskIds,
            whyButtonsCount: whyButtons.length,
            tablesCount: tables.length,
          };
        })()
      `,
      returnByValue: true,
    });

    const dom = evalRes.result.value;
    console.log('DOM Live State:', dom);
    assert.strictEqual(dom.hasManagement, true, 'DOM must have #vcep-area-management');
    assert.strictEqual(dom.hasRehearsal, true, 'DOM must have #vcep-area-rehearsal');
    assert.strictEqual(dom.hasTabs, false, 'Artificial tabs must be suppressed');
    assert.strictEqual(dom.taskCardsCount, 4, 'Must render exactly 4 TaskCards');
    assert.deepStrictEqual(dom.taskIds, ['S23-T01', 'S23-T02', 'S23-T03', 'S23-T04'], 'Task IDs must match S23-T01, S23-T02, S23-T03, S23-T04');
    assert.ok(dom.whyButtonsCount >= 4, 'Must render Why this matters buttons on each task card');
    assert.ok(dom.tablesCount >= 2, 'Must render at least 2 data tables (agenda & demo)');
    assert.strictEqual(dom.title, 'Corporate Presentation Preparation');
    assert.strictEqual(dom.subtitle, 'Present the work. Defend the decision.');

    console.log('✅ Phase 2: Live Browser CDP Verification & Screenshots Captured (100%)\n');

    ws.close();
  } finally {
    chrome.kill();
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {}
  }
}

async function main() {
  await runStaticVerification();
  await runBrowserVerification();
  console.log('======================================================');
  console.log('SESSION 23 VERIFICATION SUITE COMPLETED SUCCESSFULLY!');
  console.log('======================================================');
}

main().catch((err) => {
  console.error('Session 23 verification failed:', err);
  process.exit(1);
});
