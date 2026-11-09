import * as THREE from 'three';

/**
 * Snow particle system — 3000 falling snowflakes with sway animation.
 * Uses BufferGeometry + Points for high performance.
 */

// Generate a soft circular dot texture via canvas
function createSnowflakeTexture() {
  const size = 32;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Radial gradient: white center fading to transparent edge
  const gradient = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2
  );
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export function createSnow(scene) {
  const PARTICLE_COUNT = 3000;

  // --- Position buffer ---
  const positions = new Float32Array(PARTICLE_COUNT * 3);

  // --- Per-particle data (plain arrays for the update loop) ---
  const velocities = new Array(PARTICLE_COUNT);
  const swayPhases = new Array(PARTICLE_COUNT);

  // Initialize particles with random positions, velocities, and sway phases
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Random X in [-50, 50]
    positions[i * 3] = (Math.random() - 0.5) * 100;
    // Random Y in [0, 40]
    positions[i * 3 + 1] = Math.random() * 40;
    // Random Z in [-18, 40] (clears the air over the distant elf village)
    positions[i * 3 + 2] = -18 + Math.random() * 58;

    // Fall speed between 2 and 5
    velocities[i] = 2 + Math.random() * 3;
    // Random sway phase so particles don't all sway in sync
    swayPhases[i] = Math.random() * Math.PI * 2;
  }

  // --- Geometry ---
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // --- Material with soft dot texture ---
  const texture = createSnowflakeTexture();

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.3,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
    depthWrite: false,
    map: texture,
    blending: THREE.AdditiveBlending
  });

  // --- Points mesh ---
  const snow = new THREE.Points(geometry, material);
  // Snow doesn't cast/receive shadows (it's a particle system)
  scene.add(snow);

  // --- Animation update ---
  function update(delta, elapsed) {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;

      // Fall downward
      positions[idx + 1] -= velocities[i] * delta;

      // Horizontal sway
      positions[idx] += Math.sin(elapsed * 0.5 + swayPhases[i]) * 0.02;

      // Reset particle when it drops below the ground
      if (positions[idx + 1] < 0) {
        positions[idx] = (Math.random() - 0.5) * 100;       // new random X
        positions[idx + 1] = 35 + Math.random() * 5;         // reset Y near top
        positions[idx + 2] = -18 + Math.random() * 58;      // keep clear of elf village
      }
    }

    // Flag the position attribute for GPU upload
    geometry.attributes.position.needsUpdate = true;
  }

  return { update };
}
