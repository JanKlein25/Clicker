/* ===========================
   CONFIG.JS – Konstanten & Daten
   =========================== */

const SAVE_KEY = 'KleinClicker_Precision_V21';
const DEFAULT_IMG = "https://raw.githubusercontent.com/Janklein25/clicker/main/Kleinclicker.png";
const BEER_ICON_SRC = "https://github.com/JanKlein25/Clicker/blob/main/Adobe%20Express%20-%20file%20(9).png?raw=true";

// SKINS DATA
const SKINS = [
  { id: 'default', name: 'Original Klein', rarity: 'common', url: DEFAULT_IMG, filter: '' },
  { id: 'friend1', name: 'Seltener Cedric', rarity: 'rare', url: "https://github.com/JanKlein25/Clicker/blob/main/Cedrics%20Gesicht.png?raw=true", filter: '' },
  { id: 'friend2', name: 'Epischer Malte', rarity: 'epic', url: "https://github.com/JanKlein25/Clicker/blob/main/Malte%20Gesicht.png?raw=true", filter: '' },
  { id: 'friend3', name: '"OH BACKEE.."', rarity: 'epic', url: "https://github.com/JanKlein25/Clicker/blob/main/Malte%20Zahn.png?raw=true", filter: '' },
  { id: 'legendary1', name: 'Legendärer Till', rarity: 'legendary', url: "https://github.com/JanKlein25/Clicker/blob/main/Tills%20Gesicht.png?raw=true", filter: '' },
  { id: 'legendary2', name: 'Legendärer Malte', rarity: 'legendary', url: "https://github.com/JanKlein25/Clicker/blob/main/Malte%202%20Gesicht.png?raw=true", filter: '' },
  { id: 'legendary3', name: 'Legendärer Maxi', rarity: 'legendary', url: "https://github.com/JanKlein25/Clicker/blob/main/Maxi%20Bier%20Legend%C3%A4r.png?raw=true", filter: '' },
  { id: 'Schwarzmarkt', name: 'Sir Smokes-a-Lot Maxi', rarity: 'blackmarket', url: "https://github.com/JanKlein25/Clicker/blob/main/Maxi%20Weed%20(2).png?raw=true", filter: '' },
];

// CASE ODDS
const CASE_ODDS = {
  common: 0.40, rare: 0.30, epic: 0.15, legendary: 0.1, blackmarket: 0.05, mythic: 0
};

// BUILDINGS
const BUILDINGS = [
  { id: 0, name: 'Maxis Zeigefinger', baseCost: 15, baseCps: 0.1, icon: '👆' },
  { id: 1, name: 'Magdas Oma', baseCost: 100, baseCps: 1, icon: '👵' },
  { id: 2, name: 'Cedrics Acker', baseCost: 1100, baseCps: 8, icon: '🌾' },
  { id: 3, name: 'Maltes Meme Mine', baseCost: 12000, baseCps: 47, icon: '⛏️' },
  { id: 4, name: 'Jans Strandkorbfabrik', baseCost: 130000, baseCps: 260, icon: '🏭' },
  { id: 5, name: 'Tills Tresor', baseCost: 1400000, baseCps: 1400, icon: '🏦' },
  { id: 6, name: 'Nicos Sekt-Tempel', baseCost: 20000000, baseCps: 7800, icon: '🏛️' },
  { id: 7, name: 'Maxis Klon-Labor', baseCost: 330000000, baseCps: 45000, icon: '🧬' },
  { id: 8, name: 'Magdas Mars-Rakete', baseCost: 5100000000, baseCps: 280000, icon: '🚀' },
  { id: 9, name: 'Cedrics Dimensionstor', baseCost: 75000000000, baseCps: 1600000, icon: '🌀' },
  { id: 10, name: 'Maltes Zeitmaschine', baseCost: 900000000000, baseCps: 12000000, icon: '⏳' },
  { id: 11, name: 'Franjas feuchtes Universum', baseCost: 15000000000000, baseCps: 150000000, icon: '🌌' },
  { id: 12, name: 'Quanten-Backofen', baseCost: 350000000000000, baseCps: 2500000000, icon: '⚛️' },
  { id: 13, name: 'Dunkle Materie Pumpe', baseCost: 6000000000000000, baseCps: 35000000000, icon: '⚫' },
  { id: 14, name: 'Cedrics Multiversum', baseCost: 120000000000000000, baseCps: 500000000000, icon: '🪐' },
  { id: 15, name: 'Maltes Realitäts-Glitch', baseCost: 2500000000000000000, baseCps: 8000000000000, icon: '👾' },
  { id: 16, name: 'Jans Admin-Konsole', baseCost: 55000000000000000000, baseCps: 150000000000000, icon: '💻' },
  { id: 17, name: 'Tills Unendlichkeit', baseCost: 1300000000000000000000, baseCps: 2500000000000000, icon: '♾️' },
  { id: 18, name: 'Singularitäts-Antrieb', baseCost: 35000000000000000000000, baseCps: 60000000000000000, icon: '🔆' },
  { id: 19, name: 'Der Ur-Patrick', baseCost: 900000000000000000000000, baseCps: 1200000000000000000, icon: '👶' },
  { id: 20, name: 'Sauerteig-Galaxie', baseCost: 25000000000000000000000000, baseCps: 30000000000000000000, icon: '🌌' },
  { id: 21, name: 'Vegan Pussy', baseCost: 800000000000000000000000000, baseCps: 900000000000000000000, icon: '🏁' }
];

