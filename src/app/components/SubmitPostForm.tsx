"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiAlertCircle, FiSearch, FiChevronDown } from "react-icons/fi";

const CHAINS = [
  { value: "ethereum", label: "Ethereum" },
  { value: "bsc", label: "BNB Chain (BSC)" },
  { value: "polygon", label: "Polygon" },
  { value: "arbitrum", label: "Arbitrum" },
  { value: "base", label: "Base" },
  { value: "avalanche", label: "Avalanche" },
];

// Extract address and chain from block explorer URLs
function parseExplorerUrl(input: string): { address: string; chain: string } | null {
  const patterns: { regex: RegExp; chain: string }[] = [
    { regex: /etherscan\.io\/(?:token|address)\/(0x[a-fA-F0-9]{40})/, chain: "ethereum" },
    { regex: /bscscan\.com\/(?:token|address)\/(0x[a-fA-F0-9]{40})/, chain: "bsc" },
    { regex: /polygonscan\.com\/(?:token|address)\/(0x[a-fA-F0-9]{40})/, chain: "polygon" },
    { regex: /arbiscan\.io\/(?:token|address)\/(0x[a-fA-F0-9]{40})/, chain: "arbitrum" },
    { regex: /basescan\.org\/(?:token|address)\/(0x[a-fA-F0-9]{40})/, chain: "base" },
    { regex: /snowtrace\.io\/(?:token|address)\/(0x[a-fA-F0-9]{40})/, chain: "avalanche" },
  ];

  for (const { regex, chain } of patterns) {
    const match = input.match(regex);
    if (match) return { address: match[1], chain };
  }
  return null;
}

const SubmitPostForm: React.FC = () => {
  const router = useRouter();

  const [contractAddress, setContractAddress] = useState("");
  const [chain, setChain] = useState("ethereum");
  const [userAnalysis, setUserAnalysis] = useState("");
  const [creator, setCreator] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();

    // Auto-detect explorer URLs
    const parsed = parseExplorerUrl(value);
    if (parsed) {
      setContractAddress(parsed.address);
      setChain(parsed.chain);
    } else {
      setContractAddress(value);
    }

    if (errors.contractAddress) {
      setErrors((prev) => ({ ...prev, contractAddress: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!contractAddress) {
      newErrors.contractAddress = "Contract address is required";
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
      newErrors.contractAddress = "Invalid address. Must be 0x followed by 40 hex characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/submit-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contract_address: contractAddress,
          chain,
          user_analysis: userAnalysis.slice(0, 2000),
          creator: creator.trim() || "Community Member",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Submission failed");
      }

      // Already investigated — redirect to existing article
      if (data.existing_article_id) {
        router.push(`/article/${data.existing_article_id}`);
        return;
      }

      // New submission or in-progress — redirect to status page
      if (data.submission_id) {
        router.push(`/submit-post/status/${data.submission_id}`);
        return;
      }

      setSubmitStatus({
        success: true,
        message: "Submission received. Redirecting...",
      });
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: error instanceof Error ? error.message : "An error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {submitStatus && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            submitStatus.success
              ? "bg-green-900/30 text-green-300 border border-green-800"
              : "bg-red-900/30 text-red-300 border border-red-800"
          }`}
        >
          <p className="flex items-center">
            <FiAlertCircle className="mr-2 flex-shrink-0" />
            {submitStatus.message}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contract Address — primary field */}
        <div>
          <label
            htmlFor="contractAddress"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Smart Contract Address *
          </label>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              id="contractAddress"
              value={contractAddress}
              onChange={handleAddressChange}
              className="w-full p-3 pl-10 rounded placeholder-gray-500 border hover:border-[#d6973e] focus:border-[#d6973e] border-gray-700 bg-gray-900/50 text-white text-lg font-mono"
              placeholder="0x... or paste Etherscan/BSCScan URL"
              spellCheck={false}
              autoComplete="off"
            />
          </div>
          {errors.contractAddress && (
            <p className="mt-1 text-sm text-red-500">{errors.contractAddress}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Paste a contract address or block explorer URL — chain is auto-detected from URLs
          </p>
        </div>

        {/* Chain selector */}
        <div>
          <label
            htmlFor="chain"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Blockchain Network
          </label>
          <div className="relative">
            <select
              id="chain"
              value={chain}
              onChange={(e) => setChain(e.target.value)}
              className="w-full p-3 pr-10 rounded border hover:border-[#d6973e] focus:border-[#d6973e] border-gray-700 bg-gray-900/50 text-white text-lg appearance-none"
            >
              {CHAINS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* User analysis — optional */}
        <div>
          <label
            htmlFor="userAnalysis"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Your Analysis{" "}
            <span className="text-xs text-gray-500">
              (optional — {userAnalysis.length}/2000)
            </span>
          </label>
          <textarea
            id="userAnalysis"
            value={userAnalysis}
            onChange={(e) => setUserAnalysis(e.target.value.slice(0, 2000))}
            className="w-full p-3 rounded placeholder-gray-500 border hover:border-[#d6973e] focus:border-[#d6973e] border-gray-700 bg-gray-900/50 text-white text-base"
            placeholder="What looks suspicious about this contract? Any context helps our AI investigation."
            rows={4}
          />
        </div>

        {/* Creator name — optional */}
        <div>
          <label
            htmlFor="creator"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Your Name{" "}
            <span className="text-xs text-gray-500">(optional)</span>
          </label>
          <input
            type="text"
            id="creator"
            value={creator}
            onChange={(e) => setCreator(e.target.value.slice(0, 50))}
            className="w-full p-3 rounded placeholder-gray-500 border hover:border-[#d6973e] focus:border-[#d6973e] border-gray-700 bg-gray-900/50 text-white text-lg"
            placeholder="Community Member"
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#d6973e] hover:bg-[#c4872e] disabled:bg-gray-700 disabled:cursor-not-allowed rounded font-bold text-white transition-all duration-300 text-lg"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting...
              </span>
            ) : (
              "Investigate Contract"
            )}
          </button>
          <p className="text-sm text-center mt-4 text-gray-500">
            Our system will automatically analyze on-chain data, scrape community sentiment,
            and generate an investigation report. This typically takes 1-2 minutes.
          </p>
        </div>
      </form>
    </div>
  );
};

export default SubmitPostForm;
