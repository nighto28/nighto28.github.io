// script.js

const player = document.getElementById("player");
const platforms = Array.from(document.getElementsByClassName("platform"));
const gameContainer = document.getElementById("game-container");
const flag = document.getElementById("flag");
const spike = document.getElementById("spike");

let playerX = 50;
let playerY = 430;
let playerVelocityX = 0;
let playerVelocityY = 0;
let isGrounded = false;

// Game physics constants
const gravity = 0.6;
const jumpStrength = 15;
const moveSpeed = 0.5;
const maxSpeed = 5;
const friction = 0.9;
const landingThreshold = 5; // Sensitivity threshold for landing

// Track which keys are currently pressed
const keys = {};

// Event listeners for key press and release
document.addEventListener("keydown", (event) => {
  keys[event.key] = true;

  // Jump if space is pressed and player is grounded
  if (event.key === "ArrowUp" && isGrounded) {
    playerVelocityY = -jumpStrength;
    isGrounded = false;
  }
});

document.addEventListener("keyup", (event) => {
  keys[event.key] = false;
});

// Game loop
function gameLoop() {
  // Check if arrow keys are pressed and apply horizontal velocity
  if (keys["ArrowLeft"]) {
    playerVelocityX = Math.max(playerVelocityX - moveSpeed, -maxSpeed);
  }
  if (keys["ArrowRight"]) {
    playerVelocityX = Math.min(playerVelocityX + moveSpeed, maxSpeed);
  }

  // Apply gravity only if the player is not grounded
  if (!isGrounded) {
    playerVelocityY += gravity;
  }

  // Apply friction to horizontal movement when no keys are pressed
  if (!keys["ArrowLeft"] && !keys["ArrowRight"]) {
    playerVelocityX *= friction;
  }


  // Update position with calculated velocities
  playerY += playerVelocityY;
  playerX += playerVelocityX;

   const flagRect = flag.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (
        playerRect.right > flagRect.left &&
        playerRect.left < flagRect.right &&
        playerRect.bottom > flagRect.top &&
        playerRect.top < flagRect.bottom
    ) {
        // Player has reached the flag
        window.location.href = '';
    }

spike.style.left = `${parseInt(spike.getAttribute("data-x")) || 200}px`;
spike.style.top = `${parseInt(spike.getAttribute("data-y")) || 300}px`;

function isPointInTriangle(px, py, ax, ay, bx, by, cx, cy) {
    const areaOrig = Math.abs((bx - ax) * (cy - ay) - (cx - ax) * (by - ay));
    const area1 = Math.abs((ax - px) * (by - py) - (bx - px) * (ay - py));
    const area2 = Math.abs((bx - px) * (cy - py) - (cx - px) * (by - py));
    const area3 = Math.abs((cx - px) * (ay - py) - (ax - px) * (cy - py));
    return areaOrig === area1 + area2 + area3;
}

   // Spike's triangular vertices based on its position and size
    const spikeRect = spike.getBoundingClientRect();
    const ax = spikeRect.left + 30; // Peak of the triangle
    const ay = spikeRect.top;
    const bx = spikeRect.left;
    const by = spikeRect.bottom;
    const cx = spikeRect.right;
    const cy = spikeRect.bottom;

    // Check if the player's bottom center point is within the triangle
    const playerBottomCenterX = playerRect.left + playerRect.width / 2;
    const playerBottomCenterY = playerRect.bottom;
    const playerInTriangle = isPointInTriangle(playerBottomCenterX, playerBottomCenterY, ax, ay, bx, by, cx, cy);

    // Spike collision: reset player if in triangle
    if (playerInTriangle) {
        window.location.href = 'lvl2.html';
    }

  // Detect platform collisions to land on platforms
  isGrounded = false; // Reset grounded status for each frame
platforms.forEach(platform => {
    const platformRect = platform.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    // Detect collision from above (landing on platform)
    if (
      playerRect.right > platformRect.left &&
      playerRect.left < platformRect.right &&
      Math.abs(playerRect.bottom - platformRect.top) <= landingThreshold && // Near enough to the platform top
      playerVelocityY >= 0 // Moving downwards or stationary
    ) {
      isGrounded = true; // Set grounded
      playerY = platform.offsetTop - playerRect.height; // Snap to platform top
      playerVelocityY = 0; // Stop vertical movement
    }

    // Detect collision from below (hitting the bottom of the platform)
    if (
      playerRect.right > platformRect.left &&
      playerRect.left < platformRect.right &&
      playerRect.top < platformRect.bottom &&
      playerRect.bottom > platformRect.bottom &&
      playerVelocityY < 0 // Only detect when moving upwards
    ) {
      playerY = Math.min(playerY, platformRect.bottom + 2); // Slightly below platform
      playerVelocityY *= -0.2; // Gentle downward stop
    }

    // Detect collision with the left side of the platform
    if (
      playerRect.bottom > platformRect.top && // Within vertical bounds
      playerRect.top < platformRect.bottom &&
      playerRect.right > platformRect.left && // Overlapping platform's left side
      Math.abs(playerRect.right - platformRect.left) <= 10 && // Within buffer zone
      playerVelocityX > 0 // Moving right
    ) {
      playerX -= 3; // Adjust position gradually
      playerVelocityX *= 0; // Reduce velocity to slow down
    }

    // Detect collision with the right side of the platform
    if (
      playerRect.bottom > platformRect.top && // Within vertical bounds
      playerRect.top < platformRect.bottom &&
      playerRect.left < platformRect.right && // Overlapping platform's right side
      Math.abs(playerRect.left - platformRect.right) <= 10 && // Within buffer zone
      playerVelocityX < 0 // Moving left
    ) {
      playerX += 3; // Adjust position gradually
      playerVelocityX *= 0; // Reduce velocity to slow down
    }
});


  // Prevent falling through the bottom of the game container
  if (playerY + player.clientHeight >= gameContainer.clientHeight) {
    isGrounded = true;
    playerY = gameContainer.clientHeight - player.clientHeight;
    playerVelocityY = 0;
  }

  // Keep player within horizontal bounds of the game container
  if (playerX < 0) {
    playerX = 0;
    playerVelocityX = 0;
  } else if (playerX + player.clientWidth > gameContainer.clientWidth) {
    playerX = gameContainer.clientWidth - player.clientWidth;
    playerVelocityX = 0;
  }

  // Update player position
  player.style.left = `${playerX}px`;
  player.style.top = `${playerY}px`;

  // Loop to next frame
  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
