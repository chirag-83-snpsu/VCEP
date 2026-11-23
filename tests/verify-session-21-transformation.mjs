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
  const ws = fs.readFileSync('app/guided-learning/workstations/session-21-workstation.tsx', 'utf8');
  const journey = fs.readFileSync('app/guided-learning/components/session-21-portfolio-journey.tsx', 'utf8');
  const data = fs.readFileSync('app/guided-learning/components/session-21-portfolio-data.ts', 'utf8');
  const rules = fs.readFileSync('lib/review-engine/session-rules/session-21.ts', 'utf8');
  const registry = fs.readFileSync('lib/review-engine/registry.ts', 'utf8');

  // 1. Check Natural Headings
  assert.ok(journey.includes('id="vcep-area-evidence"'), 'Must define #vcep-area-evidence');
  assert.ok(
    journey.includes('Find Your Evidence') || journey.includes('1. Find Your Evidence'),
    'Must have heading "Find Your Evidence"'
  );
  assert.ok(journey.includes('id="vcep-area-portfolio"'), 'Must define #vcep-area-portfolio');
  assert.ok(
    journey.includes('Build Your Resume & Portfolio') || journey.includes('2. Build Your Resume & Portfolio'),
    'Must have heading "Build Your Resume & Portfolio"'
  );

  // 2. Check 4 Unified TaskCards
  assert.ok(journey.includes('data-task-id="S21-T01"') || journey.includes('taskId="S21-T01"'), 'Must render Task 01');
  assert.ok(journey.includes('data-task-id="S21-T02"') || journey.includes('taskId="S21-T02"'), 'Must render Task 02');
  assert.ok(journey.includes('data-task-id="S21-T03"') || journey.includes('taskId="S21-T03"'), 'Must render Task 03');
  assert.ok(journey.includes('data-task-id="S21-T04"') || journey.includes('taskId="S21-T04"'), 'Must render Task 04');
  assert.ok(journey.includes('Find Verified Evidence'), 'Must have Task 01 title');
  assert.ok(journey.includes('Write Resume Achievements'), 'Must have Task 02 title');
  assert.ok(journey.includes('Create Professional Summary'), 'Must have Task 03 title');
  assert.ok(journey.includes('Build the Portfolio Index'), 'Must have Task 04 title');

  // 3. Check Anti-Inflation Scenario & Principles
  assert.ok(journey.includes('improved company profit 40%'), 'Must address the 40% profit inflation misconception');
  assert.ok(journey.includes('The Google XYZ Formula'), 'Must highlight Google XYZ formula');
  assert.ok(journey.includes('[Simulated Project]'), 'Must support honest simulated project tagging');
  assert.ok(journey.includes('Verifiable Evidence Hashes'), 'Must emphasize verifiable evidence hashes');

  // 4. Check Authorized VCEP Artifacts (Evidence Library)
  assert.ok(data.includes('AUTHORIZED_STUDENT_ARTIFACTS'), 'Must define AUTHORIZED_STUDENT_ARTIFACTS');
  assert.ok(data.includes('VCEP-ART-S06') && data.includes('VCEP-ART-S20'), 'Must span S06 through S20');
  assert.ok(data.includes('Accounting') && data.includes('Reconciliation') && data.includes('MIS'), 'Must cover curriculum categories');
  assert.ok(data.includes('Invoice review') && data.includes('AI verification') && data.includes('Capstone'), 'Must cover 6 categories');
  assert.ok(data.includes('Current Student (Verified ID)'), 'Must enforce student cohort privacy isolation');

  // 5. Check Three Google XYZ Resume Bullets
  assert.ok(data.includes('INITIAL_RESUME_BULLETS'), 'Must define INITIAL_RESUME_BULLETS');
  assert.ok(data.includes('B1') && data.includes('B2') && data.includes('B3'), 'Must define Bullets B1 through B3');
  assert.ok(journey.includes('isSimulatedFlagged'), 'Must feature simulated project toggle');
  assert.ok(journey.includes('VERIFIED AUTHENTIC') && journey.includes('INFLATED CLAIM'), 'Must provide anti-inflation badge');

  // 6. Check 90-Word Professional Summary & Skills
  assert.ok(data.includes('DEFAULT_PROFESSIONAL_SUMMARY'), 'Must define DEFAULT_PROFESSIONAL_SUMMARY');
  assert.ok(journey.includes('75–100 words') || journey.includes('75-100 words'), 'Must validate summary word bounds (~90 words)');
  assert.ok(journey.includes('Financial Modeling & Working Capital'), 'Must display role-focused skills taxonomy');
  assert.ok(journey.includes('Responsible AI & Quality Assurance'), 'Must display AI skills taxonomy');

  // 7. Check 45-Second Recruiter Challenge Drill
  assert.ok(journey.includes('45-Second Recruiter Audit Challenge'), 'Must feature 45-second recruiter challenge');
  assert.ok(journey.includes('timerSeconds') && journey.includes('Start 45s Drill'), 'Must provide interactive countdown timer');
  assert.ok(journey.includes('Mathematical Proof & Formula Defense'), 'Must display formula defense');
  assert.ok(journey.includes('Auditable Workbook / Source Log Reference'), 'Must display work log reference');
  assert.ok(journey.includes('skillGapIdentified') && journey.includes('nextPracticeTask'), 'Must capture skill gap and practice task');

  // 8. Check Governance & Peer Review Defect Correction
  assert.ok(journey.includes('preparerName') && journey.includes('reviewerName') && journey.includes('decisionOwner'), 'Must feature 3-tier signoffs');
  assert.ok(journey.includes('studentContribution'), 'Must feature individual deliverable contribution');
  assert.ok(journey.includes('reviewerCorrection'), 'Must feature before/after peer defect correction');
  assert.ok(journey.includes('fileVersion'), 'Must track deliverable filename');

  // 9. Check Workstation Delegation
  assert.ok(ws.includes('Session21PortfolioJourney'), 'Workstation must delegate to Session21PortfolioJourney');

  // 10. Check page.tsx tab suppression and button wiring
  assert.ok(
    page.includes('selected > 24 && (') || page.includes('selected > 21 && ('),
    'Tabs must be suppressed for selected <= 24'
  );
  assert.ok(page.includes('vcep-area-portfolio'), 'Page must wire Build Resume & Portfolio button');
  assert.ok(page.includes('vcep-area-evidence'), 'Page must wire Find Evidence button');
  assert.ok(page.includes('Turn real work into a credible resume.'), 'Page must display Session 21 subline');

  // 11. Check Review Engine Rules in lib
  assert.ok(registry.includes('21: evaluateSession21'), 'Registry must register Session 21');
  assert.ok(rules.includes('s21-o1-portfolio-mission'), 'Review rules must check portfolio mission');
  assert.ok(rules.includes('s21-l1-anti-inflation'), 'Review rules must check anti-inflation');
  assert.ok(rules.includes('s21-c1-case-boundaries'), 'Review rules must check case boundaries');
  assert.ok(rules.includes('s21-w1-xyz-bullets'), 'Review rules must check XYZ bullets');
  assert.ok(rules.includes('s21-w2-portfolio-index'), 'Review rules must check portfolio index');
  assert.ok(rules.includes('s21-w3-summary-words'), 'Review rules must check summary words');
  assert.ok(rules.includes('s21-w4-recruiter-challenge'), 'Review rules must check recruiter challenge');
  assert.ok(rules.includes('s21-t1-governance'), 'Review rules must check governance');
  assert.ok(rules.includes('s21-t2-rubric-compliance'), 'Review rules must check rubric compliance');

  console.log('✅ Phase 1: Static Code & Content Verification Passed (100%)\n');
}

