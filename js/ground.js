import * as THREE from 'three';

/**
 * Creates the snow ground, night sky dome, and twinkling stars
 * for the North Pole Christmas scene.
 *
 * @param {THREE.Scene} scene - The scene to add objects to
 * @returns {{ update(delta: number, elapsed: number): void }}
 */
export function createGround(scene) {
  // ── Snow Ground ──────────────────────────────────────────────
  // Flat circle with subtle vertex displacement for snow mounds
  const groundGeometry = new THREE.CircleGeometry(80, 64);
  groundGeometry.rotateX(-Math.PI / 2);

  // Displace vertices slightly on Y to create gentle snow mounds
  const groundPos = groundGeometry.attributes.position;
  for (let i = 0; i < groundPos.count; i++) {
    const y = groundPos.getY(i);
    groundPos.setY(i, y + Math.random() * 0.3);
  }
  groundPos.needsUpdate = true;
  groundGeometry.computeVertexNormals();

  const groundMaterial = new THREE.MeshToonMaterial({
    color: 0xe8eeff, // white with a slight blue tint
  });

  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.receiveShadow = true;
  scene.add(ground);

  // ── Night Sky Dome ───────────────────────────────────────────
  // Large inverted sphere with a canvas gradient texture
  const skyCanvas = document.createElement('canvas');
  skyCanvas.width = 1;
  skyCanvas.height = 256;
  const ctx = skyCanvas.getContext('2d');

  // Vertical gradient: bottom → middle → top
  const gradient = ctx.createLinearGradient(0, 0, 0, 256);
  gradient.addColorStop(0.0, '#0a0a3a'); // top of sphere (dark navy)
  gradient.addColorStop(0.5, '#12082a'); // middle (deep purple hint)
  gradient.addColorStop(1.0, '#050520'); // bottom (very dark blue)

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1, 256);

  const skyTexture = new THREE.CanvasTexture(skyCanvas);

  const skyGeometry = new THREE.SphereGeometry(200, 32, 32);
  const skyMaterial = new THREE.MeshBasicMaterial({
    map: skyTexture,
    side: THREE.BackSide,
  });

  const skyDome = new THREE.Mesh(skyGeometry, skyMaterial);
  scene.add(skyDome);

  // ── Stars ────────────────────────────────────────────────────
  // 600 points randomly distributed on a sphere of radius 180
  const starCount = 600;
  const starPositions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    // Random point on a sphere using spherical coordinates
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 180;

    starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPositions[i * 3 + 2] = r * Math.cos(phi);
  }

  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(starPositions, 3)
  );

  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.5,
    sizeAttenuation: true,
    transparent: true,
    opacity: 1.0,
  });

  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);

  // ── Animation: star twinkle ──────────────────────────────────
  return {
    update(delta, elapsed) {
      // Slow sine-wave twinkle on star opacity
      starMaterial.opacity = 0.7 + 0.3 * Math.sin(elapsed * 0.5);
    },
  };
}
