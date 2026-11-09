/**
 * audio.js — Feestelijke kerstmuziek synthesiser en achtergrondmuziek controller.
 * Geen externe MP3-bestanden of netwerkverzoeken nodig: gebruikt de ingebouwde Web Audio API
 * om een sfeervol speeldoosje (celesta/carillon), warme bas en arrensleebellen te genereren!
 */

// ── Toonhoogtes naar frequenties ──────────────────────────────────────
const NOTE_SEMITONES = {
  'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
  'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
  'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
};

function noteToFreq(name) {
  if (!name || name === 'REST') return 0;
  const match = name.match(/^([A-G][#b]?)([0-9])$/);
  if (!match) return 0;
  const note = match[1];
  const octave = parseInt(match[2], 10);
  const semitone = NOTE_SEMITONES[note] + (octave - 4) * 12 - 9;
  return 440 * Math.pow(2, semitone / 12);
}

// ── Audio Context & state ─────────────────────────────────────────────
let audioCtx = null;
let masterGain = null;
let delayNode = null;
let delayGain = null;
let isMuted = false;
let isPlaying = false;
let schedulerTimer = null;
let currentEventIndex = 0;
let loopStartTime = 0;
let noiseBuffer = null;

const DEFAULT_VOLUME = 0.28;

// ── Witte ruis buffer voor arrensleebellen ──────────────────────────────
function getNoiseBuffer(ctx) {
  if (noiseBuffer) return noiseBuffer;
  const bufferSize = ctx.sampleRate * 0.1;
  noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  return noiseBuffer;
}

// ── Instrument synthesizers ──────────────────────────────────────────

/**
 * Speel een speeldoos / glockenspiel / celesta beltoon.
 * Combineert een grondtoon en een magische harmonische boventoon (2.76x)
 * met een snelle attack en vloeiende bel-uitdoving.
 */
function playMusicBoxChime(freq, time, duration = 0.8, volume = 0.4) {
  if (!audioCtx || freq <= 0) return;

  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator(); // glinsterende boventoon
  const gain1 = audioCtx.createGain();
  const gain2 = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(3600, time);

  // Grondtoon: warme sinus/driehoek
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(freq, time);

  // Boventoon: 2.756x (klassieke metalen staaf resonantie voor speeldoosjes)
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(freq * 2.756, time);

  // Envelope 1: Grondtoon
  const noteVol = volume * 0.6;
  gain1.gain.setValueAtTime(0.0001, time);
  gain1.gain.linearRampToValueAtTime(noteVol, time + 0.006);
  gain1.gain.exponentialRampToValueAtTime(0.0001, time + duration);

  // Envelope 2: Fonkelende boventoon (iets zachter en korter)
  const sparkleVol = volume * 0.22;
  gain2.gain.setValueAtTime(0.0001, time);
  gain2.gain.linearRampToValueAtTime(sparkleVol, time + 0.004);
  gain2.gain.exponentialRampToValueAtTime(0.0001, time + Math.min(0.45, duration * 0.7));

  // Aansluiting
  osc1.connect(gain1);
  osc2.connect(gain2);
  gain1.connect(filter);
  gain2.connect(filter);

  filter.connect(masterGain);
  if (delayNode) {
    // Stuur een vleugje naar de echo voor winterse ruimtelijkheid
    const sendGain = audioCtx.createGain();
    sendGain.gain.setValueAtTime(0.25, time);
    filter.connect(sendGain);
    sendGain.connect(delayNode);
  }

  osc1.start(time);
  osc2.start(time);
  osc1.stop(time + duration + 0.05);
  osc2.stop(time + duration + 0.05);
}

/**
 * Speel een warme basnoot ter ondersteuning van het akkoord.
 */
function playBass(freq, time, duration = 0.5, volume = 0.25) {
  if (!audioCtx || freq <= 0) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, time);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(350, time);

  const bassVol = volume * 0.5;
  gain.gain.setValueAtTime(0.0001, time);
  gain.gain.linearRampToValueAtTime(bassVol, time + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);

  osc.start(time);
  osc.stop(time + duration + 0.05);
}

/**
 * Speel een zachte arrensleebel (sleigh bell).
 * Maakt gebruik van gefilterde ruis en twee zachte belresonaties.
 */
function playSleighBell(time, volume = 0.12) {
  if (!audioCtx) return;

  // Ruiselement (shaker)
  const buffer = getNoiseBuffer(audioCtx);
  const noiseSource = audioCtx.createBufferSource();
  noiseSource.buffer = buffer;

  const bandpass = audioCtx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.setValueAtTime(6500, time);
  bandpass.Q.setValueAtTime(3.0, time);

  const noiseGain = audioCtx.createGain();
  noiseGain.gain.setValueAtTime(0.0001, time);
  noiseGain.gain.linearRampToValueAtTime(volume * 0.7, time + 0.004);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.08);

  noiseSource.connect(bandpass);
  bandpass.connect(noiseGain);
  noiseGain.connect(masterGain);

  noiseSource.start(time);
  noiseSource.stop(time + 0.09);

  // Belresonaties (twee hoge tonen die rinkelen)
  [2637, 3322].forEach(pFreq => {
    const pOsc = audioCtx.createOscillator();
    const pGain = audioCtx.createGain();
    pOsc.type = 'sine';
    pOsc.frequency.setValueAtTime(pFreq, time);

    pGain.gain.setValueAtTime(0.0001, time);
    pGain.gain.linearRampToValueAtTime(volume * 0.25, time + 0.003);
    pGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.07);

    pOsc.connect(pGain);
    pGain.connect(masterGain);
    pOsc.start(time);
    pOsc.stop(time + 0.08);
  });
}

