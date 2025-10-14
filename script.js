const models = [
  { name: "Copo 1 - Twister", file: "twister.png" },
  { name: "Copo 2", file: "copo2.png" },
  { name: "Copo 3", file: "copo3.png" },
  { name: "Xícara", file: "xicara.png" }
];

const colors = ["#ffffff", "#0078ff", "#00aaff", "#111111", "#f4d03f"];

const modelsList = document.getElementById("modelsList");
const canvas = document.getElementById("mockupCanvas");
const ctx = canvas.getContext("2d");
const colorButtons = document.getElementById("colorButtons");

let currentModel = null;
let baseImage = null;
let currentColor = "#ffffff";
let rotation = 0;

// cria lista de modelos (somente nomes)
models.forEach(model => {
  const btn = document.createElement("button");
  btn.className = "model-button";
  btn.textContent = model.name;
  btn.onclick = () => loadModel(model.file);
  modelsList.appendChild(btn);
});

// cria botões de cor
colors.forEach(color => {
  const btn = document.createElement("div");
  btn.className = "color-btn";
  btn.style.background = color;
  btn.onclick = () => {
    currentColor = color;
    drawMockup();
  };
  colorButtons.appendChild(btn);
});

// carregar modelo
function loadModel(modelFile) {
  const img = new Image();
  img.src = `copos/${modelFile}`;
  img.onload = () => {
    baseImage = img;
    drawMockup();
  };
}

// desenhar mockup com cor aplicada
function drawMockup() {
  if (!baseImage) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const scale = 0.6;
  const w = baseImage.width * scale;
  const h = baseImage.height * scale;
  const x = (canvas.width - w) / 2;
  const y = (canvas.height - h) / 2;

  // cor base
  ctx.fillStyle = currentColor;
  ctx.fillRect(x, y, w, h);

  // imagem do copo
  ctx.globalAlpha = 0.85;
  ctx.drawImage(baseImage, x, y, w, h);
  ctx.globalAlpha = 1;
}

// baixar imagem
document.getElementById("downloadBtn").addEventListener("click", () => {
  if (!baseImage) return alert("Escolha um modelo primeiro!");
  const link = document.createElement("a");
  link.download = "mockup.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

// gerar vídeo 360° (versão demo)
document.getElementById("videoBtn").addEventListener("click", () => {
  if (!baseImage) return alert("Escolha um modelo primeiro!");
  alert("🎥 Em breve: geração automática de vídeo 360° (WebM).");
});
