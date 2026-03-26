import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ff4757"/>
      <stop offset="100%" style="stop-color:#ff6b81"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="96" fill="url(#bg)"/>
  <text x="256" y="360" font-family="Arial, sans-serif" font-size="320" font-weight="900" fill="white" text-anchor="middle">E</text>
</svg>`;

const sizes = [192, 512];
const outputDir = join(__dirname, '..', 'public', 'icons');

async function generateIcons() {
  for (const size of sizes) {
    const svgBuffer = Buffer.from(svgContent);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(join(outputDir, `icon-${size}.png`));
    console.log(`Generated icon-${size}.png`);
  }
}

generateIcons().catch(console.error);
