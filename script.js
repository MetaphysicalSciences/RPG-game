const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const SPEED = 2;
const FRAME_DELAY = 100; // Time (ms) between frames
const WALK_FRAME_COUNT = 10;

const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  dir: "Front", // "Front", "Back", "Left", "Right"
  frame: 0,
  frameTimer: 0,
  moving: false,
};

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
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

  if (keys.ArrowUp) dy -= 1;
  if (keys.ArrowDown) dy += 1;
  if (keys.ArrowLeft) dx -= 1;
  if (keys.ArrowRight) dx += 1;

  player.moving = dx !== 0 || dy !== 0;

  if (dy < 0) player.dir = "Back";
  else if (dy > 0) player.dir = "Front";
  else if (dx < 0) player.dir = "Left";
  else if (dx > 0) player.dir = "Right";

  if (player.moving) {
    player.x += dx * SPEED;
    player.y += dy * SPEED;
    player.frameTimer += delta;
    if (player.frameTimer >= FRAME_DELAY) {
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
