/* script.js - Authentic360 corrected renderer
   Assumptions: /copos/ folder exists with PNGs (transparent)
   Works: tinting full cup, artwork upload, drag/scale/rotate, record 8s webm
*/

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

const swatchColors = [
  {name:'Branco', hex:'#ffffff'},
  {name:'Amarelo', hex:'#f7e600'},
  {name:'Azul', hex:'#2f7bff'},
  {name:'Roxo', hex:'#7b3bff'},
  {name:'Rosa', hex:'#ff39a8'},
  {name:'Verde', hex:'#1bd84f'}
];

const canvas = document.getElementById('mockupCanvas');
const ctx = canvas.getContext('2d', {alpha:true});
const modelsList = document.getElementById('modelsList');
const swatches = document.getElementById('swatches');
const downloadBtn = document.getElementById('downloadBtn');
const recordBtn = document.getElementById('recordBtn');
const uploadInput = document.getElementById('uploadInput');
const fixBtn = document.getElementById('fixBtn');
const rotateLeft = document.getElementById('rotateLeft');
const rotateRight = document.getElementById('rotateRight');
const msg = document.getElementById('msg');

let loadedModels = [];
let currentIndex = 0;
let tintColor = null;
let artworkImg = null;
let artworkState = { x:0.5, y:0.55, scale:0.25, rotation:0 }; // normalized relative to panel
let dragging = false;
let dragOrigin = null;
let fixArtwork = false;

// set high DPI
(function setCanvasDPR(){
  const DPR = window.devicePixelRatio || 1;
  const logicalW = 900;
  const logicalH = 700;
  canvas.width = logicalW * DPR;
  canvas.height = logicalH * DPR;
  canvas.style.width = '760px';
  canvas.style.height = '590px';
  ctx.setTransform(DPR,0,0,DPR,0,0);
})();

function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }

function loadImage(src){
  return new Promise((res,rej)=>{
    const i = new Image();
    i.crossOrigin = 'anonymous';
    i.onload = ()=> res(i);
    i.onerror = (e)=> rej(e);
    i.src = src;
  });
}

async function preloadModels(){
  const arr = [];
  for(const m of modelFiles){
    try{
      const img = await loadImage(m.file);
      arr.push({name:m.name, file:m.file, img});
    }catch(e){
      console.warn('Erro ao carregar', m.file, e);
    }
  }
  loadedModels = arr;
}

function buildUI(){
  modelsList.innerHTML = '';
  loadedModels.forEach((m, idx)=>{
    const b = document.createElement('button');
    b.className = 'model-btn';
    b.textContent = m.name;
    b.addEventListener('click', ()=>{
      currentIndex = idx;
      setActiveModel();
      draw();
    });
    modelsList.appendChild(b);
  });
  setActiveModel();

  swatches.innerHTML = '';
  swatchColors.forEach(s=>{
    const d = document.createElement('div');
    d.className = 'color-swatch';
    d.title = s.name;
    d.style.background = s.hex;
    d.addEventListener('click', ()=>{
      tintColor = s.hex;
      draw();
    });
    swatches.appendChild(d);
  });
}

function setActiveModel(){
  const btns = modelsList.querySelectorAll('.model-btn');
  btns.forEach((b,i)=> b.classList.toggle('active', i===currentIndex));
}

