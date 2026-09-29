'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { X, FileText, Sparkles, Loader2 } from 'lucide-react';

import { generateSecurityReport } from '@/lib/reports';

export function GenerateReportModal({ isOpen, onClose, onCreated }) {
  const [name, setName] = useState('Ad-hoc Threat Audit');
  const [type, setType] = useState('Security Scan');
  const [dateRange, setDateRange] = useState('Past 7 Days');
  const [format, setFormat] = useState('JSON');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const newReport = await generateSecurityReport({
        name: name || 'Custom Security Report',
        type,
        format,
        dateRange,
      });
      onCreated(newReport);
      onClose();
    } catch (err) {
      console.error('Failed to generate report:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <Card className="w-full max-w-lg p-4 sm:p-6 bg-[#0c1222] border-slate-700/80 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3.5 top-3.5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5 pr-8">
          <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Generate New Report
            </h3>
            <p className="text-xs text-slate-400">
              Customize data sources, time period, and output format.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Report Title
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Executive Summary"
              className="w-full bg-[#080d19] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Report Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-[#080d19] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option>Security Scan</option>
                <option>Threat Analysis</option>
                <option>Model Usage</option>
                <option>RAG Security</option>
                <option>Attack Simulation</option>
                <option>System Activity</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full bg-[#080d19] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option>PDF</option>
                <option>CSV</option>
                <option>JSON</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Time Period
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full bg-[#080d19] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option>Sep 15, 2026 - Sep 21, 2026</option>
              <option>Sep 01, 2026 - Sep 21, 2026</option>
              <option>Last 30 Days</option>
              <option>Year to Date</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800 w-full">
            <button
              type="button"
              onClick={onClose}
              className="w-full min-h-[40px] flex items-center justify-center px-2 sm:px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full min-h-[40px] inline-flex items-center justify-center gap-1.5 px-2 sm:px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/25 transition-all active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                  <span className="truncate">Compiling...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Generate Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
