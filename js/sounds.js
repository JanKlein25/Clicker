/* ===========================
   SOUNDS.JS – Web Audio API Sound-Generator
   Keine externen Dateien nötig!
   =========================== */

let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playSound(type) {
  if (soundMuted) return;
  try { initAudio(); } catch(e) { return; }
  
  switch(type) {
    case 'click': playClickSound(); break;
    case 'buy': playBuySound(); break;
    case 'achievement': playAchievementSound(); break;
    case 'combo': playComboSound(); break;
    case 'golden': playGoldenSound(); break;
    case 'win': playWinSound(); break;
    case 'lose': playLoseSound(); break;
    case 'levelup': playLevelUpSound(); break;
  }
}

function playClickSound() {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  // Pitch scales with combo
  const basePitch = 800 + (comboState.tier * 200);
  osc.frequency.setValueAtTime(basePitch, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(basePitch * 1.5, audioCtx.currentTime + 0.05);
  osc.type = 'sine';
  
  gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
  
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.08);
}

function playBuySound() {
  // Ka-ching!
  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc1.connect(gain); osc2.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc1.frequency.setValueAtTime(1200, audioCtx.currentTime);
  osc1.frequency.setValueAtTime(1600, audioCtx.currentTime + 0.05);
  osc1.type = 'sine';
  
  osc2.frequency.setValueAtTime(1800, audioCtx.currentTime + 0.05);
  osc2.type = 'sine';
  
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
  
  osc1.start(audioCtx.currentTime);
  osc2.start(audioCtx.currentTime + 0.05);
  osc1.stop(audioCtx.currentTime + 0.15);
  osc2.stop(audioCtx.currentTime + 0.2);
}

function playAchievementSound() {
  // Triumphant fanfare - 3 ascending notes
  const notes = [523, 659, 784]; // C5, E5, G5
  notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.12);
    osc.type = 'triangle';
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime + i * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.12 + 0.4);
    osc.start(audioCtx.currentTime + i * 0.12);
    osc.stop(audioCtx.currentTime + i * 0.12 + 0.4);
  });
}

function playComboSound() {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  // Ascending pitch with combo level
  const pitch = 400 + (comboState.tier * 300);
  osc.frequency.setValueAtTime(pitch, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(pitch * 2, audioCtx.currentTime + 0.15);
  osc.type = 'sawtooth';
  gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.15);
}

function playGoldenSound() {
  // Magical shimmer
  const freqs = [880, 1109, 1319, 1568];
  freqs.forEach((f, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.setValueAtTime(f, audioCtx.currentTime + i * 0.08);
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime + i * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.08 + 0.5);
    osc.start(audioCtx.currentTime + i * 0.08);
    osc.stop(audioCtx.currentTime + i * 0.08 + 0.5);
  });
}

function playWinSound() {
  const notes = [523, 659, 784, 1047]; // C5-C6
  notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.1);
    osc.type = 'triangle';
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime + i * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.1 + 0.3);
    osc.start(audioCtx.currentTime + i * 0.1);
    osc.stop(audioCtx.currentTime + i * 0.1 + 0.3);
  });
}

function playLoseSound() {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.frequency.setValueAtTime(300, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.3);
  osc.type = 'sawtooth';
  gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.3);
}

function playLevelUpSound() {
  const notes = [440, 554, 659, 880];
  notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.08);
    osc.type = 'square';
    gain.gain.setValueAtTime(0.06, audioCtx.currentTime + i * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.08 + 0.25);
    osc.start(audioCtx.currentTime + i * 0.08);
    osc.stop(audioCtx.currentTime + i * 0.08 + 0.25);
  });
}

function toggleSound() {
  soundMuted = !soundMuted;
  const btn = document.getElementById('soundToggle');
  if (btn) btn.textContent = soundMuted ? '🔇' : '🔊';
}
