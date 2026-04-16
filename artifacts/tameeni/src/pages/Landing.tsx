import { useState } from "react";
import {
  Shield, Users, Star, Download, Smartphone, CheckCircle, Globe, Phone, Mail,
  Award, TrendingUp, FileText, HeadphonesIcon, Zap, Lock, Clock, DollarSign,
  Car, Calculator, MessageCircle, ChevronDown, ChevronUp, ArrowRight, CreditCard,
  Home, Plane, Heart, Menu, X,
} from "lucide-react";
import { useTracking } from "@/lib/useTracking";

const go = () => { window.location.href = "/tameeni/quote"; };

/* ── Reusable helpers ── */
function Btn({ children, onClick, className = "", variant = "primary" }: {
  children: React.ReactNode; onClick?: () => void; className?: string; variant?: "primary" | "outline" | "ghost";
}) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 cursor-pointer";
  const v = {
    primary: "bg-blue-600 hover:bg-[#109cd4] text-white shadow-lg hover:shadow-xl",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    ghost: "text-gray-600 hover:text-blue-600",
  }[variant];
  return <button onClick={onClick} className={`${base} ${v} ${className}`}>{children}</button>;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-2xl shadow-lg ${className}`}>{children}</div>;
}

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${className}`}>{children}</span>;
}

const STATS = [
  { number: "500,000+", label: "عميل راضي", Icon: Users, color: "from-blue-500 to-blue-600" },
  { number: "25+", label: "شركة تأمين", Icon: Award, color: "from-green-500 to-green-600" },
  { number: "4.9/5", label: "تقييم العملاء", Icon: Star, color: "from-yellow-500 to-yellow-600" },
  { number: "24/7", label: "دعم العملاء", Icon: HeadphonesIcon, color: "from-purple-500 to-purple-600" },
];

const FEATURES = [
  { Icon: Shield, title: "حماية شاملة", desc: "تغطية شاملة لسيارتك ضد جميع المخاطر والحوادث مع أفضل شركات التأمين", color: "from-blue-500 to-blue-600" },
  { Icon: Zap, title: "سرعة فائقة", desc: "احصل على وثيقة التأمين في أقل من 5 دقائق مع نظام معالجة فوري", color: "from-green-500 to-green-600" },
  { Icon: TrendingUp, title: "أفضل الأسعار", desc: "مقارنة ذكية وفورية للحصول على أفضل العروض من جميع الشركات", color: "from-purple-500 to-purple-600" },
  { Icon: Lock, title: "أمان وثقة", desc: "بياناتك محمية بأعلى معايير الأمان والتشفير المتقدم", color: "from-red-500 to-red-600" },
  { Icon: Clock, title: "خدمة مستمرة", desc: "دعم عملاء متاح على مدار الساعة لمساعدتك في أي وقت", color: "from-indigo-500 to-indigo-600" },
  { Icon: DollarSign, title: "توفير مضمون", desc: "وفر حتى 40% من قيمة التأمين مع عروضنا الحصرية", color: "from-orange-500 to-orange-600" },
];

const TESTIMONIALS = [
  { name: "أحمد محمد", role: "مهندس", content: "خدمة ممتازة ووفرت لي 35% من قيمة التأمين. التطبيق سهل الاستخدام والدعم الفني رائع.", rating: 5 },
  { name: "فاطمة العلي", role: "طبيبة", content: "أفضل منصة تأمين جربتها. المقارنة سريعة والأسعار شفافة. أنصح بها بشدة.", rating: 5 },
  { name: "خالد السعد", role: "رجل أعمال", content: "تجربة استثنائية من البداية للنهاية. حصلت على وثيقة التأمين في دقائق معدودة.", rating: 5 },
];

