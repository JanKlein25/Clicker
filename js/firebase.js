/* ===========================
   FIREBASE.JS – Firebase Init, Leaderboard, Top Player
   =========================== */

const firebaseConfig = {
  apiKey: "AIzaSyA9UzTCyFOxOr6EiGATnkXA_QMQZRcqX0I",
  authDomain: "kleinclicker.firebaseapp.com",
  databaseURL: "https://kleinclicker-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "kleinclicker",
  storageBucket: "kleinclicker.firebasestorage.app",
  messagingSenderId: "109832699128",
  appId: "1:109832699128:web:636e6c1687927447d6cf0d",
  measurementId: "G-JBPB52ZK4J"
};

let db;
let dbRef;

try {
  firebase.initializeApp(firebaseConfig);
  db = firebase.database();
  dbRef = db.ref('leaderboard');
  console.log("Firebase initialized");
} catch (e) {
  console.warn("Firebase not configured yet. Leaderboard will be offline.");
}

/* --- LEADERBOARD --- */
function openLeaderboard() {
  document.getElementById('leaderboardModal').style.display = 'flex';
  fetchLeaderboard();
}

function closeLeaderboard() {
  document.getElementById('leaderboardModal').style.display = 'none';
}

function fetchLeaderboard() {
  const list = document.getElementById('lb-list');
  if (!dbRef) {
    list.innerHTML = '<div style="text-align:center; padding:20px; color:#e74c3c;">Firebase nicht konfiguriert!<br><span style="font-size:0.8rem; color:#aaa;">Öffne index.html und füge deine Keys ein.</span></div>';
    return;
  }

  list.innerHTML = '<div style="text-align:center; padding:20px; color:#666;">Lade...</div>';

  dbRef.orderByChild('beers').limitToLast(20).once('value').then(snapshot => {
    const scores = [];
    snapshot.forEach(child => {
      scores.push(child.val());
    });
    renderLeaderboard(scores.reverse());
  }).catch(err => {
    list.innerHTML = '<div style="text-align:center; padding:20px; color:#e74c3c;">Fehler beim Laden :(</div>';
  });
}

function renderLeaderboard(scores) {
  const list = document.getElementById('lb-list');
  list.innerHTML = '';

  if (scores.length === 0) {
    list.innerHTML = '<div style="text-align:center; padding:20px;">Noch keine Spieler. Sei der Erste!</div>';
    return;
  }

  scores.forEach((s, index) => {
    const rank = index + 1;
    let rankClass = 'lb-rank';
    if (rank === 1) rankClass += ' top-1';
    if (rank === 2) rankClass += ' top-2';
    if (rank === 3) rankClass += ' top-3';

    const el = document.createElement('div');
    el.className = 'lb-entry';
    el.innerHTML = `
      <div class="${rankClass}">#${rank}</div>
      <div class="lb-name">${s.name}</div>
      <div class="lb-score" style="color:#f1c40f;">${formatNum(s.beers || 0)} 🍺</div>
    `;
    list.appendChild(el);
  });
}

/* --- TOP PLAYER DISPLAY --- */
function updateTopPlayer() {
  if (!dbRef) return;
  dbRef.orderByChild('beers').limitToLast(1).once('value')
    .then(snapshot => {
      const val = snapshot.val();
      if (val) {
        const keys = Object.keys(val);
        const topKey = keys[0];
        const topData = val[topKey];
        const el = document.getElementById('top-player-display');
        el.innerHTML = `👑 Platz 1: ${topData.name} <span style="font-size:0.8em; color:#f1c40f;">(${formatNum(topData.beers || 0)} 🍺)</span>`;
      }
    })
    .catch(err => console.log("Top Player fetch error", err));
}

/* --- PAYOUT LISTENER --- */
function initPayoutListener() {
  if(!db || !game.playerName) return;

  const payoutRef = db.ref('lottery_payouts/' + game.playerName);
  payoutRef.off();

  payoutRef.on('value', (snapshot) => {
    const amount = snapshot.val();
    if (amount && amount > 0) {
      payoutRef.set(null).then(() => {
        game.beers += amount;
        saveGame();
        updateCasinoUI();
        spawnConfetti();
        setTimeout(() => {
          alert(`🎉 JACKPOT AUSGEZAHLT! 🎉\n\nDu hast +${formatNum(amount)} Bierchen erhalten!`);
        }, 100);
      });
    }
  });
}
