import * as THREE from 'three';

/**
 * Creates Santa's Workshop from primitive shapes.
 * Cartoon cel-shaded style using MeshToonMaterial throughout.
 */
export function createWorkshop(scene) {
  const workshop = new THREE.Group();

  // ───────────────────────────────────────────────
  // 1. Main Building — Walls
  // ───────────────────────────────────────────────
  const wallGeo = new THREE.BoxGeometry(10, 5, 7);
  const wallMat = new THREE.MeshToonMaterial({ color: 0x8b5e3c });
  const walls = new THREE.Mesh(wallGeo, wallMat);
  walls.position.y = 2.5; // half-height so bottom sits on ground
  walls.castShadow = true;
  walls.receiveShadow = true;
  workshop.add(walls);

  // ───────────────────────────────────────────────
  // 1b. Roof — 4-sided cone (pyramid)
  // ───────────────────────────────────────────────
  const roofGeo = new THREE.ConeGeometry(8, 3.5, 4);
  const roofMat = new THREE.MeshToonMaterial({ color: 0xaa2222 });
  const roof = new THREE.Mesh(roofGeo, roofMat);
  // Rotate 45° around Y so the square base aligns with the rectangular walls
  roof.rotation.y = Math.PI / 4;
  roof.position.y = 5 + 3.5 / 2; // on top of walls
  roof.castShadow = true;
  roof.receiveShadow = true;
  workshop.add(roof);

  // ───────────────────────────────────────────────
  // 2. Door
  // ───────────────────────────────────────────────
  const doorGeo = new THREE.BoxGeometry(1.8, 3, 0.15);
  const doorMat = new THREE.MeshToonMaterial({ color: 0x5c3a1a });
  const door = new THREE.Mesh(doorGeo, doorMat);
  // Front face of wall is at z = 3.5, door sticks out slightly
  door.position.set(0, 1.5, 3.5 + 0.08);
  door.castShadow = true;
  workshop.add(door);

  // Doorknob
  const knobGeo = new THREE.SphereGeometry(0.12, 8, 6);
  const knobMat = new THREE.MeshToonMaterial({ color: 0xffd700 });
  const knob = new THREE.Mesh(knobGeo, knobMat);
  knob.position.set(0.6, 1.5, 3.5 + 0.2);
  workshop.add(knob);

  // ───────────────────────────────────────────────
  // 3. Windows (two, flanking the door)
  // ───────────────────────────────────────────────
  const windowGeo = new THREE.BoxGeometry(1.5, 1.5, 0.15);
  const windowMat = new THREE.MeshToonMaterial({
    color: 0xffcc44,
    emissive: 0xffaa00,
    emissiveIntensity: 0.8,
  });

  const windowPositions = [
    { x: -2.8, label: 'left' },
    { x: 2.8, label: 'right' },
  ];

  windowPositions.forEach((wp) => {
    // Window pane
    const win = new THREE.Mesh(windowGeo, windowMat);
    win.position.set(wp.x, 2.8, 3.5 + 0.08);
    workshop.add(win);

    // Point light behind each window for warm light spill
    const light = new THREE.PointLight(0xffaa00, 0.5, 10);
    light.position.set(wp.x, 2.8, 3.0);
    workshop.add(light);
  });

  // ───────────────────────────────────────────────
  // 4. Chimney (Animated cartoon wiggle, squash & stretch & smoke)
  // ───────────────────────────────────────────────
  const chimneyGroup = new THREE.Group();
  // Pivot at the roof level on the right side of the roof
  chimneyGroup.position.set(3, 4.75, -1);

  const chimneyGeo = new THREE.BoxGeometry(1, 2.5, 1);
  const chimneyMat = new THREE.MeshToonMaterial({ color: 0x993333 });
  const chimney = new THREE.Mesh(chimneyGeo, chimneyMat);
  chimney.position.y = 1.25; // center so bottom sits on pivot
  chimney.castShadow = true;
  chimneyGroup.add(chimney);

  // Chimney top rim / lip
  const rimGeo = new THREE.BoxGeometry(1.2, 0.2, 1.2);
  const rimMat = new THREE.MeshToonMaterial({ color: 0x772222 });
  const rim = new THREE.Mesh(rimGeo, rimMat);
  rim.position.y = 2.45;
  rim.castShadow = true;
  chimneyGroup.add(rim);

  // Snow on rim
  const rimSnowGeo = new THREE.BoxGeometry(1.25, 0.1, 1.25);
  const rimSnowMat = new THREE.MeshToonMaterial({ color: 0xffffff });
  const rimSnow = new THREE.Mesh(rimSnowGeo, rimSnowMat);
  rimSnow.position.y = 2.55;
  chimneyGroup.add(rimSnow);

  // Warm glowing hearth opening
  const hearthGlowGeo = new THREE.CircleGeometry(0.35, 8);
  const hearthGlowMat = new THREE.MeshBasicMaterial({
    color: 0xff6600,
    side: THREE.DoubleSide,
  });
  const hearthGlow = new THREE.Mesh(hearthGlowGeo, hearthGlowMat);
  hearthGlow.rotation.x = -Math.PI / 2;
  hearthGlow.position.y = 2.56;
  chimneyGroup.add(hearthGlow);

  workshop.add(chimneyGroup);

  // Dynamic rising smoke puffs
  const smokePuffCount = 7;
  const smokePuffs = [];
  const smokeGeo = new THREE.SphereGeometry(0.24, 7, 7);

  for (let i = 0; i < smokePuffCount; i++) {
    const puffMat = new THREE.MeshToonMaterial({
      color: 0xd8d8d8,
      transparent: true,
      opacity: 0.65,
    });
    const puff = new THREE.Mesh(smokeGeo, puffMat);
    workshop.add(puff);

    smokePuffs.push({
      mesh: puff,
      progress: i / smokePuffCount,
      speed: 0.35 + Math.random() * 0.1,
      swayOffset: Math.random() * Math.PI * 2,
      driftX: 0.2 + (Math.random() - 0.5) * 0.3,
      driftZ: -0.1 + (Math.random() - 0.5) * 0.3,
      maxHeight: 3.8 + Math.random() * 1.0,
    });
  }

  // ───────────────────────────────────────────────
  // 5. Sign — "Santa's Workshop" above the door
  // ───────────────────────────────────────────────
  const signCanvas = document.createElement('canvas');
  signCanvas.width = 512;
  signCanvas.height = 128;
  const ctx = signCanvas.getContext('2d');

  // Wooden background
  ctx.fillStyle = '#8B5E3C';
  ctx.fillRect(0, 0, 512, 128);

  // Subtle darker border
  ctx.strokeStyle = '#5c3a1a';
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, 504, 120);

  // Text shadow for depth
  ctx.font = 'bold 52px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#660000';
  ctx.fillText("Santa's Workshop", 258, 67);

  // Main text — festive red with gold feel
  ctx.fillStyle = '#ff2222';
  ctx.fillText("Santa's Workshop", 256, 65);

  // Gold outline on text
  ctx.strokeStyle = '#ffd700';
  ctx.lineWidth = 1.5;
  ctx.strokeText("Santa's Workshop", 256, 65);

  const signTexture = new THREE.CanvasTexture(signCanvas);
  const signGeo = new THREE.PlaneGeometry(3, 0.8);
  const signMat = new THREE.MeshToonMaterial({
    map: signTexture,
    side: THREE.DoubleSide,
  });
  const sign = new THREE.Mesh(signGeo, signMat);
  sign.position.set(0, 4.2, 3.55);
  workshop.add(sign);

  // ───────────────────────────────────────────────
  // 6. Snow on Roof
  // ───────────────────────────────────────────────
  const snowGeo = new THREE.BoxGeometry(10.5, 0.3, 7.5);
  const snowMat = new THREE.MeshToonMaterial({ color: 0xffffff });
  const snow = new THREE.Mesh(snowGeo, snowMat);
  // Sit on top of the wall edges, just below where the roof starts
  snow.position.y = 5.15;
  snow.receiveShadow = true;
  workshop.add(snow);

  // ───────────────────────────────────────────────
  // Position the entire workshop group
  // ───────────────────────────────────────────────
  workshop.position.set(-2, 0, -5);

  scene.add(workshop);

  // ───────────────────────────────────────────────
  // Animation update loop for chimney and smoke
  // ───────────────────────────────────────────────
  return {
    /**
     * @param {number} delta - Frame time in seconds
     * @param {number} elapsed - Total run time in seconds
     */
    update(delta, elapsed) {
      // 1. Cartoon sway and wiggle (tilting side to side and forward/back)
      const swayZ = Math.sin(elapsed * 4.0) * 0.08;
      const swayX = Math.cos(elapsed * 3.0) * 0.05;
      chimneyGroup.rotation.z = swayZ;
      chimneyGroup.rotation.x = swayX;

      // 2. Cartoon squash & stretch (chugging rhythm like a steam engine furnace)
      const chug = Math.sin(elapsed * 8.0);
      const stretch = Math.max(0, chug) * 0.1;
      chimneyGroup.scale.y = 1.0 + stretch;
      chimneyGroup.scale.x = 1.0 - stretch * 0.5;
      chimneyGroup.scale.z = 1.0 - stretch * 0.5;

      // 3. Hearth fire flicker
      hearthGlowMat.color.setHex(Math.sin(elapsed * 12) > 0 ? 0xff7700 : 0xff3300);

      // 4. Emerging smoke position following the swaying chimney top
      const topOffsetLocal = new THREE.Vector3(0, 2.55 * chimneyGroup.scale.y, 0);
      topOffsetLocal.applyEuler(chimneyGroup.rotation);
      const topPos = chimneyGroup.position.clone().add(topOffsetLocal);

      // 5. Dynamic rising smoke puffs
      for (let i = 0; i < smokePuffs.length; i++) {
        const p = smokePuffs[i];
        p.progress += delta * p.speed;
        if (p.progress >= 1.0) {
          p.progress = 0;
        }

        const pr = p.progress;
        p.mesh.position.y = topPos.y + pr * p.maxHeight;
        p.mesh.position.x =
          topPos.x + Math.sin(elapsed * 2.5 + p.swayOffset) * 0.35 * pr + p.driftX * pr * 1.5;
        p.mesh.position.z =
          topPos.z + Math.cos(elapsed * 2.0 + p.swayOffset) * 0.25 * pr + p.driftZ * pr * 1.5;

        const s = 0.8 + pr * 2.0;
        p.mesh.scale.set(s, s * 0.85, s);
        p.mesh.material.opacity = (1.0 - pr) * 0.65;
      }
    },
  };
}
