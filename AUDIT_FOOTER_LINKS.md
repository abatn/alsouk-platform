# Footer Link Audit — Agent Prompt

## Context

The ALSOUK platform footer has 16 links across 4 columns (For Buyers, For Suppliers, Company, Support). Each link now has an `href` value in `lib/i18n.ts`, but many still point to `#` because no page exists yet.

Your task: **Audit every footer link, determine if a real page exists, and document what needs to be built for each.**

## Data Source

Footer link definitions are in `lib/i18n.ts` → `footer.buy`, `footer.sell`, `footer.company`, `footer.support` (3 languages: EN, FR, AR).

Current link targets (from last commit):

```
For Buyers:
  "Browse Categories"     → /categories        ✅ page exists
  "Request Quotes"        → /rfq               ✅ page exists
  "Trade Assurance"       → #                  ❌ no page
  "Buyer Protection"      → #                  ❌ no page

For Suppliers:
  "Sell on ALSOUK"        → /register          ✅ page exists
  "Supplier Membership"   → /register          ✅ page exists
  "Verification"          → #                  ❌ no page
  "Export Services"       → #                  ❌ no page

Company:
  "About Us"              → #                  ❌ no page
  "Careers"               → #                  ❌ no page
  "Press"                 → #                  ❌ no page
  "Partners"              → #                  ❌ no page

Support:
  "Help Center"           → #                  ❌ no page
  "Contact Us"            → #                  ❌ no page
  "Shipping Guide"        → #                  ❌ no page
  "Report Abuse"          → #                  ❌ no page
```

## What to Check

For each link that points to `#`:

1. **Does a page already exist?** Check `app/` directory for matching routes.
2. **Can it reuse an existing page?** (e.g., "Trade Assurance" and "Buyer Protection" could both point to an `/about` or `/trust` page).
3. **Does it need a new page?** If yes, what content should it have?
4. **Is it a placeholder that can be removed?** (e.g., "Careers", "Press" may not be relevant for a B2B MVP).

## Output Format

For each of the 16 links, output a row:

| Link Text | Current href | Route exists? | Recommended href | Action needed |
|-----------|-------------|---------------|-----------------|---------------|
| Browse Categories | /categories | ✅ Yes | /categories | None |
| ... | ... | ... | ... | ... |

Then provide a **priority list** of which pages to build first (if any).

## Files to Read

- `lib/i18n.ts` — footer section (lines ~730-760 for EN)
- `app/` directory — list of existing routes
- `components/site-footer.tsx` — how links are rendered

## Constraints

- ALSOUK is an MVP — don't recommend building pages that aren't essential for launch.
- Some links (Careers, Press, Partners) are standard footer filler — consider removing them instead of building empty pages.
- "Trade Assurance" and "Buyer Protection" could be combined into a single `/trust` or `/about` page.
- "Help Center", "Contact Us", "Shipping Guide" could be a single `/help` page with sections.
- "Report Abuse" could be a modal or email link, not a full page.
