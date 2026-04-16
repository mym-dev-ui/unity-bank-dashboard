import { useState } from "react";
import { Search, Menu, X, ChevronRight } from "lucide-react";

const COMPANIES = [
  { name: "الاتحاد", en: "Aletihad" },
  { name: "الألمانية", en: "Gulf General" },
  { name: "Mutakamela", en: "Mutakamela" },
  { name: "SALAMA", en: "Salama" },
  { name: "ACIG", en: "ACIG" },
  { name: "الدرع العربي", en: "Arabian Shield" },
  { name: "Walaa", en: "Walaa" },
  { name: "Arabia", en: "Arabia" },
  { name: "ملاذ", en: "Malath" },
  { name: "الخليج الأهلي", en: "Gulf Union" },
];

const CATEGORIES = [
  { label: "السيارات", icon: "🚗", active: true },
  { label: "الصحي", icon: "❤️", active: false },
  { label: "العمالة المنزلية", icon: "🏠", active: false },
  { label: "السفر", icon: "✈️", active: false },
  { label: "نقل البضائع", icon: "📦", active: false },
  { label: "المنزل", icon: "🏡", active: false },
  { label: "منصة تريزا للسيارات", icon: "🛡️", active: false },
];

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white" dir="rtl" style={{ fontFamily: "'Noto Sans Arabic', system-ui, -apple-system, Arial, sans-serif" }}>

      {/* TOP NAVBAR — dark navy */}
      <nav style={{ background: "#0d1c3b" }}>
        <div className="max-w-7xl mx-auto px-4 h-[60px] flex items-center justify-between">
          {/* Left: hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white p-1.5">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Center: nav links (desktop) */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-gray-300 hover:text-white text-[13px] font-semibold transition-colors">English</a>
            <a href="#" className="text-gray-300 hover:text-white text-[13px] font-semibold transition-colors">
              <Search className="w-4 h-4" />
            </a>
          </div>

          {/* Right: logo + buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.href = "/tameeni/quote"}
              style={{ background: "#00c389" }}
              className="px-5 py-2 rounded-lg text-white text-[13px] font-bold hover:opacity-90 transition-opacity"
            >
              الدخول لحسابي
            </button>
            <button
              onClick={() => window.location.href = "/tameeni/quote"}
              className="px-5 py-2 rounded-lg border border-gray-400 text-white text-[13px] font-bold hover:border-white transition-colors"
            >
              تواصل معنا
            </button>
            {/* Logo */}
            <div className="flex items-center gap-2 mr-3 cursor-pointer" onClick={() => window.location.href = "/tameeni/"}>
              <div className="flex flex-col leading-none">
                <span className="text-white text-[22px] font-black tracking-tight">تأميني</span>
              </div>
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "#00c389" }}>
                <span className="text-white text-[18px] font-black">ت</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-700 bg-[#0d1c3b] px-4 py-4 space-y-2">
            {["الرئيسية", "اتصل بنا", "عن تأميني"].map(l => (
              <a key={l} href="#" className="block text-gray-300 text-[14px] font-semibold py-2 border-b border-gray-800">{l}</a>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <button onClick={() => window.location.href = "/tameeni/quote"} style={{ background: "#00c389" }} className="w-full py-2.5 rounded-lg text-white font-bold text-[14px]">الدخول لحسابي</button>
            </div>
          </div>
        )}
      </nav>

      {/* CATEGORIES BAR */}
      <div className="border-b border-gray-200 bg-white overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 min-w-max">
            {CATEGORIES.map((cat) => (
              <button key={cat.label}
                className={`flex items-center gap-1.5 px-4 py-3.5 text-[13px] font-bold transition-colors whitespace-nowrap border-b-2
                  ${cat.active ? "border-[#00c389] text-[#00c389]" : "border-transparent text-gray-600 hover:text-gray-900"}`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PROMO BANNER */}
      <div className="border-b border-gray-100 bg-green-50 px-4 py-3 flex items-center justify-between">
        <button className="text-gray-400 hover:text-gray-600 text-[18px] font-light">×</button>
        <div className="flex items-center gap-3 text-right">
          <p className="text-[13px] text-gray-700 font-semibold">
            ارتق بتجربة قيادتك. إكسسوارات والعناية بالسيارة في مكان واحد.
          </p>
          <button
            onClick={() => window.location.href = "/tameeni/quote"}
            style={{ background: "#00c389" }}
            className="px-4 py-1.5 rounded-lg text-white text-[12px] font-bold hover:opacity-90 whitespace-nowrap"
          >
            جميع العروض
          </button>
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#0d1c3b" }}>
              <span className="text-white text-[11px] font-black">ت+</span>
            </div>
            <span className="text-[12px] font-bold text-[#0d1c3b]">تأميني بلس</span>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 flex flex-col md:flex-row-reverse gap-6 md:gap-10 items-center">

          {/* Photo — shows on both mobile and desktop */}
          <div className="w-full md:w-[48%] flex-shrink-0">
            <div className="rounded-3xl overflow-hidden" style={{ background: "#e8f4fd" }}>
              <img
                src="/tameeni/hero.jpeg"
                alt="رجل سعودي يقف بجانب سيارة"
                className="w-full object-cover"
                style={{ maxHeight: "420px", objectPosition: "center top" }}
              />
            </div>
          </div>

          {/* Text */}
          <div className="w-full md:w-[52%] space-y-4 text-right">
            <h1 className="text-[32px] md:text-[44px] font-black leading-snug" style={{ color: "#0d1c3b" }}>
              أول منصة لتأمين السيارات في{" "}
              <span style={{ color: "#0d6efd" }}>السعودية</span>
            </h1>
            <p className="text-[15px] text-gray-600 leading-relaxed">
              جميع شركات التأمين في مكان واحد، مجموعة واسعة<br />
              من الخيارات وأسعار فوري لوثائق التأمين
            </p>
            <button
              onClick={() => window.location.href = "/tameeni/quote"}
              style={{ background: "#00c389" }}
              className="px-10 py-3.5 rounded-xl text-white text-[17px] font-extrabold hover:opacity-90 transition-opacity shadow-md"
            >
              ابدأ الآن
            </button>
            <div className="flex items-center gap-2 text-[13px] text-gray-500 pt-1">
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <span className="text-[11px]">م</span>
              </div>
              <span>
                هل تود شراء سيارة وترغب في معرفة كل شيء عنها قبل الشراء؟{" "}
                <a href="#" className="text-[#0d1c3b] font-bold hover:underline">تقرير موجز</a>
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* COMPANY LOGOS */}
      <section className="border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">IA</span>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-gray-600">مرخص من</div>
                <div className="text-[10px] text-gray-500">هيئة التأمين</div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {COMPANIES.map((c) => (
              <div key={c.name}
                className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer min-w-[100px] text-center"
              >
                <span className="text-[13px] font-bold text-gray-700">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TAMEENI PLUS BANNER */}
      <section className="mx-4 md:mx-8 rounded-2xl overflow-hidden mb-8" style={{ background: "linear-gradient(135deg, #0d1c3b 0%, #1a3a6b 60%, #00c389 100%)" }}>
        <div className="px-8 py-8 flex items-center justify-between">
          <button
            onClick={() => window.location.href = "/tameeni/quote"}
            className="px-6 py-2.5 rounded-xl border-2 border-white text-white text-[14px] font-bold hover:bg-white hover:text-[#0d1c3b] transition-colors"
          >
            جميع العروض
          </button>
          <div className="text-right">
            <h2 className="text-white text-[22px] font-extrabold">نقدّم لكم تأميني بلس</h2>
            <p className="text-green-200 text-[13px] mt-1">وجهتك الشاملة لخدمات السيارات المميزة والإكسسوارات</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0d1c3b" }} className="text-white py-10 mt-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-between gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#00c389" }}>
                  <span className="text-white text-[14px] font-black">ت</span>
                </div>
                <span className="text-[20px] font-extrabold">تأميني</span>
              </div>
              <p className="text-gray-400 text-[13px] max-w-xs">أول منصة لتأمين السيارات في المملكة العربية السعودية</p>
            </div>
            <div className="grid grid-cols-2 gap-x-16 gap-y-2.5 text-[13px] text-gray-400">
              {["الرئيسية", "السيارات", "الصحي", "السفر", "سياسة الخصوصية", "الشروط والأحكام"].map((l) => (
                <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 flex flex-wrap justify-between items-center gap-4">
            <p className="text-gray-500 text-[12px]">© 2024 تأميني. جميع الحقوق محفوظة</p>
            <p className="text-gray-500 text-[12px]">مرخص من هيئة التأمين</p>
          </div>
        </div>
      </footer>

      {/* Admin link */}
      <a href="/tameeni/admin" className="fixed bottom-4 left-4 text-[10px] text-gray-300 hover:text-gray-500 transition-colors opacity-40 hover:opacity-100">لوحة التحكم</a>
    </div>
  );
}
