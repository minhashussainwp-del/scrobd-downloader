const fs = require('fs');
let code = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');

code = code.replace(
  '            </div>\n                  </div>\n        </div>\n      </div>\n      \n      {/* Pre-Download Interstitial Modal',
  '            </div>\n                  </div>\n        </div>\n      \n      {/* Pre-Download Interstitial Modal'
);

fs.writeFileSync('src/components/HeroSection.tsx', code);
