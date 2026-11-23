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
  const ws = fs.readFileSync('app/guided-learning/workstations/session-22-workstation.tsx', 'utf8');
  const journey = fs.readFileSync('app/guided-learning/components/session-22-hiring-journey.tsx', 'utf8');
  const data = fs.readFileSync('app/guided-learning/components/session-22-hiring-data.ts', 'utf8');
  const rules = fs.readFileSync('lib/review-engine/session-rules/session-22.ts', 'utf8');
  const registry = fs.readFileSync('lib/review-engine/registry.ts', 'utf8');

  // 1. Check Natural Headings (NOT tabs, NOT stages)
  assert.ok(journey.includes('id="vcep-area-prepare"'), 'Must define #vcep-area-prepare');
  assert.ok(
    journey.includes('Prepare for the Hiring Conversation') || journey.includes('1. Prepare for the Hiring Conversation'),
    'Must have heading "Prepare for the Hiring Conversation"'
  );
  assert.ok(journey.includes('id="vcep-area-review"'), 'Must define #vcep-area-review');
  assert.ok(
    journey.includes('Complete Your Verified Review') || journey.includes('2. Complete Your Verified Review'),
    'Must have heading "Complete Your Verified Review"'
  );

  // 2. Check Unified Premium Bordered TaskCards (3 Tasks)
  assert.ok(journey.includes('taskId="S22-T01"'), 'Must declare TaskCard S22-T01');
  assert.ok(journey.includes('taskId="S22-T02"'), 'Must declare TaskCard S22-T02');
  assert.ok(journey.includes('taskId="S22-T03"'), 'Must declare TaskCard S22-T03');
  assert.ok(journey.includes('Prepare Interview Evidence'), 'Must feature Task 01 title');
  assert.ok(journey.includes('Defend Your Work'), 'Must feature Task 02 title');
  assert.ok(journey.includes('Plan the Next 30 Days'), 'Must feature Task 03 title');
  assert.ok(journey.includes('Why this matters'), 'Must feature accessible collapsible Why this matters');

  // 3. Assessment Security: Confidential Exit B isolation
  assert.ok(journey.includes('The unseen individual Exit B assessment is delivered separately'), 'Must announce separate Exit B delivery');
  assert.ok(journey.includes('generative AI') && journey.includes('strictly locked'), 'Must enforce zero-AI');
  assert.ok(!journey.includes('Exit B Question 1:') && !journey.includes('Exit B Question 2:'), 'Zero confidential test questions in public code');
  assert.ok(!journey.includes('Exit B Solution:') && !journey.includes('Answer Key:'), 'Zero answer keys in public code');

  // 4. Pre-Assessment Logistics
  assert.ok(data.includes('StudentID_S22_v01.xlsx'), 'Must specify StudentID_S22_v01.xlsx submission standard');
  assert.ok(data.includes('Live Formula Mandate'), 'Must enforce live formula requirement');
  assert.ok(journey.includes('60-minute') || data.includes('60 minutes') || journey.includes('60 MIN'), 'Must enforce 60-minute duration');

  // 5. Three-Part STAR+V Structured Viva Evidence Register
  assert.ok(data.includes('INITIAL_INTERVIEW_EVIDENCE'), 'Must define INITIAL_INTERVIEW_EVIDENCE');
  assert.ok(data.includes('A task I completed'), 'Must cover "A task I completed"');
  assert.ok(data.includes('An error I corrected'), 'Must cover "An error I corrected"');
  assert.ok(data.includes('A decision I escalated'), 'Must cover "A decision I escalated"');
  assert.ok(journey.includes('STAR+V'), 'Must emphasize STAR+V framework');

  // 6. Five Core Viva Practice Scenarios
  assert.ok(data.includes('CORE_VIVA_SCENARIOS'), 'Must define CORE_VIVA_SCENARIOS');
  assert.ok(data.includes('Ind AS 115 Revenue Recognition'), 'Must include Ind AS 115 scenario');
  assert.ok(data.includes('Timing Bridge (Uncredited vs Unpresented Cheques)'), 'Must include Timing Bridge scenario');
  assert.ok(data.includes('ICAI Code of Ethics'), 'Must include ICAI Code of Ethics scenario');

  // 7. Ethical Escalation Defense (ICAI Standards)
  assert.ok(data.includes('DEFAULT_ETHICAL_RESPONSE'), 'Must define DEFAULT_ETHICAL_RESPONSE');
  assert.ok(data.includes('isolated suspense account'), 'Must emphasize suspense account isolation');
  assert.ok(data.includes('ICAI professional standards'), 'Must cite ICAI professional standards');

  // 8. 30-Day Post-Assessment Competency Improvement Plan
  assert.ok(data.includes('INITIAL_DEVELOPMENT_PLAN'), 'Must define INITIAL_DEVELOPMENT_PLAN');
  assert.ok(data.includes('Milestone 1 (Day 1–10)'), 'Must define Milestone 1');
  assert.ok(data.includes('Milestone 2 (Day 11–20)'), 'Must define Milestone 2');
  assert.ok(data.includes('Milestone 3 (Day 21–30)'), 'Must define Milestone 3');

  // 9. Human Interviewer Evaluation (No artificial auto-grading)
  assert.ok(journey.includes('Human-Led Viva Voce Panel Evaluation'), 'Must state human evaluation');
  assert.ok(journey.includes('not accent or fluency'), 'Must evaluate reasoning and precision, not accent');

  // 10. Governance & Three-Tier Signoffs
  assert.ok(journey.includes('preparerName') && journey.includes('reviewerName') && journey.includes('decisionOwner'), 'Must feature 3-tier signoffs');
  assert.ok(journey.includes('studentContribution'), 'Must feature student contribution');
  assert.ok(journey.includes('reviewerCorrection'), 'Must feature peer defect correction');
  assert.ok(journey.includes('fileVersion'), 'Must feature deliverable file');

  // 11. Workstation Delegation
  assert.ok(ws.includes('Session22HiringJourney'), 'Workstation must delegate to Session22HiringJourney');

  // 12. Page.tsx tab suppression and button wiring
  assert.ok(page.includes('selected > 24 && (') || page.includes('selected > 22 && ('), 'Tabs must be suppressed');
  assert.ok(page.includes('vcep-area-review'), 'Page must wire Complete Verified Review button');
  assert.ok(page.includes('vcep-area-prepare'), 'Page must wire Prepare for Interview button');
  assert.ok(page.includes('Show your skills independently.'), 'Page must display Session 22 subline');

  // 13. Review Engine Rules in lib
  assert.ok(registry.includes('22: evaluateSession22'), 'Registry must register Session 22');
  assert.ok(rules.includes('s22-o1-exit-mission'), 'Review rules must check exit mission');
  assert.ok(rules.includes('s22-l1-assessment-security'), 'Review rules must check assessment security');
  assert.ok(rules.includes('s22-c1-case-boundaries'), 'Review rules must check case boundaries');
  assert.ok(rules.includes('s22-w1-interview-evidence'), 'Review rules must check interview evidence');
  assert.ok(rules.includes('s22-w2-ethical-escalation'), 'Review rules must check ethical escalation');
  assert.ok(rules.includes('s22-w3-development-plan'), 'Review rules must check development plan');
  assert.ok(rules.includes('s22-t1-governance'), 'Review rules must check governance');
  assert.ok(rules.includes('s22-t2-rubric-compliance'), 'Review rules must check rubric compliance');

  console.log('✅ Phase 1: Static Code & Content Verification Passed (100%)\n');
}

