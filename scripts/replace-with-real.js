const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// REAL images from manufacturer websites (verified HTTP 200)
const realImageUrls = {
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

async function replaceWithRealImages() {
  console.log('🔧 Replacing images with real manufacturer photos...\n');
  
  for (const [companyId, products] of Object.entries(realImageUrls)) {
    console.log(`\n📦 Company: ${companyId}`);
    
    for (const [slug, realUrl] of Object.entries(products)) {
      console.log(`  📥 ${slug} from ${realUrl.substring(0, 50)}...`);
      
      // Download real image
      const res = await fetch(realUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!res.ok) {
        console.log(`  ❌ Download failed: HTTP ${res.status}`);
        continue;
      }
      
      const buf = Buffer.from(await res.arrayBuffer());
      const ext = realUrl.endsWith('.png') ? 'png' : 'jpg';
      const storagePath = `${companyId}/${slug}.${ext}`;
      
      // Upload (overwrite existing)
      const { error } = await supabase.storage.from('product-images').upload(storagePath, buf, {
        contentType: `image/${ext}`,
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
      
      console.log(`  ✅ Replaced with real image`);
    }
  }
  
  // Verify
  console.log('\n📊 Verification:');
  const { data: images } = await supabase.from('product_images').select('url');
  const fake = images.filter(i => i.url.includes('placehold') || i.url.includes('picsum'));
  console.log(`Total images: ${images.length}`);
  console.log(`Fake images: ${fake.length}`);
}

replaceWithRealImages().catch(console.error);
