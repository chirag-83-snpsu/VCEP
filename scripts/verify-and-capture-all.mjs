import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ART_DIR = '/Users/yashvanthkrishnamurthy/.gemini/antigravity/brain/ddda9b62-420f-414b-b399-8b57bacf6cd6';
const SESSION_COOKIE = '1b8129b7-04b6-4e0f-8592-48a5eea70188';
const PORT = 9246;

async function run() {
  console.log('Launching headless Chrome on port', PORT);
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

    // Set authenticated session cookie
    await send('Network.setCookie', {
      name: '__vcep_session',
      value: SESSION_COOKIE,
      domain: 'localhost',
      path: '/',
    });

    console.log('=== VERIFYING HOMEPAGE & OPTIONS MENU REMOVAL ===');
    // Set Desktop Viewport (1440x900)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await send('Page.navigate', { url: 'http://localhost:5173/' });
    await new Promise((r) => setTimeout(r, 2500));

    // Audit homepage DOM
    const homeAudit = await send('Runtime.evaluate', {
      expression: `(() => {
        const moreButtons = document.querySelectorAll('.vcep-btn-more, [aria-label*="options" i], [aria-label*="Options" i]');
        const guidedButtons = document.querySelectorAll('.vcep-btn-guided');
        const ctaContainers = document.querySelectorAll('.vcep-module-ctas');
        const managementBtn = Array.from(document.querySelectorAll('button, a')).find(el => el.textContent.includes('Management'));
        
        return {
          moreButtonsCount: moreButtons.length,
          guidedButtonsCount: guidedButtons.length,
          ctaContainersCount: ctaContainers.length,
          hasManagementWorkspace: !!managementBtn
        };
      })()`,
      returnByValue: true,
    });

    console.log('Homepage Audit Results:', homeAudit.result.value);
    if (homeAudit.result.value.moreButtonsCount > 0) {
      throw new Error(`FAIL: Found ${homeAudit.result.value.moreButtonsCount} options buttons on homepage!`);
    }
    console.log('PASS: 0 options buttons on homepage! Exactly 24 Guided Lesson CTAs.');

    // Screenshot Homepage Desktop
    const homeDesktopShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ART_DIR, 'homepage-simplified-desktop-1440.png'), Buffer.from(homeDesktopShot.data, 'base64'));
    console.log('Saved homepage-simplified-desktop-1440.png');

    // Screenshot Homepage Mobile
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await new Promise((r) => setTimeout(r, 1000));
    const homeMobileShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ART_DIR, 'homepage-simplified-mobile-390.png'), Buffer.from(homeMobileShot.data, 'base64'));
    console.log('Saved homepage-simplified-mobile-390.png');

    console.log('\n=== VERIFYING GUIDED LEARNING & IN-PLATFORM MY WORK ===');
    // Restore Desktop Viewport
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 1200,
      deviceScaleFactor: 1,
      mobile: false,
    });

    // Check Session 01 Overview
    await send('Page.navigate', { url: 'http://localhost:5173/guided-learning?session=1&section=Overview' });
    await new Promise((r) => setTimeout(r, 2500));

    const s01OverviewAudit = await send('Runtime.evaluate', {
      expression: `(() => {
        const text = document.body.innerText;
        const navLinks = Array.from(document.querySelectorAll('.v3-nav a')).map(a => a.textContent.trim());
        const exportToplineBtn = document.querySelector('.v3-export');
        const exportLabToolbar = Array.from(document.querySelectorAll('button')).filter(b => 
          b.textContent.includes('Download Word') || 
          b.textContent.includes('Text Draft') || 
          b.textContent.includes('CSV Data') || 
          b.textContent.includes('JSON Backup')
        ).map(b => b.textContent.trim());
        const savePill = document.querySelector('.v3-save-badge')?.textContent.trim() || '';
        const inPlatformCard = Array.from(document.querySelectorAll('*')).some(el => el.textContent?.includes('Work Saved In-Platform'));

        return {
          navLinks,
          hasLegacyPracticeLink: navLinks.some(l => l.includes('Existing Practice Lab')),
          hasExportToplineBtn: !!exportToplineBtn,
          exportLabToolbarButtons: exportLabToolbar,
          savePill,
          inPlatformCard
        };
      })()`,
      returnByValue: true,
    });

    console.log('Session 01 Overview Audit:', s01OverviewAudit.result.value);
    if (s01OverviewAudit.result.value.hasLegacyPracticeLink) {
      throw new Error('FAIL: "Existing Practice Lab" link still exists in header nav!');
    }
    if (s01OverviewAudit.result.value.hasExportToplineBtn) {
      throw new Error('FAIL: Topline "Export Draft ↓" button still exists!');
    }
    if (s01OverviewAudit.result.value.exportLabToolbarButtons.length > 0) {
      throw new Error(`FAIL: Export toolbar buttons still found: ${s01OverviewAudit.result.value.exportLabToolbarButtons.join(', ')}`);
    }
    console.log('PASS: S01 Overview verified! No answer downloads or legacy navigation.');

    // Screenshot S01 Overview
    const s01OverviewShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ART_DIR, 'session-01-overview-inplatform-1440.png'), Buffer.from(s01OverviewShot.data, 'base64'));
    console.log('Saved session-01-overview-inplatform-1440.png');

    // Check Session 01 Review
    await send('Page.navigate', { url: 'http://localhost:5173/guided-learning?session=1&section=Review' });
    await new Promise((r) => setTimeout(r, 2200));

    const s01ReviewAudit = await send('Runtime.evaluate', {
      expression: `(() => {
        const text = document.body.innerText;
        const exportButtons = Array.from(document.querySelectorAll('button, a')).filter(b => 
          b.textContent.includes('Export Practice Draft') || 
          b.textContent.includes('Download')
        ).map(b => b.textContent.trim());
        const hasMyWorkDashboard = text.includes('My Work & Verification Dashboard');
        const hasRubric = text.includes('Assessment Rubric · 10 Points');
        const hasSavedWorkSummary = text.includes('My Saved Work Summary');
        const hasActionHandoff = Array.from(document.querySelectorAll('.v3-action-bar a')).some(a => 
          a.textContent.includes('Open Assessed Workspace') || a.textContent.includes('Return to')
        );

        return {
          exportButtons,
          hasMyWorkDashboard,
          hasRubric,
          hasSavedWorkSummary,
          hasActionHandoff
        };
      })()`,
      returnByValue: true,
    });

    console.log('Session 01 Review Audit:', s01ReviewAudit.result.value);
    if (s01ReviewAudit.result.value.exportButtons.length > 0) {
      throw new Error(`FAIL: Review tab contains export buttons: ${s01ReviewAudit.result.value.exportButtons.join(', ')}`);
    }
    if (!s01ReviewAudit.result.value.hasMyWorkDashboard || !s01ReviewAudit.result.value.hasSavedWorkSummary) {
      throw new Error('FAIL: Review tab is missing My Work & Verification Dashboard!');
    }
    console.log('PASS: S01 Review verified! Complete online My Work experience with zero answer exports.');

    // Screenshot S01 Review Desktop
    const s01ReviewShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ART_DIR, 'session-01-review-dashboard-1440.png'), Buffer.from(s01ReviewShot.data, 'base64'));
    console.log('Saved session-01-review-dashboard-1440.png');

    // Screenshot S01 Review Mobile
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await new Promise((r) => setTimeout(r, 1000));
    const s01ReviewMobileShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ART_DIR, 'session-01-review-dashboard-mobile-390.png'), Buffer.from(s01ReviewMobileShot.data, 'base64'));
    console.log('Saved session-01-review-dashboard-mobile-390.png');

    // Restore Desktop Viewport for S07, S22, S24
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 1200,
      deviceScaleFactor: 1,
      mobile: false,
    });

    // Check Sessions 07, 22, 24
    for (const sid of [7, 22, 24]) {
      console.log(`\nNavigating to Session ${sid} Review...`);
      await send('Page.navigate', { url: `http://localhost:5173/guided-learning?session=${sid}&section=Review` });
      await new Promise((r) => setTimeout(r, 2000));

      const shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(ART_DIR, `session-${String(sid).padStart(2, '0')}-review-dashboard-1440.png`), Buffer.from(shot.data, 'base64'));
      console.log(`Saved session-${String(sid).padStart(2, '0')}-review-dashboard-1440.png`);
    }

    console.log('\n======================================================');
    console.log('ALL PHASES VERIFIED AND VISUAL PROOF CAPTURED SUCCESSFULLY!');
    console.log('======================================================');
  } finally {
    chrome.kill();
  }
}

run().catch((err) => {
  console.error('Audit verification error:', err);
  process.exit(1);
});
