'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Minus, Plus, Search, ShieldAlert, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export function DocumentPreviewCard({ selectedChunk, sanitized = false }) {
  const [activeTab, setActiveTab] = useState('flagged');
  const [zoom, setZoom] = useState(100);

  if (!selectedChunk) {
    return (
      <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl h-full flex flex-col justify-center items-center text-center min-h-[300px]">
        <div className="w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-500 mb-2">
          <Search className="w-5 h-5" />
        </div>
        <h3 className="text-xs font-semibold text-slate-300 mb-1">No Chunk Selected</h3>
        <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">
          Select any suspicious chunk from the table to preview its full text, detected injection vectors, and remediation guidance.
        </p>
      </Card>
    );
  }

  const page = selectedChunk.page || 1;
  const chunkText = selectedChunk.fullText || selectedChunk.preview || '';
  const detectedVectors = selectedChunk.detectedVectors || [];

  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl h-full flex flex-col justify-between">
      <div>
        {/* Header with Mode Tabs */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white">Document Chunk Inspector</h2>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('flagged')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'flagged'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Threat Analysis
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('raw')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'raw'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Raw Chunk
            </button>
          </div>
        </div>

        {/* Reader Toolbar */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 mb-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-slate-300 font-semibold">
              Chunk #{selectedChunk.chunkNumber || selectedChunk.id} (Page {page})
            </span>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(z - 10, 60))}
              className="p-1 hover:text-white transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] text-slate-300">{zoom}%</span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(z + 10, 160))}
              className="p-1 hover:text-white transition-colors cursor-pointer"
              title="Zoom In"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Classification Tag */}
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${selectedChunk.categoryColor || 'bg-slate-800 text-slate-300'}`}>
              Risk: {selectedChunk.riskScore}/100
            </span>
          </div>
        </div>

        {/* Threat Vectors Banner */}
        {detectedVectors.length > 0 && activeTab === 'flagged' && (
          <div className="mb-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-300">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>Identified Injection Vectors ({detectedVectors.length}):</span>
            </div>
            <div className="flex flex-wrap gap-1 pt-0.5">
              {detectedVectors.map((vec, i) => (
                <span
                  key={i}
                  className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-rose-950/60 border border-rose-800/50 text-rose-200"
                >
                  {vec}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recommendation Box */}
        {selectedChunk.recommendation && (
          <div className="mb-3 p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-400 font-medium">Remediation: </span>
              <span>{selectedChunk.recommendation}</span>
            </div>
          </div>
        )}

        {/* Document Page Canvas */}
        <div
          className="p-4 sm:p-5 rounded-2xl bg-[#080d19] text-slate-200 shadow-inner min-h-[160px] border border-slate-800 font-mono text-xs leading-relaxed max-h-[320px] overflow-y-auto"
          style={{ fontSize: `${(zoom / 100) * 12}px` }}
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <span className="font-bold text-white text-xs">
              Category: {selectedChunk.category || 'Direct Evaluation'}
            </span>
            <span className="text-[10px] text-slate-400">
              Status: {sanitized ? 'Sanitized' : (selectedChunk.action || 'FLAGGED')}
            </span>
          </div>

          <div className="space-y-3">
            {sanitized ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 italic">
                [PROMPTSHIELD REDACTED INJECTION] (Risk Score: {selectedChunk.riskScore}, Vector: {selectedChunk.category})
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 whitespace-pre-wrap select-text leading-relaxed">
                {chunkText}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
