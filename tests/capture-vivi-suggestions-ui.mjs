import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const outDir = '/Users/yashvanthkrishnamurthy/.gemini/antigravity/brain/c24b0aa2-5861-4add-bc2b-11103ce642b4/screenshots';

async function main() {
  console.log('Capturing screenshots via Chrome DevTools Protocol...\n');

  const PORT = 9266;
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--user-data-dir=/tmp/chrome-vivi-sug-test',
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
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2,
      mobile: false,
    });

    // 1. Sign-in page
    console.log('Navigating to /signin...');
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/signin' });
    await new Promise((r) => setTimeout(r, 2000));

    const signinSnap = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(outDir, 'signin-cleaned-lockup.png'), Buffer.from(signinSnap.data, 'base64'));
    console.log('Saved signin-cleaned-lockup.png');

    // 2. Guided Learning page
    console.log('Navigating to /guided-learning...');
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/guided-learning' });
    await new Promise((r) => setTimeout(r, 2500));

    // Click Vivi trigger button
    await send('Runtime.evaluate', {
      expression: `document.querySelector('.vivi-trigger-btn')?.click()`,
    });
    await new Promise((r) => setTimeout(r, 1200));

    const viviPrimarySnap = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(outDir, 'vivi-smart-suggestions-primary.png'), Buffer.from(viviPrimarySnap.data, 'base64'));
    console.log('Saved vivi-smart-suggestions-primary.png');

    // Click "All 12+ questions"
    await send('Runtime.evaluate', {
      expression: `document.querySelector('.vivi-suggestions-toggle-btn')?.click()`,
    });
    await new Promise((r) => setTimeout(r, 1000));

    const viviDrawerSnap = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(outDir, 'vivi-smart-suggestions-drawer.png'), Buffer.from(viviDrawerSnap.data, 'base64'));
    console.log('Saved vivi-smart-suggestions-drawer.png');

    ws.close();
  } finally {
    chrome.kill();
  }
}

main().catch(console.error);
