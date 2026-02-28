# MyErossence — Plan de Rebuild de la Zero
**Data:** 27 Februarie 2026
**Versiune:** 1.0
**Status:** DRAFT — necesită aprobare înainte de orice acțiune

---

## 1. Ce am șters (stare actuală)

| Resursă | Status |
|---------|--------|
| Cloudflare Worker `myerossence-affiliate-worker` | ✅ Șters |
| Cloudflare Pages `myerossence` | ✅ Șters |
| Cloudflare D1 `myerossence-clicks` | ✅ Șters |
| Supabase project `xccgzfitbszowyqbnccj` | ✅ Șters |

**Ce rămâne activ:**
- Domeniul `myerossence.com` pe Cloudflare DNS
- Contul Cloudflare (ID: `48079c5e7dc9a69227e49e7d78981766`)
- Contul Supabase (org: `fla261's Org`, free plan)
- Contul DigitalOcean (activ, cu MCP tools)
- Contul Shopify (store cu 25 produse, password-protected)
- Social media: @myerossence pe Instagram, TikTok, Pinterest, YouTube
- 7 programe de afiliere (Amazon, Awin, ShareASale, CJ, Rakuten, Sephora, iHerb)

---

## 2. Noua Arhitectură

```
┌─────────────────────────────────────────────────────────┐
│                    UTILIZATOR / VIZITATOR                │
│                   myerossence.com                        │
└────────────────────────┬────────────────────────────────┘
                         │
                    Cloudflare DNS
                         │
              ┌──────────┴──────────┐
              │                     │
     /go/<slug>                Tot restul
              │                     │
   Cloudflare Worker        DigitalOcean
   (redirect afiliat)      App Platform
              │                     │
              │              ┌──────┴──────┐
              │              │             │
              │          Frontend      API proxy
              │         (Static)     (optional)
              │              │             │
              │              └──────┬──────┘
              │                     │
              │               Supabase
              │            (PostgreSQL +
              │             Edge Functions)
              └─────────────────────┘
```

### Rolul fiecărui serviciu:

| Serviciu | Rol | De ce |
|----------|-----|-------|
| **GitHub** | Repository unic de cod | Sursă de adevăr, versionare, PR-uri |
| **DigitalOcean App Platform** | Hosting frontend + build | Git-connected, auto-deploy din GitHub, SSL gratuit, CDN |
| **Cloudflare** | DNS + Worker `/go/` | Domeniul e deja aici; Worker doar pt redirecturi affiliate |
| **Supabase** | Bază de date + API | PostgreSQL gratuit, Edge Functions, dashboard admin |

### De ce DigitalOcean App Platform (nu Cloudflare Pages):
1. **Git deploy nativ** — push pe `main` = deploy automat
2. **Preview deploys** — fiecare PR generează un URL de preview
3. **Build logs clare** — debugging real, nu ghiceli
4. **Integrare DO** — poți adăuga Spaces (storage), DB, monitoring mai târziu
5. **Control** — environment variables, build commands, rollback instant

---

## 3. Structura Repository GitHub

```
myerossence/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD (opțional, DO face auto-deploy)
├── src/
│   ├── index.html              # Homepage
│   ├── shop.html               # Product catalog
│   ├── blog/
│   │   └── index.html          # Blog listing
│   ├── about.html              # About page
│   ├── css/
│   │   └── style.css           # Design system (variabile, componente)
│   ├── js/
│   │   ├── app.js              # Main app logic
│   │   ├── products.js         # Fetch & render products from Supabase
│   │   └── blog.js             # Fetch & render articles from Supabase
│   └── assets/
│       ├── images/             # Logo, hero, icons
│       └── fonts/              # Cormorant Garamond, Montserrat
├── worker/
│   └── affiliate-redirect.js   # Cloudflare Worker source code
├── supabase/
│   └── migrations/
│       └── 001_initial.sql     # Schema complet
├── package.json                # (opțional) pentru build tools
└── README.md
```

**Principiu cheie:** Tot codul e într-un singur repo. Orice schimbare = commit → push → deploy automat.

---

## 4. Schema Bazei de Date (Supabase — Proiect Nou)

Se recreează aceeași schemă, cu mici îmbunătățiri:

