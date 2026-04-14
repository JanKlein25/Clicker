/* ===========================
   STATE.JS – Spielzustand & Globale Variablen
   =========================== */

let game = {
  score: 0,
  totalScore: 0,
  clicks: 0,
  clickLevel: 1,
  buildings: new Array(BUILDINGS.length).fill(0),
  upgrades: [],
  casinoHistory: [],
  playerName: "Spieler" + Math.floor(Math.random() * 1000),
  prestige: 0,
  cases: 0,
  skinsOwned: ['default'],
  equippedSkin: 'default',
  lastLogin: Date.now(),
  beers: 0,
  lastDailyBonus: 0,
  hasClaimedRetroBeers: false,
  // NEW: Achievements
  achievements: [],
  // NEW: Stats tracking
  stats: {
    casinoWins: 0,
    casinoLosses: 0,
    highestCombo: 0,
    goldenClicked: 0,
    totalCasinoProfit: 0,
    playTime: 0,
    sessionStart: Date.now(),
    totalPrestigeResets: 0,
    biggestWin: 0,
  },
};

// Casino State
let casinoCurrency = 'kleinis';
let isSpinning = false;
let currentCasinoMode = 'roulette';
let casinoUnlocked = false;

// Buffs – now supports multiple
let buffs = {
  frenzy: { active: false, time: 0, multi: 7 },
  clickstorm: { active: false, time: 0, multi: 10 },
  casinobuff: { active: false, time: 0, multi: 3 },
};

// Click Tracking
let clickHistory = [];
let clickCountSec = 0;
setInterval(() => { clickCountSec = 0; }, 1000);
let lastTime = performance.now();

// NEW: Combo State
let comboState = {
  count: 0,
  multi: 1,
  lastClickTime: 0,
  decayTimer: null,
  tier: 0, // 0=none, 1=x2, 2=x5, 3=x10
};

// Visuals
let visualElements = [];
const MAX_VISUALS = 30;

// Slots State
let slotState = { turbo: false, auto: false, spinning: false };

// Crash State
let crashState = {
  running: false, crashed: false, cashedOut: false,
  startTime: 0, currentMulti: 1.00, crashPoint: 0,
  bet: 0, history: [], animFrame: null
};

// Mines State
let minesState = { active: false, mines: [], revealed: [], count: 3, bet: 0, currentMulti: 1.0 };

// Blackjack State
let bjState = { active: false, deck: [], playerHand: [], dealerHand: [], bet: 0, turn: 'player' };

// Crazy Time State
let ctState = {
  bets: { '1':0, '2':0, '5':0, '10':0, 'coin':0, 'pachinko':0, 'cash':0, 'crazy':0 },
  totalBet: 0, spinning: false, rotation: 0,
  topSlot: { target: null, multi: 1 }
};

// Lottery State
let lotteryData = {
  bets: {}, total: 0, status: 'waiting', drawTime: 0,
  winner: null, winningTicket: 0, spinStart: 0
};

let lotteryTimerInterval;
let lotteryAnimFrame;
let beerTimerInterval;

// Sound mute state
let soundMuted = false;
