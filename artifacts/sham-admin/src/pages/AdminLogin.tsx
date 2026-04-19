import { useState } from "react";

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        sessionStorage.setItem("sham_admin_auth", "1");
        onLogin();
      } else {
        setError(data.error ?? "بيانات الدخول غير صحيحة");
      }
    } catch {
      setError("خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f1526 0%, #151c36 50%, #0f1526 100%)",
        fontFamily: "'Inter', system-ui, sans-serif",
        direction: "rtl",
      }}
    >
      <div
        style={{
          background: "rgba(21,28,54,0.97)",
          borderRadius: "18px",
          padding: "48px 40px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 8px 40px rgba(101,123,216,0.18)",
          border: "1px solid rgba(101,123,216,0.15)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #657bd8, #1fc28a)",
              marginBottom: "18px",
              fontSize: "28px",
            }}
          >
            🛡️
          </div>
          <h1
            style={{
              color: "#e2e8f0",
              fontSize: "24px",
              fontWeight: "700",
              margin: "0 0 8px",
            }}
          >
            لوحة الإدارة
          </h1>
          <p style={{ color: "#657bd8", fontSize: "14px", margin: 0 }}>
            Sham Cash Control Panel
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                color: "#94a3b8",
                fontSize: "13px",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@shamcash.com"
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "10px",
                border: "1.5px solid rgba(101,123,216,0.25)",
                background: "rgba(255,255,255,0.04)",
                color: "#e2e8f0",
                fontSize: "15px",
                outline: "none",
                direction: "ltr",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "28px" }}>
            <label
              style={{
                display: "block",
                color: "#94a3b8",
                fontSize: "13px",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "10px",
                border: "1.5px solid rgba(101,123,216,0.25)",
                background: "rgba(255,255,255,0.04)",
                color: "#e2e8f0",
                fontSize: "15px",
                outline: "none",
                direction: "ltr",
                boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <div
              style={{
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "10px",
                padding: "12px 16px",
                color: "#f87171",
                fontSize: "14px",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              background: loading
                ? "rgba(101,123,216,0.5)"
                : "linear-gradient(135deg, #657bd8, #5466b8)",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "700",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            {loading ? "جاري التحقق..." : "دخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
