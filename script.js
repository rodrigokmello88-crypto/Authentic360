const models = [
  { name: 'Caneca', file: 'caneca_png.png' },
  { name: 'Caneca Slim', file: 'caneca_slim_png.png' },
  { name: 'Ecológico', file: 'ecologico.png' },
  { name: 'Espumante', file: 'espumante.png' },
  { name: 'Squeeze', file: 'squeeze.png' },
  { name: 'Taça Gin', file: 'taca_gin.png' },
  { name: 'Twister', file: 'twister.png' },
  { name: 'Xícara', file: 'xicara.png' }
];

const colors = ['#ffffff', '#d9d9d9', '#aaaaaa', '#555555', '#000000', '#007bff', '#ff0055', '#00ffcc'];

const modelsList = document.getElementById('modelsList');
const swatches = document.getElementById('swatches');
const canvas = document.getElementById('mockupCanvas');
const ctx = canvas.getContext('2d');

let currentModel = null;
let rotation = 0;
let rotationInterval = null;

// Carregar modelos
models.forEach(model => {
  const btn = document.createElement('button');
  btn.className = 'model-btn';
  btn.textContent = model.name;
  btn.onclick = () => loadModel(model.file);
  modelsList.appendChild(btn);
});

// Carregar botões de cor
colors.forEach(color => {
  const div = document.createElement('div');
  div.className = 'color-swatch';
  div.style.background = color;
  div.onclick = () => changeColor(color);
  swatches.appendChild(div);
});

function loadModel(file) {
  const img = new Image();
  img.src = `copos/${file}`;
  img.onload = () => {
    currentModel = img;
    drawModel();
  };
}

function drawModel(colorOverlay = null) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!currentModel) return;

  const scale = 0.4; // ⬅️ reduzido para 40% do tamanho original
  const w = currentModel.width * scale;
  const h = currentModel.height * scale;

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(rotation * Math.PI / 180);
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

// Geração de vídeo 360° (8 segundos)
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
  rotationInterval = setInterval(() => {
    rotation += 4;
    drawModel();
    frame++;
    if (frame >= 240) { // 8s * 30fps
      clearInterval(rotationInterval);
      recorder.stop();
    }
  }, 1000 / 30);
});
