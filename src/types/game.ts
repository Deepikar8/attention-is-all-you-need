export type ConceptId =
  | "word-scouts"
  | "memory-maps"
  | "line-up-keeper"
  | "flashlights"
  | "curtains"
  | "fountain"
  | "multi-head";

export type HeadColor = "sun" | "sky" | "mint";

export type AttentionHead = {
  id: string;
  label: string;
  shortLabel: string;
  hint: string;
  budget: number;
  color: HeadColor;
  idealWeights: number[];
};

export type LevelExplanation = {
  headline: string;
  plainEnglish: string;
  memoryMap: string;
  lineup: string;
  curtain: string;
  fountain: string;
};

export type TutorialStep = {
  title: string;
  body: string;
};

export type Level = {
  id: string;
  title: string;
  subtitle: string;
  prompt: string;
  fullTokens: string[];
  missingIndex: number;
  candidates: string[];
  correctToken: string;
  candidateProbabilities: Record<string, number>;
  tokenAffinities?: Record<string, number[]>;
  concepts: ConceptId[];
  heads: AttentionHead[];
  explanation: LevelExplanation;
  tutorial?: {
    title: string;
    intro: string;
    steps: TutorialStep[];
    footer: string;
  };
};

export type AllocationMap = Record<string, number[]>;

export type HeadScoreBreakdown = {
  headId: string;
  score: number;
  topTokenIndexes: number[];
  missedTokenIndexes: number[];
  userWeights: number[];
  modelWeights: number[];
  alignmentLabel: string;
};

export type RankedCandidate = {
  token: string;
  probability: number;
};

export type LevelResult = {
  attentionScore: number;
  predictionScore: number;
  turnScore: number;
  isCorrect: boolean;
  rankedCandidates: RankedCandidate[];
  headBreakdown: HeadScoreBreakdown[];
  feedback: string;
};

export type CompletedLevel = {
  levelId: string;
  levelTitle: string;
  selectedCandidate: string | null;
  result: LevelResult;
};
