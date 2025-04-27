const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 200;

// Load Images
const dinoImage = new Image();
dinoImage.src = "./dino.png"; // Make sure this file exists in your project folder

const bushImage = new Image();
bushImage.src = "./cactus.png"; // Make sure this file exists in your project folder


// Dino Object
let dino = {
  x: 50,
  y: 150,
  width: 20,
  height: 40,
  velocityY: 0,
  gravity: 0.5,
  jumpStrength: -10,
  jumping: false,
};

// Ground Object
let ground = {
  width: canvas.width,
  height: 20,
  x: 0,
  y: 180,
};

// Obstacles
let obstacles = [];
let obstacleSpeed = 3;

// Game Variables
let score = 0;
let gameOver = false;

// Jump Functionality
function jump() {
  if (!dino.jumping) {
    dino.velocityY = dino.jumpStrength;
    dino.jumping = true;
  }
}

// Main Game Logic
function runGame() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dino Physics
  dino.y += dino.velocityY;
  if (dino.y + dino.height >= ground.y) {
    dino.y = ground.y - dino.height;
    dino.velocityY = 0;
    dino.jumping = false;
  } else {
    dino.velocityY += dino.gravity;
  }

  // Obstacles Movement
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].x -= obstacleSpeed;

    // Remove off-screen obstacles
    if (obstacles[i].x + obstacles[i].width < 0) {
      obstacles.splice(i, 1);
      score++;
      i--;
    }
  }

  // Randomly Add New Obstacles
  if (Math.random() < 0.01) {
    obstacles.push({
      x: canvas.width,
      y: ground.y - 20,
      width: 20,
      height: 20,
    });
  }

  // Collision Detection
  for (let obs of obstacles) {
    if (
      dino.x < obs.x + obs.width &&
      dino.x + dino.width > obs.x &&
      dino.y < obs.y + obs.height &&
      dino.y + dino.height > obs.y
    ) {
      gameOver = true;
    }
  }

  // Draw Ground
  ctx.fillStyle = "#654321"; // brown ground
  ctx.fillRect(ground.x, ground.y, ground.width, ground.height);

  // Draw Dino
  ctx.drawImage(dinoImage, dino.x, dino.y, dino.width, dino.height);

  // Draw Obstacles (Bushes)
  for (let obs of obstacles) {
    ctx.drawImage(bushImage, obs.x, obs.y, obs.width, obs.height);
  }

  // Draw Score
  ctx.fillStyle = "green";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 20);

  // If Game Over
  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over! Score: " + score, canvas.width / 2 - 150, canvas.height / 2);
  }
}

// Main Game Loop
function gameLoop() {
  if (!gameOver) {
    runGame();
    requestAnimationFrame(gameLoop);
  } else {
    runGame(); // draw final frame showing "Game Over"
  }
}

// Start the Game
gameLoop();

// Event Listener for Jump
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    jump();
  }
});
