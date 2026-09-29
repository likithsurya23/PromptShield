'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { FileText, Download, Eye, Trash2 } from 'lucide-react';

export function RecentReportsTable({
  reports,
  onDownloadReport,
  onViewReport,
  onDeleteReport,
}) {
  return (
    <Card className="p-3.5 sm:p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white tracking-tight">
              Recent Reports
            </h2>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full">
              {reports?.length || 0} Total
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto -mx-1 sm:mx-0">
          <table className="w-full min-w-[650px] text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] text-slate-400 font-medium">
                <th className="pb-2.5 w-6 text-slate-500">#</th>
                <th className="pb-2.5 w-6"></th>
                <th className="pb-2.5">Report Name</th>
                <th className="pb-2.5">Type</th>
                <th className="pb-2.5">Date Generated</th>
                <th className="pb-2.5">Status</th>
                <th className="pb-2.5">Format</th>
                <th className="pb-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {(!reports || reports.length === 0) ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-500">
                    No security audit reports generated yet. Click &quot;Generate Report&quot; to compile your first report from real scans.
                  </td>
                </tr>
              ) : (
                reports.map((row, idx) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    {/* # */}
                    <td className="py-3 font-mono text-[11px] text-slate-500">
                      {idx + 1}
                    </td>

                    {/* Icon */}
                    <td className="py-3 pr-2">
                      <FileText className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                    </td>

                    {/* Name */}
                    <td className="py-3 font-semibold text-slate-200 group-hover:text-white">
                      {row.name}
                    </td>

                    {/* Type */}
                    <td className="py-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium ${row.typeBadge}`}
                      >
                        {row.type}
                      </span>
                    </td>

                    {/* Date Generated */}
                    <td className="py-3 text-slate-400 font-mono text-[11px]">
                      {row.dateGenerated}
                    </td>

                    {/* Status */}
                    <td className="py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${row.statusBadge}`}
                      >
                        {row.status}
                      </span>
                    </td>

                    {/* Format */}
                    <td className="py-3 font-mono text-slate-400 text-[11px]">
                      {row.format}
                    </td>

                    {/* Actions */}
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onDownloadReport(row)}
                          className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
                          title="Download"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onViewReport(row)}
                          className="p-1 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {onDeleteReport && (
                          <button
                            type="button"
                            onClick={() => onDeleteReport(row.id)}
                            className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                            title="Delete Report"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}
