const fs = require('fs');
['src/pages/LegalPage.tsx', 'src/pages/AboutPage.tsx', 'src/pages/ContactPage.tsx'].forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace('import { useState, useEffect } from "react";\n', '');
  code = code.replace('import React, { useState } from "react";', 'import React, { useState, useEffect } from "react";');
  code = code.replace('import React from "react";', 'import React, { useState, useEffect } from "react";');
  code = code.replace('import { useEffect } from "react";\n', '');
  fs.writeFileSync(file, code);
});
