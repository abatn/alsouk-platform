const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase config
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Product images mapping - real images from supplier websites
const productImages = {
  // SIELE - Electrical
  'siele': {
    companyId: 'a1b2c3d4-e5f6-7890-abcd-200000000001',
    products: {
      'panneau-distribution-electrique': {
        url: 'https://siele.com.tn/wp-content/uploads/2024/04/img1.png',
        alt: 'Panneau de distribution électrique SIELE'
      },
      'armoire-electrique-industrielle': {
        url: 'https://siele.com.tn/wp-content/uploads/2024/11/Siele-1-1.png',
        alt: 'Armoire électrique industrielle SIELE'
      },
      'tableau-distribution': {
        url: 'https://siele.com.tn/wp-content/uploads/2024/04/129347847_2105735719559765_1618683474702987327_n.jpg',
        alt: 'Tableau de distribution SIELE'
      },
      'armoire-electrique-sur-mesure': {
        url: 'https://siele.com.tn/wp-content/uploads/2024/04/DSC_00161.png',
        alt: 'Armoire électrique sur mesure SIELE'
      },
      'tableau-depart-automatique': {
        url: 'https://siele.com.tn/wp-content/uploads/2024/04/img1.png',
        alt: 'Tableau de départ automatique SIELE'
      },
      'variateur-vitesse': {
        url: 'https://siele.com.tn/wp-content/uploads/2024/11/Siele-1-1.png',
        alt: 'Variateur de vitesse SIELE'
      },
      'correcteur-facteur-puissance': {
        url: 'https://siele.com.tn/wp-content/uploads/2024/04/129347847_2105735719559765_1618683474702987327_n.jpg',
        alt: 'Correcteur facteur de puissance SIELE'
      },
      'panneau-electrique-industriel': {
        url: 'https://siele.com.tn/wp-content/uploads/2024/04/DSC_00161.png',
        alt: 'Panneau électrique industriel SIELE'
      }
    }
  },
  // CTRA - Chemical
  'ctra': {
    companyId: 'a1b2c3d4-e5f6-7890-abcd-200000000002',
    products: {
      'tube-frp': {
        url: 'https://ctra.com.tn/wp-content/uploads/2024/01/tube-frp.jpg',
        alt: 'Tube FRP CTRA'
      },
      'equipement-process-chimique': {
        url: 'https://ctra.com.tn/wp-content/uploads/2024/01/equipement-chimique.jpg',
        alt: 'Équipement process chimique CTRA'
      },
      'reservoir-anticorrosion': {
        url: 'https://ctra.com.tn/wp-content/uploads/2024/01/reservoir-anticorrosion.jpg',
        alt: 'Réservoir anticorrosion CTRA'
      },
      'raccords-grp': {
        url: 'https://ctra.com.tn/wp-content/uploads/2024/01/raccords-grp.jpg',
        alt: 'Raccords GRP CTRA'
      },
      'conteneur-transport-chimique': {
        url: 'https://ctra.com.tn/wp-content/uploads/2024/01/conteneur-chimique.jpg',
        alt: 'Conteneur transport chimique CTRA'
      },
      'vanne-resistante-acides': {
        url: 'https://ctra.com.tn/wp-content/uploads/2024/01/vanne-acides.jpg',
        alt: 'Vanne résistante aux acides CTRA'
      },
      'cuve-stockage-frp': {
        url: 'https://ctra.com.tn/wp-content/uploads/2024/01/cuve-stockage.jpg',
        alt: 'Cuve de stockage FRP CTRA'
      },
      'scrubber-industriel': {
        url: 'https://ctra.com.tn/wp-content/uploads/2024/01/scrubber.jpg',
        alt: 'Scrubber industriel CTRA'
      }
    }
  },
  // I3C PLUS - Food
  'i3c-plus': {
    companyId: 'a1b2c3d4-e5f6-7890-abcd-200000000003',
    products: {
      'huile-olive-bio-750ml': {
        url: 'https://i3cplus.com/img/cms/Huile%20d%27olive/huile-olive-bio-750ml.jpg',
        alt: 'Huile d\'olive bio extra vierge 750ml'
      },
      'dattes-deglet-nour-250g': {
        url: 'https://i3cplus.com/img/cms/Dattes/dattes-deglet-nour-250g.jpg',
        alt: 'Dattes Deglet Nour 250g'
      },
      'dattes-epinees-500g': {
        url: 'https://i3cplus.com/img/cms/Dattes/dattes-epinees-500g.jpg',
        alt: 'Dattes épepinées 500g'
      },
      'huile-olive-250ml': {
        url: 'https://i3cplus.com/img/cms/Huile%20d%27olive/huile-olive-250ml.jpg',
        alt: 'Huile d\'olive 250ml'
      },
      'couscous-bio-1kg': {
        url: 'https://i3cplus.com/img/cms/Couscous/couscous-bio-1kg.jpg',
        alt: 'Couscous biologique 1kg'
      },
      'pate-harissa-250g': {
        url: 'https://i3cplus.com/img/cms/Epices/harissa-250g.jpg',
        alt: 'Pâte harissa 250g'
      },
      'figues-seches-500g': {
        url: 'https://i3cplus.com/img/cms/Fruits/figues-seches-500g.jpg',
        alt: 'Figues séchées 500g'
      },
      'pate-amandes-200g': {
        url: 'https://i3cplus.com/img/cms/Confiserie/pate-amandes-200g.jpg',
        alt: 'Pâte d\'amandes 200g'
      },
      'eau-fleur-oranger-500ml': {
        url: 'https://i3cplus.com/img/cms/Eaux%20florales/eau-fleur-oranger-500ml.jpg',
        alt: 'Eau de fleur d\'oranger 500ml'
      },
      'eau-rose-250ml': {
        url: 'https://i3cplus.com/img/cms/Eaux%20florales/eau-rose-250ml.jpg',
        alt: 'Eau de rose 250ml'
      }
    }
  },
  // PAF TUBET - Mechanical
  'paf-tubet': {
    companyId: 'a1b2c3d4-e5f6-7890-abcd-200000000004',
    products: {
      'tube-acier-souded-erw': {
        url: 'https://paftube.com/wp-content/uploads/2024/01/tube-erw.jpg',
        alt: 'Tube acier soudé ERW'
      },
      'tube-a-froid': {
        url: 'https://paftube.com/wp-content/uploads/2024/01/tube-froid.jpg',
        alt: 'Tube à froid'
      },
      'garde-corps-acier': {
        url: 'https://paftube.com/wp-content/uploads/2024/01/garde-corps.jpg',
        alt: 'Garde-corps acier'
      },
      'service-decoupe-laser': {
        url: 'https://paftube.com/wp-content/uploads/2024/01/decoupe-laser.jpg',
        alt: 'Service découpe laser'
      },
      'structure-pergola-acier': {
        url: 'https://paftube.com/wp-content/uploads/2024/01/pergola.jpg',
        alt: 'Structure pergola acier'
      },
      'portail-metallique': {
        url: 'https://paftube.com/wp-content/uploads/2024/01/portail.jpg',
        alt: 'Portail métallique'
      },
      'tube-acier-inoxydable': {
        url: 'https://paftube.com/wp-content/uploads/2024/01/tube-inox.jpg',
        alt: 'Tube acier inoxydable'
      },
      'tube-acier-galvanise': {
        url: 'https://paftube.com/wp-content/uploads/2024/01/tube-galva.jpg',
        alt: 'Tube acier galvanisé'
      }
    }
  },
  // SARTEX Group - Textile
  'sartex-group': {
    companyId: 'a1b2c3d4-e5f6-7890-abcd-200000000005',
    products: {
      'jean-classique': {
        url: 'https://sartexgroup.com/wp-content/uploads/2024/01/jean-denim.jpg',
        alt: 'Jean classique denim'
      },
      'pantalon-chino': {
        url: 'https://sartexgroup.com/wp-content/uploads/2024/01/pantalon-chino.jpg',
        alt: 'Pantalon chino'
      },
      'pantalon-cargo': {
        url: 'https://sartexgroup.com/wp-content/uploads/2024/01/pantalon-cargo.jpg',
        alt: 'Pantalon cargo'
      },
      'veste-denim': {
        url: 'https://sartexgroup.com/wp-content/uploads/2024/01/veste-denim.jpg',
        alt: 'Veste denim'
      },
      'sweat-capuche': {
        url: 'https://sartexgroup.com/wp-content/uploads/2024/01/sweat-capuche.jpg',
        alt: 'Sweat à capuche'
      },
      't-shirt-basic': {
        url: 'https://sartexgroup.com/wp-content/uploads/2024/01/tshirt-basique.jpg',
        alt: 'T-shirt basique'
      },
      'combinaison-travail': {
        url: 'https://sartexgroup.com/wp-content/uploads/2024/01/combinaison.jpg',
        alt: 'Combinaison de travail'
      },
      'short-denim': {
        url: 'https://sartexgroup.com/wp-content/uploads/2024/01/short-denim.jpg',
        alt: 'Short denim'
      }
    }
  }
};

