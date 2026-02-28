# MyErossence — Premium Hair Care Affiliate Site

Static affiliate marketing website for premium hair care products.

## Stack

- **Frontend:** Static HTML/CSS/JS (hosted on DO App Platform, free)
- **Database:** Supabase PostgreSQL (products, articles, click tracking)
- **CDN/DNS:** Cloudflare (proxy + Worker for affiliate redirects)
- **Affiliate:** Amazon Associates (`tag=fla096-21`)

## Structure

```
public/          → Static site (DO App Platform document root)
worker/          → Cloudflare Worker (/go/<slug> redirect)
sql/             → Database schema
scripts/         → Seed data
```

## How It Works

1. Site loads products from Supabase REST API
2. User clicks "View on Amazon" → `/go/<slug>`
3. Cloudflare Worker looks up affiliate URL → 302 redirect to Amazon
4. Click is logged in `click_logs` table

## Managing Products

Open **Supabase Dashboard** → `products` table → Insert/Edit rows.
Products appear on the site automatically on next page load.

## Deploy

Push to `main` → DO App Platform auto-deploys from `public/`.
