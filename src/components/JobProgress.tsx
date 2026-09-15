import { useState } from "react";
import { Loader2, Terminal, ChevronDown, ChevronUp, AlertCircle, CheckCircle } from "lucide-react";
import { DownloadJob } from "../types";

interface JobProgressProps {
  job: DownloadJob;
  onCancel: () => void;
}

export function JobProgress({ job, onCancel }: JobProgressProps) {
  const [showLogs, setShowLogs] = useState(true);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8" id="job-progress-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              Scraping Scribd Document
            </h3>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Task ID: <span className="font-mono text-slate-700">{job.id}</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          id="cancel-job-btn"
          onClick={onCancel}
          className="text-xs text-slate-500 hover:text-slate-800 font-medium px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
        >
          Cancel
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span>{job.stepMessage}</span>
          <span className="font-mono">{job.progress}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.max(5, job.progress)}%` }}
          />
        </div>
      </div>

      {/* Live Pipeline Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6 text-xs">
        <div className={`p-3 rounded-xl border flex items-center gap-2 ${
          job.progress >= 20 ? "bg-emerald-50/50 border-emerald-200 text-slate-900" : "bg-slate-50 border-slate-200 text-slate-400"
        }`}>
          <div className={`w-2 h-2 rounded-full ${job.progress >= 20 ? "bg-emerald-600" : "bg-slate-300"}`} />
          <span className="font-medium">1. Fetch Document Manifest</span>
        </div>

        <div className={`p-3 rounded-xl border flex items-center gap-2 ${
          job.progress >= 50 ? "bg-emerald-50/50 border-emerald-200 text-slate-900" : "bg-slate-50 border-slate-200 text-slate-400"
        }`}>
          <div className={`w-2 h-2 rounded-full ${job.progress >= 50 ? "bg-emerald-600" : "bg-slate-300"}`} />
          <span className="font-medium">2. Extract Page Images</span>
        </div>

        <div className={`p-3 rounded-xl border flex items-center gap-2 ${
          job.progress >= 85 ? "bg-emerald-50/50 border-emerald-200 text-slate-900" : "bg-slate-50 border-slate-200 text-slate-400"
        }`}>
          <div className={`w-2 h-2 rounded-full ${job.progress >= 85 ? "bg-emerald-600" : "bg-slate-300"}`} />
          <span className="font-medium">
            {job.format === "pdf" ? "3. Compile PDF Document" : "3. Bundle ZIP Archive"}
          </span>
        </div>
      </div>

      {/* Live Scraper Output Log Console */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-950 text-slate-200">
        <button
          type="button"
          id="toggle-logs-btn"
          onClick={() => setShowLogs(!showLogs)}
          className="w-full px-4 py-2.5 bg-slate-900 text-xs font-semibold flex items-center justify-between text-slate-300 hover:text-white transition border-b border-slate-800"
        >
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Real-Time Scraper Console</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
              {job.logs.length} entries
            </span>
          </div>
          {showLogs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showLogs && (
          <div className="p-3.5 font-mono text-[11px] leading-relaxed max-h-48 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
            {job.logs.map((log, idx) => (
              <div key={idx} className="break-all text-slate-300">
                {log}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
