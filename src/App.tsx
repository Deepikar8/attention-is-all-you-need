import { useEffect, useState } from "react";
import { AttentionAllocator } from "./components/AttentionAllocator";
import { CandidateOptions } from "./components/CandidateOptions";
import { ExplanationCard } from "./components/ExplanationCard";
import { IntroScreen } from "./components/IntroScreen";
import { SentenceBoard } from "./components/SentenceBoard";
import { TutorialOverlay } from "./components/TutorialOverlay";
import { levels } from "./data/levels";
import {
  buildAggregateAttention,
  computeLiveProbabilities,
  createEmptyAllocations,
  getRemainingBudget,
  scoreLevel,
} from "./lib/scoring";
import { AllocationMap, LevelResult } from "./types/game";

const level = levels[0];
const candidateShortcutKeys = ["1", "2", "3", "4", "5"];

function App() {
  const [screen, setScreen] = useState<"intro" | "play">("intro");
  const [allocations, setAllocations] = useState<AllocationMap>(() => createEmptyAllocations(level));
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [currentResult, setCurrentResult] = useState<LevelResult | null>(null);
  const [activeHeadId, setActiveHeadId] = useState(level.heads[0]?.id ?? "");
  const [activeTokenIndex, setActiveTokenIndex] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);

  const heatmapIntensities = buildAggregateAttention(level, allocations);
  const liveProbabilities = computeLiveProbabilities(level, allocations);

  const resetPlay = (withTutorial: boolean) => {
    setAllocations(createEmptyAllocations(level));
    setSelectedCandidate(null);
    setCurrentResult(null);
    setActiveHeadId(level.heads[0]?.id ?? "");
    setActiveTokenIndex(0);
    setShowTutorial(withTutorial);
  };

  const handleStart = () => {
    resetPlay(Boolean(level.tutorial));
    setScreen("play");
  };

  const handleRestart = () => {
    resetPlay(false);
  };

  const handleAdjustAllocation = (headId: string, tokenIndex: number, delta: number) => {
    setAllocations((previous) => {
      const next = { ...previous };
      const currentHead = [...(next[headId] ?? [])];
      const headConfig = level.heads.find((h) => h.id === headId);
      if (!headConfig) return previous;

      const currentValue = currentHead[tokenIndex] ?? 0;
      const remaining = getRemainingBudget(headConfig, currentHead);

      if (delta > 0 && remaining <= 0) return previous;
      if (delta < 0 && currentValue <= 0) return previous;

      currentHead[tokenIndex] = Math.max(0, currentValue + delta);
      next[headId] = currentHead;
      return next;
    });
  };

  const handleReveal = () => {
    if (!selectedCandidate || showTutorial) return;
    setCurrentResult(scoreLevel(level, allocations, selectedCandidate));
  };

  useEffect(() => {
    if (screen !== "play") return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable) return;

      if (showTutorial) {
        if (event.key === "Enter" || event.key === "Escape") {
          event.preventDefault();
          setShowTutorial(false);
        }
        return;
      }

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
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveTokenIndex((p) => Math.max(0, p - 1));
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveTokenIndex((p) => Math.min(level.missingIndex - 1, p + 1));
        return;
      }

      if (event.key === "ArrowUp" || event.key === "+") {
        event.preventDefault();
        handleAdjustAllocation(activeHeadId, activeTokenIndex, 1);
        return;
      }

      if (event.key === "ArrowDown" || event.key === "-") {
        event.preventDefault();
        handleAdjustAllocation(activeHeadId, activeTokenIndex, -1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeHeadId, activeTokenIndex, currentResult, screen, selectedCandidate, showTutorial]);

  if (screen === "intro") {
    return <IntroScreen onStart={handleStart} />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-120px] top-[-80px] h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute right-[-80px] top-1/3 h-80 w-80 rounded-full bg-violet-200/30 blur-3xl" />
        <div className="absolute bottom-[-80px] left-1/4 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />
      </div>

      {showTutorial && <TutorialOverlay level={level} onClose={() => setShowTutorial(false)} />}

      <div className="relative mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <header className="glass-card mb-6 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">How LLMs work</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
            Attention is All You Need
          </h1>
          <p className="mt-2 text-slate-600">
            Move attention between words and watch the model's prediction change in real time.
          </p>
        </header>

        <div className="space-y-4">
          <SentenceBoard
            level={level}
            heatmapIntensities={heatmapIntensities}
            activeTokenIndex={activeTokenIndex}
          />

          {!currentResult && (
            <AttentionAllocator
              level={level}
              allocations={allocations}
              disabled={false}
              activeHeadId={activeHeadId}
              activeTokenIndex={activeTokenIndex}
              onAdjust={handleAdjustAllocation}
              onFocusChange={(headId, tokenIndex) => {
                setActiveHeadId(headId);
                setActiveTokenIndex(tokenIndex);
              }}
            />
          )}

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
              onRestart={handleRestart}
            />
          )}
        </div>
      </div>
    </main>
  );
}

export default App;
