const fs = require('fs');
let code = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');

// The block is:
/*
      {/* Pre-Download Interstitial Modal (Only when explicitly enabled) *\/}
      {showPreDownloadModal && adSettings?.enabled && adSettings?.preDownloadAd && (
        <PreDownloadModal
          isOpen={showPreDownloadModal}
          secondsRemaining={modalSecondsRemaining}
          onComplete={handleAdModalComplete}
          settings={adSettings}
        />
      )}
*/

let index = code.indexOf('{/* Pre-Download Interstitial Modal');
if (index !== -1) {
    let nextSectionEnd = code.indexOf('</section>', index);
    if (nextSectionEnd !== -1) {
        code = code.substring(0, index) + code.substring(nextSectionEnd);
    }
}

fs.writeFileSync('src/components/HeroSection.tsx', code);
