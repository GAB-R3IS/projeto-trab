const btn = document.getElementById('temaBtn');

btn.addEventListener('click', function () {
  const isLight = document.body.classList.toggle('claro');
  btn.setAttribute('data-light', isLight ? 'true' : 'false');
  updateCubeColors();
});

const canvas = document.getElementById('cubes-canvas');
const ctx = canvas.getContext('2d');

let W, H;
let mouse = { x: -9999, y: -9999 };
let targetMouse = { x: -9999, y: -9999 };

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

window.addEventListener('mousemove', function (e) {
  targetMouse.x = e.clientX;
  targetMouse.y = e.clientY;
});

let cubeColorStroke = 'rgba(220,38,38,0.18)';
let cubeColorFill = 'rgba(220,38,38,0.04)';
let cubeColorBright = 'rgba(220,38,38,0.55)';

function updateCubeColors() {
  if (document.body.classList.contains('claro')) {
    cubeColorStroke = 'rgba(185,28,28,0.15)';
    cubeColorFill = 'rgba(185,28,28,0.03)';
    cubeColorBright = 'rgba(185,28,28,0.5)';
  } else {
    cubeColorStroke = 'rgba(220,38,38,0.18)';
    cubeColorFill = 'rgba(220,38,38,0.04)';
    cubeColorBright = 'rgba(220,38,38,0.55)';
  }
}

const CUBE_SIZE = 54;
const DEPTH = 24;

function drawIsoCube(x, y, size, depth, alpha, bright) {
  const hw = size / 2;
  const hd = depth / 2;

  ctx.save();
  ctx.globalAlpha = alpha;

  ctx.beginPath();
  ctx.moveTo(x, y - hd);
  ctx.lineTo(x + hw, y);
  ctx.lineTo(x, y + hd);
  ctx.lineTo(x - hw, y);
  ctx.closePath();
  ctx.fillStyle = bright ? cubeColorBright : cubeColorFill;
  ctx.fill();
  ctx.strokeStyle = bright ? cubeColorBright : cubeColorStroke;
  ctx.lineWidth = bright ? 1.5 : 0.7;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x + hw, y);
  ctx.lineTo(x + hw, y + size * 0.3);
  ctx.lineTo(x, y + hd + size * 0.3);
  ctx.lineTo(x, y + hd);
  ctx.closePath();
  ctx.fillStyle = bright ? cubeColorBright : 'rgba(0,0,0,0.18)';
  ctx.fill();
  ctx.strokeStyle = bright ? cubeColorBright : cubeColorStroke;
  ctx.lineWidth = bright ? 1.5 : 0.7;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x - hw, y);
  ctx.lineTo(x - hw, y + size * 0.3);
  ctx.lineTo(x, y + hd + size * 0.3);
  ctx.lineTo(x, y + hd);
  ctx.closePath();
  ctx.fillStyle = bright ? cubeColorBright : 'rgba(0,0,0,0.10)';
  ctx.fill();
  ctx.strokeStyle = bright ? cubeColorBright : cubeColorStroke;
  ctx.lineWidth = bright ? 1.5 : 0.7;
  ctx.stroke();

  ctx.restore();
}

let time = 0;

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, W, H);

  mouse.x = lerp(mouse.x, targetMouse.x, 0.22);
  mouse.y = lerp(mouse.y, targetMouse.y, 0.22);

  time += 0.008;

  const cols = Math.ceil(W / CUBE_SIZE) + 3;
  const rows = Math.ceil(H / (CUBE_SIZE * 0.55)) + 3;
  const startX = -CUBE_SIZE;
  const startY = -CUBE_SIZE * 0.55;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = startX + col * CUBE_SIZE + (row % 2 === 1 ? CUBE_SIZE / 2 : 0);
      const cy = startY + row * (CUBE_SIZE * 0.55);

      const dx = mouse.x - cx;
      const dy = mouse.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 200;
      const proximity = Math.max(0, 1 - dist / maxDist);

      const wave = Math.sin(time + col * 0.5 + row * 0.4) * 0.5 + 0.5;
      const alpha = 0.12 + wave * 0.08 + proximity * 0.45;
      const bright = proximity > 0.5;

      drawIsoCube(cx, cy, CUBE_SIZE, DEPTH, alpha, bright);
    }
  }
}

animate();

const glitchFonts = [
  "'Courier New', monospace",
  "'Georgia', serif",
  "'Impact', sans-serif",
  "'Space Mono', monospace",
  "'Times New Roman', serif",
];

const glitchColors = ['#ffffff', '#dc2626', '#000000', '#ef4444', '#ffffff'];

const glitchLetters = document.querySelectorAll('.gl');
const originalFont = "'Syne', sans-serif";

function runGlitch() {
  const count = Math.floor(Math.random() * 3) + 1;
  const picks = [];

  while (picks.length < count) {
    const idx = Math.floor(Math.random() * glitchLetters.length);
    if (!picks.includes(idx)) picks.push(idx);
  }

  picks.forEach(function (idx) {
    const el = glitchLetters[idx];
    const inner = el.querySelector('.gl-inner');
    const originalColor = inner.style.color || '';

    const flickers = Math.floor(Math.random() * 3) + 2;
    let done = 0;

    function flicker() {
      setTimeout(function () {
        inner.style.fontFamily = glitchFonts[Math.floor(Math.random() * glitchFonts.length)];
        inner.style.color = glitchColors[Math.floor(Math.random() * glitchColors.length)];
        done++;
        if (done < flickers) {
          flicker();
        } else {
          setTimeout(function () {
            inner.style.fontFamily = originalFont;
            inner.style.color = originalColor;
          }, 60 + Math.random() * 100);
        }
      }, 50 + Math.random() * 70);
    }

    flicker();
  });

  const next = 1800 + Math.random() * 3200;
  setTimeout(runGlitch, next);
}

setTimeout(runGlitch, 2000);

const sections = document.querySelectorAll('section');

const observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

sections.forEach(function (section) {
  observer.observe(section);
});