const FAQS = [
  { q: "كيف يمكنني الحصول على عرض سعر؟", a: "يمكنك الحصول على عرض سعر فوري من خلال إدخال بيانات سيارتك ومعلوماتك الشخصية في النموذج أعلاه. ستحصل على مقارنة شاملة من جميع شركات التأمين في أقل من دقيقتين." },
  { q: "هل الخدمة مجانية؟", a: "نعم، خدمة المقارنة والحصول على عروض الأسعار مجانية تماماً. نحن نحصل على عمولة من شركات التأمين عند إتمام عملية الشراء، لذلك لا توجد أي رسوم إضافية عليك." },
  { q: "كم من الوقت يستغرق إصدار الوثيقة؟", a: "يتم إصدار الوثيقة فورياً بعد إتمام عملية الدفع. ستحصل على نسخة إلكترونية عبر البريد الإلكتروني والرسائل النصية." },
  { q: "هل يمكنني تعديل الوثيقة بعد الشراء؟", a: "نعم، يمكنك إجراء تعديلات على وثيقتك من خلال التطبيق أو الموقع الإلكتروني. بعض التعديلات قد تتطلب رسوم إضافية." },
  { q: "ماذا لو احتجت مساعدة؟", a: "فريق دعم العملاء متاح على مدار الساعة لمساعدتك. يمكنك التواصل معنا عبر الهاتف، البريد الإلكتروني، أو الدردشة المباشرة." },
];

const PROCESS = [
  { step: "1", title: "أدخل بياناتك", desc: "معلومات السيارة والسائق", Icon: FileText },
  { step: "2", title: "قارن العروض", desc: "من أكثر من 25 شركة", Icon: Calculator },
  { step: "3", title: "اختر الأنسب", desc: "حسب احتياجاتك وميزانيتك", Icon: CheckCircle },
  { step: "4", title: "ادفع بأمان", desc: "طرق دفع متعددة وآمنة", Icon: CreditCard },
];

const COMPANIES = [
  { name: "التعاونية", bg: "#0d6efd", short: "T" },
  { name: "سلامة", bg: "#00a651", short: "S" },
  { name: "الاتحاد", bg: "#1d4ed8", short: "AE" },
  { name: "بروج", bg: "#7c3aed", short: "B" },
  { name: "ميد غلف", bg: "#0369a1", short: "MG" },
  { name: "الراجحي", bg: "#0f766e", short: "TR" },
  { name: "الخليج", bg: "#1e40af", short: "GU" },
  { name: "ملاذ", bg: "#dc2626", short: "M" },
];

