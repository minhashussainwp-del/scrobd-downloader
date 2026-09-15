import {
  AdSettings,
  DownloadSettings,
  SiteSettings,
  MediaItem,
  PageContent,
  ContactMessage,
  CustomPage,
  BlogPost,
  SupportedLanguage,
} from "../types";

export const DEFAULT_AD_SETTINGS: AdSettings = {
  enabled: false,
  headerAd: false,
  inFeedAd: false,
  antiAdblock: false,
  preDownloadAd: false,
  preDownloadSeconds: 3,
  postDownloadAd: false,
  newTabOnDownload: false,
  newTabUrl: "https://pdfviewer.org",
  sidebarAd: false,
  popupAd: false,
  popupDelaySeconds: 15,
  adblockNotice: false,
  customBannerHtml: "",
  sponsorName: "CloudPDF Pro Tools",
  sponsorTagline: "Compress, OCR, and convert documents instantly with 1-click cloud workflows.",
  sponsorCta: "Try CloudPDF Free",
};

export const DEFAULT_DOWNLOAD_SETTINGS: DownloadSettings = {
  autoDownloadDefault: true,
  rateLimitPerMin: 15,
  cacheDurationHours: 4,
  maxFileSizeMb: 100,
  allowHighResThumbnails: true,
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: "Scribd Downloader",
  tagline: "Free High-Resolution Document & Slide Deck Converter",
  logoText: "Scribd Downloader",
  noticeBannerEnabled: false,
  noticeBannerText: "📢 Notice: High-speed extraction engine upgraded with 16x parallel workers.",
  contactEmail: "support@scribddownloader.org",
  footerCopyright: "© 2026 Scribd Downloader. Free educational document conversion.",
  headerScripts: "",
  footerScripts: "",
  maintenanceMode: false,
  defaultMetaTitle: "Scribd Downloader - Free, Fast & Lossless Document Converter",
  defaultMetaDescription: "Download Scribd documents, presentations, and research papers as high-resolution PDF files with zero wait time. 100% free and mobile friendly.",
};

export const INITIAL_MEDIA_ITEMS: MediaItem[] = [
  {
    id: "med-1",
    name: "scribd-sample-banner.png",
    url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80",
    sizeBytes: 184500,
    type: "image/png",
    createdAt: "2026-09-01",
  },
  {
    id: "med-2",
    name: "document-preview-artboard.png",
    url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop&q=80",
    sizeBytes: 242000,
    type: "image/png",
    createdAt: "2026-09-05",
  },
  {
    id: "med-3",
    name: "study-guide-cover.png",
    url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1200&auto=format&fit=crop&q=80",
    sizeBytes: 310000,
    type: "image/png",
    createdAt: "2026-09-10",
  },
];

export const INITIAL_CATEGORIES = ["Guides", "Tutorials", "Tech", "Tips", "Research", "Education"];
export const INITIAL_TAGS = ["Scribd", "PDF", "Converter", "Academic", "Presentations", "Offline Reading", "E-Books"];

