const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const original = content;
      
      // Global replacements for hardcoded colors
      content = content.replace(/text-white/g, 'text-foreground');
      content = content.replace(/text-black/g, 'text-background');
      content = content.replace(/bg-black/g, 'bg-background');
      content = content.replace(/bg-white/g, 'bg-foreground');
      content = content.replace(/border-white/g, 'border-foreground');
      content = content.replace(/border-black/g, 'border-background');
      
      content = content.replace(/text-gray-400/g, 'text-accent-muted');
      content = content.replace(/text-gray-500/g, 'text-accent-dim');
      
      content = content.replace(/bg-\[#050505\]/g, 'bg-background');
      content = content.replace(/bg-\[#030303\]/g, 'bg-background');
      content = content.replace(/bg-\[#0a0a0a\]/g, 'bg-background');
      
      if (original !== content) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDir(path.join(__dirname, 'src', 'app'));
processDir(path.join(__dirname, 'src', 'components'));
console.log('Done!');
