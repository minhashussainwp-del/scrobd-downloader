import { X, Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageModalProps {
  imageUrl: string;
  imageName: string;
  pageNumber: number;
  totalPages: number;
  isOpen: boolean;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onDownloadSingle: () => void;
}

export function ImageModal({
  imageUrl,
  imageName,
  pageNumber,
  totalPages,
  isOpen,
  onClose,
  onPrev,
  onNext,
  onDownloadSingle,
}: ImageModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
      id="image-preview-modal"
      onClick={onClose}
    >
      <div
        className="relative bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 text-white">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">Page {pageNumber} of {totalPages}</span>
            <span className="text-xs text-slate-400 font-mono">({imageName})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="modal-download-btn"
              onClick={onDownloadSingle}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Page</span>
            </button>

            <button
              type="button"
              id="modal-close-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content View */}
        <div className="relative flex-1 bg-slate-950 p-4 flex items-center justify-center overflow-auto min-h-[400px]">
          {onPrev && (
            <button
              type="button"
              id="modal-prev-btn"
              onClick={onPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white shadow-lg transition"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <img
            src={imageUrl}
            alt={`Page ${pageNumber}`}
            className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-md select-none"
            referrerPolicy="no-referrer"
          />

          {onNext && (
            <button
              type="button"
              id="modal-next-btn"
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white shadow-lg transition"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
