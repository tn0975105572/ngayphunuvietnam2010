const bouquet = document.querySelector('#bouquet');
const photoPin = document.querySelector('#photoPin');
const hint = document.querySelector('#hint');
const backgroundMusic = document.querySelector('#backgroundMusic');
const wishOpen = document.querySelector('#wishOpen');
const wishDialog = document.querySelector('#wishDialog');
const wishClose = document.querySelector('#wishClose');

backgroundMusic.volume = 0.22;

async function startBackgroundMusic() {
  try {
    await backgroundMusic.play();
    window.removeEventListener('pointerdown', startBackgroundMusic);
    window.removeEventListener('keydown', startBackgroundMusic);
  } catch {
    // Browsers that block autoplay will retry after the visitor's first interaction.
  }
}

startBackgroundMusic();
window.addEventListener('pointerdown', startBackgroundMusic);
window.addEventListener('keydown', startBackgroundMusic);

const photoSources = [
  './anh/1.jpg', './anh/2.jpg', './anh/3.jpg',
  './anh/4.jpg', './anh/5.jpg', './anh/6.jpg',
];
const flowerPositions = [
  [34, 46], [45, 41], [59, 42], [69, 49],
  [41, 51], [56, 56],
];
const bouquetPhotos = photoSources.map((src, index) => ({
  src,
  alt: `Ảnh kỷ niệm ${index + 1}`,
  location: flowerPositions[index],
}));
const flowerSlots = [];

bouquetPhotos.forEach((photo) => {
  const flower = document.createElement('span');
  flower.className = 'flower-slot';
  flower.style.setProperty('--x', `${photo.location[0]}%`);
  flower.style.setProperty('--y', `${photo.location[1]}%`);

  const flip = document.createElement('span');
  flip.className = 'flower-flip';

  const rose = document.createElement('img');
  rose.className = 'flower-face flower-rose';
  rose.src = 'rose-cutout.png';
  rose.alt = 'Bông hồng sáp';
  rose.draggable = false;

  const portrait = document.createElement('img');
  portrait.className = 'flower-face flower-portrait';
  portrait.src = photo.src;
  portrait.alt = photo.alt;
  portrait.draggable = false;

  const dust = document.createElement('span');
  dust.className = 'flower-dust';
  dust.setAttribute('aria-hidden', 'true');
  const dustDirections = [
    [-11, -9], [-5, -15], [8, -12], [14, -2], [10, 11], [-9, 13],
  ];
  dustDirections.forEach(([x, y], particleIndex) => {
    const particle = document.createElement('i');
    particle.className = 'dust-particle';
    particle.style.setProperty('--dx', `${x}px`);
    particle.style.setProperty('--dy', `${y}px`);
    particle.style.setProperty('--dust-color', particleIndex % 2 ? '#fff4d7' : '#e8b1ad');
    dust.append(particle);
  });

  flip.append(rose, portrait);
  flower.append(flip, dust);
  photoPin.append(flower);
  flowerSlots.push(flower);
});
photoPin.dataset.count = bouquetPhotos.length;

bouquet.addEventListener('click', () => {
  if (bouquet.classList.contains('open')) return;

  bouquet.classList.add('open');
  bouquet.setAttribute('aria-pressed', 'true');
  bouquet.setAttribute('aria-label', 'Món quà đã mở');
  hint.textContent = 'Những bông hoa đang hóa thành ảnh kỷ niệm ♡';
  flowerSlots.forEach((flower, index) => {
    window.setTimeout(() => {
      flower.classList.add('is-dissolving');
      window.setTimeout(() => flower.classList.add('photo-revealed'), 820);
    }, 350 + index * 460);
  });
});

wishOpen.addEventListener('click', () => {
  wishDialog.showModal();
  wishOpen.setAttribute('aria-expanded', 'true');
  window.requestAnimationFrame(() => wishClose.focus());
});

function closeWishDialog() {
  wishDialog.close();
}

wishClose.addEventListener('click', closeWishDialog);

wishDialog.addEventListener('click', (event) => {
  if (event.target === wishDialog) closeWishDialog();
});

wishDialog.addEventListener('close', () => {
  wishOpen.setAttribute('aria-expanded', 'false');
  wishOpen.focus();
});
