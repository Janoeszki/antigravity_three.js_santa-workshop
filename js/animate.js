/**
 * animate.js — Main render loop with delta-time
 */
import * as THREE from 'three';

const clock = new THREE.Clock();

/**
 * Start the animation loop.
 * @param {THREE.WebGLRenderer} renderer
 * @param {THREE.Scene} scene
 * @param {THREE.PerspectiveCamera} camera
 * @param {OrbitControls} controls
 * @param {Array<{update: (delta: number, elapsed: number) => void}>} updatables
 */
export function startAnimation(renderer, scene, camera, controls, updatables) {
  function loop() {
    requestAnimationFrame(loop);

    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    // Update controls (damping)
    controls.update();

    // Update all animated elements
    for (const obj of updatables) {
      obj.update(delta, elapsed);
    }

    // Render
    renderer.render(scene, camera);
  }

  loop();
}
