/* ===== RonBodies – Main JS ===== */

// ── Popup ──────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('promoPopup').classList.add('open');
  }, 2500);
});

function closePopup() {
  document.getElementById('promoPopup').classList.remove('open');
}

function submitPopup(e) {
  e.preventDefault();
  closePopup();
  showToast('🎉 Discount code sent to your email!');
}

// ── Header scroll shadow ───────────────────────────
window.addEventListener('scroll', () => {
  const header = document.getElementById('mainHeader');
  header.classList.toggle('scrolled', window.scrollY > 20);
});

// ── Mobile Nav ─────────────────────────────────────
function closeMobileNav() {
  document.getElementById('mobileNav').classList.remove('open');
  document.getElementById('mobileNavOverlay').classList.remove('open');
}

document.getElementById('hamburgerBtn').addEventListener('click', () => {
  document.getElementById('mobileNav').classList.add('open');
  document.getElementById('mobileNavOverlay').classList.add('open');
});

// ── Search ─────────────────────────────────────────
function toggleSearch() {
  document.getElementById('searchBar').classList.toggle('open');
  if (document.getElementById('searchBar').classList.contains('open')) {
    setTimeout(() => document.getElementById('searchInput').focus(), 100);
  }
}

// ── Cart ───────────────────────────────────────────
let cart = [];

function toggleCart() {
  document.getElementById('cartDrawer').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}

function addToCart(name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  updateCartUI();
  showToast(`✓ ${name} added to cart`);
  toggleCart();
}

