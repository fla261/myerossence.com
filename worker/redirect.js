// MyErossence — Cloudflare Worker — /go/<slug> affiliate redirect
// Route: myerossence.com/go/*

const SUPABASE_URL = 'https://xxhpetdcvuinplongdjm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4aHBldGRjdnVpbnBsb25nZGptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNzExMTUsImV4cCI6MjA4Nzg0NzExNX0.i5PpxICG_ojyDVb0UmYORxD7h45UtadokxKkucY3rzw';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Extract slug from /go/<slug>
    const match = path.match(/^\/go\/([a-z0-9-]+)\/?$/);
    if (!match) {
      return new Response('Not found', { status: 404 });
    }

    const slug = match[1];

    try {
      // Fetch product affiliate URL from Supabase
      const apiUrl = `${SUPABASE_URL}/rest/v1/products?slug=eq.${encodeURIComponent(slug)}&status=eq.active&select=affiliate_url&limit=1`;
      const res = await fetch(apiUrl, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });

      const products = await res.json();

      if (!products || products.length === 0 || !products[0].affiliate_url) {
        // Product not found — redirect to shop
        return Response.redirect('https://myerossence.com/shop.html', 302);
      }

      const affiliateUrl = products[0].affiliate_url;

      // Log click asynchronously (fire and forget)
      const referrer = request.headers.get('Referer') || '';
      const country = request.cf?.country || '';

      fetch(`${SUPABASE_URL}/rest/v1/click_logs`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          product_slug: slug,
          referrer: referrer.substring(0, 500),
          country: country,
        }),
      }).catch(() => {});  // Ignore click log errors

      // 302 redirect to affiliate URL
      return Response.redirect(affiliateUrl, 302);

    } catch (err) {
      // On error, redirect to shop page
      return Response.redirect('https://myerossence.com/shop.html', 302);
    }
  },
};
