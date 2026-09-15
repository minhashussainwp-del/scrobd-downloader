const fs = require('fs');
let code = fs.readFileSync('src/components/Admin/AdminPanel.tsx', 'utf8');
code = code.replace(
  'import { AdminMedia } from "./AdminMedia";',
  'import { AdminMedia } from "./AdminMedia";\nimport { AdminPagesContent } from "./AdminPagesContent";\nimport { AdminMessages } from "./AdminMessages";'
);
code = code.replace(
  'LayoutDashboard,',
  'LayoutDashboard,\n  FileEdit,\n  MessageSquare,'
);
code = code.replace(
  '{ id: "pages", label: "Website Pages", icon: Files },',
  '{ id: "pages", label: "Website Pages", icon: Files },\n              { id: "page_content", label: "Pages Content", icon: FileEdit },\n              { id: "messages", label: "Messages", icon: MessageSquare },'
);
code = code.replace(
  '{activeTab === "pages" && <AdminPages />}',
  '{activeTab === "pages" && <AdminPages />}\n        {activeTab === "page_content" && <AdminPagesContent />}\n        {activeTab === "messages" && <AdminMessages />}'
);
fs.writeFileSync('src/components/Admin/AdminPanel.tsx', code);
