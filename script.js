const cupImage = document.getElementById('cup-image');
const colorButtons = document.querySelectorAll('.color');
const downloadBtn = document.getElementById('download-btn');

// 🧃 Adiciona a xícara (ajuste conforme o nome real do arquivo)
const cupModels = ['copos/copo.png', 'copos/xicara.png'];
let currentModel = 0;

// Altera cor do copo dinamicamente
colorButtons.forEach(button => {
  button.addEventListener('click', () => {
    const color = button.getAttribute('data-color');
    cupImage.style.filter = `brightness(0) saturate(100%) invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(1) contrast(1)`;
    cupImage.style.mixBlendMode = 'multiply';
    cupImage.style.backgroundColor = color;
  });
});

// Botão de download
downloadBtn.addEventListener('click', () => {
  html2canvas(document.querySelector('.preview')).then(canvas => {
    const link = document.createElement('a');
    link.download = 'meu_copo.png';
    link.href = canvas.toDataURL();
    link.click();
  });
});
