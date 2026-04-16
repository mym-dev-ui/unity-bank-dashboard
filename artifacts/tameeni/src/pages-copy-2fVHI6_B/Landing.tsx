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
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 grid md:grid-cols-2 gap-8 items-center min-h-[400px]">
          {/* Right: text */}
          <div className="space-y-5 text-right">
            <h1 className="text-[36px] md:text-[46px] font-black leading-tight" style={{ color: "#0d1c3b" }}>
              أول منصة لتأمين<br />السيارات في<br />السعودية
            </h1>
            <p className="text-[15px] text-gray-600 leading-relaxed max-w-md">
              جميع شركات التأمين في مكان واحد ... مجموعة واسعة<br />
              من الخيارات وإصدار فوري لوثائق التأمين
            </p>
            <button
              onClick={() => window.location.href = "/tameeni/quote"}
              style={{ background: "#00c389" }}
              className="px-10 py-3.5 rounded-xl text-white text-[17px] font-extrabold hover:opacity-90 transition-opacity shadow-md"
            >
              ابدأ الآن
            </button>
            <div className="flex items-center gap-2 text-[13px] text-gray-500">
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-[11px]">م</span>
              </div>
              <span>
                هل تود شراء سيارة و ترغب في معرفة كل شيء عنها قبل الشراء؟{" "}
                <a href="#" className="text-[#0d1c3b] font-bold hover:underline">تقرير موجز</a>
              </span>
            </div>
          </div>

          {/* Left: hero image / illustration */}
          <div className="hidden md:flex justify-center items-end relative">
            <div className="relative w-full max-w-[480px] h-[320px]">
              {/* Car background shape */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden" style={{ background: "linear-gradient(135deg, #e8f4fd 0%, #f0faf6 100%)" }}>
                {/* Silhouette car */}
                <div className="absolute bottom-0 right-0 left-0 flex justify-center items-end">
                  <div className="relative w-full">
                    {/* Car SVG */}
                    <svg viewBox="0 0 400 200" className="w-full" fill="none">
                      <ellipse cx="200" cy="185" rx="180" ry="15" fill="#d1dae8" opacity="0.4"/>
                      {/* Car body */}
                      <rect x="40" y="130" width="320" height="55" rx="12" fill="#1a3a6b"/>
                      {/* Roof */}
                      <path d="M100 130 L130 85 L270 85 L300 130Z" fill="#1a4a8a"/>
                      {/* Windows */}
                      <path d="M140 128 L155 95 L215 95 L215 128Z" fill="#7ecfff" opacity="0.7"/>
                      <path d="M220 128 L220 95 L265 95 L280 128Z" fill="#7ecfff" opacity="0.7"/>
                      {/* Wheels */}
                      <circle cx="105" cy="185" r="28" fill="#222"/>
                      <circle cx="105" cy="185" r="16" fill="#999"/>
                      <circle cx="295" cy="185" r="28" fill="#222"/>
                      <circle cx="295" cy="185" r="16" fill="#999"/>
                      {/* Headlights */}
                      <rect x="340" y="145" width="18" height="10" rx="3" fill="#fff" opacity="0.8"/>
                      <rect x="42" y="145" width="18" height="10" rx="3" fill="#ffe066" opacity="0.7"/>
                    </svg>
                    {/* Person silhouette */}
                    <div className="absolute bottom-16 right-10 w-[80px] h-[160px] opacity-80">
                      <svg viewBox="0 0 80 160" className="w-full h-full" fill="none">
                        {/* Head */}
                        <circle cx="40" cy="20" r="16" fill="#c8a882"/>
                        {/* Thobe */}
                        <path d="M20 42 Q40 38 60 42 L68 120 L12 120Z" fill="white"/>
                        {/* Shmagh */}
                        <path d="M24 20 Q40 10 56 20 L58 30 Q40 40 22 30Z" fill="#cc0000"/>
                        <rect x="22" y="14" width="36" height="8" rx="4" fill="#cc0000"/>
                        {/* Legs */}
                        <rect x="22" y="120" width="16" height="36" rx="6" fill="white"/>
                        <rect x="42" y="120" width="16" height="36" rx="6" fill="white"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
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
