const MAX_HEALTH = 100;
const MAX_STAMINA = 100;
const MAX_CHARGE = 100;

const state = {
  players: [
    { name: "Player 1", health: 100, stamina: 30, charge: 0, guarding: false },
    { name: "Player 2", health: 100, stamina: 30, charge: 0, guarding: false },
  ],
  turn: 0,
  phase: "Neutral",
  gameOver: false,
};

const els = {
  p1Health: document.getElementById("p1-health"),
  p1Stamina: document.getElementById("p1-stamina"),
  p1Charge: document.getElementById("p1-charge"),
  p2Health: document.getElementById("p2-health"),
  p2Stamina: document.getElementById("p2-stamina"),
  p2Charge: document.getElementById("p2-charge"),
  p1HealthText: document.getElementById("p1-health-text"),
  p1StaminaText: document.getElementById("p1-stamina-text"),
  p1ChargeText: document.getElementById("p1-charge-text"),
  p2HealthText: document.getElementById("p2-health-text"),
  p2StaminaText: document.getElementById("p2-stamina-text"),
  p2ChargeText: document.getElementById("p2-charge-text"),
  turnLabel: document.getElementById("turn-label"),
  phaseLabel: document.getElementById("phase-label"),
  leftFighter: document.getElementById("fighter-left"),
  rightFighter: document.getElementById("fighter-right"),
  jabBtn: document.getElementById("jab-btn"),
  kickBtn: document.getElementById("kick-btn"),
  guardBtn: document.getElementById("guard-btn"),
  chargeBtn: document.getElementById("charge-btn"),
  burstBtn: document.getElementById("burst-btn"),
  resetBtn: document.getElementById("reset-btn"),
  log: document.getElementById("fight-log"),
};

function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function addLog(message) {
  const li = document.createElement("li");
  li.textContent = message;
  els.log.prepend(li);
}

function currentPlayer() { return state.players[state.turn]; }
function opponentPlayer() { return state.players[state.turn === 0 ? 1 : 0]; }

function animateAction(attackerSide, defenderSide, defenderGuarding) {
  const attackerEl = attackerSide === 0 ? els.leftFighter : els.rightFighter;
  const defenderEl = defenderSide === 0 ? els.leftFighter : els.rightFighter;

  attackerEl.classList.add(attackerSide === 0 ? "attack-left" : "attack-right");
  defenderEl.classList.add("hit");
  if (defenderGuarding) defenderEl.classList.add("guard");

  setTimeout(() => {
    attackerEl.classList.remove("attack-left", "attack-right");
    defenderEl.classList.remove("hit", "guard");
  }, 220);
}

function updateUI() {
  const [p1, p2] = state.players;

  els.p1Health.style.width = `${p1.health}%`;
  els.p1Stamina.style.width = `${p1.stamina}%`;
  els.p1Charge.style.width = `${p1.charge}%`;
  els.p2Health.style.width = `${p2.health}%`;
  els.p2Stamina.style.width = `${p2.stamina}%`;
  els.p2Charge.style.width = `${p2.charge}%`;

  els.p1HealthText.textContent = p1.health;
  els.p1StaminaText.textContent = p1.stamina;
  els.p1ChargeText.textContent = p1.charge;
  els.p2HealthText.textContent = p2.health;
  els.p2StaminaText.textContent = p2.stamina;
  els.p2ChargeText.textContent = p2.charge;

  const attacker = currentPlayer();
  els.turnLabel.textContent = state.gameOver ? "Fight over" : `Turn: ${attacker.name}`;
  els.phaseLabel.textContent = `Phase: ${state.phase}`;

  els.jabBtn.disabled = state.gameOver || attacker.stamina < 10;
  els.kickBtn.disabled = state.gameOver || attacker.stamina < 20;
  els.guardBtn.disabled = state.gameOver || attacker.stamina < 8;
  els.chargeBtn.disabled = state.gameOver || attacker.charge >= MAX_CHARGE;
  els.burstBtn.disabled = state.gameOver || attacker.stamina < 40 || attacker.charge < 60;
}

