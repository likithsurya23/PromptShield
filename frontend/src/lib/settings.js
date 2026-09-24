'use client';

import { getCurrentUser } from './auth';

export const EMPTY_PROFILE = {
  username: '',
  name: '',
  email: '',
  initials: '',
  role: '',
  plan: '',
};

export const DEFAULT_SETTINGS = {
  profile: EMPTY_PROFILE,
  security: {
    detectionMode: 'Hybrid (ML + Rules)',
    mlDetection: true,
    ruleDetection: true,
    autoBlockHighRisk: true,
    allowThreshold: 30,
    warnThreshold: 70,
    blockThreshold: 90,
  },
  appearance: {
    theme: 'Dark',
    layout: 'Comfortable',
  },
  notifications: {
    highRiskAlerts: true,
    blockedPromptAlerts: true,
    reportAlerts: false,
    emailAlerts: true,
    alertEmail: '',
  },
  api: {
    defaultProvider: 'OpenAI',
    defaultModel: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 2048,
    timeoutSeconds: 30,
    blockBehavior: 'Block & Warning',
  },
};

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'High-risk Prompt Blocked',
    message: 'Direct injection attack signature detected and halted.',
    time: '10m ago',
    type: 'alert',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Security Telemetry Sync',
    message: 'DistilBERT V2 security inference engine active and synced.',
    time: '1h ago',
    type: 'info',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Weekly Report Generated',
    message: 'Threat detection audit report ready for review.',
    time: '1d ago',
    type: 'report',
    read: true,
  },
];

export const SETTINGS_TABS = [
  { id: 'profile', label: 'Profile', description: 'Manage your account', icon: 'User' },
  { id: 'security', label: 'Security', description: 'Detection and risk settings', icon: 'Shield' },
  { id: 'notifications', label: 'Notifications', description: 'Alerts and updates', icon: 'Bell' },
  { id: 'appearance', label: 'Appearance', description: 'Theme and display', icon: 'Monitor' },
  { id: 'api', label: 'API & Integration', description: 'Default API settings', icon: 'Plug' },
  { id: 'data', label: 'Data', description: 'Export or clear data', icon: 'Database' },
];

function safeGet(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key, value) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

function dispatchEvent(name, detail = {}) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

// ---------------- Profile ----------------
export function getProfileSettings() {
  if (typeof window === 'undefined') return EMPTY_PROFILE;

  const user = getCurrentUser();
  if (!user || (!user.username && !user.email && !user.name)) {
    return EMPTY_PROFILE;
  }

  const stored = safeGet('promptshield_profile_settings', null);
  if (stored && (stored.username === user.username || stored.email === user.email)) {
    return stored;
  }

  const username = user.username || user.name || '';
  const email = user.email || '';
  const initials = username
    ? username
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '';

  const currentProfile = {
    username,
    name: username,
    email,
    initials,
    role: user.role || '',
    plan: user.plan || '',
  };

  safeSet('promptshield_profile_settings', currentProfile);
  return currentProfile;
}

export function saveProfileSettings(profile) {
  const username = profile.username || profile.name || '';
  const initials = username
    ? username
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '';

  const updated = {
    ...profile,
    username,
    name: username,
    email: profile.email || '',
    initials,
    role: profile.role || '',
    plan: profile.plan || '',
  };

  safeSet('promptshield_profile_settings', updated);

  // Sync with current user storage if present
  if (typeof window !== 'undefined') {
    try {
      const user = getCurrentUser() || {};
      const updatedUser = { ...user, username, name: username, email: updated.email };
      localStorage.setItem('promptshield_user', JSON.stringify(updatedUser));
    } catch {}
  }

  dispatchEvent('promptshield:profile_updated', updated);
  return updated;
}

// ---------------- Security ----------------
export function getSecuritySettings() {
  return safeGet('promptshield_security_settings', DEFAULT_SETTINGS.security);
}

export function saveSecuritySettings(security) {
  safeSet('promptshield_security_settings', security);
  dispatchEvent('promptshield:security_updated', security);
  return security;
}

// ---------------- Appearance ----------------
export function getAppearanceSettings() {
  return safeGet('promptshield_appearance_settings', DEFAULT_SETTINGS.appearance);
}

export function applyAppearance(appearance) {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;

  // Theme
  const theme = appearance?.theme || 'Dark';
  if (theme === 'Light') {
    root.classList.remove('dark');
    root.classList.add('light-theme');
    root.setAttribute('data-theme', 'light');
  } else if (theme === 'Dark') {
    root.classList.remove('light-theme');
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
  } else if (theme === 'System') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      root.classList.remove('light-theme');
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light-theme');
      root.setAttribute('data-theme', 'light');
    }
  }

  // Layout
  const layout = appearance?.layout || 'Comfortable';
  root.setAttribute('data-layout', layout.toLowerCase());
}

export function saveAppearanceSettings(appearance) {
  safeSet('promptshield_appearance_settings', appearance);
  applyAppearance(appearance);
  dispatchEvent('promptshield:appearance_updated', appearance);
  return appearance;
}

// ---------------- Notifications ----------------
export function getNotificationSettings() {
  return safeGet('promptshield_notification_settings', DEFAULT_SETTINGS.notifications);
}

export function saveNotificationSettings(notifications) {
  safeSet('promptshield_notification_settings', notifications);
  dispatchEvent('promptshield:notifications_updated', notifications);
  return notifications;
}

export function getNotificationsList() {
  return safeGet('promptshield_notifications_list', DEFAULT_NOTIFICATIONS);
}

export function addNotification(item) {
  const list = getNotificationsList();
  const newItem = {
    id: `notif-${Date.now().toString(36)}`,
    title: item.title || 'Security Notification',
    message: item.message || '',
    time: 'Just now',
    type: item.type || 'alert',
    read: false,
    ...item,
  };
  const updated = [newItem, ...list].slice(0, 50);
  safeSet('promptshield_notifications_list', updated);
  dispatchEvent('promptshield:notifications_list_updated', updated);
  return updated;
}

export function markNotificationsAsRead() {
  const list = getNotificationsList().map((n) => ({ ...n, read: true }));
  safeSet('promptshield_notifications_list', list);
  dispatchEvent('promptshield:notifications_list_updated', list);
  return list;
}

export function clearNotificationsList() {
  safeSet('promptshield_notifications_list', []);
  dispatchEvent('promptshield:notifications_list_updated', []);
  return [];
}

// ---------------- API Settings ----------------
export function getApiSettings() {
  return safeGet('promptshield_api_settings', DEFAULT_SETTINGS.api);
}

export function saveApiSettings(apiConfig) {
  safeSet('promptshield_api_settings', apiConfig);
  dispatchEvent('promptshield:api_updated', apiConfig);
  return apiConfig;
}

// ---------------- Reset All ----------------
export function resetAllSettings() {
  safeSet('promptshield_security_settings', DEFAULT_SETTINGS.security);
  safeSet('promptshield_appearance_settings', DEFAULT_SETTINGS.appearance);
  safeSet('promptshield_notification_settings', DEFAULT_SETTINGS.notifications);
  safeSet('promptshield_api_settings', DEFAULT_SETTINGS.api);
  safeSet('promptshield_notifications_list', DEFAULT_NOTIFICATIONS);

  applyAppearance(DEFAULT_SETTINGS.appearance);
  dispatchEvent('promptshield:reset_all');
  return DEFAULT_SETTINGS;
}
