/* ===========================
   CASINO.JS – Casino Core + Roulette + Upgrader + Moneycase
   =========================== */

/* --- CASINO CORE --- */
function openCasino() {
  document.getElementById('casinoModal').style.display = 'flex';
  updateCasinoUI();
  generateStrip(50, null);
  const s = document.getElementById('rouletteStrip');
  s.style.transition = 'none'; s.style.transform = 'translateX(0px)';
  slotState.auto = false;
  document.getElementById('btnAuto').classList.remove('active');
}

function closeCasino() {
  document.getElementById('casinoModal').style.display = 'none';
  slotState.auto = false;
}

function updateCasinoUI() {
  const balanceEl = document.getElementById('casino-balance');
  const iconEl = document.getElementById('balance-icon');
  if (!balanceEl) return;

  if (casinoCurrency === 'kleinis') {
    balanceEl.textContent = formatNum(Math.floor(game.score));
    balanceEl.style.color = "#fff";
    if(iconEl) iconEl.style.display = 'none';
  } else {
    const beers = game.beers || 0;
    balanceEl.textContent = formatNum(Math.floor(beers));
    balanceEl.style.color = "#f1c40f";
    if(iconEl) {
      iconEl.src = BEER_ICON_SRC;
      iconEl.style.display = 'inline-block';
    }
  }
}

function setCasinoCurrency(type) {
  casinoCurrency = type;
  document.getElementById('btn-curr-kleinis').className = type === 'kleinis' ? 'curr-btn active' : 'curr-btn';
  document.getElementById('btn-curr-beers').className = type === 'beers' ? 'curr-btn active' : 'curr-btn';
  updateCasinoUI();
}

function getBet() {
  const betInput = document.getElementById('betAmount');
  let bet = parseInt(betInput.value);
  if (isNaN(bet) || bet <= 0) { alert("Wie viel willst du setzen?"); return null; }
  if (casinoCurrency === 'kleinis') {
    if (bet > game.score) { bet = Math.floor(game.score); betInput.value = bet; }
  } else {
    if (bet > game.beers) { bet = Math.floor(game.beers); betInput.value = bet; }
  }
  if (bet <= 0) {
    if(casinoCurrency === 'beers') alert("Keine Bierchen mehr! Warte auf den täglichen Bonus.");
    return null;
  }
  return bet;
}

function payBet(amount) {
  if (casinoCurrency === 'kleinis') {
    game.score -= amount;
  } else {
    game.beers -= amount;
  }
  updateCasinoUI();
}

function triggerWin(amount) {
  // Apply casino buff if active
  if (buffs.casinobuff && buffs.casinobuff.active) {
    amount = Math.floor(amount * buffs.casinobuff.multi);
    buffs.casinobuff.active = false; // One-time use
  }
  
  if (casinoCurrency === 'kleinis') {
    addScore(amount);
  } else {
    game.beers += amount;
  }
  
  // Track stats
  if (!game.stats) game.stats = {};
  game.stats.casinoWins = (game.stats.casinoWins || 0) + 1;
  if (amount > (game.stats.biggestWin || 0)) game.stats.biggestWin = amount;
  game.stats.totalCasinoProfit = (game.stats.totalCasinoProfit || 0) + amount;
  
  playSound('win');
  spawnConfetti();
  document.getElementById('casinoWindow').classList.add('win-pulse');
  setTimeout(() => document.getElementById('casinoWindow').classList.remove('win-pulse'), 500);
  updateCasinoUI();
}

function disableButtons(disable) {
  document.querySelectorAll('.bet-btn, .control-btn, .close-btn, .nav-btn, .open-case-btn').forEach(b => b.disabled = disable);
}

function spawnConfetti() {
  const win = document.getElementById('casinoWindow');
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div'); p.className = 'win-particle';
    p.style.backgroundColor = ['#f1c40f', '#e74c3c', '#2ecc71', '#3498db'][Math.floor(Math.random() * 4)];
    p.style.left = '50%'; p.style.top = '50%';
    p.style.setProperty('--tx', (Math.random() * 400 - 200) + 'px');
    p.style.setProperty('--ty', (Math.random() * 400 - 200) + 'px');
    win.appendChild(p); setTimeout(() => p.remove(), 1000);
  }
}

