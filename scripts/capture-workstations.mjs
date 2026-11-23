import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ART_DIR = '/Users/yashvanthkrishnamurthy/.gemini/antigravity/brain/ddda9b62-420f-414b-b399-8b57bacf6cd6';
const SESSION_COOKIE = 'f36a0b0c-a612-440a-ba18-b4156ec6e683';
const PORT = 9245;

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

    // Set authenticated session cookie
    await send('Network.setCookie', {
      name: '__vcep_session',
      value: SESSION_COOKIE,
      domain: 'localhost',
      path: '/',
    });

    const sessionsToCapture = [
      { id: 1, name: 'session-01' },
      { id: 2, name: 'session-02' },
      { id: 3, name: 'session-03' },
      { id: 4, name: 'session-04' },
      { id: 5, name: 'session-05' },
      { id: 6, name: 'session-06' },
      { id: 7, name: 'session-07' },
    ];

    for (const s of sessionsToCapture) {
      console.log(`\nNavigating to Session ${s.id} Workstation...`);

      // 1. Desktop Viewport (1440x1200)
      await send('Emulation.setDeviceMetricsOverride', {
        width: 1440,
        height: 1200,
        deviceScaleFactor: 1,
        mobile: false,
      });

      await send('Page.navigate', { url: `http://localhost:5173/guided-learning?session=${s.id}&section=Work` });
      await new Promise((r) => setTimeout(r, 2200));

      const desktopShot = await send('Page.captureScreenshot', { format: 'png' });
      const desktopPath = path.join(ART_DIR, `${s.name}-desktop-1440.png`);
      fs.writeFileSync(desktopPath, Buffer.from(desktopShot.data, 'base64'));
      console.log(`Saved ${s.name}-desktop-1440.png`);

      // 2. Mobile Viewport (390x844) for all sessions
      await send('Emulation.setDeviceMetricsOverride', {
        width: 390,
        height: 844,
        deviceScaleFactor: 2,
        mobile: true,
      });
      await new Promise((r) => setTimeout(r, 1200));

      const mobileShot = await send('Page.captureScreenshot', { format: 'png' });
      const mobilePath = path.join(ART_DIR, `${s.name}-mobile-390.png`);
      fs.writeFileSync(mobilePath, Buffer.from(mobileShot.data, 'base64'));
      console.log(`Saved ${s.name}-mobile-390.png`);
    }

    console.log('\nAll visual verification screenshots captured successfully!');
  } finally {
    chrome.kill();
  }
}

run().catch((err) => {
  console.error('Screenshot capture error:', err);
  process.exit(1);
});
