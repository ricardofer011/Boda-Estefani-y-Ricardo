const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const sealPath = path.join(process.cwd(), 'public', 'images', 'wax-seal.png');
const outDir = path.join(process.cwd(), 'public', 'images');

async function generateOgImages() {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // 1. WhatsApp 800x800 square OG image
  // Canvas: 800x800 #FAF7F2 (solid background for WhatsApp)
  const sealSquare = await sharp(sealPath)
    .resize(600, 600, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const bgSquareSvg = `<svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#FAF7F2"/>
    <rect x="28" y="28" width="744" height="744" rx="24" fill="none" stroke="#DFC088" stroke-width="2" stroke-opacity="0.45"/>
    <rect x="36" y="36" width="728" height="728" rx="18" fill="none" stroke="#DFC088" stroke-width="1" stroke-opacity="0.25"/>
  </svg>`;

  const ogSquareJpg = await sharp(Buffer.from(bgSquareSvg))
    .composite([{ input: sealSquare, gravity: 'center' }])
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(path.join(outDir, 'og-seal.jpg'));

  console.log('Created og-seal.jpg:', ogSquareJpg);

  const ogSquarePng = await sharp(Buffer.from(bgSquareSvg))
    .composite([{ input: sealSquare, gravity: 'center' }])
    .png({ quality: 90 })
    .toFile(path.join(outDir, 'og-seal.png'));

  console.log('Created og-seal.png:', ogSquarePng);

  // 2. Landscape 1200x630 OG banner
  const sealBanner = await sharp(sealPath)
    .resize(500, 500, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const bgBannerSvg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#FAF7F2"/>
    <rect x="28" y="28" width="1144" height="574" rx="20" fill="none" stroke="#DFC088" stroke-width="2" stroke-opacity="0.45"/>
    <rect x="36" y="36" width="1128" height="558" rx="16" fill="none" stroke="#DFC088" stroke-width="1" stroke-opacity="0.25"/>
  </svg>`;

  const ogBannerJpg = await sharp(Buffer.from(bgBannerSvg))
    .composite([{ input: sealBanner, gravity: 'center' }])
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(path.join(outDir, 'og-banner.jpg'));

  console.log('Created og-banner.jpg:', ogBannerJpg);

  // 3. Apple Touch Icon & Favicon
  const appleIcon = await sharp(sealPath)
    .resize(180, 180, { fit: 'contain', background: { r: 250, g: 247, b: 242, alpha: 1 } })
    .png()
    .toFile(path.join(process.cwd(), 'public', 'apple-touch-icon.png'));

  console.log('Created apple-touch-icon.png:', appleIcon);
}

generateOgImages().catch(err => {
  console.error(err);
  process.exit(1);
});
