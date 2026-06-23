const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelectorAll('.main-nav a');
const addToCartButtons = document.querySelectorAll('.product-card .btn-secondary');


if (menuToggle && header) {
  menuToggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('nav-open');
    menuToggle.setAttribute('aria-expanded', isOpen.toString());
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    header.classList.remove('nav-open');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

addToCartButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.product-card');
    if (!card) return;
    const titleEl = card.querySelector('h3');
    const priceEl = card.querySelector('.price');
    const imgEl = card.querySelector('img');
    const title = titleEl ? titleEl.textContent.trim() : 'Producto';
    const priceText = priceEl ? priceEl.textContent.trim() : '0';
    const img = imgEl ? imgEl.getAttribute('src') : '';
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    // Añadir al carrito usando la API compartida
    if (window.Cart && typeof window.Cart.addItem === 'function') {
      window.Cart.addItem({ id, title, price: priceText, image: img, qty: 1 });
    }
    button.textContent = 'Añadido';
    button.classList.add('btn-disabled');
    button.disabled = true;
  });
});

const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  let currentSectionId = '';

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    if (window.pageYOffset >= sectionTop) {
      currentSectionId = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    const targetId = link.getAttribute('href').replace('#', '');
    link.classList.toggle('active', targetId === currentSectionId);
  });
});
