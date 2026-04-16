import { useState } from "react";
import {
  Shield, CreditCard, Smartphone, ArrowLeft, Menu, X, ChevronLeft,
  Star, Zap, Lock, Globe, Phone, Mail, CheckCircle, TrendingUp, Users, Award
} from "lucide-react";

const go = (path: string) => { window.location.href = `/unity-bank${path}`; };
const BRAND = { name: "الوحدة", primary: "#1a3d6e", gold: "#c4923e", light: "#e8f4ff" };

const FEATURES = [
  { Icon: CreditCard, title: "بطاقات مميزة", desc: "بطاقات مدى وفيزا وماستركارد بدون رسوم" },
  { Icon: Zap, title: "تحويلات فورية", desc: "تحويل فوري 24/7 لجميع البنوك المحلية" },
  { Icon: Shield, title: "حماية متقدمة", desc: "تشفير عسكري يحمي بياناتك وأموالك" },
  { Icon: Smartphone, title: "تطبيق ذكي", desc: "إدارة حسابك من أي مكان وفي أي وقت" },
  { Icon: Globe, title: "خدمات دولية", desc: "معاملات دولية بأفضل أسعار الصرف" },
  { Icon: TrendingUp, title: "استثمار ذكي", desc: "ودائع وصناديق استثمارية بعوائد مضمونة" },
];

const SERVICES = [
  { title: "الحسابات الجارية", icon: "🏦", desc: "افتح حسابك الجاري فوراً بدون رسوم شهرية" },
  { title: "التمويل الشخصي", icon: "💰", desc: "تمويل يصل إلى 1,000,000 ر.س بموافقة فورية" },
  { title: "البطاقات الائتمانية", icon: "💳", desc: "بطاقات بمزايا استثنائية وكاش باك حتى 5%" },
  { title: "تأمين وادخار", icon: "🛡️", desc: "خطط ادخارية مضمونة بعوائد تنافسية" },
];

const STATS = [
  { n: "2,500,000+", l: "عميل نشط", Icon: Users },
  { n: "99.9%", l: "وقت التشغيل", Icon: Zap },
  { n: "4.8/5", l: "تقييم التطبيق", Icon: Star },
  { n: "24/7", l: "دعم مستمر", Icon: Award },
];

