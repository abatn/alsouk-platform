-- ALSOUK — 0047: Recreate companies_public view with all columns and restrict
-- direct SELECT on the base companies table.
--
-- PART 1 — View recreation:
-- The `companies_public` view (originally created in 0046) must expose every
-- column the application reads through the public suppliers API (see
-- lib/supabase/suppliers-service.ts SUPPLIER_COLUMNS). The full column list:
--
--   id, owner_id, name, slug, tagline, description, logo_url, banner_url,
--   business_type, primary_industry, country, city, year_established,
--   verified, active, external_store_url, profile_views, created_at,
--   website_url, facebook_url, instagram_url, tiktok_url, linkedin_url,
--   youtube_url, phone_number, whatsapp_number, street_address, postal_code,
--   company_size
--
-- Per-field opt-in visibility (0045) is enforced via CASE WHEN on the
-- visibility flags: website_url is gated by website_visible, all five social
-- URLs by social_visible, phone_number by phone_visible, whatsapp_number by
-- whatsapp_visible, street_address and postal_code by address_visible,
-- company_size by company_size_visible. Columns not gated by a visibility
-- flag (id, owner_id, name, slug, tagline, description, logo_url, banner_url,
-- business_type, primary_industry, country, city, year_established, verified,
-- active, external_store_url, profile_views, created_at) are unconditionally
-- public.
--
-- security_invoker is set to false (toggled in PART 3) so the view runs with
-- the table owner's privileges and bypasses RLS — required because PART 2
-- tightens the base table's SELECT policy to member-only, which would otherwise
-- block anonymous public-directory reads through this view.
--
-- PART 2 — Base table restriction:
-- The raw `companies` table previously had `SELECT using (true)`, meaning
-- every column (including tax_identifier, license_document_url, business_email)
-- was readable by anyone via direct REST. Replace with member-only access
-- (is_company_member — same helper used for posts/live_sessions). The public
-- directory continues to work through the `companies_public` view, which
-- bypasses RLS via security_invoker=false.
--
-- PART 3 — View security flag:
-- Set security_invoker = false on companies_public so the view uses the table
-- owner's privileges (bypasses RLS). This is the reverse of the profiles
-- pattern (where security_invoker=true is used to ENFORCE RLS on the view);
-- here, we need the view to bypass the tightened base-table policy.
--
-- Idempotent: safe to re-run. Uses DROP+CREATE for the view.

-- ===========================================================================
-- PART 1: Recreate the companies_public view with all columns
-- ===========================================================================

drop view if exists public.companies_public;

create view public.companies_public
with (security_invoker = false) as
select
  -- Unconditionally public columns
  id,
  owner_id,
  name,
  slug,
  tagline,
  description,
  logo_url,
  banner_url,
  business_type,
  primary_industry,
  country,
  city,
  year_established,
  verified,
  active,
  external_store_url,
  profile_views,
  created_at,
  -- Per-field visibility-gated columns
  case when website_visible then website_url     else null end as website_url,
  case when social_visible  then facebook_url    else null end as facebook_url,
  case when social_visible  then instagram_url   else null end as instagram_url,
  case when social_visible  then tiktok_url      else null end as tiktok_url,
  case when social_visible  then linkedin_url    else null end as linkedin_url,
  case when social_visible  then youtube_url     else null end as youtube_url,
  case when phone_visible   then phone_number    else null end as phone_number,
  case when whatsapp_visible then whatsapp_number else null end as whatsapp_number,
  case when address_visible then street_address  else null end as street_address,
  case when address_visible then postal_code     else null end as postal_code,
  case when company_size_visible then company_size else null end as company_size
from public.companies;

grant select on public.companies_public to anon, authenticated, service_role;

-- ===========================================================================
-- PART 2: Restrict direct SELECT on the base companies table
-- ===========================================================================

drop policy if exists "Companies are publicly readable" on public.companies;

drop policy if exists "Members can view their own company" on public.companies;
create policy "Members can view their own company"
  on public.companies for select
  using (is_company_member(id));
