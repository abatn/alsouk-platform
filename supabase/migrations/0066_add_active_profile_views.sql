-- ALSOUK — 0066: Add `active` and `profile_views` columns to companies.
--
-- These columns exist in production but were never captured in the migration
-- history. The `companies_public` view (0046) references both `active` and
-- `profile_views`, so a fresh `supabase db reset` would fail without them.
--
-- active: boolean flag that controls whether a company appears in the public
-- directory. Companies filtered by `active=eq.true` in the suppliers API
-- (see lib/supabase/suppliers-service.ts line 87).
--
-- profile_views: integer counter incremented by the increment_profile_views
-- RPC (see supabase/migrations/0061). Exposed through companies_public as
-- a read-only metric on the supplier profile page.
--
-- Idempotent: safe to re-run (ADD COLUMN IF NOT EXISTS).

alter table public.companies
  add column if not exists active boolean not null default true;

alter table public.companies
  add column if not exists profile_views integer not null default 0;

create index if not exists companies_active_idx on public.companies (active);
