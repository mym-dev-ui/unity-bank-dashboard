import { useState } from "react";
import { Eye, EyeOff, Lock, UserRound } from "lucide-react";

export function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      if (res.ok) {
        sessionStorage.setItem("sham_admin_auth", "1");
        onLogin();
      } else {
        setError(true);
        setTimeout(() => setError(false), 2500);
      }
    } catch {
      setError(true);
      setTimeout(() => setError(false), 2500);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#0f1526] text-white flex items-center justify-center" dir="rtl">
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#6273d4]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 bottom-20 h-80 w-80 rounded-full bg-[#1fc28a]/5 blur-3xl" />

      <div className="relative w-full max-w-[360px] px-6 space-y-8">
        <div className="text-center space-y-2">
          <div className="mx-auto h-14 w-14 rounded-[18px] bg-[#657bd8]/20 border border-[#657bd8]/30 flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-[#657bd8]" />
          </div>
          <h1 className="text-[24px] font-extrabold text-white/90">لوحة التحكم</h1>
          <p className="text-[14px] font-semibold text-[#c9ccdb]/50">أدخل بيانات المدير للدخول</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex h-[54px] items-center gap-3 rounded-[15px] border border-white/[0.06] bg-[#1e2640] px-5">
            <div className="text-white/40"><UserRound className="h-5 w-5" /></div>
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              className="min-w-0 flex-1 bg-transparent text-right text-[16px] font-semibold text-white outline-none placeholder:text-[#c9ccdb]/40"
              dir="rtl"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex h-[54px] items-center gap-3 rounded-[15px] border border-white/[0.06] bg-[#1e2640] px-5">
            <div className="text-white/40"><Lock className="h-5 w-5" /></div>
            <input
              type={showPass ? "text" : "password"}
              placeholder="كلمة المرور"
              className="min-w-0 flex-1 bg-transparent text-right text-[16px] font-semibold text-white outline-none placeholder:text-[#c9ccdb]/40"
              dir="rtl"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="text-white/40 hover:text-white/70 transition-colors">
              {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {error && (
            <p className="text-center text-[13px] font-bold text-[#e54343] bg-[#e54343]/10 rounded-[10px] py-2">
              البريد أو كلمة المرور غير صحيحة
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[58px] rounded-[15px] bg-[#657bd8] text-[18px] font-extrabold text-white shadow-[0_16px_35px_rgba(101,123,216,0.22)] hover:bg-[#7089e0] active:scale-[0.98] transition-all disabled:opacity-60"
          >
            دخول
          </button>
        </form>
      </div>
    </div>
  );
}