function renderHistory() {
  const con = document.getElementById('history-container'); con.innerHTML = '';
  game.casinoHistory.forEach(h => {
    const d = document.createElement('div'); d.className = `hist-dot hist-${h}`; con.appendChild(d);
  });
}

function setBetMultiplier(multi) {
  const input = document.getElementById('betAmount');
  if (multi === 'max') {
    if (casinoCurrency === 'kleinis') {
      input.value = Math.floor(game.score);
    } else {
      input.value = Math.floor(game.beers || 0);
    }
  } else {
    let val = parseInt(input.value) || 0;
    if (val === 0) val = 100;
    input.value = Math.floor(val * multi);
  }
  updateUpgraderCalc();
  updateMoneyCaseUI();
}

/* --- CASINO TAB SWITCHER --- */
function switchCasinoTab(mode) {
  currentCasinoMode = mode;
  document.getElementById('view-roulette').style.display = 'none';
  document.getElementById('view-slots').style.display = 'none';
  document.getElementById('view-upgrader').style.display = 'none';
  document.getElementById('view-case-money').style.display = 'none';
  document.getElementById('view-crash').style.display = 'none';
  document.getElementById('view-mines').style.display = 'none';
  document.getElementById('view-blackjack').style.display = 'none';
  document.getElementById('view-crazy').style.display = 'none';

  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  if (mode === 'roulette') {
    document.getElementById('view-roulette').style.display = 'block';
    document.getElementById('btn-tab-roulette').classList.add('active');
  } else if (mode === 'slots') {
    document.getElementById('view-slots').style.display = 'block';
    document.getElementById('btn-tab-slots').classList.add('active');
  } else if (mode === 'upgrader') {
    document.getElementById('view-upgrader').style.display = 'block';
    document.getElementById('btn-tab-upgrader').classList.add('active');
    updateUpgraderCalc();
  } else if (mode === 'moneycase') {
    document.getElementById('view-case-money').style.display = 'block';
    document.getElementById('btn-tab-moneycase').classList.add('active');
    updateMoneyCaseUI();
  } else if (mode === 'crash') {
    document.getElementById('view-crash').style.display = 'block';
    document.getElementById('btn-tab-crash').classList.add('active');
    const c = document.getElementById('crashCanvas');
    c.width = c.parentElement.offsetWidth;
    c.height = c.parentElement.offsetHeight;
    drawCrashGraph();
  } else if (mode === 'mines') {
    document.getElementById('view-mines').style.display = 'block';
    document.getElementById('btn-tab-mines').classList.add('active');
    updateMinesUI();
  } else if (mode === 'blackjack') {
    document.getElementById('view-blackjack').style.display = 'block';
    document.getElementById('btn-tab-blackjack').classList.add('active');
  } else if (mode === 'crazy') {
    document.getElementById('view-crazy').style.display = 'block';
    document.getElementById('btn-tab-crazy').classList.add('active');
  }
}

/* --- ROULETTE --- */
function generateStrip(count, winningColor) {
  const strip = document.getElementById('rouletteStrip');
  strip.innerHTML = '';
  for (let i = 0; i < count; i++) {
    let type = 'black';
    const r = Math.random();
    if (winningColor && i === 60) type = winningColor;
    else {
      if (r < 0.06) type = 'green';
      else if (r < 0.53) type = 'red';
      else type = 'black';
    }
    const el = document.createElement('div');
    el.className = `r-card rc-${type}`;
    if (type === 'green') el.innerHTML = `<img src="${DEFAULT_IMG}" class="rc-logo">`;
    else el.textContent = Math.floor(Math.random() * 7) + (type === 'black' ? 8 : 1);
    strip.appendChild(el);
  }
}

