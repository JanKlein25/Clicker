/* ===========================
   CRAZY.JS – Crazy Wheel
   =========================== */

function initCrazyWheel() {
  const wheel = document.getElementById('crazy-wheel');
  if(!wheel) return;
  wheel.innerHTML = '';

  const logo = document.createElement('div');
  logo.className = 'wheel-center-logo';
  logo.innerHTML = '🤪';
  wheel.appendChild(logo);

  let gradientParts = [];
  const count = 54;
  const degPerSeg = 360 / count;

  for (let i = 0; i < count; i++) {
    const segType = CT_SEGMENTS[i];
    const startDeg = i * degPerSeg;
    const endDeg = (i + 1) * degPerSeg;
    const centerDeg = startDeg + (degPerSeg / 2);

    gradientParts.push(`${CT_COLORS[segType]} ${startDeg}deg ${endDeg}deg`);

    const separator = document.createElement('div');
    separator.className = 'wheel-separator';
    separator.style.transform = `rotate(${endDeg}deg)`;
    wheel.appendChild(separator);

    const textEl = document.createElement('div');
    textEl.className = 'wheel-text';

    let label = segType;
    let specialClass = '';

    if(segType === 'coin') { label = 'COIN<br>FLIP'; specialClass = 'wt-coin'; }
    else if(segType === 'pachinko') { label = 'PACH<br>INKO'; specialClass = 'wt-pachinko'; }
    else if(segType === 'cash') { label = 'CASH<br>HUNT'; specialClass = 'wt-cash'; }
    else if(segType === 'crazy') { label = 'CRAZY<br>TIME'; specialClass = 'wt-crazy'; }

    textEl.innerHTML = label;
    if(specialClass) textEl.classList.add(specialClass);

    if(!specialClass) {
      textEl.style.color = "#fff";
      if(segType === '2') textEl.style.color = "#000";
      textEl.style.fontSize = "1rem";
    }

    textEl.style.transform = `rotate(${centerDeg}deg)`;
    wheel.appendChild(textEl);
  }

  const gradientString = "conic-gradient(" + gradientParts.join(", ") + ")";
  wheel.style.background = gradientString;
  wheel.style.transform = 'rotate(0deg)';
}

function ctBet(type) {
  if(ctState.spinning) return;
  const baseBet = getBet();
  if(!baseBet) return;
  payBet(baseBet);
  ctState.bets[type] += baseBet;
  ctState.totalBet += baseBet;
  updateCasinoUI();
  updateCtUI();
}

function ctClearBets() {
  if(ctState.spinning) return;
  for(let key in ctState.bets) {
    if(casinoCurrency === 'kleinis') game.score += ctState.bets[key]; else game.beers += ctState.bets[key];
    ctState.bets[key] = 0;
  }
  ctState.totalBet = 0;
  updateCasinoUI();
  updateCtUI();
}

function updateCtUI() {
  for(let key in ctState.bets) {
    const el = document.getElementById(`ct-bet-${key}`);
    if(el) el.textContent = formatNum(ctState.bets[key]);
  }
  const total = document.getElementById('ct-total-bet');
  if(total) total.textContent = formatNum(ctState.totalBet);
}

function spinCrazyWheel() {
  if(ctState.spinning || ctState.totalBet === 0) {
    if(ctState.totalBet === 0) alert("Bitte erst wetten!");
    return;
  }
  ctState.spinning = true;
  disableButtons(true);
  runTopSlot().then(() => {
    setTimeout(startWheelPhysics, 500);
  });
}

function runTopSlot() {
  return new Promise(resolve => {
    const slotTarget = document.getElementById('ct-slot-target');
    const slotMulti = document.getElementById('ct-slot-multi');

    let spins = 0;
    let interval = setInterval(() => {
      const types = ['1','2','5','10','coin','pachinko','cash','crazy'];
      const rndType = types[Math.floor(Math.random() * types.length)];
      const rndMulti = [2, 3, 4, 5, 10, 20, 50][Math.floor(Math.random() * 7)];

      slotTarget.textContent = getCtIcon(rndType);
      slotMulti.textContent = rndMulti + "x";
      spins++;

      if(spins > 20) {
        clearInterval(interval);
        const finalType = types[Math.floor(Math.random() * types.length)];
        const finalMulti = [2, 3, 4, 5, 10, 15, 20, 25, 50][Math.floor(Math.random() * 9)];

        ctState.topSlot = { target: finalType, multi: finalMulti };
        slotTarget.textContent = getCtIcon(finalType);
        slotMulti.textContent = finalMulti + "x";

        const btn = document.querySelector(`.btn-${finalType}`);
        if(btn) btn.classList.add('active-slot-boost');

        resolve();
      }
    }, 100);
  });
}

