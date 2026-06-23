document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.cart-items');
  const subtotalEl = document.getElementById('subtotal-value');
  const shippingEl = document.getElementById('shipping-value');
  const totalEl = document.getElementById('total-value');
  const checkoutBtn = document.querySelector('.checkout-button');

  function render() {
    if (!window.Cart) return;
    const items = window.Cart.getCart();
    container.innerHTML = '';

    if (!items || items.length === 0) {
      container.innerHTML = '<p>Tu carrito está vacío.</p>';
    } else {
      items.forEach((it) => {
        const article = document.createElement('article');
        article.className = 'cart-item';
        article.dataset.id = it.id;

        article.innerHTML = `
          <img src="${it.image || ''}" alt="${escapeHtml(it.title)}">
          <div class="cart-item-info">
            <h3>${escapeHtml(it.title)}</h3>
            <p>${escapeHtml(it.description || '')}</p>
            <div class="cart-item-meta">
              <span class="price">${window.Cart.formatCurrency(it.price)}</span>
              <div class="qty-controls">
                <button class="qty-decrease">-</button>
                <input class="qty-input" type="number" min="1" value="${Number(it.qty) || 1}">
                <button class="qty-increase">+</button>
              </div>
              <button class="btn btn-link remove-item">Eliminar</button>
            </div>
          </div>
        `;

        container.appendChild(article);
      });

      // Attach listeners
      container.querySelectorAll('.qty-decrease').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const art = e.target.closest('.cart-item');
          const id = art.dataset.id;
          const input = art.querySelector('.qty-input');
          const newQty = Math.max(1, Number(input.value) - 1);
          window.Cart.updateQuantity(id, newQty);
          render();
        });
      });

      container.querySelectorAll('.qty-increase').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const art = e.target.closest('.cart-item');
          const id = art.dataset.id;
          const input = art.querySelector('.qty-input');
          const newQty = Math.max(1, Number(input.value) + 1);
          window.Cart.updateQuantity(id, newQty);
          render();
        });
      });

      container.querySelectorAll('.qty-input').forEach((input) => {
        input.addEventListener('change', (e) => {
          const art = e.target.closest('.cart-item');
          const id = art.dataset.id;
          const newQty = Math.max(0, Math.floor(Number(e.target.value) || 0));
          window.Cart.updateQuantity(id, newQty);
          render();
        });
      });

      container.querySelectorAll('.remove-item').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const art = e.target.closest('.cart-item');
          const id = art.dataset.id;
          window.Cart.removeItem(id);
          render();
        });
      });
    }

    // Totales
    const totals = window.Cart.getTotals();
    subtotalEl.textContent = window.Cart.formatCurrency(totals.subtotal);
    shippingEl.textContent = window.Cart.formatCurrency(totals.shipping);
    totalEl.textContent = window.Cart.formatCurrency(totals.total);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function (s) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[s];
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const totals = window.Cart.getTotals();
      if (totals.subtotal === 0) {
        alert('El carrito está vacío.');
        return;
      }
      // Simular compra
      if (confirm(`Total a pagar ${window.Cart.formatCurrency(totals.total)}. Confirmar compra?`)) {
        window.Cart.clearCart();
        render();
        alert('Gracias por tu compra.');
      }
    });
  }

  // Render inicial
  render();
});
