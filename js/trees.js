import * as THREE from 'three';

/**
 * Creates a single Christmas tree with blinking lights
 * @param {number} height - Overall height scale of the tree
 * @param {number} x - X position
 * @param {number} z - Z position
 * @returns {{ group: THREE.Group, lights: Array }} The tree group and its light data
 */
function makeTree(height, x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // --- Trunk ---
    const trunkGeo = new THREE.CylinderGeometry(
        0.2 * height, // top radius
        0.3 * height, // bottom radius
        height * 0.3, // height
        8             // radial segments (low-poly)
    );
    const trunkMat = new THREE.MeshToonMaterial({ color: 0x6B3A2A });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = (height * 0.3) / 2; // sit on ground
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    group.add(trunk);

    // --- Crown: 3 stacked cone layers ---
    const crownBase = height * 0.3; // top of trunk

    // Bottom cone layer
    const bottomConeGeo = new THREE.ConeGeometry(height * 0.6, height * 0.5, 8);
    const bottomConeMat = new THREE.MeshToonMaterial({ color: 0x1a7a2a });
    const bottomCone = new THREE.Mesh(bottomConeGeo, bottomConeMat);
    bottomCone.position.y = crownBase + height * 0.25;
    bottomCone.castShadow = true;
    group.add(bottomCone);

    // Middle cone layer
    const midConeGeo = new THREE.ConeGeometry(height * 0.45, height * 0.4, 8);
    const midConeMat = new THREE.MeshToonMaterial({ color: 0x228B22 });
    const midCone = new THREE.Mesh(midConeGeo, midConeMat);
    midCone.position.y = crownBase + height * 0.5;
    midCone.castShadow = true;
    group.add(midCone);

    // Top cone layer
    const topConeGeo = new THREE.ConeGeometry(height * 0.3, height * 0.35, 8);
    const topConeMat = new THREE.MeshToonMaterial({ color: 0x2ea043 });
    const topCone = new THREE.Mesh(topConeGeo, topConeMat);
    topCone.position.y = crownBase + height * 0.75;
    topCone.castShadow = true;
    group.add(topCone);

    // --- Star on top ---
    const starGeo = new THREE.SphereGeometry(0.15, 8, 6);
    const starMat = new THREE.MeshBasicMaterial({ color: 0xFFD700 });
    const star = new THREE.Mesh(starGeo, starMat);
    star.position.y = crownBase + height * 0.75 + height * 0.35 / 2 + 0.15;
    group.add(star);

    // --- Blinking lights ---
    // Reference cone layers for placing lights on their surfaces
    const coneLayers = [
        { cone: bottomCone, radius: height * 0.6, h: height * 0.5, yBase: crownBase + height * 0.0 },
        { cone: midCone,    radius: height * 0.45, h: height * 0.4, yBase: crownBase + height * 0.3 },
        { cone: topCone,    radius: height * 0.3,  h: height * 0.35, yBase: crownBase + height * 0.575 },
    ];

    const lightColors = [0xff0000, 0x0066ff, 0xffff00, 0x00ff00, 0xff00ff, 0x00ffff];
    const numLights = 8 + Math.floor(Math.random() * 5); // 8-12 lights
    const lights = [];

    for (let i = 0; i < numLights; i++) {
        // Pick a random cone layer
        const layer = coneLayers[Math.floor(Math.random() * coneLayers.length)];

        // Random angle around the cone
        const angle = Math.random() * Math.PI * 2;
        // Random height fraction along the cone (0 = base, 1 = tip)
        const t = Math.random() * 0.85; // avoid the very tip
        // Cone radius shrinks linearly from base to tip
        const r = layer.radius * (1 - t) * 0.85; // slightly inset so lights sit on surface

        const lx = Math.cos(angle) * r;
        const lz = Math.sin(angle) * r;
        const ly = layer.yBase + t * layer.h;

        const lightGeo = new THREE.SphereGeometry(0.08, 6, 4);
        const color = lightColors[i % lightColors.length];
        const lightMat = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 1.0,
        });

        const lightMesh = new THREE.Mesh(lightGeo, lightMat);
        lightMesh.position.set(lx, ly, lz);
        group.add(lightMesh);

        // Store light data for animation
        lights.push({
            mesh: lightMesh,
            material: lightMat,
            phaseOffset: Math.random() * Math.PI * 2, // random phase for async twinkling
        });
    }

    return { group, lights };
}

/**
 * Creates multiple Christmas trees with twinkling lights and adds them to the scene.
 * @param {THREE.Scene} scene
 * @returns {{ update(delta: number, elapsed: number): void }}
 */
export function createTrees(scene) {
    // Tree placement positions and heights
    const treeConfigs = [
        { x:   8, z:   3, height: 3.0 },
        { x:  10, z:  -2, height: 2.5 },
        { x: -10, z:   2, height: 3.5 },
        { x:  -8, z:   6, height: 2.8 },
        { x:   6, z: -10, height: 4.0 },
        { x: -12, z:  -4, height: 3.2 },
        { x:  14, z:   5, height: 2.2 },
    ];

    // Collect all lights across all trees for the update loop
    const allLights = [];

    for (const cfg of treeConfigs) {
        const { group, lights } = makeTree(cfg.height, cfg.x, cfg.z);
        scene.add(group);
        allLights.push(...lights);
    }

    // Return the animation updater for twinkling lights
    return {
        /**
         * Update twinkling lights each frame
         * @param {number} delta - Time since last frame (seconds)
         * @param {number} elapsed - Total elapsed time (seconds)
         */
        update(delta, elapsed) {
            for (const light of allLights) {
                // Sinusoidal intensity modulation with per-light phase offset
                light.material.opacity =
                    0.3 + 0.7 * Math.abs(Math.sin(elapsed * 2 + light.phaseOffset));
            }
        },
    };
}
