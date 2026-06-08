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

loadSpritesheet(() => {
  initLevel();
  console.log('bricks:', state.bricks);
});