function spin(choice) {
  if (isSpinning) return;
  const bet = getBet();
  if (!bet) return;

  payBet(bet);
  updateCasinoUI();
  isSpinning = true;
  disableButtons(true);

  const r = Math.random();
  let result = 'black';
  if (r < 0.05) result = 'green';
  else if (r < 0.525) result = 'red';

  generateStrip(80, result);

  const strip = document.getElementById('rouletteStrip');
  strip.style.transition = 'none';
  strip.style.transform = 'translateX(0px)';
  strip.offsetHeight;

  const cardSize = 74;
  const targetIndex = 60;
  const centerOfTarget = (targetIndex * cardSize) + 35;
  const jitter = Math.floor(Math.random() * 50) - 25;
  const totalTranslate = centerOfTarget + jitter;

  strip.style.transition = 'transform 4.5s cubic-bezier(0.15, 0.85, 0.15, 1)';
  strip.style.transform = `translateX(-${totalTranslate}px)`;

  const marker = document.querySelector('.roulette-marker');
  marker.style.animation = "shake 0.1s infinite";
  setTimeout(() => marker.style.animation = "none", 4500);
  setTimeout(() => { finishSpin(choice, result, bet); }, 4500);
}

function finishSpin(choice, result, bet) {
  isSpinning = false;
  disableButtons(false);
  game.casinoHistory.unshift(result);
  if (game.casinoHistory.length > 10) game.casinoHistory.pop();
  renderHistory();

  let multiplier = 0;
  if (choice === result) {
    if (result === 'green') multiplier = 14;
    else multiplier = 2;
  }
  if (multiplier > 0) triggerWin(bet * multiplier);
  updateCasinoUI();
  saveGame();
}

/* --- UPGRADER --- */
function updateUpgraderCalc() {
  const bet = parseInt(document.getElementById('betAmount').value) || 0;
  let multi = parseFloat(document.getElementById('upgraderMulti').value) || 2.0;
  if (multi < 1.05) multi = 2;
  if (multi > 100) multi = 100;

  const houseEdge = 0.95;
  const winChance = (houseEdge / multi) * 100;

  document.getElementById('upgrader-chance-display').textContent = winChance.toFixed(2) + "%";
  document.getElementById('upgrader-win-preview').textContent = formatNum(Math.floor(bet * multi));

  const deg = (winChance / 100) * 360;
  const circle = document.getElementById('upgradeCircle');
  circle.style.setProperty('--deg', deg + 'deg');
  circle.style.setProperty('--green', '#2ecc71');
}

function startUpgrade() {
  if (isSpinning) return;
  const bet = getBet();
  if (!bet) return;

  let multi = parseFloat(document.getElementById('upgraderMulti').value);
  if (isNaN(multi) || multi < 2) { alert("Multiplikator ungültig (Min: 2x)"); return; }

  payBet(bet);
  updateCasinoUI();
  disableButtons(true);
  isSpinning = true;

  const btn = document.getElementById('btnUpgrade');
  btn.disabled = true;

  const houseEdge = 0.95;
  const winChance = (houseEdge / multi);
  const result = Math.random();
  const isWin = result < winChance;

  const circle = document.getElementById('upgradeCircle');
  circle.style.transition = 'none';
  circle.style.transform = 'rotate(0deg)';
  circle.offsetHeight;

  const winAngleRange = (winChance) * 360;
  let targetRotation;
  if (isWin) {
    const randomWinDegree = Math.random() * winAngleRange;
    targetRotation = (5 * 360) - randomWinDegree + 360;
  } else {
    const randomLossDegree = winAngleRange + (Math.random() * (360 - winAngleRange));
    targetRotation = (5 * 360) - randomLossDegree + 360;
  }

  circle.style.transition = 'transform 3s cubic-bezier(0.15, 0.9, 0.25, 1)';
  circle.style.transform = `rotate(${targetRotation}deg)`;

  setTimeout(() => {
    disableButtons(false);
    isSpinning = false;
    btn.disabled = false;

    if (isWin) {
      const winAmount = Math.floor(bet * multi);
      triggerWin(winAmount);
      circle.style.boxShadow = "0 0 50px #2ecc71";
      document.getElementById('upgrader-chance-display').textContent = "MACHER!";
      document.getElementById('upgrader-chance-display').style.color = "#2ecc71";
    } else {
      circle.style.setProperty('--green', '#555');
      document.getElementById('upgrader-chance-display').textContent = "NOOB!";
      document.getElementById('upgrader-chance-display').style.color = "#e74c3c";
    }

    updateCasinoUI();
    saveGame();

    setTimeout(() => {
      updateUpgraderCalc();
      document.getElementById('upgrader-chance-display').style.color = "#fff";
      circle.style.boxShadow = "0 0 30px rgba(0,0,0,0.5)";
    }, 2000);
  }, 3000);
}

