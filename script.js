const canvas = document.getElementById('cupCanvas');
const ctx = canvas.getContext('2d');
let currentCup = 'copos/caneca_png.png';
let currentColor = 'white';
let artImage = null;

// Carrega e desenha o copo
function loadCup() {
  const img = new Image();
  img.src = currentCup;
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Centraliza proporcionalmente
    const ratio = Math.min(
      canvas.width * 0.8 / img.width,
      canvas.height * 0.8 / img.height
    );
    const newWidth = img.width * ratio;
    const newHeight = img.height * ratio;
    const x = (canvas.width - newWidth) / 2;
    const y = (canvas.height - newHeight) / 2;

    // Cor de fundo (base para "pintar")
    ctx.fillStyle = currentColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Máscara do copo (respeita transparência)
    ctx.globalCompositeOperation = 'destination-in';
    ctx.drawImage(img, x, y, newWidth, newHeight);

    // Restaura e desenha a arte
    ctx.globalCompositeOperation = 'source-over';
    if (artImage) {
      const artW = newWidth * 0.5;
      const artH = newHeight * 0.5;
      const artX = x + (newWidth - artW) / 2;
      const artY = y + (newHeight - artH) / 2;
      ctx.drawImage(artImage, artX, artY, artW, artH);
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
