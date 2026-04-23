import { HeadColor } from "../types/game";

type AttentionHeatmapProps = {
  tokens: string[];
  intensities: number[];
  title: string;
  accent?: HeadColor | "slate";
  activeTokenIndex?: number;
};

const accentClasses: Record<NonNullable<AttentionHeatmapProps["accent"]>, string> = {
  sun: "from-amber-200 to-orange-300",
  sky: "from-sky-200 to-indigo-300",
  mint: "from-emerald-200 to-teal-300",
  slate: "from-slate-200 to-slate-300",
};

export function AttentionHeatmap({
  tokens,
  intensities,
  title,
  accent = "slate",
  activeTokenIndex,
}: AttentionHeatmapProps) {
  return (
    <div className="rounded-[24px] bg-white/75 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</p>
        <p className="text-xs text-slate-500">Brighter cells mean stronger attention.</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
        {tokens.map((token, index) => {
          const intensity = Math.max(0, Math.min(1, intensities[index] ?? 0));
          const isActive = activeTokenIndex === index;

          return (
            <div
              key={`${token}-${index}`}
              className={[
                "rounded-2xl border p-3 transition-all",
                isActive ? "border-aurora-400 ring-2 ring-aurora-200" : "border-slate-200",
              ].join(" ")}
              style={{
                background: `linear-gradient(180deg, rgba(255,255,255,0.95), rgba(79,109,245,${0.08 + intensity * 0.42}))`,
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-semibold text-slate-700">{token}</span>
                <span className="text-xs font-semibold text-slate-500">{Math.round(intensity * 100)}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/70">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${accentClasses[accent]}`}
                  style={{ width: `${Math.max(6, intensity * 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
