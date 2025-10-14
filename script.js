const canvas = document.getElementById("mockupCanvas");
const ctx = canvas.getContext("2d");
const modelSelect = document.getElementById("modelSelect");
const swatchesContainer = document.getElementById("swatches");
const downloadBtn = document.getElementById("downloadBtn");
const generate360Btn = document.getElementById("generate360Btn");

const cores = ["#ffffff", "#007bff", "#00a6ff", "#000000", "#f1c232"];
let imagemAtual = new Image();
let corAtual = "#ffffff";

function desenharMockup() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = corAtual;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const escala = 0.5; // reduz o tamanho do copo
  const largura = imagemAtual.width * escala;
  const altura = imagemAtual.height * escala;
  const x = (canvas.width - largura) / 2;
  const y = (canvas.height - altura) / 2;

  ctx.drawImage(imagemAtual, x, y, largura, altura);
}

function carregarImagem(nomeArquivo) {
  imagemAtual.src = `copos/${nomeArquivo}`;
  imagemAtual.onload = desenharMockup;
}

modelSelect.addEventListener("change", (e) => {
  carregarImagem(e.target.value);
});

cores.forEach(cor => {
  const sw = document.createElement("div");
  sw.style.background = cor;
  sw.addEventListener("click", () => {
    corAtual = cor;
    desenharMockup();
  });
  swatchesContainer.appendChild(sw);
});

downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "mockup.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

generate360Btn.addEventListener("click", async () => {
  alert("⏳ Em breve: geração automática do vídeo 360°");
});

carregarImagem(modelSelect.value);
