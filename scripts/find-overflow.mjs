import { spawn } from 'node:child_process';

const PORT = 9252;
const URL = 'http://127.0.0.1:5173/guided-learning?session=1';

async function testViewport(send, width, height) {
  console.log(`\n=== TESTING VIEWPORT ${width}x${height} ===`);
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 768,
  });

  await send('Page.navigate', { url: URL });
  await new Promise((r) => setTimeout(r, 2000));

  const result = await send('Runtime.evaluate', {
    expression: `(() => {
      const winW = window.innerWidth;
      const docW = document.documentElement.scrollWidth;
      const shell = document.querySelector('.v3-shell')?.getBoundingClientRect();
      const content = document.querySelector('.v3-content')?.getBoundingClientRect();
      const track = document.querySelector('.vcep-journey-progress-track')?.getBoundingClientRect();
      const header = document.querySelector('.v3-header')?.getBoundingClientRect();
      const sidebar = document.querySelector('.v3-sidebar')?.getBoundingClientRect();
      
      const all = Array.from(document.querySelectorAll('*'));
      const overflowing = [];
      for (const el of all) {
        const r = el.getBoundingClientRect();
        if (r.right > winW + 1) {
          overflowing.push({
            tag: el.tagName,
            cls: String(el.className).substring(0, 40),
            right: Math.round(r.right),
            width: Math.round(r.width)
          });
        }
      }

      return {
        winW,
        docW,
        hasOverflow: docW > winW,
        overflowDelta: docW - winW,
        overflowCount: overflowing.length,
        headerLeft: header ? Math.round(header.left) : null,
        headerWidth: header ? Math.round(header.width) : null,
        shellLeft: shell ? Math.round(shell.left) : null,
        shellWidth: shell ? Math.round(shell.width) : null,
        sidebarLeft: sidebar ? Math.round(sidebar.left) : null,
        sidebarRight: sidebar ? Math.round(sidebar.right) : null,
        contentLeft: content ? Math.round(content.left) : null,
        contentWidth: content ? Math.round(content.width) : null,
        contentRight: content ? Math.round(content.right) : null,
        trackWidth: track ? Math.round(track.width) : null,
        trackRight: track ? Math.round(track.right) : null,
        overflowingSamples: overflowing.slice(0, 5)
      };
    })()`,
    returnByValue: true,
  });

  console.log(result.result.value);
}

async function run() {
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

    await testViewport(send, 1920, 1080);
    await testViewport(send, 1440, 900);
    await testViewport(send, 768, 1024);
    await testViewport(send, 390, 844);

  } finally {
    chrome.kill();
  }
}

run().catch(console.error);
