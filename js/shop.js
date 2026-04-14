/* ===========================
   SHOP.JS – Gebäude, Upgrades, Click Stats, Tooltip
   =========================== */

// --- TOOLTIP ELEMENTS ---
const tooltipEl = document.getElementById('global-tooltip');
const ttName = document.getElementById('tt-name-display');
const ttPrice = document.getElementById('tt-price-display');
const ttEffect = document.getElementById('tt-effect-display');
const ttDesc = document.getElementById('tt-desc-display');
const ttStats = document.getElementById('tt-stats-container');

/* --- BUILDING MATH --- */
function getBuildingMultiplier(index) {
  let m = 1;
  UPGRADES.forEach(u => { if (u.type === 'build' && u.target === index && game.upgrades.includes(u.id)) m *= u.multi; });
  if (buffs.frenzy && buffs.frenzy.active) m *= buffs.frenzy.multi;
  return m * getGlobalMultiplier();
}

function getBuildingCPS(index) { return BUILDINGS[index].baseCps * getBuildingMultiplier(index); }
function calculateTotalCPS() { let cps = 0; game.buildings.forEach((count, i) => cps += count * getBuildingCPS(i)); return cps; }

function getBuildingCost(i) { return Math.floor(BUILDINGS[i].baseCost * Math.pow(1.15, game.buildings[i])); }

function buyBuilding(i) {
  const cost = getBuildingCost(i);
  if (game.score >= cost) {
    game.score -= cost;
    game.buildings[i]++;
    updateSingleBuildingUI(i);
    renderUpgrades();
    playSound('buy');
    if (visualElements.length < MAX_VISUALS) spawnVisualIcon(BUILDINGS[i].icon);
  }
}

/* --- BUILDING UI --- */
function buildBuildingUI() {
  const list = document.getElementById('buildingList'); list.innerHTML = '';
  BUILDINGS.forEach((b, i) => {
    const el = document.createElement('div'); el.className = 'building-row'; el.id = `build-row-${i}`; el.onclick = () => buyBuilding(i);
    el.innerHTML = `<div class="b-icon">${b.icon}</div><div class="b-info"><div class="b-name">${b.name}</div><div class="b-cps" id="b-cps-${i}">Prod: ...</div><div class="b-cost"><span id="cost-${i}">0 Kleinis</span> <span id="gain-${i}" style="color:#2ecc71; font-size:0.8rem; margin-left:6px; font-weight:normal;"></span></div></div><div class="b-count" id="count-${i}">0</div>`;
    list.appendChild(el); updateSingleBuildingUI(i);
  });
}

function updateSingleBuildingUI(i) {
  document.getElementById(`count-${i}`).textContent = game.buildings[i];
  document.getElementById(`cost-${i}`).textContent = formatNum(getBuildingCost(i)) + " Kleinis";
  const realCps = getBuildingCPS(i);
  document.getElementById(`b-cps-${i}`).textContent = `Prod: ${formatNum(realCps, 1)}/s`;
  document.getElementById(`gain-${i}`).textContent = `(+${formatNum(realCps, 1)} CPS)`;
}

function updateBuildingStates() {
  BUILDINGS.forEach((b, i) => {
    const row = document.getElementById(`build-row-${i}`);
    const costDiv = row.querySelector('.b-cost');
    if (game.score >= getBuildingCost(i)) {
      row.classList.add('can-afford');
      costDiv.classList.add('affordable');
    } else {
      row.classList.remove('can-afford');
      costDiv.classList.remove('affordable');
    }
  });
}

/* --- CLICK UPGRADE --- */
function getClickPower(lvl = game.clickLevel) {
  let baseDamage = 1 + ((lvl - 1) * 5);
  let cpsPercentage = 0.05 + (lvl * 0.01);
  let cpsPower = calculateTotalCPS() * cpsPercentage;
  let power = baseDamage + cpsPower;
  UPGRADES.forEach(u => { if (u.type === 'click' && game.upgrades.includes(u.id)) power *= u.multi; });
  if (buffs.frenzy && buffs.frenzy.active) power *= buffs.frenzy.multi;
  return power * getGlobalMultiplier();
}

