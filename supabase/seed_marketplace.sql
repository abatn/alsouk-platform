-- ALSOUK — marketplace seed matching production data.
--
-- Sources: https://alsouk-platform.vercel.app/api/categories
--          https://alsouk-platform.vercel.app/api/suppliers
--          https://alsouk-platform.vercel.app/api/products
--
-- Run AFTER 0002_create_marketplace.sql + 0006_add_active_profile_views.sql.
-- Safe to re-run: every insert is guarded by ON CONFLICT on a natural key.
-- Uses production UUIDs so the seed matches live data exactly.

begin;

-- 1. Categories (production data — 6 categories with Arabic names) -----------
insert into public.categories (id, slug, name, description, position) values
  ('ab55704a-532f-4577-9bad-209203750dd7', 'food',         'الصناعات الغذائية',      null, 0),
  ('97c01df0-cd7a-4a18-8ac3-964861bcbc32', 'electrical',   'الصناعات الكهربائية',    null, 0),
  ('079b1273-47de-4417-9b08-27f9cc606f4e', 'chemical',     'الصناعات الكيميائية',    null, 0),
  ('cabd29e9-30a1-466a-93b0-383546654452', 'mechanical',   'الصناعات الميكانيكية',   null, 0),
  ('721edf68-7a92-4fa6-9c4a-642889c3fdbe', 'textile',      'النسيج والملابس',         null, 0),
  ('5fe67a07-eb4b-4395-bff1-8d2f1d399e45', 'construction', 'مواد البناء',             null, 0)
on conflict (id) do nothing;

-- 2. Companies (production data — 2 real companies) -------------------------
insert into public.companies (id, owner_id, name, slug, description, country, city, verified, active, profile_views, external_store_url, street_address) values
  ('71cf3ec8-6de6-4594-9156-1652b7e7934e', '6e2689c6-9a16-462c-bf54-f77e54cb60f2', 'زخف تونس',     'zakhf-tounes',   'الشركة الرائدة',      'tn', '', false, true, 4,  null, null),
  ('744134d8-d1f2-4ed3-84aa-88c4d9593a7d', 'c9cc1236-7a28-4c58-ae25-c2336a5f7ec4', 'Zoubairrrr',    'zoubairrrr',      'شركة تجارة عامة الناشءة', 'tn', '', true,  true, 129, 'https://m.shein.com/ar/category', 'تونس')
on conflict (id) do nothing;

-- 3. Stores (one storefront per company) ------------------------------------
insert into public.stores (company_id, name, slug, tagline, description, is_active)
select c.id, c.name || ' Store', c.slug || '-store', null, c.description, true
from (values
  ('zakhf-tounes',  'Store'),
  ('zoubairrrr',    'Store')
) as s(company_slug, suffix)
join public.companies c on c.slug = s.company_slug
on conflict (slug) do nothing;

-- 4. Products (production data — 1 product, TND currency) -------------------
insert into public.products
  (id, store_id, company_id, name, slug, description, price, currency, min_order_quantity, unit, is_active)
select '6ee65b62-3ab7-443d-9953-6d10ba7f9fd3', st.id, st.company_id,
       'ملابس للرجال', '-msmdwtyv', null,
       null, 'TND', 1, null, true
from public.stores st
where st.company_id = '744134d8-d1f2-4ed3-84aa-88c4d9593a7d'
on conflict (id) do nothing;

-- 5. Product images (primary) ------------------------------------------------
insert into public.product_images (product_id, storage_bucket, storage_path, url, alt, position, is_primary)
select '6ee65b62-3ab7-443d-9953-6d10ba7f9fd3',
       'company-photos',
       '744134d8-d1f2-4ed3-84aa-88c4d9593a7d/1786315134979-6mkkfh.jpg',
       'https://jaqridxnfzrpluvjkldr.supabase.co/storage/v1/object/public/company-photos/744134d8-d1f2-4ed3-84aa-88c4d9593a7d/1786315134979-6mkkfh.jpg',
       'ملابس للرجال', 0, true
where not exists (
  select 1 from public.product_images ex where ex.product_id = '6ee65b62-3ab7-443d-9953-6d10ba7f9fd3' and ex.is_primary
);

commit;
