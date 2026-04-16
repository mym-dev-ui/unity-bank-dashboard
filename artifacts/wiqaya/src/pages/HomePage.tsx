import { useState } from "react";
import { Shield, Car, Star, CheckCircle, ChevronLeft, Menu, X, Phone } from "lucide-react";

const COMPANIES = ["الاتحاد", "ملاذ", "سلامة", "ولاء", "بوبا العربية", "التكافل الإسلامي", "أرابيا", "الوطنية للتأمين"];
const PLANS = [
  { name: "تأمين ضد الغير", price: "من 450 ر.س", color: "#1a5276", features: ["التغطية القانونية الإلزامية", "تعويض الغير", "سرعة الإصدار"] },
  { name: "تأمين شامل", price: "من 1,200 ر.س", color: "#117a65", features: ["جميع مزايا ضد الغير", "تغطية الأضرار الذاتية", "سرقة واحتراق", "مساعدة على الطريق"] },
];

export default function HomePage() {
  const [menu, setMenu] = useState(false);

  return (
    <div className="min-h-screen bg-white" dir="rtl" style={{ fontFamily: "system-ui, -apple-system, Arial, sans-serif" }}>

      {/* NAVBAR */}
      <nav style={{ background: "#1a3a5c" }} className="sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 h-[56px] flex items-center justify-between">
          <button onClick={() => setMenu(!menu)} className="md:hidden text-white p-1">
            {menu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="hidden md:flex items-center gap-6">
            {["الرئيسية", "الباقات", "الشركات", "اتصل بنا"].map(l => (
              <a key={l} href="#" className="text-gray-300 hover:text-white text-[13px] font-semibold transition-colors">{l}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.href = "/wiqaya/register"}
              className="px-4 py-2 rounded-lg text-[13px] font-bold text-white border border-white/30 hover:bg-white/10 transition-colors"
            >
              تسجيل الدخول
            </button>
            <button
              onClick={() => window.location.href = "/wiqaya/register"}
              style={{ background: "#e8a020" }}
              className="px-4 py-2 rounded-lg text-[13px] font-bold text-white hover:opacity-90 transition-opacity"
            >
              احصل على عرض
            </button>
            <div className="flex items-center gap-2 mr-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#e8a020" }}>
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-white text-[18px] font-black">وقاية</span>
            </div>
          </div>
        </div>
        {menu && (
          <div className="md:hidden border-t border-white/10 px-4 py-3 space-y-2">
            {["الرئيسية", "الباقات", "الشركات", "اتصل بنا"].map(l => (
              <a key={l} href="#" className="block text-gray-300 py-2 text-[14px] font-semibold border-b border-white/10">{l}</a>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section style={{ background: "linear-gradient(135deg, #1a3a5c 0%, #1a5276 50%, #0e6655 100%)" }} className="py-16 md:py-24 text-white">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5 text-[13px] font-bold text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse inline-block" />
              منصة التأمين الموثوقة في المملكة
            </div>
            <h1 className="text-[38px] md:text-[52px] font-black leading-tight">
              أمّن سيارتك<br />بأفضل <span style={{ color: "#e8a020" }}>الأسعار</span>
            </h1>
            <p className="text-[15px] text-blue-100 leading-relaxed max-w-md">
              قارن بين أكثر من 8 شركات تأمين معتمدة واحصل على وثيقتك فوراً بدون تعقيدات
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => window.location.href = "/wiqaya/register"}
                style={{ background: "#e8a020" }}
                className="px-8 py-3.5 rounded-xl text-white text-[16px] font-extrabold hover:opacity-90 transition-opacity shadow-lg"
              >
                احصل على عرضك الآن
              </button>
              <button
                onClick={() => window.location.href = "/wiqaya/register"}
                className="px-8 py-3.5 rounded-xl border-2 border-white/40 text-white text-[16px] font-bold hover:bg-white/10 transition-colors"
              >
                تسجيل الدخول
              </button>
            </div>
            <div className="flex items-center gap-5 text-[13px] text-blue-200">
              {["إصدار فوري", "18 شركة تأمين", "دعم 24/7"].map(f => (
                <div key={f} className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Illustration */}
          <div className="hidden md:flex justify-center">
            <div className="relative w-80 h-64 rounded-3xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20 shadow-2xl">
              <Car className="w-40 h-40 text-white/30" strokeWidth={0.8} />
              <div className="absolute top-4 right-4 bg-white rounded-2xl p-3 shadow-lg">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span className="text-[11px] font-bold text-gray-700">مؤمّن ومحمي</span>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 bg-white rounded-2xl px-4 py-2.5 shadow-lg">
                <div className="text-[22px] font-black" style={{ color: "#1a5276" }}>+8</div>
                <div className="text-[11px] text-gray-500 font-semibold">شركة تأمين</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPANIES */}
      <section className="py-10 bg-gray-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-6">شركاء التأمين المعتمدين</p>
          <div className="flex flex-wrap justify-center gap-3">
            {COMPANIES.map(c => (
              <div key={c} className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-[13px] font-semibold text-gray-600 hover:border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer shadow-sm">
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANS */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-[28px] font-extrabold text-gray-900 mb-2">باقات التأمين</h2>
            <p className="text-[14px] text-gray-500">اختر الباقة المناسبة لك</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {PLANS.map(p => (
              <div key={p.name} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-1" style={{ background: p.color }}>
                  <div className="bg-white rounded-2xl p-6 space-y-4">
                    <div>
                      <h3 className="text-[20px] font-extrabold text-gray-900">{p.name}</h3>
                      <div className="text-[22px] font-black mt-1" style={{ color: p.color }}>{p.price}</div>
                    </div>
                    <ul className="space-y-2.5">
                      {p.features.map(f => (
                        <li key={f} className="flex items-center gap-2.5 text-[14px] text-gray-600 font-semibold">
                          <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: p.color }} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => window.location.href = "/wiqaya/register"}
                      className="w-full py-3 rounded-xl text-white text-[15px] font-bold hover:opacity-90 transition-opacity mt-2"
                      style={{ background: p.color }}
                    >
                      احصل على العرض
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-[24px] font-extrabold text-center text-gray-900 mb-8">آراء عملائنا</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: "عبدالله السلمي", text: "تجربة رائعة، حصلت على وثيقتي في أقل من 10 دقائق وبأفضل سعر في السوق." },
              { name: "نورة الحربي", text: "خدمة ممتازة ودعم سريع. أنصح الجميع بالتعامل مع وقاية." },
              { name: "خالد الدوسري", text: "أفضل موقع تأمين جربته، سهل الاستخدام ويوفر كل شيء في مكان واحد." },
            ].map(r => (
              <div key={r.name} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex mb-3">
                  {[...Array(5)].map((_,i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-[13px] text-gray-600 leading-relaxed mb-4">"{r.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-black text-white" style={{ background: "#1a5276" }}>
                    {r.name[0]}
                  </div>
                  <span className="text-[13px] font-bold text-gray-800">{r.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14" style={{ background: "linear-gradient(135deg, #1a3a5c, #0e6655)" }}>
        <div className="max-w-xl mx-auto px-4 text-center text-white">
          <h2 className="text-[28px] font-extrabold mb-3">ابدأ الآن واحصل على أفضل عرض</h2>
          <p className="text-blue-200 text-[14px] mb-7">لا تدفع أكثر من اللازم — قارن واختر في دقيقتين</p>
          <button
            onClick={() => window.location.href = "/wiqaya/register"}
            style={{ background: "#e8a020" }}
            className="px-10 py-4 rounded-xl text-white text-[17px] font-extrabold hover:opacity-90 transition-opacity shadow-xl"
          >
            احصل على عرض مجاني
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0e1e30" }} className="py-8 text-gray-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#e8a020" }}>
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-[17px] font-black">وقاية</span>
          </div>
          <p className="text-[12px]">© 2024 وقاية للتأمين. جميع الحقوق محفوظة</p>
          <div className="flex items-center gap-1.5 text-[12px]">
            <Phone className="w-3.5 h-3.5" />
            <span dir="ltr">920000123</span>
          </div>
        </div>
      </footer>

      <a href="/wiqaya-admin/" className="fixed bottom-3 left-3 text-[10px] text-gray-400 hover:text-gray-600 opacity-30 hover:opacity-100 transition-all">لوحة التحكم</a>
    </div>
  );
}
