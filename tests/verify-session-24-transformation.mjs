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
  const ws = fs.readFileSync('app/guided-learning/workstations/session-24-workstation.tsx', 'utf8');
  const journey = fs.readFileSync('app/guided-learning/components/session-24-passport-journey.tsx', 'utf8');
  const data = fs.readFileSync('app/guided-learning/components/session-24-passport-data.ts', 'utf8');
  const rules = fs.readFileSync('lib/review-engine/session-rules/session-24.ts', 'utf8');
  const registry = fs.readFileSync('lib/review-engine/registry.ts', 'utf8');

  // 1. Check Natural Headings (NOT tabs, NOT stages)
  assert.ok(journey.includes('id="vcep-area-present"'), 'Must define #vcep-area-present');
  assert.ok(
    journey.includes('Present & Defend Your Work') || journey.includes('1. Present & Defend Your Work'),
    'Must have heading "Present & Defend Your Work"'
  );
  assert.ok(journey.includes('id="vcep-area-passport"'), 'Must define #vcep-area-passport');
  assert.ok(
    journey.includes('Verify Your Industry Passport') || journey.includes('2. Verify Your Industry Passport'),
    'Must have heading "Verify Your Industry Passport"'
  );

  // 2. Check Unified Premium Bordered TaskCards (4 Tasks)
  assert.ok(journey.includes('taskId="S24-T01"'), 'Must declare TaskCard S24-T01');
  assert.ok(journey.includes('taskId="S24-T02"'), 'Must declare TaskCard S24-T02');
  assert.ok(journey.includes('taskId="S24-T03"'), 'Must declare TaskCard S24-T03');
  assert.ok(journey.includes('taskId="S24-T04"'), 'Must declare TaskCard S24-T04');
  assert.ok(journey.includes('Present the Project'), 'Must feature Task 01 title');
  assert.ok(journey.includes('Defend Your Contribution'), 'Must feature Task 02 title');
  assert.ok(journey.includes('Verify Your Industry Passport'), 'Must feature Task 03 title');
  assert.ok(journey.includes('Set Your 90-Day Plan'), 'Must feature Task 04 title');
  assert.ok(journey.includes('Why this matters'), 'Must feature accessible collapsible Why this matters');

  // 3. Demo Day Run-of-Show & Independent Evaluation
  assert.ok(data.includes('INITIAL_RUN_OF_SHOW'), 'Must define INITIAL_RUN_OF_SHOW');
  assert.ok(journey.includes('Run-of-Show Protocol'), 'Must display run-of-show protocol');
  assert.ok(journey.includes('Independent Judge Scoring'), 'Must enforce independent judge scoring before discussion');
  assert.ok(journey.includes('Conflict-of-Interest'), 'Must require evaluator COI signoff');

  // 4. Approved Capstone Portfolio Exhibits (5 Exhibits)
  assert.ok(data.includes('INITIAL_EXHIBITS'), 'Must define INITIAL_EXHIBITS');
  assert.ok(data.includes('VCEP-ART-S18') && data.includes('EX-01'), 'Must include S18 WBS exhibit');
  assert.ok(data.includes('VCEP-ART-S19') && data.includes('EX-02'), 'Must include S19 QA logs exhibit');
  assert.ok(data.includes('VCEP-ART-S20') && data.includes('EX-03'), 'Must include S20 CCB model exhibit');
  assert.ok(data.includes('VCEP-ART-S22') && data.includes('EX-04'), 'Must include S22 exit interview dossier exhibit');
  assert.ok(data.includes('VCEP-ART-S23') && data.includes('EX-05'), 'Must include S23 executive deck exhibit');

  // 5. Two-Minute Oral Defense Station
  assert.ok(data.includes('INITIAL_DEFENSE'), 'Must define INITIAL_DEFENSE');
  assert.ok(journey.includes('Individual 2-Minute Artifact-Defense Station'), 'Must feature 2-minute defense station');
  assert.ok(data.includes('VCEP-ART-S20') && journey.includes('assignedArtifactId'), 'Must assign authentic VCEP-ART-S20 artifact');
  assert.ok(journey.includes('Personal Attributable Contribution'), 'Must capture personal contribution');
  assert.ok(journey.includes('Defect & Correction History'), 'Must capture defect correction history');
  assert.ok(journey.includes('Technical Methodology & Formula Mechanics'), 'Must capture formula validation');
  assert.ok(journey.includes('Scope Limitations & Relational Boundaries'), 'Must capture explicit scope boundaries');

  // 6. Independent Judge Scorecard (10 Points)
  assert.ok(data.includes('INITIAL_SCORECARD'), 'Must define INITIAL_SCORECARD');
  assert.ok(data.includes('dimension: \'Execution\'') && data.includes('maxMarks: 4'), 'Scorecard must have Execution dim');
  assert.ok(data.includes('dimension: \'Reasoning\'') && data.includes('maxMarks: 2'), 'Scorecard must have Reasoning dim');
  assert.ok(data.includes('dimension: \'Communication\'') && data.includes('maxMarks: 2'), 'Scorecard must have Communication dim');
  assert.ok(data.includes('dimension: \'Professional Process\'') && data.includes('maxMarks: 2'), 'Scorecard must have Process dim');

  // 7. Six-Domain Industry Passport
  assert.ok(data.includes('INITIAL_PASSPORT_COMPETENCIES'), 'Must define INITIAL_PASSPORT_COMPETENCIES');
  assert.ok(data.includes('Finance execution'), 'Must verify Finance Execution domain');
  assert.ok(data.includes('Business technology'), 'Must verify Business Technology domain');
  assert.ok(data.includes('Business judgement'), 'Must verify Business Judgement domain');
  assert.ok(data.includes('AI verification'), 'Must verify AI Verification domain');
  assert.ok(data.includes('Communication'), 'Must verify Professional Communication domain');
  assert.ok(data.includes('Professional practice'), 'Must verify Professional Practice domain');
  assert.ok(journey.includes('does not constitute an automatic guarantee of corporate employment'), 'Must include clear credential non-guarantee notice');

  // 8. 90-Day Post-Programme Career Acceleration Plan
  assert.ok(data.includes('INITIAL_CAREER_PLAN_90_DAY'), 'Must define INITIAL_CAREER_PLAN_90_DAY');
  assert.ok(data.includes('Day 1–30') && data.includes('Day 31–60') && data.includes('Day 61–90'), 'Must include 3 30-day horizons');
  assert.ok(journey.includes('Three Structured 30-Day Horizons') && journey.includes('Action Description & Strategy'), 'Must have structured actions');
  assert.ok(journey.includes('Tangible Evidence of Progress'), 'Must require progress evidence');

  // 9. Governance & Three-Tier Signoffs
  assert.ok(journey.includes('preparerName') && journey.includes('reviewerName') && journey.includes('decisionOwner'), 'Must feature 3-tier signoffs');
  assert.ok(journey.includes('studentContribution'), 'Must feature student contribution');
  assert.ok(journey.includes('reviewerCorrection'), 'Must feature peer defect correction');
  assert.ok(journey.includes('fileVersion'), 'Must feature deliverable file');
  assert.ok(journey.includes('humanAcknowledged'), 'Must require credential acknowledgement checkbox');

  // 10. Workstation Delegation
  assert.ok(ws.includes('Session24PassportJourney'), 'Workstation must delegate to Session24PassportJourney');

  // 11. Page.tsx tab suppression and button wiring
  assert.ok(page.includes('selected > 24 && (') || page.includes('selected > 23 && ('), 'Tabs must be suppressed for selected <= 24');
  assert.ok(page.includes('vcep-area-passport'), 'Page must wire Verify Industry Passport button');
  assert.ok(page.includes('vcep-area-present'), 'Page must wire Present & Defend Work button');
  assert.ok(page.includes('Show the evidence. Own your growth.'), 'Page must display Session 24 subline');

  // 12. Review Engine Rules in lib
  assert.ok(registry.includes('24: evaluateSession24'), 'Registry must register Session 24');
  assert.ok(rules.includes('s24-o1-demo-mission'), 'Review rules must check demo mission');
  assert.ok(rules.includes('s24-l1-passport-integrity'), 'Review rules must check passport integrity');
  assert.ok(rules.includes('s24-c1-case-boundaries'), 'Review rules must check case boundaries');
  assert.ok(rules.includes('s24-w1-artifact-defense'), 'Review rules must check artifact defense');
  assert.ok(rules.includes('s24-w2-passport-verification'), 'Review rules must check passport verification');
  assert.ok(rules.includes('s24-w3-career-plan'), 'Review rules must check career plan');
  assert.ok(rules.includes('s24-w4-judge-scorecard'), 'Review rules must check judge scorecard');
  assert.ok(rules.includes('s24-t1-governance'), 'Review rules must check governance');
  assert.ok(rules.includes('s24-t2-rubric-compliance'), 'Review rules must check rubric compliance');

  console.log('✅ Phase 1: Static Code & Content Verification Passed (100%)\n');
}

