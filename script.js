const cupImage = document.getElementById('cup-image');
const colorButtons = document.querySelectorAll('.color');
const downloadBtn = document.getElementById('download-btn');

// Corrige cor dinâmica
colorButtons.forEach(button => {
  button.addEventListener('click', () => {
    const color = button.getAttribute('data-color');
    cupImage.style.filter = `drop-shadow(0 0 5px #000)`;
    cupImage.style.backgroundColor = color;
    cupImage.style.mixBlendMode = 'multiply';
  });
});

// Função de download
downloadBtn.addEventListener('click', async () => {
  const canvas = await html2canvas(document.querySelector('.preview'));
  const link = document.createElement('a');
  link.download = 'mockup_autenti.png';
  link.href = canvas.toDataURL();
  link.click();
});
