// magic.js

const magicImage = new Image();
magicImage.src = 'SlimeFix.png'; // Updated to SlimeFix.png

class Magic {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.speed = 5;
        this.size = 20;
        this.direction = direction; // 'left' or 'right'
        this.particles = [];
    }

    update() {
        // Corrected movement: right is positive, left is negative
        if (this.direction === 'right') {
            this.x += this.speed;
        } else if (this.direction === 'left') {
            this.x -= this.speed;
        }

        // Update particle effects
        this.particles.push({
            x: this.x,
            y: this.y,
            size: Math.random() * 5 + 2,
            alpha: 1
        });

        this.particles.forEach(p => {
            p.alpha -= 0.02;
            p.size *= 0.96;
        });

        this.particles = this.particles.filter(p => p.alpha > 0);
    }

    draw(ctx) {
        // Draw particles first (behind the magic)
        this.particles.forEach(p => {
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = 'cyan';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        // Draw the main magic ball
        ctx.drawImage(magicImage, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }

    isOffScreen(canvasWidth) {
        return this.x < 0 || this.x > canvasWidth;
    }
}

// List to store all active magic shots
const magics = [];

function shootMagic(playerX, playerY, facing) {
    const direction = facing; // Now uses correct left/right
    magics.push(new Magic(playerX, playerY, direction));
}

function updateMagics(canvasWidth) {
    for (let i = magics.length - 1; i >= 0; i--) {
        magics[i].update();
        if (magics[i].isOffScreen(canvasWidth)) {
            magics.splice(i, 1);
        }
    }
}

function drawMagics(ctx) {
    magics.forEach(m => m.draw(ctx));
}

// Export if needed
// export { shootMagic, updateMagics, drawMagics };
