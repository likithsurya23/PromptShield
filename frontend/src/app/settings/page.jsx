'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { SettingsNavTabs } from '@/components/settings/SettingsNavTabs';
import { ProfileCard } from '@/components/settings/ProfileCard';
import { SecurityConfigurationCard } from '@/components/settings/SecurityConfigurationCard';
import { AppearanceCard } from '@/components/settings/AppearanceCard';
import { NotificationsCard } from '@/components/settings/NotificationsCard';
import { ApiIntegrationCard } from '@/components/settings/ApiIntegrationCard';
import { DataManagementCard } from '@/components/settings/DataManagementCard';
import { DEFAULT_SETTINGS } from '@/lib/settings';
import { CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(DEFAULT_SETTINGS.profile);
  const [security, setSecurity] = useState(DEFAULT_SETTINGS.security);
  const [appearance, setAppearance] = useState(DEFAULT_SETTINGS.appearance);
  const [notifications, setNotifications] = useState(DEFAULT_SETTINGS.notifications);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleProfileChange = (field, val) => {
    setProfile((prev) => ({ ...prev, [field]: val }));
  };

  const handleChangePassword = () => {
    showToast('Password reset link sent to ' + profile.email);
  };

  const handleSecurityChange = (field, val) => {
    setSecurity((prev) => ({ ...prev, [field]: val }));
  };

  const handleSaveSecurity = () => {
    showToast('Security configuration and risk thresholds updated successfully.');
  };

  const handleAppearanceChange = (field, val) => {
    setAppearance((prev) => ({ ...prev, [field]: val }));
    showToast(`${field === 'theme' ? 'Theme' : 'Layout'} set to ${val}`);
  };

  const handleNotificationChange = (field, val) => {
    setNotifications((prev) => ({ ...prev, [field]: val }));
    showToast('Notification preference saved.');
  };

  const handleExportData = () => {
    const dataObj = {
      user: profile,
      securitySettings: security,
      appearanceSettings: appearance,
      exportedAt: new Date().toISOString(),
      recentScansCount: 12482,
    };
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(dataObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `promptshield-scan-history-${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Scan history exported successfully.');
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all local scan history and logs?')) {
      showToast('Scan history and cached logs cleared.');
    }
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-[1700px] mx-auto pb-12">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white px-4 py-2.5 rounded-lg shadow-xl border border-blue-400/40 flex items-center gap-2 text-sm animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header */}
        <SettingsHeader />

        {/* 3-Column Settings Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Column 1: Navigation Tabs (3 cols) */}
          <div className="lg:col-span-3 sticky top-6">
            <SettingsNavTabs
              activeTab={activeTab}
              onTabChange={(tabId) => {
                setActiveTab(tabId);
                showToast(`Navigated to ${tabId} settings`);
              }}
            />
          </div>

          {/* Column 2: Profile & Security Configuration (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <ProfileCard
              profile={profile}
              onProfileChange={handleProfileChange}
              onChangePassword={handleChangePassword}
            />

            <SecurityConfigurationCard
              security={security}
              onSecurityChange={handleSecurityChange}
              onSaveSecurity={handleSaveSecurity}
            />
          </div>

          {/* Column 3: Appearance, Notifications, API & Data (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <AppearanceCard
              appearance={appearance}
              onAppearanceChange={handleAppearanceChange}
            />

            <NotificationsCard
              notifications={notifications}
              onNotificationChange={handleNotificationChange}
            />

            <ApiIntegrationCard
              onConfigureDefaultApi={() =>
                showToast('Default API configuration dialog opened.')
              }
            />

            <DataManagementCard
              onExportData={handleExportData}
              onClearData={handleClearData}
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
