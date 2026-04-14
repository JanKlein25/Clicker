/* ===========================
   CORE.JS – Game Loop, Init, Visuals, Click Handling, Golden, Combo
   KOMPLETT ÜBERARBEITET
   =========================== */

/* --- INIT --- */
function init() {
  loadGame();

  // Ensure stats object exists for old saves
  if (!game.stats) game.stats = { casinoWins:0, casinoLosses:0, highestCombo:0, goldenClicked:0, totalCasinoProfit:0, playTime:0, sessionStart:Date.now(), totalPrestigeResets:0, biggestWin:0 };
  if (!game.achievements) game.achievements = [];
  game.stats.sessionStart = Date.now();

  if (game.buildings.length < BUILDINGS.length) {
    const diff = BUILDINGS.length - game.buildings.length;
    for (let i = 0; i < diff; i++) game.buildings.push(0);
  }

  processOfflineEarnings();

  equipSkin(game.equippedSkin, true);
  buildBuildingUI();
  renderUpgrades();
  renderHistory();
  initVisuals();
  initProSlots();
  initCrazyWheel();
  requestAnimationFrame(gameLoop);
  setInterval(slowLoop, 1000);
  scheduleGolden();

  checkDailyBonus();
  checkAchievements();
  updateAchievementCounter();

  document.getElementById('betAmount').addEventListener('input', updateMoneyCaseUI);
  document.getElementById('betAmount').addEventListener('input', updateUpgraderCalc);

  if (game.playerName.startsWith("Spieler")) {
    const newName = prompt("Wie möchtest du auf dem Leaderboard heißen?", game.playerName);
    if (newName && newName.trim() !== "") {
      game.playerName = newName.trim().substring(0, 15);
      saveGame();
    }
  }
  document.getElementById('my-player-name').textContent = game.playerName;

  document.addEventListener('mousemove', (e) => {
    if (tooltipEl.style.display === 'block') {
      let top = e.clientY + 10; let left = e.clientX - 330;
      if (left < 10) left = e.clientX + 10;
      if (top + tooltipEl.offsetHeight > window.innerHeight) top = window.innerHeight - tooltipEl.offsetHeight - 10;
      tooltipEl.style.top = top + 'px'; tooltipEl.style.left = left + 'px';
    }
  });

  initPayoutListener();

  const minesInput = document.getElementById('minesCountInput');
  if (minesInput) {
    minesInput.addEventListener('input', function() {
      let val = parseInt(this.value);
      if (isNaN(val) || val < 1) val = 1;
      if (val > 24) val = 24;
      let nextM = getMinesMultiplier(val, 0);
      document.getElementById('mines-next-multi').textContent = nextM.toFixed(2) + "x";
    });
  }

  setTimeout(() => {
    updateTopPlayer();
    setInterval(updateTopPlayer, 10000);
  }, 2000);

  // Init audio on first interaction
  document.addEventListener('click', () => { try { initAudio(); } catch(e){} }, { once: true });
}

/* --- GAME LOOP --- */
let achievementCheckTimer = 0;

function gameLoop(now) {
  let dt = (now - lastTime) / 1000;
  if (dt > 1) dt = 1; lastTime = now;
  updateBuffs(dt);
  updateComboDecay(now);

  const passiveCps = calculateTotalCPS();
  clickHistory = clickHistory.filter(c => now - c.time < 1000);
  const activeClickCPS = clickHistory.reduce((sum, c) => sum + c.val, 0);

  if (passiveCps > 0) addScore(passiveCps * dt);

  const displayCps = passiveCps + activeClickCPS;

  document.getElementById('score').textContent = formatNum(Math.floor(game.score));
  document.getElementById('cps').textContent = formatNum(displayCps, 1) + " Kleinis / Sekunde";
  document.getElementById('main-beer-display').textContent = formatNum(Math.floor(game.beers || 0));

  updateDynamicBackground();
  updateClickUI();
  updateComboUI();

  if (!casinoUnlocked && game.totalScore >= 1000) {
    casinoUnlocked = true;
    document.getElementById('casinoBtn').style.display = 'block';
    document.getElementById('skinsBtn').style.display = 'block';
  } else if (casinoUnlocked) {
    document.getElementById('casinoBtn').style.display = 'block';
    document.getElementById('skinsBtn').style.display = 'block';
  }

  updateBuildingStates();
  checkPrestigeUnlock();

  // Check achievements every 2 seconds (not every frame)
  achievementCheckTimer += dt;
  if (achievementCheckTimer > 2) {
    achievementCheckTimer = 0;
    checkAchievements();
  }

  // Buff timer UI
  renderBuffs();

  // Auto Spin Logic
  if (slotState.auto && !slotState.spinning && currentCasinoMode === 'slots' && document.getElementById('casinoModal').style.display === 'flex') {
    spinProSlots();
  }

  requestAnimationFrame(gameLoop);
}

