// UI.js

let playerHP = 100;
let playerMaxHP = 100;
let playerMana = 100;
let playerMaxMana = 100;

function drawUI(ctx) {
    // Draw HP Bar
    ctx.fillStyle = 'black';
    ctx.fillRect(20, 20, 204, 24); // Background frame
    ctx.fillStyle = 'red';
    ctx.fillRect(22, 22, (playerHP / playerMaxHP) * 200, 20); // HP fill

    // Draw Mana Bar
    ctx.fillStyle = 'black';
    ctx.fillRect(20, 50, 204, 24); // Background frame
    ctx.fillStyle = 'blue';
    ctx.fillRect(22, 52, (playerMana / playerMaxMana) * 200, 20); // Mana fill
}

function takeDamage(amount) {
    playerHP -= amount;
    if (playerHP < 0) {
        playerHP = 0;
    }
}

function useMana(amount) {
    if (playerMana >= amount) {
        playerMana -= amount;
        return true;
    }
    return false;
}

function regenerateMana() {
    if (playerMana < playerMaxMana) {
        playerMana += 0.5; // Slow regen
    }
}

// Export if needed
// export { drawUI, takeDamage, useMana, regenerateMana };
