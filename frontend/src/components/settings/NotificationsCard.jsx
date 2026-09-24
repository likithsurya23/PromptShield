'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Mail, AlertTriangle, BarChart3, BellRing, Send, Check } from 'lucide-react';

export function NotificationsCard({
  notifications,
  onNotificationChange,
  onSendTestNotification,
  onSaveNotifications,
}) {
  const items = [
    {
      key: 'highRiskAlerts',
      title: 'High-risk attack alerts',
      desc: 'Get notified in real-time about prompts flagged with high risk',
      icon: AlertTriangle,
      enabled: notifications.highRiskAlerts,
    },
    {
      key: 'blockedPromptAlerts',
      title: 'Blocked prompt notifications',
      desc: 'Instant alerts when PromptShield firewall blocks malicious injection',
      icon: BellRing,
      enabled: notifications.blockedPromptAlerts,
    },
    {
      key: 'reportAlerts',
      title: 'Weekly & monthly report notifications',
      desc: 'Receive digest notifications when audit reports are compiled',
      icon: BarChart3,
      enabled: notifications.reportAlerts,
    },
    {
      key: 'emailAlerts',
      title: 'Email alert notifications',
      desc: 'Forward critical incidents to your configured security inbox',
      icon: Mail,
      enabled: notifications.emailAlerts ?? true,
    },
  ];

  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-0.5">
          <h2 className="text-sm font-bold text-white tracking-tight">
            Notifications & Alerts
          </h2>
          <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
            Multi-Channel
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Configure security alert triggers, communication channels, and test alerts.
        </p>

        <div className="space-y-3">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                className="flex items-center justify-between p-3 rounded-xl bg-[#080d19]/80 border border-slate-800/80 transition-all hover:border-slate-700/80"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white tracking-tight">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Toggle switch */}
                <button
                  type="button"
                  onClick={() => onNotificationChange(item.key, !item.enabled)}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors relative cursor-pointer shrink-0 ml-3 ${
                    item.enabled ? 'bg-blue-600' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${
                      item.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            );
          })}

          {/* Email Recipient Input */}
          <div className="p-3 rounded-xl bg-[#080d19]/80 border border-slate-800/80 space-y-1.5">
            <label className="text-[11px] font-medium text-slate-300 block">
              Alert Destination Email
            </label>
            <div className="flex items-center gap-2">
              <input
                type="email"
                value={notifications.alertEmail || ''}
                onChange={(e) => onNotificationChange('alertEmail', e.target.value)}
                placeholder="alerts@company.com"
                className="flex-1 bg-[#0c1222] border border-slate-800 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onSendTestNotification}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#080d19] border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all active:scale-95 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-blue-400" />
            <span>Send Test Alert</span>
          </button>

          <button
            type="button"
            onClick={onSaveNotifications}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/25 transition-all active:scale-95 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </Card>
  );
}