function slowLoop() {
  saveGame();
  renderUpgrades();
  trackPlayTime();
  BUILDINGS.forEach((_, i) => updateSingleBuildingUI(i));

  if (dbRef) {
    dbRef.child(game.playerName).set({
      name: game.playerName,
      score: Math.floor(game.totalScore),
      prestige: game.prestige || 0,
      beers: Math.floor(game.beers || 0),
      timestamp: firebase.database.ServerValue.TIMESTAMP
    }).catch(err => console.log("Sync error", err));
  }
}

/* --- COMBO SYSTEM --- */
function updateCombo() {
  const now = performance.now();
  const elapsed = now - comboState.lastClickTime;
  comboState.lastClickTime = now;

  // If click within 400ms of last, build combo
  if (elapsed < 400) {
    comboState.count++;
  } else if (elapsed < 800) {
    // Maintain but don't increase
  } else {
    comboState.count = 1;
  }

  // Calculate tier
  let oldTier = comboState.tier;
  if (comboState.count >= 20) {
    comboState.tier = 3;
    comboState.multi = 10;
  } else if (comboState.count >= 10) {
    comboState.tier = 2;
    comboState.multi = 5;
  } else if (comboState.count >= 5) {
    comboState.tier = 1;
    comboState.multi = 2;
  } else {
    comboState.tier = 0;
    comboState.multi = 1;
  }

  // Track highest combo
  if (comboState.tier > (game.stats.highestCombo || 0)) {
    game.stats.highestCombo = comboState.tier;
  }

  // Play sound on tier change
  if (comboState.tier > oldTier && comboState.tier > 0) {
    playSound('combo');
  }
}

function updateComboDecay(now) {
  if (comboState.lastClickTime > 0) {
    const elapsed = now - comboState.lastClickTime;
    if (elapsed > 1200) {
      comboState.count = 0;
      comboState.tier = 0;
      comboState.multi = 1;
    }
  }
}

function updateComboUI() {
  const bar = document.getElementById('combo-bar');
  const text = document.getElementById('combo-text');
  const fill = document.getElementById('combo-fill');
  if (!bar) return;

  if (comboState.tier > 0) {
    bar.style.display = 'flex';
    bar.className = `combo-bar tier-${comboState.tier}`;
    
    const tierNames = ['', '🔥 COMBO x2', '⚡ MEGA x5', '💥 ULTRA x10'];
    const tierColors = ['', '#e67e22', '#e74c3c', '#9b59b6'];
    text.textContent = tierNames[comboState.tier];
    text.style.color = tierColors[comboState.tier];
    
    // Fill bar based on progress to next tier
    const thresholds = [5, 10, 20, 999];
    const currentThreshold = thresholds[comboState.tier];
    const prevThreshold = comboState.tier > 0 ? thresholds[comboState.tier - 1] : 0;
    const progress = Math.min(((comboState.count - prevThreshold) / (currentThreshold - prevThreshold)) * 100, 100);
    fill.style.width = progress + '%';
    fill.style.background = tierColors[comboState.tier];
  } else {
    bar.style.display = 'none';
  }
}

/* --- VISUALS & BACKGROUND --- */
function initVisuals() {
  const container = document.getElementById('visual-canvas');
  container.innerHTML = '';
  visualElements = [];
  let totalCreated = 0;
  for (let i = BUILDINGS.length - 1; i >= 0; i--) {
    if (game.buildings[i] > 0) {
      let count = Math.min(Math.ceil(Math.log2(game.buildings[i] + 1)), 5);
      for (let k = 0; k < count; k++) {
        if (totalCreated < MAX_VISUALS) {
          spawnVisualIcon(BUILDINGS[i].icon);
          totalCreated++;
        }
      }
    }
  }
}

