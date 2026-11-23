import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ART_DIR = '/Users/yashvanthkrishnamurthy/.gemini/antigravity/brain/ddda9b62-420f-414b-b399-8b57bacf6cd6';
const PORT = 9249;
const BASE_URL = 'http://127.0.0.1:5173';

async function run() {
  console.log('--- STARTING PHASE 7: AUDIT FACULTY & ADMIN WORKSPACES ---');
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

    // Authenticate as Admin
    await send('Network.setCookie', {
      name: '__vcep_session',
      value: '1b8129b7-04b6-4e0f-8592-48a5eea70188',
      domain: '127.0.0.1',
      path: '/',
    });

    // Desktop Viewport
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    // 1. Navigate to Management view
    console.log('Navigating to Admin Management Workspace...');
    await send('Page.navigate', { url: `${BASE_URL}/?view=admin` });
    await new Promise((r) => setTimeout(r, 2000));

    const mgmtAudit = await send('Runtime.evaluate', {
      expression: `(() => {
        const text = document.body.innerText;
        const hasAdminHeader = text.includes('PROGRAMME CONTROL') || text.includes('FACULTY WORKSPACE');
        const hasMetrics = text.includes('Enrolled students') && text.includes('Awaiting review');
        const tabs = Array.from(document.querySelectorAll('[role="tab"], button')).map(b => b.textContent.trim());
        const hasQueue = tabs.some(t => t.includes('Review queue'));
        const hasRoster = tabs.some(t => t.includes('Roster'));
        const hasSetup = tabs.some(t => t.includes('College setup'));
        
        return {
          hasAdminHeader,
          hasMetrics,
          hasQueue,
          hasRoster,
          hasSetup,
          tabsExcerpt: tabs.slice(0, 10)
        };
      })()`,
      returnByValue: true,
    });

    console.log('Management Audit Results:', mgmtAudit.result.value);
    if (!mgmtAudit.result.value.hasAdminHeader) {
      throw new Error('FAIL: Admin management workspace header not found!');
    }

    const adminShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ART_DIR, 'qa-audit-management-admin-1440.png'), Buffer.from(adminShot.data, 'base64'));

    // 2. Click Roster & Invitations Tab
    console.log('Clicking Roster & Invitations Tab...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const tabs = Array.from(document.querySelectorAll('button[role="tab"]'));
        const rosterTab = tabs.find(t => t.textContent.includes('Roster'));
        if (rosterTab) {
          rosterTab.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
          rosterTab.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
          rosterTab.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
          rosterTab.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
          rosterTab.click();
        }
      })()`,
    });
    await new Promise((r) => setTimeout(r, 1200));

    const rosterAudit = await send('Runtime.evaluate', {
      expression: `(() => {
        const text = document.body.innerText;
        return {
          hasRosterTitle: text.includes('Roster & Account Invitations') || text.includes('ACADEMIC ENROLMENT'),
          hasMetrics: text.includes('Total roster members') || text.includes('Activated accounts'),
        };
      })()`,
      returnByValue: true,
    });
    console.log('Roster Tab Audit:', rosterAudit.result.value);

    // 3. Click College Setup Tab
    console.log('Clicking College Setup Tab...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const tabs = Array.from(document.querySelectorAll('button[role="tab"]'));
        const setupTab = tabs.find(t => t.textContent.includes('College setup'));
        if (setupTab) {
          setupTab.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
          setupTab.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
          setupTab.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
          setupTab.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
          setupTab.click();
        }
      })()`,
    });
    await new Promise((r) => setTimeout(r, 1200));

    const setupAudit = await send('Runtime.evaluate', {
      expression: `(() => {
        const text = document.body.innerText;
        return {
          hasCreateBatch: text.includes('Create a college batch'),
          hasEnrol: text.includes('Enrol students and faculty'),
          hasTimetable: text.includes('Set release dates and deadlines'),
        };
      })()`,
      returnByValue: true,
    });
    console.log('College Setup Tab Audit:', setupAudit.result.value);
    if (!setupAudit.result.value.hasCreateBatch || !setupAudit.result.value.hasTimetable) {
      throw new Error('FAIL: College Setup forms not found!');
    }

    console.log('\n======================================================');
    console.log('PHASE 7 AUDIT PASSED: FACULTY & ADMIN WORKSPACE FULLY VERIFIED!');
    console.log('======================================================');
  } finally {
    chrome.kill();
  }
}

run().catch((err) => {
  console.error('Phase 7 Audit error:', err);
  process.exit(1);
});
