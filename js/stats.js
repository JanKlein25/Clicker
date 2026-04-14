/* ===========================
   STATS.JS – Statistik-Tracking & Modal
   =========================== */

function openStats() {
  document.getElementById('statsModal').style.display = 'flex';
  renderStats();
}

function closeStats() {
  document.getElementById('statsModal').style.display = 'none';
}

function trackPlayTime() {
  if (!game.stats) game.stats = {};
  if (!game.stats.sessionStart) game.stats.sessionStart = Date.now();
  const sessionSeconds = (Date.now() - game.stats.sessionStart) / 1000;
  game.stats.playTime = (game.stats.playTime || 0) + 1;
}

function renderStats() {
  const s = game.stats || {};
  const container = document.getElementById('stats-content');
  
  const playMins = Math.floor((s.playTime || 0) / 60);
  const playHrs = Math.floor(playMins / 60);
  const playTimeStr = playHrs > 0 ? `${playHrs}h ${playMins % 60}m` : `${playMins}m`;
  
  // CPS Breakdown
  let cpsBreakdown = '';
  let totalCPS = 0;
  BUILDINGS.forEach((b, i) => {
    if (game.buildings[i] > 0) {
      const cps = game.buildings[i] * getBuildingCPS(i);
      totalCPS += cps;
      cpsBreakdown += `
        <div class="stat-breakdown-row">
          <span>${b.icon} ${b.name}</span>
          <span class="stat-val">${formatNum(cps, 1)}/s (${game.buildings[i]}x)</span>
        </div>`;
    }
  });
  
  container.innerHTML = `
    <div class="stats-section">
      <div class="stats-section-title">📊 Allgemein</div>
      <div class="stat-row"><span>Gesamt-Klicks</span><span class="stat-val">${formatNum(game.clicks)}</span></div>
      <div class="stat-row"><span>Gesamt-Verdient</span><span class="stat-val">${formatNum(game.totalScore)}</span></div>
      <div class="stat-row"><span>Spielzeit</span><span class="stat-val">${playTimeStr}</span></div>
      <div class="stat-row"><span>Prestige-Resets</span><span class="stat-val">${s.totalPrestigeResets || 0}</span></div>
      <div class="stat-row"><span>Prestige-Level</span><span class="stat-val">${game.prestige}</span></div>
    </div>
    
    <div class="stats-section">
      <div class="stats-section-title">🔥 Combo & Klicks</div>
      <div class="stat-row"><span>Höchste Combo</span><span class="stat-val combo-highlight">x${s.highestCombo || 0}</span></div>
      <div class="stat-row"><span>Klick-Level</span><span class="stat-val">${game.clickLevel}</span></div>
      <div class="stat-row"><span>Golden Kleins gefangen</span><span class="stat-val">${s.goldenClicked || 0}</span></div>
    </div>
    
    <div class="stats-section">
      <div class="stats-section-title">🎰 Casino</div>
      <div class="stat-row"><span>Casino-Gewinne</span><span class="stat-val" style="color:#2ecc71">${s.casinoWins || 0}</span></div>
      <div class="stat-row"><span>Casino-Verluste</span><span class="stat-val" style="color:#e74c3c">${s.casinoLosses || 0}</span></div>
      <div class="stat-row"><span>Größter Casino-Gewinn</span><span class="stat-val" style="color:#f1c40f">${formatNum(s.biggestWin || 0)}</span></div>
    </div>
    
    <div class="stats-section">
      <div class="stats-section-title">🏆 Achievements</div>
      <div class="stat-row"><span>Freigeschaltet</span><span class="stat-val">${game.achievements.length} / ${ACHIEVEMENTS.length}</span></div>
      <div class="stat-row"><span>CPS-Bonus</span><span class="stat-val" style="color:#2ecc71">+${(((getAchievementBonus()-1)*100)).toFixed(0)}%</span></div>
    </div>
    
    <div class="stats-section">
      <div class="stats-section-title">🏭 CPS Breakdown</div>
      ${cpsBreakdown || '<div class="stat-row"><span style="color:#555">Noch keine Gebäude</span></div>'}
      <div class="stat-row" style="border-top:1px solid #333; padding-top:8px; margin-top:5px;">
        <span style="font-weight:900;">TOTAL CPS</span>
        <span class="stat-val" style="color:#f1c40f; font-weight:900;">${formatNum(totalCPS, 1)}/s</span>
      </div>
    </div>
  `;
}
