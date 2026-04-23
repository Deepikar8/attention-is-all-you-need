import { useState } from "react";

type CardProps = {
  title: string;
  tag: string;
  children: React.ReactNode;
};

function ConceptCard({ title, tag, children }: CardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left hover:bg-slate-50"
      >
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-violet-700">
            {tag}
          </span>
          <p className="font-display text-lg font-semibold text-ink">{title}</p>
        </div>
        <span className="text-slate-400">{open ? "▲" : "▼"}</span>
      </button>

      {open && <div className="border-t border-slate-100 p-5">{children}</div>}
    </div>
  );
}

// ── Masking ────────────────────────────────────────────────────────────────────

const visibleTokens = ["The", "trophy", "didn't", "fit", "in", "the", "suitcase", "because", "it", "was", "too"];
const hiddenTokens = ["."];

function MaskingExplainer() {
  return (
    <div className="space-y-5">
      <div className="rounded-[20px] bg-slate-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 mb-3">
          What the model sees when predicting position 11
        </p>
        <div className="flex flex-wrap gap-2 items-center">
          {visibleTokens.map((t, i) => (
            <span key={i} className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700">
              {t}
            </span>
          ))}
          <span className="rounded-xl border-2 border-dashed border-aurora-400 bg-aurora-50 px-3 py-1.5 text-sm font-bold text-aurora-700">
            ?
          </span>
          {hiddenTokens.map((t, i) => (
            <span key={i} className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-400 line-through">
              {t}
            </span>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Tokens to the left → visible. Prediction slot → the model's task. Tokens to the right → hidden.
        </p>
      </div>

      <div className="space-y-3 text-sm leading-7 text-slate-700">
        <p>
          During training, masking was applied to every position in every sentence — the model had to predict each word using only the tokens before it. Across trillions of words, this forced it to learn how language actually works, not just memorize sequences.
        </p>
        <p>
          During inference (when you use ChatGPT), the same rule applies: the model generates one token at a time, left to right, and each new token immediately becomes part of the visible context for the next prediction.
        </p>
      </div>

      <div className="rounded-[20px] bg-amber-50 border border-amber-100 p-4">
        <p className="text-sm font-semibold text-amber-800">Why this matters for PMs</p>
        <p className="mt-2 text-sm leading-6 text-amber-700">
          Everything in a prompt that comes <em>before</em> the question shapes the prediction. Instructions, examples, and context need to appear first — the model cannot "look back" at something you add after the fact.
        </p>
      </div>
    </div>
  );
}

// ── Embeddings ─────────────────────────────────────────────────────────────────

const similarities = [
  { a: "trophy", b: "big", score: 0.82, note: "trophies are associated with being large" },
  { a: "trophy", b: "small", score: 0.18, note: "low co-occurrence in training text" },
  { a: "suitcase", b: "small", score: 0.79, note: "suitcases are associated with compactness, fitting" },
  { a: "suitcase", b: "big", score: 0.22, note: "low co-occurrence in training text" },
  { a: "trophy", b: "suitcase", score: 0.31, note: "different semantic clusters" },
];

function EmbeddingsExplainer() {
  return (
    <div className="space-y-5">
      <p className="text-sm leading-7 text-slate-700">
        Every token is converted into a list of numbers — called an <strong>embedding</strong> — that encodes its meaning. Words that appear in similar contexts end up with similar numbers. The model learned these by reading trillions of words and noticing which words cluster together.
      </p>

      <div className="rounded-[20px] bg-slate-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 mb-4">
          Conceptual similarity between words in this sentence
        </p>
        <div className="space-y-3">
          {similarities.map(({ a, b, score, note }) => (
            <div key={`${a}-${b}`}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-semibold text-slate-700">
                  <span className="text-aurora-600">{a}</span> ↔ <span className="text-aurora-600">{b}</span>
                </span>
                <span className="text-slate-500">{Math.round(score * 100)}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-aurora-400 to-violet-400"
                  style={{ width: `${score * 100}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">{note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[20px] bg-amber-50 border border-amber-100 p-4">
        <p className="text-sm font-semibold text-amber-800">Why this matters for PMs</p>
        <p className="mt-2 text-sm leading-6 text-amber-700">
          Embeddings are why LLMs understand domain jargon without being told definitions. "ARR", "churn", and "GTM" end up close in the embedding space of a model trained on business text. It's also why fine-tuning works — you're adjusting these meaning representations to better fit your domain.
        </p>
      </div>
    </div>
  );
}

// ── Multi-head attention ───────────────────────────────────────────────────────

type HeadKey = "meaning" | "grammar" | "reference";

const umbrellaTokens = ["Because", "it", "was", "raining", ",", "Leo", "opened", "his"];

const headData: Record<HeadKey, { label: string; intensities: number[]; what: string }> = {
  meaning: {
    label: "Meaning head",
    intensities: [0.1, 0.0, 0.1, 1.0, 0.0, 0.0, 0.3, 0.2],
    what: "Looks for semantic clues — what situation is described, and what objects are associated with it. 'Raining' strongly implies weather gear.",
  },
  grammar: {
    label: "Grammar head",
    intensities: [0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.9, 1.0],
    what: "Looks at phrase structure — 'opened his ___' expects a noun that Leo can possess and open. Rules out verbs and adjectives without reasoning explicitly.",
  },
  reference: {
    label: "Reference head",
    intensities: [0.0, 0.2, 0.0, 0.0, 0.0, 1.0, 0.3, 0.6],
    what: "Tracks who 'his' refers to. 'Leo' is the clear antecedent, so the object must belong to Leo. Connects pronoun to person.",
  },
};

const combinedPredictions = [
  { token: "umbrella", probability: 82 },
  { token: "sandwich", probability: 8 },
  { token: "crayons", probability: 6 },
  { token: "window", probability: 4 },
];

function MultiHeadExplainer() {
  const [activeHead, setActiveHead] = useState<HeadKey | "combined">("meaning");

  return (
    <div className="space-y-5">
      <p className="text-sm leading-7 text-slate-700">
        A transformer computes multiple attention patterns in parallel — each one called a "head". Every head learns to focus on something different. For complex sentences, no single head has enough information; together they converge on the right answer.
      </p>

      <div className="rounded-[20px] bg-slate-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 mb-1">
          Sentence: <em>Because it was raining, Leo opened his [umbrella]</em>
        </p>
        <p className="text-xs text-slate-400 mb-4">Hover a head tab to see what it focuses on</p>

        <div className="flex flex-wrap gap-2 mb-5">
          {(["meaning", "grammar", "reference"] as HeadKey[]).map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setActiveHead(h)}
              className={[
                "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                activeHead === h
                  ? "bg-ink text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300",
              ].join(" ")}
            >
              {headData[h].label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setActiveHead("combined")}
            className={[
              "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
              activeHead === "combined"
                ? "bg-aurora-500 text-white"
                : "border border-aurora-200 bg-aurora-50 text-aurora-700 hover:bg-aurora-100",
            ].join(" ")}
          >
            All three combined →
          </button>
        </div>

        {activeHead !== "combined" ? (
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {umbrellaTokens.map((token, i) => {
                const intensity = headData[activeHead].intensities[i] ?? 0;
                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <span
                      className="rounded-xl border px-3 py-1.5 text-sm font-semibold transition-all"
                      style={{
                        borderColor: `rgba(79,109,245,${0.15 + intensity * 0.7})`,
                        background: `rgba(79,109,245,${0.05 + intensity * 0.18})`,
                        color: intensity > 0.4 ? "#2d3a8c" : "#64748b",
                        fontWeight: intensity > 0.6 ? 700 : 500,
                      }}
                    >
                      {token}
                    </span>
                    {intensity > 0.3 && (
                      <span className="text-xs text-aurora-600 font-semibold">
                        {Math.round(intensity * 100)}%
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-sm leading-6 text-slate-600 italic">{headData[activeHead].what}</p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-slate-600 mb-4">
              All three heads run simultaneously. Their attention patterns are combined into a single prediction.
            </p>
            <div className="space-y-2.5">
              {combinedPredictions.map(({ token, probability }) => (
                <div key={token}>
                  <div className="flex justify-between text-sm font-semibold text-slate-700 mb-1">
                    <span>{token}</span>
                    <span>{probability}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="probability-bar h-full rounded-full"
                      style={{ width: `${probability}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Umbrella wins clearly because all three heads independently point toward it — through different reasoning paths.
            </p>
          </div>
        )}
      </div>

      <div className="rounded-[20px] bg-amber-50 border border-amber-100 p-4">
        <p className="text-sm font-semibold text-amber-800">Why this matters for PMs</p>
        <p className="mt-2 text-sm leading-6 text-amber-700">
          Real LLMs use dozens to hundreds of heads simultaneously. GPT-3 uses 96. Each learns to track different relationships — syntax, coreference, topic, sentiment — all at once. When a model hallucinates, it often means no head had a strong enough signal: the context didn't provide enough of the right kind of clue.
        </p>
      </div>
    </div>
  );
}

// ── Export ─────────────────────────────────────────────────────────────────────

export function ConceptExplainers() {
  return (
    <div className="space-y-3">
      <div className="mb-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Go deeper</p>
        <h3 className="mt-2 font-display text-2xl font-semibold text-ink">Three more concepts from the paper</h3>
        <p className="mt-2 text-sm text-slate-500">Click any card to expand it.</p>
      </div>
      <ConceptCard title="Masking" tag="Concept 1">
        <MaskingExplainer />
      </ConceptCard>
      <ConceptCard title="Embeddings" tag="Concept 2">
        <EmbeddingsExplainer />
      </ConceptCard>
      <ConceptCard title="Multi-head attention" tag="Concept 3">
        <MultiHeadExplainer />
      </ConceptCard>
    </div>
  );
}
