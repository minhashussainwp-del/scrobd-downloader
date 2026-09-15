const fs = require('fs');
const html = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');

const regex = /<(\/?)([a-z][a-zA-Z0-9]*)([^>]*)>/g;
let match;
let stack = [];
let lineNumbers = [];

const ignoredTags = ['br', 'img', 'input', 'path', 'circle', 'polygon', 'rect', 'line', 'string', 'boolean', 'number', 'HTMLInputElement', 'DownloadFormat'];

while ((match = regex.exec(html)) !== null) {
  const isClosing = match[1] === '/';
  const tag = match[2];
  const rest = match[3];
  
  if (ignoredTags.includes(tag) || tag.match(/^[A-Z]/) || rest.trim().endsWith('/')) continue;
  
  const lineNumber = html.substring(0, match.index).split('\n').length;
  
  if (isClosing) {
    const last = stack.pop();
    lineNumbers.pop();
    if (last !== tag) {
      console.log(`Mismatch: expected </${last}> but found </${tag}> at line ${lineNumber}`);
      break;
    }
  } else {
    stack.push(tag);
    lineNumbers.push(lineNumber);
  }
}
console.log('Remaining in stack:', stack.map((t, i) => `${t} (line ${lineNumbers[i]})`));
