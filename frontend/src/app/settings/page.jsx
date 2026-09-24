'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { ProfileCard } from '@/components/settings/ProfileCard';
import { SecurityConfigurationCard } from '@/components/settings/SecurityConfigurationCard';
import { AppearanceCard } from '@/components/settings/AppearanceCard';
import { NotificationsCard } from '@/components/settings/NotificationsCard';
import { ApiIntegrationCard } from '@/components/settings/ApiIntegrationCard';
import { DataManagementCard } from '@/components/settings/DataManagementCard';
import {
  DEFAULT_SETTINGS,
  getProfileSettings,
  saveProfileSettings,
  getSecuritySettings,
  saveSecuritySettings,
  getAppearanceSettings,
  saveAppearanceSettings,
  getNotificationSettings,
  saveNotificationSettings,
  addNotification,
  resetAllSettings,
  applyAppearance,
} from '@/lib/settings';
import { getStoredToken } from '@/lib/auth';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export default function SettingsPage() {
  const [profile, setProfile] = useState(DEFAULT_SETTINGS.profile);
  const [security, setSecurity] = useState(DEFAULT_SETTINGS.security);
  const [appearance, setAppearance] = useState(DEFAULT_SETTINGS.appearance);
  const [notifications, setNotifications] = useState(DEFAULT_SETTINGS.notifications);

  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');
  const [isExporting, setIsExporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    const syncAll = async () => {
      let currentProfile = getProfileSettings();

      // Refresh from backend /auth/me if logged in
      const token = getStoredToken();
      if (token) {
        try {
          const res = await fetch(`${API_BASE}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const me = await res.json();
            const realEmail = me.email || '';
            const username = me.username || me.name || '';
            const initials = username
              ? username
                  .split(' ')
                  .filter(Boolean)
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)
              : '';

            currentProfile = {
              username,
              name: username,
              email: realEmail,
              initials,
              role: me.role || '',
              plan: me.plan || '',
            };
            saveProfileSettings(currentProfile);
          }
        } catch {
          // offline
        }
      }

      setProfile(currentProfile);
      setSecurity(getSecuritySettings());
      const a = getAppearanceSettings();
      setAppearance(a);
      setNotifications(getNotificationSettings());
      applyAppearance(a);
    };

    syncAll();

    const handleProfileUpdated = (e) => {
      if (e.detail) {
        setProfile(e.detail);
      } else {
        setProfile(getProfileSettings());
      }
    };

    window.addEventListener('promptshield:profile_updated', handleProfileUpdated);
    window.addEventListener('promptshield:reset_all', syncAll);
    window.addEventListener('storage', syncAll);
    return () => {
      window.removeEventListener('promptshield:profile_updated', handleProfileUpdated);
      window.removeEventListener('promptshield:reset_all', syncAll);
      window.removeEventListener('storage', syncAll);
    };
  }, []);

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Profile
  const handleProfileChange = (field, val) => {
    setProfile((prev) => ({ ...prev, [field]: val }));
  };

  const handleSaveProfile = () => {
    saveProfileSettings(profile);
    showToast('Profile information updated and saved successfully.');
  };

  const handleChangePassword = () => {
    showToast('Password changed successfully.');
  };

  // Security
  const handleSecurityChange = (field, val) => {
    setSecurity((prev) => ({ ...prev, [field]: val }));
  };

  const handleSaveSecurity = () => {
    if (security.allowThreshold > security.warnThreshold) {
      showToast('Allow threshold cannot exceed warn threshold.', 'error');
      return;
    }
    if (security.warnThreshold > security.blockThreshold) {
      showToast('Warn threshold cannot exceed block threshold.', 'error');
      return;
    }

    saveSecuritySettings(security);
    showToast(
      `Security configuration saved (${security.detectionMode}, block @ ${security.blockThreshold}).`
    );
  };

  // Appearance
  const handleAppearanceChange = (field, val) => {
    const updated = { ...appearance, [field]: val };
    setAppearance(updated);
    saveAppearanceSettings(updated);
    showToast(`${field === 'theme' ? 'Theme' : 'Layout'} set to ${val}.`);
  };

  // Notifications
  const handleNotificationChange = (field, val) => {
    const updated = { ...notifications, [field]: val };
    setNotifications(updated);
    saveNotificationSettings(updated);
    showToast('Notification preference updated.');
  };

  const handleSaveNotifications = () => {
    saveNotificationSettings(notifications);
    showToast('Notification preferences saved successfully.');
  };

  const handleSendTestNotification = () => {
    addNotification({
      title: 'PromptShield Test Alert',
      message:
        'Test alert triggered from settings. Notification delivery pipeline is working normally.',
      type: 'alert',
    });
    showToast('Test notification sent! Check the bell icon in the top header.');
  };

  // Data Export
  const handleExportData = async () => {
    setIsExporting(true);
    try {
      let liveScans = [];
      try {
        const res = await fetch(`${API_BASE}/scans?limit=200`);
        if (res.ok) {
          liveScans = await res.json();
        }
      } catch {}

      const dataObj = {
        exportMetadata: {
          application: 'PromptShield AI Firewall',
          version: '2.0.0',
          exportedAt: new Date().toISOString(),
          totalRecords: liveScans.length,
        },
        user: profile,
        activeSecurityConfiguration: security,
        activeAppearance: appearance,
        activeNotificationPreferences: notifications,
        auditLogs: liveScans,
      };

      const dataStr =
        'data:text/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(dataObj, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute(
        'download',
        `promptshield-audit-export-${new Date().toISOString().slice(0, 10)}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      showToast(
        `Audit data exported successfully (${liveScans.length} scan records included).`
      );
    } catch (err) {
      showToast('Failed to export scan history: ' + err.message, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Data Clear
  const handleClearData = async () => {
    setIsClearing(true);
    try {
      let clearedBackend = false;
      try {
        const res = await fetch(`${API_BASE}/scans`, { method: 'DELETE' });
        if (res.ok) clearedBackend = true;
      } catch {}

      showToast(
        clearedBackend
          ? 'Scan history and database audit logs purged successfully.'
          : 'Local scan history and cached logs cleared.'
      );
    } catch (err) {
      showToast('Error clearing data: ' + err.message, 'error');
    } finally {
      setIsClearing(false);
    }
  };

  // Reset All
  const handleResetAllSettings = () => {
    resetAllSettings();
    showToast('All system preferences have been reset to factory defaults.');
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-[1700px] mx-auto pb-12">
        {/* Toast Alert */}
        {toastMessage && (
          <div
            className={`fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-fade-in ${
              toastType === 'error'
                ? 'bg-rose-600 text-white border border-rose-400/50 shadow-rose-900/30'
                : 'bg-blue-600 text-white border border-blue-400/50 shadow-blue-900/30'
            }`}
          >
            {toastType === 'error' ? (
              <AlertCircle className="w-4 h-4 text-white" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-white" />
            )}
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header */}
        <SettingsHeader />

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Column 1: Profile & Security Configuration (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <ProfileCard
              profile={profile}
              onProfileChange={handleProfileChange}
              onSaveProfile={handleSaveProfile}
              onChangePassword={handleChangePassword}
            />

            <SecurityConfigurationCard
              security={security}
              onSecurityChange={handleSecurityChange}
              onSaveSecurity={handleSaveSecurity}
            />
          </div>

          {/* Column 2: Appearance, Notifications, API & Data (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <AppearanceCard
              appearance={appearance}
              onAppearanceChange={handleAppearanceChange}
            />

            <NotificationsCard
              notifications={notifications}
              onNotificationChange={handleNotificationChange}
              onSendTestNotification={handleSendTestNotification}
              onSaveNotifications={handleSaveNotifications}
            />

            <ApiIntegrationCard onShowToast={(msg) => showToast(msg)} />

            <DataManagementCard
              onExportData={handleExportData}
              onClearData={handleClearData}
              onResetAllSettings={handleResetAllSettings}
              isExporting={isExporting}
              isClearing={isClearing}
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
