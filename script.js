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
  // Aplica cor sobre o PNG transparente sem distorcer a imagem
  copoAtual.style.backgroundColor = cor;
}
