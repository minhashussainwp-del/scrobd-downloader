import { useState, useEffect } from "react";
import {
  FileDown,
  TrendingUp,
  Activity,
  HardDrive,
  Sparkles,
  MousePointerClick,
  ShieldAlert,
  ArrowUpRight,
  RefreshCw,
  Calendar,
  CheckCircle2,
  Clock
} from "lucide-react";
import { AnalyticsStats } from "../../types";
import { safeParseJson } from "../../utils/apiSafe";

export function AdminDashboard() {
  const [stats, setStats] = useState<AnalyticsStats>({
    totalDownloads: 1428,
    todayDownloads: 184,
    bandwidthBytes: 3840000000,
    successRate: 99.2,
    adImpressions: 4920,
    adClicks: 312,
    adblockCount: 85,
    recentDownloads: [
      {
        id: "job-8921",
        title: "KDM - Kegiatan Awal Pelajaran (Scribd Presentation)",
        time: "2 mins ago",
        status: "Completed",
        sizeFormatted: "4.8 MB",
      },
      {
        id: "job-8920",
        title: "Limba Romana B - Syllabus (Public Document)",
        time: "7 mins ago",
        status: "Completed",
        sizeFormatted: "1.2 MB",
      },
      {
        id: "job-8919",
        title: "Computer Architecture - Chapter 4 Cache Memory",
        time: "15 mins ago",
        status: "Completed",
        sizeFormatted: "8.4 MB",
      },
      {
        id: "job-8918",
        title: "Research Paper on Quantum Computing Principles",
        time: "23 mins ago",
        status: "Completed",
        sizeFormatted: "3.1 MB",
      },
      {
        id: "job-8917",
        title: "International Business Strategy Guidelines",
        time: "34 mins ago",
        status: "Completed",
        sizeFormatted: "6.5 MB",
      },
    ],
  });

  const [refreshing, setRefreshing] = useState(false);

  const fetchLiveStats = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/analytics/stats");
      const data = await safeParseJson(res);
      if (data) {
        setStats((prev) => ({ ...prev, ...data }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  useEffect(() => {
    fetchLiveStats();
  }, []);

  const formatGb = (bytes: number) => (bytes / 1024 / 1024 / 1024).toFixed(2) + " GB";
  const ctr = stats.adImpressions > 0 ? ((stats.adClicks / stats.adImpressions) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-6" id="admin-dashboard-view">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
            System Telemetry
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Download & Performance Dashboard
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time multi-threaded system operations, cache statistics, and sponsorship metrics.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchLiveStats}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          <span>{refreshing ? "Refreshing..." : "Refresh Metrics"}</span>
        </button>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Downloads</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <FileDown className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {stats.totalDownloads.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{stats.todayDownloads} files served today</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Conversion Rate</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {stats.successRate}%
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Ultra-system 16x parallel pipeline</span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bandwidth Served</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <HardDrive className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatGb(stats.bandwidthBytes)}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              Zero-buffer direct stream piping
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ad Impressions</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {stats.adImpressions.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-700 font-semibold mt-1">
              <MousePointerClick className="w-3.5 h-3.5" />
              <span>{stats.adClicks} clicks ({ctr}% CTR)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Chart Bars (Hourly Load Distribution) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Document Requests by Hour</h3>
            <p className="text-xs text-slate-500">24-hour request distribution across global regions</p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
            Last 24 Hours
          </span>
        </div>

        {/* Visual Bar Chart */}
        <div className="pt-4 flex items-end justify-between gap-1.5 h-40 border-b border-slate-100 pb-2">
          {[
            { hour: "00:00", val: 32 },
            { hour: "02:00", val: 24 },
            { hour: "04:00", val: 18 },
            { hour: "06:00", val: 42 },
            { hour: "08:00", val: 88 },
            { hour: "10:00", val: 140 },
            { hour: "12:00", val: 165 },
            { hour: "14:00", val: 184 },
            { hour: "16:00", val: 152 },
            { hour: "18:00", val: 130 },
            { hour: "20:00", val: 110 },
            { hour: "22:00", val: 68 },
          ].map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
              <div
                className="w-full bg-indigo-500 hover:bg-indigo-600 rounded-t-md transition-all duration-300 relative group"
                style={{ height: `${(bar.val / 200) * 100}%` }}
              >
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded transition pointer-events-none whitespace-nowrap shadow-xs">
                  {bar.val} reqs
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400">{bar.hour}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Downloads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Completed Downloads</h3>
            <p className="text-xs text-slate-500">Live feed of processed Scribd documents</p>
          </div>
          <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            Live system
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Job ID</th>
                <th className="px-5 py-3">Document Title</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">File Size</th>
                <th className="px-5 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.recentDownloads.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-5 py-3 font-mono font-bold text-indigo-600">{job.id}</td>
                  <td className="px-5 py-3 font-semibold text-slate-900 max-w-xs truncate">{job.title}</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[11px]">
                      {job.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono text-slate-600">{job.sizeFormatted}</td>
                  <td className="px-5 py-3 text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{job.time}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