export default function HomePage() {
  const [menu, setMenu] = useState(false);

  return (
    <div className="min-h-screen bg-white" dir="rtl" style={{ fontFamily: "'Cairo', system-ui, sans-serif" }}>

      {/* NAVBAR */}
      <nav style={{ background: BRAND.primary }} className="sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => go("/")}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: BRAND.gold }}>
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                </svg>
              </div>
              <div>
                <div className="text-white font-black text-xl leading-none">الوحدة</div>
                <div className="text-[10px] leading-none" style={{ color: BRAND.gold }}>البنك الرقمي</div>
              </div>
            </div>
            <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-blue-200">
              {["الرئيسية", "الخدمات", "التمويل", "الاستثمار", "اتصل بنا"].map(l => (
                <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => go("/login")} className="hidden sm:block border border-white/30 text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
              تسجيل الدخول
            </button>
            <button onClick={() => go("/login")} style={{ background: BRAND.gold }} className="text-white px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity">
              افتح حساباً
            </button>
            <button onClick={() => setMenu(!menu)} className="lg:hidden text-white p-1">
              {menu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {menu && (
          <div className="lg:hidden border-t border-white/10 px-4 py-3 space-y-2">
            {["الرئيسية", "الخدمات", "التمويل", "الاستثمار", "اتصل بنا"].map(l => (
              <a key={l} href="#" className="block text-blue-200 py-2 text-sm font-semibold border-b border-white/10">{l}</a>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section style={{ background: `linear-gradient(135deg, ${BRAND.primary} 0%, #0d2847 60%, #1a3d6e 100%)` }}
        className="py-20 md:py-28 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="absolute rounded-full border border-white"
              style={{ width: `${200 + i * 120}px`, height: `${200 + i * 120}px`, top: "50%", right: "-100px", transform: "translateY(-50%)", opacity: 0.5 }} />
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold" style={{ background: "rgba(196,146,62,0.2)", color: BRAND.gold, border: `1px solid ${BRAND.gold}40` }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: BRAND.gold }} />
              بنكك الرقمي الموثوق في المملكة
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
              مصرفيتك<br />بلمسة <span style={{ color: BRAND.gold }}>واحدة</span>
            </h1>
            <p className="text-lg text-blue-200 leading-relaxed max-w-md">
              البنك الوحدة الرقمي — خدمات مصرفية متكاملة بتقنية أمان متقدمة. افتح حسابك في دقيقتين واستمتع بتجربة بنكية عصرية.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => go("/login")} style={{ background: BRAND.gold }} className="text-white px-8 py-3.5 rounded-xl font-black text-base hover:opacity-90 transition-opacity flex items-center gap-2 shadow-xl">
                افتح حسابك الآن <ArrowLeft className="w-4 h-4" />
              </button>
              <button onClick={() => go("/login")} className="border border-white/30 text-white px-8 py-3.5 rounded-xl font-bold text-base hover:bg-white/10 transition-colors">
                تسجيل الدخول
              </button>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              {["لا رسوم شهرية", "تحويل فوري", "مصرح من البنك المركزي"].map(f => (
                <div key={f} className="flex items-center gap-1.5 text-green-300 font-semibold">
                  <CheckCircle className="w-4 h-4" /> {f}
                </div>
              ))}
            </div>
          </div>

          {/* Phone mockup */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-64 h-[520px] rounded-[40px] shadow-2xl border-4 border-white/10 overflow-hidden"
                style={{ background: "linear-gradient(160deg, #0f172a, #1e3a5f)" }}>
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-[11px] font-semibold">الرصيد المتاح</p>
                      <p className="text-white text-2xl font-black mt-0.5">24,500.00 <span className="text-sm">ر.س</span></p>
                    </div>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: BRAND.gold }}>
                      <span className="text-white text-xs font-black">U</span>
                    </div>
                  </div>
                  <div className="rounded-2xl p-4 space-y-1" style={{ background: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}40` }}>
                    <p className="text-[10px] text-white/50 font-semibold">بطاقة الوحدة الذهبية</p>
                    <p className="text-white text-[13px] font-bold tracking-widest" dir="ltr">•••• •••• •••• 4521</p>
                    <div className="flex justify-between items-center">
                      <p className="text-white/70 text-[10px]">Ahmed Al-Rashidi</p>
                      <p className="text-[10px] font-bold" style={{ color: BRAND.gold }}>12/28</p>
                    </div>
                  </div>
                  {[
                    { label: "قهوة الرياض", amt: "-45.00", icon: "☕", color: "text-red-400" },
                    { label: "تحويل وارد", amt: "+2,000.00", icon: "↓", color: "text-green-400" },
                    { label: "اشتراك نتفليكس", amt: "-39.00", icon: "📺", color: "text-red-400" },
                  ].map((t, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/5">
                      <span className="text-white text-sm font-semibold">{t.icon} {t.label}</span>
                      <span className={`text-sm font-black ${t.color}`}>{t.amt}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl shadow-xl flex items-center justify-center" style={{ background: BRAND.gold }}>
                <div className="text-center text-white">
                  <div className="text-xl font-black">4.8</div>
                  <div className="text-[9px] font-bold">★★★★★</div>
                  <div className="text-[8px] mt-0.5">50K تقييم</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <div key={i} className="text-center group">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform"
                  style={{ background: `${BRAND.primary}15` }}>
                  <s.Icon className="w-6 h-6" style={{ color: BRAND.primary }} />
                </div>
                <div className="text-2xl font-black" style={{ color: BRAND.primary }}>{s.n}</div>
                <div className="text-sm text-gray-500 font-semibold">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black mb-4" style={{ background: `${BRAND.gold}20`, color: BRAND.gold }}>خدماتنا</span>
            <h2 className="text-3xl font-black text-gray-900 mb-3">خدمات مصرفية متكاملة</h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">كل ما تحتاجه من خدمات مصرفية في مكان واحد</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((s, i) => (
              <div key={i} onClick={() => go("/login")}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1">
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="font-black text-gray-900 text-base mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{s.desc}</p>
                <div className="flex items-center gap-1 font-bold text-sm group-hover:gap-2 transition-all" style={{ color: BRAND.primary }}>
                  اعرف أكثر <ChevronLeft className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black mb-4" style={{ background: `${BRAND.primary}15`, color: BRAND.primary }}>لماذا الوحدة؟</span>
              <h2 className="text-3xl font-black text-gray-900 mb-4">تجربة مصرفية استثنائية</h2>
              <p className="text-gray-500 mb-8 leading-relaxed">صمّمنا البنك الوحدة ليكون أكثر من مجرد بنك — إنه شريكك المالي الذكي الذي يفهم احتياجاتك.</p>
              <div className="grid sm:grid-cols-2 gap-5">
                {FEATURES.map((f, i) => (
                  <div key={i} className="flex gap-3 group">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                      style={{ background: `${BRAND.primary}15` }}>
                      <f.Icon className="w-5 h-5" style={{ color: BRAND.primary }} />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-800 text-sm">{f.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => go("/login")} className="mt-8 text-white px-8 py-3.5 rounded-xl font-black text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
                style={{ background: BRAND.primary }}>
                ابدأ الآن مجاناً <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-gradient-to-br rounded-3xl p-8 space-y-4" style={{ background: `linear-gradient(135deg, ${BRAND.primary}, #0d2847)` }}>
              <h3 className="text-white font-black text-xl">تحكم كامل بأموالك</h3>
              {[
                { l: "رصيد الحساب الجاري", v: "24,500.00 ر.س", up: true },
                { l: "حساب التوفير", v: "45,200.00 ر.س", up: true },
                { l: "حد البطاقة الائتمانية", v: "50,000.00 ر.س", up: false },
              ].map((i, idx) => (
                <div key={idx} className="bg-white/10 rounded-xl p-4 flex justify-between items-center backdrop-blur-sm">
                  <span className="text-blue-200 text-sm font-semibold">{i.l}</span>
                  <span className="font-black text-sm" style={{ color: i.up ? "#4ade80" : BRAND.gold }}>{i.v}</span>
                </div>
              ))}
              <button onClick={() => go("/login")} className="w-full rounded-xl py-3 font-black text-sm hover:opacity-90 transition-opacity" style={{ background: BRAND.gold, color: "white" }}>
                عرض كل الحسابات
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* APP CTA */}
      <section className="py-16" style={{ background: `linear-gradient(135deg, ${BRAND.primary}, #0d2847)` }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-white mb-4">ابدأ رحلتك المصرفية اليوم</h2>
          <p className="text-blue-200 mb-8 text-base">سجّل دخولك الآن للوصول إلى خدماتك المصرفية</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => go("/login")} className="text-white px-10 py-4 rounded-xl font-black text-base hover:opacity-90 transition-opacity shadow-xl"
              style={{ background: BRAND.gold }}>
              تسجيل الدخول
            </button>
            <button onClick={() => go("/login")} className="border border-white/30 text-white px-10 py-4 rounded-xl font-bold text-base hover:bg-white/10 transition-colors">
              فتح حساب جديد
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0a1628" }} className="py-10 text-gray-400">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: BRAND.gold }}>
                  <span className="text-white text-xs font-black">U</span>
                </div>
                <span className="text-white font-black text-lg">الوحدة</span>
              </div>
              <p className="text-sm leading-relaxed">البنك الوحدة الرقمي — مرخص من البنك المركزي السعودي (ساما)</p>
            </div>
            {[
              { t: "الخدمات", ls: ["الحسابات", "البطاقات", "التحويلات", "التمويل"] },
              { t: "الشركة", ls: ["من نحن", "الوظائف", "الأخبار", "المستثمرون"] },
              { t: "الدعم", ls: ["مركز المساعدة", "تواصل معنا", "الأسئلة الشائعة", "الخصوصية"] },
            ].map(col => (
              <div key={col.t}>
                <h3 className="text-white font-black mb-3 text-sm">{col.t}</h3>
                <ul className="space-y-2">
                  {col.ls.map(l => <li key={l}><a href="#" className="text-xs hover:text-white transition-colors">{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs">© 2024 البنك الوحدة الرقمي. جميع الحقوق محفوظة.</p>
            <div className="flex gap-4">
              {[Phone, Mail, Globe].map((Icon, i) => (
                <div key={i} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                  <Icon className="w-4 h-4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <a href="/unity-admin/" className="fixed bottom-3 left-3 text-[10px] text-gray-400 opacity-20 hover:opacity-70 transition-all">إدارة</a>
    </div>
  );
}
