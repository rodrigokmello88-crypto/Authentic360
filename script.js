const models = [
  { name: "Caneca", file: "caneca_png.png" },
  { name: "Caneca Slim", file: "caneca_slim_png.png" },
  { name: "Ecológico", file: "ecologico.png" },
  { name: "Espumante", file: "espumante.png" },
  { name: "Squeeze", file: "squeeze.png" },
  { name: "Taça Gin", file: "taca_gin.png" },
  { name: "Twister", file: "twister.png" },
  { name: "Xícara", file: "xicara.png" }
];

const canvas = document.getElementById("mockupCanvas");
const ctx = canvas.getContext("2d");
let currentModel = null;
let currentColor = "#cccccc";

function loadModelList() {
  const list = document.getElementById("modelsList");
  models.forEach(m => {
    const li = document.createElement("li");
    li.textContent = m.name;
    li.onclick = () => loadModel(m.file);
    list.appendChild(li);
  });
}

function loadColorButtons() {
  const swatches = document.getElementById("swatches");
  const colors = [
    { name: "Cinza", value: "#bfbfbf" },
    { name: "Azul", value: "#4fa9ff" },
    { name: "Branco", value: "#ffffff" },
    { name: "Preto", value: "#000000" }
  ];

  colors.forEach(c => {
    const btn = document.createElement("button");
    btn.className = "color-btn";
    btn.style.background = c.value;
    btn.onclick = () => {
      currentColor = c.value;
      drawModel();
    };
    swatches.appendChild(btn);
  });
}

function loadModel(file) {
  currentModel = new Image();
  currentModel.src = `copos/${file}`;
  currentModel.onload = drawModel;
}

function drawModel() {
  if (!currentModel) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = currentColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const w = currentModel.width * 0.8;
  const h = currentModel.height * 0.8;
  const x = (canvas.width - w) / 2;
  const y = (canvas.height - h) / 2;
  ctx.drawImage(currentModel, x, y, w, h);
}

// Geração de vídeo 360° automático (8 segundos)
async function generateVideo() {
  const frames = 240; // 30fps * 8s
  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, {
    mimeType: "video/webm;codecs=vp9",
    videoBitsPerSecond: 2500000
  });
  const chunks = [];

  recorder.ondataavailable = e => chunks.push(e.data);
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: "video/webm" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "mockup360.webm";
    a.click();
  };

  recorder.start();

  let angle = 0;
  const spinInterval = setInterval(() => {
    angle += (Math.PI * 2) / frames;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angle);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    drawModel();
    ctx.restore();
  }, 1000 / 30);

  setTimeout(() => {
    clearInterval(spinInterval);
    recorder.stop();
  }, 8000);
}

document.getElementById("generateVideoBtn").onclick = generateVideo;
loadModelList();
loadColorButtons();
