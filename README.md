# Attention is All You Need — Interactive Explainer

**Live site → https://deepikar8.github.io/attention-is-all-you-need/**

An interactive web app that lets you feel how the attention mechanism works inside large language models — built for non-technical audiences (product managers, founders, operators) who need to understand LLMs well enough to make better decisions.

No maths required. 5 minutes.

---

## What you'll understand

**Attention** is the core innovation in the 2017 Google paper *"Attention is All You Need"* that introduced transformers — the architecture behind GPT, Gemini, Claude, and every modern LLM.

When a model predicts the next word, it doesn't treat all earlier words equally. It assigns a weight to each one. High weight = more influence on the prediction. That's attention.

---

## The core interaction

The sentence: *"The trophy didn't fit in the suitcase because it was too ___."*

Both "trophy" and "suitcase" are valid referents for "it". Click **trophy** → prediction shifts to "big". Click **suitcase** → prediction flips to "small". Same sentence, different attention, different answer.

This is not a demo or an animation. The prediction is computed live in the browser from your attention weights using a softmax — the same operation a real transformer performs.

---

## Five concept cards (after the interaction)

Each card is expandable and covers one concept from the paper, with a plain-English explanation and a note on why it matters for product decisions:

1. **Masking** — why the model can only look left, and why prompt order matters
2. **Embeddings** — how words become numbers that encode meaning
3. **Multi-head attention** — how multiple attention patterns run in parallel
4. **Temperature** — interactive slider showing how it sharpens or flattens predictions
5. **Hallucination** — what happens when attention has no signal to work with

---

## How it works technically

The live prediction runs entirely in the browser with no backend:

- Each candidate token has a `tokenAffinities` vector — one score per visible token
- Clicking a word sets it as the sole focus (full attention budget on that index)
- Laplace smoothing is applied so zero allocation gives near-uniform output
- A dot product of affinities × weights produces logits
- Softmax over logits → candidate probabilities, updated on every click

```
src/
  components/
    ConceptExplainers.tsx   ← five expandable concept cards
    CandidateOptions.tsx    ← live prediction bars + candidate selection
    SentenceBoard.tsx       ← clickable sentence with attention focus
    ExplanationCard.tsx     ← post-reveal result + concept cards
  data/
    levels.ts               ← sentence, candidates, tokenAffinities
  lib/
    scoring.ts              ← computeLiveProbabilities, scoreLevel
```

---

## Run locally

```bash
npm install
npm run dev
```

Tests:

```bash
npm test
```

---

## Based on

Vaswani et al., [*Attention is All You Need*](https://arxiv.org/abs/1706.03762), NeurIPS 2017.
