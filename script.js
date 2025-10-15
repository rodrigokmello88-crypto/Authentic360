const models = [
  { name: 'Caneca', file: 'caneca_png.png', scale: 0.42 },
  { name: 'Caneca Slim', file: 'caneca_slim_png.png', scale: 0.42 },
  { name: 'Ecológico', file: 'ecologico.png', scale: 0.40 },
  { name: 'Espumante', file: 'espumante.png', scale: 0.29 }, // 🔽 diminuído
  { name: 'Squeeze', file: 'squeeze.png', scale: 0.33 },
  { name: 'Taça Gin', file: 'taca_gin.png', scale: 0.31 },
  { name: 'Twister', file: 'twister.png', scale: 0.40 },
  { name: 'Xícara', file: 'xicara.png', scale: 0.44 }
];

const colors = ['#ffffff', '#d9d9d9', '#aaaaaa', '#555555', '#000000', '#007bff', '#ff0055', '#00ffcc'];

const modelsList = document.getElementById('modelsList');
const swatches = document.getElementById('swatches');
const canvas = document.getElementById('mockupCanvas');
const ctx = canvas.getContext('2d');

let currentModel = null;
let currentScale = 0.4;
let rotation = 0;

// === Carregar modelos ===
models.forEach(model => {
  const btn = document.createElement('button');
  btn.className = 'model-btn';
  btn.textContent = model.name;
  btn.onclick = () => loadModel(model);
  modelsList.appendChild(btn);
});

// === Paleta de cores ===
colors.forEach(color => {
  const div = document.createElement('div');
  div.className = 'color-swatch';
  div.style.background = color;
  div.onclick = () => changeColor(color);
  swatches.appendChild(div);
});

function loadModel(model) {
  const img = new Image();
  img.src = `copos/${model.file}`;
  img.onload = () => {
    currentModel = img;
    currentScale = model.scale;
    drawModel();
  };
}

function drawModel(colorOverlay = null) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!currentModel) return;

  const w = currentModel.width * currentScale;
  const h = currentModel.height * currentScale;

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.drawImage(currentModel, -w / 2, -h / 2, w, h);

  if (colorOverlay) {
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = colorOverlay;
    ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}

function changeColor(color) {
  drawModel(color);
}

// === Gravação 360° (8s) ===
document.getElementById('generateVideo').addEventListener('click', async () => {
  if (!currentModel) return alert('Selecione um modelo primeiro!');
  
  const chunks = [];
  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
  recorder.ondataavailable = e => chunks.push(e.data);
  
  recorder.onstop = async () => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${Date.now()}_authentic360.webm`;
    a.click();
  };
  
  recorder.start();

  let frame = 0;
  const totalFrames = 8 * 30;
  const interval = setInterval(() => {
    rotation += 3;
    drawModel();
    frame++;
    if (frame >= totalFrames) {
      clearInterval(interval);
      recorder.stop();
    }
  }, 1000 / 30);
});
