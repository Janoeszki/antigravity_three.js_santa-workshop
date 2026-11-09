/**
 * scene.js — Scene, Camera, Renderer & Lighting setup
 * Cartoon-style North Pole scene with cel-shading friendly lighting
 */
import * as THREE from 'three';

// ── Scene ──
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0a2e, 0.005);

// ── Camera ──
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);
camera.position.set(0, 12, 30);
camera.lookAt(0, 2, 0);

// ── Renderer ──
const canvas = document.getElementById('scene-canvas');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

// ── Lighting ──
// Ambient — cool blue night fill
const ambientLight = new THREE.AmbientLight(0x3344aa, 0.5);
scene.add(ambientLight);

// Hemisphere — sky/ground bounce (blue sky, white snow bounce)
const hemiLight = new THREE.HemisphereLight(0x4466cc, 0xeeeeff, 0.4);
scene.add(hemiLight);

// Directional — moonlight
const moonLight = new THREE.DirectionalLight(0x8899cc, 0.8);
moonLight.position.set(20, 40, 10);
moonLight.castShadow = true;
moonLight.shadow.mapSize.set(1024, 1024);
moonLight.shadow.camera.left = -40;
moonLight.shadow.camera.right = 40;
moonLight.shadow.camera.top = 40;
moonLight.shadow.camera.bottom = -40;
moonLight.shadow.camera.near = 0.5;
moonLight.shadow.camera.far = 100;
scene.add(moonLight);

// ── Resize Handler ──
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onResize);

export { scene, camera, renderer };
