import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INPUT_DIR = path.join(__dirname, 'upscaled', 'upscayl_png_ultramix-balanced-4x_4x');
const OUTPUT_DIR = path.join(__dirname, 'frames-webp');

if (!existsSync(OUTPUT_DIR)) await mkdir(OUTPUT_DIR, { recursive: true });

const files = (await readdir(INPUT_DIR))
  .filter(f => f.endsWith('.png'))
  .sort();

console.log(`Converting ${files.length} frames to WebP (quality 90)...`);

let done = 0;
for (const file of files) {
  const input = path.join(INPUT_DIR, file);
  const output = path.join(OUTPUT_DIR, file.replace('.png', '.webp'));
  await sharp(input)
    .webp({ quality: 90, effort: 4 })
    .toFile(output);
  done++;
  process.stdout.write(`\r  [${done}/${files.length}] ${file} → ${path.basename(output)}`);
}

console.log('\n✅ All frames converted to frames-webp/');
