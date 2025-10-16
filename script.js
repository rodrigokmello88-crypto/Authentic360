// script.js - Authentic360 (versão com todos os copos)
// ------------------------------------------------------------------
// Estrutura esperada: /copos/<filename>.png
// Nomes (de acordo com seu repositório):
// caneca_png.png, caneca_slim_png.png, ecologico.png, espumante.png,
// squeeze.png, taca_gin.png, twister.png, xicara.png
// ------------------------------------------------------------------

const canvas = document.getElementById('mockupCanvas');
const ctx = canvas.getContext('2d', { alpha: true });
const modelsList = document.getElementById('modelsList');
const swatches = document.getElementById('swatches');
const uploadInput = document.getElementById('uploadInput');
const downloadBtn = document.getElementById('downloadBtn');
const recordBtn = document.getElementById('recordBtn');

canvas.width = 1200;   // internal drawing resolution (higher for export)
canvas.height = 700;

// modelos (posições e escala ajustáveis)
// x,y aqui são posições relativas ao canvas interna (não ao CSS)
const modelos = [
  { id: 'caneca', name: 'Caneca', file: 'copos/caneca_png.png', x: 220, y: 100, scale: 0.6 },
  { id: 'caneca_slim', name: 'Caneca Slim', file: 'copos/caneca_slim_png.png', x: 220, y: 100, scale: 0.58 },
  { id: 'ecologico', name: 'Ecológico', file: 'copos/ecologico.png', x: 220, y: 100, scale: 0.55 },
  { id: 'espumante', name: 'Espumante', file: 'copos/espumante.png', x: 220, y: 70, scale: 0.55 },
  { id: 'squeeze', name: 'Squeeze', file: 'copos/squeeze.png', x: 220, y: 100, scale: 0.56 },
  { id: 'taca_gin', name: 'Taça Gin', file: 'copos/taca_gin.png', x: 220, y: 60, scale: 0.6 },
  { id: 'twister', name: 'Twister', file: 'copos/twister.png', x: 220, y: 60, scale: 0.6 },
  { id: 'xicara', name: 'Xícara', file: 'copos/xicara.png', x: 220, y: 130, scale: 0.52 }
];

const colors = [
  { name: 'Branco', hex: '#ffffff' },
  { name: 'Cinza', hex: '#cfcfcf' },
  { name: 'Preto', hex: '#000000' },
  { name: 'Azul', hex: '#1677ff' },
  { name: 'Ciano', hex: '#00d1d1' },
  { name: 'Rosa', hex: '#ff2da8' }
];

let images = {};        // imagens carregadas por id
let currentModel = modelos[0].id;
let currentTint = null; // hex ou null
let userArt = null;     // imagem enviada pelo usuário
let scaleAdjust = 1.0;  // ajuste global (se precisar)

// ----- preload imagens -----
function preloadAll() {
  const promises = modelos.map(m => loadImage(m.file).then(img => {
    images[m.id] = img;
  }).catch(err => {
    console.warn('Erro ao carregar', m.file, err);
  }));
  return Promise.all(promises);
}
function loadImage(src){
  return new Promise((res, rej) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => res(img);
    img.onerror = (e) => rej(e);
    img.src = src;
  });
}

// ----- UI build -----
function buildModelButtons(){
  modelsList.innerHTML = '';
  modelos.forEach(m => {
    const btn = document.createElement('button');
    btn.className = 'model-btn';
    btn.textContent = m.name;
    btn.onclick = () => {
      currentModel = m.id;
      draw();
    };
    modelsList.appendChild(btn);
  });
}

function buildSwatches(){
  swatches.innerHTML = '';
  colors.forEach(c => {
    const b = document.createElement('div');
    b.className = 'color-swatch';
    b.title = c.name;
    b.style.background = c.hex;
    b.dataset.color = c.hex;
    b.addEventListener('click', () => {
      currentTint = c.hex;
      draw();
    });
    swatches.appendChild(b);
  });

  // clear tint control (click white again to remove)
  const clearBtn = document.createElement('div');
  clearBtn.className = 'color-swatch';
  clearBtn.style.background = 'transparent';
  clearBtn.style.border = '2px dashed rgba(255,255,255,0.3)';
  clearBtn.title = 'Remover cor/usar original';
  clearBtn.onclick = () => { currentTint = null; draw(); };
  swatches.insertBefore(clearBtn, swatches.firstChild);
}