// ── Muziek Compositie (Medley van Jingle Bells & We Wish You A Merry Christmas) ──

function buildScore() {
  const events = []; // { beat, track: 'melody'|'chord'|'bass'|'bell', note, duration, volume }
  let currentBeat = 0;

  // ──── DEEL 1: JINGLE BELLS (4/4 maat, 16 maten = 64 tellen) ────
  const jbMelody = [
    // Maat 1-2: Jingle bells, jingle bells,
    ['E4', 1], ['E4', 1], ['E4', 2],
    ['E4', 1], ['E4', 1], ['E4', 2],
    // Maat 3-4: jingle all the way!
    ['E4', 1], ['G4', 1], ['C4', 1.5], ['D4', 0.5],
    ['E4', 3.5], ['REST', 0.5],
    // Maat 5-6: Oh what fun it is to ride in a
    ['F4', 1], ['F4', 1], ['F4', 1.5], ['F4', 0.5],
    ['F4', 1], ['E4', 1], ['E4', 1], ['E4', 0.5], ['E4', 0.5],
    // Maat 7-8: one-horse open sleigh, hey!
    ['E4', 1], ['D4', 1], ['D4', 1], ['E4', 1],
    ['D4', 2], ['G4', 2],

    // Maat 9-10: Jingle bells, jingle bells,
    ['E4', 1], ['E4', 1], ['E4', 2],
    ['E4', 1], ['E4', 1], ['E4', 2],
    // Maat 11-12: jingle all the way!
    ['E4', 1], ['G4', 1], ['C4', 1.5], ['D4', 0.5],
    ['E4', 3.5], ['REST', 0.5],
    // Maat 13-14: Oh what fun it is to ride in a
    ['F4', 1], ['F4', 1], ['F4', 1.5], ['F4', 0.5],
    ['F4', 1], ['E4', 1], ['E4', 1], ['E4', 0.5], ['E4', 0.5],
    // Maat 15-16: one-horse open sleigh!
    ['G4', 1], ['G4', 1], ['F4', 1], ['D4', 1],
    ['C4', 3.5], ['REST', 0.5]
  ];

  let b = currentBeat;
  jbMelody.forEach(([note, dur]) => {
    if (note !== 'REST') {
      events.push({ beat: b, track: 'melody', note, dur: dur * 0.95, vol: 0.42 });
    }
    b += dur;
  });

  // Begeleiding Jingle Bells (Bass + Arrensleebel op elke tel)
  // Akkoordschema per 4 tellen (16 maten)
  const jbChords = [
    { bass: 'C3', chord: ['G3', 'C4', 'E4'] }, // M1
    { bass: 'C3', chord: ['G3', 'C4', 'E4'] }, // M2
    { bass: 'C3', chord: ['G3', 'C4', 'E4'] }, // M3
    { bass: 'C3', chord: ['G3', 'C4', 'E4'] }, // M4
    { bass: 'F3', chord: ['A3', 'C4', 'F4'] }, // M5
    { bass: 'C3', chord: ['G3', 'C4', 'E4'] }, // M6
    { bass: 'D3', chord: ['F#3', 'C4', 'D4'] }, // M7
    { bass: 'G2', chord: ['F3', 'B3', 'D4'] }, // M8
    { bass: 'C3', chord: ['G3', 'C4', 'E4'] }, // M9
    { bass: 'C3', chord: ['G3', 'C4', 'E4'] }, // M10
    { bass: 'C3', chord: ['G3', 'C4', 'E4'] }, // M11
    { bass: 'C3', chord: ['G3', 'C4', 'E4'] }, // M12
    { bass: 'F3', chord: ['A3', 'C4', 'F4'] }, // M13
    { bass: 'C3', chord: ['G3', 'C4', 'E4'] }, // M14
    { bass: 'G2', chord: ['F3', 'B3', 'D4'] }, // M15
    { bass: 'C3', chord: ['G3', 'C4', 'E4'] }  // M16
  ];

  jbChords.forEach((bar, barIdx) => {
    const barStart = currentBeat + barIdx * 4;
    // Bas op tel 0 en 2
    events.push({ beat: barStart, track: 'bass', note: bar.bass, dur: 0.8, vol: 0.28 });
    events.push({ beat: barStart + 2, track: 'bass', note: bar.bass === 'C3' ? 'G2' : bar.bass, dur: 0.8, vol: 0.25 });

    // Speeldoosje lichte akkoordjes op tel 1 en 3
    bar.chord.forEach(n => {
      events.push({ beat: barStart + 1, track: 'chord', note: n, dur: 0.5, vol: 0.16 });
      events.push({ beat: barStart + 3, track: 'chord', note: n, dur: 0.5, vol: 0.16 });
    });

    // Sleebellen op alle 4 tellen
    for (let beatOffset = 0; beatOffset < 4; beatOffset++) {
      events.push({ beat: barStart + beatOffset, track: 'bell', vol: 0.13 });
    }
  });

  currentBeat += 64; // Einde Jingle Bells

  // Rustige overgang (1 tel stilte)
  currentBeat += 1;

  // ──── DEEL 2: WE WISH YOU A MERRY CHRISTMAS (3/4 maat, 16 maten) ────
  const mcMelody = [
    // Opmaat: D4
    ['D4', 1],
    // M1: We wish you a merry
    ['G4', 1], ['G4', 0.5], ['A4', 0.5], ['G4', 0.5], ['F#4', 0.5],
    // M2: Christmas, we
    ['E4', 1], ['C4', 1], ['E4', 1],
    // M3: wish you a merry
    ['A4', 1], ['A4', 0.5], ['B4', 0.5], ['A4', 0.5], ['G4', 0.5],
    // M4: Christmas, we
    ['F#4', 1], ['D4', 1], ['F#4', 1],
    // M5: wish you a merry
    ['B4', 1], ['B4', 0.5], ['C5', 0.5], ['B4', 0.5], ['A4', 0.5],
    // M6: Christmas and a
    ['G4', 1], ['E4', 1], ['D4', 0.5], ['D4', 0.5],
    // M7: happy New
    ['E4', 1], ['A4', 1], ['F#4', 1],
    // M8: Year!
    ['G4', 2], ['D4', 1],

    // M9-12: Good tidings to you...
    ['G4', 1], ['G4', 1], ['G4', 1],
    ['F#4', 2], ['F#4', 1],
    ['G4', 1], ['F#4', 1], ['E4', 1],
    ['D4', 2], ['A4', 1],
    // M13-16: Good tidings for Christmas and a happy New Year!
    ['B4', 1], ['A4', 1], ['G4', 1],
    ['D5', 1], ['D4', 1], ['D4', 0.5], ['D4', 0.5],
    ['E4', 1], ['A4', 1], ['F#4', 1],
    ['G4', 2.5], ['REST', 0.5]
  ];

  let b2 = currentBeat;
  mcMelody.forEach(([note, dur]) => {
    if (note !== 'REST') {
      events.push({ beat: b2, track: 'melody', note, dur: dur * 0.95, vol: 0.44 });
    }
    b2 += dur;
  });

  // Begeleiding We Wish You A Merry Christmas (3/4 wals)
  const mcChords = [
    { bass: 'G2', chord: ['B3', 'D4', 'G4'] }, // M1
    { bass: 'C3', chord: ['G3', 'C4', 'E4'] }, // M2
    { bass: 'A2', chord: ['G3', 'C#4', 'E4'] }, // M3
    { bass: 'D3', chord: ['F#3', 'A3', 'D4'] }, // M4
    { bass: 'E3', chord: ['G3', 'B3', 'E4'] }, // M5
    { bass: 'C3', chord: ['G3', 'C4', 'E4'] }, // M6
    { bass: 'D3', chord: ['F#3', 'C4', 'D4'] }, // M7
    { bass: 'G2', chord: ['B3', 'D4', 'G4'] }, // M8
    { bass: 'G2', chord: ['B3', 'D4', 'G4'] }, // M9
    { bass: 'D3', chord: ['F#3', 'A3', 'D4'] }, // M10
    { bass: 'E3', chord: ['G3', 'B3', 'E4'] }, // M11
    { bass: 'D3', chord: ['F#3', 'A3', 'D4'] }, // M12
    { bass: 'G2', chord: ['B3', 'D4', 'G4'] }, // M13
    { bass: 'C3', chord: ['G3', 'C4', 'E4'] }, // M14
    { bass: 'D3', chord: ['F#3', 'C4', 'D4'] }, // M15
    { bass: 'G2', chord: ['B3', 'D4', 'G4'] }  // M16
  ];

  // Opmaat telt 1 tel
  const mcStartBeat = currentBeat + 1;
  mcChords.forEach((bar, idx) => {
    const barStart = mcStartBeat + idx * 3;
    // Walspatroon: Bas op 1, Akkoordjes op 2 en 3
    events.push({ beat: barStart, track: 'bass', note: bar.bass, dur: 1.1, vol: 0.26 });
    bar.chord.forEach(n => {
      events.push({ beat: barStart + 1, track: 'chord', note: n, dur: 0.6, vol: 0.15 });
      events.push({ beat: barStart + 2, track: 'chord', note: n, dur: 0.6, vol: 0.15 });
    });
    // Zachte sleebel op elke tel
    events.push({ beat: barStart, track: 'bell', vol: 0.11 });
    events.push({ beat: barStart + 1, track: 'bell', vol: 0.08 });
    events.push({ beat: barStart + 2, track: 'bell', vol: 0.08 });
  });

  currentBeat += 1 + 16 * 3; // Einde We Wish You A Merry Christmas
  currentBeat += 1; // 1 tel adempauze voor de loop herhaalt

  // Sorteer op timing
  events.sort((a, b) => a.beat - b.beat);

  return { events, totalBeats: currentBeat };
}