function checkWinner() {
  const [p1, p2] = state.players;
  if (p1.health <= 0 || p2.health <= 0) {
    state.gameOver = true;
    state.phase = "Finished";
    if (p1.health <= 0 && p2.health <= 0) {
      addLog("⚔️ Double knockout! Unreal finish.");
    } else if (p1.health <= 0) {
      addLog("🏆 Player 2 wins!");
    } else {
      addLog("🏆 Player 1 wins!");
    }
  }
}

function endTurn(nextPhase = "Neutral") {
  if (!state.gameOver) {
    state.turn = state.turn === 0 ? 1 : 0;
    state.phase = nextPhase;
  }
  updateUI();
}

function resolveHit(cost, dmgMin, dmgMax, chargeGain, moveName, icon) {
  if (state.gameOver) return;

  const attacker = currentPlayer();
  const defender = opponentPlayer();
  if (attacker.stamina < cost) return;

  attacker.stamina -= cost;
  let damage = randomInt(dmgMin, dmgMax);

  if (defender.guarding) {
    damage = Math.floor(damage * 0.5);
    defender.guarding = false;
    addLog("🛡️ Guard reduced damage!");
  }

  defender.health = clamp(defender.health - damage, 0, MAX_HEALTH);
  attacker.charge = clamp(attacker.charge + chargeGain, 0, MAX_CHARGE);

  animateAction(state.turn, state.turn === 0 ? 1 : 0, false);
  addLog(`${icon} ${attacker.name} used ${moveName} for ${damage} damage.`);

  checkWinner();
  endTurn(state.gameOver ? "Finished" : "Neutral");
}

function guard() {
  if (state.gameOver) return;
  const attacker = currentPlayer();
  if (attacker.stamina < 8) return;

  attacker.stamina -= 8;
  attacker.guarding = true;
  attacker.charge = clamp(attacker.charge + 10, 0, MAX_CHARGE);
  state.phase = "Guarding";

  const guardEl = state.turn === 0 ? els.leftFighter : els.rightFighter;
  guardEl.classList.add("guard");
  setTimeout(() => guardEl.classList.remove("guard"), 250);

  addLog(`🛡️ ${attacker.name} braces for impact.`);
  endTurn("Neutral");
}

function charge() {
  if (state.gameOver) return;
  const attacker = currentPlayer();
  const gain = 22;
  attacker.charge = clamp(attacker.charge + gain, 0, MAX_CHARGE);
  attacker.stamina = clamp(attacker.stamina + 6, 0, MAX_STAMINA);
  state.phase = "Charging";
  addLog(`⚡ ${attacker.name} charged +${gain} energy.`);
  endTurn("Neutral");
}

function chargedSlam() {
  if (state.gameOver) return;
  const attacker = currentPlayer();
  const defender = opponentPlayer();
  if (attacker.stamina < 40 || attacker.charge < 60) return;

  attacker.stamina -= 40;
  attacker.charge -= 60;

  let damage = randomInt(30, 42);
  if (defender.guarding) {
    damage = Math.floor(damage * 0.65);
    defender.guarding = false;
    addLog("🛡️ Guard softened the slam!");
  }

  defender.health = clamp(defender.health - damage, 0, MAX_HEALTH);
  state.phase = "Charged Impact";

  animateAction(state.turn, state.turn === 0 ? 1 : 0, false);
  addLog(`🌌 ${attacker.name} landed Charged Slam for ${damage} damage!`);

  checkWinner();
  endTurn(state.gameOver ? "Finished" : "Neutral");
}

function resetGame() {
  state.players[0] = { name: "Player 1", health: 100, stamina: 30, charge: 0, guarding: false };
  state.players[1] = { name: "Player 2", health: 100, stamina: 30, charge: 0, guarding: false };
  state.turn = 0;
  state.phase = "Neutral";
  state.gameOver = false;
  els.log.innerHTML = "";
  addLog("🕹️ New 3D charged fight started.");
  updateUI();
}

els.jabBtn.addEventListener("click", () => resolveHit(10, 8, 14, 12, "Jab", "👊"));
els.kickBtn.addEventListener("click", () => resolveHit(20, 14, 22, 16, "Kick", "🦵"));
els.guardBtn.addEventListener("click", guard);
els.chargeBtn.addEventListener("click", charge);
els.burstBtn.addEventListener("click", chargedSlam);
els.resetBtn.addEventListener("click", resetGame);

resetGame();