/* --- MONEY CASE --- */
function getRandomFillerItem() {
  let pool = [];
  MONEY_CASE_ODDS.forEach(item => {
    for(let i=0; i < item.fillWeight; i++) pool.push(item);
  });
  return pool[Math.floor(Math.random() * pool.length)];
}

function updateMoneyCaseUI() {
  const bet = document.getElementById('betAmount').value || 0;
  const display = document.getElementById('key-price-display');
  if(display) display.textContent = formatNum(parseInt(bet));
}

function openMoneyCase() {
  const bet = getBet();
  if (!bet) return;
  if (isSpinning) return;

  payBet(bet);
  updateCasinoUI();
  disableButtons(true);
  isSpinning = true;

  let r = Math.random();
  let accumulated = 0;
  let winner = MONEY_CASE_ODDS[0];

  for (let item of MONEY_CASE_ODDS) {
    accumulated += item.chance;
    if (r < accumulated) { winner = item; break; }
  }

  const strip = document.getElementById('moneyCaseStrip');
  strip.innerHTML = '';
  strip.style.transition = 'none';
  strip.style.transform = 'translateX(0px)';

  const TOTAL_ITEMS = 60;
  const WIN_INDEX = 45;

  for (let i = 0; i < TOTAL_ITEMS; i++) {
    let item;
    if (i === WIN_INDEX) { item = winner; }
    else { item = getRandomFillerItem(); }

    const el = document.createElement('div');
    el.className = `mc-item ${item.style}`;
    el.innerHTML = `<div class="mc-multi">${item.multi}x</div><div class="mc-label">${item.name}</div>`;
    strip.appendChild(el);
  }

  strip.offsetHeight;

  const ITEM_FULL_WIDTH = 106;
  const containerWidth = document.querySelector('.case-spinner').offsetWidth;
  const jitter = Math.floor(Math.random() * 50) - 25;
  const scrollPos = (WIN_INDEX * ITEM_FULL_WIDTH) - (containerWidth / 2) + (ITEM_FULL_WIDTH / 2) + jitter;

  strip.style.transition = 'transform 6s cubic-bezier(0.15, 0.85, 0.15, 1)';
  strip.style.transform = `translateX(-${scrollPos}px)`;

  setTimeout(() => {
    isSpinning = false;
    disableButtons(false);

    const winAmount = Math.floor(bet * winner.multi);
    const btn = document.querySelector('#view-case-money .open-case-btn');

    if (winAmount > 0) {
      triggerWin(winAmount);
      const winBox = document.getElementById('winDisplay');
      document.getElementById('winAmountDisplay').textContent = `+${formatNum(winAmount)} Kleinis`;
      document.querySelector('.win-label').textContent = `${winner.multi}x GEWINN`;
      winBox.classList.add('show');
      setTimeout(() => winBox.classList.remove('show'), 2000);
      btn.innerHTML = `GEWONNEN: ${formatNum(winAmount)}`;
      btn.style.background = "linear-gradient(45deg, #2ecc71, #27ae60)";
    } else {
      btn.innerHTML = "NIETE (0x)";
      btn.style.background = "#444";
    }

    setTimeout(() => {
      btn.innerHTML = "KISTE ÖFFNEN";
      btn.style.background = "linear-gradient(45deg, #f39c12, #d35400)";
    }, 2000);

    updateCasinoUI();
    saveGame();
  }, 6000);
}
