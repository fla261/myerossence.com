-- MyErossence — Seed: Premium Hair Care Products
-- Amazon Associates tag: fla096-21
-- Format URL: https://www.amazon.com/dp/{ASIN}?tag=fla096-21

INSERT INTO products (name, slug, brand, price, category, hair_type, description, image_url, rating, review_count, tags, affiliate_url) VALUES

-- SHAMPOO
('No.4 Bond Maintenance Shampoo', 'olaplex-no4-shampoo', 'Olaplex', 30.00, 'shampoo',
 ARRAY['all', 'damaged', 'color-treated'],
 'Repairs and protects hair from everyday stresses — Pro-grade bond-building technology restores broken bonds caused by chemical, thermal, and mechanical damage.',
 'https://m.media-amazon.com/images/I/61JpCRTLpOL._SL1500_.jpg',
 4.6, 89200, ARRAY['bond-repair', 'sulfate-free', 'color-safe', 'bestseller'],
 'https://www.amazon.com/dp/B0CSVZKVHG?tag=fla096-21'),

('Rosemary Mint Strengthening Shampoo', 'mielle-rosemary-mint-shampoo', 'Mielle Organics', 10.49, 'shampoo',
 ARRAY['all', 'thinning', 'natural'],
 'Biotin-infused formula with rosemary and mint essential oils strengthens weak and brittle hair while stimulating the scalp for healthier growth.',
 'https://m.media-amazon.com/images/I/61TbcXPFqJL._SL1500_.jpg',
 4.5, 125000, ARRAY['organic', 'growth', 'scalp-care', 'bestseller'],
 'https://www.amazon.com/dp/B07N8KTPZM?tag=fla096-21'),

('Bain Satin 1 Shampoo', 'kerastase-bain-satin-1', 'Kerastase', 38.00, 'shampoo',
 ARRAY['normal', 'dry'],
 'Luxurious professional shampoo that gently cleanses while nourishing hair with essential nutrients. Leaves hair silky, shiny, and manageable.',
 'https://m.media-amazon.com/images/I/51iNNXd5GPL._SL1500_.jpg',
 4.6, 8900, ARRAY['professional', 'luxury', 'nourishing'],
 'https://www.amazon.com/dp/B000LNDS5C?tag=fla096-21'),

-- CONDITIONER
('No.5 Bond Maintenance Conditioner', 'olaplex-no5-conditioner', 'Olaplex', 30.00, 'conditioner',
 ARRAY['all', 'damaged', 'color-treated'],
 'Restores, repairs, and hydrates without adding excess weight. Leaves hair easier to manage, shinier, and healthier with each use.',
 'https://m.media-amazon.com/images/I/61ZEkbLFYiL._SL1500_.jpg',
 4.6, 72000, ARRAY['bond-repair', 'sulfate-free', 'color-safe'],
 'https://www.amazon.com/dp/B0CSVZFXDL?tag=fla096-21'),

('Hydrating Conditioner', 'moroccanoil-hydrating-conditioner', 'Moroccanoil', 28.00, 'conditioner',
 ARRAY['dry', 'thick', 'curly'],
 'Gently detangles and conditions with antioxidant-rich argan oil and vitamins A and E. Provides deep hydration for visibly healthier hair.',
 'https://m.media-amazon.com/images/I/61JlQ+D3lYL._SL1500_.jpg',
 4.6, 15200, ARRAY['argan-oil', 'hydrating', 'professional'],
 'https://www.amazon.com/dp/B003WJZXSI?tag=fla096-21'),

-- HAIR OIL & SERUM
('Moroccanoil Treatment Original', 'moroccanoil-treatment-original', 'Moroccanoil', 48.00, 'oil',
 ARRAY['all', 'frizzy', 'dry'],
 'The iconic argan oil-infused hair treatment that started it all. Conditions, detangles, and speeds up drying time while adding brilliant shine.',
 'https://m.media-amazon.com/images/I/51+-pW6WwML._SL1500_.jpg',
 4.7, 52000, ARRAY['argan-oil', 'bestseller', 'shine', 'iconic'],
 'https://www.amazon.com/dp/B001AO0WCG?tag=fla096-21'),

('No.7 Bonding Oil', 'olaplex-no7-bonding-oil', 'Olaplex', 30.00, 'oil',
 ARRAY['all', 'damaged', 'frizzy'],
 'Highly concentrated, ultra-lightweight reparative styling oil that dramatically increases shine, softness, and color vibrancy.',
 'https://m.media-amazon.com/images/I/61Nfj-q9URL._SL1500_.jpg',
 4.5, 32000, ARRAY['bond-repair', 'lightweight', 'shine'],
 'https://www.amazon.com/dp/B08TGBCBQ4?tag=fla096-21'),

('Rosemary Oil for Hair Growth', 'mielle-rosemary-mint-oil', 'Mielle Organics', 9.99, 'oil',
 ARRAY['all', 'thinning', 'natural'],
 'Nutrient-rich scalp and hair strengthening oil infused with rosemary and mint. Biotin and essential oils nourish hair follicles and support healthy growth.',
 'https://m.media-amazon.com/images/I/61WBTiTxiDL._SL1500_.jpg',
 4.4, 98000, ARRAY['organic', 'growth', 'scalp-care', 'bestseller'],
 'https://www.amazon.com/dp/B09PB5DGWY?tag=fla096-21'),

