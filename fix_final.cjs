const fs = require('fs');
let code = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');

// Replace the end again. I will just split by lines and drop line 446.
let lines = code.split('\n');
if (lines[445].trim() === '</div>') { // 445 is index for line 446
  lines.splice(445, 1);
} else if (lines[444].trim() === '</div>') {
  lines.splice(444, 1);
} else if (lines[446].trim() === '</div>') {
  lines.splice(446, 1);
}

fs.writeFileSync('src/components/HeroSection.tsx', lines.join('\n'));
