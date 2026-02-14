const MAX_HEALTH = 100;
const MAX_STAMINA = 100;

const state = {
  players: [
    { name: "Player 1", health: 100, stamina: 25 },
    { name: "Player 2", health: 100, stamina: 25 },
  ],
  turn: 0,
  gameOver: false,
};

const els = {
  p1Health: document.getElementById("p1-health"),
  p1Stamina: document.getElementById("p1-stamina"),
  p2Health: document.getElementById("p2-health"),
  p2Stamina: document.getElementById("p2-stamina"),
  p1HealthText: document.getElementById("p1-health-text"),
  p1StaminaText: document.getElementById("p1-stamina-text"),
  p2HealthText: document.getElementById("p2-health-text"),
  p2StaminaText: document.getElementById("p2-stamina-text"),
  turnLabel: document.getElementById("turn-label"),
  jabBtn: document.getElementById("jab-btn"),
  kickBtn: document.getElementById("kick-btn"),
  comboBtn: document.getElementById("combo-btn"),
  focusBtn: document.getElementById("focus-btn"),
  resetBtn: document.getElementById("reset-btn"),
  log: document.getElementById("fight-log"),
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

function currentPlayer() {
  return state.players[state.turn];
}

function opponentPlayer() {
  return state.players[state.turn === 0 ? 1 : 0];
}

function updateUI() {
  const [p1, p2] = state.players;

  els.p1Health.style.width = `${p1.health}%`;
  els.p1Stamina.style.width = `${p1.stamina}%`;
  els.p2Health.style.width = `${p2.health}%`;
  els.p2Stamina.style.width = `${p2.stamina}%`;

  els.p1HealthText.textContent = p1.health;
  els.p1StaminaText.textContent = p1.stamina;
  els.p2HealthText.textContent = p2.health;
  els.p2StaminaText.textContent = p2.stamina;

  const attacker = currentPlayer();
  els.turnLabel.textContent = state.gameOver
    ? "Fight over"
    : `Turn: ${attacker.name}`;

  els.jabBtn.disabled = state.gameOver || attacker.stamina < 10;
  els.kickBtn.disabled = state.gameOver || attacker.stamina < 20;
  els.comboBtn.disabled = state.gameOver || attacker.stamina < 35;
  els.focusBtn.disabled = state.gameOver || attacker.stamina >= MAX_STAMINA;
}

function endTurn() {
  if (!state.gameOver) {
    state.turn = state.turn === 0 ? 1 : 0;
  }
  updateUI();
}

function checkWinner() {
  const [p1, p2] = state.players;

  if (p1.health <= 0 || p2.health <= 0) {
    state.gameOver = true;

    if (p1.health <= 0 && p2.health <= 0) {
      addLog("⚔️ Double knockout! Both fighters hit the canvas.");
    } else if (p1.health <= 0) {
      addLog("🏆 Player 2 wins the round!");
    } else {
      addLog("🏆 Player 1 wins the round!");
    }
  }
}

function performAttack(cost, minDmg, maxDmg, moveName, icon) {
  if (state.gameOver) return;

  const attacker = currentPlayer();
  const defender = opponentPlayer();

  if (attacker.stamina < cost) return;

  const damage = randomInt(minDmg, maxDmg);
  attacker.stamina -= cost;
  defender.health = clamp(defender.health - damage, 0, MAX_HEALTH);

  addLog(`${icon} ${attacker.name} used ${moveName} for ${damage} damage.`);
  checkWinner();
  endTurn();
}

function catchBreath() {
  if (state.gameOver) return;

  const attacker = currentPlayer();
  const gain = 18;
  attacker.stamina = clamp(attacker.stamina + gain, 0, MAX_STAMINA);
  addLog(`🫁 ${attacker.name} caught breath and recovered +${gain} stamina.`);

  endTurn();
}

function resetGame() {
  state.players[0].health = MAX_HEALTH;
  state.players[0].stamina = 25;
  state.players[1].health = MAX_HEALTH;
  state.players[1].stamina = 25;
  state.turn = 0;
  state.gameOver = false;

  els.log.innerHTML = "";
  addLog("🕹️ New two-player round started.");
  updateUI();
}

els.jabBtn.addEventListener("click", () => performAttack(10, 8, 14, "Jab", "👊"));
els.kickBtn.addEventListener("click", () => performAttack(20, 14, 22, "Kick", "🦵"));
els.comboBtn.addEventListener("click", () => performAttack(35, 24, 33, "Combo Rush", "🥊"));
els.focusBtn.addEventListener("click", catchBreath);
els.resetBtn.addEventListener("click", resetGame);

resetGame();
