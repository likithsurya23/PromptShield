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
import { scanDocumentWithStages, sanitizeDocument} from '@/lib/rag';
import { FileText, BookOpen, CheckCircle2, ShieldAlert} from 'lucide-react';

const INITIAL_STEPS = [
  { id: 1, title: 'Document Upload & Validation', status: 'pending', detail: 'Awaiting document input' },
  { id: 2, title: 'Content Extraction & Normalization', status: 'pending', detail: 'Text stream and character parsing' },
  { id: 3, title: 'Content Analysis & Chunking', status: 'pending', detail: 'Configuring chunk slices and link analysis' },
  { id: 4, title: 'Threat Detection (Neural & Rules)', status: 'pending', detail: 'DistilBERT ML model & adversarial rules' },
  { id: 5, title: 'Security Validation & Policy Evaluation', status: 'pending', detail: 'Enforcing detection thresholds and indirect injection flags' },
  { id: 6, title: 'Scan Completion & Synthesis', status: 'pending', detail: 'Risk categorization and remediation synthesis' },
];

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
    status: 'Ready to Scan',
    steps: INITIAL_STEPS,
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
    setData(null);
    setSelectedChunk(null);

    const startTime = Date.now();

    // Reset progress steps to pending
    setProgress({
      percent: 5,
      status: 'Initializing scan pipeline...',
      steps: INITIAL_STEPS.map((s) => ({ ...s, status: 'pending', time: null })),
    });

    try {
      const scanResult = await scanDocumentWithStages(
        file.name,
        file.text,
        config,
        (update) => {
          const elapsed = `${Date.now() - startTime}ms`;
          setProgress((prev) => {
            const nextSteps = prev.steps.map((step) => {
              if (step.id < update.stageId) {
                return {
                  ...step,
                  status: 'completed',
                  time: step.time || elapsed,
                };
              } else if (step.id === update.stageId) {
                return {
                  ...step,
                  status: update.percent === 100 ? 'completed' : 'in-progress',
                  detail: update.detail || step.detail,
                  time: update.percent === 100 ? elapsed : null,
                };
              } else {
                return { ...step, status: 'pending' };
              }
            });

            return {
              percent: update.percent,
              status: update.status,
              steps: nextSteps,
            };
          });
        }
      );

      // Finalize progress
      const totalElapsed = `${Date.now() - startTime}ms`;
      setProgress({
        percent: 100,
        status: 'Scan Completed',
        steps: INITIAL_STEPS.map((s) => ({
          ...s,
          status: 'completed',
          time: s.id === 6 ? totalElapsed : '✓',
        })),
      });

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
    } catch (err) {
      console.error('RAG scan failed:', err);
      setProgress((prev) => ({
        ...prev,
        status: `Scan Error: ${err.message}`,
        steps: prev.steps.map((s) => (s.status === 'in-progress' ? { ...s, status: 'error' } : s)),
      }));
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
      document: data.document || file?.name,
      config: data.config,
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

      {/* Page Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div className="p-2.5 rounded-xl bg-[#1a0e1c] border border-rose-500/30 text-[#f57b83] shrink-0">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              RAG Document Security
            </h1>
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

      {/* Top 3-Column Section: Upload, Config, Progress */}
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
          {/* Detected Issues Banner */}
          {data.results.detectedIssues?.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-rose-300">
                    Security Findings: {data.results.detectedIssues.length} Threat Pattern(s) Detected
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {data.results.detectedIssues.map((issue, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-rose-950/70 border border-rose-800/60 text-rose-200"
                      >
                        {issue.title} {issue.count > 1 ? `(${issue.count}x)` : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="shrink-0">
                <button
                  type="button"
                  onClick={handleSanitize}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
                >
                  Sanitize & Download
                </button>
              </div>
            </div>
          )}

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
