// ==================== magic.js ====================
// Mana settings
const manaMax = 100;
let mana = manaMax;
const manaRechargeSpeed = 10; // per second
const manaCost = 20;

// Fireballs & enemies
const fireballs = [];
const enemies = [];

// Fireball sprite
const fireballImg = new Image();
fireballImg.src = "fireball.png";

// Slime sprite
const slimeImg = new Image();
slimeImg.src = "SlimeBlue.png";

// Fireball properties
const fireballSpeed = 5;
const fireballSize = 32;

// Spawn an enemy at (x,y)
function spawnEnemy(x, y) {
  enemies.push({
    x: x,
    y: y,
    width: 32,
    height: 32,
    hp: 4
  });
}

// Shooting logic
document.addEventListener("keydown", e => {
  if (e.key === "f" && mana >= manaCost) {
    // Determine angle by player.dir
    let angle = 0;
    if (player.dir === "Right") angle = 0;
    else if (player.dir === "Left") angle = Math.PI;
    else if (player.dir === "Front") angle = Math.PI/2;
    else if (player.dir === "Back") angle = -Math.PI/2;

    fireballs.push({
      x: player.x,
      y: player.y,
      dx: Math.cos(angle)*fireballSpeed,
      dy: Math.sin(angle)*fireballSpeed
    });
    mana -= manaCost;
  }
});

// Update fireballs, mana recharge, collisions
function updateMagic(delta) {
  // Recharge when not holding F
  if (!keys.f && mana < manaMax) {
    mana += manaRechargeSpeed * (delta/1000);
    if (mana > manaMax) mana = manaMax;
  }

  // Move & collide fireballs
  for (let i = fireballs.length-1; i >= 0; i--) {
    const f = fireballs[i];
    f.x += f.dx;
    f.y += f.dy;

    // Remove offscreen
    if (f.x < -fireballSize || f.x > canvas.width+fireballSize ||
        f.y < -fireballSize || f.y > canvas.height+fireballSize) {
      fireballs.splice(i,1);
      continue;
    }

    // Check collisions vs enemies
    for (let j = enemies.length-1; j >= 0; j--) {
      const e = enemies[j];
      if (f.x > e.x && f.x < e.x+e.width &&
          f.y > e.y && f.y < e.y+e.height) {
        e.hp--;
        fireballs.splice(i,1);
        if (e.hp <= 0) enemies.splice(j,1);
        break;
      }
    }
  }
}

// Draw mana bar, fireballs, enemies
function drawMagic() {
  // Mana bar background
  ctx.fillStyle = "#000";
  ctx.fillRect(20,20, manaMax+4, 14);
  // Mana fill
  ctx.fillStyle = "#00f";
  ctx.fillRect(22,22, mana, 10);

  // Fireballs
  fireballs.forEach(f => {
    ctx.drawImage(
      fireballImg,
      f.x - fireballSize/2,
      f.y - fireballSize/2,
      fireballSize,
      fireballSize
    );
  });

  // Enemies (slimes)
  enemies.forEach(e => {
    ctx.drawImage(slimeImg, e.x, e.y, e.width, e.height);
    // HP bar background
    ctx.fillStyle = "#000";
    ctx.fillRect(e.x, e.y-10, e.width, 5);
    // HP fill
    ctx.fillStyle = "#0f0";
    ctx.fillRect(e.x, e.y-10, e.width*(e.hp/4), 5);
  });
}
