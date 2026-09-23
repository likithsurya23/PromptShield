'use client';

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import {
  Search,
  Copy,
  Edit2,
  Trash2,
  Check,
  Bot,
  Flame,
  Zap,
  Sparkles,
  Layers,
} from 'lucide-react';

export function ApiKeysTable({
  keys,
  onCopyKey,
  onDeleteKey,
  onEditKey,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const filteredKeys = useMemo(() => {
    if (!searchQuery.trim()) return keys;
    const q = searchQuery.toLowerCase();
    return keys.filter(
      (k) =>
        k.name.toLowerCase().includes(q) ||
        k.provider.toLowerCase().includes(q) ||
        k.environment.toLowerCase().includes(q)
    );
  }, [keys, searchQuery]);

  const handleCopy = (item) => {
    navigator.clipboard.writeText(item.key || item.maskedKey);
    setCopiedId(item.id);
    onCopyKey(item);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getProviderIcon = (providerId) => {
    switch (providerId) {
      case 'openai':
        return (
          <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
            O
          </span>
        );
      case 'anthropic':
        return (
          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px]">
            A
          </span>
        );
      case 'gemini':
        return (
          <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px]">
            G
          </span>
        );
      case 'huggingface':
        return (
          <span className="w-5 h-5 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center font-bold text-[10px]">
            🤗
          </span>
        );
      default:
        return (
          <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-[10px]">
            <Bot className="w-3 h-3" />
          </span>
        );
    }
  };

  return (
    <Card className="p-5 border-slate-800/80 bg-[#0c1222]/80 shadow-xl flex flex-col justify-between h-full">
      <div>
        {/* Header & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-sm font-bold text-white tracking-tight">
            Your API Keys ({keys.length})
          </h2>

          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search keys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#080d19] border border-slate-800 rounded-xl py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] text-slate-400 font-medium">
                <th className="pb-2.5">Name</th>
                <th className="pb-2.5">Provider</th>
                <th className="pb-2.5">Environment</th>
                <th className="pb-2.5">Created On</th>
                <th className="pb-2.5">Last Used</th>
                <th className="pb-2.5">Status</th>
                <th className="pb-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredKeys.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-800/30 transition-colors group"
                >
                  {/* Name + Provider Icon */}
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      {getProviderIcon(item.providerId)}
                      <div>
                        <span className="font-semibold text-slate-200 group-hover:text-white block">
                          {item.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 block truncate max-w-[130px]">
                          {item.maskedKey}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Provider */}
                  <td className="py-3 text-slate-300 font-medium">
                    {item.provider}
                  </td>

                  {/* Environment */}
                  <td className="py-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${item.environmentColor}`}
                    >
                      {item.environment}
                    </span>
                  </td>

                  {/* Created On */}
                  <td className="py-3 text-slate-400 font-mono text-[11px]">
                    {item.createdOn}
                  </td>

                  {/* Last Used */}
                  <td className="py-3 text-slate-400 font-mono text-[11px]">
                    {item.lastUsed}
                  </td>

                  {/* Status */}
                  <td className="py-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold ${item.statusColor}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopy(item)}
                        className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                        title="Copy Key"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => onEditKey(item)}
                        className="p-1 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded transition-colors"
                        title="Edit Key"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteKey(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                        title="Delete Key"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}
