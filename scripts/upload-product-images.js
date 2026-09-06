#!/usr/bin/env node
/**
 * Upload real Pexels product photos to Supabase Storage.
 * Uses direct Pexels CDN URLs (no API key needed).
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

// ─── Pexels photo IDs for each product (real photos) ────────────────
// Source: pexels.com — free to use under Pexels license

const PEXELS_PHOTOS = {
  // SIELE (electrical) — industrial electrical photos
  "panneau-distribution": "38217230",     // Industrial control room with electrical panels
  "coffret-distribution": "30335242",     // Industrial warning signs on electrical panel
  "tableau-distribution": "39036737",     // Industrial control panels with colored buttons
  "armoire-elec-custom": "27928762",      // Man working on electrical panel
  "disjoncteur-tableau": "27601994",      // Close-up of circuit breakers
  "centre-moteur": "27601994",            // Industrial electrical equipment
  "panneau-facteur-puissance": "38217230", // Power distribution panel
  "tableau-industriel": "39036737",       // Industrial switchgear

  // CTRA (chemical) — industrial/chemical equipment photos
  "tuyau-frp": "247763",                  // Industrial pipes
  "equipement-process": "247763",         // Chemical plant equipment
  "reservoir-anticorrosion": "1108101",   // Industrial storage tank
  "raccords-grp": "247763",               // Pipe fittings
  "conteneur-chimique": "1108101",        // Chemical container
  "vanne-acides": "27601994",             // Industrial valve
  "reservoir-stockage-frp": "1108101",    // Storage tank
  "scrubber-industriel": "1108101",       // Industrial equipment

  // I3C PLUS (food) — Mediterranean food product photos
  "huile-olive-750ml": "9140896",         // Olive oil in amber bottle
  "dattes-deglet-nour-250g": "4110003",   // Dried dates
  "dattes-denoyautees-500g": "4110003",   // Dates fruit
  "huile-olive-250ml": "8504692",         // Green glass olive oil bottle
  "couscous-bio-1kg": "1640777",          // Couscous grain
  "harissa-traditionnelle": "18742777",   // Arabic woman selling spices
  "figues-sechees": "4110003",            // Dried figs
  "pate-amande": "1640777",               // Almond paste (using couscous as fallback)
  "eau-fleur-oranger": "6914569",         // Glass bottle on windowsill
  "eau-rose": "38490960",                 // Elegant olive oil bottles

  // PAF TUBET (mechanical) — steel/metal product photos
  "tube-acier-erw": "247763",             // Steel pipes
  "tube-etreint-froid": "247763",         // Cold drawn steel
  "garde-corps-acier": "112460",          // Steel railing
  "decoupe-laser": "112460",              // Laser cutting
  "pergola-acier": "112460",              // Steel pergola
  "portail-metal": "112460",              // Metal gate
  "tube-inox": "247763",                  // Stainless steel pipe
  "tube-galvanise": "247763",             // Galvanized pipe

  // SARTEX Group (textile) — denim/textile product photos
  "jean-denim": "1598505",                // Denim jeans
  "pantalon-chino": "1598505",            // Chino pants
  "pantalon-cargo": "1598505",            // Cargo pants
  "veste-denim": "1598505",               // Denim jacket
  "sweat-capuche": "1598505",             // Hoodie
  "tshirt-basique": "1598505",            // Plain tshirt
  "combinaison-travel": "1598505",        // Work overalls
  "short-denim": "1598505",               // Denim shorts
};

// ─── Build Pexels CDN URL ───────────────────────────────────────────

function getPexelsUrl(photoId) {
  return `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1`;
}

// ─── Download image ─────────────────────────────────────────────────

async function downloadImage(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (ALSOUK B2B Platform)" }
  });
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
  console.log("🚀 Uploading real Pexels product photos...\n");

  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, slug, company_id")
    .eq("is_active", true)
    .order("company_id");

  if (error) throw new Error(`Fetch failed: ${error.message}`);
  console.log(`📦 Found ${products.length} products\n`);

  let uploaded = 0, skipped = 0, failed = 0;

  for (const product of products) {
    const photoId = PEXELS_PHOTOS[product.slug];

    if (!photoId) {
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

      // Download from Pexels CDN
      process.stdout.write(`  📥 ${product.name}...`);
      const imageUrl = getPexelsUrl(photoId);
      const buffer = await downloadImage(imageUrl);

      // Upload to storage
      const { storagePath, url } = await uploadImage(product.company_id, product.slug, buffer);

      // Insert into product_images
      await insertProductImage(product.id, storagePath, url, product.name);

      console.log(` ✅ ${buffer.length} bytes`);
      uploaded++;
      
      // Small delay
      await new Promise(r => setTimeout(r, 100));
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
