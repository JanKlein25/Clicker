/* ===========================
   BEERS.JS – Bierchen System & Daily Bonus
   =========================== */

function checkDailyBonus() {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  if (!game.lastDailyBonus) game.lastDailyBonus = 0;

  if (now - game.lastDailyBonus > oneDay) {
    const bonusAmount = 50;
    if (!game.beers) game.beers = 0;
    game.beers += bonusAmount;
    game.lastDailyBonus = now;
    saveGame();

    alert(`🍻 PROST! TÄGLICHER BONUS! 🍻\n\nDu hast einen frischen Kasten mit ${bonusAmount} Bierchen erhalten!\nVerzocke sie weise im Casino.`);

    if (typeof updateCasinoUI === "function") {
      updateCasinoUI();
    }
  }
}

/* --- BEER MODAL --- */
function openBeerModal() {
  document.getElementById('beerModal').style.display = 'flex';
  document.getElementById('modal-beer-amount').textContent = formatNum(Math.floor(game.beers || 0));
  updateBeerTimer();
  beerTimerInterval = setInterval(updateBeerTimer, 1000);
}

function closeBeerModal() {
  document.getElementById('beerModal').style.display = 'none';
  if(beerTimerInterval) clearInterval(beerTimerInterval);
}

function updateBeerTimer() {
  const el = document.getElementById('beer-timer-display');
  if(!el) return;

  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const last = game.lastDailyBonus || 0;
  const nextBonusTime = last + oneDay;
  const diff = nextBonusTime - now;

  if (diff <= 0) {
    el.innerHTML = "<span style='color:#2ecc71'>JETZT VERFÜGBAR!</span>";
  } else {
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    const hStr = h < 10 ? "0" + h : h;
    const mStr = m < 10 ? "0" + m : m;
    const sStr = s < 10 ? "0" + s : s;
    el.textContent = `${hStr}:${mStr}:${sStr}`;
    el.style.color = "#f1c40f";
  }
}
