/* ═══════════════════════════════════════
   BOOKMYVILLA — main.js (FIXED VERSION)
   ═══════════════════════════════════════ */

/* EMAILJS (unchanged) */
const EMAILJS_PUBLIC_KEY  = '-htos6_IutCG7WRCu';
const EMAILJS_SERVICE_ID  = 'service_wv8qm7f';
const EMAILJS_TEMPLATE_ID = 'template_3mdni9e';
const ADMIN_EMAIL         = 'neelgadekar9@gmail.com';

/* VILLA DATA (unchanged) */
const villas = [
  {
    name: 'Villa Aravali',
    location: 'Udaipur, Rajasthan',
    img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=60',
    price: 42000,
    priceStr: '₹42,000'
  },
  {
    name: 'Villa Konkan',
    location: 'Alibaug, Maharashtra',
    img: 'https://images.unsplash.com/photo-1570737209810-87a8e7245f88?w=800&q=60',
    price: 28000,
    priceStr: '₹28,000'
  },
  {
    name: 'Villa Nilgiri',
    location: 'Ooty, Tamil Nadu',
    img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=60',
    price: 18000,
    priceStr: '₹18,000'
  }
];

/* INIT */
document.addEventListener("DOMContentLoaded", () => {
  initLoader();
  initNav();
});

/* LOADER FIX (no delay) */
function initLoader() {
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hide');
  });
}

/* NAV */
function initNav() {
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
  });
}

/* SAFE GET */
function $(id) {
  return document.getElementById(id);
}

/* OPEN MODAL (FIXED EVENT BUG) */
function openVbm(idx, e) {
  if (e) e.preventDefault();

  const v = villas[idx];
  if (!v) return;

  if ($('vbmVillaName')) $('vbmVillaName').textContent = v.name;
  if ($('vbmVillaLoc')) $('vbmVillaLoc').textContent = v.location;

  $('vbmOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

/* CLOSE */
function closeVbm() {
  $('vbmOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

/* PRICE CALC */
function calculateTotal() {
  const ci = new Date($('vbmCheckin').value);
  const co = new Date($('vbmCheckout').value);

  const nights = (co - ci) / (1000 * 60 * 60 * 24);

  const name = $('vbmVillaName').textContent;
  const v = villas.find(x => x.name === name);

  if (v && nights > 0) {
    $('vbmCalcTotal').textContent = "₹" + (nights * v.price);
  }
}

/* LISTENERS */
$('vbmCheckin')?.addEventListener("change", calculateTotal);
$('vbmCheckout')?.addEventListener("change", calculateTotal);

/* CONFIRM BOOKING + MONGODB */
async function vbmConfirm() {
  try {
    const data = {
      villa: $('vbmVillaName')?.textContent,
      name: $('vbmFname')?.value + " " + $('vbmLname')?.value,
      email: $('vbmEmail')?.value,
      phone: $('vbmPhone')?.value,
      checkin: $('vbmCheckin')?.value,
      checkout: $('vbmCheckout')?.value,
      guests: $('vbmGuests')?.value,
      total: $('vbmCalcTotal')?.textContent
    };

    await fetch("http://localhost:5000/booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    alert("Booking Saved ✅");
    closeVbm();

  } catch (err) {
    console.error(err);
    alert("Error ❌");
  }
}