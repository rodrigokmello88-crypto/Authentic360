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

function trocarCopo(modelo) {
  const img = document.getElementById('copo');
  const tinta = document.getElementById('tinta');

  if (modelos[modelo]) {
    img.src = modelos[modelo];
    tinta.style.setProperty('--mask-img', `url(${modelos[modelo]})`);
    tinta.style.backgroundColor = "transparent";

    switch (modelo) {
      case 'espumante.png':
      case 'taca_gin.png':
        img.style.width = "33%";
        tinta.style.width = "33%";
        break;
      case 'squeeze.png':
      case 'twister.png':
        img.style.width = "36%";
        tinta.style.width = "36%";
        break;
      default:
        img.style.width = "42%";
        tinta.style.width = "42%";
    }
  }
}

function mudarCor(cor) {
  const tinta = document.getElementById('tinta');
  tinta.style.backgroundColor = cor;
}

function gerarVideo() {
  alert("🎥 Gerando vídeo 360° (simulação de 8s com fundo transparente)");
}

function baixarImagem() {
  const img = document.getElementById('copo');
  const link = document.createElement('a');
  link.href = img.src;
  link.download = 'modelo_copo.png';
  link.click();
}

document.getElementById('uploadArte').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const arte = document.getElementById('arte');
    arte.src = e.target.result;
    arte.style.display = 'block';
  };
  reader.readAsDataURL(file);
});

window.onload = () => trocarCopo('caneca_png.png');
