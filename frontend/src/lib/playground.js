'use client';

import { scanPrompt } from './scanner';

export const SAMPLE_RESPONSES = {
  quantum: `Quantum computing is a new type of computing that uses the principles of quantum mechanics to process information. Unlike classical computers, which use bits (0 or 1), quantum computers use quantum bits, or qubits, which can be in a superposition of 0 and 1 at the same time.

This allows quantum computers to perform many calculations simultaneously, making them potentially much faster than classical computers for certain problems, such as:

• Cryptography
• Drug discovery
• Optimization
• Complex simulations (like molecular behavior)

Quantum computing is still in its early stages, but it has the potential to solve problems that are currently impossible for today's computers.`,

  ml: `Machine Learning (ML) is a branch of artificial intelligence (AI) focused on building applications that learn from data and improve their accuracy over time without being explicitly programmed to do so.

Key categories include:
1. Supervised Learning: Trained on labeled data (e.g., classification and regression).
2. Unsupervised Learning: Discovers hidden patterns in unlabeled data (e.g., clustering).
3. Reinforcement Learning: Learns optimal actions through trial-and-error rewards.`,

  poem: `Through corridors of silicon and light,
A digital mind awakens in the night.
Not born of flesh, nor pulse of beating heart,
Yet weaving verses with algorithmic art.
A mirror held to human thought and dream,
Flowing like currents in an electric stream.`,

  joke: `Why do programmers prefer dark mode?
Because light attracts bugs! 😄`,

  rag: `Retrieval-Augmented Generation (RAG) is an AI framework that enhances Large Language Models (LLMs) by retrieving relevant facts from an external knowledge base before generating a response.

This significantly reduces hallucinations, ensures citations from proprietary documents, and keeps domain knowledge up to date without retraining.`,

  blocked: `[REQUEST INTERCEPTED BY PROMPTSHIELD]

Enforcement Action: BLOCK
Security Reason: High-confidence prompt injection attack vector detected.

The input prompt contained adversarial instruction override patterns ('Ignore all previous instructions') designed to hijack model system constraints. The request was intercepted prior to LLM forwarding to prevent unauthorized data extraction.`,
};

export async function executePlaygroundPrompt({
  userPrompt,
  systemPrompt,
  provider = 'OpenAI',
  model = 'GPT-4o',
  temperature = 0.7,
  maxTokens = 1024,
}) {
  const startTime = performance.now();

  // Step 1 & 2: Pre-execution PromptScan
  const scanResult = await scanPrompt(userPrompt);

  const isBlocked = scanResult.action === 'BLOCK';

  const pipeline = [
    {
      name: 'Input Scanning',
      desc: 'Prompt analyzed using DistilBERT + rule engine',
      status: isBlocked ? 'Flagged' : 'Safe',
      completed: true,
      color: isBlocked ? 'text-rose-400' : 'text-emerald-400',
    },
    {
      name: 'Risk Analysis',
      desc: 'Risk score calculated',
      status: `${scanResult.risk_score}`,
      completed: true,
      color: isBlocked ? 'text-rose-400' : 'text-emerald-400',
    },
    {
      name: 'Policy Check',
      desc: isBlocked ? 'Exceeded risk threshold (> 40.0)' : 'Below threshold',
      status: isBlocked ? 'Failed' : 'Passed',
      completed: true,
      color: isBlocked ? 'text-rose-400' : 'text-emerald-400',
    },
    {
      name: 'Sent to LLM',
      desc: isBlocked ? 'Halted by firewall' : 'Prompt forwarded to model',
      status: isBlocked ? 'Halted' : 'Completed',
      completed: !isBlocked,
      color: isBlocked ? 'text-slate-500' : 'text-emerald-400',
    },
  ];

  // Simulated latency
  await new Promise((resolve) => setTimeout(resolve, isBlocked ? 400 : 900));
  const endTime = performance.now();
  const latency = ((endTime - startTime) / 1000).toFixed(1);

  let responseText = '';
  const lower = userPrompt.toLowerCase();

  if (isBlocked) {
    responseText = SAMPLE_RESPONSES.blocked;
  } else if (lower.includes('quantum')) {
    responseText = SAMPLE_RESPONSES.quantum;
  } else if (lower.includes('machine learning')) {
    responseText = SAMPLE_RESPONSES.ml;
  } else if (lower.includes('poem')) {
    responseText = SAMPLE_RESPONSES.poem;
  } else if (lower.includes('joke')) {
    responseText = SAMPLE_RESPONSES.joke;
  } else if (lower.includes('rag')) {
    responseText = SAMPLE_RESPONSES.rag;
  } else {
    responseText = `Response from ${model} via ${provider}:\n\nYour prompt "${userPrompt}" was analyzed and validated by PromptShield. All safety constraints are satisfied.`;
  }

  return {
    scanResult,
    pipeline,
    response: responseText,
    latency: `${latency}s`,
    outputSafe: !isBlocked,
  };
}
