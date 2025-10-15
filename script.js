const modelos = {
  'caneca_png.png': 'copos/caneca_png.png',
  'caneca_slim.png': 'copos/caneca_slim.png',
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
  } else {
    console.error(`Modelo ${modelo} não encontrado`);
  }
}

function mudarCor(cor) {
  const copo = document.getElementById('copo');
  copo.style.filter = `drop-shadow(0 0 5px ${cor}) brightness(1.2)`;
}

function gerarVideo() {
  alert("⚙️ Gerando vídeo 360°... (simulação)");
}

function baixarImagem() {
  const img = document.getElementById('copo');
  const link = document.createElement('a');
  link.href = img.src;
  link.download = 'copo.png';
  link.click();
}
