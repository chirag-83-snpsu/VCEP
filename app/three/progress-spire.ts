import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { VCEP_3D_COLORS, disposeHierarchy, GraphicsTier } from './engine-utils';

export interface ProgressSpireHandle {
  update: (completed: number, graded: number) => void;
  destroy: () => void;
}

/**
 * 3D-04: Progress Visualisation - Dynamic 3D Career Spire / Skyline
 * Constructs an architectural tower floor by floor as sessions are completed and graded.
 */
export function initProgressSpire(
  container: HTMLElement,
  completedSessions: number = 0,
  gradedSessions: number = 0,
  tier: GraphicsTier = 'Full'
): ProgressSpireHandle {
  const isLight = tier === 'Light';
  const width = container.clientWidth || 380;
  const height = container.clientHeight || 340;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0c212a);

  const camera = new THREE.PerspectiveCamera(40, width / height, 0.2, 80);
  camera.position.set(7.5, 7.0, 9.0);

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
  controls.maxPolarAngle = Math.PI / 2.1;
  controls.minDistance = 4;
  controls.maxDistance = 20;
  controls.target.set(0, 2.8, 0);

  // Lighting
  const ambient = new THREE.AmbientLight(0xdff2f8, 1.8);
  scene.add(ambient);
  const sun = new THREE.DirectionalLight(0xfff5dd, 2.5);
  sun.position.set(6, 12, 6);
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0x38bdf8, 1.2);
  rim.position.set(-6, 8, -6);
  scene.add(rim);

  const towerGroup = new THREE.Group();
  scene.add(towerGroup);

  // Base Foundation Pedestal
  const baseGeo = new THREE.CylinderGeometry(2.8, 3.2, 0.6, 16);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x143542, roughness: 0.8 });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = 0.3;
  towerGroup.add(base);

  const ringGeo = new THREE.TorusGeometry(3.0, 0.08, 8, 32);
  ringGeo.rotateX(Math.PI / 2);
  const ring = new THREE.Mesh(ringGeo, new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8 }));
  ring.position.y = 0.6;
  towerGroup.add(ring);

  // 24 Floors
  const floorMeshes: THREE.Mesh[] = [];
  const floorHeight = 0.22;
  const floorGap = 0.04;

  for (let i = 0; i < 24; i++) {
    const tierIdx = Math.floor(i / 6); // 0 to 3
    const widthFactor = 2.0 - tierIdx * 0.25;

    const floorGeo = new THREE.BoxGeometry(widthFactor, floorHeight, widthFactor);
    const isGraded = i < gradedSessions;
    const isDone = i < completedSessions;

    const floorMat = new THREE.MeshStandardMaterial({
      color: isGraded ? 0x10b981 : isDone ? 0x0284c7 : 0x223f4b,
      roughness: isGraded ? 0.2 : 0.6,
      metalness: isGraded ? 0.5 : 0.1,
      transparent: !isDone,
      opacity: !isDone ? 0.35 : 1.0,
    });

    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = 0.6 + i * (floorHeight + floorGap) + floorHeight / 2;
    towerGroup.add(floor);
    floorMeshes.push(floor);
  }

  // Golden Crown Spire on Top
  const spireGeo = new THREE.ConeGeometry(0.35, 1.4, 8);
  const spireMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.85,
    roughness: 0.15,
  });
  const spire = new THREE.Mesh(spireGeo, spireMat);
  spire.position.y = 0.6 + 24 * (floorHeight + floorGap) + 0.7;
  towerGroup.add(spire);

  const update = (completed: number, graded: number) => {
    floorMeshes.forEach((mesh, i) => {
      const isGraded = i < graded;
      const isDone = i < completed;
      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        mesh.material.color.setHex(isGraded ? 0x10b981 : isDone ? 0x0284c7 : 0x223f4b);
        mesh.material.transparent = !isDone;
        mesh.material.opacity = !isDone ? 0.35 : 1.0;
        mesh.material.roughness = isGraded ? 0.2 : 0.6;
        mesh.material.metalness = isGraded ? 0.5 : 0.1;
      }
    });
  };

  let animationFrameId = 0;
  let isRunning = true;
  let isInteracting = false;
  controls.addEventListener('start', () => { isInteracting = true; });
  controls.addEventListener('end', () => { isInteracting = false; });
  const clock = new THREE.Clock();

  const animate = () => {
    if (!isRunning) return;
    const elapsed = clock.getElapsedTime();
    if (!isInteracting) {
      towerGroup.rotation.y += 0.005;
    }
    controls.update();
    renderer.render(scene, camera);
    animationFrameId = requestAnimationFrame(animate);
  };

  animate();

  const resizeObserver = new ResizeObserver(() => {
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight || 340;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
  resizeObserver.observe(container);

  return {
    update,
    destroy: () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      controls.dispose();
      disposeHierarchy(scene);
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    },
  };
}
