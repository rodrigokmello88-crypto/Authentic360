const models = [
  "caneca_png.png",
  "caneca_slim_png.png",
  "ecologico.png",
  "espumante.png",
  "squeeze.png",
  "taca_gin.png",
  "twister.png",
  "xicara.png"
];

const modelsList = document.getElementById("modelsList");
const canvas = document.getElementById("mockupCanvas");
const ctx = canvas.getContext("2d");

let currentModel = null;
let rotation = 0;

// Mostra todos os modelos clicáveis
models.forEach(model => {
  const img = document.createElement("img");
  img.src = `copos/${model}`;
  img.alt = model;
  img.onclick = () => loadModel(model);
  modelsList.appendChild(img);
});

// Carrega o modelo no canvas
function loadModel(modelName) {
  const img = new Image();
  img.src = `copos/${modelName}`;
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const scale = 0.9;
    const x = (canvas.width - img.width * scale) / 2;
    const y = (canvas.height - img.height * scale) / 2;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    currentModel = img;
  };
}

// Botão de download
document.getElementById("downloadBtn").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "mockup.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

// Botão de gerar vídeo 360°
document.getElementById("videoBtn").addEventListener("click", async () => {
  if (!currentModel) {
    alert("Escolha um modelo primeiro!");
    return;
  }
  const frames = [];
  const totalFrames = 36;
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext("2d");

  for (let i = 0; i < totalFrames; i++) {
    tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.save();
    tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
    tempCtx.rotate((i / totalFrames) * 2 * Math.PI);
    tempCtx.drawImage(currentModel, -currentModel.width / 2, -currentModel.height / 2);
    tempCtx.restore();
    frames.push(tempCanvas.toDataURL("image/png"));
  }

  alert("🎥 Simulação de vídeo 360° gerada! (integração real com WebM pode ser adicionada depois)");
});