### Tabel: `products` (catalog produse)
```
id              SERIAL PRIMARY KEY
name            TEXT NOT NULL
brand           TEXT
price           NUMERIC(10,2)
slug            TEXT UNIQUE          -- /go/<slug>
affiliate_url   TEXT                 -- URL complet afiliat
affiliate_program TEXT               -- amazon, awin, shareasale, etc.
status          TEXT DEFAULT 'active' -- active, link_broken, discontinued
category        TEXT                 -- shampoo, conditioner, oil, serum, etc.
hair_type       TEXT[]               -- NEW: curly, straight, oily, dry, etc.
description     TEXT
image_url       TEXT                 -- NEW: URL imagine produs
rating          NUMERIC(2,1)         -- NEW: rating 1-5
created_at      TIMESTAMPTZ DEFAULT NOW()
updated_at      TIMESTAMPTZ DEFAULT NOW()
```

### Tabel: `articles` (blog)
```
id              SERIAL PRIMARY KEY
title           TEXT NOT NULL
slug            TEXT UNIQUE
body_html       TEXT                 -- renamed: body_html (nu body_mdx)
excerpt         TEXT                 -- 160 char
category        TEXT                 -- reviews, guides, best-of, comparisons, etc.
status          TEXT DEFAULT 'draft' -- draft, published, archived
seo_title       TEXT                 -- max 60 chars
seo_description TEXT                 -- max 155 chars
seo_keywords    TEXT[]               -- ARRAY
featured_image  TEXT                 -- NEW: URL imagine articol
author          TEXT DEFAULT 'MyErossence'
created_at      TIMESTAMPTZ DEFAULT NOW()
updated_at      TIMESTAMPTZ DEFAULT NOW()
```

### Tabel: `social_posts` (content queue)
```
id              SERIAL PRIMARY KEY
platform        TEXT                 -- instagram, tiktok, pinterest, youtube
caption         TEXT
hashtags        TEXT[]
status          TEXT DEFAULT 'queued' -- queued, scheduled, posted, failed
posting_time    TIMESTAMPTZ
article_id      INTEGER REFERENCES articles(id) -- NEW: legătură la articol sursă
created_at      TIMESTAMPTZ DEFAULT NOW()
```

### Tabel: `subscribers` (newsletter)
```
id              SERIAL PRIMARY KEY
email           TEXT UNIQUE
status          TEXT DEFAULT 'active' -- NEW: active, unsubscribed
created_at      TIMESTAMPTZ DEFAULT NOW()
```

### Tabel: `affiliate_programs` (programe)
```
id              SERIAL PRIMARY KEY
name            TEXT NOT NULL
network         TEXT
status          TEXT DEFAULT 'pending_signup'
commission_rate TEXT
cookie_duration TEXT
signup_url      TEXT
dashboard_url   TEXT
notes           TEXT
created_at      TIMESTAMPTZ DEFAULT NOW()
updated_at      TIMESTAMPTZ DEFAULT NOW()
```

### Tabel: `agent_logs` (activity tracking)
```
id              SERIAL PRIMARY KEY
agent_name      TEXT
action          TEXT
status          TEXT                 -- completed, failed
details         JSONB
created_at      TIMESTAMPTZ DEFAULT NOW()
```

### Tabel: `price_history` (tracking prețuri)
```
id              SERIAL PRIMARY KEY
product_id      INTEGER REFERENCES products(id)
price           NUMERIC(10,2)
source          TEXT
checked_at      TIMESTAMPTZ DEFAULT NOW()
```

**Îmbunătățiri față de schema veche:**
- `body_mdx` redenumit → `body_html` (era confuz, conținea HTML)
- `hair_type TEXT[]` pe products (filtrare pe site)
- `image_url` pe products și `featured_image` pe articles
- `rating` pe products
- `article_id` pe social_posts (traceability)
- `status` pe subscribers (GDPR unsubscribe)
- Default values consistente

---

## 5. Paginile Site-ului (Frontend)

### Navigație principală:

```
Home  |  Shop  |  Blog  |  About  |  Contact
```

### Pagini:

