import * as THREE from 'three';

/**
 * Creates a cartoon Rudolph reindeer from primitive shapes
 * that trots along a looping CatmullRomCurve3 path around the scene.
 */
export function createReindeer(scene) {
  // ── Materials ──────────────────────────────────────────────
  const brownMat = new THREE.MeshToonMaterial({ color: 0x8b5a2b });
  const lightBrownMat = new THREE.MeshToonMaterial({ color: 0xa0724a });
  const darkMat = new THREE.MeshToonMaterial({ color: 0x333333 });
  const antlerMat = new THREE.MeshToonMaterial({ color: 0xc4a35a });
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const noseMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });

  // ── Reindeer group & model container ──────────────────────
  const reindeer = new THREE.Group();
  const modelGroup = new THREE.Group();
  // Rotate model so +X (head) aligns with Three.js forward direction (+Z)
  modelGroup.rotation.y = -Math.PI / 2;
  reindeer.add(modelGroup);

  // ── Body (torso) ───────────────────────────────────────────
  const body = new THREE.Mesh(new THREE.BoxGeometry(2, 1.2, 1), brownMat);
  body.position.set(0, 1.2, 0);
  body.castShadow = true;
  modelGroup.add(body);

  // ── Neck ───────────────────────────────────────────────────
  const neck = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.8, 0.5), brownMat);
  neck.position.set(1.1, 1.8, 0);
  neck.rotation.z = -0.4; // tilted forward
  neck.castShadow = true;
  modelGroup.add(neck);

  // ── Head ───────────────────────────────────────────────────
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.7, 0.6), brownMat);
  head.position.set(1.5, 2.2, 0);
  head.castShadow = true;
  modelGroup.add(head);

  // ── Snout ──────────────────────────────────────────────────
  const snout = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.4), lightBrownMat);
  snout.position.set(2.0, 2.1, 0);
  modelGroup.add(snout);

  // ── Rudolph's red nose ─────────────────────────────────────
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 6), noseMat);
  nose.position.set(2.25, 2.1, 0);
  modelGroup.add(nose);

  // ── Eyes ───────────────────────────────────────────────────
  const eyeGeo = new THREE.SphereGeometry(0.08, 6, 4);
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(1.75, 2.35, 0.28);
  modelGroup.add(eyeL);

  const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
  eyeR.position.set(1.75, 2.35, -0.28);
  modelGroup.add(eyeR);

  // ── Ears ───────────────────────────────────────────────────
  const earGeo = new THREE.BoxGeometry(0.15, 0.3, 0.08);
  const earL = new THREE.Mesh(earGeo, brownMat);
  earL.position.set(1.4, 2.65, 0.25);
  earL.rotation.x = 0.3;
  modelGroup.add(earL);

  const earR = new THREE.Mesh(earGeo, brownMat);
  earR.position.set(1.4, 2.65, -0.25);
  earR.rotation.x = -0.3;
  modelGroup.add(earR);

  // ── Antlers ────────────────────────────────────────────────
  function buildAntler(side) {
    const antlerGroup = new THREE.Group();

    // Main branch going up
    const mainBranch = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.03, 0.8, 6),
      antlerMat
    );
    mainBranch.position.y = 0.4;
    antlerGroup.add(mainBranch);

    // First fork — lower, angling outward
    const fork1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.025, 0.4, 6),
      antlerMat
    );
    fork1.position.set(0, 0.25, side * 0.15);
    fork1.rotation.x = side * 0.8;
    fork1.rotation.z = -0.3;
    antlerGroup.add(fork1);

    // Second fork — upper, angling outward
    const fork2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.02, 0.35, 6),
      antlerMat
    );
    fork2.position.set(0, 0.55, side * 0.12);
    fork2.rotation.x = side * 0.6;
    fork2.rotation.z = 0.4;
    antlerGroup.add(fork2);

    return antlerGroup;
  }

  const antlerL = buildAntler(1);
  antlerL.position.set(1.35, 2.55, 0.2);
  modelGroup.add(antlerL);

  const antlerR = buildAntler(-1);
  antlerR.position.set(1.35, 2.55, -0.2);
  modelGroup.add(antlerR);

  // ── Legs ───────────────────────────────────────────────────
  const legGeo = new THREE.CylinderGeometry(0.1, 0.08, 1.2, 8);
  const hoofGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.15, 8);

  // Leg positions: front-left, front-right, back-left, back-right
  const legPositions = [
    { x: 0.7, z: 0.35 },  // front-left
    { x: 0.7, z: -0.35 }, // front-right
    { x: -0.7, z: 0.35 }, // back-left
    { x: -0.7, z: -0.35 } // back-right
  ];

  const legs = [];
  const hooves = [];

  legPositions.forEach((pos) => {
    // Each leg is a group so we can rotate from the hip
    const legGroup = new THREE.Group();
    legGroup.position.set(pos.x, 0.6, pos.z);

    const leg = new THREE.Mesh(legGeo, brownMat);
    leg.position.y = -0.0; // centered in group
    leg.castShadow = true;
    legGroup.add(leg);

    const hoof = new THREE.Mesh(hoofGeo, darkMat);
    hoof.position.y = -0.6;
    hoof.castShadow = true;
    legGroup.add(hoof);

    modelGroup.add(legGroup);
    legs.push(legGroup);
    hooves.push(hoof);
  });

  // ── Tail ───────────────────────────────────────────────────
  const tail = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.03, 0.4, 6),
    brownMat
  );
  tail.position.set(-1.15, 1.5, 0);
  tail.rotation.z = 0.6; // angled up
  modelGroup.add(tail);

  // ── Center the reindeer so its local origin is at hooves level ──
  // The lowest point of the legs/hooves is about y = 0 already
  // (legGroup at y=0.6, hoof at -0.6 within = y=0, minus half hoof height)
  // Shift the entire group down slightly so hooves rest exactly at y = 0
  reindeer.position.y = 0;

  scene.add(reindeer);

  // ── Path animation ─────────────────────────────────────────
  // Hooves bottom sits at local y = -0.075; with pathHeight = 0.08,
  // hooves touch the ground/snow surface perfectly without floating.
  const pathHeight = 0.08;
  const pathPoints = [
    new THREE.Vector3(15, pathHeight, 15),
    new THREE.Vector3(20, pathHeight, 0),
    new THREE.Vector3(15, pathHeight, -15),
    new THREE.Vector3(0, pathHeight, -18),
    new THREE.Vector3(-15, pathHeight, -12),
    new THREE.Vector3(-18, pathHeight, 5),
    new THREE.Vector3(-10, pathHeight, 18),
    new THREE.Vector3(5, pathHeight, 18)
  ];

  const curve = new THREE.CatmullRomCurve3(pathPoints);
  curve.closed = true;

  let t = 0; // parameter along the curve [0..1]

  return {
    update(delta, elapsed) {
      // Advance along the path
      t = (t + delta * 0.03) % 1;

      // Position on curve
      const point = curve.getPointAt(t);
      reindeer.position.copy(point);

      // Gentle walking bobbing synced with trot
      reindeer.position.y += Math.sin(elapsed * 6) * 0.02;

      // Orient reindeer along the path tangent
      const tangent = curve.getTangentAt(t);
      const lookTarget = point.clone().add(tangent);
      lookTarget.y = reindeer.position.y;
      reindeer.lookAt(lookTarget);

      // ── Leg trotting animation ───────────────────────────
      // Front legs and back legs alternate in a trot cycle along travel direction
      const trotSpeed = 6;
      const trotAngle = 0.35;

      // Front-left & back-right swing together (rotation.z swings along the body length)
      legs[0].rotation.z = Math.sin(elapsed * trotSpeed) * trotAngle;
      legs[3].rotation.z = Math.sin(elapsed * trotSpeed) * trotAngle;

      // Front-right & back-left swing opposite
      legs[1].rotation.z = Math.sin(elapsed * trotSpeed + Math.PI) * trotAngle;
      legs[2].rotation.z = Math.sin(elapsed * trotSpeed + Math.PI) * trotAngle;
    }
  };
}
