const copo = document.getElementById("copo");
const arte = document.getElementById("arte");
const upload = document.getElementById("upload");

// Troca o modelo
function mudarModelo(nome) {
  copo.src = `copos/${nome}`;
  arte.style.display = "none";
}

// Troca a cor (tinta sobre o PNG)
function mudarCor(cor) {
  copo.style.filter = `drop-shadow(0 0 0 ${cor}) brightness(1.2) saturate(1.3)`;
  copo.style.mixBlendMode = "multiply";
}

// Upload e posicionamento da arte
upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      arte.src = reader.result;
      arte.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

// Permitir mover/redimensionar a arte
interact("#arte").draggable({
  onmove(event) {
    const target = event.target;
    const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

    target.style.transform = `translate(${x}px, ${y}px)`;
    target.setAttribute("data-x", x);
    target.setAttribute("data-y", y);
  }
}).resizable({
  edges: { left: true, right: true, bottom: true, top: true }
}).on("resizemove", (event) => {
  const { x, y } = event.rect;
  Object.assign(event.target.style, {
    width: `${event.rect.width}px`,
    height: `${event.rect.height}px`,
    transform: `translate(${x}px, ${y}px)`
  });
});

// Gerar vídeo 360° (placeholder funcional)
function gerarVideo() {
  alert("Geração de vídeo 360° em desenvolvimento. Esta função exportará as variações do copo rotacionado automaticamente.");
}
