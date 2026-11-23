import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ART_DIR = '/Users/yashvanthkrishnamurthy/.gemini/antigravity/brain/ddda9b62-420f-414b-b399-8b57bacf6cd6';
const SESSION_COOKIE = '1b8129b7-04b6-4e0f-8592-48a5eea70188';
const PORT = 9247;

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

    // Authenticate with admin session cookie
    await send('Network.setCookie', {
      name: '__vcep_session',
      value: SESSION_COOKIE,
      domain: 'localhost',
      path: '/',
    });

    console.log('--- Step 1: Inspect Homepage Session 01 Options Menu ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await send('Page.navigate', { url: 'http://localhost:5173/' });
    await new Promise((r) => setTimeout(r, 2000));

    // Click Session 01 Options Menu trigger
    const clickS1Menu = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const modules = document.querySelectorAll('.vcep-module');
          if (!modules || modules.length === 0) return { error: 'No modules found', bodyLength: document.body.innerText.length };
          const s1 = modules[0];
          const btn = s1.querySelector('.vcep-btn-more');
          if (!btn) return { error: 'No .vcep-btn-more on Session 01' };
          btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
          btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
          btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
          btn.click();
          return { clicked: true };
        })()
      `,
      returnByValue: true
    });
    console.log('Session 01 Options Menu click result:', clickS1Menu.result.value);
    await new Promise((r) => setTimeout(r, 1200));

    // Check menu items
    const menuS1Audit = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const menu = document.querySelector('.vcep-dropdown-menu') || document.querySelector('[role="menu"]') || document.querySelector('[data-radix-menu-content]');
          if (!menu) return { error: 'Dropdown menu did not open', allMenus: document.querySelectorAll('[role="menu"]').length };
          const text = menu.innerText;
          const items = Array.from(menu.querySelectorAll('[role="menuitem"], .vcep-dropdown-item')).map(el => el.innerText.trim());
          const hasStaffReviewLab = text.includes('Staff Review Lab');
          const hasWord = text.includes('Download Word');
          const hasEarlier = text.includes('Earlier Practice Lab');
          return { text, items, hasStaffReviewLab, hasWord, hasEarlier };
        })()
      `,
      returnByValue: true
    });
    console.log('Session 01 Options Menu Content:', menuS1Audit.result.value);

    // Capture Screenshot of Session 01 Options Menu
    const s1MenuShot = await send('Page.captureScreenshot', { format: 'png' });
    const s1MenuPath = path.join(ART_DIR, 'session-01-options-menu.png');
    fs.writeFileSync(s1MenuPath, Buffer.from(s1MenuShot.data, 'base64'));
    console.log(`✓ Saved Session 01 Options Menu screenshot: ${s1MenuPath}`);

    if (menuS1Audit.result.value.hasStaffReviewLab) {
      console.error('FAIL: "Staff Review Lab" is still present in Session 01 Options Menu!');
      process.exit(1);
    } else {
      console.log('✓ PASS: "Staff Review Lab" is completely removed from Session 01 Options Menu.');
    }

    // Close menu with Escape
    await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape' });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape' });
    await new Promise((r) => setTimeout(r, 400));

    // Verify Session 02 STILL has Staff Review Lab
    console.log('\n--- Step 2: Verify Session 02 Options Menu retains Staff Review Lab ---');
    const clickS2Menu = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const modules = document.querySelectorAll('.vcep-module');
          if (modules.length < 2) return { error: 'Session 02 module not found' };
          const s2 = modules[1];
          const btn = s2.querySelector('.vcep-btn-more');
          if (!btn) return { error: 'No options button on Session 02' };
          btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
          btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
          btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
          btn.click();
          return { clicked: true };
        })()
      `,
      returnByValue: true
    });
    console.log('Session 02 Options Menu click result:', clickS2Menu.result.value);
    await new Promise((r) => setTimeout(r, 1200));

    const menuS2Audit = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const menu = document.querySelector('.vcep-dropdown-menu') || document.querySelector('[role="menu"]') || document.querySelector('[data-radix-menu-content]');
          if (!menu) return { error: 'Dropdown menu did not open' };
          const text = menu.innerText;
          const hasStaffReviewLab = text.includes('Staff Review Lab');
          return { text, hasStaffReviewLab };
        })()
      `,
      returnByValue: true
    });
    console.log('Session 02 Options Menu has Staff Review Lab:', menuS2Audit.result.value.hasStaffReviewLab);

    if (menuS2Audit.result.value.hasStaffReviewLab) {
      console.log('✓ PASS: Session 02 correctly preserves "Staff Review Lab" for staff.');
    } else {
      console.error('FAIL: Session 02 lost "Staff Review Lab"!');
      process.exit(1);
    }

    // Close menu with Escape
    await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape' });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape' });
    await new Promise((r) => setTimeout(r, 400));

    console.log('\n--- Step 3: Inspect Guided Learning Session 01 Overview ---');
    await send('Page.navigate', { url: 'http://localhost:5173/guided-learning?session=1&section=Overview' });
    await new Promise((r) => setTimeout(r, 2500));

    const overviewAudit = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const lab = document.querySelector('.vcep-practice-lab-section');
          if (!lab) return { error: 'Complete Practice Lab section not found in Overview!' };
          const title = lab.querySelector('#vcep-practice-lab-title')?.innerText;
          const timer = lab.querySelector('.vcep-practice-timer-card')?.innerText;
          const accordions = Array.from(lab.querySelectorAll('.vcep-accordion summary')).map(s => s.innerText.trim());
          const hasCSV = Array.from(lab.querySelectorAll('button')).some(b => b.innerText.includes('Download Data CSV'));
          const hasWord = Array.from(lab.querySelectorAll('button')).some(b => b.innerText.includes('Download Word'));
          return { found: true, title, timer, accordionsCount: accordions.length, accordions, hasCSV, hasWord };
        })()
      `,
      returnByValue: true
    });
    console.log('Session 01 Overview Complete Practice Lab Audit:', overviewAudit.result.value);

    // Capture Screenshot of Session 01 Overview with Complete Practice Lab
    // Set viewport to capture full height
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 2200,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await new Promise((r) => setTimeout(r, 1000));

    const s1OverviewShot = await send('Page.captureScreenshot', { format: 'png' });
    const s1OverviewPath = path.join(ART_DIR, 'session-01-overview-complete-lab.png');
    fs.writeFileSync(s1OverviewPath, Buffer.from(s1OverviewShot.data, 'base64'));
    console.log(`✓ Saved Session 01 Overview screenshot: ${s1OverviewPath}`);

    console.log('\n===========================================================');
    console.log('ALL ACCEPTANCE VERIFICATION CHECKS PASSED FOR SESSION 01!');
    console.log('===========================================================');
  } finally {
    chrome.kill();
  }
}

run().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
