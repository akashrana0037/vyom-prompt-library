import fs from 'fs/promises';
import path from 'path';

const REMOTE_URL = 'https://newbananaprompts.com/prompts.json';
const OUTPUT_FILE = './src/data/prompts.json';
const LOCAL_FILE = './src/data/prompts.json';

function inferCategory(tags, title, prompt) {
  const text = `${title} ${prompt} ${(tags || []).join(' ')}`.toLowerCase();
  
  const CATEGORY_MAP = [
    { name: 'UI Mockup', keywords: ['ui', 'ux', 'mockup', 'landing page', 'app design', 'dashboard', 'website', 'interface', 'figma', 'screen'] },
    { name: 'E-commerce', keywords: ['product', 'e-commerce', 'skincare', 'bottle', 'perfume', 'cosmetic', 'commercial', 'marketing', 'advertising', 'shampoo', 'jewelry'] },
    { name: 'Anime', keywords: ['anime', 'manga', 'kawaii', 'japanese style', '2d', 'studioghibli', 'naruto', 'one piece', 'genshin'] },
    { name: 'Photography', keywords: ['photography', 'photo', 'photorealistic', 'portrait', 'dslr', 'nikon', 'canon', 'bokeh', 'street photography', 'candid', 'shot on', '35mm', '85mm'] },
    { name: '3D Render', keywords: ['3d', 'render', 'unreal engine', 'octane', 'blender', 'c4d', 'zbrush', 'isometric', 'vray'] },
    { name: 'Cyberpunk', keywords: ['cyberpunk', 'futuristic', 'neon', 'sci-fi', 'robotic', 'android', 'cyborg', 'high-tech'] },
    { name: 'Landscape', keywords: ['landscape', 'nature', 'mountain', 'forest', 'ocean', 'outdoor', 'scenery', 'sunset', 'night sky'] },
    { name: 'Poster', keywords: ['poster', 'editorial', 'magazine', 'cover', 'graphic design', 'layout', 'typography', 'branding'] },
    { name: 'Character Design', keywords: ['character', 'avatar', 'profile', 'game asset', 'concept art', 'npc', 'warrior', 'mage'] },
    { name: 'Illustration', keywords: ['illustration', 'drawing', 'sketch', 'painting', 'watercolor', 'oil painting', 'minimalist', 'line art'] },
    { name: 'Pixel Art', keywords: ['pixel', '8-bit', '16-bit', 'retro game'] },
    { name: 'Architecture', keywords: ['architecture', 'interior', 'living room', 'building', 'facade', 'structural'] },
    { name: 'Food & Drink', keywords: ['food', 'drink', 'cuisine', 'restaurant', 'coffee', 'juice', 'cocktail', 'delicious'] },
  ];

  let bestMatch = null;
  let maxKeywords = 0;

  for (const cat of CATEGORY_MAP) {
    const matchCount = cat.keywords.filter(k => text.includes(k)).length;
    if (matchCount > maxKeywords) {
      maxKeywords = matchCount;
      bestMatch = cat.name;
    }
  }

  return bestMatch || 'Photography';
}

function cleanJsonContent(title, prompt) {
  let cleanedTitle = title;
  let cleanedPrompt = prompt;

  if (title.startsWith('{') || prompt.startsWith('{')) {
    try {
      const json = JSON.parse(prompt.startsWith('{') ? prompt : title);
      
      if (json.image_request) {
        cleanedTitle = json.image_request.goal || json.image_request.meta?.image_type || title;
        cleanedPrompt = json.image_request.creative_style || json.image_request.goal || prompt;
      } else if (json.prompt_type) {
        cleanedTitle = json.prompt_type;
        cleanedPrompt = json.subject_details?.main_subject || prompt;
      } else if (json.PROMPT) {
        cleanedPrompt = json.PROMPT;
        cleanedTitle = title.startsWith('{') ? (json.PROMPT.slice(0, 50) + '...') : title;
      } else if (json.prompt) {
        cleanedPrompt = typeof json.prompt === 'string' ? json.prompt : (json.prompt.scene?.location || prompt);
        cleanedTitle = title.startsWith('{') ? (cleanedPrompt.slice(0, 50) + '...') : title;
      }
    } catch (e) {
      // Not valid JSON
    }
  }

  // Final cleanup for metadata artifacts
  if (cleanedTitle.includes('Copyby')) {
    cleanedTitle = cleanedTitle.split('Copyby')[0].trim();
  }

  return { 
    title: cleanedTitle.replace(/\n/g, ' ').trim(), 
    prompt: cleanedPrompt.trim() 
  };
}

function mapRemotePrompt(doc, index) {
  const { title, prompt } = cleanJsonContent(doc.title || 'Untitled Prompt', doc.prompt || '');
  
  return {
    id: 10000 + index,
    title,
    description: doc.notes || '',
    prompt,
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

  // Step 4: De-duplicate by prompt text similarity and cleanup images
  const localPromptTexts = new Set(localPrompts.map(p => p.prompt.trim().toLowerCase()));
  const uniqueRemote = [];
  
  for (const p of mappedRemote) {
    // Cleanup internal image duplicates
    p.images = [...new Set(p.images)];
    
    const normalized = p.prompt.trim().toLowerCase();
    if (!localPromptTexts.has(normalized)) {
      uniqueRemote.push(p);
      localPromptTexts.add(normalized);
    }
  }
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
