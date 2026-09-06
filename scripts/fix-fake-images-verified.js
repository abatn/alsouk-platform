const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// VERIFIED original sizes from manufacturer websites
const originalSizes = {
  // CTRA
  'ctra-01': 5760,
  'ctra-02': 5129,
  'ctra-03': 6770,
  'ctra-04': 6401,
  'ctra-05': 7313,
  'ctra-06': 6623,
  // SIELE
  'siele-optimiser': 441237,
  // SARTEX
  'sartex-factory1': 100020,
  'sartex-overview': 54030,
  'sartex-process': 49504,
  'sartex-detail': 26756,
  'sartex-factory2': 1109565,
};

// Products to fix with correct URLs
const productsToFix = [
  // CTRA (6 products)
  { slug: 'reservoir-anticorrosion', companyId: 'b1b2c3d4-e5f6-7890-abcd-200000000002', url: 'https://ctra.com.tn/storage/2025/02/01.png', expectedSize: 5760, ext: 'png' },
  { slug: 'raccords-grp', companyId: 'b1b2c3d4-e5f6-7890-abcd-200000000002', url: 'https://ctra.com.tn/storage/2025/02/02.png', expectedSize: 5129, ext: 'png' },
  { slug: 'conteneur-chimique', companyId: 'b1b2c3d4-e5f6-7890-abcd-200000000002', url: 'https://ctra.com.tn/storage/2025/02/03.png', expectedSize: 6770, ext: 'png' },
  { slug: 'vanne-acides', companyId: 'b1b2c3d4-e5f6-7890-abcd-200000000002', url: 'https://ctra.com.tn/storage/2025/02/04.png', expectedSize: 6401, ext: 'png' },
  { slug: 'reservoir-stockage-frp', companyId: 'b1b2c3d4-e5f6-7890-abcd-200000000002', url: 'https://ctra.com.tn/storage/2025/02/05.png', expectedSize: 7313, ext: 'png' },
  { slug: 'scrubber-industriel', companyId: 'b1b2c3d4-e5f6-7890-abcd-200000000002', url: 'https://ctra.com.tn/storage/2025/02/06.png', expectedSize: 6623, ext: 'png' },
  
  // SIELE (8 products - all use same factory image)
  { slug: 'panneau-distribution', companyId: 'b1b2c3d4-e5f6-7890-abcd-200000000001', url: 'https://siele.com.tn/wp-content/uploads/2023/10/optimiser.png', expectedSize: 441237, ext: 'png' },
  { slug: 'coffret-distribution', companyId: 'b1b2c3d4-e5f6-7890-abcd-200000000001', url: 'https://siele.com.tn/wp-content/uploads/2023/10/optimiser.png', expectedSize: 441237, ext: 'png' },
  { slug: 'tableau-distribution', companyId: 'b1b2c3d4-e5f6-7890-abcd-200000000001', url: 'https://siele.com.tn/wp-content/uploads/2023/10/optimiser.png', expectedSize: 441237, ext: 'png' },
  { slug: 'armoire-elec-custom', companyId: 'b1b2c3d4-e5f6-7890-abcd-200000000001', url: 'https://siele.com.tn/wp-content/uploads/2023/10/optimiser.png', expectedSize: 441237, ext: 'png' },
  { slug: 'disjoncteur-tableau', companyId: 'b1b2c3d4-e5f6-7890-abcd-200000000001', url: 'https://siele.com.tn/wp-content/uploads/2023/10/optimiser.png', expectedSize: 441237, ext: 'png' },
  { slug: 'centre-moteur', companyId: 'b1b2c3d4-e5f6-7890-abcd-200000000001', url: 'https://siele.com.tn/wp-content/uploads/2023/10/optimiser.png', expectedSize: 441237, ext: 'png' },
  { slug: 'panneau-facteur-puissance', companyId: 'b1b2c3d4-e5f6-7890-abcd-200000000001', url: 'https://siele.com.tn/wp-content/uploads/2023/10/optimiser.png', expectedSize: 441237, ext: 'png' },
  { slug: 'tableau-industriel', companyId: 'b1b2c3d4-e5f6-7890-abcd-200000000001', url: 'https://siele.com.tn/wp-content/uploads/2023/10/optimiser.png', expectedSize: 441237, ext: 'png' },
  
  // SARTEX (8 products)
  { slug: 'short-denim', companyId: 'b1b2c3d4-e5f6-7890-abcd-200000000005', url: 'https://sartexgroup.com/wp-content/uploads/2018/07/68798353_2390272861057273_6223039520321830912_o.jpg', expectedSize: 100020, ext: 'jpg' },
  { slug: 'jean-denim', companyId: 'b1b2c3d4-e5f6-7890-abcd-200000000005', url: 'https://sartexgroup.com/wp-content/uploads/2019/07/Sartex-group-big.png', expectedSize: 54030, ext: 'png' },
  { slug: 'pantalon-chino', companyId: 'b1b2c3d4-e5f6-7890-abcd-200000000005', url: 'https://sartexgroup.com/wp-content/uploads/2019/10/Image1.png', expectedSize: 49504, ext: 'png' },
  { slug: 'pantalon-cargo', companyId: 'b1b2c3d4-e5f6-7890-abcd-200000000005', url: 'https://sartexgroup.com/wp-content/uploads/2019/10/Image2-145x150.png', expectedSize: 26756, ext: 'png' },
  { slug: 'veste-denim', companyId: 'b1b2c3d4-e5f6-7890-abcd-200000000005', url: 'https://sartexgroup.com/wp-content/uploads/2018/08/69503943_887927974910964_1479643652543217664_o.jpg', expectedSize: 1109565, ext: 'jpg' },
  { slug: 'sweat-capuche', companyId: 'b1b2c3d4-e5f6-7890-abcd-200000000005', url: 'https://sartexgroup.com/wp-content/uploads/2018/07/68798353_2390272861057273_6223039520321830912_o.jpg', expectedSize: 100020, ext: 'jpg' },
  { slug: 'tshirt-basique', companyId: 'b1b2c3d4-e5f6-7890-abcd-200000000005', url: 'https://sartexgroup.com/wp-content/uploads/2019/07/Sartex-group-big.png', expectedSize: 54030, ext: 'png' },
  { slug: 'combinaison-travail', companyId: 'b1b2c3d4-e5f6-7890-abcd-200000000005', url: 'https://sartexgroup.com/wp-content/uploads/2019/10/Image1.png', expectedSize: 49504, ext: 'png' },
];

