/* ═══════════════════════════════════════
   BOOKMYVILLA — main.js
   ═══════════════════════════════════════ */

/* ════════════════════════════════
   EMAILJS CONFIG
   Replace these 3 values with your real keys from emailjs.com
   Template needs only TWO variables: {{subject}} and {{message}}
   Set "To Email" = neelgadekar9@gmail.com in the template
════════════════════════════════ */
const EMAILJS_PUBLIC_KEY  = '-htos6_IutCG7WRCu';
const EMAILJS_SERVICE_ID  = 'service_wv8qm7f';
const EMAILJS_TEMPLATE_ID = 'template_3mdni9e';
const ADMIN_EMAIL         = 'neelgadekar9@gmail.com';

/* ════════════════════════════════
   VILLA DATA
════════════════════════════════ */
const villas = [
  {
    name: 'Villa Aravali', tag: 'Featured',
    location: 'Udaipur, Rajasthan',
    img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=85',
    price: 42000, priceStr: '₹42,000',
    amenities: ['Infinity Pool','Rooftop Terrace','Private Chef','Jacuzzi','Home Theatre','Butler Service','Airport Transfer','Yoga Pavilion']
  },
  {
    name: 'Villa Konkan', tag: 'Beachfront',
    location: 'Alibaug, Maharashtra',
    img: 'https://images.unsplash.com/photo-1570737209810-87a8e7245f88?w=1200&q=85',
    price: 28000, priceStr: '₹28,000',
    amenities: ['Private Beach','Seawater Pool','Beach Bar','Water Sports','Private Chef','Open-air Dining','Airport Speedboat','Bonfire Nights']
  },
  {
    name: 'Villa Nilgiri', tag: 'Hilltop',
    location: 'Ooty, Tamil Nadu',
    img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=85',
    price: 18000, priceStr: '₹18,000',
    amenities: ['Log Fireplace','Tea Estate Views','Colonial Gardens','Verandah Dining','Private Chef','Nature Walks','Hammock Garden','Library Lounge']
  }
];

let vbmCurrentVilla = 0;
let vbmCurrentStep  = 1;

/* ════════════════════════════════
   CURSOR
════════════════════════════════ */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
    setTimeout(() => { ring.style.left = e.clientX + 'px'; ring.style.top = e.clientY + 'px'; }, 80);
  });
}

/* ════════════════════════════════
   LOADER
════════════════════════════════ */
function initLoader() {
  window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('loader').classList.add('hide'), 2000);
  });
}

/* ════════════════════════════════
   NAV
════════════════════════════════ */
function initNav() {
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 60);
  });
}

/* ════════════════════════════════
   SCROLL REVEAL
════════════════════════════════ */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ════════════════════════════════
   COUNT-UP
════════════════════════════════ */
function initCountUp() {
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target, target = +el.dataset.count;
      let cur = 0;
      const step = Math.ceil(target / 50);
      const t = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = cur + (el.dataset.suffix || '');
        if (cur >= target) clearInterval(t);
      }, 30);
      countObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-num').forEach(el => countObs.observe(el));
}

