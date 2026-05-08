const fs = require('fs');
const path = require('path');

const mainPath = path.join(__dirname, '../src/data/prompts.json');
let data = JSON.parse(fs.readFileSync(mainPath, 'utf8'));

const updates = {
  324: "/generated-images/324.png",
  325: "/generated-images/325.png",
  3712: "/generated-images/3712.png"
};

data = data.map(p => {
  if (updates[p.id]) {
    p.images = [updates[p.id]];
  }
  return p;
});

fs.writeFileSync(mainPath, JSON.stringify(data, null, 2));
console.log(`Updated images for ${Object.keys(updates).length} prompts.`);
