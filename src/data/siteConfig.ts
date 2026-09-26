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
  enabled: true,
  // Download Button Ad Settings (Off by default unless admin configures custom ad URL)
  buttonAdEnabled: false,
  buttonAdUrl: "",
  newTabOnDownload: false,
  newTabUrl: "",
  preDownloadAd: false,
  preDownloadSeconds: 3,
  postDownloadAd: false,
  // Core Placements: Top, Left, Bottom, Right, Center
  topAd: false,
  topAdCode: "",
  bottomAd: false,
  bottomAdCode: "",
  leftAd: false,
  leftAdCode: "",
  rightAd: false,
  rightAdCode: "",
  centerAd: false,
  centerAdCode: "",
  // Legacy positions
  headerAd: false,
  headerAdCode: "",
  belowHeroAd: false,
  belowHeroAdCode: "",
  inFeedAd: false,
  inFeedAdCode: "",
  sidebarAd: false,
  sidebarAdCode: "",
  footerAd: false,
  footerAdCode: "",
  popupAd: false,
  popupDelaySeconds: 15,
  antiAdblock: false,
  adblockNotice: false,
  customBannerHtml: "",
  adSenseScript: "",
  sponsorName: "",
  sponsorTagline: "",
  sponsorCta: "",
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
    title: "Scribd Downloader – Free PDF Downloads, No Login Needed",
    subtitle: "Save Scribd documents, presentations, and research papers as clean, readable PDFs. Paste a link, hit download, done.",
    content: `A Scribd downloader is a free online tool that saves public Scribd documents to your device as PDF files. No account, no app install, no subscription. You paste the link to a document, and you get a clean PDF you can read offline, print, or keep in your study folder.

Scribd hosts millions of documents — lecture notes, research papers, slide presentations, manuals, and ebooks. Reading them online is fine, but an offline copy is easier to highlight, annotate, and carry around. That's what this tool is for: turning a Scribd page you can view into a PDF you can keep.

![Illustration of downloading a Scribd document as a PDF on a laptop](/images/home-download-guide.jpg)

## How to download a Scribd document

It takes three steps, and you don't need to create an account at any point.

**1. Copy the document link.** Open the Scribd document in your browser and copy the URL from the address bar.

**2. Paste it above.** Put the link in the download box at the top of this page.

**3. Download the PDF.** The tool reads the document's pages and builds a PDF for you. Save it to your phone, tablet, or computer.

![Step-by-step workflow of converting and downloading documents to PDF](/images/scribd-downloader-3-steps.jpg)

## What you can download

- **Documents and ebooks** — notes, guides, manuals, and books shared publicly on Scribd.
- **Research papers** — academic papers and reports, handy for citations and offline reading.
- **Presentations** — slide decks saved page by page, so nothing gets cut off.
- **Study materials** — past papers, summaries, and class notes.

The output is always a standard PDF, so it opens in any reader — your browser, Adobe Reader, Preview, or your phone's built-in viewer.

![Downloading and viewing high-resolution PDF documents on any device](/images/scribd-downloader-save-pdf-laptop.jpg)

## Why people use a Scribd downloader

- **No login.** There's no account system, so there's nothing to sign up for.
- **Free.** Downloading public documents costs nothing.
- **Clean PDFs.** Pages come out readable and print-friendly.
- **Works everywhere.** It's a website, so it runs on phones, tablets, laptops, and desktops.

## A quick note on copyright

Only download documents you have the right to keep — your own uploads, public-domain works, or materials shared with permission. Creators put real work into their documents. If something helped you, consider supporting the author or getting it through official channels too.

Files you generate here are processed on our server, and temporary working files are cleaned up automatically afterward. We may keep a short-term cached copy to serve repeat requests faster, but we never publish or share your downloads.`
  },
  {
    id: "home-br",
    pageKey: "home",
    language: "br",
    title: "Scribd Downloader – Baixar PDFs Grátis, Sem Login",
    subtitle: "Salve documentos, apresentações e artigos do Scribd em PDF. Cole o link, baixe, pronto.",
    content: `Um baixador de Scribd é uma ferramenta online gratuita que salva documentos públicos do Scribd no seu dispositivo em formato PDF. Sem conta, sem instalar aplicativo, sem assinatura. Você cola o link do documento e recebe um PDF limpo para ler offline, imprimir ou guardar na sua pasta de estudos.

O Scribd reúne milhões de documentos — apostilas, artigos acadêmicos, apresentações de slides, manuais e livros. Ler online funciona, mas ter uma cópia offline facilita grifar, anotar e levar com você. É para isso que esta ferramenta serve: transformar uma página do Scribd que você pode ver em um PDF que você pode guardar.

![Ilustração de download de documento do Scribd em PDF no notebook](/images/home-download-guide.jpg)

## Como baixar um documento do Scribd

São três passos, e você não precisa criar conta em nenhum momento.

**1. Copie o link do documento.** Abra o documento no navegador e copie a URL da barra de endereços.

**2. Cole o link acima.** Coloque o endereço na caixa de download no topo desta página.

**3. Baixe o PDF.** A ferramenta lê as páginas do documento e monta um PDF para você. Salve no celular, tablet ou computador.

![Processo passo a passo para baixar documentos do Scribd em PDF](/images/scribd-downloader-3-steps.jpg)

## O que você pode baixar

- **Documentos e livros** — apostilas, guias, manuais e livros compartilhados publicamente no Scribd.
- **Artigos acadêmicos** — trabalhos e relatórios, úteis para citações e leitura offline.
- **Apresentações** — slides salvos página por página, sem cortes.
- **Materiais de estudo** — provas antigas, resumos e anotações de aula.

O resultado é sempre um PDF padrão, que abre em qualquer leitor.

![Documentos do Scribd salvos em alta resolução no computador](/images/scribd-downloader-save-pdf-laptop.jpg)

## Por que usar um baixador de Scribd

- **Sem login.** Não há sistema de contas, então não há cadastro.
- **Grátis.** Baixar documentos públicos não custa nada.
- **PDFs limpos.** Páginas legíveis e prontas para impressão.
- **Funciona em tudo.** É um site, então roda no celular, tablet e computador.

## Uma nota sobre direitos autorais

Baixe apenas documentos que você tem direito de guardar — seus próprios uploads, obras em domínio público ou materiais compartilhados com permissão. Os arquivos gerados são processados temporariamente e excluídos automaticamente depois. Não guardamos cópias dos seus downloads.`
  },
  {
    id: "home-es",
    pageKey: "home",
    language: "es",
    title: "Scribd Downloader – Descargar PDF Gratis, Sin Registro",
    subtitle: "Guarda documentos, presentaciones y artículos de Scribd en PDF. Pega el enlace, descarga, listo.",
    content: `Un descargador de Scribd es una herramienta online gratuita que guarda documentos públicos de Scribd en tu dispositivo como archivos PDF. Sin cuenta, sin instalar nada, sin suscripción. Pegas el enlace del documento y recibes un PDF limpio para leer sin conexión, imprimir o guardar en tu carpeta de estudio.

Scribd reúne millones de documentos: apuntes, artículos académicos, presentaciones, manuales y libros. Leerlos online está bien, pero una copia sin conexión es más fácil de subrayar, anotar y llevar contigo. Para eso sirve esta herramienta: convertir una página de Scribd que puedes ver en un PDF que puedes guardar.

![Ilustración de descarga de un documento de Scribd en PDF en un portátil](/images/home-download-guide.jpg)

## Cómo descargar un documento de Scribd

Son tres pasos, y no necesitas crear una cuenta en ningún momento.

**1. Copia el enlace del documento.** Abre el documento en tu navegador y copia la URL de la barra de direcciones.

**2. Pégalo arriba.** Coloca el enlace en la casilla de descarga en la parte superior de esta página.

**3. Descarga el PDF.** La herramienta lee las páginas del documento y genera un PDF. Guárdalo en tu móvil, tableta u ordenador.

![Proceso paso a paso para descargar documentos de Scribd en PDF](/images/scribd-downloader-3-steps.jpg)

## Qué puedes descargar

- **Documentos y libros** — apuntes, guías, manuales y libros compartidos públicamente en Scribd.
- **Artículos académicos** — trabajos e informes, útiles para citas y lectura sin conexión.
- **Presentaciones** — diapositivas guardadas página por página, sin recortes.
- **Material de estudio** — exámenes anteriores, resúmenes y apuntes de clase.

El resultado es siempre un PDF estándar, que se abre en cualquier lector.

![Documentos de Scribd guardados en alta resolución en ordenador](/images/scribd-downloader-save-pdf-laptop.jpg)

## Por qué usar un descargador de Scribd

- **Sin registro.** No hay sistema de cuentas, así que no hay nada que crear.
- **Gratis.** Descargar documentos públicos no cuesta nada.
- **PDF limpios.** Páginas legibles y listas para imprimir.
- **Funciona en todo.** Es una web, así que funciona en móvil, tableta y ordenador.

## Una nota sobre derechos de autor

Descarga solo documentos que tengas derecho a guardar: tus propias subidas, obras de dominio público o materiales compartidos con permiso. Los archivos generados se procesan de forma temporal y se eliminan automáticamente después. No conservamos copias de tus descargas.`
  },
  {
    id: "home-fr",
    pageKey: "home",
    language: "fr",
    title: "Scribd Downloader – Télécharger des PDF Gratuitement, Sans Compte",
    subtitle: "Enregistrez documents, présentations et articles Scribd en PDF. Collez le lien, téléchargez, c'est tout.",
    content: `Un téléchargeur Scribd est un outil en ligne gratuit qui enregistre les documents publics de Scribd sur votre appareil au format PDF. Sans compte, sans installation, sans abonnement. Vous collez le lien du document et vous recevez un PDF propre à lire hors ligne, à imprimer ou à garder dans votre dossier d'étude.

Scribd regroupe des millions de documents : notes de cours, articles de recherche, présentations, manuels et livres. Les lire en ligne, c'est bien, mais une copie hors ligne est plus simple à surligner, à annoter et à emporter. C'est à cela que sert cet outil : transformer une page Scribd que vous pouvez voir en un PDF que vous pouvez garder.

![Illustration du téléchargement d'un document Scribd en PDF sur un ordinateur portable](/images/home-download-guide.jpg)

## Comment télécharger un document Scribd

Trois étapes suffisent, et vous n'avez besoin d'aucun compte.

**1. Copiez le lien du document.** Ouvrez le document dans votre navigateur et copiez l'URL depuis la barre d'adresse.

**2. Collez-le ci-dessus.** Mettez le lien dans la zone de téléchargement en haut de cette page.

**3. Téléchargez le PDF.** L'outil lit les pages du document et génère un PDF. Enregistrez-le sur votre téléphone, tablette ou ordinateur.

![Guide étape par étape pour télécharger des documents Scribd en PDF](/images/scribd-downloader-3-steps.jpg)

## Ce que vous pouvez télécharger

- **Documents et livres** — notes, guides, manuels et livres partagés publiquement sur Scribd.
- **Articles de recherche** — travaux et rapports, pratiques pour les citations et la lecture hors ligne.
- **Présentations** — diapositives enregistrées page par page, sans coupure.
- **Supports d'étude** — anciens examens, résumés et notes de cours.

Le résultat est toujours un PDF standard, lisible dans n'importe quel lecteur.

![Documents Scribd enregistrés en haute résolution sur ordinateur](/images/scribd-downloader-save-pdf-laptop.jpg)

## Pourquoi utiliser un téléchargeur Scribd

- **Sans compte.** Il n'y a pas de système de comptes, donc rien à créer.
- **Gratuit.** Télécharger des documents publics ne coûte rien.
- **Des PDF propres.** Des pages lisibles, prêtes à imprimer.
- **Partout.** C'est un site web : il fonctionne sur téléphone, tablette et ordinateur.

## Un mot sur le droit d'auteur

Téléchargez uniquement les documents que vous avez le droit de conserver : vos propres fichiers, des œuvres du domaine public ou des contenus partagés avec autorisation. Les fichiers générés sont traités temporairement puis supprimés automatiquement. Nous ne conservons aucune copie de vos téléchargements.`
  },
  {
    id: "home-de",
    pageKey: "home",
    language: "de",
    title: "Scribd Downloader – Kostenlos PDFs laden, ohne Anmeldung",
    subtitle: "Scribd-Dokumente, Präsentationen und Studienarbeiten als saubere PDFs speichern. Link einfügen, laden, fertig.",
    content: `Ein Scribd-Downloader ist ein kostenloses Online-Tool, das öffentliche Scribd-Dokumente als PDF auf dein Gerät speichert. Kein Konto, keine App-Installation, kein Abo. Du fügst den Link zum Dokument ein und erhältst ein sauberes PDF zum Offline-Lesen, Drucken oder Ablegen in deinem Studienordner.

Scribd versammelt Millionen von Dokumenten: Skripte, wissenschaftliche Arbeiten, Präsentationen, Handbücher und Bücher. Online lesen geht, aber eine Offline-Kopie lässt sich leichter markieren, kommentieren und mitnehmen. Genau dafür ist dieses Tool da: Es macht aus einer Scribd-Seite, die du sehen kannst, ein PDF, das du behalten kannst.

![Illustration: Scribd-Dokument als PDF auf einen Laptop herunterladen](/images/home-download-guide.jpg)

## So lädst du ein Scribd-Dokument herunter

Drei Schritte genügen, ganz ohne Konto.

**1. Link kopieren.** Öffne das Dokument im Browser und kopiere die URL aus der Adresszeile.

**2. Oben einfügen.** Füge den Link in das Download-Feld oben auf dieser Seite ein.

**3. PDF herunterladen.** Das Tool liest die Seiten des Dokuments und erstellt ein PDF. Speichere es auf Handy, Tablet oder Computer.

![Schritt-für-Schritt-Anleitung zum Herunterladen von Scribd-Dokumenten als PDF](/images/scribd-downloader-3-steps.jpg)

## Was du herunterladen kannst

- **Dokumente und Bücher** — Skripte, Anleitungen, Handbücher und Bücher, die öffentlich auf Scribd geteilt werden.
- **Wissenschaftliche Arbeiten** — Aufsätze und Berichte, praktisch für Zitate und zum Offline-Lesen.
- **Präsentationen** — Folien, Seite für Seite gespeichert, nichts wird abgeschnitten.
- **Lernmaterial** — alte Klausuren, Zusammenfassungen und Vorlesungsnotizen.

Das Ergebnis ist immer ein Standard-PDF, das sich in jedem Reader öffnen lässt.

![Heruntergeladene Scribd-PDF-Dateien in hoher Auflösung](/images/scribd-downloader-save-pdf-laptop.jpg)

## Warum ein Scribd-Downloader nützlich ist

- **Ohne Anmeldung.** Es gibt kein Kontosystem, also nichts einzurichten.
- **Kostenlos.** Öffentliche Dokumente zu laden kostet nichts.
- **Saubere PDFs.** Lesbare Seiten, druckfertig aufbereitet.
- **Überall nutzbar.** Es ist eine Website und läuft auf Handy, Tablet und Rechner.

## Ein Hinweis zum Urheberrecht

Lade nur Dokumente herunter, die du behalten darfst: eigene Uploads, gemeinfreie Werke oder Inhalte, die mit Erlaubnis geteilt wurden. Erzeugte Dateien werden nur vorübergehend verarbeitet und danach automatisch gelöscht. Wir speichern keine Kopien deiner Downloads.`
  },
  {
    id: "home-id",
    pageKey: "home",
    language: "id",
    title: "Scribd Downloader – Unduh PDF Gratis, Tanpa Login",
    subtitle: "Simpan dokumen, presentasi, dan makalah Scribd sebagai PDF yang rapi. Tempel tautan, unduh, selesai.",
    content: `Pengunduh Scribd adalah alat online gratis yang menyimpan dokumen publik Scribd ke perangkatmu sebagai berkas PDF. Tanpa akun, tanpa instal aplikasi, tanpa langganan. Kamu tempel tautan dokumen, lalu dapat PDF yang rapi untuk dibaca luring, dicetak, atau disimpan di folder belajarmu.

Scribd menghimpun jutaan dokumen: catatan kuliah, makalah penelitian, presentasi slide, panduan, dan buku. Membacanya online boleh saja, tapi salinan luring lebih mudah ditandai, dianotasi, dan dibawa ke mana-mana. Di situlah gunanya alat ini: mengubah halaman Scribd yang bisa kamu lihat menjadi PDF yang bisa kamu simpan.

![Ilustrasi mengunduh dokumen Scribd sebagai PDF di laptop](/images/home-download-guide.jpg)

## Cara mengunduh dokumen Scribd

Cukup tiga langkah, tanpa perlu membuat akun sama sekali.

**1. Salin tautan dokumen.** Buka dokumen di peramban, lalu salin URL dari bilah alamat.

**2. Tempel di atas.** Masukkan tautan ke kolom unduhan di bagian atas halaman ini.

**3. Unduh PDF-nya.** Alat akan membaca halaman dokumen dan membuatkan PDF untukmu. Simpan ke ponsel, tablet, atau komputermu.

![Panduan langkah demi langkah mengunduh dokumen Scribd menjadi PDF](/images/scribd-downloader-3-steps.jpg)

## Yang bisa kamu unduh

- **Dokumen dan buku** — catatan, panduan, manual, dan buku yang dibagikan secara publik di Scribd.
- **Makalah penelitian** — artikel dan laporan, berguna untuk sitasi dan bacaan luring.
- **Presentasi** — slide tersimpan halaman demi halaman, tidak ada yang terpotong.
- **Materi belajar** — soal ujian lama, rangkuman, dan catatan kuliah.

Hasilnya selalu PDF standar yang bisa dibuka di pembaca mana pun.

![Dokumen Scribd tersimpan dalam resolusi tinggi di komputer](/images/scribd-downloader-save-pdf-laptop.jpg)

## Kenapa memakai pengunduh Scribd

- **Tanpa login.** Tidak ada sistem akun, jadi tidak ada yang perlu didaftarkan.
- **Gratis.** Mengunduh dokumen publik tidak dipungut biaya.
- **PDF yang rapi.** Halaman mudah dibaca dan siap cetak.
- **Bisa di mana saja.** Ini situs web, jadi berjalan di ponsel, tablet, maupun komputer.

## Catatan soal hak cipta

Unduh hanya dokumen yang memang boleh kamu simpan: unggahanmu sendiri, karya domain publik, atau materi yang dibagikan dengan izin. Berkas yang dihasilkan hanya diproses sementara lalu dihapus otomatis. Kami tidak menyimpan salinan unduhanmu.`
  },

  // 2. ABOUT PAGE - 6 Variations
  {
    id: "about-en",
    pageKey: "about",
    language: "en",
    title: "About Scribd Downloader",
    subtitle: "A free tool that saves public Scribd documents as PDFs. No login, no install, no cost.",
    content: `Scribd Downloader is a free web tool for one simple job: turning a public Scribd document page into a PDF you can keep.

Scribd is full of useful material — lecture notes, research papers, slide decks, manuals. Reading them in a browser is fine, but an offline copy is easier to highlight, print, and carry with you. This tool exists to make that copy in a few clicks, without asking you to create an account or install anything.

We don’t ask for your email, we don’t run a membership system, and we don’t keep copies of the files you download. If you only download material you’re allowed to keep — your own uploads, public-domain works, or documents shared with permission — you’re using the tool the way it was meant to be used.`
  },
  {
    id: "about-br",
    pageKey: "about",
    language: "br",
    title: "Sobre o Scribd Downloader",
    subtitle: "Uma ferramenta gratuita que salva documentos públicos do Scribd em PDF. Sem login, sem instalação, sem custo.",
    content: `O Scribd Downloader é uma ferramenta web gratuita com uma função simples: transformar uma página pública de documento do Scribd em um PDF que você pode guardar.

O Scribd está cheio de material útil — anotações de aula, artigos acadêmicos, apresentações de slides, manuais. Ler no navegador é prático, mas uma cópia offline é mais fácil de destacar, imprimir e levar com você. Esta ferramenta existe para criar essa cópia em poucos cliques, sem pedir conta ou instalação.

Não pedimos seu e-mail, não temos sistema de assinatura e não guardamos cópias dos arquivos que você baixa. Se você baixar apenas material que tem permissão para guardar — seus próprios envios, obras em domínio público ou documentos compartilhados com autorização — está usando a ferramenta como ela foi feita para ser usada.`
  },
  {
    id: "about-es",
    pageKey: "about",
    language: "es",
    title: "Acerca de Scribd Downloader",
    subtitle: "Una herramienta gratuita que guarda documentos públicos de Scribd en PDF. Sin registro, sin instalación, sin costo.",
    content: `Scribd Downloader es una herramienta web gratuita con una función simple: convertir una página pública de Scribd en un PDF que puedes conservar.

Scribd está lleno de material útil: apuntes de clase, artículos académicos, presentaciones, manuales. Leerlos en el navegador está bien, pero una copia sin conexión es más fácil de subrayar, imprimir y llevar contigo. Esta herramienta existe para crear esa copia en pocos clics, sin pedirte una cuenta ni instalar nada.

No pedimos tu correo, no tenemos sistema de membresías y no guardamos copias de los archivos que descargas. Si solo descargas material que tienes permitido guardar — tus propias subidas, obras de dominio público o documentos compartidos con permiso — estás usando la herramienta como fue pensada.`
  },
  {
    id: "about-fr",
    pageKey: "about",
    language: "fr",
    title: "À propos de Scribd Downloader",
    subtitle: "Un outil gratuit qui enregistre les documents publics Scribd en PDF. Sans compte, sans installation, sans frais.",
    content: `Scribd Downloader est un outil web gratuit avec une mission simple : transformer une page publique d’un document Scribd en un PDF à conserver.

Scribd regorge de contenus utiles — notes de cours, articles de recherche, présentations, manuels. Les lire dans un navigateur convient, mais une copie hors ligne est plus facile à surligner, imprimer et emporter. Cet outil existe pour créer cette copie en quelques clics, sans demander de compte ni d’installation.

Nous ne demandons pas votre e-mail, nous n’avons pas de système d’abonnement et nous ne conservons pas de copies des fichiers téléchargés. Si vous ne téléchargez que des contenus que vous êtes autorisé à garder — vos propres envois, des œuvres du domaine public ou des documents partagés avec autorisation — vous utilisez l’outil comme il a été conçu.`
  },
  {
    id: "about-de",
    pageKey: "about",
    language: "de",
    title: "Über Scribd Downloader",
    subtitle: "Ein kostenloses Tool, das öffentliche Scribd-Dokumente als PDF speichert. Ohne Anmeldung, ohne Installation, ohne Kosten.",
    content: `Scribd Downloader ist ein kostenloses Web-Tool mit einer einfachen Aufgabe: eine öffentliche Scribd-Dokumentseite in ein PDF zu verwandeln, das du behalten kannst.

Scribd ist voller nützlicher Inhalte — Vorlesungsnotizen, Forschungsarbeiten, Präsentationen, Handbücher. Im Browser zu lesen ist in Ordnung, aber eine Offline-Kopie lässt sich leichter markieren, drucken und mitnehmen. Dieses Tool erstellt diese Kopie mit wenigen Klicks, ohne dass du ein Konto anlegen oder etwas installieren musst.

Wir fragen nicht nach deiner E-Mail, wir haben kein Mitgliedssystem und wir speichern keine Kopien deiner Downloads. Wenn du nur Material herunterlädst, das du behalten darfst — deine eigenen Uploads, gemeinfreie Werke oder Dokumente, die mit Erlaubnis geteilt wurden — nutzt du das Tool so, wie es gedacht ist.`
  },
  {
    id: "about-id",
    pageKey: "about",
    language: "id",
    title: "Tentang Scribd Downloader",
    subtitle: "Alat gratis untuk menyimpan dokumen publik Scribd sebagai PDF. Tanpa login, tanpa instalasi, tanpa biaya.",
    content: `Scribd Downloader adalah alat web gratis dengan satu fungsi sederhana: mengubah halaman dokumen publik Scribd menjadi PDF yang bisa kamu simpan.

Scribd penuh dengan materi bermanfaat — catatan kuliah, makalah penelitian, presentasi slide, manual. Membacanya di browser memang bisa, tetapi salinan offline lebih mudah ditandai, dicetak, dan dibawa. Alat ini ada untuk membuat salinan itu dalam beberapa klik, tanpa meminta kamu membuat akun atau menginstal apa pun.

Kami tidak meminta email-mu, tidak menjalankan sistem keanggotaan, dan tidak menyimpan salinan berkas yang kamu unduh. Jika kamu hanya mengunduh materi yang memang boleh disimpan — unggahanmu sendiri, karya domain publik, atau dokumen yang dibagikan dengan izin — kamu sudah memakai alat ini sebagaimana mestinya.`
  },

  // 3. HOW IT WORKS PAGE - 6 Variations
  {
    id: "how-it-works-en",
    pageKey: "how-it-works",
    language: "en",
    title: "How to Download Scribd Documents as PDF",
    subtitle: "Three simple steps between you and an offline copy. No account, no software to install.",
    content: `Downloading a Scribd document with this tool takes less than a minute. Here’s exactly how it works, plus a few tips for when things don’t go as planned.

## The three steps

**1. Copy the document link.** Open the Scribd document in your browser and copy the URL from the address bar.

**2. Paste it into the download box.** You’ll find the box at the top of the homepage. Paste the link and press the download button.

**3. Save your PDF.** The tool reads the document’s pages and builds a PDF file for you. When it’s ready, save it to your phone, tablet, or computer.

## What happens behind the scenes

When you paste a link, the tool opens the public document page, reads its pages one by one, and assembles them into a standard PDF. Two things are worth knowing: only documents that are publicly viewable can be processed, and the result is always a regular PDF that opens in any reader.

## Tips for better results

- **Use the full document URL.** The complete address-bar link is the safest bet — shortened links sometimes miss the document ID.
- **Check that the document is public.** Private or paywalled documents can’t be downloaded. If you can’t view it in your browser without logging in, the tool can’t process it either.
- **One document at a time.** Finish one download before starting the next for the most reliable results.
- **Large documents take longer.** A 200-page manual needs more time than a 10-slide deck. Give it a moment.

## If a download fails

- **“Document not found”** — double-check the URL and make sure you copied the whole link.
- **The download never starts** — the document may be private, removed, or temporarily unavailable. Try opening it in your browser first.
- **The PDF looks wrong** — some documents use unusual layouts. Try again; if pages are still missing, the source document itself may be incomplete.
- **Still stuck?** Send us the link through the contact page and we’ll take a look.

## A note on fair use

This tool is meant for documents you’re allowed to keep: your own uploads, public-domain works, study materials shared with permission, and personal study under fair use. Please don’t use it to redistribute other people’s copyrighted work.`
  },
  {
    id: "how-it-works-br",
    pageKey: "how-it-works",
    language: "br",
    title: "Como Baixar Documentos do Scribd em PDF",
    subtitle: "Três passos simples até a sua cópia offline. Sem conta, sem instalar nada.",
    content: `Baixar um documento do Scribd com esta ferramenta leva menos de um minuto. Veja exatamente como funciona, além de algumas dicas para quando algo não sair como esperado.

## Os três passos

**1. Copie o link do documento.** Abra o documento do Scribd no navegador e copie o URL da barra de endereços.

**2. Cole na caixa de download.** Ela está no topo da página inicial. Cole o link e aperte o botão de download.

**3. Salve seu PDF.** A ferramenta lê as páginas do documento e monta um arquivo PDF para você. Quando estiver pronto, salve no celular, tablet ou computador.

## O que acontece por trás

Ao colar um link, a ferramenta abre a página pública do documento, lê as páginas uma a uma e as reúne em um PDF padrão. Vale saber duas coisas: só documentos visíveis publicamente podem ser processados, e o resultado é sempre um PDF comum que abre em qualquer leitor.

## Dicas para melhores resultados

- **Use o URL completo do documento.** O link completo da barra de endereços é a opção mais segura.
- **Confira se o documento é público.** Documentos privados ou pagos não podem ser baixados.
- **Um documento por vez.** Termine um download antes de começar o próximo.
- **Documentos grandes demoram mais.** Um manual de 200 páginas precisa de mais tempo que uma apresentação de 10 slides.

## Se o download falhar

- **“Documento não encontrado”** — confira o URL e veja se copiou o link inteiro.
- **O download nunca começa** — o documento pode ser privado, removido ou temporariamente indisponível. Tente abri-lo no navegador primeiro.
- **O PDF saiu errado** — alguns documentos têm layouts incomuns. Tente de novo.
- **Ainda travado?** Envie o link pela página de contato.

## Uma nota sobre uso justo

Esta ferramenta é para documentos que você tem permissão para guardar: seus próprios envios, obras em domínio público e materiais compartilhados com autorização. Não a use para redistribuir obras protegidas de outras pessoas.`
  },
  {
    id: "how-it-works-es",
    pageKey: "how-it-works",
    language: "es",
    title: "Cómo Descargar Documentos de Scribd en PDF",
    subtitle: "Tres simples pasos hasta tu copia sin conexión. Sin cuenta, sin instalar nada.",
    content: `Descargar un documento de Scribd con esta herramienta toma menos de un minuto. Aquí explicamos exactamente cómo funciona, más algunos consejos para cuando algo no sale como esperabas.

## Los tres pasos

**1. Copia el enlace del documento.** Abre el documento de Scribd en tu navegador y copia el URL de la barra de direcciones.

**2. Pégalo en la casilla de descarga.** Está en la parte superior de la página principal. Pega el enlace y pulsa el botón de descarga.

**3. Guarda tu PDF.** La herramienta lee las páginas del documento y crea un archivo PDF. Cuando esté listo, guárdalo en tu teléfono, tableta o computadora.

## Qué ocurre entre bastidores

Al pegar un enlace, la herramienta abre la página pública del documento, lee sus páginas una por una y las reúne en un PDF estándar. Conviene saber dos cosas: solo se pueden procesar documentos visibles públicamente, y el resultado siempre es un PDF normal que abre en cualquier lector.

## Consejos para mejores resultados

- **Usa el URL completo del documento.** El enlace completo de la barra de direcciones es la opción más segura.
- **Verifica que el documento sea público.** Los documentos privados o de pago no se pueden descargar.
- **Un documento a la vez.** Termina una descarga antes de empezar la siguiente.
- **Los documentos grandes tardan más.** Un manual de 200 páginas necesita más tiempo que una presentación de 10 diapositivas.

## Si falla la descarga

- **“Documento no encontrado”** — revisa el URL y asegúrate de haber copiado el enlace completo.
- **La descarga nunca empieza** — el documento puede ser privado, eliminado o no disponible temporalmente. Intenta abrirlo en tu navegador primero.
- **El PDF se ve mal** — algunos documentos tienen diseños poco comunes. Inténtalo de nuevo.
- **¿Sigues atascado?** Envíanos el enlace desde la página de contacto.

## Una nota sobre el uso justo

Esta herramienta es para documentos que tienes permitido conservar: tus propias subidas, obras de dominio público y materiales compartidos con permiso. No la uses para redistribuir obras protegidas de otras personas.`
  },
  {
    id: "how-it-works-fr",
    pageKey: "how-it-works",
    language: "fr",
    title: "Comment Télécharger des Documents Scribd en PDF",
    subtitle: "Trois étapes simples vers votre copie hors ligne. Sans compte, sans rien installer.",
    content: `Télécharger un document Scribd avec cet outil prend moins d’une minute. Voici exactement comment ça marche, plus quelques conseils pour les cas où ça ne se passe pas comme prévu.

## Les trois étapes

**1. Copiez le lien du document.** Ouvrez le document Scribd dans votre navigateur et copiez l’URL de la barre d’adresse.

**2. Collez-le dans la zone de téléchargement.** Elle se trouve en haut de la page d’accueil. Collez le lien et appuyez sur le bouton de téléchargement.

**3. Enregistrez votre PDF.** L’outil lit les pages du document et assemble un fichier PDF. Une fois prêt, enregistrez-le sur votre téléphone, tablette ou ordinateur.

## Ce qui se passe en coulisses

Quand vous collez un lien, l’outil ouvre la page publique du document, lit ses pages une à une et les assemble en un PDF standard. Deux choses à savoir : seuls les documents visibles publiquement peuvent être traités, et le résultat est toujours un PDF ordinaire qui s’ouvre dans n’importe quel lecteur.

## Conseils pour de meilleurs résultats

- **Utilisez l’URL complète du document.** Le lien complet de la barre d’adresse est le choix le plus sûr.
- **Vérifiez que le document est public.** Les documents privés ou payants ne peuvent pas être téléchargés.
- **Un document à la fois.** Terminez un téléchargement avant de commencer le suivant.
- **Les gros documents prennent plus de temps.** Un manuel de 200 pages demande plus de temps qu’un diaporama de 10 slides.

## Si le téléchargement échoue

- **« Document introuvable »** — vérifiez l’URL et assurez-vous d’avoir copié le lien entier.
- **Le téléchargement ne démarre jamais** — le document est peut-être privé, supprimé ou temporairement indisponible. Essayez d’abord de l’ouvrir dans votre navigateur.
- **Le PDF semble incorrect** — certains documents ont des mises en page inhabituelles. Réessayez.
- **Toujours bloqué ?** Envoyez-nous le lien via la page de contact.

## Un mot sur l’usage loyal

Cet outil est destiné aux documents que vous êtes autorisé à conserver : vos propres envois, des œuvres du domaine public et des contenus partagés avec autorisation. Ne l’utilisez pas pour redistribuer les œuvres protégées d’autrui.`
  },
  {
    id: "how-it-works-de",
    pageKey: "how-it-works",
    language: "de",
    title: "So lädst du Scribd-Dokumente als PDF herunter",
    subtitle: "Drei einfache Schritte bis zu deiner Offline-Kopie. Ohne Konto, ohne Installation.",
    content: `Ein Scribd-Dokument mit diesem Tool herunterzuladen dauert weniger als eine Minute. Hier erfährst du genau, wie es funktioniert — plus ein paar Tipps für den Fall, dass etwas nicht klappt.

## Die drei Schritte

**1. Kopiere den Dokument-Link.** Öffne das Scribd-Dokument in deinem Browser und kopiere die URL aus der Adressleiste.

**2. Füge ihn in das Download-Feld ein.** Du findest es oben auf der Startseite. Füge den Link ein und drücke den Download-Button.

**3. Speichere dein PDF.** Das Tool liest die Seiten des Dokuments und erstellt daraus eine PDF-Datei. Wenn sie fertig ist, speichere sie auf Handy, Tablet oder Computer.

## Was im Hintergrund passiert

Wenn du einen Link einfügst, öffnet das Tool die öffentliche Dokumentseite, liest die Seiten einzeln aus und fügt sie zu einem Standard-PDF zusammen. Zwei Dinge solltest du wissen: Nur öffentlich sichtbare Dokumente können verarbeitet werden, und das Ergebnis ist immer ein normales PDF, das jeder Reader öffnet.

## Tipps für bessere Ergebnisse

- **Nutze die vollständige Dokument-URL.** Der komplette Link aus der Adressleiste ist die sicherste Wahl.
- **Prüfe, ob das Dokument öffentlich ist.** Private oder kostenpflichtige Dokumente können nicht heruntergeladen werden.
- **Ein Dokument nach dem anderen.** Schließe einen Download ab, bevor du den nächsten startest.
- **Große Dokumente brauchen länger.** Ein 200-seitiges Handbuch dauert länger als eine Präsentation mit 10 Folien.

## Wenn ein Download fehlschlägt

- **„Dokument nicht gefunden“** — überprüfe die URL und stelle sicher, dass du den kompletten Link kopiert hast.
- **Der Download startet nie** — das Dokument ist vielleicht privat, gelöscht oder vorübergehend nicht verfügbar. Öffne es zuerst in deinem Browser.
- **Das PDF sieht falsch aus** — manche Dokumente haben ungewöhnliche Layouts. Versuch es erneut.
- **Immer noch festgefahren?** Schick uns den Link über die Kontaktseite.

## Ein Hinweis zur fairen Nutzung

Dieses Tool ist für Dokumente gedacht, die du behalten darfst: deine eigenen Uploads, gemeinfreie Werke und Materialien, die mit Erlaubnis geteilt wurden. Nutze es bitte nicht, um urheberrechtlich geschützte Werke anderer weiterzuverbreiten.`
  },
  {
    id: "how-it-works-id",
    pageKey: "how-it-works",
    language: "id",
    title: "Cara Mengunduh Dokumen Scribd sebagai PDF",
    subtitle: "Tiga langkah mudah menuju salinan offline. Tanpa akun, tanpa instal perangkat lunak.",
    content: `Mengunduh dokumen Scribd dengan alat ini memakan waktu kurang dari satu menit. Berikut penjelasan persis cara kerjanya, plus beberapa tips jika terjadi kendala.

## Tiga langkahnya

**1. Salin tautan dokumen.** Buka dokumen Scribd di browser lalu salin URL dari bilah alamat.

**2. Tempel ke kotak unduhan.** Kotaknya ada di bagian atas beranda. Tempel tautan lalu tekan tombol unduh.

**3. Simpan PDF-mu.** Alat akan membaca halaman-halaman dokumen dan menyusun berkas PDF untukmu. Setelah siap, simpan ke ponsel, tablet, atau komputer.

## Yang terjadi di balik layar

Saat kamu menempel tautan, alat membuka halaman publik dokumen, membaca halamannya satu per satu, lalu merakitnya menjadi PDF standar. Dua hal perlu kamu tahu: hanya dokumen yang terlihat publik yang bisa diproses, dan hasilnya selalu PDF biasa yang bisa dibuka di pembaca mana pun.

## Tips agar hasilnya bagus

- **Gunakan URL dokumen yang lengkap.** Tautan lengkap dari bilah alamat adalah pilihan paling aman.
- **Pastikan dokumen bersifat publik.** Dokumen privat atau berbayar tidak bisa diunduh.
- **Satu dokumen dalam satu waktu.** Selesaikan satu unduhan sebelum memulai berikutnya.
- **Dokumen besar butuh waktu lebih lama.** Manual 200 halaman jelas lebih lama daripada presentasi 10 slide.

## Jika unduhan gagal

- **“Dokumen tidak ditemukan”** — periksa URL dan pastikan kamu menyalin tautan secara utuh.
- **Unduhan tidak kunjung mulai** — dokumen mungkin privat, dihapus, atau sedang tidak tersedia. Coba buka dulu di browser.
- **PDF terlihat aneh** — sebagian dokumen memakai tata letak yang tidak umum. Coba lagi.
- **Masih buntu?** Kirim tautannya lewat halaman kontak.

## Catatan tentang penggunaan wajar

Alat ini ditujukan untuk dokumen yang memang boleh kamu simpan: unggahanmu sendiri, karya domain publik, dan materi yang dibagikan dengan izin. Jangan memakainya untuk menyebarluaskan karya berhak cipta milik orang lain.`
  },

  // 4. CONTACT PAGE - 6 Variations
  {
    id: "contact-en",
    pageKey: "contact",
    language: "en",
    title: "Contact Us",
    subtitle: "Questions, broken links, or copyright requests — send us a message below.",
    content: `Use the form to report a problem with a download, ask a question, or request the removal of a copyrighted document.

Messages are reviewed by our team. To help us respond faster, include the full Scribd link and a short description of what happened.`
  },
  {
    id: "contact-br",
    pageKey: "contact",
    language: "br",
    title: "Fale Conosco",
    subtitle: "Dúvidas, links quebrados ou solicitações de direitos autorais — envie uma mensagem abaixo.",
    content: `Use o formulário para relatar um problema com um download, fazer uma pergunta ou solicitar a remoção de um documento protegido por direitos autorais.

As mensagens são revisadas pela nossa equipe. Para nos ajudar a responder mais rápido, inclua o link completo do Scribd e uma breve descrição do que aconteceu.`
  },
  {
    id: "contact-es",
    pageKey: "contact",
    language: "es",
    title: "Contáctanos",
    subtitle: "Preguntas, enlaces rotos o solicitudes de derechos de autor: envíanos un mensaje.",
    content: `Usa el formulario para reportar un problema con una descarga, hacer una pregunta o solicitar la eliminación de un documento protegido.

Los mensajes son revisados por nuestro equipo. Para ayudarnos a responder más rápido, incluye el enlace completo de Scribd y una breve descripción de lo ocurrido.`
  },
  {
    id: "contact-fr",
    pageKey: "contact",
    language: "fr",
    title: "Nous Contacter",
    subtitle: "Questions, liens cassés ou demandes de droits d’auteur — envoyez-nous un message ci-dessous.",
    content: `Utilisez le formulaire pour signaler un problème de téléchargement, poser une question ou demander le retrait d’un document protégé.

Les messages sont examinés par notre équipe. Pour nous aider à répondre plus vite, incluez le lien Scribd complet et une courte description du problème.`
  },
  {
    id: "contact-de",
    pageKey: "contact",
    language: "de",
    title: "Kontakt",
    subtitle: "Fragen, defekte Links oder Urheberrechtsanfragen — schreib uns einfach eine Nachricht.",
    content: `Nutze das Formular, um ein Problem mit einem Download zu melden, eine Frage zu stellen oder die Entfernung eines urheberrechtlich geschützten Dokuments zu beantragen.

Nachrichten werden von unserem Team geprüft. Damit wir schneller antworten können, füge bitte den vollständigen Scribd-Link und eine kurze Beschreibung des Problems hinzu.`
  },
  {
    id: "contact-id",
    pageKey: "contact",
    language: "id",
    title: "Hubungi Kami",
    subtitle: "Pertanyaan, tautan rusak, atau permintaan hak cipta — kirim pesan lewat formulir di bawah.",
    content: `Gunakan formulir untuk melaporkan masalah unduhan, bertanya, atau meminta penghapusan dokumen berhak cipta.

Pesan akan ditinjau oleh tim kami. Agar kami bisa merespons lebih cepat, sertakan tautan Scribd lengkap dan deskripsi singkat tentang apa yang terjadi.`
  },

  // 5. LEGAL & PRIVACY - 6 Variations
  {
    id: "legal-en",
    pageKey: "legal",
    language: "en",
    title: "Privacy & Terms",
    subtitle: "How we handle data, and the rules for using this tool.",
    content: `Short version: we don’t ask for accounts or personal details, downloaded files are processed on our server and temporary working files are cleaned up afterward, and you’re expected to use the tool only for material you’re allowed to keep. The details are in the sections below.`
  },
  {
    id: "legal-br",
    pageKey: "legal",
    language: "br",
    title: "Privacidade & Termos",
    subtitle: "Como tratamos dados e as regras para usar esta ferramenta.",
    content: `Resumo: não pedimos contas nem dados pessoais, os arquivos baixados são processados temporariamente e excluídos em seguida, e esperamos que você use a ferramenta apenas para material que tem permissão para guardar. Os detalhes estão nas seções abaixo.`
  },
  {
    id: "legal-es",
    pageKey: "legal",
    language: "es",
    title: "Privacidad y Términos",
    subtitle: "Cómo tratamos los datos y las reglas para usar esta herramienta.",
    content: `En resumen: no pedimos cuentas ni datos personales, los archivos descargados se procesan temporalmente y se eliminan después, y se espera que uses la herramienta solo para material que tienes permitido conservar. Los detalles están en las secciones siguientes.`
  },
  {
    id: "legal-fr",
    pageKey: "legal",
    language: "fr",
    title: "Confidentialité & Conditions",
    subtitle: "Comment nous traitons les données, et les règles d’utilisation de cet outil.",
    content: `En bref : nous ne demandons ni compte ni données personnelles, les fichiers téléchargés sont traités temporairement puis supprimés, et vous êtes censé n’utiliser l’outil que pour des contenus que vous êtes autorisé à conserver. Les détails figurent dans les sections ci-dessous.`
  },
  {
    id: "legal-de",
    pageKey: "legal",
    language: "de",
    title: "Datenschutz & Bedingungen",
    subtitle: "Wie wir mit Daten umgehen und die Regeln für die Nutzung dieses Tools.",
    content: `Kurz gesagt: Wir verlangen weder Konten noch persönliche Daten, heruntergeladene Dateien werden nur vorübergehend verarbeitet und danach gelöscht, und du solltest das Tool nur für Material nutzen, das du behalten darfst. Details findest du in den Abschnitten unten.`
  },
  {
    id: "legal-id",
    pageKey: "legal",
    language: "id",
    title: "Privasi & Ketentuan",
    subtitle: "Cara kami menangani data, dan aturan penggunaan alat ini.",
    content: `Singkatnya: kami tidak meminta akun atau data pribadi, berkas yang diunduh hanya diproses sementara lalu dihapus, dan kamu diharapkan memakai alat ini hanya untuk materi yang memang boleh disimpan. Detailnya ada di bagian bawah.`
  },
  {
    id: "home-hi",
    pageKey: "home",
    language: "hi",
    title: "Scribd Downloader – फ्री में Scribd PDF डाउनलोड करें, बिना लॉगिन",
    subtitle: "Scribd के दस्तावेज़, प्रस्तुतियाँ और शोध पत्र साफ़ PDF में सहेजें। लिंक पेस्ट करें, डाउनलोड करें।",
    content: `Scribd Downloader एक मुफ्त ऑनलाइन टूल है जो सार्वजनिक Scribd दस्तावेज़ों को आपके डिवाइस पर PDF फ़ाइल के रूप में सहेजता है। कोई खाता नहीं, कोई ऐप इंस्टॉल नहीं, कोई सदस्यता नहीं। आप दस्तावेज़ का लिंक पेस्ट करते हैं, और आपको एक साफ़ PDF मिलता है जिसे आप ऑफ़लाइन पढ़ सकते हैं, प्रिंट कर सकते हैं या अपने अध्ययन फ़ोल्डर में रख सकते हैं।

Scribd पर लाखों दस्तावेज़ उपलब्ध हैं — व्याख्यान नोट्स, शोध पत्र, स्लाइड प्रस्तुतियाँ, मैनुअल और ई-पुस्तकें। उन्हें ऑनलाइन पढ़ना ठीक है, लेकिन एक ऑफ़लाइन प्रति को हाइलाइट करना, एनोटेट करना और साथ ले जाना आसान होता है। यह टूल इसी काम के लिए बनाया गया है: Scribd पृष्ठ को एक ऐसी PDF में बदलना जिसे आप सहेज सकें।

![Illustration of downloading a Scribd document as a PDF on a laptop](/images/home-download-guide.jpg)

## Scribd दस्तावेज़ कैसे डाउनलोड करें

इसमें केवल तीन आसान चरण हैं, और आपको किसी भी समय खाता बनाने की आवश्यकता नहीं है।

**1. दस्तावेज़ का लिंक कॉपी करें।** अपने ब्राउज़र में Scribd दस्तावेज़ खोलें और एड्रेस बार से URL कॉपी करें।

**2. ऊपर पेस्ट करें।** इस पृष्ठ के शीर्ष पर स्थित डाउनलोड बॉक्स में लिंक डालें।

**3. PDF डाउनलोड करें।** टूल दस्तावेज़ के पृष्ठों को पढ़कर आपके लिए PDF तैयार करता है। इसे अपने फोन, टैबलेट या कंप्यूटर पर सहेजें।

![Step-by-step workflow of converting and downloading documents to PDF](/images/scribd-downloader-3-steps.jpg)

## आप क्या डाउनलोड कर सकते हैं

- **दस्तावेज़ और पुस्तकें** — Scribd पर सार्वजनिक रूप से साझा किए गए नोट्स, गाइड, मैनुअल और पुस्तकें।
- **शोध पत्र** — शैक्षणिक शोध पत्र और रिपोर्ट, संदर्भ और ऑफ़लाइन पढ़ने के लिए उपयोगी।
- **प्रस्तुतियाँ** — स्लाइड डेक पृष्ठ-दर-पृष्ठ सहेजे जाते हैं, ताकि कुछ भी कटे नहीं।
- **अध्ययन सामग्री** — पुराने प्रश्न पत्र, सारांश और कक्षा नोट्स।

परिणाम हमेशा एक मानक PDF होता है, जो किसी भी PDF रीडर में आसानी से खुलता है।

![Downloading and viewing high-resolution PDF documents on any device](/images/scribd-downloader-save-pdf-laptop.jpg)

## लोग Scribd Downloader का उपयोग क्यों करते हैं

- **बिना लॉगिन।** कोई खाता प्रणाली नहीं है, इसलिए साइन अप करने की कोई आवश्यकता नहीं है।
- **मुफ़्त।** सार्वजनिक दस्तावेज़ डाउनलोड करने का कोई शुल्क नहीं है।
- **साफ़ PDF।** पृष्ठ पढ़ने योग्य और प्रिंट करने में आसान होते हैं।
- **हर जगह काम करता है।** यह एक वेबसाइट है, इसलिए यह फोन, टैबलेट और कंप्यूटर पर काम करती है।

## कॉपीराइट पर एक संक्षिप्त टिप्पणी

केवल वे दस्तावेज़ डाउनलोड करें जिन्हें रखने का आपके पास अधिकार है — आपके अपने अपलोड, सार्वजनिक डोमेन कार्य, या अनुमति के साथ साझा की गई सामग्री। यहां उत्पन्न फ़ाइलें हमारे सर्वर पर संसाधित होती हैं और अस्थायी फ़ाइलें बाद में स्वचालित रूप से साफ़ कर दी जाती हैं।`
  },
  {
    id: "about-hi",
    pageKey: "about",
    language: "hi",
    title: "Scribd Downloader के बारे में",
    subtitle: "सार्वजनिक Scribd दस्तावेज़ों को PDF के रूप में सहेजने वाला एक मुफ्त टूल। बिना लॉगिन, बिना शुल्क।",
    content: `Scribd Downloader एक सरल और मुफ्त वेब टूल है जिसका मुख्य उद्देश्य सार्वजनिक Scribd दस्तावेज़ों को एक सुरक्षित PDF में बदलना है जिसे आप अपने पास रख सकते हैं।

Scribd पर उपयोगी अध्ययन सामग्री, शोध पत्र और प्रस्तुतियाँ भरी हुई हैं। ब्राउज़र में पढ़ना उपयोगी है, लेकिन ऑफ़लाइन प्रति को प्रिंट करना और साथ रखना आसान होता है। हम न तो आपसे ईमेल मांगते हैं और न ही कोई सदस्यता प्रणाली चलाते हैं।`
  },
  {
    id: "how-it-works-hi",
    pageKey: "how-it-works",
    language: "hi",
    title: "Scribd दस्तावेज़ PDF के रूप में कैसे डाउनलोड करें",
    subtitle: "आपकी ऑफ़लाइन प्रति के लिए तीन आसान चरण। बिना खाता बनाए, बिना ऐप इंस्टॉल किए।",
    content: `इस टूल से Scribd दस्तावेज़ डाउनलोड करने में एक मिनट से भी कम समय लगता है।

## तीन सरल चरण

**1. दस्तावेज़ का लिंक कॉपी करें।** ब्राउज़र में Scribd दस्तावेज़ खोलें और एड्रेस बार से URL कॉपी करें।

**2. डाउनलोड बॉक्स में पेस्ट करें।** होमपेज के शीर्ष पर दिए गए बॉक्स में लिंक डालें और डाउनलोड बटन दबाएं।

**3. अपनी PDF सहेजें।** टूल दस्तावेज़ के पृष्ठों को प्रोसेस करके PDF तैयार करता है। तैयार होने पर इसे अपने डिवाइस में सेव करें।`
  },
  {
    id: "contact-hi",
    pageKey: "contact",
    language: "hi",
    title: "हमसे संपर्क करें",
    subtitle: "प्रश्न, टूटे हुए लिंक या कॉपीराइट अनुरोध — हमें नीचे संदेश भेजें।",
    content: `डाउनलोड से संबंधित समस्या की रिपोर्ट करने, प्रश्न पूछने या कॉपीराइट दस्तावेज़ को हटाने का अनुरोध करने के लिए फॉर्म का उपयोग करें। हमारी टीम सभी संदेशों की समीक्षा करती है।`
  },
  {
    id: "legal-hi",
    pageKey: "legal",
    language: "hi",
    title: "गोपनीयता और शर्तें",
    subtitle: "हम डेटा को कैसे संभालते हैं और इस टूल के उपयोग के नियम।",
    content: `संक्षेप में: हम कोई व्यक्तिगत खाता या व्यक्तिगत विवरण नहीं मांगते हैं। डाउनलोड की गई फ़ाइलें केवल अस्थायी रूप से संसाधित होती हैं और बाद में हटा दी जाती हैं।`
  }
];

