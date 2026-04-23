import { ConceptExplainers } from "./ConceptExplainers";
import { Level, LevelResult } from "../types/game";

type ExplanationCardProps = {
  level: Level;
  result: LevelResult;
  selectedCandidate: string | null;
  onRestart: () => void;
};

export function ExplanationCard({ level, result, selectedCandidate, onRestart }: ExplanationCardProps) {
  const topToken = result.rankedCandidates[0]?.token;

  return (
    <div className="space-y-4 animate-rise">
      {/* Result */}
      <div className="glass-card p-6 sm:p-7">
        <span
          className={[
            "inline-flex rounded-full px-4 py-2 text-sm font-semibold",
            result.isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800",
          ].join(" ")}
        >
          {result.isCorrect
            ? "Your attention produced the right prediction"
            : "Your attention predicted a different word"}
        </span>

        <h3 className="mt-4 font-display text-2xl font-bold text-ink">{level.explanation.headline}</h3>
        <p className="mt-3 text-base leading-7 text-slate-600">{level.explanation.plainEnglish}</p>

        {/* Prediction bars */}
        <div className="mt-6 rounded-[20px] bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 mb-4">
            Prediction based on your attention
          </p>
          <div className="space-y-3">
            {result.rankedCandidates.map((c) => (
              <div key={c.token}>
                <div className="flex items-center justify-between text-sm font-semibold text-slate-700 mb-1">
                  <div className="flex items-center gap-2">
                    <span>{c.token}</span>
                    {c.token === topToken && (
                      <span className="rounded-full bg-ink px-2 py-0.5 text-xs text-white">model's pick</span>
                    )}
                    {c.token === selectedCandidate && c.token !== topToken && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">your pick</span>
                    )}
                  </div>
                  <span>{c.probability}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="probability-bar h-full rounded-full animate-shimmer"
                    style={{ width: `${Math.max(2, c.probability)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Try again and move attention to a different word — the bars above will shift.
          </p>
        </div>

        <button
          type="button"
          onClick={onRestart}
          className="mt-6 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-soft hover:-translate-y-0.5 hover:border-slate-300"
        >
          Try again with different attention
        </button>
      </div>

      {/* Concept explainers */}
      <div className="glass-card p-6 sm:p-7">
        <ConceptExplainers />
      </div>
    </div>
  );
}
