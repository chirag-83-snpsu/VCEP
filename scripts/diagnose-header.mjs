import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const ART_DIR = '/Users/yashvanthkrishnamurthy/.gemini/antigravity/brain/ddda9b62-420f-414b-b399-8b57bacf6cd6';
const PORT = 9255;
const BASE_URL = 'http://127.0.0.1:5173';

async function main() {
  console.log('--- DIAGNOSING VCEP HOMEPAGE HEADER ---');
  
  const sessionToken = '47e588f0-49f8-41c9-b90d-ddf7b93693f0';
  console.log('Authenticated admin session token configured.');

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
      value: sessionToken,
      domain: '127.0.0.1',
      path: '/',
      httpOnly: true,
    });

    // 1440px Desktop
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await send('Page.navigate', { url: `${BASE_URL}/` });
    await new Promise((r) => setTimeout(r, 2000));

    // Capture initial top screenshot
    const topShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ART_DIR, 'header-before-desktop-top.png'), Buffer.from(topShot.data, 'base64'));

    // Inspect header metrics
    const headerInfo = await send('Runtime.evaluate', {
      expression: `(() => {
        const h = document.querySelector('.vcep-header');
        if (!h) return null;
        const rect = h.getBoundingClientRect();
        const style = window.getComputedStyle(h);
        const actions = Array.from(h.querySelectorAll('.vcep-header-actions > *')).map(el => ({
          tag: el.tagName,
          text: el.innerText.trim(),
          width: el.getBoundingClientRect().width,
          classes: el.className
        }));
        return {
          headerWidth: rect.width,
          headerHeight: rect.height,
          headerTop: rect.top,
          position: style.position,
          top: style.top,
          zIndex: style.zIndex,
          background: style.background,
          backdropFilter: style.backdropFilter || style.webkitBackdropFilter,
          actions
        };
      })()`,
      returnByValue: true
    });
    console.log('Top Header Metrics:', JSON.stringify(headerInfo.result.value, null, 2));

    // Scroll down 400px
    await send('Runtime.evaluate', { expression: `window.scrollTo({ top: 400, behavior: 'instant' });` });
    await new Promise((r) => setTimeout(r, 500));

    const scrolledShot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(ART_DIR, 'header-before-desktop-scrolled.png'), Buffer.from(scrolledShot.data, 'base64'));

    const scrolledHeaderInfo = await send('Runtime.evaluate', {
      expression: `(() => {
        const h = document.querySelector('.vcep-header');
        if (!h) return null;
        const rect = h.getBoundingClientRect();
        return {
          headerTop: rect.top,
          headerHeight: rect.height,
          scrollY: window.scrollY
        };
      })()`,
      returnByValue: true
    });
    console.log('Scrolled Header Metrics (scrollY=400):', JSON.stringify(scrolledHeaderInfo.result.value, null, 2));

    ws.close();
  } finally {
    chrome.kill();
    process.exit(0);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
