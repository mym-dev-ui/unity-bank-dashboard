import { useEffect, useState } from "react";
import { useLocation } from "wouter";

const C = {
  navy: "#1B2B6B",
  navyLight: "#2A3F8F",
  blue: "#4A5FEA",
  cyan: "#5DD8F8",
  gold: "#F0B429",
  white: "#FFFFFF",
};

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

export default function SplashPage() {
  const [, nav] = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // fade-in
    const t1 = setTimeout(() => setVisible(true), 80);
    // auto-navigate after 5s
    const t2 = setTimeout(() => nav("/login"), 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [nav]);

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

      {/* ── Top: logo ── */}
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

      {/* ── Centre: promo card ── */}
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
            padding: "28px 24px 20px",
            textAlign: "center",
          }}>
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
              عرض حصري لفترة محدودة
            </div>
            <p style={{
              color: C.white,
              fontSize: "34px",
              fontWeight: "900",
              lineHeight: "1.15",
              margin: 0,
            }}>
              قدّم على قرضك
            </p>
            <p style={{
              color: C.cyan,
              fontSize: "28px",
              fontWeight: "900",
              margin: "4px 0 0",
            }}>
              الآن — فوري ⚡
            </p>
            <p style={{
              color: "rgba(255,255,255,0.78)",
              fontSize: "14px",
              fontWeight: "500",
              margin: "12px 0 0",
              lineHeight: "1.6",
            }}>
              حتى ١٠٠٠٠٠ ريال • موافقة فورية<br />
              بدون ضامن • بأقل الأقساط
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
              { icon: "✅", text: "موافقة خلال دقائق" },
              { icon: "💳", text: "تحويل فوري لحسابك" },
              { icon: "🔒", text: "آمن ومرخص من ساما" },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "18px" }}>{icon}</span>
                <span style={{ color: C.navy, fontSize: "14px", fontWeight: "600" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom: CTA button ── */}
      <div style={{ padding: "0 24px 48px" }}>
        <button
          onClick={() => nav("/login")}
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
          }}
        >
          ابدأ الآن ←
        </button>
        <p style={{
          textAlign: "center",
          color: "rgba(255,255,255,0.45)",
          fontSize: "12px",
          marginTop: "12px",
        }}>
          تنتقل تلقائياً خلال ثوانٍ
        </p>
      </div>
    </div>
  );
}
