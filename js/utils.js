/* ===========================
   UTILS.JS – Hilfsfunktionen
   =========================== */

function addScore(amount) {
  game.score += amount;
  game.totalScore += amount;
}

function getPrestigeMultiplier() {
  return 1 + (game.prestige * 0.05);
}

function getGlobalMultiplier() {
  let multi = getPrestigeMultiplier();
  // Achievement bonus
  multi *= getAchievementBonus();
  // Global upgrades
  UPGRADES.forEach(u => {
    if (u.type === 'global' && game.upgrades.includes(u.id)) {
      multi *= u.multi;
    }
  });
  return multi;
}

function formatNum(num, decimals = 0) {
  if (num < 1000000) {
    return num.toLocaleString('de-DE', {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals
    });
  }

  const units = [
    { val: 1e36, suffix: " Sext" },
    { val: 1e33, suffix: " Quintd" },
    { val: 1e30, suffix: " Quint" },
    { val: 1e27, suffix: " Quard" },
    { val: 1e24, suffix: " Quad" },
    { val: 1e21, suffix: " Trd" },
    { val: 1e18, suffix: " Trio" },
    { val: 1e15, suffix: " Brd" },
    { val: 1e12, suffix: " Bio" },
    { val: 1e9, suffix: " Mrd" },
    { val: 1e6, suffix: " Mio" }
  ];

  for (const unit of units) {
    if (num >= unit.val) {
      return (num / unit.val).toLocaleString('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) + unit.suffix;
    }
  }
  return num.toExponential(2);
}
