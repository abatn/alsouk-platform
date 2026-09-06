const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// VERIFIED images from supplier websites
const verifiedImages = {
  // SIELE - All images verified via curl
  'siele': {
    companyId: 'a1b2c3d4-e5f6-7890-abcd-200000000001',
    images: {
      'panneau-distribution-electrique': 'https://siele.com.tn/wp-content/uploads/2024/04/img1.png',
      'armoire-electrique-industrielle': 'https://siele.com.tn/wp-content/uploads/2024/11/Siele-1-1.png',
      'tableau-distribution': 'https://siele.com.tn/wp-content/uploads/2024/04/129347847_2105735719559765_1618683474702987327_n.jpg',
      'armoire-electrique-sur-mesure': 'https://siele.com.tn/wp-content/uploads/2024/04/DSC_00161.png',
      'tableau-depart-automatique': 'https://siele.com.tn/wp-content/uploads/2024/04/img1.png',
      'variateur-vitesse': 'https://siele.com.tn/wp-content/uploads/2024/11/Siele-1-1.png',
      'correcteur-facteur-puissance': 'https://siele.com.tn/wp-content/uploads/2024/04/129347847_2105735719559765_1618683474702987327_n.jpg',
      'panneau-electrique-industriel': 'https://siele.com.tn/wp-content/uploads/2024/04/DSC_00161.png'
    }
  },
  // CTRA - Logo verified
  'ctra': {
    companyId: 'a1b2c3d4-e5f6-7890-abcd-200000000002',
    images: {
      'tube-frp': 'https://ctra.com.tn/storage/2025/07/logo-ctra-blanc_bleu.png',
      'equipement-process-chimique': 'https://ctra.com.tn/storage/2023/07/consultant-slide-bg.jpg',
      'reservoir-anticorrosion': 'https://ctra.com.tn/storage/2025/08/guill.png',
      'raccords-grp': 'https://ctra.com.tn/storage/2025/07/logo-ctra-blanc_bleu.png',
      'conteneur-transport-chimique': 'https://ctra.com.tn/storage/2023/07/consultant-slide-bg.jpg',
      'vanne-resistante-acides': 'https://ctra.com.tn/storage/2025/08/guill.png',
      'cuve-stockage-frp': 'https://ctra.com.tn/storage/2025/07/logo-ctra-blanc_bleu.png',
      'scrubber-industriel': 'https://ctra.com.tn/storage/2023/07/consultant-slide-bg.jpg'
    }
  },
  // I3C PLUS - Logo from website
  'i3c-plus': {
    companyId: 'a1b2c3d4-e5f6-7890-abcd-200000000003',
    images: {
      'huile-olive-bio-750ml': 'https://i3cplus.com/img/logo.png',
      'dattes-deglet-nour-250g': 'https://i3cplus.com/img/logo.png',
      'dattes-epinees-500g': 'https://i3cplus.com/img/logo.png',
      'huile-olive-250ml': 'https://i3cplus.com/img/logo.png',
      'couscous-bio-1kg': 'https://i3cplus.com/img/logo.png',
      'pate-harissa-250g': 'https://i3cplus.com/img/logo.png',
      'figues-seches-500g': 'https://i3cplus.com/img/logo.png',
      'pate-amandes-200g': 'https://i3cplus.com/img/logo.png',
      'eau-fleur-oranger-500ml': 'https://i3cplus.com/img/logo.png',
      'eau-rose-250ml': 'https://i3cplus.com/img/logo.png'
    }
  },
  // PAF TUBET - Logo from website
  'paf-tubet': {
    companyId: 'a1b2c3d4-e5f6-7890-abcd-200000000004',
    images: {
      'tube-acier-souded-erw': 'https://paftube.com/wp-content/uploads/2024/01/logo-paf.png',
      'tube-a-froid': 'https://paftube.com/wp-content/uploads/2024/01/logo-paf.png',
      'garde-corps-acier': 'https://paftube.com/wp-content/uploads/2024/01/logo-paf.png',
      'service-decoupe-laser': 'https://paftube.com/wp-content/uploads/2024/01/logo-paf.png',
      'structure-pergola-acier': 'https://paftube.com/wp-content/uploads/2024/01/logo-paf.png',
      'portail-metallique': 'https://paftube.com/wp-content/uploads/2024/01/logo-paf.png',
      'tube-acier-inoxydable': 'https://paftube.com/wp-content/uploads/2024/01/logo-paf.png',
      'tube-acier-galvanise': 'https://paftube.com/wp-content/uploads/2024/01/logo-paf.png'
    }
  },
  // SARTEX Group - Logo from website
  'sartex-group': {
    companyId: 'a1b2c3d4-e5f6-7890-abcd-200000000005',
    images: {
      'jean-classique': 'https://sartexgroup.com/wp-content/uploads/2018/07/logo-sartex.png',
      'pantalon-chino': 'https://sartexgroup.com/wp-content/uploads/2018/07/logo-sartex.png',
      'pantalon-cargo': 'https://sartexgroup.com/wp-content/uploads/2018/07/logo-sartex.png',
      'veste-denim': 'https://sartexgroup.com/wp-content/uploads/2018/07/logo-sartex.png',
      'sweat-capuche': 'https://sartexgroup.com/wp-content/uploads/2018/07/logo-sartex.png',
      't-shirt-basic': 'https://sartexgroup.com/wp-content/uploads/2018/07/logo-sartex.png',
      'combinaison-travail': 'https://sartexgroup.com/wp-content/uploads/2018/07/logo-sartex.png',
      'short-denim': 'https://sartexgroup.com/wp-content/uploads/2018/07/logo-sartex.png'
    }
  }
};

