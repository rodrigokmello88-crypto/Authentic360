let copoAtual = document.getElementById("coposPreview");
let corAtual = "#ffffff";

function trocarCopo(nomeArquivo) {
  copoAtual.src = "copos/" + nomeArquivo;
  aplicarCor(corAtual);
}

function mudarCor(cor) {
  corAtual = cor;
  aplicarCor(cor);
}

function aplicarCor(cor) {
  // Aplica a cor sobre o PNG preservando transparência
  copoAtual.style.filter = "brightness(0) saturate(100%) invert(1)";
  copoAtual.style.mixBlendMode = "multiply";
  copoAtual.style.backgroundColor = cor;
}
