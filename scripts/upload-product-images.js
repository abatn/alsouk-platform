#!/usr/bin/env node
/**
 * Upload product images to Supabase Storage.
 * Uses Picsum (Lorem Picsum) for reliable placeholder images.
 * Usage: node scripts/upload-product-images.js
 */

const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
const BUCKET = "product-images";

// ─── Image mapping: product slug → Picsum seed (deterministic per product) ──

const IMAGE_SEEDS = {
  // SIELE (electrical) — seeds 1-8
  "panneau-distribution": 101,
  "coffret-distribution": 102,
  "tableau-distribution": 103,
  "armoire-elec-custom": 104,
  "disjoncteur-tableau": 105,
  "centre-moteur": 106,
  "panneau-facteur-puissance": 107,
  "tableau-industriel": 108,

  // CTRA (chemical) — seeds 201-208
  "tuyau-frp": 201,
  "equipement-process": 202,
  "reservoir-anticorrosion": 203,
  "raccords-grp": 204,
  "conteneur-chimique": 205,
  "vanne-acides": 206,
  "reservoir-stockage-frp": 207,
  "scrubber-industriel": 208,

  // I3C PLUS (food) — seeds 301-310
  "huile-olive-750ml": 301,
  "dattes-deglet-nour-250g": 302,
  "dattes-denoyautees-500g": 303,
  "huile-olive-250ml": 304,
  "couscous-bio-1kg": 305,
  "harissa-traditionnelle": 306,
  "figues-sechees": 307,
  "pate-amande": 308,
  "eau-fleur-oranger": 309,
  "eau-rose": 310,

  // PAF TUBET (mechanical) — seeds 401-408
  "tube-acier-erw": 401,
  "tube-etreint-froid": 402,
  "garde-corps-acier": 403,
  "decoupe-laser": 404,
  "pergola-acier": 405,
  "portail-metal": 406,
  "tube-inox": 407,
  "tube-galvanise": 408,

  // SARTEX Group (textile) — seeds 501-508
  "jean-denim": 501,
  "pantalon-chino": 502,
  "pantalon-cargo": 503,
  "veste-denim": 504,
  "sweat-capuche": 505,
  "tshirt-basique": 506,
  "combinaison-travail": 507,
  "short-denim": 508,
};

// ─── Download from Picsum ───────────────────────────────────────────

async function downloadImage(seed) {
  const url = `https://picsum.photos/seed/${seed}/600/400`;
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

// ─── Upload to Supabase Storage ─────────────────────────────────────

async function uploadImage(companyId, slug, buffer) {
  const storagePath = `${companyId}/${slug}.jpg`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(storagePath);

  return { storagePath, url: urlData.publicUrl };
}

// ─── Insert into product_images ─────────────────────────────────────

async function insertProductImage(productId, storagePath, url, alt) {
  // Delete existing primary image for this product first
  await supabase
    .from("product_images")
    .delete()
    .eq("product_id", productId)
    .eq("is_primary", true);

  const { error } = await supabase.from("product_images").insert({
    product_id: productId,
    storage_bucket: BUCKET,
    storage_path: storagePath,
    url: url,
    alt: alt,
    position: 0,
    is_primary: true,
  });

  if (error) throw new Error(`Insert failed: ${error.message}`);
}

// ─── Main ───────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 Uploading product images...\n");

  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, slug, company_id")
    .eq("is_active", true)
    .order("company_id");

  if (error) throw new Error(`Fetch failed: ${error.message}`);
  console.log(`📦 Found ${products.length} products\n`);

  let uploaded = 0, skipped = 0, failed = 0;

  for (const product of products) {
    const seed = IMAGE_SEEDS[product.slug];

    if (!seed) {
      console.log(`  ⚠️  No mapping: ${product.slug}`);
      skipped++;
      continue;
    }

    try {
      // Check if already has image
      const { data: existing } = await supabase
        .from("product_images")
        .select("id")
        .eq("product_id", product.id)
        .eq("is_primary", true)
        .single();

      if (existing) {
        console.log(`  ⏭️  ${product.name}`);
        skipped++;
        continue;
      }

      // Download
      process.stdout.write(`  📥 ${product.name}...`);
      const buffer = await downloadImage(seed);

      // Upload
      const { storagePath, url } = await uploadImage(product.company_id, product.slug, buffer);

      // Insert
      await insertProductImage(product.id, storagePath, url, product.name);

      console.log(` ✅ ${buffer.length} bytes`);
      uploaded++;
    } catch (err) {
      console.log(` ❌ ${err.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Uploaded: ${uploaded} | Skipped: ${skipped} | Failed: ${failed}`);

  // Verify
  const { count } = await supabase
    .from("product_images")
    .select("*", { count: "exact", head: true });
  console.log(`🔍 Total product_images: ${count}`);
}

main().catch((err) => {
  console.error("❌", err.message);
  process.exit(1);
});