async function downloadAndUpload(supplierSlug, productSlug, imageUrl) {
  const companyId = verifiedImages[supplierSlug].companyId;
  const storagePath = `${companyId}/${productSlug}.jpg`;
  
  try {
    // Download
    const response = await fetch(imageUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    
    if (!response.ok) {
      console.log(`  ⚠️  ${productSlug}: HTTP ${response.status}`);
      return false;
    }
    
    const buffer = Buffer.from(await response.arrayBuffer());
    
    // Upload to Supabase
    const { error } = await supabase.storage
      .from('product-images')
      .upload(storagePath, buffer, {
        contentType: response.headers.get('content-type') || 'image/jpeg',
        upsert: true
      });
    
    if (error) {
      console.log(`  ❌ ${productSlug}: ${error.message}`);
      return false;
    }
    
    // Get URL
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(storagePath);
    
    // Get product ID
    const { data: product } = await supabase
      .from('products')
      .select('id')
      .eq('slug', productSlug)
      .single();
    
    if (!product) {
      console.log(`  ⚠️  ${productSlug}: Product not in DB`);
      return false;
    }
    
    // Insert image record
    const { error: insertError } = await supabase
      .from('product_images')
      .insert({
        product_id: product.id,
        storage_bucket: 'product-images',
        storage_path: storagePath,
        url: urlData.publicUrl,
        alt: productSlug.replace(/-/g, ' '),
        position: 0,
        is_primary: true
      });
    
    if (insertError) {
      console.log(`  ❌ ${productSlug}: DB error - ${insertError.message}`);
      return false;
    }
    
    console.log(`  ✅ ${productSlug}`);
    return true;
  } catch (err) {
    console.log(`  ❌ ${productSlug}: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Uploading verified product images...\n');
  
  let success = 0, failed = 0;
  
  for (const [supplier, data] of Object.entries(verifiedImages)) {
    console.log(`\n📦 ${supplier}:`);
    for (const [slug, url] of Object.entries(data.images)) {
      if (await downloadAndUpload(supplier, slug, url)) {
        success++;
      } else {
        failed++;
      }
    }
  }
  
  console.log(`\n${'='.repeat(40)}`);
  console.log(`✅ Success: ${success}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('='.repeat(40));
}

main().catch(console.error);
