import { ConceptId } from "../types/game";

export const conceptDetails: {
  id: ConceptId;
  title: string;
  subtitle: string;
  body: string;
}[] = [
  {
    id: "word-scouts",
    title: "Tokenization",
    subtitle: "Level 1",
    body: "LLMs don't read whole words — they split text into tokens (words, subwords, punctuation) and process each one individually. 'unhappiness' might become ['un', 'happiness'].",
  },
  {
    id: "memory-maps",
    title: "Embeddings",
    subtitle: "Level 2",
    body: "Each token is converted into a list of numbers that encodes its meaning. Words with similar meanings get similar numbers — 'jam' and 'toast' end up numerically close to each other.",
  },
  {
    id: "line-up-keeper",
    title: "Positional encoding",
    subtitle: "Level 2",
    body: "'Dog bites man' and 'Man bites dog' use identical tokens. Positional encoding adds an order signal to each token so the model knows where in the sentence it sits.",
  },
  {
    id: "flashlights",
    title: "Attention",
    subtitle: "Level 1",
    body: "When predicting the next token, the model assigns a weight to every earlier token. High weight = more influence on the prediction. This is the core innovation of the 2017 transformer paper.",
  },
  {
    id: "curtains",
    title: "Masking",
    subtitle: "Level 2",
    body: "The model is only allowed to use past tokens to predict the next one — it cannot see the future. Masking enforces this by hiding tokens that come after the current position.",
  },
  {
    id: "fountain",
    title: "Next-token prediction",
    subtitle: "All levels",
    body: "LLMs don't generate full sentences at once. They pick one token at a time, using a probability distribution over the vocabulary. Attention shapes that distribution.",
  },
  {
    id: "multi-head",
    title: "Multi-head attention",
    subtitle: "Level 3",
    body: "Instead of one set of attention weights, transformers compute several in parallel. Each 'head' can focus on different things — grammar, meaning, who a pronoun refers to — simultaneously.",
  },
];

export const allConceptIds = conceptDetails.map((concept) => concept.id);
