import fs from 'fs/promises';

const PROMPTS_FILE = './src/data/prompts.json';

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

async function main() {
  const data = JSON.parse(await fs.readFile(PROMPTS_FILE, 'utf-8'));
  let changes = 0;
  const newCatCounts = {};

  for (const p of data) {
    const originalCat = p.category;
    const text = `${p.title} ${p.prompt} ${p.category}`.toLowerCase();
    
    let bestMatch = null;
    let maxKeywords = 0;

    for (const cat of CATEGORY_MAP) {
      const matchCount = cat.keywords.filter(k => text.includes(k)).length;
      if (matchCount > maxKeywords) {
        maxKeywords = matchCount;
        bestMatch = cat.name;
      }
    }

    if (bestMatch) {
      p.category = bestMatch;
    } else if (originalCat === 'Portrait') {
        p.category = 'Photography'; // Most Portraits are photography
    } else if (['English', 'Chinese', 'Arabic', 'General'].includes(originalCat)) {
        p.category = 'Photography'; // Default fallback if it's likely a photo
    }

    if (p.category !== originalCat) {
      changes++;
    }

    newCatCounts[p.category] = (newCatCounts[p.category] || 0) + 1;
  }

  await fs.writeFile(PROMPTS_FILE, JSON.stringify(data, null, 2));
  
  console.log(`Recategorized ${changes} prompts.`);
  console.log('New Category Distribution:');
  console.log(JSON.stringify(newCatCounts, null, 2));
}

main().catch(console.error);
