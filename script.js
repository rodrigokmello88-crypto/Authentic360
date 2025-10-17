/* script.js - Authentic360 mockup (ajustado) */
/* Estrutura esperada: /copos/ + fundos.png + logo.png na raiz */

/* Arquivos de modelo — confirme os nomes dos PNGs na pasta /copos/ */
const modelFiles = [
  {name:'Caneca', file:'copos/caneca_png.png'},
  {name:'Caneca Slim', file:'copos/caneca_slim_png.png'},
  {name:'Ecológico', file:'copos/ecologico.png'},
  {name:'Espumante', file:'copos/espumante.png'},
  {name:'Squeeze', file:'copos/squeeze.png'},
  {name:'Taça Gin', file:'copos/taca_gin.png'},
  {name:'Twister', file:'copos/twister.png'},
  {name:'Xícara', file:'copos/xicara.png'}
];

/* Cores pedidas */
const swatchColors = [
  {name:'Branco', hex:'#ffffff'},
  {name:'Amarelo', hex:'#f7e600'},
  {name:'Azul', hex:'#2f7bff'},
  {name:'Roxo', hex:'#5b16b8'},
  {name:'Rosa', hex:'#ff39a8'},
  {name:'Verde', hex:'#1bd84f'}
];

/* Override: diminuir modelos problemáticos (50%) */
const modelScaleOverrides = {
  'copos/espumante.png': 0.2,
  'copos/taca_gin.png': 0.2,
  'copos/squeeze.png': 0.2
};

/* DOM */
const canvas = document.getElementById('mockupCanvas');
const ctx = canvas.getContext('2d', {alpha:true});
const modelsList = document.getElementById('modelsList');
const swatches = document.getElementById('swatches');
const downloadBtn = document.getElementById('downloadBtn');
const recordBtn = document.getElementById('recordBtn');
const uploadInput = document.getElementById('uploadInput');
const msg = document.getElementById('msg');

let loadedModels = [];
let currentIndex = 0;
let tintColor = null;
let artworkImg = null;
let artworkState = { x:0.5, y:0.55, scale:0.25 };
let draggingArt = false;
let dragStart = null;
let canvasRect = null;

/* --- Helpers --- */
function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }
function loadImage(src){
  return new Promise((res, rej) => {
    const i = new Image();
    i.crossOrigin = 'anonymous';
    i.onload = () => res(i);
    i.onerror = (e) => rej(e);
    i.src = src;
  });
}
function fileToDataURL(file){
  return new Promise(res => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.readAsDataURL(file);
  });
}

/* --- Preload modelos --- */
async function preload(){
  const arr = [];
  for(const m of modelFiles){
    try{
      const img = await loadImage(m.file);
      arr.push({name:m.name, file:m.file, img});
    }catch(e){
      console.warn('Falha ao carregar', m.file, e);
    }
  }
  loadedModels = arr;
}

/* --- Build UI --- */
function buildUI(){
  modelsList.innerHTML = '';
  loadedModels.forEach((m, idx) => {
    const b = document.createElement('button');
    b.className = 'model-btn';
    b.textContent = m.name;
    b.addEventListener('click', () => {
      currentIndex = idx;
      setActiveModel();
      draw();
    });
    modelsList.appendChild(b);
  });

  swatches.innerHTML = '';
  swatchColors.forEach(s => {
    const d = document.createElement('div');
    d.className = 'color-swatch';
    d.title = s.name;
    d.style.background = s.hex;
    d.addEventListener('click', () => {
      tintColor = s.hex;
      draw();
    });
    swatches.appendChild(d);
  });
}

function setActiveModel(){
  const buttons = modelsList.querySelectorAll('.model-btn');
  buttons.forEach((b,i)=> b.classList.toggle('active', i===currentIndex));
}

