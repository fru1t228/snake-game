const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [{ x: 10 * box, y: 10 * box }];
let food = {
  x: Math.floor(Math.random() * 20) * box,
  y: Math.floor(Math.random() * 20) * box
};
let dx = box, dy = 0;
let gameLoop = null;
let isGameOver = false;

document.addEventListener("keydown", (e) => {
  if (isGameOver) return;
  
  if (e.key === "ArrowLeft" && dx === 0) { dx = -box; dy = 0; }
  else if (e.key === "ArrowRight" && dx === 0) { dx = box; dy = 0; }
  else if (e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -box; }
  else if (e.key === "ArrowDown" && dy === 0) { dx = 0; dy = box; }
});

function move(dir) {
  if (isGameOver) return;
  
  if (dir === "left" && dx === 0) { dx = -box; dy = 0; }
  else if (dir === "right" && dx === 0) { dx = box; dy = 0; }
  else if (dir === "up" && dy === 0) { dx = 0; dy = -box; }
  else if (dir === "down" && dy === 0) { dx = 0; dy = box; }
}

function draw() {
  if (isGameOver) return;
  
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, 400, 400);

  for (let s of snake) {
    ctx.fillStyle = "#0f0";
    ctx.fillRect(s.x, s.y, box, box);
  }

  ctx.fillStyle = "#f00";
  ctx.fillRect(food.x, food.y, box, box);

  let head = { x: snake[0].x + dx, y: snake[0].y + dy };

  if (head.x === food.x && head.y === food.y) {
    food = {
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box
    };
  } else {
    snake.pop();
  }

  if (
    head.x < 0 || head.x >= 400 ||
    head.y < 0 || head.y >= 400 ||
    snake.some(s => s.x === head.x && s.y === head.y)
  ) {
    showGameOver();
    return;
  }

  snake.unshift(head);
}

function showGameOver() {
  isGameOver = true;
  clearInterval(gameLoop);
  
  ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
  ctx.fillRect(0, 0, 400, 400);
  
  ctx.fillStyle = "#fff";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", 200, 180);
  
  ctx.font = "20px Arial";
  ctx.fillText("Нажмите для перезапуска", 200, 220);
  
  canvas.addEventListener("click", restartGame, { once: true });
}

function restartGame() {
  isGameOver = false;
  snake = [{ x: 10 * box, y: 10 * box }];
  food = {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box
  };
  dx = box;
  dy = 0;
  
  if (gameLoop) {
    clearInterval(gameLoop);
  }
  gameLoop = setInterval(draw, 300);
}

// Запускаем игру
restartGame();
