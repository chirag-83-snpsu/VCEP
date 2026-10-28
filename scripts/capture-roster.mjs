import fs from 'node:fs';
import { spawn } from 'node:child_process';

const ART = '/Users/yashvanthkrishnamurthy/.gemini/antigravity/brain/ddda9b62-420f-414b-b399-8b57bacf6cd6';

async function main() {
  const res = await fetch('http://localhost:5173/api/auth/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Origin': 'http://localhost:5173' },
    body: JSON.stringify({ email: process.env.ADMIN_EMAIL || 'vayentragurukula@gmail.com', password: process.env.ADMIN_PASSWORD || 'AdminVCEP2026!' }),
  });
  const cookieHeader = res.headers.get('set-cookie');
  const sessionToken = cookieHeader.match(/__vcep_session=([^;]+)/)[1];

  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9235',
    'about:blank',
  ]);

  await new Promise((r) => setTimeout(r, 1500));

  try {
    const listRes = await fetch('http://127.0.0.1:9235/json/list');
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

    await send('Network.setCookie', {
      name: '__vcep_session',
      value: sessionToken,
      domain: 'localhost',
      path: '/',
    });

    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 1650,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await send('Page.navigate', { url: 'http://localhost:5173/?view=admin' });
    await new Promise((r) => setTimeout(r, 2000));

    // Radix tabs need pointer event or click coordinates
    const tabRect = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = Array.from(document.querySelectorAll("[role=tab]")).find(t => t.textContent.includes("Roster"));
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
      })()`,
      returnByValue: true,
    });

    console.log('Tab coordinates:', tabRect?.result?.value);
    if (tabRect?.result?.value) {
      const { x, y } = tabRect.result.value;
      await send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
      await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });
    }

    await new Promise((r) => setTimeout(r, 1500));

    // Also trigger invite generation for student-alpha2@example.edu to capture the active invite box
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll("button"));
        const genBtn = btns.find(b => b.textContent.includes("Generate Invite"));
        if (genBtn) genBtn.click();
      })()`,
    });

    await new Promise((r) => setTimeout(r, 1200));

    // Capture desktop screenshot
    const shot1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ART}/roster-invitations-desktop-1440.png`, Buffer.from(shot1.data, 'base64'));
    console.log('Saved roster-invitations-desktop-1440.png');

    // Capture mobile screenshot
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 1100,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await new Promise((r) => setTimeout(r, 1200));
    const shot2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${ART}/roster-invitations-mobile-390.png`, Buffer.from(shot2.data, 'base64'));
    console.log('Saved roster-invitations-mobile-390.png');

    ws.close();
    chrome.kill();
  } catch (err) {
    console.error(err);
    chrome.kill();
  }
}

main();