async function processImage(product) {
  const { slug, companyId, url, expectedSize, ext } = product;
  const storagePath = `${companyId}/${slug}.${ext}`;
  
  console.log(`\n--- ${slug} ---`);
  console.log(`  URL: ${url}`);
  console.log(`  Expected size: ${expectedSize} bytes`);
  
  // Step 1: Download original
  console.log(`  Step 1: Downloading...`);
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    
    if (!res.ok) {
      console.log(`  ❌ STOP: Download failed - HTTP ${res.status}`);
      return { success: false, reason: `HTTP ${res.status}`, slug };
    }
    
    const buffer = Buffer.from(await res.arrayBuffer());
    const downloadSize = buffer.length;
    
    console.log(`  Step 2: Downloaded ${downloadSize} bytes`);
    
    // Step 2: Verify size matches expected
    if (downloadSize !== expectedSize) {
      console.log(`  ❌ STOP: Size mismatch - expected ${expectedSize}, got ${downloadSize}`);
      return { success: false, reason: `Size mismatch: expected ${expectedSize}, got ${downloadSize}`, slug };
    }
    console.log(`  Step 3: Size verified ✅`);
    
    // Step 3: Save to temp file for checksum
    const tmpPath = `/tmp/${slug}.${ext}`;
    fs.writeFileSync(tmpPath, buffer);
    
    // Step 4: Calculate MD5
    const md5 = require('crypto').createHash('md5').update(buffer).digest('hex');
    console.log(`  Step 4: MD5 = ${md5}`);
    
    // Step 5: Upload to Supabase
    console.log(`  Step 5: Uploading to Supabase...`);
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(storagePath, buffer, {
        contentType: ext === 'png' ? 'image/png' : 'image/jpeg',
        upsert: true
      });
    
    if (uploadError) {
      console.log(`  ❌ STOP: Upload failed - ${uploadError.message}`);
      return { success: false, reason: `Upload failed: ${uploadError.message}`, slug };
    }
    console.log(`  Step 6: Uploaded ✅`);
    
    // Step 6: Verify upload - download and compare
    console.log(`  Step 7: Verifying upload...`);
    const { data: downloaded, error: dlError } = await supabase.storage
      .from('product-images')
      .download(storagePath);
    
    if (dlError) {
      console.log(`  ❌ STOP: Verification download failed - ${dlError.message}`);
      return { success: false, reason: `Verification failed: ${dlError.message}`, slug };
    }
    
    const arrayBuffer = await downloaded.arrayBuffer();
    const uploadedBuffer = Buffer.from(arrayBuffer);
    const uploadedSize = uploadedBuffer.length;
    const uploadedMd5 = require('crypto').createHash('md5').update(uploadedBuffer).digest('hex');
    
    console.log(`  Step 8: Uploaded size = ${uploadedSize} bytes, MD5 = ${uploadedMd5}`);
    
    // Step 7: Compare
    if (uploadedSize !== downloadSize) {
      console.log(`  ❌ STOP: Upload size mismatch - original ${downloadSize}, uploaded ${uploadedSize}`);
      return { success: false, reason: `Upload size mismatch: ${downloadSize} vs ${uploadedSize}`, slug };
    }
    
    if (uploadedMd5 !== md5) {
      console.log(`  ❌ STOP: Upload checksum mismatch`);
      return { success: false, reason: `MD5 mismatch: ${md5} vs ${uploadedMd5}`, slug };
    }
    
    console.log(`  ✅ VERIFIED: byte-for-byte identical`);
    
    // Step 8: Get public URL and update database
    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(storagePath);
    
    const { data: productRow } = await supabase.from('products').select('id').eq('slug', slug).single();
    if (productRow) {
      await supabase.from('product_images').upsert({
        product_id: productRow.id,
        storage_bucket: 'product-images',
        storage_path: storagePath,
        url: urlData.publicUrl,
        alt: slug.replace(/-/g, ' '),
        position: 0,
        is_primary: true
      }, { onConflict: 'product_id' });
    }
    
    // Cleanup temp file
    fs.unlinkSync(tmpPath);
    
    return { success: true, slug, originalSize: downloadSize, uploadedSize, md5 };
    
  } catch (err) {
    console.log(`  ❌ STOP: Error - ${err.message}`);
    return { success: false, reason: err.message, slug };
  }
}

async function main() {
  console.log('🔧 Replacing 22 fake images with REAL manufacturer photos');
  console.log('   STRICT VERIFICATION: byte-for-byte match required\n');
  
  const results = [];
  
  for (const product of productsToFix) {
    const result = await processImage(product);
    results.push(result);
    
    // STOP on first failure
    if (!result.success) {
      console.log(`\n🛑 STOPPED: ${result.reason}`);
      console.log('   Remaining images NOT processed.');
      break;
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('RESULTS:');
  console.log('='.repeat(60));
  
  const succeeded = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Verified: ${succeeded.length}`);
  console.log(`❌ Failed: ${failed.length}`);
  
  if (succeeded.length > 0) {
    console.log('\nVerified images:');
    succeeded.forEach(r => console.log(`  ✅ ${r.slug} (${r.originalSize} bytes)`));
  }
  
  if (failed.length > 0) {
    console.log('\nFailed images:');
    failed.forEach(r => console.log(`  ❌ ${r.slug}: ${r.reason}`));
  }
  
  console.log('='.repeat(60));
}

main().catch(console.error);
