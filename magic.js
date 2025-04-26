// === magic.js ===
const manaMax = 100;
let mana = manaMax;
let manaRechargeSpeed = 10; // mana per second
let manaCost = 20;

const fireballs = [];
const enemies = [];

const fireballSpeed = 5;
const fireballSize = 16;
const fireballImg = new Image();
fireballImg.src = "fireball.png"; // Replace with actual fireball image

// Enemy setup
function spawnEnemy(x, y) {
  enemies.push({
    x: x,
    y: y,
    width: 32,
    height: 32,
    hp: 4,
  });
}

// Shoot fireball
document.addEventListener("keydown", (e) => {
  if (e.key === "f" && mana >= manaCost) {
    let angle = 0;
    if (player.dir === "Front") angle = Math.PI / 2;
    if (player.dir === "Back") angle = -Math.PI / 2;
    if (player.dir === "Left") angle = Math.PI;
    if (player.dir === "Right") angle = 0;

    fireballs.push({
      x: player.x,
      y: player.y,
      dx: Math.cos(angle) * fireballSpeed,
      dy: Math.sin(angle) * fireballSpeed,
    });

    mana -= manaCost;
  }
});

function updateMagic(delta) {
  // Recharge mana only when not pressing F
  if (!keys.f && mana < manaMax) {
    mana += manaRechargeSpeed * (delta / 1000);
    if (mana > manaMax) mana = manaMax;
  }

  // Update fireballs
  for (let i = fireballs.length - 1; i >= 0; i--) {
    const f = fireballs[i];
    f.x += f.dx;
    f.y += f.dy;

    // Remove fireball if offscreen
    if (f.x < 0 || f.x > canvas.width || f.y < 0 || f.y > canvas.height) {
      fireballs.splice(i, 1);
      continue;
    }

    // Check collisions with enemies
    for (let j = enemies.length - 1; j >= 0; j--) {
      const e = enemies[j];
      if (
        f.x > e.x && f.x < e.x + e.width &&
        f.y > e.y && f.y < e.y + e.height
      ) {
        e.hp--;
        fireballs.splice(i, 1); // Destroy fireball on hit

        if (e.hp <= 0) {
          enemies.splice(j, 1); // Kill enemy
        }
        break;
      }
    }
  }
}

function drawMagic() {
  // Draw mana bar
  ctx.fillStyle = "black";
  ctx.fillRect(20, 20, 104, 14);
  ctx.fillStyle = "blue";
  ctx.fillRect(22, 22, mana, 10);

  // Draw fireballs
  fireballs.forEach(f => {
    ctx.drawImage(fireballImg, f.x - fireballSize/2, f.y - fireballSize/2, fireballSize, fireballSize);
  });

  // Draw enemies
  enemies.forEach(e => {
    ctx.fillStyle = "red";
    ctx.fillRect(e.x, e.y, e.width, e.height);

    // HP bar
    ctx.fillStyle = "black";
    ctx.fillRect(e.x, e.y - 10, e.width, 5);
    ctx.fillStyle = "green";
    ctx.fillRect(e.x, e.y - 10, e.width * (e.hp / 4), 5);
  });
}