// Storage keys
const AD_SETTINGS_KEY = "scribd_ad_settings_v1";
const DOWNLOAD_SETTINGS_KEY = "scribd_download_settings_v1";
const SITE_SETTINGS_KEY = "scribd_site_settings_v1";
const MEDIA_ITEMS_KEY = "scribd_media_items_v1";
const CATEGORIES_KEY = "scribd_categories_v1";
const TAGS_KEY = "scribd_tags_v1";
const PAGE_CONTENT_KEY = "scribd_page_content_v8";
const CONTACT_MESSAGES_KEY = "scribd_contact_messages_v1";
const CORE_PAGE_SEO_KEY = "scribd_core_page_seo_v1";

export interface CorePageSeo {
  id: string;
  route?: string;
  metaTitle: string;
  metaDescription: string;
}

export function loadCorePageSeo(): CorePageSeo[] {
  try {
    const raw = localStorage.getItem(CORE_PAGE_SEO_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [];
}

export function saveCorePageSeo(pages: CorePageSeo[]) {
  try {
    localStorage.setItem(CORE_PAGE_SEO_KEY, JSON.stringify(pages));
  } catch (e) {
    console.error(e);
  }
}

export function loadAdSettings(): AdSettings {
  try {
    const raw = localStorage.getItem(AD_SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Clean up legacy pdfviewer.org reference if present in cached localStorage
      if (parsed.newTabUrl && parsed.newTabUrl.includes("pdfviewer.org")) {
        parsed.newTabUrl = "";
      }
      if (parsed.buttonAdUrl && parsed.buttonAdUrl.includes("pdfviewer.org")) {
        parsed.buttonAdUrl = "";
      }
      return { ...DEFAULT_AD_SETTINGS, ...parsed };
    }
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
          const initMatch = INITIAL_PAGE_CONTENT.find(
            (ip) => ip.id === p.id || (ip.pageKey === p.pageKey && ip.language === p.language)
          );
          if (
            initMatch &&
            (!p.content?.includes("scribd-downloader-3-steps.jpg") ||
              !p.content?.includes("scribd-downloader-save-pdf-laptop.jpg"))
          ) {
            return { ...p, content: initMatch.content, title: initMatch.title };
          }
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

// -------------------------------------------------------------
// ROBOTS.TXT & SITEMAP.XML GENERATION & PERSISTENCE
// -------------------------------------------------------------
export function buildDefaultRobotsTxt(origin?: string): string {
  const base = origin || (typeof window !== "undefined" ? window.location.origin : "https://example.com");
  return `# robots.txt for Scribd Downloader (Yoast SEO format)
# Auto-generated by Admin SEO Controller

User-agent: *
Allow: /

# Disallow admin control panels and private routes
Disallow: /admin123
Disallow: /admin
Disallow: /admin/*
Disallow: /api/
Disallow: /temp_downloads/

# XML Sitemap directives (Yoast SEO index and compatibility)
Sitemap: ${base}/sitemap_index.xml
Sitemap: ${base}/sitemap.xml
Sitemap: ${base}/post-sitemap.xml
Sitemap: ${base}/page-sitemap.xml
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

export function formatYoastDate(val?: any): string {
  if (!val) {
    const now = new Date();
    return now.toISOString().replace(/\.\d{3}Z$/, "+00:00");
  }
  const s = String(val).trim();
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(s)) {
    return s.slice(0, 19) + "+00:00";
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    return `${s}T00:00:00+00:00`;
  }
  const parsed = Date.parse(s);
  if (!isNaN(parsed)) {
    return new Date(parsed).toISOString().replace(/\.\d{3}Z$/, "+00:00");
  }
  return new Date().toISOString().replace(/\.\d{3}Z$/, "+00:00");
}

export function formatW3CDate(val?: any): string {
  return formatYoastDate(val);
}

export function cleanSlugForUrl(rawSlug?: string, idFallback?: string): string {
  if (!rawSlug) return idFallback ? cleanSlugForUrl(idFallback) : "";
  let s = String(rawSlug).trim();
  if (s.includes("`")) s = s.split("`")[0].trim();
  if (s.includes("(")) s = s.split("(")[0].trim();
  s = s.replace(/[^a-zA-Z0-9\-\/]/g, "-").replace(/-+/g, "-").replace(/^\/+|\/+$/g, "").replace(/^-+|-+$/g, "");
  if (!s) return idFallback ? cleanSlugForUrl(idFallback) : "";
  return s.toLowerCase();
}

export function escapeXml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildYoastPostSitemap(
  origin: string,
  posts: BlogPost[] = [],
  languages: SupportedLanguage[] = ["en", "br", "es", "fr", "de", "id"]
): string {
  const base = origin.replace(/\/$/, "");
  const today = formatYoastDate();

  const seenUrls = new Set<string>();
  const xmlEntries: string[] = [];

  const addUrlEntry = (
    loc: string,
    lastmod: string,
    imageUrl?: string
  ) => {
    const cleanUrl = loc.trim();
    if (!cleanUrl || seenUrls.has(cleanUrl)) return;
    seenUrls.add(cleanUrl);

    let imgXml = "";
    if (imageUrl && imageUrl.trim()) {
      imgXml = `\n\t\t<image:image>\n\t\t\t<image:loc>${escapeXml(imageUrl.trim())}</image:loc>\n\t\t</image:image>`;
    }

    const safeLastmod = formatYoastDate(lastmod);

    xmlEntries.push(`\t<url>
\t\t<loc>${escapeXml(cleanUrl)}</loc>
\t\t<lastmod>${safeLastmod}</lastmod>
\t\t<priority>0.80</priority>${imgXml}
\t</url>`);
  };

  const translationGroups = new Map<string, BlogPost[]>();
  for (const post of posts) {
    if (post.status === "draft") continue;
    const tgId = post.translationGroupId || `tg-${post.id}`;
    if (!translationGroups.has(tgId)) {
      translationGroups.set(tgId, []);
    }
    translationGroups.get(tgId)!.push(post);
  }

  translationGroups.forEach((groupPosts) => {
    const postToday = groupPosts[0]?.date ? formatYoastDate(groupPosts[0].date) : today;
    const langMap = new Map<SupportedLanguage, { url: string; date: string; image?: string }>();
    for (const p of groupPosts) {
      const pLang = (p.language as SupportedLanguage) || "en";
      const pSlug = cleanSlugForUrl(p.slug, p.id);
      if (pSlug) {
        langMap.set(pLang, {
          url: `${base}/${pLang}/blog/${pSlug}`,
          date: p.date || postToday,
          image: (p as any).coverImage || p.image,
        });
      }
    }

    const refPost = groupPosts.find((p) => (p.language || "en") === "en") || groupPosts[0];
    const refSlug = cleanSlugForUrl(refPost?.slug, refPost?.id);

    for (const lang of languages) {
      if (!langMap.has(lang) && refSlug) {
        langMap.set(lang, {
          url: `${base}/${lang}/blog/${refSlug}`,
          date: postToday,
          image: (refPost as any)?.coverImage || refPost?.image,
        });
      }
    }

    for (const lang of languages) {
      const item = langMap.get(lang);
      if (item) {
        addUrlEntry(item.url, formatYoastDate(item.date), item.image);
      }
    }
  });

  for (const post of posts) {
    if (post.status === "draft") continue;
    const postLang = (post.language as SupportedLanguage) || "en";
    const postSlug = cleanSlugForUrl(post.slug, post.id);
    if (postSlug) {
      const postDate = formatYoastDate(post.date || today);
      const postImg = (post as any).coverImage || post.image;
      addUrlEntry(`${base}/${postLang}/blog/${postSlug}`, postDate, postImg);
      for (const lang of languages) {
        addUrlEntry(`${base}/${lang}/blog/${postSlug}`, postDate, postImg);
      }
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="/main-sitemap.xsl"?>
<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries.join("\n")}
</urlset>
<!-- XML Sitemap generated by Yoast SEO -->`;
}

export function buildYoastPageSitemap(
  origin: string,
  customPages: CustomPage[] = [],
  languages: SupportedLanguage[] = ["en", "br", "es", "fr", "de", "id"]
): string {
  const base = origin.replace(/\/$/, "");
  const today = formatYoastDate();
  const coreRoutes = [
    { path: "" },
    { path: "how-it-works" },
    { path: "blog" },
    { path: "about" },
    { path: "contact" },
    { path: "privacy" },
    { path: "terms" },
    { path: "sitemap" },
  ];

  const seenUrls = new Set<string>();
  const xmlEntries: string[] = [];

  const addUrlEntry = (
    loc: string,
    lastmod: string,
    imageUrl?: string,
    priority: string = "0.80"
  ) => {
    const cleanUrl = loc.trim();
    if (!cleanUrl || seenUrls.has(cleanUrl)) return;
    seenUrls.add(cleanUrl);

    let imgXml = "";
    if (imageUrl && imageUrl.trim()) {
      imgXml = `\n\t\t<image:image>\n\t\t\t<image:loc>${escapeXml(imageUrl.trim())}</image:loc>\n\t\t</image:image>`;
    }

    const safeLastmod = formatYoastDate(lastmod);

    xmlEntries.push(`\t<url>
\t\t<loc>${escapeXml(cleanUrl)}</loc>
\t\t<lastmod>${safeLastmod}</lastmod>
\t\t<priority>${priority}</priority>${imgXml}
\t</url>`);
  };

  // 1. Root canonical entry
  addUrlEntry(
    `${base}/`,
    today,
    undefined,
    "1.00"
  );

  // 2. Core localized routes for all languages
  for (const r of coreRoutes) {
    for (const lang of languages) {
      const fullPath = r.path ? `/${lang}/${r.path}` : `/${lang}`;
      addUrlEntry(`${base}${fullPath}`, today, undefined, r.path === "" ? "1.00" : "0.80");
    }
  }

  // 3. Custom Pages - exact URLs for all language variations
  for (const page of customPages) {
    if (page.status === "draft") continue;
    const cleanSlug = cleanSlugForUrl(page.slug, page.id);
    if (!cleanSlug) continue;

    const pageLastMod = formatYoastDate((page as any).lastModified || (page as any).createdAt || today);
    const pageImg = (page as any).metaImage || (page as any).heroImage;

    // Base root slug
    addUrlEntry(`${base}/${cleanSlug}`, pageLastMod, pageImg, "0.80");

    // Specific page language if specified
    if (page.language && page.language !== "all") {
      addUrlEntry(`${base}/${page.language}/${cleanSlug}`, pageLastMod, pageImg, "0.80");
    }

    // Add for all supported languages
    for (const lang of languages) {
      addUrlEntry(`${base}/${lang}/${cleanSlug}`, pageLastMod, pageImg, "0.80");
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="/main-sitemap.xsl"?>
<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries.join("\n")}
</urlset>
<!-- XML Sitemap generated by Yoast SEO -->`;
}

export function buildExactUrlsetSitemapXml(
  origin: string,
  posts: BlogPost[] = [],
  customPages: CustomPage[] = [],
  languages: SupportedLanguage[] = ["en", "br", "es", "fr", "de", "id"]
): string {
  const base = origin.replace(/\/$/, "");
  const now = formatYoastDate();

  const seen = new Set<string>();
  const entries: string[] = [];

  const addUrl = (loc: string, lastmod: string, priority: string) => {
    const clean = loc.trim();
    if (!clean || seen.has(clean)) return;
    seen.add(clean);
    const safeDate = formatYoastDate(lastmod);
    entries.push(`<url>
<loc>${escapeXml(clean)}</loc>
<lastmod>${safeDate}</lastmod>
<priority>${priority}</priority>
</url>`);
  };

  // 1. Root & language homepages (priority 1.00)
  addUrl(`${base}`, now, "1.00");
  for (const lang of languages) {
    addUrl(`${base}/${lang}`, now, "1.00");
  }

  // 2. High priority core downloaders (priority 1.00)
  const coreTools = [
    "downloader",
    "bulk-downloader",
    "scribd-pdf-downloader",
    "scribd-document-downloader",
    "pinterest-image-downloader",
    "pinterest-gif-downloader",
  ];

  for (const tool of coreTools) {
    addUrl(`${base}/${tool}`, now, "1.00");
    for (const lang of languages) {
      addUrl(`${base}/${lang}/${tool}`, now, "1.00");
    }
  }

  // 3. Specialized downloaders from sample & application (priority 0.90)
  const specializedTools = [
    "scribd-presentation-downloader",
    "scribd-audiobook-downloader",
    "scribd-viewer",
    "document-downloader",
    "presentation-downloader",
    "batch-downloader",
    "pin-story-downloader",
    "pin-carousel-downloader",
    "pin-profile-downloader",
    "pin-board-downloader",
    "pin-answers-downloader",
    "pin-ideas-downloader",
    "pin-multiple-share-downloader",
  ];

  for (const tool of specializedTools) {
    addUrl(`${base}/${tool}`, now, "0.90");
    for (const lang of languages) {
      addUrl(`${base}/${lang}/${tool}`, now, "0.90");
    }
  }

  // 4. Guides, Tutorials, Extensions & Informational from sample (priority 0.80)
  const infoAndGuides = [
    "how-to",
    "how-it-works",
    "video-tutorial",
    "chrome-extension",
    "terms-privacy-policy",
    "contact-us",
    "about-us",
    "supported-urls",
    "thumbnail-grabber",
    "thumbnail-grabber/",
    "about",
    "contact",
    "privacy",
    "terms",
    "terms-of-service",
    "privacy-policy",
    "faq",
    "blog",
  ];

  for (const route of infoAndGuides) {
    addUrl(`${base}/${route}`, now, "0.80");
    for (const lang of languages) {
      addUrl(`${base}/${lang}/${route}`, now, "0.80");
    }
  }

  // 5. Published Blog Posts across all languages (priority 0.80)
  if (Array.isArray(posts) && posts.length > 0) {
    const translationGroups = new Map<string, BlogPost[]>();
    for (const post of posts) {
      if (post.status === "draft") continue;
      const tgId = post.translationGroupId || `tg-${post.id}`;
      if (!translationGroups.has(tgId)) translationGroups.set(tgId, []);
      translationGroups.get(tgId)!.push(post);
    }

    translationGroups.forEach((groupPosts) => {
      const postDate = groupPosts[0]?.date ? formatYoastDate(groupPosts[0].date) : now;
      const langMap = new Map<SupportedLanguage, string>();
      for (const p of groupPosts) {
        const pLang = (p.language as SupportedLanguage) || "en";
        const pSlug = cleanSlugForUrl(p.slug, p.id);
        if (pSlug) {
          langMap.set(pLang, `${base}/${pLang}/blog/${pSlug}`);
        }
      }

      const refPost = groupPosts.find((p) => (p.language || "en") === "en") || groupPosts[0];
      const refSlug = cleanSlugForUrl(refPost?.slug, refPost?.id);
      for (const lang of languages) {
        if (!langMap.has(lang) && refSlug) {
          langMap.set(lang, `${base}/${lang}/blog/${refSlug}`);
        }
      }

      for (const p of groupPosts) {
        const pLang = (p.language as SupportedLanguage) || "en";
        const pSlug = cleanSlugForUrl(p.slug, p.id);
        const exactUrl = langMap.get(pLang) || (pSlug ? `${base}/${pLang}/blog/${pSlug}` : "");
        if (exactUrl) {
          addUrl(exactUrl, p.date || postDate, "0.80");
        }
      }

      for (const lang of languages) {
        const loc = langMap.get(lang);
        if (loc) {
          addUrl(loc, postDate, "0.80");
        }
      }
    });

    for (const post of posts) {
      if (post.status === "draft") continue;
      const postLang = (post.language as SupportedLanguage) || "en";
      const postSlug = cleanSlugForUrl(post.slug, post.id);
      if (postSlug) {
        addUrl(`${base}/${postLang}/blog/${postSlug}`, post.date || now, "0.80");
        for (const lang of languages) {
          addUrl(`${base}/${lang}/blog/${postSlug}`, post.date || now, "0.80");
        }
      }
    }
  }

  // 6. Custom pages across all languages (priority 0.80)
  if (Array.isArray(customPages) && customPages.length > 0) {
    for (const page of customPages) {
      if (page.status === "draft") continue;
      const cleanSlug = cleanSlugForUrl(page.slug, page.id);
      if (!cleanSlug) continue;
      const pageLastMod = formatYoastDate((page as any).lastModified || (page as any).createdAt || now);
      addUrl(`${base}/${cleanSlug}`, pageLastMod, "0.80");
      if (page.language && page.language !== "all") {
        addUrl(`${base}/${page.language}/${cleanSlug}`, pageLastMod, "0.80");
      }
      for (const lang of languages) {
        addUrl(`${base}/${lang}/${cleanSlug}`, pageLastMod, "0.80");
      }
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>`;
}

export function buildYoastSitemapIndex(
  origin: string,
  _posts: BlogPost[] = [],
  _customPages: CustomPage[] = []
): string {
  const base = origin.replace(/\/$/, "");
  const today = formatYoastDate();
  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/main-sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<sitemap>
		<loc>${base}/page-sitemap.xml</loc>
		<lastmod>${today}</lastmod>
	</sitemap>
	<sitemap>
		<loc>${base}/post-sitemap.xml</loc>
		<lastmod>${today}</lastmod>
	</sitemap>
</sitemapindex>`;
}

export function buildDynamicSitemapXml(
  origin: string,
  posts: BlogPost[] = [],
  customPages: CustomPage[] = [],
  languages: SupportedLanguage[] = ["en", "br", "es", "fr", "de", "id"],
  type: "index" | "posts" | "pages" = "index"
): string {
  if (type === "posts") {
    return buildYoastPostSitemap(origin, posts, languages);
  }
  if (type === "pages") {
    return buildYoastPageSitemap(origin, customPages, languages);
  }
  return buildExactUrlsetSitemapXml(origin, posts, customPages, languages);
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

export async function syncPostsAndRebuildSitemap(
  posts?: BlogPost[],
  customPages?: CustomPage[],
  origin?: string
): Promise<string> {
  let effectivePosts = posts;
  if (!effectivePosts || effectivePosts.length === 0) {
    try {
      const raw = localStorage.getItem("scribd_blog_posts");
      if (raw) effectivePosts = JSON.parse(raw);
    } catch {}
  }
  let effectivePages = customPages;
  if (!effectivePages || effectivePages.length === 0) {
    try {
      const raw = localStorage.getItem(CUSTOM_PAGES_KEY);
      if (raw) effectivePages = JSON.parse(raw);
    } catch {}
  }

  const base = origin || (typeof window !== "undefined" ? window.location.origin : "https://example.com");
  const sitemapXml = buildDynamicSitemapXml(base, effectivePosts || [], effectivePages || []);
  saveSitemapXml(sitemapXml);

  if (typeof window !== "undefined") {
    if (effectivePosts && effectivePosts.length > 0) {
      try {
        fetch("/api/blog/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ posts: effectivePosts }),
        }).catch(() => {});
      } catch {}
    }
    if (effectivePages && effectivePages.length > 0) {
      try {
        fetch("/api/custom-pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pages: effectivePages }),
        }).catch(() => {});
      } catch {}
    }
  }

  return sitemapXml;
}

