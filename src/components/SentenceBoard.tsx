import { Level } from "../types/game";

type SentenceBoardProps = {
  level: Level;
  focusedTokenIndex: number | null;
  onTokenClick: (index: number) => void;
  revealed: boolean;
};

export function SentenceBoard({ level, focusedTokenIndex, onTokenClick, revealed }: SentenceBoardProps) {
  const visibleTokens = level.fullTokens.slice(0, level.missingIndex);
  const hiddenCount = level.fullTokens.length - level.missingIndex - 1;
  const hasClicked = focusedTokenIndex !== null;

  return (
    <div className="glass-card p-6 sm:p-7">
      <h2 className="font-display text-3xl font-bold text-ink">{level.title}</h2>
      <p className="mt-2 text-slate-600">{level.subtitle}</p>

      <div className="mt-6 rounded-[28px] bg-slate-50 p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 mb-1">{level.prompt}</p>

        {/* Contextual instruction */}
        <div className="mt-3 mb-5 min-h-[1.5rem]">
          {!revealed && (
            hasClicked ? (
              <p className="text-sm text-slate-500">
                Now try clicking a different word — the prediction below will shift.
              </p>
            ) : (
              <p className="text-sm font-medium text-aurora-600">
                Click any word in the sentence to focus attention there.
              </p>
            )
          )}
        </div>

        {/* Clickable tokens */}
        <div className="flex flex-wrap gap-2.5">
          {visibleTokens.map((token, index) => {
            const isFocused = focusedTokenIndex === index;
            return (
              <button
                key={`${token}-${index}`}
                type="button"
                disabled={revealed}
                onClick={() => onTokenClick(index)}
                className={[
                  "rounded-2xl border px-4 py-2 text-sm font-semibold transition-all duration-150",
                  isFocused
                    ? "border-aurora-400 bg-aurora-50 text-aurora-900 ring-2 ring-aurora-200 shadow-md scale-105"
                    : revealed
                    ? "border-slate-200 bg-white text-slate-500 cursor-default"
                    : "border-slate-200 bg-white text-slate-700 hover:border-aurora-300 hover:bg-aurora-50 cursor-pointer hover:scale-[1.03]",
                ].join(" ")}
              >
                {token}
              </button>
            );
          })}

          {/* Missing token slot */}
          <div className="flex min-h-10 min-w-20 items-center justify-center rounded-2xl border border-dashed border-aurora-300 bg-gradient-to-r from-aurora-100 via-white to-aurora-100 px-4 py-2 text-sm font-bold text-aurora-700 shadow-sm">
            ?
          </div>

          {/* Hidden future tokens */}
          {hiddenCount > 0 && (
            <div className="curtain-pattern flex min-h-10 min-w-36 items-center justify-center rounded-2xl border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-900">
              {hiddenCount} future token{hiddenCount !== 1 ? "s" : ""} hidden
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
