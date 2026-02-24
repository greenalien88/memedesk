import sharp from 'sharp';
import { readdirSync } from 'fs';
import { join } from 'path';

const articlesDir = join(import.meta.dirname, '../public/images/articles');
const ogDir = join(import.meta.dirname, '../public/images/og');

import { mkdirSync } from 'fs';
mkdirSync(ogDir, { recursive: true });

for (const file of readdirSync(articlesDir)) {
  if (!file.endsWith('.webp')) continue;
  const slug = file.replace('.webp', '');
  const input = join(articlesDir, file);
  const output = join(ogDir, `${slug}-og.webp`);
  
  const img = sharp(input);
  const meta = await img.metadata();
  
  // Crop center to 1.91:1 ratio then resize to 1200x630
  const targetRatio = 1200 / 630;
  const srcRatio = meta.width / meta.height;
  
  let cropW, cropH, left, top;
  if (srcRatio > targetRatio) {
    cropH = meta.height;
    cropW = Math.round(meta.height * targetRatio);
    left = Math.round((meta.width - cropW) / 2);
    top = 0;
  } else {
    cropW = meta.width;
    cropH = Math.round(meta.width / targetRatio);
    left = 0;
    top = Math.round((meta.height - cropH) / 2);
  }
  
  await sharp(input)
    .extract({ left, top, width: cropW, height: cropH })
    .resize(1200, 630)
    .webp({ quality: 85 })
    .toFile(output);
  
  console.log(`✅ ${slug}-og.webp`);
}