| Pagină | URL | Descriere |
|--------|-----|-----------|
| **Home** | `/` | Hero cu brand message, top produse, ultimele articole, newsletter signup |
| **Shop** | `/shop.html` | Catalog produse cu filtre (categorie, hair type, preț), fetch din Supabase |
| **Blog** | `/blog/` | Lista articolelor publicate, categorii, search |
| **About** | `/about.html` | Povestea brandului, misiune, de ce MyErossence |
| **Contact** | `/contact.html` | Formular contact, social links |
| **Articol individual** | `/blog/<slug>.html` | Generat static sau dinamic din Supabase |
| **Produs redirect** | `/go/<slug>` | Worker Cloudflare → redirect la affiliate URL |

### Design System (2026):

| Element | Valoare |
|---------|---------|
| **Culoare primară** | `#1D4E5C` (Deep Teal) |
| **Culoare accent** | `#D4A574` (Champagne Gold) |
| **Background** | `#FDF8F5` (Soft Cream) |
| **Font headlines** | Cormorant Garamond |
| **Font body** | Montserrat |
| **Stil** | Clean, minimal, whitespace generos, rounded corners |
| **Mobile-first** | Da, responsive design |
| **Dark mode** | Nu în v1, eventual v2 |

---

## 6. Cloudflare Worker — `/go/<slug>` Redirect

**Singura funcție a Worker-ului:**

```
Request: GET myerossence.com/go/argan-shampoo
  → Query Supabase: SELECT affiliate_url FROM products WHERE slug = 'argan-shampoo'
  → 302 Redirect la affiliate_url
  → Log click-ul (opțional, în Supabase)
```

**De ce Worker separat:**
- Ține redirect-urile sub domeniul propriu (SEO)
- Cloudflare Edge = rapid global
- Cod minimal, nu se strică
- Source code în repo sub `worker/affiliate-redirect.js`

**Deploy:** `wrangler deploy` din repo (sau manual prima dată, apoi automatizat)

---

## 7. Flow-ul de Deployment

```
Developer (tu/Claude)
       │
       ▼
   Git commit + push
       │
       ▼
   GitHub (main branch)
       │
       ├──────────────────────┐
       ▼                      ▼
  DigitalOcean             Cloudflare
  App Platform             (manual pt Worker,
  (auto-deploy             sau wrangler CLI)
   frontend)
       │
       ▼
  Site live pe
  myerossence.com
```

### Pași concreți:
1. Faci modificări local sau prin Claude
2. `git add . && git commit -m "descriere" && git push`
3. DigitalOcean App Platform detectează push-ul și face build + deploy automat
4. Site-ul e live în 1-2 minute
5. Pentru Worker: `wrangler deploy` separat (rar, doar când schimbi logica de redirect)

---

## 8. Ordinea de Execuție (Roadmap)

### Faza 1: Fundație (Ziua 1)
| # | Task | Serviciu |
|---|------|----------|
| 1.1 | Creare repo GitHub `myerossence` | GitHub |
| 1.2 | Creare proiect Supabase nou | Supabase |
| 1.3 | Rulare migration SQL (schema completă) | Supabase |
| 1.4 | Import date produse (cele ~55 din schema veche) | Supabase |
| 1.5 | Import programe affiliate | Supabase |

### Faza 2: Frontend (Zilele 2-3)
| # | Task | Serviciu |
|---|------|----------|
| 2.1 | Setup structura repo (HTML/CSS/JS) | GitHub |
| 2.2 | Homepage cu design 2026 | GitHub |
| 2.3 | Shop page cu fetch din Supabase | GitHub |
| 2.4 | Blog listing page | GitHub |
| 2.5 | About + Contact pages | GitHub |
| 2.6 | Design system complet (CSS variabile, componente) | GitHub |
| 2.7 | Mobile responsive testing | GitHub |

### Faza 3: Deployment (Ziua 3)
| # | Task | Serviciu |
|---|------|----------|
| 3.1 | Conectare repo la DO App Platform | DigitalOcean |
| 3.2 | Configurare custom domain (myerossence.com) | DO + Cloudflare DNS |
| 3.3 | Deploy Cloudflare Worker `/go/` redirect | Cloudflare |
| 3.4 | SSL + HTTPS verificare | DO + Cloudflare |
| 3.5 | Test end-to-end (homepage → shop → product → affiliate) | All |

