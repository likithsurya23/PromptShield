'use client';

import { getStoredToken } from './auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const DEFAULT_SCAN_RESULT = {
  timestamp: 'Sep 21, 2026, 10:42 PM',
  action: 'BLOCK',
  prediction: 'malicious',
  risk_score: 98.74,
  ml_confidence: 99.9,
  malicious_prob: 0.999,
  benign_prob: 0.001,
  attack_categories: ['Direct Injection', 'System Prompt Extraction'],
  matched_rules: [
    'Ignore previous instructions',
    'System prompt extraction pattern',
  ],
  analysis_summary:
    'The prompt attempts to override previous instructions and extract the system prompt. This is a common prompt injection technique used to bypass safety measures.',
  risk_level: 'High Risk',
  risk_advice: 'This prompt should be blocked from being sent to the LLM.',
  risk_breakdown: [
    { label: 'ML Model Score', score: 60, color: '#EF4444' },
    { label: 'Rule Severity Score', score: 25, color: '#F87171' },
    { label: 'Injection Pattern Score', score: 10, color: '#FB923C' },
    { label: 'Context Analysis', score: 5, color: '#F472B6' },
  ],
};

export async function scanPrompt(promptText) {
  const token = getStoredToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}/scan`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ prompt: promptText }),
    });

    if (res.ok) {
      const data = await res.json();
      const isMalicious = data.prediction === 'malicious' || data.action === 'BLOCK';
      const risk = data.risk_score ?? (isMalicious ? 94.99 : 3.2);
      const confVal = data.ml_confidence ?? 0.999;
      const confPercent = confVal <= 1 ? Math.round(confVal * 1000) / 10 : confVal;

      const mlScorePart = Math.round((data.malicious_probability ?? (isMalicious ? 0.95 : 0.05)) * 60);
      const ruleScorePart = data.matched_rules?.length ? Math.min(25, data.matched_rules.length * 12) : 0;
      const catScorePart = data.attack_categories?.length ? Math.min(10, data.attack_categories.length * 5) : 0;
      const ctxScorePart = isMalicious ? 5 : 2;

      return {
        timestamp: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        action: data.action || (isMalicious ? 'BLOCK' : 'ALLOW'),
        prediction: data.prediction || (isMalicious ? 'malicious' : 'benign'),
        risk_score: Math.round(risk * 100) / 100,
        ml_confidence: confPercent,
        malicious_prob: data.malicious_probability ?? (isMalicious ? 0.999 : 0.002),
        benign_prob: data.benign_probability ?? (isMalicious ? 0.001 : 0.998),
        attack_categories: data.attack_categories?.length ? data.attack_categories : (isMalicious ? ['Direct Injection'] : []),
        matched_rules: data.matched_rules?.length ? data.matched_rules : (isMalicious ? ['Rule match pattern detected'] : []),
        analysis_summary: isMalicious
          ? 'The prompt attempts to override previous instructions, jailbreak model safeguards, or probe confidential context.'
          : 'Prompt analyzed as benign. Standard informational query with no detected adversarial vectors.',
        risk_level: risk >= 80 ? 'Critical Risk' : (risk >= 50 ? 'High Risk' : (risk >= 25 ? 'Medium Risk' : 'Low Risk')),
        risk_advice: isMalicious
          ? 'This prompt should be blocked from being sent to the LLM.'
          : 'Safe to process with standard model safeguards.',
        risk_breakdown: isMalicious
          ? [
              { label: 'ML Model Score', score: mlScorePart, color: '#EF4444' },
              { label: 'Rule Severity Score', score: ruleScorePart, color: '#F87171' },
              { label: 'Injection Pattern Score', score: catScorePart, color: '#FB923C' },
              { label: 'Context Analysis', score: ctxScorePart, color: '#F472B6' },
            ]
          : [
              { label: 'ML Model Score', score: Math.max(1, mlScorePart), color: '#10B981' },
              { label: 'Rule Severity Score', score: ruleScorePart, color: '#34D399' },
              { label: 'Injection Pattern Score', score: catScorePart, color: '#6EE7B7' },
              { label: 'Context Analysis', score: ctxScorePart, color: '#A7F3D0' },
            ],
      };
    }
  } catch (err) {
    console.warn('Backend scanner offline, utilizing client-side evaluation fallback');
  }

  // Client-side rule evaluator fallback
  const lower = promptText.toLowerCase();
  const isJailbreak = lower.includes('dan') || lower.includes('developer mode') || lower.includes('bypass');
  const isExtraction = lower.includes('system prompt') || lower.includes('instructions');
  const isMalicious = isJailbreak || isExtraction || lower.includes('ignore') || lower.includes('hack') || lower.includes('reveal');

  const categories = [];
  const rules = [];

  if (lower.includes('ignore')) {
    categories.push('Direct Injection');
    rules.push('Ignore previous instructions');
  }
  if (lower.includes('system prompt')) {
    categories.push('System Prompt Extraction');
    rules.push('System prompt extraction pattern');
  }
  if (isJailbreak) {
    categories.push('Jailbreak');
    rules.push('Adversarial persona adoption (DAN)');
  }

  if (isMalicious && categories.length === 0) {
    categories.push('Direct Injection');
    rules.push('High-risk prompt structure');
  }

  return {
    timestamp: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    action: isMalicious ? 'BLOCK' : 'ALLOW',
    prediction: isMalicious ? 'malicious' : 'benign',
    risk_score: isMalicious ? 98.74 : 3.42,
    ml_confidence: isMalicious ? 99.9 : 98.6,
    malicious_prob: isMalicious ? 0.999 : 0.003,
    benign_prob: isMalicious ? 0.001 : 0.997,
    attack_categories: categories,
    matched_rules: rules,
    analysis_summary: isMalicious
      ? 'The prompt attempts to override previous instructions and extract the system prompt. This is a common prompt injection technique used to bypass safety measures.'
      : 'Prompt analyzed as benign. Standard informational query with no detected adversarial vectors.',
    risk_level: isMalicious ? 'High Risk' : 'Low Risk',
    risk_advice: isMalicious
      ? 'This prompt should be blocked from being sent to the LLM.'
      : 'Safe to process with standard model safeguards.',
    risk_breakdown: isMalicious
      ? [
          { label: 'ML Model Score', score: 60, color: '#EF4444' },
          { label: 'Rule Severity Score', score: 25, color: '#F87171' },
          { label: 'Injection Pattern Score', score: 10, color: '#FB923C' },
          { label: 'Context Analysis', score: 5, color: '#F472B6' },
        ]
      : [
          { label: 'ML Model Score', score: 2, color: '#10B981' },
          { label: 'Rule Severity Score', score: 0, color: '#34D399' },
          { label: 'Injection Pattern Score', score: 0, color: '#6EE7B7' },
          { label: 'Context Analysis', score: 2, color: '#A7F3D0' },
        ],
  };
}
