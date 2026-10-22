import * as THREE from 'three';
import { VCEP_3D_COLORS, disposeHierarchy, GraphicsTier } from './engine-utils';

export interface HeroSceneHandle {
  setPointer: (x: number, y: number) => void;
  destroy: () => void;
}

/**
 * Builds the 3D-01 Hero Scene: An ambient stylized commerce world
 * (ocean, cargo ship, warehouse, cranes, exchange tower, floating coins, animated charts).
 */
export function initHeroScene(
  container: HTMLElement,
  tier: GraphicsTier = 'Full'
): HeroSceneHandle {
  const isLight = tier === 'Light';
  const width = container.clientWidth || 800;
  const height = container.clientHeight || 360;

  // 1. Scene, Camera, Renderer
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a1f28);
  scene.fog = new THREE.FogExp2(0x0a1f28, 0.035);

  const camera = new THREE.PerspectiveCamera(40, width / height, 0.2, 100);
  camera.position.set(12, 11, 15);
  camera.lookAt(0, 1.5, 0);

  const renderer = new THREE.WebGLRenderer({
    antialias: !isLight,
    alpha: true,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isLight ? 1 : 1.75));
  renderer.setSize(width, height);
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  // 2. Lighting
  const ambientLight = new THREE.AmbientLight(0xd6e8ee, 1.6);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xfff1cf, 2.8);
  sunLight.position.set(10, 16, 8);
  scene.add(sunLight);

  const tealRimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
  tealRimLight.position.set(-10, 8, -10);
  scene.add(tealRimLight);

  // Root group for all objects
  const rootGroup = new THREE.Group();
  scene.add(rootGroup);

  // 3. Ocean Water with animated wave vertices
  const waveSegments = isLight ? 20 : 40;
  const waterGeo = new THREE.PlaneGeometry(36, 36, waveSegments, waveSegments);
  waterGeo.rotateX(-Math.PI / 2);
  const waterPos = waterGeo.attributes.position;
  const originalY = new Float32Array(waterPos.count);
  for (let i = 0; i < waterPos.count; i++) {
    originalY[i] = waterPos.getY(i);
  }

  const waterMat = new THREE.MeshStandardMaterial({
    color: VCEP_3D_COLORS.oceanSurface,
    roughness: 0.2,
    metalness: 0.1,
    flatShading: true,
  });
  const waterMesh = new THREE.Mesh(waterGeo, waterMat);
  waterMesh.position.set(0, -0.4, 0);
  rootGroup.add(waterMesh);

  // 4. Port Quay & Infrastructure (The Mainland Hub)
  const quayGeo = new THREE.BoxGeometry(10, 1.4, 12);
  const quayMat = new THREE.MeshStandardMaterial({
    color: VCEP_3D_COLORS.quayConcrete,
    roughness: 0.85,
  });
  const quay = new THREE.Mesh(quayGeo, quayMat);
  quay.position.set(-5, 0.3, 0);
  rootGroup.add(quay);

  // Quay edge line (hazard yellow/gold strip)
  const hazardGeo = new THREE.BoxGeometry(0.3, 0.1, 12);
  const hazardMat = new THREE.MeshStandardMaterial({ color: VCEP_3D_COLORS.goldPrimary, roughness: 0.5 });
  const hazardLine = new THREE.Mesh(hazardGeo, hazardMat);
  hazardLine.position.set(0.05, 1.05, 0);
  rootGroup.add(hazardLine);

  // Roadway on quay
  const roadGeo = new THREE.BoxGeometry(3, 0.05, 10);
  const roadMat = new THREE.MeshStandardMaterial({ color: VCEP_3D_COLORS.roadAsphalt, roughness: 0.9 });
  const road = new THREE.Mesh(roadGeo, roadMat);
  road.position.set(-4.5, 1.03, 0);
  rootGroup.add(road);

  // Logistics Warehouse
  const warehouseGroup = new THREE.Group();
  const whMain = new THREE.Mesh(
    new THREE.BoxGeometry(3.6, 2.2, 4),
    new THREE.MeshStandardMaterial({ color: 0x1f4754, roughness: 0.6 })
  );
  whMain.position.set(0, 1.1, 0);
  warehouseGroup.add(whMain);

  // Arched/sloped roof
  const whRoof = new THREE.Mesh(
    new THREE.CylinderGeometry(2.3, 2.3, 4, 3, 1, false, 0, Math.PI),
    new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.4 })
  );
  whRoof.rotation.z = Math.PI / 2;
  whRoof.rotation.y = Math.PI / 2;
  whRoof.position.set(0, 2.2, 0);
  warehouseGroup.add(whRoof);

  warehouseGroup.position.set(-7.5, 1.0, -2.5);
  rootGroup.add(warehouseGroup);

  // Dock Cranes (Stylized low-poly gantry cranes)
  function createCrane(x: number, z: number) {
    const crane = new THREE.Group();
    // Legs
    const legMat = new THREE.MeshStandardMaterial({ color: 0xe67e22, roughness: 0.5 });
    const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 3, 0.18), legMat);
    leg1.position.set(-0.5, 1.5, -0.5);
    const leg2 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 3, 0.18), legMat);
    leg2.position.set(0.5, 1.5, -0.5);
    const leg3 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 3, 0.18), legMat);
    leg3.position.set(-0.5, 1.5, 0.5);
    const leg4 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 3, 0.18), legMat);
    leg4.position.set(0.5, 1.5, 0.5);
    crane.add(leg1, leg2, leg3, leg4);

    // Boom arm
    const boom = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.3, 0.5), legMat);
    boom.position.set(0.8, 3.1, 0);
    crane.add(boom);

    // Pulley cable & spreader
    const cable = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 1.2),
      new THREE.MeshBasicMaterial({ color: 0x222222 })
    );
    cable.position.set(1.6, 2.4, 0);
    const spreader = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.2, 0.5),
      new THREE.MeshStandardMaterial({ color: 0xd4af37 })
    );
    spreader.position.set(1.6, 1.7, 0);
    crane.add(cable, spreader);

    crane.position.set(x, 1.0, z);
    return crane;
  }

  rootGroup.add(createCrane(-0.8, -3.2));
  rootGroup.add(createCrane(-0.8, 2.4));

  // Small Delivery Truck
  const truckGroup = new THREE.Group();
  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.7, 0.8),
    new THREE.MeshStandardMaterial({ color: 0xf3cf65 })
  );
  cabin.position.set(0.6, 0.45, 0);
  const trailer = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.9, 0.85),
    new THREE.MeshStandardMaterial({ color: 0x164656 })
  );
  trailer.position.set(-0.35, 0.55, 0);
  truckGroup.add(cabin, trailer);
  truckGroup.position.set(-4.5, 1.05, 1.5);
  rootGroup.add(truckGroup);

  // 5. Container Cargo Ship (Rocking on the ocean)
  const shipGroup = new THREE.Group();
  // Hull
  const hullGeo = new THREE.BoxGeometry(6.5, 1.2, 2.2);
  const hullMat = new THREE.MeshStandardMaterial({ color: 0x152f38, roughness: 0.7 });
  const hull = new THREE.Mesh(hullGeo, hullMat);
  hull.position.set(0, 0.5, 0);
  shipGroup.add(hull);

  // Bow wedge
  const bow = new THREE.Mesh(
    new THREE.ConeGeometry(1.2, 1.6, 4),
    new THREE.MeshStandardMaterial({ color: 0x152f38 })
  );
  bow.rotation.z = -Math.PI / 2;
  bow.rotation.y = Math.PI / 4;
  bow.position.set(3.8, 0.5, 0);
  shipGroup.add(bow);

  // Bridge / Superstructure
  const bridge = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 1.4, 1.8),
    new THREE.MeshStandardMaterial({ color: 0xf8faf9, roughness: 0.4 })
  );
  bridge.position.set(-2.2, 1.7, 0);
  const funnel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 0.7),
    new THREE.MeshStandardMaterial({ color: 0xd4af37 })
  );
  funnel.position.set(-2.3, 2.7, 0);
  shipGroup.add(bridge, funnel);

  // Stacked Shipping Containers
  const containerColors = [0x145369, 0xd97706, 0x0f172a, 0xb91c1c, 0x059669];
  let colorIdx = 0;
  for (let cx = -1.2; cx <= 1.8; cx += 1.05) {
    for (let cz = -0.55; cz <= 0.55; cz += 0.6) {
      for (let cy = 0; cy < 2; cy++) {
        // Randomize top layer slightly
        if (cy === 1 && Math.sin(cx * 5 + cz) > 0.4) continue;
        const box = new THREE.Mesh(
          new THREE.BoxGeometry(0.95, 0.45, 0.5),
          new THREE.MeshStandardMaterial({
            color: containerColors[colorIdx++ % containerColors.length],
            roughness: 0.5,
          })
        );
        box.position.set(cx, 1.35 + cy * 0.48, cz);
        shipGroup.add(box);
      }
    }
  }

  shipGroup.position.set(3.8, 0.1, -0.5);
  rootGroup.add(shipGroup);

  // 6. Central Commerce Exchange Tower & Glass Podium
  const towerGroup = new THREE.Group();
  // Lower Podium
  const podium = new THREE.Mesh(
    new THREE.BoxGeometry(3, 1.5, 3),
    new THREE.MeshStandardMaterial({ color: 0x1d4653, roughness: 0.4 })
  );
  podium.position.set(0, 0.75, 0);

  // Upper Tower
  const towerBody = new THREE.Mesh(
    new THREE.BoxGeometry(2, 4.5, 2),
    new THREE.MeshStandardMaterial({
      color: 0x0e2f3b,
      roughness: 0.2,
      metalness: 0.3,
    })
  );
  towerBody.position.set(0, 3.5, 0);

  // Golden Spire
  const spire = new THREE.Mesh(
    new THREE.ConeGeometry(0.4, 2.2, 8),
    new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.2 })
  );
  spire.position.set(0, 6.8, 0);

  towerGroup.add(podium, towerBody, spire);
  towerGroup.position.set(-6.5, 1.0, 3.5);
  rootGroup.add(towerGroup);

  // 7. Floating Rotating Commerce Coins
  const coins: THREE.Mesh[] = [];
  const coinGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.1, 16);
  const coinMat = new THREE.MeshStandardMaterial({
    color: 0xf3cf65,
    metalness: 0.85,
    roughness: 0.15,
  });

  const coinPositions = [
    [-3.5, 3.5, 3.0],
    [-2.0, 4.2, -1.0],
    [1.5, 3.8, 3.5],
    [-5.0, 4.8, 0.5],
  ];

  coinPositions.forEach(([x, y, z], i) => {
    const coin = new THREE.Mesh(coinGeo, coinMat);
    coin.rotation.x = Math.PI / 2;
    coin.position.set(x, y, z);
    coin.userData.initialY = y;
    coin.userData.phase = i * 1.5;
    rootGroup.add(coin);
    coins.push(coin);
  });

  // 8. Dynamic 3D Trend Bar Charts (Rising/Falling Columns)
  const chartBars: THREE.Mesh[] = [];
  const chartGeo = new THREE.BoxGeometry(0.4, 1, 0.4);
  const chartColors = [0x059669, 0x10b981, 0xd4af37, 0x38bdf8];

  for (let i = 0; i < 4; i++) {
    const bar = new THREE.Mesh(
      chartGeo,
      new THREE.MeshStandardMaterial({
        color: chartColors[i],
        roughness: 0.3,
        metalness: 0.2,
      })
    );
    bar.position.set(-2.5 + i * 0.55, 1.5, 4.8);
    bar.userData.initialHeight = 1.0 + i * 0.5;
    bar.userData.phase = i * 0.9;
    rootGroup.add(bar);
    chartBars.push(bar);
  }

  // 9. Parallax & Animation Loop
  let mouseX = 0;
  let mouseY = 0;
  let targetCamX = 12;
  let targetCamY = 11;
  let animationFrameId = 0;
  let clock = new THREE.Clock();
  let isRunning = true;

  const setPointer = (normX: number, normY: number) => {
    mouseX = normX;
    mouseY = normY;
    targetCamX = 12 + mouseX * 2.5;
    targetCamY = 11 - mouseY * 1.8;
  };

  const animate = () => {
    if (!isRunning) return;
    const elapsed = clock.getElapsedTime();

    // Smooth camera parallax
    camera.position.x += (targetCamX - camera.position.x) * 0.04;
    camera.position.y += (targetCamY - camera.position.y) * 0.04;
    camera.lookAt(0, 1.2, 0);

    // Wave animation
    if (!isLight) {
      const pos = waterGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i);
        const v = pos.getZ(i);
        const wave = Math.sin(u * 0.5 + elapsed * 1.8) * 0.12 +
                     Math.cos(v * 0.6 + elapsed * 1.4) * 0.09;
        pos.setY(i, originalY[i] + wave);
      }
      pos.needsUpdate = true;
    }

    // Ship rocking
    shipGroup.rotation.z = Math.sin(elapsed * 1.5) * 0.04;
    shipGroup.rotation.x = Math.cos(elapsed * 1.2) * 0.025;
    shipGroup.position.y = 0.1 + Math.sin(elapsed * 1.8) * 0.05;

    // Coins rotation & bobbing
    coins.forEach((coin) => {
      coin.rotation.z += 0.02;
      coin.position.y = coin.userData.initialY + Math.sin(elapsed * 2 + coin.userData.phase) * 0.15;
    });

    // Chart columns oscillation
    chartBars.forEach((bar) => {
      const scaleY = Math.max(
        0.4,
        bar.userData.initialHeight + Math.sin(elapsed * 1.6 + bar.userData.phase) * 0.4
      );
      bar.scale.y = scaleY;
      bar.position.y = 1.0 + scaleY / 2;
    });

    // Truck subtle movement back and forth
    truckGroup.position.z = 1.5 + Math.sin(elapsed * 0.5) * 1.8;

    renderer.render(scene, camera);
    animationFrameId = requestAnimationFrame(animate);
  };

  animate();

  // Resize listener
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
    setPointer,
    destroy: () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      disposeHierarchy(scene);
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    },
  };
}
