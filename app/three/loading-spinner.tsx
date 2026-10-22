'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { disposeHierarchy } from './engine-utils';

interface SpinnerProps {
  label?: string;
  size?: number;
}

/**
 * 3D-07: 3D Loading Indicator
 * Lightweight animated 3D isometric brand gem while content or assets load.
 */
export default function ThreeLoadingSpinner({ label = 'Loading 3D workspace…', size = 64 }: SpinnerProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const host = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 20);
    camera.position.set(2.8, 2.4, 2.8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    host.appendChild(renderer.domElement);

    // Ambient & directional light
    scene.add(new THREE.AmbientLight(0xffffff, 1.8));
    const dir = new THREE.DirectionalLight(0xfff3d6, 3.0);
    dir.position.set(4, 5, 3);
    scene.add(dir);

    // Brand Octahedron / Diamond Gem
    const gemGeo = new THREE.OctahedronGeometry(1.0, 0);
    const gemMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.2,
      wireframe: false,
    });
    const gem = new THREE.Mesh(gemGeo, gemMat);
    scene.add(gem);

    // Outer wire ring
    const ringGeo = new THREE.TorusGeometry(1.4, 0.05, 8, 24);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.7 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 4;
    scene.add(ring);

    let frameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      gem.rotation.y = elapsed * 2.2;
      gem.rotation.x = elapsed * 1.2;
      ring.rotation.z = -elapsed * 1.5;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      disposeHierarchy(scene);
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [size]);

  return (
    <div className="flex flex-col items-center justify-center p-6 gap-3" role="status">
      <div ref={mountRef} className="w-16 h-16 pointer-events-none" />
      <span className="text-xs font-semibold tracking-wider uppercase text-amber-300/90 animate-pulse">
        {label}
      </span>
    </div>
  );
}