async function runBrowserVerification() {
  console.log('--- Phase 2: Live Browser CDP Verification & Screenshot Capture ---');

  const PORT = 9389;
  const tempProfile = `/tmp/chrome-session-24-test-clean-${Date.now()}`;
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${tempProfile}`,
    'about:blank',
  ]);

  let tabs = null;
  for (let i = 0; i < 15; i++) {
    try {
      await new Promise((r) => setTimeout(r, 400));
      const listRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      if (listRes.ok) {
        tabs = await listRes.json();
        if (tabs && tabs.length > 0) break;
      }
    } catch {}
  }

  if (!tabs || tabs.length === 0) {
    chrome.kill();
    throw new Error(`Failed to connect to headless Chrome on port ${PORT}`);
  }

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
      value: 'session_s24_qa_test',
      domain: '127.0.0.1',
      path: '/',
    });

    // Mock auth /api/boot and /api/guided/session/24
    const s24Lesson = driveJson.find((s) => s.id === 24);
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        const s24Lesson = ${JSON.stringify(s24Lesson)};
        const origFetch = window.fetch;
        window.fetch = async (...args) => {
          const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
          if (url && url.includes('/api/boot')) {
            const res = await origFetch(...args);
            const data = await res.json();
            data.user = { id: 'student-24', email: 'passport24@student.edu', role: 'student', name: 'Demo Day Candidate' };
            return new Response(JSON.stringify(data), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          if (url && url.includes('/api/guided/session/24')) {
            return new Response(JSON.stringify({ lesson: s24Lesson }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return origFetch(...args);
        };
      `,
    });

    console.log('Navigating to http://127.0.0.1:5173/guided-learning?session=24...');
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/guided-learning?session=24' });
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

    // 1. Desktop - Heading 1: Present & Defend Your Work
    console.log('Capturing Desktop - Heading 1 (#vcep-area-present)...');
    await captureViewport('s24-heading-01-present-desktop-1440.png', 1440, 900, '#vcep-area-present');

    // 2. Desktop - Heading 2: Verify Your Industry Passport
    console.log('Capturing Desktop - Heading 2 (#vcep-area-passport)...');
    await captureViewport('s24-heading-02-passport-desktop-1440.png', 1440, 900, '#vcep-area-passport');

    // 3. Tablet - 768px
    console.log('Capturing Tablet (768px)...');
    await captureViewport('s24-presentation-tablet-768.png', 768, 1024, '#vcep-area-present');

    // 4. Mobile - 390px
    console.log('Capturing Mobile (390px)...');
    await captureViewport('s24-presentation-mobile-390.png', 390, 844, '#vcep-area-present');

    // Validate DOM Elements Live
    console.log('Validating DOM state in browser...');
    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const present = document.querySelector('#vcep-area-present');
          const passport = document.querySelector('#vcep-area-passport');
          const title = (document.querySelector('.v3-topline h1') || document.querySelector('h1'))?.textContent?.trim();
          const subtitle = (document.querySelector('.v3-topline p') || document.querySelector('.v3-topline div p'))?.textContent?.trim();
          const tabs = document.querySelector('.v3-tabs');
          const taskCards = Array.from(document.querySelectorAll('article[data-task-id]'));
          const taskIds = taskCards.map((el) => el.getAttribute('data-task-id'));
          const whyButtons = Array.from(document.querySelectorAll('button')).filter((b) =>
            b.textContent && b.textContent.includes('Why this matters')
          );
          return {
            hasPresent: !!present,
            hasPassport: !!passport,
            title,
            subtitle,
            hasTabs: !!tabs,
            taskCardsCount: taskCards.length,
            taskIds,
            whyButtonsCount: whyButtons.length,
          };
        })()
      `,
      returnByValue: true,
    });

    const dom = evalRes.result.value;
    console.log('DOM Live State:', dom);
    assert.strictEqual(dom.hasPresent, true, 'DOM must have #vcep-area-present');
    assert.strictEqual(dom.hasPassport, true, 'DOM must have #vcep-area-passport');
    assert.strictEqual(dom.hasTabs, false, 'Artificial tabs must be suppressed');
    assert.strictEqual(dom.taskCardsCount, 4, 'Must render exactly 4 TaskCards');
    assert.deepStrictEqual(dom.taskIds, ['S24-T01', 'S24-T02', 'S24-T03', 'S24-T04'], 'Task IDs must match S24-T01, S24-T02, S24-T03, S24-T04');
    assert.ok(dom.whyButtonsCount >= 4, 'Must render Why this matters buttons on each task card');
    assert.strictEqual(dom.title, 'Corporate Demo Day and Industry Passport');
    assert.strictEqual(dom.subtitle, 'Show the evidence. Own your growth.');

    console.log('✅ Phase 2: Live Browser CDP Verification & Screenshots Captured (100%)\n');

    ws.close();
  } finally {
    chrome.kill();
  }
}

async function main() {
  await runStaticVerification();
  await runBrowserVerification();
  console.log('======================================================');
  console.log('SESSION 24 VERIFICATION SUITE COMPLETED SUCCESSFULLY!');
  console.log('======================================================');
}

main().catch((err) => {
  console.error('Session 24 verification failed:', err);
  process.exit(1);
});
