const canvas = document.getElementById('cupCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;

let currentColor = "#ffffff";
let uploadedImage = null;
let cupImage = new Image();
cupImage.src = "copos/caneca_png.png";

// Desenhar copo
function drawCup() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!cupImage.complete) return;

  // Cor base
  ctx.drawImage(cupImage, 0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'source-atop';
  ctx.fillStyle = currentColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'source-over';

  // Arte aplicada
  if (uploadedImage) {
    const w = canvas.width * 0.6;
    const h = canvas.height * 0.4;
    ctx.drawImage(uploadedImage, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
  }
}

cupImage.onload = drawCup;

// Alterar modelo
document.getElementById('cupSelect').addEventListener('change', (e) => {
  const model = e.target.value;
  cupImage.src = `copos/${model}`;
});

// Alterar cor
document.querySelectorAll('.color-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentColor = btn.dataset.color;
    drawCup();
  });
});

// Upload de arte
document.getElementById('uploadInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const img = new Image();
  img.onload = () => {
    uploadedImage = img;
    drawCup();
  };
  img.src = URL.createObjectURL(file);
});

// Baixar PNG
document.getElementById('downloadBtn').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'mockup.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

// Simular vídeo 360°
document.getElementById('generateVideoBtn').addEventListener('click', () => {
  alert("Função de gerar vídeo 360° será implementada em breve!");
});