/* ════════════════════════════════
   OPEN BOOKING MODAL
════════════════════════════════ */
function openVbm(idx) {
  if (event) event.preventDefault();
  vbmCurrentVilla = idx;
  vbmCurrentStep  = 1;
  const v = villas[idx];

  document.getElementById('vbmBgImg').src                = v.img;
  document.getElementById('vbmTag').textContent           = v.tag;
  document.getElementById('vbmVillaName').textContent     = v.name;
  document.getElementById('vbmVillaLoc').textContent      = '📍 ' + v.location;
  document.getElementById('vbmPriceNum').textContent      = v.priceStr;
  document.getElementById('vbmFormVillaName').textContent = v.name;
  document.getElementById('vbmChips').innerHTML =
    v.amenities.slice(0, 5).map(a => `<span class="vbm-chip">${a}</span>`).join('');

  vbmShowPane(1);
  vbmResetSteps();

  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter  = new Date(); dayAfter.setDate(dayAfter.getDate() + 4);
  document.getElementById('vbmCheckin').value  = tomorrow.toISOString().split('T')[0];
  document.getElementById('vbmCheckout').value = dayAfter.toISOString().split('T')[0];
  vbmUpdateCalc();

  document.getElementById('vbmOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeVbm() {
  document.getElementById('vbmOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ════════════════════════════════
   STEP NAV
════════════════════════════════ */
function vbmGoStep(step) {
  /* Validate step 1 */
  if (step === 2 && vbmNights() <= 0)
    return vbmShake(document.getElementById('vbmPane1'));

  /* Validate step 2 */
  if (step === 3) {
    const fname = document.getElementById('vbmFname').value.trim();
    const email = document.getElementById('vbmEmail').value.trim();
    const phone = document.getElementById('vbmPhone').value.trim();
    if (!fname || !email || !phone)
      return vbmShake(document.getElementById('vbmPane2'));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return vbmShake(document.getElementById('vbmPane2'));
    /* update deposit amount */
    const nights = vbmNights();
    const v = villas[vbmCurrentVilla];
    const deposit = Math.round(nights * v.price * 0.3);
    document.getElementById('vbmDepositAmt').textContent = '₹' + deposit.toLocaleString('en-IN');
  }

  /* Validate step 3 → populate review */
  if (step === 4) vbmPopulateReview();

  vbmCurrentStep = step;
  vbmShowPane(step);
  vbmResetSteps();
}

function vbmShowPane(step) {
  [1,2,3,4,5].forEach(n => {
    const el = document.getElementById('vbmPane' + n);
    if (el) el.classList.toggle('hidden', n !== step);
  });
  document.querySelector('.vbm-right').scrollTop = 0;
}

function vbmResetSteps() {
  document.querySelectorAll('.vbm-step').forEach(el => {
    const s = +el.dataset.step;
    el.classList.toggle('active', s === vbmCurrentStep);
    el.classList.toggle('done',   s < vbmCurrentStep);
  });
}

function vbmShake(el) {
  el.style.animation = 'none'; el.offsetHeight;
  el.style.animation = 'shake 0.4s ease';
  setTimeout(() => { el.style.animation = ''; }, 500);
}

/* ════════════════════════════════
   PAYMENT TABS
════════════════════════════════ */
function vbmSelectPayTab(btn, type) {
  document.querySelectorAll('.vbm-pay-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  ['card','upi','bank'].forEach(t => {
    const el = document.getElementById('vbmPay' + t.charAt(0).toUpperCase() + t.slice(1));
    if (el) el.classList.toggle('hidden', t !== type);
  });
}

/* Card number formatter */
function vbmFormatCard(input) {
  let v = input.value.replace(/\D/g,'').substring(0,16);
  input.value = v.replace(/(.{4})/g,'$1 ').trim();
}

/* Expiry formatter */
function vbmFormatExpiry(input) {
  let v = input.value.replace(/\D/g,'').substring(0,4);
  if (v.length >= 2) v = v.substring(0,2) + ' / ' + v.substring(2);
  input.value = v;
}

/* ════════════════════════════════
   PRICE CALC
════════════════════════════════ */
function vbmNights() {
  const ci = document.getElementById('vbmCheckin').value;
  const co = document.getElementById('vbmCheckout').value;
  if (!ci || !co) return 0;
  return Math.max(0, Math.round((new Date(co) - new Date(ci)) / 86400000));
}

function vbmUpdateCalc() {
  const nights = vbmNights();
  const v = villas[vbmCurrentVilla];
  document.getElementById('vbmCalcNights').textContent = nights > 0 ? nights + (nights===1?' night':' nights') : '—';
  document.getElementById('vbmCalcRate').textContent   = v.priceStr;
  document.getElementById('vbmCalcTotal').textContent  = nights > 0 ? '₹' + (nights * v.price).toLocaleString('en-IN') : '—';
}

/* ════════════════════════════════
   REVIEW POPULATE
════════════════════════════════ */
function vbmPopulateReview() {
  const v = villas[vbmCurrentVilla], nights = vbmNights();
  const ci = document.getElementById('vbmCheckin').value;
  const co = document.getElementById('vbmCheckout').value;
  const fmt = { day:'numeric', month:'short', year:'numeric' };
  const fname = document.getElementById('vbmFname').value.trim();
  const lname = document.getElementById('vbmLname').value.trim();

  document.getElementById('rvVilla').textContent   = v.name;
  document.getElementById('rvCI').textContent      = new Date(ci).toLocaleDateString('en-IN', fmt);
  document.getElementById('rvCO').textContent      = new Date(co).toLocaleDateString('en-IN', fmt);
  document.getElementById('rvNights').textContent  = nights + (nights===1?' night':' nights');
  document.getElementById('rvGuests').textContent  = document.getElementById('vbmGuests').value;
  document.getElementById('rvName').textContent    = (fname+' '+lname).trim();
  document.getElementById('rvEmail').textContent   = document.getElementById('vbmEmail').value.trim();
  document.getElementById('rvPhone').textContent   = document.getElementById('vbmPhone').value.trim();
  document.getElementById('rvTotal').textContent   = '₹' + (nights * v.price).toLocaleString('en-IN');
}

/* ════════════════════════════════
   CONFIRM + SEND EMAIL
════════════════════════════════ */
async function vbmConfirm() {
  const btn   = document.getElementById('vbmConfirmBtn');
  const txtEl = document.getElementById('vbmConfirmTxt');
  const spinEl= document.getElementById('vbmConfirmLoader');
  const v     = villas[vbmCurrentVilla];
  const nights= vbmNights();
  const ci    = document.getElementById('vbmCheckin').value;
  const co    = document.getElementById('vbmCheckout').value;
  const fmt   = { day:'numeric', month:'short', year:'numeric' };
  const fname = document.getElementById('vbmFname').value.trim();
  const lname = document.getElementById('vbmLname').value.trim();
  const email = document.getElementById('vbmEmail').value.trim();
  const phone = document.getElementById('vbmPhone').value.trim();
  const reqs  = document.getElementById('vbmRequests').value.trim() || 'None';
  const total = '₹' + (nights * v.price).toLocaleString('en-IN');
  const deposit = '₹' + Math.round(nights * v.price * 0.3).toLocaleString('en-IN');
  const fullName  = (fname + ' ' + lname).trim();
  const ciStr     = new Date(ci).toLocaleDateString('en-IN', fmt);
  const coStr     = new Date(co).toLocaleDateString('en-IN', fmt);
  const guestsVal = document.getElementById('vbmGuests').value;

  btn.disabled = true;
  txtEl.classList.add('hidden');
  spinEl.classList.remove('hidden');

  /* ── Clean, beautiful plain-text email ── */
  const subject = `New Booking Request — ${v.name} — ${fullName}`;

  const message =
`BOOKMYVILLA — NEW BOOKING REQUEST
====================================

VILLA DETAILS
  Name     : ${v.name}
  Location : ${v.location}

BOOKING DATES
  Check-in  : ${ciStr}
  Check-out : ${coStr}
  Nights    : ${nights} ${nights===1?'night':'nights'}
  Guests    : ${guestsVal}

PAYMENT
  Total Amount  : ${total}
  Deposit (30%) : ${deposit}

GUEST INFORMATION
  Name     : ${fullName}
  Email    : ${email}
  Phone    : ${phone}
  Requests : ${reqs}

------------------------------------
TO APPROVE THIS BOOKING
Reply to this email or write directly to the guest:
  Guest Email : ${email}
  Guest Phone : ${phone}

Suggested reply to guest:
  "Dear ${fname}, your booking at ${v.name} (${ciStr} to ${coStr}) is confirmed.
  Please transfer the deposit of ${deposit} to HDFC Bank A/C: 1234 5678 9012
  IFSC: HDFC0001234. Our team will contact you shortly."

====================================
BookMyVilla | hello@bookmyvilla.in | +91 98000 12345`;

  try {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email : ADMIN_EMAIL,
      subject  : subject,
      message  : message,
    });
  } catch (err) {
    console.warn('EmailJS:', err.text || err);
  }

  document.getElementById('vbmSuccessName').textContent  = fname;
  document.getElementById('vbmSuccessEmail').textContent = email;
  vbmCurrentStep = 5;
  vbmShowPane(5);

  btn.disabled = false;
  txtEl.classList.remove('hidden');
  spinEl.classList.add('hidden');
}

/* ════════════════════════════════
   TOAST
════════════════════════════════ */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 5000);
}

/* ════════════════════════════════
   INIT
════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initCursor(); initLoader(); initNav(); initReveal(); initCountUp();

  document.getElementById('vbmOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('vbmOverlay')) closeVbm();
  });
  document.getElementById('vbmClose').addEventListener('click', closeVbm);

  const s = document.createElement('style');
  s.textContent = `@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}`;
  document.head.appendChild(s);
});
