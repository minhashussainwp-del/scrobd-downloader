const fs = require('fs');
let code = fs.readFileSync('src/pages/ContactPage.tsx', 'utf8');

code = code.replace(
  'import { PageRoute } from "../types";',
  'import { PageRoute, ContactMessage } from "../types";\nimport { loadContactMessages, saveContactMessages } from "../data/siteConfig";'
);

code = code.replace(
  'const handleSubmit = (e: React.FormEvent) => {\n    e.preventDefault();\n    setIsSubmitting(true);\n    setTimeout(() => {\n      setIsSubmitting(false);\n      setSubmitted(true);\n      setFormData({\n        name: "",\n        email: "",\n        subject: "Document Download Issue",\n        message: "",\n      });\n    }, 600);\n  };',
  'const handleSubmit = (e: React.FormEvent) => {\n    e.preventDefault();\n    setIsSubmitting(true);\n    \n    const newMessage: ContactMessage = {\n      id: "msg-" + Date.now(),\n      name: formData.name,\n      email: formData.email,\n      subject: formData.subject,\n      message: formData.message,\n      date: new Date().toLocaleDateString(),\n      isRead: false\n    };\n    \n    const existing = loadContactMessages();\n    saveContactMessages([...existing, newMessage]);\n\n    setTimeout(() => {\n      setIsSubmitting(false);\n      setSubmitted(true);\n      setFormData({\n        name: "",\n        email: "",\n        subject: "Document Download Issue",\n        message: "",\n      });\n    }, 600);\n  };'
);

fs.writeFileSync('src/pages/ContactPage.tsx', code);