// ── Sequencer Scheduler ───────────────────────────────────────────────
const BPM = 126;
const SECONDS_PER_BEAT = 60 / BPM;
const LOOKAHEAD_SEC = 0.2;
const SCHEDULE_INTERVAL_MS = 50;

let scoreData = null;

function scheduleEvents() {
  if (!isPlaying || isMuted || !audioCtx) return;

  const currentTime = audioCtx.currentTime;
  const loopDuration = scoreData.totalBeats * SECONDS_PER_BEAT;

  // Plan noten in het venster [currentTime, currentTime + LOOKAHEAD_SEC]
  while (currentEventIndex < scoreData.events.length) {
    const ev = scoreData.events[currentEventIndex];
    const eventTime = loopStartTime + ev.beat * SECONDS_PER_BEAT;

    if (eventTime > currentTime + LOOKAHEAD_SEC) {
      // Dit event ligt nog te ver in de toekomst
      break;
    }

    if (eventTime >= currentTime - 0.05) {
      // Speel event
      if (ev.track === 'melody') {
        playMusicBoxChime(noteToFreq(ev.note), eventTime, ev.dur * SECONDS_PER_BEAT, ev.vol);
      } else if (ev.track === 'chord') {
        playMusicBoxChime(noteToFreq(ev.note), eventTime, ev.dur * SECONDS_PER_BEAT, ev.vol);
      } else if (ev.track === 'bass') {
        playBass(noteToFreq(ev.note), eventTime, ev.dur * SECONDS_PER_BEAT, ev.vol);
      } else if (ev.track === 'bell') {
        playSleighBell(eventTime, ev.vol);
      }
    }

    currentEventIndex++;
  }

  // Als we aan het einde van de cyclus zijn, begin naadloos opnieuw
  if (currentTime >= loopStartTime + loopDuration) {
    loopStartTime += loopDuration;
    currentEventIndex = 0;
  }
}

