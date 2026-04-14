/* ===========================
   ACHIEVEMENTS.JS – Achievement Engine + Toast UI
   =========================== */

let achievementQueue = [];
let isShowingToast = false;

function getAchievementBonus() {
  let bonus = 0;
  game.achievements.forEach(id => {
    const a = ACHIEVEMENTS.find(x => x.id === id);
    if (a) bonus += a.reward;
  });
  return 1 + bonus;
}

function checkAchievements() {
  ACHIEVEMENTS.forEach(a => {
    if (game.achievements.includes(a.id)) return;
    try {
      if (a.check(game)) {
        game.achievements.push(a.id);
        achievementQueue.push(a);
        playSound('achievement');
        saveGame();
      }
    } catch(e) {}
  });
  
  processToastQueue();
  updateAchievementCounter();
}

function processToastQueue() {
  if (isShowingToast || achievementQueue.length === 0) return;
  isShowingToast = true;
  
  const a = achievementQueue.shift();
  showAchievementToast(a);
}

function showAchievementToast(achievement) {
  const toast = document.getElementById('achievement-toast');
  if (!toast) return;
  
  document.getElementById('toast-icon').textContent = achievement.icon;
  document.getElementById('toast-name').textContent = achievement.name;
  document.getElementById('toast-desc').textContent = achievement.desc;
  document.getElementById('toast-reward').textContent = `+${(achievement.reward * 100).toFixed(0)}% CPS`;
  
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      isShowingToast = false;
      processToastQueue();
    }, 400);
  }, 3500);
}

function updateAchievementCounter() {
  const el = document.getElementById('achievement-count');
  if (el) {
    el.textContent = `${game.achievements.length}/${ACHIEVEMENTS.length}`;
  }
  const bonusEl = document.getElementById('achievement-bonus-display');
  if (bonusEl) {
    const bonus = ((getAchievementBonus() - 1) * 100).toFixed(0);
    bonusEl.textContent = `+${bonus}%`;
  }
}

/* --- TROPHY MODAL --- */
function openTrophies() {
  document.getElementById('trophyModal').style.display = 'flex';
  renderTrophies();
}

function closeTrophies() {
  document.getElementById('trophyModal').style.display = 'none';
}

function renderTrophies() {
  const grid = document.getElementById('trophy-grid');
  grid.innerHTML = '';
  
  const categories = [
    { name: '👆 Klicks', ids: ACHIEVEMENTS.filter(a => a.id.startsWith('a_click')) },
    { name: '💰 Score', ids: ACHIEVEMENTS.filter(a => a.id.startsWith('a_score')) },
    { name: '🏠 Gebäude', ids: ACHIEVEMENTS.filter(a => a.id.startsWith('a_build')) },
    { name: '⬆️ Upgrades', ids: ACHIEVEMENTS.filter(a => a.id.startsWith('a_upg')) },
    { name: '🔄 Prestige', ids: ACHIEVEMENTS.filter(a => a.id.startsWith('a_pres')) },
    { name: '🎰 Casino', ids: ACHIEVEMENTS.filter(a => a.id.startsWith('a_casino')) },
    { name: '🔥 Combo', ids: ACHIEVEMENTS.filter(a => a.id.startsWith('a_combo')) },
    { name: '🎨 Skins & Bier', ids: ACHIEVEMENTS.filter(a => a.id.startsWith('a_skin') || a.id.startsWith('a_beer')) },
    { name: '🌙 Geheim', ids: ACHIEVEMENTS.filter(a => a.id.startsWith('a_secret')) },
  ];
  
  categories.forEach(cat => {
    const section = document.createElement('div');
    section.className = 'trophy-category';
    section.innerHTML = `<div class="trophy-cat-title">${cat.name}</div>`;
    
    const row = document.createElement('div');
    row.className = 'trophy-row';
    
    cat.ids.forEach(a => {
      const unlocked = game.achievements.includes(a.id);
      const el = document.createElement('div');
      el.className = `trophy-item ${unlocked ? 'unlocked' : 'locked'}`;
      el.innerHTML = `
        <div class="trophy-icon">${unlocked ? a.icon : '🔒'}</div>
        <div class="trophy-name">${unlocked ? a.name : '???'}</div>
        <div class="trophy-desc">${unlocked ? a.desc : 'Noch nicht freigeschaltet'}</div>
        <div class="trophy-reward">${unlocked ? `+${(a.reward*100).toFixed(0)}% CPS` : ''}</div>
      `;
      row.appendChild(el);
    });
    
    section.appendChild(row);
    grid.appendChild(section);
  });
}
