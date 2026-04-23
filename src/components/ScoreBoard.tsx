type ScoreBoardProps = {
  totalScore: number;
  completedLevels: number;
  totalLevels: number;
  accuracy: number;
};

export function ScoreBoard({ totalScore, completedLevels, totalLevels, accuracy }: ScoreBoardProps) {
  return (
    <div className="glass-card p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Score board</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Quest score</p>
          <p className="mt-2 font-display text-3xl font-bold text-ink">{totalScore}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Levels cleared</p>
          <p className="mt-2 font-display text-3xl font-bold text-ink">
            {completedLevels}/{totalLevels}
          </p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Accuracy</p>
          <p className="mt-2 font-display text-3xl font-bold text-ink">{accuracy}%</p>
        </div>
      </div>
    </div>
  );
}