async function runBrowserVerification() {
  console.log('--- Phase 2: Live Browser CDP Verification & Screenshot Capture ---');

  const PORT = 9387;
  const tmpDir = `/tmp/chrome-session-22-test-clean-${Date.now()}`;
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
      value: 'session_s22_qa_test',
      domain: '127.0.0.1',
      path: '/',
    });

    // Mock auth /api/boot and /api/guided/session/22
    const s22Lesson = driveJson.find((s) => s.id === 22);
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        const s22Lesson = ${JSON.stringify(s22Lesson)};
        const origFetch = window.fetch;
        window.fetch = async (...args) => {
          const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
          if (url && url.includes('/api/boot')) {
            const res = await origFetch(...args);
            const data = await res.json();
            data.user = { id: 'student-22', email: 'viva22@student.edu', role: 'student', name: 'Assessment Candidate' };
            return new Response(JSON.stringify(data), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          if (url && url.includes('/api/guided/session/22')) {
            return new Response(JSON.stringify({ lesson: s22Lesson }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return origFetch(...args);
        };
      `,
    });

    console.log('Navigating to http://127.0.0.1:5173/guided-learning?session=22...');
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/guided-learning?session=22' });
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

    // 1. Desktop - Heading 1: Prepare for the Hiring Conversation
    console.log('Capturing Desktop - Heading 1 (#vcep-area-prepare)...');
    await captureViewport('s22-heading-01-prepare-desktop-1440.png', 1440, 900, '#vcep-area-prepare');

    // 2. Desktop - Heading 2: Complete Your Verified Review
    console.log('Capturing Desktop - Heading 2 (#vcep-area-review)...');
    await captureViewport('s22-heading-02-review-desktop-1440.png', 1440, 900, '#vcep-area-review');

    // 3. Tablet - 768px
    console.log('Capturing Tablet (768px)...');
    await captureViewport('s22-hiring-tablet-768.png', 768, 1024, '#vcep-area-prepare');

    // 4. Mobile - 390px
    console.log('Capturing Mobile (390px)...');
    await captureViewport('s22-hiring-mobile-390.png', 390, 844, '#vcep-area-prepare');

    // Validate DOM Elements Live
    console.log('Validating DOM state in browser...');
    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const prepare = document.querySelector('#vcep-area-prepare');
          const review = document.querySelector('#vcep-area-review');
          const title = (document.querySelector('.v3-topline h1') || document.querySelector('h1'))?.textContent?.trim();
          const subtitle = (document.querySelector('.v3-topline p') || document.querySelector('.v3-topline div p'))?.textContent?.trim();
          const taskCards = document.querySelectorAll('article[data-task-id]');
          const taskIds = Array.from(taskCards).map(el => el.getAttribute('data-task-id'));
          const whyButtons = Array.from(document.querySelectorAll('button')).filter(b => b.textContent?.includes('Why this matters'));
          const tabs = document.querySelector('.v3-tabs');
          const table = document.querySelector('table');
          return {
            hasPrepare: !!prepare,
            hasReview: !!review,
            title,
            subtitle,
            hasTabs: !!tabs,
            taskCardsCount: taskCards.length,
            taskIds,
            whyButtonsCount: whyButtons.length,
            hasTable: !!table,
          };
        })()
      `,
      returnByValue: true,
    });

    const dom = evalRes.result.value;
    console.log('DOM Live State:', dom);
    assert.strictEqual(dom.hasPrepare, true, 'DOM must have #vcep-area-prepare');
    assert.strictEqual(dom.hasReview, true, 'DOM must have #vcep-area-review');
    assert.strictEqual(dom.hasTabs, false, 'Artificial tabs must be suppressed');
    assert.strictEqual(dom.taskCardsCount, 3, 'Must render exactly 3 TaskCards');
    assert.deepStrictEqual(dom.taskIds, ['S22-T01', 'S22-T02', 'S22-T03'], 'Task IDs must match S22-T01, S22-T02, S22-T03');
    assert.ok(dom.whyButtonsCount >= 3, 'Must render Why this matters buttons on each task card');
    assert.strictEqual(dom.hasTable, true, 'Must render 30-day plan table');
    assert.strictEqual(dom.title, 'Hiring Simulation and Exit Assessment');
    assert.strictEqual(dom.subtitle, 'Show your skills independently.');

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
  console.log('SESSION 22 VERIFICATION SUITE COMPLETED SUCCESSFULLY!');
  console.log('======================================================');
}

main().catch((err) => {
  console.error('Session 22 verification failed:', err);
  process.exit(1);
});
