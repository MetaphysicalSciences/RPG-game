const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const WALK_SPEED = 2;
const RUN_SPEED = 4;
const FRAME_DELAY = 100; // Normal speed
const RUN_FRAME_DELAY = 50; // Faster speed while running
const WALK_FRAME_COUNT = 10;

const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  dir: "Front", // "Front", "Back", "Left", "Right"
  frame: 0,
  frameTimer: 0,
  moving: false,
  running: false,
};

const keys = {
  w: false,
  a: false,
  s: false,
  d: false,
  Shift: false,
};

const images = {
  IdleFront: new Image(),
  IdleBack: new Image(),
  IdleLeft: new Image(),
  IdleRight: new Image(),
  WalkFront: [],
  WalkBack: [],
  WalkLeft: [],
  WalkRight: [],
};

// Load all images
function loadImages(callback) {
  let loaded = 0;
  const total = 4 + 4 * WALK_FRAME_COUNT;

  function checkLoaded() {
    loaded++;
    if (loaded >= total) callback();
  }

  // Load idle images
  ["Front", "Back", "Left", "Right"].forEach(dir => {
    images["Idle" + dir].src = `Idle${dir}.png`;
    images["Idle" + dir].onload = checkLoaded;
  });

  // Load walk frames
  ["Front", "Back", "Left", "Right"].forEach(dir => {
    for (let i = 1; i <= WALK_FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `Walk${dir}${i}.png`;
      img.onload = checkLoaded;
      images["Walk" + dir].push(img);
    }
  });
}

function update(delta) {
  let dx = 0, dy = 0;

  player.running = keys.Shift;

  if (keys.w) dy -= 1;
  if (keys.s) dy += 1;
  if (keys.a) dx -= 1;
  if (keys.d) dx += 1;

  player.moving = dx !== 0 || dy !== 0;

  // Fix left-right swap
  if (dx < 0) player.dir = "Right"; // A = go left, show facing right
  else if (dx > 0) player.dir = "Left"; // D = go right, show facing left
  else if (dy < 0) player.dir = "Back"; // W = go up
  else if (dy > 0) player.dir = "Front"; // S = go down

  if (player.moving) {
    const speed = player.running ? RUN_SPEED : WALK_SPEED;
    player.x += dx * speed;
    player.y += dy * speed;

    const frameDelay = player.running ? RUN_FRAME_DELAY : FRAME_DELAY;
    player.frameTimer += delta;
    if (player.frameTimer >= frameDelay) {
      player.frame = (player.frame + 1) % WALK_FRAME_COUNT;
      player.frameTimer = 0;
    }
  } else {
    player.frame = 0;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (player.moving) {
    const walkFrames = images["Walk" + player.dir];
    const frameImg = walkFrames[player.frame];
    ctx.drawImage(frameImg, player.x - frameImg.width / 2, player.y - frameImg.height / 2);
  } else {
    const idleImg = images["Idle" + player.dir];
    ctx.drawImage(idleImg, player.x - idleImg.width / 2, player.y - idleImg.height / 2);
  }
}

let lastTime = 0;
function loop(timestamp) {
  const delta = timestamp - lastTime;
  lastTime = timestamp;

  update(delta);
  draw();
  requestAnimationFrame(loop);
}

document.addEventListener("keydown", e => {
  if (e.key in keys) keys[e.key] = true;
});
document.addEventListener("keyup", e => {
  if (e.key in keys) keys[e.key] = false;
});

// Load and start
loadImages(() => {
  requestAnimationFrame(loop);
});
