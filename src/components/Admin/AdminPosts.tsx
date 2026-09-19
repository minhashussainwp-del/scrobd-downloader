import React, { useState } from "react";
import { BlogPost, GutenbergBlock, SupportedLanguage } from "../../types";
import { ClassicEditor } from "./ClassicEditor";
import { SUPPORTED_LANGUAGES } from "../../data/translations";
import { getAuthorProfile } from "../../data/authorData";
import { BLOG_POSTS, DEFAULT_POST_TRANSLATION_GROUPS, getPostTranslationGroupId } from "../../data/blogData";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  RotateCcw,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Tag,
  Folder,
  X,
  Sparkles,
  Globe,
  Settings,
  Zap,
  HelpCircle,
  RefreshCw,
  CheckCircle2
} from "lucide-react";

export { DEFAULT_POST_TRANSLATION_GROUPS, getPostTranslationGroupId };

interface AdminPostsProps {
  posts: BlogPost[];
  onSavePost: (post: BlogPost) => void;
  onDeletePost: (id: string, permanent?: boolean) => void;
  categories: string[];
  tags: string[];
}

export function AdminPosts({
  posts,
  onSavePost,
  onDeletePost,
  categories,
  tags,
}: AdminPostsProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "published" | "draft" | "trash">("all");
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState<SupportedLanguage | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [trashList, setTrashList] = useState<string[]>([]);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formCategory, setFormCategory] = useState("Guides");
  const [formReadTime, setFormReadTime] = useState("4 min read");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formImage, setFormImage] = useState("");
  
  // Multilingual & Editor State
  const [formLanguage, setFormLanguage] = useState<SupportedLanguage>("en");
  const [formTranslationGroupId, setFormTranslationGroupId] = useState("");
  const [formStatus, setFormStatus] = useState<"published" | "draft">("published");
  const [formHtmlContent, setFormHtmlContent] = useState("");

  // AI Assistant State
  const [aiWorking, setAiWorking] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [aiTranslateLang, setAiTranslateLang] = useState<SupportedLanguage>("hi");
  const [aiCustomPrompt, setAiCustomPrompt] = useState("");

  const handleAiEnhancePost = async (actionType: "full_enhance" | "meta_seo" | "faqs" | "improve_tone" | "tags") => {
    setAiWorking(true);
    setAiMessage(null);
    try {
      const res = await fetch("/api/ai/enhance-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle,
          content: formHtmlContent,
          excerpt: formExcerpt,
          category: formCategory,
          language: formLanguage,
          actionType,
          customPrompt: aiCustomPrompt,
        }),
      });

      const data = await res.json();
      if (res.ok && data.enhancement) {
        const enh = data.enhancement;
        if (actionType === "meta_seo") {
          if (enh.optimizedTitle) setFormTitle(enh.optimizedTitle);
          if (enh.optimizedExcerpt) setFormExcerpt(enh.optimizedExcerpt);
          if (enh.suggestedSlug) setFormSlug(enh.suggestedSlug);
          setAiMessage("AI optimized Title, SEO Slug, and Meta Description!");
        } else if (actionType === "faqs") {
          if (enh.generatedFaqs && Array.isArray(enh.generatedFaqs)) {
            const faqsHtml = `\n<div class="blog-faqs-box my-6 p-5 bg-slate-50 border border-slate-200 rounded-xl">\n<h3>Frequently Asked Questions</h3>\n${enh.generatedFaqs
              .map(
                (f: any) =>
                  `<div class="faq-item mb-3"><strong>Q: ${f.question}</strong><p class="text-sm mt-1">${f.answer}</p></div>`
              )
              .join("\n")}</div>`;
            setFormHtmlContent((prev) => prev + faqsHtml);
            setAiMessage("AI appended verified FAQ section to article content!");
          }
        } else {
          // full enhance / improve tone
          if (enh.optimizedTitle && !formTitle) setFormTitle(enh.optimizedTitle);
          if (enh.optimizedExcerpt) setFormExcerpt(enh.optimizedExcerpt);
          if (enh.enhancedContent) setFormHtmlContent(enh.enhancedContent);
          if (enh.readTime) setFormReadTime(enh.readTime);
          if (enh.suggestedCategory) setFormCategory(enh.suggestedCategory);
          setAiMessage("AI enhanced article formatting, structure, and readability!");
        }
      } else {
        throw new Error(data.error || "Enhancement failed");
      }
    } catch (e: any) {
      alert("AI Enhancement Error: " + e.message);
    } finally {
      setAiWorking(false);
    }
  };

  const handleAiTranslatePost = async () => {
    if (!formTitle && !formHtmlContent) {
      alert("Please provide a title or content to translate.");
      return;
    }
    setAiWorking(true);
    setAiMessage(null);
    try {
      const res = await fetch("/api/ai/translate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle,
          content: formHtmlContent,
          excerpt: formExcerpt,
          sourceLanguage: formLanguage,
          targetLanguage: aiTranslateLang,
        }),
      });

      const data = await res.json();
      if (res.ok && data.translation) {
        const tr = data.translation;
        setFormTitle(tr.translatedTitle || formTitle);
        setFormHtmlContent(tr.translatedContent || formHtmlContent);
        if (tr.translatedExcerpt) setFormExcerpt(tr.translatedExcerpt);
        if (tr.translatedSlug) setFormSlug(tr.translatedSlug);
        else setFormSlug((prev) => `${prev.replace(/-[a-z]{2}$/, "")}-${aiTranslateLang}`);
        setFormLanguage(aiTranslateLang);
        setAiMessage(`AI successfully translated article title & content to ${aiTranslateLang.toUpperCase()}!`);
      } else {
        throw new Error(data.error || "Translation failed");
      }
    } catch (e: any) {
      alert("AI Translation Error: " + e.message);
    } finally {
      setAiWorking(false);
    }
  };

  const handleBatchAiTranslateAll = async () => {
    if (!formTitle && !formHtmlContent) {
      alert("Please provide article title or content first.");
      return;
    }

    const mainLangs: SupportedLanguage[] = ["en", "id", "es", "br", "fr", "de", "hi"];
    const targetLangs = mainLangs.filter((l) => l !== formLanguage);

    setAiWorking(true);
    setAiMessage("Starting batch AI translation for all target languages...");

    const groupId = formTranslationGroupId || (editingPost ? getPostTranslationGroupId(editingPost) : `tg-${Date.now()}`);
    let successCount = 0;

    for (const targetLang of targetLangs) {
      try {
        setAiMessage(`Translating article to ${targetLang.toUpperCase()} with AI...`);
        const res = await fetch("/api/ai/translate-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formTitle,
            content: formHtmlContent,
            excerpt: formExcerpt,
            sourceLanguage: formLanguage,
            targetLanguage: targetLang,
          }),
        });

        const data = await res.json();
        if (res.ok && data.translation) {
          const tr = data.translation;
          const cleanSlugBase = formSlug ? formSlug.replace(/-[a-z]{2}$/, "") : "article";
          const newPost: BlogPost = {
            id: `post-${Date.now()}-${targetLang}`,
            slug: tr.translatedSlug || `${cleanSlugBase}-${targetLang}`,
            title: tr.translatedTitle || formTitle,
            excerpt: tr.translatedExcerpt || formExcerpt,
            category: formCategory || "Guides",
            readTime: formReadTime || "4 min read",
            date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
            author: editingPost?.author || {
              name: getAuthorProfile().name,
              role: getAuthorProfile().role,
              avatar: getAuthorProfile().avatar,
              email: getAuthorProfile().email,
              bio: getAuthorProfile().bio,
            },
            image: formImage || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1200",
            featured: formFeatured,
            language: targetLang,
            translationGroupId: groupId,
            status: "published",
            htmlContent: tr.translatedContent || formHtmlContent,
            content: { intro: "", tableOfContents: [], sections: [] },
          };

          onSavePost(newPost);
          successCount++;
        }
      } catch (e) {
        console.error(`Error batch translating to ${targetLang}:`, e);
      }
    }

    setAiWorking(false);
    setAiMessage(`AI Auto-Translate Complete! Successfully created ${successCount} translated article variations.`);
  };

  const startCreate = () => {
    setIsCreating(true);
    setEditingPost(null);
    setFormTitle("");
    setFormSlug("");
    setFormExcerpt("");
    setFormCategory("Guides");
    setFormReadTime("4 min read");
    setFormFeatured(false);
    setFormImage("https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80");
    setFormLanguage("en");
    setFormTranslationGroupId(`tg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`);
    setFormStatus("published");
    setFormHtmlContent("");
  };

  const startEdit = (post: BlogPost) => {
    setEditingPost(post);
    setIsCreating(true);
    setFormTitle(post.title);
    setFormSlug(post.slug);
    setFormExcerpt(post.excerpt);
    setFormCategory(post.category || "Guides");
    setFormReadTime(post.readTime || "4 min read");
    setFormFeatured(!!post.featured);
    setFormImage(post.image || "");
    setFormLanguage(post.language || "en");
    setFormTranslationGroupId(getPostTranslationGroupId(post));
    setFormStatus(post.status || "published");
    
    // Migrate old blocks to HTML if htmlContent doesn't exist
    let html = post.htmlContent || "";
    if (!html && post.blocks && post.blocks.length > 0) {
      html = post.blocks.map(b => {
        if (b.type === 'heading') return `<h${b.level || 2}>${b.content}</h${b.level || 2}>`;
        if (b.type === 'paragraph') return `<p>${b.content}</p>`;
        if (b.type === 'list') return `<ul>${b.listItems?.map(li => `<li>${li}</li>`).join('')}</ul>`;
        if (b.type === 'quote') return `<blockquote>${b.content}</blockquote>`;
        return `<p>${b.content}</p>`;
      }).join('\n');
    }
    setFormHtmlContent(html);
  };

  const saveCurrentPostState = (): BlogPost | null => {
    if (!formTitle && !formHtmlContent) return null;
    const currentId = editingPost ? editingPost.id : `post-${Date.now()}`;
    const groupId = formTranslationGroupId || (editingPost ? getPostTranslationGroupId(editingPost) : `tg-${currentId}`);
    
    const post: BlogPost = {
      id: currentId,
      slug: formSlug || formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: formTitle,
      excerpt: formExcerpt,
      category: formCategory,
      readTime: formReadTime,
      date: editingPost ? editingPost.date : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      author: editingPost?.author || {
        name: getAuthorProfile().name,
        role: getAuthorProfile().role,
        avatar: getAuthorProfile().avatar,
        email: getAuthorProfile().email,
        bio: getAuthorProfile().bio,
      },
      image: formImage,
      featured: formFeatured,
      language: formLanguage,
      translationGroupId: groupId,
      status: formStatus,
      htmlContent: formHtmlContent,
      content: editingPost ? editingPost.content : { intro: "", tableOfContents: [], sections: [] }
    };

    onSavePost(post);
    return post;
  };

  const generateLocalizedPostVariation = (
    baseTitle: string,
    baseSlug: string,
    targetLang: SupportedLanguage,
    groupId: string
  ): BlogPost => {
    const cleanSlugBase = baseSlug ? baseSlug.replace(/-[a-z]{2}$/, "") : "article";
    const id = `post-${Date.now()}-${targetLang}`;
    const author = editingPost?.author || {
      name: getAuthorProfile().name,
      role: getAuthorProfile().role,
      avatar: getAuthorProfile().avatar,
      email: getAuthorProfile().email,
      bio: getAuthorProfile().bio,
    };

    const templates: Partial<
      Record<
        SupportedLanguage,
        { title: string; excerpt: string; slug: string; content: string }
      >
    > = {
      es: {
        title: baseTitle ? `${baseTitle} (Guía en Español)` : "Cómo descargar documentos de Scribd en PDF gratis",
        excerpt: "Guía completa paso a paso para descargar documentos, libros y presentaciones de Scribd en PDF de forma rápida y segura.",
        slug: `${cleanSlugBase}-es`,
        content: `## Cómo descargar documentos de Scribd en PDF

Descargar documentos públicos de Scribd es un proceso ágil y totalmente gratuito. En esta guía completa aprenderá paso a paso cómo guardar cualquier presentación, informe o libro digital directamente en su dispositivo.

### Paso 1: Obtener el enlace del documento
Acceda a la página del documento en Scribd y copie la URL completa directamente desde la barra de navegación de su navegador.

### Paso 2: Pegar la URL en el convertidor
Ingrese a nuestro descargador gratuito de Scribd y pegue el enlace en la caja de descarga superior.

### Paso 3: Guardar el archivo PDF
Haga clic en descargar y guarde el documento PDF generado. El archivo resultante es 100% compatible con cualquier lector como Adobe Acrobat o visores móviles.

---

### Beneficios clave
- **Sin necesidad de registro**: No requiere crear cuentas ni ingresar datos bancarios.
- **Calidad de impresión nítida**: Los vectores de fuentes e imágenes se conservan en alta resolución.
- **Acceso sin conexión**: Estudie y revise sus documentos en cualquier lugar sin depender de internet.`,
      },
      br: {
        title: baseTitle ? `${baseTitle} (Guia em Português)` : "Como baixar documentos do Scribd em PDF grátis",
        excerpt: "Passo a passo completo para salvar documentos, apresentações e artigos acadêmicos do Scribd em formato PDF limpo.",
        slug: `${cleanSlugBase}-br`,
        content: `## Como baixar documentos do Scribd em PDF

Salvar documentos públicos do Scribd no seu dispositivo agora é simples e gratuito. Com este passo a passo, você aprende a compilar arquivos limpos prontos para leitura offline.

### Passo 1: Copie o link do Scribd
Abra o documento desejado no navegador e copie o endereço completo (URL) na barra de navegação.

### Passo 2: Cole o link no conversor
Acesse o nosso baixador e insira a URL copiada no campo de download na parte superior da página.

### Passo 3: Baixe seu PDF
Clique no botão de download e aguarde alguns segundos para salvar o PDF no seu computador ou celular.

---

### Vantagens do download direto
- **100% Grátis e sem cadastro**: Não é preciso criar conta ou assinar serviços.
- **Compatibilidade total**: Abra no Kindle, tablet, smartphone ou imprima em papel com fontes nítidas.`,
      },
      fr: {
        title: baseTitle ? `${baseTitle} (Guide en Français)` : "Comment télécharger des documents Scribd en PDF gratuitement",
        excerpt: "Guide étape par étape pour télécharger et convertir des présentations et documents Scribd en fichiers PDF de haute qualité.",
        slug: `${cleanSlugBase}-fr`,
        content: `## Comment télécharger des documents Scribd en PDF

Le téléchargement de documents publics depuis Scribd est désormais rapide, confidentiel et sans frais. Suivez ces étapes simples pour sauvegarder vos cours et rapports.

### Étape 1 : Copier l'URL du document
Rendez-vous sur la page du document Scribd et copiez le lien complet dans la barre d'adresse.

### Étape 2 : Coller dans notre convertisseur
Insérez le lien copié dans le champ de téléchargement en haut de notre plateforme.

### Étape 3 : Télécharger votre document PDF
Validez pour lancer la génération de votre fichier PDF optimisé et enregistrez-le sur votre appareil.

---

### Pourquoi utiliser notre convertisseur ?
- **Aucune inscription nécessaire** : Téléchargez directement sans compte ni carte bancaire.
- **Qualité optimale** : Respect des polices vectorielles et mise en page d'origine.`,
      },
      de: {
        title: baseTitle ? `${baseTitle} (Deutsche Anleitung)` : "Scribd-Dokumente kostenlos als PDF herunterladen",
        excerpt: "Vollständige Schritt-für-Schritt-Anleitung zum Speichern von Scribd-Präsentationen, Skripten und Büchern im PDF-Format.",
        slug: `${cleanSlugBase}-de`,
        content: `## Scribd-Dokumente einfach als PDF herunterladen

Mit unserem kostenlosen Tool können Sie öffentlich zugängliche Scribd-Dokumente sicher und unkompliziert auf Ihrem PC, Tablet oder Smartphone speichern.

### Schritt 1: Link kopieren
Öffnen Sie das gewünschte Dokument auf Scribd und kopieren Sie die Webadresse (URL) aus dem Browser.

### Schritt 2: Link einfügen
Fügen Sie die kopierte URL in das Eingabefeld am Anfang dieser Seite ein.

### Schritt 3: PDF herunterladen
Klicken Sie auf Herunterladen. Nach der Verarbeitung steht Ihr sauberes PDF sofort zum Download bereit.

---

### Ihre Vorteile
- **Keine Registrierung erforderlich**: Sie müssen kein Benutzerkonto anlegen.
- **Optimale Lesequalität**: Klare Schriftarten und scharfe Grafiken für den Ausdruck oder E-Reader.`,
      },
      id: {
        title: baseTitle ? `${baseTitle} (Panduan Bahasa Indonesia)` : "Cara download dokumen Scribd menjadi PDF gratis",
        excerpt: "Panduan praktis dan lengkap untuk mengunduh dokumen, modul kuliah, dan buku dari Scribd ke format PDF tanpa login.",
        slug: `${cleanSlugBase}-id`,
        content: `## Cara Mudah Mengunduh Dokumen Scribd ke Format PDF

Mengunduh dokumen publik dari Scribd kini semakin cepat dan mudah. Ikuti langkah sederhana berikut untuk menyimpan materi belajar ke perangkat Anda.

### Langkah 1: Salin Tautan Dokumen
Buka dokumen di Scribd dan salin alamat URL lengkap dari bilah browser Anda.

### Langkah 2: Tempelkan Tautan
Buka pengunduh online kami lalu tempelkan tautan yang telah disalin ke kolom unduhan di bagian atas.

### Langkah 3: Unduh File PDF Anda
Klik tombol unduh dan simpan file PDF ke penyimpanan laptop atau ponsel Anda untuk dibaca secara luring kapan saja.

---

### Keunggulan Layanan Kami
- **Gratis Tanpa Akun**: Tidak perlu mendaftar atau memasukkan informasi kartu kredit.
- **Tampilan Bersih**: Format halaman tetap rapi dan siap untuk dicetak.`,
      },
      hi: {
        title: baseTitle ? `${baseTitle} (हिंदी गाइड)` : "Scribd दस्तावेज़ मुफ़्त में PDF के रूप में डाउनलोड करें",
        excerpt: "Scribd से पब्लिक दस्तावेज़, किताबें और नोट्स PDF में आसानी से डाउनलोड करने के लिए चरण-दर-चरण गाइड।",
        slug: `${cleanSlugBase}-hi`,
        content: `## Scribd दस्तावेज़ आसानी से PDF में डाउनलोड करें

Scribd से सार्वजनिक दस्तावेज़ डाउनलोड करना बेहद आसान और मुफ़्त है। अपने अध्ययन सामग्री या पुस्तकों को ऑफ़लाइन पढ़ने के लिए इस आसान तरीक़े का पालन करें।

### चरण 1: दस्तावेज़ का लिंक कॉपी करें
Scribd पर अपनी पसंद का दस्तावेज़ खोलें और ब्राउज़र के एड्रेस बार से उसका URL कॉपी करें।

### चरण 2: डाउनलोडर में लिंक पेस्ट करें
हमारे मुफ़्त Scribd डाउनलोडर पर आएं और कॉपी किए गए लिंक को ऊपर दिए गए बॉक्स में पेस्ट करें।

### चरण 3: PDF फ़ाइल डाउनलोड करें
डाउनलोड बटन पर क्लिक करें और कुछ ही सेकंड में अपनी साफ़ और उच्च गुणवत्ता वाली PDF फ़ाइल सेव करें।

---

### मुख्य विशेषताएं
- **100% मुफ़्त और बिना लॉगिन**: कोई खाता बनाने या साइन-अप करने की आवश्यकता नहीं है।
- **सभी डिवाइसों पर कार्य करता है**: अपने मोबाइल, टैबलेट या कंप्यूटर पर आसानी से उपयोग करें।`,
      },
      en: {
        title: baseTitle || "How to Download Scribd Documents as PDF",
        excerpt: formExcerpt || "A complete step-by-step guide to saving public Scribd slides, books, and study sheets into pure vector PDF files.",
        slug: `${cleanSlugBase}-en`,
        content: formHtmlContent || `## How to Download Scribd Documents as PDF

Downloading public documents from Scribd is fast, simple, and completely free. Follow this tutorial to save books, slides, and study notes directly to your laptop or phone.

### Step 1: Copy the Document URL
Open the document in Scribd and copy the address from your web browser's URL bar.

### Step 2: Paste into the Downloader Box
Drop the URL into the input field at the top of this tool.

### Step 3: Download Clean PDF
Click Download and save the compiled PDF to your study folder for offline reading and highlighting.`,
      },
    };

    const loc = templates[targetLang] || templates.en;

    return {
      id,
      slug: loc.slug,
      title: loc.title,
      excerpt: loc.excerpt,
      category: formCategory || "Guides",
      readTime: formReadTime || "4 min read",
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      author,
      image: formImage || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1200",
      featured: formFeatured,
      language: targetLang,
      translationGroupId: groupId,
      status: "published",
      htmlContent: loc.content,
      content: { intro: "", tableOfContents: [], sections: [] },
    };
  };

  const handleCreateTranslation = (langCode: SupportedLanguage, passedGroupId?: string) => {
    const groupId = passedGroupId || formTranslationGroupId || (editingPost ? getPostTranslationGroupId(editingPost) : `tg-${Date.now()}`);
    const newPost = generateLocalizedPostVariation(formTitle, formSlug, langCode, groupId);
    onSavePost(newPost);
    startEdit(newPost);
  };

  const handleSwitchToLanguage = (targetLang: SupportedLanguage) => {
    if (targetLang === formLanguage && editingPost) return;

    // Persist current edits so user changes are never lost
    saveCurrentPostState();

    const effectiveGroupId = formTranslationGroupId || (editingPost ? getPostTranslationGroupId(editingPost) : `tg-${Date.now()}`);

    // Search for existing post in the same group with this language in state or default library
    const existing =
      posts.find(
        (p) => getPostTranslationGroupId(p) === effectiveGroupId && (p.language || "en") === targetLang
      ) ||
      BLOG_POSTS.find(
        (p) => getPostTranslationGroupId(p) === effectiveGroupId && (p.language || "en") === targetLang
      );

    if (existing) {
      if (!posts.some((p) => p.id === existing.id)) {
        onSavePost(existing);
      }
      startEdit(existing);
    } else {
      handleCreateTranslation(targetLang, effectiveGroupId);
    }
  };

  const saveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = editingPost ? editingPost.id : `post-${Date.now()}`;
    
    const post: BlogPost = {
      id: newId,
      slug: formSlug || formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: formTitle,
      excerpt: formExcerpt,
      category: formCategory,
      readTime: formReadTime,
      date: editingPost ? editingPost.date : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      author: editingPost ? editingPost.author : {
        name: getAuthorProfile().name,
        role: getAuthorProfile().role,
        avatar: getAuthorProfile().avatar,
        email: getAuthorProfile().email,
        bio: getAuthorProfile().bio,
      },
      image: formImage,
      featured: formFeatured,
      language: formLanguage,
      translationGroupId: formTranslationGroupId,
      status: formStatus,
      htmlContent: formHtmlContent,
      content: editingPost ? editingPost.content : { intro: "", tableOfContents: [], sections: [] }
    };

    onSavePost(post);
    setIsCreating(false);
    setEditingPost(null);
  };

  const moveToTrash = (id: string) => {
    setTrashList((prev) => [...prev, id]);
  };

  const restoreFromTrash = (id: string) => {
    setTrashList((prev) => prev.filter((item) => item !== id));
  };

  const filteredPosts = posts.filter((p) => {
    const isTrashed = trashList.includes(p.id);
    if (activeFilter === "trash") return isTrashed;
    if (isTrashed) return false;
    if (activeFilter === "published") return (p.status === "published" || !p.status);
    if (activeFilter === "draft") return p.status === "draft";
    if (selectedLanguageFilter !== "all" && (p.language || "en") !== selectedLanguageFilter) return false;

    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="space-y-6" id="admin-posts-manager">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Posts & Guides</h2>
          <p className="text-sm text-slate-500 font-medium">Manage SEO articles, blog posts, and translations.</p>
        </div>
        {!isCreating && (
          <button
            type="button"
            onClick={startCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-xs hover:shadow-md transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Write New Post
          </button>
        )}
      </div>

      {isCreating ? (
        <form onSubmit={saveForm} className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6 relative">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-slate-900">
                {editingPost ? "Edit Post" : "Write New Post"}
              </h3>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                AI Assistant Ready
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsCreating(false);
                setEditingPost(null);
              }}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* AI Copilot Action Strip */}
          <div className="p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-slate-50 rounded-2xl border border-indigo-100 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>AI Blog Copilot: Auto-Enhance, FAQs, SEO Meta & Multilingual Translator</span>
              </div>
              {aiWorking && (
                <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Generating with Gemini AI...
                </span>
              )}
            </div>

            {aiMessage && (
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{aiMessage}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleAiEnhancePost("full_enhance")}
                disabled={aiWorking}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                AI Enhance Article
              </button>

              <button
                type="button"
                onClick={() => handleAiEnhancePost("meta_seo")}
                disabled={aiWorking}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI Fill Meta & Slug
              </button>

              <button
                type="button"
                onClick={() => handleAiEnhancePost("faqs")}
                disabled={aiWorking}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                + AI Add FAQs Block
              </button>

              <div className="flex items-center gap-1.5 ml-auto">
                <span className="text-xs font-bold text-slate-500">Translate to:</span>
                <select
                  value={aiTranslateLang}
                  onChange={(e) => setAiTranslateLang(e.target.value as SupportedLanguage)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAiTranslatePost}
                  disabled={aiWorking}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1 transition cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Translate
                </button>
                <button
                  type="button"
                  onClick={handleBatchAiTranslateAll}
                  disabled={aiWorking}
                  className="px-3 py-1.5 bg-indigo-700 hover:bg-indigo-600 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1 transition cursor-pointer"
                  title="Automatically translate title & content into all 7 main languages using Gemini AI"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Auto-Translate All
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left 3 Cols: Editor */}
            <div className="lg:col-span-3 space-y-5">
              <div className="space-y-1.5">
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Article Title..."
                  className="w-full px-0 py-2 border-0 border-b border-slate-200 text-slate-900 font-bold text-2xl focus:ring-0 focus:border-indigo-500 placeholder-slate-300"
                />
              </div>

              <div className="space-y-1.5">
                <ClassicEditor value={formHtmlContent} onChange={setFormHtmlContent} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">URL Slug</label>
                  <input
                    type="text"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="how-to-convert-scribd-to-pdf"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-semibold text-xs focus:ring-2 focus:ring-indigo-500/15"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Excerpt / Meta Description</label>
                  <textarea
                    rows={2}
                    value={formExcerpt}
                    onChange={(e) => setFormExcerpt(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-semibold text-xs focus:ring-2 focus:ring-indigo-500/15"
                  />
                </div>
              </div>
            </div>

            {/* Right Col: Polylang & Settings Sidebar */}
            <div className="space-y-6">
              
              {/* Language Settings (Polylang Style) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2 mb-3">
                  <Globe className="w-4 h-4" />
                  Language & Translations
                </h4>
                
                <div className="mb-4">
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Current Language</label>
                  <select 
                    value={formLanguage}
                    onChange={(e) => handleSwitchToLanguage(e.target.value as SupportedLanguage)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold bg-white cursor-pointer hover:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {SUPPORTED_LANGUAGES.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 border-t border-slate-200 pt-3">
                  <label className="text-xs font-bold text-slate-700">Translations</label>
                  <ul className="space-y-1.5 text-sm">
                    {SUPPORTED_LANGUAGES.map(lang => {
                      // Skip current if not grouped (though they should all list)
                      if (lang.code === formLanguage) {
                        return (
                          <li key={lang.code} className="flex items-center justify-between p-2 bg-indigo-50 border border-indigo-200 rounded-lg">
                            <span className="flex items-center gap-1.5 font-bold text-indigo-900">
                              {lang.flag} {lang.name}
                            </span>
                            <span className="text-xs text-indigo-700 font-bold bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200">Current</span>
                          </li>
                        );
                      }
                      
                      // Check if a translation exists in the group
                      const effectiveGroupId = formTranslationGroupId || (editingPost ? getPostTranslationGroupId(editingPost) : "");
                      const existingTranslation = posts.find(p => getPostTranslationGroupId(p) === effectiveGroupId && (p.language || "en") === lang.code);
                      
                      if (existingTranslation) {
                        return (
                          <li 
                            key={lang.code} 
                            onClick={() => handleSwitchToLanguage(lang.code)}
                            className="flex items-center justify-between p-2 hover:bg-slate-100 rounded-lg group transition cursor-pointer border border-transparent hover:border-slate-200"
                          >
                            <span className="flex items-center gap-1.5 font-medium text-slate-800 group-hover:text-indigo-600">
                              {lang.flag} {lang.name}
                            </span>
                            <button 
                              type="button" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSwitchToLanguage(lang.code);
                              }}
                              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded hover:bg-indigo-100 transition flex items-center gap-1 cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3 inline" /> Edit
                            </button>
                          </li>
                        );
                      } else {
                        return (
                          <li 
                            key={lang.code} 
                            onClick={() => handleSwitchToLanguage(lang.code)}
                            className="flex items-center justify-between p-2 hover:bg-slate-100 rounded-lg group transition cursor-pointer border border-transparent hover:border-slate-200"
                          >
                            <span className="flex items-center gap-1.5 font-medium text-slate-500">
                              {lang.flag} {lang.name}
                            </span>
                            <button 
                              type="button" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSwitchToLanguage(lang.code);
                              }}
                              className="text-xs font-bold text-slate-500 hover:text-indigo-600 bg-slate-100 px-2.5 py-1 rounded hover:bg-indigo-50 transition cursor-pointer"
                            >
                              + Create
                            </button>
                          </li>
                        );
                      }
                    })}
                  </ul>
                </div>
              </div>

              {/* Publish Settings */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
                 <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Publish
                </h4>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Status</label>
                  <select 
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as "published" | "draft")}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-semibold bg-white"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow transition cursor-pointer"
                >
                  Save Post
                </button>
              </div>

              {/* General Settings */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
                 <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Properties
                </h4>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-semibold text-sm"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    {!categories.includes(formCategory) && (
                       <option value={formCategory}>{formCategory}</option>
                    )}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Featured Image URL</label>
                  <input
                    type="text"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 font-semibold text-xs"
                  />
                  {formImage && (
                    <div className="mt-2 aspect-video rounded-lg overflow-hidden border border-slate-200">
                      <img src={formImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500/20"
                  />
                  <span className="text-xs font-bold text-slate-700">Featured Post</span>
                </label>
              </div>
            </div>
          </div>
        </form>
      ) : (
        /* Posts Table & Filters */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden space-y-4 p-5 sm:p-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveFilter("all")}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeFilter === "all" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All ({posts.length - trashList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("published")}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeFilter === "published" ? "bg-white text-emerald-700 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Published
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("draft")}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeFilter === "draft" ? "bg-white text-amber-700 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Draft
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("trash")}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeFilter === "trash" ? "bg-white text-red-700 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Trash ({trashList.length})
              </button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedLanguageFilter}
                onChange={(e) => setSelectedLanguageFilter(e.target.value as SupportedLanguage | "all")}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
              >
                <option value="all">🌐 All Languages ({posts.length})</option>
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.name} ({l.code.toUpperCase()})
                  </option>
                ))}
              </select>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-bold">
                  <th className="p-4">Title</th>
                  <th className="p-4">Language</th>
                  <th className="p-4">Translations</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredPosts.map((post) => {
                  const isTrashed = trashList.includes(post.id);
                  const langOpt = SUPPORTED_LANGUAGES.find(l => l.code === (post.language || 'en'));
                  
                  // Get other translations in this group
                  const siblingTranslations = post.translationGroupId 
                    ? posts.filter(p => p.translationGroupId === post.translationGroupId && p.id !== post.id && !trashList.includes(p.id))
                    : [];

                  return (
                    <tr key={post.id} className="hover:bg-slate-50 transition group">
                      <td className="p-4">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          {post.featured && <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                          {post.title}
                        </div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Folder className="w-3 h-3" />
                            {post.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
                           {langOpt?.flag} {langOpt?.code.toUpperCase()}
                         </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          {siblingTranslations.length > 0 ? (
                            siblingTranslations.map(sib => {
                              const sLang = SUPPORTED_LANGUAGES.find(l => l.code === sib.language);
                              return (
                                <span key={sib.id} title={sLang?.name} className="text-lg cursor-help opacity-70 hover:opacity-100 transition">
                                  {sLang?.flag}
                                </span>
                              )
                            })
                          ) : (
                            <span className="text-xs text-slate-400 italic">None</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider ${
                          post.status === 'draft' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {post.status === 'draft' ? 'DRAFT' : 'PUBLISHED'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 text-xs font-medium whitespace-nowrap">
                        {post.date}
                      </td>
                      <td className="p-4 text-right">
                        {!isTrashed ? (
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                              title="Preview"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => startEdit(post)}
                              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveToTrash(post.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Trash"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => restoreFromTrash(post.id)}
                              className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition flex items-center gap-1 text-xs font-bold"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              Restore
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeletePost(post.id, true)}
                              className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-1 text-xs font-bold"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete Forever
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filteredPosts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FileText className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-slate-500 font-medium">No posts found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
