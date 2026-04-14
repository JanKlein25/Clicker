/* ===========================
   SKINS.JS – Skin System, Cases, Inventar
   =========================== */

function openSkins() {
  document.getElementById('skinModal').style.display = 'flex';
  renderInventory();
  document.getElementById('case-count').textContent = game.cases;

  renderCaseOddsUI();
  renderCaseContents();

  const strip = document.getElementById('caseStrip');
  strip.innerHTML = '';
  strip.style.transition = 'none';
  strip.style.transform = 'translateX(0px)';

  for (let i = 0; i < 5; i++) {
    const ph = SKINS.find(s => s.id === 'default');
    const el = document.createElement('div');
    el.className = 'case-item rarity-' + ph.rarity;
    el.innerHTML = `<img src="${ph.url}" style="filter:${ph.filter}">`;
    strip.appendChild(el);
  }
}

function closeSkins() {
  document.getElementById('skinModal').style.display = 'none';
}

function renderInventory() {
  const grid = document.getElementById('inventoryGrid');
  grid.innerHTML = '';

  let inventoryCount = {};
  game.skinsOwned.forEach(id => {
    inventoryCount[id] = (inventoryCount[id] || 0) + 1;
  });

  Object.keys(inventoryCount).forEach(skinId => {
    const skin = SKINS.find(s => s.id === skinId);
    if (!skin) return;

    const el = document.createElement('div');
    el.className = 'inv-slot rarity-' + skin.rarity;
    if (game.equippedSkin === skinId) el.classList.add('equipped');

    el.innerHTML = `
      <img src="${skin.url}" style="filter:${skin.filter}">
      ${inventoryCount[skinId] > 1 ? `<div class="count-badge">x${inventoryCount[skinId]}</div>` : ''}
    `;
    el.onclick = () => equipSkin(skinId);
    grid.appendChild(el);
  });
}

function renderCaseOddsUI() {
  const container = document.getElementById('case-odds-list');
  container.innerHTML = '';

  const names = {
    common: "Gewöhnlich",
    rare: "Selten",
    epic: "Episch",
    legendary: "Legendär",
    blackmarket: "SCHWARZMARKT"
  };

  Object.keys(CASE_ODDS).forEach(rarity => {
    if (CASE_ODDS[rarity] > 0) {
      const chance = (CASE_ODDS[rarity] * 100).toFixed(1);
      const div = document.createElement('div');
      div.className = 'ci-row';
      div.innerHTML = `
        <span class="rarity-text-${rarity}" style="font-weight:bold;">${names[rarity] || rarity}</span>
        <span style="color:#fff;">${chance}%</span>
      `;
      container.appendChild(div);
    }
  });
}

function renderCaseContents() {
  const container = document.getElementById('case-contents-grid');
  container.innerHTML = '';

  const rarityOrder = { 'common': 1, 'rare': 2, 'epic': 3, 'legendary': 4, 'blackmarket': 5 };

  const sortedSkins = [...SKINS].sort((a, b) => {
    return (rarityOrder[a.rarity] || 0) - (rarityOrder[b.rarity] || 0);
  });

  sortedSkins.forEach(skin => {
    const el = document.createElement('div');
    el.className = `cc-icon rarity-${skin.rarity}`;
    el.setAttribute('data-name', skin.name);
    el.innerHTML = `<img src="${skin.url}" style="filter:${skin.filter}">`;
    container.appendChild(el);
  });
}

function equipSkin(id, mute = false) {
  const skin = SKINS.find(s => s.id === id);
  if (skin && game.skinsOwned.includes(id)) {
    game.equippedSkin = id;
    const big = document.getElementById('bigKlein');
    big.src = skin.url;
    big.style.filter = `drop-shadow(0 30px 60px rgba(0,0,0,0.5)) ${skin.filter}`;

    if (document.getElementById('skinModal').style.display === 'flex') {
      renderInventory();
    }
    if (!mute) saveGame();
  }
}

function pickSkinByRarity() {
  const rand = Math.random();
  let cumulative = 0;
  const tiers = ['common', 'rare', 'epic', 'legendary', 'blackmarket'];
  let selectedRarity = 'common';

  for (let tier of tiers) {
    cumulative += CASE_ODDS[tier] || 0;
    if (rand < cumulative) {
      selectedRarity = tier;
      break;
    }
  }

  const pool = SKINS.filter(s => s.rarity === selectedRarity);
  if (pool.length === 0) return SKINS.find(s => s.rarity === 'common') || SKINS[0];
  return pool[Math.floor(Math.random() * pool.length)];
}

function openCase() {
  if (game.cases <= 0 || isSpinning) return;
  game.cases--;
  document.getElementById('case-count').textContent = game.cases;

  isSpinning = true;
  disableButtons(true);

  let wonSkin = pickSkinByRarity();
  generateCaseStrip(60, wonSkin);

  const strip = document.getElementById('caseStrip');
  strip.offsetHeight;

  const itemWidth = 94;
  const targetIndex = 45;
  const positionOfWinner = (targetIndex * itemWidth) + 45;
  const jitter = Math.floor(Math.random() * 40) - 20;
  const totalTranslate = positionOfWinner + jitter;

  strip.style.transition = 'transform 5s cubic-bezier(0.12, 0.8, 0.1, 1)';
  strip.style.transform = `translateX(-${totalTranslate}px)`;

  setTimeout(() => {
    isSpinning = false;
    disableButtons(false);

    if (!game.skinsOwned.includes(wonSkin.id)) {
      game.skinsOwned.push(wonSkin.id);
      alert(`GEZOGEN: NEUER SKIN! ${wonSkin.name}`);
    } else {
      alert(`GEZOGEN: ${wonSkin.name} (Du besitzt diesen Skin bereits)`);
    }
    renderInventory();
    saveGame();
  }, 5000);
}

function generateCaseStrip(count, winner) {
  const strip = document.getElementById('caseStrip');
  strip.style.transition = 'none';
  strip.style.transform = 'translateX(0px)';
  strip.innerHTML = '';

  for (let i = 0; i < count; i++) {
    let item;
    if (i === 45) { item = winner; }
    else if (i === 44 || i === 46) { item = SKINS.find(s => s.id === 'default') || SKINS[0]; }
    else { item = SKINS[Math.floor(Math.random() * SKINS.length)]; }

    const el = document.createElement('div');
    el.className = `case-item rarity-${item.rarity}`;
    el.innerHTML = `<img src="${item.url}" style="filter:${item.filter}">`;
    strip.appendChild(el);
  }
}
