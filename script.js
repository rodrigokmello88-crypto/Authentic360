const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let imagemAtual = new Image();
let corAtual = '#ffffff';
let arte = null;
let modeloAtual = 'caneca';

function carregarImagem(nome) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = `${nome}_png.png`;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
}

async function trocarCopo(modelo) {
  modeloAtual = modelo;
  const img = await carregarImagem(modelo);
  imagemAtual = img;
  desenhar();
}

function desenhar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Centralizar e escalar conforme o modelo
  let scale = 0.45; // padrão
  if (modeloAtual === 'espumante') scale = 0.32;
  if (modeloAtual === 'ecologico') scale = 0.4;

  const width = imagemAtual.width * scale;
  const height = imagemAtual.height * scale;
  const x = (canvas.width - width) / 2;
  const y = (canvas.height - height) / 2;

  // pintar com cor sólida
  ctx.fillStyle = corAtual;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "destination-in";
  ctx.drawImage(imagemAtual, x, y, width, height);
  ctx.globalCompositeOperation = "source-over";

  // aplicar arte
  if (arte) {
    ctx.drawImage(arte, x, y, width, height);
  }
}

function mudarCor(cor) {
  corAtual = cor;
  desenhar();
}

function enviarArte(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    arte = new Image();
    arte.src = e.target.result;
    arte.onload = desenhar;
  };
  reader.readAsDataURL(file);
}

function gerarVideo() {
  alert('Função de vídeo 360º em desenvolvimento');
}

function baixarImagem() {
  const link = document.createElement('a');
  link.download = `${modeloAtual}.png`;
  link.href = canvas.toDataURL();
  link.click();
}

trocarCopo('caneca');
