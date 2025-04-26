// === script.js ===
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Fullscreen canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Player
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  dir: "Front", // "Front","Back","Left","Right"
  frame: 0,
  frameTimer: 0,
  moving: false,
  running: false,
};

const SPEED_WALK = 2;
const SPEED_RUN  = 4;
const FRAME_DELAY = 100;
const RUN_DELAY   = 50;
const WALK_FRAMES = 10;

// Input state
const keys = { w:0, a:0, s:0, d:0, Shift:0, f:0 };

// Image storage
const imgs = {
  IdleFront: new Image(), IdleBack: new Image(),
  IdleLeft: new Image(),  IdleRight: new Image(),
  WalkFront: [], WalkBack: [],
  WalkLeft: [],  WalkRight: []
};

// Load all player images
function loadPlayerImages(cb) {
  let loaded = 0;
  const total = 4 + 4 * WALK_FRAMES;
  function done() { if (++loaded === total) cb(); }

  ["Front","Back","Left","Right"].forEach(dir => {
    imgs["Idle"+dir].src = `Idle${dir}.png`;
    imgs["Idle"+dir].onload = done;
    for (let i = 1; i <= WALK_FRAMES; i++) {
      const im = new Image();
      im.src = `Walk${dir}${i}.png`;
      im.onload = done;
      imgs["Walk"+dir].push(im);
    }
  });
}

// Update player position, direction, and animation
function update(delta) {
  // Compute movement vector
  let dx = keys.d - keys.a;
  let dy = keys.s - keys.w;
  player.running = keys.Shift;
  player.moving = dx !== 0 || dy !== 0;

  // Swap mapping: D (dx>0) → Right, A (dx<0) → Left
  if (dx > 0)           player.dir = "Right";  
  else if (dx < 0)      player.dir = "Left";
  else if (dy > 0)      player.dir = "Front";
  else if (dy < 0)      player.dir = "Back";

  // Movement and frame stepping
  if (player.moving) {
    const speed = player.running ? SPEED_RUN : SPEED_WALK;
    player.x += dx * speed;
    player.y += dy * speed;

    player.frameTimer += delta;
    const delay = player.running ? RUN_DELAY : FRAME_DELAY;
    if (player.frameTimer >= delay) {
      player.frame = (player.frame + 1) % WALK_FRAMES;
      player.frameTimer = 0;
    }
  } else {
    player.frame = 0;
  }
}

// Draw player sprite
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const action = player.moving ? "Walk" : "Idle";
  const sheet = imgs[action + player.dir];

  if (player.moving) {
    const img = sheet[player.frame];
    ctx.drawImage(img, player.x - img.width/2, player.y - img.height/2);
  } else {
    ctx.drawImage(sheet, player.x - sheet.width/2, player.y - sheet.height/2);
  }
}

// Key event listeners
document.addEventListener("keydown", e => {
  if (e.key in keys) keys[e.key] = 1;
});
document.addEventListener("keyup", e => {
  if (e.key in keys) keys[e.key] = 0;
});

// Start everything
loadPlayerImages(() => {
  // Spawn 5 slimes for testing
  for (let i = 0; i < 5; i++) {
    const x = 50 + Math.random()*(canvas.width-100);
    const y = 50 + Math.random()*(canvas.height-100);
    spawnEnemy(x, y);
  }

  let last = 0;
  function loop(ts) {
    const delta = ts - last; last = ts;
    update(delta);
    updateMagic(delta);
    draw();
    drawMagic();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
});
