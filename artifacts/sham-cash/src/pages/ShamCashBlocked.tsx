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
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-60px",
          left: "-60px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "rgba(101,123,216,0.06)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-80px",
          right: "-60px",
          width: "260px",
          height: "260px",
          borderRadius: "50%",
          background: "rgba(31,194,138,0.04)",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          width: "100%",
          maxWidth: "390px",
          padding: "40px 24px 120px",
        }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: "13px",
            fontWeight: "700",
            letterSpacing: "3px",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          POWERED BY
        </p>

        <div style={{ position: "relative", width: "96px", height: "96px" }}>
          <svg viewBox="0 0 96 96" fill="none" width="96" height="96">
            <polygon
              points="48,8 82,26 82,70 48,88 14,70 14,26"
              stroke="rgba(101,123,216,0.35)"
              strokeWidth="2.5"
              fill="rgba(101,123,216,0.06)"
            />
            <polygon
              points="48,20 72,32 72,64 48,76 24,64 24,32"
              stroke="rgba(101,123,216,0.2)"
              strokeWidth="1.5"
              fill="rgba(101,123,216,0.04)"
            />
            <path
              d="M38 36c0-2.2 1.8-4 4-4h12c2.2 0 4 1.8 4 4v6l-6 4 6 4v6c0 2.2-1.8 4-4 4H42c-2.2 0-4-1.8-4-4V50l6-4-6-4V36z"
              fill="none"
              stroke="rgba(101,123,216,0.6)"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <p
          style={{
            color: "rgba(255,255,255,0.35)",
            fontSize: "14px",
            fontWeight: "600",
            letterSpacing: "1px",
            margin: 0,
          }}
        >
          V 2.2.1
        </p>
      </div>

      <div
        style={{
          position: "fixed",
          bottom: "0",
          left: "0",
          right: "0",
          background: "linear-gradient(135deg, #e53e3e, #c53030)",
          padding: "18px 24px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          boxShadow: "0 -4px 30px rgba(229,62,62,0.35)",
        }}
      >
        <div
          style={{
            flexShrink: 0,
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <p
          style={{
            color: "#fff",
            fontSize: "17px",
            fontWeight: "700",
            margin: 0,
            lineHeight: "1.4",
            flex: 1,
          }}
        >
          يجب تسجيل الخروج من الجهاز الحالي أولاً
        </p>
      </div>
    </div>
  );
}
