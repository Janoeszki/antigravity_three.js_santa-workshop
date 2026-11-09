/**
 * main.js — Bootstrap: initializes all scene elements and starts the render loop
 * North Pole Christmas Scene — Cartoon Style
 */
import { scene, camera, renderer } from './scene.js';
import { createControls } from './controls.js';
import { createGround } from './ground.js';
import { createNorthPole } from './northPole.js';
import { createWorkshop } from './workshop.js';
import { createTrees } from './trees.js';
import { createSnow } from './snow.js';
import { createReindeer } from './reindeer.js';
import { createGift } from './gift.js';
import { createElfVillage } from './elfVillage.js';
import { startAnimation } from './animate.js';
import { initAudioSystem } from './audio.js';

// ── Initialize all scene elements ──
const updatables = [];

// 1. OrbitControls
const controls = createControls(camera, renderer);

// 2. Ground, sky dome & stars
const ground = createGround(scene);
if (ground) updatables.push(ground);

// 3. North Pole striped pole
createNorthPole(scene);

// 4. Santa's Workshop
const workshop = createWorkshop(scene);
if (workshop) updatables.push(workshop);

// 5. Christmas trees with blinking lights
const trees = createTrees(scene);
if (trees) updatables.push(trees);

// 6. Falling snow particles
const snow = createSnow(scene);
if (snow) updatables.push(snow);

// 7. Reindeer with path animation
const reindeer = createReindeer(scene);
if (reindeer) updatables.push(reindeer);

// 8. Clickable gift (raycasting)
const gift = createGift(scene, camera);
if (gift) updatables.push(gift);

// 9. Elf Village in the distance
const elfVillage = createElfVillage(scene);
if (elfVillage) updatables.push(elfVillage);

// 10. Themamuziek en audiobesturing
initAudioSystem();

// ── Start the render loop ──
startAnimation(renderer, scene, camera, controls, updatables);

console.log('🎅 Noordpool Kerstscène geladen! Klik op het cadeau!');
