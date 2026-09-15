import { DownloadJob } from "../types";
import { Clock, FileText, Image, Download, Trash2 } from "lucide-react";

interface HistoryListProps {
  jobs: DownloadJob[];
  onSelectJob: (job: DownloadJob) => void;
  onClearHistory: () => void;
}

export function HistoryList({ jobs, onSelectJob, onClearHistory }: HistoryListProps) {
  if (jobs.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6" id="history-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-bold text-slate-900">Recent Session Downloads</h3>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {jobs.length}
          </span>
        </div>

        <button
          type="button"
          id="clear-history-btn"
          onClick={onClearHistory}
          className="text-xs text-slate-400 hover:text-rose-600 transition inline-flex items-center gap-1"
        >
          <Trash2 className="w-3 h-3" />
          <span>Clear</span>
        </button>
      </div>

      <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-lg transition cursor-pointer"
            onClick={() => onSelectJob(job)}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-slate-100 text-slate-700 shrink-0">
                {job.format === "pdf" ? <FileText className="w-4 h-4" /> : <Image className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">
                  {job.documentTitle || job.url}
                </p>
                <p className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                  <span className="uppercase font-semibold text-[10px] text-slate-600">{job.format}</span>
                  <span>•</span>
                  <span>{new Date(job.createdAt).toLocaleTimeString()}</span>
                  <span>•</span>
                  <span className={job.status === "completed" ? "text-emerald-600 font-medium" : "text-rose-600 font-medium"}>
                    {job.status === "completed" ? "Completed" : "Failed"}
                  </span>
                </p>
              </div>
            </div>

            {job.status === "completed" && (
              <a
                href={`/api/jobs/${job.id}/download`}
                download
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition shrink-0"
                title="Download file"
              >
                <Download className="w-4 h-4" />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