/* --- Desenho --- */
function draw(){
  // device pixel ratio handling:
  const DPR = window.devicePixelRatio || 1;
  const logicalW = canvas.width / DPR;
  const logicalH = canvas.height / DPR;

  // clear (use logical coords)
  ctx.setTransform(1,0,0,1,0,0); // reset transform
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.scale(DPR,DPR);

  // panel rectangle (chumbo)
  const pad = 40;
  const panelW = logicalW - pad*2;
  const panelH = logicalH - pad*2;
  const panelX = pad;
  const panelY = pad;

  ctx.fillStyle = '#222';
  ctx.fillRect(panelX, panelY, panelW, panelH);

  // if no model loaded
  const model = loadedModels[currentIndex];
  if(!model || !model.img){
    ctx.fillStyle = '#fff';
    ctx.font = '18px Montserrat';
    ctx.fillText('Nenhum modelo encontrado em /copos/.', panelX+20, panelY+30);
    return;
  }

  // compute scale to fit proportionally
  const img = model.img;
  // available area for cup drawing inside panel
  const maxW = panelW * 0.56;
  const maxH = panelH * 0.78;
  let scale = Math.min(maxW / img.width, maxH / img.height);

  // apply per-model override (reduce by factor)
  const override = modelScaleOverrides[model.file];
  if(typeof override === 'number'){
    scale *= override; // e.g. 0.5
  }

  const dw = img.width * scale;
  const dh = img.height * scale;
  const dx = panelX + (panelW - dw) / 2;
  const dy = panelY + (panelH - dh) / 2 - 10;

  // draw model into offscreen canvas to allow tint full-paint
  const off = document.createElement('canvas');
  off.width = img.width;
  off.height = img.height;
  const octx = off.getContext('2d');
  octx.clearRect(0,0,off.width,off.height);
  octx.drawImage(img, 0,0);

  if(tintColor){
    octx.globalCompositeOperation = 'source-atop';
    octx.fillStyle = tintColor;
    octx.fillRect(0,0,off.width,off.height);
    octx.globalCompositeOperation = 'source-over';
  }

  // draw final image (centered)
  ctx.drawImage(off, 0,0, off.width, off.height, dx, dy, dw, dh);

  // draw artwork overlay if exists
  if(artworkImg){
    const artW = artworkImg.width * artworkState.scale;
    const artH = artworkImg.height * artworkState.scale;
    const cx = panelX + panelW * artworkState.x;
    const cy = panelY + panelH * artworkState.y;
    const ax = cx - artW/2;
    const ay = cy - artH/2;
    ctx.drawImage(artworkImg, 0,0, artworkImg.width, artworkImg.height, ax, ay, artW, artH);
  }
}

