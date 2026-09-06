-- ALSOUK — 5 verified Tunisian B2B suppliers with full product catalogs.
-- Run AFTER seed_marketplace.sql (categories must exist).
-- Safe to re-run: every insert is guarded by ON CONFLICT.
-- Currency: All prices in TND (Tunisian Dinar).

begin;

-- ============================================================================
-- SUPPLIER 1: SIELE (Electrical)
-- ============================================================================

-- 1.1 Supplier
insert into public.suppliers (id, company_name, description, country, city, category, business_type, years_in_business, verified, rating, response_rate, logo_url, reviews, products, min_moq, region, created_at)
values (
  'a1b2c3d4-e5f6-7890-abcd-100000000001',
  'SIELE - Société Industrielle d''Électronique et d''Électricité',
  'Leader tunisien dans la fabrication de panneaux de distribution électrique. Certifié SIEMENS, SCHNEIDER et ABB. Plus de 30 ans d''expérience en équipements électriques, automation et supervision à distance.',
  'Tunisia',
  'Sfax',
  'electrical',
  'manufacturer',
  37,
  true,
  4.5,
  95,
  null,
  28,
  8,
  1,
  'south',
  now()
)
on conflict (id) do nothing;

-- 1.2 Company
insert into public.companies (id, owner_id, name, slug, description, country, city, website, verified, active, profile_views, external_store_url, street_address)
values (
  'a1b2c3d4-e5f6-7890-abcd-200000000001',
  null,
  'SIELE',
  'siele',
  'Société Industrielle d''Électronique et d''Électricité - Leader tunisien en panneaux de distribution électrique. Certifié SIEMENS, SCHNEIDER et ABB.',
  'Tunisia',
  'Sfax',
  'https://siele.com.tn',
  true,
  true,
  150,
  null,
  'Sfax, Tunisia'
)
on conflict (id) do nothing;

-- 1.3 Store
insert into public.stores (company_id, name, slug, tagline, description, is_active)
select c.id, 'SIELE Store', 'siele-store', 'Équipements électriques industriels', 'Fabrication de panneaux de distribution, armoires électriques et équipements d''automation.', true
from public.companies c where c.slug = 'siele'
on conflict (slug) do nothing;

-- 1.4 Products (8 products)
insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000001',
  s.id, s.company_id,
  'Panneau de Distribution Électrique',
  'panneau-distribution-electrique',
  'Panneau de distribution pour installations industrielles. Conforme aux normes CEI.',
  850.00, 'TND', 1, 'piece', 10, true
from public.stores s where s.slug = 'siele-store'
on conflict (id) do nothing;

insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000002',
  s.id, s.company_id,
  'Armoire Électrique Industrielle',
  'armoire-electrique-industrielle',
  'Armoire de commande et de distribution pour environnements industriels.',
  1200.00, 'TND', 1, 'piece', 8, true
from public.stores s where s.slug = 'siele-store'
on conflict (id) do nothing;

insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000003',
  s.id, s.company_id,
  'Tableau de Distribution',
  'tableau-distribution',
  'Tableau de distribution électrique pour bâtiments tertiaires et industriels.',
  450.00, 'TND', 1, 'piece', 15, true
from public.stores s where s.slug = 'siele-store'
on conflict (id) do nothing;

insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000004',
  s.id, s.company_id,
  'Armoire Électrique Sur Mesure',
  'armoire-electrique-sur-mesure',
  'Fabrication d''armoires électriques personnalisées selon spécifications client.',
  950.00, 'TND', 1, 'piece', 5, true
from public.stores s where s.slug = 'siele-store'
on conflict (id) do nothing;

insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000005',
  s.id, s.company_id,
  'Tableau de Départ Automatique',
  'tableau-depart-automatique',
  'Tableau de protection contre les surcharges et les courts-circuits.',
  680.00, 'TND', 1, 'piece', 12, true
from public.stores s where s.slug = 'siele-store'
on conflict (id) do nothing;

insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000006',
  s.id, s.company_id,
  'Variateur de Vitesse',
  'variateur-vitesse',
  'Variateur de vitesse pour moteurs électriques industriels.',
  2200.00, 'TND', 1, 'piece', 6, true
from public.stores s where s.slug = 'siele-store'
on conflict (id) do nothing;

insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000007',
  s.id, s.company_id,
  'Correcteur de Facteur de Puissance',
  'correcteur-facteur-puissance',
  'Système de correction du facteur de puissance pour réduire les pertes.',
  1500.00, 'TND', 1, 'piece', 4, true
from public.stores s where s.slug = 'siele-store'
on conflict (id) do nothing;

insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000008',
  s.id, s.company_id,
  'Panneau Électrique Industriel',
  'panneau-electrique-industriel',
  'Panneau électrique pour environnements industriels lourds.',
  3500.00, 'TND', 1, 'piece', 3, true
from public.stores s where s.slug = 'siele-store'
on conflict (id) do nothing;

-- 1.5 Product Categories
insert into public.product_categories (product_id, category_id)
select p.id, c.id
from public.products p, public.categories c
where p.slug in ('panneau-distribution-electrique', 'armoire-electrique-industrielle', 'tableau-distribution', 'armoire-electrique-sur-mesure', 'tableau-depart-automatique', 'variateur-vitesse', 'correcteur-facteur-puissance', 'panneau-electrique-industriel')
  and c.slug = 'electrical'
on conflict (product_id, category_id) do nothing;

-- ============================================================================
-- SUPPLIER 2: CTRA (Chemical)
-- ============================================================================

-- 2.1 Supplier
insert into public.suppliers (id, company_name, description, country, city, category, business_type, years_in_business, verified, rating, response_rate, logo_url, reviews, products, min_moq, region, created_at)
values (
  'a1b2c3d4-e5f6-7890-abcd-100000000002',
  'CTRA - Chaudronnerie Tuyauterie Résine Anticorrosion',
  'Leader tunisien dans la fabrication de résines composites FRP et thermoplastiques. Depuis 1960, trois générations d''expertise en tubes, raccords et équipements pour l''industrie chimique.',
  'Tunisia',
  'Hergla, Sousse',
  'chemical',
  'manufacturer',
  64,
  true,
  4.4,
  92,
  null,
  35,
  8,
  1,
  'coast',
  now()
)
on conflict (id) do nothing;

-- 2.2 Company
insert into public.companies (id, owner_id, name, slug, description, country, city, website, verified, active, profile_views, external_store_url, street_address)
values (
  'a1b2c3d4-e5f6-7890-abcd-200000000002',
  null,
  'CTRA',
  'ctra',
  'Chaudronnerie Tuyauterie Résine Anticorrosion - Fabrication de résines composites FRP pour l''industrie chimique.',
  'Tunisia',
  'Hergla, Sousse',
  'https://ctra.com.tn',
  true,
  true,
  200,
  null,
  'Hergla, Sousse, Tunisia'
)
on conflict (id) do nothing;

-- 2.3 Store
insert into public.stores (company_id, name, slug, tagline, description, is_active)
select c.id, 'CTRA Store', 'ctra-store', 'Équipements composites industriels', 'Fabrication de tubes, raccords et équipements en résine composites FRP pour l''industrie chimique.', true
from public.companies c where c.slug = 'ctra'
on conflict (slug) do nothing;

-- 2.4 Products (8 products)
insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000009',
  s.id, s.company_id,
  'Tube FRP',
  'tube-frp',
  'Tube en résine composites renforcée fibres de verre pour transport de fluides corrosifs.',
  2800.00, 'TND', 1, 'meter', 100, true
from public.stores s where s.slug = 'ctra-store'
on conflict (id) do nothing;

insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000010',
  s.id, s.company_id,
  'Équipement de Process Chimique',
  'equipement-process-chimique',
  'Équipement sur mesure pour processus de traitement chimique industriel.',
  15000.00, 'TND', 1, 'piece', 3, true
from public.stores s where s.slug = 'ctra-store'
on conflict (id) do nothing;

insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000011',
  s.id, s.company_id,
  'Réservoir Anticorrosion',
  'reservoir-anticorrosion',
  'Réservoir en résine composites pour stockage de produits chimiques corrosifs.',
  8500.00, 'TND', 1, 'piece', 5, true
from public.stores s where s.slug = 'ctra-store'
on conflict (id) do nothing;

insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000012',
  s.id, s.company_id,
  'Raccords GRP',
  'raccords-grp',
  'Raccords en plastique renforcé fibres de verre pour assemblage de tuyauteries.',
  3500.00, 'TND', 1, 'piece', 20, true
from public.stores s where s.slug = 'ctra-store'
on conflict (id) do nothing;

insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000013',
  s.id, s.company_id,
  'Conteneur de Transport Chimique',
  'conteneur-transport-chimique',
  'Conteneur certifié pour le transport sécurisé de produits chimiques.',
  12000.00, 'TND', 1, 'piece', 4, true
from public.stores s where s.slug = 'ctra-store'
on conflict (id) do nothing;

insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000014',
  s.id, s.company_id,
  'Vanne Résistante aux Acides',
  'vanne-resistante-acides',
  'Vanne en matériaux composites résistants aux acides et solvants.',
  4500.00, 'TND', 1, 'piece', 8, true
from public.stores s where s.slug = 'ctra-store'
on conflict (id) do nothing;

insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000015',
  s.id, s.company_id,
  'Cuve de Stockage FRP',
  'cuve-stockage-frp',
  'Grande cuve de stockage en résine composites pour produits chimiques.',
  18000.00, 'TND', 1, 'piece', 2, true
from public.stores s where s.slug = 'ctra-store'
on conflict (id) do nothing;

insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000016',
  s.id, s.company_id,
  'Scrubber Industriel',
  'scrubber-industriel',
  'Système de traitement des gaz industriels par absorption chimique.',
  22000.00, 'TND', 1, 'piece', 2, true
from public.stores s where s.slug = 'ctra-store'
on conflict (id) do nothing;

-- 2.5 Product Categories
insert into public.product_categories (product_id, category_id)
select p.id, c.id
from public.products p, public.categories c
where p.slug in ('tube-frp', 'equipement-process-chimique', 'reservoir-anticorrosion', 'raccords-grp', 'conteneur-transport-chimique', 'vanne-resistante-acides', 'cuve-stockage-frp', 'scrubber-industriel')
  and c.slug = 'chemical'
on conflict (product_id, category_id) do nothing;

-- ============================================================================
-- SUPPLIER 3: I3C PLUS (Food)
-- ============================================================================

-- 3.1 Supplier
insert into public.suppliers (id, company_name, description, country, city, category, business_type, years_in_business, verified, rating, response_rate, logo_url, reviews, products, min_moq, region, created_at)
values (
  'a1b2c3d4-e5f6-7890-abcd-100000000003',
  'I3C PLUS',
  'Exportateur tunisien de produits agroalimentaires. Spécialisé dans l''huile d''olive bio, les dattes Deglet Nour, le couscous et les épices. Export mondial depuis 2006.',
  'Tunisia',
  'Tunis',
  'food',
  'manufacturer, exporter',
  18,
  true,
  4.3,
  88,
  null,
  42,
  10,
  1,
  'capital',
  now()
)
on conflict (id) do nothing;

-- 3.2 Company
insert into public.companies (id, owner_id, name, slug, description, country, city, website, verified, active, profile_views, external_store_url, street_address)
values (
  'a1b2c3d4-e5f6-7890-abcd-200000000003',
  null,
  'I3C PLUS',
  'i3c-plus',
  'Exportateur de produits agroalimentaires tunisiens - huile d''olive bio, dattes Deglet Nour, couscous et épices.',
  'Tunisia',
  'Tunis',
  null,
  true,
  true,
  180,
  null,
  'Tunis, Tunisia'
)
on conflict (id) do nothing;

-- 3.3 Store
insert into public.stores (company_id, name, slug, tagline, description, is_active)
select c.id, 'I3C PLUS Store', 'i3c-plus-store', 'Produits agroalimentaires tunisiens', 'Exportation d''huile d''olive bio, dattes Deglet Nour, couscous et épices de qualité supérieure.', true
from public.companies c where c.slug = 'i3c-plus'
on conflict (slug) do nothing;

-- 3.4 Products (10 products)
insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000017',
  s.id, s.company_id,
  'Huile d''Olive Bio Extra Vierge 750ml',
  'huile-olive-bio-750ml',
  'Huile d''olive extra vierge biologique, pressing à froid. Origine Tunisie.',
  32.00, 'TND', 12, 'bottle', 200, true
from public.stores s where s.slug = 'i3c-plus-store'
on conflict (id) do nothing;

insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000018',
  s.id, s.company_id,
  'Dattes Deglet Nour 250g',
  'dattes-deglet-nour-250g',
  'Dattes Deglet Nour de première qualité, conditionnées sous vide.',
  8.50, 'TND', 24, 'pack', 500, true
