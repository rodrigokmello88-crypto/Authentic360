const mockup = document.getElementById("mockup");
const arte = document.getElementById("arte");
const upload = document.getElementById("upload");
const mockupArea = document.getElementById("mockupArea");

const modelos = {
  caneca: "copos/caneca.png",
  caneca_slim: "copos/caneca_slim.png",
  ecologico: "copos/ecologico.png",
  espumante: "copos/espumante.png",
  squeeze: "copos/squeeze.png",
  taca_gin: "copos/taca_gin.png",
  twister: "copos/twister.png",
  xicara: "copos/xicara.png"
};

function trocarModelo(modelo) {
  if (modelos[modelo]) {
    mockup.src = modelos[modelo];
  }
}

function trocarCor(cor) {
  mockupArea.style.backgroundColor = cor;
}

function enviarArte() {
  const file = upload.files[0];
  if (!file) return alert("Selecione uma imagem!");
  const reader = new FileReader();
  reader.onload = e => {
    arte.src = e.target.result;
    arte.style.display = "block";
  };
  reader.readAsDataURL(file);
}

// movimentar e redimensionar a arte
let isDragging = false;
let isResizing = false;
let startX, startY, startWidth, startHeight;

arte.addEventListener("mousedown", e => {
  if (e.shiftKey) {
    isResizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = arte.offsetWidth;
    startHeight = arte.offsetHeight;
  } else {
    isDragging = true;
    startX = e.clientX - arte.offsetLeft;
    startY = e.clientY - arte.offsetTop;
  }
});

window.addEventListener("mousemove", e => {
  if (isDragging) {
    arte.style.left = `${e.clientX - startX}px`;
    arte.style.top = `${e.clientY - startY}px`;
  }
  if (isResizing) {
    arte.style.width = `${startWidth + (e.clientX - startX)}px`;
    arte.style.height = `${startHeight + (e.clientY - startY)}px`;
  }
});

window.addEventListener("mouseup", () => {
  isDragging = false;
  isResizing = false;
});

// gerar imagem final
function baixarMockup() {
  html2canvas(mockupArea).then(canvas => {
    const link = document.createElement("a");
    link.download = "mockup.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}
