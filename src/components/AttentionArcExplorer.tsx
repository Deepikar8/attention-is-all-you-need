import { useState } from "react";
import { getVisibleTokens } from "../lib/education";
import { normalizeToBudget, weightsToFractions } from "../lib/scoring";
import { Level } from "../types/game";
import { headThemes } from "../lib/headThemes";

type AttentionArcExplorerProps = {
  level: Level;
};

const viewBoxWidth = 1000;
const viewBoxHeight = 300;
const tokenY = 228;
const queryX = 902;
const queryY = 190;

const buildArcPath = (startX: number, endX: number) => {
  const distance = Math.abs(endX - startX);
  const lift = Math.max(60, Math.min(160, distance * 0.32));
  const controlY = tokenY - lift;
  const controlX1 = startX - distance * 0.24;
  const controlX2 = endX + distance * 0.24;

  return `M ${startX} ${queryY} C ${controlX1} ${controlY}, ${controlX2} ${controlY}, ${endX} ${tokenY}`;
};

export function AttentionArcExplorer({ level }: AttentionArcExplorerProps) {
  const visibleTokens = getVisibleTokens(level);
  const [activeHeadId, setActiveHeadId] = useState(level.heads[0]?.id ?? "");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const activeHead = level.heads.find((head) => head.id === activeHeadId) ?? level.heads[0];

  if (!activeHead) {
    return null;
  }

  const theme = headThemes[activeHead.color];
  const normalizedWeights = normalizeToBudget(activeHead.idealWeights, activeHead.budget);
  const fractions = weightsToFractions(normalizedWeights, activeHead.budget);
  const strongestIndex = fractions.indexOf(Math.max(...fractions));
  const step = 740 / Math.max(visibleTokens.length - 1, 1);
  const tokenPositions = visibleTokens.map((_, index) => 120 + index * step);
  const highlightedIndex = hoveredIndex ?? strongestIndex;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
      <div className="rounded-[28px] border border-slate-200 bg-[#f8f5ef] p-5 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Attention explorer</p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-ink">
              The blank token looks back at every earlier token at once
            </h3>
          </div>
          {level.heads.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {level.heads.map((head) => {
                const headTheme = headThemes[head.color];
                const isActive = head.id === activeHead.id;

                return (
                  <button
                    key={head.id}
                    type="button"
                    onClick={() => {
                      setActiveHeadId(head.id);
                      setHoveredIndex(null);
                    }}
                    className={[
                      "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                      isActive
                        ? `${headTheme.badge} border-transparent`
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                    ].join(" ")}
                  >
                    {head.shortLabel}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-5 rounded-[24px] border border-white/70 bg-white/65 p-4">
          <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} className="w-full">
            <defs>
              <linearGradient id="attentionArc" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="#b7d9d7" />
                <stop offset="100%" stopColor="#327f80" />
              </linearGradient>
            </defs>

            {tokenPositions.map((x, index) => {
              const weight = fractions[index] ?? 0;
              const active = highlightedIndex === index;

              return (
                <g key={`arc-${index}`}>
                  <path
                    d={buildArcPath(queryX, x)}
                    fill="none"
                    stroke="url(#attentionArc)"
                    strokeLinecap="round"
                    strokeWidth={Math.max(2, weight * 18)}
                    opacity={active ? 0.95 : Math.max(0.08, weight * 0.6)}
                  />
                  <circle cx={x} cy={tokenY} r={active ? 4.5 : 3} fill={active ? "#327f80" : "#9dc7c4"} />
                </g>
              );
            })}

            <circle cx={queryX} cy={queryY} r={6} fill="#b5651d" />
            <text x={queryX - 36} y={queryY - 18} fill="#b5651d" fontSize="18" fontWeight="700">
              Next token?
            </text>
          </svg>

          <div className="mt-3 grid gap-2 sm:grid-cols-5 lg:grid-cols-9">
            {visibleTokens.map((token, index) => {
              const active = highlightedIndex === index;

              return (
                <button
                  key={`${token}-${index}`}
                  type="button"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onFocus={() => setHoveredIndex(index)}
                  onBlur={() => setHoveredIndex(null)}
                  onClick={() => setHoveredIndex(index)}
                  className={[
                    "rounded-2xl border px-3 py-2 text-center transition-colors",
                    active
                      ? "border-[#b5651d] bg-[#fff7ef] text-[#b5651d]"
                      : "border-transparent bg-transparent text-slate-500 hover:border-slate-200 hover:bg-white/70",
                  ].join(" ")}
                >
                  <div className="font-semibold">{token}</div>
                  <div className="mt-1 text-xs">{Math.round((fractions[index] ?? 0) * 100)}%</div>
                </button>
              );
            })}
          </div>

          <div className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
            Hover or tap tokens to inspect how this head distributes attention.
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft">
        <h3 className="font-display text-2xl font-semibold text-ink">What you're seeing</h3>
        <div className="mt-4 space-y-4 text-base leading-7 text-slate-600">
          <p>
            <span className="mr-2 inline-block h-3 w-3 rounded-sm bg-[#327f80]" />
            <span className="font-semibold text-slate-800">The blank position is the query.</span> It compares itself to every visible token simultaneously instead of reading only one token at a time.
          </p>
          <p>
            <span className="mr-2 inline-block h-3 w-3 rounded-sm bg-[#b5651d]" />
            <span className="font-semibold text-slate-800">Arc thickness shows attention weight.</span> After softmax, these weights add up to 100% for the active head.
          </p>
          <p>
            <span className="mr-2 inline-block h-3 w-3 rounded-sm bg-[#4f46e5]" />
            <span className="font-semibold text-slate-800">The highlighted token is one value source.</span> A higher percentage means its value vector contributes more to the final context vector.
          </p>
          <p>
            <span className="font-semibold text-slate-800">Causal masking still applies.</span> The future tokens are absent here because the blank query is not allowed to attend to them.
          </p>
        </div>

        <div className={`mt-5 rounded-[22px] border bg-gradient-to-br ${theme.panel} ${theme.border} p-4`}>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Current head insight</p>
          <p className="mt-2 text-base leading-7 text-slate-700">
            <span className="font-semibold text-slate-900">{activeHead.label}</span> attends most strongly to{" "}
            <span className="font-semibold text-[#b5651d]">"{visibleTokens[highlightedIndex]}"</span> at{" "}
            <span className="font-semibold text-slate-900">{Math.round((fractions[highlightedIndex] ?? 0) * 100)}%</span>.
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{activeHead.hint}</p>
        </div>
      </div>
    </div>
  );
}
