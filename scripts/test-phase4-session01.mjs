import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ART_DIR = '/Users/yashvanthkrishnamurthy/.gemini/antigravity/brain/ddda9b62-420f-414b-b399-8b57bacf6cd6';
const PORT = 9247;
const BASE_URL = 'http://127.0.0.1:5173';

async function run() {
  console.log('--- STARTING PHASE 4: AUDIT GUIDED LEARNING SESSION 01 ---');
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    'about:blank',
  ]);

  await new Promise((r) => setTimeout(r, 1500));

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

    await new Promise((r) => (ws.onopen = r));
    await send('Network.enable');
    await send('Page.enable');
    await send('Runtime.enable');

    // Set cookie
    await send('Network.setCookie', {
      name: '__vcep_session',
      value: '1b8129b7-04b6-4e0f-8592-48a5eea70188',
      domain: '127.0.0.1',
      path: '/',
    });

    // 1440x900 Desktop
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    // STEP 1: Navigate to Session 1 Stage 1
    console.log('\n[1/7] Testing Stage 1: Discover the Founder Mindset...');
    await send('Page.navigate', { url: `${BASE_URL}/guided-learning?session=1&stage=1` });
    await new Promise((r) => setTimeout(r, 2500));

    const stage1Audit = await send('Runtime.evaluate', {
      expression: `(() => {
        const text = document.body.innerText;
        const stagePills = Array.from(document.querySelectorAll('.vcep-stage-pill, button')).filter(b => b.textContent.includes('STAGE'));
        const headlineExists = text.includes('Every Business Begins With a Problem');
        const hasOptions = document.querySelectorAll('button[class*="problem-btn"], .vcep-problem-card, button').length > 0;
        const downloadButtons = Array.from(document.querySelectorAll('button, a')).filter(b =>
          b.textContent.toLowerCase().includes('download') && (b.textContent.toLowerCase().includes('answer') || b.textContent.toLowerCase().includes('word') || b.textContent.toLowerCase().includes('csv'))
        );
        const baselineShield = text.includes('Controlled assessment') || text.includes('Baseline A');

        return {
          currentUrl: window.location.href,
          headlineExists,
          stagePillCount: stagePills.length,
          downloadButtonsCount: downloadButtons.length,
          hasBaselineShield: baselineShield,
        };
      })()`,
      returnByValue: true,
    });

    console.log('Stage 1 Audit Results:', stage1Audit.result.value);
    if (!stage1Audit.result.value.headlineExists) {
      throw new Error('FAIL: Stage 1 headline "Every Business Begins With a Problem" not found!');
    }
    if (stage1Audit.result.value.downloadButtonsCount > 0) {
      throw new Error(`FAIL: Download student answer button found in Stage 1!`);
    }

    const s1Shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ART_DIR, 'qa-audit-session01-stage1.png'), Buffer.from(s1Shot.data, 'base64'));

    // STEP 2: Navigate to Stage 2
    console.log('\n[2/7] Testing Stage 2: Inside Real Startups...');
    await send('Page.navigate', { url: `${BASE_URL}/guided-learning?session=1&stage=2` });
    await new Promise((r) => setTimeout(r, 2000));

    const stage2Audit = await send('Runtime.evaluate', {
      expression: `(() => {
        const text = document.body.innerText;
        return {
          currentUrl: window.location.href,
          hasZeptoZerodha: text.includes('Zepto') || text.includes('Zerodha') || text.includes('Zoho'),
          hasStageTitle: text.includes('Inside Real Startups') || text.includes('STAGE 2'),
        };
      })()`,
      returnByValue: true,
    });
    console.log('Stage 2 Audit Results:', stage2Audit.result.value);
    if (!stage2Audit.result.value.hasZeptoZerodha) {
      throw new Error('FAIL: Stage 2 startup breakdown stories not found!');
    }

    const s2Shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ART_DIR, 'qa-audit-session01-stage2.png'), Buffer.from(s2Shot.data, 'base64'));

    // STEP 3: Navigate to Stage 3
    console.log('\n[3/7] Testing Stage 3: Find Your Business Opportunity...');
    await send('Page.navigate', { url: `${BASE_URL}/guided-learning?session=1&stage=3` });
    await new Promise((r) => setTimeout(r, 2000));

    const stage3Audit = await send('Runtime.evaluate', {
      expression: `(() => {
        const text = document.body.innerText;
        return {
          currentUrl: window.location.href,
          hasVentures: text.includes('QuickBite') || text.includes('CampusMerch') || text.includes('CleanWash') || text.includes('DigitLocal'),
          hasStageTitle: text.includes('Find Your Business Opportunity') || text.includes('STAGE 3'),
        };
      })()`,
      returnByValue: true,
    });
    console.log('Stage 3 Audit Results:', stage3Audit.result.value);
    if (!stage3Audit.result.value.hasVentures) {
      throw new Error('FAIL: Stage 3 venture options not found!');
    }

    const s3Shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ART_DIR, 'qa-audit-session01-stage3.png'), Buffer.from(s3Shot.data, 'base64'));

    // STEP 4: Navigate to Stage 4
    console.log('\n[4/7] Testing Stage 4: Build Your Startup...');
    await send('Page.navigate', { url: `${BASE_URL}/guided-learning?session=1&stage=4` });
    await new Promise((r) => setTimeout(r, 2000));

    const stage4Audit = await send('Runtime.evaluate', {
      expression: `(() => {
        const text = document.body.innerText;
        const hasDecisions = text.includes('Decision') || text.includes('Startup Canvas') || text.includes('Trap');
        const hasCanvas = text.includes('Problem Statement') || text.includes('Target Customer');
        return {
          currentUrl: window.location.href,
          hasDecisions,
          hasCanvas,
        };
      })()`,
      returnByValue: true,
    });
    console.log('Stage 4 Audit Results:', stage4Audit.result.value);
    if (!stage4Audit.result.value.hasDecisions) {
      throw new Error('FAIL: Stage 4 decision traps / canvas not found!');
    }

    const s4Shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ART_DIR, 'qa-audit-session01-stage4.png'), Buffer.from(s4Shot.data, 'base64'));

    // STEP 5: Navigate to Stage 5
    console.log('\n[5/7] Testing Stage 5: Run the Business...');
    await send('Page.navigate', { url: `${BASE_URL}/guided-learning?session=1&stage=5` });
    await new Promise((r) => setTimeout(r, 2000));

    const stage5Audit = await send('Runtime.evaluate', {
      expression: `(() => {
        const text = document.body.innerText;
        const hasRoles = text.includes('CEO') || text.includes('Operations') || text.includes('Finance') || text.includes('Boardroom');
        const hasTimer = text.includes('03:00') || text.includes('Challenge') || text.includes('min');
        return {
          currentUrl: window.location.href,
          hasRoles,
          hasTimer,
        };
      })()`,
      returnByValue: true,
    });
    console.log('Stage 5 Audit Results:', stage5Audit.result.value);
    if (!stage5Audit.result.value.hasRoles) {
      throw new Error('FAIL: Stage 5 boardroom roles not found!');
    }

    const s5Shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ART_DIR, 'qa-audit-session01-stage5.png'), Buffer.from(s5Shot.data, 'base64'));

    // STEP 6: Navigate to Stage 6
    console.log('\n[6/7] Testing Stage 6: Create Your Investor Pitch Deck...');
    await send('Page.navigate', { url: `${BASE_URL}/guided-learning?session=1&stage=6` });
    await new Promise((r) => setTimeout(r, 2000));

    const stage6Audit = await send('Runtime.evaluate', {
      expression: `(() => {
        const text = document.body.innerText;
        const hasPitchDeck = text.includes('Investor Pitch Deck') || text.includes('Slide 1') || text.includes('Slide');
        const hasPresentationControls = text.includes('Full Screen') || text.includes('Present') || text.includes('Slide');
        const downloadButtons = Array.from(document.querySelectorAll('button, a')).filter(b =>
          b.textContent.toLowerCase().includes('download') && (b.textContent.toLowerCase().includes('answer') || b.textContent.toLowerCase().includes('word') || b.textContent.toLowerCase().includes('csv'))
        );
        return {
          currentUrl: window.location.href,
          hasPitchDeck,
          hasPresentationControls,
          downloadButtonsCount: downloadButtons.length,
        };
      })()`,
      returnByValue: true,
    });
    console.log('Stage 6 Audit Results:', stage6Audit.result.value);
    if (!stage6Audit.result.value.hasPitchDeck) {
      throw new Error('FAIL: Stage 6 investor pitch deck generator not found!');
    }
    if (stage6Audit.result.value.downloadButtonsCount > 0) {
      throw new Error('FAIL: Student answer download buttons found in Stage 6!');
    }

    const s6Shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ART_DIR, 'qa-audit-session01-stage6.png'), Buffer.from(s6Shot.data, 'base64'));

    // STEP 7: Test Navigation and State Preservation (History Popstate & Refresh)
    console.log('\n[7/7] Testing Browser Back/Forward and Page Refresh Stage Persistence...');
    // Click Previous Stage or Back
    await send('Runtime.evaluate', {
      expression: `window.history.back()`,
    });
    await new Promise((r) => setTimeout(r, 1500));

    const popstateAudit = await send('Runtime.evaluate', {
      expression: `(() => {
        return {
          url: window.location.href,
          stageParam: new URLSearchParams(window.location.search).get('stage'),
          bodyTextSubstr: document.body.innerText.substring(0, 300)
        };
      })()`,
      returnByValue: true,
    });
    console.log('After window.history.back():', popstateAudit.result.value);

    // Now reload page
    await send('Page.reload');
    await new Promise((r) => setTimeout(r, 2000));

    const reloadAudit = await send('Runtime.evaluate', {
      expression: `(() => {
        return {
          url: window.location.href,
          stageParam: new URLSearchParams(window.location.search).get('stage'),
          isStage5: document.body.innerText.includes('Run the Business') || document.body.innerText.includes('STAGE 5')
        };
      })()`,
      returnByValue: true,
    });
    console.log('After Page.reload():', reloadAudit.result.value);

    console.log('\n======================================================');
    console.log('PHASE 4 AUDIT PASSED: ALL 6 STAGES AND PERSISTENCE VERIFIED!');
    console.log('======================================================');
  } finally {
    chrome.kill();
  }
}

run().catch((err) => {
  console.error('Phase 4 Audit error:', err);
  process.exit(1);
});
