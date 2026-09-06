#!/usr/bin/env node
/**
 * Seed Supabase database with supplier data via REST API.
 * Usage: node scripts/seed-supabase.js
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "resolution=merge-duplicates",
};

async function upsert(table, rows) {
  if (!rows.length) return { count: 0 };
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers,
    body: JSON.stringify(rows),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Upsert ${table} failed (${res.status}): ${err}`);
  }
  return { count: rows.length, status: res.status };
}

// ─── Supplier data ──────────────────────────────────────────────────

const suppliers = [
  {
    id: "a1b2c3d4-e5f6-7890-abcd-100000000001",
    company_name: "SIELE - Société Industrielle d'Électronique et d'Électricité",
    description: "Leader tunisien dans la fabrication de panneaux de distribution électrique. Certifié SIEMENS, SCHNEIDER et ABB. Plus de 30 ans d'expérience.",
    country: "Tunisia",
    city: "Sfax",
    category: "electrical",
    business_type: "manufacturer",
    years_in_business: 37,
    verified: true,
    rating: 4.5,
    response_rate: 95,
    reviews: 28,
    products: 8,
    min_moq: 1,
    region: "south",
  },
  {
    id: "a1b2c3d4-e5f6-7890-abcd-100000000002",
    company_name: "CTRA - Chaudronnerie Tuyauterie Résine Anticorrosion",
    description: "Fabricant tunisien de composites FRP et thermoplastiques. 3 générations d'expertise depuis 1960. Équipements pour processus chimiques.",
    country: "Tunisia",
    city: "Hergla",
    category: "chemical",
    business_type: "manufacturer",
    years_in_business: 64,
    verified: true,
    rating: 4.4,
    response_rate: 90,
    reviews: 35,
    products: 8,
    min_moq: 1,
    region: "coast",
  },
  {
    id: "a1b2c3d4-e5f6-7890-abcd-100000000003",
    company_name: "I3C PLUS",
    description: "Société totalement exportatrice spécialisée dans l'exportation de produits agroalimentaires (huile d'olive, dattes, couscous).",
    country: "Tunisia",
    city: "Tunis",
    category: "food",
    business_type: "manufacturer",
    years_in_business: 18,
    verified: true,
    rating: 4.3,
    response_rate: 88,
    reviews: 22,
    products: 10,
    min_moq: 1,
    region: "capital",
  },
  {
    id: "a1b2c3d4-e5f6-7890-abcd-100000000004",
    company_name: "PAF TUBET - Société de Transformation de Métaux",
    description: "Filiale du Groupe Poulina, leader tunisien dans la fabrication de tubes en acier soudés et produits tubulaires depuis 1979.",
    country: "Tunisia",
    city: "Radès",
    category: "mechanical",
    business_type: "manufacturer",
    years_in_business: 45,
    verified: true,
    rating: 4.5,
    response_rate: 92,
    reviews: 42,
    products: 8,
    min_moq: 1,
    region: "capital",
  },
  {
    id: "a1b2c3d4-e5f6-7890-abcd-100000000005",
    company_name: "SARTEX Group - Société des Arts Textile",
    description: "Leader de la fabrication de denim et sportswear en Tunisie. Production verticalement intégrée du tissu au vêtement fini.",
    country: "Tunisia",
    city: "Bouhjar",
    category: "textile",
    business_type: "manufacturer",
    years_in_business: 20,
    verified: true,
    rating: 4.6,
    response_rate: 94,
    reviews: 56,
    products: 8,
    min_moq: 1,
    region: "coast",
  },
];

// ─── Company data ──────────────────────────────────────────────────

const companies = [
  {
    id: "b1b2c3d4-e5f6-7890-abcd-200000000001",
    supplier_id: "a1b2c3d4-e5f6-7890-abcd-100000000001",
    name: "SIELE",
    slug: "siele",
    description: "Fabrication de tableaux électriques basse tension",
    country: "Tunisia",
    city: "Sfax",
    website: "https://siele.com.tn",
    verified: true,
    active: true,
    profile_views: 150,
    street_address: "Route Mahdia km11, Sfax 3011",
  },
  {
    id: "b1b2c3d4-e5f6-7890-abcd-200000000002",
    supplier_id: "a1b2c3d4-e5f6-7890-abcd-100000000002",
    name: "CTRA",
    slug: "ctra",
    description: "Composites FRP et équipements anticorrosion",
    country: "Tunisia",
    city: "Hergla",
    website: "https://ctra.com.tn",
    verified: true,
    active: true,
    profile_views: 200,
    street_address: "Hergla, Sousse 4011",
  },
  {
    id: "b1b2c3d4-e5f6-7890-abcd-200000000003",
    supplier_id: "a1b2c3d4-e5f6-7890-abcd-100000000003",
    name: "I3C PLUS",
    slug: "i3c-plus",
    description: "Export de produits agroalimentaires",
    country: "Tunisia",
    city: "Tunis",
    website: null,
    verified: true,
    active: true,
    profile_views: 120,
    street_address: "Tunis, Tunisia",
  },
  {
    id: "b1b2c3d4-e5f6-7890-abcd-200000000004",
    supplier_id: "a1b2c3d4-e5f6-7890-abcd-100000000004",
    name: "PAF TUBET",
    slug: "paf-tubet",
    description: "Tubes en acier et transformation de métaux",
    country: "Tunisia",
    city: "Radès",
    website: "https://paftube.com",
    verified: true,
    active: true,
    profile_views: 180,
    street_address: "Z.I Route du bac, 2040 Radès",
  },
  {
    id: "b1b2c3d4-e5f6-7890-abcd-200000000005",
    supplier_id: "a1b2c3d4-e5f6-7890-abcd-100000000005",
    name: "SARTEX Group",
    slug: "sartex-group",
    description: "Fabrication de denim et sportswear",
    country: "Tunisia",
    city: "Bouhjar",
    website: "https://sartexgroup.com",
    verified: true,
    active: true,
    profile_views: 300,
    street_address: "Zone Industrielle, Bouhjar 5015",
  },
];

// ─── Store data ──────────────────────────────────────────────────

const stores = companies.map((c) => ({
  company_id: c.id,
  name: `${c.name} Store`,
  slug: `${c.slug}-store`,
  description: c.description,
  is_active: true,
}));

// ─── Product data ──────────────────────────────────────────────────

const products = [
  // SIELE (electrical) — 8 products
  { store_slug: "siele-store", company_id: companies[0].id, name: "Panneau de distribution électrique", slug: "panneau-distribution", description: "Panneau de distribution basse tension pour bâtiments industriels", price: 850.0, currency: "TND", min_order_quantity: 1, unit: "piece", stock_quantity: 50, category: "electrical" },
  { store_slug: "siele-store", company_id: companies[0].id, name: "Coffret électrique de distribution", slug: "coffret-distribution", description: "Coffret de distribution modulaire certifié SIEMENS", price: 1200.0, currency: "TND", min_order_quantity: 1, unit: "piece", stock_quantity: 30, category: "electrical" },
  { store_slug: "siele-store", company_id: companies[0].id, name: "Tableau de distribution électrique", slug: "tableau-distribution", description: "Tableau de distribution pour installations commerciales", price: 450.0, currency: "TND", min_order_quantity: 1, unit: "piece", stock_quantity: 75, category: "electrical" },
  { store_slug: "siele-store", company_id: companies[0].id, name: "Armoire électrique sur mesure", slug: "armoire-elec-custom", description: "Armoire électrique personnalisée selon spécifications client", price: 950.0, currency: "TND", min_order_quantity: 1, unit: "piece", stock_quantity: 20, category: "electrical" },
  { store_slug: "siele-store", company_id: companies[0].id, name: "Disjoncteur tableau électrique", slug: "disjoncteur-tableau", description: "Disjoncteur magnétothermique pour tableau électrique", price: 680.0, currency: "TND", min_order_quantity: 2, unit: "piece", stock_quantity: 100, category: "electrical" },
  { store_slug: "siele-store", company_id: companies[0].id, name: "Centre de contrôle de moteur", slug: "centre-moteur", description: "Centre de contrôle et de protection des moteurs électriques", price: 2200.0, currency: "TND", min_order_quantity: 1, unit: "piece", stock_quantity: 15, category: "electrical" },
  { store_slug: "siele-store", company_id: companies[0].id, name: "Panneau correction facteur de puissance", slug: "panneau-facteur-puissance", description: "Panneau de compensation du facteur de puissance", price: 1500.0, currency: "TND", min_order_quantity: 1, unit: "piece", stock_quantity: 25, category: "electrical" },
  { store_slug: "siele-store", company_id: companies[0].id, name: "Tableau électrique industriel", slug: "tableau-industriel", description: "Tableau électrique haute performance pour industries", price: 3500.0, currency: "TND", min_order_quantity: 1, unit: "piece", stock_quantity: 10, category: "electrical" },

  // CTRA (chemical) — 8 products
  { store_slug: "ctra-store", company_id: companies[1].id, name: "Tuyau FRP", slug: "tuyau-frp", description: "Tuyau en composite fibres de verre résine pour chimie", price: 2800.0, currency: "TND", min_order_quantity: 10, unit: "mètre", stock_quantity: 500, category: "chemical" },
  { store_slug: "ctra-store", company_id: companies[1].id, name: "Équipement process chimique", slug: "equipement-process", description: "Équipement sur mesure pour procédés chimiques", price: 15000.0, currency: "TND", min_order_quantity: 1, unit: "piece", stock_quantity: 5, category: "chemical" },
  { store_slug: "ctra-store", company_id: companies[1].id, name: "Réservoir anticorrosion", slug: "reservoir-anticorrosion", description: "Réservoir en composite résistant aux acides", price: 8500.0, currency: "TND", min_order_quantity: 1, unit: "piece", stock_quantity: 10, category: "chemical" },
  { store_slug: "ctra-store", company_id: companies[1].id, name: "Raccords GRP", slug: "raccords-grp", description: "Raccords en verre feu pour systèmes de tuyauterie", price: 3500.0, currency: "TND", min_order_quantity: 5, unit: "mètre", stock_quantity: 200, category: "chemical" },
  { store_slug: "ctra-store", company_id: companies[1].id, name: "Conteneur transport chimique", slug: "conteneur-chimique", description: "Conteneur de transport de produits chimiques dangereux", price: 12000.0, currency: "TND", min_order_quantity: 1, unit: "piece", stock_quantity: 8, category: "chemical" },
  { store_slug: "ctra-store", company_id: companies[1].id, name: "Vanne résistante aux acides", slug: "vanne-acides", description: "Vanne en composite pour milieux acides", price: 4500.0, currency: "TND", min_order_quantity: 2, unit: "piece", stock_quantity: 30, category: "chemical" },
  { store_slug: "ctra-store", company_id: companies[1].id, name: "Réservoir de stockage FRP", slug: "reservoir-stockage-frp", description: "Grand réservoir de stockage en fibres de verre", price: 18000.0, currency: "TND", min_order_quantity: 1, unit: "piece", stock_quantity: 3, category: "chemical" },
  { store_slug: "ctra-store", company_id: companies[1].id, name: "Scrubber industriel", slug: "scrubber-industriel", description: "Système de lavage des gaz industriels", price: 22000.0, currency: "TND", min_order_quantity: 1, unit: "piece", stock_quantity: 2, category: "chemical" },

  // I3C PLUS (food) — 10 products
  { store_slug: "i3c-plus-store", company_id: companies[2].id, name: "Huile d'olive vierge extra 750ml", slug: "huile-olive-750ml", description: "Huile d'olive vierge extra pression à froid, origine Tunisie", price: 32.0, currency: "TND", min_order_quantity: 12, unit: "bouteille", stock_quantity: 500, category: "food" },
  { store_slug: "i3c-plus-store", company_id: companies[2].id, name: "Dattes Deglet Nour 250g", slug: "dattes-deglet-nour-250g", description: "Dattes Deglet Nour de qualité supérieure, emballage premium", price: 8.5, currency: "TND", min_order_quantity: 24, unit: "boîte", stock_quantity: 1000, category: "food" },
  { store_slug: "i3c-plus-store", company_id: companies[2].id, name: "Dattes dénoyautées 500g", slug: "dattes-denoyautees-500g", description: "Dattes dénoyautées prêtes à consommer", price: 15.0, currency: "TND", min_order_quantity: 20, unit: "boîte", stock_quantity: 800, category: "food" },
  { store_slug: "i3c-plus-store", company_id: companies[2].id, name: "Huile d'olive 250ml", slug: "huile-olive-250ml", description: "Petit format huile d'olive pour dégustation", price: 12.0, currency: "TND", min_order_quantity: 36, unit: "bouteille", stock_quantity: 600, category: "food" },
  { store_slug: "i3c-plus-store", company_id: companies[2].id, name: "Couscous biologique 1kg", slug: "couscous-bio-1kg", description: "Couscous semoule de blé dur biologique", price: 9.0, currency: "TND", min_order_quantity: 30, unit: "sac", stock_quantity: 400, category: "food" },
  { store_slug: "i3c-plus-store", company_id: companies[2].id, name: "Harissa traditionnelle 250g", slug: "harissa-traditionnelle", description: "Pâte de harissa traditionnelle tunisienne", price: 6.75, currency: "TND", min_order_quantity: 48, unit: "pot", stock_quantity: 700, category: "food" },
  { store_slug: "i3c-plus-store", company_id: companies[2].id, name: "Figues séchées 500g", slug: "figues-sechees", description: "Figues séchées de qualité premium", price: 18.0, currency: "TND", min_order_quantity: 20, unit: "boîte", stock_quantity: 300, category: "food" },
  { store_slug: "i3c-plus-store", company_id: companies[2].id, name: "Pâte d'amande 200g", slug: "pate-amande", description: "Pâte d'amande fine pour pâtisserie", price: 22.0, currency: "TND", min_order_quantity: 24, unit: "boîte", stock_quantity: 250, category: "food" },
  { store_slug: "i3c-plus-store", company_id: companies[2].id, name: "Eau de fleur d'oranger 500ml", slug: "eau-fleur-oranger", description: "Eau de fleur d'oranger naturelle, distillation artisanale", price: 14.0, currency: "TND", min_order_quantity: 24, unit: "bouteille", stock_quantity: 350, category: "food" },
  { store_slug: "i3c-plus-store", company_id: companies[2].id, name: "Eau de rose 250ml", slug: "eau-rose", description: "Eau de rose pure pour cuisine et parfumerie", price: 11.0, currency: "TND", min_order_quantity: 36, unit: "bouteille", stock_quantity: 400, category: "food" },

  // PAF TUBET (mechanical) — 8 products
  { store_slug: "paf-tubet-store", company_id: companies[3].id, name: "Tube acier ERW", slug: "tube-acier-erw", description: "Tube acier soudé à haute fréquence pour structure", price: 45.0, currency: "TND", min_order_quantity: 100, unit: "mètre", stock_quantity: 5000, category: "mechanical" },
  { store_slug: "paf-tubet-store", company_id: companies[3].id, name: "Tube étréint à froid", slug: "tube-etreint-froid", description: "Tube acier étréint à froid, haute précision", price: 65.0, currency: "TND", min_order_quantity: 50, unit: "mètre", stock_quantity: 2000, category: "mechanical" },
  { store_slug: "paf-tubet-store", company_id: companies[3].id, name: "Garde-corps acier", slug: "garde-corps-acier", description: "Garde-corps en acier pour balcons et terrasses", price: 85.0, currency: "TND", min_order_quantity: 10, unit: "mètre", stock_quantity: 500, category: "construction" },
  { store_slug: "paf-tubet-store", company_id: companies[3].id, name: "Service découpe laser", slug: "decoupe-laser", description: "Service de découpe laser de précision sur acier", price: 25.0, currency: "TND", min_order_quantity: 10, unit: "pièce", stock_quantity: null, category: "mechanical" },
  { store_slug: "paf-tubet-store", company_id: companies[3].id, name: "Terrasse pergola acier", slug: "pergola-acier", description: "Structure pergola en acier pour extérieur", price: 120.0, currency: "TND", min_order_quantity: 1, unit: "pièce", stock_quantity: 20, category: "construction" },
  { store_slug: "paf-tubet-store", company_id: companies[3].id, name: "Portail métallique", slug: "portail-metal", description: "Portail en acier forgé, design sur mesure", price: 350.0, currency: "TND", min_order_quantity: 1, unit: "pièce", stock_quantity: 15, category: "construction" },
  { store_slug: "paf-tubet-store", company_id: companies[3].id, name: "Tube inox", slug: "tube-inox", description: "Tube acier inoxydable pour alimentaire et chimie", price: 95.0, currency: "TND", min_order_quantity: 30, unit: "mètre", stock_quantity: 1000, category: "mechanical" },
  { store_slug: "paf-tubet-store", company_id: companies[3].id, name: "Tube galvanisé", slug: "tube-galvanise", description: "Tube acier galvanisé pour charpente et construction", price: 55.0, currency: "TND", min_order_quantity: 50, unit: "mètre", stock_quantity: 3000, category: "construction" },

  // SARTEX Group (textile) — 8 products
  { store_slug: "sartex-group-store", company_id: companies[4].id, name: "Jean denim", slug: "jean-denim", description: "Jean en denim premium, coupe tendance", price: 45.0, currency: "TND", min_order_quantity: 100, unit: "pièce", stock_quantity: 5000, category: "textile" },
  { store_slug: "sartex-group-store", company_id: companies[4].id, name: "Pantalon chino", slug: "pantalon-chino", description: "Pantalon chino en coton, coupe classique", price: 38.0, currency: "TND", min_order_quantity: 100, unit: "pièce", stock_quantity: 3000, category: "textile" },
  { store_slug: "sartex-group-store", company_id: companies[4].id, name: "Pantalon cargo", slug: "pantalon-cargo", description: "Pantalon cargo fonctionnel, poches multiples", price: 42.0, currency: "TND", min_order_quantity: 100, unit: "pièce", stock_quantity: 2500, category: "textile" },
  { store_slug: "sartex-group-store", company_id: companies[4].id, name: "Veste denim", slug: "veste-denim", description: "Veste en denim classique, coupe ajustée", price: 55.0, currency: "TND", min_order_quantity: 50, unit: "pièce", stock_quantity: 1500, category: "textile" },
  { store_slug: "sartex-group-store", company_id: companies[4].id, name: "Sweat à capuche", slug: "sweat-capuche", description: "Sweat à capuche en coton, confort quotidien", price: 35.0, currency: "TND", min_order_quantity: 100, unit: "pièce", stock_quantity: 4000, category: "textile" },
  { store_slug: "sartex-group-store", company_id: companies[4].id, name: "T-shirt basique", slug: "tshirt-basique", description: "T-shirt en coton jersey, couleurs variées", price: 12.0, currency: "TND", min_order_quantity: 200, unit: "pièce", stock_quantity: 10000, category: "textile" },
  { store_slug: "sartex-group-store", company_id: companies[4].id, name: "Combinaison de travail", slug: "combinaison-travail", description: "Combinaison de travail robuste, tissu résistant", price: 48.0, currency: "TND", min_order_quantity: 50, unit: "pièce", stock_quantity: 2000, category: "textile" },
  { store_slug: "sartex-group-store", company_id: companies[4].id, name: "Short denim", slug: "short-denim", description: "Short en denim, coupe décontractée", price: 28.0, currency: "TND", min_order_quantity: 100, unit: "pièce", stock_quantity: 3000, category: "textile" },
];

// ─── Category IDs (from seed_marketplace.sql) ──────────────────────

const CATEGORY_IDS = {
  food: "ab55704a-532f-4577-9bad-209203750dd7",
  electrical: "97c01df0-cd7a-4a18-8ac3-964861bcbc32",
  chemical: "079b1273-47de-4417-9b08-27f9cc606f4e",
  mechanical: "cabd29e9-30a1-466a-93b0-383546654452",
  textile: "721edf68-7a92-4fa6-9c4a-642889c3fdbe",
  construction: "5fe67a07-eb4b-4395-bff1-8d2f1d399e45",
};

// ─── Main ──────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 Seeding Supabase database...\n");

  // 1. Upsert suppliers
  const s = await upsert("suppliers", suppliers);
  console.log(`✅ Suppliers: ${s.count} rows`);

  // 2. Upsert companies
  const c = await upsert("companies", companies);
  console.log(`✅ Companies: ${c.count} rows`);

  // 3. Upsert stores (need company IDs)
  const storeRows = stores;
  const st = await upsert("stores", storeRows);
  console.log(`✅ Stores: ${st.count} rows`);

  // 4. Get store IDs for products
  const storeRes = await fetch(
    `${SUPABASE_URL}/rest/v1/stores?select=id,slug&slug=in.(${storeRows.map((s) => s.slug).join(",")})`,
    { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }
  );
  const storeMap = {};
  (await storeRes.json()).forEach((s) => (storeMap[s.slug] = s.id));

  // 5. Upsert products
  const productRows = products.map((p, i) => ({
    id: `c1b2c3d4-e5f6-7890-abcd-3000000000${String(i).padStart(2, "0")}`,
    store_id: storeMap[p.store_slug],
    company_id: p.company_id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    currency: p.currency,
    min_order_quantity: p.min_order_quantity,
    unit: p.unit,
    stock_quantity: p.stock_quantity,
    is_active: true,
  }));
  const pr = await upsert("products", productRows);
  console.log(`✅ Products: ${pr.count} rows`);

  // 6. Link products to categories
  const catLinks = productRows
    .map((p) => {
      const cat = products.find((pr) => pr.slug === p.slug)?.category;
      if (!cat || !CATEGORY_IDS[cat]) return null;
      return { product_id: p.id, category_id: CATEGORY_IDS[cat] };
    })
    .filter(Boolean);

  const cl = await upsert("product_categories", catLinks);
  console.log(`✅ Product categories: ${cl.count} rows`);

  // 7. Verify
  console.log("\n📊 Verification:");
  const tables = ["suppliers", "companies", "stores", "products", "product_categories"];
  for (const t of tables) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${t}?select=count`, {
      headers: { ...headers, Prefer: "count=exact" },
    });
    const count = res.headers.get("content-range")?.split("/")[1] || "?";
    console.log(`  ${t}: ${count} rows`);
  }

  console.log("\n🎉 Done!");
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