export default function Landing() {
  useTracking("الصفحة الرئيسية");
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white" dir="rtl" style={{ fontFamily: "system-ui, -apple-system, Arial, sans-serif" }}>

      {/* ══ HEADER ══ */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 lg:px-6 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6 lg:gap-10">
            {/* Logo */}
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.location.href = "/tameeni/"}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "#00c389" }}>
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <span className="text-[22px] font-black text-gray-900">تأميني</span>
            </div>
            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
              {["الرئيسية", "الخدمات", "عن الشركة", "اتصل بنا"].map(l => (
                <a key={l} href="#" className="text-gray-600 hover:text-blue-600 transition-colors">{l}</a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            <Btn variant="ghost" className="hidden sm:flex text-sm px-3 py-2">English</Btn>
            <Btn variant="outline" onClick={go} className="hidden sm:flex text-sm px-4 py-2">تسجيل الدخول</Btn>
            <Btn onClick={go} className="text-sm px-4 py-2 bg-gradient-to-r from-blue-600 to-[#109cd4]">ابدأ الآن</Btn>
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 text-gray-600">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="lg:hidden mt-3 pb-4 border-t border-gray-100 pt-4">
            <nav className="flex flex-col gap-4 text-sm">
              {["الرئيسية", "الخدمات", "عن الشركة", "اتصل بنا"].map(l => (
                <a key={l} href="#" className="text-gray-700 hover:text-blue-600">{l}</a>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* ══ HERO ══ */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4 lg:px-6 py-12 lg:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Image */}
            <div className="relative order-first">
              <img src="/tameeni/hero.jpeg" alt="car" className="relative rounded-3xl shadow-2xl w-full max-w-md mx-auto object-cover" style={{ maxHeight: 420 }} />
            </div>
            {/* Text */}
            <div className="space-y-7 text-center lg:text-right">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                أول منصة لتأمين السيارات في<br />
                <span className="text-blue-600">السعودية</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                جميع شركات التأمين في مكان واحد، مجموعة واسعة من الخيارات وأسعار فورية لوثائق التأمين
              </p>
              <div className="flex justify-center lg:justify-start">
                <Btn onClick={go} className="px-12 py-4 text-lg bg-blue-600 hover:bg-[#109cd4]">ابدأ الآن</Btn>
              </div>
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 max-w-md mx-auto lg:mx-0">
                <p className="text-sm text-teal-700 flex items-center gap-2">
                  <span className="w-3 h-3 bg-teal-500 rounded-full flex-shrink-0"></span>
                  هل تريد شراء وثيقة تأمين؟ تحقق من كل هذا الموقع الصحيح
                </p>
              </div>
            </div>
          </div>

          {/* Company logos */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 mb-1">18 شركة</p>
              <p className="text-base font-semibold text-gray-800">شركاء التأمين المعتمدين</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-5 opacity-70">
              {COMPANIES.map(c => (
                <div key={c.name} className="flex flex-col items-center gap-1">
                  <div className="w-16 h-10 rounded-lg flex items-center justify-center text-white text-[11px] font-black" style={{ background: c.bg }}>
                    {c.short}
                  </div>
                  <span className="text-[10px] text-gray-500">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ PROMO BANNERS ══ */}
      <section className="py-10 bg-white">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-3xl overflow-hidden h-48 relative" style={{ background: "linear-gradient(135deg, #0d6efd, #109cd4)" }}>
              <div className="absolute inset-0 flex items-end p-6">
                <div className="text-white">
                  <p className="text-sm font-semibold opacity-80">احصل على تأمين مناسب</p>
                  <h3 className="text-2xl font-black mt-1">تأمين السيارات بأفضل سعر</h3>
                  <button onClick={go} className="mt-3 bg-white text-blue-700 font-bold text-sm px-5 py-2 rounded-xl hover:bg-blue-50 transition-colors">
                    ابدأ الآن
                  </button>
                </div>
              </div>
              <div className="absolute top-4 left-4 opacity-10">
                <Car className="w-32 h-32 text-white" />
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden h-48 relative" style={{ background: "linear-gradient(135deg, #16a34a, #059669)" }}>
              <div className="absolute inset-0 flex items-end p-6">
                <div className="text-white">
                  <p className="text-sm font-semibold opacity-80">وفّر على تأمينك</p>
                  <h3 className="text-2xl font-black mt-1">خصومات حصرية تصل إلى 40%</h3>
                  <button onClick={go} className="mt-3 bg-white text-green-700 font-bold text-sm px-5 py-2 rounded-xl hover:bg-green-50 transition-colors">
                    اكتشف العروض
                  </button>
                </div>
              </div>
              <div className="absolute top-4 left-4 opacity-10">
                <Shield className="w-32 h-32 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ QUOTE CTA ══ */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 lg:p-8 border border-blue-100">
            <div className="text-center space-y-6">
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">احصل على عرض سعر فوري</h2>
                <p className="text-sm lg:text-base text-gray-600">أكمل البيانات للحصول على أفضل عروض التأمين من أكثر من 25 شركة</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Btn onClick={go} className="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-[#109cd4]">
                  <Calculator className="w-5 h-5" />
                  ابدأ المقارنة الآن
                </Btn>
                <p className="text-sm text-gray-500">مجاني 100% • لا يتطلب بطاقة ائتمان</p>
              </div>
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                {[
                  { Icon: Clock, text: "3 دقائق فقط", color: "bg-blue-100 text-blue-600" },
                  { Icon: Shield, text: "25+ شركة تأمين", color: "bg-green-100 text-green-600" },
                  { Icon: TrendingUp, text: "وفر حتى 40%", color: "bg-purple-100 text-purple-600" },
                ].map((i, idx) => (
                  <div key={idx} className="text-center">
                    <div className={`w-12 h-12 ${i.color.split(" ")[0]} rounded-full flex items-center justify-center mx-auto mb-2`}>
                      <i.Icon className={`w-6 h-6 ${i.color.split(" ")[1]}`} />
                    </div>
                    <p className="text-xs text-gray-600">{i.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            {STATS.map((s, i) => (
              <Card key={i} className="hover:shadow-xl transition-all duration-300 group p-4 lg:p-6 text-center border-0">
                <div className={`w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br ${s.color} rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-3 lg:mb-4 group-hover:scale-110 transition-transform`}>
                  <s.Icon className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <h3 className="text-lg lg:text-2xl font-bold text-gray-900 mb-1">{s.number}</h3>
                <p className="text-xs lg:text-sm text-gray-600 font-medium">{s.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section className="py-12 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-12 lg:mb-16">
            <Badge className="bg-blue-100 text-blue-600 mb-4">✨ مميزات استثنائية</Badge>
            <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4">لماذا يختار العملاء تأميني؟</h2>
            <p className="text-base lg:text-xl text-gray-600 max-w-3xl mx-auto">نقدم تجربة تأمين متطورة تجمع بين التكنولوجيا المتقدمة والخدمة الاستثنائية</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {FEATURES.map((f, i) => (
              <Card key={i} className="border-0 hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 p-6 lg:p-8 text-center">
                <div className={`w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br ${f.color} rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-4 lg:mb-6 group-hover:scale-110 transition-transform`}>
                  <f.Icon className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ══ INSURANCE TYPES ══ */}
      <section id="services" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">تأمين سيارات وأكثر!</h2>
            <p className="text-lg text-blue-600">منتجات التأمين المتنوعة</p>
            <div className="flex justify-center mt-6">
              <div className="flex bg-white rounded-lg p-1 shadow-sm">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold">للشركات</button>
                <button className="px-6 py-2 text-gray-600 rounded-md text-sm font-medium hover:bg-gray-100">للأفراد</button>
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "السيارات", Icon: Car, desc: "تأمين شامل وضد الغير" },
              { title: "الصحة الطبية", Icon: Heart, desc: "تغطية صحية شاملة" },
              { title: "الحوادث الطبية", Icon: Shield, desc: "حماية من الحوادث" },
              { title: "السفر", Icon: Plane, desc: "تأمين شامل للسفر" },
            ].map((s, i) => (
              <Card key={i} className="border-0 hover:shadow-xl transition-all duration-300 group p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <s.Icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{s.desc}</p>
                <button onClick={go} className="border border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                  ابدأ الآن
                </button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ══ COMPARISON ══ */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">هل يجب أن أشتري تأميناً شاملاً أم تأمين طرف ثالث لسيارتي؟</h2>
            <p className="text-lg text-gray-600">تحقق من كل ما تريد معرفته في هذا الدليل الشامل لاختياراتك وتجد أفضل ما يناسبك</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "ضد الغير فقط", badge: "الأساسي", badgeColor: "bg-gray-500", desc: "يغطي الأضرار التي تلحق بالآخرين فقط ولا يشمل سيارتك الخاصة", btnColor: "bg-gray-600 hover:bg-gray-700" },
              { title: "التأمين الشامل", badge: "الأفضل", badgeColor: "bg-yellow-500", desc: "يغطي سيارتك والآخرين مع تغطية شاملة ضد السرقة والحوادث والكوارث الطبيعية", btnColor: "bg-blue-600 hover:bg-blue-700" },
              { title: "ضد الغير التوسعي", badge: "متوسط", badgeColor: "bg-green-500", desc: "تغطية متوسطة تشمل الآخرين مع بعض الحماية الإضافية لسيارتك", btnColor: "bg-green-600 hover:bg-green-700" },
            ].map((o, i) => (
              <div key={i} className="border border-gray-200 rounded-2xl hover:shadow-lg transition-all duration-300 p-6">
                <span className={`inline-block px-3 py-1 rounded-full text-white text-xs font-medium ${o.badgeColor} mb-4`}>{o.badge}</span>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{o.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed text-sm">{o.desc}</p>
                <button onClick={go} className={`w-full py-2.5 rounded-xl text-white font-semibold text-sm transition-colors ${o.btnColor}`}>اقرأ المزيد</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PROCESS ══ */}
      <section className="py-12 lg:py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-12 lg:mb-16">
            <Badge className="bg-purple-100 text-purple-700 mb-4">🚀 عملية بسيطة</Badge>
            <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4">كيف تحصل على تأمينك في 4 خطوات بسيطة</h2>
            <p className="text-base lg:text-xl text-gray-600 max-w-3xl mx-auto">عملية سهلة وسريعة للحصول على أفضل عروض التأمين</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {PROCESS.map((p, i) => (
              <div key={i} className="text-center group">
                <div className="relative mb-6 inline-block">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-full shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <p.Icon className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 lg:w-8 lg:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs lg:text-sm font-bold">
                    {p.step}
                  </div>
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-sm lg:text-base text-gray-600">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-12 lg:mb-16">
            <Badge className="bg-yellow-100 text-yellow-700 mb-4">⭐ آراء العملاء</Badge>
            <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4">ماذا يقول عملاؤنا عنا؟</h2>
            <p className="text-base lg:text-xl text-gray-600">تجارب حقيقية من عملائنا الكرام</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {TESTIMONIALS.map((t, i) => (
              <Card key={i} className="border-0 hover:shadow-xl transition-all duration-300 p-6 lg:p-8">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 lg:w-5 lg:h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm lg:text-base text-gray-600 mb-6 leading-relaxed">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{t.name}</h4>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section className="py-12 lg:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          <div className="text-center mb-12 lg:mb-16">
            <Badge className="bg-indigo-100 text-indigo-700 mb-4">❓ أسئلة شائعة</Badge>
            <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4">الأسئلة الأكثر شيوعاً</h2>
            <p className="text-base lg:text-xl text-gray-600">إجابات على الأسئلة التي يطرحها عملاؤنا بكثرة</p>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-2xl bg-white hover:shadow-lg transition-all duration-300">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-4 lg:p-6 text-right flex items-center justify-between hover:bg-gray-50 transition-colors rounded-2xl">
                  <h3 className="font-semibold text-gray-900 text-sm lg:text-base">{faq.q}</h3>
                  {openFaq === i
                    ? <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    : <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-4 lg:px-6 pb-4 lg:pb-6">
                    <p className="text-sm lg:text-base text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ APP DOWNLOAD ══ */}
      <section className="py-12 lg:py-20 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1d4ed8, #109cd4, #4338ca)" }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6 relative">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6 text-center lg:text-right">
              <Badge className="bg-white/20 text-white border border-white/30">📱 تطبيق متطور</Badge>
              <h2 className="text-2xl lg:text-4xl font-bold">
                حمل تطبيق تأميني<br />واستمتع بتجربة فريدة
              </h2>
              <p className="text-base lg:text-xl text-blue-100">تطبيق ذكي يوفر لك جميع خدمات التأمين في مكان واحد.</p>
              <div className="space-y-3">
                {["مقارنة فورية بين جميع الشركات", "إشعارات ذكية لتجديد التأمين", "دعم عملاء مباشر عبر التطبيق"].map(f => (
                  <div key={f} className="flex items-center gap-3 justify-center lg:justify-start">
                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span className="text-sm lg:text-lg">{f}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <button className="bg-black hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition-colors">
                  <Download className="w-4 h-4" /> App Store
                </button>
                <button className="bg-black hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition-colors">
                  <Download className="w-4 h-4" /> Google Play
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 lg:p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  {[{ Icon: Smartphone, label: "تطبيق iOS", color: "text-blue-600" }, { Icon: Smartphone, label: "تطبيق Android", color: "text-green-600" }].map((a, i) => (
                    <div key={i} className="bg-white rounded-2xl p-4 shadow-xl">
                      <a.Icon className={`w-8 h-8 ${a.color} mb-2`} />
                      <p className="text-sm font-semibold text-gray-900">{a.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 bg-white rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-900">تقييم التطبيق</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">4.9/5</p>
                  <p className="text-sm text-gray-500">من أكثر من 50,000 تقييم</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CONTACT ══ */}
      <section id="contact" className="py-12 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="grid lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <Badge className="bg-green-100 text-green-700">📞 تواصل معنا</Badge>
              <h2 className="text-2xl lg:text-4xl font-bold text-gray-900">هل لديك استفسار؟ نحن هنا لمساعدتك</h2>
              <p className="text-base lg:text-xl text-gray-600">فريق دعم العملاء متاح على مدار الساعة للإجابة على جميع استفساراتك</p>
              <div className="space-y-5">
                {[
                  { Icon: Phone, label: "اتصل بنا", val: "920000000", color: "bg-blue-100 text-blue-600" },
                  { Icon: Mail, label: "راسلنا", val: "info@tameeni.com", color: "bg-green-100 text-green-600" },
                  { Icon: MessageCircle, label: "دردشة مباشرة", val: "متاح 24/7", color: "bg-purple-100 text-purple-600" },
                ].map((c, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`w-12 h-12 lg:w-16 lg:h-16 ${c.color.split(" ")[0]} rounded-2xl flex items-center justify-center`}>
                      <c.Icon className={`w-6 h-6 lg:w-8 lg:h-8 ${c.color.split(" ")[1]}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{c.label}</h3>
                      <p className="text-sm text-gray-600">{c.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Card className="border-0 shadow-xl p-6 lg:p-8">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">أرسل لنا رسالة</h3>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input placeholder="الاسم الأول" className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 w-full" />
                  <input placeholder="الاسم الأخير" className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 w-full" />
                </div>
                <input placeholder="البريد الإلكتروني" type="email" className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 w-full" />
                <input placeholder="رقم الهاتف" type="tel" className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 w-full" />
                <textarea placeholder="رسالتك" rows={4} className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 w-full resize-none" />
                <button className="w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity" style={{ background: "linear-gradient(90deg, #1d4ed8, #109cd4)" }}>
                  <ArrowRight className="w-4 h-4" /> إرسال الرسالة
                </button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section className="py-12 lg:py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4">جاهز للحصول على أفضل عرض تأمين؟</h2>
          <p className="text-base lg:text-xl text-gray-600 mb-8">ابدأ الآن واحصل على عرض سعر مخصص في أقل من دقيقتين</p>
          <Btn onClick={go} className="px-10 py-4 text-lg bg-gradient-to-r from-blue-600 to-[#109cd4]">
            <Zap className="w-5 h-5" />
            ابدأ المقارنة الآن - مجاناً
          </Btn>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12 lg:py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#00c389" }}>
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-black">تأميني</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">منصة التأمين الرقمية الرائدة في السعودية. نقدم حلول تأمين ذكية ومبتكرة لحماية ما يهمك.</p>
              <div className="flex gap-2">
                {[Globe, Phone, Mail].map((Icon, i) => (
                  <div key={i} className="w-9 h-9 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                ))}
              </div>
            </div>
            {[
              { title: "الخدمات", links: ["تأمين السيارات", "التأمين الصحي", "تأمين السفر", "تأمين المنازل"] },
              { title: "الشركة", links: ["من نحن", "فريق العمل", "الوظائف", "الأخبار"] },
              { title: "الدعم", links: ["مركز المساعدة", "اتصل بنا", "الأسئلة الشائعة", "سياسة الخصوصية"] },
            ].map(col => (
              <div key={col.title}>
                <h3 className="font-bold text-lg mb-4">{col.title}</h3>
                <ul className="space-y-2.5 text-sm text-gray-400">
                  {col.links.map(l => <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col lg:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-400 text-center">© 2024 تأميني. جميع الحقوق محفوظة. مرخص من البنك المركزي السعودي.</p>
            <div className="flex items-center gap-6 text-xs text-gray-400">
              {["الشروط والأحكام", "سياسة الخصوصية", "ملفات تعريف الارتباط"].map(l => (
                <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* WhatsApp */}
      <a href="#" className="fixed bottom-6 left-6 w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform z-50" style={{ background: "#25d366" }}>
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.106.549 4.09 1.51 5.815L.057 23.454a.5.5 0 00.631.614l5.801-1.527A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.94 9.94 0 01-5.073-1.387l-.362-.215-3.762.99.999-3.673-.235-.374A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        </svg>
      </a>

      <a href="/tameeni/admin" className="fixed bottom-4 right-4 text-[10px] text-gray-300 opacity-10 hover:opacity-60 transition-all">لوحة التحكم</a>
    </div>
  );
}
