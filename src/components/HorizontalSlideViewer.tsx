import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Grid,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  FileText,
  SlidersHorizontal,
  Film,
  ExternalLink,
  Eye,
  Check
} from "lucide-react";
import { AdSettings } from "../types";
import { InFeedAdBanner } from "./AdBanners";

export interface PageImageItem {
  filename: string;
  pageNumber: number;
  sizeBytes: number;
}

interface HorizontalSlideViewerProps {
  jobId: string;
  documentTitle?: string;
  images: PageImageItem[];
  pdfDownloadUrl?: string;
  adSettings?: AdSettings;
}

type ViewMode = "slides" | "carousel" | "grid";

export function HorizontalSlideViewer({
  jobId,
  documentTitle = "Document",
  images,
  pdfDownloadUrl,
  adSettings,
}: HorizontalSlideViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("slides");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [jumpPageInput, setJumpPageInput] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  const filmstripRef = useRef<HTMLDivElement>(null);
  const carouselTrackRef = useRef<HTMLDivElement>(null);
  const slideContainerRef = useRef<HTMLDivElement>(null);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  const totalPages = images.length;
  const currentImage = images[currentIndex] || images[0];

  // Helper to format bytes
  const formatBytes = (bytes: number): string => {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Safe navigation
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
    setZoomLevel(1);
  }, [totalPages]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
    setZoomLevel(1);
  }, [totalPages]);

  const goToSlide = (index: number) => {
    if (index >= 0 && index < totalPages) {
      setCurrentIndex(index);
      setZoomLevel(1);
    }
  };

  // Safe slide image error retry handler
  const handleSlideImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    if (!target.dataset.retried) {
      target.dataset.retried = "true";
      const src = target.src;
      target.src = src.includes("?") ? `${src}&t=${Date.now()}` : `${src}?t=${Date.now()}`;
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        goToPrev();
      } else if (e.key === "Home") {
        e.preventDefault();
        goToSlide(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goToSlide(totalPages - 1);
      } else if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      } else if (e.key === " " && viewMode === "slides") {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev, totalPages, isFullscreen, viewMode]);

  // Slideshow auto-play effect
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        goToNext();
      }, 3500);
    } else {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    }

    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, goToNext]);

  // Auto-scroll active thumbnail in horizontal filmstrip into view
  useEffect(() => {
    if (!filmstripRef.current) return;
    const activeThumb = filmstripRef.current.querySelector(
      `[data-thumb-index="${currentIndex}"]`
    ) as HTMLElement | null;

    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [currentIndex]);

  // Filmstrip horizontal scroll buttons
  const scrollFilmstrip = (direction: "left" | "right") => {
    if (!filmstripRef.current) return;
    const scrollAmount = direction === "left" ? -320 : 320;
    filmstripRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // Carousel track horizontal scroll buttons
  const scrollCarousel = (direction: "left" | "right") => {
    if (!carouselTrackRef.current) return;
    const scrollAmount = direction === "left" ? -480 : 480;
    carouselTrackRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // Jump to specific page
  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpPageInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      goToSlide(pageNum - 1);
      setJumpPageInput("");
    }
  };

  // Single page download trigger
  const handleDownloadSingle = (filename: string, pageNum: number) => {
    const link = document.createElement("a");
    link.href = `/api/jobs/${jobId}/image/${filename}`;
    link.download = `page-${pageNum}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!images || images.length === 0) return null;

  return (
    <section aria-label="Extracted Document Presentation and Page Previews" className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
      {/* Top Header & View Mode Switcher */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/10 text-indigo-600 flex items-center justify-center font-bold text-xs">
            <Film className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Document Pages in Slide Format
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold font-mono">
                {totalPages} Slides Ready
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Browse horizontally like presentation slides, auto-play, or view full screen
            </p>
          </div>
        </div>

        {/* View Mode Segmented Control */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            type="button"
            id="viewmode-slides-btn"
            onClick={() => setViewMode("slides")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              viewMode === "slides"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title="Horizontal Presentation Slide Deck View"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Horizontal Slides</span>
          </button>

          <button
            type="button"
            id="viewmode-carousel-btn"
            onClick={() => setViewMode("carousel")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              viewMode === "carousel"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title="Horizontal Continuous Filmstrip Cards"
          >
            <Film className="w-3.5 h-3.5" />
            <span>Continuous Track</span>
          </button>

          <button
            type="button"
            id="viewmode-grid-btn"
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              viewMode === "grid"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
            title="All Pages Grid"
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Grid ({totalPages})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: HORIZONTAL SLIDES PRESENTATION FORMAT */}
      {/* ========================================================================= */}
      {viewMode === "slides" && (
        <div className="p-4 sm:p-5 space-y-4">
          {/* Main Slide Presentation Canvas */}
          <div
            ref={slideContainerRef}
            className="relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-xl flex flex-col min-h-[380px] sm:min-h-[460px] md:min-h-[520px]"
          >
            {/* Slide Top Navigation Bar */}
            <div className="px-4 py-3 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between text-slate-200 text-xs z-10">
              {/* Slide Counter Indicator */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-white px-2.5 py-1 rounded-md bg-indigo-600 text-xs font-mono shadow-xs">
                  Slide {currentIndex + 1} of {totalPages}
                </span>
                <span className="hidden sm:inline text-slate-400 text-[11px]">
                  ({formatBytes(currentImage.sizeBytes)})
                </span>
              </div>

              {/* Toolbar Controls */}
              <div className="flex items-center gap-1.5">
                {/* Auto-Play Slideshow Toggle */}
                <button
                  type="button"
                  id="slide-autoplay-btn"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition inline-flex items-center gap-1.5 ${
                    isPlaying
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                  title={isPlaying ? "Pause Slideshow" : "Start Auto Slideshow"}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{isPlaying ? "Playing..." : "Slideshow"}</span>
                </button>

                {/* Zoom Controls */}
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>

                {zoomLevel !== 1 && (
                  <button
                    type="button"
                    onClick={() => setZoomLevel(1)}
                    className="p-1.5 rounded-lg bg-slate-800 text-indigo-300 hover:bg-slate-700 transition text-[11px] font-mono"
                    title="Reset Zoom"
                  >
                    100%
                  </button>
                )}

                {/* Download Current Page */}
                <button
                  type="button"
                  id="download-current-slide-btn"
                  onClick={() => handleDownloadSingle(currentImage.filename, currentImage.pageNumber)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition inline-flex items-center gap-1"
                  title="Download Current Slide Image"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

                {/* Fullscreen Theater Deck */}
                <button
                  type="button"
                  id="slide-fullscreen-btn"
                  onClick={() => setIsFullscreen(true)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white transition"
                  title="Expand to Fullscreen Slide Deck"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Slide Stage with Centered Image and Left/Right Navigation */}
            <div className="relative flex-1 flex items-center justify-center p-3 sm:p-6 select-none overflow-hidden min-h-[300px]">
              {/* Previous Slide Floating Button */}
              <button
                type="button"
                id="slide-prev-btn"
                onClick={goToPrev}
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/80 hover:bg-indigo-600 text-white shadow-xl backdrop-blur-md flex items-center justify-center transition active:scale-95 border border-slate-700/60"
                title="Previous Slide (Arrow Left)"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Main Slide Image */}
              <div
                className="transition-transform duration-200 ease-out flex items-center justify-center max-w-full max-h-[460px]"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <img
                  key={currentImage.filename}
                  src={`/api/jobs/${jobId}/image/${currentImage.filename}`}
                  alt={`Slide ${currentImage.pageNumber} of ${totalPages}`}
                  className="max-h-[440px] w-auto max-w-full object-contain rounded-lg shadow-2xl border border-slate-800 pointer-events-none animate-in fade-in duration-200"
                  referrerPolicy="no-referrer"
                  onError={handleSlideImageError}
                />
              </div>

              {/* Next Slide Floating Button */}
              <button
                type="button"
                id="slide-next-btn"
                onClick={goToNext}
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/80 hover:bg-indigo-600 text-white shadow-xl backdrop-blur-md flex items-center justify-center transition active:scale-95 border border-slate-700/60"
                title="Next Slide (Arrow Right)"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Progress Bar on the Slide Stage */}
            <div className="w-full bg-slate-900 h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / totalPages) * 100}%` }}
              />
            </div>
          </div>

          {/* Quick Slider Scrubber & Direct Jump Bar */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 w-full sm:flex-1">
              <span className="font-semibold text-slate-700 shrink-0">Slide Scrub:</span>
              <input
                type="range"
                min={0}
                max={totalPages - 1}
                value={currentIndex}
                onChange={(e) => goToSlide(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600 cursor-pointer"
                title="Scrub horizontally across all pages"
              />
              <span className="font-mono font-bold text-slate-900 shrink-0 w-12 text-right">
                {currentIndex + 1}/{totalPages}
              </span>
            </div>

            {/* Jump To Slide Form */}
            <form onSubmit={handleJumpSubmit} className="flex items-center gap-1.5 shrink-0">
              <span className="text-slate-500">Go to:</span>
              <input
                type="number"
                min={1}
                max={totalPages}
                placeholder="#"
                value={jumpPageInput}
                onChange={(e) => setJumpPageInput(e.target.value)}
                className="w-16 px-2 py-1 rounded-md border border-slate-300 text-slate-900 text-xs text-center focus:outline-none focus:border-indigo-600"
              />
              <button
                type="submit"
                className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition"
              >
                Jump
              </button>
            </form>
          </div>

          {/* Horizontal Filmstrip Carousel of ALL Thumbnails */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
                <Film className="w-3.5 h-3.5 text-indigo-600" />
                <span>Horizontal Slide Filmstrip (All {totalPages} Pages)</span>
              </div>
              <div className="flex items-center gap-1 text-slate-500">
                <button
                  type="button"
                  id="filmstrip-scroll-left-btn"
                  onClick={() => scrollFilmstrip("left")}
                  className="p-1 rounded-md hover:bg-slate-200 transition text-slate-700"
                  title="Scroll Filmstrip Left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  id="filmstrip-scroll-right-btn"
                  onClick={() => scrollFilmstrip("right")}
                  className="p-1 rounded-md hover:bg-slate-200 transition text-slate-700"
                  title="Scroll Filmstrip Right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal Scroll Track */}
            <div
              ref={filmstripRef}
              className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scroll-smooth"
            >
              {images.map((img, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    data-thumb-index={idx}
                    onClick={() => goToSlide(idx)}
                    className={`shrink-0 group relative flex flex-col items-center rounded-xl p-1 transition cursor-pointer border ${
                      isActive
                        ? "bg-indigo-50 border-indigo-600 ring-2 ring-indigo-500/40 shadow-sm"
                        : "bg-slate-50 border-slate-200 hover:border-indigo-400 hover:bg-slate-100"
                    }`}
                    style={{ width: "96px" }}
                  >
                    <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-slate-200 border border-slate-200/80">
                      <img
                        src={`/api/jobs/${jobId}/image/${img.filename}`}
                        alt={`Thumb ${img.pageNumber}`}
                        className="w-full h-full object-cover transition group-hover:scale-105"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={handleSlideImageError}
                      />
                      <span
                        className={`absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          isActive
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-900/80 text-white"
                        }`}
                      >
                        #{img.pageNumber}
                      </span>
                    </div>
                    <span className="text-[10px] font-medium text-slate-600 mt-1 truncate w-full text-center">
                      Page {img.pageNumber}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: CONTINUOUS HORIZONTAL CAROUSEL TRACK */}
      {/* ========================================================================= */}
      {viewMode === "carousel" && (
        <div className="p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-600">
              Swipe or scroll horizontally through all {totalPages} slides in continuous view:
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scrollCarousel("left")}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold inline-flex items-center gap-1 transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Scroll Left</span>
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel("right")}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold inline-flex items-center gap-1 transition"
              >
                <span>Scroll Right</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Continuous Slide Cards Strip */}
          <div
            ref={carouselTrackRef}
            className="flex items-stretch gap-4 overflow-x-auto pb-4 pt-1 px-1 scroll-smooth snap-x snap-mandatory"
          >
            {images.map((img, idx) => (
              <div
                key={idx}
                className="shrink-0 snap-center bg-slate-50 border border-slate-200 hover:border-indigo-500 rounded-2xl p-3 flex flex-col justify-between transition shadow-xs hover:shadow-md group"
                style={{ width: "280px" }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[11px] font-bold font-mono">
                      Slide #{img.pageNumber}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {formatBytes(img.sizeBytes)}
                    </span>
                  </div>

                  <div
                    className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-900 border border-slate-200 cursor-pointer flex items-center justify-center group-hover:scale-[1.01] transition"
                    onClick={() => {
                      setCurrentIndex(idx);
                      setIsFullscreen(true);
                    }}
                  >
                    <img
                      src={`/api/jobs/${jobId}/image/${img.filename}`}
                      alt={`Slide ${img.pageNumber}`}
                      className="w-full h-full object-contain"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={handleSlideImageError}
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white gap-1.5">
                      <Eye className="w-5 h-5" />
                      <span className="text-xs font-semibold">Open Full Slide</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentIndex(idx);
                      setViewMode("slides");
                    }}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                  >
                    View in Slideshow
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadSingle(img.filename, img.pageNumber)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition"
                    title={`Download Page ${img.pageNumber}`}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: ALL PAGES GRID VIEW */}
      {/* ========================================================================= */}
      {viewMode === "grid" && (
        <div className="p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Showing all {totalPages} pages extracted from Scribd:</span>
            <span className="text-indigo-600 font-semibold">Click any page to open in horizontal slide view</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="group relative border border-slate-200 rounded-xl overflow-hidden bg-slate-50 hover:border-indigo-500 hover:shadow-md transition flex flex-col"
              >
                <div
                  className="relative aspect-[3/4] overflow-hidden cursor-pointer bg-slate-100 flex items-center justify-center"
                  onClick={() => {
                    setCurrentIndex(idx);
                    setViewMode("slides");
                  }}
                >
                  <img
                    src={`/api/jobs/${jobId}/image/${img.filename}`}
                    alt={`Page ${img.pageNumber}`}
                    className="w-full h-full object-cover transition group-hover:scale-105"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={handleSlideImageError}
                  />
                  <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                    <Eye className="w-6 h-6" />
                  </div>
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/70 text-white text-[10px] font-semibold backdrop-blur-xs">
                    Page {img.pageNumber}
                  </span>
                </div>

                <div className="p-2 flex items-center justify-between bg-white border-t border-slate-100 text-xs">
                  <span className="text-[11px] text-slate-500 font-mono">
                    {formatBytes(img.sizeBytes)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDownloadSingle(img.filename, img.pageNumber)}
                    className="p-1 rounded text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 transition"
                    title={`Download Page ${img.pageNumber}`}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FULLSCREEN THEATER SLIDE PRESENTATION MODAL */}
      {/* ========================================================================= */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 text-white"
          onClick={() => setIsFullscreen(false)}
        >
          {/* Top Bar */}
          <div
            className="flex items-center justify-between pb-3 border-b border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-lg bg-indigo-600 font-bold text-xs font-mono">
                Slide {currentIndex + 1} of {totalPages}
              </span>
              <p className="text-sm font-semibold text-slate-200 truncate max-w-md hidden sm:block">
                {documentTitle}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  isPlaying ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? "Pause" : "Slideshow"}</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownloadSingle(currentImage.filename, currentImage.pageNumber)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Slide</span>
              </button>

              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                title="Exit Fullscreen (Esc)"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Stage with Big Slide */}
          <div
            className="relative flex-1 flex items-center justify-center p-2 sm:p-6 select-none overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={goToPrev}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-900/90 hover:bg-indigo-600 text-white flex items-center justify-center shadow-2xl transition active:scale-95 border border-slate-700"
              title="Previous (Left Arrow)"
            >
              <ChevronLeft className="w-7 h-7" />
            </button>

            <img
              src={`/api/jobs/${jobId}/image/${currentImage.filename}`}
              alt={`Slide ${currentImage.pageNumber}`}
              className="max-h-[75vh] max-w-[90vw] object-contain rounded-xl shadow-2xl border border-slate-800 select-none animate-in fade-in duration-150"
              referrerPolicy="no-referrer"
              onError={handleSlideImageError}
            />

            <button
              type="button"
              onClick={goToNext}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-900/90 hover:bg-indigo-600 text-white flex items-center justify-center shadow-2xl transition active:scale-95 border border-slate-700"
              title="Next (Right Arrow)"
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          </div>

          {/* Bottom Floating Thumbnails Ribbon */}
          <div
            className="pt-3 border-t border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700 max-w-5xl mx-auto">
              {images.map((img, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    className={`shrink-0 rounded-lg p-1 border transition cursor-pointer ${
                      isActive
                        ? "bg-indigo-600/30 border-indigo-500 ring-2 ring-indigo-500"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-600"
                    }`}
                    style={{ width: "64px" }}
                  >
                    <div className="aspect-[3/4] rounded overflow-hidden bg-slate-800">
                      <img
                        src={`/api/jobs/${jobId}/image/${img.filename}`}
                        alt={`Thumb ${img.pageNumber}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={handleSlideImageError}
                      />
                    </div>
                    <span className="block text-[9px] text-center font-mono mt-0.5 text-slate-300">
                      #{img.pageNumber}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* In-Feed Slide Ad Unit */}
      {adSettings?.enabled && adSettings?.inFeedAd && (
        <div className="mt-4">
          <InFeedAdBanner settings={adSettings} />
        </div>
      )}
    </section>
  );
}
