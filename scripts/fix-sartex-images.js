const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Real product photos from sartexgroup.com/product-range/
const sartexProducts = {
  'b1b2c3d4-e5f6-7890-abcd-200000000005': {
    'short-denim': 'https://sartexgroup.com/wp-content/uploads/2021/02/shooting-01-DSC_3287-285x428.jpg',
    'jean-denim': 'https://sartexgroup.com/wp-content/uploads/2021/02/shooting-01-DSC_3303-285x428.jpg',
    'pantalon-chino': 'https://sartexgroup.com/wp-content/uploads/2021/02/shooting-01-DSC_3342-285x428.jpg',
    'pantalon-cargo': 'https://sartexgroup.com/wp-content/uploads/2021/02/shooting-01-DSC_3410-1-285x428.jpg',
    'veste-denim': 'https://sartexgroup.com/wp-content/uploads/2021/02/shooting-01-DSC_3491-285x427.jpg',
    'sweat-capuche': 'https://sartexgroup.com/wp-content/uploads/2021/02/shooting-01-DSC_3561-285x428.jpg',
    'tshirt-basique': 'https://sartexgroup.com/wp-content/uploads/2021/01/Image3-285x427.jpg',
    'combinaison-travail': 'https://sartexgroup.com/wp-content/uploads/2021/01/Image4.jpg'
  }
};

async function replaceSartexImages() {
  console.log('🔧 Replacing SARTEX images with real product photos...\n');
  
  for (const [companyId, products] of Object.entries(sartexProducts)) {
    for (const [slug, realUrl] of Object.entries(products)) {
      console.log(`📥 ${slug}...`);
      
      // Download real image
      const res = await fetch(realUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!res.ok) {
        console.log(`  ❌ Download failed: HTTP ${res.status}`);
        continue;
      }
      
      const buf = Buffer.from(await res.arrayBuffer());
      const storagePath = `${companyId}/${slug}.jpg`;
      
      // Upload (overwrite existing)
      const { error } = await supabase.storage.from('product-images').upload(storagePath, buf, {
        contentType: 'image/jpeg',
        upsert: true
      });
      
      if (error) {
        console.log(`  ❌ Upload failed: ${error.message}`);
        continue;
      }
      
      // Get URL
      const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(storagePath);
      
      // Update database
      const { data: product } = await supabase.from('products').select('id').eq('slug', slug).single();
      if (product) {
        await supabase.from('product_images').upsert({
          product_id: product.id,
          storage_bucket: 'product-images',
          storage_path: storagePath,
          url: urlData.publicUrl,
          alt: slug.replace(/-/g, ' '),
          position: 0,
          is_primary: true
        }, { onConflict: 'product_id' });
      }
      
      console.log(`  ✅ Replaced with real product photo`);
    }
  }
  
  // Verify
  console.log('\n📊 Verification:');
  const { data: images } = await supabase.from('product_images')
    .select('storage_path, url')
    .like('storage_path', 'b1b2c3d4-e5f6-7890-abcd-200000000005/%');
  console.log('SARTEX images now:');
  images.forEach(i => console.log(`  ${i.storage_path}`));
}

replaceSartexImages().catch(console.error);
