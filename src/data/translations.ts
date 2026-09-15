import { SupportedLanguage, LanguageOption } from "../types";

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English (US)", nativeName: "English", flag: "🇺🇸", country: "United States", urlPrefix: "en" },
  { code: "br", name: "Português (Brasil)", nativeName: "Português (BR)", flag: "🇧🇷", country: "Brasil", urlPrefix: "br" },
  { code: "es", name: "Español", nativeName: "Español", flag: "🇪🇸", country: "España / Latam", urlPrefix: "es" },
  { code: "fr", name: "Français", nativeName: "Français", flag: "🇫🇷", country: "France", urlPrefix: "fr" },
  { code: "de", name: "Deutsch", nativeName: "Deutsch", flag: "🇩🇪", country: "Deutschland", urlPrefix: "de" },
  { code: "id", name: "Bahasa Indonesia", nativeName: "Bahasa Indonesia", flag: "🇮🇩", country: "Indonesia", urlPrefix: "id" },
];

export type TranslationKey = string;

// Master comprehensive translation dictionaries for all 6 languages
const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    "nav.home": "Home",
    "nav.howItWorks": "How It Works",
    "nav.blog": "Blog",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.admin": "Admin Panel",
    "nav.downloadPdf": "Download PDF",
    "nav.freeBadge": "Free",
    "nav.tagline": "Clean Document & Presentation Converter",

    "hero.badge": "Fast • Easy • Secure",
    "hero.title": "Download Scribd PDFs Free & Instantly",
    "hero.subtitle": "Get your favorite Scribd documents, ebooks, study materials, and more — quickly and easily. Just paste the URL and download your document.",
    "hero.placeholder": "Paste Scribd document URL here...",
    "hero.downloadBtn": "Download PDF",
    "hero.downloadingBtn": "Downloading PDF...",
    "hero.check1": "No Registration",
    "hero.check2": "High Quality PDF",
    "hero.check3": "Works on All Devices",

    "how.title": "How It Works",
    "how.step1": "Copy URL",
    "how.step1Desc": "Copy your document URL from the browser address bar.",
    "how.step2": "Paste URL",
    "how.step2Desc": "Paste the Scribd document URL into the download box above.",
    "how.step3": "Download",
    "how.step3Desc": "Download your files directly in high-resolution PDF format.",

    "benefits.title": "Benefits",
    "benefits.fastTitle": "Fast",
    "benefits.fastDesc": "Download your files quickly with an optimized workflow.",
    "benefits.safeTitle": "100% Safe",
    "benefits.safeDesc": "Simple document downloading without unnecessary registration.",
    "benefits.devicesTitle": "Works Everywhere",
    "benefits.devicesDesc": "Use the tool from desktop, tablet or mobile devices.",
    "benefits.freeTitle": "Completely Free",
    "benefits.freeDesc": "Zero subscriptions or surprise fees for public documents.",

    "guide.badge": "Knowledge Base",
    "guide.title": "The Complete Guide to Downloading Scribd Documents",
    "guide.p1": "Scribd is one of the world's largest online digital libraries, hosting hundreds of millions of user-uploaded academic papers, presentations, research notes, and books. Offline access on e-readers or tablets is essential for students and researchers.",
    "guide.subheading": "Key Extraction Capabilities",
    "guide.step1Title": "1. Copy the Document URL",
    "guide.step1Desc": "Locate the research paper or slide presentation on Scribd and copy its URL directly from your browser's address bar.",
    "guide.step2Title": "2. Insert URL into Downloader",
    "guide.step2Desc": "Paste the copied address into the input field above. Our intelligent extractor verifies the document format in milliseconds.",
    "guide.step3Title": "3. Instant Universal PDF Export",
    "guide.step3Desc": "Click the Download button to generate a clean, lossless PDF preserving all original vector typography, slides, and figures.",

    "faq.title": "Frequently Asked Questions",
    "faq.q1": "How to find a Scribd Document?",
    "faq.a1": "Search for your desired topic on Scribd, or browse categories to find educational materials, research papers, and ebooks.",
    "faq.q2": "Copy the document URL",
    "faq.a2": "Once you find the document you want, copy the full URL from your browser's address bar.",
    "faq.q3": "Use the downloader",
    "faq.a3": "Paste the copied URL into our downloader tool above and click the Download button to get your file.",
    "faq.q4": "What is Scribd?",
    "faq.a4": "Scribd is a digital reading subscription service that includes ebooks, audiobooks, magazines, and documents.",
    "faq.q5": "Can I download Scribd documents?",
    "faq.a5": "Yes, our tool allows you to easily download available public documents from Scribd for offline viewing.",
    "faq.q6": "What file format can documents use?",
    "faq.a6": "Most documents are downloaded as high-quality PDFs, maintaining the original formatting.",
    "faq.q7": "Do I need an account?",
    "faq.a7": "No, you do not need an account to use our downloader tool. It's completely free and open.",
    "faq.q8": "Can I use Scribd documents for study?",
    "faq.a8": "Absolutely. Scribd is an excellent resource for finding study materials, research papers, and educational guides.",

    "blog.previewTitle": "Latest Guides & Articles",
    "blog.previewSubtitle": "Explore tutorials on document formats, digital reading, and research methods.",
    "blog.readArticle": "Read Guide",
    "blog.viewAll": "View All Guides",
    "blog.backToGuides": "Back to Guides",
    "blog.tableOfContents": "Table of Contents",
    "blog.authorInsight": "Author Insight",
    "blog.quickCtaTitle": "Have a Scribd Link Ready to Convert?",
    "blog.quickCtaDesc": "Paste the URL into our web tool right now to preview pages and download your document as a pure PDF file.",
    "blog.quickCtaBtn": "Open PDF Downloader",

    "footer.tagline": "A simple online tool for reading and downloading Scribd documents and discovering audio guides and resources.",
    "footer.quickLinks": "Quick Links",
    "footer.resources": "Resources",
    "footer.legal": "Legal & Privacy",
    "footer.scribdGuide": "Scribd Guide",
    "footer.downloadTips": "Download Tips",
    "footer.studyResources": "Study Resources",
    "footer.faqs": "FAQs",
    "footer.rights": "All rights reserved. Not affiliated with Scribd Inc.",
    "footer.disclaimer": "This utility compiles publicly available document slides and tiles for personal academic research and fair-use archiving.",
    "footer.terms": "Terms of Service",
    "footer.privacy": "Privacy Policy",

    "lang.detectBanner": "We noticed you might prefer",
    "lang.switchBtn": "Switch to",
    "lang.dismiss": "Keep English",
  },

  br: {
    "nav.home": "Início",
    "nav.howItWorks": "Como Funciona",
    "nav.blog": "Blog",
    "nav.about": "Sobre",
    "nav.contact": "Contato",
    "nav.admin": "Painel Admin",
    "nav.downloadPdf": "Baixar PDF",
    "nav.freeBadge": "Grátis",
    "nav.tagline": "Conversor Limpo de Documentos e Apresentações",

    "hero.badge": "Rápido • Fácil • Seguro",
    "hero.title": "Baixar PDFs do Scribd Grátis e Instantâneo",
    "hero.subtitle": "Obtenha seus documentos, e-books, materiais de estudo e slides favoritos do Scribd — de forma rápida e descomplicada. Cole o link e baixe seu arquivo.",
    "hero.placeholder": "Cole a URL do documento Scribd aqui...",
    "hero.downloadBtn": "Baixar PDF",
    "hero.downloadingBtn": "Baixando PDF...",
    "hero.check1": "Sem Cadastro",
    "hero.check2": "PDF em Alta Qualidade",
    "hero.check3": "Funciona em Todos os Dispositivos",

    "how.title": "Como Funciona",
    "how.step1": "Copiar URL",
    "how.step1Desc": "Copie o endereço do documento na barra de navegação do seu navegador.",
    "how.step2": "Colar URL",
    "how.step2Desc": "Cole o link do documento Scribd no campo acima.",
    "how.step3": "Baixar",
    "how.step3Desc": "Baixe seu arquivo diretamente em formato PDF de alta resolução.",

    "benefits.title": "Vantagens",
    "benefits.fastTitle": "Rápido",
    "benefits.fastDesc": "Baixe seus arquivos rapidamente com processamento ultra otimizado.",
    "benefits.safeTitle": "100% Seguro",
    "benefits.safeDesc": "Download simples de documentos sem cadastros desnecessários.",
    "benefits.devicesTitle": "Funciona em Qualquer Lugar",
    "benefits.devicesDesc": "Acesse a ferramenta pelo computador, tablet ou celular.",
    "benefits.freeTitle": "Totalmente Grátis",
    "benefits.freeDesc": "Zero assinaturas ou taxas ocultas para documentos públicos.",

    "guide.badge": "Base de Conhecimento",
    "guide.title": "O Guia Completo para Baixar Documentos do Scribd",
    "guide.p1": "O Scribd é uma das maiores bibliotecas digitais do mundo, com milhões de trabalhos acadêmicos, apresentações e livros enviados por usuários. O acesso offline é fundamental para estudantes e pesquisadores.",
    "guide.subheading": "Principais Recursos de Extração",
    "guide.step1Title": "1. Copie o Link do Documento",
    "guide.step1Desc": "Encontre o artigo ou apresentação no Scribd e copie a URL completa na barra do navegador.",
    "guide.step2Title": "2. Insira a URL no Extrator",
    "guide.step2Desc": "Cole o link copiado no campo acima. Nosso sistema verifica o formato do documento em milissegundos.",
    "guide.step3Title": "3. Exportação Imediata em PDF",
    "guide.step3Desc": "Clique no botão Baixar para gerar um PDF nítido e sem perdas, pronto para impressão ou estudo offline.",

    "faq.title": "Perguntas Frequentes",
    "faq.q1": "Como encontrar um documento no Scribd?",
    "faq.a1": "Pesquise pelo tema desejado no Scribd ou navegue pelas categorias para encontrar materiais educativos, pesquisas e e-books.",
    "faq.q2": "Como copiar a URL do documento?",
    "faq.a2": "Ao encontrar o documento desejado, copie a URL completa da barra de endereços do seu navegador.",
    "faq.q3": "Como usar o baixador?",
    "faq.a3": "Cole o link copiado na ferramenta acima e clique no botão Baixar para receber seu arquivo.",
    "faq.q4": "O que é o Scribd?",
    "faq.a4": "O Scribd é um serviço de assinatura de leitura digital que inclui e-books, audiolivros, revistas e documentos.",
    "faq.q5": "Posso baixar documentos do Scribd?",
    "faq.a5": "Sim, nossa ferramenta permite que você baixe facilmente documentos públicos disponíveis no Scribd para leitura offline.",
    "faq.q6": "Qual é o formato do arquivo baixado?",
    "faq.a6": "A maioria dos documentos é baixada como PDF de alta qualidade, mantendo a formatação original.",
    "faq.q7": "Preciso criar uma conta?",
    "faq.a7": "Não, você não precisa de conta para usar nosso serviço. É 100% gratuito e aberto.",
    "faq.q8": "Posso usar documentos do Scribd para estudar?",
    "faq.a8": "Com certeza. O Scribd é um excelente recurso para estudos, trabalhos acadêmicos e referências educacionais.",

    "blog.previewTitle": "Últimos Guias e Artigos",
    "blog.previewSubtitle": "Tutoriais detalhados sobre formatos de documentos, leitura digital e pesquisa.",
    "blog.readArticle": "Ler Guia",
    "blog.viewAll": "Ver Todos os Guias",
    "blog.backToGuides": "Voltar aos Guias",
    "blog.tableOfContents": "Índice",
    "blog.authorInsight": "Dica do Autor",
    "blog.quickCtaTitle": "Tem um link do Scribd pronto para converter?",
    "blog.quickCtaDesc": "Cole a URL na nossa ferramenta agora mesmo para visualizar as páginas e baixar em formato PDF.",
    "blog.quickCtaBtn": "Abrir Baixador de PDF",

    "footer.tagline": "Uma ferramenta online simples para ler e baixar documentos do Scribd e descobrir recursos de estudo.",
    "footer.quickLinks": "Links Rápidos",
    "footer.resources": "Recursos",
    "footer.legal": "Termos e Privacidade",
    "footer.scribdGuide": "Guia Scribd",
    "footer.downloadTips": "Dicas de Download",
    "footer.studyResources": "Recursos de Estudo",
    "footer.faqs": "Perguntas Frequentes",
    "footer.rights": "Todos os direitos reservados. Sem afiliação com Scribd Inc.",
    "footer.disclaimer": "Esta ferramenta compila slides e documentos públicos para fins acadêmicos e de pesquisa pessoal.",
    "footer.terms": "Termos de Serviço",
    "footer.privacy": "Política de Privacidade",

    "lang.detectBanner": "Identificamos que você pode preferir",
    "lang.switchBtn": "Mudar para",
    "lang.dismiss": "Manter Inglês",
  },

  es: {
    "nav.home": "Inicio",
    "nav.howItWorks": "Cómo Funciona",
    "nav.blog": "Blog",
    "nav.about": "Acerca de",
    "nav.contact": "Contacto",
    "nav.admin": "Panel Admin",
    "nav.downloadPdf": "Descargar PDF",
    "nav.freeBadge": "Gratis",
    "nav.tagline": "Conversor Limpio de Documentos y Presentaciones",

    "hero.badge": "Rápido • Fácil • Seguro",
    "hero.title": "Descargar PDFs de Scribd Gratis e Instantáneo",
    "hero.subtitle": "Obtén tus documentos, libros electrónicos, materiales de estudio y diapositivas favoritas de Scribd — rápido y fácil. Solo pega el enlace y descarga tu archivo.",
    "hero.placeholder": "Pega aquí la URL del documento de Scribd...",
    "hero.downloadBtn": "Descargar PDF",
    "hero.downloadingBtn": "Descargando PDF...",
    "hero.check1": "Sin Registro",
    "hero.check2": "PDF en Alta Calidad",
    "hero.check3": "Funciona en Todos los Dispositivos",

    "how.title": "Cómo Funciona",
    "how.step1": "Copiar URL",
    "how.step1Desc": "Copia la dirección del documento desde la barra de tu navegador.",
    "how.step2": "Pegar URL",
    "how.step2Desc": "Pega el enlace del documento de Scribd en el campo superior.",
    "how.step3": "Descargar",
    "how.step3Desc": "Descarga tus archivos directamente en formato PDF de alta resolución.",

    "benefits.title": "Beneficios",
    "benefits.fastTitle": "Rápido",
    "benefits.fastDesc": "Descarga tus archivos con máxima rapidez mediante un flujo optimizado.",
    "benefits.safeTitle": "100% Seguro",
    "benefits.safeDesc": "Descarga simple de documentos sin necesidad de registros innecesarios.",
    "benefits.devicesTitle": "Funciona en Todas Partes",
    "benefits.devicesDesc": "Usa la herramienta desde ordenador, tableta o dispositivo móvil.",
    "benefits.freeTitle": "Totalmente Gratis",
    "benefits.freeDesc": "Sin suscripciones ni costes ocultos para documentos públicos.",

    "guide.badge": "Base de Conocimiento",
    "guide.title": "Guía Completa para Descargar Documentos de Scribd",
    "guide.p1": "Scribd es una de las mayores bibliotecas digitales del mundo, con cientos de millones de artículos académicos, presentaciones y libros subidos por usuarios. El acceso sin conexión es fundamental para estudiantes e investigadores.",
    "guide.subheading": "Capacidades Clave de Extracción",
    "guide.step1Title": "1. Copia el Enlace del Documento",
    "guide.step1Desc": "Localiza el trabajo de investigación o la presentación en Scribd y copia la URL directamente de la barra del navegador.",
    "guide.step2Title": "2. Inserta la URL en el Extractor",
    "guide.step2Desc": "Pega la dirección en el campo de entrada. Nuestro sistema analiza el formato del documento al instante.",
    "guide.step3Title": "3. Exportación Inmediata a PDF",
    "guide.step3Desc": "Haz clic en Descargar PDF para obtener un documento limpio y de alta resolución listo para imprimir o estudiar.",

    "faq.title": "Preguntas Frecuentes",
    "faq.q1": "¿Cómo encontrar un documento en Scribd?",
    "faq.a1": "Busca el tema deseado en Scribd o explora las categorías para encontrar material educativo, investigaciones y libros.",
    "faq.q2": "¿Cómo copiar la URL del documento?",
    "faq.a2": "Cuando encuentres el documento que necesitas, copia la URL completa de la barra de direcciones de tu navegador.",
    "faq.q3": "¿Cómo usar el descargador?",
    "faq.a3": "Pega el enlace copiado en nuestra herramienta y haz clic en Descargar PDF para recibir tu archivo.",
    "faq.q4": "¿Qué es Scribd?",
    "faq.a4": "Scribd es una plataforma de lectura digital con suscripción que incluye libros, audiolibros, revistas y documentos.",
    "faq.q5": "¿Puedo descargar documentos de Scribd?",
    "faq.a5": "Sí, nuestra herramienta te permite descargar documentos públicos disponibles en Scribd para verlos sin conexión.",
    "faq.q6": "¿Qué formato de archivo se utiliza?",
    "faq.a6": "La mayoría de los documentos se descargan como PDFs de alta calidad, conservando el diseño original.",
    "faq.q7": "¿Necesito crear una cuenta?",
    "faq.a7": "No, no requieres ninguna cuenta ni inicio de sesión. El servicio es 100% libre y gratuito.",
    "faq.q8": "¿Puedo usar documentos de Scribd para estudiar?",
    "faq.a8": "Por supuesto. Scribd es un recurso fantástico para encontrar guías de estudio, trabajos y materiales formativos.",

    "blog.previewTitle": "Últimas Guías y Artículos",
    "blog.previewSubtitle": "Explora tutoriales sobre formatos de documentos, lectura digital y métodos de investigación.",
    "blog.readArticle": "Leer Guía",
    "blog.viewAll": "Ver Todas las Guías",
    "blog.backToGuides": "Volver a Guías",
    "blog.tableOfContents": "Índice de Contenidos",
    "blog.authorInsight": "Consejo del Autor",
    "blog.quickCtaTitle": "¿Tienes un enlace de Scribd listo para convertir?",
    "blog.quickCtaDesc": "Pega la URL en nuestra herramienta ahora mismo para obtener tu documento en formato PDF.",
    "blog.quickCtaBtn": "Abrir Descargador de PDF",

    "footer.tagline": "Una herramienta online sencilla para leer y descargar documentos de Scribd y descubrir recursos educativos.",
    "footer.quickLinks": "Enlaces Rápidos",
    "footer.resources": "Recursos",
    "footer.legal": "Legal y Privacidad",
    "footer.scribdGuide": "Guía de Scribd",
    "footer.downloadTips": "Consejos de Descarga",
    "footer.studyResources": "Recursos de Estudio",
    "footer.faqs": "Preguntas Frecuentes",
    "footer.rights": "Todos los derechos reservados. No afiliado con Scribd Inc.",
    "footer.disclaimer": "Esta utilidad recopila diapositivas y documentos públicos con fines académicos y de uso legítimo.",
    "footer.terms": "Términos del Servicio",
    "footer.privacy": "Política de Privacidad",

    "lang.detectBanner": "Parece que prefieres usar",
    "lang.switchBtn": "Cambiar a",
    "lang.dismiss": "Continuar en Inglés",
  },

  fr: {
    "nav.home": "Accueil",
    "nav.howItWorks": "Comment ça marche",
    "nav.blog": "Blog",
    "nav.about": "À propos",
    "nav.contact": "Contact",
    "nav.admin": "Panneau Admin",
    "nav.downloadPdf": "Télécharger PDF",
    "nav.freeBadge": "Gratuit",
    "nav.tagline": "Convertisseur Propre de Documents et Présentations",

    "hero.badge": "Rapide • Simple • Sécurisé",
    "hero.title": "Télécharger des PDFs Scribd Gratuitement",
    "hero.subtitle": "Obtenez vos documents, livres électroniques et présentations Scribd préférés — rapidement et facilement. Collez simplement l'URL et téléchargez votre fichier.",
    "hero.placeholder": "Collez l'URL du document Scribd ici...",
    "hero.downloadBtn": "Télécharger PDF",
    "hero.downloadingBtn": "Téléchargement en cours...",
    "hero.check1": "Sans Inscription",
    "hero.check2": "PDF Haute Qualité",
    "hero.check3": "Compatible Tous Appareils",

    "how.title": "Comment ça marche",
    "how.step1": "Copier l'URL",
    "how.step1Desc": "Copiez l'adresse du document depuis la barre d'adresse de votre navigateur.",
    "how.step2": "Coller l'URL",
    "how.step2Desc": "Collez le lien du document Scribd dans le champ de téléchargement ci-dessus.",
    "how.step3": "Télécharger",
    "how.step3Desc": "Téléchargez votre document directement au format PDF haute résolution.",

    "benefits.title": "Avantages",
    "benefits.fastTitle": "Rapide",
    "benefits.fastDesc": "Téléchargez vos fichiers à grande vitesse grâce à un traitement optimisé.",
    "benefits.safeTitle": "100% Sécurisé",
    "benefits.safeDesc": "Téléchargement direct et sans collecte inutile d'informations.",
    "benefits.devicesTitle": "Partout avec Vous",
    "benefits.devicesDesc": "Utilisez l'outil depuis votre ordinateur, tablette ou smartphone.",
    "benefits.freeTitle": "Totalement Gratuit",
    "benefits.freeDesc": "Aucun abonnement ni frais cachés pour les documents publics.",

    "guide.badge": "Base de Connaissances",
    "guide.title": "Le Guide Complet pour Télécharger des Documents Scribd",
    "guide.p1": "Scribd est l'une des plus vastes bibliothèques en ligne au monde, hébergeant des millions d'articles universitaires et de présentations. L'accès hors ligne est capital pour les étudiants et chercheurs.",
    "guide.subheading": "Fonctionnalités Clés d'Extraction",
    "guide.step1Title": "1. Copiez le Lien du Document",
    "guide.step1Desc": "Recherchez le document sur Scribd et copiez l'URL complète dans la barre de votre navigateur.",
    "guide.step2Title": "2. Insérez l'URL dans l'Extracteur",
    "guide.step2Desc": "Collez le lien dans le champ ci-dessus. Notre système valide le document instantanément.",
    "guide.step3Title": "3. Exportation Immédiate en PDF",
    "guide.step3Desc": "Cliquez sur Télécharger pour recevoir un fichier PDF haute fidélité prêt à être imprimé ou consulté hors ligne.",

    "faq.title": "Foire Aux Questions",
    "faq.q1": "Comment trouver un document sur Scribd ?",
    "faq.a1": "Recherchez votre sujet sur Scribd ou explorez les catégories pour dénicher mémoires, cours et ebooks.",
    "faq.q2": "Comment copier l'URL du document ?",
    "faq.a2": "Une fois le document affiché, copiez simplement l'URL complète depuis la barre d'adresse de votre navigateur.",
    "faq.q3": "Comment utiliser l'outil ?",
    "faq.a3": "Collez l'URL copiée dans le formulaire ci-dessus et cliquez sur Télécharger PDF.",
    "faq.q4": "Qu'est-ce que Scribd ?",
    "faq.a4": "Scribd est un service d'abonnement numérique donnant accès à des livres, livres audio, magazines et documents.",
    "faq.q5": "Puis-je télécharger des documents Scribd ?",
    "faq.a5": "Oui, notre outil vous permet de récupérer facilement des documents publics pour les lire hors connexion.",
    "faq.q6": "Quel est le format du document ?",
    "faq.a6": "La quasi-totalité des documents est exportée sous forme de PDF haute qualité préservant la mise en page d'origine.",
    "faq.q7": "Faut-il créer un compte ?",
    "faq.a7": "Non, aucune inscription ni mot de passe ne sont nécessaires. L'accès est 100% libre et gratuit.",
    "faq.q8": "Puis-je utiliser ces documents pour mes études ?",
    "faq.a8": "Absolument. Scribd est une formidable ressource pour vos devoirs, révisions et travaux universitaires.",

    "blog.previewTitle": "Derniers Guides et Articles",
    "blog.previewSubtitle": "Découvrez des tutoriels sur les formats de documents, la lecture numérique et les méthodes de recherche.",
    "blog.readArticle": "Lire le Guide",
    "blog.viewAll": "Voir Tous les Guides",
    "blog.backToGuides": "Retour aux Guides",
    "blog.tableOfContents": "Table des Matières",
    "blog.authorInsight": "Conseil de l'Auteur",
    "blog.quickCtaTitle": "Un lien Scribd prêt à être converti ?",
    "blog.quickCtaDesc": "Collez l'URL dès maintenant dans notre outil pour télécharger votre document en PDF.",
    "blog.quickCtaBtn": "Ouvrir le Téléchargeur",

    "footer.tagline": "Un outil web simple pour lire et télécharger des documents Scribd et découvrir des ressources éducatives.",
    "footer.quickLinks": "Liens Rapides",
    "footer.resources": "Ressources",
    "footer.legal": "Légal & Confidentialité",
    "footer.scribdGuide": "Guide Scribd",
    "footer.downloadTips": "Conseils de Téléchargement",
    "footer.studyResources": "Ressources d'Étude",
    "footer.faqs": "FAQ",
    "footer.rights": "Tous droits réservés. Non affilié à Scribd Inc.",
    "footer.disclaimer": "Cet outil extrait des documents publics pour des besoins personnels de recherche et d'usage loyal.",
    "footer.terms": "Conditions d'Utilisation",
    "footer.privacy": "Politique de Confidentialité",

    "lang.detectBanner": "Vous préférez peut-être consulter le site en",
    "lang.switchBtn": "Passer au",
    "lang.dismiss": "Garder l'Anglais",
  },

  de: {
    "nav.home": "Startseite",
    "nav.howItWorks": "Funktionsweise",
    "nav.blog": "Blog",
    "nav.about": "Über uns",
    "nav.contact": "Kontakt",
    "nav.admin": "Admin-Panel",
    "nav.downloadPdf": "PDF Herunterladen",
    "nav.freeBadge": "Kostenlos",
    "nav.tagline": "Präziser Dokumenten- & Präsentations-Konverter",

    "hero.badge": "Schnell • Einfach • Sicher",
    "hero.title": "Scribd PDFs Kostenlos & Sofort Herunterladen",
    "hero.subtitle": "Holen Sie sich Ihre Lieblingsdokumente, E-Books, Lernmaterialien und Präsentationen von Scribd — schnell und unkompliziert. Link einfügen und PDF speichern.",
    "hero.placeholder": "Scribd Dokumenten-URL hier einfügen...",
    "hero.downloadBtn": "PDF Herunterladen",
    "hero.downloadingBtn": "PDF wird heruntergeladen...",
    "hero.check1": "Keine Registrierung",
    "hero.check2": "Hochwertiges PDF",
    "hero.check3": "Funktioniert auf allen Geräten",

    "how.title": "So Funktioniert Es",
    "how.step1": "URL Kopieren",
    "how.step1Desc": "Kopieren Sie die Dokumentenadresse direkt aus der Adressleiste Ihres Browsers.",
    "how.step2": "URL Einfügen",
    "how.step2Desc": "Fügen Sie den Scribd-Link in das obige Download-Feld ein.",
    "how.step3": "Herunterladen",
    "how.step3Desc": "Laden Sie Ihr Dokument direkt im hochauflösenden PDF-Format herunter.",

    "benefits.title": "Ihre Vorteile",
    "benefits.fastTitle": "Blitzschnell",
    "benefits.fastDesc": "Laden Sie Ihre Dokumente mit unserer optimierten Engine ohne Wartezeit herunter.",
    "benefits.safeTitle": "100% Sicher",
    "benefits.safeDesc": "Einfacher Dokumenten-Download ganz ohne lästige Registrierung.",
    "benefits.devicesTitle": "Überall Verfügbar",
    "benefits.devicesDesc": "Nutzen Sie das Tool bequem auf PC, Mac, Tablet oder Smartphone.",
    "benefits.freeTitle": "Vollständig Kostenlos",
    "benefits.freeDesc": "Keine Abonnements oder versteckte Kosten für öffentlich verfügbare Dokumente.",

    "guide.badge": "Wissensdatenbank",
    "guide.title": "Der Komplette Leitfaden zum Herunterladen von Scribd-Dokumenten",
    "guide.p1": "Scribd zählt zu den weltweit größten digitalen Bibliotheken mit Millionen von akademischen Arbeiten, Präsentationen und Büchern. Der Offline-Zugriff ist für Studierende und Forscher unerlässlich.",
    "guide.subheading": "Wichtige Extraktions-Funktionen",
    "guide.step1Title": "1. Dokument-Link Kopieren",
    "guide.step1Desc": "Öffnen Sie das gewünschte Dokument auf Scribd und kopieren Sie die vollständige URL aus dem Browser.",
    "guide.step2Title": "2. Link im Downloader Einfügen",
    "guide.step2Desc": "Fügen Sie die Webadresse in das Eingabefeld ein. Unser System überprüft das Format in Millisekunden.",
    "guide.step3Title": "3. Sofortiger Verlustfreier PDF-Export",
    "guide.step3Desc": "Klicken Sie auf Herunterladen, um ein gestochen scharfes PDF mit originalgetreuer Formatierung zu erhalten.",

    "faq.title": "Häufig Gestellte Fragen",
    "faq.q1": "Wie finde ich ein Dokument auf Scribd?",
    "faq.a1": "Suchen Sie auf Scribd nach Ihrem Thema oder stöbern Sie in den Kategorien nach Skripten, Papern und E-Books.",
    "faq.q2": "Wie kopiere ich die Dokumenten-URL?",
    "faq.a2": "Kopieren Sie einfach die vollständige URL aus der oberen Adressleiste Ihres Browsers.",
    "faq.q3": "Wie bediene ich den Downloader?",
    "faq.a3": "Fügen Sie den kopierten Link in das obige Feld ein und klicken Sie auf PDF Herunterladen.",
    "faq.q4": "Was genau ist Scribd?",
    "faq.a4": "Scribd ist ein digitaler Lesedienst mit Zugriff auf Millionen E-Books, Hörbücher, Magazine und Dokumente.",
    "faq.q5": "Kann ich Dokumente von Scribd herunterladen?",
    "faq.a5": "Ja, mit unserem Dienst können Sie verfügbare öffentliche Dokumente für die Offline-Nutzung speichern.",
    "faq.q6": "In welchem Format wird das Dokument gespeichert?",
    "faq.a6": "Dokumente werden als hochwertige PDFs ausgegeben, wodurch das ursprüngliche Layout vollständig erhalten bleibt.",
    "faq.q7": "Muss ich mich registrieren?",
    "faq.a7": "Nein, es ist keinerlei Konto oder Anmeldung erforderlich. Die Nutzung ist völlig frei.",
    "faq.q8": "Kann ich Dokumente für mein Studium nutzen?",
    "faq.a8": "Selbstverständlich. Scribd ist eine ausgezeichnete Quelle für Lernhilfen, Vorlesungsunterlagen und wissenschaftliche Arbeiten.",

    "blog.previewTitle": "Neueste Leitfäden & Artikel",
    "blog.previewSubtitle": "Praktische Anleitungen zu Dateiformaten, digitalem Lesen und akademischer Recherche.",
    "blog.readArticle": "Artikel Lesen",
    "blog.viewAll": "Alle Anleitungen",
    "blog.backToGuides": "Zurück zu den Artikeln",
    "blog.tableOfContents": "Inhaltsverzeichnis",
    "blog.authorInsight": "Tipp des Autors",
    "blog.quickCtaTitle": "Haben Sie einen Scribd-Link parat?",
    "blog.quickCtaDesc": "Fügen Sie den Link jetzt in unser Tool ein, um Ihr Dokument als PDF-Datei zu erhalten.",
    "blog.quickCtaBtn": "PDF-Downloader Öffnen",

    "footer.tagline": "Ein einfaches Online-Werkzeug zum Lesen und Herunterladen von Scribd-Dokumenten und Entdecken von Studienressourcen.",
    "footer.quickLinks": "Schnellzugriff",
    "footer.resources": "Ressourcen",
    "footer.legal": "Rechtliches & Datenschutz",
    "footer.scribdGuide": "Scribd Ratgeber",
    "footer.downloadTips": "Download-Tipps",
    "footer.studyResources": "Lernhilfen",
    "footer.faqs": "FAQ",
    "footer.rights": "Alle Rechte vorbehalten. Keine Verbindung zu Scribd Inc.",
    "footer.disclaimer": "Dieses Werkzeug erfasst öffentlich zugängliche Folien für wissenschaftliche Zwecke und faire Nutzung.",
    "footer.terms": "Nutzungsbedingungen",
    "footer.privacy": "Datenschutzerklärung",

    "lang.detectBanner": "Möchten Sie die Website lieber auf Deutsch nutzen?",
    "lang.switchBtn": "Zu Deutsch wechseln",
    "lang.dismiss": "Auf Englisch bleiben",
  },

  id: {
    "nav.home": "Beranda",
    "nav.howItWorks": "Cara Kerja",
    "nav.blog": "Blog",
    "nav.about": "Tentang",
    "nav.contact": "Kontak",
    "nav.admin": "Panel Admin",
    "nav.downloadPdf": "Unduh PDF",
    "nav.freeBadge": "Gratis",
    "nav.tagline": "Konverter Dokumen & Presentasi Cepat",

    "hero.badge": "Cepat • Mudah • Aman",
    "hero.title": "Unduh PDF Scribd Gratis & Instan",
    "hero.subtitle": "Dapatkan dokumen, e-book, materi kuliah, dan presentasi Scribd favorit Anda — dengan cepat dan mudah. Cukup tempel URL dan unduh berkas Anda.",
    "hero.placeholder": "Tempel tautan dokumen Scribd di sini...",
    "hero.downloadBtn": "Unduh PDF",
    "hero.downloadingBtn": "Mengunduh PDF...",
    "hero.check1": "Tanpa Pendaftaran",
    "hero.check2": "PDF Berkualitas Tinggi",
    "hero.check3": "Berfungsi di Semua Perangkat",

    "how.title": "Cara Kerja",
    "how.step1": "Salin URL",
    "how.step1Desc": "Salin alamat dokumen dari bilah alamat peramban Anda.",
    "how.step2": "Tempel URL",
    "how.step2Desc": "Tempelkan tautan dokumen Scribd ke kotak unduh di atas.",
    "how.step3": "Unduh",
    "how.step3Desc": "Unduh berkas dokumen Anda langsung dalam format PDF beresolusi tinggi.",

    "benefits.title": "Keunggulan",
    "benefits.fastTitle": "Cepat",
    "benefits.fastDesc": "Unduh berkas Anda dalam hitungan detik dengan mesin konversi kami.",
    "benefits.safeTitle": "100% Aman",
    "benefits.safeDesc": "Pengunduhan dokumen tanpa perlu registrasi atau data pribadi.",
    "benefits.devicesTitle": "Dapat Diakses di Mana Saja",
    "benefits.devicesDesc": "Gunakan alat ini dari komputer, tablet, maupun ponsel pintar.",
    "benefits.freeTitle": "Sepenuhnya Gratis",
    "benefits.freeDesc": "Tanpa biaya langganan atau biaya tersembunyi untuk dokumen publik.",

    "guide.badge": "Pusat Pengetahuan",
    "guide.title": "Panduan Lengkap Mengunduh Dokumen Scribd",
    "guide.p1": "Scribd adalah salah satu perpustakaan digital terbesar di dunia dengan ratusan juta makalah, presentasi, dan buku. Akses luring sangat dibutuhkan mahasiswa dan peneliti.",
    "guide.subheading": "Kemampuan Ekstraksi Utama",
    "guide.step1Title": "1. Salin Tautan Dokumen",
    "guide.step1Desc": "Buka dokumen di Scribd dan salin URL lengkapnya dari bilah alamat browser.",
    "guide.step2Title": "2. Masukkan URL ke Pengunduh",
    "guide.step2Desc": "Tempel tautan ke kotak input. Sistem kami akan memvalidasi format berkas secara instan.",
    "guide.step3Title": "3. Ekspor PDF Berkualitas Tinggi",
    "guide.step3Desc": "Klik Unduh untuk mendapatkan PDF jernih yang siap dicetak atau dibaca secara offline.",

    "faq.title": "Pertanyaan yang Sering Diajukan",
    "faq.q1": "Bagaimana cara menemukan dokumen di Scribd?",
    "faq.a1": "Cari topik yang Anda inginkan di Scribd, atau jelajahi kategori untuk menemukan materi kuliah, jurnal, dan e-book.",
    "faq.q2": "Bagaimana cara menyalin tautan dokumen?",
    "faq.a2": "Setelah menemukan dokumen, salin seluruh URL dari bilah alamat peramban Anda.",
    "faq.q3": "Bagaimana cara menggunakan pengunduh ini?",
    "faq.a3": "Tempel URL yang sudah disalin ke formulir di atas, lalu klik tombol Unduh PDF.",
    "faq.q4": "Apa itu Scribd?",
    "faq.a4": "Scribd adalah layanan langganan bacaan digital yang menyediakan jutaan e-book, buku audio, dan dokumen.",
    "faq.q5": "Bisakah saya mengunduh dokumen Scribd?",
    "faq.a5": "Ya, alat kami memungkinkan Anda mengunduh dokumen publik yang tersedia di Scribd untuk dibaca luring.",
    "faq.q6": "Format berkas apa yang dihasilkan?",
    "faq.a6": "Hampir semua dokumen diunduh dalam format PDF berkualitas tinggi dengan tata letak asli yang terjaga.",
    "faq.q7": "Apakah saya perlu membuat akun?",
    "faq.a7": "Tidak perlu. Anda dapat langsung mengunduh tanpa registrasi atau masuk akun.",
    "faq.q8": "Bisakah dokumen ini digunakan untuk belajar?",
    "faq.a8": "Tentu saja. Scribd adalah sumber yang luar biasa untuk tugas kuliah, referensi, dan riset akademik.",

    "blog.previewTitle": "Panduan & Artikel Terbaru",
    "blog.previewSubtitle": "Pelajari kiat praktis seputar format dokumen, membaca digital, dan metode riset.",
    "blog.readArticle": "Baca Panduan",
    "blog.viewAll": "Lihat Semua Panduan",
    "blog.backToGuides": "Kembali ke Panduan",
    "blog.tableOfContents": "Daftar Isi",
    "blog.authorInsight": "Wawasan Penulis",
    "blog.quickCtaTitle": "Punya tautan Scribd yang ingin diubah?",
    "blog.quickCtaDesc": "Tempel URL ke alat kami sekarang untuk mengunduh dokumen Anda sebagai file PDF utuh.",
    "blog.quickCtaBtn": "Buka Pengunduh PDF",

    "footer.tagline": "Alat daring sederhana untuk membaca dan mengunduh dokumen Scribd serta menemukan materi belajar.",
    "footer.quickLinks": "Tautan Cepat",
    "footer.resources": "Sumber Daya",
    "footer.legal": "Hukum & Privasi",
    "footer.scribdGuide": "Panduan Scribd",
    "footer.downloadTips": "Tips Mengunduh",
    "footer.studyResources": "Materi Kuliah",
    "footer.faqs": "Tanya Jawab",
    "footer.rights": "Hak cipta dilindungi. Tidak berafiliasi dengan Scribd Inc.",
    "footer.disclaimer": "Alat ini mengompilasi salindia dan dokumen publik untuk keperluan riset akademis dan penggunaan wajar.",
    "footer.terms": "Ketentuan Layanan",
    "footer.privacy": "Kebijakan Privasi",

    "lang.detectBanner": "Sepertinya Anda lebih nyaman membaca dalam",
    "lang.switchBtn": "Ganti ke",
    "lang.dismiss": "Tetap Bahasa Inggris",
  },

  pt: {
    // pt maps directly to br translations
  } as unknown as Record<string, string>
};

