import { conceptDetails } from "../lib/concepts";
import { ConceptId } from "../types/game";

type LearningProgressProps = {
  unlockedConcepts: ConceptId[];
};

export function LearningProgress({ unlockedConcepts }: LearningProgressProps) {
  const progress = Math.round((unlockedConcepts.length / conceptDetails.length) * 100);

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Learning progress</p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-ink">Concept map progress</h3>
        </div>
        <span className="rounded-full bg-aurora-100 px-4 py-2 text-sm font-semibold text-aurora-700">
          {unlockedConcepts.length}/{conceptDetails.length} unlocked
        </span>
      </div>

      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-aurora-400 via-sky-400 to-emerald-400"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {conceptDetails.map((concept) => {
          const unlocked = unlockedConcepts.includes(concept.id);

          return (
            <div
              key={concept.id}
              className={[
                "rounded-2xl border px-3 py-2",
                unlocked ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-white text-slate-400",
              ].join(" ")}
            >
              <p className="text-sm font-semibold">{concept.title}</p>
              <p className={["text-xs", unlocked ? "text-emerald-600" : "text-slate-400"].join(" ")}>{concept.subtitle}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
