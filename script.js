const modelos = {
  'caneca_png.png': 'copos/caneca_png.png',
  'caneca_slim_png.png': 'copos/caneca_slim_png.png',
  'ecologico_png.png': 'copos/ecologico_png.png',
  'espumante_png.png': 'copos/espumante_png.png',
  'squeeze_png.png': 'copos/squeeze_png.png',
  'tacagin_png.png': 'copos/tacagin_png.png',
  'twister_png.png': 'copos/twister_png.png',
  'xicara_png.png': 'copos/xicara_png.png'
};

function trocarCopo(modelo) {
  const img = document.getElementById('copo');
  const tinta = document.getElementById('tinta');
  if (modelos[modelo]) {
    img.src = modelos[modelo];
    img.style.width = "45%";
    tinta.style.width = "45%";
  }
}

function mudarCor(cor) {
  const tinta = document.getElementById('tinta');
  tinta.style.backgroundColor = cor;
  tinta.style.mixBlendMode = "color";
}

function gerarVideo() {
  alert("🎥 Gerando vídeo 360° (simulação)");
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
