'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Lock } from 'lucide-react';

export function ProfileCard({
  profile,
  onProfileChange,
  onChangePassword,
}) {
  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl flex flex-col justify-between">
      <div>
        <h2 className="text-sm font-bold text-white tracking-tight">
          Profile
        </h2>
        <p className="text-xs text-slate-400 mt-0.5 mb-5">
          View and update your profile information.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-5">
          {/* Large Avatar */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 text-white font-bold text-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 shrink-0 select-none">
            {profile.initials}
          </div>

          <div className="flex-1 space-y-3 w-full">
            {/* Name */}
            <div>
              <label className="text-[11px] font-medium text-slate-400 block mb-1">
                Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => onProfileChange('name', e.target.value)}
                className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-[11px] font-medium text-slate-400 block mb-1">
                Email
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => onProfileChange('email', e.target.value)}
                className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Change Password Button */}
        <div>
          <button
            type="button"
            onClick={onChangePassword}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#080d19] border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all active:scale-95 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Change Password</span>
          </button>
        </div>
      </div>
    </Card>
  );
}
