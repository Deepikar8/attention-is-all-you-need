import { getRemainingBudget } from "../lib/scoring";
import { headThemes } from "../lib/headThemes";
import { AllocationMap, Level } from "../types/game";

type AttentionAllocatorProps = {
  level: Level;
  allocations: AllocationMap;
  disabled: boolean;
  activeHeadId: string;
  activeTokenIndex: number;
  onAdjust: (headId: string, tokenIndex: number, delta: number) => void;
  onFocusChange: (headId: string, tokenIndex: number) => void;
};

export function AttentionAllocator({
  level,
  allocations,
  disabled,
  activeHeadId,
  activeTokenIndex,
  onAdjust,
  onFocusChange,
}: AttentionAllocatorProps) {
  const visibleTokens = level.fullTokens.slice(0, level.missingIndex);

  // Mark tokens that have meaningful affinity for any candidate; dim the rest
  const tokenSignificance = level.tokenAffinities
    ? visibleTokens.map((_, i) =>
        Object.values(level.tokenAffinities!).some((affs) => Math.abs(affs[i] ?? 0) > 0.1)
      )
    : visibleTokens.map(() => true);

  return (
    <div className="glass-card p-6 sm:p-7">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Attention weights</p>
        <h3 className="mt-2 font-display text-2xl font-semibold text-ink">Where should the model focus?</h3>
      </div>
      <div className="mt-4 rounded-3xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
        Add weight to the words you think matter most for predicting the missing token. The prediction bars below update live.
        <span className="ml-2 text-slate-500">Keyboard: Arrow Left/Right to move · Arrow Up/Down or +/- to adjust · H to switch heads</span>
      </div>

      <div className="mt-6 space-y-5">
        {level.heads.map((head) => {
          const theme = headThemes[head.color];
          const current = allocations[head.id] ?? [];
          const remaining = getRemainingBudget(head, current);
          const isActiveHead = activeHeadId === head.id;

          return (
            <div
              key={head.id}
              className={[
                `rounded-[28px] border bg-gradient-to-br ${theme.panel} ${theme.border} p-5`,
                isActiveHead ? "ring-2 ring-aurora-200" : "",
              ].join(" ")}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${theme.badge}`}>
                    {head.label}
                  </span>
                  <p className={`mt-3 font-medium ${theme.text}`}>{head.hint}</p>
                </div>
                <div className="rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700">
                  Remaining points: {remaining}/{head.budget}
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {visibleTokens.map((token, index) => {
                  const points = current[index] ?? 0;
                  const canAdd = remaining > 0;
                  const canRemove = points > 0;
                  const isSignificant = tokenSignificance[index] ?? true;

                  return (
                    <div
                      key={`${head.id}-${token}-${index}`}
                      className={[
                        "rounded-3xl bg-white/80 p-3 shadow-sm transition-colors",
                        isActiveHead && activeTokenIndex === index ? "bg-white ring-2 ring-aurora-200" : "",
                        !isSignificant && points === 0 ? "opacity-40" : "",
                      ].join(" ")}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => onFocusChange(head.id, index)}
                          className="min-w-0 flex-1 rounded-2xl px-2 py-1 text-left disabled:cursor-default"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <p className="truncate font-semibold text-slate-700">{token}</p>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                              {points} pts
                            </span>
                          </div>
                          <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${theme.bar}`}
                              style={{ width: `${(points / head.budget) * 100}%` }}
                            />
                          </div>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={disabled || !canRemove}
                            onClick={() => onAdjust(head.id, index, -1)}
                            aria-keyshortcuts="ArrowDown,-"
                            className={`h-10 w-10 rounded-full border bg-white text-lg font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 ${theme.button}`}
                          >
                            -
                          </button>
                          <button
                            type="button"
                            disabled={disabled || !canAdd}
                            onClick={() => onAdjust(head.id, index, 1)}
                            aria-keyshortcuts="ArrowUp,+"
                            className={`h-10 w-10 rounded-full border bg-white text-lg font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 ${theme.button}`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
