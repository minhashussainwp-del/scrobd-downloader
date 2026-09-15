const fs = require('fs');
let code = fs.readFileSync('src/components/Admin/ClassicEditor.tsx', 'utf8');

// Fix the template string escapes
code = code.replace(/\\`<\$\\{val\\}>\\`/g, '`<${val}>`');
code = code.replace(/\\`/g, '`');
code = code.replace(/\\\$/g, '$');

fs.writeFileSync('src/components/Admin/ClassicEditor.tsx', code);
