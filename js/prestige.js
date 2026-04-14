/* ===========================
   PRESTIGE.JS – Prestige System
   =========================== */

function calculatePotentialPrestige() {
  if (game.totalScore < 100000000) return 0;
  return Math.floor(Math.pow(game.totalScore / 100000000, 0.25));
}

function openPrestige() {
  const current = game.prestige;
  const potentialTotal = calculatePotentialPrestige();
  const gain = potentialTotal - current;

  if (gain <= 0 && current === 0) return;

  document.getElementById('modal-current-prestige').textContent = formatNum(current);
  document.getElementById('modal-new-prestige').textContent = formatNum(potentialTotal);
  document.getElementById('modal-gain-prestige').textContent = formatNum(gain);
  document.getElementById('modal-gain-cases').textContent = formatNum(gain);

  const btn = document.getElementById('confirmPrestigeBtn');
  if (gain > 0) {
    btn.disabled = false;
    btn.innerHTML = `RESET & +${formatNum(gain)} LEVEL`;
    btn.style.opacity = "1";
  } else {
    btn.disabled = true;
    btn.innerHTML = "Du brauchst mehr Score!";
    btn.style.opacity = "0.5";
  }

  document.getElementById('prestigeModal').style.display = 'flex';
}

function closePrestige() {
  document.getElementById('prestigeModal').style.display = 'none';
}

function doPrestige() {
  const potentialTotal = calculatePotentialPrestige();
  if (potentialTotal <= game.prestige) return;

  const gain = potentialTotal - game.prestige;
  const beersGained = gain * 25;

  game.prestige = potentialTotal;
  game.cases += gain;
  game.beers += beersGained;

  game.score = 0;
  game.clicks = 0;
  game.clickLevel = 1;
  game.buildings = new Array(BUILDINGS.length).fill(0);
  game.upgrades = [];

  saveGame();
  alert(`ZEITREISE ERFOLGREICH! 🚀\n\nDu erhältst:\n+${gain} Prestige Level\n+${gain} Kisten\n+${beersGained} Bierchen 🍺`);
  location.reload();
}

function checkPrestigeUnlock() {
  const potential = calculatePotentialPrestige();
  const gain = potential - game.prestige;
  const btn = document.getElementById('prestigeBtn');

  if (gain > 0) {
    btn.style.display = 'block';
    btn.classList.add('win-pulse');
    btn.innerHTML = `🚀 AUFSTEIGEN (+${gain} Level)`;
  } else {
    btn.style.display = 'none';
  }

  const badge = document.getElementById('prestige-badge');
  if (game.prestige > 0 || game.totalScore > 10000) {
    badge.style.display = 'block';
    const currentProgressRank = Math.max(game.prestige, potential);
    const nextTargetRank = currentProgressRank + 1;
    const scoreNeededForNext = Math.pow(nextTargetRank, 4) * 100000000;
    const scoreForCurrent = Math.pow(currentProgressRank, 4) * 100000000;
    const remaining = scoreNeededForNext - game.totalScore;
    const totalDistance = scoreNeededForNext - scoreForCurrent;
    const coveredDistance = game.totalScore - scoreForCurrent;
    let percent = (coveredDistance / totalDistance) * 100;
    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;

    document.getElementById('prestige-level-display').textContent = formatNum(game.prestige);
    document.getElementById('prestige-bonus-display').textContent = formatNum(game.prestige * 5);
    document.getElementById('prestige-progress-bar').style.width = percent + "%";

    if (remaining > 0) {
      document.getElementById('prestige-next-req').textContent = formatNum(remaining) + " Kleinis";
    } else {
      document.getElementById('prestige-next-req').textContent = "Bereit zum Aufstieg!";
    }
  }
}