from public.stores s where s.slug = 'i3c-plus-store'
on conflict (id) do nothing;

insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000019',
  s.id, s.company_id,
  'Dattes Épépinées 500g',
  'dattes-epinees-500g',
  'Dattes Deglet Nour épepinées, prêtes à consommer.',
  15.00, 'TND', 12, 'pack', 300, true
from public.stores s where s.slug = 'i3c-plus-store'
on conflict (id) do nothing;

insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000020',
  s.id, s.company_id,
  'Huile d''Olive 250ml',
  'huile-olive-250ml',
  'Huile d''olive extra vierge, format econôme.',
  12.00, 'TND', 24, 'bottle', 400, true
from public.stores s where s.slug = 'i3c-plus-store'
on conflict (id) do nothing;

insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000021',
  s.id, s.company_id,
  'Couscous Bio 1kg',
  'couscous-bio-1kg',
  'Couscous biologique artisanal, grains moyens.',
  9.00, 'TND', 24, 'bag', 300, true
from public.stores s where s.slug = 'i3c-plus-store'
on conflict (id) do nothing;

insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000022',
  s.id, s.company_id,
  'Pâte Harissa 250g',
  'pate-harissa-250g',
  'Harissa traditionnelle tunisienne, pâte de piments séchés.',
  6.75, 'TND', 24, 'jar', 500, true
from public.stores s where s.slug = 'i3c-plus-store'
on conflict (id) do nothing;

insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000024',
  s.id, s.company_id,
  'Pâte d''Amandes 200g',
  'pate-amandes-200g',
  'Pâte d''amandes fine, idéale pour la pâtisserie.',
  22.00, 'TND', 12, 'jar', 150, true
from public.stores s where s.slug = 'i3c-plus-store'
on conflict (id) do nothing;

insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000025',
  s.id, s.company_id,
  'Eau de Fleur d''Oranger 500ml',
  'eau-fleur-oranger-500ml',
  'Eau de fleur d''oranger pure, distillation traditionnelle.',
  14.00, 'TND', 12, 'bottle', 200, true
from public.stores s where s.slug = 'i3c-plus-store'
on conflict (id) do nothing;

insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000026',
  s.id, s.company_id,
  'Eau de Rose 250ml',
  'eau-rose-250ml',
  'Eau de rose distillée, usage culinaire et cosmétique.',
  11.00, 'TND', 24, 'bottle', 250, true
from public.stores s where s.slug = 'i3c-plus-store'
on conflict (id) do nothing;

-- 3.5 Product Categories
insert into public.product_categories (product_id, category_id)
select p.id, c.id
from public.products p, public.categories c
where p.slug in ('huile-olive-bio-750ml', 'dattes-deglet-nour-250g', 'dattes-epinees-500g', 'huile-olive-250ml', 'couscous-bio-1kg', 'pate-harissa-250g', 'pate-amandes-200g', 'eau-fleur-oranger-500ml', 'eau-rose-250ml')
  and c.slug = 'food'
on conflict (product_id, category_id) do nothing;

-- ============================================================================
-- SUPPLIER 4: PAF TUBET (Mechanical + Construction)
-- ============================================================================

-- 4.1 Supplier
insert into public.suppliers (id, company_name, description, country, city, category, business_type, years_in_business, verified, rating, response_rate, logo_url, reviews, products, min_moq, region, created_at)
values (
  'a1b2c3d4-e5f6-7890-abcd-100000000004',
  'PAF TUBET - Société de Transformation de Métaux',
  'Leader tunisien dans la fabrication de tubes en acier. Filiale du groupe Poulina Holding, fondée en 1979. Plus de 40 ans d''expertise en tubes soudés, galvanisés et services de découpe laser.',
  'Tunisia',
  'Radès',
  'mechanical',
  'manufacturer',
  45,
  true,
  4.5,
  94,
  null,
  52,
  8,
  1,
  'capital',
  now()
)
on conflict (id) do nothing;

-- 4.2 Company
insert into public.companies (id, owner_id, name, slug, description, country, city, website, verified, active, profile_views, external_store_url, street_address)
values (
  'a1b2c3d4-e5f6-7890-abcd-200000000004',
  null,
  'PAF TUBET',
  'paf-tubet',
  'Société de Transformation de Métaux - Leader tunisien en tubes en acier. Filiale du groupe Poulina Holding.',
  'Tunisia',
  'Radès',
  'https://paftube.com',
  true,
  true,
  250,
  null,
  'Radès, Tunisia'
)
on conflict (id) do nothing;

