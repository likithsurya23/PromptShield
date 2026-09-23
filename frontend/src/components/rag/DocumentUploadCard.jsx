'use client';

import React, { useRef } from 'react';
import { Card } from '@/components/ui/Card';
import { UploadCloud, FileText, X, ArrowRight } from 'lucide-react';

export function DocumentUploadCard({
  file,
  setFile,
  onScan,
  scanning,
}) {
  const fileInputRef = useRef(null);

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const f = e.dataTransfer.files[0];
      setFile({
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
        pages: 12,
      });
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile({
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
        pages: 12,
      });
    }
  };

  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl h-full flex flex-col justify-between">
      <div>
        <h2 className="text-sm font-semibold text-white mb-1">
          1. Upload Document
        </h2>
        <p className="text-[11px] text-slate-400 mb-3.5 leading-relaxed">
          Upload a document to scan for indirect prompt injections and malicious content.
        </p>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border border-dashed border-slate-700/80 hover:border-blue-500/60 rounded-xl p-5 text-center cursor-pointer transition-colors bg-[#080d19]/60 group mb-3"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".pdf,.docx,.txt,.md"
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center gap-1.5">
            <UploadCloud className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-semibold text-white">
              Drag and drop your file here
            </div>
            <div className="text-[10px] text-slate-400">or click to browse</div>
            <div className="text-[9px] text-slate-500 mt-1">
              Supported formats: PDF, DOCX, TXT, MD (Max size: 10MB)
            </div>
          </div>
        </div>

        {/* Uploaded File Card */}
        {file && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white truncate max-w-[180px]">
                  {file.name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {file.size}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
              className="p-1 text-slate-400 hover:text-rose-400 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={onScan}
        disabled={scanning || !file}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-900/40 transition-all disabled:opacity-50 cursor-pointer"
      >
        {scanning ? (
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <span>Scan Document</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </>
        )}
      </button>
    </Card>
  );
}
