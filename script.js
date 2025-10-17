// Elementos principais
const modeloImg = document.getElementById("modelo");
const inputArquivo = document.getElementById("upload");
const enviarBtn = document.getElementById("enviar");
const baixarBtn = document.getElementById("baixar");
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

let arte = null;
let posX = 250, posY = 180, scale = 1, rotation = 0;
let dragging = false, lastX, lastY;

// Função para trocar o modelo
function trocarModelo(src) {
  modeloImg.src = src;
  arte = null;
}
window.trocarModelo = trocarModelo;

// Upload da arte
enviarBtn.addEventListener("click", () => {
  const file = inputArquivo.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => arte = img;
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

// Desenhar no canvas
function desenhar() {
  const container = document.getElementById("preview");
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const img = modeloImg;
  const ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
  const newWidth = img.width * ratio;
  const newHeight = img.height * ratio;
  const x = (canvas.width - newWidth) / 2;
  const y = (canvas.height - newHeight) / 2;

  ctx.drawImage(img, x, y, newWidth, newHeight);

  if (arte) {
    ctx.save();
    ctx.translate(posX, posY);
    ctx.rotate(rotation);
    ctx.scale(scale, scale);
    ctx.drawImage(arte, -arte.width / 2, -arte.height / 2);
    ctx.restore();
  }

  requestAnimationFrame(desenhar);
}
requestAnimationFrame(desenhar);

// Movimento e redimensionamento da arte
canvas.addEventListener("mousedown", e => {
  dragging = true;
  lastX = e.offsetX;
  lastY = e.offsetY;
});
canvas.addEventListener("mouseup", () => dragging = false);
canvas.addEventListener("mousemove", e => {
  if (dragging && arte) {
    const dx = e.offsetX - lastX;
    const dy = e.offsetY - lastY;
    posX += dx;
    posY += dy;
    lastX = e.offsetX;
    lastY = e.offsetY;
  }
});

// Zoom com scroll
canvas.addEventListener("wheel", e => {
  if (!arte) return;
  e.preventDefault();
  scale *= e.deltaY < 0 ? 1.05 : 0.95;
});

// Rotação com tecla R + movimento do mouse
document.addEventListener("keydown", e => {
  if (e.key === "r") {
    document.addEventListener("mousemove", rotacionar);
  }
});
document.addEventListener("keyup", e => {
  if (e.key === "r") {
    document.removeEventListener("mousemove", rotacionar);
  }
});
function rotacionar(e) {
  rotation += e.movementX * 0.01;
}

// Adiciona o canvas sobre a imagem
modeloImg.parentElement.style.position = "relative";
canvas.style.position = "absolute";
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.pointerEvents = "auto";
modeloImg.parentElement.appendChild(canvas);

// Gerar vídeo 360° (gera frames e baixa ZIP)
baixarBtn.addEventListener("click", async () => {
  const frames = 36;
  const zip = new JSZip();

  for (let i = 0; i < frames; i++) {
    rotation = (i / frames) * Math.PI * 2;
    await new Promise(r => setTimeout(r, 10));
    const imgData = canvas.toDataURL("image/png");
    const base64Data = imgData.split(",")[1];
    zip.file(`frame_${i.toString().padStart(2, "0")}.png`, base64Data, { base64: true });
  }

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "video360.zip";
  a.click();
});