// Fill pt with br as fallback
TRANSLATIONS.pt = TRANSLATIONS.br;

export const CUSTOM_TRANSLATIONS_STORAGE_KEY = "scribd_custom_translations";

export function getCustomTranslations(): Record<string, Record<string, string>> {
  try {
    const raw = localStorage.getItem(CUSTOM_TRANSLATIONS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading custom translations", e);
  }
  return {};
}

export function saveCustomTranslation(lang: SupportedLanguage, key: string, value: string) {
  try {
    const custom = getCustomTranslations();
    if (!custom[lang]) custom[lang] = {};
    custom[lang][key] = value;
    localStorage.setItem(CUSTOM_TRANSLATIONS_STORAGE_KEY, JSON.stringify(custom));
  } catch (e) {
    console.error("Error saving custom translation", e);
  }
}

export function t(key: string, lang: SupportedLanguage = "en"): string {
  // Normalize pt -> br
  const targetLang = lang === "pt" ? "br" : lang;

  // Check custom database overrides first
  const custom = getCustomTranslations();
  if (custom[targetLang]?.[key]) {
    return custom[targetLang][key];
  }

  // Check language dictionary
  const dict = TRANSLATIONS[targetLang];
  if (dict && dict[key]) {
    return dict[key];
  }

  // Fallback to English
  if (TRANSLATIONS.en[key]) {
    return TRANSLATIONS.en[key];
  }

  // Fallback to key itself
  return key;
}

export function detectBrowserLanguage(): SupportedLanguage {
  if (typeof navigator === "undefined") return "en";

  const languages = navigator.languages || [navigator.language || "en"];
  for (const l of languages) {
    const lower = l.toLowerCase();
    if (lower.startsWith("pt") || lower.includes("br")) return "br";
    if (lower.startsWith("es") || lower.includes("mx") || lower.includes("es")) return "es";
    if (lower.startsWith("fr")) return "fr";
    if (lower.startsWith("de")) return "de";
    if (lower.startsWith("id")) return "id";
  }
  return "en";
}
