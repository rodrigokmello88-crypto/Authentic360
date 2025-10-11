/* Script: models from /copos (normalized names) */
const modelFiles = [
  './copos/twister.png',
  './copos/caneca_png.png',
  './copos/caneca_slim_png.png',
  './copos/ecologico.png',
  './copos/espumante.png',
  './copos/squeeze.png',
  './copos/taca_gin.png',

];

const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d', { alpha: true });
const overlay = document.getElementById('overlay');
let canvasW = canvas.width, canvasH = canvas.height;

const state = {
  cupImg: null, cupSrc: null, cupTint: '#ffffff',
  artImg: null, artTransform: { x:0, y:0, scale:1, rotation:0 }, artApplied:false
};

const modelSelect = document.getElementById('modelSelect');
modelFiles.forEach(f=>{ const name=f.split('/').pop(); const opt=document.createElement('option'); opt.value=f; opt.textContent=name; modelSelect.appendChild(opt); });

async function loadFirstAvailable(){ for(const f of modelFiles){ try{ const img=await loadImg(f); state.cupImg=img; state.cupSrc=f; modelSelect.value=f; draw(); return;}catch(e){} } state.cupImg=await loadImg('https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Plastic_cup.png/600px-Plastic_cup.png'); state.cupSrc='placeholder'; draw(); }
modelSelect.addEventListener('change', async ()=>{ const val=modelSelect.value; try{ const img=await loadImg(val); state.cupImg=img; state.cupSrc=val; draw(); }catch(e){ console.error(e); } });
loadFirstAvailable();
function loadImg(src){ return new Promise((res,rej)=>{ const img=new Image(); img.crossOrigin='anonymous'; img.onload=()=>res(img); img.onerror=()=>rej(new Error('load error '+src)); img.src=src; }); }

const swatches=['#007BFF','#FF3B30','#FFCC00','#FF9500','#FF2D55','#AF52DE','#000000','#FFFFFF'];
const swatchesContainer=document.getElementById('swatches'); swatches.forEach(c=>{ const d=document.createElement('div'); d.className='color-swatch'; d.style.background=c; d.title=c; d.addEventListener('click', ()=>{ state.cupTint=c; draw();}); swatchesContainer.appendChild(d); });

const artUpload=document.getElementById('artUpload'); const scaleRange=document.getElementById('scaleRange'); const rotateRange=document.getElementById('rotateRange'); const posX=document.getElementById('posX'); const posY=document.getElementById('posY'); const applyBtn=document.getElementById('applyBtn'); const resetBtn=document.getElementById('resetBtn'); let artHandle=null;

artUpload.addEventListener('change',(e)=>{ const f=e.target.files[0]; if(!f) return; const url=URL.createObjectURL(f); const img=new Image(); img.onload=()=>{ state.artImg=img; const defaultScale=Math.min((canvasW*0.4)/img.width,(canvasH*0.4)/img.height); state.artTransform={x:0,y:0,scale:defaultScale,rotation:0}; createArtHandle(); updateSliders(); draw(); }; img.src=url; });

