const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let copo = new Image();
let arte = null;
let artePos = { x: 300, y: 150, w: 200, h: 150 };
let arrastando = false;
let fixada = false;
let rotacao = 0;
let corAtual = "#ffffff";

function carregarCopo(src) {
  copo.src = src;
  copo.onload = desenharTudo;
}

document.getElementById("modeloSelect").addEventListener("change", (e) => {
  carregarCopo(e.target.value);
});

document.querySelectorAll(".cor").forEach((btn) => {
  btn.addEventListener("click", () => {
    corAtual = btn.dataset.cor;
    desenharTudo();
  });
});

document.getElementById("upload").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = () => {
    arte = img;
    fixada = false;
    desenharTudo();
  };
});

canvas.addEventListener("mousedown", (e) => {
  if (!arte || fixada) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  if (x > artePos.x && x < artePos.x + artePos.w && y > artePos.y && y < artePos.y + artePos.h) {
    arrastando = true;
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (!arrastando || !arte || fixada) return;
  const rect = canvas.getBoundingClientRect();
  artePos.x = e.clientX - rect.left - artePos.w / 2;
  artePos.y = e.clientY - rect.top - artePos.h / 2;
  desenharTudo();
});

canvas.addEventListener("mouseup", () => (arrastando = false));

document.getElementById("fixar").addEventListener("click", () => {
  fixada = true;
});

document.getElementById("girarEsq").addEventListener("click", () => {
  rotacao -= 10;
  desenharTudo();
});

document.getElementById("girarDir").addEventListener("click", () => {
  rotacao += 10;
  desenharTudo();
});

document.getElementById("baixar").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "meu_copo.png";
  link.href = canvas.toDataURL();
  link.click();
});

document.getElementById("gerarVideo").addEventListener("click", () => {
  alert("Função de vídeo 360º em desenvolvimento!");
});

function desenharTudo() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // pintar copo
  ctx.save();
  ctx.fillStyle = corAtual;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "destination-in";
  ctx.drawImage(copo, 0, 0, canvas.width, canvas.height);
  ctx.restore();

  // aplicar rotação e arte
  if (arte) {
    ctx.save();
    ctx.translate(artePos.x + artePos.w / 2, artePos.y + artePos.h / 2);
    ctx.rotate((rotacao * Math.PI) / 180);
    ctx.drawImage(arte, -artePos.w / 2, -artePos.h / 2, artePos.w, artePos.h);
    ctx.restore();
  }
}

carregarCopo("copos/caneca_png.png");
