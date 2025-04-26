// === script.js ===
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Set canvas size to match the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Player setup
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  dir: "Front", // Player's direction ("Front", "Back", "Left", "Right")
  width: 32,
  height: 32,
  frame: 0,
  frameTimer: 0,
  moving: false
};

const keys = {
  w: false,
  a: false,
  s: false,
  d: false,
  Shift: false,
  f: false
};

// Placeholder for player images (replace with your own images)
const playerImgs = {
  IdleFront: new Image(),
  IdleBack: new Image(),
  IdleLeft: new Image(),
  IdleRight: new Image(),
  WalkFront: [],
  WalkBack: [],
  WalkLeft: [],
  WalkRight: []
};

// Load player images (add all your frames here)
function loadPlayerImages(callback) {
  let loaded = 0;
  const total = 4 + 4 * 10; // 4 idle + 40 walk frames (adjust based on your actual number)

  function checkLoaded() {
    loaded++;
    if (loaded >= total) callback();
  }

  // Load idle images
  ["Front", "Back", "Left", "Right"].forEach(dir => {
    playerImgs["Idle" + dir].src = `Idle${dir}.png`;
    playerImgs["Idle" + dir].onload = checkLoaded;
  });

  // Load walking frames (adjust frame counts as needed)
  ["Front", "Back", "Left", "Right"].forEach(dir => {
    for (let i = 1; i <= 10; i++) {  // Adjust number of frames
      const img = new Image();
      img.src = `Walk${dir}${i}.png`;
      img.onload = checkLoaded;
      playerImgs["Walk" + dir].push(img);
    }
  });
}

// Game loop
let lastTime = 0;
function loop(timestamp) {
  const delta = timestamp - lastTime;
  lastTime = timestamp;

  update(delta);
  updateMagic(delta); // Handle magic (mana, fireballs, etc.)
  draw();
  drawMagic(); // Draw fireballs, mana bar, enemies

  requestAnimationFrame(loop);
}

function update(delta) {
  let dx = 0, dy = 0;

  // Movement based on keys (W, A, S, D)
  if (keys.w) dy -= 1;
  if (keys.s) dy += 1;
  if (keys.a) dx -= 1;
  if (keys.d) dx += 1;

  player.moving = dx !== 0 || dy !== 0;

  // Set player direction based on movement
  if (dx < 0) player.dir = "Right";
  else if (dx > 0) player.dir = "Left";
  else if (dy < 0) player.dir = "Back";
  else if (dy > 0) player.dir = "Front";

  if (player.moving) {
    player.x += dx * 2; // Move the player
    player.y += dy * 2;

    // Handle animation frame change
    player.frameTimer += delta;
    if (player.frameTimer >= 100) {  // Adjust timing for walk animation
      player.frame = (player.frame + 1) % 10; // Loop through walk frames
      player.frameTimer = 0;
    }
  } else {
    player.frame = 0; // Idle animation
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (player.moving) {
    const walkFrames = playerImgs["Walk" + player.dir];
    const frameImg = walkFrames[player.frame];
    ctx.drawImage(frameImg, player.x - frameImg.width / 2, player.y - frameImg.height / 2);
  } else {
    const idleImg = playerImgs["Idle" + player.dir];
    ctx.drawImage(idleImg, player.x - idleImg.width / 2, player.y - idleImg.height / 2);
  }
}

// Key event listeners
document.addEventListener("keydown", (e) => {
  if (e.key in keys) keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
  if (e.key in keys) keys[e.key] = false;
});

// Load images and start the game loop
loadPlayerImages(() => {
  requestAnimationFrame(loop);
});
