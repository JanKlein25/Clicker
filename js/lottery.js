/* ===========================
   LOTTERY.JS – Jackpot / Lottery System
   =========================== */

function getPlayerColor(index) {
  return LOTTERY_PALETTE[index % LOTTERY_PALETTE.length];
}

function openLottery() {
  document.getElementById('lotteryModal').style.display = 'flex';
  syncLottery();
  if(lotteryTimerInterval) clearInterval(lotteryTimerInterval);
  lotteryTimerInterval = setInterval(updateLotteryLoop, 100);
  updateLotteryLoop();
}

function closeLottery() {
  document.getElementById('lotteryModal').style.display = 'none';
  if(lotteryAnimFrame) cancelAnimationFrame(lotteryAnimFrame);
}

function syncLottery() {
  if(!db) return;
  const ref = db.ref('lottery');

  ref.off();
  ref.on('value', (snapshot) => {
    const val = snapshot.val();
    const oldStatus = lotteryData.status;

    if (val && val.status === 'spinning' && val.spinStart) {
      if (Date.now() - val.spinStart > 15000) {
        console.log("Jackpot Reset (Timeout)");
        forcePayoutAndReset(val.winner, val.total);
        return;
      }
    }

    if(val) {
      lotteryData = val;
      if(!lotteryData.bets) lotteryData.bets = {};

      const potEl = document.getElementById('lottery-pot-display');
      if(potEl) potEl.textContent = formatNum(lotteryData.total || 0);

      renderLotteryList();

      if (lotteryData.status !== 'spinning') {
        drawLotteryWheel(0);
      }

      if (oldStatus !== 'spinning' && lotteryData.status === 'spinning') {
        startLotteryAnimation(lotteryData.winningTicket, lotteryData.total);
      }
    } else {
      lotteryData = { bets: {}, total: 0, status: 'waiting', drawTime: 0, spinStart: 0, winningTicket: 0 };
      renderLotteryList();
      drawLotteryWheel(0);
    }
  });
}

function enterLottery() {
  const input = document.getElementById('lotteryInput');
  const amount = parseInt(input.value);

  if(isNaN(amount) || amount <= 0) { alert("Ungültige Menge"); return; }
  if (lotteryData.status === 'spinning') { alert("Rad dreht bereits!"); return; }
  if(game.beers < amount) { alert("Nicht genug Bierchen!"); return; }

  game.beers -= amount;
  updateCasinoUI();
  saveGame();

  const ref = db.ref('lottery');
  ref.transaction((current) => {
    if (!current || typeof current !== 'object') {
      current = { bets: {}, total: 0, status: 'waiting', drawTime: 0, spinStart: 0, winningTicket: 0 };
    }
    if (!current.bets) current.bets = {};

    const oldBet = current.bets[game.playerName] || 0;
    current.bets[game.playerName] = oldBet + amount;
    current.total = (current.total || 0) + amount;

    const uniquePlayers = Object.keys(current.bets).length;
    if (uniquePlayers >= 2 && current.status === 'waiting') {
      current.status = 'countdown';
      current.drawTime = Date.now() + 60000;
    }
    return current;
  }, (error, committed) => {
    if (error) {
      game.beers += amount;
      saveGame();
      alert("Fehler bei der Wette.");
    } else {
      input.value = '';
    }
  });
}

function renderLotteryList() {
  const list = document.getElementById('lottery-list');
  if(!list) return;
  list.innerHTML = '';

  if(!lotteryData.bets || Object.keys(lotteryData.bets).length === 0) {
    list.innerHTML = '<div style="color:#555; text-align:center;">Warte auf Spieler...</div>';
    return;
  }

  const players = Object.keys(lotteryData.bets).sort();
  const displayPlayers = [...players].sort((a,b) => lotteryData.bets[b] - lotteryData.bets[a]);

  displayPlayers.forEach(p => {
    const amt = lotteryData.bets[p];
    const chance = ((amt / (lotteryData.total || 1)) * 100).toFixed(1);
    const colorIndex = players.indexOf(p);
    const playerColor = getPlayerColor(colorIndex);

    const row = document.createElement('div');
    row.style.display = 'flex'; row.style.justifyContent = 'space-between'; row.style.alignItems = 'center';
    row.style.borderBottom = '1px solid #333'; row.style.padding = '6px'; row.style.fontSize = '0.85rem';

    const nameColor = (p === game.playerName) ? '#fff' : '#ccc';
    const fontWeight = (p === game.playerName) ? '900' : 'normal';

    row.innerHTML = `
      <div style="display:flex; align-items:center;">
        <div style="width:12px; height:12px; background:${playerColor}; border-radius:50%; margin-right:8px; border:1px solid #fff;"></div>
        <span style="color:${nameColor}; font-weight:${fontWeight};">${p}</span>
      </div>
      <span>${formatNum(amt)} <span style="color:#555; font-size:0.75rem;">(${chance}%)</span></span>
    `;
    list.appendChild(row);
  });
}