-- 4.3 Store
insert into public.stores (company_id, name, slug, tagline, description, is_active)
select c.id, 'PAF TUBET Store', 'paf-tubet-store', 'Tubes en acier et services métallurgiques', 'Fabrication de tubes soudés, galvanisés et services de découpe laser industrielle.', true
from public.companies c where c.slug = 'paf-tubet'
on conflict (slug) do nothing;

-- 4.4 Products (8 products)
insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000027',
  s.id, s.company_id,
  'Tube Acier Soudé ERW',
  'tube-acier-souded-erw',
  'Tube en acier soudé par résistance électrique, pour structure et tuyauterie.',
  45.00, 'TND', 10, 'meter', 500, true
from public.stores s where s.slug = 'paf-tubet-store'
on conflict (id) do nothing;

insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000028',
  s.id, s.company_id,
  'Tube à Froid',
  'tube-a-froid',
  'Tube tiré à froid pour applications de précision.',
  65.00, 'TND', 10, 'meter', 300, true
from public.stores s where s.slug = 'paf-tubet-store'
on conflict (id) do nothing;

insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000029',
  s.id, s.company_id,
  'Garde-Corps Acier',
  'garde-corps-acier',
  'Garde-corps en acier galvanisé pour balcons et terrasses.',
  85.00, 'TND', 5, 'meter', 200, true
from public.stores s where s.slug = 'paf-tubet-store'
on conflict (id) do nothing;

insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000030',
  s.id, s.company_id,
  'Service Découpe Laser',
  'service-decoupe-laser',
  'Service de découpe laser industrielle sur mesure.',
  25.00, 'TND', 1, 'piece', null, true
from public.stores s where s.slug = 'paf-tubet-store'
on conflict (id) do nothing;

insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000031',
  s.id, s.company_id,
  'Structure Pergola Acier',
  'structure-pergola-acier',
  'Structure de pergola en acier galvanisé pour espaces extérieurs.',
  120.00, 'TND', 1, 'set', 20, true
from public.stores s where s.slug = 'paf-tubet-store'
on conflict (id) do nothing;

insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000032',
  s.id, s.company_id,
  'Portail Métallique',
  'portail-metallique',
  'Portail coulissant ou battant en acier, sur mesure.',
  350.00, 'TND', 1, 'piece', 10, true
from public.stores s where s.slug = 'paf-tubet-store'
on conflict (id) do nothing;

insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000033',
  s.id, s.company_id,
  'Tube Acier Inoxydable',
  'tube-acier-inoxydable',
  'Tube en acier inoxydable pour applications alimentaires et pharmaceutiques.',
  95.00, 'TND', 5, 'meter', 150, true
from public.stores s where s.slug = 'paf-tubet-store'
on conflict (id) do nothing;

insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000034',
  s.id, s.company_id,
  'Tube Acier Galvanisé',
  'tube-acier-galvanise',
  'Tube en acier galvanisé à chaud pour charpente et construction.',
  55.00, 'TND', 10, 'meter', 400, true
from public.stores s where s.slug = 'paf-tubet-store'
on conflict (id) do nothing;

-- 4.5 Product Categories (mechanical + construction)
insert into public.product_categories (product_id, category_id)
select p.id, c.id
from public.products p, public.categories c
where p.slug in ('tube-acier-souded-erw', 'tube-a-froid', 'garde-corps-acier', 'service-decoupe-laser', 'structure-pergola-acier', 'portail-metallique', 'tube-acier-inoxydable', 'tube-acier-galvanise')
  and c.slug in ('mechanical', 'construction')
on conflict (product_id, category_id) do nothing;

-- ============================================================================
-- SUPPLIER 5: SARTEX Group (Textile)
-- ============================================================================

-- 5.1 Supplier
insert into public.suppliers (id, company_name, description, country, city, category, business_type, years_in_business, verified, rating, response_rate, logo_url, reviews, products, min_moq, region, created_at)
values (
  'a1b2c3d4-e5f6-7890-abcd-100000000005',
  'SARTEX Group - Société des Arts Textile',
  'Leader tunisien dans la fabrication de vêtements en denim et sportswear. 1000 employés, production annuelle de 4,5 millions de pièces. Certifié ISO 14001, OHSAS 18001, GRS. Export mondial depuis 2005.',
  'Tunisia',
  'Bouhjar',
  'textile',
  'manufacturer',
  20,
  true,
  4.6,
  96,
  null,
  68,
  8,
  1,
  'coast',
  now()
)
on conflict (id) do nothing;

