'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { disposeHierarchy } from './engine-utils';
import { Button } from '@/components/ui/button';

interface RewardsProps {
  title?: string;
  subtitle?: string;
  onDismiss: () => void;
}

/**
 * 3D-05: Reward Animations
 * Celebratory 3D burst on successful submission and milestone achievements.
 * Short (<=2s), skippable, WCAG safe, respects reduced motion.
 */
export default function RewardsFX({
  title = 'Worksheet Submitted!',
  subtitle = 'Your evidence has been securely locked and transmitted to faculty.',
  onDismiss,
}: RewardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced || !containerRef.current) {
      const timer = setTimeout(onDismiss, 2000);
      return () => clearTimeout(timer);
    }

    const host = containerRef.current;
    const width = host.clientWidth || 400;
    const height = host.clientHeight || 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    host.appendChild(renderer.domElement);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xffecc2, 3.0);
    sun.position.set(5, 5, 5);
    scene.add(sun);

    // Trophy / Milestone Medal
    const medalGroup = new THREE.Group();
    const medalGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.15, 24);
    const medalMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.1,
    });
    const medal = new THREE.Mesh(medalGeo, medalMat);
    medal.rotation.x = Math.PI / 2;
    medalGroup.add(medal);

    // Inner Star / V Mark
    const innerGeo = new THREE.TorusGeometry(0.8, 0.08, 8, 24);
    const innerMat = new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.5 });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    medalGroup.add(inner);
    scene.add(medalGroup);

    // Particle Confetti
    const particleCount = 120;
    const posArray = new Float32Array(particleCount * 3);
    const velArray = new Float32Array(particleCount * 3);
    const colArray = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color(0xd4af37), // Gold
      new THREE.Color(0x10b981), // Emerald
      new THREE.Color(0x38bdf8), // Cyan
      new THREE.Color(0xf59e0b), // Amber
    ];

    for (let i = 0; i < particleCount; i++) {
      posArray[i * 3] = (Math.random() - 0.5) * 0.5;
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

      const angle = Math.random() * Math.PI * 2;
      const speed = 2.5 + Math.random() * 4.0;
      velArray[i * 3] = Math.cos(angle) * speed;
      velArray[i * 3 + 1] = Math.sin(angle) * speed + 1.2;
      velArray[i * 3 + 2] = (Math.random() - 0.5) * speed;

      const c = palette[i % palette.length];
      colArray[i * 3] = c.r;
      colArray[i * 3 + 1] = c.g;
      colArray[i * 3 + 2] = c.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colArray, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    let frameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const dt = clock.getDelta();
      const pos = particleGeo.attributes.position;

      for (let i = 0; i < particleCount; i++) {
        pos.setX(i, pos.getX(i) + velArray[i * 3] * dt);
        pos.setY(i, pos.getY(i) + velArray[i * 3 + 1] * dt);
        pos.setZ(i, pos.getZ(i) + velArray[i * 3 + 2] * dt);
        velArray[i * 3 + 1] -= 3.5 * dt; // Gravity
      }
      pos.needsUpdate = true;

      medalGroup.rotation.y += 3.5 * dt;
      medalGroup.scale.setScalar(Math.min(1.0, medalGroup.scale.x + 1.5 * dt));

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    const autoTimer = setTimeout(onDismiss, 2000);

    return () => {
      clearTimeout(autoTimer);
      cancelAnimationFrame(frameId);
      disposeHierarchy(scene);
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [onDismiss]);

  return (
    <div
      role="dialog"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
    >
      <div className="relative flex flex-col items-center max-w-sm w-full p-6 text-center bg-gradient-to-b from-[#0f2d38] to-[#091a20] border border-[#d4af37] rounded-2xl shadow-2xl">
        <div ref={containerRef} className="w-full h-44 pointer-events-none" />
        <h3 className="text-xl font-bold text-white tracking-tight mt-2">{title}</h3>
        <p className="text-sm text-slate-300 mt-2 mb-6">{subtitle}</p>
        <Button
          onClick={onDismiss}
          className="bg-[#d4af37] hover:bg-[#e6c154] text-[#0d2b36] font-semibold px-6 min-h-[44px]"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
