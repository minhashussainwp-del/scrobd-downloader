const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '    return posts;\n  });',
  '    return BLOG_POSTS;\n  });'
);

fs.writeFileSync('src/App.tsx', code);
