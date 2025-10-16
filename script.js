const canvas = document.getElementById("cupCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 400;

let currentColor = "#ffffff";
let uploadedImage = null;
let cupImage = new Image();
cupImage.src = "copos/caneca_png.png";

// Função principal de desenho
function drawCup() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenhar o copo base
  ctx.drawImage(cupImage, 0, 0, canvas.width, canvas.height);

  // Aplicar cor sólida (sem sombra)
  ctx.globalCompositeOperation = "source-atop";
  ctx.fillStyle = currentColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "source-over";

  // Se houver imagem de arte enviada, aplicar no centro
  if (uploadedImage) {
    const w = canvas.width * 0.6;
    const h = canvas.height * 0.4;
    const x = (canvas.width - w) / 2;
    const y = (canvas.height - h) / 2;
    ctx.drawImage(uploadedImage, x, y, w, h);
  }
}

// Quando a imagem do copo carregar
cupImage.onload = drawCup;

// Trocar modelo
document.getElementById("cupSelect")?.addEventListener("change", (e) => {
  cupImage.src = `copos/${e.target.value}`;
});

// Trocar cor do copo
document.querySelectorAll(".color-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    currentColor = btn.dataset.color;
    drawCup();
  });
});

// Upload de imagem
document.getElementById("uploadInput")?.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const img = new Image();
  img.onload = () => {
    uploadedImage = img;
    drawCup();
  };
  img.src = URL.createObjectURL(file);
});

// Botão de download
document.getElementById("downloadBtn")?.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "mockup.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

// Gerar vídeo 360 (placeholder)
document.getElementById("generateVideoBtn")?.addEventListener("click", () => {
  alert("Geração de vídeo 360° será adicionada em breve!");
});
