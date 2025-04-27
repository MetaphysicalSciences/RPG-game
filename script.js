// ==================== script.js ====================
// Grab the canvas and set it full-screen
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Player data
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  dir: "Front",   // "Front","Back","Left","Right"
  frame: 0,
  frameTimer: 0,
  moving: false,
  running: false
};

// Movement + animation constants
const WALK_SPEED = 2;
const RUN_SPEED = 4;
const FRAME_DELAY = 100;    // milliseconds per walk frame
const RUN_DELAY = 50;       // faster when running
const WALK_FRAMES = 10;     // number of walk*.png per dir

// Input state
const keys = { w:0, a:0, s:0, d:0, Shift:0, f:0 };

// Load player images
const imgs = {
  IdleFront: new Image(), IdleBack: new Image(),
  IdleLeft: new Image(), IdleRight: new Image(),
  WalkFront: [], WalkBack: [],
  WalkLeft: [], WalkRight: []
};

function loadPlayerImages(callback) {
  let loaded = 0;
  const total = 4 + (4 * WALK_FRAMES);

  function check() {
    loaded++;
    if (loaded === total) callback();
  }

  // Idle images
  ["Front","Back","Left","Right"].forEach(dir => {
    imgs["Idle"+dir].src = `Idle${dir}.png`;
    imgs["Idle"+dir].onload = check;
  });

  // Walk frames
  ["Front","Back","Left","Right"].forEach(dir => {
    for (let i = 1; i <= WALK_FRAMES; i++) {
      const im = new Image();
      im.src = `Walk${dir}${i}.png`;
      im.onload = check;
      imgs["Walk"+dir].push(im);
    }
  });
}

// Update player position + animation
function updatePlayer(delta) {
  let dx = keys.d - keys.a;
  let dy = keys.s - keys.w;
  player.running = keys.Shift === 1;
  player.moving = (dx !== 0 || dy !== 0);

  // Determine facing
  if (dx > 0)        player.dir = "Left";   // pressing D → move right, show left sprite
  else if (dx < 0)   player.dir = "Right";  // pressing A → move left, show right sprite
  else if (dy > 0)   player.dir = "Front";  // pressing S → move down → front sprite
  else if (dy < 0)   player.dir = "Back";   // pressing W → move up → back sprite

  // Move & animate
  if (player.moving) {
    const speed = player.running ? RUN_SPEED : WALK_SPEED;
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
    player.frameTimer = 0;
  }
}

// Draw the player
function drawPlayer() {
  const action = player.moving ? "Walk" : "Idle";
  const key    = action + player.dir;
  if (player.moving) {
    const img = imgs[key][player.frame];
    ctx.drawImage(img, player.x - img.width/2, player.y - img.height/2);
  } else {
    const img = imgs[key];
    ctx.drawImage(img, player.x - img.width/2, player.y - img.height/2);
  }
}

// Main loop
let lastTime = 0;
function loop(timestamp) {
  const delta = timestamp - lastTime;
  lastTime = timestamp;

  updatePlayer(delta);
  updateMagic(delta);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawPlayer();
  drawMagic();
  requestAnimationFrame(loop);
}

// Key events
document.addEventListener("keydown", e => {
  if (e.key in keys) keys[e.key] = 1;
});
document.addEventListener("keyup", e => {
  if (e.key in keys) keys[e.key] = 0;
});

// Start once images loaded
loadPlayerImages(() => {
  // Spawn 5 test enemies
  for (let i = 0; i < 5; i++) {
    const x = 50 + Math.random()*(canvas.width-100);
    const y = 50 + Math.random()*(canvas.height-100);
    spawnEnemy(x, y);
  }
  requestAnimationFrame(loop);
});
