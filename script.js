const canvas = document.getElementById("canvasCopo");
const ctx = canvas.getContext("2d");
let imagemAtual = new Image();
let corAtual = "#ffffff";

// Mantém o tamanho fixo e centralizado
canvas.width = 360;
canvas.height = 360;

// Caminhos dos copos
const modelos = {
  'caneca_png.png': 'copos/caneca_png.png',
  'caneca_slim_png.png': 'copos/caneca_slim_png.png',
  'ecologico.png': 'copos/ecologico.png',
  'espumante.png': 'copos/espumante.png',
  'squeeze.png': 'copos/squeeze.png',
  'taca_gin.png': 'copos/taca_gin.png',
  'twister.png': 'copos/twister.png',
  'xicara.png': 'copos/xicara.png'
};

// Função para carregar e desenhar o copo
function trocarCopo(modelo) {
  if (!modelos[modelo]) return;
  imagemAtual.src = modelos[modelo];
  imagemAtual.onload = () => desenharCopo();
}

// Função para desenhar com cor aplicada (mistura verdadeira)
function desenharCopo() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // desenha a cor base
  ctx.fillStyle = corAtual;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // desenha o copo com mistura real
  ctx.globalCompositeOperation = "destination-in";
  ctx.drawImage(imagemAtual, 0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "source-over";
}

// Muda cor
function mudarCor(cor) {
  corAtual = cor;
  desenharCopo();
}

// Baixar imagem
function baixarImagem() {
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "copo_colorido.png";
  link.click();
}

// Upload da arte
document.getElementById("uploadArte").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const arte = document.getElementById("arte");
    arte.src = e.target.result;
    arte.style.display = "block";
  };
  reader.readAsDataURL(file);
});

// Copo inicial
imagemAtual.src = modelos["caneca_png.png"];
imagemAtual.onload = () => desenharCopo();
