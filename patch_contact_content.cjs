const fs = require('fs');
let code = fs.readFileSync('src/pages/ContactPage.tsx', 'utf8');

code = code.replace(
  'import { loadContactMessages, saveContactMessages } from "../data/siteConfig";',
  'import { loadContactMessages, saveContactMessages, loadPageContent } from "../data/siteConfig";\nimport { useEffect } from "react";'
);

code = code.replace(
  'const [isSubmitting, setIsSubmitting] = useState(false);',
  'const [isSubmitting, setIsSubmitting] = useState(false);\n  const [contactContent, setContactContent] = useState("");\n\n  useEffect(() => {\n    const contents = loadPageContent();\n    const contact = contents.find(c => c.id === "contact");\n    if (contact) setContactContent(contact.content);\n  }, []);'
);

code = code.replace(
  'Our engineering team is here to help with extraction issues, bug reports, and copyright requests.',
  '{contactContent || "Our engineering team is here to help with extraction issues, bug reports, and copyright requests."}'
);

fs.writeFileSync('src/pages/ContactPage.tsx', code);