// ===========================
// UPGRADES – 54 TOTAL (was 6)
// ===========================
const UPGRADES = [
  // === CLICK UPGRADES (4) ===
  { id: 'u_click_1', name: 'Plastik Maus', cost: 500, trigger: { type: 'clicks', val: 100 }, icon: '🖱️', desc: 'Die billigste Maus auf dem Markt.', type: 'click', multi: 2, text: 'Klickstärke x2' },
  { id: 'u_click_2', name: 'Gamer Maus', cost: 50000, trigger: { type: 'clicks', val: 1000 }, icon: '🎮', desc: 'Mit RGB = Mehr DPS.', type: 'click', multi: 2, text: 'Klickstärke x2' },
  { id: 'u_click_3', name: 'Razer DeathAdder', cost: 5000000, trigger: { type: 'clicks', val: 10000 }, icon: '🐍', desc: 'Sponsored by Razer™.', type: 'click', multi: 3, text: 'Klickstärke x3' },
  { id: 'u_click_4', name: 'Gedankensteuerung', cost: 500000000, trigger: { type: 'clicks', val: 50000 }, icon: '🧠', desc: 'Klicken nur durch Willen.', type: 'click', multi: 5, text: 'Klickstärke x5' },

  // === BUILDING UPGRADES (2 per building = 44) ===
  // Gebäude 0: Maxis Zeigefinger
  { id: 'u_b0_1', name: 'Carpaltunnel',     cost: 1000,      trigger: { type: 'build', id: 0, val: 10 }, icon: '🩹', desc: 'Kein Schmerz, kein Gewinn.', type: 'build', target: 0, multi: 2, text: 'Zeigefinger x2' },
  { id: 'u_b0_2', name: 'Makro-Bot',        cost: 10000,     trigger: { type: 'build', id: 0, val: 50 }, icon: '🤖', desc: 'Automatisierte Skripte.', type: 'build', target: 0, multi: 3, text: 'Zeigefinger x3' },
  // Gebäude 1: Magdas Oma
  { id: 'u_b1_1', name: 'Nudelholz',        cost: 5000,      trigger: { type: 'build', id: 1, val: 10 }, icon: '🥖', desc: 'Die Omas werden aggressiver.', type: 'build', target: 1, multi: 2, text: 'Oma Produktion x2' },
  { id: 'u_b1_2', name: 'Lesebrille',       cost: 50000,     trigger: { type: 'build', id: 1, val: 50 }, icon: '👓', desc: 'Sie sehen Kleinis besser.', type: 'build', target: 1, multi: 3, text: 'Oma Produktion x3' },
  // Gebäude 2: Cedrics Acker
  { id: 'u_b2_1', name: 'Dünger Deluxe',    cost: 55000,     trigger: { type: 'build', id: 2, val: 10 }, icon: '💩', desc: 'Bio-Turbo für den Acker.', type: 'build', target: 2, multi: 2, text: 'Acker Produktion x2' },
  { id: 'u_b2_2', name: 'Traktor',          cost: 550000,    trigger: { type: 'build', id: 2, val: 50 }, icon: '🚜', desc: 'John Deere approves.', type: 'build', target: 2, multi: 3, text: 'Acker Produktion x3' },
  // Gebäude 3: Maltes Meme Mine
  { id: 'u_b3_1', name: 'Diamant-Spitzhacke', cost: 600000,   trigger: { type: 'build', id: 3, val: 10 }, icon: '💎', desc: 'Schürft tiefere Memes.', type: 'build', target: 3, multi: 2, text: 'Meme Mine x2' },
  { id: 'u_b3_2', name: 'TNT Boost',        cost: 6000000,   trigger: { type: 'build', id: 3, val: 50 }, icon: '🧨', desc: 'BOOM! Mehr Memes pro Sprengung.', type: 'build', target: 3, multi: 3, text: 'Meme Mine x3' },
  // Gebäude 4: Jans Strandkorbfabrik
  { id: 'u_b4_1', name: 'Fließband',        cost: 6500000,   trigger: { type: 'build', id: 4, val: 10 }, icon: '🔧', desc: 'Industrielle Revolution.', type: 'build', target: 4, multi: 2, text: 'Fabrik x2' },
  { id: 'u_b4_2', name: 'Roboter-Arm',      cost: 65000000,  trigger: { type: 'build', id: 4, val: 50 }, icon: '🦾', desc: 'Tesla Gigafactory Vibes.', type: 'build', target: 4, multi: 3, text: 'Fabrik x3' },
  // Gebäude 5: Tills Tresor
  { id: 'u_b5_1', name: 'Goldbarren',       cost: 70000000,  trigger: { type: 'build', id: 5, val: 10 }, icon: '🥇', desc: 'Fort Knox Upgrade.', type: 'build', target: 5, multi: 2, text: 'Tresor x2' },
  { id: 'u_b5_2', name: 'Schweizer Konto',  cost: 700000000, trigger: { type: 'build', id: 5, val: 50 }, icon: '🏔️', desc: 'Steuern? Nie gehört.', type: 'build', target: 5, multi: 3, text: 'Tresor x3' },
  // Gebäude 6: Nicos Sekt-Tempel
  { id: 'u_b6_1', name: 'Dom Pérignon',     cost: 1000000000,  trigger: { type: 'build', id: 6, val: 10 }, icon: '🍾', desc: 'Nur das Beste für Nico.', type: 'build', target: 6, multi: 2, text: 'Sekt-Tempel x2' },
  { id: 'u_b6_2', name: 'Champagner-Regen', cost: 10000000000, trigger: { type: 'build', id: 6, val: 50 }, icon: '🥂', desc: 'Es regnet Luxus.', type: 'build', target: 6, multi: 3, text: 'Sekt-Tempel x3' },
  // Gebäude 7: Maxis Klon-Labor
  { id: 'u_b7_1', name: 'CRISPR Kit',       cost: 16500000000, trigger: { type: 'build', id: 7, val: 10 }, icon: '🧪', desc: 'Genmanipulation light.', type: 'build', target: 7, multi: 2, text: 'Klon-Labor x2' },
  { id: 'u_b7_2', name: 'Klonarmee',        cost: 165000000000, trigger: { type: 'build', id: 7, val: 50 }, icon: '👥', desc: 'Star Wars Episode II.', type: 'build', target: 7, multi: 3, text: 'Klon-Labor x3' },
  // Gebäude 8: Magdas Mars-Rakete
  { id: 'u_b8_1', name: 'SpaceX Boost',     cost: 255000000000,  trigger: { type: 'build', id: 8, val: 10 }, icon: '🛸', desc: 'Elon approved.', type: 'build', target: 8, multi: 2, text: 'Mars-Rakete x2' },
  { id: 'u_b8_2', name: 'Warp-Antrieb',     cost: 2550000000000, trigger: { type: 'build', id: 8, val: 50 }, icon: '✨', desc: 'Lichtgeschwindigkeit!', type: 'build', target: 8, multi: 3, text: 'Mars-Rakete x3' },
  // Gebäude 9: Cedrics Dimensionstor
  { id: 'u_b9_1', name: 'Portal-Stabilisator', cost: 3750000000000,  trigger: { type: 'build', id: 9, val: 10 }, icon: '🔮', desc: 'Weniger Instabilität.', type: 'build', target: 9, multi: 2, text: 'Dimensionstor x2' },
  { id: 'u_b9_2', name: 'Multidimensional',    cost: 37500000000000, trigger: { type: 'build', id: 9, val: 50 }, icon: '🌐', desc: 'Zugang zu ALLEN Dimensionen.', type: 'build', target: 9, multi: 3, text: 'Dimensionstor x3' },
  // Gebäude 10: Maltes Zeitmaschine
  { id: 'u_b10_1', name: 'Flux-Kompensator',  cost: 45000000000000,   trigger: { type: 'build', id: 10, val: 10 }, icon: '⚡', desc: '1.21 Gigawatt!', type: 'build', target: 10, multi: 2, text: 'Zeitmaschine x2' },
  { id: 'u_b10_2', name: 'Zeitparadoxon',     cost: 450000000000000,  trigger: { type: 'build', id: 10, val: 50 }, icon: '🕰️', desc: 'Vergangenheit & Zukunft gleichzeitig.', type: 'build', target: 10, multi: 3, text: 'Zeitmaschine x3' },
  // Gebäude 11: Franjas feuchtes Universum
  { id: 'u_b11_1', name: 'Feuchtigkeitscreme', cost: 750000000000000,   trigger: { type: 'build', id: 11, val: 10 }, icon: '💧', desc: 'Extra feucht.', type: 'build', target: 11, multi: 2, text: 'Universum x2' },
  { id: 'u_b11_2', name: 'Tsunami-Generator',  cost: 7500000000000000,  trigger: { type: 'build', id: 11, val: 50 }, icon: '🌊', desc: 'Feuchtester Traum.', type: 'build', target: 11, multi: 3, text: 'Universum x3' },
  // Gebäude 12-21: Weitere Upgrades
  { id: 'u_b12_1', name: 'Quantenverschränkung', cost: 17500000000000000,    trigger: { type: 'build', id: 12, val: 10 }, icon: '🔬', desc: 'Spukhafte Fernwirkung.', type: 'build', target: 12, multi: 2, text: 'Quanten-Backofen x2' },
  { id: 'u_b12_2', name: 'Higgs-Boson Boost',   cost: 175000000000000000,   trigger: { type: 'build', id: 12, val: 50 }, icon: '⚗️', desc: 'Gottesteilchen.', type: 'build', target: 12, multi: 3, text: 'Quanten-Backofen x3' },
  { id: 'u_b13_1', name: 'Schwarzes Loch Tap',   cost: 300000000000000000,    trigger: { type: 'build', id: 13, val: 10 }, icon: '🕳️', desc: 'Unendliche Energie.', type: 'build', target: 13, multi: 2, text: 'Dunkle Materie x2' },
  { id: 'u_b13_2', name: 'Event Horizon',        cost: 3000000000000000000,   trigger: { type: 'build', id: 13, val: 50 }, icon: '💫', desc: 'Jenseits des Horizonts.', type: 'build', target: 13, multi: 3, text: 'Dunkle Materie x3' },
  { id: 'u_b14_1', name: 'Parallelwelt-Antenne', cost: 6000000000000000000,    trigger: { type: 'build', id: 14, val: 10 }, icon: '📡', desc: 'Signal aus Dimension C-137.', type: 'build', target: 14, multi: 2, text: 'Multiversum x2' },
  { id: 'u_b14_2', name: 'Rick\'s Portal Gun',   cost: 60000000000000000000,   trigger: { type: 'build', id: 14, val: 50 }, icon: '🔫', desc: 'Wubba lubba dub dub.', type: 'build', target: 14, multi: 3, text: 'Multiversum x3' },
  { id: 'u_b15_1', name: 'Matrix Hack',          cost: 125000000000000000000,    trigger: { type: 'build', id: 15, val: 10 }, icon: '💊', desc: 'Rote oder blaue Pille?', type: 'build', target: 15, multi: 2, text: 'Realitäts-Glitch x2' },
  { id: 'u_b15_2', name: 'System Override',      cost: 1250000000000000000000,   trigger: { type: 'build', id: 15, val: 50 }, icon: '🔓', desc: 'Root-Zugang erlangt.', type: 'build', target: 15, multi: 3, text: 'Realitäts-Glitch x3' },
  { id: 'u_b16_1', name: 'sudo rm -rf /',        cost: 2750000000000000000000,    trigger: { type: 'build', id: 16, val: 10 }, icon: '🖥️', desc: 'Macht alles kaputt.', type: 'build', target: 16, multi: 2, text: 'Admin-Konsole x2' },
  { id: 'u_b16_2', name: 'God Mode',             cost: 27500000000000000000000,   trigger: { type: 'build', id: 16, val: 50 }, icon: '👑', desc: 'IDDQD eingegeben.', type: 'build', target: 16, multi: 3, text: 'Admin-Konsole x3' },
  { id: 'u_b17_1', name: 'Ewigkeit +1',          cost: 65000000000000000000000,    trigger: { type: 'build', id: 17, val: 10 }, icon: '🔄', desc: 'Länger als ewig.', type: 'build', target: 17, multi: 2, text: 'Unendlichkeit x2' },
  { id: 'u_b17_2', name: 'Omega Point',          cost: 650000000000000000000000,   trigger: { type: 'build', id: 17, val: 50 }, icon: '🌟', desc: 'Ende aller Dinge.', type: 'build', target: 17, multi: 3, text: 'Unendlichkeit x3' },
  { id: 'u_b18_1', name: 'Gravitationswelle',    cost: 1750000000000000000000000,    trigger: { type: 'build', id: 18, val: 10 }, icon: '〰️', desc: 'Raumzeit verbiegen.', type: 'build', target: 18, multi: 2, text: 'Singularität x2' },
  { id: 'u_b18_2', name: 'Big Crunch',           cost: 17500000000000000000000000,   trigger: { type: 'build', id: 18, val: 50 }, icon: '💥', desc: 'Universum implodiert.', type: 'build', target: 18, multi: 3, text: 'Singularität x3' },
  { id: 'u_b19_1', name: 'Baby-Boost',           cost: 45000000000000000000000000,    trigger: { type: 'build', id: 19, val: 10 }, icon: '🍼', desc: 'Extra Milch.', type: 'build', target: 19, multi: 2, text: 'Ur-Patrick x2' },
  { id: 'u_b19_2', name: 'Pubertäts-Schub',      cost: 450000000000000000000000000,   trigger: { type: 'build', id: 19, val: 50 }, icon: '💪', desc: 'Patrick wird stark.', type: 'build', target: 19, multi: 3, text: 'Ur-Patrick x3' },
  { id: 'u_b20_1', name: 'Hefe-Turbo',           cost: 1250000000000000000000000000,    trigger: { type: 'build', id: 20, val: 10 }, icon: '🍞', desc: 'Der Teig geht auf.', type: 'build', target: 20, multi: 2, text: 'Sauerteig x2' },
  { id: 'u_b20_2', name: 'Brot-Singularität',    cost: 12500000000000000000000000000,   trigger: { type: 'build', id: 20, val: 50 }, icon: '🥐', desc: 'Unendliche Brote.', type: 'build', target: 20, multi: 3, text: 'Sauerteig x3' },
  { id: 'u_b21_1', name: 'Vegan Protein',        cost: 40000000000000000000000000000,    trigger: { type: 'build', id: 21, val: 10 }, icon: '🥑', desc: 'Avocado Boost.', type: 'build', target: 21, multi: 2, text: 'Vegan Pussy x2' },
  { id: 'u_b21_2', name: 'Tofu Imperium',        cost: 400000000000000000000000000000,   trigger: { type: 'build', id: 21, val: 50 }, icon: '🫘', desc: 'Weltherrschaft durch Soja.', type: 'build', target: 21, multi: 3, text: 'Vegan Pussy x3' },

  // === SPEZIAL-UPGRADES (2) ===
  { id: 'u_prestige_1', name: 'Zeitreise-Echo', cost: 9999999, trigger: { type: 'prestige', val: 1 }, icon: '🌀', desc: 'Prestige-Erinnerungen verstärken dich.', type: 'global', multi: 1.5, text: 'Alle Produktion x1.5' },
  { id: 'u_prestige_2', name: 'Karma-Konto',   cost: 999999999, trigger: { type: 'prestige', val: 5 }, icon: '☯️', desc: 'Das Universum belohnt deine Geduld.', type: 'global', multi: 2, text: 'Alle Produktion x2' },
];

