'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ApiKeysHeader } from '@/components/api-keys/ApiKeysHeader';
import { ApiKeysMetricCards } from '@/components/api-keys/ApiKeysMetricCards';
import { CreateApiKeyForm } from '@/components/api-keys/CreateApiKeyForm';
import { ApiKeysTable } from '@/components/api-keys/ApiKeysTable';
import { ApiUsageChartCard } from '@/components/api-keys/ApiUsageChartCard';
import { RateLimitsCard } from '@/components/api-keys/RateLimitsCard';
import { SecurityTipsCard } from '@/components/api-keys/SecurityTipsCard';
import {
  getStoredApiKeys,
  deleteStoredApiKey,
  computeApiKeyMetrics,
  SECURITY_TIPS,
} from '@/lib/api-keys';
import { CheckCircle2 } from 'lucide-react';

export default function ApiKeysPage() {
  const [keys, setKeys] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const syncKeys = () => {
      setKeys(getStoredApiKeys());
    };
    const timer = setTimeout(syncKeys, 0);
    window.addEventListener('storage', syncKeys);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('storage', syncKeys);
    };
  }, []);

  const metrics = computeApiKeyMetrics(keys);

  const rateLimits = useMemo(() => {
    const limitsMap = {
      OpenAI: { total: 10000, used: 2450, color: '#3B82F6' },
      Anthropic: { total: 5000, used: 1200, color: '#A855F7' },
      'Google Gemini': { total: 15000, used: 3800, color: '#06B6D4' },
      Gemini: { total: 15000, used: 3800, color: '#06B6D4' },
      'Hugging Face': { total: 8000, used: 950, color: '#EAB308' },
      Cohere: { total: 5000, used: 640, color: '#10B981' },
    };

    const activeProviders = [...new Set(keys.map((k) => k.provider))];
    if (activeProviders.length === 0) return [];

    return activeProviders.map((prov) => {
      const info = limitsMap[prov] || { total: 5000, used: 450, color: '#6366F1' };
      return {
        provider: prov,
        total: info.total,
        used: info.used,
        percentage: Math.round((info.used / info.total) * 100),
        color: info.color,
      };
    });
  }, [keys]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddKey = (newKey) => {
    const updated = [newKey, ...keys];
    setKeys(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('promptshield_user_api_keys', JSON.stringify(updated));
    }
    showToast(`Added API Key: ${newKey.name}`);
  };

  const handleCopyKey = (item) => {
    showToast(`API Key for ${item.name} copied to clipboard.`);
  };

  const handleDeleteKey = (id) => {
    const target = keys.find((k) => k.id === id);
    const updated = deleteStoredApiKey(id);
    setKeys(updated);
    if (target) {
      showToast(`Removed API Key: ${target.name}`);
    }
  };

  const handleEditKey = (item) => {
    showToast(`Configurations active for ${item.name}`);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-[1700px] mx-auto pb-12">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#e11d48] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-rose-400/40 flex items-center gap-2 text-xs font-semibold animate-fade-in shadow-rose-950/50">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Top Header */}
        <ApiKeysHeader />

        {/* 4 Metric Cards */}
        <ApiKeysMetricCards metrics={metrics} />

        {/* Row 2: Form (Left 4 cols) & Table (Right 8 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-4">
            <CreateApiKeyForm onAddKey={handleAddKey} />
          </div>
          <div className="lg:col-span-8">
            <ApiKeysTable
              keys={keys}
              onCopyKey={handleCopyKey}
              onDeleteKey={handleDeleteKey}
              onEditKey={handleEditKey}
            />
          </div>
        </div>

        {/* Row 3: API Usage (5 cols), Rate Limits (4 cols), Security Tips (3 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-5">
            <ApiUsageChartCard seriesData={null} />
          </div>
          <div className="lg:col-span-4">
            <RateLimitsCard rateLimits={rateLimits} />
          </div>
          <div className="lg:col-span-3">
            <SecurityTipsCard tips={SECURITY_TIPS} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
