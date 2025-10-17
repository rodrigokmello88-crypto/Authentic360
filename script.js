let copoAtual = document.getElementById("coposPreview");
let artePreview = document.getElementById("artePreview");
let corAtual = "#ffffff";

function trocarCopo(nomeArquivo) {
  copoAtual.src = "copos/" + nomeArquivo;
  aplicarCor(corAtual);
  artePreview.src = ""; // limpa a arte quando troca o modelo
}

function mudarCor(cor) {
  corAtual = cor;
  aplicarCor(cor);
}

function aplicarCor(cor) {
  copoAtual.style.backgroundColor = cor;
}

function uploadArte(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    artePreview.src = e.target.result;
  };
  reader.readAsDataURL(file);
}
