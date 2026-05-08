const fs = require('fs');
const path = require('path');

const RAW_README_URL = 'https://raw.githubusercontent.com/ImgEdify/Awesome-GPT4o-Image-Prompts/main/README.md';

async function ingest() {
  console.log('Fetching Awesome GPT-4o Prompts...');
  const response = await fetch(RAW_README_URL);
  const text = await response.text();

  const prompts = [];
  // Split by horizontal rules
  const sections = text.split(/\n---\n/);

  sections.forEach((section) => {
    // Exact markdown pattern matching
    const titleMatch = section.match(/### (.+)\n/);
    const promptMatch = section.match(/- \*\*Prompt Text:\*\* `([\s\S]+?)`/i);
    const imageMatch = section.match(/- \*\*Example Image:\*\* <img src="(.+?)"/i);
    const authorMatch = section.match(/- \*\*Author:\*\* \[(.+?)\]/i);
    
    // Extract description (text between title and first metadata bullet)
    let description = '';
    if (titleMatch) {
      const parts = section.split(titleMatch[0]);
      if (parts[1]) {
        const descParts = parts[1].split('- **');
        description = descParts[0].trim();
      }
    }

    if (titleMatch && promptMatch) {
      prompts.push({
        id: prompts.length + 5000, // Use a high offset or handle ID properly
        title: titleMatch[1].trim().replace(/\*\*/g, ''), // Remove potential bolding
        description: description,
        prompt: promptMatch[1].trim(),
        images: imageMatch ? [imageMatch[1]] : [],
        author: authorMatch ? authorMatch[1] : 'Unknown',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        language: detectLanguage(promptMatch[1]),
        category: inferCategory(titleMatch[1] + ' ' + description)
      });
    }
  });

  const outputPath = path.join(__dirname, '..', 'src', 'data', 'awesome_prompts.json');
  fs.writeFileSync(outputPath, JSON.stringify(prompts, null, 2));
  console.log(`Successfully ingested ${prompts.length} prompts to ${outputPath}`);
}

function detectLanguage(text) {
  // Simple detection: if it contains Chinese characters, it's 'zh'
  if (/[\u4e00-\u9fa5]/.test(text)) return 'zh';
  // If it contains Japanese characters
  if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) return 'ja';
  return 'en';
}

function inferCategory(text) {
  const categories = [
    'Profile / Avatar', 'Social Media', 'Infographic', 'YouTube', 'Comic', 
    'Marketing', 'E-commerce', 'Game Asset', 'Poster', 'Web Design',
    'Photography', 'Cinematic', 'Anime', 'Illustration', '3D Render',
    'Pixel Art', 'Cyberpunk', 'Minimalism', 'Portrait', 'Architecture'
  ];
  
  for (const cat of categories) {
    if (text.toLowerCase().includes(cat.toLowerCase())) return cat;
  }
  return 'General';
}

ingest().catch(console.error);