function updateLotteryLoop() {
  const timerEl = document.getElementById('lottery-timer');
  if(!timerEl) return;

  const uniquePlayers = lotteryData.bets ? Object.keys(lotteryData.bets).length : 0;

  if (lotteryData.status === 'waiting') {
    timerEl.textContent = `Warte auf Spieler (${uniquePlayers}/mind. 2)`;
    timerEl.style.color = "#aaa";
  }
  else if (lotteryData.status === 'countdown') {
    const left = lotteryData.drawTime - Date.now();
    if (left <= 0) {
      timerEl.textContent = "ZIEHUNG LÄUFT...";
      if (left < -2000) performLotteryDraw();
    } else {
      timerEl.textContent = `START IN: ${(left/1000).toFixed(1)}s`;
      timerEl.style.color = "#f1c40f";
    }
  }
  else if (lotteryData.status === 'spinning') {
    timerEl.textContent = "VIEL GLÜCK! 🍀";
    timerEl.style.color = "#2ecc71";
  }
}

function performLotteryDraw() {
  if (Math.random() > 0.1) return;

  const ref = db.ref('lottery');
  ref.transaction((data) => {
    if (!data || data.status !== 'countdown') return;

    let r = Math.random() * data.total;
    let winner = null;
    let accum = 0;
    const players = Object.keys(data.bets).sort();

    for (let p of players) {
      accum += data.bets[p];
      if (r <= accum) { winner = p; break; }
    }
    if(!winner) winner = players[0];

    data.status = 'spinning';
    data.winner = winner;
    data.winningTicket = r;
    data.spinStart = Date.now();
    return data;
  });
}

function drawLotteryWheel(rotationOffset) {
  const canvas = document.getElementById('lotteryCanvas');
  if(!canvas) return;
  const lctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const cx = w/2; const cy = h/2; const r = w/2 - 5;

  lctx.clearRect(0,0,w,h);
  lctx.save();
  lctx.translate(cx, cy);
  lctx.rotate(rotationOffset);

  if(!lotteryData.bets || lotteryData.total === 0) {
    lctx.beginPath(); lctx.arc(0, 0, r, 0, 2*Math.PI);
    lctx.fillStyle = "#222"; lctx.fill(); lctx.stroke();
    lctx.restore();
    return;
  }

  const players = Object.keys(lotteryData.bets).sort();
  let startAngle = 0;

  players.forEach((p, index) => {
    const amt = lotteryData.bets[p];
    const total = lotteryData.total || 1;
    const sliceAngle = (amt / total) * 2 * Math.PI;

    lctx.beginPath(); lctx.moveTo(0, 0);
    lctx.arc(0, 0, r, startAngle, startAngle + sliceAngle); lctx.closePath();

    lctx.fillStyle = getPlayerColor(index);
    lctx.fill();
    lctx.strokeStyle = "#111"; lctx.lineWidth = 2; lctx.stroke();

    if (sliceAngle > 0.08) {
      lctx.save();
      lctx.rotate(startAngle + sliceAngle / 2);
      lctx.textAlign = "right"; lctx.textBaseline = "middle";
      lctx.fillStyle = "#fff"; lctx.font = "bold 14px Arial";
      lctx.shadowColor = "rgba(0,0,0,0.8)"; lctx.shadowBlur = 4;
      let displayName = p.length > 12 ? p.substring(0, 10) + ".." : p;
      lctx.fillText(displayName, r - 10, 0);
      lctx.restore();
    }
    startAngle += sliceAngle;
  });
  lctx.restore();
}

function startLotteryAnimation(winningTicket, total) {
  if(lotteryAnimFrame) cancelAnimationFrame(lotteryAnimFrame);

  const targetAngleInCircle = (winningTicket / (total || 1)) * 2 * Math.PI;
  const spins = 8 * 2 * Math.PI;
  const targetRotation = -targetAngleInCircle - (Math.PI / 2) + spins;

  let startTime = null;
  const duration = 8000;

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);

    drawLotteryWheel(targetRotation * ease);

    if (progress < 1) {
      lotteryAnimFrame = requestAnimationFrame(animate);
    } else {
      finishLottery(lotteryData.winner);
    }
  }
  lotteryAnimFrame = requestAnimationFrame(animate);
}

function finishLottery(winnerName) {
  const winAmt = lotteryData.total;

  const msgBox = document.getElementById('lottery-winner-msg');
  if(msgBox) {
    msgBox.style.display = 'block';
    document.getElementById('last-winner-name').textContent = winnerName;
    document.getElementById('last-winner-amt').textContent = formatNum(winAmt);
  }

  setTimeout(() => {
    forcePayoutAndReset(winnerName, winAmt);
  }, 4000);
}

function forcePayoutAndReset(winnerName, winAmt) {
  db.ref('lottery_payouts/' + winnerName).set(winAmt);
  db.ref('lottery').set({
    bets: {},
    total: 0,
    status: 'waiting',
    drawTime: 0,
    spinStart: 0,
    winningTicket: 0,
    lastWinnerName: winnerName,
    lastWinnerAmt: winAmt
  });
}
