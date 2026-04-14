/* ===========================
   SLOTS.JS – Pro Slot Machine 5x3
   =========================== */

function initProSlots() {
  const gridEl = document.getElementById('slotGrid');
  gridEl.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    let reelEl = document.createElement('div');
    reelEl.className = 'pro-reel';
    let strip = document.createElement('div');
    strip.className = 'reel-strip';
    strip.id = `pro-reel-${i}`;
    strip.style.transform = 'translateY(0px)';
    for (let j = 0; j < 3; j++) {
      let sym = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
      let div = document.createElement('div');
      div.className = 'slot-symbol';
      div.textContent = sym;
      strip.appendChild(div);
    }
    reelEl.appendChild(strip);
    gridEl.appendChild(reelEl);
  }
}

function toggleTurbo() {
  slotState.turbo = !slotState.turbo;
  const btn = document.getElementById('btnTurbo');
  if (slotState.turbo) btn.classList.add('active'); else btn.classList.remove('active');
}

function toggleAuto() {
  slotState.auto = !slotState.auto;
  const btn = document.getElementById('btnAuto');
  if (slotState.auto) btn.classList.add('active'); else btn.classList.remove('active');
}

function toggleSlotHelp() {
  const el = document.getElementById('slot-help-overlay');
  el.style.display = (el.style.display === 'flex') ? 'none' : 'flex';
}

function spinProSlots() {
  if (slotState.spinning) return;

  document.getElementById('paylineSvg').innerHTML = '';
  document.getElementById('winDisplay').classList.remove('show');

  const bet = getBet();
  if (!bet) {
    slotState.auto = false;
    document.getElementById('btnAuto').classList.remove('active');
    return;
  }

  payBet(bet);
  updateCasinoUI();
  slotState.spinning = true;
  disableButtons(true);
  document.getElementById('btnSpinSlots').disabled = true;

  // Determine Results
  let finalGrid = [];
  for (let i = 0; i < 5; i++) {
    let col = [];
    for (let r = 0; r < 3; r++) {
      let rnd = Math.random();
      let sym = '🍒';
      if (rnd < 0.015) sym = '👑';
      else if (rnd < 0.04) sym = '💎';
      else if (rnd < 0.09) sym = '7️⃣';
      else if (rnd < 0.15) sym = '🎰';
      else if (rnd < 0.22) sym = '🔔';
      else if (rnd < 0.32) sym = '🍀';
      else if (rnd < 0.45) sym = '🍉';
      else if (rnd < 0.60) sym = '🍇';
      else if (rnd < 0.75) sym = '🍊';
      else if (rnd < 0.88) sym = '🍋';
      else sym = '🍒';
      col.push(sym);
    }
    finalGrid.push(col);
  }

  // Animate Reels
  const SYMBOL_HEIGHT = 80;
  const SPINS = 20;

  for (let i = 0; i < 5; i++) {
    const strip = document.getElementById(`pro-reel-${i}`);
    let html = '';
    for (let k = 0; k < SPINS; k++) {
      let s = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
      html += `<div class="slot-symbol">${s}</div>`;
    }
    html += `<div class="slot-symbol">${finalGrid[i][0]}</div>`;
    html += `<div class="slot-symbol">${finalGrid[i][1]}</div>`;
    html += `<div class="slot-symbol">${finalGrid[i][2]}</div>`;

    strip.innerHTML = html;
    strip.style.transition = 'none';
    strip.style.transform = 'translateY(0px)';
    strip.offsetHeight;

    const targetY = -(SPINS * SYMBOL_HEIGHT);
    let duration = slotState.turbo ? 0.5 + (i * 0.1) : 1.5 + (i * 0.3);
    strip.style.transition = `transform ${duration}s cubic-bezier(0.25, 1, 0.5, 1)`;
    strip.style.transform = `translateY(${targetY}px)`;

    if (i === 4) {
      setTimeout(() => { checkSlotWins(finalGrid, bet); }, duration * 1000);
    }
  }
}

function checkSlotWins(grid, bet) {
  slotState.spinning = false;
  disableButtons(false);
  document.getElementById('btnSpinSlots').disabled = false;

  for (let i = 0; i < 5; i++) {
    const strip = document.getElementById(`pro-reel-${i}`);
    strip.style.transition = 'none';
    strip.innerHTML = '';
    for (let r = 0; r < 3; r++) {
      let d = document.createElement('div');
      d.className = 'slot-symbol';
      d.textContent = grid[i][r];
      strip.appendChild(d);
    }
    strip.style.transform = 'translateY(0px)';
  }

  const paylines = [
    [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1]],
    [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]],
    [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2]],
    [[0, 0], [1, 1], [2, 2], [3, 1], [4, 0]],
    [[0, 2], [1, 1], [2, 0], [3, 1], [4, 2]]
  ];

  let totalWin = 0;

  paylines.forEach((line, index) => {
    let firstNonWild = null;
    for (let i = 0; i < 5; i++) {
      let s = grid[line[i][0]][line[i][1]];
      if (s !== '👑') { firstNonWild = s; break; }
    }
    let targetSymbol = firstNonWild || '💎';

    let matchCount = 0;
    for (let i = 0; i < 5; i++) {
      let sym = grid[line[i][0]][line[i][1]];
      if (sym === targetSymbol || sym === '👑') matchCount++;
      else break;
    }

    if (matchCount >= 3) {
      let s = targetSymbol;
      let base = 0;
      if (s === '🍒') base = 0.5;
      else if (s === '🍋') base = 1;
      else if (s === '🍊') base = 1.5;
      else if (s === '🍇') base = 2.5;
      else if (s === '🍉') base = 4;
      else if (s === '🍀') base = 6;
      else if (s === '🔔') base = 10;
      else if (s === '🎰') base = 15;
      else if (s === '7️⃣') base = 40;
      else if (s === '💎') base = 100;

      if (matchCount === 4) base *= 2.5;
      if (matchCount === 5) base *= 10;
      totalWin += bet * base;

      let colors = ['#e74c3c', '#2ecc71', '#3498db', '#f1c40f', '#9b59b6'];
      drawPayline(line.slice(0, matchCount), colors[index % colors.length]);
    }
  });

  if (totalWin > 0) {
    triggerWin(totalWin);
    const box = document.getElementById('winDisplay');
    document.getElementById('winAmountDisplay').textContent = formatNum(totalWin);
    box.classList.add('show');
    setTimeout(() => box.classList.remove('show'), 1500);
  }

  updateCasinoUI();
  saveGame();
}

function drawPayline(coords, color) {
  const svg = document.getElementById('paylineSvg');
  let points = "";
  coords.forEach((c, i) => {
    let x = (c[0] * 100) + 50;
    let y = (c[1] * 80) + 40;
    points += `${x},${y} `;
  });

  const poly = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  poly.setAttribute("points", points);
  poly.setAttribute("fill", "none");
  poly.setAttribute("stroke", color);
  poly.setAttribute("stroke-width", "8");
  poly.setAttribute("stroke-linecap", "round");
  poly.setAttribute("stroke-linejoin", "round");
  poly.style.filter = "drop-shadow(0 0 5px " + color + ")";
  svg.appendChild(poly);
}
