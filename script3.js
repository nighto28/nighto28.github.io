// script.js

const player = document.getElementById("player");
const platforms = Array.from(document.getElementsByClassName("platform"));
const spikes = Array.from(document.getElementsByClassName("spike"));
const gameContainer = document.getElementById("game-container");
const flag = document.getElementById("flag");

let playerX = 530;
let playerY = 40;
let playerVelocityX = 0;
let playerVelocityY = 0;
let isGrounded = false;

// Game physics constants
const gravity = 0.6;
const jumpStrength = 15;
const moveSpeed = 0.5;
const maxSpeed = 5;
const friction = 0.9;
const landingThreshold = 6; // Sensitivity threshold for landing

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

// Helper function for collision detection
function isColliding(rect1, rect2) {
  return (
    rect1.right > rect2.left &&
    rect1.left < rect2.right &&
    rect1.bottom > rect2.top &&
    rect1.top < rect2.bottom
  );
}

// Function to reset player position after hitting a spike
function resetPlayerPosition() {
  playerX = 530; // Starting X position
  playerY = 40;  // Starting Y position
  playerVelocityX = 0;
  playerVelocityY = 0;
}

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
  });

  // Spike collision detection
  spikes.forEach(spike => {
    const spikeRect = spike.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (isColliding(playerRect, spikeRect)) {
      resetPlayerPosition();
      return; // Exit to prevent further movement
    }
  });

  // Check for flag collision
  const flagRect = flag.getBoundingClientRect();
  const playerRect = player.getBoundingClientRect();
  if (isColliding(playerRect, flagRect)) {
    // Player has reached the flag
    window.location.href = 'lvl4.html'
    levelComplete();
  }

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
