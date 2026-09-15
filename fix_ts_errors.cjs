const fs = require('fs');
let code = fs.readFileSync('src/components/Admin/AdminPosts.tsx', 'utf8');

// Add missing Settings import
code = code.replace(
  'X,\n  Sparkles,\n  Globe',
  'X,\n  Sparkles,\n  Globe,\n  Settings'
);

// Add empty content object to fix the TS errors for BlogPost creation
code = code.replace(
  'htmlContent: formHtmlContent, // copy current content as starting point\n    };',
  'htmlContent: formHtmlContent,\n      content: { intro: "", tableOfContents: [], sections: [] }\n    };'
);

code = code.replace(
  'htmlContent: formHtmlContent,\n    };',
  'htmlContent: formHtmlContent,\n      content: editingPost ? editingPost.content : { intro: "", tableOfContents: [], sections: [] }\n    };'
);

fs.writeFileSync('src/components/Admin/AdminPosts.tsx', code);