function draw(){
  // logical dims used in calculations:
  const DPR = window.devicePixelRatio || 1;
  const logicalW = canvas.width / DPR;
  const logicalH = canvas.height / DPR;

  // clear
  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.scale(DPR,DPR);

  // panel padding / area
  const pad = 40;
  const panelX = pad;
  const panelY = pad;
  const panelW = logicalW - pad*2;
  const panelH = logicalH - pad*2;

  // draw panel background (chumbo)
  ctx.fillStyle = '#222';
  roundRect(ctx, panelX, panelY, panelW, panelH, 12, true, false);

  // if no model
  const model = loadedModels[currentIndex];
  if(!model || !model.img){
    ctx.fillStyle = '#fff';
    ctx.font = '18px Montserrat';
    ctx.fillText('Nenhum modelo carregado em /copos/.', panelX + 20, panelY + 30);
    return;
  }

  // fit cup proportionally inside a defined area
  const img = model.img;
  const maxW = panelW * 0.56;   // relative area for cup
  const maxH = panelH * 0.78;
  let scale = Math.min(maxW / img.width, maxH / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  const dx = panelX + (panelW - dw) / 2;
  const dy = panelY + (panelH - dh) / 2 - 6; // little offset

  // draw cup into offscreen canvas, then tint using source-atop to color entire cup
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

  // draw the (possibly tinted) cup centered on panel
  ctx.drawImage(off, 0,0, off.width, off.height, dx, dy, dw, dh);

  // draw artwork on top if exists
  if(artworkImg){
    // artworkState.x/y are normalized to panel (0..1)
    const artW = artworkImg.width * artworkState.scale;
    const artH = artworkImg.height * artworkState.scale;
    const centerX = panelX + panelW * artworkState.x;
    const centerY = panelY + panelH * artworkState.y;
    const ax = centerX - artW / 2;
    const ay = centerY - artH / 2;

    // clip to cup silhouette to avoid painting outside? -- we'll draw as-is, user can position
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((artworkState.rotation || 0) * Math.PI / 180);
    ctx.drawImage(artworkImg, -artW/2, -artH/2, artW, artH);
    ctx.restore();
  }
}

// utility to draw rounded rect
function roundRect(ctx,x,y,w,h,r,fill,stroke){
  if (typeof r === 'undefined') r = 5;
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r);
  ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);
  ctx.arcTo(x,y,x+w,y,r);
  ctx.closePath();
  if(fill){ ctx.fill(); }
  if(stroke){ ctx.stroke(); }
}

/* --- Download PNG --- */
function downloadPNG(){
  // create temporary full-size PNG (use canvas current content)
  const dataURL = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataURL;
  a.download = 'mockup_authentic360.png';
  a.click();
}

/* --- Record 8s webm --- */
async function record8s(){
  msg.textContent = 'Gravando 8s...';
  const stream = (canvas.captureStream) ? canvas.captureStream(60) : null;
  if(!stream){ alert('API de gravação não suportada no navegador.'); msg.textContent=''; return; }
  const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' :
               (MediaRecorder.isTypeSupported('video/webm;codecs=vp8') ? 'video/webm;codecs=vp8' : 'video/webm');
  const recorder = new MediaRecorder(stream, {mimeType:mime});
  const chunks = [];
  recorder.ondataavailable = e => { if(e.data && e.data.size) chunks.push(e.data); };
  recorder.start();
  await new Promise(r => setTimeout(r, 8000));
  recorder.stop();
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mockup_360.webm';
    a.click();
    setTimeout(()=> URL.revokeObjectURL(url), 20000);
    msg.textContent = 'Vídeo gerado.';
  };
}

/* --- Upload Artwork --- */
uploadInput.addEventListener('change', async (ev)=>{
  const f = ev.target.files && ev.target.files[0];
  if(!f) return;
  const reader = new FileReader();
  reader.onload = async (e)=>{
    try{
      const img = await loadImage(e.target.result);
      artworkImg = img;
      // initialize artworkState.scale so it is ~25% of panel
      const DPR = window.devicePixelRatio || 1;
      const logicalW = canvas.width / DPR;
      const logicalH = canvas.height / DPR;
      const panelW = logicalW - 40*2;
      const panelH = logicalH - 40*2;
      artworkState.scale = Math.min(panelW, panelH) * 0.25 / Math.max(img.width, img.height);
      artworkState.x = 0.5;
      artworkState.y = 0.65;
      artworkState.rotation = 0;
      fixArtwork = false;
      msg.textContent = 'Arte carregada. Arraste no canvas para posicionar; roda do mouse para escalar.';
      draw();
    }catch(err){
      console.error(err);
      msg.textContent = 'Erro ao carregar a arte.';
    }
  };
  reader.readAsDataURL(f);
});

/* --- Canvas interactions (drag artwork & wheel scale) --- */
let pointerDown = false;
let pointerStart = null;

