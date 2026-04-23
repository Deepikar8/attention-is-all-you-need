import { isPunctuation } from "../lib/text";

type TokenChipProps = {
  token: string;
  highlightStrength?: number;
  isActive?: boolean;
};

export function TokenChip({ token, highlightStrength = 0, isActive = false }: TokenChipProps) {
  const punctuation = isPunctuation(token);
  const glowOpacity = Math.min(0.2 + highlightStrength * 0.12, 0.9);

  return (
    <div
      className={[
        "relative inline-flex items-center justify-center rounded-2xl border px-3 py-2 text-sm font-semibold shadow-sm",
        punctuation
          ? "min-w-10 border-slate-200 bg-white text-slate-500"
          : "min-w-16 border-slate-200 bg-white text-slate-700",
        isActive ? "ring-2 ring-aurora-200" : "",
      ].join(" ")}
      style={{
        boxShadow:
          highlightStrength > 0 ? `0 0 0 1px rgba(79, 109, 245, ${glowOpacity}), 0 12px 24px rgba(79, 109, 245, ${glowOpacity * 0.55})` : undefined,
      }}
    >
      {token}
    </div>
  );
}
