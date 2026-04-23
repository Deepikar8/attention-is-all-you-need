import { describe, expect, it } from "vitest";
import { levels } from "../data/levels";
import {
  buildAggregateAttention,
  createEmptyAllocations,
  getRemainingBudget,
  normalizeToBudget,
  scoreLevel,
  weightsToFractions,
} from "./scoring";

const level = levels[0]; // ambiguous-it — the only level

describe("scoring helpers", () => {
  it("creates zeroed allocations for each head and visible token", () => {
    const allocations = createEmptyAllocations(level);
    expect(Object.keys(allocations)).toEqual(level.heads.map((h) => h.id));
    expect(allocations["meaning-head"]).toEqual(new Array(level.missingIndex).fill(0));
  });

  it("reports remaining budget after spending points", () => {
    const head = level.heads[0];
    expect(getRemainingBudget(head, [1, 4, 0, 0])).toBe(5);
  });

  it("normalizes model-like weights to the full head budget", () => {
    expect(normalizeToBudget([1, 4, 4, 1], 10)).toEqual([1, 4, 4, 1]);
    expect(normalizeToBudget([0, 2, 0, 2], 8)).toEqual([0, 4, 0, 4]);
  });

  it("keeps partial user spending partial in attention fractions", () => {
    expect(weightsToFractions([1, 0, 0, 0], 8)).toEqual([0.125, 0, 0, 0]);
    expect(weightsToFractions([8, 0, 0, 0], 8)).toEqual([1, 0, 0, 0]);
  });

  it("builds aggregate attention from assigned points only", () => {
    const allocations = createEmptyAllocations(level);
    // Stack on trophy (1) and suitcase (6)
    allocations["meaning-head"][1] = 6;
    allocations["meaning-head"][6] = 4;
    const agg = buildAggregateAttention(level, allocations);
    expect(agg[1]).toBeCloseTo(0.6, 5);
    expect(agg[6]).toBeCloseTo(0.4, 5);
    expect(agg[0]).toBe(0);
  });

  it("predicts 'big' when attention is stacked on 'trophy'", () => {
    const allocations = createEmptyAllocations(level);
    allocations["meaning-head"][1] = 10; // trophy

    const result = scoreLevel(level, allocations, "big");

    expect(result.isCorrect).toBe(true);
    expect(result.predictionScore).toBe(100);
    expect(result.rankedCandidates[0]).toEqual({ token: "big", probability: 73 });
    expect(result.headBreakdown[0]?.alignmentLabel).toBeDefined();
  });

  it("flips prediction to 'small' when attention moves to 'suitcase'", () => {
    const allocations = createEmptyAllocations(level);
    allocations["meaning-head"][6] = 10; // suitcase

    const result = scoreLevel(level, allocations, "small");

    expect(result.isCorrect).toBe(true);
    expect(result.rankedCandidates[0].token).toBe("small");
  });

  it("scores an incorrect prediction lower", () => {
    const allocations = createEmptyAllocations(level);
    allocations["meaning-head"][6] = 10; // suitcase → model picks "small"

    const result = scoreLevel(level, allocations, "big"); // user picks "big" anyway

    expect(result.isCorrect).toBe(false);
    expect(result.predictionScore).toBe(20);
    expect(result.turnScore).toBeLessThan(80);
    expect(result.rankedCandidates[0].token).toBe("small");
  });
});
