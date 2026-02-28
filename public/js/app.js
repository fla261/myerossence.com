/* MyErossence 2027 - Affiliate Site JavaScript */

(function() {
  'use strict';

  // ==========================================
  // UTILITIES
  // ==========================================
  function getStorage(key, defaultValue) {
    try {
      var item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  }

  function setStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
  }

  function formatPrice(price) {
    return '\u00a3' + price.toFixed(2);
  }

  // Build affiliate tracking URL via /go/ redirect page
  function getTrackingUrl(product, source) {
    if (!product.affiliateUrl || product.affiliateUrl === '#') return '';
    var slug = product.slug || ('product-' + product.id);
    return '/go/?slug=' + encodeURIComponent(slug) + '&url=' + encodeURIComponent(product.affiliateUrl) + '&src=' + (source || 'site');
  }

  // ==========================================
  // COOKIE BANNER
  // ==========================================
  function initCookieBanner() {
    var banner = document.getElementById('cookieBanner');
    if (!banner) return;
    if (getStorage('myerossence_cookies', false)) return;

    setTimeout(function() { banner.classList.add('active'); }, 2000);

    var acceptBtn = banner.querySelector('[data-cookie-accept]');
    if (acceptBtn) {
      acceptBtn.onclick = function() {
        setStorage('myerossence_cookies', true);
        banner.classList.remove('active');
      };
    }

    var declineBtn = banner.querySelector('[data-cookie-decline]');
    if (declineBtn) {
      declineBtn.onclick = function() {
        banner.classList.remove('active');
      };
    }
  }

  // ==========================================
  // MOBILE NAVIGATION
  // ==========================================
  function initMobileNav() {
    var toggle = document.querySelector('.mobile-nav-toggle');
    var nav = document.querySelector('.mobile-nav');
    var overlay = document.querySelector('.mobile-nav-overlay');
    var closeBtn = document.querySelector('.mobile-nav-close');
    if (!toggle || !nav) return;

    function open() {
      nav.classList.add('active');
      if (overlay) overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      nav.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    toggle.onclick = function() {
      nav.classList.contains('active') ? close() : open();
    };
    if (overlay) overlay.onclick = close;
    if (closeBtn) closeBtn.onclick = close;
  }

  // ==========================================
  // SEARCH MODAL
  // ==========================================
  function initSearch() {
    var modal = document.getElementById('searchModal');
    var input = modal ? (modal.querySelector('.search-input') || modal.querySelector('.search-modal__input')) : null;
    if (!modal) return;

    function open() {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (input) input.focus();
    }

    function close() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    var triggers = document.querySelectorAll('[data-search-open]');
    for (var i = 0; i < triggers.length; i++) {
      triggers[i].onclick = function(e) { e.preventDefault(); open(); };
    }

    var closeBtn = modal.querySelector('[data-search-close]');
    if (closeBtn) closeBtn.onclick = close;

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) close();
    });
  }

  // ==========================================
  // HEADER COMPACT ON SCROLL
  // ==========================================
  function initHeaderCompact() {
    var header = document.getElementById('header');
    if (!header) return;

    var lastScroll = 0;
    window.addEventListener('scroll', function() {
      var currentScroll = window.scrollY;
      if (currentScroll > 100) {
        header.classList.add('header--compact');
      } else {
        header.classList.remove('header--compact');
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ==========================================
  // WISHLIST
  // ==========================================
  var wishlist = getStorage('myerossence_wishlist', []);

  function updateWishlistUI() {
    var countEls = document.querySelectorAll('.wishlist-count');
    var count = wishlist.length;
    for (var i = 0; i < countEls.length; i++) {
      countEls[i].textContent = count;
      countEls[i].style.display = count > 0 ? 'flex' : 'none';
    }

    var buttons = document.querySelectorAll('[data-wishlist-toggle]');
    for (var j = 0; j < buttons.length; j++) {
      var id = parseInt(buttons[j].getAttribute('data-product-id'));
      buttons[j].classList.toggle('active', wishlist.indexOf(id) > -1);
    }
  }

  function toggleWishlist(productId) {
    var id = parseInt(productId);
    var index = wishlist.indexOf(id);
    if (index > -1) {
      wishlist.splice(index, 1);
      showToast('Removed from wishlist');
    } else {
      wishlist.push(id);
      showToast('Added to wishlist');
    }
    setStorage('myerossence_wishlist', wishlist);
    updateWishlistUI();
  }

  // ==========================================
  // TOAST NOTIFICATION
  // ==========================================
  function showToast(title, message) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    var titleEl = document.getElementById('toastTitle');
    var msgEl = document.getElementById('toastMessage');
    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message || '';
    toast.classList.add('active');
    setTimeout(function() { toast.classList.remove('active'); }, 3000);
  }

  // ==========================================
  // FAQ ACCORDION
  // ==========================================
  function initFAQ() {
    var items = document.querySelectorAll('.faq__item');
    for (var i = 0; i < items.length; i++) {
      (function(item) {
        var question = item.querySelector('.faq__question');
        if (question) {
          question.onclick = function() {
            var isOpen = item.classList.contains('active');
            for (var j = 0; j < items.length; j++) items[j].classList.remove('active');
            if (!isOpen) item.classList.add('active');
          };
        }
      })(items[i]);
    }
  }

  // ==========================================
  // PRODUCT CARDS (Affiliate Version)
  // ==========================================
  function renderProducts(container, products) {
    if (!container || !products || products.length === 0) return;
    var html = '';
    var openInNewTab = SETTINGS.affiliateOpenNewTab;
    var btnText = SETTINGS.affiliateButtonText || 'Shop Now';

    for (var i = 0; i < products.length; i++) {
      var p = products[i];
      var badges = '';
      if (p.isNew) badges += '<span class="product-badge product-badge--new">New</span>';
      if (p.isSale) badges += '<span class="product-badge product-badge--sale">Sale</span>';

      var priceHtml = '<span>' + formatPrice(p.price) + '</span>';
      if (p.comparePrice) {
        priceHtml = '<span>' + formatPrice(p.price) + '</span><span class="product-card__price--compare">' + formatPrice(p.comparePrice) + '</span>';
      }

      var wishlistActive = wishlist.indexOf(p.id) > -1 ? 'active' : '';
      var target = openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';

      // Affiliate button or view details
      var affiliateBtn = '';
      var trackUrl = getTrackingUrl(p, 'shop');
      if (trackUrl) {
        affiliateBtn = '<a href="' + trackUrl + '" class="product-card__affiliate-btn product-card__affiliate-btn--primary"' + target + '>' + btnText + '</a>';
      } else {
        affiliateBtn = '<a href="product.html?id=' + p.id + '" class="product-card__affiliate-btn product-card__affiliate-btn--secondary">View Details</a>';
      }

      html += '<div class="product-card scroll-reveal">' +
        '<div class="product-card__inner">' +
        '<div class="product-card__image img-hover-zoom">' +
          '<a href="product.html?id=' + p.id + '">' +
            '<img src="' + p.image + '" alt="' + p.title + '" loading="lazy">' +
          '</a>' +
          '<div class="product-card__badges">' + badges + '</div>' +
          '<div class="product-card__actions">' +
            '<button class="product-card__action ' + wishlistActive + '" data-wishlist-toggle data-product-id="' + p.id + '" aria-label="Add to wishlist">' +
              '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>' +
            '</button>' +
          '</div>' +
        '</div>' +
        '<div class="product-card__info">' +
          '<p class="product-card__vendor">' + p.vendor + '</p>' +
          '<h3 class="product-card__title"><a href="product.html?id=' + p.id + '">' + p.title + '</a></h3>' +
          '<div class="product-card__price">' + priceHtml + '</div>' +
          affiliateBtn +
        '</div>' +
        '</div>' +
      '</div>';
    }

    container.innerHTML = html;
  }

  function initProducts() {
    if (typeof PRODUCTS === 'undefined' || PRODUCTS.length === 0) return;

    var featuredContainer = document.querySelector('[data-featured-products]');
    if (featuredContainer) {
      var featured = [];
      for (var i = 0; i < PRODUCTS.length; i++) {
        if (PRODUCTS[i].tags && PRODUCTS[i].tags.indexOf('bestseller') > -1) featured.push(PRODUCTS[i]);
      }
      if (featured.length === 0) featured = PRODUCTS.slice(0, 4);
      renderProducts(featuredContainer, featured.slice(0, 4));
    }

    var newContainer = document.querySelector('[data-new-arrivals]');
    if (newContainer) {
      var newProducts = [];
      for (var j = 0; j < PRODUCTS.length; j++) {
        if (PRODUCTS[j].isNew) newProducts.push(PRODUCTS[j]);
      }
      if (newProducts.length === 0) newProducts = PRODUCTS.slice(-4);
      renderProducts(newContainer, newProducts.slice(0, 4));
    }
  }

  // ==========================================
  // BENTO GRID
  // ==========================================
  function initBentoGrid() {
    var grid = document.querySelector('[data-bento-grid]');
    if (!grid || typeof PRODUCTS === 'undefined' || PRODUCTS.length < 3) return;

    var cells = '';
    var openInNewTab = SETTINGS.affiliateOpenNewTab;
    var btnText = SETTINGS.affiliateButtonText || 'Shop Now';
    var target = openInNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';

    // Cell 1: Editorial (large)
    cells += '<div class="bento-cell bento-cell--editorial">' +
      '<div class="bento-cell__eyebrow">The Science of Growth</div>' +
      '<h3 class="bento-cell__title">Revolutionary Organic Formulas for Transformative Results</h3>' +
      '<p class="bento-cell__desc">Every product is crafted with 12 months of research, clinical-grade peptides, and rare botanicals sourced from three continents.</p>' +
      '<a href="about.html" class="bento-cell__affiliate-btn">Learn More</a>' +
    '</div>';

    // Cell 2: Product
    var p1 = PRODUCTS[0];
    cells += '<div class="bento-cell bento-cell--product">' +
      '<div class="bento-cell__image img-hover-zoom"><a href="product.html?id=' + p1.id + '"><img src="' + p1.image + '" alt="' + p1.title + '" loading="lazy"></a></div>' +
      '<div class="bento-cell__content">' +
        '<h4 style="font-size:1rem;margin-bottom:0.25rem;">' + p1.title + '</h4>' +
        '<p style="color:var(--primary);font-weight:600;">' + formatPrice(p1.price) + '</p>' +
        (getTrackingUrl(p1, 'bento') ? '<a href="' + getTrackingUrl(p1, 'bento') + '" class="bento-cell__affiliate-btn"' + target + '>' + btnText + '</a>' : '') +
      '</div>' +
    '</div>';

    // Cell 3: Quote
    cells += '<div class="bento-cell bento-cell--quote">' +
      '<div class="bento-cell__quote-mark">&ldquo;</div>' +
      '<p class="bento-cell__quote-text">True beauty radiates from within. Nourish your skin, body, and spirit.</p>' +
    '</div>';

    // Cell 4: Product
    var p2 = PRODUCTS[1];
    cells += '<div class="bento-cell bento-cell--product">' +
      '<div class="bento-cell__image img-hover-zoom"><a href="product.html?id=' + p2.id + '"><img src="' + p2.image + '" alt="' + p2.title + '" loading="lazy"></a></div>' +
      '<div class="bento-cell__content">' +
        '<h4 style="font-size:1rem;margin-bottom:0.25rem;">' + p2.title + '</h4>' +
        '<p style="color:var(--primary);font-weight:600;">' + formatPrice(p2.price) + '</p>' +
        (getTrackingUrl(p2, 'bento') ? '<a href="' + getTrackingUrl(p2, 'bento') + '" class="bento-cell__affiliate-btn"' + target + '>' + btnText + '</a>' : '') +
      '</div>' +
    '</div>';

    // Cell 5: Image
    cells += '<div class="bento-cell bento-cell--image img-hover-zoom">' +
      '<img src="images/placeholder.svg" alt="MyErossence lifestyle" loading="lazy">' +
    '</div>';

    // Cell 6: Product
    var p3 = PRODUCTS[2];
    cells += '<div class="bento-cell bento-cell--product">' +
      '<div class="bento-cell__image img-hover-zoom"><a href="product.html?id=' + p3.id + '"><img src="' + p3.image + '" alt="' + p3.title + '" loading="lazy"></a></div>' +
      '<div class="bento-cell__content">' +
        '<h4 style="font-size:1rem;margin-bottom:0.25rem;">' + p3.title + '</h4>' +
        '<p style="color:var(--primary);font-weight:600;">' + formatPrice(p3.price) + '</p>' +
        (getTrackingUrl(p3, 'bento') ? '<a href="' + getTrackingUrl(p3, 'bento') + '" class="bento-cell__affiliate-btn"' + target + '>' + btnText + '</a>' : '') +
      '</div>' +
    '</div>';

    grid.innerHTML = cells;
  }

  // ==========================================
  // SOCIAL FEED
  // ==========================================
  function renderSocialCards(filter) {
    var container = document.querySelector('[data-social-feed]');
    if (!container || typeof SOCIAL_POSTS === 'undefined') return;

    var posts = filter === 'all' ? SOCIAL_POSTS : SOCIAL_POSTS.filter(function(p) { return p.platform === filter; });
    var html = '';

    var platformIcons = {
      instagram: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>',
      tiktok: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>',
      youtube: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
      pinterest: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>',
      facebook: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>'
    };

    for (var i = 0; i < posts.length; i++) {
      var post = posts[i];
      html += '<a href="' + post.url + '" class="social-card social-card--' + post.platform + '" target="_blank" rel="noopener noreferrer">' +
        '<img class="social-card__image" src="' + post.image + '" alt="' + post.caption + '" loading="lazy">' +
        '<div class="social-card__platform social-card__platform--' + post.platform + '">' + (platformIcons[post.platform] || '') + '</div>' +
        '<div class="social-card__overlay">' +
          '<p class="social-card__caption">' + post.caption + '</p>' +
          '<p class="social-card__username">' + post.username + '</p>' +
        '</div>' +
        '<div class="social-card__accent-bar"></div>' +
      '</a>';
    }

    container.innerHTML = html;
  }

  function initSocialFeed() {
    renderSocialCards('all');

    var filters = document.querySelectorAll('[data-social-filter]');
    for (var i = 0; i < filters.length; i++) {
      filters[i].onclick = function() {
        for (var j = 0; j < filters.length; j++) filters[j].classList.remove('active');
        this.classList.add('active');
        renderSocialCards(this.getAttribute('data-social-filter'));
      };
    }
  }

  // ==========================================
  // SCROLL ANIMATIONS FALLBACK
  // ==========================================
  function initScrollAnimations() {
    if (CSS.supports && CSS.supports('animation-timeline', 'view()')) return;

    var targets = document.querySelectorAll('.scroll-reveal, .scroll-reveal-scale, .scroll-slide-left, .scroll-slide-right, .scroll-image-reveal, .scroll-rotate-in, .scroll-blur-in, .scroll-stagger');
    if (!targets.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    targets.forEach(function(el) { observer.observe(el); });
  }

  // ==========================================
  // NEWSLETTER FORM (Supabase)
  // ==========================================
  function initNewsletter() {
    var form = document.getElementById('newsletterForm');
    if (!form) return;
    form.onsubmit = function(e) {
      e.preventDefault();
      var emailInput = form.querySelector('input[type="email"]');
      var submitBtn = form.querySelector('button[type="submit"]');
      if (!emailInput || !emailInput.value) return;

      var email = emailInput.value.trim();
      if (!email) return;

      // Disable button while submitting
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Subscribing...';
      }

      supabaseInsert('subscribers', { email: email, source: 'footer' })
      .then(function() {
        showToast('Thank you!', 'You have been subscribed.');
        form.reset();
      })
      .catch(function(err) {
        if (err.message && (err.message.indexOf('409') > -1 || err.message.indexOf('23505') > -1)) {
          showToast('Already subscribed!', 'You are already on our list.');
        } else {
          showToast('Oops!', 'Network error. Please try again.');
        }
      })
      .finally(function() {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Join Now';
        }
      });
    };
  }

  // ==========================================
  // EVENT DELEGATION
  // ==========================================
  function initEventDelegation() {
    document.addEventListener('click', function(e) {
      var wishlistBtn = e.target.closest('[data-wishlist-toggle]');
      if (wishlistBtn) {
        e.preventDefault();
        toggleWishlist(wishlistBtn.getAttribute('data-product-id'));
      }
    });
  }

  // ==========================================
  // INITIALIZE
  // ==========================================
  function init() {
    initCookieBanner();
    initMobileNav();
    initSearch();
    initHeaderCompact();
    initFAQ();
    initProducts();
    initBentoGrid();
    initSocialFeed();
    initScrollAnimations();
    initEventDelegation();
    initNewsletter();
    updateWishlistUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-init product-dependent sections when Supabase data arrives
  document.addEventListener('products-loaded', function() {
    initProducts();
    initBentoGrid();
    updateWishlistUI();
  });

})();
