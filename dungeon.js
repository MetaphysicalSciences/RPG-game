// === dungeon.js ===

// Dungeon configuration
const TILE_SIZE = 32;            // size of each tile in pixels
const MAP_COLS  = 25;            // number of columns
const MAP_ROWS  = 18;            // number of rows

// 0 = floor, 1 = wall
let mapGrid = [];

// Textures
const wallImg  = new Image();
wallImg.src    = "wall.png";

const slimeImg = new Image();
slimeImg.src   = "SlimeBlue.png";

// Slime list (moved out of magic.js)
let slimes = [];

// Generate a random dungeon using simple cellular automata
function generateDungeon() {
  // Fill randomly with walls/floor
  mapGrid = Array(MAP_ROWS).fill(null).map(() => {
    return Array(MAP_COLS).fill(null).map(() => {
      return Math.random() < 0.45 ? 1 : 0;
    });
  });

  // Smooth map: run a few iterations of wall-growth
  for (let iter = 0; iter < 4; iter++) {
    const newGrid = mapGrid.map(arr => arr.slice());
    for (let y = 1; y < MAP_ROWS - 1; y++) {
      for (let x = 1; x < MAP_COLS - 1; x++) {
        // count walls in 8 neighbors
        let walls = 0;
        for (let oy = -1; oy <= 1; oy++) {
          for (let ox = -1; ox <= 1; ox++) {
            if (ox === 0 && oy === 0) continue;
            if (mapGrid[y + oy][x + ox] === 1) walls++;
          }
        }
        // simple rules
        if (walls > 4) newGrid[y][x] = 1;
        else if (walls < 4) newGrid[y][x] = 0;
      }
    }
    mapGrid = newGrid;
  }
}

// Place 5 slimes in random floor tiles
function placeSlimes() {
  slimes = [];
  let attempts = 0;
  while (slimes.length < 5 && attempts < 500) {
    attempts++;
    const x = Math.floor(Math.random() * MAP_COLS);
    const y = Math.floor(Math.random() * MAP_ROWS);
    if (mapGrid[y][x] === 0) {
      slimes.push({
        x: x * TILE_SIZE,
        y: y * TILE_SIZE,
        width: TILE_SIZE,
        height: TILE_SIZE,
        hp: 4
      });
    }
  }
}

// Check whether a rectangle collides with any wall tile
function collidesWithWall(px, py, pw, ph) {
  // Check all four corners
  const corners = [
    { x: px,         y: py },
    { x: px + pw - 1, y: py },
    { x: px,         y: py + ph - 1 },
    { x: px + pw - 1, y: py + ph - 1 }
  ];
  for (const c of corners) {
    const tx = Math.floor(c.x / TILE_SIZE);
    const ty = Math.floor(c.y / TILE_SIZE);
    if (
      tx < 0 || tx >= MAP_COLS ||
      ty < 0 || ty >= MAP_ROWS ||
      mapGrid[ty][tx] === 1
    ) return true;
  }
  return false;
}

// Override player movement in script.js: wrap the old update()’s move logic
function tryMovePlayer(dx, dy) {
  const newX = player.x + dx;
  const newY = player.y + dy;
  if (!collidesWithWall(newX - playerSpriteWidth/2, newY - playerSpriteHeight/2,
                         playerSpriteWidth, playerSpriteHeight)) {
    player.x = newX;
    player.y = newY;
  }
}

// Draw the dungeon map
function drawDungeon() {
  for (let y = 0; y < MAP_ROWS; y++) {
    for (let x = 0; x < MAP_COLS; x++) {
      if (mapGrid[y][x] === 1) {
        ctx.drawImage(
          wallImg,
          x * TILE_SIZE, y * TILE_SIZE,
          TILE_SIZE, TILE_SIZE
        );
      }
      // floor tiles we leave blank (background shows through)
    }
  }
}

// Draw slimes (moved from magic.js)
function drawSlimes() {
  slimes.forEach(e => {
    ctx.drawImage(slimeImg, e.x, e.y, e.width, e.height);
    // HP bar
    ctx.fillStyle = "black";
    ctx.fillRect(e.x, e.y - 6, e.width, 4);
    ctx.fillStyle = "green";
    ctx.fillRect(e.x, e.y - 6, e.width * (e.hp / 4), 4);
  });
}

// In your main loop (script.js), make sure to:
//  1) call generateDungeon() and placeSlimes() once on start
//  2) call drawDungeon() before draw() of player
//  3) call drawSlimes() after drawMagic()

// Example integration snippet for script.js:
loadPlayerImages(() => {
  // generate dungeon & slimes once
  generateDungeon();
  placeSlimes();

  // spawnEnemy calls no longer needed in script.js/magic.js

  let last = 0;
  function loop(ts) {
    const delta = ts - last; last = ts;
    // handle movement input with collision:
    let dx = (keys.d - keys.a) * SPEED_WALK;
    let dy = (keys.s - keys.w) * SPEED_WALK;
    tryMovePlayer(dx, dy);

    updateMagic(delta);       // existing magic update
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawDungeon();            // new: draw walls first
    draw();                   // existing player draw
    drawMagic();              // existing fireball & mana draw
    drawSlimes();             // draw slimes on top
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
});
