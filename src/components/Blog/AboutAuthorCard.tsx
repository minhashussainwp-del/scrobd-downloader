import React, { useState, useRef } from "react";
import {
  Mail,
  Copy,
  Check,
  Camera,
  Edit3,
  BadgeCheck,
  Sparkles,
  Upload,
  Globe,
  Code2,
  X,
  RotateCcw
} from "lucide-react";
import { useAuthorProfile } from "../../data/authorData";
import { AuthorProfile } from "../../types";

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80"
];

interface AboutAuthorCardProps {
  compact?: boolean;
  className?: string;
  showEditTrigger?: boolean;
}

export function AboutAuthorCard({
  compact = false,
  className = "",
  showEditTrigger = true,
}: AboutAuthorCardProps) {
  const { profile, updateProfile, resetProfile } = useAuthorProfile();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Modal edit state
  const [editForm, setEditForm] = useState<AuthorProfile>(profile);
  const [activeTab, setActiveTab] = useState<"upload" | "url" | "presets">("upload");
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 3000);
  };

  const openEditModal = () => {
    setEditForm(profile);
    setUploadError("");
    setIsEditModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (JPG, PNG, WebP, SVG).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size should be under 5MB for optimal browser performance.");
      return;
    }

    setUploadError("");
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setEditForm((prev) => ({ ...prev, avatar: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(editForm);
    setIsEditModalOpen(false);
  };

  if (compact) {
    return (
      <>
        <div className={`bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-4 ${className}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100/80 px-2.5 py-0.5 rounded-full">
              About the Author
            </span>
            {showEditTrigger && (
              <button
                type="button"
                onClick={openEditModal}
                className="text-[11px] text-slate-400 hover:text-indigo-600 transition flex items-center gap-1"
                title="Change author photo or bio"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Photo</span>
              </button>
            )}
          </div>

          <div className="flex items-start gap-3.5">
            <div className="relative shrink-0">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-13 h-13 rounded-xl object-cover border border-slate-200 shadow-2xs"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" />
              </span>
            </div>

            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="text-sm font-extrabold text-slate-900 leading-tight">
                  {profile.name}
                </h4>
                <BadgeCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              </div>
              <p className="text-xs font-semibold text-indigo-600 leading-tight">
                {profile.role}
              </p>
              <p className="text-[11px] text-slate-500 line-clamp-1">
                {profile.title}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
            {profile.bio}
          </p>

          <div className="pt-1 flex items-center gap-2">
            <a
              href={`mailto:${profile.email}`}
              className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold text-center transition flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Minhas</span>
            </a>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
              title="Copy Email"
            >
              {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Edit Author Modal */}
        {isEditModalOpen && renderEditModal()}
      </>
    );
  }

  // Full-featured author card for article footers
  return (
    <>
      <div
        className={`bg-gradient-to-br from-white via-slate-50/50 to-indigo-50/20 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm relative overflow-hidden ${className}`}
        id="about-the-author-section"
      >
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100/90 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              About the Author & Developer
            </span>
          </div>

          {showEditTrigger && (
            <button
              type="button"
              onClick={openEditModal}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-indigo-300 bg-white text-xs font-semibold text-slate-700 hover:text-indigo-600 transition flex items-center gap-2 shadow-2xs"
            >
              <Camera className="w-3.5 h-3.5 text-indigo-600" />
              <span>Update Photo & Bio</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 pt-6 items-start">
          {/* Author Avatar Column */}
          <div className="md:col-span-4 lg:col-span-3 flex flex-col items-center md:items-start space-y-3">
            <div className="relative group cursor-pointer" onClick={openEditModal} title="Click to change author image">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-white shadow-md ring-4 ring-indigo-50 bg-slate-100">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[11px] font-bold gap-1">
                <Camera className="w-4 h-4" />
                <span>Change</span>
              </div>
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-xs">
                <BadgeCheck className="w-4 h-4 text-white" />
              </span>
            </div>

            <div className="text-center md:text-left space-y-1">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center justify-center md:justify-start gap-1.5">
                <span>{profile.name}</span>
                <BadgeCheck className="w-5 h-5 text-indigo-600 shrink-0" />
              </h3>
              <p className="text-xs font-bold text-indigo-600">
                {profile.role}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                {profile.title}
              </p>
            </div>
          </div>

          {/* Author Details & Bio Column */}
          <div className="md:col-span-8 lg:col-span-9 space-y-4">
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {profile.bio}
            </p>

            {/* Core Skill Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Core Specializations
              </span>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Action Row */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email {profile.name}</span>
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-white bg-slate-50 text-xs font-semibold text-slate-700 transition"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Copied: {profile.email}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy: {profile.email}</span>
                  </>
                )}
              </button>

              <span className="text-xs text-slate-400 hidden sm:inline">•</span>

              <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                <Code2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>Full-Stack & Vibe Coding</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Author Modal */}
      {isEditModalOpen && renderEditModal()}
    </>
  );

  function renderEditModal() {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Modal Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="space-y-0.5">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-indigo-600" />
                <span>Update Author Profile & Photo</span>
              </h3>
              <p className="text-xs text-slate-500">
                Upload a new author photo or adjust bio, role, and contact email.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSaveModal} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* Image Selection Section */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  Author Photo / Avatar
                </label>
                <div className="flex rounded-lg bg-slate-200/80 p-0.5 text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setActiveTab("upload")}
                    className={`px-2.5 py-1 rounded-md transition ${activeTab === "upload" ? "bg-white text-indigo-700 shadow-2xs" : "text-slate-600 hover:text-slate-900"}`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("url")}
                    className={`px-2.5 py-1 rounded-md transition ${activeTab === "url" ? "bg-white text-indigo-700 shadow-2xs" : "text-slate-600 hover:text-slate-900"}`}
                  >
                    Image URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("presets")}
                    className={`px-2.5 py-1 rounded-md transition ${activeTab === "presets" ? "bg-white text-indigo-700 shadow-2xs" : "text-slate-600 hover:text-slate-900"}`}
                  >
                    Presets
                  </button>
                </div>
              </div>

              {/* Live Preview & Uploader */}
              <div className="flex items-center gap-4 pt-1">
                <img
                  src={editForm.avatar}
                  alt="Author Preview"
                  className="w-16 h-16 rounded-xl object-cover border-2 border-indigo-200 shadow-2xs bg-white shrink-0"
                  referrerPolicy="no-referrer"
                />

                <div className="flex-1 min-w-0">
                  {activeTab === "upload" && (
                    <div className="space-y-1.5">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="author-photo-upload"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2 px-3 rounded-xl border border-dashed border-indigo-300 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center justify-center gap-2 transition"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Choose Image from Device</span>
                      </button>
                      <p className="text-[10px] text-slate-400">
                        Supports JPG, PNG, WebP up to 5MB. Previews instantly.
                      </p>
                    </div>
                  )}

                  {activeTab === "url" && (
                    <div className="space-y-1.5">
                      <input
                        type="url"
                        value={editForm.avatar}
                        onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })}
                        placeholder="https://example.com/author.jpg"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white"
                      />
                      <p className="text-[10px] text-slate-400">
                        Paste direct URL to your Gravatar, WordPress or social avatar.
                      </p>
                    </div>
                  )}

                  {activeTab === "presets" && (
                    <div className="flex items-center gap-2">
                      {AVATAR_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setEditForm({ ...editForm, avatar: preset })}
                          className={`w-9 h-9 rounded-lg overflow-hidden border-2 transition ${editForm.avatar === preset ? "border-indigo-600 scale-105" : "border-slate-200 hover:opacity-80"}`}
                        >
                          <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {uploadError && (
                <p className="text-xs text-red-600 font-medium pt-1">
                  {uploadError}
                </p>
              )}
            </div>

            {/* Author Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Author Name</label>
              <input
                type="text"
                required
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
              />
            </div>

            {/* Role & Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Primary Role</label>
                <input
                  type="text"
                  required
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  placeholder="e.g. SEO Expert & Full Stack Engineer"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Secondary Title</label>
                <input
                  type="text"
                  value={editForm.title || ""}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="e.g. WordPress Designer & Vibe Coder"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                />
              </div>
            </div>

            {/* Contact Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Contact Email</label>
              <input
                type="email"
                required
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
              />
            </div>

            {/* Bio */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Biography</label>
              <textarea
                rows={3}
                required
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 leading-relaxed"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  resetProfile();
                  setIsEditModalOpen(false);
                }}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Reset Defaults</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition"
                >
                  Save Author Profile
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