// ----- draw -----
function draw(){
  // limpar com transparência
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // desenha painel escuro central (visual)
  const padX = 160;
  const padY = 60;
  const panelW = canvas.width - padX*2;
  const panelH = canvas.height - padY*2;
  ctx.fillStyle = '#222';
  roundRect(ctx, padX, padY, panelW, panelH, 16, true, false);

  // pegar modelo
  const model = modelos.find(m => m.id === currentModel);
  if(!model || !images[model.id]) {
    // aviso simples
    ctx.fillStyle = '#fff';
    ctx.font = '20px Montserrat, sans-serif';
    ctx.fillText('Modelo não encontrado', padX+30, padY+40);
    return;
  }

  // desenho centralizado do copo (respeitando escala)
  const img = images[model.id];
  const drawW = img.width * model.scale * scaleAdjust;
  const drawH = img.height * model.scale * scaleAdjust;
  const dx = Math.round(padX + (panelW - drawW) / 2);
  const dy = Math.round(padY + (panelH - drawH) / 2);

  // desenhar o copo base (imagem original)
  ctx.drawImage(img, dx, dy, drawW, drawH);

  // aplicar tint real (não só sombra)
  if(currentTint){
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = currentTint;
    ctx.fillRect(dx, dy, drawW, drawH);
    ctx.restore();
  }

  // desenhar arte do usuário, se houver
  if(userArt){
    // posicione a arte centralizada sobre o copo (ajuste por escala)
    const artW = drawW * 0.7;
    const artH = userArt.height * (artW / userArt.width);
    const ax = dx + (drawW - artW)/2;
    const ay = dy + (drawH - artH)/2;
    ctx.drawImage(userArt, ax, ay, artW, artH);
  }
}

// util: desenho de retângulo com cantos arredondados
function roundRect(ctx,x,y,w,h,r,fill,stroke){
  if(typeof r === 'undefined') r=5;
  if(typeof r === 'number') r={tl:r,tr:r,br:r,bl:r};
  ctx.beginPath();
  ctx.moveTo(x + r.tl, y);
  ctx.lineTo(x + w - r.tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr);
  ctx.lineTo(x + w, y + h - r.br);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
  ctx.lineTo(x + r.bl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl);
  ctx.lineTo(x, y + r.tl);
  ctx.quadraticCurveTo(x, y, x + r.tl, y);
  ctx.closePath();
  if(fill){ ctx.fill(); }
  if(stroke){ ctx.stroke(); }
}

// ----- upload arte -----
uploadInput.addEventListener('change', (ev) => {
  const f = ev.target.files && ev.target.files[0];
  if(!f) return;
  const img = new Image();
  img.onload = () => { userArt = img; draw(); };
  img.src = URL.createObjectURL(f);
});

// ----- download PNG -----
downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'mockup.png';
  // gerar PNG com resolução atual do canvas bitmap
  link.href = canvas.toDataURL('image/png');
  link.click();
});

// ----- gravar vídeo 360 (automático 8s) -----
recordBtn.addEventListener('click', async () => {
  // animação: rotaciona o "tint" de hue para dar efeito 360
  // implementamos por 8s (240 frames @30fps)
  const duration = 8000;
  const fps = 25;
  const frames = Math.round((duration/1000)*fps);
  const stream = canvas.captureStream(fps);
  const recorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });

  const chunks = [];
  recorder.ondataavailable = e => { if(e.data.size) chunks.push(e.data); };
  recorder.start();

  let start = performance.now();
  for(let i=0;i<frames;i++){
    const t = i / frames; // 0..1
    // simulate rotation by skewing tint hue and a slight horizontal offset
    // compute hue rotation
    const hue = Math.round(360 * t);
    // set a temporary tint based on hue + currentTint brightness
    // use HSL convert quick
    const hsl = `hsl(${hue} 100% 60% / 1)`;
    // apply temporary tint for drawing
    currentTint = hsl;
    draw();
    // wait next frame
    await new Promise(r => setTimeout(r, 1000/fps));
  }

  // stop recording
  recorder.stop();
  // restore tint (remove hue animation)
  currentTint = null;
  draw();

  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    // baixar automaticamente
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mockup_360.webm';
    link.click();
    URL.revokeObjectURL(url);
  };
});

// ----- init -----
(async function init(){
  await preloadAll();
  buildModelButtons();
  buildSwatches();
  // default draw
  draw();
})();