async function runBrowserVerification() {
  console.log('--- Phase 2: Live Browser CDP Verification & Screenshot Capture ---');

  const PORT = 9387;
  const tmpProfile = `/tmp/chrome-session-21-test-clean-${Date.now()}`;
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${tmpProfile}`,
    'about:blank',
  ]);

  let pageTab = null;
  for (let attempt = 0; attempt < 15; attempt++) {
    try {
      const listRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const tabs = await listRes.json();
      pageTab = tabs.find((t) => t.type === 'page') || tabs[0];
      if (pageTab?.webSocketDebuggerUrl) break;
    } catch (e) {
      // wait for Chrome startup
    }
    await new Promise((r) => setTimeout(r, 400));
  }

  if (!pageTab?.webSocketDebuggerUrl) {
    chrome.kill();
    throw new Error('Could not connect to Chrome debugging port ' + PORT);
  }

  try {
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
      value: 'session_s21_qa_test',
      domain: '127.0.0.1',
      path: '/',
    });

    // Mock auth /api/boot and /api/guided/session/21
    const s21Lesson = driveJson.find((s) => s.id === 21);
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        const s21Lesson = ${JSON.stringify(s21Lesson)};
        const origFetch = window.fetch;
        window.fetch = async (...args) => {
          const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
          if (url && url.includes('/api/boot')) {
            const res = await origFetch(...args);
            const data = await res.json();
            data.user = { id: 'student-21', email: 'portfolio21@student.edu', role: 'student', name: 'Graduate Candidate' };
            return new Response(JSON.stringify(data), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          if (url && url.includes('/api/guided/session/21')) {
            return new Response(JSON.stringify({ lesson: s21Lesson }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return origFetch(...args);
        };
      `,
    });

    console.log('Navigating to http://127.0.0.1:5173/guided-learning?session=21...');
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/guided-learning?session=21' });
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
      const buf = Buffer.from(shot.data, 'base64');
      fs.writeFileSync(path.join(outDirDocs, filename), buf);
      fs.writeFileSync(path.join(outDirArtifact, filename), buf);
      console.log(`📸 Saved screenshot: ${filename} (${width}x${height})`);
    }

    // 1. Desktop 1440px - Heading 1 (Find Your Evidence)
    await captureViewport('s21-heading-01-evidence-desktop-1440.png', 1440, 900, '#vcep-area-evidence');

    // 2. Desktop 1440px - Heading 2 (Build Your Resume & Portfolio)
    await captureViewport('s21-heading-02-portfolio-desktop-1440.png', 1440, 900, '#vcep-area-portfolio');

    // 3. Tablet 768px
    await captureViewport('s21-portfolio-tablet-768.png', 768, 1024, '#vcep-area-evidence');

    // 4. Mobile 390px
    await captureViewport('s21-portfolio-mobile-390.png', 390, 844, '#vcep-area-evidence');

    // DOM Assertions Verification
    const evalResult = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const evidenceArea = document.getElementById('vcep-area-evidence');
          const portfolioArea = document.getElementById('vcep-area-portfolio');
          const tabs = document.querySelector('.v3-tabs');
          const taskCards = document.querySelectorAll('article[data-task-id]');
          const pageText = document.body.innerText;

          const hasRecruiterTitle = pageText.includes('45-Second Recruiter Audit Challenge');
          const hasMathProof = pageText.includes('Mathematical Proof') || pageText.includes('Formula Defense');
          const hasWorkLog = pageText.includes('Auditable Workbook') || pageText.includes('Source Log Reference');

          return {
            hasEvidenceArea: !!evidenceArea,
            hasPortfolioArea: !!portfolioArea,
            tabsHidden: !tabs,
            taskCardsCount: taskCards.length,
            hasTask01: !!document.querySelector('[data-task-id="S21-T01"]'),
            hasTask02: !!document.querySelector('[data-task-id="S21-T02"]'),
            hasTask03: !!document.querySelector('[data-task-id="S21-T03"]'),
            hasTask04: !!document.querySelector('[data-task-id="S21-T04"]'),
            task01Title: pageText.includes('Find Verified Evidence'),
            task02Title: pageText.includes('Write Resume Achievements'),
            task03Title: pageText.includes('Create Professional Summary'),
            task04Title: pageText.includes('Build the Portfolio Index'),
            containsWhyThisMatters: pageText.includes('Why this matters'),
            hasRecruiterTitle,
            hasMathProof,
            hasWorkLog,
            containsAntiInflationScenario: pageText.includes('improved company profit 40%') && pageText.includes('The Google XYZ Formula'),
            containsEvidenceLibrary: pageText.includes('Authorized VCEP Evidence Library') && pageText.includes('VCEP-ART-S06') && pageText.includes('VCEP-ART-S20'),
            containsRecruiterChallenge: hasRecruiterTitle && (hasMathProof || hasWorkLog),
            containsXYZBulletsStudio: pageText.includes('Three Evidence-Linked Google XYZ Resume Bullets') && pageText.includes('[Simulated Project]'),
            containsSummaryAndSkills: pageText.includes('90-Word Professional Summary') && pageText.includes('Financial Modeling & Working Capital'),
            containsPortfolioIndex: pageText.includes('Six-Item Verifiable Professional Portfolio Index') && pageText.includes('StudentID_S06_v01.xlsx'),
            containsSkillGapForm: pageText.includes('Target Role for This Evidence') && pageText.includes('One Skill Gap Identified') && pageText.includes('Specific Next Practice Task'),
            containsGovernance: pageText.includes('Preparer') && pageText.includes('Reviewer') && pageText.includes('Decision Owner'),
            containsRubricCard: pageText.includes('Automatic Portfolio Review') && (pageText.includes('10 / 10 pts') || pageText.includes('10 / 10')),
            tablesCount: document.querySelectorAll('table').length,
          };
        })()
      `,
      returnByValue: true,
    });

    console.log('\n📊 DOM Inspection Result:', JSON.stringify(evalResult.result.value, null, 2));

    const v = evalResult.result.value;
    assert.strictEqual(v.hasEvidenceArea, true, 'Must render #vcep-area-evidence');
    assert.strictEqual(v.hasPortfolioArea, true, 'Must render #vcep-area-portfolio');
    assert.strictEqual(v.tabsHidden, true, 'Legacy tabs must be hidden for Session 21');
    assert.strictEqual(v.taskCardsCount, 4, 'Must render exactly 4 bordered TaskCards');
    assert.ok(v.hasTask01 && v.task01Title, 'Must render Task 01: Find Verified Evidence');
    assert.ok(v.hasTask02 && v.task02Title, 'Must render Task 02: Write Resume Achievements');
    assert.ok(v.hasTask03 && v.task03Title, 'Must render Task 03: Create Professional Summary');
    assert.ok(v.hasTask04 && v.task04Title, 'Must render Task 04: Build the Portfolio Index');
    assert.strictEqual(v.containsWhyThisMatters, true, 'Must render collapsible Why this matters buttons');
    assert.strictEqual(v.containsAntiInflationScenario, true, 'Must display anti-inflation scenario and Google XYZ formula');
    assert.strictEqual(v.containsEvidenceLibrary, true, 'Must display authorized evidence library');
    assert.strictEqual(v.containsRecruiterChallenge, true, 'Must display 45-second recruiter challenge');
    assert.strictEqual(v.containsXYZBulletsStudio, true, 'Must display 3 Google XYZ bullets studio');
    assert.strictEqual(v.containsSummaryAndSkills, true, 'Must display 90-word summary and skills taxonomy');
    assert.strictEqual(v.containsPortfolioIndex, true, 'Must display 6-item portfolio index');
    assert.strictEqual(v.containsSkillGapForm, true, 'Must display target role, skill gap and practice task form');
    assert.strictEqual(v.containsGovernance, true, 'Must render governance fields');
    assert.strictEqual(v.containsRubricCard, true, 'Must render review engine and rubric score');
    assert.ok(v.tablesCount >= 2, 'Must render at least 2 tables (Evidence library table + Portfolio index table)');

    console.log('\n✅ Phase 2: Live Browser CDP Verification Passed 100%!');
    console.log('🎉 ALL VCEP SESSION 21 TRANSFORMATIONS VERIFIED SUCCESSFULLY!\n');

    ws.close();
  } finally {
    chrome.kill();
  }
}

async function main() {
  await runStaticVerification();
  await runBrowserVerification();
}

main().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
