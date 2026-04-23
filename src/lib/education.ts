import { Level, LevelResult } from "../types/game";
import { normalizeToBudget, weightsToFractions } from "./scoring";

const formatPercent = (value: number) => `${Math.round(value * 100)}%`;

export const getVisibleTokens = (level: Level) => level.fullTokens.slice(0, level.missingIndex);

export const getMaskedTokenCount = (level: Level) => level.fullTokens.length - level.missingIndex - 1;

export const getLevelMathSummary = (level: Level) => {
  const visibleTokens = getVisibleTokens(level);
  const maskedCount = getMaskedTokenCount(level);
  const attentionCells = level.heads.length * visibleTokens.length;
  const pairwiseComparisons = visibleTokens.length * visibleTokens.length * Math.max(level.heads.length, 1);

  const headBreakdowns = level.heads.map((head) => {
    const normalized = normalizeToBudget(head.idealWeights, head.budget);
    const fractions = weightsToFractions(normalized, head.budget);
    const strongestIndex = head.idealWeights.indexOf(Math.max(...head.idealWeights));

    return {
      headId: head.id,
      label: head.label,
      shortLabel: head.shortLabel,
      budget: head.budget,
      strongestToken: visibleTokens[strongestIndex] ?? "token",
      strongestWeight: fractions[strongestIndex] ?? 0,
      normalizedWeights: fractions,
    };
  });

  return {
    visibleTokenCount: visibleTokens.length,
    maskedCount,
    headCount: level.heads.length,
    candidateCount: level.candidates.length,
    attentionCells,
    pairwiseComparisons,
    visibleTokens,
    headBreakdowns,
  };
};

export const getAttentionFormulaLines = () => [
  "score(i) = query(blank) · key(i) / sqrt(d)",
  "masked score(i) = -∞ for future tokens",
  "attention(i) = softmax(scores)",
  "context = Σ attention(i) × value(i)",
  "next-token probabilities = softmax(logits)",
];

export const getComplexityLabel = (level: Level) => {
  const summary = getLevelMathSummary(level);
  return `For this level, ${summary.visibleTokenCount} visible tokens and ${summary.headCount} head${summary.headCount > 1 ? "s" : ""} create about ${summary.pairwiseComparisons} token-to-token attention comparisons in a full self-attention view.`;
};

export const getResultMathSummary = (level: Level, result: LevelResult) => {
  const visibleTokens = getVisibleTokens(level);
  const topCandidate = result.rankedCandidates[0];
  const candidateGap =
    result.rankedCandidates.length > 1
      ? topCandidate.probability - result.rankedCandidates[1].probability
      : topCandidate.probability;

  const headComparisons = result.headBreakdown.map((head) => {
    const strongestModelIndex = head.modelWeights.indexOf(Math.max(...head.modelWeights));
    const userMax = Math.max(...head.userWeights);
    const strongestUserIndex = userMax > 0 ? head.userWeights.indexOf(userMax) : -1;
    const headBudget = level.heads.find((item) => item.id === head.headId)?.budget ?? 1;

    return {
      headId: head.headId,
      modelFocusToken: visibleTokens[strongestModelIndex] ?? "token",
      userFocusToken: strongestUserIndex >= 0 ? visibleTokens[strongestUserIndex] ?? "token" : "none yet",
      modelFocusStrength: formatPercent(weightsToFractions(head.modelWeights, headBudget)[strongestModelIndex] ?? 0),
      userFocusStrength: strongestUserIndex >= 0 ? formatPercent(weightsToFractions(head.userWeights, headBudget)[strongestUserIndex] ?? 0) : "0%",
      alignmentLabel: head.alignmentLabel,
      score: head.score,
    };
  });

  return {
    topCandidate,
    candidateGap,
    headComparisons,
  };
};
