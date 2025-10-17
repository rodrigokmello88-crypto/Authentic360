const canvas = document.getElementById('cupCanvas');
const ctx = canvas.getContext('2d');
let currentCup = 'copos/caneca_png.png';
let currentColor = 'white';
let artImage = null;

canvas.width = 500;
canvas.height = 500;

function loadCup() {
  const img = new Image();
  img.src = currentCup;
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    // Pintar cor
    ctx.fillStyle = currentColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Aplicar máscara transparente do copo
    ctx.globalCompositeOperation = 'destination-in';
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Adiciona arte
    if (artImage) {
      ctx.globalCompositeOperation = 'source-over';
      const w = canvas.width * 0.5;
      const h = canvas.height * 0.5;
      ctx.drawImage(artImage, canvas.width / 2 - w / 2, canvas.height / 2 - h / 2, w, h);
    }
  };
}

function changeCup(fileName) {
  currentCup = `copos/${fileName}`;
  loadCup();
}

function setColor(color) {
  currentColor = color;
  loadCup();
}

document.getElementById('uploadInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    artImage = new Image();
    artImage.src = e.target.result;
    artImage.onload = loadCup;
  };
  reader.readAsDataURL(file);
});

loadCup();
