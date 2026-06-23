// Lógica central del carrito: almacenamiento en localStorage y utilidades
(function () {
  const STORAGE_KEY = 'lv_cart_v1';

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    renderCartCount();
  }

  function parsePrice(value) {
    if (typeof value === 'number') return value;
    const cleaned = String(value).replace(/[^0-9.,-]/g, '').trim();
    // Normalize comma as decimal separator
    const normalized = cleaned.replace(/,/g, '.');
    const n = parseFloat(normalized);
    return isNaN(n) ? 0 : n;
  }

  function makeIdFromTitle(title) {
    return String(title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  function addItem(item) {
    const cart = getCart();
    const id = item.id || makeIdFromTitle(item.title || item.name || 'item');
    const price = parsePrice(item.price || item.unitPrice || 0);
    const existing = cart.find((c) => c.id === id);
    if (existing) {
      existing.qty = (existing.qty || 0) + (item.qty || 1);
    } else {
      cart.push({
        id,
        title: item.title || item.name || 'Producto',
        price: price,
        image: item.image || '',
        qty: item.qty || 1,
        description: item.description || ''
      });
    }
    saveCart(cart);
    return cart;
  }

  function removeItem(id) {
    let cart = getCart();
    cart = cart.filter((c) => c.id !== id);
    saveCart(cart);
    return cart;
  }

  function updateQuantity(id, qty) {
    const cart = getCart();
    const item = cart.find((c) => c.id === id);
    if (!item) return cart;
    item.qty = Math.max(0, Math.floor(qty) || 0);
    const newCart = item.qty > 0 ? cart : cart.filter((c) => c.id !== id);
    saveCart(newCart);
    return newCart;
  }

  function clearCart() {
    saveCart([]);
  }

  function getTotals() {
    const cart = getCart();
    const subtotal = cart.reduce((s, it) => s + (Number(it.price) || 0) * (it.qty || 0), 0);
    const shipping = subtotal === 0 ? 0 : subtotal >= 50 ? 0 : 2.5; // ejemplo: envío gratis sobre 50
    const total = subtotal + shipping;
    return { subtotal, shipping, total };
  }

  function formatCurrency(n) {
    return '$' + Number(n || 0).toFixed(2);
  }

  function renderCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((s, it) => s + (it.qty || 0), 0);
    document.querySelectorAll('.cart-count').forEach((el) => {
      el.textContent = totalItems;
    });
  }

  // Inicializar contador al cargar el script
  document.addEventListener('DOMContentLoaded', renderCartCount);

  // API expuesta globalmente
  window.Cart = {
    getCart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotals,
    formatCurrency,
    renderCartCount
  };

})();
