const cupImage = document.getElementById('cup-image');
const colorButtons = document.querySelectorAll('.color');
const downloadBtn = document.getElementById('download-btn');

// Caminho padrão inicial
cupImage.src = 'copos/caneca_png.png';
cupImage.alt = 'Copo personalizado';

// Alterar cor dinamicamente
colorButtons.forEach(button => {
  button.addEventListener('click', () => {
    const color = button.getAttribute('data-color');
    cupImage.style.backgroundColor = color;
    cupImage.style.mixBlendMode = 'multiply';
    cupImage.style.filter = 'drop-shadow(0 0 10px rgba(0,0,0,0.5))';
  });
});

// Baixar imagem
downloadBtn.addEventListener('click', async () => {
  const preview = document.querySelector('.preview');
  const canvas = await html2canvas(preview);
  const link = document.createElement('a');
  link.download = 'mockup_autenti.png';
  link.href = canvas.toDataURL();
  link.click();
});