### Faza 4: Conținut (Zilele 4-5)
| # | Task | Serviciu |
|---|------|----------|
| 4.1 | Scriere 3-5 articole inițiale | Supabase |
| 4.2 | SEO setup (meta tags, sitemaps, robots.txt) | GitHub |
| 4.3 | Social media content queue | Supabase |
| 4.4 | Newsletter signup funcțional | Frontend + Supabase |

### Faza 5: Agenți & Automatizări (Ziua 5+)
| # | Task | Serviciu |
|---|------|----------|
| 5.1 | Update SKILL.md cu noul Project ID Supabase | Local |
| 5.2 | Update reference files (database-schema.md) | Local |
| 5.3 | Test fiecare agent (brief, analytics, links, etc.) | All |
| 5.4 | Setup scheduled tasks (link checker, price monitor) | Cowork |

---

## 9. Configurare DNS (Cloudflare)

**Starea curentă:** Domeniul `myerossence.com` e pe Cloudflare DNS.

**Configurare necesară:**

| Record | Type | Name | Value | Proxy |
|--------|------|------|-------|-------|
| App Platform | CNAME | `@` / `myerossence.com` | `<app>.ondigitalocean.app` | DNS only (grey cloud) |
| www redirect | CNAME | `www` | `<app>.ondigitalocean.app` | DNS only |
| Worker route | — | Route: `myerossence.com/go/*` | Worker: `myerossence-redirect` | — |

**Notă:** DigitalOcean App Platform gestionează SSL-ul. Cloudflare proxy (orange cloud) se dezactivează pentru CNAME-ul principal, altfel conflicte de SSL.

---

## 10. Costuri Estimate

| Serviciu | Plan | Cost/lună |
|----------|------|-----------|
| **DigitalOcean App Platform** | Starter (static site) | **$0** (3 static sites gratuite) |
| **Supabase** | Free | **$0** (500MB DB, 50k Edge Function invocations) |
| **Cloudflare** | Free | **$0** (DNS + Workers free tier: 100k req/zi) |
| **GitHub** | Free | **$0** (repos publice/private) |
| **Domeniu** | (deja plătit) | — |
| **TOTAL** | | **$0/lună** |

---

## 11. Diferențe față de Arhitectura Veche

| Aspect | Vechi (stricat) | Nou (plan) |
|--------|-----------------|------------|
| **Frontend hosting** | Cloudflare Pages (paste manual) | DO App Platform (Git auto-deploy) |
| **Deploy method** | Copy-paste în dashboard | `git push` → auto-deploy |
| **Code repository** | Nicăieri (pierdut între sesiuni) | GitHub (persistent, versionat) |
| **Worker scope** | HTML generation + redirect + API | DOAR redirect `/go/` |
| **HTML generation** | Server-side în Deno template literals | Static HTML + client-side JS fetch |
| **Debug capability** | Aproape zero | Build logs DO + browser DevTools |
| **Rollback** | Imposibil | `git revert` + auto-deploy |
| **Traceability** | Zero | Git history completă |
| **DigitalOcean** | Nefolosit | App Platform (frontend hosting) |

---

## 12. Întrebări Deschise (pentru decizie)

1. **GitHub repo public sau privat?** — Privat e mai sigur (env variables), dar public e ok dacă nu ai secrete în cod.

2. **Articole statice sau dinamice?**
   - Static: pre-generate HTML pentru fiecare articol (mai rapid, SEO mai bun)
   - Dinamic: fetch din Supabase la load (mai simplu de gestionat, dar mai lent)
   - **Recomandare:** Dinamic pentru v1 (simplu), static pentru v2 (performanță)

3. **Shopify + Affiliate site = 2 proiecte separate?**
   - Shopify store = e-commerce cu produse proprii (Aquathermae, Selfnamed)
   - Affiliate site = content + redirecturi affiliate
   - **Sunt complementare, nu se exclud.** Shopify rămâne separat.

4. **Datele produselor — re-import manual sau automat?**
   - Aveam ~55 produse în schema veche
   - Le putem re-crea din referințele existente + web research fresh
   - **Recomandare:** Research fresh (Faza 0 din Smart Protocol) apoi import

---

## Aprobare

**Acest plan necesită aprobarea ta înainte de orice acțiune.**

Când ești gata, spune-mi:
- ✅ Aprobat — execut exact cum e
- 🔄 Modifică — spune ce vrei diferit
- ❌ Respins — redesign complet

---
