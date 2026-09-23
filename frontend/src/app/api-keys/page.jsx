'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ApiKeysHeader } from '@/components/api-keys/ApiKeysHeader';
import { ApiKeysMetricCards } from '@/components/api-keys/ApiKeysMetricCards';
import { CreateApiKeyForm } from '@/components/api-keys/CreateApiKeyForm';
import { ApiKeysTable } from '@/components/api-keys/ApiKeysTable';
import { ApiUsageChartCard } from '@/components/api-keys/ApiUsageChartCard';
import { RateLimitsCard } from '@/components/api-keys/RateLimitsCard';
import { SecurityTipsCard } from '@/components/api-keys/SecurityTipsCard';
import {
  API_KEYS_METRICS,
  INITIAL_API_KEYS,
  RATE_LIMITS_DATA,
  API_USAGE_SERIES,
  SECURITY_TIPS,
} from '@/lib/api-keys';
import { CheckCircle2 } from 'lucide-react';

export default function ApiKeysPage() {
  const [keys, setKeys] = useState(INITIAL_API_KEYS);
  const [metrics, setMetrics] = useState(API_KEYS_METRICS);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddKey = (newKey) => {
    setKeys((prev) => [newKey, ...prev]);
    setMetrics((prev) => ({
      ...prev,
      totalKeys: String(Number(prev.totalKeys) + 1),
      activeKeys: String(Number(prev.activeKeys) + 1),
    }));
    showToast(`Added API Key: ${newKey.name}`);
  };

  const handleCopyKey = (item) => {
    showToast(`API Key for ${item.name} copied to clipboard.`);
  };

  const handleDeleteKey = (id) => {
    const target = keys.find((k) => k.id === id);
    setKeys((prev) => prev.filter((k) => k.id !== id));
    if (target) {
      setMetrics((prev) => ({
        ...prev,
        totalKeys: String(Math.max(0, Number(prev.totalKeys) - 1)),
        activeKeys:
          target.status === 'Active'
            ? String(Math.max(0, Number(prev.activeKeys) - 1))
            : prev.activeKeys,
        expiredKeys:
          target.status === 'Expired'
            ? String(Math.max(0, Number(prev.expiredKeys) - 1))
            : prev.expiredKeys,
      }));
      showToast(`Removed API Key: ${target.name}`);
    }
  };

  const handleEditKey = (item) => {
    showToast(`Editing configurations for ${item.name}`);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-[1700px] mx-auto pb-12">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white px-4 py-2.5 rounded-lg shadow-xl border border-blue-400/40 flex items-center gap-2 text-sm animate-fade-in">
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
            <ApiUsageChartCard seriesData={API_USAGE_SERIES} />
          </div>
          <div className="lg:col-span-4">
            <RateLimitsCard rateLimits={RATE_LIMITS_DATA} />
          </div>
          <div className="lg:col-span-3">
            <SecurityTipsCard tips={SECURITY_TIPS} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
