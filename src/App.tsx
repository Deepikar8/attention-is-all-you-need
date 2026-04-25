import { useEffect, useMemo, useState } from "react";
import { CandidateOptions } from "./components/CandidateOptions";
import { ExplanationCard } from "./components/ExplanationCard";
import { IntroScreen } from "./components/IntroScreen";
import { SentenceBoard } from "./components/SentenceBoard";
import { levels } from "./data/levels";
import {
  computeLiveProbabilities,
  createEmptyAllocations,
  scoreLevel,
} from "./lib/scoring";
import { AllocationMap, LevelResult } from "./types/game";

const level = levels[0];
const candidateShortcutKeys = ["1", "2", "3", "4", "5"];

function App() {
  const [screen, setScreen] = useState<"intro" | "play">("intro");
  const [focusedTokenIndex, setFocusedTokenIndex] = useState<number | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<LevelResult | null>(null);

  // Clicking a word gives it full attention; all other tokens get zero.
  const allocations: AllocationMap = useMemo(() => {
    const empty = createEmptyAllocations(level);
    if (focusedTokenIndex === null) return empty;
    const headId = level.heads[0]?.id;
    if (!headId) return empty;
    const weights = new Array(level.missingIndex).fill(0);
    weights[focusedTokenIndex] = level.heads[0].budget;
    return { ...empty, [headId]: weights };
  }, [focusedTokenIndex]);

  const liveProbabilities = computeLiveProbabilities(level, allocations);

  const resetPlay = () => {
    setFocusedTokenIndex(null);
    setSelectedCandidate(null);
    setCurrentResult(null);
  };

  const handleReveal = () => {
    if (!selectedCandidate) return;
    setCurrentResult(scoreLevel(level, allocations, selectedCandidate));
  };

  useEffect(() => {
    if (screen !== "play") return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable) return;
      if (currentResult) return;

      const candidateIndex = candidateShortcutKeys.indexOf(event.key);
      if (candidateIndex >= 0 && level.candidates[candidateIndex]) {
        event.preventDefault();
        setSelectedCandidate(level.candidates[candidateIndex]);
        return;
      }

      if (event.key === "Enter" && selectedCandidate) {
        event.preventDefault();
        handleReveal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentResult, screen, selectedCandidate]);

  if (screen === "intro") {
    return <IntroScreen onStart={() => { resetPlay(); setScreen("play"); }} />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-120px] top-[-80px] h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute right-[-80px] top-1/3 h-80 w-80 rounded-full bg-violet-200/30 blur-3xl" />
        <div className="absolute bottom-[-80px] left-1/4 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <header className="glass-card mb-6 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">How LLMs work</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
            Attention is All You Need
          </h1>
          <p className="mt-2 text-slate-600">
            Click a word — watch the model's prediction change in real time.
          </p>
        </header>

        <div className="space-y-4">
          <SentenceBoard
            level={level}
            focusedTokenIndex={focusedTokenIndex}
            onTokenClick={currentResult ? () => {} : setFocusedTokenIndex}
            revealed={Boolean(currentResult)}
          />

          <CandidateOptions
            level={level}
            selectedCandidate={selectedCandidate}
            result={currentResult}
            liveProbabilities={liveProbabilities}
            onSelect={setSelectedCandidate}
            onReveal={handleReveal}
          />

          {currentResult && (
            <ExplanationCard
              level={level}
              result={currentResult}
              selectedCandidate={selectedCandidate}
              onRestart={resetPlay}
            />
          )}
        </div>
      </div>
    </main>
  );
}

export default App;
