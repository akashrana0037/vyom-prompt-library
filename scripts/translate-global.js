const fs = require('fs');
const path = require('path');

const mainPath = path.join(__dirname, '../src/data/prompts.json');
let data = JSON.parse(fs.readFileSync(mainPath, 'utf8'));

const translations = {
  66: {
    title: "Minimalist Style Building",
    description: "A series of minimalist 3D buildings inside an Apple product box, city corner style.",
    prompt: "Create a 3D miniature scene of a city corner with minimalist architecture, including small benches, street lamps, and potted plants. The scene should be housed in a large Apple product box with the Apple logo visible. High detail, urban landscape style, soft lighting, relaxing atmosphere. All text in the image must be in English."
  },
  89: {
    title: "Action Figure - Spiderman",
    description: "A high-quality 3D render of a Spiderman action figure in a premium display box.",
    prompt: "A high-quality 3D render of a Spiderman action figure. The figure is positioned inside a premium, glossy collector's box with clear plastic windows. The box features vibrant comic-style graphics and text. The background is a clean studio setting with soft lighting and professional product photography feel. All text in the image must be in English."
  },
  130: {
    title: "Cyberpunk Cityscape",
    description: "A high-detail cyberpunk city with neon lights and futuristic vehicles.",
    prompt: "A cinematic aerial view of a cyberpunk city at night. Towering skyscrapers with massive neon advertisements, flying vehicles weaving through the fog, and wet streets reflecting the vibrant lights. High contrast, moody atmospheric lighting, 8k resolution. All text in the image must be in English."
  },
  134: {
    title: "Saul Leiter Style - Cinematic Film Contact Sheet",
    description: "A vintage film contact sheet in the style of Saul Leiter, featuring 9 cinematic frames.",
    prompt: "System Prompt Expert: Saul Leiter Style - Cinematic Film Contact Sheet Master. Role: You are a world-class art photographer and darkroom master. Task: Create a highly realistic vintage film contact sheet with 9 frames based on the subject's features. Stylistic Engine: Use Leiter's signature lighting (mixed cold/warm), rainy windows, urban environments (NYC), and oil-painting color philosophy (low saturation with vivid punctum like a red umbrella). Texture: Rough film grain, darkroom flaws (scratches, dust). Layout: Top cinematic hero shot with film markings and handwritten notes; bottom strips with 8 small frames showing details and atmosphere. All text in the image must be in English."
  },
  196: {
    title: "Blackboard Art - Luffy (One Piece)",
    description: "A documentary-style photo of a detailed chalk drawing of Luffy on a classroom blackboard.",
    prompt: "A realistic documentary photo of a large, detailed chalk mural on a standard green classroom blackboard, depicting Monkey D. Luffy from 'One Piece'. Luffy is in a dynamic pose, wearing his signature straw hat, red vest, and a toothy grin. The texture retains the dusty, matte look of chalk with visible hatching and smudges. Environment: A standard Japanese classroom with a wooden podium in the foreground containing chalk boxes and erasers. Soft ambient lighting from top fluorescent lights and side windows. Professional 35mm photography style. All text in the image must be in English."
  },
  197: {
    title: "Aerial Sky Fall",
    description: "An aerial photo blending a person falling from the sky over coordinates (35.6588, 139.7454).",
    prompt: "Create an aerial image blended with the sky above coordinates 35.658807120369914, 139.74540071108495 (Tokyo Tower area). Make the person look like they are falling from that location, integrating seamlessly into the shot. The person is smiling and happy. Captured with a low-resolution disposable camera for a raw, daily snapshot feel, as if taken by a Japanese high schooler. All text in the image must be in English."
  },
  200: {
    title: "Hollywood Disaster Style - Beef Noodle Tub",
    description: "A giant beef noodle tub falling from the sky into a busy city intersection, disaster movie style.",
    prompt: "Megalophobia style, Hollywood disaster movie quality. A giant instant beef noodle tub falls from the sky, crashing into a bustling intersection. The brand name on the tub is replaced with a massive warning: 'Late Night Cravings - The Ultimate Disrespect to Weight Loss'. Nearby LED screens on skyscrapers display: 'Hold on! Cheat meal today, diet tomorrow!' All text in the image must be in English."
  },
  206: {
    title: "Studio Portrait - Meituan Delivery Girl",
    description: "A charming studio portrait of an East Asian girl in a Meituan delivery uniform with rabbit ears.",
    prompt: "A half-body studio portrait of a beautiful East Asian girl with porcelain-like skin and large sparkling eyes. She is playfully tilting her head and touching the yellow rabbit ears on her helmet. She wears a full set of yellow Meituan delivery uniform. Soft, even commercial studio lighting, creating a fresh and energetic atmosphere against a dark background. Text on the right side: 'Another way to open my life', in a font matching the photo style. All text in the image must be in English."
  },
  215: {
    title: "Fashion Magazine Cover - Judy Hopps x Songguo",
    description: "A high-end fashion magazine cover featuring Judy Hopps in couture with a pine cone.",
    prompt: "A 9:16 vertical portrait showing a clean, high-end glossy fashion magazine cover. Title at the top in bold black serif: 'SONGGUO', exuding luxury. Main visual: A hyper-realistic high-fashion shoot of Judy Hopps from 'Zootopia'. She strikes a confident supermodel pose, delicately holding a natural pine cone. She wears an expensive haute couture emerald silk coat with gold embroidery. Subtitle: 'JUDY x SONGGUO'. Footer: 'ISSUE 2025', date, barcode, and price '$25.00'. Clean studio gradient background, cinematic lighting, 8k resolution. All text in the image must be in English."
  },
  324: {
    title: "3D Pixar Style - Programmer Orange Cat",
    description: "A cute orange cat with glasses coding at a computer, looking stressed.",
    prompt: "3D Pixar-style render of an orange cat wearing thick glasses, sitting at a computer and coding frantically. The cat has a stressed/collapsed expression. A sticky note on the back of the monitor says: 'Requirement changed 800 times, Client says first version was better'. A coffee cup on the desk says: 'Code well, hair stays'. High quality, expressive character design, cinematic lighting. All text in the image must be in English."
  },
  325: {
    title: "Tech 3D Sectional Infographic - Jet Engine",
    description: "A high-tech 3D sectional infographic showing the internal structure of a modern jet engine.",
    prompt: "Create a high-tech 3D sectional infographic showing the internal structure and working principles of a modern commercial jet engine. The image presents a highly detailed and refined semi-disassembled sectional view of the main body, including the fuselage, wings, tail, and especially the turbofan engine. Technical labels and arrows explain the components. Clean, professional look with sharp textures and lifelike lighting. All text in the image must be in English."
  },
  190: {
    title: "Mediterranean Diet Schematic",
    description: "A visual schematic showing the components of a healthy Mediterranean diet.",
    prompt: "Draw a Mediterranean diet schematic based on a healthy, vibrant style. Include fresh vegetables, fruits, olive oil, whole grains, and lean proteins arranged in an aesthetically pleasing and educational layout. Use clean icons and clear labels. All text in the image must be in English."
  },
  50: {
    title: "Four-Panel Manga - The Magic of Numbers",
    description: "A four-panel manga style educational visual about the magic of numbers.",
    prompt: "A four-panel manga style infographic titled 'The Magic of Numbers'. Each panel explains a mathematical concept with cute characters and clear English text bubbles. Vibrant colors, clean lines, educational and engaging layout. All text in the image must be in English."
  }
};

// Apply translations
data = data.map(p => {
  if (translations[p.id]) {
    return {
      ...p,
      ...translations[p.id],
      language: 'en'
    };
  }
  return p;
});

fs.writeFileSync(mainPath, JSON.stringify(data, null, 2));
console.log(`Applied translations for ${Object.keys(translations).length} prompts.`);
