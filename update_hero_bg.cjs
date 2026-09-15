const fs = require('fs');
let code = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');

// Change the main hero container styling
code = code.replace(
  '<section className="relative pt-20 pb-20 lg:pt-28 lg:pb-32 overflow-hidden bg-white" id="hero">',
  '<section className="relative pt-20 pb-24 lg:pt-32 lg:pb-40 overflow-hidden bg-slate-900" id="hero">'
);

// Replace the background element
code = code.replace(
  '{/* Refined Ambient Background */}\n      <div className="absolute top-0 left-0 right-0 h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-white to-white -z-10 pointer-events-none"></div>\n      <div className="absolute top-0 inset-x-0 h-px bg-slate-200/50"></div>',
  `{/* Modern Dark Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5Y2EyYjIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djIwaDJWMzRoLTI2VjIwaC0yVjM2SDM2em0tNi0yMFYyaDJWMTRoLTIyVjFoLTJWMTRIMzB6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      </div>
      <div className="absolute top-0 inset-x-0 h-px bg-white/10"></div>
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white to-transparent"></div>` // Fade out to white to blend with PageContentBlock
);

// Change Header Text colors
code = code.replace(
  '<h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.2]">',
  '<h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.2]">'
);

code = code.replace(
  '<span className="text-brand-600">',
  '<span className="text-indigo-400">'
);

code = code.replace(
  '<p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">',
  '<p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">'
);

fs.writeFileSync('src/components/HeroSection.tsx', code);
