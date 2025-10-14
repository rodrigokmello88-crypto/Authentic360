const models = {
  twister: "copos/twister.png",
  caneca: "copos/caneca.png",
  caneca_slim: "copos/caneca_slim.png",
  taca_gin: "copos/taca_gin.png",
  espumante: "copos/espumante.png",
  ecologico: "copos/ecologico.png",
  squeeze: "copos/squeeze.png",
  xicara: "copos/xicara.png",
};

let currentModel = "twister";
let currentColor = "#ffffff";
let rotation = 0;
let isDragging = false;
let lastX = 0;

const canvas = document.getElementById("previewCanvas");
const ctx = canvas.getContext("2d", { alpha: true });
const modelList = document.getElementById("modelList");
const downloadBtn = document.getElementById("downloadBtn");
const recordBtn = document.getElementById("recordBtn");

const fundo = new Image();
fundo.src = "fundos.png";

const img = new Image();
img.src = models[currentModel];
img.onload = () => drawModel();

function drawModel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // fundo no preview
  ctx.globalAlpha = 0.3;
  ctx.drawImage(fundo, 0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1;

  const scale = 1.9; // copos 60% maiores
  const width = 200 * scale;
  const height = 300 * scale;
  const x = canvas.width / 2 - width / 2;
  const y = canvas.height / 2 - height / 2;

  const angle = (rotation % 360) * (Math.PI / 180);
  const perspective = 0.8 + 0.2 * Math.cos(angle);
  const drawWidth = width * perspective;

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.drawImage(img, -drawWidth / 2, -height / 2, drawWidth, height);

  ctx.globalCompositeOperation = "source-atop";
  ctx.fillStyle = currentColor;
  ctx.fillRect(-drawWidth / 2, -height / 2, drawWidth, height);
  ctx.restore();

  ctx.globalCompositeOperation = "source-over";
}

// rotação manual com o mouse
canvas.addEventListener("mousedown", (e) => {
  isDragging = true;
  lastX = e.clientX;
});
canvas.addEventListener("mouseup", () => (isDragging = false));
canvas.addEventListener("mouseleave", () => (isDragging = false));
canvas.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  rotation += (e.clientX - lastX) * 0.8;
  lastX = e.clientX;
  drawModel();
});

// troca de modelo
modelList.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    document.querySelectorAll("#modelList li").forEach((li) => li.classList.remove("active"));
    e.target.classList.add("active");
    currentModel = e.target.dataset.model;
    img.src = models[currentModel];
  }
});

// troca de cor
document.querySelectorAll(".color-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    currentColor = btn.dataset.color;
    drawModel();
  });
});

// baixar imagem PNG
downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `${currentModel}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
});

// gerar vídeo 360° (8s com transparência)
recordBtn.addEventListener("click", async () => {
  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, {
    mimeType: "video/webm;codecs=vp9",
  });
  const chunks = [];
  recorder.ondataavailable = (e) => chunks.push(e.data);
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentModel}_360.webm`;
    a.click();
  };

  recorder.start();
  const totalFrames = 8 * 30;
  for (let i = 0; i < totalFrames; i++) {
    rotation += 360 / totalFrames;
    drawModel();
    await new Promise((r) => requestAnimationFrame(r));
  }
  recorder.stop();
});
