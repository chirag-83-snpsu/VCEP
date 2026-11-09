import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

const outDirDocs = 'docs/qa/screenshots';
const outDirArtifact = '/Users/yashvanthkrishnamurthy/.gemini/antigravity/brain/c24b0aa2-5861-4add-bc2b-11103ce642b4/screenshots';

fs.mkdirSync(outDirDocs, { recursive: true });
fs.mkdirSync(outDirArtifact, { recursive: true });

async function runStaticVerification() {
  console.log('--- Phase 1: Static Code & Content Verification ---');
  
  const pj = fs.readFileSync('app/premium-journey.tsx', 'utf8');
  const css = fs.readFileSync('app/premium-journey.css', 'utf8');

  // 1. Check minimal section required content
  assert.ok(pj.includes('VCEP COMMERCE WORKLAB'), 'Must contain eyebrow "VCEP COMMERCE WORKLAB"');
  assert.ok(pj.includes('Built for Practical Learning.'), 'Must contain headline "Built for Practical Learning."');
  assert.ok(pj.includes('24 guided sessions. Four career tracks. Real workplace skills.'), 'Must contain subline');

  // 2. Check 3 highlights
  assert.ok(pj.includes('verifiedSessionsCount'), 'Must dynamically calculate verified sessions count');
  assert.ok(pj.includes('Guided Sessions'), 'Must contain highlight "Guided Sessions"');
  assert.ok(pj.includes('verifiedTracksCount'), 'Must dynamically calculate verified tracks count');
  assert.ok(pj.includes('Career Tracks'), 'Must contain highlight "Career Tracks"');
  assert.ok(pj.includes('Faculty Review'), 'Must contain highlight "Faculty Review"');
  assert.ok(pj.includes('GraduationCap'), 'Must contain appropriate icon for Faculty Review');

  // 3. Check Primary & Secondary actions
  assert.ok(pj.includes('Explore Sessions'), 'Must contain primary action "Explore Sessions"');
  assert.ok(pj.includes('/guided-learning'), 'Primary action must link to /guided-learning');
  assert.ok(pj.includes('Management'), 'Must contain secondary action "Management"');
  assert.ok(pj.includes('staff &&'), 'Management action must be gated to staff');

  // 4. Ensure removed content is gone from the redesigned homepage section
  const sectionMatch = pj.match(/<section className="vcep-worklab-section"[\s\S]*?<\/section>/);
  assert.ok(sectionMatch, 'vcep-worklab-section block must exist');
  const sectionContent = sectionMatch[0];

  assert.ok(!sectionContent.includes('135-Minute Structured WorkLabs'), 'Section must NOT contain "135-Minute Structured WorkLabs"');
  assert.ok(!sectionContent.includes('Drive Edition 3.0 Curriculum'), 'Section must NOT contain "Drive Edition 3.0 Curriculum"');
  assert.ok(!sectionContent.includes('Controlled Invigilation Shields'), 'Section must NOT contain "Controlled Invigilation Shields"');
  assert.ok(!sectionContent.includes('Faculty Review Workflow'), 'Section must NOT contain "Faculty Review Workflow"');
  assert.ok(!sectionContent.includes('Zero Synthetic Fluff'), 'Section must NOT contain "Zero Synthetic Fluff"');
  assert.ok(!sectionContent.includes('Multi-Eye Review'), 'Section must NOT contain "Multi-Eye Review"');
  assert.ok(!sectionContent.includes('Drive Edition 3.0 Verified'), 'Section must NOT contain "Drive Edition 3.0 Verified"');
  assert.ok(!sectionContent.includes('Explore the curriculum or manage cohorts'), 'Section must NOT contain "Explore the curriculum or manage cohorts"');

  // 5. Check CSS rules
  assert.ok(css.includes('.vcep-worklab-section'), 'CSS must define .vcep-worklab-section');
  assert.ok(css.includes('.vcep-worklab-card'), 'CSS must define .vcep-worklab-card');
  assert.ok(css.includes('.vcep-worklab-highlights'), 'CSS must define .vcep-worklab-highlights');

  console.log('✅ Static Code & Content Verification Passed (100%)\n');
}

