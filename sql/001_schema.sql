-- MyErossence Affiliate Marketing — Schema v1.0
-- 4 tabele: products, articles, click_logs, subscribers

-- ===========================================
-- PRODUCTS — produse premium affiliate
-- ===========================================
CREATE TABLE products (
  id              SERIAL PRIMARY KEY,
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  brand           TEXT,
  price           NUMERIC(10,2),
  currency        TEXT DEFAULT 'USD',
  category        TEXT,
  hair_type       TEXT[],
  description     TEXT,
  image_url       TEXT,
  rating          NUMERIC(2,1),
  review_count    INTEGER DEFAULT 0,
  tags            TEXT[],
  affiliate_url   TEXT,
  affiliate_program TEXT DEFAULT 'amazon',
  in_stock        BOOLEAN DEFAULT true,
  status          TEXT DEFAULT 'active',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);

-- ===========================================
-- ARTICLES — blog posts
-- ===========================================
CREATE TABLE articles (
  id              SERIAL PRIMARY KEY,
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  body_html       TEXT,
  excerpt         TEXT,
  category        TEXT,
  status          TEXT DEFAULT 'draft',
  seo_title       TEXT,
  seo_description TEXT,
  featured_image  TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_status ON articles(status);

-- ===========================================
-- CLICK_LOGS — tracking affiliate clicks
-- ===========================================
CREATE TABLE click_logs (
  id           SERIAL PRIMARY KEY,
  product_slug TEXT NOT NULL,
  referrer     TEXT,
  user_agent   TEXT,
  country      TEXT,
  clicked_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_click_logs_product ON click_logs(product_slug);
CREATE INDEX idx_click_logs_date ON click_logs(clicked_at);

-- ===========================================
-- SUBSCRIBERS — newsletter
-- ===========================================
CREATE TABLE subscribers (
  id         SERIAL PRIMARY KEY,
  email      TEXT UNIQUE NOT NULL,
  status     TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- RLS — Row Level Security
-- ===========================================

-- Products: anyone can read active products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active products"
  ON products FOR SELECT
  USING (status = 'active');

-- Articles: anyone can read published articles
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published articles"
  ON articles FOR SELECT
  USING (status = 'published');

-- Click logs: insert only (from CF Worker via service key)
ALTER TABLE click_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous click inserts"
  ON click_logs FOR INSERT
  WITH CHECK (true);

-- Subscribers: insert only (from frontend)
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous subscribe"
  ON subscribers FOR INSERT
  WITH CHECK (true);