function spawnVisualIcon(iconChar) {
  const container = document.getElementById('visual-canvas');
  const el = document.createElement('div');
  el.className = 'bg-icon';
  el.textContent = iconChar;
  el.style.left = Math.random() * 90 + '%';
  el.style.top = Math.random() * 90 + '%';
  el.style.fontSize = (1 + Math.random()) + 'rem';
  el.style.animationDuration = (10 + Math.random() * 20) + 's';
  container.appendChild(el);
  visualElements.push(el);
}

function updateDynamicBackground() {
  const panel = document.getElementById('clickPanel');
  let s = game.totalScore;
  if (s < 10000) { }
  else if (s < 1000000) { panel.style.background = `radial-gradient(circle at center, #8e44ad 0%, #000000 100%)`; }
  else if (s < 1000000000) { panel.style.background = `radial-gradient(circle at center, #d35400 0%, #2d3436 100%)`; }
  else if (s < 1000000000000) { panel.style.background = `radial-gradient(circle at center, #f1c40f 0%, #2c3e50 100%)`; }
  else { panel.style.background = `radial-gradient(circle at center, #16a085 0%, #000 100%)`; }
}

/* --- CLICK HANDLING --- */
const bigKlein = document.getElementById('bigKlein');
bigKlein.addEventListener('mousedown', (e) => handleInteraction(e.clientX, e.clientY));
bigKlein.addEventListener('touchstart', (e) => { e.preventDefault(); for (let i = 0; i < e.touches.length; i++) handleInteraction(e.touches[i].clientX, e.touches[i].clientY); });

function handleInteraction(x, y) {
  clickCountSec++;
  if (clickCountSec > 30) return;

  // Build combo
  updateCombo();

  let power = getClickPower();
  
  // Apply combo multiplier
  power *= comboState.multi;
  
  // Apply click storm buff
  if (buffs.clickstorm && buffs.clickstorm.active) {
    power *= buffs.clickstorm.multi;
  }

  addScore(power);
  game.clicks++;
  clickHistory.push({ time: performance.now(), val: power });

  // Floating text – color changes with combo
  const comboColors = ['#fff', '#e67e22', '#e74c3c', '#9b59b6'];
  const color = comboColors[comboState.tier];
  spawnFloatingText(x, y, `+${formatNum(power)}`, color);
  spawnFallingFace(x, y);

  // Sound
  playSound('click');

  // Visual feedback
  const scale = 0.94 - (comboState.tier * 0.02);
  bigKlein.style.transform = `scale(${scale})`;
  setTimeout(() => bigKlein.style.transform = "scale(1)", 50);

  // Screen shake on high combo
  if (comboState.tier >= 2) {
    const panel = document.getElementById('clickPanel');
    panel.style.animation = 'none';
    panel.offsetHeight;
    panel.style.animation = 'screenShake 0.1s';
  }
}

function spawnFloatingText(x, y, text, color = '#fff') {
  const el = document.createElement('div');
  el.className = 'click-text';
  el.textContent = text;
  el.style.left = (x - 20 + Math.random() * 40) + 'px';
  el.style.top = y + 'px';
  el.style.color = color;
  
  // Bigger text for combos
  if (comboState.tier > 0) {
    el.style.fontSize = (1 + comboState.tier * 0.3) + 'rem';
    el.style.textShadow = `0 0 10px ${color}`;
  }
  
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 800);
}

function spawnFallingFace(x, y) {
  const currentSkin = SKINS.find(s => s.id === game.equippedSkin) || SKINS[0];
  const img = document.createElement('img');
  img.src = currentSkin.url;
  img.className = 'falling-face';
  img.style.filter = currentSkin.filter;
  img.style.left = (x - 17) + 'px'; img.style.top = (y - 17) + 'px';
  document.getElementById('clickPanel').appendChild(img); setTimeout(() => img.remove(), 1200);
}

/* --- GOLDEN KLEIN & BUFFS – OVERHAULED --- */
function updateBuffs(dt) {
  ['frenzy', 'clickstorm', 'casinobuff'].forEach(key => {
    if (buffs[key] && buffs[key].active) {
      buffs[key].time -= dt;
      if (buffs[key].time <= 0) {
        buffs[key].active = false;
      }
    }
  });
}

