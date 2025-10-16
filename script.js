const canvas = document.getElementById('mockupCanvas');
const ctx = canvas.getContext('2d');
let currentModelIndex = 0;
let currentTint = null;
let uploadedArt = null;

const modelFiles = [
  'copos/caneca_png.png',
  'copos/caneca_slim_png.png',
  'copos/ecologico.png',
  'copos/espumante.png',
  'copos/squeeze.png',
  'copos/taca_gin.png',
  'copos/twister.png',
  'copos/xicara.png'
];

const loadedImages = [];
let imagesLoaded = 0;

modelFiles.forEach((file, idx) => {
  const img = new Image();
  img.src = file;
  img.onload = () => {
    loadedImages[idx] = { img, file };
    imagesLoaded++;
    if (imagesLoaded === modelFiles.length) draw();
  };
  img.onerror = () => console.error('Erro ao carregar', file);
});

// ==================== DESENHO ===================== //
function draw() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const item = loadedImages[currentModelIndex];
  if (!item || !item.img) return;

  const img = item.img;
  let SIZE_MULTIPLIER = 1.0; // padrão (xícara)
  const file = item.file.toLowerCase();

  // reduzir 50% todos os outros
  if (!file.includes('xicara')) SIZE_MULTIPLIER = 0.5;

  const maxW = canvas.width * 0.6;
  const maxH = canvas.height * 0.65;
  const baseScale = Math.min(maxW / img.width, maxH / img.height);
  const scale = baseScale * SIZE_MULTIPLIER;

  const dw = img.width * scale;
  const dh = img.height * scale;
  const dx = (canvas.width - dw) / 2;
  const dy = (canvas.height - dh) / 2;

  // sombra
  ctx.save();
  ctx.translate(canvas.width/2, dy + dh * 0.72);
  ctx.scale(1, 0.28);
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.beginPath();
  ctx.ellipse(0,0, dw*0.42, dw*0.42, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();

  const off = document.createElement('canvas');
  off.width = img.width;
  off.height = img.height;
  const offCtx = off.getContext('2d');
  offCtx.drawImage(img, 0, 0);

  if (currentTint) {
    offCtx.globalCompositeOperation = 'source-in';
    offCtx.fillStyle = currentTint;
    offCtx.fillRect(0, 0, off.width, off.height);
    offCtx.globalCompositeOperation = 'source-over';
  }

  ctx.drawImage(off, 0, 0, off.width, off.height, dx, dy, dw, dh);

  if (uploadedArt) {
    const artScale = Math.min(dw / uploadedArt.width, dh / uploadedArt.height) * 0.5;
    const artW = uploadedArt.width * artScale;
    const artH = uploadedArt.height * artScale;
    const artX = dx + dw/2 - artW/2;
    const artY = dy + dh/2 - artH/2;
    ctx.drawImage(uploadedArt, artX, artY, artW, artH);
  }
}

// ==================== EVENTOS ===================== //
document.getElementById('prevModel').onclick = () => {
  currentModelIndex = (currentModelIndex - 1 + loadedImages.length) % loadedImages.length;
  draw();
};
document.getElementById('nextModel').onclick = () => {
  currentModelIndex = (currentModelIndex + 1) % loadedImages.length;
  draw();
};

document.querySelectorAll('.color-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentTint = btn.dataset.color;
    draw();
  });
});

document.getElementById('upload').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const img = new Image();
    img.onload = () => {
      uploadedArt = img;
      draw();
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
});

document.getElementById('downloadMockup').onclick = () => {
  const a = document.createElement('a');
  a.download = modelFiles[currentModelIndex].split('/').pop().replace('.png','_mockup.png');
  a.href = canvas.toDataURL('image/png');
  a.click();
};

document.getElementById('generateVideo').onclick = () => {
  alert('Geração de vídeo 360º ainda será ativada nesta versão.');
};
