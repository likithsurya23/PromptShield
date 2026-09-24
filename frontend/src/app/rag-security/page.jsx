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
import { scanDocumentChunks, sanitizeDocument } from '@/lib/rag';
import { FileText, BookOpen, CheckCircle2 } from 'lucide-react';

export default function RagSecurityPage() {
  const [data, setData] = useState(null);
  const [file, setFile] = useState(null);
  const [config, setConfig] = useState({
    chunkSize: 400,
    chunkOverlap: 50,
    detectionMode: 'Standard (Recommended)',
    detectIndirect: true,
    detectObfuscated: true,
    analyzeLinks: false,
  });
  const [progress, setProgress] = useState({
    percent: 0,
    status: 'Ready',
    steps: [
      { id: 1, title: 'Document Parsing', status: 'pending' },
      { id: 2, title: 'Chunk Segmentation', status: 'pending' },
      { id: 3, title: 'DistilBERT Neural Classification', status: 'pending' },
      { id: 4, title: 'Rule & Heuristic Checks', status: 'pending' },
      { id: 5, title: 'Risk Aggregation', status: 'pending' },
    ],
  });
  const [scanning, setScanning] = useState(false);
  const [selectedChunk, setSelectedChunk] = useState(null);
  const [sanitized, setSanitized] = useState(false);
  const [sanitizedText, setSanitizedText] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleScan = async () => {
    if (!file || !file.text) {
      showToast('Please upload a document or click "Load Sample" before scanning.');
      return;
    }

    setScanning(true);
    setSanitized(false);
    setProgress({
      percent: 25,
      status: 'Parsing document...',
      steps: [
        { id: 1, title: 'Document Parsing', status: 'in-progress' },
        { id: 2, title: 'Chunk Segmentation', status: 'pending' },
        { id: 3, title: 'DistilBERT Neural Classification', status: 'pending' },
        { id: 4, title: 'Rule & Heuristic Checks', status: 'pending' },
        { id: 5, title: 'Risk Aggregation', status: 'pending' },
      ],
    });

    try {
      setProgress((p) => ({
        ...p,
        percent: 50,
        status: 'Segmenting document chunks...',
        steps: [
          { id: 1, title: 'Document Parsing', status: 'completed' },
          { id: 2, title: 'Chunk Segmentation', status: 'in-progress' },
          { id: 3, title: 'DistilBERT Neural Classification', status: 'pending' },
          { id: 4, title: 'Rule & Heuristic Checks', status: 'pending' },
          { id: 5, title: 'Risk Aggregation', status: 'pending' },
        ],
      }));

      const scanResult = await scanDocumentChunks(file.name, file.text, config);

      setProgress((p) => ({
        ...p,
        percent: 85,
        status: 'Neural classification complete...',
        steps: [
          { id: 1, title: 'Document Parsing', status: 'completed' },
          { id: 2, title: 'Chunk Segmentation', status: 'completed' },
          { id: 3, title: 'DistilBERT Neural Classification', status: 'completed' },
          { id: 4, title: 'Rule & Heuristic Checks', status: 'completed' },
          { id: 5, title: 'Risk Aggregation', status: 'in-progress' },
        ],
      }));

      setData(scanResult);
      if (scanResult.suspiciousChunks?.length > 0) {
        setSelectedChunk(scanResult.suspiciousChunks[0]);
        showToast(
          `Scan completed: Found ${scanResult.suspiciousChunks.length} suspicious injection chunk(s).`
        );
      } else {
        setSelectedChunk(null);
        showToast('Scan completed: Document is clean of prompt injection threats.');
      }

      setProgress({
        percent: 100,
        status: 'Completed',
        steps: [
          { id: 1, title: 'Document Parsing', status: 'completed' },
          { id: 2, title: 'Chunk Segmentation', status: 'completed' },
          { id: 3, title: 'DistilBERT Neural Classification', status: 'completed' },
          { id: 4, title: 'Rule & Heuristic Checks', status: 'completed' },
          { id: 5, title: 'Risk Aggregation', status: 'completed' },
        ],
      });
    } catch (err) {
      console.error('RAG scan failed:', err);
      setProgress((p) => ({ ...p, status: 'Error scanning document' }));
      showToast('Scan failed: ' + err.message);
    } finally {
      setScanning(false);
    }
  };

  const handleSanitize = () => {
    if (!file || !data?.suspiciousChunks?.length) {
      showToast('No suspicious chunks to sanitize.');
      return;
    }

    const cleaned = sanitizeDocument(file.text, data.suspiciousChunks);
    setSanitizedText(cleaned);
    setSanitized(true);

    // Auto-download sanitized version
    const blob = new Blob([cleaned], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sanitized-${file.name.replace(/\.[^/.]+$/, '')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Flagged injection vectors redacted! Downloaded sanitized document.');
  };

  const handleDownloadReport = () => {
    if (!data) return;
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
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Downloaded RAG security audit report.');
  };

  return (
    <AppShell>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#e11d48] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-rose-400/40 flex items-center gap-2 text-xs font-semibold animate-fade-in shadow-rose-950/50">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#1a0e1c] border border-rose-500/30 text-[#f57b83]">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              RAG Document Security
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Analyze ingested knowledge bases, docs, and embeddings for indirect prompt injection vectors.
            </p>
          </div>
        </div>

        <div>
          <Link
            href="/docs"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#140c17] border border-[#2c1622] hover:border-rose-500/40 text-xs font-semibold text-slate-200 transition-colors shadow-sm cursor-pointer"
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

      {/* Results Section */}
      {data && (
        <div className="space-y-5 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            <div className="lg:col-span-7">
              <ScanResultsOverview results={data.results} />
            </div>
            <div className="lg:col-span-5">
              <RiskBreakdownDonut breakdown={data.results.riskBreakdown} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-7">
              <SuspiciousChunksTable
                chunks={data.suspiciousChunks}
                selectedChunk={selectedChunk}
                onSelectChunk={setSelectedChunk}
              />
            </div>
            <div className="lg:col-span-5">
              <DocumentPreviewCard
                documentText={sanitized ? sanitizedText : file?.text}
                selectedChunk={selectedChunk}
                sanitized={sanitized}
              />
            </div>
          </div>

          <RemediationFooter
            onSanitize={handleSanitize}
            onDownloadReport={handleDownloadReport}
            onRescan={handleScan}
            sanitized={sanitized}
          />
        </div>
      )}
    </AppShell>
  );
}
