import { useState } from "react";
import { Shield, Car, FileText, CheckCircle, Phone, Menu, X, ChevronLeft, Star } from "lucide-react";

const COMPANIES = [
  "العزيزية", "ملاذ", "بوبا", "التأمين الأهلي", "تكافل الراجحي",
  "الوطنية", "ميدغلف", "سلامة", "الإتحاد", "اكسا",
];

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState<"ar"|"en">("ar");

  const isAr = lang === "ar";

  return (
    <div className="min-h-screen bg-white font-sans" dir={isAr ? "rtl" : "ltr"} style={{ fontFamily: "system-ui, -apple-system, 'Segoe UI', Arial, sans-serif" }}>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = "/tameeni/"}>
            <div className="flex items-center gap-1">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-[20px] font-extrabold text-blue-600">تأميني</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {["الرئيسية", "الخدمات", "عن الشركة", "اتصل بنا"].map((item) => (
              <a key={item} href="#" className="text-[15px] font-semibold text-gray-600 hover:text-blue-600 transition-colors">{item}</a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setLang(isAr ? "en" : "ar")}
              className="text-[14px] font-semibold text-gray-500 hover:text-blue-600 transition-colors px-2"
            >
              {isAr ? "English" : "العربية"}
            </button>
            <button
              onClick={() => window.location.href = "/tameeni/login"}
              className="px-4 py-2 rounded-lg border border-blue-600 text-blue-600 text-[14px] font-bold hover:bg-blue-50 transition-colors"
            >
              {isAr ? "تسجيل الدخول" : "Sign In"}
            </button>
            <button
              onClick={() => window.location.href = "/tameeni/quote"}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-[14px] font-bold hover:bg-blue-700 transition-colors"
            >
              {isAr ? "ابدأ الآن" : "Get Quote"}
            </button>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
            {["الرئيسية", "الخدمات", "عن الشركة", "اتصل بنا"].map((item) => (
              <a key={item} href="#" className="block text-[15px] font-semibold text-gray-600 py-2">{item}</a>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <button onClick={() => window.location.href = "/tameeni/login"} className="w-full py-2.5 rounded-lg border border-blue-600 text-blue-600 font-bold text-[15px]">تسجيل الدخول</button>
              <button onClick={() => window.location.href = "/tameeni/quote"} className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-bold text-[15px]">ابدأ الآن</button>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="bg-gradient-to-bl from-blue-50 via-white to-emerald-50 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-3 py-1.5 text-[13px] font-bold">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {isAr ? "هل تريد شراء وثيقة تأمين؟ تحقق من هذا الموقع الصحيح" : "Get the best car insurance deals"}
            </div>
            <h1 className="text-[36px] md:text-[48px] font-extrabold text-gray-900 leading-tight">
              {isAr ? (
                <>أول منصة لتأمين<br />السيارات في<br /><span className="text-blue-600">السعودية</span></>
              ) : (
                <>Saudi Arabia's First<br /><span className="text-blue-600">Car Insurance Platform</span></>
              )}
            </h1>
            <p className="text-[16px] text-gray-500 leading-relaxed max-w-md">
              {isAr
                ? "جميع شركات التأمين في مكان واحد، مجموعة واسعة من الخيارات وأسعار فورية لوثائق التأمين"
                : "All insurance companies in one place with instant pricing for your insurance policy"}
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => window.location.href = "/tameeni/quote"}
                className="px-7 py-3.5 rounded-xl bg-blue-600 text-white text-[16px] font-extrabold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-[0.98]"
              >
                {isAr ? "ابدأ الآن" : "Get Started"}
              </button>
              <button
                onClick={() => window.location.href = "/tameeni/login"}
                className="px-7 py-3.5 rounded-xl border-2 border-blue-200 text-blue-700 text-[16px] font-bold hover:bg-blue-50 transition-colors"
              >
                {isAr ? "تسجيل الدخول" : "Sign In"}
              </button>
            </div>
          </div>

          {/* Hero image / illustration */}
          <div className="relative hidden md:flex justify-center">
            <div className="w-80 h-80 rounded-3xl bg-gradient-to-br from-blue-100 to-emerald-100 flex items-center justify-center relative overflow-hidden shadow-2xl">
              <Car className="w-40 h-40 text-blue-300" strokeWidth={1} />
              <div className="absolute top-4 right-4 bg-white rounded-2xl p-3 shadow-lg">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-[12px] font-bold text-gray-700">تأمين موثوق</span>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 bg-white rounded-2xl p-3 shadow-lg">
                <div className="text-[20px] font-extrabold text-blue-600">18</div>
                <div className="text-[11px] text-gray-500 font-semibold">شركة تأمين</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPANIES */}
      <section className="py-12 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-6">18 شركة — شركاء التأمين المعتمدين</p>
          <div className="flex flex-wrap justify-center gap-4">
            {COMPANIES.map((c) => (
              <div key={c} className="px-5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-[13px] font-semibold text-gray-600 hover:border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer">
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-[28px] font-extrabold text-gray-900 mb-3">خدماتنا</h2>
            <p className="text-gray-500 text-[15px]">كل ما تحتاجه في مكان واحد</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Car className="w-7 h-7 text-blue-600" />, title: "تأمين ضد الغير", desc: "أفضل أسعار التأمين الإلزامي من جميع شركات التأمين المعتمدة في المملكة" },
              { icon: <Shield className="w-7 h-7 text-emerald-600" />, title: "تأمين شامل", desc: "حماية شاملة لسيارتك من جميع المخاطر والحوادث بأسعار تنافسية" },
              { icon: <FileText className="w-7 h-7 text-purple-600" />, title: "تجديد الوثيقة", desc: "جدد وثيقة تأمينك بسهولة وسرعة دون الحاجة للذهاب للشركة" },
            ].map((s) => (
              <div key={s.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-4">{s.icon}</div>
                <h3 className="text-[17px] font-extrabold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-[14px] text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { val: "+200K", label: "عميل سعيد" },
            { val: "18", label: "شركة تأمين" },
            { val: "98%", label: "نسبة الرضا" },
            { val: "24/7", label: "دعم متواصل" },
          ].map((s) => (
            <div key={s.label} className="space-y-1">
              <div className="text-[32px] font-extrabold text-blue-600">{s.val}</div>
              <div className="text-[14px] font-semibold text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-[26px] font-extrabold text-center text-gray-900 mb-10">آراء عملائنا</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "محمد العتيبي", text: "خدمة ممتازة وأسعار منافسة، تعاملت معهم مرتين وكانت التجربة رائعة." },
              { name: "سارة الغامدي", text: "سهولة في الاستخدام وسرعة في الإنجاز. أنصح الجميع بالتعامل مع تأميني." },
              { name: "أحمد القحطاني", text: "حصلت على أفضل سعر مقارنة بجميع شركات التأمين. شكراً تأميني!" },
            ].map((r) => (
              <div key={r.name} className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-[14px] text-gray-600 leading-relaxed mb-4">"{r.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[13px] font-extrabold text-blue-700">
                    {r.name[0]}
                  </div>
                  <span className="text-[14px] font-bold text-gray-700">{r.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-[28px] font-extrabold text-gray-900 mb-4">احصل على أفضل عرض تأمين الآن</h2>
          <p className="text-gray-500 text-[15px] mb-8">قارن الأسعار واختر الأنسب لك في أقل من دقيقتين</p>
          <button
            onClick={() => window.location.href = "/tameeni/quote"}
            className="px-10 py-4 rounded-xl bg-blue-600 text-white text-[17px] font-extrabold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            احصل على عرض مجاني
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-between gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-[18px] font-extrabold">تأميني</span>
              </div>
              <p className="text-gray-400 text-[13px] max-w-xs">أول منصة لتأمين السيارات في المملكة العربية السعودية</p>
            </div>
            <div className="grid grid-cols-2 gap-x-16 gap-y-2 text-[13px] text-gray-400">
              {["الرئيسية", "الخدمات", "عن الشركة", "اتصل بنا", "سياسة الخصوصية", "الشروط والأحكام"].map((l) => (
                <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-wrap justify-between items-center gap-4">
            <p className="text-gray-500 text-[12px]">© 2024 تأميني. جميع الحقوق محفوظة</p>
            <div className="flex items-center gap-1 text-gray-500 text-[12px]">
              <Phone className="w-3 h-3" />
              <span dir="ltr">920000000</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Admin link */}
      <a href="/tameeni/admin" className="fixed bottom-4 left-4 text-[10px] text-gray-300 hover:text-gray-500 transition-colors">لوحة التحكم</a>
    </div>
  );
}
