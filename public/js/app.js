// MyErossence — App Core (nav, cookie banner, utils)

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initCookieBanner();
  initScrollAnimations();
  initNewsletterForm();
});

// --- Navigation ---
function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav-menu');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    toggle.classList.toggle('active');
    toggle.setAttribute('aria-expanded', nav.classList.contains('active'));
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-toggle') && !e.target.closest('.nav-menu')) {
      nav.classList.remove('active');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Active link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// --- Cookie Banner ---
function initCookieBanner() {
  if (localStorage.getItem('cookies-accepted')) return;

  const banner = document.getElementById('cookie-banner');
  if (!banner) return;

  banner.style.display = 'flex';

  const acceptBtn = banner.querySelector('.cookie-accept');
  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookies-accepted', 'true');
      banner.style.display = 'none';
    });
  }

  const declineBtn = banner.querySelector('.cookie-decline');
  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookies-accepted', 'declined');
      banner.style.display = 'none';
    });
  }
}

// --- Scroll Animations ---
function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
}

// --- Newsletter Form ---
function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]').value.trim();
    if (!email) return;

    const btn = form.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = 'Subscribing...';
    btn.disabled = true;

    try {
      await supabaseInsert('subscribers', { email });
      form.innerHTML = '<p class="success-message">Thank you for subscribing!</p>';
    } catch (err) {
      if (err.message.includes('409') || err.message.includes('23505')) {
        form.innerHTML = '<p class="success-message">You\'re already subscribed!</p>';
      } else {
        btn.textContent = originalText;
        btn.disabled = false;
        alert('Something went wrong. Please try again.');
      }
    }
  });
}

// --- Utility ---
function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}
