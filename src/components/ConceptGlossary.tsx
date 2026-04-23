import { conceptDetails } from "../lib/concepts";
import { ConceptId } from "../types/game";

type ConceptGlossaryProps = {
  highlightedConcepts: ConceptId[];
};

export function ConceptGlossary({ highlightedConcepts }: ConceptGlossaryProps) {
  return (
    <div className="glass-card p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Concept guide</p>
      <div className="mt-4 space-y-3">
        {conceptDetails.map((concept) => {
          const active = highlightedConcepts.includes(concept.id);

          return (
            <div
              key={concept.id}
              className={[
                "rounded-3xl border p-4 transition-colors",
                active ? "border-aurora-200 bg-aurora-50" : "border-slate-200 bg-white",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-display text-lg font-semibold text-ink">{concept.title}</p>
                <span
                  className={[
                    "shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]",
                    active ? "bg-aurora-100 text-aurora-700" : "bg-slate-100 text-slate-500",
                  ].join(" ")}
                >
                  {concept.subtitle}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{concept.body}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
