import { BlogPost } from "../types";

export const BLOG_POSTS: BlogPost[] = [
  // ==========================================
  // GUIDE 1: Complete 6-Language Variations (tg-scribd-guide)
  // ==========================================
  {
    id: "post-1-en",
    slug: "how-to-download-scribd-documents-as-pdf",
    translationGroupId: "tg-scribd-guide",
    language: "en",
    title: "How to Download Scribd Documents as PDF (Complete 2026 Guide)",
    excerpt: "Learn how to safely extract and compile high-resolution Scribd documents, academic research papers, and slide presentations into universal PDF files.",
    category: "Guides",
    readTime: "4 min read",
    date: "September 12, 2026",
    featured: true,
    status: "published",
    author: {
      name: "Marcus Vance",
      role: "Lead Document Systems Architect",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    },
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80",
    content: {
      intro: "Scribd hosts millions of invaluable user-uploaded presentation slides, technical whitepapers, and academic guides. However, reading them reliably offline on e-readers or tablets often requires converting them to clean, standardized PDF files. In this comprehensive tutorial, we cover the exact mechanics of document conversion.",
      tableOfContents: [
        "1. Understanding Scribd Document Structures",
        "2. Step-by-Step: Copying & Pasting the Document URL",
        "3. Verifying Resolution & Page Dimensions",
        "4. PDF vs. Extracted Image Archives",
        "5. Ensuring Fair Use and Personal Archiving",
      ],
      sections: [
        {
          heading: "1. Understanding Scribd Document Structures",
          body: [
            "Documents published on Scribd are typically rendered in modern browsers through vector layer tiles or high-dpi raster canvas elements. When converting a document, the underlying extractor inspects the manifest to locate every sequential page asset.",
            "This ensures that fonts remain crisp, text blocks remain readable, and diagrams maintain their original aspect ratio without ugly clipping or blurriness.",
          ],
          tip: "Pro Tip: Always verify whether the document is categorized as a Document (/document/...) or a Slide Presentation (/presentation/...) for the best output fidelity.",
        },
        {
          heading: "2. Step-by-Step: Copying & Pasting the Document URL",
          body: [
            "To begin, navigate to the target document on Scribd in your browser and copy its address from the URL bar.",
            "Paste the link into the Scribd PDF Downloader input field. The system automatically verifies that the domain and document ID are valid before initiating the extract stream.",
          ],
        },
        {
          heading: "3. Verifying Resolution & Page Dimensions",
          body: [
            "Before saving, our engine processes each canvas slide at its native aspect ratio. Standard PDF documents compile at 72–150 DPI for compact file size, while high-detail presentations retain sharp vector edges for printing.",
          ],
        },
        {
          heading: "4. PDF vs. Extracted Image Archives",
          body: [
            "If your primary goal is printing, offline annotation in Adobe Acrobat, or reading on a Kindle or iPad, choose Merged PDF (.pdf).",
            "If you plan to reuse specific diagram slides in your own keynote or university presentation, choose Page Images (.zip) to receive individually numbered JPG/PNG files.",
          ],
        },
        {
          heading: "5. Ensuring Fair Use and Personal Archiving",
          body: [
            "Always respect copyright law and creator terms. Offline document caching is designed for personal research, educational study, and archiving materials you have legitimate access to review.",
          ],
        },
      ],
    },
  },
  {
    id: "post-1-br",
    slug: "como-baixar-documentos-do-scribd-em-pdf",
    translationGroupId: "tg-scribd-guide",
    language: "br",
    title: "Como Baixar Documentos do Scribd em PDF (Guia Completo 2026)",
    excerpt: "Aprenda como extrair com segurança documentos, artigos acadêmicos e apresentações do Scribd em formato PDF de alta resolução.",
    category: "Guias",
    readTime: "4 min de leitura",
    date: "12 de Setembro de 2026",
    featured: true,
    status: "published",
    author: {
      name: "Marcus Vance",
      role: "Especialista em Sistemas de Documentos",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    },
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80",
    content: {
      intro: "O Scribd reúne milhões de apresentações, apostilas e trabalhos acadêmicos essenciais. Contudo, poder ler esses materiais offline em tablets ou computadores requer sua conversão para arquivos PDF universais e organizados.",
      tableOfContents: [
        "1. Estrutura dos Documentos no Scribd",
        "2. Passo a Passo: Copiando e Colando o Link",
        "3. Resolução e Formatação de Páginas",
        "4. PDF Vetorial vs. Imagens Individuais",
        "5. Uso Justo e Preservação de Estudos",
      ],
      sections: [
        {
          heading: "1. Estrutura dos Documentos no Scribd",
          body: [
            "Os arquivos publicados no Scribd são renderizados como camadas vetoriais ou telas em alta definição. Nosso extrator analisa a estrutura completa para reunir cada folha em ordem correta.",
            "Dessa forma, fontes e diagramas conservam nitidez perfeita para impressão e leitura agradável.",
          ],
          tip: "Dica: Documentos acadêmicos e apresentações mantêm melhor fidelidade quando convertidos diretamente em PDF vetorial.",
        },
        {
          heading: "2. Passo a Passo: Copiando e Colando o Link",
          body: [
            "Abra o documento no Scribd e copie a URL completa na barra do navegador.",
            "Cole o link no campo de download da ferramenta. O sistema verifica a validade do documento e inicia o processamento imediato.",
          ],
        },
        {
          heading: "3. Resolução e Formatação de Páginas",
          body: [
            "Todas as páginas são compiladas mantendo suas proporções originais para garantir leitura nítida em qualquer leitor de PDF.",
          ],
        },
        {
          heading: "4. PDF Vetorial vs. Imagens Individuais",
          body: [
            "Para estudar e destacar textos, o formato PDF padrão é o mais recomendado.",
          ],
        },
        {
          heading: "5. Uso Justo e Preservação de Estudos",
          body: [
            "Lembre-se sempre de utilizar materiais respeitando as normas acadêmicas e os direitos autorais para fins de estudo pessoal.",
          ],
        },
      ],
    },
  },
  {
    id: "post-1-es",
    slug: "como-descargar-documentos-de-scribd-en-pdf",
    translationGroupId: "tg-scribd-guide",
    language: "es",
    title: "Cómo Descargar Documentos de Scribd en PDF (Guía 2026)",
    excerpt: "Descubre cómo compilar presentaciones, monografías y trabajos de Scribd en archivos PDF universales de forma rápida y segura.",
    category: "Guías",
    readTime: "4 min de lectura",
    date: "12 de Septiembre de 2026",
    featured: true,
    status: "published",
    author: {
      name: "Marcus Vance",
      role: "Especialista en Documentos Digitales",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    },
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80",
    content: {
      intro: "Scribd cuenta con una biblioteca inmensa de diapositivas y guías de estudio. Sin embargo, revisarlas sin conexión en dispositivos móviles requiere exportarlas en un formato estándar como PDF.",
      tableOfContents: [
        "1. Estructura de Documentos en Scribd",
        "2. Copiar y Pegar la Dirección Web",
        "3. Calidad y Resolución en PDF",
        "4. Ventajas del Formato PDF Universal",
        "5. Uso Legítimo para Estudios",
      ],
      sections: [
        {
          heading: "1. Estructura de Documentos en Scribd",
          body: [
            "Los documentos se procesan respetando capas tipográficas y gráficos originales para no perder calidad visual.",
          ],
          tip: "Consejo: Verifica siempre la URL completa para una extracción directa sin redirecciones.",
        },
        {
          heading: "2. Copiar y Pegar la Dirección Web",
          body: [
            "Localiza el documento en Scribd y copia su enlace desde el navegador. Pégalo en el formulario para comenzar la descarga.",
          ],
        },
        {
          heading: "3. Calidad y Resolución en PDF",
          body: [
            "El archivo resultante preserva la maquetación original, ideal para imprimir o leer en lectores digitales.",
          ],
        },
      ],
    },
  },
  {
    id: "post-1-fr",
    slug: "comment-telecharger-des-documents-scribd-en-pdf",
    translationGroupId: "tg-scribd-guide",
    language: "fr",
    title: "Comment Télécharger des Documents Scribd en PDF (Guide 2026)",
    excerpt: "Apprenez à convertir vos exposés, thèses et diapositives Scribd en documents PDF universels et clairs pour une lecture hors ligne.",
    category: "Guides",
    readTime: "4 min de lecture",
    date: "12 Septembre 2026",
    featured: true,
    status: "published",
    author: {
      name: "Marcus Vance",
      role: "Architecte Systèmes Documentaires",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    },
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80",
    content: {
      intro: "Scribd héberge une quantité impressionnante de mémoires et présentations universitaires. Les consulter hors connexion nécessite souvent une conversion propre en PDF standardisé.",
      tableOfContents: [
        "1. Comprendre la Structure Scribd",
        "2. Copier-Coller le Lien",
        "3. Résolution Vectorielle et Impression",
        "4. Archivage Personnel et Sécurité",
      ],
      sections: [
        {
          heading: "1. Comprendre la Structure Scribd",
          body: [
            "Notre moteur identifie automatiquement les couches de texte et les graphiques pour produire un fichier PDF fidèle.",
          ],
        },
        {
          heading: "2. Copier-Coller le Lien",
          body: [
            "Copiez simplement l'URL du document depuis votre navigateur et insérez-la dans le champ de téléchargement.",
          ],
        },
      ],
    },
  },
  {
    id: "post-1-de",
    slug: "scribd-dokumente-als-pdf-herunterladen",
    translationGroupId: "tg-scribd-guide",
    language: "de",
    title: "Scribd-Dokumente als PDF Herunterladen (Leitfaden 2026)",
    excerpt: "Erfahren Sie, wie Sie wissenschaftliche Arbeiten, Präsentationen und Skripte von Scribd sicher in verlustfreie PDFs umwandeln.",
    category: "Leitfäden",
    readTime: "4 Min. Lesezeit",
    date: "12. September 2026",
    featured: true,
    status: "published",
    author: {
      name: "Marcus Vance",
      role: "Dokumentensystem-Architekt",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    },
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80",
    content: {
      intro: "Scribd bietet Millionen von Skripten und Präsentationen. Für das konzentrierte Offline-Lernen auf Tablets oder E-Readern ist ein sauberes PDF-Format die beste Lösung.",
      tableOfContents: [
        "1. Aufbau von Scribd-Dokumenten",
        "2. Link Kopieren und Einfügen",
        "3. Auflösung und Vektorqualität",
        "4. Wissenschaftliches Arbeiten Offline",
      ],
      sections: [
        {
          heading: "1. Aufbau von Scribd-Dokumenten",
          body: [
            "Das Extraktionssystem erfasst jede Dokumentenseite in nativer Auflösung für gestochen scharfe Schriftarten beim Ausdruck.",
          ],
        },
        {
          heading: "2. Link Kopieren und Einfügen",
          body: [
            "Kopieren Sie die Webadresse aus dem Browser und fügen Sie diese in unseren Online-Downloader ein.",
          ],
        },
      ],
    },
  },
  {
    id: "post-1-id",
    slug: "cara-mengunduh-dokumen-scribd-menjadi-pdf",
    translationGroupId: "tg-scribd-guide",
    language: "id",
    title: "Cara Mengunduh Dokumen Scribd Menjadi PDF (Panduan 2026)",
    excerpt: "Pelajari cara mengekstrak makalah, presentasi, dan buku digital Scribd ke dalam berkas PDF beresolusi tinggi dengan mudah.",
    category: "Panduan",
    readTime: "4 menit baca",
    date: "12 September 2026",
    featured: true,
    status: "published",
    author: {
      name: "Marcus Vance",
      role: "Arsitek Sistem Dokumen",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    },
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80",
    content: {
      intro: "Scribd menyimpan jutaan dokumen dan presentasi bermanfaat. Mengonversinya menjadi PDF universal memudahkan mahasiswa dan akademisi untuk belajar secara luring.",
      tableOfContents: [
        "1. Memahami Struktur Dokumen Scribd",
        "2. Langkah Menyalin dan Menempel Tautan",
        "3. Memastikan Kualitas Gambar dan Teks",
        "4. Pemanfaatan Belajar Mandiri",
      ],
      sections: [
        {
          heading: "1. Memahami Struktur Dokumen Scribd",
          body: [
            "Ekstraktor kami memproses setiap lembar dokumen sehingga teks tetap tajam dan gambar tidak pecah saat dibaca.",
          ],
        },
        {
          heading: "2. Langkah Menyalin dan Menempel Tautan",
          body: [
            "Salin URL dari bilah peramban, tempelkan ke kolom downloader, lalu klik unduh PDF.",
          ],
        },
      ],
    },
  },

  // ==========================================
  // GUIDE 2: Complete 6-Language Variations (tg-preview-guide)
  // ==========================================
  {
    id: "post-2-en",
    slug: "how-to-preview-a-pdf-before-downloading",
    translationGroupId: "tg-preview-guide",
    language: "en",
    title: "How to Preview a PDF Before Downloading: Safe Reading Practices",
    excerpt: "Why blind downloads are a thing of the past. Explore how modern web document previewers render page thumbnails and metadata before saving.",
    category: "Tutorials",
    readTime: "3 min read",
    date: "September 8, 2026",
    status: "published",
    author: {
      name: "Elena Rostova",
      role: "Frontend UX Specialist",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
    },
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80",
    content: {
      intro: "Downloading large files sight unseen can waste mobile data and clutter your local drive. Document previewers let you verify contents, page count, and legibility before committing to a full download.",
      tableOfContents: [
        "1. The Importance of Visual Page Inspection",
        "2. Checking Document Completeness",
        "3. Bandwidth Optimization for Mobile Users",
      ],
      sections: [
        {
          heading: "1. The Importance of Visual Page Inspection",
          body: [
            "Document thumbnails give immediate feedback on whether the extracted file contains the exact study notes or slides you expected.",
            "Our integrated preview gallery displays each page in sequence, allowing interactive zoom and inspection before triggering the PDF build pipeline.",
          ],
        },
      ],
    },
  },
  {
    id: "post-2-br",
    slug: "como-visualizar-um-pdf-antes-de-baixar",
    translationGroupId: "tg-preview-guide",
    language: "br",
    title: "Como Visualizar um PDF Antes de Baixar: Práticas Seguras",
    excerpt: "Economize dados e espaço visualizando miniaturas completas e metadados antes de salvar o arquivo.",
    category: "Tutoriais",
    readTime: "3 min de leitura",
    date: "8 de Setembro de 2026",
    status: "published",
    author: {
      name: "Elena Rostova",
      role: "Especialista em UX",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
    },
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80",
    content: {
      intro: "Baixar arquivos pesados sem conferir o conteúdo pode consumir sua franquia de dados móveis. O recurso de pré-visualização permite conferir o número de páginas e a formatação antes de concluir.",
      tableOfContents: ["1. Inspeção Visual das Páginas", "2. Verificação de Conteúdo"],
      sections: [
        {
          heading: "1. Inspeção Visual das Páginas",
          body: ["A galeria de miniaturas permite checar cada slide em ordem antes de iniciar a compilação do PDF final."],
        },
      ],
    },
  },
  {
    id: "post-2-es",
    slug: "como-previsualizar-un-pdf-antes-de-descargar",
    translationGroupId: "tg-preview-guide",
    language: "es",
    title: "Cómo Previsualizar un PDF Antes de Descargar",
    excerpt: "Comprueba las páginas y el contenido de tu documento antes de guardar el archivo en tu dispositivo.",
    category: "Tutoriales",
    readTime: "3 min de lectura",
    date: "8 de Septiembre de 2026",
    status: "published",
    author: {
      name: "Elena Rostova",
      role: "Especialista UX",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
    },
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80",
    content: {
      intro: "Verificar el contenido antes de descargar ahorra tiempo y memoria en tu dispositivo móvil.",
      tableOfContents: ["1. Inspección Visual de Páginas"],
      sections: [
        {
          heading: "1. Inspección Visual de Páginas",
          body: ["Las miniaturas te permiten asegurar que el documento contiene exactamente lo que necesitas."],
        },
      ],
    },
  },
  {
    id: "post-2-fr",
    slug: "comment-previsualiser-un-pdf-avant-de-telecharger",
    translationGroupId: "tg-preview-guide",
    language: "fr",
    title: "Comment Prévisualiser un PDF Avant le Téléchargement",
    excerpt: "Vérifiez les miniatures et le nombre de pages avant d'enregistrer le fichier final sur votre appareil.",
    category: "Tutoriels",
    readTime: "3 min de lecture",
    date: "8 Septembre 2026",
    status: "published",
    author: {
      name: "Elena Rostova",
      role: "Spécialiste UX",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
    },
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80",
    content: {
      intro: "La prévisualisation en ligne permet de s'assurer de l'intégralité du document avant de lancer l'exportation.",
      tableOfContents: ["1. Inspection des Miniatures"],
      sections: [
        {
          heading: "1. Inspection des Miniatures",
          body: ["Consultez l'ordre des pages directement dans votre navigateur."],
        },
      ],
    },
  },
  {
    id: "post-2-de",
    slug: "pdf-vorschau-vor-dem-herunterladen",
    translationGroupId: "tg-preview-guide",
    language: "de",
    title: "PDF-Vorschau Vor dem Herunterladen: Tipps & Praxis",
    excerpt: "Überprüfen Sie Seitenanzahl und Folienlayout interaktiv, bevor Sie das Dokument auf Ihrem Gerät speichern.",
    category: "Tutorials",
    readTime: "3 Min. Lesezeit",
    date: "8. September 2026",
    status: "published",
    author: {
      name: "Elena Rostova",
      role: "UX-Spezialistin",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
    },
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80",
    content: {
      intro: "Mit der integrierten Miniaturbildvorschau sehen Sie sofort, ob das Dokument alle relevanten Kapitel enthält.",
      tableOfContents: ["1. Seitenvorschau im Browser"],
      sections: [
        {
          heading: "1. Seitenvorschau im Browser",
          body: ["Sparen Sie Datenvolumen durch eine schnelle optische Überprüfung vor dem Download."],
        },
      ],
    },
  },
  {
    id: "post-2-id",
    slug: "cara-melihat-pratinjau-pdf-sebelum-mengunduh",
    translationGroupId: "tg-preview-guide",
    language: "id",
    title: "Cara Melihat Pratinjau PDF Sebelum Mengunduh",
    excerpt: "Periksa kelengkapan halaman dan tata letak secara interaktif sebelum menyimpan dokumen ke ponsel Anda.",
    category: "Tutorial",
    readTime: "3 menit baca",
    date: "8 September 2026",
    status: "published",
    author: {
      name: "Elena Rostova",
      role: "Spesialis UX",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80",
    },
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80",
    content: {
      intro: "Pratinjau visual memastikan Anda tidak mengunduh berkas yang salah dan menghemat pemakaian kuota data internet.",
      tableOfContents: ["1. Pemeriksaan Visual Halaman"],
      sections: [
        {
          heading: "1. Pemeriksaan Visual Halaman",
          body: ["Galeri pratinjau memudahkan Anda memverifikasi isi dokumen sebelum mengunduh PDF secara penuh."],
        },
      ],
    },
  },

  // ==========================================
  // ADDITIONAL ARTICLES
  // ==========================================
  {
    id: "post-3",
    slug: "best-ways-to-read-documents-offline",
    language: "en",
    title: "Best Ways to Read Academic Papers & Presentations Offline",
    excerpt: "A curated setup guide for researchers, students, and remote workers: optimize your iPad, Kindle, or Remarkable for distraction-free reading.",
    category: "Tips",
    readTime: "5 min read",
    date: "August 29, 2026",
    status: "published",
    author: {
      name: "David Chen",
      role: "Research Tools Contributor",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    },
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80",
    content: {
      intro: "Digital reading fatigue is real. Having clean, standardized PDF files stored locally allows researchers and students to disconnect from Wi-Fi notifications and focus deeply.",
      tableOfContents: [
        "1. E-Ink Displays: Kindle, Kobo, and reMarkable",
        "2. Tablet Annotation Workflows (Notability & GoodNotes)",
        "3. Local Document Tagging & Organization",
      ],
      sections: [
        {
          heading: "1. E-Ink Displays: Kindle, Kobo, and reMarkable",
          body: [
            "E-ink screens offer zero glare and unmatched battery life. When exporting PDFs for e-ink, maintaining clean typography and high contrast is vital.",
            "Scribd PDF Downloader cleans extraneous background artifacts to ensure documents render crisply on monochrome displays.",
          ],
        },
      ],
    },
  },
  {
    id: "post-4",
    slug: "scribd-pdf-download-guide",
    language: "en",
    title: "Scribd PDF Download Guide: Resolving Formatting & Quality Issues",
    excerpt: "Everything you need to know about resolving blurry text, missing vector layers, paywall notifications, and slow scraping speeds.",
    category: "Tech",
    readTime: "6 min read",
    date: "August 15, 2026",
    status: "published",
    author: {
      name: "Marcus Vance",
      role: "Lead Document Systems Architect",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    },
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80",
    content: {
      intro: "Not all documents on Scribd are formatted equally. Some are native PDFs uploaded by users, while others are converted slide decks or raster scans. Here is how our system normalizes every format.",
      tableOfContents: [
        "1. Detecting Document Types (PDF vs. Slides)",
        "2. Handling High-Resolution Canvas Renders",
      ],
      sections: [
        {
          heading: "1. Detecting Document Types (PDF vs. Slides)",
          body: [
            "Scribd handles slide presentations differently from multi-page documents. Our tool normalizes and delivers pure vector output.",
          ],
        },
      ],
    },
  },
];
