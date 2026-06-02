/* ===== Product Page JS ===== */

// ── Image Gallery ──────────────────────────────────
function switchImage(thumb, src) {
  document.getElementById('mainImage').src = src;
  document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
}

// ── Lightbox ───────────────────────────────────────
function openLightbox() {
  const src = document.getElementById('mainImage').src;
  document.getElementById('lightboxImg').src = src;
  document.getElementById('lightbox').classList.add('open');
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// ── Pricing / Quantity ─────────────────────────────
let selectedQty = 1;
let selectedPrice = 259;
let selectedSize = null;
let selectedColor = 'بيج (نود)';

function selectQty(qty) {
  selectedQty = qty;
  selectedPrice = qty === 1 ? 259 : 459;
  document.getElementById('qty1').classList.toggle('active', qty === 1);
  document.getElementById('qty2').classList.toggle('active', qty === 2);
}

// ── Size ───────────────────────────────────────────
function selectSz(btn) {
  document.querySelectorAll('.sz-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedSize = btn.textContent.trim();
}

function toggleSizeGuide() {
  document.getElementById('sizeGuideTable').classList.toggle('open');
}

// ── Color ──────────────────────────────────────────
function selectColor(btn, name) {
  document.querySelectorAll('.color-swatch').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedColor = name;
  document.getElementById('colorName').textContent = name;
}

// ── Add to Cart ────────────────────────────────────
function handleAddToCart() {
  if (!selectedSize) {
    // Highlight size section
    document.querySelector('.size-grid').style.outline = '2px solid #dc2626';
    document.querySelector('.size-grid').style.borderRadius = '8px';
    setTimeout(() => {
      document.querySelector('.size-grid').style.outline = '';
    }, 2000);
    showToast('⚠️ يرجى اختيار المقاس أولاً');
    return;
  }
  const name = `مشد باور نت ${selectedQty > 1 ? '× ' + selectedQty : ''} (${selectedSize} – ${selectedColor})`;
  addToCart(name, selectedPrice);
}

function handleBuyNow() {
  if (!selectedSize) {
    showToast('⚠️ يرجى اختيار المقاس أولاً');
    return;
  }
  handleAddToCart();
  setTimeout(() => showToast('جاري تحويلك للدفع...'), 500);
}

// ── Tabs ───────────────────────────────────────────
function switchTab(btn, tabId) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tab-' + tabId).classList.add('active');
}

// ── Header scroll ──────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('mainHeader').classList.toggle('scrolled', window.scrollY > 20);
});
