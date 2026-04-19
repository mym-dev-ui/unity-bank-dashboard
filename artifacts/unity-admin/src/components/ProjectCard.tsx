import { Users, Wifi, ChevronRight, Trash2 } from "lucide-react";
import type { ProjectInfo } from "@/lib/api";

const PROJECT_COLORS: Record<string, string> = {
  unity:   "#1a3d6e",
  sham:    "#1a1f4e",
  tameeni: "#1a5c3a",
  wiqaya:  "#1a3a6e",
};

const PROJECT_ICONS: Record<string, string> = {
  unity:   "🏦",
  sham:    "💳",
  tameeni: "🚗",
  wiqaya:  "🛡",
};

interface Props {
  project: ProjectInfo;
  liveCount: number;
  totalCount: number;
  onOpen: () => void;
  onDelete?: () => void;
}

export default function ProjectCard({ project, liveCount, totalCount, onOpen, onDelete }: Props) {
  const color = PROJECT_COLORS[project.key] ?? "#1a3d6e";
  const icon  = PROJECT_ICONS[project.key]  ?? "📊";

  return (
    <div
      className="relative rounded-2xl border border-white/10 overflow-hidden hover:border-white/25 transition-all cursor-pointer group"
      style={{ background: `linear-gradient(135deg, ${color}cc, ${color}88)` }}
      onClick={onOpen}
    >
      {/* Delete button for custom projects */}
      {!project.builtin && onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="absolute top-3 left-3 text-white/30 hover:text-red-400 transition-colors z-10"
          title="حذف المشروع"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}

      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <span className="text-3xl">{icon}</span>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-black text-base truncate">{project.label}</h3>
            <p className="text-white/40 text-xs font-mono truncate">{project.apiBase}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white/70 transition-colors flex-shrink-0" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Wifi className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400 text-xs font-bold">متصل</span>
            </div>
            <p className="text-white font-black text-xl">{liveCount}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-blue-400 text-xs font-bold">الكلي</span>
            </div>
            <p className="text-white font-black text-xl">{totalCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
