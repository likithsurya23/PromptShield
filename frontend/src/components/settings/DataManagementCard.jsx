'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Download, Trash2, RotateCcw, AlertTriangle, Loader2 } from 'lucide-react';

export function DataManagementCard({
  onExportData,
  onClearData,
  onResetAllSettings,
  onDeleteAccount,
  isExporting = false,
  isClearing = false,
  isDeleting = false,
}) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-0.5">
          <h2 className="text-sm font-bold text-white tracking-tight">
            Data & Privacy Management
          </h2>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 border border-slate-700 px-2 py-0.5 rounded-full">
            Local & Cloud Storage
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Export audit records, clear telemetry logs, or reset configurations.
        </p>

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Export Scan History */}
            <button
              type="button"
              onClick={onExportData}
              disabled={isExporting}
              className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#080d19] border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isExporting ? (
                <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5 text-blue-400" />
              )}
              <span>{isExporting ? 'Exporting Logs...' : 'Export Audit Logs'}</span>
            </button>

            {/* Clear Scan History */}
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              disabled={isClearing}
              className="w-full sm:w-1/2 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-rose-950/20 border border-rose-800/40 hover:border-rose-600 hover:bg-rose-950/40 text-xs font-semibold text-rose-400 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isClearing ? (
                <Loader2 className="w-3.5 h-3.5 text-rose-400 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              )}
              <span>{isClearing ? 'Purging Logs...' : 'Clear Audit Logs'}</span>
            </button>
          </div>

          {/* Reset All Settings to Factory Defaults */}
          <div className="pt-2 border-t border-slate-800/60">
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#080d19]/60 border border-slate-800 hover:border-slate-700 text-xs text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset All System Settings to Defaults</span>
            </button>
          </div>

          {/* Delete Account */}
          <div className="pt-3 border-t border-rose-950/50">
            <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-rose-400 block tracking-tight">
                   Delete Account
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Permanently delete your account, credentials, and all associated scan records from the database.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-950/50 transition-all active:scale-95 cursor-pointer disabled:opacity-50 shrink-0"
              >
                {isDeleting ? (
                  <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5 text-white" />
                )}
                <span>{isDeleting ? 'Deleting...' : 'Delete Account'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal: Clear History */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl p-5 text-left">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Purge Scan History?</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              This will permanently delete all recorded scan logs from memory and database storage. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-3.5 py-1.5 rounded-xl bg-[#080d19] border border-slate-800 text-xs text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowClearConfirm(false);
                  onClearData();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white transition-colors"
              >
                Yes, Purge All Logs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Reset All Settings */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl p-5 text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-3">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Reset All Settings?</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              This will restore profile, risk thresholds, appearance theme, notification preferences, and API configuration to original default values.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-1.5 rounded-xl bg-[#080d19] border border-slate-800 text-xs text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResetConfirm(false);
                  onResetAllSettings();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-semibold text-white transition-colors"
              >
                Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Delete Account Permanently */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#0f172a] border border-rose-500/30 rounded-2xl shadow-2xl p-5 text-left">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mb-3.5 shadow-lg shadow-rose-950/40">
              <AlertTriangle className="w-6 h-6 stroke-[2]" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5 tracking-tight">
              Permanently Delete Account?
            </h3>
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              This action is <span className="text-rose-400 font-semibold">permanent and irreversible</span>. When confirmed, your user account, stored authentication credentials, API configurations, and all associated scan audit records will be completely deleted from the database.
            </p>
            <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-900/50 text-[11px] text-rose-300 font-medium mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>You will be immediately logged out and returned to the sign-in page.</span>
            </div>
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#080d19] border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  setShowDeleteConfirm(false);
                  if (onDeleteAccount) {
                    await onDeleteAccount();
                  }
                }}
                disabled={isDeleting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-rose-700 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-rose-950/60 transition-all active:scale-95 cursor-pointer"
              >
                {isDeleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>Yes, Permanently Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
