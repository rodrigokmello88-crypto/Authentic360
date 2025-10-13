// Lista de modelos disponíveis
const models = [
  { name: "Copo 1", src: "copo1.png" },
  { name: "Copo 2", src: "copo2.png" },
  { name: "Copo 3", src: "copo3.png" },
  { name: "Xícara", src: "xicara.png" },
];

// Elementos da interface
const modelsList = document.getElementById('modelsList');
const canvas = document.getElementById('mockupCanvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');
const generate360Btn = document.getElementById('generate360Btn');

// Renderiza miniaturas dos modelos
models.forEach(model => {
  const div = document.createElement('div');
  div.className = 'model-item';
  div.innerHTML = `
    <img src="${model.src}" alt="${model.name}">
    <span class="label">${model.name}</span>
  `;
  div.onclick = () => {
    const img = new Image();
    img.src = model.src;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  };
  modelsList.appendChild(div);
});

// Função de download da imagem
downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'mockup_authentic360.png';
  link.href = canvas.toDataURL();
  link.click();
});

// Placeholder para geração do vídeo 360°
generate360Btn.addEventListener('click', () => {
  alert('🎥 Em breve: geração automática de vídeo 360° do produto.');
});
