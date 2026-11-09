import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const outDir = '/Users/yashvanthkrishnamurthy/.gemini/antigravity/brain/c24b0aa2-5861-4add-bc2b-11103ce642b4/screenshots';

async function main() {
  console.log('Capturing authenticated Guided Learning & Vivi screenshots...\n');

  const PORT = 9322;
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--user-data-dir=/tmp/chrome-vivi-auth-snap-2',
    'about:blank',
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
    const tabs = await listRes.json();
    const ws = new WebSocket(tabs[0].webSocketDebuggerUrl);

    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const reqId = id++;
        const handler = (msg) => {
          const data = JSON.parse(msg.data);
          if (data.id === reqId) {
            ws.removeEventListener('message', handler);
            resolve(data.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: reqId, method, params }));
      });
    }

    await new Promise((r) => (ws.onopen = r));
    await send('Page.enable');
    await send('Runtime.enable');
    await send('DOM.enable');
    await send('Network.enable');

    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2,
      mobile: false,
    });

    // Set authenticated session cookie
    console.log('Setting authenticated session cookie...');
    await send('Network.setCookie', {
      name: '__vcep_session',
      value: 'test_session_123',
      domain: '127.0.0.1',
      path: '/',
    });

    // 1. Navigate directly to Guided Learning Session 01
    console.log('Navigating to /guided-learning?session=1...');
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/guided-learning?session=1' });
    await new Promise((r) => setTimeout(r, 3500));

    // 2. Open Vivi Chat
    const openRes = await send('Runtime.evaluate', {
      expression: `
        const btn = document.querySelector(".vivi-trigger-btn");
        if (btn) {
          btn.click();
          "VIVI_OPENED";
        } else {
          "NO_BTN: " + document.body.innerHTML.substring(0, 300);
        }
      `,
    });
    console.log('Vivi Open Result:', openRes.result.value);
    await new Promise((r) => setTimeout(r, 1500));

    // Capture Vivi with Primary Suggestions
    const primarySnap = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(outDir, 'vivi-smart-suggestions-primary.png'), Buffer.from(primarySnap.data, 'base64'));
    console.log('Saved vivi-smart-suggestions-primary.png');

    // 3. Click "All 12+ questions" to open drawer
    const drawerRes = await send('Runtime.evaluate', {
      expression: `
        const tbtn = document.querySelector(".vivi-suggestions-toggle-btn");
        if (tbtn) {
          tbtn.click();
          "DRAWER_OPENED";
        } else {
          "NO_TOGGLE_BTN";
        }
      `,
    });
    console.log('Drawer Toggle Result:', drawerRes.result.value);
    await new Promise((r) => setTimeout(r, 1200));

    const drawerSnap = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(outDir, 'vivi-smart-suggestions-drawer.png'), Buffer.from(drawerSnap.data, 'base64'));
    console.log('Saved vivi-smart-suggestions-drawer.png');

    // 4. Click a suggestion card to ask question and see response with Quick Actions & Follow-ups
    const askRes = await send('Runtime.evaluate', {
      expression: `
        const card = document.querySelector(".vivi-suggestion-card-item");
        if (card) {
          card.click();
          "CARD_CLICKED";
        } else {
          "NO_CARD";
        }
      `,
    });
    console.log('Ask card result:', askRes.result.value);

    // Wait for Vivi to stream response and show follow-ups
    await new Promise((r) => setTimeout(r, 5000));

    const conversationSnap = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(outDir, 'vivi-quick-actions-and-followups.png'), Buffer.from(conversationSnap.data, 'base64'));
    console.log('Saved vivi-quick-actions-and-followups.png');

    ws.close();
  } finally {
    chrome.kill();
  }
}

main().catch(console.error);
