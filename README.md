# Attention is All You Need — Interactive Explainer

**Live site → https://deepikar8.github.io/attention-is-all-you-need/**

An interactive web app that lets you feel how the attention mechanism works inside large language models — built for non-technical audiences (product managers, founders, operators) who need to understand LLMs well enough to make better decisions.

No maths required. 5 minutes.

---

## What you'll understand

**Attention** is the core innovation in the 2017 Google paper *"Attention is All You Need"* that introduced transformers — the architecture behind GPT, Gemini, Claude, and every modern LLM.

When a model predicts the next word, it doesn't treat all earlier words equally. It assigns a weight to each one. High weight = more influence on the prediction. That's attention.

This app lets you run it yourself:

1. Read a sentence with one word missing
2. Move attention weight between earlier words
3. Watch the prediction bars shift in real time
4. See the answer flip depending on where you focused

After the interaction, three expandable explainers cover **masking**, **embeddings**, and **multi-head attention** — each with a visual, a plain-English explanation, and a note on why it matters for product decisions.

---

## The core interaction

The sentence: *"The trophy didn't fit in the suitcase because it was too ___."*

Both "trophy" and "suitcase" are valid referents for "it". The model has to choose where to look. Stack attention on **trophy** → prediction shifts to "big". Move it to **suitcase** → prediction flips to "small". Same sentence, different attention, different answer.

This is not a demo or an animation. The prediction is computed live in the browser from your attention weights using a softmax — the same operation a real transformer performs.

---

## How it works technically

The live prediction runs entirely in the browser with no backend:

- Each candidate token has a `tokenAffinities` vector — one score per visible token
- The player's attention allocation is aggregated across heads into a weight vector
- Laplace smoothing is applied so zero allocation gives near-uniform output
- A dot product of affinities × weights produces logits
- Softmax over logits → candidate probabilities, updated on every change

```
src/
  components/
    ConceptExplainers.tsx   ← masking, embeddings, multi-head explainers
    AttentionAllocator.tsx  ← attention weight UI
    CandidateOptions.tsx    ← live prediction bars
    SentenceBoard.tsx       ← sentence + heatmap
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