// ── Initialisatie & AudioContext ──────────────────────────────────────

function ensureAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();

    // Hoofdvolumeknop
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);

    // Ruimtelijk delay-effect voor magische kerstsfeer
    try {
      delayNode = audioCtx.createDelay(1.0);
      delayGain = audioCtx.createGain();
      const delayFilter = audioCtx.createBiquadFilter();

      delayNode.delayTime.setValueAtTime(0.24, audioCtx.currentTime);
      delayGain.gain.setValueAtTime(0.22, audioCtx.currentTime); // subtiele echo
      delayFilter.type = 'lowpass';
      delayFilter.frequency.setValueAtTime(2200, audioCtx.currentTime);

      // Feedback loop
      delayNode.connect(delayFilter);
      delayFilter.connect(delayGain);
      delayGain.connect(delayNode);
      delayGain.connect(masterGain);
    } catch {
      delayNode = null;
    }

    masterGain.connect(audioCtx.destination);
    scoreData = buildScore();
  }
  return audioCtx;
}

// ── Publieke Functies ─────────────────────────────────────────────────

/**
 * Start het afspelen van de muziek met een zachte fade-in.
 */
export async function startThemeMusic() {
  const ctx = ensureAudioContext();

  if (ctx.state === 'suspended') {
    try {
      await ctx.resume();
    } catch {
      // Wacht op gebruikersinteractie
      return false;
    }
  }

  if (ctx.state === 'running') {
    isPlaying = true;
    isMuted = false;
    currentEventIndex = 0;
    loopStartTime = ctx.currentTime + 0.05;

    // Fade in
    masterGain.gain.cancelScheduledValues(ctx.currentTime);
    masterGain.gain.setValueAtTime(masterGain.gain.value || 0.0001, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(DEFAULT_VOLUME, ctx.currentTime + 0.6);

    if (schedulerTimer) clearInterval(schedulerTimer);
    schedulerTimer = setInterval(scheduleEvents, SCHEDULE_INTERVAL_MS);
    updateMusicButtonUI(true);
    return true;
  }

  return false;
}

/**
 * Zet de muziek zachtjes uit (fade-out en pauzeer).
 */
export function stopThemeMusic() {
  if (!audioCtx || !isPlaying) return;

  const now = audioCtx.currentTime;
  masterGain.gain.cancelScheduledValues(now);
  masterGain.gain.setValueAtTime(masterGain.gain.value, now);
  masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.35);

  setTimeout(() => {
    isMuted = true;
    isPlaying = false;
    if (schedulerTimer) {
      clearInterval(schedulerTimer);
      schedulerTimer = null;
    }
    updateMusicButtonUI(false);
  }, 380);
}

