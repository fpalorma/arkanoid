const CANVAS_W = 480;
const CANVAS_H = 640;

const BRICK_W = 32;
const BRICK_H = 16;
const BRICK_COLS = 13;
const BRICK_ROWS = 7;
const BRICK_COLORS = ['red', 'cyan', 'green', 'magenta', 'yellow', 'hotpink', 'gray'];
const BRICK_OFFSET_X = (CANVAS_W - BRICK_COLS * BRICK_W) / 2;
const BRICK_OFFSET_Y = 60;

const BALL_SPEED = 4;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_W;
canvas.height = CANVAS_H;

const state = {
  screen: 'playing',
  score: 0,
  lives: 3,
  ball: { x: 0, y: 0, vx: 0, vy: 0, w: 16, h: 16 },
  paddle: { x: 0, y: 0, w: 162, h: 14 },
  bricks: [],
  explosions: [],
};

function initLevel() {
  state.screen = 'playing';
  state.score = 0;
  state.lives = 3;

  state.paddle.x = (CANVAS_W - state.paddle.w) / 2;
  state.paddle.y = CANVAS_H - 40;

  state.ball.x = CANVAS_W / 2 - state.ball.w / 2;
  state.ball.y = state.paddle.y - state.ball.h - 4;
  state.ball.vx = BALL_SPEED * (Math.random() < 0.5 ? 1 : -1);
  state.ball.vy = -BALL_SPEED;

  state.bricks = [];
  for (let row = 0; row < BRICK_ROWS; row++) {
    const color = BRICK_COLORS[row % BRICK_COLORS.length];
    for (let col = 0; col < BRICK_COLS; col++) {
      state.bricks.push({
        x: BRICK_OFFSET_X + col * BRICK_W,
        y: BRICK_OFFSET_Y + row * BRICK_H,
        w: BRICK_W,
        h: BRICK_H,
        color,
        alive: true,
      });
    }
  }

  state.explosions = [];
}

const keys = {};

window.addEventListener('keydown', e => { keys[e.key] = true; });
window.addEventListener('keyup',  e => { keys[e.key] = false; });

canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  state.paddle.x = Math.max(0, Math.min(CANVAS_W - state.paddle.w, mouseX - state.paddle.w / 2));
});

const PADDLE_SPEED = 6;

function updatePaddle() {
  if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
    state.paddle.x = Math.max(0, state.paddle.x - PADDLE_SPEED);
  }
  if (keys['ArrowRight'] || keys['d'] || keys['D']) {
    state.paddle.x = Math.min(CANVAS_W - state.paddle.w, state.paddle.x + PADDLE_SPEED);
  }
}

function resetBall() {
  state.ball.x = CANVAS_W / 2 - state.ball.w / 2;
  state.ball.y = state.paddle.y - state.ball.h - 4;
  state.ball.vx = BALL_SPEED * (Math.random() < 0.5 ? 1 : -1);
  state.ball.vy = -BALL_SPEED;
}

function update() {
  if (state.screen !== 'playing') return;

  updatePaddle();

  state.ball.x += state.ball.vx;
  state.ball.y += state.ball.vy;

  // rebote pared izquierda / derecha
  if (state.ball.x <= 0) {
    state.ball.x = 0;
    state.ball.vx = Math.abs(state.ball.vx);
  } else if (state.ball.x + state.ball.w >= CANVAS_W) {
    state.ball.x = CANVAS_W - state.ball.w;
    state.ball.vx = -Math.abs(state.ball.vx);
  }

  // rebote techo
  if (state.ball.y <= 0) {
    state.ball.y = 0;
    state.ball.vy = Math.abs(state.ball.vy);
  }

  // pelota sale por abajo
  if (state.ball.y + state.ball.h >= CANVAS_H) {
    state.lives -= 1;
    if (state.lives <= 0) {
      state.lives = 0;
      state.screen = 'gameover';
    } else {
      resetBall();
    }
  }
}

function drawHUD() {
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 16px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`Score: ${state.score}`, 10, 20);
  ctx.textAlign = 'right';
  ctx.fillText(`Lives: ${state.lives}`, CANVAS_W - 10, 20);
}

function draw() {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  for (const brick of state.bricks) {
    if (brick.alive) {
      drawSprite(ctx, `block_${brick.color}`, brick.x, brick.y, brick.w, brick.h);
    }
  }

  drawSprite(ctx, 'paddle', state.paddle.x, state.paddle.y, state.paddle.w, state.paddle.h);
  drawSprite(ctx, 'ball', state.ball.x, state.ball.y, state.ball.w, state.ball.h);

  drawHUD();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loadSpritesheet(() => {
  initLevel();
  requestAnimationFrame(loop);
});