function getClickLevelCost() {
  return Math.floor(500 * Math.pow(1.8, game.clickLevel));
}

function buyClickStats() {
  const cost = getClickLevelCost();
  if (game.score >= cost) {
    game.score -= cost;
    game.clickLevel++;
    updateClickUI();
    playSound('levelup');
    const btn = document.getElementById('btn-buy-click');
    btn.style.transform = "scale(1.1)";
    setTimeout(() => btn.style.transform = "scale(1)", 100);
  }
}

function updateClickUI() {
  const cost = getClickLevelCost();
  const currentPower = getClickPower(game.clickLevel);
  const nextPower = getClickPower(game.clickLevel + 1);
  const currentPercent = Math.round((0.05 + (game.clickLevel * 0.01)) * 100);
  const nextPercent = Math.round((0.05 + ((game.clickLevel + 1) * 0.01)) * 100);

  document.getElementById('click-effect-desc').innerHTML = `${currentPercent}% CPS <span style="font-size:0.8em; color:#777">➜</span> ${nextPercent}% CPS`;
  document.getElementById('click-dmg-display').innerHTML = `${formatNum(currentPower, 1)} <span style="font-size:0.8em; color:#7f8c8d">➜</span> <span style="color:#2ecc71">${formatNum(nextPower, 1)}</span>`;
  document.getElementById('click-cost-display').textContent = formatNum(cost);

  const btn = document.getElementById('btn-buy-click');
  if (game.score >= cost) btn.classList.remove('locked');
  else btn.classList.add('locked');
}

/* --- UPGRADES --- */
function buyUpgrade(uId) {
  const u = UPGRADES.find(x => x.id === uId);
  if (game.score >= u.cost) { game.score -= u.cost; game.upgrades.push(uId); renderUpgrades(); hideTooltip(); playSound('buy'); }
}

function showTooltip(u) {
  ttName.textContent = u.name; ttPrice.textContent = formatNum(u.cost) + " Kleinis";
  ttPrice.className = game.score >= u.cost ? 'tt-price affordable' : 'tt-price expensive';
  ttEffect.textContent = "Effekt: " + u.text; ttDesc.textContent = u.desc;
  let statsHTML = '';
  if (u.type === 'build') {
    const bIdx = u.target; const count = game.buildings[bIdx];
    const currentMulti = getBuildingMultiplier(bIdx);
    const base = BUILDINGS[bIdx].baseCps;
    const currentSingleCPS = base * currentMulti;
    const newSingleCPS = currentSingleCPS * u.multi;
    const totalGain = (newSingleCPS - currentSingleCPS) * count;
    statsHTML = `<div class="stat-line"><span>Einzeln:</span><span>${formatNum(currentSingleCPS, 1)} ➜ <span style="color:#2ecc71">${formatNum(newSingleCPS, 1)}</span></span></div><div class="stat-highlight">+${formatNum(totalGain, 1)} CPS Gesamt</div>`;
  } else { statsHTML = `<div class="stat-highlight">Klickstärke wird verdoppelt!</div>`; }
  ttStats.innerHTML = statsHTML; tooltipEl.style.display = 'block';
}

function hideTooltip() { tooltipEl.style.display = 'none'; }

function renderUpgrades() {
  const container = document.getElementById('upgradeGrid'); container.innerHTML = '';
  const available = UPGRADES.filter(u => {
    if (game.upgrades.includes(u.id)) return false;
    if (u.trigger.type === 'clicks' && game.clicks >= u.trigger.val) return true;
    if (u.trigger.type === 'build' && game.buildings[u.trigger.id] >= u.trigger.val) return true;
    if (u.trigger.type === 'prestige' && game.prestige >= u.trigger.val) return true;
    return false;
  });
  available.forEach(u => {
    const div = document.createElement('div'); div.className = 'upgrade-crate'; div.innerHTML = u.icon;
    div.onmouseenter = () => showTooltip(u); div.onmouseleave = () => hideTooltip();
    if (game.score >= u.cost) { div.onclick = () => buyUpgrade(u.id); }
    else { div.style.opacity = 0.5; div.style.filter = "grayscale(1)"; }
    container.appendChild(div);
  });
}
