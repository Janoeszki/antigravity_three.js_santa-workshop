/**
 * controls.js — OrbitControls configuration
 * Smooth damped orbiting with restricted angles
 */
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/**
 * @param {THREE.PerspectiveCamera} camera
 * @param {THREE.WebGLRenderer} renderer
 * @returns {OrbitControls}
 */
export function createControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);

  // Smooth damping
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;

  // Restrict vertical angle — don't go below ground
  controls.minPolarAngle = 0.2;           // almost top-down
  controls.maxPolarAngle = Math.PI / 2.1; // just above horizon

  // Zoom limits
  controls.minDistance = 8;
  controls.maxDistance = 90;

  // Pan target near center
  controls.target.set(0, 2, 0);
  controls.update();

  return controls;
}
