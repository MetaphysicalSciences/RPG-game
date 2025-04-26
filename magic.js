// === magic.js ===
const manaMax = 100;
let mana = manaMax;
const manaRechargeSpeed = 10;   // mana per second
const manaCost = 20;

const fireballs = [];
const enemies = [];
const slimeImg = new Image();
slimeImg.src = "SlimeBlue.png";

const fireballSpeed = 5;
const fireballSize = 32;        // made bigger
const fireballImg = new Image();
fireballImg.src = "fireball.png";

// Shoot fireball on F
document.addEventListener("keydown", (e) => {
  if (e.key === "f" && mana >= manaCost) {
    let angle;
    // fixed: Right → 0, Left → π, Front (down) → π/2, Back (up) → -π/2
    if (player.dir === "Right") angle = 0;
    else if (player.dir === "Left") angle = Math.PI;
    else if (player.dir === "Front") angle = Math.PI / 2;
    else /* Back */                  angle = -Math.PI / 2;

    fireballs.push({
      x: player.x,
      y: player.y,
      dx: Math.cos(angle) * fireballSpeed,
      dy: Math.sin(angle) * fireballSpeed,
    });

    mana -= manaCost;
  }
});

function spawnEnemy(x, y) {
  enemies.push({ x, y, width: 32, height: 32, hp: 4 });
}

function updateMagic(delta) {
  // Recharge mana when not holding F
  if (!keys.f && mana < manaMax) {
    mana += manaRechargeSpeed * (delta / 1000);
    if (mana > manaMax) mana = manaMax;
  }

  // Fireball movement & collision
  for (let i = fireballs.length - 1; i >= 0; i--) {
    const f = fireballs[i];
    f.x += f.dx;
    f.y += f.dy;

    // offscreen?
    if (f.x < -fireballSize || f.x > canvas.width + fireballSize ||
        f.y < -fireballSize || f.y > canvas.height + fireballSize) {
      fireballs.splice(i, 1);
      continue;
    }

    // hit enemies?
    for (let j = enemies.length - 1; j >= 0; j--) {
      const e = enemies[j];
      if (f.x > e.x && f.x < e.x + e.width &&
          f.y > e.y && f.y < e.y + e.height) {
        e.hp--;
        fireballs.splice(i, 1);
        if (e.hp <= 0) enemies.splice(j, 1);
        break;
      }
    }
  }
}

function drawMagic() {
  // Mana bar
  ctx.fillStyle = "black";
  ctx.fillRect(20, 20, manaMax + 4, 14);
  ctx.fillStyle = "blue";
  ctx.fillRect(22, 22, mana, 10);

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
    // HP bar
    ctx.fillStyle = "black";
    ctx.fillRect(e.x, e.y - 10, e.width, 5);
    ctx.fillStyle = "green";
    ctx.fillRect(e.x, e.y - 10, e.width * (e.hp / 4), 5);
  });
}
