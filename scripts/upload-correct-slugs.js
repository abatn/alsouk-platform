const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// CORRECT product slugs from database
const productData = {
  'siele': {
    companyId: 'a1b2c3d4-e5f6-7890-abcd-200000000001',
    products: {
      'panneau-distribution': 'https://siele.com.tn/wp-content/uploads/2024/04/img1.png',
      'coffret-distribution': 'https://siele.com.tn/wp-content/uploads/2024/11/Siele-1-1.png',
      'tableau-distribution': 'https://siele.com.tn/wp-content/uploads/2024/04/129347847_2105735719559765_1618683474702987327_n.jpg',
      'armoire-elec-custom': 'https://siele.com.tn/wp-content/uploads/2024/04/DSC_00161.png',
      'disjoncteur-tableau': 'https://siele.com.tn/wp-content/uploads/2024/04/img1.png',
      'centre-moteur': 'https://siele.com.tn/wp-content/uploads/2024/11/Siele-1-1.png',
      'panneau-facteur-puissance': 'https://siele.com.tn/wp-content/uploads/2024/04/129347847_2105735719559765_1618683474702987327_n.jpg',
      'tableau-industriel': 'https://siele.com.tn/wp-content/uploads/2024/04/DSC_00161.png'
    }
  },
  'ctra': {
    companyId: 'a1b2c3d4-e5f6-7890-abcd-200000000002',
    products: {
      'tuyau-frp': 'https://ctra.com.tn/storage/2025/07/logo-ctra-blanc_bleu.png',
      'equipement-process': 'https://ctra.com.tn/storage/2023/07/consultant-slide-bg.jpg',
      'reservoir-anticorrosion': 'https://ctra.com.tn/storage/2025/08/guill.png',
      'raccords-grp': 'https://ctra.com.tn/storage/2025/07/logo-ctra-blanc_bleu.png',
      'conteneur-chimique': 'https://ctra.com.tn/storage/2023/07/consultant-slide-bg.jpg',
      'vanne-acides': 'https://ctra.com.tn/storage/2025/08/guill.png',
      'reservoir-stockage-frp': 'https://ctra.com.tn/storage/2025/07/logo-ctra-blanc_bleu.png',
      'scrubber-industriel': 'https://ctra.com.tn/storage/2023/07/consultant-slide-bg.jpg'
    }
  },
  'i3c-plus': {
    companyId: 'a1b2c3d4-e5f6-7890-abcd-200000000003',
    products: {
      'huile-olive-750ml': 'https://i3cplus.com/img/logo.png',
      'dattes-deglet-nour-250g': 'https://i3cplus.com/img/logo.png',
      'dattes-denoyautees-500g': 'https://i3cplus.com/img/logo.png',
      'huile-olive-250ml': 'https://i3cplus.com/img/logo.png',
      'couscous-bio-1kg': 'https://i3cplus.com/img/logo.png',
      'harissa-traditionnelle': 'https://i3cplus.com/img/logo.png',
      'figues-sechees': 'https://i3cplus.com/img/logo.png',
      'pate-amande': 'https://i3cplus.com/img/logo.png',
      'eau-fleur-oranger': 'https://i3cplus.com/img/logo.png',
      'eau-rose': 'https://i3cplus.com/img/logo.png'
    }
  },
  'paf-tubet': {
    companyId: 'a1b2c3d4-e5f6-7890-abcd-200000000004',
    products: {
      'tube-acier-erw': 'https://paftube.com/wp-content/uploads/2024/01/logo-paf.png',
      'tube-etreint-froid': 'https://paftube.com/wp-content/uploads/2024/01/logo-paf.png',
      'garde-corps-acier': 'https://paftube.com/wp-content/uploads/2024/01/logo-paf.png',
      'decoupe-laser': 'https://paftube.com/wp-content/uploads/2024/01/logo-paf.png',
      'pergola-acier': 'https://paftube.com/wp-content/uploads/2024/01/logo-paf.png',
      'portail-metal': 'https://paftube.com/wp-content/uploads/2024/01/logo-paf.png',
      'tube-inox': 'https://paftube.com/wp-content/uploads/2024/01/logo-paf.png',
      'tube-galvanise': 'https://paftube.com/wp-content/uploads/2024/01/logo-paf.png'
    }
  },
  'sartex-group': {
    companyId: 'a1b2c3d4-e5f6-7890-abcd-200000000005',
    products: {
      'jean-denim': 'https://sartexgroup.com/wp-content/uploads/2018/07/logo-sartex.png',
      'pantalon-chino': 'https://sartexgroup.com/wp-content/uploads/2018/07/logo-sartex.png',
      'pantalon-cargo': 'https://sartexgroup.com/wp-content/uploads/2018/07/logo-sartex.png',
      'veste-denim': 'https://sartexgroup.com/wp-content/uploads/2018/07/logo-sartex.png',
      'sweat-capuche': 'https://sartexgroup.com/wp-content/uploads/2018/07/logo-sartex.png',
      'tshirt-basique': 'https://sartexgroup.com/wp-content/uploads/2018/07/logo-sartex.png',
      'combinaison-travail': 'https://sartexgroup.com/wp-content/uploads/2018/07/logo-sartex.png',
      'short-denim': 'https://sartexgroup.com/wp-content/uploads/2018/07/logo-sartex.png'
    }
  }
};

async function upload(supplier, slug, url) {
  const companyId = productData[supplier].companyId;
  const path = `${companyId}/${slug}.jpg`;
  
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) return { ok: false, reason: `HTTP ${res.status}` };
    
    const buf = Buffer.from(await res.arrayBuffer());
    const { error } = await supabase.storage.from('product-images').upload(path, buf, {
      contentType: res.headers.get('content-type') || 'image/jpeg',
      upsert: true
    });
    if (error) return { ok: false, reason: error.message };
    
    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(path);
    
    const { data: product } = await supabase.from('products').select('id').eq('slug', slug).single();
    if (!product) return { ok: false, reason: 'Not in DB' };
    
    const { error: insErr } = await supabase.from('product_images').insert({
      product_id: product.id, storage_bucket: 'product-images', storage_path: path,
      url: urlData.publicUrl, alt: slug.replace(/-/g, ' '), position: 0, is_primary: true
    });
    if (insErr) return { ok: false, reason: insErr.message };
    
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: e.message };
  }
}

async function main() {
  console.log('🚀 Uploading images with correct slugs...\n');
  let ok = 0, fail = 0;
  
  for (const [sup, data] of Object.entries(productData)) {
    console.log(`📦 ${sup}:`);
    for (const [slug, url] of Object.entries(data.products)) {
      const r = await upload(sup, slug, url);
      console.log(`  ${r.ok ? '✅' : '❌'} ${slug}${r.ok ? '' : ' - ' + r.reason}`);
      r.ok ? ok++ : fail++;
    }
  }
  
  console.log(`\n${'='.repeat(40)}`);
  console.log(`✅ Uploaded: ${ok}`);
  console.log(`❌ Failed: ${fail}`);
}

main().catch(console.error);
