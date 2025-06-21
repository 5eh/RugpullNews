import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  RiArrowLeftLine,
  RiBookOpenLine,
  RiShieldCheckLine,
  RiAlertLine,
  RiExternalLinkLine,
  RiArrowRightLine,
} from "react-icons/ri";

export default function IntroductionPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Breadcrumb Navigation */}
        <div className="mb-8">
          <div className="flex items-center text-gray-300 text-sm">
            <Link href="/" className="hover:text-[#d6973e] transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link
              href="/education"
              className="hover:text-[#d6973e] transition-colors"
            >
              Education
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#d6973e]">Introduction</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-12">
          <Link
            href="/education"
            className="text-[#d6973e] font-subtitle hover:text-[#d6973e]/80 text-lg font-medium mb-6 inline-flex items-center transition-colors duration-300"
          >
            <RiArrowLeftLine className="mr-1" /> Back to Education
          </Link>

          <div className="w-full h-64 relative mb-6 rounded-lg overflow-hidden">
            <Image
              src={`/thumbnail.png`}
              alt="Introduction to Rug Pulls"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold font-title text-white mb-6 leading-tight">
            Introduction to Rug Pulls in Web3
          </h1>

          <div className="text-lg text-gray-300 font-subtitle leading-relaxed max-w-4xl">
            Understanding rug pulls is the first step in protecting yourself in
            the decentralized economy. This educational series will help you
            identify, avoid, and report scams in the Web3 space.
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
          {/* Left Column */}
          <div className="col-span-1 md:col-span-2">
            <div className="bg-gray-500/5 border-gray-500/20 border rounded-lg p-4 md:p-8 mb-8">
              <h2 className="text-xl md:text-2xl font-semibold font-subtitle text-white mb-4 md:mb-6 flex items-center">
                <RiBookOpenLine className="mr-3 text-[#d6973e]" />
                What is a Rug Pull?
              </h2>

              <div className="text-gray-300 leading-relaxed mb-8 text-base md:text-lg whitespace-pre-line max-w-prose">
                <p className="mb-4">
                  A <span className="text-[#d6973e] font-medium">rug pull</span>{" "}
                  is a type of scam where crypto developers abandon a project
                  and run away with investors&apos; funds. The term comes from
                  the phrase &quot;pulling the rug out from under someone&quot;
                  - leaving investors with worthless tokens and lost
                  investments.
                </p>

                <p className="mb-4">
                  Unlike traditional financial markets with regulatory
                  oversight, the decentralized nature of Web3 makes it
                  particularly vulnerable to these types of scams. Anyone can
                  create a token or NFT project with minimal technical
                  knowledge, market it aggressively, and disappear with the
                  funds.
                </p>

                <div className="bg-gray-600/30 rounded-lg p-4 md:p-6 my-6">
                  <h3 className="font-semibold text-white mb-3 text-lg">
                    Common Types of Rug Pulls:
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-red-400 mr-3">•</span>
                      <span>
                        <span className="text-[#d6973e] font-medium">
                          Liquidity Theft
                        </span>
                        : Developers remove all funds from the liquidity pool,
                        making it impossible to sell tokens.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-400 mr-3">•</span>
                      <span>
                        <span className="text-[#d6973e] font-medium">
                          Selling Pressure
                        </span>
                        : Developers and team members dump their token holdings
                        at once, causing prices to crash.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-400 mr-3">•</span>
                      <span>
                        <span className="text-[#d6973e] font-medium">
                          Honey Pots
                        </span>
                        : Smart contracts designed to prevent most users from
                        selling their tokens.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-400 mr-3">•</span>
                      <span>
                        <span className="text-[#d6973e] font-medium">
                          Fake Projects
                        </span>
                        : Entire projects built on false promises with no
                        intention of delivering.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <h2 className="text-xl md:text-2xl font-semibold font-subtitle text-white mb-4 md:mb-6 flex items-center">
                <RiAlertLine className="mr-3 text-[#d6973e]" />
                Why Rug Pulls Are Dangerous
              </h2>

              <div className="text-gray-300 leading-relaxed mb-8 text-base md:text-lg whitespace-pre-line max-w-prose">
                <p className="mb-4">
                  In 2022 alone, crypto investors lost over{" "}
                  <span className="text-[#d6973e] font-medium">
                    $3.8 billion
                  </span>{" "}
                  to scams, with rug pulls accounting for a significant portion
                  of these losses. The psychological impact can be devastating -
                  many victims experience shame, depression, and financial
                  hardship.
                </p>

                <p className="mb-4">
                  Beyond individual losses, rug pulls damage the entire Web3
                  ecosystem by:
                </p>

                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-3">•</span>
                    <span>Eroding trust in legitimate projects</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-3">•</span>
                    <span>Discouraging new users from entering the space</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-3">•</span>
                    <span>
                      Prompting regulatory crackdowns that can stifle innovation
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-3">•</span>
                    <span>Creating market volatility and uncertainty</span>
                  </li>
                </ul>

                <p>
                  Understanding how to identify potential rug pulls is crucial
                  for anyone participating in Web3, whether you&apos;re a casual
                  investor or deeply involved in the ecosystem.
                </p>
              </div>

              <h2 className="text-xl md:text-2xl font-semibold font-subtitle text-white mb-4 md:mb-6 flex items-center">
                <RiShieldCheckLine className="mr-3 text-[#d6973e]" />
                How This Guide Will Help You
              </h2>

              <div className="text-gray-300 leading-relaxed text-base md:text-lg whitespace-pre-line max-w-prose">
                <p className="mb-4">
                  Our educational series is designed to equip you with the
                  knowledge and tools to protect yourself in the Web3 space.
                  Through our comprehensive guides, you&apos;ll learn:
                </p>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <span className="text-[#d6973e] mr-3">1.</span>
                    <span>
                      <span className="text-white font-medium">
                        How to identify potential scams
                      </span>{" "}
                      before investing your hard-earned money
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#d6973e] mr-3">2.</span>
                    <span>
                      <span className="text-white font-medium">
                        Red flags to watch for
                      </span>{" "}
                      in project teams, tokenomics, and marketing
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#d6973e] mr-3">3.</span>
                    <span>
                      <span className="text-white font-medium">
                        Essential due diligence steps
                      </span>{" "}
                      to take before participating in any crypto project
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#d6973e] mr-3">4.</span>
                    <span>
                      <span className="text-white font-medium">
                        How to exit safely
                      </span>{" "}
                      if you suspect a project might be fraudulent
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#d6973e] mr-3">5.</span>
                    <span>
                      <span className="text-white font-medium">
                        Resources for reporting scams
                      </span>{" "}
                      and potentially recovering funds
                    </span>
                  </li>
                </ul>

                <p>
                  By the end of this series, you&apos;ll be better equipped to
                  navigate the Web3 landscape safely and confidently.
                </p>
              </div>
            </div>

            {/* Next Steps Section */}
            <div className="bg-gray-500/5 border-gray-500/20 border rounded-lg p-4 md:p-8">
              <h2 className="text-xl md:text-2xl font-semibold font-subtitle text-white mb-4 md:mb-6">
                Continue Your Education
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/education/identify-scams"
                  className="bg-gray-600/30 hover:bg-gray-600/50 rounded-lg p-4 transition-all duration-300 flex flex-col h-full"
                >
                  <h3 className="font-semibold text-white mb-2 text-lg flex items-center">
                    <span className="text-[#d6973e] mr-2">01</span> Identifying
                    Scams
                  </h3>
                  <p className="text-gray-300 text-sm mb-3 flex-grow">
                    Learn the warning signs and red flags of potential rug
                    pulls.
                  </p>
                  <span className="text-[#d6973e] text-sm flex items-center mt-auto">
                    Read <RiArrowRightLine className="ml-1" />
                  </span>
                </Link>

                <Link
                  href="/education/exit-scams"
                  className="bg-gray-600/30 hover:bg-gray-600/50 rounded-lg p-4 transition-all duration-300 flex flex-col h-full"
                >
                  <h3 className="font-semibold text-white mb-2 text-lg flex items-center">
                    <span className="text-[#d6973e] mr-2">02</span> Exiting
                    Safely
                  </h3>
                  <p className="text-gray-300 text-sm mb-3 flex-grow">
                    Strategies for safely exiting a project if you suspect
                    fraud.
                  </p>
                  <span className="text-[#d6973e] text-sm flex items-center mt-auto">
                    Read <RiArrowRightLine className="ml-1" />
                  </span>
                </Link>

                <Link
                  href="/education/report-scams"
                  className="bg-gray-600/30 hover:bg-gray-600/50 rounded-lg p-4 transition-all duration-300 flex flex-col h-full"
                >
                  <h3 className="font-semibold text-white mb-2 text-lg flex items-center">
                    <span className="text-[#d6973e] mr-2">03</span> Reporting
                    Scams
                  </h3>
                  <p className="text-gray-300 text-sm mb-3 flex-grow">
                    How to report scams and help others avoid the same pitfalls.
                  </p>
                  <span className="text-[#d6973e] text-sm flex items-center mt-auto">
                    Read <RiArrowRightLine className="ml-1" />
                  </span>
                </Link>

                <Link
                  href="/"
                  className="bg-gray-600/30 hover:bg-gray-600/50 rounded-lg p-4 transition-all duration-300 flex flex-col h-full"
                >
                  <h3 className="font-semibold text-white mb-2 text-lg flex items-center">
                    <span className="text-[#d6973e] mr-2">04</span> Latest
                    Analyses
                  </h3>
                  <p className="text-gray-300 text-sm mb-3 flex-grow">
                    Read our latest analyses of suspicious projects in the Web3
                    space.
                  </p>
                  <span className="text-[#d6973e] text-sm flex items-center mt-auto">
                    Analysis <RiArrowRightLine className="ml-1" />
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6 md:space-y-8">
            {/* Resources Card */}
            <div className="bg-gray-500/5 border-gray-500/20 border rounded-lg p-4 md:p-8">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">
                Essential Resources
              </h3>

              <div className="space-y-3">
                <a
                  href="https://rugdoc.io/rugpull-scanner/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-[#d6973e] transition-colors"
                >
                  <RiExternalLinkLine className="mr-2" />
                  <span>RugDoc Scanner</span>
                </a>
                <a
                  href="https://tokensniffer.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-[#d6973e] transition-colors"
                >
                  <RiExternalLinkLine className="mr-2" />
                  <span>Token Sniffer</span>
                </a>
                <a
                  href="https://etherscan.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-[#d6973e] transition-colors"
                >
                  <RiExternalLinkLine className="mr-2" />
                  <span>Etherscan</span>
                </a>
                <a
                  href="https://coinmarketcap.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-[#d6973e] transition-colors"
                >
                  <RiExternalLinkLine className="mr-2" />
                  <span>CoinMarketCap</span>
                </a>
              </div>
            </div>

            {/* Quick Facts */}
            <div className="bg-gray-500/5 border-gray-500/20 border rounded-lg p-4 md:p-8">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">
                Rug Pull Statistics
              </h3>

              <div className="space-y-4">
                <div className="border-b border-gray-500/20 pb-3">
                  <div className="text-3xl font-bold text-[#d6973e] mb-1">
                    $3.8B+
                  </div>
                  <div className="text-sm text-gray-300">
                    Lost to crypto scams in 2022
                  </div>
                </div>

                <div className="border-b border-gray-500/20 pb-3">
                  <div className="text-3xl font-bold text-[#d6973e] mb-1">
                    +37%
                  </div>
                  <div className="text-sm text-gray-300">
                    Increase in rug pulls from 2021
                  </div>
                </div>

                <div className="border-b border-gray-500/20 pb-3">
                  <div className="text-3xl font-bold text-[#d6973e] mb-1">
                    1 in 4
                  </div>
                  <div className="text-sm text-gray-300">
                    New tokens end up being rug pulls
                  </div>
                </div>

                <div>
                  <div className="text-3xl font-bold text-[#d6973e] mb-1">
                    72%
                  </div>
                  <div className="text-sm text-gray-300">
                    Of victims never report the scam
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gray-500/5 border-gray-500/20 border rounded-lg p-4 md:p-8">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-4">
                Stay Informed
              </h3>

              <p className="text-gray-300 text-sm mb-4">
                Subscribe to our newsletter for the latest updates on potential
                scams and educational content.
              </p>

              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full bg-gray-600/40 border border-gray-500/20 text-gray-200 py-2 px-3 rounded-sm text-sm focus:outline-none focus:border-[#d6973e]"
                />

                <button className="w-full bg-[#d6973e] hover:bg-[#c08536] text-gray-900 py-2 px-4 rounded-sm text-sm font-medium transition-all duration-300">
                  Subscribe Now
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