export const INITIAL_PAGE_CONTENT: PageContent[] = [
  // 1. HOME PAGE - 6 Variations
  {
    id: "home-en",
    pageKey: "home",
    language: "en",
    title: "The Ultimate Free Scribd Downloader",
    subtitle: "Clean, lossless document extraction and offline reading converter",
    content: `Welcome to the ultimate guide and tool for downloading Scribd documents, academic research, and presentations completely free. No registration is required. We understand that accessing educational materials offline is crucial for students, researchers, and professionals. Unlike other tools that make you wait or require paid subscriptions, our smart engine compiles full, high-resolution PDF documents instantly.

In today's fast-paced digital world, having offline access to vital reading materials, research papers, and presentations is more important than ever. Our Scribd Downloader empowers you to save important documents directly to your device, ensuring you can read, study, and share them anytime, anywhere—even without an internet connection.

Whether you're a university student gathering sources for a thesis, a professional saving industry reports, or an avid reader compiling an offline library, this tool is designed for you. It bypasses the frustrating barriers of forced logins and premium paywalls, delivering pure, readable PDF files instantly.`
  },
  {
    id: "home-br",
    pageKey: "home",
    language: "br",
    title: "O Melhor Baixador Gratuito de PDF do Scribd",
    subtitle: "Extração limpa e conversão de documentos para leitura offline",
    content: `Bem-vindo ao melhor guia e ferramenta para baixar documentos, pesquisas acadêmicas e apresentações do Scribd de forma totalmente gratuita. Nenhum cadastro é necessário. Sabemos que o acesso a materiais educativos offline é fundamental para estudantes e profissionais. Nosso motor compila documentos PDF completos em alta resolução instantaneamente.

Tenha acesso offline aos seus arquivos de leitura, apostilas e apresentações. Salve documentos diretamente no seu computador ou celular para estudar quando quiser, mesmo sem conexão com a internet.`
  },
  {
    id: "home-es",
    pageKey: "home",
    language: "es",
    title: "El Mejor Descargador Gratuito de PDF de Scribd",
    subtitle: "Extracción limpia de documentos y conversor para lectura sin conexión",
    content: `Bienvenido a la herramienta y guía definitiva para descargar documentos, investigaciones académicas y presentaciones de Scribd de forma totalmente gratuita. No requiere registro alguno. Nuestro potente motor genera archivos PDF completos en alta resolución en cuestión de segundos.

Guarda presentaciones y documentos directamente en tu dispositivo para estudiar y leer donde y cuando quieras, incluso sin conexión a internet.`
  },
  {
    id: "home-fr",
    pageKey: "home",
    language: "fr",
    title: "Le Téléchargeur Gratuit Ultime de PDF Scribd",
    subtitle: "Extraction propre et conversion hors ligne de vos documents",
    content: `Bienvenue sur le meilleur outil gratuit pour télécharger des documents, mémoires et présentations Scribd sans inscription. Notre système extrait et assemble vos fichiers au format PDF haute résolution en quelques secondes.

Profitez d'un accès hors ligne instantané à vos cours et présentations sur tablette, liseuse ou ordinateur sans abonnement requis.`
  },
  {
    id: "home-de",
    pageKey: "home",
    language: "de",
    title: "Der Ultimative Kostenlose Scribd-PDF-Downloader",
    subtitle: "Verlustfreie Dokumenten-Extraktion und Offline-Lesekonverter",
    content: `Willkommen beim führenden Werkzeug zum kostenlosen Herunterladen von Scribd-Dokumenten, wissenschaftlichen Arbeiten und Präsentationen ohne Anmeldung. Unser intelligentes System erstellt hochauflösende PDF-Dateien in Sekundenschnelle.

Speichern Sie Skripte und Vortragsfolien direkt auf Ihrem Rechner oder Mobilgerät, um auch ohne Internetverbindung jederzeit produktiv lernen zu können.`
  },
  {
    id: "home-id",
    pageKey: "home",
    language: "id",
    title: "Pengunduh PDF Scribd Gratis Terbaik",
    subtitle: "Ekstraksi dokumen jernih dan konverter membaca luring",
    content: `Selamat datang di alat dan panduan terlengkap untuk mengunduh dokumen, penelitian akademik, dan presentasi Scribd secara gratis tanpa perlu registrasi. Mesin canggih kami menyusun dokumen PDF beresolusi tinggi dalam hitungan detik.

Simpan materi kuliah dan presentasi langsung ke ponsel atau laptop Anda agar dapat dipelajari kapan saja tanpa koneksi internet.`
  },

  // 2. ABOUT PAGE - 6 Variations
  {
    id: "about-en",
    pageKey: "about",
    language: "en",
    title: "About Our Project",
    subtitle: "Empowering global learners with open access to digital knowledge",
    content: "We believe that educational resources and knowledge should be freely accessible to everyone. Our free tool was built by a group of open-source enthusiasts to help students and researchers worldwide download presentations and documents for offline studying. Our servers process thousands of requests daily, ensuring fast and reliable access without any tracking or hidden fees."
  },
  {
    id: "about-br",
    pageKey: "about",
    language: "br",
    title: "Sobre o Nosso Projeto",
    subtitle: "Promovendo o acesso livre ao conhecimento educacional",
    content: "Acreditamos que os recursos educacionais e o conhecimento devem ser acessíveis a todos. Nossa ferramenta gratuita foi criada para ajudar estudantes e pesquisadores em todo o mundo a baixar apresentações e documentos para estudo offline, com total rapidez e sem taxas ocultas."
  },
  {
    id: "about-es",
    pageKey: "about",
    language: "es",
    title: "Acerca de Nuestro Proyecto",
    subtitle: "Facilitando el acceso libre al conocimiento educativo",
    content: "Creemos firmemente que los recursos educativos deben estar al alcance de todos. Esta herramienta fue desarrollada para ayudar a estudiantes e investigadores de todo el mundo a descargar presentaciones y apuntes para estudiar sin conexión de forma transparente y gratuita."
  },
  {
    id: "about-fr",
    pageKey: "about",
    language: "fr",
    title: "À Propos de Notre Projet",
    subtitle: "Rendre le savoir et l'éducation accessibles à tous",
    content: "Nous croyons que les ressources pédagogiques doivent être librement accessibles. Notre outil permet aux étudiants et universitaires du monde entier de sauvegarder des documents pour un usage d'apprentissage personnel, en toute sécurité et sans frais."
  },
  {
    id: "about-de",
    pageKey: "about",
    language: "de",
    title: "Über Unser Projekt",
    subtitle: "Freier Zugang zu Wissen für Lernende weltweit",
    content: "Wir sind überzeugt, dass Bildungsmaterialien für alle Menschen frei zugänglich sein sollten. Unser Projekt hilft Forschern und Studierenden dabei, Dokumente für wissenschaftliche Recherchen offline verfügbar zu machen."
  },
  {
    id: "about-id",
    pageKey: "about",
    language: "id",
    title: "Tentang Proyek Kami",
    subtitle: "Mendukung kemudahan akses ilmu pengetahuan bagi semua",
    content: "Kami percaya bahwa materi pendidikan dan pengetahuan harus dapat diakses secara bebas oleh siapa saja. Alat gratis ini dibuat untuk membantu mahasiswa dan peneliti mengunduh dokumen untuk belajar secara luring tanpa dipungut biaya."
  },

  // 3. HOW IT WORKS PAGE - 6 Variations
  {
    id: "how-it-works-en",
    pageKey: "how-it-works",
    language: "en",
    title: "How Scribd Downloader Operates",
    subtitle: "Step-by-step breakdown of document streaming and PDF compilation",
    content: "Our document extractor inspects public manifest streams, processes high-resolution slide canvases, and compiles vector PDF documents with original typographic alignment in under 10 seconds. Simply paste your URL, verify thumbnails, and save your universal PDF."
  },
  {
    id: "how-it-works-br",
    pageKey: "how-it-works",
    language: "br",
    title: "Como Opera o Baixador de PDF",
    subtitle: "Passo a passo da compilação e extração de documentos",
    content: "Nosso extrator analisa os manifestos públicos de slides, processa as páginas em alta definição e compila um PDF vetorial fiel em menos de 10 segundos. Basta colar a URL, conferir as miniaturas e salvar seu arquivo."
  },
  {
    id: "how-it-works-es",
    pageKey: "how-it-works",
    language: "es",
    title: "Cómo Funciona el Descargador",
    subtitle: "Guía paso a paso de extracción y generación de archivos PDF",
    content: "El extractor procesa las diapositivas del documento en alta resolución y genera un documento PDF universal respetando la tipografía original en menos de 10 segundos. Pega tu enlace y descarga directamente."
  },
  {
    id: "how-it-works-fr",
    pageKey: "how-it-works",
    language: "fr",
    title: "Fonctionnement du Téléchargeur",
    subtitle: "Étapes claires pour convertir et assembler votre document",
    content: "Notre moteur d'extraction examine les pages publiques, assemble les couches vectorielles et compile un PDF haute définition en moins de 10 secondes. Collez simplement le lien et sauvegardez votre document."
  },
  {
    id: "how-it-works-de",
    pageKey: "how-it-works",
    language: "de",
    title: "Funktionsweise des PDF-Downloaders",
    subtitle: "Schritt-für-Schritt-Anleitung zur Konvertierung",
    content: "Unsere Engine liest die öffentlichen Folienstrukturen aus und bündelt alle Seiten zu einem sauberen, druckbaren PDF-Dokument in unter 10 Sekunden. Link einfügen, Vorschau prüfen und herunterladen."
  },
  {
    id: "how-it-works-id",
    pageKey: "how-it-works",
    language: "id",
    title: "Cara Kerja Pengunduh PDF",
    subtitle: "Panduan langkah demi langkah ekstraksi dokumen",
    content: "Alat kami membaca data halaman publik, menyusunnya dengan resolusi optimal, dan menghasilkan berkas PDF utuh dalam waktu kurang dari 10 detik. Cukup tempelkan tautan dokumen dan klik unduh."
  },

  // 4. CONTACT PAGE - 6 Variations
  {
    id: "contact-en",
    pageKey: "contact",
    language: "en",
    title: "Contact & Support",
    subtitle: "We are here to assist with document formats and platform questions",
    content: "Our engineering team is here to help with any issues you encounter while using the Scribd Downloader. Whether you are facing problems downloading a specific document, have a feature request, or want to report a bug, please reach out to us."
  },
  {
    id: "contact-br",
    pageKey: "contact",
    language: "br",
    title: "Contato e Suporte",
    subtitle: "Estamos à disposição para ajudar com dúvidas e relatórios",
    content: "Nossa equipe técnica está pronta para tirar suas dúvidas ou resolver problemas no download de documentos. Envie sua mensagem e responderemos em até 24 horas."
  },
  {
    id: "contact-es",
    pageKey: "contact",
    language: "es",
    title: "Contacto y Soporte",
    subtitle: "Estamos aquí para resolver cualquier duda o incidencia",
    content: "Nuestro equipo de soporte te ayudará ante cualquier problema con la descarga de documentos o sugerencia de mejora. Responderemos a tu consulta a la mayor brevedad."
  },
  {
    id: "contact-fr",
    pageKey: "contact",
    language: "fr",
    title: "Contact et Assistance",
    subtitle: "Une question ou un problème ? Notre équipe vous répond",
    content: "Notre équipe technique est à votre écoute pour toute demande d'assistance ou suggestion concernant le service. Nous traitons vos messages sous 24 à 48 heures."
  },
  {
    id: "contact-de",
    pageKey: "contact",
    language: "de",
    title: "Kontakt & Hilfe",
    subtitle: "Wir unterstützen Sie bei Fragen und technischen Anliegen",
    content: "Haben Sie Fragen zur Konvertierung oder Anregungen zu unserer Plattform? Unser Support-Team freut sich über Ihre Nachricht und antwortet zeitnah."
  },
  {
    id: "contact-id",
    pageKey: "contact",
    language: "id",
    title: "Kontak & Bantuan",
    subtitle: "Tim kami siap membantu kendala pengunduhan Anda",
    content: "Jika Anda mengalami kendala dalam mengunduh dokumen tertentu atau memiliki saran fitur baru, silakan hubungi tim pengembang kami."
  },

  // 5. LEGAL & PRIVACY - 6 Variations
  {
    id: "legal-en",
    pageKey: "legal",
    language: "en",
    title: "Legal & Privacy Terms",
    subtitle: "Compliance, fair use principles, and temporary processing policies",
    content: "We respect user privacy and intellectual property rights. Our tool functions as an automated proxy that fetches public assets on behalf of the user. We do not store, host, or distribute copyrighted materials on our servers. All generated files are temporarily cached and automatically deleted shortly after generation. By using this service, you agree to use it strictly for personal, non-commercial, and fair-use educational purposes."
  },
  {
    id: "legal-br",
    pageKey: "legal",
    language: "br",
    title: "Termos Legais e Privacidade",
    subtitle: "Conformidade, uso justo e descarte seguro de arquivos temporários",
    content: "Respeitamos a privacidade do usuário e os direitos de propriedade intelectual. Esta ferramenta opera como um intermediário técnico para leitura de materiais públicos para fins de estudo acadêmico e uso justo. Nenhum arquivo permanente é armazenado em nossos servidores."
  },
  {
    id: "legal-es",
    pageKey: "legal",
    language: "es",
    title: "Términos Legales y Privacidad",
    subtitle: "Privacidad, política de uso justo y eliminación de archivos temporales",
    content: "Respetamos los derechos de autor y la privacidad. Esta herramienta está pensada para fines educativos y de investigación personal amparados en el uso legítimo. Los archivos generados se eliminan automáticamente de forma inmediata."
  },
  {
    id: "legal-fr",
    pageKey: "legal",
    language: "fr",
    title: "Mentions Légales et Confidentialité",
    subtitle: "Engagements de confidentialité et respect du droit d'usage loyal",
    content: "Nous respectons la vie privée et les droits de propriété intellectuelle. Ce service est réservé à un usage privé, pédagogique et de recherche loyale. Aucun document n'est conservé de façon pérenne sur nos serveurs."
  },
  {
    id: "legal-de",
    pageKey: "legal",
    language: "de",
    title: "Rechtliche Hinweise & Datenschutz",
    subtitle: "Datenschutzbestimmungen und Fair-Use-Prinzipien",
    content: "Wir respektieren den Schutz persönlicher Daten und das Urheberrecht. Unser Service dient ausschließlich privaten Bildungs- und Forschungszwecken im Rahmen des Fair-Use. Temporäre Zwischendateien werden unverzüglich gelöscht."
  },
  {
    id: "legal-id",
    pageKey: "legal",
    language: "id",
    title: "Ketentuan Hukum & Privasi",
    subtitle: "Kebijakan privasi dan prinsip penggunaan wajar untuk pendidikan",
    content: "Kami menghormati hak cipta dan privasi pengguna. Layanan ini dibuat khusus untuk keperluan belajar dan riset mandiri. Berkas yang dihasilkan tidak disimpan secara permanen di peladen kami."
  }
];

