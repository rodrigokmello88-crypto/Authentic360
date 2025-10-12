/* === AUTENTI CORS 360 - Versão Corrigida === */
/* === Carrega imagens dos copos e exibe === */

// Caminhos dos modelos (de acordo com tua pasta /copos/)
const modelFiles = [
  './copos/twister.png',
  './copos/caneca_png.png',
  './copos/caneca_slim_png.png',
  './copos/ecologico.png',
  './copos/espumante.png',
  './copos/squeeze.png',
  './copos/taca_gin.png'
];

// Elementos principais
const viewer = document.querySelector('.viewer');
const select = document.createElement('select');

// Cria menu de seleção dos modelos
modelFiles.forEach((path) => {
  const name = path.split('/').pop().replace('.png', '').replaceAll('_', ' ');
  const opt = document.createElement('option');
  opt.value = path;
  opt.textContent = name.charAt(0).toUpperCase() + name.slice(1);
  select.appendChild(opt);
});

select.className = 'model-dropdown';
select.style.margin = '10px 0';
document.querySelector('.topbar')?.appendChild(select);

// Mostra o primeiro modelo inicialmente
const img = document.createElement('img');
img.src = modelFiles[0];
img.alt = 'Copo Autenti 360';
img.style.maxWidth = '60%';
img.style.height = 'auto';
img.style.transition = 'transform 0.4s ease';
viewer.appendChild(img);

// Troca imagem conforme seleção
select.addEventListener('change', (e) => {
  img.src = e.target.value;
});

// Efeito leve de hover
img.addEventListener('mouseenter', () => {
  img.style.transform = 'scale(1.05)';
});
img.addEventListener('mouseleave', () => {
  img.style.transform = 'scale(1)';
});

console.log('AutentiCors360 iniciado com sucesso ✅');
