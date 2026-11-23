import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ART_DIR = '/Users/yashvanthkrishnamurthy/.gemini/antigravity/brain/ddda9b62-420f-414b-b399-8b57bacf6cd6';
const PORT = 9255;
const BASE_URL = 'http://127.0.0.1:5173/guided-learning?session=1';

async function capture(send, name) {
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const outPath = path.join(ART_DIR, name);
  fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
  console.log(`Saved screenshot: ${name}`);
}

async function run() {
  console.log('Capturing verified responsive screenshots...');
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

    await send('Network.setCookie', {
      name: '__vcep_session',
      value: '1b8129b7-04b6-4e0f-8592-48a5eea70188',
      domain: '127.0.0.1',
      path: '/',
    });

    // 1. 1440x900 Desktop
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await send('Page.navigate', { url: `${BASE_URL}&stage=1` });
    await new Promise((r) => setTimeout(r, 2000));
    await capture(send, 'guided-learning-fixed-desktop-1440.png');

    // 2. 1920x1080 Ultrawide Desktop
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await send('Page.navigate', { url: `${BASE_URL}&stage=1` });
    await new Promise((r) => setTimeout(r, 1500));
    await capture(send, 'guided-learning-fixed-desktop-1920.png');

    // 3. 768x1024 Tablet
    await send('Emulation.setDeviceMetricsOverride', {
      width: 768,
      height: 1024,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await send('Page.navigate', { url: `${BASE_URL}&stage=1` });
    await new Promise((r) => setTimeout(r, 1500));
    await capture(send, 'guided-learning-fixed-tablet-768.png');

    // 4. 390x844 Mobile
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await send('Page.navigate', { url: `${BASE_URL}&stage=1` });
    await new Promise((r) => setTimeout(r, 1500));
    await capture(send, 'guided-learning-fixed-mobile-390.png');

    // 5. Stage 4 Founder Lab at 1440px
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await send('Page.navigate', { url: `${BASE_URL}&stage=4` });
    await new Promise((r) => setTimeout(r, 1500));
    await capture(send, 'guided-learning-fixed-stage4-1440.png');

    // 6. Stage 6 Investor Pitch Deck at 1440px
    await send('Page.navigate', { url: `${BASE_URL}&stage=6` });
    await new Promise((r) => setTimeout(r, 1500));
    await capture(send, 'guided-learning-fixed-stage6-1440.png');

    console.log('All screenshots captured successfully.');
  } finally {
    chrome.kill();
  }
}

run().catch(console.error);