/**
 * Wissel tussen muziek aan en uit.
 */
export function toggleThemeMusic() {
  if (isPlaying && !isMuted) {
    stopThemeMusic();
  } else {
    startThemeMusic();
  }
}

/**
 * Controleer of de muziek momenteel actief afspeelt.
 */
export function isMusicActive() {
  return isPlaying && !isMuted;
}

/**
 * Magische glinsterende arpeggio wanneer het cadeau geopend wordt!
 */
export function playGiftFanfare() {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const giftNotes = ['C5', 'E5', 'G5', 'B5', 'C6'];
  giftNotes.forEach((n, idx) => {
    const t = now + idx * 0.08;
    playMusicBoxChime(noteToFreq(n), t, 1.2, 0.45);
  });
  playSleighBell(now + 0.05, 0.2);
  playSleighBell(now + 0.25, 0.25);
}

// ── UI Koppeling en Autoplay Afhandeling ────────────────────────────────

function updateMusicButtonUI(active) {
  const btn = document.getElementById('music-toggle-btn');
  const icon = document.getElementById('music-btn-icon');
  const label = document.getElementById('music-btn-label');
  const eq = document.getElementById('music-btn-eq');

  if (!btn) return;

  if (active) {
    btn.classList.add('playing');
    btn.classList.remove('muted', 'pulse-prompt');
    btn.setAttribute('aria-label', 'Kerstmuziek uitschakelen');
    btn.title = 'Kerstmuziek uitzetten (M)';
    if (icon) icon.textContent = '🔊';
    if (label) label.textContent = 'Muziek: Aan';
    if (eq) eq.classList.add('active');
  } else {
    btn.classList.remove('playing', 'pulse-prompt');
    btn.classList.add('muted');
    btn.setAttribute('aria-label', 'Kerstmuziek inschakelen');
    btn.title = 'Kerstmuziek aanzetten (M)';
    if (icon) icon.textContent = '🔇';
    if (label) label.textContent = 'Muziek: Uit';
    if (eq) eq.classList.remove('active');
  }
}

