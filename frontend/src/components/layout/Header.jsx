'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  LogOut,
  User,
  LogIn,
  ChevronDown,
  ShieldAlert,
  AlertTriangle,
  Info,
  FileText,
  Check,
  Trash2,
  Settings as SettingsIcon,
  Sun,
  Moon,
} from 'lucide-react';
import { removeStoredToken } from '@/lib/auth';
import {
  DEFAULT_SETTINGS,
  getProfileSettings,
  getNotificationsList,
  markNotificationsAsRead,
  clearNotificationsList,
  getAppearanceSettings,
  saveAppearanceSettings,
  applyAppearance,
} from '@/lib/settings';

export function Header({ onOpenSearch }) {
  const router = useRouter();
  const [profile, setProfile] = useState(DEFAULT_SETTINGS.profile);
  const [notifications, setNotifications] = useState([]);
  const [appearance, setAppearance] = useState(DEFAULT_SETTINGS.appearance);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const syncHeaderState = () => {
      const savedAppearance = getAppearanceSettings();
      applyAppearance(savedAppearance);
      setAppearance(savedAppearance);
      setProfile(getProfileSettings());
      setNotifications(getNotificationsList());
    };

    const timer = setTimeout(syncHeaderState, 0);

    const handleStorage = () => {
      syncHeaderState();
    };

    const handleProfileUpdate = (e) => {
      if (e.detail) setProfile(e.detail);
      else setProfile(getProfileSettings());
    };

    const handleNotifUpdate = (e) => {
      if (e.detail) setNotifications(e.detail);
      else setNotifications(getNotificationsList());
    };

    const handleAppearanceUpdate = (e) => {
      if (e.detail) setAppearance(e.detail);
      else setAppearance(getAppearanceSettings());
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('promptshield:profile_updated', handleProfileUpdate);
    window.addEventListener('promptshield:notifications_list_updated', handleNotifUpdate);
    window.addEventListener('promptshield:appearance_updated', handleAppearanceUpdate);
    window.addEventListener('promptshield:reset_all', handleStorage);

    // Click outside handler
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('promptshield:profile_updated', handleProfileUpdate);
      window.removeEventListener('promptshield:notifications_list_updated', handleNotifUpdate);
      window.removeEventListener('promptshield:appearance_updated', handleAppearanceUpdate);
      window.removeEventListener('promptshield:reset_all', handleStorage);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleTheme = () => {
    const currentTheme = appearance?.theme || 'Dark';
    const newTheme = currentTheme === 'Light' ? 'Dark' : 'Light';
    const updated = { ...appearance, theme: newTheme };
    setAppearance(updated);
    saveAppearanceSettings(updated);
  };

  const handleLogout = () => {
    removeStoredToken();
    setProfile(getProfileSettings());
    setDropdownOpen(false);
    router.push('/login');
  };

  const handleMarkAllRead = () => {
    const updated = markNotificationsAsRead();
    setNotifications(updated);
  };

  const handleClearNotifications = () => {
    const updated = clearNotificationsList();
    setNotifications(updated);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayName = profile?.username || profile?.name || '';
  const displayRole = profile?.role || profile?.plan || '';
  const initials = profile?.initials || (displayName ? displayName.slice(0, 2).toUpperCase() : '');
  const isLight = appearance?.theme === 'Light';

  return (
    <header className="h-16 px-8 border-b border-[#26131c] bg-[#0b080e]/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Search Bar matching wireframe */}
      <div className="w-full max-w-md">
        <div
          onClick={onOpenSearch}
          className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-[#140c17] border border-[#2c1622] hover:border-rose-500/40 text-slate-400 cursor-pointer transition-all shadow-inner group"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-rose-300" />
          <span className="text-xs text-slate-400 group-hover:text-rose-200 flex-1 select-none">
            Search scans, prompts, reports...
          </span>
          <kbd className="text-[10px] font-medium tracking-wide bg-[#220f1e] border border-rose-900/40 px-2 py-0.5 rounded text-rose-300">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* Right User Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Theme Toggle */}
        <button
          type="button"
          onClick={handleToggleTheme}
          aria-label={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer flex items-center justify-center border border-transparent hover:border-slate-700/60"
          title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {isLight ? (
            <Sun className="w-5 h-5 text-amber-500 transition-transform hover:rotate-45" />
          ) : (
            <Moon className="w-5 h-5 text-blue-400 transition-transform hover:-rotate-12" />
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1a0e1c] transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f43f5e] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#e11d48] ring-2 ring-[#0b080e]"></span>
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#130a15] border border-[#2c1622] shadow-2xl shadow-black z-50 overflow-hidden animate-fade-in">
              <div className="p-3.5 border-b border-[#2c1622] flex items-center justify-between bg-[#0e0710]/90">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-white tracking-tight">Security Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-[#f57b83] border border-rose-500/30">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="p-1 text-slate-400 hover:text-emerald-400 transition-colors rounded hover:bg-slate-800/60"
                      title="Mark all as read"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={handleClearNotifications}
                      className="p-1 text-slate-400 hover:text-rose-400 transition-colors rounded hover:bg-slate-800/60"
                      title="Clear notifications"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No active notifications.
                  </div>
                ) : (
                  notifications.map((item) => {
                    const isAlert = item.type === 'alert';
                    const isWarn = item.type === 'warning';
                    const isReport = item.type === 'report';

                    return (
                      <div
                        key={item.id}
                        className={`p-3 text-xs transition-colors flex items-start gap-3 ${
                          !item.read ? 'bg-blue-600/5' : 'hover:bg-slate-800/30'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center mt-0.5 ${
                            isAlert
                              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                              : isWarn
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              : isReport
                              ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                              : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {isAlert && <ShieldAlert className="w-3.5 h-3.5" />}
                          {isWarn && <AlertTriangle className="w-3.5 h-3.5" />}
                          {isReport && <FileText className="w-3.5 h-3.5" />}
                          {!isAlert && !isWarn && !isReport && <Info className="w-3.5 h-3.5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-semibold text-white truncate block">
                              {item.title}
                            </span>
                            <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                              {item.time}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                            {item.message}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="p-2 border-t border-[#2c1622] bg-[#0e0710]/90 flex items-center justify-between text-[11px]">
                <Link
                  href="/security-logs"
                  onClick={() => setNotifOpen(false)}
                  className="text-slate-400 hover:text-[#f57b83] transition-colors px-2 py-1"
                >
                  View Audit Logs
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setNotifOpen(false)}
                  className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors px-2 py-1"
                >
                  <SettingsIcon className="w-3 h-3 text-[#f57b83]" />
                  <span>Configure</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 pl-2 border-l border-[#26131c] cursor-pointer select-none group"
          >
            <div
              suppressHydrationWarning
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#be123c] to-[#6a1a24] flex items-center justify-center text-xs font-bold text-white shadow-md shadow-rose-950/40 group-hover:ring-2 group-hover:ring-rose-500/50 transition-all select-none"
            >
              {initials || <User className="w-4 h-4 text-white/80" />}
            </div>
            <div className="flex flex-col text-left">
              <span suppressHydrationWarning className="text-xs font-semibold text-slate-200 group-hover:text-white leading-tight">
                {displayName || 'Account'}
              </span>
              {displayRole && (
                <span suppressHydrationWarning className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">
                  {displayRole}
                </span>
              )}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-transform" />
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#130a15] border border-[#2c1622] shadow-2xl shadow-black py-1.5 z-40 animate-fade-in">
              <div className="px-3.5 py-2.5 border-b border-[#2c1622] text-xs">
                <span className="text-slate-400 block text-[10px]">Signed in as</span>
                <span className="text-white font-semibold truncate block mt-0.5">
                  {profile?.email}
                </span>
              </div>

              <Link
                href="/settings"
                onClick={() => setDropdownOpen(false)}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-300 hover:bg-[#1f0f1f] transition-colors"
              >
                <SettingsIcon className="w-3.5 h-3.5 text-[#f57b83]" />
                <span>Account Settings</span>
              </Link>

              <Link
                href="/login"
                onClick={() => setDropdownOpen(false)}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-300 hover:bg-[#1f0f1f] transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-[#f57b83]" />
                <span>Switch / Login</span>
              </Link>

              <Link
                href="/register"
                onClick={() => setDropdownOpen(false)}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-300 hover:bg-[#1f0f1f] transition-colors"
              >
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>Create New Account</span>
              </Link>

              <div className="border-t border-[#2c1622] my-1" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
