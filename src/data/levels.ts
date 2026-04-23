import { Level } from "../types/game";

export const levels: Level[] = [
  {
    id: "ambiguous-it",
    title: "The attention mechanism",
    subtitle: "Move weight between earlier words and watch the prediction flip in real time.",
    prompt: "What does 'it' refer to — the trophy or the suitcase? Your attention decides the next word.",
    fullTokens: [
      "The",
      "trophy",
      "didn't",
      "fit",
      "in",
      "the",
      "suitcase",
      "because",
      "it",
      "was",
      "too",
      ".",
    ],
    missingIndex: 11,
    candidates: ["big", "small", "heavy", "red"],
    correctToken: "big",
    candidateProbabilities: {
      big: 28,
      small: 28,
      heavy: 26,
      red: 18,
    },
    tokenAffinities: {
      big: [0, 4, 0, 0, 0, 0, -2, 0, 0, 0, 0],
      small: [0, -2, 0, 0, 0, 0, 4, 0, 0, 0, 0],
      heavy: [0, 0.5, 0, 0, 0, 0, 0.3, 0, 0, 0, 0],
      red: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    concepts: ["word-scouts", "flashlights", "fountain"],
    heads: [
      {
        id: "meaning-head",
        label: "Attention",
        shortLabel: "Attention",
        hint: "Stack weight on whichever noun you think 'it' refers to. The prediction bars update live.",
        budget: 10,
        color: "sun",
        idealWeights: [0, 4, 0, 0, 0, 0, 0, 0, 3, 0, 0],
      },
    ],
    explanation: {
      headline: "Attention picks the antecedent — and the antecedent picks the word.",
      plainEnglish:
        "Both 'trophy' and 'suitcase' are grammatically valid referents for 'it'. The model has to choose where to look. Focus attention on 'trophy' and the prediction becomes 'big'. Focus on 'suitcase' and it flips to 'small'. Same sentence, different attention weights, different next token.",
      memoryMap: "",
      lineup: "",
      curtain: "",
      fountain: "",
    },
    tutorial: {
      title: "You are the attention mechanism",
      intro:
        "The sentence has a classic ambiguity: 'The trophy didn't fit in the suitcase because it was too ___'. To resolve 'it', a transformer decides which earlier words to focus on. In this exercise, you make that choice. The prediction bars update live as you move weight around — try it before committing.",
      steps: [
        {
          title: "1. No weight allocated — prediction is flat",
          body: "With nothing allocated, the model has no signal. The four candidates are roughly equally likely. This is what a transformer looks like before attention does its job.",
        },
        {
          title: "2. Stack weight on 'trophy'",
          body: "The context is now dominated by 'trophy'. Trophies are large and rigid, so the prediction shifts toward 'big'. You just ran one forward pass of attention.",
        },
        {
          title: "3. Move weight to 'suitcase'",
          body: "Same sentence, different attention, different answer. Attention is not decoration — it is the computation that determines what comes next.",
        },
      ],
      footer: "Keyboard: arrow keys move focus · + or Arrow Up adds weight · - or Arrow Down removes it · 1–4 picks a candidate · Enter reveals.",
    },
  },
];
