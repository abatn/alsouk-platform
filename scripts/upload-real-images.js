#!/usr/bin/env node
/**
 * Upload real product images from manufacturer websites to Supabase Storage.
 *
 * Sources:
 *   I3C PLUS:  https://i3cplus.com/  (9 images)
 *   PAF TUBET: https://www.paftube.com/en/  (8 images)
 *
 * Usage:  node scripts/upload-real-images.js
 */

const { createClient } = require("@supabase/supabase-js");
const https = require("https");
const http = require("http");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// Company IDs
const I3C_COMPANY = "b1b2c3d4-e5f6-7890-abcd-200000000003"; // I3C PLUS
const PAF_COMPANY = "b1b2c3d4-e5f6-7890-abcd-200000000004"; // PAF TUBET

// Image mapping: product slug → { url, company_id }
const IMAGE_MAP = {
  // === I3C PLUS (9 images from i3cplus.com) ===
  "huile-olive-750ml": {
    url: "https://i3cplus.com/31-home_default/huile-d-olive-extra-vierge-750ml.jpg",
    company_id: I3C_COMPANY,
    alt: "Huile d'olive extra vierge 750ml - I3C PLUS",
  },
  "huile-olive-250ml": {
    url: "https://i3cplus.com/29-home_default/huile-d-olive-extra-vierge-250ml.jpg",
    company_id: I3C_COMPANY,
    alt: "Huile d'olive extra vierge 250ml - I3C PLUS",
  },
  "dattes-deglet-nour-250g": {
    url: "https://i3cplus.com/67-home_default/dattes-deglet-nour-conditionnees-250g-ravier.jpg",
    company_id: I3C_COMPANY,
    alt: "Dattes Deglet Nour 250g - I3C PLUS",
  },
  "dattes-denoyautees-500g": {
    url: "https://i3cplus.com/70-home_default/dattes-deglet-nour-denoyautees-500g-godet.jpg",
    company_id: I3C_COMPANY,
    alt: "Dattes dénoyautées 500g - I3C PLUS",
  },
  "couscous-bio-1kg": {
    url: "https://i3cplus.com/133-home_default/couscous-moyen.jpg",
    company_id: I3C_COMPANY,
    alt: "Couscous biologique 1kg - I3C PLUS",
  },
  "harissa-traditionnelle": {
    url: "https://i3cplus.com/53-home_default/harissa-berbere.jpg",
    company_id: I3C_COMPANY,
    alt: "Harissa traditionnelle 250g - I3C PLUS",
  },
  "pate-amande": {
    url: "https://i3cplus.com/170-home_default/halva-aux-amandes-plastic-box.jpg",
    company_id: I3C_COMPANY,
    alt: "Pâte d'amande 200g - I3C PLUS",
  },
  "eau-fleur-oranger": {
    url: "https://i3cplus.com/87-home_default/eau-de-fleurs-d-oranger-naturelle.jpg",
    company_id: I3C_COMPANY,
    alt: "Eau de fleur d'oranger 500ml - I3C PLUS",
  },
  "eau-rose": {
    url: "https://i3cplus.com/88-home_default/arome-alimentaire-naturel-de-rose.jpg",
    company_id: I3C_COMPANY,
    alt: "Eau de rose 250ml - I3C PLUS",
  },

  // === PAF TUBET (8 images from paftube.com) ===
  "tube-acier-erw": {
    url: "https://www.paftube.com/wp-content/uploads/2024/12/tube-soude.webp",
    company_id: PAF_COMPANY,
    alt: "Tube acier ERW soudé - PAF TUBET",
  },
  "tube-etreint-froid": {
    url: "https://www.paftube.com/wp-content/uploads/2024/12/tube-etire-a-froid.png",
    company_id: PAF_COMPANY,
    alt: "Tube étréint à froid - PAF TUBET",
  },
  "garde-corps-acier": {
    url: "https://www.paftube.com/wp-content/uploads/2024/12/Barriere-de-prairie-scaled-1.png",
    company_id: PAF_COMPANY,
    alt: "Garde-corps acier / Barrière - PAF TUBET",
  },
  "decoupe-laser": {
    url: "https://www.paftube.com/wp-content/uploads/2024/12/IMG_6673.jpg",
    company_id: PAF_COMPANY,
    alt: "Service découpe laser - PAF TUBET",
  },
  "pergola-acier": {
    url: "https://www.paftube.com/wp-content/uploads/2024/12/pergola-2.webp",
    company_id: PAF_COMPANY,
    alt: "Terrasse pergola acier - PAF TUBET",
  },
  "portail-metal": {
    url: "https://www.paftube.com/wp-content/uploads/2024/12/Cloture-de-Chantier.png",
    company_id: PAF_COMPANY,
    alt: "Portail métallique / Clôture chantier - PAF TUBET",
  },
  "tube-inox": {
    url: "https://www.paftube.com/wp-content/uploads/2024/12/Tube-Paracheve.webp",
    company_id: PAF_COMPANY,
    alt: "Tube inox parachevé - PAF TUBET",
  },
  "tube-galvanise": {
    url: "https://www.paftube.com/wp-content/uploads/2024/12/Tube-GFM-1.png",
    company_id: PAF_COMPANY,
    alt: "Tube galvanisé - PAF TUBET",
  },
};

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const req = client.get(
      url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      },
      (res) => {
        // Follow redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return downloadImage(res.headers.location).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks)));
        res.on("error", reject);
      }
    );
    req.on("error", reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error(`Timeout downloading ${url}`));
    });
  });
}

