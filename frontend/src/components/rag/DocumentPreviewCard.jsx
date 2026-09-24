'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Minus, Plus, Search } from 'lucide-react';

export function DocumentPreviewCard({ selectedChunk, sanitized = false }) {
  const [activeTab, setActiveTab] = useState('original');
  const [zoom, setZoom] = useState(100);

  if (!selectedChunk) {
    return (
      <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl h-full flex flex-col justify-center items-center text-center min-h-[300px]">
        <div className="w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-500 mb-2">
          <Search className="w-5 h-5" />
        </div>
        <h3 className="text-xs font-semibold text-slate-300 mb-1">No Chunk Selected</h3>
        <p className="text-[11px] text-slate-500 max-w-xs">
          Select a chunk from the table on the left to preview its content and security classification.
        </p>
      </Card>
    );
  }

  const page = selectedChunk.page || 1;
  const chunkText = selectedChunk.fullText || selectedChunk.preview || '';

  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl h-full flex flex-col justify-between">
      <div>
        {/* Header with Mode Tabs */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white">Document Preview</h2>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('original')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                activeTab === 'original'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Original
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('flagged')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                activeTab === 'flagged'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Flagged Chunks
            </button>
          </div>
        </div>

        {/* Reader Toolbar */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 mb-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-slate-300">
              Chunk #{selectedChunk.chunkNumber || selectedChunk.id} (Page {page})
            </span>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(z - 10, 50))}
              className="p-1 hover:text-white transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] text-slate-300">{zoom}%</span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(z + 10, 150))}
              className="p-1 hover:text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Classification Tag */}
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${selectedChunk.categoryColor || 'bg-slate-800 text-slate-300'}`}>
              Risk: {selectedChunk.riskScore}
            </span>
          </div>
        </div>

        {/* Document Page Canvas */}
        <div
          className="p-6 rounded-2xl bg-[#080d19] text-slate-200 shadow-inner min-h-[200px] border border-slate-800 font-mono text-xs leading-relaxed"
          style={{ fontSize: `${(zoom / 100) * 12}px` }}
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <span className="font-bold text-white">
              Category: {selectedChunk.category || 'Direct Evaluation'}
            </span>
            <span className="text-[10px] text-slate-400">
              Status: {sanitized ? 'Sanitized' : 'Threat Flagged'}
            </span>
          </div>

          <div className="space-y-3">
            {sanitized ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 italic">
                [REDACTED BY PROMPTSHIELD: Malicious payload sanitized]
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 whitespace-pre-wrap">
                {chunkText}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
