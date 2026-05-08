/**
 * Cleanup script — removes broken/low-quality prompts from prompts.json
 * 
 * Removes:
 * 1. Prompts with placeholder images (/placeholder.png)
 * 2. Prompts with local generated images (/generated-images/...) that don't exist
 * 3. Prompts with very short text (<50 chars) that are just titles or links, not real prompts
 * 4. Duplicate prompts (keeps the first occurrence)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataPath = join(__dirname, '..', 'src', 'data', 'prompts.json');
const publicDir = join(__dirname, '..', 'public');

const prompts = JSON.parse(readFileSync(dataPath, 'utf-8'));
console.log(`Starting with ${prompts.length} prompts\n`);

let removedPlaceholder = 0;
let removedBrokenLocal = 0;
let removedShort = 0;
let removedDuplicates = 0;

// Step 1: Remove placeholder images
let cleaned = prompts.filter(p => {
  if (p.images[0] === '/placeholder.png') {
    removedPlaceholder++;
    return false;
  }
  return true;
});

// Step 2: Remove prompts with local images that don't exist on disk
cleaned = cleaned.filter(p => {
  const img = p.images[0];
  if (img && img.startsWith('/') && !img.startsWith('http')) {
    const localPath = join(publicDir, img);
    if (!existsSync(localPath)) {
      removedBrokenLocal++;
      return false;
    }
  }
  return true;
});

// Step 3: Remove prompts with very short text that aren't real prompts
// (just titles, hashtags, or bare links)
cleaned = cleaned.filter(p => {
  const text = p.prompt.trim();
  if (text.length < 50) {
    // Check if it's just a URL, hashtag, or sref code
    const isJunk = /^(#\w|--sref|niji\s|https?:\/\/|midjourney)/i.test(text) 
      || text.split(/\s+/).length < 5;
    if (isJunk) {
      removedShort++;
      return false;
    }
  }
  return true;
});

// Step 4: Remove duplicates (by normalized prompt text)
const seen = new Map();
cleaned = cleaned.filter(p => {
  const key = p.prompt.trim().toLowerCase().slice(0, 200);
  if (seen.has(key)) {
    removedDuplicates++;
    return false;
  }
  seen.set(key, true);
  return true;
});

// Step 5: Re-index IDs sequentially for cleanliness
cleaned = cleaned.map((p, i) => ({
  ...p,
  id: p.id  // keep original IDs for URL stability
}));

console.log(`Removed:`);
console.log(`  Placeholder images: ${removedPlaceholder}`);
console.log(`  Broken local images: ${removedBrokenLocal}`);
console.log(`  Junk/short prompts: ${removedShort}`);
console.log(`  Duplicates: ${removedDuplicates}`);
console.log(`  Total removed: ${removedPlaceholder + removedBrokenLocal + removedShort + removedDuplicates}`);
console.log(`\nFinal count: ${cleaned.length} prompts`);

// Verify categories
const cats = {};
cleaned.forEach(p => { cats[p.category] = (cats[p.category] || 0) + 1; });
console.log(`\nCategory distribution:`);
Object.entries(cats).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${k}: ${v}`));

writeFileSync(dataPath, JSON.stringify(cleaned, null, 2), 'utf-8');
console.log(`\n✅ Saved cleaned prompts.json`);
