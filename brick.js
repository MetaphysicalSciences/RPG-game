class DamageBrick {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
    }

    draw(ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    checkCollision(player) {
        return (
            player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y < this.y + this.height &&
            player.y + player.height > this.y
        );
    }
}

// Spawn a few for testing
const damageBricks = [
    new DamageBrick(400, 300),
    new DamageBrick(600, 300),
];

// In your game loop
function updateDamageBricks(player) {
    damageBricks.forEach(brick => {
        if (brick.checkCollision(player)) {
            takeDamage(1); // Damage player slowly
        }
    });
}

function drawDamageBricks(ctx) {
    damageBricks.forEach(brick => brick.draw(ctx));
}
