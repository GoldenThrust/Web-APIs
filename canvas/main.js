import Background from "./script/background.js";
import Ball from "./script/ball.js";
import Block from "./script/block.js";
import { h, w, displayGameOver } from "./script/utils.js";

// Game variables
let lives = 1;
let score = 0;
let gameOver = false;

// Canvas Elements
const canvas = document.getElementById("canvas");
const bgCanvas = document.getElementById("bg");
const fgCanvas = document.getElementById("fg");

// Canvas contexts
const ctx = canvas.getContext("2d");
const bgCtx = bgCanvas.getContext("2d");
const fgCtx = fgCanvas.getContext("2d");

// Set canvas dimensions
const canvases = [
  { canvas, ctx },
  { canvas: bgCanvas, ctx: bgCtx },
  { canvas: fgCanvas, ctx: fgCtx },
];

canvases.forEach(({ canvas }) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Object instances
const background = new Background(bgCtx);
const ball = new Ball(ctx, w(0.2), h(0.1), 10);
const block = new Block(fgCtx, w() + 10, 10, 20);

// Game loop
function animate() {
  canvases.forEach(({ canvas, ctx }) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });

  // Display lives and score
  fgCtx.fillStyle = "springgreen";
  for (let i = 0; i < lives; i++) {
    fgCtx.fillRect(w(0.98) - i * 5, 2, 3, 10);
  }
  fgCtx.fillText(score, 10, 10);

  // Draw background and game objects
  background.drawGround();

  if (lives) {
    block.update(ball);
    block.draw();

    if (block.collidesWith(ball)) {
      ball.update(block.getTopY());
      score += Math.round(block.speed);
    } else {
      ball.update();
    }

    if (block.hitsBall(ball)) {
      lives--;
      block.pass = true;
    }
  } else {
    // Game over
    if (!gameOver) {
      displayGameOver(fgCtx, score);
      gameOver = true;
    }
  }

  requestAnimationFrame(animate);
}

// Event listeners
addEventListener("click", (e) => {
  if (ball.y > ball.floor) {
    ball.dy += 15;
  }
});

setInterval(() => {
  block.speed += Math.random();
}, 10000);

requestAnimationFrame(animate);
