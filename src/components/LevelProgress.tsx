type LevelProgressProps = {
  currentIndex: number;
  total: number;
};

export function LevelProgress({ currentIndex, total }: LevelProgressProps) {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Progress</p>
          <p className="mt-1 font-display text-xl font-semibold text-ink">
            Level {currentIndex + 1} of {total}
          </p>
        </div>
        <div className="flex gap-2">
          {Array.from({ length: total }).map((_, index) => {
            const isActive = index === currentIndex;
            const isDone = index < currentIndex;

            return (
              <div
                key={index}
                className={[
                  "h-3 w-14 rounded-full",
                  isDone ? "bg-emerald-400" : isActive ? "bg-aurora-500" : "bg-slate-200",
                ].join(" ")}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
