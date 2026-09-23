'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Mail, AlertTriangle, BarChart3 } from 'lucide-react';

export function NotificationsCard({
  notifications,
  onNotificationChange,
}) {
  const items = [
    {
      key: 'highRiskAlerts',
      title: 'High-risk attack alerts',
      desc: 'Get notified about blocked or high-risk prompts',
      icon: Mail,
      enabled: notifications.highRiskAlerts,
    },
    {
      key: 'blockedPromptAlerts',
      title: 'Blocked prompt notifications',
      desc: 'Get notified when a prompt is blocked',
      icon: AlertTriangle,
      enabled: notifications.blockedPromptAlerts,
    },
    {
      key: 'reportAlerts',
      title: 'Report notifications',
      desc: 'Get notified when a new report is ready',
      icon: BarChart3,
      enabled: notifications.reportAlerts,
    },
  ];

  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl flex flex-col justify-between">
      <div>
        <h2 className="text-sm font-bold text-white tracking-tight">
          Notifications
        </h2>
        <p className="text-xs text-slate-400 mt-0.5 mb-4">
          Choose what notifications you want to receive.
        </p>

        <div className="space-y-3">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                className="flex items-center justify-between p-3 rounded-xl bg-[#080d19]/80 border border-slate-800/80"
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
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors relative cursor-pointer ${
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
        </div>
      </div>
    </Card>
  );
}
