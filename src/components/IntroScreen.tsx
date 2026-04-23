type IntroScreenProps = {
  onStart: () => void;
};

const steps = [
  {
    number: "1",
    title: "Read the sentence",
    body: "A sentence appears with one word missing. The model has to predict it.",
  },
  {
    number: "2",
    title: "Move attention between words",
    body: "Shift focus onto different earlier words. The prediction bars update live as you do.",
  },
  {
    number: "3",
    title: "Watch the prediction flip",
    body: "Same sentence, different attention — different answer. That's the core mechanism.",
  },
];

const concepts = [
  {
    term: "Tokens",
    plain: "Words (and punctuation) broken into small pieces the model processes one at a time.",
  },
  {
    term: "Attention",
    plain: "For each word it's predicting, the model assigns a weight to every earlier word. High weight = this word matters for the prediction.",
  },
  {
    term: "Next-token prediction",
    plain: "LLMs don't write sentences — they pick the most probable next word, over and over. Attention decides which word wins.",
  },
];

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <section className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="glass-card overflow-hidden p-8 sm:p-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700">
            1 interactive · 5 minutes · no maths required
          </div>

          <h1 className="mt-6 max-w-2xl font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            See how AI decides what word comes next.
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Every LLM — GPT, Gemini, Claude — predicts text one word at a time.
            The mechanism that makes this work is called <strong className="text-slate-800">attention</strong>.
            This game lets you run it yourself.
          </p>

          <div className="mt-10 space-y-4">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">
                  {step.number}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{step.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{step.body}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onStart}
            className="mt-10 inline-flex items-center justify-center rounded-full bg-ink px-7 py-3.5 font-semibold text-white shadow-glow hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Start learning
          </button>
        </div>

        <div className="glass-card p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">What you'll understand</p>
          <div className="mt-5 space-y-5">
            {concepts.map((concept) => (
              <div key={concept.term} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft">
                <p className="font-display text-lg font-semibold text-ink">{concept.term}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{concept.plain}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-3xl bg-violet-50 p-5">
            <p className="text-sm font-semibold text-violet-800">Based on</p>
            <p className="mt-2 text-sm leading-6 text-violet-700">
              "Attention is All You Need" — the 2017 Google paper that introduced transformers and
              became the foundation of every modern LLM.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