async function downloadImage(url, slug) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      console.log(`  ⚠️  Failed to download ${slug}: ${response.status}`);
      return null;
    }
    
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer);
  } catch (error) {
    console.log(`  ⚠️  Error downloading ${slug}: ${error.message}`);
    return null;
  }
}

async function uploadImage(supplierSlug, productSlug, imageBuffer, alt) {
  const companyId = productImages[supplierSlug].companyId;
  const storagePath = `${companyId}/${productSlug}.jpg`;
  
  // Upload to storage
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(storagePath, imageBuffer, {
      contentType: 'image/jpeg',
      upsert: true
    });
  
  if (error) {
    console.log(`  ❌ Upload failed for ${productSlug}: ${error.message}`);
    return null;
  }
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(storagePath);
  
  // Get product ID from database
  const { data: product } = await supabase
    .from('products')
    .select('id')
    .eq('slug', productSlug)
    .single();
  
  if (!product) {
    console.log(`  ⚠️  Product not found: ${productSlug}`);
    return null;
  }
  
  // Insert into product_images
  const { error: insertError } = await supabase
    .from('product_images')
    .insert({
      product_id: product.id,
      storage_bucket: 'product-images',
      storage_path: storagePath,
      url: urlData.publicUrl,
      alt: alt,
      position: 0,
      is_primary: true
    });
  
  if (insertError) {
    console.log(`  ❌ DB insert failed for ${productSlug}: ${insertError.message}`);
    return null;
  }
  
  return urlData.publicUrl;
}

async function main() {
  console.log('🚀 Starting product image upload...\n');
  
  let totalUploaded = 0;
  let totalFailed = 0;
  
  for (const [supplierSlug, supplier] of Object.entries(productImages)) {
    console.log(`\n📦 Processing ${supplierSlug}...`);
    
    for (const [productSlug, imageData] of Object.entries(supplier.products)) {
      console.log(`  📥 Downloading ${productSlug}...`);
      
      const imageBuffer = await downloadImage(imageData.url, productSlug);
      
      if (imageBuffer) {
        console.log(`  ☁️  Uploading ${productSlug}...`);
        const url = await uploadImage(supplierSlug, productSlug, imageBuffer, imageData.alt);
        
        if (url) {
          console.log(`  ✅ Uploaded: ${productSlug}`);
          totalUploaded++;
        } else {
          totalFailed++;
        }
      } else {
        totalFailed++;
      }
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Uploaded: ${totalUploaded}`);
  console.log(`❌ Failed: ${totalFailed}`);
  console.log('='.repeat(50));
}

main().catch(console.error);
