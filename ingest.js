const fs = require('fs');
const path = require('path');

const RAW_README_URL = 'https://raw.githubusercontent.com/YouMind-OpenLab/awesome-nano-banana-pro-prompts/main/README.md';

async function ingest() {
  console.log('Fetching raw README...');
  const response = await fetch(RAW_README_URL);
  const text = await response.text();

  const prompts = [];
  // Split by horizontal rules which separate prompts
  const sections = text.split(/---\s*\n/);

  sections.forEach((section, index) => {
    // Basic extraction logic
    const titleMatch = section.match(/### (?:No\. \d+: )?(.+)\n/i) || section.match(/#### (.+)\n/i);
    const descMatch = section.match(/#### 📖 Description\s*\n\s*\n([\s\S]+?)\n\n/i);
    const promptMatch = section.match(/#### 📝 Prompt\s*\n\s*\n```([\s\S]+?)```/i);
    
    // Extract images
    const imageMatches = [...section.matchAll(/<img src="(.+?)"/g)];
    const images = imageMatches.map(m => m[1]);

    // Extract details
    const authorMatch = section.match(/- \*\*Author:\*\* \[(.+?)\]/i);
    const dateMatch = section.match(/- \*\*Published:\*\* (.+?)\n/i);
    const langMatch = section.match(/- \*\*Languages:\*\* (.+?)\n/i);

    if (titleMatch && promptMatch) {
      prompts.push({
        id: prompts.length + 1,
        title: titleMatch[1].trim(),
        description: descMatch ? descMatch[1].trim() : '',
        prompt: promptMatch[1].trim(),
        images: images,
        author: authorMatch ? authorMatch[1] : 'Unknown',
        date: dateMatch ? dateMatch[1] : '',
        language: langMatch ? langMatch[1] : 'en',
        category: inferCategory(titleMatch[1] + ' ' + (descMatch ? descMatch[1] : ''))
      });
    }
  });

  const outputPath = path.join(__dirname, 'src', 'data', 'prompts.json');
  if (!fs.existsSync(path.dirname(outputPath))) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(prompts, null, 2));
  console.log(`Successfully ingested ${prompts.length} prompts to ${outputPath}`);
}

function inferCategory(text) {
  const categories = [
    'Profile / Avatar', 'Social Media', 'Infographic', 'YouTube', 'Comic', 
    'Marketing', 'E-commerce', 'Game Asset', 'Poster', 'Web Design',
    'Photography', 'Cinematic', 'Anime', 'Illustration', '3D Render',
    'Pixel Art', 'Cyberpunk', 'Minimalism', 'Portrait'
  ];
  
  for (const cat of categories) {
    if (text.toLowerCase().includes(cat.toLowerCase())) return cat;
  }
  return 'General';
}

ingest().catch(console.error);