// Storage keys
const AD_SETTINGS_KEY = "scribd_ad_settings_v1";
const DOWNLOAD_SETTINGS_KEY = "scribd_download_settings_v1";
const SITE_SETTINGS_KEY = "scribd_site_settings_v1";
const MEDIA_ITEMS_KEY = "scribd_media_items_v1";
const CATEGORIES_KEY = "scribd_categories_v1";
const TAGS_KEY = "scribd_tags_v1";
const PAGE_CONTENT_KEY = "scribd_page_content_v5";
const CONTACT_MESSAGES_KEY = "scribd_contact_messages_v1";

export function loadAdSettings(): AdSettings {
  try {
    const raw = localStorage.getItem(AD_SETTINGS_KEY);
    if (raw) return { ...DEFAULT_AD_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_AD_SETTINGS;
}

export function saveAdSettings(settings: AdSettings) {
  try {
    localStorage.setItem(AD_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error(e);
  }
}

export function loadDownloadSettings(): DownloadSettings {
  try {
    const raw = localStorage.getItem(DOWNLOAD_SETTINGS_KEY);
    if (raw) return { ...DEFAULT_DOWNLOAD_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_DOWNLOAD_SETTINGS;
}

export function saveDownloadSettings(settings: DownloadSettings) {
  try {
    localStorage.setItem(DOWNLOAD_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error(e);
  }
}

export function loadSiteSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(SITE_SETTINGS_KEY);
    if (raw) return { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_SITE_SETTINGS;
}

export function saveSiteSettings(settings: SiteSettings) {
  try {
    localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error(e);
  }
}

export function loadMediaItems(): MediaItem[] {
  try {
    const raw = localStorage.getItem(MEDIA_ITEMS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_MEDIA_ITEMS;
}

export function saveMediaItems(items: MediaItem[]) {
  try {
    localStorage.setItem(MEDIA_ITEMS_KEY, JSON.stringify(items));
  } catch (e) {
    console.error(e);
  }
}

export function loadCategories(): string[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_CATEGORIES;
}

export function saveCategories(cats: string[]) {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(cats));
  } catch (e) {
    console.error(e);
  }
}

export function loadTags(): string[] {
  try {
    const raw = localStorage.getItem(TAGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_TAGS;
}

export function saveTags(tags: string[]) {
  try {
    localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
  } catch (e) {
    console.error(e);
  }
}

export function loadPageContent(): PageContent[] {
  try {
    const raw = localStorage.getItem(PAGE_CONTENT_KEY);
    if (raw) {
      const parsed: PageContent[] = JSON.parse(raw);
      const cleaned = parsed.map((p) => {
        if (p.pageKey === "home" || p.id?.startsWith("home-")) {
          const cleanContent = p.content
            ? p.content
                .replace(/^## The Ultimate Free Scribd Downloader\s*\n?/m, "")
                .replace(/^## Download Seguro e Sem Assinatura\s*\n?/m, "")
                .replace(/^## Descargas Rápidas y Sin Registros\s*\n?/m, "")
                .replace(/^## Accès Hors Ligne Garanti\s*\n?/m, "")
                .replace(/^## Schnell, Sicher und Ohne Registrierung\s*\n?/m, "")
                .replace(/^## Akses Luring Tanpa Ribet\s*\n?/m, "")
            : p.content;
          return { ...p, content: cleanContent };
        }
        return p;
      });
      const merged = [...cleaned];
      for (const init of INITIAL_PAGE_CONTENT) {
        if (!merged.some((p) => p.id === init.id || (p.pageKey && p.pageKey === init.pageKey && p.language === init.language))) {
          merged.push(init);
        }
      }
      return merged;
    }
  } catch (e) {
    console.error(e);
  }
  return INITIAL_PAGE_CONTENT;
}

export function savePageContent(content: PageContent[]) {
  try {
    localStorage.setItem(PAGE_CONTENT_KEY, JSON.stringify(content));
  } catch (e) {
    console.error(e);
  }
}

export function loadContactMessages(): ContactMessage[] {
  try {
    const raw = localStorage.getItem(CONTACT_MESSAGES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [];
}

export function saveContactMessages(messages: ContactMessage[]) {
  try {
    localStorage.setItem(CONTACT_MESSAGES_KEY, JSON.stringify(messages));
  } catch (e) {
    console.error(e);
  }
}

// -------------------------------------------------------------
// CUSTOM PAGES STORAGE & PRESETS
// -------------------------------------------------------------
export const CUSTOM_PAGES_KEY = "scribd_custom_pages";
export const ROBOTS_TXT_KEY = "scribd_robots_txt";
export const SITEMAP_XML_KEY = "scribd_sitemap_xml";

export const DEFAULT_CUSTOM_PAGES: CustomPage[] = [
  {
    id: "page-dmca",
    slug: "dmca",
    title: "DMCA Copyright Compliance & Takedown Policy",
    subtitle: "Digital Millennium Copyright Act Notice and Compliance Guidelines",
    status: "published",
    showInHeader: false,
    showInFooter: true,
    language: "all",
    metaTitle: "DMCA Copyright Compliance - Scribd Downloader",
    metaDescription: "Learn about our compliance with the Digital Millennium Copyright Act (DMCA) and how to submit takedown notices.",
    lastModified: "2026-09-15",
    createdAt: "2026-09-01",
    authorName: "Legal Compliance Team",
    content: `# DMCA Copyright Compliance & Notice

Scribd Downloader ("the Service") respects the intellectual property rights of authors, publishers, and content creators. We comply with the provisions of Title 17 of the United States Code, Section 512, commonly known as the **Digital Millennium Copyright Act ("DMCA")**.

## Notice of Non-Hosting & Transient Processing
Our service operates purely as a transient protocol converter and client-side document retrieval utility. We do **not** permanently store, host, re-publish, or index proprietary documents on public databases. All temporary processing files are purged automatically from cache memory every 24 hours.

## Filing a DMCA Notice of Infringement
If you are a copyright owner or authorized representative and believe any content accessed through our service infringes your rights, please provide our designated copyright agent with the following details:

1. **Identification of the copyrighted work**: A description or link to the original copyrighted material.
2. **Identification of the infringing material**: The specific URL or reference location on Scribd.
3. **Contact information**: Your full legal name, company/organization, physical address, telephone number, and official email.
4. **Statement of good faith**: A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.
5. **Statement of accuracy**: A statement under penalty of perjury that the information in your notice is accurate and that you are authorized to act on behalf of the owner.
6. **Physical or electronic signature**: Of the copyright owner or person authorized to act on their behalf.

## Designated Copyright Contact
Please send all official DMCA notices to:
- **Email**: dmca@scribddownloader.org
- **Response Time**: All valid notices are processed within 24–48 business hours.`
  },
  {
    id: "page-faq",
    slug: "faq",
    title: "Frequently Asked Questions & Support",
    subtitle: "Everything you need to know about downloading, converting, and reading documents offline",
    status: "published",
    showInHeader: false,
    showInFooter: true,
    language: "all",
    metaTitle: "Frequently Asked Questions (FAQ) - Scribd Downloader",
    metaDescription: "Answers to common questions about downloading Scribd documents, high-resolution PDFs, supported formats, and troubleshooting.",
    lastModified: "2026-09-15",
    createdAt: "2026-09-05",
    authorName: "Support Team",
    content: `# Frequently Asked Questions (FAQ)

Find answers to common questions about using Scribd Downloader, supported document types, and troubleshooting extraction issues.

## 1. Is Scribd Downloader completely free to use?
Yes! Our online converter is 100% free with no hidden charges, required account registration, or premium subscription tiers. You can download and convert public documents without submitting personal information.

## 2. What types of Scribd documents are supported?
We support:
- Standard multi-page research documents and academic papers
- Presentations and slide decks (converted to landscape or portrait PDFs)
- Technical guides, spreadsheets, and public whitepapers
- Embedded image and vector illustrations

## 3. Why did my download say "Document Not Found or Private"?
Some documents on Scribd are restricted to private accounts or marked by their authors as non-downloadable. If a document is protected by strict DRM or private viewer permissions, our scraper cannot access public slides. Please ensure the document is publicly accessible in a web browser without requiring a login.

## 4. How long does the extraction take?
Our parallel scraper engine retrieves vector tiles concurrently. Most standard documents (10–30 pages) are compiled in under 3 to 5 seconds!

## 5. Are downloaded files safe?
Yes. We generate standard, clean PDF files that contain no executable code or macros. Downloaded documents open safely in Adobe Acrobat, Google Chrome, Apple Preview, and all standard PDF viewers.

## 6. How can I contact support?
If you run into any issues, visit our **Contact Us** page or email our engineering desk at **support@scribddownloader.org**.`
  },
  {
    id: "page-fair-use",
    slug: "fair-use",
    title: "Educational Fair Use & Research Guidelines",
    subtitle: "Understanding fair use rights for academic study, research analysis, and criticism",
    status: "published",
    showInHeader: false,
    showInFooter: true,
    language: "all",
    metaTitle: "Fair Use Guidelines for Research & Education - Scribd Downloader",
    metaDescription: "Learn how the Fair Use doctrine applies to educational research, study materials, and non-commercial document conversion.",
    lastModified: "2026-09-15",
    createdAt: "2026-09-08",
    authorName: "Editorial Staff",
    content: `# Educational Fair Use & Research Guidelines

The doctrine of Fair Use is a vital legal principle codified under **Section 107 of the U.S. Copyright Act**. It permits the limited, non-commercial use of copyrighted materials without requiring prior permission from the rights holder under specific educational and research circumstances.

## The Four Pillars of Fair Use

When determining whether a specific use of study materials constitutes Fair Use, courts evaluate four primary factors:

### 1. Purpose and Character of the Use
Transformative uses for non-profit educational purposes, academic scholarship, commentary, and scientific research weigh heavily in favor of fair use compared to commercial monetization.

### 2. Nature of the Copyrighted Work
Accessing factual, informational, or scientific research materials receives broader fair-use leeway than purely creative or fictional works.

### 3. Amount and Substantiality
Using only the portion of material necessary for academic study or citation is standard educational practice.

### 4. Effect on the Potential Market
Educational offline reading for personal study does not substitute for original market publication or commercial sales.

## Responsible User Conduct
We encourage all users to respect creators' rights. Use downloaded materials responsibly for personal research, educational citation, and offline study.`
  }
];

export function loadCustomPages(): CustomPage[] {
  try {
    const raw = localStorage.getItem(CUSTOM_PAGES_KEY);
    if (raw) {
      const parsed: CustomPage[] = JSON.parse(raw);
      // Merge with default pages if any missing and ensure header is clean
      const merged = parsed.map((p) => {
        if (p.slug === "mcp-docs" || p.slug === "faq") {
          return { ...p, showInHeader: false };
        }
        return p;
      });
      for (const def of DEFAULT_CUSTOM_PAGES) {
        if (!merged.some((p) => p.slug === def.slug || p.id === def.id)) {
          merged.push(def);
        }
      }
      return merged;
    }
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_CUSTOM_PAGES;
}

export function saveCustomPages(pages: CustomPage[]) {
  try {
    localStorage.setItem(CUSTOM_PAGES_KEY, JSON.stringify(pages));
    // Also sync to server in background
    fetch("/api/custom-pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pages }),
    }).catch(() => {});
  } catch (e) {
    console.error(e);
  }
}

// -------------------------------------------------------------
// ROBOTS.TXT & SITEMAP.XML GENERATION & PERSISTENCE
// -------------------------------------------------------------
export function buildDefaultRobotsTxt(origin?: string): string {
  const base = origin || (typeof window !== "undefined" ? window.location.origin : "https://example.com");
  return `# robots.txt for Scribd Downloader
# Auto-generated by Admin SEO Controller

User-agent: *
Allow: /

# Disallow admin control panels and private routes
Disallow: /admin123
Disallow: /admin
Disallow: /admin/*
Disallow: /api/
Disallow: /temp_downloads/

# Sitemap location
Sitemap: ${base}/sitemap.xml
`;
}

export function loadRobotsTxt(origin?: string): string {
  try {
    const saved = localStorage.getItem(ROBOTS_TXT_KEY);
    if (saved && saved.trim()) return saved;
  } catch (e) {
    console.error(e);
  }
  return buildDefaultRobotsTxt(origin);
}

export function saveRobotsTxt(content: string) {
  try {
    localStorage.setItem(ROBOTS_TXT_KEY, content);
    fetch("/api/seo/robots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    }).catch(() => {});
  } catch (e) {
    console.error(e);
  }
}

export function buildDynamicSitemapXml(
  origin: string,
  posts: BlogPost[] = [],
  customPages: CustomPage[] = [],
  languages: SupportedLanguage[] = ["en", "br", "es", "fr", "de", "id"]
): string {
  const base = origin.replace(/\/$/, "");
  const today = new Date().toISOString().split("T")[0];

  const coreRoutes = [
    { path: "", priority: "1.0", changefreq: "daily" },
    { path: "how-it-works", priority: "0.8", changefreq: "weekly" },
    { path: "blog", priority: "0.9", changefreq: "daily" },
    { path: "about", priority: "0.7", changefreq: "monthly" },
    { path: "contact", priority: "0.6", changefreq: "monthly" },
    { path: "privacy", priority: "0.5", changefreq: "monthly" },
    { path: "terms", priority: "0.5", changefreq: "monthly" },
  ];

  const xmlEntries: string[] = [];

  // 1. Core localized routes
  for (const lang of languages) {
    for (const r of coreRoutes) {
      const fullPath = r.path ? `/${lang}/${r.path}` : `/${lang}`;
      xmlEntries.push(`  <url>
    <loc>${base}${fullPath}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`);
    }
  }

  // Root fallback
  xmlEntries.push(`  <url>
    <loc>${base}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`);

  // 2. Published Blog Articles
  for (const post of posts) {
    if (post.status === "draft") continue;
    const postLang = (post.language as string) || "en";
    xmlEntries.push(`  <url>
    <loc>${base}/${postLang}/blog/${post.slug}</loc>
    <lastmod>${post.date || today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  }

  // 3. Published Custom Pages
  for (const page of customPages) {
    if (page.status === "draft") continue;
    const pageLang = page.language && page.language !== "all" ? page.language : "en";
    xmlEntries.push(`  <url>
    <loc>${base}/${pageLang}/${page.slug}</loc>
    <lastmod>${page.lastModified || today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries.join("\n")}
</urlset>`;
}

export function loadSitemapXml(
  origin?: string,
  posts: BlogPost[] = [],
  customPages: CustomPage[] = []
): string {
  try {
    const saved = localStorage.getItem(SITEMAP_XML_KEY);
    if (saved && saved.trim()) return saved;
  } catch (e) {
    console.error(e);
  }
  const base = origin || (typeof window !== "undefined" ? window.location.origin : "https://example.com");
  return buildDynamicSitemapXml(base, posts, customPages);
}

export function saveSitemapXml(content: string) {
  try {
    localStorage.setItem(SITEMAP_XML_KEY, content);
    fetch("/api/seo/sitemap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    }).catch(() => {});
  } catch (e) {
    console.error(e);
  }
}

