const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

// Создаем overlay canvas для Game Over экрана
const overlayCanvas = document.createElement('canvas');
overlayCanvas.width = 400;
overlayCanvas.height = 400;
overlayCanvas.style.position = 'absolute';
overlayCanvas.style.top = canvas.offsetTop + 'px';
overlayCanvas.style.left = canvas.offsetLeft + 'px';
overlayCanvas.style.pointerEvents = 'none';
document.getElementById('game-container').appendChild(overlayCanvas);
const overlayCtx = overlayCanvas.getContext("2d");

const box = 20;
let snake = [{ x: 10 * box, y: 10 * box }];
let food = {
  x: Math.floor(Math.random() * 20) * box,
  y: Math.floor(Math.random() * 20) * box
};
let dx = box, dy = 0;
let gameLoop = null;
let isGameOver = false;
let score = 0;
let foodPulse = 0;
let lastTime = 0;
const gameSpeed = 150; // Скорость игры в миллисекундах

// Цвета для градиента змейки
const snakeColors = [
  '#00ff00', // Зеленый
  '#00cc00', // Темно-зеленый
  '#009900'  // Еще темнее зеленый
];

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

function draw(timestamp) {
  if (isGameOver) return;
  
  // Используем requestAnimationFrame для плавного движения
  if (!lastTime) lastTime = timestamp;
  const deltaTime = timestamp - lastTime;
  
  if (deltaTime < gameSpeed) {
    requestAnimationFrame(draw);
    return;
  }
  
  lastTime = timestamp;
  
  // Очищаем canvas
  ctx.clearRect(0, 0, 400, 400);
  
  // Рисуем фон
  ctx.fillStyle = "#0f0f1a";
  ctx.fillRect(0, 0, 400, 400);

  // Рисуем сетку
  ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 400; i += box) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 400);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(400, i);
    ctx.stroke();
  }

  // Рисуем змейку с градиентом
  snake.forEach((s, index) => {
    const colorIndex = index % snakeColors.length;
    ctx.fillStyle = snakeColors[colorIndex];
    ctx.fillRect(s.x, s.y, box, box);
    
    // Добавляем свечение
    ctx.shadowColor = snakeColors[colorIndex];
    ctx.shadowBlur = 5;
    ctx.fillRect(s.x, s.y, box, box);
    ctx.shadowBlur = 0;
  });

  // Рисуем еду с пульсацией
  foodPulse += 0.1;
  const pulseSize = Math.sin(foodPulse) * 2 + 2;
  ctx.fillStyle = "#ff0000";
  ctx.beginPath();
  ctx.arc(food.x + box/2, food.y + box/2, box/2 + pulseSize, 0, Math.PI * 2);
  ctx.fill();
  
  // Добавляем свечение для еды
  ctx.shadowColor = "#ff0000";
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.shadowBlur = 0;

  let head = { x: snake[0].x + dx, y: snake[0].y + dy };

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreElement.textContent = `Очки: ${score}`;
    // Не удаляем хвост при поедании еды
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
  requestAnimationFrame(draw);
}

function showGameOver() {
  isGameOver = true;
  clearInterval(gameLoop);
  
  // Очищаем overlay canvas
  overlayCtx.clearRect(0, 0, 400, 400);
  
  // Создаем эффект затемнения на overlay
  overlayCtx.fillStyle = "rgba(0, 0, 0, 0.75)";
  overlayCtx.fillRect(0, 0, 400, 400);
  
  // Рисуем текст Game Over с эффектом свечения на overlay
  overlayCtx.fillStyle = "#fff";
  overlayCtx.font = "bold 40px Arial";
  overlayCtx.textAlign = "center";
  overlayCtx.shadowColor = "#ff0000";
  overlayCtx.shadowBlur = 10;
  overlayCtx.fillText("Game Over", 200, 180);
  overlayCtx.shadowBlur = 0;
  
  overlayCtx.font = "20px Arial";
  overlayCtx.fillText(`Ваш счет: ${score}`, 200, 220);
  overlayCtx.fillText("Нажмите для перезапуска", 200, 250);
  
  // Включаем обработку кликов на overlay
  overlayCanvas.style.pointerEvents = 'auto';
  overlayCanvas.addEventListener("click", restartGame, { once: true });
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
  score = 0;
  scoreElement.textContent = "Очки: 0";
  lastTime = 0;
  
  // Очищаем overlay
  overlayCtx.clearRect(0, 0, 400, 400);
  overlayCanvas.style.pointerEvents = 'none';
  
  if (gameLoop) {
    clearInterval(gameLoop);
  }
  requestAnimationFrame(draw);
}

// Запускаем игру
restartGame();
