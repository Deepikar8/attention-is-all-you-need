import { Level, LevelResult, RankedCandidate } from "../types/game";

type CandidateOptionsProps = {
  level: Level;
  selectedCandidate: string | null;
  result: LevelResult | null;
  liveProbabilities: RankedCandidate[];
  onSelect: (candidate: string) => void;
  onReveal: () => void;
};

export function CandidateOptions({
  level,
  selectedCandidate,
  result,
  liveProbabilities,
  onSelect,
  onReveal,
}: CandidateOptionsProps) {
  const revealed = Boolean(result);
  const probabilitiesByToken = new Map(
    (revealed ? result!.rankedCandidates : liveProbabilities).map((item) => [item.token, item.probability]),
  );
  const topToken = (revealed ? result!.rankedCandidates : liveProbabilities)[0]?.token;

  return (
    <div className="glass-card p-6 sm:p-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Live next-token prediction
          </p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-ink">Pick the next token</h3>
          {!revealed && (
            <p className="mt-2 text-sm text-slate-600">
              These bars update as you move attention above. Stack points on different earlier words and watch the
              prediction shift.
            </p>
          )}
        </div>
        <div className="rounded-full bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700">
          Press 1-{level.candidates.length} to choose
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {level.candidates.map((candidate, index) => {
          const isSelected = selectedCandidate === candidate;
          const isCorrect = revealed && result?.rankedCandidates[0]?.token === candidate;
          const isWrongChoice = revealed && isSelected && !isCorrect;
          const probability = probabilitiesByToken.get(candidate) ?? 0;
          const isLiveLeader = !revealed && candidate === topToken;

          return (
            <button
              key={candidate}
              type="button"
              disabled={revealed}
              onClick={() => onSelect(candidate)}
              aria-keyshortcuts={`${index + 1}`}
              className={[
                "rounded-3xl border px-5 py-4 text-left shadow-sm transition-colors",
                isCorrect
                  ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                  : isWrongChoice
                    ? "border-rose-300 bg-rose-50 text-rose-900"
                    : isSelected
                      ? "border-aurora-400 bg-aurora-50 text-aurora-900"
                      : isLiveLeader
                        ? "border-aurora-200 bg-white text-slate-800"
                        : "border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-soft",
                revealed ? "cursor-default" : "",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-display text-xl font-semibold">{candidate}</span>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {probability}%
                  </span>
                  {!revealed && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-500">
                      {index + 1}
                    </span>
                  )}
                  {isCorrect && (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase">
                      Top
                    </span>
                  )}
                  {isWrongChoice && (
                    <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase">
                      Your pick
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="probability-bar h-full rounded-full transition-[width] duration-300 ease-out"
                  style={{ width: `${Math.max(2, probability)}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onReveal}
        disabled={!selectedCandidate || revealed}
        aria-keyshortcuts="Enter"
        className="mt-6 inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 font-semibold text-white shadow-glow disabled:cursor-not-allowed disabled:opacity-50 hover:-translate-y-0.5 hover:bg-slate-800"
      >
        Lock in and reveal
      </button>
    </div>
  );
}
