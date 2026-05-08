import fs from 'fs/promises';

const PROMPTS_FILE = './src/data/prompts.json';

async function main() {
  const data = JSON.parse(await fs.readFile(PROMPTS_FILE, 'utf-8'));
  console.log(`Initial count: ${data.length}`);

  const seenPrompts = new Map(); // promptText -> promptObject
  const uniqueData = [];
  let internalDupImagesRemoved = 0;

  for (const p of data) {
    // 1. Remove duplicate images within the same prompt
    const originalImageCount = p.images.length;
    p.images = [...new Set(p.images)];
    internalDupImagesRemoved += (originalImageCount - p.images.length);

    // 2. Normalize prompt text for comparison
    const normalizedPrompt = p.prompt.trim().toLowerCase();
    
    if (seenPrompts.has(normalizedPrompt)) {
      const existing = seenPrompts.get(normalizedPrompt);
      // If the current one has more images, maybe it's better?
      // But usually, they are just identical. 
      // We'll just skip the duplicate.
      continue;
    }

    seenPrompts.set(normalizedPrompt, p);
    uniqueData.push(p);
  }

  // Re-index IDs
  uniqueData.forEach((p, i) => { p.id = i + 1; });

  await fs.writeFile(PROMPTS_FILE, JSON.stringify(uniqueData, null, 2));
  
  console.log(`Final count: ${uniqueData.length}`);
  console.log(`Removed ${data.length - uniqueData.length} duplicate prompts.`);
  console.log(`Removed ${internalDupImagesRemoved} internal duplicate image URLs.`);
}

main().catch(console.error);
