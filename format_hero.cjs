const fs = require('fs');
let code = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');

// The bottom is currently:
/*
                </div>
              )}
            </div>
        
          </div>
</section>
  );
}
*/

let endStr = '                </div>\n              )}\n            </div>\n        \n          </div>\n</section>\n  );\n}';
if (code.includes(endStr)) {
    code = code.replace(endStr, `                </div>
              )}
            </div>
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
    </section>
  );
}`);
} else {
    // If it doesn't match perfectly, let's just do a string replacement on the last </section>
    let lastSectionIdx = code.lastIndexOf('</section>');
    if (lastSectionIdx !== -1) {
        code = code.substring(0, lastSectionIdx) + `
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
    </section>
  );
}`;
    }
}

fs.writeFileSync('src/components/HeroSection.tsx', code);
