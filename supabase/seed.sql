-- ALSOUK — legacy suppliers directory seed.
--
-- Mirrors the production data from https://alsouk-platform.vercel.app/api/suppliers.
-- The `suppliers` table is the pre-companies legacy directory; it predates the
-- marketplace schema and is kept for backward compatibility. Production data
-- lives in the `companies` table and is served through the `companies_public`
-- view (see seed_marketplace.sql for that layer).
--
-- Run after 0000_create_suppliers.sql. Values match the legacy suppliers
-- table columns (see lib/supabase/suppliers-service.ts for the read path).

insert into public.suppliers
  (company_name, description, country, city, category, business_type, years_in_business, verified, rating, response_rate, reviews, products, min_moq, region, monogram, logo_color)
values
  ('زخف تونس', 'الشركة الرائدة', 'TN', '', 'food', 'manufacturer', 0, false, 0, 0, 0, 0, 0, 'capital', 'زت', 'blue'),
  ('Zoubairrrr', 'شركة تجارة عامة الناشءة', 'TN', '', 'textile', 'trader', 0, true, 0, 0, 0, 1, 0, 'capital', 'Z', 'blue');
