// --- Configurações de arquivos (caminho em /copos) ---
const models = {
  caneca: 'copos/caneca_png.png',
  caneca_slim: 'copos/caneca_slim_png.png',
  ecologico: 'copos/ecologico.png',
  espumante: 'copos/espumante.png',
  squeeze: 'copos/squeeze.png',
  taca_gin: 'copos/taca_gin.png',
  twister: 'copos/twister.png',
  xicara: 'copos/xicara.png'
};

// scale override por modelo (menor = cabe mais)
const modelScales = {
  // base é 0.5; aqui reduzimos os casos que você pediu
  'espumante': 0.40,
  'squeeze': 0.45,
  'taca_gin': 0.45
};

const canvas = document.getElementById('mockup');
const ctx = canvas.getContext('2d');

// desenhamos em resolução fixa (garante qualidade)
const DRAW_W = 800, DRAW_H = 600;
canvas.width = DRAW_W;
canvas.height = DRAW_H;

// estado
let currentModelSrc = models.caneca;
let currentTint = '#ffffff';
let uploadedArt = null;

// paleta que combinamos (ajuste se quiser)
const palette = ['#ffffff','#c0c0c0','#9ca3af','#000000','#00d4d4','#ff00ff','#3b82f6'];

// cria os botões de cor
const coresEl = document.getElementById('cores');
palette.forEach(c => {
  const d = document.createElement('div');
  d.className = 'color-swatch';
  d.style.background = c;
  d.dataset.color = c;
  d.addEventListener('click', () => {
    currentTint = c;
    draw();
  });
  coresEl.appendChild(d);
});

// trocar copo (chamado pelos botões)
window.trocarCopo = function(path){
  // path vem como 'copos/xxx.png'
  currentModelSrc = path;
  uploadedArt = null; // opcional: resetar arte aplicada
  draw();
};

// carregar imagem auxiliar (retorna Promise)
function loadImage(src){
  return new Promise((res, rej) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => res(img);
    img.onerror = e => rej(e);
    img.src = src;
  });
}

// função principal de desenho
async function draw(){
  ctx.clearRect(0,0,DRAW_W,DRAW_H);

  // desenho de painel escuro (por trás)
  ctx.fillStyle = '#1b1b1b';
  const padX = 60, padY = 60, panelW = DRAW_W - 2*padX, panelH = DRAW_H - 2*padY;
  ctx.fillRect(padX, padY, panelW, panelH);

  // tenta carregar o modelo
  let modelImg;
  try{
    modelImg = await loadImage(currentModelSrc);
  }catch(e){
    console.error('Erro carregando modelo', currentModelSrc, e);
    // mostra texto de erro
    ctx.fillStyle = '#fff';
    ctx.font = '20px sans-serif';
    ctx.fillText('Erro carregar modelo', DRAW_W/2-80, DRAW_H/2);
    return;
  }

  // decide escala e posição centralizada no painel
  // default scale
  let baseScale = 0.5;
  // detect key do modelo (pegar nome do arquivo)
  const key = currentModelSrc.split('/').pop().replace(/\.(png|jpg|jpeg)$/i,'').toLowerCase();
  for(const k of Object.keys(modelScales)){
    if(key.includes(k)){ baseScale = modelScales[k]; break; }
  }

  // fit by width (relative ao panel)
  const targetW = panelW * baseScale;
  const scale = Math.min(targetW / modelImg.width, (panelH*0.9)/modelImg.height);
  const dw = modelImg.width * scale;
  const dh = modelImg.height * scale;
  const dx = padX + (panelW - dw)/2;
  const dy = padY + (panelH - dh)/2 - (panelH*0.04); // leve offset up

  // draw model into offscreen canvas to allow tint
  const off = document.createElement('canvas');
  off.width = modelImg.width;
  off.height = modelImg.height;
  const offCtx = off.getContext('2d');
  offCtx.clearRect(0,0,off.width,off.height);
  offCtx.drawImage(modelImg, 0, 0);

  // apply tint using source-atop so white areas receive color
  if(currentTint && currentTint !== '#ffffff'){
    offCtx.globalCompositeOperation = 'source-atop';
    offCtx.fillStyle = currentTint;
    offCtx.fillRect(0,0,off.width,off.height);
    offCtx.globalCompositeOperation = 'source-over';
  }

  // finally draw tinted image onto main canvas (scaled)
  ctx.drawImage(off, 0, 0, off.width, off.height, dx, dy, dw, dh);

  // if uploaded art exists, draw it on top (fit inside cup area)
  if(uploadedArt){
    // place art centered on cup, scaled smaller (you can later add controls for position/scale)
    const artW = dw * 0.6;
    const artH = dh * 0.45;
    const artX = dx + (dw - artW)/2;
    const artY = dy + (dh - artH)/2;
    ctx.drawImage(uploadedArt, artX, artY, artW, artH);
  }

  // small shadow under cup
  ctx.save();
  ctx.translate(DRAW_W/2, dy + dh*0.9);
  ctx.scale(1, 0.25);
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.beginPath();
  ctx.ellipse(0,0, dw*0.38, dw*0.38, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();
}

// inicial draw com caneca
currentModelSrc = models.caneca;
draw();

// upload de arte
const fileUpload = document.getElementById('fileUpload');
fileUpload.addEventListener('change', async (e) => {
  const f = e.target.files[0];
  if(!f) return;
  const url = URL.createObjectURL(f);
  try{
    const img = await loadImage(url);
    uploadedArt = img;
    draw();
  }catch(err){
    console.error('erro ler arte', err);
  }
});

// baixar imagem atual
document.getElementById('downloadBtn').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'mockup.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

// gerar vídeo: gira 360 em 8s e gera webm (alpha não garantido em todos navegadores)
document.getElementById('recordBtn').addEventListener('click', async () => {
  // gravaando a rotação: fazemos frames e registramos pelo MediaRecorder do canvas
  const chunks = [];
  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });

  recorder.ondataavailable = e => { if(e.data && e.data.size) chunks.push(e.data); };
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mockup360.webm';
    a.click();
  };

  recorder.start();

  // animate rotation by changing a temporary global rotation for draw
  const fps = 30;
  const duration = 8; // seconds
  const totalFrames = fps * duration;
  let frame = 0;

  // we'll rotate the offscreen image by small increments (not the entire canvas rotate)
  const startSrc = currentModelSrc;

  // create a loop: for each frame we change a small proportion and redraw
  (function next(){
    if(frame > totalFrames){
      recorder.stop();
      return;
    }
    // temporary rotate by modifying currentTint? No — do a small horizontal shear effect by shifting dx
    // Simpler: just simulate spin by redrawing with small horizontal offset = sin(angle)
    const angle = (frame / totalFrames) * Math.PI * 2; // 0..2pi
    // We'll store a small global multiplier and adapt draw() to read it if present.
    window._recordingOffset = Math.sin(angle) * 0.06; // -0.06..0.06
    draw();
    frame++;
    requestAnimationFrame(next);
  })();
});
