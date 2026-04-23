import { Level } from "../types/game";
import { AttentionHeatmap } from "./AttentionHeatmap";
import { TokenChip } from "./TokenChip";

type SentenceBoardProps = {
  level: Level;
  heatmapIntensities: number[];
  activeTokenIndex: number;
};

export function SentenceBoard({ level, heatmapIntensities, activeTokenIndex }: SentenceBoardProps) {
  const visibleTokens = level.fullTokens.slice(0, level.missingIndex);
  const hiddenCount = level.fullTokens.length - level.missingIndex - 1;

  return (
    <div className="glass-card p-6 sm:p-7">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-sky-800">
          {level.fullTokens.length} tokens
        </span>
        {level.heads.length > 1 && (
          <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-violet-800">
            Multiple attention heads
          </span>
        )}
      </div>

      <h2 className="mt-4 font-display text-3xl font-bold text-ink">{level.title}</h2>
      <p className="mt-2 text-slate-600">{level.subtitle}</p>

      <div className="mt-6 rounded-[28px] bg-slate-50 p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{level.prompt}</p>
        <div className="mt-4">
          <AttentionHeatmap
            tokens={visibleTokens}
            intensities={heatmapIntensities}
            title="Live attention heatmap"
            activeTokenIndex={activeTokenIndex}
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {visibleTokens.map((token, index) => (
            <TokenChip
              key={`${token}-${index}`}
              token={token}
              highlightStrength={heatmapIntensities[index] ?? 0}
              isActive={index === activeTokenIndex}
            />
          ))}

          <div className="flex min-h-11 min-w-20 items-center justify-center rounded-2xl border border-dashed border-aurora-300 bg-gradient-to-r from-aurora-100 via-white to-aurora-100 px-4 py-2 text-sm font-bold text-aurora-700 shadow-sm">
            Next token?
          </div>

          {hiddenCount > 0 && (
            <div className="curtain-pattern flex min-h-11 min-w-40 animate-shimmer items-center justify-center rounded-2xl border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-900">
              {hiddenCount} future token{hiddenCount !== 1 ? "s" : ""} hidden
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