canvas.addEventListener('pointerdown', (e)=>{
  if(!artworkImg || fixArtwork) return;
  pointerDown = true;
  const pos = getCanvasLogicalXY(e);
  // compute artwork bbox in logical coords
  const DPR = window.devicePixelRatio || 1;
  const logicalW = canvas.width / DPR;
  const logicalH = canvas.height / DPR;
  const pad = 40;
  const panelW = logicalW - pad*2;
  const panelH = logicalH - pad*2;
  const artW = artworkImg.width * artworkState.scale;
  const artH = artworkImg.height * artworkState.scale;
  const centerX = pad + panelW * artworkState.x;
  const centerY = pad + panelH * artworkState.y;
  const ax = centerX - artW/2;
  const ay = centerY - artH/2;
  if(pos.x >= ax && pos.x <= ax+artW && pos.y >= ay && pos.y <= ay+artH){
    pointerStart = { x: pos.x, y: pos.y, startX: artworkState.x, startY: artworkState.y, panelW, panelH, pad };
    canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId);
  } else {
    pointerStart = null;
  }
});

canvas.addEventListener('pointermove', (e)=>{
  if(!pointerDown || !pointerStart || !artworkImg) return;
  const pos = getCanvasLogicalXY(e);
  const dx = pos.x - pointerStart.x;
  const dy = pos.y - pointerStart.y;
  // update normalized x/y relative to panel width/height
  artworkState.x = clamp((pointerStart.startX * pointerStart.panelW + dx) / pointerStart.panelW, 0, 1);
  artworkState.y = clamp((pointerStart.startY * pointerStart.panelW + dy) / pointerStart.panelW, 0, 1);
  draw();
});

canvas.addEventListener('pointerup', (e)=>{
  pointerDown = false;
  pointerStart = null;
  try{ canvas.releasePointerCapture && canvas.releasePointerCapture(e.pointerId); }catch(e){}
});

canvas.addEventListener('wheel', (e)=>{
  if(!artworkImg) return;
  e.preventDefault();
  const delta = -e.deltaY;
  const factor = delta > 0 ? 1.06 : 0.94;
  artworkState.scale = clamp(artworkState.scale * factor, 0.02, 3.0);
  draw();
}, {passive:false});

window.addEventListener('keydown', (e)=>{
  if(!artworkImg) return;
  if(e.key === '+' || e.key === '='){ artworkState.scale = clamp(artworkState.scale * 1.06, 0.02, 3.0); draw(); }
  if(e.key === '-') { artworkState.scale = clamp(artworkState.scale * 0.94, 0.02, 3.0); draw(); }
});

/* --- Helpers --- */
function getCanvasLogicalXY(ev){
  const rect = canvas.getBoundingClientRect();
  const DPR = window.devicePixelRatio || 1;
  const x = (ev.clientX - rect.left) * (canvas.width / rect.width) / DPR;
  const y = (ev.clientY - rect.top) * (canvas.height / rect.height) / DPR;
  return { x, y };
}

/* --- Buttons --- */
downloadBtn.addEventListener('click', downloadPNG);
recordBtn.addEventListener('click', ()=> record8s().catch(err=>{ alert('Erro: '+err.message); }));
fixBtn.addEventListener('click', ()=>{ fixArtwork = !fixArtwork; fixBtn.textContent = fixArtwork ? '🔒 Arte Fixada' : '📌 Fixar Arte'; });
rotateLeft.addEventListener('click', ()=>{ if(artworkImg){ artworkState.rotation = (artworkState.rotation||0) - 10; draw(); }});
rotateRight.addEventListener('click', ()=>{ if(artworkImg){ artworkState.rotation = (artworkState.rotation||0) + 10; draw(); }});

/* --- Init --- */
(async function init(){
  msg.textContent = 'Carregando...';
  await preloadModels();
  if(loadedModels.length === 0){
    msg.textContent = 'Nenhum modelo encontrado em /copos/. Verifique nomes.';
    return;
  }
  buildUI();
  draw();
  msg.textContent = '';
})();

/* Expose a function to set tint color by hex (if needed externally) */
window.setTint = (hex)=>{ tintColor = hex; draw(); };
