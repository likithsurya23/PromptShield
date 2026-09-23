'use client';

// Default Settings state matching wireframe
export const DEFAULT_SETTINGS = {
  profile: {
    name: 'Likith D',
    email: 'likithd@example.com',
    initials: 'LD',
    role: 'Administrator',
    plan: 'Free Plan',
  },
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
    theme: 'Dark', // 'Light' | 'Dark' | 'System'
    layout: 'Comfortable', // 'Comfortable' | 'Compact'
  },
  notifications: {
    highRiskAlerts: true,
    blockedPromptAlerts: true,
    reportAlerts: false,
  },
};

// Navigation tab items matching wireframe
export const SETTINGS_TABS = [
  { id: 'profile', label: 'Profile', description: 'Manage your account', icon: 'User' },
  { id: 'security', label: 'Security', description: 'Detection and risk settings', icon: 'Shield' },
  { id: 'notifications', label: 'Notifications', description: 'Alerts and updates', icon: 'Bell' },
  { id: 'appearance', label: 'Appearance', description: 'Theme and display', icon: 'Monitor' },
  { id: 'api', label: 'API & Integration', description: 'Default API settings', icon: 'Plug' },
  { id: 'data', label: 'Data', description: 'Export or clear data', icon: 'Database' },
];
