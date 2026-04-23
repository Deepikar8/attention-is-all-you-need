import { CompletedLevel } from "../types/game";

type CompletionScreenProps = {
  history: CompletedLevel[];
  totalScore: number;
  onRestart: () => void;
};

export function CompletionScreen({ history, totalScore, onRestart }: CompletionScreenProps) {
  const correctCount = history.filter((entry) => entry.result.isCorrect).length;
  const averageAttention = history.length
    ? Math.round(history.reduce((total, entry) => total + entry.result.attentionScore, 0) / history.length)
    : 0;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="glass-card magic-sparkles overflow-hidden p-8 sm:p-10">
        <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800">
          Quest complete
        </span>
        <h1 className="mt-5 font-display text-4xl font-bold text-ink sm:text-5xl">
          You finished Sentence Land.
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          You practiced how transformers look backward, protect the future with masking, and turn clues
          into next-token probabilities.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl bg-white/80 p-5 shadow-soft">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Total score</p>
            <p className="mt-2 font-display text-4xl font-bold text-ink">{totalScore}</p>
          </div>
          <div className="rounded-3xl bg-white/80 p-5 shadow-soft">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Correct picks</p>
            <p className="mt-2 font-display text-4xl font-bold text-ink">
              {correctCount}/{history.length}
            </p>
          </div>
          <div className="rounded-3xl bg-white/80 p-5 shadow-soft">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Average attention</p>
            <p className="mt-2 font-display text-4xl font-bold text-ink">{averageAttention}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {history.map((entry) => (
            <div key={entry.levelId} className="rounded-[28px] bg-white/85 p-5 shadow-soft">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{entry.levelTitle}</p>
              <p className="mt-3 text-sm font-semibold text-slate-700">
                Best token: {entry.result.rankedCandidates[0]?.token}
              </p>
              <p className="mt-2 text-sm text-slate-600">Your pick: {entry.selectedCandidate ?? "None selected"}</p>
              <p className="mt-2 text-sm text-slate-600">Turn score: {entry.result.turnScore}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{entry.result.feedback}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onRestart}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 font-semibold text-white shadow-glow hover:-translate-y-0.5 hover:bg-slate-800"
        >
          Play again
        </button>
      </div>
    </section>
  );
}
