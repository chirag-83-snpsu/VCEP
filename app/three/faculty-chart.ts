import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { disposeHierarchy, GraphicsTier } from './engine-utils';

export interface SessionMetric {
  sessionId: number;
  title: string;
  submittedCount: number;
  meanScore: number; // 0 to 10
}

export interface FacultyChartHandle {
  destroy: () => void;
}

/**
 * 3D-08: Faculty Analytics 3D Chart
 * Interactive 3D bar matrix representing cohort performance across all 24 sessions.
 */
export function initFacultyChart(
  container: HTMLElement,
  metrics: SessionMetric[],
  tier: GraphicsTier = 'Full'
): FacultyChartHandle {
  const isLight = tier === 'Light';
  const width = container.clientWidth || 700;
  const height = container.clientHeight || 360;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a1e27);

  const camera = new THREE.PerspectiveCamera(40, width / height, 0.2, 100);
  camera.position.set(14, 12, 16);

  const renderer = new THREE.WebGLRenderer({
    antialias: !isLight,
    alpha: true,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isLight ? 1 : 1.75));
  renderer.setSize(width, height);
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.maxDistance = 35;
  controls.minDistance = 6;
  controls.target.set(0, 1.5, 0);

  // Lighting
  const ambient = new THREE.AmbientLight(0xdff0f6, 1.8);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight(0xfff1cf, 2.5);
  sun.position.set(12, 18, 10);
  scene.add(sun);

  const chartGroup = new THREE.Group();
  scene.add(chartGroup);

  // Grid Plinth
  const plinthGeo = new THREE.BoxGeometry(16, 0.4, 6);
  const plinthMat = new THREE.MeshStandardMaterial({ color: 0x143440, roughness: 0.8 });
  const plinth = new THREE.Mesh(plinthGeo, plinthMat);
  plinth.position.y = -0.2;
  chartGroup.add(plinth);

  // 24 sessions arranged in 2 rows of 12 (or 1 row of 24)
  // Let's do 4 rows of 6 sessions (matching the 4 districts)
  const barMeshes: THREE.Mesh[] = [];
  const maxSubmitted = Math.max(1, ...metrics.map((m) => m.submittedCount));

  for (let sId = 1; sId <= 24; sId++) {
    const m = metrics.find((x) => x.sessionId === sId) || {
      sessionId: sId,
      title: `Session ${sId}`,
      submittedCount: 0,
      meanScore: 0,
    };

    const row = Math.floor((sId - 1) / 6); // 0 to 3 (Z axis)
    const col = (sId - 1) % 6;            // 0 to 5 (X axis)

    const posX = -6.0 + col * 2.4;
    const posZ = -1.8 + row * 1.2;

    // Height reflects mean score (0 to 10 mapped to 0.4 to 3.5)
    const heightNorm = m.meanScore > 0 ? (m.meanScore / 10) * 3.0 : (m.submittedCount / maxSubmitted) * 1.5 + 0.3;
    const barHeight = Math.max(0.3, heightNorm);

    // Color based on performance
    const color =
      m.meanScore >= 7.5
        ? 0x10b981 // Emerald
        : m.meanScore >= 5.0
        ? 0xf59e0b // Amber
        : m.submittedCount > 0
        ? 0x0ea5e9 // Cyan
        : 0x334e59; // Dark Slate

    const barGeo = new THREE.BoxGeometry(0.8, barHeight, 0.8);
    const barMat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.3,
      metalness: 0.3,
    });
    const bar = new THREE.Mesh(barGeo, barMat);
    bar.position.set(posX, barHeight / 2, posZ);
    bar.userData = { metric: m };
    chartGroup.add(bar);
    barMeshes.push(bar);

    // Golden cap
    const capGeo = new THREE.BoxGeometry(0.85, 0.08, 0.85);
    const capMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.7 });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.set(posX, barHeight + 0.04, posZ);
    chartGroup.add(cap);
  }

  // Hover Tooltip
  const tooltip = document.createElement('div');
  tooltip.style.position = 'absolute';
  tooltip.style.display = 'none';
  tooltip.style.padding = '8px 12px';
  tooltip.style.background = 'rgba(11, 37, 46, 0.95)';
  tooltip.style.color = '#fff';
  tooltip.style.border = '1px solid #d4af37';
  tooltip.style.borderRadius = '8px';
  tooltip.style.fontSize = '12px';
  tooltip.style.pointerEvents = 'none';
  tooltip.style.zIndex = '30';
  tooltip.style.boxShadow = '0 6px 20px rgba(0,0,0,0.5)';
  container.style.position = 'relative';
  container.appendChild(tooltip);

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const onPointerMove = (e: MouseEvent) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(barMeshes);

    if (hits.length > 0) {
      const topMesh = hits[0].object as THREE.Mesh;
      const m = topMesh.userData.metric as SessionMetric;
      if (m && tooltip) {
        tooltip.style.display = 'block';
        tooltip.style.left = `${e.clientX - rect.left + 15}px`;
        tooltip.style.top = `${e.clientY - rect.top - 30}px`;
        tooltip.innerHTML = `
          <div style="color: #f3cf65; font-size: 10px; font-weight: bold;">SESSION ${String(m.sessionId).padStart(2, '0')}</div>
          <div style="font-weight: 600;">${m.title}</div>
          <div style="color: #94a3b8; margin-top: 4px;">Submitted: <b style="color: #fff">${m.submittedCount}</b> · Mean: <b style="color: #10b981">${m.meanScore > 0 ? m.meanScore.toFixed(1) + '/10' : '—'}</b></div>
        `;
      }
      renderer.domElement.style.cursor = 'pointer';
    } else {
      if (tooltip) tooltip.style.display = 'none';
      renderer.domElement.style.cursor = 'default';
    }
  };

  renderer.domElement.addEventListener('mousemove', onPointerMove);

  let frameId = 0;
  let isRunning = true;

  const animate = () => {
    if (!isRunning) return;
    controls.update();
    renderer.render(scene, camera);
    frameId = requestAnimationFrame(animate);
  };

  animate();

  const resizeObserver = new ResizeObserver(() => {
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight || 360;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
  resizeObserver.observe(container);

  return {
    destroy: () => {
      isRunning = false;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('mousemove', onPointerMove);
      controls.dispose();
      disposeHierarchy(scene);
      renderer.dispose();
      renderer.forceContextLoss();
      if (tooltip.parentNode) tooltip.parentNode.removeChild(tooltip);
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    },
  };
}
