/* ===========================
   BLACKJACK.JS – Blackjack Logic
   =========================== */

function createDeck() {
  let deck = [];
  for(let s of SUITS) {
    for(let r of RANKS) {
      let val = parseInt(r);
      if(r === 'J' || r === 'Q' || r === 'K') val = 10;
      if(r === 'A') val = 11;
      deck.push({ rank: r, suit: s, val: val, color: (s === '♥' || s === '♦') ? 'red' : 'black' });
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function getHandValue(hand) {
  let val = 0;
  let aces = 0;
  hand.forEach(c => {
    val += c.val;
    if(c.rank === 'A') aces++;
  });
  while(val > 21 && aces > 0) {
    val -= 10;
    aces--;
  }
  return val;
}

function renderCard(card, hidden = false) {
  if(hidden) return `<div class="bj-card bj-card-hidden"></div>`;
  return `
    <div class="bj-card ${card.color}">
      <div class="bj-card-top">${card.rank}<br>${card.suit}</div>
      <div class="bj-card-mid">${card.suit}</div>
      <div class="bj-card-bot">${card.rank}<br>${card.suit}</div>
    </div>
  `;
}

function updateBjUI(revealDealer = false) {
  const pDiv = document.getElementById('player-hand');
  const dDiv = document.getElementById('dealer-hand');

  pDiv.innerHTML = bjState.playerHand.map(c => renderCard(c)).join('');
  document.getElementById('player-score').textContent = getHandValue(bjState.playerHand);

  dDiv.innerHTML = '';
  bjState.dealerHand.forEach((c, i) => {
    if(i === 0 && !revealDealer) dDiv.innerHTML += renderCard(c, true);
    else dDiv.innerHTML += renderCard(c);
  });

  if(revealDealer) {
    document.getElementById('dealer-score').textContent = getHandValue(bjState.dealerHand);
  } else {
    document.getElementById('dealer-score').textContent = "?";
  }
}

function startBlackjack() {
  document.getElementById('bj-message').classList.remove('show');
  if(bjState.active) return;
  const bet = getBet();
  if(!bet) return;

  payBet(bet);
  updateCasinoUI();

  bjState.bet = bet;
  bjState.active = true;
  bjState.deck = createDeck();
  bjState.playerHand = [bjState.deck.pop(), bjState.deck.pop()];
  bjState.dealerHand = [bjState.deck.pop(), bjState.deck.pop()];
  bjState.turn = 'player';

  document.getElementById('bj-message').textContent = "";
  document.getElementById('btn-bj-start').style.display = 'none';
  document.getElementById('bj-actions').style.display = 'flex';

  updateBjUI(false);

  const pVal = getHandValue(bjState.playerHand);
  if(pVal === 21) { bjEndRound(); }
}

function bjAction(action) {
  if(!bjState.active) return;

  if(action === 'hit') {
    bjState.playerHand.push(bjState.deck.pop());
    updateBjUI(false);
    if(getHandValue(bjState.playerHand) > 21) { bjEndRound(); }
  }
  else if(action === 'stand') {
    bjState.turn = 'dealer';
    dealerPlay();
  }
  else if(action === 'double') {
    let canAfford = false;
    if(casinoCurrency === 'kleinis' && game.score >= bjState.bet) canAfford = true;
    if(casinoCurrency === 'beers' && game.beers >= bjState.bet) canAfford = true;

    if(canAfford) {
      payBet(bjState.bet);
      bjState.bet *= 2;
      updateCasinoUI();
      bjState.playerHand.push(bjState.deck.pop());
      updateBjUI(false);
      if(getHandValue(bjState.playerHand) > 21) bjEndRound();
      else {
        bjState.turn = 'dealer';
        setTimeout(dealerPlay, 500);
      }
    } else {
      alert("Nicht genug Guthaben zum Doppeln!");
    }
  }
}

function dealerPlay() {
  updateBjUI(true);
  let dVal = getHandValue(bjState.dealerHand);
  const loop = () => {
    if(dVal < 17) {
      bjState.dealerHand.push(bjState.deck.pop());
      dVal = getHandValue(bjState.dealerHand);
      updateBjUI(true);
      setTimeout(loop, 800);
    } else {
      bjEndRound();
    }
  };
  setTimeout(loop, 800);
}

function bjEndRound() {
  bjState.active = false;
  updateBjUI(true);

  const pVal = getHandValue(bjState.playerHand);
  const dVal = getHandValue(bjState.dealerHand);
  const msg = document.getElementById('bj-message');

  let winMult = 0;
  let outcomeText = "";
  let outcomeColor = "#fff";

  if(pVal > 21) {
    outcomeText = "BUST! VERLOREN";
    outcomeColor = "#e74c3c";
  }
  else if(pVal === 21 && bjState.playerHand.length === 2) {
    if(dVal === 21 && bjState.dealerHand.length === 2) {
      outcomeText = "PUSH (Unentschieden)";
      outcomeColor = "#ccc";
      winMult = 1;
    } else {
      outcomeText = "BLACKJACK! (x2.5)";
      outcomeColor = "#f1c40f";
      winMult = 2.5;
    }
  }
  else if(dVal > 21 || pVal > dVal) {
    outcomeText = "GEWONNEN!";
    outcomeColor = "#2ecc71";
    winMult = 2;
  }
  else if(dVal === pVal) {
    outcomeText = "PUSH (Geld zurück)";
    outcomeColor = "#ccc";
    winMult = 1;
  }
  else {
    outcomeText = "DEALER GEWINNT";
    outcomeColor = "#e74c3c";
  }

  msg.textContent = outcomeText;
  msg.style.color = outcomeColor;

  if(winMult > 0) {
    const winAmount = Math.floor(bjState.bet * winMult);
    triggerWin(winAmount);
    msg.innerHTML += `<div style="font-size:0.6em; margin-top:8px; color:#fff;">+${formatNum(winAmount)}</div>`;
    if(winMult > 1) {
      spawnConfetti();
      document.getElementById('casinoWindow').classList.add('win-pulse');
      setTimeout(() => document.getElementById('casinoWindow').classList.remove('win-pulse'), 500);
    }
  }

  msg.classList.add('show');
  updateCasinoUI();
  saveGame();

  document.getElementById('bj-actions').style.display = 'none';
  document.getElementById('btn-bj-start').style.display = 'block';
}
