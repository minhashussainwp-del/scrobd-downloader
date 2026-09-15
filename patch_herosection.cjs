const fs = require('fs');
let code = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');

code = code.replace(
  '<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">',
  '<div className="flex flex-col items-center justify-center max-w-2xl mx-auto w-full">'
);

code = code.replace(
  '<div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-card relative" data-purpose="hero-downloader-card">',
  '<div className="w-full bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-card relative" data-purpose="hero-downloader-card">'
);

// We need to remove the Right Column: 3D PDF Illustration
// Let's use regex or split.
let parts = code.split('{/* Right Column: 3D PDF Illustration */}');
if (parts.length > 1) {
    let secondPart = parts[1];
    // We want to delete up to the ending div of the grid.
    // Let's find the closing tag for the sidebar ad unit or the end of the grid.
    let endMarker = secondPart.indexOf('</section>');
    if (endMarker !== -1) {
        // Find the last </div> before </section>
        let beforeSectionEnd = secondPart.substring(0, endMarker);
        
        let newSecondPart = '\n        </div>\n' + secondPart.substring(endMarker);
        code = parts[0] + newSecondPart;
    }
}

fs.writeFileSync('src/components/HeroSection.tsx', code);