// ===========================
// ACHIEVEMENTS – 40 TOTAL
// ===========================
const ACHIEVEMENTS = [
  // --- Klick Achievements ---
  { id: 'a_click_1',   name: 'Erster Klick',       desc: 'Klicke 1 Mal.',              icon: '👆', check: (g) => g.clicks >= 1, reward: 0.01 },
  { id: 'a_click_2',   name: 'Klick-Anfänger',     desc: '100 Klicks.',                icon: '✌️', check: (g) => g.clicks >= 100, reward: 0.01 },
  { id: 'a_click_3',   name: 'Klick-Lehrling',     desc: '1.000 Klicks.',              icon: '🖐️', check: (g) => g.clicks >= 1000, reward: 0.02 },
  { id: 'a_click_4',   name: 'Klick-Geselle',      desc: '10.000 Klicks.',             icon: '🤙', check: (g) => g.clicks >= 10000, reward: 0.03 },
  { id: 'a_click_5',   name: 'Klick-Meister',      desc: '100.000 Klicks.',            icon: '💪', check: (g) => g.clicks >= 100000, reward: 0.05 },
  { id: 'a_click_6',   name: 'Klick-Gott',         desc: '1.000.000 Klicks.',          icon: '⚡', check: (g) => g.clicks >= 1000000, reward: 0.10 },

  // --- Score Achievements ---
  { id: 'a_score_1',   name: 'Taschengeld',        desc: 'Verdiene 1.000 Kleinis.',     icon: '🪙', check: (g) => g.totalScore >= 1000, reward: 0.01 },
  { id: 'a_score_2',   name: 'Kleingeld',          desc: 'Verdiene 1 Mio Kleinis.',     icon: '💰', check: (g) => g.totalScore >= 1e6, reward: 0.02 },
  { id: 'a_score_3',   name: 'Wohlhabend',         desc: 'Verdiene 1 Mrd Kleinis.',     icon: '🏦', check: (g) => g.totalScore >= 1e9, reward: 0.03 },
  { id: 'a_score_4',   name: 'Milliardär',         desc: 'Verdiene 1 Bio Kleinis.',     icon: '💎', check: (g) => g.totalScore >= 1e12, reward: 0.05 },
  { id: 'a_score_5',   name: 'Bezos-Level',        desc: 'Verdiene 1 Brd Kleinis.',     icon: '🚀', check: (g) => g.totalScore >= 1e15, reward: 0.07 },
  { id: 'a_score_6',   name: 'Unendlich Reich',    desc: 'Verdiene 1 Trio Kleinis.',    icon: '♾️', check: (g) => g.totalScore >= 1e18, reward: 0.10 },

  // --- Building Achievements ---
  { id: 'a_build_1',   name: 'Immobilien-Start',   desc: 'Kaufe 1 Gebäude.',            icon: '🏠', check: (g) => g.buildings.reduce((a,b)=>a+b,0) >= 1, reward: 0.01 },
  { id: 'a_build_2',   name: 'Häuslebauer',        desc: 'Besitze 50 Gebäude.',         icon: '🏘️', check: (g) => g.buildings.reduce((a,b)=>a+b,0) >= 50, reward: 0.02 },
  { id: 'a_build_3',   name: 'Stadtplaner',        desc: 'Besitze 100 Gebäude.',        icon: '🏙️', check: (g) => g.buildings.reduce((a,b)=>a+b,0) >= 100, reward: 0.03 },
  { id: 'a_build_4',   name: 'Megacity',           desc: 'Besitze 500 Gebäude.',        icon: '🌆', check: (g) => g.buildings.reduce((a,b)=>a+b,0) >= 500, reward: 0.05 },
  { id: 'a_build_5',   name: 'Kolonialist',        desc: 'Kaufe alle 22 Gebäudetypen.', icon: '🌍', check: (g) => g.buildings.filter(b=>b>0).length >= 22, reward: 0.10 },

  // --- Upgrade Achievements ---
  { id: 'a_upg_1',     name: 'Verbesserer',        desc: 'Kaufe 1 Upgrade.',            icon: '⬆️', check: (g) => g.upgrades.length >= 1, reward: 0.01 },
  { id: 'a_upg_2',     name: 'Optimierer',         desc: 'Kaufe 10 Upgrades.',          icon: '📈', check: (g) => g.upgrades.length >= 10, reward: 0.03 },
  { id: 'a_upg_3',     name: 'Maximierer',         desc: 'Kaufe 25 Upgrades.',          icon: '🔝', check: (g) => g.upgrades.length >= 25, reward: 0.05 },
  { id: 'a_upg_4',     name: 'Perfektionist',      desc: 'Kaufe 50 Upgrades.',          icon: '💯', check: (g) => g.upgrades.length >= 50, reward: 0.10 },

  // --- Prestige Achievements ---
  { id: 'a_pres_1',    name: 'Zeitreisender',      desc: 'Prestige zum ersten Mal.',    icon: '🔄', check: (g) => g.prestige >= 1, reward: 0.03 },
  { id: 'a_pres_2',    name: 'Veteran',            desc: 'Erreiche Prestige 5.',        icon: '🎖️', check: (g) => g.prestige >= 5, reward: 0.05 },
  { id: 'a_pres_3',    name: 'Legende',            desc: 'Erreiche Prestige 10.',       icon: '🏅', check: (g) => g.prestige >= 10, reward: 0.10 },
  { id: 'a_pres_4',    name: 'Mythisch',           desc: 'Erreiche Prestige 25.',       icon: '👑', check: (g) => g.prestige >= 25, reward: 0.15 },

  // --- Casino Achievements ---
  { id: 'a_casino_1',  name: 'Anfängerglück',      desc: 'Gewinne im Casino.',          icon: '🎰', check: (g) => (g.stats?.casinoWins || 0) >= 1, reward: 0.01 },
  { id: 'a_casino_2',  name: 'High Roller',        desc: 'Gewinne 50x im Casino.',      icon: '🎲', check: (g) => (g.stats?.casinoWins || 0) >= 50, reward: 0.03 },
  { id: 'a_casino_3',  name: 'Casino King',        desc: 'Gewinne 500x im Casino.',     icon: '🤴', check: (g) => (g.stats?.casinoWins || 0) >= 500, reward: 0.05 },

  // --- Combo Achievements ---
  { id: 'a_combo_1',   name: 'Trommelwirbel',      desc: 'Erreiche Combo x2.',          icon: '🥁', check: (g) => (g.stats?.highestCombo || 0) >= 2, reward: 0.02 },
  { id: 'a_combo_2',   name: 'Fingerfertigkeit',   desc: 'Erreiche Combo x5.',          icon: '⚡', check: (g) => (g.stats?.highestCombo || 0) >= 5, reward: 0.03 },
  { id: 'a_combo_3',   name: 'Combo-Meister',      desc: 'Erreiche Combo x10.',         icon: '🔥', check: (g) => (g.stats?.highestCombo || 0) >= 10, reward: 0.05 },

  // --- Skin Achievements ---
  { id: 'a_skin_1',    name: 'Sammler',            desc: 'Besitze 3 Skins.',            icon: '🎨', check: (g) => [...new Set(g.skinsOwned)].length >= 3, reward: 0.02 },
  { id: 'a_skin_2',    name: 'Kollektor',          desc: 'Besitze alle 8 Skins.',       icon: '🏆', check: (g) => [...new Set(g.skinsOwned)].length >= 8, reward: 0.10 },

  // --- Bier Achievements ---
  { id: 'a_beer_1',    name: 'Biertrinker',        desc: 'Besitze 100 Bierchen.',       icon: '🍺', check: (g) => (g.beers || 0) >= 100, reward: 0.02 },
  { id: 'a_beer_2',    name: 'Stammtisch',         desc: 'Besitze 1.000 Bierchen.',     icon: '🍻', check: (g) => (g.beers || 0) >= 1000, reward: 0.05 },

  // --- Secret Achievements ---
  { id: 'a_secret_1',  name: 'Goldener Moment',    desc: 'Fange einen Golden Klein.',   icon: '✨', check: (g) => (g.stats?.goldenClicked || 0) >= 1, reward: 0.03 },
  { id: 'a_secret_2',  name: 'Goldjäger',          desc: 'Fange 25 Golden Kleins.',     icon: '🌟', check: (g) => (g.stats?.goldenClicked || 0) >= 25, reward: 0.05 },
  { id: 'a_secret_3',  name: 'Nachtschicht',       desc: 'Spiele nach Mitternacht.',    icon: '🌙', check: (g) => new Date().getHours() >= 0 && new Date().getHours() < 5, reward: 0.02 },
  { id: 'a_secret_4',  name: 'Speedrunner',        desc: '1 Mio in unter 10 Minuten.',  icon: '⏱️', check: (g) => g.totalScore >= 1e6 && (g.stats?.playTime || Infinity) < 600, reward: 0.05 },
];