-- 5.2 Company
insert into public.companies (id, owner_id, name, slug, description, country, city, website, verified, active, profile_views, external_store_url, street_address)
values (
  'a1b2c3d4-e5f6-7890-abcd-200000000005',
  null,
  'SARTEX Group',
  'sartex-group',
  'Société des Arts Textile - Leader tunisien en denim et sportswear. 1000 employés, 4,5M pièces/an.',
  'Tunisia',
  'Bouhjar',
  'https://sartexgroup.com',
  true,
  true,
  300,
  null,
  'Bouhjar, Tunisia'
)
on conflict (id) do nothing;

-- 5.3 Store
insert into public.stores (company_id, name, slug, tagline, description, is_active)
select c.id, 'SARTEX Group Store', 'sartex-group-store', 'Denim et sportswear de qualité', 'Fabrication de jeans, chinos, vestes et vêtements de sport pour marques internationales.', true
from public.companies c where c.slug = 'sartex-group'
on conflict (slug) do nothing;

-- 5.4 Products (8 products)
insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000035',
  s.id, s.company_id,
  'Jean Classique',
  'jean-classique',
  'Jean en denim premium, coupe classique.',
  45.00, 'TND', 50, 'piece', 5000, true
from public.stores s where s.slug = 'sartex-group-store'
on conflict (id) do nothing;

insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000036',
  s.id, s.company_id,
  'Pantalon Chino',
  'pantalon-chino',
  'Pantalon chino en coton, coupe ajustée.',
  38.00, 'TND', 50, 'piece', 4000, true
from public.stores s where s.slug = 'sartex-group-store'
on conflict (id) do nothing;

insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000037',
  s.id, s.company_id,
  'Pantalon Cargo',
  'pantalon-cargo',
  'Pantalon cargo fonctionnel avec poches multiples.',
  42.00, 'TND', 50, 'piece', 3000, true
from public.stores s where s.slug = 'sartex-group-store'
on conflict (id) do nothing;

insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000038',
  s.id, s.company_id,
  'Veste en Denim',
  'veste-denim',
  'Veste en denim classique, coupe originale.',
  55.00, 'TND', 30, 'piece', 2000, true
from public.stores s where s.slug = 'sartex-group-store'
on conflict (id) do nothing;

insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000039',
  s.id, s.company_id,
  'Sweat à Capuche',
  'sweat-capuche',
  'Sweat à capuche en coton, confortable et durable.',
  35.00, 'TND', 50, 'piece', 6000, true
from public.stores s where s.slug = 'sartex-group-store'
on conflict (id) do nothing;

insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000040',
  s.id, s.company_id,
  'T-Shirt Basic',
  't-shirt-basic',
  'T-shirt en coton, coupe classique.',
  12.00, 'TND', 100, 'piece', 10000, true
from public.stores s where s.slug = 'sartex-group-store'
on conflict (id) do nothing;

insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000041',
  s.id, s.company_id,
  'Combinaison de Travail',
  'combinaison-travail',
  'Combinaison de travail robuste pour usage industriel.',
  48.00, 'TND', 30, 'piece', 1500, true
from public.stores s where s.slug = 'sartex-group-store'
on conflict (id) do nothing;

insert into public.products (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, stock_quantity, is_active)
select
  'a1b2c3d4-e5f6-7890-abcd-300000000042',
  s.id, s.company_id,
  'Short Denim',
  'short-denim',
  'Short en denim, coupe décontractée.',
  28.00, 'TND', 50, 'piece', 3000, true
from public.stores s where s.slug = 'sartex-group-store'
on conflict (id) do nothing;

-- 5.5 Product Categories
insert into public.product_categories (product_id, category_id)
select p.id, c.id
from public.products p, public.categories c
where p.slug in ('jean-classique', 'pantalon-chino', 'pantalon-cargo', 'veste-denim', 'sweat-capuche', 't-shirt-basic', 'combinaison-travail', 'short-denim')
  and c.slug = 'textile'
on conflict (product_id, category_id) do nothing;

commit;