function createArtHandle(){ if(artHandle){ artHandle.remove(); artHandle=null; } if(!state.artImg) return; artHandle=document.createElement('div'); artHandle.className='art-handle'; overlay.appendChild(artHandle); overlay.style.pointerEvents='auto'; const resize=document.createElement('div'); resize.className='resize-handle'; artHandle.appendChild(resize); function refresh(){ const t=state.artTransform; const w=state.artImg.width*t.scale; const h=state.artImg.height*t.scale; const cx=canvasW/2+t.x; const cy=canvasH/2+t.y; artHandle.style.width=Math.max(30,w)+'px'; artHandle.style.height=Math.max(30,h)+'px'; artHandle.style.left=(cx-w/2)+'px'; artHandle.style.top=(cy-h/2)+'px'; artHandle.style.transform='rotate('+t.rotation+'deg)'; } let dragging=false, start={x:0,y:0}, startT=null; artHandle.addEventListener('pointerdown',(ev)=>{ if(ev.target.classList.contains('resize-handle')) return; dragging=true; artHandle.setPointerCapture(ev.pointerId); start={x:ev.clientX,y:ev.clientY}; startT={...state.artTransform}; }); window.addEventListener('pointermove',(ev)=>{ if(!dragging) return; const dx=(ev.clientX-start.x)*(canvasW/overlay.clientWidth); const dy=(ev.clientY-start.y)*(canvasH/overlay.clientHeight); state.artTransform.x=startT.x+dx; state.artTransform.y=startT.y+dy; updateSliders(); refresh(); draw(); }); window.addEventListener('pointerup',(ev)=>{ dragging=false; try{ artHandle.releasePointerCapture(ev.pointerId);}catch(e){} }); let resizing=false, rstart=null, startScale=1; resize.addEventListener('pointerdown',(ev)=>{ resizing=true; resize.setPointerCapture(ev.pointerId); rstart={x:ev.clientX,y:ev.clientY}; startScale=state.artTransform.scale; ev.stopPropagation(); }); window.addEventListener('pointermove',(ev)=>{ if(!resizing) return; const dy=(ev.clientY-rstart.y); const factor=1+dy/200; state.artTransform.scale=Math.max(0.05,startScale*factor); updateSliders(); refresh(); draw(); }); window.addEventListener('pointerup',(ev)=>{ resizing=false; try{ resize.releasePointerCapture(ev.pointerId);}catch(e){} }); refresh(); }

function updateSliders(){ scaleRange.value=Math.round(state.artTransform.scale*100); rotateRange.value=Math.round(state.artTransform.rotation); posX.value=Math.round(state.artTransform.x); posY.value=Math.round(state.artTransform.y); }
scaleRange.addEventListener('input',()=>{ state.artTransform.scale=scaleRange.value/100; createArtHandle(); draw(); });
rotateRange.addEventListener('input',()=>{ state.artTransform.rotation=parseFloat(rotateRange.value); createArtHandle(); draw(); });
posX.addEventListener('input',()=>{ state.artTransform.x=parseFloat(posX.value); createArtHandle(); draw(); });
posY.addEventListener('input',()=>{ state.artTransform.y=parseFloat(posY.value); createArtHandle(); draw(); });

applyBtn.addEventListener('click',()=>{ state.artApplied=true; if(artHandle){ artHandle.remove(); artHandle=null; overlay.style.pointerEvents='none'; } draw(); });
resetBtn.addEventListener('click',()=>{ state.artImg=null; state.artApplied=false; if(artHandle){ artHandle.remove(); artHandle=null; overlay.style.pointerEvents='none'; } draw(); });

function draw(rotationAngle=0){ ctx.clearRect(0,0,canvasW,canvasH); const cx=canvasW/2, cy=canvasH/2; if(state.cupImg){ const amplitude=0.45; const skew=Math.sin(rotationAngle)*amplitude; const perspectiveShift=Math.sin(rotationAngle)*0.12; const baseW=Math.min(canvasW*0.5,state.cupImg.width*0.9); const scaleY=(baseW/state.cupImg.width)*1.05; const scaleX=scaleY*(1-Math.abs(skew)*0.4); const shadowW=baseW*(1+Math.abs(skew)*0.6); ctx.save(); ctx.translate(cx+perspectiveShift*canvasW*0.08, cy+baseW*0.26); ctx.scale(1,0.35); ctx.fillStyle='rgba(0,0,0,0.45)'; ctx.beginPath(); ctx.ellipse(0,0,shadowW*0.6,shadowW*0.6,0,0,Math.PI*2); ctx.fill(); ctx.restore(); const off=document.createElement('canvas'); off.width=state.cupImg.width; off.height=state.cupImg.height; const offCtx=off.getContext('2d'); offCtx.drawImage(state.cupImg,0,0); offCtx.fillStyle=state.cupTint; offCtx.globalCompositeOperation='source-atop'; offCtx.fillRect(0,0,off.width,off.height); offCtx.globalCompositeOperation='source-over'; const dw=baseW; const dh=state.cupImg.height*(dw/state.cupImg.width); const dx=cx-(dw/2)+perspectiveShift*canvasW*0.12; const dy=cy-(dh/2)-30; ctx.save(); ctx.translate(dx+dw/2,dy+dh/2); ctx.scale(scaleX/scaleY,1*scaleY); ctx.drawImage(off,-state.cupImg.width/2,-state.cupImg.height/2,state.cupImg.width,state.cupImg.height); ctx.restore(); } if(state.artImg){ const t=state.artTransform; const aw=state.artImg.width*t.scale; const ah=state.artImg.height*t.scale; const ax=canvasW/2+t.x; const ay=canvasH/2+t.y; ctx.save(); ctx.translate(ax,ay); ctx.rotate(t.rotation*Math.PI/180); ctx.drawImage(state.artImg,-aw/2,-ah/2,aw,ah); ctx.restore(); } }

