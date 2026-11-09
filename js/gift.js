import * as THREE from 'three';
import { playGiftFanfare } from './audio.js';

/**
 * Gift / Present module
 * Creates a clickable gift box that opens with a confetti burst when clicked.
 * Features idle hover/rotation animation, raycasting click & hover interaction.
 */
export function createGift(scene, camera) {
  // ── Gift group ──────────────────────────────────────────────────────
  const giftGroup = new THREE.Group();
  giftGroup.position.set(5, 0.75, 4);

  // Shared materials
  const redMat = new THREE.MeshToonMaterial({ color: 0xdd2222 });
  const goldMat = new THREE.MeshToonMaterial({ color: 0xffd700 });

  // ── Box body ────────────────────────────────────────────────────────
  const boxGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  const box = new THREE.Mesh(boxGeo, redMat);
  box.castShadow = true;
  box.receiveShadow = true;
  giftGroup.add(box);

  // Horizontal ribbon around box middle
  const ribbonH = new THREE.Mesh(
    new THREE.BoxGeometry(1.55, 0.15, 0.2),
    goldMat
  );
  ribbonH.position.y = 0; // centre of box
  giftGroup.add(ribbonH);

  // Vertical ribbon around box middle (crossed)
  const ribbonV = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.15, 1.55),
    goldMat
  );
  ribbonV.position.y = 0;
  giftGroup.add(ribbonV);

  // ── Lid sub-group (animated separately) ─────────────────────────────
  const lidGroup = new THREE.Group();
  // Pivot point at the back edge of the lid so it flips open backward
  lidGroup.position.set(0, 0.75, -0.8);

  const lid = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.3, 1.6),
    redMat
  );
  lid.castShadow = true;
  lid.receiveShadow = true;
  // Offset so the lid's back edge sits at the pivot
  lid.position.set(0, 0.15, 0.8);
  lidGroup.add(lid);

  // Lid ribbon horizontal
  const lidRibbonH = new THREE.Mesh(
    new THREE.BoxGeometry(1.65, 0.05, 0.2),
    goldMat
  );
  lidRibbonH.position.set(0, 0.3, 0.8);
  lidGroup.add(lidRibbonH);

  // Lid ribbon vertical
  const lidRibbonV = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.05, 1.65),
    goldMat
  );
  lidRibbonV.position.set(0, 0.3, 0.8);
  lidGroup.add(lidRibbonV);

  // Bow – two small spheres offset to look like a knot
  const bowGeo = new THREE.SphereGeometry(0.18, 8, 6);
  const bowL = new THREE.Mesh(bowGeo, goldMat);
  bowL.position.set(-0.12, 0.42, 0.8);
  lidGroup.add(bowL);

  const bowR = new THREE.Mesh(bowGeo, goldMat);
  bowR.position.set(0.12, 0.42, 0.8);
  lidGroup.add(bowR);

  giftGroup.add(lidGroup);

  // Add gift to scene
  scene.add(giftGroup);

  // ── Surprise item inside the box (pops up when opened) ─────────
  const starSurpriseGroup = new THREE.Group();
  starSurpriseGroup.position.set(0, 0.4, 0);
  starSurpriseGroup.scale.set(0.001, 0.001, 0.001); // hidden until open

  const surpriseStarGeo = new THREE.OctahedronGeometry(0.5, 0);
  const surpriseStarMat = new THREE.MeshToonMaterial({
    color: 0xffe033,
    emissive: 0xffaa00,
    emissiveIntensity: 0.8
  });
  const surpriseMesh = new THREE.Mesh(surpriseStarGeo, surpriseStarMat);
  surpriseMesh.castShadow = true;
  starSurpriseGroup.add(surpriseMesh);

  // Little spark spheres orbiting the star
  const sparkGeo = new THREE.SphereGeometry(0.1, 6, 6);
  const sparkMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const spark1 = new THREE.Mesh(sparkGeo, sparkMat);
  spark1.position.set(0.7, 0, 0);
  starSurpriseGroup.add(spark1);
  const spark2 = new THREE.Mesh(sparkGeo, sparkMat);
  spark2.position.set(-0.7, 0, 0);
  starSurpriseGroup.add(spark2);

  giftGroup.add(starSurpriseGroup);

  // ── Raycasting setup ────────────────────────────────────────────────
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const canvas = document.getElementById('scene-canvas');

  // Track click vs drag to avoid opening gift while orbiting camera
  let downX = 0;
  let downY = 0;

  // ── State ───────────────────────────────────────────────────────────
  let isOpen = false;
  let isOpening = false;
  let isClosing = false;
  let openTimer = 0;
  const AUTO_CLOSE_DELAY = 30; // seconds before closing automatically

  // Confetti state
  let confettiPoints = null;
  let confettiVelocities = null;
  let confettiTimer = 0;
  const CONFETTI_COUNT = 150;
  const CONFETTI_DURATION = 3; // seconds

  /**
   * Spawn a confetti particle burst from the gift's world position.
   */
  function spawnConfetti() {
    const positions = new Float32Array(CONFETTI_COUNT * 3);
    const colors = new Float32Array(CONFETTI_COUNT * 3);
    confettiVelocities = new Float32Array(CONFETTI_COUNT * 3);

    // Get current world position of the gift
    const worldPos = new THREE.Vector3();
    giftGroup.getWorldPosition(worldPos);

    // Bright color palette for confetti
    const palette = [
      new THREE.Color(0xff4444),
      new THREE.Color(0x44ff44),
      new THREE.Color(0x4444ff),
      new THREE.Color(0xffdd00),
      new THREE.Color(0xff44ff),
      new THREE.Color(0x44ffff),
      new THREE.Color(0xffffff),
      new THREE.Color(0xff8800),
    ];

    for (let i = 0; i < CONFETTI_COUNT; i++) {
      const i3 = i * 3;

      // Random initial positions near the gift centre
      positions[i3]     = worldPos.x + (Math.random() - 0.5) * 0.5;
      positions[i3 + 1] = worldPos.y + 0.8 + Math.random() * 0.3;
      positions[i3 + 2] = worldPos.z + (Math.random() - 0.5) * 0.5;

      // Random velocities: upward + outward
      confettiVelocities[i3]     = (Math.random() - 0.5) * 6;  // X: -3 to 3
      confettiVelocities[i3 + 1] = 3 + Math.random() * 5;       // Y:  3 to 8
      confettiVelocities[i3 + 2] = (Math.random() - 0.5) * 6;  // Z: -3 to 3

      // Random bright colour per particle
      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i3]     = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 1.0,
      depthWrite: false,
    });

    confettiPoints = new THREE.Points(geo, mat);
    scene.add(confettiPoints);
    confettiTimer = 0;
  }

  // ── Click vs drag detection ──────────────────────────────────────
  function onPointerDown(event) {
    downX = event.clientX;
    downY = event.clientY;
  }

  function onPointerUp(event) {
    if (isOpen || isClosing) return;

    // Ignore drag movements from OrbitControls (allow at most 5px)
    const dist = Math.hypot(event.clientX - downX, event.clientY - downY);
    if (dist > 6) return;

    // Compute normalised device coordinates
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(giftGroup.children, true);

    if (intersects.length > 0) {
      isOpen = true;
      isOpening = true;
      isClosing = false;
      openTimer = 0;
      spawnConfetti();
      playGiftFanfare();
    }
  }

  // ── Hover handler (pointer cursor) ─────────────────────────────────
  function onPointerMove(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(giftGroup.children, true);

    canvas.style.cursor = intersects.length > 0 && !isOpen && !isClosing ? 'pointer' : '';
  }

  if (canvas) {
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointermove', onPointerMove);
  }

  // ── Update loop ─────────────────────────────────────────────────────
  function update(delta, elapsed) {
    // Idle animation: hover / bounce (only when closed)
    if (!isOpen && !isClosing) {
      giftGroup.position.y = 0.75 + Math.sin(elapsed * 2) * 0.15;
    }
    // Slow rotation (always active)
    giftGroup.rotation.y += delta * 0.3;

    // ── Lid open & surprise rise animation ──────────────────────────
    if (isOpen) {
      openTimer += delta;

      // Automatically trigger closing after 30 seconds
      if (openTimer >= AUTO_CLOSE_DELAY && !isClosing) {
        isOpen = false;
        isOpening = false;
        isClosing = true;
      } else {
        // Surprise star rises up and scales to full size
        starSurpriseGroup.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 4);
        starSurpriseGroup.position.y += (1.4 - starSurpriseGroup.position.y) * delta * 4;
        starSurpriseGroup.rotation.y += delta * 2;
      }
    }

    if (isOpening) {
      // Lerp lid rotation open (flips backward around the pivot)
      const targetRot = -Math.PI * 0.8; // ≈ -2.513
      lidGroup.rotation.x += (targetRot - lidGroup.rotation.x) * delta * 3;

      // Stop animating when close enough
      if (Math.abs(lidGroup.rotation.x - targetRot) < 0.01) {
        lidGroup.rotation.x = targetRot;
        isOpening = false;
      }
    }

    // ── Lid close & surprise retract animation ──────────────────────
    if (isClosing) {
      // Retract surprise star back into box
      starSurpriseGroup.scale.lerp(new THREE.Vector3(0.001, 0.001, 0.001), delta * 5);
      starSurpriseGroup.position.y += (0.4 - starSurpriseGroup.position.y) * delta * 5;

      // Flip lid smoothly back to closed position (0)
      lidGroup.rotation.x += (0 - lidGroup.rotation.x) * delta * 3.5;

      // Finish closing once lid is almost back
      if (Math.abs(lidGroup.rotation.x) < 0.01 && starSurpriseGroup.scale.x < 0.05) {
        lidGroup.rotation.x = 0;
        starSurpriseGroup.scale.set(0.001, 0.001, 0.001);
        starSurpriseGroup.position.set(0, 0.4, 0);
        isClosing = false;
      }
    }

    // ── Confetti physics ────────────────────────────────────────────
    if (confettiPoints) {
      confettiTimer += delta;

      if (confettiTimer >= CONFETTI_DURATION) {
        // Remove confetti
        scene.remove(confettiPoints);
        confettiPoints.geometry.dispose();
        confettiPoints.material.dispose();
        confettiPoints = null;
        confettiVelocities = null;
      } else {
        const posAttr = confettiPoints.geometry.getAttribute('position');
        const pos = posAttr.array;

        for (let i = 0; i < CONFETTI_COUNT; i++) {
          const i3 = i * 3;

          // Apply gravity to velocity Y
          confettiVelocities[i3 + 1] -= 9.8 * delta;

          // Update positions
          pos[i3]     += confettiVelocities[i3]     * delta;
          pos[i3 + 1] += confettiVelocities[i3 + 1] * delta;
          pos[i3 + 2] += confettiVelocities[i3 + 2] * delta;
        }

        posAttr.needsUpdate = true;

        // Fade opacity over time
        confettiPoints.material.opacity = 1.0 - (confettiTimer / CONFETTI_DURATION);
      }
    }
  }

  return { update };
}
