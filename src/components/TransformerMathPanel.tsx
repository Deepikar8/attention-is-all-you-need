import { getAttentionFormulaLines, getComplexityLabel, getLevelMathSummary, getResultMathSummary } from "../lib/education";
import { Level, LevelResult } from "../types/game";

type TransformerMathPanelProps = {
  level: Level;
  result?: LevelResult;
  mode: "tutorial" | "reveal";
};

export function TransformerMathPanel({ level, result, mode }: TransformerMathPanelProps) {
  const summary = getLevelMathSummary(level);
  const resultSummary = result ? getResultMathSummary(level, result) : null;

  return (
    <div className="rounded-[28px] bg-slate-950 p-5 text-white shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Math under the hood</p>
          <h3 className="mt-2 font-display text-2xl font-semibold">
            {mode === "tutorial" ? "How the transformer computes the next token" : "Why this prediction wins mathematically"}
          </h3>
        </div>
        <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/85">
          {summary.visibleTokenCount} visible tokens • {summary.headCount} head{summary.headCount > 1 ? "s" : ""}
        </span>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-[24px] bg-white/5 p-4">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/60">Core equations</p>
          <div className="mt-4 space-y-2 font-mono text-sm leading-7 text-sky-100">
            {getAttentionFormulaLines().map((line) => (
              <div key={line} className="rounded-2xl bg-white/5 px-3 py-2">
                {line}
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-white/75">
            In this game, your flashlight points stand in for the final attention weights after queries, keys, masking, and softmax have already done their work.
          </p>
        </div>

        <div className="rounded-[24px] bg-white/5 p-4">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/60">What that means here</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/5 p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-white/60">Attention cells</p>
              <p className="mt-2 font-display text-3xl font-bold">{summary.attentionCells}</p>
              <p className="mt-2 text-sm text-white/70">Head-to-token slots to fill before making the guess.</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-white/60">Masked future tokens</p>
              <p className="mt-2 font-display text-3xl font-bold">{summary.maskedCount}</p>
              <p className="mt-2 text-sm text-white/70">These positions are blocked by the causal mask.</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-white/75">{getComplexityLabel(level)}</p>
        </div>
      </div>

      <div className="mt-5 rounded-[24px] bg-white/5 p-4">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/60">
          {mode === "tutorial" ? "Model-like head behavior" : "Where each head focused"}
        </p>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {summary.headBreakdowns.map((head) => {
            const revealHead = resultSummary?.headComparisons.find((item) => item.headId === head.headId);

            return (
              <div key={head.headId} className="rounded-2xl bg-white/5 p-4">
                <p className="font-display text-lg font-semibold">{head.label}</p>
                <p className="mt-2 text-sm leading-6 text-white/75">
                  Strongest model focus: <span className="font-semibold text-white">{head.strongestToken}</span> at{" "}
                  <span className="font-semibold text-white">{Math.round(head.strongestWeight * 100)}%</span> of this head's budget.
                </p>
                {revealHead ? (
                  <p className="mt-2 text-sm leading-6 text-white/75">
                    Your strongest focus: <span className="font-semibold text-white">{revealHead.userFocusToken}</span> at{" "}
                    <span className="font-semibold text-white">{revealHead.userFocusStrength}</span>. Alignment:{" "}
                    <span className="font-semibold text-white">{revealHead.alignmentLabel}</span>.
                  </p>
                ) : (
                  <p className="mt-2 text-sm leading-6 text-white/75">
                    This head contributes one separate attention pattern before the model mixes the head outputs together.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {resultSummary && (
        <div className="mt-5 rounded-[24px] bg-white/5 p-4">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/60">Logits to probabilities</p>
          <p className="mt-3 text-sm leading-6 text-white/75">
            After the context vector is built, the model produces logits for many possible next tokens and then runs softmax. In this level,
            <span className="font-semibold text-white"> {resultSummary.topCandidate.token}</span> leads by
            <span className="font-semibold text-white"> {resultSummary.candidateGap} percentage points</span> over the next candidate shown in the fountain.
          </p>
        </div>
      )}
    </div>
  );
}