// ===========================
// GOLDEN KLEIN BUFF TYPES
// ===========================
const GOLDEN_BUFFS = [
  { id: 'frenzy',      name: 'FRENZY!',        desc: 'CPS x7 für 30s',     icon: '🔥', color: '#e74c3c', duration: 30, weight: 40 },
  { id: 'lucky',       name: 'LUCKY DROP!',     desc: '+10 Min CPS sofort', icon: '💰', color: '#f1c40f', duration: 0, weight: 25 },
  { id: 'clickstorm',  name: 'CLICK STORM!',    desc: 'Klicks x10 für 15s', icon: '⚡', color: '#3498db', duration: 15, weight: 20 },
  { id: 'casinobuff',  name: 'CASINO BUFF!',    desc: 'Nächster Gewinn x3', icon: '🎰', color: '#9b59b6', duration: 60, weight: 15 },
];

// SLOT SYMBOLS
const SLOT_SYMBOLS = ['👑', '💎', '7️⃣', '🎰', '🔔', '🍀', '🍉', '🍇', '🍊', '🍋', '🍒'];

// MONEY CASE ODDS
const MONEY_CASE_ODDS = [
  { id: 'trash', multi: 0,   name: 'NIETE',    style: 'rarity-trash', chance: 0.45, fillWeight: 50 },
  { id: 'loss',  multi: 0.5, name: 'RÜCKGELD', style: 'rarity-loss',  chance: 0.30, fillWeight: 30 },
  { id: 'win',   multi: 2,   name: 'PROFIT',   style: 'rarity-win',   chance: 0.15, fillWeight: 15 },
  { id: 'big',   multi: 10,  name: 'BIG WIN',  style: 'rarity-big',   chance: 0.08, fillWeight: 4  },
  { id: 'jack',  multi: 100, name: 'JACKPOT',  style: 'rarity-jack',  chance: 0.02, fillWeight: 1  }
];

// BLACKJACK
const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];

// CRAZY TIME
const CT_SEGMENTS = [
  'crazy', '1', '2', '5', '1', '2', '1', 'cash', '1', '2', '5', '1', '2', 'coin',
  '1', '2', '1', 'pachinko', '1', '2', '5', '1', '2', 'coin', '1', '2', '1',
  'cash', '1', '2', '5', '1', '2', 'coin', '1', '2', '1', 'pachinko', '1', '2',
  '5', '1', '2', 'coin', '1', '2', '1', '10', '1', '2', '5', '1', '2', '10', '1'
];
const CT_COLORS = {
  '1': '#2980b9', '2': '#f1c40f', '5': '#e91e63', '10': '#8e44ad',
  'coin': '#1c2833', 'pachinko': '#9b59b6', 'cash': '#27ae60', 'crazy': '#c0392b'
};

// LOTTERY
const LOTTERY_PALETTE = [
  '#e74c3c', '#3498db', '#f1c40f', '#9b59b6', '#2ecc71',
  '#e67e22', '#1abc9c', '#ecf0f1', '#34495e', '#d35400'
];
