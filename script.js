// ====== Config ======
const modelFiles = [
  'copos/twister.png',
  'copos/caneca_png.png',
  'copos/caneca_slim_png.png',
  'copos/ecologico.png',
  'copos/espumante.png',
  'copos/squeeze.png',
  'copos/taca_gin.png',
  'copos/xicara.png'
];

// cores disponíveis (hex)
const colors = [
  {name:'Branco', hex:'#ffffff'},
  {name:'Preto', hex:'#000000'},
  {name:'Azul', hex:'#007BFF'},
  {name:'Rosa', hex:'#FF69B4'},
  {name:'Amarelo', hex:'#FFD700'},
  {name:'Verde', hex:'#28a745'},
  {name:'Roxo', hex:'#800080'}
];

// ====== DOM ======
const modelsList = document.getElementById('modelsList');
const swatches = document.getElementById('swatches');
const canvas = document.getElementById('mockupCanvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');

let currentModelIndex = 0;
let currentTint = null;
const loadedImages = [];

// helper load image
function loadImage(src){
  return new Promise((res, rej) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => res(img);
    img.onerror = (e) => rej(e);
    img.src = src;
  });
}

// preload all models
async function preloadModels(){
  for(let i=0;i<modelFiles.length;i++){
    try{
      const img = await loadImage(modelFiles[i]);
      loadedImages.push({src:modelFiles[i], img});
    }catch(err){
      console.warn('Falha ao carregar', modelFiles[i], err);
    }
  }
}

// render listing thumbnails
function buildModelList(){
  modelsList.innerHTML = '';
  loadedImages.forEach((it, idx) => {
    const item = document.createElement('div');
    item.className = 'model-item';
    item.dataset.index = idx;
    item.innerHTML = `<img src="${it.src}" alt="" /><div class="label">${getLabelFromFilename(it.src)}</div>`;
    item.addEventListener('click', () => {
      currentModelIndex = idx;
      draw();
    });
    modelsList.appendChild(item);
  });
}

// friendly label from filename
function getLabelFromFilename(path){
  const fn = path.split('/').pop().replace('.png','').replace(/_/g,' ');
  return fn.charAt(0).toUpperCase()+fn.slice(1);
}

// build swatches
function buildSwatches(){
  swatches.innerHTML = '';
  colors.forEach(c=>{
    const b = document.createElement('div');
    b.className = 'color-swatch';
    b.title = c.name;
    b.style.background = c.hex;
    b.addEventListener('click', ()=> {
      currentTint = c.hex;
      draw();
    });
    swatches.appendChild(b);
  });
}

// draw current scene to canvas
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const item = loadedImages[currentModelIndex];
  if(!item || !item.img) return;

  // scale to fit canvas: leave some top offset for realistic placement
  const img = item.img;
  const maxW = canvas.width * 0.6; // cup width relative
  const scale = Math.min(maxW / img.width, (canvas.height * 0.6) / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  const dx = (canvas.width - dw) / 2;
  const dy = (canvas.height - dh) / 2 + 20;

  // draw subtle shadow
  ctx.save();
  ctx.translate(canvas.width/2, dy+dh*0.6);
  ctx.scale(1, 0.28);
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.beginPath();
  ctx.ellipse(0,0, dw*0.55, dw*0.55, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();

  // draw base image to offscreen canvas to tint
  const off = document.createElement('canvas');
  off.width = img.width;
  off.height = img.height;
  const offCtx = off.getContext('2d');
  offCtx.clearRect(0,0,off.width,off.height);
  offCtx.drawImage(img,0,0);

  if(currentTint){
    // apply tint by source-atop
    offCtx.globalCompositeOperation = 'source-atop';
    offCtx.fillStyle = currentTint;
    offCtx.fillRect(0,0,off.width,off.height);
    offCtx.globalCompositeOperation = 'source-over';
  }

  // draw onto main canvas with slight perspective scaling if desired
  ctx.drawImage(off, 0, 0, off.width, off.height, dx, dy, dw, dh);
}

// download canvas as PNG
function downloadImage(){
  const link = document.createElement('a');
  link.download = 'mockup_autenti.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// initialization
async function init(){
  await preloadModels();
  if(loadedImages.length === 0){
    console.error('Nenhuma imagem carregada — verifique /copos/');
    // show fallback text
    ctx.fillStyle = '#fff';
    ctx.font = '16px sans-serif';
    ctx.fillText('Nenhum modelo encontrado em /copos/', 20, 40);
    return;
  }
  buildModelList();
  buildSwatches();
  // default draw first
  draw();
}

// event listeners
downloadBtn.addEventListener('click', downloadImage);

// run
init();
