/* ===========================
   CRASH-MINES.JS – Crash Game + Mines
   =========================== */

/* --- CRASH CANVAS --- */
const cCanvas = document.getElementById('crashCanvas');
const ctx = cCanvas.getContext('2d');

function drawCrashGraph() {
  const w = cCanvas.width;
  const h = cCanvas.height;
  ctx.clearRect(0, 0, w, h);

  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for(let i=0; i<w; i+=50) { ctx.moveTo(i,0); ctx.lineTo(i,h); }
  for(let i=0; i<h; i+=50) { ctx.moveTo(0,i); ctx.lineTo(w,i); }
  ctx.stroke();

  if (!crashState.running && !crashState.crashed) return;

  const timeElapsed = Date.now() - crashState.startTime;
  const progress = Math.min(timeElapsed / 10000, 1);

  ctx.beginPath();
  ctx.moveTo(0, h);
  const endX = w * progress;
  let normalizedY = (crashState.currentMulti - 1) / 10;
  if(normalizedY > 0.9) normalizedY = 0.9;
  const endY = h - (normalizedY * h);

  ctx.quadraticCurveTo(endX / 2, h, endX, endY);
  ctx.strokeStyle = crashState.crashed ? "#e74c3c" : (crashState.cashedOut ? "#aaa" : "#8e44ad");
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.font = "30px Arial";
  ctx.fillText(crashState.crashed ? "💥" : "🚀", endX - 15, endY - 10);

  ctx.lineTo(endX, h);
  ctx.lineTo(0, h);
  ctx.fillStyle = crashState.crashed ? "rgba(231, 76, 60, 0.2)" : "rgba(142, 68, 173, 0.2)";
  ctx.fill();
}

function crashLoop() {
  if (!crashState.running) return;
  const now = Date.now();
  const timeElapsed = now - crashState.startTime;
  crashState.currentMulti = 1 + 0.00006 * timeElapsed + Math.pow(1.00015, timeElapsed) - 1;

  const uiMulti = document.getElementById('crash-current-multi');
  if(uiMulti) uiMulti.textContent = crashState.currentMulti.toFixed(2) + "x";

  if(!crashState.cashedOut) {
    const currentWin = Math.floor(crashState.bet * crashState.currentMulti);
    const amountSpan = document.getElementById('crash-btn-amount');
    if (amountSpan) { amountSpan.textContent = formatNum(currentWin); }
  }

  if (crashState.currentMulti >= crashState.crashPoint) {
    doCrash();
  } else {
    drawCrashGraph();
    crashState.animFrame = requestAnimationFrame(crashLoop);
  }
}

function crashAction() {
  const btn = document.getElementById('btnCrashAction');

  if (!crashState.running && !crashState.crashed) {
    const bet = getBet();
    if (!bet) return;

    crashState.bet = bet;
    payBet(bet);
    updateCasinoUI();
    disableButtons(true);
    btn.disabled = false;

    const r = Math.random();
    crashState.crashPoint = Math.max(1.00, Math.floor((0.96 / (1 - r)) * 100) / 100);
    crashState.running = true;
    crashState.crashed = false;
    crashState.cashedOut = false;
    crashState.startTime = Date.now();
    crashState.currentMulti = 1.00;

    document.getElementById('crash-current-multi').classList.remove('crashed-anim');
    document.getElementById('crash-current-multi').style.color = "#fff";
    document.getElementById('crash-status-text').textContent = "ROCKET FLYING...";

    btn.classList.add('btn-green');
    btn.innerHTML = `CASHOUT: <span id="crash-btn-amount" style="color:#2ecc71; pointer-events:none;">${formatNum(bet)}</span>`;

    crashLoop();
  }
  else if (crashState.running && !crashState.cashedOut) {
    crashState.cashedOut = true;
    const winAmount = Math.floor(crashState.bet * crashState.currentMulti);
    triggerWin(winAmount);

    const uiMulti = document.getElementById('crash-current-multi');
    uiMulti.style.color = "#2ecc71";
    document.getElementById('crash-status-text').textContent = "GEWONNEN!";
    btn.innerHTML = `GEWONNEN: ${formatNum(winAmount)}`;
    disableButtons(false);
    btn.disabled = true;
    btn.style.cursor = "not-allowed";
    saveGame();
  }
}

function startCrashCooldown() {
  disableButtons(false);
  const btn = document.getElementById('btnCrashAction');
  btn.disabled = true;
  btn.style.background = "#333";
  btn.style.cursor = "not-allowed";

  let timeLeft = 10;
  btn.innerHTML = `⏳ COOLDOWN (${timeLeft}s)`;

  const timerInterval = setInterval(() => {
    timeLeft--;
    btn.innerHTML = `⏳ COOLDOWN (${timeLeft}s)`;
    if (timeLeft < 0) {
      clearInterval(timerInterval);
      btn.disabled = false;
      btn.innerHTML = "STARTEN";
      btn.style.background = "linear-gradient(45deg, #8e44ad, #9b59b6)";
      btn.style.cursor = "pointer";
      crashState.crashed = false;
      updateCasinoUI();
    }
  }, 1000);
}

function doCrash() {
  crashState.running = false;
  crashState.crashed = true;
  cancelAnimationFrame(crashState.animFrame);

  crashState.currentMulti = crashState.crashPoint;
  const uiMulti = document.getElementById('crash-current-multi');
  uiMulti.textContent = crashState.crashPoint.toFixed(2) + "x";
  uiMulti.classList.add('crashed-anim');
  document.getElementById('crash-status-text').textContent = "CRASHED!";
  drawCrashGraph();
  addCrashHistory(crashState.crashPoint);

  setTimeout(() => { startCrashCooldown(); }, 2000);
}

