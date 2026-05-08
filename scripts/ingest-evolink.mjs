import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CATEGORIES = [
  'ad-creative.md',
  'character.md',
  'ecommerce.md',
  'photography.md',
  'portrait.md',
  'poster.md',
  'ui.md'
];

const BASE_RAW_URL = 'https://raw.githubusercontent.com/EvoLinkAI/awesome-gpt-image-2-prompts/main/cases/';
const IMAGE_BASE_URL = 'https://raw.githubusercontent.com/EvoLinkAI/awesome-gpt-image-2-prompts/main/images/';
const OUTPUT_FILE = path.join(__dirname, '../src/data/prompts.json');

// Helper to infer category based on title and content
function inferCategory(title, content) {
  const text = `${title} ${content}`.toLowerCase();
  
  if (text.includes('skincare') || text.includes('perfume') || text.includes('cosmetics') || text.includes('bottle')) return 'E-commerce';
  if (text.includes('banner') || text.includes('flyer') || text.includes('ad ') || text.includes('advertisement')) return 'Ad Creative';
  if (text.includes('ui') || text.includes('mockup') || text.includes('interface') || text.includes('app') || text.includes('dashboard')) return 'UI Mockup';
  if (text.includes('poster') || text.includes('illustration') || text.includes('graphic')) return 'Poster';
  if (text.includes('character') || text.includes('mecha') || text.includes('anime')) return 'Character Design';
  if (text.includes('portrait') || text.includes('photography') || text.includes('shot')) return 'Portrait';
  
  return 'General';
}

function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/[\u201C\u201D]/g, '"') // Smart double quotes
    .replace(/[\u2018\u2019]/g, "'") // Smart single quotes
    .replace(/Copyby @.+/g, '') // Remove metadata artifacts
    .trim();
}

async function fetchPrompts() {
  let allNewPrompts = [];
  let globalIndex = 0;

  for (const catFile of CATEGORIES) {
    console.log(`Fetching ${catFile}...`);
    try {
      const response = await fetch(BASE_RAW_URL + catFile);
      const content = await response.text();
      
      // Split by Case header
      const cases = content.split(/### Case \d+:/);
      cases.shift(); // Remove intro text

      for (const caseContent of cases) {
        const titleMatch = caseContent.match(/\[(.+?)\]/);
        const promptMatch = caseContent.match(/\*\*Prompt:\*\*\s*```\s*([\s\S]+?)```/);
        const authorMatch = caseContent.match(/\(by \[@(.+?)\]\)/);
        // Correctly handle relative image paths in subdirectories
        const imageMatches = [...caseContent.matchAll(/<img src="\.?\/?images\/(.+?)\/output\.jpg"/g)];

        if (titleMatch && promptMatch) {
          const title = cleanText(titleMatch[1].trim());
          const rawPrompt = promptMatch[1].trim();
          const prompt = cleanText(rawPrompt);
          const author = authorMatch ? authorMatch[1] : 'EvoLink';
          
          // Detect Arguments & De-duplicate
          const argMatches = [...rawPrompt.matchAll(/\{argument name="(.+?)" default="(.+?)"\}/g)];
          const uniqueArgs = [];
          const seenNames = new Set();
          
          for (const m of argMatches) {
            if (!seenNames.has(m[1])) {
              seenNames.add(m[1]);
              uniqueArgs.push({
                name: m[1],
                default: m[2]
              });
            }
          }

          allNewPrompts.push({
            id: 20000 + globalIndex,
            title,
            description: cleanText(`Curated high-quality prompt for ${title}. Optimized for GPT-Image-2.`),
            prompt,
            images: imageMatches.map(m => `${IMAGE_BASE_URL}${m[1]}/output.jpg`),
            author,
            date: '2026.04.28',
            category: inferCategory(title, prompt),
            model: 'GPT-Image-2',
            arguments: uniqueArgs
          });
          globalIndex++;
        }
      }
    } catch (err) {
      console.error(`Failed to fetch ${catFile}:`, err.message);
    }
  }
  return allNewPrompts;
}

async function main() {
  console.log('=== EVOLINK MULTI-FILE INGESTION ===');
  
  const newPrompts = await fetchPrompts();
  console.log(`Parsed ${newPrompts.length} valid prompts across all categories.`);

  let existing = [];
  try {
    const data = await fs.readFile(OUTPUT_FILE, 'utf8');
    existing = JSON.parse(data).filter(p => p.model !== 'GPT-Image-2');
  } catch (err) {
    console.log('No existing prompts.json found, creating new one.');
  }
  
  const combined = [...existing, ...newPrompts];
  
  // Re-index to ensure IDs are contiguous
  combined.forEach((p, i) => {
    p.id = i + 1;
  });
  
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(combined, null, 2));
  console.log(`Successfully updated ${OUTPUT_FILE} with ${newPrompts.length} EvoLink prompts.`);
}

main().catch(console.error);
