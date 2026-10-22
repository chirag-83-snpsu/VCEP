import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { VCEP_3D_COLORS, disposeHierarchy, GraphicsTier } from './engine-utils';

export interface SessionStatusMap {
  [sessionId: number]: {
    status: 'Locked' | 'Not started' | 'Draft' | 'Submitted' | 'Under review' | 'Graded' | 'Returned';
    score?: number;
    title: string;
    company?: string;
  };
}

export interface CityMapHandle {
  focusSession: (sessionId: number) => void;
  focusDistrict: (districtIdx: number) => void;
  resetView: () => void;
  updateStatuses: (statuses: SessionStatusMap) => void;
  destroy: () => void;
}

export const DISTRICT_INFO = [
  { id: 1, name: 'Accounting & Reporting', range: [1, 6], color: 0x1d586d, theme: 'Corporate & Banks' },
  { id: 2, name: 'Operations & Costing', range: [7, 12], color: 0xb45309, theme: 'Logistics & Hubs' },
  { id: 3, name: 'Finance & Taxation', range: [13, 18], color: 0x0f766e, theme: 'Towers & Markets' },
  { id: 4, name: 'Audit, AI & Strategy', range: [19, 24], color: 0x4338ca, theme: 'Innovation Campus' },
];

/**
 * 3D-02: 24-Session City Map
 * Renders the 24 commerce sessions as an interactive 3D city path across 4 districts.
 */
