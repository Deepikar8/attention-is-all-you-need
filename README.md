# Sentence Land: The Transformer Quest

A single-page educational web game that helps beginners intuitively understand how transformers predict the next token.

Built with React, TypeScript, Tailwind CSS, and local-only frontend logic.

## Core Design Principle

**Attention must cause the prediction.** The player's allocation of attention points directly drives a live softmax computation over candidate tokens. Moving points between words visibly shifts the probability bars in real time. This is the central "aha" — same sentence, different attention, different prediction.

## What Is Implemented

### Core game loop

- Intro screen with concept-friendly onboarding
- 3 playable levels, each introducing one new transformer concept
- Sentence prediction challenge with one missing next token
- Live probability bars that update as the player moves attention — no hardcoded outcomes
- Candidate next-token selection with a post-reveal explanation
- Per-level scoring based on attention alignment and prediction accuracy
- Final completion screen with summary stats

### Live prediction system (`src/lib/scoring.ts`)

Each level can define `tokenAffinities`: a per-candidate, per-token affinity matrix. `computeLiveProbabilities` uses it to run a tiny in-browser softmax:

1. Sum the player's attention allocation across all heads into an aggregate weight vector.
2. Add Laplace smoothing (+1 per token) so zero allocation produces a near-uniform distribution.
3. Dot each candidate's affinity vector with the normalized weight vector to get a logit.
4. Apply softmax over logits → candidate probabilities.

The result updates on every allocation change. `scoreLevel` derives `isCorrect` from the top of this live distribution — if your attention produced the winning prediction, you're correct, regardless of what the hardcoded `correctToken` says.

Levels without `tokenAffinities` fall back to their static `candidateProbabilities`.

### Level design

**Level 1 — The Ambiguous "it"** (`id: ambiguous-it`)
- Sentence: *"The trophy didn't fit in the suitcase because it was too ___."*
- Candidates: big, small, heavy, red
- `tokenAffinities` make attention load-bearing: stacking points on "trophy" (index 1) drives the prediction to "big"; moving them to "suitcase" (index 6) flips it to "small".
- Tutorial walks the player through the flip explicitly before they commit.
- One head (Meaning Head), no scoring pressure on turn 1.

**Level 2 — Breakfast Builder** (`id: breakfast-spread`)
- Sentence: *"Every morning, Maya puts jam on her ___ before school."*
- Candidates: toast, shoes, window, pillow
- Introduces Memory Maps (embeddings) and Line-Up Keeper (positional encoding).
- Uses static `candidateProbabilities` (no affinity matrix); the right answer is unambiguous from context.

**Level 3 — Multi-Head Mission** (`id: rainy-walk`)
- Sentence: *"Because it was raining, Leo opened his ___ before walking to school."*
- Candidates: umbrella, sandwich, crayons, window
- Three simultaneous attention heads: Meaning (rain → umbrella), Grammar (phrase shape after "his"), Reference (tracking who "his" refers to).
- Introduces causal masking and multi-head attention.

### Transformer concepts represented in the UI

- `Word Scouts` = tokenization
- `Memory Maps` = embeddings / semantic similarity
- `Line-Up Keeper` = positional encoding
- `Attention Flashlights` = attention
- `No-Peeking Curtains` = masking
- `Probability Fountain` = next-token probabilities
- `Multi-Head Mode` = multiple attention heads

### Attention system

- Per-head integer budget (10–12 points)
- Allocation changes immediately re-run `computeLiveProbabilities` and re-render the candidate bars
- Head-by-head scoring against `idealWeights` after reveal
- Aggregate attention heatmap displayed above the sentence tokens
- Multi-head level (Level 3) with three independently budgeted heads

### Educational clarity features

- Live probability bars with `transition-[width] duration-300` — the player sees the prediction respond
- First-level tutorial overlay walking through the trophy/suitcase flip step by step
- Explanation card after reveal with plain-English and transformer-vocabulary sections
- Attention arc visualizer showing which tokens the blank query attended to
- Attention comparison panel: player allocation vs model-like ideal weights
- Transformer math panel with softmax equations, masking, logits, and complexity notes
- Learning-progress bar for unlocked concepts
- Concept glossary sidebar tied to the current level

### Input support

- Mouse support throughout
- Keyboard support for full play and tutorial flow
- Responsive layout for desktop and tablet

## Keyboard Controls

- `Arrow Left / Arrow Right`: move token focus
- `H`: switch active attention head
- `Arrow Up` or `+`: add attention to the focused token
- `Arrow Down` or `-`: remove attention from the focused token
- `1-5`: choose a candidate token
- `Enter`: reveal answer or continue
- `Escape`: close the tutorial overlay

## Project Structure

```text
src/
  components/
    AttentionArcExplorer.tsx
    AttentionAllocator.tsx
    AttentionComparisonPanel.tsx
    AttentionHeatmap.tsx
    CandidateOptions.tsx        ← shows live bars pre-reveal, locked bars post-reveal
    CompletionScreen.tsx
    ConceptGlossary.tsx
    ExplanationCard.tsx
    IntroScreen.tsx
    LearningProgress.tsx
    LevelProgress.tsx
    ScoreBoard.tsx
    SentenceBoard.tsx
    TokenChip.tsx
    TransformerMathPanel.tsx
    TutorialOverlay.tsx
  data/
    levels.ts                   ← level definitions including tokenAffinities for live prediction
  lib/
    concepts.ts
    education.ts
    headThemes.ts
    scoring.ts                  ← computeLiveProbabilities, scoreLevel, buildAggregateAttention
    scoring.test.ts
    text.ts
  types/
    game.ts                     ← Level type includes optional tokenAffinities field
  App.tsx                       ← wires liveProbabilities from scoring into CandidateOptions
  main.tsx
```

## Key Data Shape

```ts
// In types/game.ts
type Level = {
  tokenAffinities?: Record<string, number[]>; // candidate → per-token affinity scores
  // ...rest of level fields
};
```

When `tokenAffinities` is present, `computeLiveProbabilities` drives the bars. When absent, `candidateProbabilities` is used as a static fallback.

## Local Development

```bash
npm install
npm run dev       # start dev server
npm run build     # production build
npm test          # run vitest tests
npm run preview   # preview production build
```

## Current Gameplay Flow

1. Land on the intro screen
2. Start the quest
3. Read the visible sentence tokens
4. Move attention points between tokens — watch the prediction bars respond live
5. Pick a candidate token
6. Lock in and reveal — see the explanation and scoring
7. Continue through all 3 levels

## Good Next Steps

- **More levels with tokenAffinities** — pronoun resolution, subject-verb agreement, topic shift. The affinity matrix format scales to any disambiguation task.
- **Softmax slider UI** — replace the integer budget with per-token sliders that auto-normalize to 100%, teaching that attention is a distribution not a points economy.
- **Before/after bar chart** — show uniform attention vs. player attention side by side to visualize what attention buys.
- **Progressive disclosure** — hide math panel, glossary, and heatmap on turn 1; reveal behind "Show me the math" toggle after first reveal.
- **Scoring introduced later** — Level 1 is currently consequence-free (play, watch prediction flip). Scoring pressure can be added from Level 2 onward.
- **Sound effects and animation polish**
- **Accessibility pass** — screen reader labels, visible focus states
- **Replayable challenge or free-play mode**
- **Teacher/parent notes or concept recap screen**