function getCtIcon(type) {
  if(type === '1') return '1️⃣';
  if(type === '2') return '2️⃣';
  if(type === '5') return '5️⃣';
  if(type === '10') return '🔟';
  if(type === 'coin') return '🪙';
  if(type === 'pachinko') return '🟣';
  if(type === 'cash') return '🎯';
  if(type === 'crazy') return '🤪';
  return type;
}

function startWheelPhysics() {
  const wheel = document.getElementById('crazy-wheel');
  if (typeof ctState.rotation === 'undefined') { ctState.rotation = 0; }

  wheel.style.transition = 'none';
  wheel.style.transform = `rotate(${ctState.rotation}deg)`;
  void wheel.offsetWidth;

  const segmentIndex = Math.floor(Math.random() * 54);
  const winningSegment = CT_SEGMENTS[segmentIndex];
  const count = 54;
  const degPerSeg = 360 / count;

  const segStart = segmentIndex * degPerSeg;
  const segEnd = (segmentIndex + 1) * degPerSeg;
  const safeStart = segStart + 1.0;
  const safeEnd = segEnd - 1.0;
  const randomAngleInSegment = safeStart + Math.random() * (safeEnd - safeStart);
  const targetRotationSingle = 360 - randomAngleInSegment;

  let currentTotalRotation = ctState.rotation;
  let nextMinimumRotation = currentTotalRotation + (360 * 5);
  const currentMod = nextMinimumRotation % 360;
  let adjustment = targetRotationSingle - currentMod;
  if (adjustment < 0) { adjustment += 360; }
  let finalRotation = nextMinimumRotation + adjustment;
  ctState.rotation = finalRotation;

  setTimeout(() => {
    wheel.style.transition = 'transform 5s cubic-bezier(0.15, 0.85, 0.15, 1)';
    wheel.style.transform = `rotate(${ctState.rotation}deg)`;
  }, 50);

  setTimeout(() => { evaluateCtResult(winningSegment); }, 5050);
}

function evaluateCtResult(result) {
  let multiplier = 1;
  let isBonus = ['coin','pachinko','cash','crazy'].includes(result);

  let slotMatch = (ctState.topSlot.target === result);
  if(slotMatch) multiplier = ctState.topSlot.multi;

  const playerBet = ctState.bets[result];
  let totalWin = 0;

  if(playerBet > 0 && isBonus) {
    playCtBonus(result, multiplier, playerBet);
    return;
  }

  let winText = "";
  let isWin = false;

  if (playerBet > 0) {
    const numVal = parseInt(result);
    const odds = numVal * multiplier;
    totalWin = playerBet + (playerBet * odds);
    triggerWin(totalWin);
    isWin = true;
    winText = `+${formatNum(totalWin)} Kleinis`;
  } else {
    winText = "Kein Einsatz";
  }

  showCtResultPopup(result, winText, isWin);
  resetCtGame();
}

function showCtResultPopup(result, subText, isWin) {
  let popup = document.getElementById('ct-result-popup-dynamic');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'ct-result-popup-dynamic';
    popup.className = 'ct-result-popup';
    document.querySelector('.crazy-container').appendChild(popup);
  }

  const icon = getCtIcon(result);
  const subClass = isWin ? 'ct-res-win' : 'ct-res-loss';

  popup.innerHTML = `
    <span class="ct-res-icon">${icon}</span>
    <div class="ct-res-text">${result.toUpperCase()}</div>
    <div class="${subClass}">${subText}</div>
  `;

  setTimeout(() => popup.classList.add('show'), 10);
  setTimeout(() => { popup.classList.remove('show'); }, 3000);
}