function renderBuffs() {
  const area = document.getElementById('buffArea');
  let html = '';
  
  if (buffs.frenzy.active) {
    html += `<div class="buff-icon buff-frenzy" title="Frenzy x7">🔥 <span class="buff-timer">${Math.ceil(buffs.frenzy.time)}s</span></div>`;
  }
  if (buffs.clickstorm && buffs.clickstorm.active) {
    html += `<div class="buff-icon buff-clickstorm" title="Click Storm x10">⚡ <span class="buff-timer">${Math.ceil(buffs.clickstorm.time)}s</span></div>`;
  }
  if (buffs.casinobuff && buffs.casinobuff.active) {
    html += `<div class="buff-icon buff-casino" title="Casino Buff x3">🎰 <span class="buff-timer">${Math.ceil(buffs.casinobuff.time)}s</span></div>`;
  }
  
  area.innerHTML = html;
}

// NEW: Golden Klein appears every 2-5 minutes (was 10-20 min)
function scheduleGolden() {
  const delay = (Math.random() * 180000) + 120000; // 2-5 min
  setTimeout(spawnGolden, delay);
}

function spawnGolden() {
  const g = document.getElementById('goldenKlein');
  const maxX = document.getElementById('clickPanel').offsetWidth - 80;
  const maxY = document.getElementById('clickPanel').offsetHeight - 80;
  g.style.left = Math.random() * maxX + 'px';
  g.style.top = Math.random() * maxY + 'px';
  g.style.display = 'block';
  g.classList.add('golden-spawn');
  
  // Auto-hide after 12s
  setTimeout(() => {
    if (g.style.display === 'block') {
      g.style.display = 'none';
      g.classList.remove('golden-spawn');
      scheduleGolden();
    }
  }, 12000);
}

document.getElementById('goldenKlein').onmousedown = function(e) {
  e.stopPropagation();
  this.style.display = 'none';
  this.classList.remove('golden-spawn');
  
  // Track
  if (!game.stats) game.stats = {};
  game.stats.goldenClicked = (game.stats.goldenClicked || 0) + 1;
  
  // Pick random buff from weighted list
  const totalWeight = GOLDEN_BUFFS.reduce((sum, b) => sum + b.weight, 0);
  let roll = Math.random() * totalWeight;
  let selectedBuff = GOLDEN_BUFFS[0];
  
  for (const buff of GOLDEN_BUFFS) {
    roll -= buff.weight;
    if (roll <= 0) { selectedBuff = buff; break; }
  }
  
  // Apply buff
  let message = '';
  playSound('golden');
  
  switch (selectedBuff.id) {
    case 'frenzy':
      buffs.frenzy.active = true;
      buffs.frenzy.time = 30;
      message = '🔥 FRENZY! (CPS x7, 30s)';
      break;
    case 'lucky':
      const luckyAmount = calculateTotalCPS() * 600; // 10 min CPS
      addScore(luckyAmount);
      message = `💰 LUCKY! +${formatNum(luckyAmount)} Kleinis!`;
      break;
    case 'clickstorm':
      buffs.clickstorm.active = true;
      buffs.clickstorm.time = 15;
      message = '⚡ CLICK STORM! (Klicks x10, 15s)';
      break;
    case 'casinobuff':
      buffs.casinobuff.active = true;
      buffs.casinobuff.time = 60;
      message = '🎰 CASINO BUFF! (Gewinne x3, 60s)';
      break;
  }
  
  // Spawn particles
  spawnGoldenParticles(parseInt(this.style.left), parseInt(this.style.top));
  
  // Show floating message
  const msgEl = document.createElement('div');
  msgEl.className = 'golden-message';
  msgEl.textContent = message;
  msgEl.style.color = selectedBuff.color;
  document.getElementById('clickPanel').appendChild(msgEl);
  setTimeout(() => msgEl.remove(), 2000);
  
  scheduleGolden();
};

function spawnGoldenParticles(x, y) {
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'golden-particle';
    p.textContent = '✨';
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    p.style.setProperty('--tx', (Math.random() * 300 - 150) + 'px');
    p.style.setProperty('--ty', (Math.random() * 300 - 150) + 'px');
    document.getElementById('clickPanel').appendChild(p);
    setTimeout(() => p.remove(), 1000);
  }
}

/* --- START --- */
init();
