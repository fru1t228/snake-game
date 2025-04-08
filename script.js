const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;
let snake = [{ x: 10 * box, y: 10 * box }];
let food = {
  x: Math.floor(Math.random() * 20) * box,
  y: Math.floor(Math.random() * 20) * box
};
let dx = box, dy = 0;

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && dx === 0) { dx = -box; dy = 0; }
  else if (e.key === "ArrowRight" && dx === 0) { dx = box; dy = 0; }
  else if (e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -box; }
  else if (e.key === "ArrowDown" && dy === 0) { dx = 0; dy = box; }
});

function move(dir) {
  if (dir === "left" && dx === 0) { dx = -box; dy = 0; }
  else if (dir === "right" && dx === 0) { dx = box; dy = 0; }
  else if (dir === "up" && dy === 0) { dx = 0; dy = -box; }
  else if (dir === "down" && dy === 0) { dx = 0; dy = box; }
}

function draw() {
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
    alert("Game Over");
    document.location.reload();
  }

  snake.unshift(head);
}

// ⏱ УМЕНЬШИЛ СКОРОСТЬ: 300 мс между кадрами
setInterval(draw, 300);
