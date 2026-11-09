import * as THREE from 'three';

/**
 * Creates the iconic red-and-white striped North Pole pole
 * with a candy-cane spiral effect and a "NORTH POLE" sign.
 */
export function createNorthPole(scene) {
    const poleGroup = new THREE.Group();

    // ── Candy-cane stripe texture via canvas ──────────────────────────
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Fill white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw diagonal red stripes to create the barbershop / candy-cane spiral
    ctx.fillStyle = '#cc0000';
    const stripeWidth = 32; // width of each red stripe band
    const totalStripes = 20; // enough to cover the diagonal span
    for (let i = -totalStripes; i < totalStripes; i++) {
        const offset = i * stripeWidth * 2;
        ctx.beginPath();
        ctx.moveTo(offset, 0);
        ctx.lineTo(offset + stripeWidth, 0);
        ctx.lineTo(offset + stripeWidth - canvas.height, canvas.height);
        ctx.lineTo(offset - canvas.height, canvas.height);
        ctx.closePath();
        ctx.fill();
    }

    const stripeTexture = new THREE.CanvasTexture(canvas);
    stripeTexture.wrapS = THREE.RepeatWrapping;
    stripeTexture.wrapT = THREE.RepeatWrapping;
    stripeTexture.repeat.set(1, 6);

    // ── Pole cylinder ────────────────────────────────────────────────
    const poleGeometry = new THREE.CylinderGeometry(0.25, 0.25, 7, 16);
    const poleMaterial = new THREE.MeshToonMaterial({
        map: stripeTexture
    });
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.castShadow = true;
    pole.receiveShadow = true;
    poleGroup.add(pole);

    // ── Top sphere (bright red) ──────────────────────────────────────
    const sphereGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const sphereMaterial = new THREE.MeshToonMaterial({ color: 0xff0000 });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.y = 3.5 + 0.5; // top of the pole (7/2) + sphere radius
    sphere.castShadow = true;
    poleGroup.add(sphere);

    // ── Sign board texture via canvas ────────────────────────────────
    const signCanvas = document.createElement('canvas');
    signCanvas.width = 512;
    signCanvas.height = 256;
    const signCtx = signCanvas.getContext('2d');

    // Wooden brown background
    signCtx.fillStyle = '#8B4513';
    signCtx.fillRect(0, 0, signCanvas.width, signCanvas.height);

    // Subtle wood grain lines
    signCtx.strokeStyle = '#6B3410';
    signCtx.lineWidth = 1;
    for (let i = 0; i < signCanvas.height; i += 12) {
        signCtx.beginPath();
        signCtx.moveTo(0, i);
        signCtx.lineTo(signCanvas.width, i + (Math.random() * 4 - 2));
        signCtx.stroke();
    }

    // "NORTH POLE" text
    signCtx.fillStyle = '#ffffff';
    signCtx.font = 'bold 72px Arial, sans-serif';
    signCtx.textAlign = 'center';
    signCtx.textBaseline = 'middle';
    signCtx.fillText('NORTH POLE', signCanvas.width / 2, signCanvas.height / 2);

    const signTexture = new THREE.CanvasTexture(signCanvas);

    // ── Sign board mesh ──────────────────────────────────────────────
    const boardGeometry = new THREE.BoxGeometry(2.5, 1, 0.1);
    const boardMaterial = new THREE.MeshToonMaterial({
        map: signTexture
    });
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    board.castShadow = true;
    board.receiveShadow = true;

    // ── Mounting arm (small cylinder connecting board to pole) ───────
    const armGeometry = new THREE.CylinderGeometry(0.06, 0.06, 1.4, 8);
    const armMaterial = new THREE.MeshToonMaterial({ color: 0x8B4513 });
    const arm = new THREE.Mesh(armGeometry, armMaterial);
    arm.rotation.z = Math.PI / 2; // rotate horizontal
    arm.position.x = 0.7; // extend outward from pole
    arm.castShadow = true;

    // ── Sign sub-group (arm + board) ─────────────────────────────────
    const signGroup = new THREE.Group();
    signGroup.add(arm);
    board.position.x = 1.4 + 0.25; // offset beyond the arm end
    signGroup.add(board);

    // Position at roughly 2/3 of the pole height, slightly angled
    signGroup.position.y = 7 / 2 * 0.66; // ~2/3 height from center
    signGroup.rotation.y = -0.2; // slight angle for visual interest
    poleGroup.add(signGroup);

    // ── Position entire group in the scene ───────────────────────────
    poleGroup.position.set(12, 3.5, -8);
    scene.add(poleGroup);
}
