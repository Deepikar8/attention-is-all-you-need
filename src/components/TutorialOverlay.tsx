import { Level } from "../types/game";

type TutorialOverlayProps = {
  level: Level;
  onClose: () => void;
};

export function TutorialOverlay({ level, onClose }: TutorialOverlayProps) {
  if (!level.tutorial) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-30 flex items-start justify-center bg-slate-950/40 px-4 py-8 backdrop-blur-sm sm:px-6">
      <div className="glass-card w-full max-w-2xl animate-rise overflow-hidden p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="rounded-full bg-aurora-100 px-4 py-2 text-sm font-semibold text-aurora-700">
              Before you start
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold text-ink">{level.tutorial.title}</h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">{level.tutorial.intro}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          >
            Skip
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {level.tutorial.steps.map((step) => (
            <div key={step.title} className="rounded-[28px] bg-slate-50 p-5">
              <p className="font-display text-lg font-semibold text-ink">{step.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{step.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-[28px] border border-dashed border-slate-200 bg-white p-5">
          <p className="text-sm leading-7 text-slate-600">{level.tutorial.footer}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 font-semibold text-white shadow-glow hover:-translate-y-0.5 hover:bg-slate-800"
        >
          Try it
        </button>
      </div>
    </div>
  );
}
