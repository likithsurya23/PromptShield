'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { DocumentUploadCard } from '@/components/rag/DocumentUploadCard';
import { ScanConfigCard } from '@/components/rag/ScanConfigCard';
import { ScanProgressCard } from '@/components/rag/ScanProgressCard';
import { ScanResultsOverview } from '@/components/rag/ScanResultsOverview';
import { RiskBreakdownDonut } from '@/components/rag/RiskBreakdownDonut';
import { SuspiciousChunksTable } from '@/components/rag/SuspiciousChunksTable';
import { DocumentPreviewCard } from '@/components/rag/DocumentPreviewCard';
import { RemediationFooter } from '@/components/rag/RemediationFooter';
import { INITIAL_RAG_DATA } from '@/lib/rag';
import { FileText, BookOpen } from 'lucide-react';

export default function RagSecurityPage() {
  const [data, setData] = useState(INITIAL_RAG_DATA);
  const [file, setFile] = useState(INITIAL_RAG_DATA.document);
  const [config, setConfig] = useState(INITIAL_RAG_DATA.config);
  const [progress, setProgress] = useState(INITIAL_RAG_DATA.progress);
  const [scanning, setScanning] = useState(false);
  const [selectedChunk, setSelectedChunk] = useState(INITIAL_RAG_DATA.suspiciousChunks[0]);
  const [sanitized, setSanitized] = useState(false);

  const handleScan = () => {
    setScanning(true);
    setProgress({ ...progress, percent: 30, status: 'Scanning...' });

    setTimeout(() => {
      setProgress({ ...progress, percent: 65, status: 'Scanning...' });
    }, 600);

    setTimeout(() => {
      setProgress({
        ...progress,
        percent: 100,
        status: 'Completed',
        steps: progress.steps.map((s) => ({ ...s, status: 'completed' })),
      });
      setScanning(false);
    }, 1200);
  };

  const handleSanitize = () => {
    setSanitized(true);
  };

  const handleDownloadReport = () => {
    const reportData = {
      document: file?.name,
      results: data.results,
      suspicious_chunks: data.suspiciousChunks,
      sanitized,
      exported_at: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rag-security-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              RAG Security
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Analyze documents and knowledge bases for hidden prompt injection attacks.
            </p>
          </div>
        </div>

        <div>
          <Link
            href="/docs"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0f172a] border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 transition-colors shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>View Documentation</span>
          </Link>
        </div>
      </div>

      {/* Top 3-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5 items-stretch">
        <div className="lg:col-span-4">
          <DocumentUploadCard
            file={file}
            setFile={setFile}
            onScan={handleScan}
            scanning={scanning}
          />
        </div>
        <div className="lg:col-span-4">
          <ScanConfigCard config={config} setConfig={setConfig} />
        </div>
        <div className="lg:col-span-4">
          <ScanProgressCard progress={progress} />
        </div>
      </div>

      {/* Middle 2-Column Section: Scan Results & Risk Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5 items-stretch">
        <div className="lg:col-span-7">
          <ScanResultsOverview results={data.results} />
        </div>
        <div className="lg:col-span-5">
          <RiskBreakdownDonut
            riskScore={data.results.documentRisk}
            breakdown={data.results.riskBreakdown}
          />
        </div>
      </div>

      {/* Bottom Section: Suspicious Chunks & Document Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-6">
          <SuspiciousChunksTable
            chunks={data.suspiciousChunks}
            selectedChunkId={selectedChunk?.id}
            onSelectChunk={(chunk) => setSelectedChunk(chunk)}
          />
        </div>
        <div className="lg:col-span-6">
          <DocumentPreviewCard
            selectedChunk={selectedChunk}
            sanitized={sanitized}
          />
        </div>
      </div>

      {/* Action Footer */}
      <RemediationFooter
        onSanitize={handleSanitize}
        onDownloadReport={handleDownloadReport}
        onRescan={handleScan}
        sanitized={sanitized}
      />
    </AppShell>
  );
}
