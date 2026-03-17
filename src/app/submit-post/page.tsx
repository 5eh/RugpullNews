import React from "react";
import { Metadata } from "next";
import SubmitPostForm from "../components/SubmitPostForm";

export const metadata: Metadata = {
  title: "Investigate a Smart Contract | Rugpull News",
  description:
    "Submit a smart contract address for autonomous investigation. Our system analyzes on-chain data, community sentiment, and generates a comprehensive report.",
};

const Page = () => {
  return (
    <div className="min-h-screen px-4 py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold font-title text-white mb-4">
            Investigate a Smart Contract
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Submit a contract address and our system will automatically analyze
            on-chain data, scrape community sentiment, and generate a full
            investigation report — published within minutes.
          </p>
        </div>

        <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-lg p-4 md:p-8 mb-8">
          <h2 className="text-xl font-bold font-title text-white mb-4 flex items-center">
            <span className="text-[#d6973e] mr-2">🔍</span> How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800/30 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">1</div>
              <p className="text-gray-300 text-sm">
                Paste the contract address or block explorer URL
              </p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">2</div>
              <p className="text-gray-300 text-sm">
                Our system runs on-chain analysis, community scraping, and AI investigation
              </p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">3</div>
              <p className="text-gray-300 text-sm">
                A full investigation article is published automatically
              </p>
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-800/30 rounded p-4 text-blue-300 text-sm">
            <p className="flex items-start">
              <span className="font-bold mr-2">Free to use:</span>
              <span>
                Anyone can submit a contract for investigation. Add your own analysis
                to help guide the AI, or leave it blank and let the system work
                autonomously. If you spot inaccuracies in any published report,
                use the Report button on the article page.
              </span>
            </p>
          </div>
        </div>

        <SubmitPostForm />
      </div>
    </div>
  );
};

export default Page;
