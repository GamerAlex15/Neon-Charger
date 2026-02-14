const state = {
  player: { health: 100, charge: 0 },
  enemy: { health: 100, charge: 0 },
  gameOver: false,
};

const els = {
  playerHealth: document.getElementById("player-health"),
  playerCharge: document.getElementById("player-charge"),
  enemyHealth: document.getElementById("enemy-health"),
  enemyCharge: document.getElementById("enemy-charge"),
  playerHealthText: document.getElementById("player-health-text"),
  playerChargeText: document.getElementById("player-charge-text"),
  enemyHealthText: document.getElementById("enemy-health-text"),
  enemyChargeText: document.getElementById("enemy-charge-text"),
  chargeBtn: document.getElementById("charge-btn"),
  attackBtn: document.getElementById("attack-btn"),
  burstBtn: document.getElementById("burst-btn"),
  resetBtn: document.getElementById("reset-btn"),
  log: document.getElementById("battle-log"),
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addLog(message) {
  const li = document.createElement("li");
  li.textContent = message;
  els.log.prepend(li);
}

function updateBars() {
  els.playerHealth.style.width = `${state.player.health}%`;
  els.playerCharge.style.width = `${state.player.charge}%`;
  els.enemyHealth.style.width = `${state.enemy.health}%`;
  els.enemyCharge.style.width = `${state.enemy.charge}%`;

  els.playerHealthText.textContent = state.player.health;
  els.playerChargeText.textContent = state.player.charge;
  els.enemyHealthText.textContent = state.enemy.health;
  els.enemyChargeText.textContent = state.enemy.charge;

  els.attackBtn.disabled = state.player.charge < 20 || state.gameOver;
  els.burstBtn.disabled = state.player.charge < 50 || state.gameOver;
  els.chargeBtn.disabled = state.gameOver;
}

function checkWinner() {
  if (state.player.health <= 0 || state.enemy.health <= 0) {
    state.gameOver = true;
    if (state.player.health <= 0 && state.enemy.health <= 0) {
      addLog("⚔️ Double knockout! The arena crackles into a draw.");
    } else if (state.enemy.health <= 0) {
      addLog("🏆 You win! Neon Charger dominates the battle.");
    } else {
      addLog("☠️ You were defeated. Rival Core takes this round.");
    }
  }
}

function enemyTurn() {
  if (state.gameOver) return;

  const useBurst = state.enemy.charge >= 50 && Math.random() > 0.45;
  const useStrike = state.enemy.charge >= 20 && Math.random() > 0.25;

  if (useBurst) {
    const damage = randomInt(22, 34);
    state.enemy.charge -= 50;
    state.player.health = clamp(state.player.health - damage, 0, 100);
    addLog(`🌌 Rival Core fired a Photon Rift for ${damage} damage.`);
  } else if (useStrike) {
    const damage = randomInt(10, 18);
    state.enemy.charge -= 20;
    state.player.health = clamp(state.player.health - damage, 0, 100);
    addLog(`🔥 Rival Core struck for ${damage} damage.`);
  } else {
    const gain = randomInt(12, 20);
    state.enemy.charge = clamp(state.enemy.charge + gain, 0, 100);
    addLog(`⚡ Rival Core charged +${gain} energy.`);
  }

  checkWinner();
  updateBars();
}

function playerCharge() {
  if (state.gameOver) return;
  const gain = 18;
  state.player.charge = clamp(state.player.charge + gain, 0, 100);
  addLog(`⚡ You charge +${gain} energy.`);
  updateBars();
  setTimeout(enemyTurn, 450);
}

function playerStrike() {
  if (state.player.charge < 20 || state.gameOver) return;
  const damage = randomInt(11, 18);
  state.player.charge -= 20;
  state.enemy.health = clamp(state.enemy.health - damage, 0, 100);
  addLog(`💥 You land a strike for ${damage} damage.`);
  checkWinner();
  updateBars();
  setTimeout(enemyTurn, 450);
}

function playerBurst() {
  if (state.player.charge < 50 || state.gameOver) return;
  const damage = randomInt(25, 35);
  state.player.charge -= 50;
  state.enemy.health = clamp(state.enemy.health - damage, 0, 100);
  addLog(`🌌 You unleash Neon Burst for ${damage} damage!`);
  checkWinner();
  updateBars();
  setTimeout(enemyTurn, 450);
}

function resetGame() {
  state.player.health = 100;
  state.player.charge = 0;
  state.enemy.health = 100;
  state.enemy.charge = 0;
  state.gameOver = false;
  els.log.innerHTML = "";
  addLog("🕹️ New battle initialized.");
  updateBars();
}

els.chargeBtn.addEventListener("click", playerCharge);
els.attackBtn.addEventListener("click", playerStrike);
els.burstBtn.addEventListener("click", playerBurst);
els.resetBtn.addEventListener("click", resetGame);

resetGame();
