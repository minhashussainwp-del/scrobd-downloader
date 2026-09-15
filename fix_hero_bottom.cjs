const fs = require('fs');
let code = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');

// Replace the very end of the file
code = code.replace(
  '            </div>\n        \n          </div>\n</section>\n  );\n}',
  `            </div>
          </div>
        </div>

        {/* Pre-Download Interstitial Modal (Only when explicitly enabled) */}
        {showPreDownloadModal && adSettings?.enabled && adSettings?.preDownloadAd && (
          <PreDownloadModal
            isOpen={showPreDownloadModal}
            secondsRemaining={modalSecondsRemaining}
            onComplete={handleAdModalComplete}
            settings={adSettings}
          />
        )}
      </div>
    </section>
  );
}`
);

fs.writeFileSync('src/components/HeroSection.tsx', code);
