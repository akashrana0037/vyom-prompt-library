import fs from 'fs/promises';
import path from 'path';

const REMOTE_URL = 'https://newbananaprompts.com/prompts.json';
const OUTPUT_FILE = './src/data/prompts.json';
const LOCAL_FILE = './src/data/prompts.json';

function inferCategory(tags, title, prompt) {
  if (!tags || tags.length === 0) {
    // Fallback to text-based inference
    const text = `${title} ${prompt}`.toLowerCase();
    const categories = [
      'Profile / Avatar', 'Social Media', 'Infographic', 'YouTube', 'Comic',
      'Marketing', 'E-commerce', 'Game Asset', 'Poster', 'Web Design',
      'Photography', 'Cinematic', 'Anime', 'Illustration', '3D Render',
      'Pixel Art', 'Cyberpunk', 'Minimalism', 'Portrait'
    ];
    for (const cat of categories) {
      if (text.includes(cat.toLowerCase())) return cat;
    }
    return 'General';
  }

  // Map tags to categories
  const tagStr = tags.join(' ').toLowerCase();
  if (tagStr.includes('portrait') || tagStr.includes('face')) return 'Portrait';
  if (tagStr.includes('anime') || tagStr.includes('manga')) return 'Anime';
  if (tagStr.includes('3d') || tagStr.includes('render')) return '3D Render';
  if (tagStr.includes('pixel')) return 'Pixel Art';
  if (tagStr.includes('cyberpunk') || tagStr.includes('sci-fi')) return 'Cyberpunk';
  if (tagStr.includes('photography') || tagStr.includes('photo')) return 'Photography';
  if (tagStr.includes('cinematic') || tagStr.includes('film')) return 'Cinematic';
  if (tagStr.includes('illustration') || tagStr.includes('drawing')) return 'Illustration';
  if (tagStr.includes('poster') || tagStr.includes('print')) return 'Poster';
  if (tagStr.includes('game') || tagStr.includes('asset')) return 'Game Asset';
  if (tagStr.includes('social') || tagStr.includes('instagram')) return 'Social Media';
  if (tagStr.includes('comic') || tagStr.includes('cartoon')) return 'Comic';
  if (tagStr.includes('minimalist') || tagStr.includes('minimal')) return 'Minimalism';
  if (tagStr.includes('logo') || tagStr.includes('brand')) return 'Marketing';
  if (tagStr.includes('product') || tagStr.includes('e-commerce')) return 'E-commerce';
  if (tagStr.includes('landscape') || tagStr.includes('nature')) return 'Landscape';
  if (tagStr.includes('vibrant') || tagStr.includes('colorful')) return 'Vibrant Art';
  if (tagStr.includes('fashion') || tagStr.includes('style')) return 'Fashion';
  if (tagStr.includes('food') || tagStr.includes('cuisine')) return 'Food & Drink';
  if (tagStr.includes('architecture') || tagStr.includes('interior')) return 'Architecture';
  if (tagStr.includes('abstract')) return 'Abstract';
  if (tagStr.includes('cute') || tagStr.includes('kawaii')) return 'Cute / Kawaii';
  if (tagStr.includes('horror') || tagStr.includes('dark')) return 'Dark Art';
  if (tagStr.includes('vintage') || tagStr.includes('retro')) return 'Vintage';
  if (tagStr.includes('realistic')) return 'Realistic';
  if (tagStr.includes('fantasy')) return 'Fantasy';
  if (tagStr.includes('sticker')) return 'Sticker';

  // Use first tag as category if nothing else matches
  return tags[0] || 'General';
}

function mapRemotePrompt(doc, index) {
  return {
    id: 10000 + index,
    title: doc.title || 'Untitled Prompt',
    description: doc.notes || '',
    prompt: doc.prompt || '',
    images: [doc.image, doc.originalImageUrl].filter(Boolean),
    author: doc.creatorName || 'Unknown',
    date: '',
    category: inferCategory(doc.tags, doc.title || '', doc.prompt || ''),
    model: doc.model || 'Unknown',
    isPremium: doc.isPremium || false,
    layout: doc.layout || 'square'
  };
}

async function main() {
  console.log('=== VYOM PROMPT STUDIO SYNC ===');
  console.log('');

  // Step 1: Load existing local prompts
  let localPrompts = [];
  try {
    const localData = await fs.readFile(LOCAL_FILE, 'utf-8');
    localPrompts = JSON.parse(localData);
    console.log(`[LOCAL] Found ${localPrompts.length} existing prompts.`);
  } catch {
    console.log('[LOCAL] No existing prompts found. Starting fresh.');
  }

  // Step 2: Fetch remote prompts
  console.log(`[REMOTE] Fetching from ${REMOTE_URL}...`);
  const response = await fetch(REMOTE_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
  }

  const remoteData = await response.json();
  console.log(`[REMOTE] Fetched ${remoteData.length} prompts.`);

  // Step 3: Map remote prompts to our schema
  const mappedRemote = remoteData.map((doc, i) => mapRemotePrompt(doc, i));
  console.log(`[MAP] Mapped ${mappedRemote.length} remote prompts.`);

  // Step 4: De-duplicate by title similarity
  const localTitles = new Set(localPrompts.map(p => p.title.toLowerCase().trim()));
  const uniqueRemote = mappedRemote.filter(p => !localTitles.has(p.title.toLowerCase().trim()));
  console.log(`[DEDUP] ${mappedRemote.length - uniqueRemote.length} duplicates removed.`);

  // Step 5: Merge
  const mergedPrompts = [...localPrompts, ...uniqueRemote];

  // Re-index IDs
  mergedPrompts.forEach((p, i) => { p.id = i + 1; });

  console.log(`[MERGE] Total: ${mergedPrompts.length} prompts.`);

  // Step 6: Analyze categories
  const catCounts = {};
  mergedPrompts.forEach(p => {
    catCounts[p.category] = (catCounts[p.category] || 0) + 1;
  });
  console.log('[CATEGORIES]');
  Object.entries(catCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });

  // Step 7: Backup & write
  try {
    await fs.access(OUTPUT_FILE);
    await fs.copyFile(OUTPUT_FILE, `${OUTPUT_FILE}.bak`);
    console.log('[BACKUP] Created prompts.json.bak');
  } catch {
    // No backup needed
  }

  await fs.writeFile(OUTPUT_FILE, JSON.stringify(mergedPrompts, null, 2));
  console.log(`[DONE] Written ${mergedPrompts.length} prompts to ${OUTPUT_FILE}`);

  // File size check
  const stats = await fs.stat(OUTPUT_FILE);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
  console.log(`[SIZE] File size: ${sizeMB} MB`);
}

main().catch(err => {
  console.error('[ERROR]', err);
  process.exit(1);
});