function resizeCanvas(){ const rect=canvas.getBoundingClientRect(); const cssW=Math.min(rect.width, window.innerWidth-60); const newW=Math.floor(Math.min(900, Math.max(480, cssW))); canvas.width=newW; canvas.height=newW; canvasW=canvas.width; canvasH=canvas.height; overlay.style.width=canvas.getBoundingClientRect().width+'px'; overlay.style.height=canvas.getBoundingClientRect().height+'px'; draw(); }
window.addEventListener('resize', resizeCanvas); setTimeout(resizeCanvas,120);

document.getElementById('exportImageBtn').addEventListener('click', async ()=>{ if(!state.cupImg){ alert('Carregue um modelo primeiro'); return; } const finalW=2000; const finalH=Math.round(finalW*(canvasH/canvasW)); const fcan=document.createElement('canvas'); fcan.width=finalW; fcan.height=finalH; const fctx=fcan.getContext('2d'); fctx.clearRect(0,0,finalW,finalH); const off=document.createElement('canvas'); off.width=state.cupImg.width; off.height=state.cupImg.height; const offCtx=off.getContext('2d'); offCtx.drawImage(state.cupImg,0,0); offCtx.fillStyle=state.cupTint; offCtx.globalCompositeOperation='source-atop'; offCtx.fillRect(0,0,off.width,off.height); offCtx.globalCompositeOperation='source-over'; const baseW=Math.min(finalW*0.5,state.cupImg.width*0.9*(finalW/canvasW)); const dw=baseW; const dh=state.cupImg.height*(dw/state.cupImg.width); const dx=(finalW/2-dw/2); const dy=(finalH/2-dh/2)-30*(finalW/canvasW); fctx.drawImage(off,dx,dy,dw,dh); if(state.artImg){ const t=state.artTransform; const scaleFactor=finalW/canvasW; const aw=state.artImg.width*t.scale*scaleFactor; const ah=state.artImg.height*t.scale*scaleFactor; const ax=finalW/2+t.x*scaleFactor; const ay=finalH/2+t.y*scaleFactor; fctx.save(); fctx.translate(ax,ay); fctx.rotate(t.rotation*Math.PI/180); fctx.drawImage(state.artImg,-aw/2,-ah/2,aw,ah); fctx.restore(); } const url=fcan.toDataURL('image/png'); const a=document.createElement('a'); a.href=url; a.download='mockup_final.png'; a.click(); });

document.getElementById('exportVideoBtn').addEventListener('click', async ()=>{ if(!state.cupImg){ alert('Carregue um modelo primeiro'); return; } const fps=30, durationSec=6, totalFrames=fps*durationSec; const stream=canvas.captureStream(fps); let mime='video/webm; codecs=vp9'; if(!MediaRecorder.isTypeSupported(mime)) mime='video/webm; codecs=vp8'; if(!MediaRecorder.isTypeSupported(mime)) mime='video/webm'; const recorder=new MediaRecorder(stream,{ mimeType: mime }); const chunks=[]; recorder.ondataavailable=e=>{ if(e.data.size) chunks.push(e.data); }; recorder.onstop=()=>{ const blob=new Blob(chunks,{ type: 'video/webm' }); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='mockup_360.webm'; a.click(); URL.revokeObjectURL(url); }; recorder.start(); let f=0; if(artHandle) artHandle.style.pointerEvents='none'; function step(){ const t=f/totalFrames; const angle=t*Math.PI*2; draw(angle); f++; if(f<=totalFrames) requestAnimationFrame(step); else{ recorder.stop(); if(artHandle) artHandle.style.pointerEvents='auto'; draw(0); } } step(); });

async function tryPreload(){ for(const f of modelFiles){ try{ await loadImg(f); }catch(e){} } } tryPreload();