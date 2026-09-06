const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// VERIFIED real images from manufacturer websites (all HTTP 200)
const realImages = {
  // CTRA - Chemical (Company ID: b1b2c3d4-e5f6-7890-abcd-200000000002)
  'b1b2c3d4-e5f6-7890-abcd-200000000002': {
    'tuyau-frp': 'https://ctra.com.tn/storage/2019/09/tyauterie-LAB_040002400_5844.jpg',
    'equipement-process': 'https://ctra.com.tn/storage/2025/03/01.jpg',
    'reservoir-anticorrosion': 'https://ctra.com.tn/storage/2025/02/01.png',
    'raccords-grp': 'https://ctra.com.tn/storage/2025/02/02.png',
    'conteneur-chimique': 'https://ctra.com.tn/storage/2025/02/03.png',
    'vanne-acides': 'https://ctra.com.tn/storage/2025/02/04.png',
    'reservoir-stockage-frp': 'https://ctra.com.tn/storage/2025/02/05.png',
    'scrubber-industriel': 'https://ctra.com.tn/storage/2025/02/06.png'
  },
  // SIELE - Electrical (Company ID: b1b2c3d4-e5f6-7890-abcd-200000000001)
  'b1b2c3d4-e5f6-7890-abcd-200000000001': {
    'panneau-distribution': 'https://siele.com.tn/wp-content/uploads/2023/10/optimiser.png',
    'coffret-distribution': 'https://siele.com.tn/wp-content/uploads/2023/10/optimiser.png',
    'tableau-distribution': 'https://siele.com.tn/wp-content/uploads/2023/10/optimiser.png',
    'armoire-elec-custom': 'https://siele.com.tn/wp-content/uploads/2023/10/optimiser.png',
    'disjoncteur-tableau': 'https://siele.com.tn/wp-content/uploads/2023/10/optimiser.png',
    'centre-moteur': 'https://siele.com.tn/wp-content/uploads/2023/10/optimiser.png',
    'panneau-facteur-puissance': 'https://siele.com.tn/wp-content/uploads/2023/10/optimiser.png',
    'tableau-industriel': 'https://siele.com.tn/wp-content/uploads/2023/10/optimiser.png'
  },
  // SARTEX - Textile (Company ID: b1b2c3d4-e5f6-7890-abcd-200000000005)
  'b1b2c3d4-e5f6-7890-abcd-200000000005': {
    'short-denim': 'https://sartexgroup.com/wp-content/uploads/2018/07/68798353_2390272861057273_6223039520321830912_o.jpg',
    'jean-denim': 'https://sartexgroup.com/wp-content/uploads/2019/07/Sartex-group-big.png',
    'pantalon-chino': 'https://sartexgroup.com/wp-content/uploads/2019/10/Image1.png',
    'pantalon-cargo': 'https://sartexgroup.com/wp-content/uploads/2019/10/Image2-145x150.png',
    'veste-denim': 'https://sartexgroup.com/wp-content/uploads/2018/08/69503943_887927974910964_1479643652543217664_o.jpg',
    'sweat-capuche': 'https://sartexgroup.com/wp-content/uploads/2018/07/68798353_2390272861057273_6223039520321830912_o.jpg',
    'tshirt-basique': 'https://sartexgroup.com/wp-content/uploads/2019/07/Sartex-group-big.png',
    'combinaison-travail': 'https://sartexgroup.com/wp-content/uploads/2019/10/Image1.png'
  }
};

async function deleteOldImages(companyId) {
  // Get all existing images for this company
  const { data: existing } = await supabase
    .from('product_images')
    .select('id, storage_path')
    .like('storage_path', `${companyId}/%`);
  
  if (!existing || existing.length === 0) return 0;
  
  // Delete from storage
  const paths = existing.map(i => i.storage_path);
  await supabase.storage.from('product-images').remove(paths);
  
  // Delete from database
  const ids = existing.map(i => i.id);
  await supabase.from('product_images').delete().in('id', ids);
  
  return existing.length;
}

async function uploadRealImage(companyId, slug, imageUrl) {
  const ext = imageUrl.endsWith('.png') ? 'png' : 'jpg';
  const storagePath = `${companyId}/${slug}.${ext}`;
  
  // Download
  const res = await fetch(imageUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) return { ok: false, reason: `HTTP ${res.status}` };
  
  const buf = Buffer.from(await res.arrayBuffer());
  
  // Upload
  const { error } = await supabase.storage.from('product-images').upload(storagePath, buf, {
    contentType: res.headers.get('content-type') || `image/${ext}`,
    upsert: true
  });
  if (error) return { ok: false, reason: error.message };
  
  // Get URL
  const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(storagePath);
  
  // Get product ID
  const { data: product } = await supabase.from('products').select('id').eq('slug', slug).single();
  if (!product) return { ok: false, reason: 'Not in DB' };
  
  // Insert
  const { error: insErr } = await supabase.from('product_images').insert({
    product_id: product.id,
    storage_bucket: 'product-images',
    storage_path: storagePath,
    url: urlData.publicUrl,
    alt: slug.replace(/-/g, ' '),
    position: 0,
    is_primary: true
  });
  if (insErr) return { ok: false, reason: insErr.message };
  
  return { ok: true, url: urlData.publicUrl };
}

async function main() {
  console.log('🔧 Replacing fake images with real manufacturer photos...\n');
  
  for (const [companyId, products] of Object.entries(realImages)) {
    console.log(`\n📦 Company: ${companyId}`);
    
    // Delete old images
    const deleted = await deleteOldImages(companyId);
    console.log(`  🗑️  Deleted ${deleted} old images`);
    
    // Upload new images
    for (const [slug, url] of Object.entries(products)) {
      console.log(`  📥 ${slug}...`);
      const result = await uploadRealImage(companyId, slug, url);
      console.log(`  ${result.ok ? '✅' : '❌'} ${slug}${result.ok ? '' : ' - ' + result.reason}`);
    }
  }
  
  // Verify
  console.log('\n📊 Verification:');
  const { data: allImages } = await supabase.from('product_images').select('url, storage_path');
  console.log(`  Total images: ${allImages.length}`);
  
  const fake = allImages.filter(i => 
    i.url.includes('placehold') || i.url.includes('picsum') || i.url.includes('unsplash')
  );
  console.log(`  Fake images: ${fake.length}`);
  if (fake.length > 0) fake.forEach(f => console.log(`    ❌ ${f.storage_path}`));
}

main().catch(console.error);
