import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  RiBookOpenLine,
  RiSearchLine,
  RiDoorOpenLine,
  RiPoliceCarLine,
  RiArrowRightLine,
  RiShieldCheckLine,
  RiExternalLinkLine,
  RiUserLine,
  RiCommunityLine,
} from "react-icons/ri";

export default function EducationHomePage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center text-gray-300 text-sm">
            <Link href="/" className="hover:text-[#d6973e] transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#d6973e]">Education</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-12">
          <div className="w-full h-64 relative mb-6 rounded-lg overflow-hidden">
            <Image
              src={`/thumbnail.png`}
              alt="Crypto Scam Education"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold font-title text-white mb-6 leading-tight">
            Web3 Scam Education Center
          </h1>

          <div className="text-lg text-gray-300 font-subtitle leading-relaxed max-w-4xl">
            Protect yourself from crypto scams with our comprehensive
            educational resources. Learn to identify, avoid, exit, and report
            potential rug pulls in the Web3 space.
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
          {/* Left Column */}
          <div className="col-span-1 md:col-span-2">
            <div className="bg-gray-500/5 border-gray-500/20 border rounded-lg p-4 md:p-8 mb-8">
              <h2 className="text-xl md:text-2xl font-semibold font-subtitle text-white mb-4 md:mb-6">
                Start Your Education Journey
              </h2>
              <p className="text-gray-300 mb-8 text-base md:text-lg">
                Our comprehensive educational series will equip you with the
                knowledge to navigate the Web3 space safely. Choose where to
                begin based on your current needs:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Introduction Card */}
                <Link
                  href="/education/intro"
                  className="bg-gray-600/30 hover:bg-gray-600/50 rounded-lg p-6 transition-all duration-300 border border-transparent hover:border-[#d6973e]/30 flex flex-col h-full"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-[#d6973e]/20 p-3 rounded-full mr-4">
                      <RiBookOpenLine className="text-[#d6973e] text-2xl" />
                    </div>
                    <h3 className="font-semibold text-white text-lg">
                      Introduction to Rug Pulls
                    </h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-4 flex-grow">
                    Understand what rug pulls are, how they work, and why
                    they&apos;re dangerous in the crypto space.
                  </p>
                  <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-500/20">
                    <span className="text-xs text-gray-400">Beginner</span>
                    <span className="text-[#d6973e] text-sm flex items-center">
                      Start learning <RiArrowRightLine className="ml-1" />
                    </span>
                  </div>
                </Link>

                {/* Identify Scams Card */}
                <Link
                  href="/education/identify-scams"
                  className="bg-gray-600/30 hover:bg-gray-600/50 rounded-lg p-6 transition-all duration-300 border border-transparent hover:border-[#d6973e]/30 flex flex-col h-full"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-[#d6973e]/20 p-3 rounded-full mr-4">
                      <RiSearchLine className="text-[#d6973e] text-2xl" />
                    </div>
                    <h3 className="font-semibold text-white text-lg">
                      Identifying Scams
                    </h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-4 flex-grow">
                    Learn the red flags and warning signs that can help you spot
                    potential rug pulls before investing.
                  </p>
                  <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-500/20">
                    <span className="text-xs text-gray-400">Intermediate</span>
                    <span className="text-[#d6973e] text-sm flex items-center">
                      Start learning <RiArrowRightLine className="ml-1" />
                    </span>
                  </div>
                </Link>

                {/* Exiting Safely Card */}
                <Link
                  href="/education/exit-scams"
                  className="bg-gray-600/30 hover:bg-gray-600/50 rounded-lg p-6 transition-all duration-300 border border-transparent hover:border-[#d6973e]/30 flex flex-col h-full"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-[#d6973e]/20 p-3 rounded-full mr-4">
                      <RiDoorOpenLine className="text-[#d6973e] text-2xl" />
                    </div>
                    <h3 className="font-semibold text-white text-lg">
                      Exiting Safely
                    </h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-4 flex-grow">
                    Discover strategic techniques to exit potentially fraudulent
                    projects while minimizing losses.
                  </p>
                  <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-500/20">
                    <span className="text-xs text-gray-400">Advanced</span>
                    <span className="text-[#d6973e] text-sm flex items-center">
                      Start learning <RiArrowRightLine className="ml-1" />
                    </span>
                  </div>
                </Link>

                {/* Reporting Scams Card */}
                <Link
                  href="/education/report-scams"
                  className="bg-gray-600/30 hover:bg-gray-600/50 rounded-lg p-6 transition-all duration-300 border border-transparent hover:border-[#d6973e]/30 flex flex-col h-full"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-[#d6973e]/20 p-3 rounded-full mr-4">
                      <RiPoliceCarLine className="text-[#d6973e] text-2xl" />
                    </div>
                    <h3 className="font-semibold text-white text-lg">
                      Reporting Scams
                    </h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-4 flex-grow">
                    Learn how to properly document and report crypto scams to
                    authorities and community platforms.
                  </p>
                  <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-500/20">
                    <span className="text-xs text-gray-400">All Levels</span>
                    <span className="text-[#d6973e] text-sm flex items-center">
                      Start learning <RiArrowRightLine className="ml-1" />
                    </span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Why Education Matters Section */}
            <div className="bg-gray-500/5 border-gray-500/20 border rounded-lg p-4 md:p-8">
              <h2 className="text-xl md:text-2xl font-semibold font-subtitle text-white mb-4 md:mb-6 flex items-center">
                <RiShieldCheckLine className="mr-3 text-[#d6973e]" />
                Why Education is Your Best Protection
              </h2>

              <div className="text-gray-300 leading-relaxed text-base md:text-lg max-w-prose">
                <p className="mb-4">
                  In the Web3 space, knowledge truly is power. With limited
                  regulation and decentralized structures, individual investors
                  must take responsibility for their own security:
                </p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <span className="text-[#d6973e] mr-3 text-xl">•</span>
                    <div>
                      <h4 className="text-white font-medium">
                        Proactive Defense
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        Identifying red flags before investing can prevent
                        losses entirely—the most effective form of protection.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="text-[#d6973e] mr-3 text-xl">•</span>
                    <div>
                      <h4 className="text-white font-medium">
                        Rapid Response Capability
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        Knowing how to exit quickly when warning signs appear
                        can be the difference between minimal and total losses.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="text-[#d6973e] mr-3 text-xl">•</span>
                    <div>
                      <h4 className="text-white font-medium">
                        Community Protection
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        Reporting scams helps protect others and contributes to
                        making the entire ecosystem safer for everyone.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="text-[#d6973e] mr-3 text-xl">•</span>
                    <div>
                      <h4 className="text-white font-medium">
                        Confident Participation
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        With proper knowledge, you can participate in legitimate
                        Web3 projects with greater confidence and security.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6 md:space-y-8">
            {/* Latest Analyses */}
            <div className="bg-gray-500/5 border-gray-500/20 border rounded-lg p-4 md:p-8">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">
                Latest Scam Analyses
              </h3>

              <div className="space-y-4">
                <Link
                  href="/article/123"
                  className="block group border-b border-gray-500/20 pb-3 hover:border-[#d6973e]/30"
                >
                  <h4 className="font-medium text-white group-hover:text-[#d6973e] transition-colors duration-300">
                    MetaVerse Token: High Risk Project
                  </h4>
                  <p className="text-sm text-gray-300 mt-1 line-clamp-2">
                    Anonymous team, unsustainable tokenomics, and suspicious
                    marketing tactics raise major red flags.
                  </p>
                  <div className="text-xs text-gray-400 mt-2">
                    June 15, 2023 • Risk Level: High
                  </div>
                </Link>

                <Link
                  href="/article/124"
                  className="block group border-b border-gray-500/20 pb-3 hover:border-[#d6973e]/30"
                >
                  <h4 className="font-medium text-white group-hover:text-[#d6973e] transition-colors duration-300">
                    DeFi Yield Protocol: Medium Risk
                  </h4>
                  <p className="text-sm text-gray-300 mt-1 line-clamp-2">
                    Unrealistic yield promises and concerning contract code
                    discovered in this yield farming protocol.
                  </p>
                  <div className="text-xs text-gray-400 mt-2">
                    June 12, 2023 • Risk Level: Medium
                  </div>
                </Link>

                <Link
                  href="/article/125"
                  className="block group hover:border-[#d6973e]/30"
                >
                  <h4 className="font-medium text-white group-hover:text-[#d6973e] transition-colors duration-300">
                    NFT Marketplace: Potential Concerns
                  </h4>
                  <p className="text-sm text-gray-300 mt-1 line-clamp-2">
                    New marketplace showing several yellow flags in their
                    operational structure and team background.
                  </p>
                  <div className="text-xs text-gray-400 mt-2">
                    June 8, 2023 • Risk Level: Low
                  </div>
                </Link>
              </div>

              <div className="mt-4">
                <Link
                  href="/"
                  className="text-[#d6973e] text-sm flex items-center hover:text-[#d6973e]/80 transition-colors"
                >
                  View all analyses <RiArrowRightLine className="ml-1" />
                </Link>
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-gray-500/5 border-gray-500/20 border rounded-lg p-4 md:p-8">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">
                Community Impact
              </h3>

              <div className="space-y-4">
                <div className="border-b border-gray-500/20 pb-3">
                  <div className="text-3xl font-bold text-[#d6973e] mb-1">
                    $42M+
                  </div>
                  <div className="text-sm text-gray-300">
                    Potential losses prevented through education
                  </div>
                </div>

                <div className="border-b border-gray-500/20 pb-3">
                  <div className="text-3xl font-bold text-[#d6973e] mb-1">
                    128
                  </div>
                  <div className="text-sm text-gray-300">
                    Suspicious projects identified and analyzed
                  </div>
                </div>

                <div>
                  <div className="text-3xl font-bold text-[#d6973e] mb-1">
                    15,000+
                  </div>
                  <div className="text-sm text-gray-300">
                    Community members educated on Web3 safety
                  </div>
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="bg-gray-500/5 border-gray-500/20 border rounded-lg p-4 md:p-8">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">
                Additional Resources
              </h3>

              <div className="space-y-3">
                <a
                  href="#"
                  className="flex items-center text-gray-300 hover:text-[#d6973e] transition-colors"
                >
                  <RiExternalLinkLine className="mr-2" />
                  <span>Crypto Safety Checklist (PDF)</span>
                </a>
                <a
                  href="#"
                  className="flex items-center text-gray-300 hover:text-[#d6973e] transition-colors"
                >
                  <RiExternalLinkLine className="mr-2" />
                  <span>Smart Contract Audit Guide</span>
                </a>
                <a
                  href="#"
                  className="flex items-center text-gray-300 hover:text-[#d6973e] transition-colors"
                >
                  <RiExternalLinkLine className="mr-2" />
                  <span>Web3 Security Best Practices</span>
                </a>
                <a
                  href="#"
                  className="flex items-center text-gray-300 hover:text-[#d6973e] transition-colors"
                >
                  <RiExternalLinkLine className="mr-2" />
                  <span>Scam Recovery Resources</span>
                </a>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gray-500/5 border-gray-500/20 border rounded-lg p-4 md:p-8">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-4">
                Join Our Community
              </h3>

              <p className="text-gray-300 text-sm mb-4">
                Connect with other Web3 users focused on safety and security in
                the crypto space.
              </p>

              <div className="space-y-3">
                <button className="w-full bg-[#d6973e] hover:bg-[#c08536] text-gray-900 py-2 px-4 rounded-sm text-sm font-medium transition-all duration-300 flex items-center justify-center">
                  <RiCommunityLine className="mr-2" /> Join Discord Community
                </button>
                <button className="w-full bg-gray-600/40 hover:bg-gray-500/60 text-gray-200 py-2 px-4 rounded-sm text-sm font-medium transition-all duration-300 flex items-center justify-center">
                  <RiUserLine className="mr-2" /> Sign Up for Alerts
                </button>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-900/30 rounded-lg p-4 md:p-6">
              <div className="text-xs md:text-sm text-yellow-200">
                <strong>Disclaimer:</strong> This educational content is for
                informational purposes only and should not be considered
                financial advice. Always conduct your own research before making
                investment decisions.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