/**
 * Initialiseert de UI-knop en zorgt voor naadloze autoplay bij het laden van de pagina.
 */
export function initAudioSystem() {
  const btn = document.getElementById('music-toggle-btn');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleThemeMusic();
    });
  }

  // Toetsenbord shortcut: 'M' om te dempen/afspelen
  window.addEventListener('keydown', (e) => {
    if (e.key === 'm' || e.key === 'M') {
      toggleThemeMusic();
    }
  });

  // 1. Probeer direct af te spelen bij het laden van de pagina
  startThemeMusic().then(started => {
    if (started) {
      console.log('🎵 Kerstmuziek gestart bij laden van pagina!');
    } else {
      // Moderne browsers blokkeren soms audio vóór de eerste klik/interactie.
      // We zetten een vriendelijke pulseer-indicator en starten direct zodra
      // de gebruiker de pagina aanraakt (klikt, sleept of toets indrukt).
      if (btn) {
        btn.classList.add('pulse-prompt');
      }

      const unlockAudio = () => {
        if (!isPlaying) {
          startThemeMusic();
        }
        window.removeEventListener('pointerdown', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
      };

      window.addEventListener('pointerdown', unlockAudio, { once: true });
      window.addEventListener('keydown', unlockAudio, { once: true });
    }
  });
}