export function initCityMap(
  container: HTMLElement,
  sessions: any[],
  statusMap: SessionStatusMap,
  onSelect: (sessionId: number) => void,
  tier: GraphicsTier = 'Full'
): CityMapHandle {
  const isLight = tier === 'Light';
  const width = container.clientWidth || 800;
  const height = container.clientHeight || 420;

  // 1. Scene, Camera, Renderer
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a1c24);

  const camera = new THREE.PerspectiveCamera(40, width / height, 0.5, 150);
  const defaultCamPos = new THREE.Vector3(18, 16, 22);
  camera.position.copy(defaultCamPos);

  const renderer = new THREE.WebGLRenderer({
    antialias: !isLight,
    alpha: true,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isLight ? 1 : 1.75));
  renderer.setSize(width, height);
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  // 2. Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.maxPolarAngle = Math.PI / 2.15; // Don't flip under ground
  controls.minDistance = 6;
  controls.maxDistance = 45;
  controls.target.set(0, 1, 0);

  // 3. Lighting
  const ambientLight = new THREE.AmbientLight(0xdcf0f5, 1.8);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xfff3d6, 2.5);
  sunLight.position.set(15, 25, 12);
  scene.add(sunLight);

  const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
  fillLight.position.set(-15, 10, -12);
  scene.add(fillLight);

  // City Foundation Base Island
  const baseGroup = new THREE.Group();
  scene.add(baseGroup);

  const islandGeo = new THREE.CylinderGeometry(15, 16, 1.2, 8);
  const islandMat = new THREE.MeshStandardMaterial({
    color: 0x143542,
    roughness: 0.8,
  });
  const island = new THREE.Mesh(islandGeo, islandMat);
  island.position.y = -0.6;
  baseGroup.add(island);

  // Plinth rim
  const rimGeo = new THREE.TorusGeometry(15.2, 0.15, 8, 32);
  rimGeo.rotateX(Math.PI / 2);
  const rimMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8 });
  const rim = new THREE.Mesh(rimGeo, rimMat);
  rim.position.y = 0.02;
  baseGroup.add(rim);

  // City Grid Roads & Central Plaza
  const plazaGeo = new THREE.CylinderGeometry(3.5, 3.5, 0.05, 16);
  const plazaMat = new THREE.MeshStandardMaterial({ color: 0x1c4554, roughness: 0.5 });
  const plaza = new THREE.Mesh(plazaGeo, plazaMat);
  plaza.position.y = 0.03;
  baseGroup.add(plaza);

  // Central Compass Star in Plaza
  const compassGeo = new THREE.RingGeometry(1.2, 1.5, 8);
  compassGeo.rotateX(-Math.PI / 2);
  const compassMat = new THREE.MeshBasicMaterial({ color: 0xd4af37, side: THREE.DoubleSide });
  const compass = new THREE.Mesh(compassGeo, compassMat);
  compass.position.y = 0.06;
  baseGroup.add(compass);

  // Cross roads connecting the 4 districts
  const roadX = new THREE.Mesh(
    new THREE.BoxGeometry(26, 0.04, 1.4),
    new THREE.MeshStandardMaterial({ color: 0x122a33, roughness: 0.9 })
  );
  roadX.position.y = 0.02;
  baseGroup.add(roadX);

  const roadZ = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.04, 26),
    new THREE.MeshStandardMaterial({ color: 0x122a33, roughness: 0.9 })
  );
  roadZ.position.y = 0.02;
  baseGroup.add(roadZ);

  // 4. Build the 24 Buildings across 4 Districts
  const buildingMeshes: THREE.Mesh[] = [];
  const buildingBeacons: THREE.Mesh[] = [];
  const buildingMap = new Map<number, THREE.Group>();

  // District Centers (X, Z)
  const districtCenters = [
    { x: -6.5, z: -6.5 }, // District 1 (Top-Left)
    { x: 6.5, z: -6.5 },  // District 2 (Top-Right)
    { x: -6.5, z: 6.5 },  // District 3 (Bottom-Left)
    { x: 6.5, z: 6.5 },   // District 4 (Bottom-Right)
  ];

  // Offsets within a district for 6 buildings (2 rows × 3 cols)
  const localOffsets = [
    { x: -2.3, z: -2.0 },
    { x: 0.0, z: -2.0 },
    { x: 2.3, z: -2.0 },
    { x: -2.3, z: 2.0 },
    { x: 0.0, z: 2.0 },
    { x: 2.3, z: 2.0 },
  ];

  function getBuildingColors(status: string) {
    switch (status) {
      case 'Graded':
        return {
          wall: VCEP_3D_COLORS.emeraldGraded,
          glow: VCEP_3D_COLORS.goldPrimary,
          spire: 0xffd700,
          roughness: 0.2,
          metalness: 0.4,
        };
      case 'Submitted':
      case 'Under review':
        return {
          wall: VCEP_3D_COLORS.cyanSubmitted,
          glow: VCEP_3D_COLORS.cyanGlow,
          spire: 0x38bdf8,
          roughness: 0.3,
          metalness: 0.3,
        };
      case 'Draft':
        return {
          wall: VCEP_3D_COLORS.amberDraft,
          glow: VCEP_3D_COLORS.amberGlow,
          spire: 0xf59e0b,
          roughness: 0.4,
          metalness: 0.2,
        };
      case 'Returned':
        return {
          wall: VCEP_3D_COLORS.crimsonReturned,
          glow: 0xf87171,
          spire: 0xef4444,
          roughness: 0.3,
          metalness: 0.2,
        };
      case 'Locked':
        return {
          wall: 0x243b47,
          glow: 0x64748b,
          spire: 0x475569,
          roughness: 0.8,
          metalness: 0.1,
        };
      default: // Not started / Open
        return {
          wall: 0x4f7180,
          glow: 0xf5d061,
          spire: 0x94a3b8,
          roughness: 0.5,
          metalness: 0.2,
        };
    }
  }

  for (let sId = 1; sId <= 24; sId++) {
    const districtIdx = Math.floor((sId - 1) / 6);
    const localIdx = (sId - 1) % 6;
    const dCenter = districtCenters[districtIdx];
    const lOffset = localOffsets[localIdx];

    const posX = dCenter.x + lOffset.x;
    const posZ = dCenter.z + lOffset.z;

    const bInfo = statusMap[sId] || { status: 'Not started', title: `Session ${sId}` };
    const colors = getBuildingColors(bInfo.status);

    const bGroup = new THREE.Group();
    bGroup.position.set(posX, 0.05, posZ);

    // Height varies by progress status
    const height =
      bInfo.status === 'Graded'
        ? 3.2
        : bInfo.status === 'Submitted'
        ? 2.6
        : bInfo.status === 'Draft'
        ? 2.2
        : bInfo.status === 'Locked'
        ? 1.2
        : 1.6;

    // Building Main Tower Body
    const towerGeo = new THREE.BoxGeometry(1.4, height, 1.4);
    const towerMat = new THREE.MeshStandardMaterial({
      color: colors.wall,
      roughness: colors.roughness,
      metalness: colors.metalness,
    });
    const towerMesh = new THREE.Mesh(towerGeo, towerMat);
    towerMesh.position.y = height / 2;
    towerMesh.userData = { sessionId: sId };
    bGroup.add(towerMesh);
    buildingMeshes.push(towerMesh);

    // Roof Spire or Cap
    const capGeo =
      bInfo.status === 'Graded'
        ? new THREE.ConeGeometry(0.5, 1.2, 8)
        : new THREE.CylinderGeometry(0.3, 0.45, 0.4, 8);
    const capMat = new THREE.MeshStandardMaterial({
      color: colors.spire,
      metalness: 0.7,
      roughness: 0.2,
    });
    const capMesh = new THREE.Mesh(capGeo, capMat);
    capMesh.position.y = height + (bInfo.status === 'Graded' ? 0.6 : 0.2);
    capMesh.userData = { sessionId: sId };
    bGroup.add(capMesh);
    buildingMeshes.push(capMesh);

    // Beacon / Status Ring on Top
    const beaconGeo = new THREE.RingGeometry(0.55, 0.7, 16);
    beaconGeo.rotateX(-Math.PI / 2);
    const beaconMat = new THREE.MeshBasicMaterial({
      color: colors.glow,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
    beaconMesh.position.y = height + 0.05;
    beaconMesh.userData = {
      sessionId: sId,
      initialY: height + 0.05,
      pulse: sId * 0.4,
    };
    bGroup.add(beaconMesh);
    buildingBeacons.push(beaconMesh);

    // Number label pedestal at the foot of building
    const numGeo = new THREE.BoxGeometry(0.8, 0.2, 0.4);
    const numMat = new THREE.MeshStandardMaterial({ color: 0x0f242d });
    const numMesh = new THREE.Mesh(numGeo, numMat);
    numMesh.position.set(0, 0.1, 0.85);
    bGroup.add(numMesh);

    bGroup.userData = { sessionId: sId, districtIdx };
    baseGroup.add(bGroup);
    buildingMap.set(sId, bGroup);
  }

  // 5. District Title Signs
  DISTRICT_INFO.forEach((d, idx) => {
    const dCenter = districtCenters[idx];
    const signGroup = new THREE.Group();
    signGroup.position.set(dCenter.x, 0.1, dCenter.z > 0 ? dCenter.z + 3.8 : dCenter.z - 3.8);

    const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.6);
    const postMat = new THREE.MeshStandardMaterial({ color: 0xd4af37 });
    const post = new THREE.Mesh(postGeo, postMat);
    post.position.y = 0.3;
    signGroup.add(post);

    const plaqueGeo = new THREE.BoxGeometry(2.4, 0.4, 0.1);
    const plaqueMat = new THREE.MeshStandardMaterial({ color: d.color, roughness: 0.4 });
    const plaque = new THREE.Mesh(plaqueGeo, plaqueMat);
    plaque.position.y = 0.65;
    signGroup.add(plaque);

    baseGroup.add(signGroup);
  });

  // 6. Raycasting & Selection Interaction
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let hoveredMesh: THREE.Mesh | null = null;
  let hoveredOriginalColor: number = 0;

  // Floating hover label sprite
  let hoverTooltip: HTMLElement | null = document.createElement('div');
  hoverTooltip.style.position = 'absolute';
  hoverTooltip.style.display = 'none';
  hoverTooltip.style.padding = '8px 14px';
  hoverTooltip.style.background = 'rgba(11, 37, 46, 0.94)';
  hoverTooltip.style.color = '#ffffff';
  hoverTooltip.style.border = '1px solid #d4af37';
  hoverTooltip.style.borderRadius = '8px';
  hoverTooltip.style.fontSize = '12px';
  hoverTooltip.style.fontWeight = '600';
  hoverTooltip.style.pointerEvents = 'none';
  hoverTooltip.style.zIndex = '50';
  hoverTooltip.style.backdropFilter = 'blur(6px)';
  hoverTooltip.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)';
  container.style.position = 'relative';
  container.appendChild(hoverTooltip);

  const onPointerMove = (e: MouseEvent) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(buildingMeshes);

    if (intersects.length > 0) {
      const topMesh = intersects[0].object as THREE.Mesh;
      const sId = topMesh.userData.sessionId;

      if (topMesh !== hoveredMesh) {
        if (hoveredMesh && (hoveredMesh.material as THREE.MeshStandardMaterial)) {
          (hoveredMesh.material as THREE.MeshStandardMaterial).color.setHex(hoveredOriginalColor);
        }
        hoveredMesh = topMesh;
        const mat = topMesh.material as THREE.MeshStandardMaterial;
        hoveredOriginalColor = mat.color.getHex();
        mat.color.setHex(0xf3cf65); // Highlight gold
      }

      if (hoverTooltip && sId) {
        const info = statusMap[sId] || { status: 'Available', title: `Session ${sId}` };
        hoverTooltip.style.display = 'block';
        hoverTooltip.style.left = `${e.clientX - rect.left + 16}px`;
        hoverTooltip.style.top = `${e.clientY - rect.top - 36}px`;
        hoverTooltip.innerHTML = `
          <div style="color: #f3cf65; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;">SESSION ${String(sId).padStart(2, '0')}</div>
          <div style="font-size: 13px; font-weight: bold; margin: 2px 0;">${info.title}</div>
          <div style="color: #94a3b8; font-size: 11px;">Status: <b style="color: #ffffff">${info.status}</b> ${info.score ? `· Score: ${info.score}/10` : ''}</div>
        `;
      }
      renderer.domElement.style.cursor = 'pointer';
    } else {
      if (hoveredMesh && (hoveredMesh.material as THREE.MeshStandardMaterial)) {
        (hoveredMesh.material as THREE.MeshStandardMaterial).color.setHex(hoveredOriginalColor);
        hoveredMesh = null;
      }
      if (hoverTooltip) {
        hoverTooltip.style.display = 'none';
      }
      renderer.domElement.style.cursor = 'default';
    }
  };

  const onPointerUp = (e: MouseEvent) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(buildingMeshes);
    if (intersects.length > 0) {
      const sId = intersects[0].object.userData.sessionId;
      if (sId) {
        focusSession(sId);
        onSelect(sId);
      }
    }
  };

  renderer.domElement.addEventListener('mousemove', onPointerMove);
  renderer.domElement.addEventListener('pointerup', onPointerUp);

  // Smooth Camera Lerp Target
  let targetCamPos: THREE.Vector3 | null = null;
  let targetControlsTarget: THREE.Vector3 | null = null;

  const focusSession = (sessionId: number) => {
    const bGroup = buildingMap.get(sessionId);
    if (!bGroup) return;
    targetControlsTarget = new THREE.Vector3(bGroup.position.x, 1.2, bGroup.position.z);
    targetCamPos = new THREE.Vector3(
      bGroup.position.x + 4.5,
      bGroup.position.y + 4.0,
      bGroup.position.z + 5.5
    );
  };

  const focusDistrict = (districtIdx: number) => {
    const dCenter = districtCenters[districtIdx];
    if (!dCenter) return;
    targetControlsTarget = new THREE.Vector3(dCenter.x, 1.0, dCenter.z);
    targetCamPos = new THREE.Vector3(dCenter.x + 9, 8.5, dCenter.z + 10);
  };

  const resetView = () => {
    targetControlsTarget = new THREE.Vector3(0, 1, 0);
    targetCamPos = defaultCamPos.clone();
  };

  const updateStatuses = (newStatuses: SessionStatusMap) => {
    for (let sId = 1; sId <= 24; sId++) {
      const bGroup = buildingMap.get(sId);
      if (!bGroup) continue;
      const bInfo = newStatuses[sId];
      if (!bInfo) continue;
      const colors = getBuildingColors(bInfo.status);
      bGroup.traverse((child) => {
        if (child instanceof THREE.Mesh && child.userData.sessionId === sId) {
          if (child.material instanceof THREE.MeshStandardMaterial) {
            child.material.color.setHex(colors.wall);
          }
        }
      });
    }
  };

  // 7. Animation Loop
  let animationFrameId = 0;
  let isRunning = true;
  const clock = new THREE.Clock();

  const animate = () => {
    if (!isRunning) return;
    const elapsed = clock.getElapsedTime();

    // Camera tweening
    if (targetCamPos && targetControlsTarget) {
      camera.position.lerp(targetCamPos, 0.07);
      controls.target.lerp(targetControlsTarget, 0.07);
      if (camera.position.distanceTo(targetCamPos) < 0.05) {
        targetCamPos = null;
        targetControlsTarget = null;
      }
    }

    // Beacon pulsating rings
    buildingBeacons.forEach((beacon) => {
      const scale = 1.0 + Math.sin(elapsed * 2.5 + beacon.userData.pulse) * 0.18;
      beacon.scale.set(scale, scale, 1);
    });

    controls.update();
    renderer.render(scene, camera);
    animationFrameId = requestAnimationFrame(animate);
  };

  animate();

  // Resize Observer
  const resizeObserver = new ResizeObserver(() => {
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight || 420;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
  resizeObserver.observe(container);

  return {
    focusSession,
    focusDistrict,
    resetView,
    updateStatuses,
    destroy: () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('mousemove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      controls.dispose();
      disposeHierarchy(scene);
      renderer.dispose();
      renderer.forceContextLoss();
      if (hoverTooltip?.parentNode) {
        hoverTooltip.parentNode.removeChild(hoverTooltip);
      }
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    },
  };
}
