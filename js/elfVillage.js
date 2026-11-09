import * as THREE from 'three';

/**
 * elfVillage.js — Creates a whimsical cartoon Elven Village in the distance
 * Sits clearly on the ground plane behind Santa's Workshop with cozy cottages,
 * glowing windows, animated chimney smoke, festive fairy lights, street lanterns,
 * an animated clock tower, and adorable little animated elves!
 */

export function createElfVillage(scene) {
  const villageGroup = new THREE.Group();

  // ── Shared Materials ────────────────────────────────────────────────────────
  const snowMat = new THREE.MeshToonMaterial({ color: 0xe8eeff });
  const woodDarkMat = new THREE.MeshToonMaterial({ color: 0x4a2e16 });
  const woodWarmMat = new THREE.MeshToonMaterial({ color: 0x7c4924 });
  const plasterCreamMat = new THREE.MeshToonMaterial({ color: 0xf5ebd6 });
  const roofRedMat = new THREE.MeshToonMaterial({ color: 0xc42222 });
  const roofGreenMat = new THREE.MeshToonMaterial({ color: 0x1f6e39 });
  const roofTealMat = new THREE.MeshToonMaterial({ color: 0x1e6f6a });
  const roofBlueMat = new THREE.MeshToonMaterial({ color: 0x22446e });
  const gingerbreadMat = new THREE.MeshToonMaterial({ color: 0x824924 });
  const stoneGreyMat = new THREE.MeshToonMaterial({ color: 0x757b84 });
  const goldMat = new THREE.MeshToonMaterial({ color: 0xffd700 });
  const chimneyBrickMat = new THREE.MeshToonMaterial({ color: 0x933428 });

  // Emissive glowing materials for windows and lanterns (shine brightly through the winter night)
  const windowGlowMat = new THREE.MeshToonMaterial({
    color: 0xffdd55,
    emissive: 0xff9900,
    emissiveIntensity: 1.1,
  });

  const starGlowMat = new THREE.MeshBasicMaterial({ color: 0xffea44 });

  // ───────────────────────────────────────────────────────────────────────────
  // 1. CHIMNEY SMOKE SYSTEM (Animated cartoon smoke puffs)
  // ───────────────────────────────────────────────────────────────────────────
  const smokePuffs = [];
  const smokeGeo = new THREE.SphereGeometry(0.2, 6, 6);

  function addChimneySmoke(x, y, z) {
    const puffCount = 5;
    for (let i = 0; i < puffCount; i++) {
      const mat = new THREE.MeshToonMaterial({
        color: 0xdddddd,
        transparent: true,
        opacity: 0.7,
      });
      const puff = new THREE.Mesh(smokeGeo, mat);
      puff.position.set(x, y, z);
      villageGroup.add(puff);

      smokePuffs.push({
        mesh: puff,
        baseX: x,
        baseY: y,
        baseZ: z,
        progress: i / puffCount,
        speed: 0.22 + Math.random() * 0.08,
        driftX: (Math.random() - 0.5) * 0.4,
        driftZ: (Math.random() - 0.5) * 0.4,
        maxHeight: 2.4 + Math.random() * 0.8,
      });
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 2. VILLAGE ARCHWAY & ENTRANCE SIGN
  // ───────────────────────────────────────────────────────────────────────────
  function createVillageArchway() {
    const archGroup = new THREE.Group();
    archGroup.position.set(5, 0, -21);

    // Left and right wooden posts
    const postGeo = new THREE.CylinderGeometry(0.18, 0.22, 3.6, 8);
    const postL = new THREE.Mesh(postGeo, woodDarkMat);
    postL.position.set(-2.2, 1.8, 0);
    postL.castShadow = true;
    archGroup.add(postL);

    const postR = new THREE.Mesh(postGeo, woodDarkMat);
    postR.position.set(2.2, 1.8, 0);
    postR.castShadow = true;
    archGroup.add(postR);

    // Crossbeam
    const beamGeo = new THREE.BoxGeometry(4.8, 0.35, 0.35);
    const beam = new THREE.Mesh(beamGeo, woodDarkMat);
    beam.position.set(0, 3.5, 0);
    beam.castShadow = true;
    archGroup.add(beam);

    // Snow topping on archway
    const snowCapGeo = new THREE.BoxGeometry(5.0, 0.22, 0.45);
    const snowCap = new THREE.Mesh(snowCapGeo, snowMat);
    snowCap.position.set(0, 3.7, 0);
    archGroup.add(snowCap);

    // Canvas banner sign "ELFENDORP"
    const signCanvas = document.createElement('canvas');
    signCanvas.width = 512;
    signCanvas.height = 128;
    const ctx = signCanvas.getContext('2d');

    ctx.fillStyle = '#1b4d3e';
    ctx.fillRect(0, 0, 512, 128);
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 6;
    ctx.strokeRect(6, 6, 500, 116);

    ctx.font = 'bold 46px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('✨ ELFENDORP ✨', 256, 64);

    const signTex = new THREE.CanvasTexture(signCanvas);
    const signGeo = new THREE.PlaneGeometry(3.6, 0.9);
    const signMat = new THREE.MeshToonMaterial({
      map: signTex,
      side: THREE.DoubleSide,
    });
    const signMesh = new THREE.Mesh(signGeo, signMat);
    signMesh.position.set(0, 2.8, 0);
    archGroup.add(signMesh);

    // Two warm hanging lanterns
    [-2.2, 2.2].forEach((xOffset) => {
      const lanternArm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.6, 6),
        woodDarkMat
      );
      lanternArm.rotation.z = Math.PI / 2;
      lanternArm.position.set(xOffset > 0 ? xOffset - 0.3 : xOffset + 0.3, 3.2, 0);
      archGroup.add(lanternArm);

      const lanternBody = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.2),
        windowGlowMat
      );
      lanternBody.position.set(xOffset > 0 ? xOffset - 0.5 : xOffset + 0.5, 2.8, 0);
      archGroup.add(lanternBody);
    });

    // Warm entrance light
    const archLight = new THREE.PointLight(0xffaa44, 1.2, 18, 2);
    archLight.position.set(0, 3.2, 0);
    archGroup.add(archLight);

    villageGroup.add(archGroup);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 3. TOWN SQUARE CLOCK TOWER (The Village Landmark)
  // ───────────────────────────────────────────────────────────────────────────
  let towerStarMesh = null;

  function createClockTower() {
    const tower = new THREE.Group();
    tower.position.set(6, 0, -32);

    // Stone base (octagonal) sitting directly on ground
    const baseGeo = new THREE.CylinderGeometry(1.6, 1.9, 3.2, 8);
    const base = new THREE.Mesh(baseGeo, stoneGreyMat);
    base.position.y = 1.6;
    base.castShadow = true;
    tower.add(base);

    // Stone trim / ledge
    const ledgeGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.25, 8);
    const ledge = new THREE.Mesh(ledgeGeo, snowMat);
    ledge.position.y = 3.3;
    tower.add(ledge);

    // Middle timber clock chamber
    const midGeo = new THREE.BoxGeometry(2.4, 2.4, 2.4);
    const mid = new THREE.Mesh(midGeo, woodWarmMat);
    mid.position.y = 4.5;
    mid.castShadow = true;
    tower.add(mid);

    // Clock Face (Canvas with holiday clock showing 11:55)
    const clockCanvas = document.createElement('canvas');
    clockCanvas.width = 256;
    clockCanvas.height = 256;
    const cctx = clockCanvas.getContext('2d');

    cctx.fillStyle = '#fff9e6';
    cctx.beginPath();
    cctx.arc(128, 128, 120, 0, Math.PI * 2);
    cctx.fill();
    cctx.strokeStyle = '#8b5a2b';
    cctx.lineWidth = 12;
    cctx.stroke();

    cctx.fillStyle = '#333333';
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      const tx = 128 + Math.cos(angle) * 95;
      const ty = 128 + Math.sin(angle) * 95;
      cctx.beginPath();
      cctx.arc(tx, ty, 6, 0, Math.PI * 2);
      cctx.fill();
    }

    // Hands showing 11:55
    cctx.lineWidth = 8;
    cctx.strokeStyle = '#222222';
    cctx.lineCap = 'round';
    cctx.beginPath();
    cctx.moveTo(128, 128);
    cctx.lineTo(124, 55);
    cctx.stroke();
    cctx.lineWidth = 5;
    cctx.beginPath();
    cctx.moveTo(128, 128);
    cctx.lineTo(82, 42);
    cctx.stroke();

    const clockTex = new THREE.CanvasTexture(clockCanvas);
    const clockPlane = new THREE.Mesh(
      new THREE.CircleGeometry(0.9, 16),
      new THREE.MeshBasicMaterial({ map: clockTex })
    );
    clockPlane.position.set(0, 4.5, 1.22);
    tower.add(clockPlane);

    // Belfry posts & golden bell
    const belfryRoof = new THREE.Mesh(
      new THREE.CylinderGeometry(1.7, 1.7, 0.2, 8),
      woodDarkMat
    );
    belfryRoof.position.y = 5.8;
    tower.add(belfryRoof);

    // Golden bell
    const bellGeo = new THREE.CylinderGeometry(0.25, 0.5, 0.7, 8);
    const bell = new THREE.Mesh(bellGeo, goldMat);
    bell.position.y = 6.2;
    tower.add(bell);

    // Belfry pillars
    [-1.0, 1.0].forEach((px) => {
      [-1.0, 1.0].forEach((pz) => {
        const pillar = new THREE.Mesh(
          new THREE.CylinderGeometry(0.09, 0.09, 1.0, 6),
          woodDarkMat
        );
        pillar.position.set(px, 6.3, pz);
        tower.add(pillar);
      });
    });

    // Tall pointed conical roof (crimson red)
    const spireGeo = new THREE.ConeGeometry(2.0, 4.2, 8);
    const spire = new THREE.Mesh(spireGeo, roofRedMat);
    spire.position.y = 6.8 + 2.1;
    spire.castShadow = true;
    tower.add(spire);

    // Snow mantle around lower spire rim
    const spireSnow = new THREE.Mesh(
      new THREE.TorusGeometry(1.85, 0.18, 6, 16),
      snowMat
    );
    spireSnow.rotation.x = Math.PI / 2;
    spireSnow.position.y = 6.9;
    tower.add(spireSnow);

    // Rotating Golden Star on the spire tip
    const starGeo = new THREE.OctahedronGeometry(0.4, 0);
    towerStarMesh = new THREE.Mesh(starGeo, starGlowMat);
    towerStarMesh.position.y = 6.8 + 4.2 + 0.4;
    tower.add(towerStarMesh);

    // Tower lantern & PointLight
    const towerLight = new THREE.PointLight(0xffaa33, 1.6, 25, 2);
    towerLight.position.set(0, 4.5, 2.0);
    tower.add(towerLight);

    villageGroup.add(tower);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 4. COTTAGE 1: "Het Paddenstoelhuisje" (Mushroom Elf Cottage)
  // ───────────────────────────────────────────────────────────────────────────
  function createMushroomCottage() {
    const cottage = new THREE.Group();
    cottage.position.set(15, 0, -29);

    // Round pastel mint wall
    const wallGeo = new THREE.CylinderGeometry(2.0, 2.2, 2.6, 12);
    const walls = new THREE.Mesh(wallGeo, roofGreenMat);
    walls.position.y = 1.3;
    walls.castShadow = true;
    walls.receiveShadow = true;
    cottage.add(walls);

    // Big mushroom dome roof
    const roofGeo = new THREE.SphereGeometry(2.7, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55);
    const roof = new THREE.Mesh(roofGeo, roofRedMat);
    roof.position.y = 2.5;
    roof.scale.set(1.15, 0.95, 1.15);
    roof.castShadow = true;
    cottage.add(roof);

    // Snow patches on the red dome
    const patchPositions = [
      { x: 0.9, y: 3.6, z: 0.9, s: 0.45 },
      { x: -1.1, y: 3.8, z: 0.4, s: 0.5 },
      { x: 0.2, y: 4.4, z: -0.2, s: 0.65 },
      { x: 0.7, y: 3.5, z: -1.2, s: 0.4 },
    ];
    patchPositions.forEach((p) => {
      const patch = new THREE.Mesh(new THREE.SphereGeometry(p.s, 6, 6), snowMat);
      patch.scale.set(1, 0.4, 1);
      patch.position.set(p.x, p.y, p.z);
      cottage.add(patch);
    });

    // Round arched wooden door
    const doorGeo = new THREE.BoxGeometry(1.0, 1.6, 0.15);
    const door = new THREE.Mesh(doorGeo, woodDarkMat);
    door.position.set(0, 0.8, 2.15);
    cottage.add(door);

    const doorKnob = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 6), goldMat);
    doorKnob.position.set(0.35, 0.8, 2.25);
    cottage.add(doorKnob);

    // Glowing round porthole windows
    const winGeo = new THREE.CircleGeometry(0.4, 10);
    const winL = new THREE.Mesh(winGeo, windowGlowMat);
    winL.position.set(-1.3, 1.5, 1.7);
    winL.rotation.y = 0.5;
    cottage.add(winL);

    const winR = new THREE.Mesh(winGeo, windowGlowMat);
    winR.position.set(1.3, 1.5, 1.7);
    winR.rotation.y = -0.5;
    cottage.add(winR);

    // Stone chimney
    const chimney = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.4, 2.4, 8),
      stoneGreyMat
    );
    chimney.position.set(-1.4, 3.5, -0.6);
    cottage.add(chimney);

    addChimneySmoke(cottage.position.x - 1.4, 4.7, cottage.position.z - 0.6);

    villageGroup.add(cottage);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 5. COTTAGE 2: "Het Peperkoekhuisje" (Gingerbread Cottage)
  // ───────────────────────────────────────────────────────────────────────────
  function createGingerbreadCottage() {
    const cottage = new THREE.Group();
    cottage.position.set(19, 0, -35);
    cottage.rotation.y = -0.3;

    // Gingerbread brown walls
    const wallGeo = new THREE.BoxGeometry(3.5, 2.4, 2.8);
    const walls = new THREE.Mesh(wallGeo, gingerbreadMat);
    walls.position.y = 1.2;
    walls.castShadow = true;
    walls.receiveShadow = true;
    cottage.add(walls);

    // White icing border along wall tops
    const icingGeo = new THREE.BoxGeometry(3.6, 0.18, 2.9);
    const icing = new THREE.Mesh(icingGeo, snowMat);
    icing.position.y = 2.4;
    cottage.add(icing);

    // Steep peaked A-frame roof (4-sided cone)
    const roofGeo = new THREE.ConeGeometry(3.0, 2.6, 4);
    const roof = new THREE.Mesh(roofGeo, roofRedMat);
    roof.position.y = 2.4 + 1.3;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    cottage.add(roof);

    // Thick snow on roof slopes
    const roofSnow = new THREE.ConeGeometry(3.05, 0.7, 4);
    const snowTop = new THREE.Mesh(roofSnow, snowMat);
    snowTop.position.y = 2.4 + 2.25;
    snowTop.rotation.y = Math.PI / 4;
    cottage.add(snowTop);

    // Door flanked by peppermint candy cane columns
    const doorGeo = new THREE.BoxGeometry(0.9, 1.5, 0.12);
    const door = new THREE.Mesh(doorGeo, woodDarkMat);
    door.position.set(0, 0.75, 1.42);
    cottage.add(door);

    [-0.6, 0.6].forEach((cx) => {
      const cane = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.09, 1.6, 8),
        snowMat
      );
      cane.position.set(cx, 0.8, 1.45);
      cottage.add(cane);

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.095, 0.025, 6, 12),
        roofRedMat
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.set(cx, 1.1, 1.45);
      cottage.add(ring);
    });

    // Glowing front window
    const winGeo = new THREE.BoxGeometry(0.9, 0.9, 0.1);
    const win = new THREE.Mesh(winGeo, windowGlowMat);
    win.position.set(1.0, 1.3, 1.42);
    cottage.add(win);

    // Chimney with smoke
    const chimney = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 2.0, 0.55),
      chimneyBrickMat
    );
    chimney.position.set(-1.1, 3.4, 0);
    cottage.add(chimney);

    addChimneySmoke(cottage.position.x - 1.1, 4.4, cottage.position.z);

    villageGroup.add(cottage);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 6. COTTAGE 3: "De Speelgoedbakkerij" (Bakery & Toy Workshop)
  // ───────────────────────────────────────────────────────────────────────────
  function createBakeryCottage() {
    const cottage = new THREE.Group();
    cottage.position.set(12, 0, -40);
    cottage.rotation.y = 0.2;

    // Cream plaster walls
    const wallGeo = new THREE.BoxGeometry(3.8, 2.6, 3.0);
    const walls = new THREE.Mesh(wallGeo, plasterCreamMat);
    walls.position.y = 1.3;
    walls.castShadow = true;
    walls.receiveShadow = true;
    cottage.add(walls);

    // Half-timber dark wood beam trims
    const beamV1 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.6, 0.06), woodDarkMat);
    beamV1.position.set(-1.3, 1.3, 1.52);
    cottage.add(beamV1);

    const beamV2 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.6, 0.06), woodDarkMat);
    beamV2.position.set(1.3, 1.3, 1.52);
    cottage.add(beamV2);

    // Forest green steep gable roof
    const roofGeo = new THREE.ConeGeometry(3.4, 2.4, 4);
    const roof = new THREE.Mesh(roofGeo, roofTealMat);
    roof.position.y = 2.6 + 1.2;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    cottage.add(roof);

    // Snow atop roof
    const snowGeo = new THREE.ConeGeometry(3.45, 0.6, 4);
    const snowTop = new THREE.Mesh(snowGeo, snowMat);
    snowTop.position.y = 2.6 + 2.1;
    snowTop.rotation.y = Math.PI / 4;
    cottage.add(snowTop);

    // Shop window (large warm display)
    const shopWin = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.1, 0.1), windowGlowMat);
    shopWin.position.set(-0.8, 1.3, 1.52);
    cottage.add(shopWin);

    // Door
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.7, 0.1), woodWarmMat);
    door.position.set(0.85, 0.85, 1.52);
    cottage.add(door);

    // Chimney & smoke
    const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.65, 2.2, 0.65), stoneGreyMat);
    chimney.position.set(1.3, 3.4, -0.4);
    cottage.add(chimney);

    addChimneySmoke(cottage.position.x + 1.3, 4.5, cottage.position.z - 0.4);

    villageGroup.add(cottage);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 7. COTTAGE 4: "Het Postkantoor der Elfen" (Elf Wishlist Depot)
  // ───────────────────────────────────────────────────────────────────────────
  function createMailDepotCottage() {
    const cottage = new THREE.Group();
    cottage.position.set(-1, 0, -33);
    cottage.rotation.y = 0.15;

    // Log-cabin wood walls
    const wallGeo = new THREE.BoxGeometry(3.2, 2.2, 2.6);
    const walls = new THREE.Mesh(wallGeo, woodWarmMat);
    walls.position.y = 1.1;
    walls.castShadow = true;
    cottage.add(walls);

    // Roof
    const roofGeo = new THREE.ConeGeometry(2.8, 2.0, 4);
    const roof = new THREE.Mesh(roofGeo, roofRedMat);
    roof.position.y = 2.2 + 1.0;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    cottage.add(roof);

    // Snow mantle
    const snowRoof = new THREE.BoxGeometry(3.4, 0.28, 2.8);
    const snowR = new THREE.Mesh(snowRoof, snowMat);
    snowR.position.y = 2.25;
    cottage.add(snowR);

    // Front door & glowing window
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.75, 1.5, 0.1), woodDarkMat);
    door.position.set(-0.7, 0.75, 1.32);
    cottage.add(door);

    const win = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.85, 0.1), windowGlowMat);
    win.position.set(0.7, 1.2, 1.32);
    cottage.add(win);

    // Little red mailbox out front
    const mbPost = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.9, 6), woodDarkMat);
    mbPost.position.set(-1.5, 0.45, 1.7);
    cottage.add(mbPost);

    const mbBox = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.3, 0.45), roofRedMat);
    mbBox.position.set(-1.5, 0.9, 1.7);
    cottage.add(mbBox);

    // Chimney & smoke
    const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.8, 0.55), stoneGreyMat);
    chimney.position.set(-0.9, 3.0, -0.4);
    cottage.add(chimney);

    addChimneySmoke(cottage.position.x - 0.9, 3.9, cottage.position.z - 0.4);

    villageGroup.add(cottage);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 8. COTTAGE 5: "De Sterrenkijkertoren" (Stargazer Elf Cottage)
  // ───────────────────────────────────────────────────────────────────────────
  function createStargazerCottage() {
    const cottage = new THREE.Group();
    cottage.position.set(-12, 0, -33);
    cottage.rotation.y = -0.25;

    // Two-tier cylindrical tower cottage
    const baseGeo = new THREE.CylinderGeometry(1.8, 2.1, 3.4, 10);
    const base = new THREE.Mesh(baseGeo, stoneGreyMat);
    base.position.y = 1.7;
    base.castShadow = true;
    cottage.add(base);

    // Wooden observation balcony
    const deckGeo = new THREE.CylinderGeometry(2.2, 2.2, 0.22, 10);
    const deck = new THREE.Mesh(deckGeo, woodWarmMat);
    deck.position.y = 3.5;
    cottage.add(deck);

    // Balcony snow railing
    const railSnow = new THREE.Mesh(
      new THREE.TorusGeometry(2.15, 0.12, 6, 16),
      snowMat
    );
    railSnow.rotation.x = Math.PI / 2;
    railSnow.position.y = 3.8;
    cottage.add(railSnow);

    // Miniature brass telescope pointed up at the starry sky
    const scopeGeo = new THREE.CylinderGeometry(0.07, 0.12, 0.8, 6);
    const scope = new THREE.Mesh(scopeGeo, goldMat);
    scope.position.set(0.7, 4.0, 0.7);
    scope.rotation.x = -0.7;
    scope.rotation.y = 0.5;
    cottage.add(scope);

    // Upper room
    const upperGeo = new THREE.CylinderGeometry(1.4, 1.4, 1.3, 8);
    const upper = new THREE.Mesh(upperGeo, plasterCreamMat);
    upper.position.y = 4.2;
    cottage.add(upper);

    // Tall witch-hat conical roof (royal midnight blue)
    const roofGeo = new THREE.ConeGeometry(1.9, 3.0, 8);
    const roof = new THREE.Mesh(roofGeo, roofBlueMat);
    roof.position.y = 4.8 + 1.5;
    roof.castShadow = true;
    cottage.add(roof);

    // Star ornament on top
    const topStar = new THREE.Mesh(new THREE.OctahedronGeometry(0.3, 0), starGlowMat);
    topStar.position.y = 4.8 + 3.0 + 0.25;
    cottage.add(topStar);

    // Door & glowing windows
    const door = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.6, 0.1), woodDarkMat);
    door.position.set(0, 0.8, 1.95);
    cottage.add(door);

    const win1 = new THREE.Mesh(new THREE.CircleGeometry(0.35, 8), windowGlowMat);
    win1.position.set(-1.1, 2.2, 1.4);
    win1.rotation.y = 0.6;
    cottage.add(win1);

    const win2 = new THREE.Mesh(new THREE.CircleGeometry(0.35, 8), windowGlowMat);
    win2.position.set(0, 4.2, 1.42);
    cottage.add(win2);

    // Chimney & smoke
    const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 2.2, 6), stoneGreyMat);
    chimney.position.set(-1.2, 4.8, -0.6);
    cottage.add(chimney);

    addChimneySmoke(cottage.position.x - 1.2, 5.8, cottage.position.z - 0.6);

    villageGroup.add(cottage);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 9. COTTAGE 6: "Het Gezellige Hobbithuisje" (Cozy Round Dwelling)
  // ───────────────────────────────────────────────────────────────────────────
  function createHobbitCottage() {
    const cottage = new THREE.Group();
    cottage.position.set(-18, 0, -31);
    cottage.rotation.y = 0.35;

    // Round stone dwelling walls
    const wallGeo = new THREE.CylinderGeometry(2.0, 2.2, 2.2, 10);
    const walls = new THREE.Mesh(wallGeo, stoneGreyMat);
    walls.position.y = 1.1;
    walls.castShadow = true;
    cottage.add(walls);

    // Mossy-green conical roof with thick snow frosting
    const roofGeo = new THREE.ConeGeometry(2.5, 1.8, 8);
    const roof = new THREE.Mesh(roofGeo, roofGreenMat);
    roof.position.y = 2.2 + 0.9;
    roof.castShadow = true;
    cottage.add(roof);

    const snowRoof = new THREE.TorusGeometry(2.4, 0.18, 6, 16);
    const sr = new THREE.Mesh(snowRoof, snowMat);
    sr.rotation.x = Math.PI / 2;
    sr.position.y = 2.3;
    cottage.add(sr);

    // Round hobbit door with gold center doorknob
    const doorRing = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.08, 6, 16), woodDarkMat);
    doorRing.position.set(0, 0.95, 2.05);
    cottage.add(doorRing);

    const doorGeo = new THREE.CircleGeometry(0.7, 16);
    const door = new THREE.Mesh(doorGeo, roofRedMat);
    door.position.set(0, 0.95, 2.04);
    cottage.add(door);

    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 6), goldMat);
    knob.position.set(0, 0.95, 2.12);
    cottage.add(knob);

    // Round glowing porthole window
    const win = new THREE.Mesh(new THREE.CircleGeometry(0.4, 12), windowGlowMat);
    win.position.set(1.2, 1.2, 1.7);
    win.rotation.y = -0.4;
    cottage.add(win);

    // Chimney & smoke
    const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.35, 2.0, 8), chimneyBrickMat);
    chimney.position.set(-0.9, 2.5, -0.4);
    cottage.add(chimney);

    addChimneySmoke(cottage.position.x - 0.9, 3.5, cottage.position.z - 0.4);

    villageGroup.add(cottage);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 10. COTTAGE 7 & 8: High Ridge Alpine Chalets
  // ───────────────────────────────────────────────────────────────────────────
  function createDistantChalets() {
    // Left alpine cottage
    const chalet1 = new THREE.Group();
    chalet1.position.set(-8, 0, -44);
    chalet1.scale.set(0.9, 0.9, 0.9);

    const walls1 = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.0, 2.4), woodDarkMat);
    walls1.position.y = 1.0;
    chalet1.add(walls1);

    const roof1 = new THREE.Mesh(new THREE.ConeGeometry(2.6, 2.2, 4), roofRedMat);
    roof1.position.y = 2.0 + 1.1;
    roof1.rotation.y = Math.PI / 4;
    chalet1.add(roof1);

    const win1 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.1), windowGlowMat);
    win1.position.set(0.5, 1.1, 1.22);
    chalet1.add(win1);

    const chim1 = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.8, 0.45), stoneGreyMat);
    chim1.position.set(-0.8, 2.7, 0);
    chalet1.add(chim1);

    addChimneySmoke(chalet1.position.x - 0.8, 3.6, chalet1.position.z);
    villageGroup.add(chalet1);

    // Right alpine cottage
    const chalet2 = new THREE.Group();
    chalet2.position.set(23, 0, -42);
    chalet2.scale.set(0.9, 0.9, 0.9);
    chalet2.rotation.y = -0.4;

    const walls2 = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.8, 2.2), plasterCreamMat);
    walls2.position.y = 0.9;
    chalet2.add(walls2);

    const roof2 = new THREE.Mesh(new THREE.ConeGeometry(2.4, 2.0, 4), roofGreenMat);
    roof2.position.y = 1.8 + 1.0;
    roof2.rotation.y = Math.PI / 4;
    chalet2.add(roof2);

    const win2 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.1), windowGlowMat);
    win2.position.set(0, 1.0, 1.12);
    chalet2.add(win2);

    const chim2 = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.6, 0.45), chimneyBrickMat);
    chim2.position.set(0.7, 2.4, 0);
    chalet2.add(chim2);

    addChimneySmoke(chalet2.position.x + 0.7, 3.2, chalet2.position.z);
    villageGroup.add(chalet2);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 11. VILLAGE SQUARE CHRISTMAS TREE & PRESENT PILE
  // ───────────────────────────────────────────────────────────────────────────
  const villageTreeLights = [];

  function createVillageTree() {
    const treeGroup = new THREE.Group();
    treeGroup.position.set(10, 0, -30);

    // Trunk sitting on ground
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.3, 0.9, 8),
      woodDarkMat
    );
    trunk.position.y = 0.45;
    treeGroup.add(trunk);

    // 3 stacked pine cone tiers
    const tierConfigs = [
      { r: 1.6, h: 1.5, y: 1.3, color: 0x185a2c },
      { r: 1.3, h: 1.3, y: 2.1, color: 0x1d6a34 },
      { r: 0.9, h: 1.1, y: 2.9, color: 0x247a3e },
    ];

    tierConfigs.forEach((t) => {
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(t.r, t.h, 8),
        new THREE.MeshToonMaterial({ color: t.color })
      );
      cone.position.y = t.y;
      cone.castShadow = true;
      treeGroup.add(cone);

      const rimSnow = new THREE.Mesh(
        new THREE.TorusGeometry(t.r * 0.95, 0.09, 4, 12),
        snowMat
      );
      rimSnow.rotation.x = Math.PI / 2;
      rimSnow.position.y = t.y - t.h / 2 + 0.05;
      treeGroup.add(rimSnow);
    });

    // Glowing golden star on top
    const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.3, 0), starGlowMat);
    star.position.y = 3.6;
    treeGroup.add(star);

    // Colorful festive tree lights
    const colors = [0xff2222, 0xffd700, 0x22ee44, 0x33bbff, 0xff55ff];
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 4;
      const heightFrac = i / 18;
      const radius = (1.5 - heightFrac * 1.0) * 0.95;
      const y = 1.0 + heightFrac * 2.2;

      const lightMat = new THREE.MeshBasicMaterial({
        color: colors[i % colors.length],
        transparent: true,
        opacity: 1.0,
      });
      const lightMesh = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), lightMat);
      lightMesh.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      treeGroup.add(lightMesh);

      villageTreeLights.push({
        material: lightMat,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Wrapped tiny elf gift boxes under the tree
    const giftPalette = [0xdd2222, 0x2288dd, 0x22aa44, 0xffaa00];
    const giftPositions = [
      { x: 0.6, z: 0.6, s: 0.38, c: 0 },
      { x: -0.7, z: 0.5, s: 0.32, c: 1 },
      { x: 0.3, z: -0.7, s: 0.42, c: 2 },
      { x: -0.5, z: -0.6, s: 0.28, c: 3 },
    ];
    giftPositions.forEach((gp) => {
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(gp.s, gp.s, gp.s),
        new THREE.MeshToonMaterial({ color: giftPalette[gp.c] })
      );
      box.position.set(gp.x, gp.s / 2, gp.z);
      box.castShadow = true;
      treeGroup.add(box);

      const bow = new THREE.Mesh(new THREE.SphereGeometry(gp.s * 0.2, 6, 6), goldMat);
      bow.position.set(gp.x, gp.s + 0.05, gp.z);
      treeGroup.add(bow);
    });

    villageGroup.add(treeGroup);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 12. FESTOON FAIRY LIGHT STRINGS (Guirlandes between buildings)
  // ───────────────────────────────────────────────────────────────────────────
  const festoonBulbs = [];

  function createFairyLightString(p1, p2, bulbCount, sag = 0.5) {
    const stringGroup = new THREE.Group();
    const bulbPalette = [0xff3333, 0xffd700, 0x33ee66, 0x33ccff, 0xff44aa];

    for (let i = 0; i <= bulbCount; i++) {
      const t = i / bulbCount;
      const x = p1.x + (p2.x - p1.x) * t;
      const z = p1.z + (p2.z - p1.z) * t;
      const y = p1.y + (p2.y - p1.y) * t - Math.sin(t * Math.PI) * sag;

      const mat = new THREE.MeshBasicMaterial({
        color: bulbPalette[i % bulbPalette.length],
        transparent: true,
        opacity: 1.0,
      });
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 6), mat);
      bulb.position.set(x, y, z);
      stringGroup.add(bulb);

      festoonBulbs.push({
        material: mat,
        phase: i * 0.6 + Math.random() * 0.5,
      });
    }

    villageGroup.add(stringGroup);
  }

  function setupAllFairyLights() {
    // String from Clock Tower to Mushroom Cottage
    createFairyLightString(
      new THREE.Vector3(6.5, 6.0, -31.5),
      new THREE.Vector3(14.0, 3.6, -29.0),
      10,
      0.6
    );
    // String from Mushroom Cottage to Gingerbread Cottage
    createFairyLightString(
      new THREE.Vector3(15.5, 3.6, -29.5),
      new THREE.Vector3(18.5, 3.6, -34.5),
      8,
      0.5
    );
    // String across the path near the village tree
    createFairyLightString(
      new THREE.Vector3(6.0, 4.8, -31.0),
      new THREE.Vector3(9.5, 3.2, -29.0),
      7,
      0.4
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 13. VILLAGE STREET LANTERNS
  // ───────────────────────────────────────────────────────────────────────────
  function createStreetLantern(x, z) {
    const lamp = new THREE.Group();
    lamp.position.set(x, 0, z);

    // Curved wooden post sitting on ground
    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.12, 2.4, 8),
      woodDarkMat
    );
    post.position.y = 1.2;
    post.castShadow = true;
    lamp.add(post);

    // Curved arm
    const arm = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.09, 0.09),
      woodDarkMat
    );
    arm.position.set(0.25, 2.3, 0);
    lamp.add(arm);

    // Snow topping on post
    const postSnow = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.22, 6), snowMat);
    postSnow.position.set(0, 2.45, 0);
    lamp.add(postSnow);

    // Glowing lantern fixture
    const fixture = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.2),
      windowGlowMat
    );
    fixture.position.set(0.5, 2.05, 0);
    lamp.add(fixture);

    // Soft warm PointLight pool on snow
    const light = new THREE.PointLight(0xffaa33, 1.0, 14, 2);
    light.position.set(0.5, 1.9, 0);
    lamp.add(light);

    villageGroup.add(lamp);
  }

  function setupStreetLanterns() {
    createStreetLantern(8.5, -28);
    createStreetLantern(17.0, -32);
    createStreetLantern(3.5, -31);
    createStreetLantern(-7.5, -31);
    createStreetLantern(-15.5, -29);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 14. ADORABLE ANIMATED ELF CHARACTERS
  // ───────────────────────────────────────────────────────────────────────────
  let elfWavingArm = null;
  let elfCarrierGroup = null;
  let elfStandingGroup = null;

  function buildCartoonElf(tunicColor, hatColor) {
    const elf = new THREE.Group();

    const tunicMat = new THREE.MeshToonMaterial({ color: tunicColor });
    const hatMat = new THREE.MeshToonMaterial({ color: hatColor });
    const skinMat = new THREE.MeshToonMaterial({ color: 0xffdfc4 });
    const darkMat = new THREE.MeshToonMaterial({ color: 0x222222 });

    // Torso / Tunic
    const torso = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.3, 0.5, 8),
      tunicMat
    );
    torso.position.y = 0.5;
    torso.castShadow = true;
    elf.add(torso);

    // Black belt with gold buckle
    const belt = new THREE.Mesh(
      new THREE.CylinderGeometry(0.27, 0.28, 0.09, 8),
      darkMat
    );
    belt.position.y = 0.42;
    elf.add(belt);

    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.03), goldMat);
    buckle.position.set(0, 0.42, 0.28);
    elf.add(buckle);

    // Legs & curled elf shoes
    [-0.11, 0.11].forEach((lx) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.28, 6), darkMat);
      leg.position.set(lx, 0.16, 0);
      elf.add(leg);

      const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.09, 0.22), tunicMat);
      shoe.position.set(lx, 0.045, 0.05);
      elf.add(shoe);

      const curl = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.09, 6), tunicMat);
      curl.rotation.x = -Math.PI / 3;
      curl.position.set(lx, 0.08, 0.16);
      elf.add(curl);
    });

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), skinMat);
    head.position.y = 0.86;
    elf.add(head);

    // Rosy cheeks
    [-0.11, 0.11].forEach((cx) => {
      const cheek = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 6, 6),
        new THREE.MeshBasicMaterial({ color: 0xff9999 })
      );
      cheek.position.set(cx, 0.83, 0.17);
      elf.add(cheek);
    });

    // Pointy Elf Ears
    [-0.2, 0.2].forEach((ex) => {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.15, 4), skinMat);
      ear.rotation.z = ex > 0 ? -Math.PI / 3 : Math.PI / 3;
      ear.position.set(ex, 0.88, 0);
      elf.add(ear);
    });

    // Floppy Elf Hat
    const trim = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.055, 6, 12), snowMat);
    trim.rotation.x = Math.PI / 2;
    trim.position.y = 0.98;
    elf.add(trim);

    const hat = new THREE.Mesh(new THREE.ConeGeometry(0.21, 0.5, 8), hatMat);
    hat.rotation.z = -0.3;
    hat.position.set(0.07, 1.2, 0);
    elf.add(hat);

    const bell = new THREE.Mesh(new THREE.SphereGeometry(0.055, 6, 6), goldMat);
    bell.position.set(0.17, 1.4, 0);
    elf.add(bell);

    return elf;
  }

  function setupAnimatedElves() {
    // 1. Waving elf near the front of town square (fully visible!)
    const elf1 = buildCartoonElf(0x228b22, 0xcc2222);
    elf1.position.set(8.2, 0, -28.5);
    elf1.rotation.y = 0.3;

    // Resting left arm
    const armL = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.3, 6),
      new THREE.MeshToonMaterial({ color: 0x228b22 })
    );
    armL.position.set(-0.28, 0.52, 0);
    armL.rotation.z = 0.2;
    elf1.add(armL);

    // Waving right arm
    const waveArmGroup = new THREE.Group();
    waveArmGroup.position.set(0.27, 0.65, 0);

    const armR = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.045, 0.32, 6),
      new THREE.MeshToonMaterial({ color: 0x228b22 })
    );
    armR.position.y = 0.16;
    waveArmGroup.add(armR);

    const mitten = new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 6), snowMat);
    mitten.position.y = 0.35;
    waveArmGroup.add(mitten);

    elf1.add(waveArmGroup);
    elfWavingArm = waveArmGroup;

    villageGroup.add(elf1);

    // 2. Carrier elf carrying a miniature present
    elfCarrierGroup = new THREE.Group();
    elfCarrierGroup.position.set(12.5, 0, -31.5);
    elfCarrierGroup.rotation.y = -0.5;

    const elf2 = buildCartoonElf(0xcc2222, 0x228b22);
    elfCarrierGroup.add(elf2);

    const giftHeld = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.28, 0.28),
      new THREE.MeshToonMaterial({ color: 0x2288dd })
    );
    giftHeld.position.set(0, 0.52, 0.32);
    elfCarrierGroup.add(giftHeld);

    villageGroup.add(elfCarrierGroup);

    // 3. Standing elf with lantern near west approach
    elfStandingGroup = new THREE.Group();
    elfStandingGroup.position.set(-4.0, 0, -30.5);
    elfStandingGroup.rotation.y = 0.7;

    const elf3 = buildCartoonElf(0x1d6a38, 0xb82828);
    elfStandingGroup.add(elf3);

    const lanternPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.9, 6),
      woodDarkMat
    );
    lanternPole.position.set(0.35, 0.45, 0.2);
    elfStandingGroup.add(lanternPole);

    const miniLantern = new THREE.Mesh(new THREE.DodecahedronGeometry(0.09), windowGlowMat);
    miniLantern.position.set(0.35, 0.85, 0.2);
    elfStandingGroup.add(miniLantern);

    villageGroup.add(elfStandingGroup);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 15. MINIATURE PINE TREES AROUND THE VILLAGE
  // ───────────────────────────────────────────────────────────────────────────
  function createMiniPine(x, z, scale = 1) {
    const pine = new THREE.Group();
    pine.position.set(x, 0, z);
    pine.scale.set(scale, scale, scale);

    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.18, 0.7, 6),
      woodDarkMat
    );
    trunk.position.y = 0.35;
    pine.add(trunk);

    const cone1 = new THREE.Mesh(new THREE.ConeGeometry(1.0, 1.1, 7), roofGreenMat);
    cone1.position.y = 1.0;
    cone1.castShadow = true;
    pine.add(cone1);

    const cone2 = new THREE.Mesh(new THREE.ConeGeometry(0.8, 1.0, 7), roofGreenMat);
    cone2.position.y = 1.6;
    cone2.castShadow = true;
    pine.add(cone2);

    const cone3 = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.8, 7), roofGreenMat);
    cone3.position.y = 2.2;
    cone3.castShadow = true;
    pine.add(cone3);

    const snowTip = new THREE.Mesh(new THREE.SphereGeometry(0.15, 6, 6), snowMat);
    snowTip.position.y = 2.6;
    pine.add(snowTip);

    villageGroup.add(pine);
  }

  function setupMiniPines() {
    const pinePositions = [
      { x: 3, z: -35, s: 1.1 },
      { x: 17, z: -27, s: 0.9 },
      { x: 22, z: -32, s: 1.2 },
      { x: 26, z: -39, s: 1.4 },
      { x: 9, z: -43, s: 1.3 },
      { x: -5, z: -37, s: 1.0 },
      { x: -10, z: -29, s: 1.1 },
      { x: -17, z: -36, s: 1.3 },
      { x: -24, z: -34, s: 1.2 },
      { x: -3, z: -46, s: 1.5 },
      { x: 7, z: -46, s: 1.4 },
      { x: -15, z: -43, s: 1.3 },
    ];
    pinePositions.forEach((p) => createMiniPine(p.x, p.z, p.s));
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 16. VILLAGE SNOWMAN
  // ───────────────────────────────────────────────────────────────────────────
  function createVillageSnowman() {
    const sm = new THREE.Group();
    sm.position.set(13.5, 0, -28.5);
    sm.scale.set(0.7, 0.7, 0.7);

    // 3 snowballs sitting on ground
    const b1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), snowMat);
    b1.position.y = 0.5;
    sm.add(b1);

    const b2 = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), snowMat);
    b2.position.y = 1.15;
    sm.add(b2);

    const b3 = new THREE.Mesh(new THREE.SphereGeometry(0.24, 8, 8), snowMat);
    b3.position.y = 1.62;
    sm.add(b3);

    // Carrot nose
    const nose = new THREE.Mesh(
      new THREE.ConeGeometry(0.05, 0.22, 6),
      new THREE.MeshToonMaterial({ color: 0xff6600 })
    );
    nose.rotation.x = Math.PI / 2;
    nose.position.set(0, 1.62, 0.32);
    sm.add(nose);

    // Red scarf
    const scarf = new THREE.Mesh(
      new THREE.TorusGeometry(0.24, 0.07, 6, 12),
      roofRedMat
    );
    scarf.rotation.x = Math.PI / 2;
    scarf.position.y = 1.42;
    sm.add(scarf);

    // Black top hat
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.04, 8), woodDarkMat);
    brim.position.y = 1.82;
    sm.add(brim);

    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.35, 8), woodDarkMat);
    crown.position.y = 2.0;
    sm.add(crown);

    villageGroup.add(sm);
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 17. INITIALIZE ALL VILLAGE COMPONENTS
  // ───────────────────────────────────────────────────────────────────────────
  createVillageArchway();
  createClockTower();
  createMushroomCottage();
  createGingerbreadCottage();
  createBakeryCottage();
  createMailDepotCottage();
  createStargazerCottage();
  createHobbitCottage();
  createDistantChalets();
  createVillageTree();
  setupAllFairyLights();
  setupStreetLanterns();
  setupAnimatedElves();
  setupMiniPines();
  createVillageSnowman();

  scene.add(villageGroup);

  // ───────────────────────────────────────────────────────────────────────────
  // 18. ANIMATION UPDATE LOOP
  // ───────────────────────────────────────────────────────────────────────────
  return {
    /**
     * @param {number} delta - Frame time in seconds
     * @param {number} elapsed - Total run time in seconds
     */
    update(delta, elapsed) {
      // 1. Animate rising chimney smoke puffs
      for (let i = 0; i < smokePuffs.length; i++) {
        const puff = smokePuffs[i];
        puff.progress += delta * puff.speed;

        if (puff.progress >= 1.0) {
          puff.progress = 0;
        }

        const pr = puff.progress;
        puff.mesh.position.y = puff.baseY + pr * puff.maxHeight;
        puff.mesh.position.x =
          puff.baseX + Math.sin(elapsed * 1.5 + puff.baseX) * 0.25 * pr + puff.driftX * pr;
        puff.mesh.position.z =
          puff.baseZ + Math.cos(elapsed * 1.2 + puff.baseZ) * 0.2 * pr + puff.driftZ * pr;

        const scale = 0.8 + pr * 1.6;
        puff.mesh.scale.set(scale, scale, scale);
        puff.mesh.material.opacity = (1.0 - pr) * 0.7;
      }

      // 2. Rotate Golden Clock Tower Star slowly
      if (towerStarMesh) {
        towerStarMesh.rotation.y += delta * 0.8;
      }

      // 3. Waving Elf Hand
      if (elfWavingArm) {
        elfWavingArm.rotation.z = 0.4 + Math.sin(elapsed * 4.5) * 0.35;
      }

      // 4. Carrier Elf walking bob
      if (elfCarrierGroup) {
        elfCarrierGroup.position.y = Math.abs(Math.sin(elapsed * 5)) * 0.08;
      }

      // 5. Standing Elf slight breathing sway
      if (elfStandingGroup) {
        elfStandingGroup.rotation.y = 0.7 + Math.sin(elapsed * 1.8) * 0.06;
      }

      // 6. Twinkling village tree lights
      for (let i = 0; i < villageTreeLights.length; i++) {
        const l = villageTreeLights[i];
        l.material.opacity = 0.35 + 0.65 * Math.abs(Math.sin(elapsed * 2.5 + l.phase));
      }

      // 7. Twinkling festoon fairy light garlands
      for (let i = 0; i < festoonBulbs.length; i++) {
        const b = festoonBulbs[i];
        b.material.opacity = 0.4 + 0.6 * Math.abs(Math.sin(elapsed * 2.0 + b.phase));
      }

      // 8. Gentle cozy breathing of cottage windows
      const windowBreath = 1.0 + 0.2 * Math.sin(elapsed * 2);
      windowGlowMat.emissiveIntensity = windowBreath;
    },
  };
}
