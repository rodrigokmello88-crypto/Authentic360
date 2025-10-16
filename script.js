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
  if (modelos[modelo]) {
    img.src = modelos[modelo];
  }
}

function mudarCor(cor) {
  const tinta = document.getElementById('tinta');
  tinta.style.backgroundColor = cor;
}

function gerarVideo() {
  alert("🎥 Gerando vídeo 360° (simulação de 8 segundos)");
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
