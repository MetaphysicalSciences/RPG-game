// respawn.js

function respawnPlayer(player) {
    player.x = player.startX; // Or set a safe respawn point
    player.y = player.startY;
    playerHP = playerMaxHP;   // Reset HP
    playerMana = playerMaxMana; // Reset Mana
}
