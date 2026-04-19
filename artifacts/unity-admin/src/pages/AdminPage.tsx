import { useState, useEffect } from "react";
import {
  Shield,
  LogOut,
  PlusCircle,
  X,
  Eye,
  EyeOff,
  LayoutDashboard,
} from "lucide-react";
import { authApi, projectsApi } from "@/lib/api";
import type { ProjectInfo } from "@/lib/api";
import ProjectCard from "@/components/ProjectCard";
import ProjectDashboard from "@/components/ProjectDashboard";

const BRAND = { primary: "#1a3d6e", gold: "#c4923e", bg: "#0d1f35" };

// ── Add-Project modal ─────────────────────────────────────────────────────────
function AddProjectModal({
  onClose,
  onAdded,
}: {
  onClose: () => void;
  onAdded: () => void;
}) {
  const [key, setKey] = useState("");
  const [label, setLabel] = useState("");
  const [apiBase, setApiBase] = useState("");
  const [sitePath, setSitePath] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const result = await projectsApi.add({ key: key.trim(), label: label.trim(), apiBase: apiBase.trim(), sitePath: sitePath.trim() });
    setLoading(false);
    if (result.ok) { onAdded(); onClose(); }
    else setErr(result.error ?? "حدث خطأ");
  };

  const field = "w-full border border-white/10 bg-white/5 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-white/30 placeholder-white/30";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className="bg-[#0d1f35] border border-white/15 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl" dir="rtl">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-black text-lg">إضافة مشروع جديد</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-white/60 text-xs font-bold block mb-1.5">المفتاح (key) — مثال: myproject</label>
            <input className={field} placeholder="my-project" value={key} onChange={(e) => setKey(e.target.value)} required pattern="[a-z0-9_-]+" />
          </div>
          <div>
            <label className="text-white/60 text-xs font-bold block mb-1.5">الاسم الظاهر</label>
            <input className={field} placeholder="My Project" value={label} onChange={(e) => setLabel(e.target.value)} required />
          </div>
          <div>
            <label className="text-white/60 text-xs font-bold block mb-1.5">مسار API — مثال: /api/myproject</label>
            <input className={field} placeholder="/api/myproject" value={apiBase} onChange={(e) => setApiBase(e.target.value)} required dir="ltr" />
          </div>
          <div>
            <label className="text-white/60 text-xs font-bold block mb-1.5">مسار الموقع (اختياري) — مثال: /myproject/</label>
            <input className={field} placeholder="/myproject/" value={sitePath} onChange={(e) => setSitePath(e.target.value)} dir="ltr" />
          </div>
          {err && <p className="text-red-400 text-xs font-bold text-center bg-red-500/10 rounded-xl py-2 px-3">{err}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-black text-sm hover:opacity-90 transition-opacity"
            style={{ background: BRAND.primary }}
          >
            {loading ? "جاري الإضافة..." : "إضافة المشروع"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Login screen ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    const result = await authApi.login(email, pw);
    setLoading(false);
    if (result.ok) onLogin();
    else setErr(result.error ?? "بيانات الدخول غير صحيحة");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      dir="rtl"
      style={{ fontFamily: "'Cairo', system-ui, sans-serif", background: `linear-gradient(135deg, ${BRAND.bg}, ${BRAND.primary})` }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xs p-8 space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: BRAND.primary }}>
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-black text-gray-900">لوحة التحكم الرئيسية</h1>
          <p className="text-gray-500 text-sm">Master Dashboard</p>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="البريد الإلكتروني"
            required
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-[#1a3d6e]"
            dir="ltr"
          />
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="كلمة المرور"
              required
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-[#1a3d6e]"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {err && <p className="text-red-500 text-xs font-bold text-center">{err}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-black text-sm hover:opacity-90 transition-opacity"
            style={{ background: BRAND.primary }}
          >
            {loading ? "جاري التحقق..." : "دخول"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Master Dashboard ──────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null); // null = checking
  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, any[]>>({});
  const [activeProject, setActiveProject] = useState<ProjectInfo | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Check existing session on mount
  useEffect(() => {
    authApi.me().then(({ ok }) => setAuthed(ok));
  }, []);

  // Load project list when authenticated
  useEffect(() => {
    if (!authed) return;
    loadProjects();
  }, [authed]);

  // Poll submission counts for all projects every 5s
  useEffect(() => {
    if (!authed || projects.length === 0) return;

    const fetchAll = async () => {
      const results = await Promise.all(
        projects.map(async (p) => {
          const { projectApi } = await import("@/lib/api");
          const data = await projectApi.getSubmissions(p.apiBase);
          return [p.key, data] as [string, any[]];
        })
      );
      setSubmissions(Object.fromEntries(results));
    };

    fetchAll();
    const iv = setInterval(fetchAll, 5000);
    return () => clearInterval(iv);
  }, [authed, projects]);

  const loadProjects = async () => {
    const list = await projectsApi.list();
    setProjects(list);
  };

  const handleLogout = async () => {
    await authApi.logout();
    setAuthed(false);
    setActiveProject(null);
  };

  const handleDeleteProject = async (key: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المشروع؟")) return;
    await projectsApi.remove(key);
    loadProjects();
  };

  // Loading state while checking session
  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: BRAND.bg }}>
        <div className="text-white/40 font-bold text-sm animate-pulse">جاري التحقق...</div>
      </div>
    );
  }

  if (!authed) {
    return <LoginScreen onLogin={() => setAuthed(true)} />;
  }

  return (
    <div
      className="min-h-screen"
      dir="rtl"
      style={{ fontFamily: "'Cairo', system-ui, sans-serif", background: `linear-gradient(180deg, ${BRAND.bg} 0%, #0a1628 100%)` }}
    >
      {/* Add project modal */}
      {showAddModal && (
        <AddProjectModal
          onClose={() => setShowAddModal(false)}
          onAdded={loadProjects}
        />
      )}

      {/* Header */}
      <header
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{ background: `${BRAND.primary}cc`, borderBottom: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: BRAND.gold }}>
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-white font-black text-base">Master Dashboard</span>
              <span className="text-white/50 text-[11px] mr-2">
                {activeProject ? activeProject.label : "جميع المشاريع"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {activeProject && (
              <button
                onClick={() => setActiveProject(null)}
                className="text-white/60 hover:text-white text-xs font-bold transition-colors"
              >
                ← المشاريع
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-red-400 hover:text-red-300 text-sm font-bold transition-colors"
            >
              <LogOut className="w-4 h-4" /> خروج
            </button>
          </div>
        </div>
      </header>

      <div className={activeProject ? "" : "max-w-7xl mx-auto px-4 py-6"}>
        {activeProject ? (
          // ── Per-project view: full height, no padding ────────────────────────
          <div style={{ height: "calc(100vh - 56px)", overflow: "hidden" }}>
            <ProjectDashboard project={activeProject} onBack={() => setActiveProject(null)} />
          </div>
        ) : (
          // ── Projects overview ───────────────────────────────────────────────
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <h2 className="text-white font-black text-xl flex-1">المشاريع</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 text-white font-bold text-sm px-4 py-2 rounded-xl transition-colors hover:opacity-90"
                style={{ background: BRAND.gold }}
              >
                <PlusCircle className="w-4 h-4" />
                إضافة مشروع
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="bg-white/5 rounded-2xl p-12 text-center border border-white/10">
                <p className="text-white/40 font-semibold">جاري تحميل المشاريع...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {projects.map((p) => {
                  const data = submissions[p.key] ?? [];
                  const live = data.filter((v) => v.isActive).length;
                  return (
                    <ProjectCard
                      key={p.key}
                      project={p}
                      liveCount={live}
                      totalCount={data.length}
                      onOpen={() => setActiveProject(p)}
                      onDelete={!p.builtin ? () => handleDeleteProject(p.key) : undefined}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