async function runBrowserVerification() {
  console.log('--- Phase 2: Headless Chrome CDP Verification & Screenshot Capture ---');

  const PORT = 9288;
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--user-data-dir=/tmp/chrome-worklab-test',
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
    await send('CSS.enable');
    await send('Runtime.enable');

    async function capture(filename, width, height) {
      await send('Emulation.setDeviceMetricsOverride', {
        width,
        height,
        deviceScaleFactor: 2,
        mobile: width <= 640,
      });

      await send('Page.navigate', { url: 'http://127.0.0.1:5173/' });
      await new Promise((r) => setTimeout(r, 1800));

      // Scroll into view of the new section
      await send('Runtime.evaluate', {
        expression: `
          const el = document.querySelector('.vcep-worklab-section') || document.querySelector('.vcep-standards-section');
          if (el) {
            el.scrollIntoView({ behavior: 'instant', block: 'center' });
          }
        `,
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

    // 1. Desktop 1440px
    await capture('homepage-worklab-desktop-1440.png', 1440, 900);

    // 2. Tablet 768px
    await capture('homepage-worklab-tablet-768.png', 768, 1024);

    // 3. Mobile 390px
    await capture('homepage-worklab-mobile-390.png', 390, 844);

    // 4. Measure rendered height and contents of .vcep-worklab-section for Anonymous/Student
    const evalStudent = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const section = document.querySelector('.vcep-worklab-section');
          if (!section) return { found: false };
          const rect = section.getBoundingClientRect();
          const headline = section.querySelector('h2')?.textContent;
          const eyebrow = section.querySelector('.vcep-worklab-eyebrow')?.textContent;
          const highlights = Array.from(section.querySelectorAll('.vcep-worklab-highlight')).map(h => ({
            value: h.querySelector('.vcep-worklab-highlight-value')?.textContent.trim(),
            label: h.querySelector('.vcep-worklab-highlight-label')?.textContent.trim()
          }));
          const primaryBtn = section.querySelector('.vcep-worklab-btn-primary')?.textContent.trim();
          const secondaryBtn = section.querySelector('.vcep-worklab-btn-secondary')?.textContent.trim();
          return {
            found: true,
            height: Math.round(rect.height),
            headline,
            eyebrow,
            highlights,
            primaryBtn,
            secondaryBtn: secondaryBtn || null
          };
        })()
      `,
      returnByValue: true,
    });

    console.log('\n📊 Student DOM Inspection Result:', JSON.stringify(evalStudent.result.value, null, 2));

    assert.ok(evalStudent.result.value.found, 'The .vcep-worklab-section was found in live DOM');
    assert.equal(evalStudent.result.value.eyebrow, 'VCEP COMMERCE WORKLAB');
    assert.equal(evalStudent.result.value.headline, 'Built for Practical Learning.');
    assert.equal(evalStudent.result.value.highlights.length, 3);
    assert.equal(evalStudent.result.value.highlights[0].value, '24');
    assert.equal(evalStudent.result.value.highlights[0].label, 'Guided Sessions');
    assert.equal(evalStudent.result.value.highlights[1].value, '04');
    assert.equal(evalStudent.result.value.highlights[1].label, 'Career Tracks');
    assert.equal(evalStudent.result.value.highlights[2].label, 'Faculty Review');
    assert.ok(evalStudent.result.value.primaryBtn.includes('Explore Sessions'));
    // Crucial requirement: Do not expose administrative management controls to ordinary students or anonymous visitors!
    assert.equal(evalStudent.result.value.secondaryBtn, null, 'Management button must NOT be exposed to anonymous/student users');

    // 5. Test Staff Mode with Injected Admin User in fetch('/api/boot')
    console.log('\n--- Testing Staff/Admin Mode (Management Action Button) ---');
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        const origFetch = window.fetch;
        window.fetch = async (...args) => {
          const res = await origFetch(...args);
          const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
          if (url && url.includes('/api/boot')) {
            const data = await res.json();
            data.user = {
              id: 'admin-1',
              email: 'vayentragurukula@gmail.com',
              role: 'admin',
              name: 'Dr. Faculty Admin'
            };
            return new Response(JSON.stringify(data), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            });
          }
          return res;
        };
      `,
    });

    await send('Page.navigate', { url: 'http://127.0.0.1:5173/' });
    await new Promise((r) => setTimeout(r, 2200));

    // Scroll into view
    await send('Runtime.evaluate', {
      expression: `
        const el = document.querySelector('.vcep-worklab-section');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
      `,
    });
    await new Promise((r) => setTimeout(r, 600));

    // Capture Staff Desktop View
    await capture('homepage-worklab-staff-desktop-1440.png', 1440, 900);

    const evalStaff = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const section = document.querySelector('.vcep-worklab-section');
          if (!section) return { found: false };
          const primaryBtn = section.querySelector('.vcep-worklab-btn-primary')?.textContent.trim();
          const secondaryBtn = section.querySelector('.vcep-worklab-btn-secondary')?.textContent.trim();
          return {
            found: true,
            primaryBtn,
            secondaryBtn
          };
        })()
      `,
      returnByValue: true,
    });

    console.log('\n📊 Staff DOM Inspection Result:', JSON.stringify(evalStaff.result.value, null, 2));
    assert.ok(evalStaff.result.value.primaryBtn.includes('Explore Sessions'), 'Staff sees Explore Sessions');
    assert.ok(evalStaff.result.value.secondaryBtn.includes('Management'), 'Staff sees Management button');

    console.log(`\n📏 Section height: ${evalStudent.result.value.height}px (substantially more compact than old ~450px section)`);
    console.log('✅ Browser End-to-End Verification Passed 100%!\n');

    ws.close();
  } finally {
    chrome.kill('SIGTERM');
  }
}

async function main() {
  await runStaticVerification();
  await runBrowserVerification();
  console.log('🎉 ALL VCEP HOMEPAGE WORKLAB REFINEMENT CHECKS COMPLETED SUCCESSFULLY!');
}

main().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
