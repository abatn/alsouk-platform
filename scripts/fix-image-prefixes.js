const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Mapping: old prefix -> new prefix
const prefixMap = {
  'a1b2c3d4-e5f6-7890-abcd-200000000001': 'b1b2c3d4-e5f6-7890-abcd-200000000001',
  'a1b2c3d4-e5f6-7890-abcd-200000000002': 'b1b2c3d4-e5f6-7890-abcd-200000000002',
  'a1b2c3d4-e5f6-7890-abcd-200000000003': 'b1b2c3d4-e5f6-7890-abcd-200000000003',
  'a1b2c3d4-e5f6-7890-abcd-200000000004': 'b1b2c3d4-e5f6-7890-abcd-200000000004',
  'a1b2c3d4-e5f6-7890-abcd-200000000005': 'b1b2c3d4-e5f6-7890-abcd-200000000005'
};

// Real images from manufacturer websites
const realImages = {
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

async function fixImages() {
  console.log('🔧 Fixing image company IDs and uploading real images...\n');
  
  // Step 1: Get all images with wrong prefix
  const { data: allImages } = await supabase.from('product_images').select('*');
  const wrongPrefix = allImages.filter(i => i.storage_path.startsWith('a1b2c3d4'));
  
  console.log(`Found ${wrongPrefix.length} images with wrong prefix`);
  
  // Step 2: For each wrong image, get the product slug and find correct company ID
  for (const img of wrongPrefix) {
    const parts = img.storage_path.split('/');
    const slug = parts[1].replace(/\.\w+$/, '');
    
    // Find the product
    const { data: product } = await supabase
      .from('products')
      .select('company_id')
      .eq('id', img.product_id)
      .single();
    
    if (!product) continue;
    
    const correctCompanyId = product.company_id;
    const ext = parts[1].split('.').pop();
    const newPath = `${correctCompanyId}/${slug}.${ext}`;
    
    console.log(`Moving: ${img.storage_path} -> ${newPath}`);
    
    // Download from old path
    const { data: oldData } = await supabase.storage.from('product-images').download(img.storage_path);
    if (!oldData) {
      console.log(`  ❌ Could not download old image`);
      continue;
    }
    
    // Upload to new path
    const { error: uploadError } = await supabase.storage.from('product-images').upload(newPath, oldData, {
      contentType: `image/${ext}`,
      upsert: true
    });
    
    if (uploadError) {
      console.log(`  ❌ Upload failed: ${uploadError.message}`);
      continue;
    }
    
    // Get new URL
    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(newPath);
    
    // Update database
    await supabase.from('product_images').update({
      storage_path: newPath,
      url: urlData.publicUrl
    }).eq('id', img.id);
    
    // Delete old file
    await supabase.storage.from('product-images').remove([img.storage_path]);
    
    console.log(`  ✅ Moved`);
  }
  
  // Step 3: Upload real images for products that need them
  console.log('\n📦 Uploading real manufacturer images...');
  
  for (const [companyId, products] of Object.entries(realImages)) {
    for (const [slug, url] of Object.entries(products)) {
      // Check if product already has an image with correct prefix
      const { data: existing } = await supabase
        .from('product_images')
        .select('id')
        .like('storage_path', `${companyId}/${slug}%`)
        .limit(1);
      
      if (existing && existing.length > 0) {
        console.log(`  ⏭️  ${slug} already has image`);
        continue;
      }
      
      console.log(`  📥 ${slug}...`);
      
      const ext = url.endsWith('.png') ? 'png' : 'jpg';
      const storagePath = `${companyId}/${slug}.${ext}`;
      
      // Download
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!res.ok) {
        console.log(`  ❌ Download failed: HTTP ${res.status}`);
        continue;
      }
      
      const buf = Buffer.from(await res.arrayBuffer());
      
      // Upload
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
      
      // Get product ID
      const { data: product } = await supabase.from('products').select('id').eq('slug', slug).single();
      if (!product) {
        console.log(`  ❌ Product not found: ${slug}`);
        continue;
      }
      
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
      
      if (insErr) {
        console.log(`  ❌ DB insert failed: ${insErr.message}`);
        continue;
      }
      
      console.log(`  ✅ Uploaded`);
    }
  }
  
  // Final verification
  console.log('\n📊 Final verification:');
  const { data: finalImages } = await supabase.from('product_images').select('storage_path');
  console.log(`Total images: ${finalImages.length}`);
  
  const withCorrectPrefix = finalImages.filter(i => i.storage_path.startsWith('b1b2c3d4'));
  console.log(`With correct prefix: ${withCorrectPrefix.length}`);
  
  const withWrongPrefix = finalImages.filter(i => i.storage_path.startsWith('a1b2c3d4'));
  console.log(`With wrong prefix: ${withWrongPrefix.length}`);
}

fixImages().catch(console.error);
