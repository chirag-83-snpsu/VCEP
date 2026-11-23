import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const outDir = '/Users/yashvanthkrishnamurthy/.gemini/antigravity/brain/c24b0aa2-5861-4add-bc2b-11103ce642b4/screenshots';

async function main() {
  console.log('Capturing responsive screenshots of Official Submission & Assessment Station...\n');

  // 1. Obtain real authenticated session cookie
  const loginRes = await fetch('http://127.0.0.1:5173/api/auth/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'http://127.0.0.1:5173' },
    body: JSON.stringify({
      email: 'demo-student@vayentra.edu',
      password: 'DemoStudent@VCEP2026!',
    }),
  });
  const cookieHeader = loginRes.headers.get('set-cookie');
  const sessionToken = cookieHeader.match(/__vcep_session=([^;]+)/)[1];
  console.log('Authenticated session token acquired:', sessionToken);

  const PORT = 9444;
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--user-data-dir=/tmp/chrome-vcep-submission-snap',
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
    await send('Network.enable');

    // Set authenticated cookie
    await send('Network.setCookie', {
      name: '__vcep_session',
      value: sessionToken,
      domain: '127.0.0.1',
      path: '/',
    });

    const viewports = [
      { name: 'desktop-1440', width: 1440, height: 900, mobile: false },
      { name: 'tablet-768', width: 768, height: 1024, mobile: true },
      { name: 'mobile-390', width: 390, height: 844, mobile: true },
    ];

    for (const vp of viewports) {
      console.log(`Setting viewport: ${vp.name} (${vp.width}x${vp.height})...`);
      await send('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 2,
        mobile: vp.mobile,
      });

      console.log('Navigating to /guided-learning?session=7...');
      await send('Page.navigate', { url: 'http://127.0.0.1:5173/guided-learning?session=7' });
      await new Promise((r) => setTimeout(r, 3500));

      // Scroll to submission station
      await send('Runtime.evaluate', {
        expression: `
          const el = document.getElementById("vcep-official-submission-station");
          if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
        `,
      });
      await new Promise((r) => setTimeout(r, 1000));

      console.log(`Capturing screenshot for ${vp.name}...`);
      const snap = await send('Page.captureScreenshot', { format: 'png' });
      const filename = `s07-submission-station-${vp.name}.png`;
      const filePath = path.join(outDir, filename);
      fs.writeFileSync(filePath, Buffer.from(snap.data, 'base64'));
      console.log(`Saved screenshot: ${filePath}`);
    }

    console.log('\nAll submission station screenshots successfully captured.');
  } finally {
    chrome.kill('SIGKILL');
  }
}

main().catch((err) => {
  console.error('Screenshot capture failed:', err);
  process.exit(1);
});
