'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Lock, Save, CheckCircle2, X, Eye, EyeOff } from 'lucide-react';

export function ProfileCard({
  profile,
  onProfileChange,
  onSaveProfile,
  onChangePassword,
}) {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);

  const displayUser = profile?.username || profile?.name || '';
  const initials = displayUser
    ? displayUser
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
    : '';

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassError('');

    if (!currentPassword) {
      setPassError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      setPassError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match.');
      return;
    }

    try {
      if (onChangePassword) {
        await onChangePassword(currentPassword, newPassword);
      }
      setPassSuccess(true);
      setTimeout(() => {
        setPassSuccess(false);
        setIsPasswordModalOpen(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }, 1000);
    } catch (err) {
      setPassError(err.message || 'Failed to update password.');
    }
  };

  return (
    <Card className="p-5 border-[#2c1622] bg-[#120a14]/85 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-0.5">
          <h2 className="text-sm font-bold text-white tracking-tight">Profile</h2>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          View and update your personal information.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-5">
          <div className="flex-1 space-y-3 w-full">
            {/* Username */}
            <div>
              <label className="text-[11px] font-medium text-slate-400 block mb-1">
                Username
              </label>
              <input
                type="text"
                value={profile.username || profile.name || ''}
                onChange={(e) => {
                  onProfileChange('username', e.target.value);
                  onProfileChange('name', e.target.value);
                }}
                placeholder="Enter your username"
                className="w-full bg-[#140c17] border border-[#2c1622] rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-[11px] font-medium text-slate-400 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={profile.email || ''}
                onChange={(e) => onProfileChange('email', e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-[#140c17] border border-[#2c1622] rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#2c1622] w-full">
          <button
            type="button"
            onClick={onSaveProfile}
            className="w-full min-h-[40px] inline-flex items-center justify-center gap-1.5 px-2 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#f43f5e] via-[#e11d48] to-[#881337] hover:opacity-95 text-white text-[11px] sm:text-xs font-semibold shadow-lg shadow-rose-950/40 transition-all active:scale-95 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Save Profile</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPasswordModalOpen(true)}
            className="w-full min-h-[40px] inline-flex items-center justify-center gap-1.5 px-2 sm:px-4 py-2 rounded-xl bg-[#140c17] border border-[#2c1622] hover:border-rose-500/40 text-slate-300 hover:text-white text-[11px] sm:text-xs font-semibold transition-all active:scale-95 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">Change Password</span>
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#130a15] border border-[#2c1622] rounded-2xl shadow-2xl p-4 sm:p-6 text-left relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-[#1f0f1f] transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4 pr-8">
              <div className="w-9 h-9 rounded-xl bg-[#1a0e1c] border border-rose-500/25 text-[#f57b83] flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Update Password</h3>
                <p className="text-xs text-slate-400">
                  Ensure your account is protected with a secure password.
                </p>
              </div>
            </div>

            {passSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-3 text-xs my-4">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Password updated successfully! Closing...</span>
              </div>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-3.5 mt-4">
                {passError && (
                  <div className="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs">
                    {passError}
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-medium text-slate-300 block mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-2 px-3 pr-10 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-300 block mb-1">
                    New Password
                  </label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-300 block mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 w-full">
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="w-full min-h-[40px] flex items-center justify-center px-2 sm:px-4 py-2 rounded-xl bg-[#080d19] border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full min-h-[40px] flex items-center justify-center px-2 sm:px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors shadow-md shadow-blue-600/30"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
