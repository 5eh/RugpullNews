"use client";

import React, { useState } from "react";
import { FiFlag, FiX } from "react-icons/fi";

const REPORT_TYPES = [
  { value: "inaccuracy", label: "Factual Inaccuracy" },
  { value: "misleading", label: "Misleading Information" },
  { value: "outdated", label: "Outdated Information" },
  { value: "missing_context", label: "Missing Context" },
  { value: "other", label: "Other" },
];

export default function ReportButton({ articleId }: { articleId: number }) {
  const [open, setOpen] = useState(false);
  const [reportType, setReportType] = useState("inaccuracy");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/report-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          article_id: articleId,
          report_type: reportType,
          description: description.trim(),
          reporter_email: email.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ ok: true, msg: "Report submitted. Thank you for helping us stay accurate." });
        setDescription("");
        setEmail("");
        setTimeout(() => { setOpen(false); setStatus(null); }, 3000);
      } else {
        setStatus({ ok: false, msg: data.error || "Failed to submit report" });
      }
    } catch {
      setStatus({ ok: false, msg: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors duration-200"
      >
        <FiFlag className="w-4 h-4" />
        Report an issue
      </button>
    );
  }

  return (
    <div className="bg-gray-500/5 border border-gray-500/20 rounded-lg p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <FiFlag className="text-red-400" />
          Report an Issue
        </h3>
        <button onClick={() => { setOpen(false); setStatus(null); }} className="text-gray-400 hover:text-white">
          <FiX className="w-5 h-5" />
        </button>
      </div>

      <p className="text-sm text-gray-400 mb-4">
        Help us maintain accuracy. If something in this article is wrong, outdated, or missing context, let us know and we&apos;ll review it.
      </p>

      {status && (
        <div className={`mb-4 p-3 rounded text-sm ${status.ok ? "bg-green-900/30 text-green-300 border border-green-800" : "bg-red-900/30 text-red-300 border border-red-800"}`}>
          {status.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Type of Issue</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full p-2 rounded border border-gray-700 bg-transparent text-white text-sm"
          >
            {REPORT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Description <span className="text-gray-500">({description.length}/2000)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 2000))}
            className="w-full p-2 rounded border border-gray-700 bg-transparent text-white text-sm"
            rows={4}
            placeholder="Describe what's incorrect and what the correct information should be..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Email <span className="text-gray-500">(optional, for follow-up)</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded border border-gray-700 bg-transparent text-white text-sm"
            placeholder="your@email.com"
          />
        </div>

        <button
          type="submit"
          disabled={submitting || !description.trim()}
          className="w-full py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 rounded text-white text-sm font-medium transition-colors"
        >
          {submitting ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}
