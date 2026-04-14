/* ===========================
   SAVE.JS – Speichern & Laden
   =========================== */

function saveGame() {
  game.lastLogin = Date.now();

  if (typeof game.beers === 'undefined') game.beers = 0;
  if (typeof game.lastDailyBonus === 'undefined') game.lastDailyBonus = 0;

  const data = {
    score: game.score,
    totalScore: game.totalScore,
    clicks: game.clicks,
    clickLevel: game.clickLevel,
    buildings: game.buildings,
    upgrades: game.upgrades,
    casinoHistory: game.casinoHistory,
    playerName: game.playerName,
    prestige: game.prestige || 0,
    cases: game.cases,
    skinsOwned: game.skinsOwned,
    equippedSkin: game.equippedSkin,
    lastLogin: game.lastLogin,
    beers: game.beers,
    lastDailyBonus: game.lastDailyBonus,
    hasClaimedRetroBeers: game.hasClaimedRetroBeers,
    achievements: game.achievements || [],
    stats: game.stats || {},
  };

  localStorage.setItem(SAVE_KEY, btoa(JSON.stringify(data)));
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    var saved;

    if (raw) {
      if (raw.startsWith("{")) {
        saved = JSON.parse(raw);
      } else {
        saved = JSON.parse(atob(raw));
      }
    }

    if (saved) {
      Object.keys(saved).forEach(key => {
        game[key] = saved[key];
      });

      if (typeof game.beers === 'undefined') game.beers = 0;
      if (typeof game.lastDailyBonus === 'undefined') game.lastDailyBonus = 0;

      if (game.buildings.length < BUILDINGS.length) {
        const diff = BUILDINGS.length - game.buildings.length;
        for (let i = 0; i < diff; i++) game.buildings.push(0);
      }
    }
  } catch(e) {
    console.log("Save error or new game", e);
  }

  // Retroaktive Bierchen-Nachzahlung
  if (game.prestige > 0 && !game.hasClaimedRetroBeers) {
    const retroRate = 25;
    const retroAmount = game.prestige * retroRate;

    if (!game.beers) game.beers = 0;
    game.beers += retroAmount;
    game.hasClaimedRetroBeers = true;
    saveGame();

    setTimeout(() => {
      alert(`🍻 TREUE-BONUS! 🍻\n\nDa du schon Prestige-Level ${game.prestige} bist, erhältst du nachträglich:\n+${retroAmount} Bierchen gutgeschrieben!`);
      updateCasinoUI();
    }, 1000);
  }
}

/* --- OFFLINE EARNINGS --- */
function processOfflineEarnings() {
  if (!game.lastLogin) return;

  const now = Date.now();
  let secondsOffline = (now - game.lastLogin) / 1000;

  if (secondsOffline > 10) {
    if (secondsOffline > 86400) {
      secondsOffline = 86400;
    }

    const currentCPS = calculateTotalCPS();
    const offlineEarnings = currentCPS * secondsOffline;

    if (offlineEarnings > 0) {
      addScore(offlineEarnings);

      const hours = Math.floor(secondsOffline / 3600);
      const minutes = Math.floor((secondsOffline % 3600) / 60);
      const timeText = hours > 0 ? `${hours}h ${minutes}m` : `${minutes} Minuten`;

      alert(`WILLKOMMEN ZURÜCK!\n\nDu warst ${timeText} weg.\n\nVerdient: +${formatNum(Math.floor(offlineEarnings))} Kleinis`);
    }
  }
}
