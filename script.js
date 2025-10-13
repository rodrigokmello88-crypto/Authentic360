const cupImage = document.getElementById('cup-image');
const colorButtons = document.querySelectorAll('.color');
const downloadBtn = document.getElementById('download-btn');

// Caminho base das imagens
const copoBase = 'copos/copo1.png'; // coloque o nome do PNG principal aqui
cupImage.src = copoBase;
cupImage.alt = 'Copo personalizado';

// Aplicar cor sobre o copo
colorButtons.forEach(button => {
  button.addEventListener('click', () => {
    const color = button.getAttribute('data-color');

    // Define o copo novamente (garantia)
    cupImage.src = copoBase;
    cupImage.style.filter = 'drop-shadow(0 0 10px rgba(0,0,0,0.5))';
    cupImage.style.backgroundColor = color;
    cupImage.style.mixBlendMode = 'multiply';
    cupImage.style.borderRadius = '20px';
  });
});

// Baixar mockup
downloadBtn.addEventListener('click', async () => {
  const preview = document.querySelector('.preview');
  const canvas = await html2canvas(preview);
  const link = document.createElement('a');
  link.download = 'mockup_autenti.png';
  link.href = canvas.toDataURL();
  link.click();
});
