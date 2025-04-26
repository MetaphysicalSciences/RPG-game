const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

const keys = {
  w: false,
  a: false,
  s: false,
  d: false,
  space: false
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'w') keys.w = true;
  if (e.key === 'a') keys.a = true;
  if (e.key === 's') keys.s = true;
  if (e.key === 'd') keys.d = true;
  if (e.code === 'Space') keys.space = true;
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'w') keys.w = false;
  if (e.key === 'a') keys.a = false;
  if (e.key === 's') keys.s = false;
  if (e.key === 'd') keys.d = false;
  if (e.code === 'Space') keys.space = false;
});

const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: 48,
  height: 64,
  speed: 2.5,
  frameX: 0,
  frameY: 0,
  moving: false,
  facing: "right",
  mana: 100,
  manaRegenRate: 0.02
};

// player sprite sheet
const playerImg = new Image();
playerImg.src = 'IdleRight.png'; // Start with facing right

function loadPlayerImages(callback) {
  playerImg.onload = callback;
}

function drawPlayer() {
  if (player.facing === "left") {
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(playerImg,
      player.frameX * player.width, player.frameY * player.height,
      player.width, player.height,
      -player.x - player.width / 2, player.y - player.height / 2,
      player.width, player.height
    );
    ctx.restore();
  } else {
    ctx.drawImage(playerImg,
      player.frameX * player.width, player.frameY * player.height,
      player.width, player.height,
      player.x - player.width / 2, player.y - player.height / 2,
      player.width, player.height
    );
  }
}

function movePlayer() {
  let moved = false;

  if (keys.a) {
    tryMovePlayer(-player.speed, 0);
    player.facing = "left";
    moved = true;
  }
  if (keys.d) {
    tryMovePlayer(player.speed, 0);
    player.facing = "right";
    moved = true;
  }
  if (keys.w) {
    tryMovePlayer(0, -player.speed);
    moved = true;
  }
  if (keys.s) {
    tryMovePlayer(0, player.speed);
    moved = true;
  }

  player.moving = moved;
}

// mana regeneration
function updateMana(delta) {
  player.mana += player.manaRegenRate * delta;
  if (player.mana > 100) {
    player.mana = 100;
  }
}

// draw mana bar
function drawManaBar() {
  ctx.fillStyle = "black";
  ctx.fillRect(10, 10, 200, 20);
  ctx.fillStyle = "blue";
  ctx.fillRect(10, 10, 200 * (player.mana / 100), 20);
}

// draw fireballs (magic.js function still used)
function drawMagic() {
  fireballs.forEach(fireball => {
    ctx.drawImage(fireballImg, fireball.x - 8, fireball.y - 8, 16, 16);
  });
}

// update fireballs
function updateMagic(delta) {
  fireballs.forEach((fireball, index) => {
    fireball.x += fireball.vx * fireball.speed;
    fireball.y += fireball.vy * fireball.speed;

    if (collidesWithWall(fireball.x, fireball.y, 8, 8)) {
      fireballs.splice(index, 1);
    }

    slimes.forEach((slime, slimeIndex) => {
      if (fireball.x > slime.x &&
          fireball.x < slime.x + slime.width &&
          fireball.y > slime.y &&
          fireball.y < slime.y + slime.height) {
        slime.hp--;
        fireballs.splice(index, 1);
        if (slime.hp <= 0) {
          slimes.splice(slimeIndex, 1);
        }
      }
    });
  });
}

// shoot fireballs
function shootFireball() {
  if (player.mana >= 10) {
    let dir = player.facing === "right" ? 1 : -1;
    fireballs.push({
      x: player.x,
      y: player.y,
      vx: dir,
      vy: 0,
      speed: 6
    });
    player.mana -= 10;
  }
}

setInterval(() => {
  if (keys.space) {
    shootFireball();
  }
}, 300);

// now the full game loop
loadPlayerImages(() => {
  generateDungeon();
  placeSlimes();

  let lastTime = 0;
  function gameLoop(timeStamp) {
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    movePlayer();
    updateMana(deltaTime);
    updateMagic(deltaTime);

    drawDungeon();
    drawPlayer();
    drawMagic();
    drawSlimes();
    drawManaBar();

    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
});