function getContentType(url) {
  if (url.endsWith(".webp")) return "image/webp";
  if (url.endsWith(".png")) return "image/png";
  return "image/jpeg";
}

async function uploadOne(slug, entry) {
  const { url, company_id, alt } = entry;

  // 1. Download
  const buffer = await downloadImage(url);
  const contentType = getContentType(url);
  const ext = url.endsWith(".webp") ? "webp" : url.endsWith(".png") ? "png" : "jpg";
  const storagePath = `${company_id}/${slug}.${ext}`;

  // 2. Upload to storage
  const { error: uploadErr } = await supabase.storage
    .from("product-images")
    .upload(storagePath, buffer, { contentType, upsert: true });

  if (uploadErr) throw new Error(`Storage upload failed: ${uploadErr.message}`);

  // 3. Get public URL
  const { data: urlData } = supabase.storage
    .from("product-images")
    .getPublicUrl(storagePath);

  // 4. Get product ID
  const { data: products } = await supabase
    .from("products")
    .select("id")
    .eq("slug", slug)
    .limit(1);

  if (!products || products.length === 0) {
    throw new Error(`Product not found: ${slug}`);
  }

  const productId = products[0].id;

  // 5. Insert product_images row (delete existing first)
  await supabase.from("product_images").delete().eq("product_id", productId);

  const { error: insertErr } = await supabase.from("product_images").insert({
    product_id: productId,
    storage_bucket: "product-images",
    storage_path: storagePath,
    url: urlData.publicUrl,
    alt,
    position: 0,
    is_primary: true,
  });

  if (insertErr) throw new Error(`DB insert failed: ${insertErr.message}`);

  return { slug, size: buffer.length, url: urlData.publicUrl };
}

async function main() {
  const slugs = Object.keys(IMAGE_MAP);
  console.log(`Uploading ${slugs.length} real product images...\n`);

  let ok = 0;
  let fail = 0;

  for (const slug of slugs) {
    const entry = IMAGE_MAP[slug];
    try {
      const result = await uploadOne(slug, entry);
      const sizeKB = (result.size / 1024).toFixed(1);
      console.log(`  ✅ ${slug} — ${sizeKB} KB — ${result.url}`);
      ok++;
    } catch (err) {
      console.error(`  ❌ ${slug} — ${err.message}`);
      fail++;
    }
  }

  console.log(`\nDone: ${ok}/${slugs.length} uploaded, ${fail} failed`);

  // Verify
  const { count } = await supabase
    .from("product_images")
    .select("*", { count: "exact", head: true });

  console.log(`Total product_images rows: ${count}`);
}

main().catch(console.error);
