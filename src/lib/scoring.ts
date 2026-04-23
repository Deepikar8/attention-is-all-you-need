import {
  AllocationMap,
  AttentionHead,
  HeadScoreBreakdown,
  Level,
  LevelResult,
  RankedCandidate,
} from "../types/game";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

export const normalizeToBudget = (weights: number[], budget: number) => {
  const total = sum(weights);

  if (total === 0) {
    return weights.map(() => 0);
  }

  return weights.map((weight) => (weight / total) * budget);
};

export const weightsToFractions = (weights: number[], budget: number) => {
  if (budget <= 0) {
    return weights.map(() => 0);
  }

  return weights.map((weight) => clamp(weight / budget, 0, 1));
};

const getTopIndexes = (weights: number[], count: number) =>
  weights
    .map((weight, index) => ({ weight, index }))
    .sort((a, b) => b.weight - a.weight)
    .filter((item) => item.weight > 0)
    .slice(0, count)
    .map((item) => item.index);

const getAlignmentLabel = (score: number) => {
  if (score >= 85) {
    return "Closely matched";
  }

  if (score >= 65) {
    return "Partly matched";
  }

  return "Different path";
};

const scoreHead = (head: AttentionHead, userWeights: number[]): HeadScoreBreakdown => {
  const expected = normalizeToBudget(head.idealWeights, head.budget);
  const distance = expected.reduce(
    (total, expectedWeight, index) => total + Math.abs(expectedWeight - (userWeights[index] ?? 0)),
    0,
  );
  const score = clamp(Math.round(100 * (1 - distance / (head.budget * 2))), 0, 100);
  const topTokenIndexes = getTopIndexes(head.idealWeights, 3);
  const missedTokenIndexes = topTokenIndexes.filter(
    (index) => (userWeights[index] ?? 0) < expected[index] * 0.45,
  );

  return {
    headId: head.id,
    score,
    topTokenIndexes,
    missedTokenIndexes,
    userWeights,
    modelWeights: expected,
    alignmentLabel: getAlignmentLabel(score),
  };
};

const buildFeedback = (level: Level, attentionScore: number, isCorrect: boolean, breakdown: HeadScoreBreakdown[]) => {
  const visibleTokens = level.fullTokens.slice(0, level.missingIndex);
  const strongestClue = breakdown[0]?.topTokenIndexes[0];
  const strongestToken = strongestClue !== undefined ? visibleTokens[strongestClue] : "the best clue";
  const missedToken =
    breakdown.find((head) => head.missedTokenIndexes.length > 0)?.missedTokenIndexes[0] ?? null;
  const missedWord = missedToken !== null ? visibleTokens[missedToken] : null;

  if (isCorrect && attentionScore >= 85) {
    return `Excellent flashlight work. You focused on the strongest clue words, so the next-token guess lined up beautifully.`;
  }

  if (isCorrect) {
    return `Nice prediction. You found the answer, and even more focus on '${strongestToken}' would make the transformer-style clue hunt sharper.`;
  }

  if (missedWord) {
    return `Your guess missed the top probability splash. Try aiming more attention at '${missedWord}' next time, because it carries a key clue.`;
  }

  return `The answer comes from the strongest earlier clues. In this level, '${strongestToken}' mattered more than the weaker distractor words.`;
};

export const createEmptyAllocations = (level: Level): AllocationMap =>
  Object.fromEntries(level.heads.map((head) => [head.id, new Array(level.missingIndex).fill(0)]));

export const getRemainingBudget = (head: AttentionHead, allocation: number[]) =>
  Math.max(0, head.budget - sum(allocation));

export const buildAggregateAttention = (level: Level, allocations: AllocationMap) => {
  const totalAssigned = sum(
    level.heads.map((head) => sum(allocations[head.id] ?? [])),
  );

  return new Array(level.missingIndex).fill(0).map((_, tokenIndex) => {
    const totalOnToken = level.heads.reduce(
      (total, head) => total + (allocations[head.id]?.[tokenIndex] ?? 0),
      0,
    );

    return totalAssigned === 0 ? 0 : totalOnToken / totalAssigned;
  });
};

export const computeLiveProbabilities = (
  level: Level,
  allocations: AllocationMap,
): RankedCandidate[] => {
  if (!level.tokenAffinities) {
    return Object.entries(level.candidateProbabilities)
      .map(([token, probability]) => ({ token, probability }))
      .sort((a, b) => b.probability - a.probability);
  }

  const aggregate = new Array(level.missingIndex).fill(0);
  for (const head of level.heads) {
    const alloc = allocations[head.id] ?? [];
    for (let i = 0; i < level.missingIndex; i += 1) {
      aggregate[i] += alloc[i] ?? 0;
    }
  }

  const smoothed = aggregate.map((v) => v + 1);
  const total = sum(smoothed);
  const weights = smoothed.map((v) => v / total);

  const logits = level.candidates.map((token) => {
    const affinity =
      level.tokenAffinities?.[token] ?? new Array(level.missingIndex).fill(0);
    const logit = affinity.reduce((acc, a, i) => acc + a * (weights[i] ?? 0), 0);
    return { token, logit };
  });

  const maxLogit = Math.max(...logits.map((item) => item.logit));
  const exps = logits.map((item) => Math.exp(item.logit - maxLogit));
  const sumExp = exps.reduce((acc, v) => acc + v, 0);

  const raw = logits.map((item, i) => ({
    token: item.token,
    probability: (exps[i] / sumExp) * 100,
  }));

  const rounded = raw.map((item) => ({
    token: item.token,
    probability: Math.round(item.probability),
  }));
  const drift = 100 - rounded.reduce((acc, c) => acc + c.probability, 0);
  if (drift !== 0 && rounded.length > 0) {
    let bestIndex = 0;
    for (let i = 1; i < raw.length; i += 1) {
      if (raw[i].probability > raw[bestIndex].probability) {
        bestIndex = i;
      }
    }
    rounded[bestIndex].probability += drift;
  }

  return rounded.sort((a, b) => b.probability - a.probability);
};

export const scoreLevel = (
  level: Level,
  allocations: AllocationMap,
  selectedCandidate: string,
): LevelResult => {
  const headBreakdown = level.heads.map((head) => scoreHead(head, allocations[head.id] ?? []));
  const attentionScore = Math.round(
    headBreakdown.reduce((total, head) => total + head.score, 0) / headBreakdown.length,
  );
  const rankedCandidates = computeLiveProbabilities(level, allocations);
  const topCandidate = rankedCandidates[0]?.token ?? level.correctToken;
  const isCorrect = selectedCandidate === topCandidate;
  const predictionScore = isCorrect ? 100 : 20;
  const turnScore = Math.round(attentionScore * 0.7 + predictionScore * 0.3);

  return {
    attentionScore,
    predictionScore,
    turnScore,
    isCorrect,
    rankedCandidates,
    headBreakdown,
    feedback: buildFeedback(level, attentionScore, isCorrect, headBreakdown),
  };
};
