const canvas = document.getElementById('mockupCanvas');
const ctx = canvas.getContext('2d');
const modelSelect = document.getElementById('modelSelect');
const colorButtons = document.querySelectorAll('.color-btn');
const uploadInput = document.getElementById('imageUpload');
const downloadBtn = document.getElementById('downloadImage');
const videoBtn = document.getElementById('generateVideo');

let currentModel = new Image();
let uploadedImage = null;
let currentColor = '#ffffff';
let angle = 0;

function loadModel(src) {
  const img = new Image();
  img.src = src;
  img.onload = () => {
    currentModel = img;
    drawModel();
  };
  img.onerror = e => console.error("Erro ao carregar imagem:", src, e);
}

function drawModel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // fundo
  const fundo = new Image();
  fundo.src = "fundos.png";
  ctx.drawImage(fundo, 0, 0, canvas.width, canvas.height);

  // copo com cor
  if (currentModel.complete) {
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angle * Math.PI / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    ctx.drawImage(currentModel, 100, 100, 200, 300); // proporção reduzida

    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = currentColor;
    ctx.fillRect(100, 100, 200, 300);
    ctx.globalCompositeOperation = 'source-over';

    if (uploadedImage) {
      ctx.drawImage(uploadedImage, 150, 180, 100, 100);
    }
    ctx.restore();
  }
}

colorButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    currentColor = btn.getAttribute('data-color');
    drawModel();
  });
});

uploadInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = () => {
    uploadedImage = img;
    drawModel();
  };
});

downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'mockup.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

videoBtn.addEventListener('click', async () => {
  const chunks = [];
  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9' });

  recorder.ondataavailable = e => chunks.push(e.data);
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'video360.webm';
    a.click();
  };

  recorder.start();

  let frame = 0;
  const totalFrames = 240; // 8 segundos * 30 fps

  function animate() {
    if (frame < totalFrames) {
      angle += 1.5;
      drawModel();
      frame++;
      requestAnimationFrame(animate);
    } else {
      recorder.stop();
    }
  }
  animate();
});

modelSelect.addEventListener('change', e => {
  loadModel(e.target.value);
});

loadModel('copos/caneca_png.png');