function playCtBonus(gameType, slotMulti, bet) {
  const overlay = document.getElementById('ct-bonus-overlay');
  const title = document.getElementById('ct-bonus-title');
  const anim = document.getElementById('ct-bonus-anim');
  const resDiv = document.getElementById('ct-bonus-result');

  overlay.style.display = 'flex';
  title.textContent = gameType.toUpperCase() + " BONUS!";
  resDiv.textContent = "";

  let finalMulti = 0;

  if(gameType === 'coin') {
    anim.textContent = "Münze wird geworfen...";
    setTimeout(() => {
      let roll = [5, 10, 15, 20, 50][Math.floor(Math.random()*5)];
      finalMulti = roll * slotMulti;
      anim.textContent = `🔴 ${roll}x  vs  🔵 ${roll*2}x`;
      setTimeout(() => {
        let winColor = Math.random() > 0.5 ? "🔴" : "🔵";
        let winM = (winColor === "🔵") ? roll*2 : roll;
        finalMulti = winM * slotMulti;
        anim.textContent = `${winColor} GEWINNT!`;
        finishBonus(finalMulti, bet);
      }, 1500);
    }, 1000);
  } else if(gameType === 'pachinko') {
    anim.textContent = "Puck fällt...";
    setTimeout(() => {
      let drops = [10, 20, 50, 100, 200, "DOUBLE"];
      let hit = drops[Math.floor(Math.random()*drops.length)];
      if(hit === "DOUBLE") {
        anim.textContent = "✨ DOUBLE! ✨";
        let reHit = [20, 40, 100, 200, 500][Math.floor(Math.random()*5)];
        finalMulti = reHit * slotMulti;
        setTimeout(() => finishBonus(finalMulti, bet), 1000);
      } else {
        finalMulti = hit * slotMulti;
        finishBonus(finalMulti, bet);
      }
    }, 2000);
  } else if(gameType === 'cash') {
    anim.textContent = "Ziel auswählen! (Auto-Pick)";
    setTimeout(() => {
      let hit = Math.floor(Math.random() * 50) + 10;
      finalMulti = hit * slotMulti;
      finishBonus(finalMulti, bet);
    }, 1500);
  } else if(gameType === 'crazy') {
    title.style.color = "#e74c3c";
    anim.textContent = "🚪 WELT WIRD GEÖFFNET...";
    setTimeout(() => {
      let wheelRes = [20, 50, 100, 200, "DOUBLE", "TRIPLE"];
      let hit = wheelRes[Math.floor(Math.random()*wheelRes.length)];
      if(hit === "DOUBLE" || hit === "TRIPLE") {
        anim.textContent = `✨ ${hit} ✨`;
        let reHit = Math.floor(Math.random() * 500) + 200;
        finalMulti = reHit * slotMulti;
        setTimeout(() => finishBonus(finalMulti, bet), 1500);
      } else {
        finalMulti = hit * slotMulti;
        finishBonus(finalMulti, bet);
      }
    }, 2500);
  }
}

function finishBonus(multi, bet) {
  const resDiv = document.getElementById('ct-bonus-result');
  resDiv.textContent = `${multi}x MULTIPLIKATOR!`;
  const win = bet * multi;
  addScore(win);
  triggerWin(win);
  setTimeout(() => {
    document.getElementById('ct-bonus-overlay').style.display = 'none';
    resetCtGame();
  }, 3000);
}

function resetCtGame() {
  ctState.spinning = false;
  ctState.bets = { '1':0, '2':0, '5':0, '10':0, 'coin':0, 'pachinko':0, 'cash':0, 'crazy':0 };
  ctState.totalBet = 0;
  disableButtons(false);
  updateCasinoUI();
  updateCtUI();
  document.querySelectorAll('.ct-bet-btn').forEach(b => b.classList.remove('active-slot-boost'));
}

function toggleCtHelp() {
  const el = document.getElementById('ct-help-overlay');
  if (el.style.display === 'none' || el.style.display === '') {
    el.style.display = 'flex';
  } else {
    el.style.display = 'none';
  }
}
