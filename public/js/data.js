/* ============================================
   MyErossence — Data Bridge
   Static: SETTINGS, SOCIAL_POSTS, COLLECTIONS
   Async: PRODUCTS from Supabase
   ============================================ */

// ── COLLECTIONS ──────────────────────────────
var COLLECTIONS = [
  { id: 1, title: "Best Sellers", slug: "best-sellers", description: "Our most-loved premium beauty products, backed by thousands of real reviews.", image: "images/placeholder.svg", productIds: [1, 2, 11, 13, 29, 31, 32, 46, 49, 55, 58] },
  { id: 2, title: "New Arrivals", slug: "new-arrivals", description: "The latest breakthrough formulas and innovative beauty discoveries.", image: "images/placeholder.svg", productIds: [4, 15, 23, 35, 41, 44, 59] },
  { id: 3, title: "Shampoo & Conditioner", slug: "shampoo", description: "Premium sulfate-free and bond-building cleansers and conditioners for every hair type.", image: "images/placeholder.svg", productIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { id: 4, title: "Hair Oils & Serums", slug: "hair-oil", description: "Luxurious oils and serums for shine, repair, and frizz control.", image: "images/placeholder.svg", productIds: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
  { id: 5, title: "Scalp Care", slug: "scalp-treatment", description: "Expert scalp treatments, scrubs, and serums for a healthy foundation.", image: "images/placeholder.svg", productIds: [21, 22, 23, 24, 25, 26, 27, 28] },
  { id: 6, title: "Skincare", slug: "skincare", description: "Dermatologist-recommended skincare essentials for radiant, healthy skin.", image: "images/placeholder.svg", productIds: [29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
  { id: 7, title: "Hair Growth", slug: "hair-growth", description: "Clinically tested serums and supplements for thicker, fuller hair.", image: "images/placeholder.svg", productIds: [41, 42, 43, 44, 45, 46, 47] },
  { id: 8, title: "Hair Masks & Treatments", slug: "hair-mask", description: "Deep conditioning masks and intensive repair treatments for transformed hair.", image: "images/placeholder.svg", productIds: [48, 49, 50, 51, 52, 53, 54] },
  { id: 9, title: "Body Care", slug: "body-care", description: "Indulgent body creams, mists, and treatments for head-to-toe luxury.", image: "images/placeholder.svg", productIds: [55, 56, 57, 58, 59] },
  { id: 10, title: "Gift Sets", slug: "gift-sets", description: "Curated beauty sets and bundles — perfect for gifting or treating yourself.", image: "images/placeholder.svg", productIds: [60, 16, 48, 49] }
];

// ── SOCIAL POSTS ─────────────────────────────
var SOCIAL_POSTS = [
  { platform: 'instagram', image: 'images/placeholder.svg', caption: 'My holy grail Moroccanoil Treatment Original \u2014 instant shine and smoothness in seconds.', url: '#', username: '@myerossence' },
  { platform: 'tiktok', image: 'images/placeholder.svg', caption: '90-day hair growth results with Vegamour GRO Serum. The before & after is unreal.', url: '#', username: '@myerossence' },
  { platform: 'youtube', image: 'images/placeholder.svg', caption: 'Complete wash day routine: Olaplex No.4 + No.5 + K18 mask. Salon results at home.', url: '#', username: 'MyErossence' },
  { platform: 'pinterest', image: 'images/placeholder.svg', caption: 'The ultimate shelfie: Oribe, Moroccanoil, and Briogeo. Premium beauty essentials.', url: '#', username: 'myerossence' },
  { platform: 'instagram', image: 'images/placeholder.svg', caption: 'Mielle Rosemary Mint Oil \u2014 the \u20ac10 product with 200K+ reviews. Worth every penny.', url: '#', username: '@myerossence' },
  { platform: 'tiktok', image: 'images/placeholder.svg', caption: 'K18 mask vs. Olaplex No.8: which bond repair treatment actually works better?', url: '#', username: '@myerossence' }
];

// ── SETTINGS ─────────────────────────────────
var SETTINGS = {
  siteName: "MyErossence",
  currency: "EUR",
  currencySymbol: "\u20ac",
  affiliateButtonText: "Shop Now",
  affiliateOpenNewTab: true,
  ageVerificationEnabled: false,
  social: {
    instagram: "https://instagram.com/myerossence",
    tiktok: "https://tiktok.com/@myerossence",
    youtube: "https://youtube.com/@myerossence",
    pinterest: "https://pinterest.com/myerossence",
    facebook: "#",
    twitter: "#"
  }
};

// ── PRODUCTS (async from Supabase) ───────────
var PRODUCTS = [];

// Expose globally
window.COLLECTIONS = COLLECTIONS;
window.SOCIAL_POSTS = SOCIAL_POSTS;
window.SETTINGS = SETTINGS;
window.PRODUCTS = PRODUCTS;

// Fetch products from Supabase and map to app format
(function() {
  if (typeof supabaseFetch !== 'function') {
    console.warn('supabase.js not loaded — products will be empty');
    return;
  }

  supabaseFetch('products', 'select=*&in_stock=eq.true&order=id.asc')
    .then(function(rows) {
      var mapped = [];
      for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        var tags = r.tags || [];
        mapped.push({
          id: r.id,
          title: r.name || r.title || 'Product',
          slug: r.slug || ('product-' + r.id),
          vendor: r.brand || r.vendor || 'MyErossence',
          price: r.price || 0,
          comparePrice: r.compare_price || null,
          image: r.image_url || r.image || 'images/placeholder.svg',
          images: [r.image_url || r.image || 'images/placeholder.svg'],
          category: r.category || 'uncategorized',
          tags: tags,
          description: r.description || '',
          rating: r.rating || 4.5,
          reviewCount: r.review_count || 0,
          hairType: r.hair_type || [],
          ingredients: r.ingredients || [],
          inStock: r.in_stock !== false,
          isNew: tags.indexOf('new') > -1,
          isSale: tags.indexOf('sale') > -1,
          affiliateUrl: r.affiliate_url || ''
        });
      }

      // Replace global array contents
      PRODUCTS.length = 0;
      for (var j = 0; j < mapped.length; j++) PRODUCTS.push(mapped[j]);
      window.PRODUCTS = PRODUCTS;

      // Notify app.js that products are ready
      document.dispatchEvent(new Event('products-loaded'));
    })
    .catch(function(err) {
      console.warn('Supabase products fetch failed:', err.message);
    });
})();
