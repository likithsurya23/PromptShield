'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { User, Shield, Bell, Monitor, Plug, Database } from 'lucide-react';

export function SettingsNavTabs({ activeTab, onTabChange }) {
  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
      description: 'Manage your account',
      icon: User,
    },
    {
      id: 'security',
      label: 'Security',
      description: 'Detection and risk settings',
      icon: Shield,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      description: 'Alerts and updates',
      icon: Bell,
    },
    {
      id: 'appearance',
      label: 'Appearance',
      description: 'Theme and display',
      icon: Monitor,
    },
    {
      id: 'api',
      label: 'API & Integration',
      description: 'Default API settings',
      icon: Plug,
    },
    {
      id: 'data',
      label: 'Data',
      description: 'Export or clear data',
      icon: Database,
    },
  ];

  return (
    <Card className="p-2 border-slate-800/80 bg-[#0c1222]/80 shadow-xl space-y-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all cursor-pointer ${
              isActive
                ? 'bg-blue-600/15 border border-blue-500/40 text-white'
                : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div
              className={`p-1.5 rounded-lg mt-0.5 shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <h4
                className={`text-xs font-semibold leading-tight ${
                  isActive ? 'text-white font-bold' : 'text-slate-200'
                }`}
              >
                {tab.label}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
                {tab.description}
              </p>
            </div>
          </button>
        );
      })}
    </Card>
  );
}
