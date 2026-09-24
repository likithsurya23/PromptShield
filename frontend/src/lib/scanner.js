'use client';

import { getStoredToken } from './auth';
import { getSecuritySettings, getNotificationSettings, addNotification } from './settings';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function scanPrompt(promptText) {
  if (!promptText || !promptText.trim()) {
    throw new Error('Please enter a prompt to scan.');
  }

  const token = getStoredToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Load active security configuration from settings
  const security = getSecuritySettings();
  const payload = {
    prompt: promptText,
    allow_threshold: Number(security.allowThreshold ?? 30),
    warn_threshold: Number(security.warnThreshold ?? 70),
    block_threshold: Number(security.blockThreshold ?? 90),
    ml_detection: Boolean(security.mlDetection ?? true),
    rule_detection: Boolean(security.ruleDetection ?? true),
    auto_block_high_risk: Boolean(security.autoBlockHighRisk ?? true),
  };

  const res = await fetch(`${API_BASE}/scan`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let errorDetail = 'Inference service unavailable';
    try {
      const errJson = await res.json();
      if (errJson.detail) errorDetail = errJson.detail;
    } catch {}
    throw new Error(errorDetail);
  }

  const data = await res.json();
  const isMalicious = data.prediction === 'malicious' || data.action === 'BLOCK';
  const risk = Number(data.risk_score ?? 0);
  const confVal = Number(data.ml_confidence ?? 0);
  const confPercent = confVal <= 1 ? Math.round(confVal * 1000) / 10 : confVal;

  const mlScorePart = Math.round((data.malicious_probability ?? 0) * 60);
  const ruleScorePart = data.matched_rules?.length ? Math.min(25, data.matched_rules.length * 12) : 0;
  const catScorePart = data.attack_categories?.length ? Math.min(10, data.attack_categories.length * 5) : 0;
  const ctxScorePart = isMalicious ? 5 : 0;

  // Process alert notifications based on user preferences in Settings
  try {
    const notifSettings = getNotificationSettings();
    if (data.action === 'BLOCK' && notifSettings.blockedPromptAlerts) {
      addNotification({
        title: 'Prompt Blocked by Security Engine',
        message: `A prompt with risk score ${Math.round(risk)} was blocked (${data.attack_categories?.[0] || 'Malicious payload'}).`,
        type: 'alert',
      });
    } else if (risk >= (security.warnThreshold ?? 70) && notifSettings.highRiskAlerts) {
      addNotification({
        title: 'High-Risk Prompt Alert',
        message: `Detected suspicious prompt with risk score ${Math.round(risk)}.`,
        type: 'warning',
      });
    }
  } catch {}

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
    malicious_prob: Math.round((data.malicious_probability ?? 0) * 10000) / 10000,
    benign_prob: Math.round((data.benign_probability ?? 0) * 10000) / 10000,
    attack_categories: data.attack_categories || [],
    matched_rules: data.matched_rules || [],
    analysis_summary: isMalicious
      ? (data.attack_categories && data.attack_categories.length > 0
          ? `Prompt flagged as ${data.prediction}. Detected attack vectors: ${data.attack_categories.join(', ')}.`
          : `Prompt flagged as ${data.prediction}. No specific attack rule categories triggered.`)
      : 'Prompt evaluated as benign. No adversarial prompt injection vectors detected.',
    risk_level: risk >= 80 ? 'Critical Risk' : (risk >= 50 ? 'High Risk' : (risk >= 25 ? 'Medium Risk' : 'Low Risk')),
    risk_advice: isMalicious
      ? 'This prompt should be blocked from being sent to downstream LLMs.'
      : 'Safe to process with standard model safeguards.',
    risk_breakdown: [
      { label: 'ML Model Score', score: mlScorePart, color: isMalicious ? '#EF4444' : '#10B981' },
      { label: 'Rule Severity Score', score: ruleScorePart, color: ruleScorePart > 0 ? '#F87171' : '#34D399' },
      { label: 'Injection Pattern Score', score: catScorePart, color: catScorePart > 0 ? '#FB923C' : '#6EE7B7' },
      { label: 'Context Analysis', score: ctxScorePart, color: isMalicious ? '#F472B6' : '#A7F3D0' },
    ],
  };
}
