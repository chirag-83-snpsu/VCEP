import fs from 'node:fs';
import { spawn } from 'node:child_process';

const ART = '/Users/yashvanthkrishnamurthy/.gemini/antigravity/brain/c24b0aa2-5861-4add-bc2b-11103ce642b4/screenshots';

async function main() {
  console.log('Verifying Vivi AI Smart Suggestions UI via Chrome CDP...\n');

  const PORT = 9355;
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--user-data-dir=/tmp/chrome-vivi-ui-verify',
    'about:blank',
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const listRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
    const tabs = await listRes.json();
    const pageTab = tabs.find((t) => t.type === 'page');
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
    await send('Network.enable');

    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    // Authenticate with session cookie
    await send('Network.setCookie', {
      name: '__vcep_session',
      value: 'test_session_123',
      url: 'http://127.0.0.1:5173',
    });

    console.log('Navigating to Guided Learning Session 01...');
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/guided-learning?session=1' });
    await new Promise((r) => setTimeout(r, 3000));

    // Open Vivi panel
    console.log('Clicking .vivi-fab...');
    await send('Runtime.evaluate', {
      expression: 'document.querySelector(".vivi-fab")?.click()',
    });
    await new Promise((r) => setTimeout(r, 1000));

    // Verify panel open
    const panelCheck = await send('Runtime.evaluate', {
      expression: 'Boolean(document.querySelector(".vivi-panel"))',
    });
    console.log('Vivi Conversation Panel open:', panelCheck.result.value);

    // Capture primary suggestions
    const shot1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ART}/vivi-smart-suggestions-primary.png`, Buffer.from(shot1.data, 'base64'));
    console.log(`Saved primary suggestions screenshot to ${ART}/vivi-smart-suggestions-primary.png`);

    // Click "All 12+ questions"
    console.log('Clicking .vivi-suggestions-toggle-btn...');
    await send('Runtime.evaluate', {
      expression: 'document.querySelector(".vivi-suggestions-toggle-btn")?.click()',
    });
    await new Promise((r) => setTimeout(r, 1000));

    // Capture expanded drawer
    const shot2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ART}/vivi-smart-suggestions-drawer.png`, Buffer.from(shot2.data, 'base64'));
    console.log(`Saved suggestions drawer screenshot to ${ART}/vivi-smart-suggestions-drawer.png`);

    // Click one suggestion card to send a query to Vivi!
    console.log('Clicking suggestion card to ask question...');
    await send('Runtime.evaluate', {
      expression: 'document.querySelector(".vivi-suggestion-card-item")?.click()',
    });

    // Wait for response to stream and follow-ups to render
    await new Promise((r) => setTimeout(r, 6000));

    const shot3 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ART}/vivi-quick-actions-and-followups.png`, Buffer.from(shot3.data, 'base64'));
    console.log(`Saved response with quick actions screenshot to ${ART}/vivi-quick-actions-and-followups.png`);

    ws.close();
  } finally {
    chrome.kill('SIGTERM');
  }

  console.log('\nVivi Smart Suggestions UI Verification Complete!\n');
}

main().catch(console.error);