function removeFromCart(name) {
  cart = cart.filter(i => i.name !== name);
  updateCartUI();
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  // Count badge
  const countEl = document.getElementById('cartCount');
  countEl.textContent = totalItems;
  countEl.classList.toggle('visible', totalItems > 0);
  document.getElementById('cartItemCount').textContent = totalItems;

  const cartBody = document.getElementById('cartBody');

  if (cart.length === 0) {
    cartBody.innerHTML = `
      <div class="cart-empty">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        <p>Your cart is empty</p>
        <button onclick="toggleCart()">Continue Shopping</button>
      </div>`;
    return;
  }

  const icons = { 'shorts': '🩳', 'onepiece': '👗', 'waist': '⏳', 'fullbody': '💪' };
  const itemsHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">🛍️</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">AED ${item.price} × ${item.qty}</div>
        <span class="cart-item-remove" onclick="removeFromCart('${item.name.replace(/'/g, "\\'")}')">Remove</span>
      </div>
    </div>`).join('');

  cartBody.innerHTML = `
    ${itemsHTML}
    <div style="height:16px"></div>`;

  // Add footer if not exists
  let footer = document.querySelector('.cart-footer');
  if (!footer) {
    footer = document.createElement('div');
    footer.className = 'cart-footer';
    document.getElementById('cartDrawer').appendChild(footer);
  }
  footer.innerHTML = `
    <div class="cart-total">
      <span>Total</span>
      <span>AED ${totalPrice}</span>
    </div>
    <button class="cart-checkout-btn" onclick="showToast('Checkout coming soon!')">Proceed to Checkout</button>`;
}

// ── Hero Slider ────────────────────────────────────
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.dot');
let slideInterval;

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function nextSlide() { goToSlide(currentSlide + 1); resetSlideInterval(); }
function prevSlide() { goToSlide(currentSlide - 1); resetSlideInterval(); }

function resetSlideInterval() {
  clearInterval(slideInterval);
  slideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
}

slideInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);

// ── Countdown Timer ────────────────────────────────
function startCountdown() {
  const key = 'rbSaleEnd';
  let end = localStorage.getItem(key);
  if (!end || Date.now() > +end) {
    end = Date.now() + 24 * 60 * 60 * 1000;
    localStorage.setItem(key, end);
  }

  function tick() {
    const diff = Math.max(0, +end - Date.now());
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    document.getElementById('cdHours').textContent = String(h).padStart(2, '0');
    document.getElementById('cdMins').textContent = String(m).padStart(2, '0');
    document.getElementById('cdSecs').textContent = String(s).padStart(2, '0');
  }

  tick();
  setInterval(tick, 1000);
}
startCountdown();

// ── Product Filter ─────────────────────────────────
function filterProducts(category, btn) {
  const cards = document.querySelectorAll('.product-card');
  cards.forEach(card => {
    const match = category === 'all' || card.dataset.category === category;
    card.classList.toggle('hidden', !match);
  });

  if (btn) {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
  }

  if (category !== 'all' && !btn) {
    // Triggered from collection card — scroll to products
    document.getElementById('bestsellers').scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Activate matching tab
    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(t => {
      t.classList.remove('active');
      if (t.textContent.toLowerCase().includes(category.replace('fullbody', 'full').replace('onepiece', 'one'))) {
        t.classList.add('active');
      }
    });
  }
}

// ── Load More ──────────────────────────────────────
function loadMore() {
  showToast('All products are displayed');
}

// ── Wishlist ───────────────────────────────────────
function toggleWishlist(btn) {
  btn.classList.toggle('active');
  const isActive = btn.classList.contains('active');
  showToast(isActive ? '♥ Added to wishlist' : '♡ Removed from wishlist');
}

// ── Quick View ─────────────────────────────────────
const products = [
  { name: 'Sculpting High Waist Hooks Short', price: 'AED 297', icon: '🩳', desc: 'Premium high-waist shaping short with hook closure. Targets waist, tummy, back, thighs, and butt for a complete sculpted look. Medical-grade Colombian compression fabric.' },
  { name: 'Bermuda Shorts Hook', price: 'AED 297', icon: '🩳', desc: 'Longer-length Bermuda style with hook closure. Perfect for extra thigh coverage and smoothing. Anti-cellulite compression panels throughout.' },
  { name: 'Sculpt Zip Shapewear Short', price: 'AED 297', icon: '🩳', desc: 'Easy-on zip design with powerful waist and tummy control. Comfortable enough for all-day wear with breathable side panels.' },
  { name: 'Full Control One-Piece Bodysuit', price: 'AED 349', icon: '👗', desc: 'Head-to-toe sculpting in one seamless piece. Open-bust design fits any bra. Targets the full torso with maximum compression and butt-lifting panels.' },
  { name: 'Premium Latex Waist Trainer', price: 'AED 189', icon: '⏳', desc: 'Triple-layer latex waist trainer with 3 rows of hook-and-eye closures. Thermal activity enhances waist training results. Provides excellent back support and posture correction.' },
  { name: '360° Full Body Sculpting Suit', price: 'AED 399', icon: '💪', desc: 'Our most comprehensive shapewear piece. Covers arms, torso, thighs, and calves for a 360° sculpted silhouette. Medical-grade compression with built-in boning for structure.' },
  { name: 'Elegant Open-Bust Bodysuit', price: 'AED 279', icon: '👗', desc: 'Sophisticated open-bust bodysuit with lace trim. Smooths the tummy, lifts the butt, and slims the thighs — while looking beautiful underneath any outfit.' },
  { name: 'Steel-Bone Waist Cincher', price: 'AED 229', icon: '⏳', desc: 'Professional-grade waist cincher with 9 spiral steel bones for maximum structure. Delivers dramatic hourglass results. Ideal for both training and special occasion wear.' },
];

function quickView(index) {
  const p = products[index];
  document.getElementById('modalContent').innerHTML = `
    <div class="modal-product-icon">${p.icon}</div>
    <div class="modal-product-name">${p.name}</div>
    <div class="modal-product-price">${p.price}</div>
    <div class="modal-product-desc">${p.desc}</div>
    <div class="modal-size-label">Select Size</div>
    <div class="modal-sizes">
      ${['XS','S','M','L','XL','2XL','3XL'].map(s => `<button class="size-btn" onclick="selectSize(this)">${s}</button>`).join('')}
    </div>
    <button class="modal-add-btn" onclick="addToCart('${p.name.replace(/'/g, "\\'")}', ${parseInt(p.price.replace(/\D/g, ''))})">Add to Cart</button>
  `;
  document.getElementById('quickViewModal').classList.add('open');
}

function selectSize(btn) {
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function closeModal() {
  document.getElementById('quickViewModal').classList.remove('open');
}

document.getElementById('quickViewModal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// ── FAQ Accordion ──────────────────────────────────
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = answer.classList.contains('open');

  document.querySelectorAll('.faq-answer.open').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-question.open').forEach(q => q.classList.remove('open'));

  if (!isOpen) {
    answer.classList.add('open');
    btn.classList.add('open');
  }
}

// ── Newsletter ─────────────────────────────────────
function subscribeNewsletter(e) {
  e.preventDefault();
  e.target.reset();
  showToast('🎉 Subscribed! Check your email for your discount code.');
}

// ── Toast ──────────────────────────────────────────
let toastTimeout;
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── Make every product card clickable ─────────────
document.querySelectorAll('.product-card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', function (e) {
    // Don't navigate if clicking a button inside the card
    if (e.target.closest('button')) return;
    window.location.href = 'product.html';
  });
});

// ── Color Dot Selection ────────────────────────────
document.querySelectorAll('.color-dot').forEach(dot => {
  dot.addEventListener('click', function() {
    const siblings = this.parentElement.querySelectorAll('.color-dot');
    siblings.forEach(d => d.classList.remove('active'));
    this.classList.add('active');
  });
});

// ── Language Toggle ────────────────────────────────
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    showToast(`Language: ${this.textContent}`);
  });
});