function addCrashHistory(val) {
  crashState.history.unshift(val);
  if (crashState.history.length > 5) crashState.history.pop();

  const container = document.getElementById('crashHistory');
  container.innerHTML = '';
  crashState.history.forEach(v => {
    const div = document.createElement('div');
    const isHigh = v >= 2;
    div.className = `crash-hist-badge ${isHigh ? 'crash-hist-win' : 'crash-hist-loss'}`;
    div.textContent = v.toFixed(2) + "x";
    container.appendChild(div);
  });
}

/* --- MINES --- */
function getMinesMultiplier(minesCount, revealedCount) {
  const houseEdge = 0.85;
  let prob = 1;
  for (let i = 0; i < revealedCount + 1; i++) {
    prob *= (25 - minesCount - i) / (25 - i);
  }
  return (houseEdge / prob);
}

function updateMinesUI() {
  const grid = document.getElementById('mines-grid');
  grid.innerHTML = '';

  for(let i=0; i<25; i++) {
    const tile = document.createElement('div');
    tile.className = 'mines-tile';

    if (minesState.revealed.includes(i)) {
      tile.classList.add('revealed-gem');
      tile.innerHTML = '💎';
    }
    else if (!minesState.active && minesState.mines.includes(i)) {
      tile.classList.add('revealed-mine');
      tile.innerHTML = '💣';
    }
    else {
      tile.onclick = () => clickMineTile(i);
    }

    if(!minesState.active) tile.classList.add('disabled');
    grid.appendChild(tile);
  }

  const btn = document.getElementById('btnMinesAction');
  const nextMultiDisplay = document.getElementById('mines-next-multi');
  const currentMultiDisplay = document.getElementById('mines-current-multi');

  if (minesState.active && minesState.revealed.length > 0) {
    currentMultiDisplay.textContent = minesState.currentMulti.toFixed(2) + "x";
    currentMultiDisplay.style.color = "#2ecc71";
  } else {
    currentMultiDisplay.textContent = "/";
    currentMultiDisplay.style.color = "#555";
  }

  if (!minesState.active) {
    btn.textContent = "SPIELEN";
    btn.classList.remove('btn-green');
    btn.style.background = "linear-gradient(45deg, #2ecc71, #27ae60)";
    let nextM = getMinesMultiplier(minesState.count, 0);
    nextMultiDisplay.textContent = nextM.toFixed(2) + "x";
    document.getElementById('minesCountInput').disabled = false;
  } else {
    const currentWin = Math.floor(minesState.bet * minesState.currentMulti);
    if (minesState.revealed.length === 0) {
      btn.textContent = "CASHOUT (Start)";
    } else {
      btn.textContent = `CASHOUT: ${formatNum(currentWin)}`;
    }
    btn.style.background = "linear-gradient(45deg, #f1c40f, #d35400)";
    let nextM = getMinesMultiplier(minesState.count, minesState.revealed.length);
    nextMultiDisplay.textContent = nextM.toFixed(2) + "x";
    document.getElementById('minesCountInput').disabled = true;
  }
}

function minesAction() {
  if (!minesState.active) {
    const bet = getBet();
    if (!bet) return;

    let count = parseInt(document.getElementById('minesCountInput').value);
    if(count < 1) count = 1; if(count > 24) count = 24;

    payBet(bet);
    updateCasinoUI();

    minesState.bet = bet;
    minesState.count = count;
    minesState.active = true;
    minesState.revealed = [];
    minesState.currentMulti = 1.0;

    minesState.mines = [];
    while(minesState.mines.length < count) {
      let r = Math.floor(Math.random() * 25);
      if(!minesState.mines.includes(r)) minesState.mines.push(r);
    }

    document.getElementById('mines-overlay').style.display = 'none';
    updateMinesUI();
  }
  else {
    if(minesState.revealed.length === 0) {
      minesState.currentMulti = 1.0;
    }
    const win = Math.floor(minesState.bet * minesState.currentMulti);
    triggerWin(win);
    minesState.active = false;

    const overlay = document.getElementById('mines-overlay');
    const txt = document.getElementById('mines-result-text');
    txt.textContent = `GEWONNEN: ${formatNum(win)}`;
    txt.style.color = "#2ecc71";
    overlay.style.display = 'flex';
    setTimeout(() => overlay.style.display = 'none', 2000);

    updateMinesUI();
    saveGame();
  }
}

function clickMineTile(index) {
  if (!minesState.active || minesState.revealed.includes(index)) return;

  if (minesState.mines.includes(index)) {
    minesState.active = false;
    minesState.revealed = [];

    const overlay = document.getElementById('mines-overlay');
    const txt = document.getElementById('mines-result-text');
    txt.textContent = "BOOM! VERLOREN";
    txt.style.color = "#e74c3c";
    overlay.style.display = 'flex';
    setTimeout(() => overlay.style.display = 'none', 2000);

    updateMinesUI();
  }
  else {
    minesState.revealed.push(index);
    let newMulti = getMinesMultiplier(minesState.count, minesState.revealed.length - 1);
    minesState.currentMulti = newMulti;

    if (minesState.revealed.length === (25 - minesState.count)) {
      minesAction();
      return;
    }
    updateMinesUI();
  }
}
