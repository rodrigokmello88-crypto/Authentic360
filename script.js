const canvas = document.getElementById('mockupCanvas');
const ctx = canvas.getContext('2d');
const modelsList = document.getElementById('modelsList');
const swatches = document.getElementById('swatches');
const uploadInput = document.getElementById('uploadInput');
const downloadBtn = document.getElementById('downloadBtn');
const recordBtn = document.getElementById('recordBtn');

const modelFiles = [
  'copos/caneca_png.png',
  'copos/caneca_slim_png.png',
  'copos/ecologico.png',
  'copos/espumante_png.png',
  'copos/squeeze.png',
  'copos/taca_gin.png',
  'copos/twister.png',
  'copos/xicara.png'
];

const colors = [
  '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ff00ff', '#ff8800'
];

let images = [];
let currentModelIndex = 0;
let currentTint = null;
let uploadedArt = null;
let loadedCount = 0;

modelFiles.forEach((file, idx) => {
  const img = new Image();
  img.src = file;
  img.onload = () => {
    images[idx] = img;
    loadedCount++;
    if (loadedCount === modelFiles.length) {
      buildModelButtons();
      buildSwatches();
      draw();
    }
  };
  img.onerror = (e) => console.error('Erro ao carregar imagem:', file, e);
});

function buildModelButtons() {
  modelsList.innerHTML = '';
  modelFiles.forEach((file, idx) => {
    const btn = document.createElement('button');
    btn.className = 'model-btn';
    // extrai nome legível
    const name = file.split('/').pop().replace('.png', '').replace(/_/g, ' ');
    btn.innerText = name.charAt(0).toUpperCase() + name.slice(1);
    btn.onclick = () => {
      currentModelIndex = idx;
      draw();
    };
    modelsList.appendChild(btn);
  });
}

function buildSwatches() {
  swatches.innerHTML = '';
  colors.forEach(c => {
    const sw = document.createElement('div');
    sw.className = 'color-swatch';
    sw.style.background = c;
    sw.dataset.color = c;
    sw.onclick = () => {
      currentTint = c;
      draw();
    };
    swatches.appendChild(sw);
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const img = images[currentModelIndex];
  if (!img) return;

  // reduzir 50% para todos menos talvez xícara
  let mult = 0.5;
  // se quiser manter xícara no tamanho original:
  const file = modelFiles[currentModelIndex].toLowerCase();
  if (file.includes('xicara')) {
    mult = 1.0;
  }

  const maxW = canvas.width * 0.6;
  const maxH = canvas.height * 0.65;
  const baseScale = Math.min(maxW / img.width, maxH / img.height);
  const scale = baseScale * mult;

  const dw = img.width * scale;
  const dh = img.height * scale;
  const dx = (canvas.width - dw) / 2;
  const dy = (canvas.height - dh) / 2;

  // desenha o copo
  ctx.drawImage(img, dx, dy, dw, dh);

  // aplica cor (pintura real, não sombra)
  if (currentTint) {
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = currentTint;
    ctx.fillRect(dx, dy, dw, dh);
    ctx.restore();
  }

  // desenha arte enviada
  if (uploadedArt) {
    const artW = dw * 0.6;
    const artH = uploadedArt.height * (artW / uploadedArt.width);
    const ax = dx + (dw - artW) / 2;
    const ay = dy + (dh - artH) / 2;
    ctx.drawImage(uploadedArt, ax, ay, artW, artH);
  }
}

uploadInput.onchange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = () => {
    uploadedArt = img;
    draw();
  };
};

downloadBtn.onclick = () => {
  const link = document.createElement('a');
  link.download = 'mockup_' + modelFiles[currentModelIndex].split('/').pop();
  link.href = canvas.toDataURL('image/png');
  link.click();
};

recordBtn.onclick = () => {
  alert('Vídeo 360° ainda será ativado em versão futura.');
};