-- HAIR MASK & TREATMENT
('No.3 Hair Perfector', 'olaplex-no3-hair-perfector', 'Olaplex', 30.00, 'treatment',
 ARRAY['all', 'damaged', 'color-treated'],
 'At-home weekly treatment that reduces breakage and visibly strengthens hair, improving its look and feel. The #1 prestige hair care product.',
 'https://m.media-amazon.com/images/I/61dGM4M8MKL._SL1500_.jpg',
 4.5, 110000, ARRAY['bond-repair', 'weekly-treatment', 'bestseller'],
 'https://www.amazon.com/dp/B00SNM5US4?tag=fla096-21'),

('Don''t Despair, Repair! Deep Conditioning Mask', 'briogeo-dont-despair-repair-mask', 'Briogeo', 38.00, 'mask',
 ARRAY['damaged', 'dry', 'color-treated'],
 'Clinically proven to decrease hair breakage by 95% after one use. Vegan and cruelty-free deep conditioning mask with rosehip, biotin, and algae.',
 'https://m.media-amazon.com/images/I/61GvN5tWxdL._SL1500_.jpg',
 4.5, 18000, ARRAY['clean-beauty', 'vegan', 'deep-conditioning'],
 'https://www.amazon.com/dp/B00F2GKRT2?tag=fla096-21'),

('Masquintense Thick Hair Mask', 'kerastase-masquintense', 'Kerastase', 56.00, 'mask',
 ARRAY['thick', 'dry', 'coarse'],
 'Professional-grade deep treatment mask for thick, dry hair. Delivers intense nourishment and transforms dry, difficult-to-manage hair.',
 'https://m.media-amazon.com/images/I/41uPqCIPNbL._SL1500_.jpg',
 4.6, 7500, ARRAY['professional', 'luxury', 'intense-nourishment'],
 'https://www.amazon.com/dp/B000LNDSIS?tag=fla096-21'),

-- SCALP CARE
('Scalp Revival Charcoal + Coconut Oil Micro-Exfoliating Shampoo', 'briogeo-scalp-revival-shampoo', 'Briogeo', 42.00, 'scalp',
 ARRAY['oily', 'flaky', 'all'],
 'Charcoal-infused micro-exfoliating shampoo that detoxifies, soothes, and balances the scalp. Clinically shown to reduce flakes and buildup.',
 'https://m.media-amazon.com/images/I/51d5sVjbr5L._SL1500_.jpg',
 4.4, 11000, ARRAY['clean-beauty', 'detox', 'exfoliating', 'vegan'],
 'https://www.amazon.com/dp/B01LTIOXGE?tag=fla096-21'),

('Scalp Treatment with Tea Tree Oil', 'paul-mitchell-tea-tree-scalp', 'Paul Mitchell', 22.00, 'scalp',
 ARRAY['oily', 'itchy', 'all'],
 'Invigorating tea tree oil scalp treatment that soothes irritation and promotes a healthy scalp environment. Professional salon-quality care at home.',
 'https://m.media-amazon.com/images/I/61fW0-lPJKL._SL1500_.jpg',
 4.5, 21000, ARRAY['tea-tree', 'soothing', 'professional'],
 'https://www.amazon.com/dp/B000UPOGCE?tag=fla096-21'),

-- STYLING
('Elixir Ultime Oil Serum', 'kerastase-elixir-ultime', 'Kerastase', 52.00, 'styling',
 ARRAY['all', 'frizzy', 'dull'],
 'Versatile beautifying oil serum that provides heat protection up to 230C while adding extraordinary shine and softness. Multi-use styling essential.',
 'https://m.media-amazon.com/images/I/41bvuC+GhGL._SL1500_.jpg',
 4.6, 6200, ARRAY['heat-protection', 'shine', 'luxury', 'professional'],
 'https://www.amazon.com/dp/B0BXHSZKFT?tag=fla096-21'),

('Curl Charisma Rice Amino + Avocado Leave-In Defining Creme', 'briogeo-curl-charisma', 'Briogeo', 24.00, 'styling',
 ARRAY['curly', 'wavy', 'coily'],
 'Clean, vegan curl cream that defines and hydrates without crunch or buildup. Rice amino acids strengthen while avocado oil nourishes curls.',
 'https://m.media-amazon.com/images/I/61-wN6KbAiL._SL1500_.jpg',
 4.3, 5800, ARRAY['clean-beauty', 'curly-girl', 'vegan', 'defining'],
 'https://www.amazon.com/dp/B07H7GH9QB?tag=fla096-21'),

-- SETS & KITS
('Bond Repair Starter Kit (No.3 + No.4 + No.5)', 'olaplex-bond-repair-kit', 'Olaplex', 90.00, 'set',
 ARRAY['all', 'damaged', 'color-treated'],
 'Complete bond repair system: Hair Perfector pre-treatment + Bond Maintenance Shampoo + Conditioner. Everything you need to repair damaged hair.',
 'https://m.media-amazon.com/images/I/71m7XFM4R1L._SL1500_.jpg',
 4.5, 28000, ARRAY['bond-repair', 'value-set', 'bestseller', 'gift'],
 'https://www.amazon.com/dp/B0BXMVFTNJ?tag=fla096-21');
