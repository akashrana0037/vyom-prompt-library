import fs from 'fs/promises';
import path from 'path';

const PROMPTS_FILE = './src/data/prompts.json';

async function checkUrl(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(url, { method: 'HEAD', signal: controller.signal });
    clearTimeout(timeout);
    return response.ok;
  } catch (err) {
    return false;
  }
}

async function main() {
  const data = JSON.parse(await fs.readFile(PROMPTS_FILE, 'utf-8'));
  console.log(`Auditing ${data.length} prompts...`);

  const broken = [];
  const noImages = [];
  
  // To avoid hitting rate limits or taking too long, we check in batches
  const BATCH_SIZE = 200;
  const LIMIT = data.length; 
  
  const targetData = data.slice(0, LIMIT);

  for (let i = 0; i < targetData.length; i += BATCH_SIZE) {
    const batch = targetData.slice(i, i + BATCH_SIZE);
    console.log(`Checking batch ${i / BATCH_SIZE + 1}...`);
    
    await Promise.all(batch.map(async (p) => {
      if (!p.images || p.images.length === 0) {
        noImages.push(p.id);
      } else {
        const results = await Promise.all(p.images.map(img => img.startsWith('http') ? checkUrl(img) : Promise.resolve(true)));
        const allBroken = results.every(res => res === false);
        if (allBroken) {
          broken.push(p.id);
        }
      }
    }));
  }

  console.log('\n=== AUDIT RESULTS ===');
  console.log(`Total Prompts Checked: ${targetData.length}`);
  console.log(`Prompts with No Images: ${noImages.length}`);
  console.log(`Prompts with Broken Images: ${broken.length}`);
  
  if (noImages.length > 0) console.log('IDs with No Images:', noImages);
  if (broken.length > 0) console.log('IDs with Broken Images:', broken);
}

main().catch(console.error);
