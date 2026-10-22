import * as THREE from 'three';

export type GraphicsTier = 'Full' | 'Light' | 'Static';

export interface CapabilityInfo {
  tier: GraphicsTier;
  hasWebGL2: boolean;
  isReducedMotion: boolean;
  isSaveData: boolean;
  deviceMemoryGb?: number;
  reason: string;
}

/**
 * Evaluates hardware and user preferences to select the appropriate 3D graphics tier.
 * Conforms to PRD Section 8.3 (3D-F2, 3D-F3, 3D-F4).
 */
export function detectGraphicsTier(userPreference?: string): CapabilityInfo {
  // 1. User manual override
  if (userPreference === 'off') {
    return {
      tier: 'Static',
      hasWebGL2: false,
      isReducedMotion: false,
      isSaveData: false,
      reason: 'User disabled 3D in preferences.',
    };
  }

  // 2. Reduced motion preference
  const isReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isReducedMotion && userPreference !== 'on') {
    return {
      tier: 'Static',
      hasWebGL2: true,
      isReducedMotion: true,
      isSaveData: false,
      reason: 'System prefers-reduced-motion is active.',
    };
  }

  // 3. WebGL2 availability check
  let hasWebGL2 = false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    hasWebGL2 = !!gl;
    if (gl) {
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
  } catch {
    hasWebGL2 = false;
  }

  if (!hasWebGL2) {
    return {
      tier: 'Static',
      hasWebGL2: false,
      isReducedMotion,
      isSaveData: false,
      reason: 'WebGL 2.0 is not supported on this browser or hardware.',
    };
  }

  // 4. Low-end device / Save-data detection
  const nav = typeof navigator !== 'undefined' ? (navigator as any) : {};
  const isSaveData = Boolean(nav.connection?.saveData);
  const deviceMemoryGb = nav.deviceMemory ? Number(nav.deviceMemory) : undefined;
  const isLowMemory = deviceMemoryGb !== undefined && deviceMemoryGb <= 4;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (userPreference === 'reduced' || isSaveData || isLowMemory || (isMobile && !userPreference)) {
    return {
      tier: 'Light',
      hasWebGL2: true,
      isReducedMotion,
      isSaveData,
      deviceMemoryGb,
      reason: isSaveData
        ? 'Data Saver mode is active.'
        : isLowMemory
        ? `Device memory (${deviceMemoryGb}GB) targets Light tier.`
        : 'Light 3D mode selected for optimal battery and framerate.',
    };
  }

  return {
    tier: 'Full',
    hasWebGL2: true,
    isReducedMotion,
    isSaveData,
    deviceMemoryGb,
    reason: 'Full 3D WebGL2 hardware acceleration active.',
  };
}

/**
 * Recursively disposes of all geometries, materials, and textures in a scene or group
 * to prevent GPU/CPU memory leaks (PRD 8.5 & 8.8).
 */
export function disposeHierarchy(node: THREE.Object3D) {
  node.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (child.geometry) {
        child.geometry.dispose();
      }
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => disposeMaterial(m));
        } else {
          disposeMaterial(child.material);
        }
      }
    }
  });
}

function disposeMaterial(material: THREE.Material) {
  // Dispose all possible texture slots
  const mat = material as any;
  const textureKeys = [
    'map', 'bumpMap', 'normalMap', 'roughnessMap',
    'metalnessMap', 'alphaMap', 'envMap', 'lightMap', 'aoMap'
  ];
  for (const key of textureKeys) {
    if (mat[key] && typeof mat[key].dispose === 'function') {
      mat[key].dispose();
    }
  }
  material.dispose();
}

/**
 * Creates a crisp billboard canvas sprite for labeling 3D landmarks or buildings.
 */
export function createTextSprite(
  text: string,
  subtext?: string,
  options?: {
    bgColor?: string;
    textColor?: string;
    accentColor?: string;
    fontSize?: number;
    badge?: string;
  }
): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 192;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Rounded card background
    const bg = options?.bgColor || 'rgba(13, 43, 54, 0.92)';
    const textCol = options?.textColor || '#ffffff';
    const accentCol = options?.accentColor || '#d4af37';

    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.roundRect(16, 16, 480, 160, 24);
    ctx.fill();

    // Border
    ctx.lineWidth = 4;
    ctx.strokeStyle = accentCol;
    ctx.stroke();

    // Badge if provided
    if (options?.badge) {
      ctx.fillStyle = accentCol;
      ctx.beginPath();
      ctx.roundRect(32, 32, 100, 36, 12);
      ctx.fill();
      ctx.fillStyle = '#0d2b36';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(options.badge, 44, 58);
    }

    // Main Text
    ctx.fillStyle = textCol;
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(text, options?.badge ? 148 : 36, 68);

    // Subtext
    if (subtext) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 24px sans-serif';
      ctx.fillText(subtext, 36, 130);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(3, 1.125, 1);
  return sprite;
}

/**
 * Standard VCEP Brand Palette for 3D materials
 */
export const VCEP_3D_COLORS = {
  oceanDeep: 0x091e25,
  oceanSurface: 0x133e4d,
  oceanHighlight: 0x1d586d,
  quayConcrete: 0x2d4852,
  roadAsphalt: 0x1a2e36,
  roadLine: 0xf5d061,
  buildingBronze: 0x4a4338,
  buildingNavy: 0x153b48,
  buildingTeal: 0x1e5a6a,
  buildingWhite: 0xf0f4f2,
  goldPrimary: 0xd4af37,
  goldGlow: 0xf3cf65,
  emeraldGraded: 0x10b981,
  emeraldSpire: 0x34d399,
  amberDraft: 0xf59e0b,
  amberGlow: 0xfcd34d,
  cyanSubmitted: 0x0ea5e9,
  cyanGlow: 0x38bdf8,
  crimsonReturned: 0xef4444,
  padlockLocked: 0x9ca3af,
  containerTeal: 0x145369,
  containerGold: 0xd97706,
  containerNavy: 0x0f172a,
  containerRed: 0xb91c1c,
};
