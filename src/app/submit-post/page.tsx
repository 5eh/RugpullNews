import React from "react";
import { Metadata } from "next";
import SubmitPostForm from "../components/SubmitPostForm";

export const metadata: Metadata = {
  title: "Submit a Post | Rugpull News",
  description:
    "Submit information about potential crypto scams and rugpulls for review by our team of experts.",
};

const Page = () => {
  return (
    <div className="min-h-screen px-4 py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold font-title text-white mb-4">
            Submit a Post
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Help protect the crypto community by submitting information about
            potential scams, rug pulls, or suspicious projects. Our team will
            review your submission and publish it if it meets our criteria.
          </p>
        </div>

        <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-lg p-4 md:p-8 mb-8">
          <h2 className="text-xl font-bold font-title text-white mb-4 flex items-center">
            <span className="text-[#d6973e] mr-2">📝</span> Submission
            Guidelines
          </h2>
          <ul className="space-y-2 text-gray-300 mb-6">
            <li className="flex items-start">
              <span className="text-[#d6973e] mr-2">•</span>
              <span>
                Provide accurate information with verifiable sources when
                possible
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-[#d6973e] mr-2">•</span>
              <span>Focus on factual analysis rather than speculation</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#d6973e] mr-2">•</span>
              <span>Clearly identify red flags and warning signs</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#d6973e] mr-2">•</span>
              <span>
                All submissions are reviewed for accuracy before publishing
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-[#d6973e] mr-2">•</span>
              <span>
                We may edit submissions for clarity, formatting, or to add
                additional context
              </span>
            </li>
          </ul>

          <div className="bg-blue-900/20 border border-blue-800/30 rounded p-4 text-blue-300 text-sm">
            <p className="flex items-start">
              <span className="font-bold mr-2">Note:</span>
              <span>
                By submitting content, you grant Rugpull News the right to
                publish, edit, and distribute your submission. Your personal
                information will remain confidential unless you specify
                otherwise.
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
