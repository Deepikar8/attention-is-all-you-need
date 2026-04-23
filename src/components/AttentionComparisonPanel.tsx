import { headThemes } from "../lib/headThemes";
import { weightsToFractions } from "../lib/scoring";
import { Level, LevelResult } from "../types/game";
import { AttentionHeatmap } from "./AttentionHeatmap";

type AttentionComparisonPanelProps = {
  level: Level;
  result: LevelResult;
};

export function AttentionComparisonPanel({ level, result }: AttentionComparisonPanelProps) {
  const visibleTokens = level.fullTokens.slice(0, level.missingIndex);

  return (
    <div className="rounded-[28px] bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Attention comparison</p>
          <h4 className="mt-2 font-display text-2xl font-semibold text-ink">Your attention vs model-like attention</h4>
        </div>
        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
          Compare head by head
        </span>
      </div>

      <div className="mt-5 space-y-5">
        {level.heads.map((head) => {
          const details = result.headBreakdown.find((item) => item.headId === head.id);
          const theme = headThemes[head.color];
          const userWeights = weightsToFractions(details?.userWeights ?? [], head.budget);
          const modelWeights = weightsToFractions(details?.modelWeights ?? [], head.budget);

          return (
            <div
              key={head.id}
              className={`rounded-[28px] border bg-gradient-to-br ${theme.panel} ${theme.border} p-4`}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${theme.badge}`}>
                    {head.label}
                  </span>
                  <span className="text-sm font-semibold text-slate-700">{details?.alignmentLabel}</span>
                </div>
                <span className="text-sm font-semibold text-slate-700">{details?.score ?? 0}/100 match</span>
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-2">
                <AttentionHeatmap
                  tokens={visibleTokens}
                  intensities={userWeights}
                  title="Your attention"
                  accent={head.color}
                />
                <AttentionHeatmap
                  tokens={visibleTokens}
                  intensities={modelWeights}
                  title="Model-like attention"
                  accent={head.color}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
