import React from "react";
import { Metadata } from "next";
import SubmitGuideForm from "../components/SubmitGuideForm";

import {
  RiBookOpenLine,
  RiSearchLine,
  RiDoorOpenLine,
  RiPoliceCarLine,
} from "react-icons/ri";

export const metadata: Metadata = {
  title: "Submit a Guide | Rugpull News",
  description:
    "Submit educational content to help the crypto community learn about scam prevention and blockchain safety.",
};

const Page = () => {
  return (
    <div className="min-h-screen px-4 py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold font-title text-white mb-4">
            Submit an Educational Guide
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Share your knowledge with the crypto community. Our team will review
            your guide and work with you to create a professional educational
            resource that helps others stay safe in the Web3 space.
          </p>
        </div>

        <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-lg p-4 md:p-8 mb-8">
          <h2 className="text-xl font-bold font-title text-white mb-4 flex items-center">
            <span className="text-[#d6973e] mr-2">📚</span> Guide Submission
            Guidelines
          </h2>
          <ul className="space-y-2 text-gray-300 mb-6">
            <li className="flex items-start">
              <span className="text-[#d6973e] mr-2">•</span>
              <span>
                Focus on educational content that helps users identify, avoid,
                or respond to crypto scams
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-[#d6973e] mr-2">•</span>
              <span>Include practical examples and actionable advice</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#d6973e] mr-2">•</span>
              <span>
                Provide clear, step-by-step instructions when applicable
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-[#d6973e] mr-2">•</span>
              <span>Back up claims with reputable sources and research</span>
            </li>
            <li className="flex items-start">
              <span className="text-[#d6973e] mr-2">•</span>
              <span>
                Our team will work with you to format, edit, and enhance your
                guide before publishing
              </span>
            </li>
          </ul>

          <div className="bg-blue-900/20 border border-blue-800/30 rounded p-4 text-blue-300 text-sm">
            <p className="flex items-start">
              <span className="font-bold mr-2">Note:</span>
              <span>
                By submitting content, you grant Rugpull News the right to
                publish, edit, and distribute your guide. You will be credited
                as the author unless you specify otherwise.
              </span>
            </p>
          </div>
        </div>

        <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-700/30 rounded-lg p-4 md:p-8 mb-8">
          <h2 className="text-xl font-bold font-title text-white mb-6 flex items-center">
            <span className="text-[#d6973e] mr-2">🔍</span> Guide Categories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
              <div className="flex items-center mb-2">
                <div className="bg-[#d6973e]/20 p-2 rounded-full mr-3">
                  <RiBookOpenLine className="text-[#d6973e] text-xl" />
                </div>
                <h3 className="font-medium text-white">
                  Introduction to Scams
                </h3>
              </div>
              <p className="text-gray-300 text-sm">
                Beginner-friendly overviews explaining basic concepts,
                terminology, and common scam types.
              </p>
            </div>

            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
              <div className="flex items-center mb-2">
                <div className="bg-[#d6973e]/20 p-2 rounded-full mr-3">
                  <RiSearchLine className="text-[#d6973e] text-xl" />
                </div>
                <h3 className="font-medium text-white">Identifying Scams</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Guides on spotting red flags, researching projects, and
                evaluating crypto investments safely.
              </p>
            </div>

            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
              <div className="flex items-center mb-2">
                <div className="bg-[#d6973e]/20 p-2 rounded-full mr-3">
                  <RiDoorOpenLine className="text-[#d6973e] text-xl" />
                </div>
                <h3 className="font-medium text-white">Exiting Safely</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Tutorials on how to exit potentially fraudulent projects while
                minimizing losses.
              </p>
            </div>

            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
              <div className="flex items-center mb-2">
                <div className="bg-[#d6973e]/20 p-2 rounded-full mr-3">
                  <RiPoliceCarLine className="text-[#d6973e] text-xl" />
                </div>
                <h3 className="font-medium text-white">Reporting Scams</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Information on how to document and report crypto scams to
                authorities and platforms.
              </p>
            </div>
          </div>

          <p className="text-gray-400 text-sm mt-4">
            Select the most appropriate category for your guide in the form
            below. If your content spans multiple categories or introduces a new
            topic, please specify in your submission.
          </p>
        </div>

        <SubmitGuideForm />
      </div>
    </div>
  );
};

export default Page;
