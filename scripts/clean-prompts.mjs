import fs from 'fs/promises';

const PROMPTS_FILE = './src/data/prompts.json';

async function main() {
  const data = JSON.parse(await fs.readFile(PROMPTS_FILE, 'utf-8'));
  let count = 0;

  data.forEach(p => {
    // Check if title or prompt is JSON
    if (p.title.startsWith('{') || p.prompt.startsWith('{')) {
      try {
        const json = JSON.parse(p.prompt.startsWith('{') ? p.prompt : p.title);
        
        // Extract meaningful content
        let newTitle = '';
        let newPrompt = '';

        // Strategy for different JSON structures
        if (json.image_request) {
          newTitle = json.image_request.goal || json.image_request.meta?.image_type || p.title;
          newPrompt = json.image_request.creative_style || json.image_request.goal || p.prompt;
        } else if (json.prompt_type) {
          newTitle = json.prompt_type;
          newPrompt = json.subject_details?.main_subject || p.prompt;
        } else if (json.PROMPT) {
          newPrompt = json.PROMPT;
          newTitle = p.title.startsWith('{') ? (json.PROMPT.slice(0, 50) + '...') : p.title;
        } else if (json.prompt) {
          newPrompt = typeof json.prompt === 'string' ? json.prompt : (json.prompt.scene?.location || p.prompt);
          newTitle = p.title.startsWith('{') ? (newPrompt.slice(0, 50) + '...') : p.title;
        } else if (json.description) {
          newPrompt = json.description;
          newTitle = p.title.startsWith('{') ? (json.description.slice(0, 50) + '...') : p.title;
        }

        if (newTitle && newTitle.startsWith('{')) {
            // If still starts with {, try harder
            newTitle = p.category + " Concept " + p.id;
        }

        if (newTitle) p.title = newTitle.replace(/\n/g, ' ').trim();
        if (newPrompt) p.prompt = newPrompt.trim();
        
        count++;
      } catch (err) {
        // Not valid JSON or parsing failed, skip
      }
    }
    
    // Also clean up titles that have "Copyby @author" or similar artifacts
    if (p.title.includes('Copyby')) {
        p.title = p.title.split('Copyby')[0].trim();
    }
  });

  await fs.writeFile(PROMPTS_FILE, JSON.stringify(data, null, 2));
  console.log(`Cleaned ${count} prompts with JSON or metadata artifacts.`);
}

main().catch(console.error);