/* --- Download PNG --- */
function downloadPNG(){
  const link = document.createElement('a');
  link.download = 'mockup_authentic360.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/* --- Recording 8s (canvas capture) --- */
async function recordVideo8s(){
  msg.textContent = 'Gravando 8s...';
  const stream = canvas.captureStream(60);
  const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' :
               (MediaRecorder.isTypeSupported('video/webm;codecs=vp8') ? 'video/webm;codecs=vp8' : 'video/webm');
  const rec = new MediaRecorder(stream, { mimeType: mime });
  const chunks = [];
  rec.ondataavailable = e => { if(e.data && e.data.size) chunks.push(e.data); };
  rec.start();
  await new Promise(res => setTimeout(res, 8000));
  rec.stop();
  rec.onstop = () => {
    const blob = new Blob(chunks, { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mockup_360.webm';
    a.click();
    setTimeout(()=> URL.revokeObjectURL(url), 10000);
    msg.textContent = 'Vídeo gerado e baixado.';
  };
}

/* --- Upload arte handling --- */
uploadInput.addEventListener('change', async (ev) => {
  const f = ev.target.files && ev.target.files[0];
  if(!f) return;
  const dataURL = await fileToDataURL(f);
  try{
    const img = await loadImage(dataURL);
    artworkImg = img;
    // inicializa tamanho proporcional (25% do painel)
    const DPR = window.devicePixelRatio || 1;
    const logicalW = canvas.width / DPR;
    const logicalH = canvas.height / DPR;
    artworkState.scale = Math.min(logicalW, logicalH) * 0.25 / Math.max(img.width, img.height);
    artworkState.x = 0.5;
    artworkState.y = 0.55;
    draw();
    msg.textContent = 'Arte carregada. Clique e arraste para posicionar; roda do mouse para escalar.';
  }catch(e){
    console.error(e);
    msg.textContent = 'Erro ao carregar a arte.';
  }
});

/* --- Dragging artwork on canvas --- */
canvas.addEventListener('pointerdown', (e) => {
  if(!artworkImg) return;
  canvasRect = canvas.getBoundingClientRect();
  const DPR = window.devicePixelRatio || 1;
  const mx = (e.clientX - canvasRect.left) * (canvas.width / canvasRect.width) / DPR;
  const my = (e.clientY - canvasRect.top) * (canvas.height / canvasRect.height) / DPR;

  const pad = 40;
  const logicalW = canvas.width / (window.devicePixelRatio || 1);
  const logicalH = canvas.height / (window.devicePixelRatio || 1);
  const panelW = logicalW - pad*2;
  const panelH = logicalH - pad*2;

  const artW = artworkImg.width * artworkState.scale;
  const artH = artworkImg.height * artworkState.scale;
  const cx = pad + panelW * artworkState.x;
  const cy = pad + panelH * artworkState.y;
  const ax = cx - artW/2;
  const ay = cy - artH/2;

  // pointer coords in logical units:
  const mxLog = mx;
  const myLog = my;

  if(mxLog >= ax && mxLog <= ax + artW && myLog >= ay && myLog <= ay + artH){
    draggingArt = true;
    dragStart = { mx: mxLog, my: myLog, startX: artworkState.x, startY: artworkState.y, panelW, panelH };
    canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId);
  }
});

canvas.addEventListener('pointermove', (e) => {
  if(!draggingArt || !dragStart) return;
  const DPR = window.devicePixelRatio || 1;
  const canvasRectNow = canvas.getBoundingClientRect();
  const mx = (e.clientX - canvasRectNow.left) * (canvas.width / canvasRectNow.width) / DPR;
  const my = (e.clientY - canvasRectNow.top) * (canvas.height / canvasRectNow.height) / DPR;
  const dx = mx - dragStart.mx;
  const dy = my - dragStart.my;
  artworkState.x = clamp((dragStart.startX * dragStart.panelW + dx) / dragStart.panelW, 0.0, 1.0);
  artworkState.y = clamp((dragStart.startY * dragStart.panelW + dy) / dragStart.panelW, 0.0, 1.0);
  draw();
});

canvas.addEventListener('pointerup', (e) => {
  draggingArt = false;
  dragStart = null;
  canvas.releasePointerCapture && canvas.releasePointerCapture(e.pointerId);
});

/* wheel to scale artwork */
canvas.addEventListener('wheel', (e) => {
  if(!artworkImg) return;
  e.preventDefault();
  const delta = -e.deltaY;
  const factor = delta > 0 ? 1.06 : 0.94;
  artworkState.scale = clamp(artworkState.scale * factor, 0.02, 2.5);
  draw();
}, {passive:false});

/* keyboard scale */
window.addEventListener('keydown', (e) => {
  if(!artworkImg) return;
  if(e.key === '+' || e.key === '='){ artworkState.scale = clamp(artworkState.scale * 1.06, 0.02, 2.5); draw(); }
  if(e.key === '-') { artworkState.scale = clamp(artworkState.scale * 0.94, 0.02, 2.5); draw(); }
});

/* buttons */
downloadBtn.addEventListener('click', downloadPNG);
recordBtn.addEventListener('click', async () => {
  try{
    await recordVideo8s();
  }catch(err){
    alert('Erro ao gravar vídeo: ' + err.message);
  }
});

/* --- Init --- */
(async function init(){
  // set high-DPI internal resolution
  const DPR = window.devicePixelRatio || 1;
  const logicalWidth = 900;
  const logicalHeight = 700;
  canvas.width = logicalWidth * DPR;
  canvas.height = logicalHeight * DPR;
  canvas.style.width = '760px';
  canvas.style.height = '590px';
  ctx.setTransform(1,0,0,1,0,0);
  ctx.scale(DPR, DPR);

  msg.textContent = 'Carregando modelos...';
  await preload();
  if(loadedModels.length === 0){
    msg.textContent = 'Nenhum modelo carregado em /copos/. Verifique nomes.';
    draw();
    return;
  }
  buildUI();
  setActiveModel();
  msg.textContent = '';
  draw();
})();
