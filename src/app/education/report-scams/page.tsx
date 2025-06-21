import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  RiArrowLeftLine,
  RiAlertLine,
  RiPoliceCarLine,
  RiExternalLinkLine,
  RiArrowRightLine,
  RiCheckboxCircleLine,
  RiGlobalLine,
  RiShieldCheckLine,
  RiCommunityLine,
  RiFileTextLine,
} from "react-icons/ri";

export default function ReportScamsPage() {
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
            <span className="text-[#d6973e]">Reporting Scams</span>
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
              alt="Reporting Crypto Scams"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold font-title text-white mb-6 leading-tight">
            How to Report Crypto Scams and Rug Pulls
          </h1>

          <div className="text-lg text-gray-300 font-subtitle leading-relaxed max-w-4xl">
            Reporting crypto scams isn&apos;t just about seeking justice for
            yourself—it&apos;s about protecting the entire community. Learn how
            to properly document and report fraudulent projects to the right
            authorities and platforms.
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
          {/* Left Column */}
          <div className="col-span-1 md:col-span-2">
            <div className="bg-gray-500/5 border-gray-500/20 border rounded-lg p-4 md:p-8 mb-8">
              <h2 className="text-xl md:text-2xl font-semibold font-subtitle text-white mb-4 md:mb-6 flex items-center">
                <RiFileTextLine className="mr-3 text-[#d6973e]" />
                Documenting the Scam: First Steps
              </h2>

              <div className="text-gray-300 leading-relaxed mb-8 text-base md:text-lg whitespace-pre-line max-w-prose">
                <p className="mb-4">
                  Before reporting a scam, thorough documentation is essential.
                  This information will strengthen your case when reporting to
                  authorities:
                </p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <RiCheckboxCircleLine className="text-green-400 mr-3 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">
                        Collect All Transaction Records
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        Document all transactions related to the project,
                        including wallet addresses, transaction hashes,
                        timestamps, and amounts. These serve as{" "}
                        <span className="text-[#d6973e] font-medium">
                          immutable evidence
                        </span>{" "}
                        on the blockchain.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <RiCheckboxCircleLine className="text-green-400 mr-3 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">
                        Screenshot Everything
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        Take screenshots of the project&apos;s website,
                        whitepaper, social media accounts, and community
                        channels. Scammers often delete evidence quickly once a
                        rug pull is executed.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <RiCheckboxCircleLine className="text-green-400 mr-3 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">
                        Save Team Information
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        Document any available information about the project
                        team, including names, profile pictures, social media
                        accounts, LinkedIn profiles, and communications.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <RiCheckboxCircleLine className="text-green-400 mr-3 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">
                        Record the Timeline
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        Create a chronological timeline of events, from your
                        initial investment to when you realized it was a scam,
                        including key communications and red flags.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-600/30 rounded-lg p-4 md:p-6 my-6">
                  <h3 className="font-semibold text-white mb-3 text-lg flex items-center">
                    <RiShieldCheckLine className="mr-2 text-[#d6973e]" />{" "}
                    Essential Documentation Checklist
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-[#d6973e] mr-2">•</span>
                      <span>
                        Project name, website URL, and contract address
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#d6973e] mr-2">•</span>
                      <span>Transaction IDs and wallet addresses involved</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#d6973e] mr-2">•</span>
                      <span>
                        Screenshots of marketing materials and promises
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#d6973e] mr-2">•</span>
                      <span>Social media accounts and team information</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#d6973e] mr-2">•</span>
                      <span>
                        Communication records (emails, Discord/Telegram
                        messages)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#d6973e] mr-2">•</span>
                      <span>
                        Financial loss details (amounts, dates, tokens)
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <h2 className="text-xl md:text-2xl font-semibold font-subtitle text-white mb-4 md:mb-6 flex items-center">
                <RiPoliceCarLine className="mr-3 text-[#d6973e]" />
                Where to Report Crypto Scams
              </h2>

              <div className="text-gray-300 leading-relaxed mb-8 text-base md:text-lg whitespace-pre-line max-w-prose">
                <p className="mb-4">
                  Reporting crypto scams often requires a multi-channel
                  approach. Different authorities and platforms handle different
                  aspects of crypto fraud:
                </p>

                <div className="space-y-6 mb-6">
                  <div className="bg-gray-600/30 rounded-lg p-4 md:p-6">
                    <h3 className="font-semibold text-white mb-3 text-lg flex items-center">
                      <RiGlobalLine className="mr-2 text-[#d6973e]" />{" "}
                      Government Authorities
                    </h3>
                    <p className="text-sm text-gray-300 mb-3">
                      Official law enforcement agencies that handle crypto fraud
                      cases:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <RiCheckboxCircleLine className="text-green-400 mr-3 mt-1" />
                        <div>
                          <span className="text-white">
                            FBI&apos;s Internet Crime Complaint Center (IC3)
                          </span>
                          <p className="text-xs text-gray-300">
                            For US-based victims or scams involving US entities
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <RiCheckboxCircleLine className="text-green-400 mr-3 mt-1" />
                        <div>
                          <span className="text-white">
                            Securities and Exchange Commission (SEC)
                          </span>
                          <p className="text-xs text-gray-300">
                            For scams involving securities or investment
                            contracts
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <RiCheckboxCircleLine className="text-green-400 mr-3 mt-1" />
                        <div>
                          <span className="text-white">
                            Federal Trade Commission (FTC)
                          </span>
                          <p className="text-xs text-gray-300">
                            For consumer fraud complaints
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <RiCheckboxCircleLine className="text-green-400 mr-3 mt-1" />
                        <div>
                          <span className="text-white">Local Police</span>
                          <p className="text-xs text-gray-300">
                            For filing an official police report, especially if
                            substantial funds were lost
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-600/30 rounded-lg p-4 md:p-6">
                    <h3 className="font-semibold text-white mb-3 text-lg flex items-center">
                      <RiCommunityLine className="mr-2 text-[#d6973e]" /> Crypto
                      Community Platforms
                    </h3>
                    <p className="text-sm text-gray-300 mb-3">
                      Platforms where you can alert other community members:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <RiCheckboxCircleLine className="text-green-400 mr-3 mt-1" />
                        <div>
                          <span className="text-white">
                            CryptoScamDB and similar databases
                          </span>
                          <p className="text-xs text-gray-300">
                            Central repositories of known scams
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <RiCheckboxCircleLine className="text-green-400 mr-3 mt-1" />
                        <div>
                          <span className="text-white">
                            Token Sniffer, RugDoc, and other analysis platforms
                          </span>
                          <p className="text-xs text-gray-300">
                            Can flag contracts and teams as suspicious
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <RiCheckboxCircleLine className="text-green-400 mr-3 mt-1" />
                        <div>
                          <span className="text-white">
                            CertiK and other audit platforms
                          </span>
                          <p className="text-xs text-gray-300">
                            Often maintain databases of scam projects
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <RiCheckboxCircleLine className="text-green-400 mr-3 mt-1" />
                        <div>
                          <span className="text-white">Block Explorers</span>
                          <p className="text-xs text-gray-300">
                            Some allow flagging addresses as suspicious
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-600/30 rounded-lg p-4 md:p-6">
                    <h3 className="font-semibold text-white mb-3 text-lg flex items-center">
                      <RiAlertLine className="mr-2 text-[#d6973e]" /> Social
                      Media and Exchanges
                    </h3>
                    <p className="text-sm text-gray-300 mb-3">
                      Additional platforms to report scams:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <RiCheckboxCircleLine className="text-green-400 mr-3 mt-1" />
                        <div>
                          <span className="text-white">
                            Cryptocurrency Exchanges
                          </span>
                          <p className="text-xs text-gray-300">
                            Report suspicious wallet addresses to exchanges
                            where funds may be transferred
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <RiCheckboxCircleLine className="text-green-400 mr-3 mt-1" />
                        <div>
                          <span className="text-white">
                            Twitter, Reddit, and Discord
                          </span>
                          <p className="text-xs text-gray-300">
                            Alert communities but be careful of defamation
                            claims—stick to facts
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <RiCheckboxCircleLine className="text-green-400 mr-3 mt-1" />
                        <div>
                          <span className="text-white">
                            CoinMarketCap and CoinGecko
                          </span>
                          <p className="text-xs text-gray-300">
                            Report suspicious tokens to these listing platforms
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <p>
                  Remember that{" "}
                  <span className="text-[#d6973e] font-medium">
                    timing is critical
                  </span>{" "}
                  when reporting scams. The sooner you report, the better chance
                  authorities have of tracking funds or taking action against
                  perpetrators.
                </p>
              </div>

              <h2 className="text-xl md:text-2xl font-semibold font-subtitle text-white mb-4 md:mb-6 flex items-center">
                <RiAlertLine className="mr-3 text-[#d6973e]" />
                After Reporting: Next Steps
              </h2>

              <div className="text-gray-300 leading-relaxed text-base md:text-lg whitespace-pre-line max-w-prose">
                <p className="mb-4">
                  After filing reports, there are several important steps to
                  take:
                </p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <RiCheckboxCircleLine className="text-green-400 mr-3 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">
                        Follow Up Regularly
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        Check the status of your reports periodically.
                        Investigation of crypto scams can be slow, but
                        persistence increases the chances of action.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <RiCheckboxCircleLine className="text-green-400 mr-3 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">
                        Connect with Other Victims
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        Find and coordinate with other victims. Group complaints
                        carry more weight and can help share information. Look
                        for victim groups on social media platforms.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <RiCheckboxCircleLine className="text-green-400 mr-3 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">
                        Consider Legal Options
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        For substantial losses, consult with a lawyer who
                        specializes in cryptocurrency fraud. Class action
                        lawsuits may be possible if enough victims come forward.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <RiCheckboxCircleLine className="text-green-400 mr-3 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">
                        Stay Alert for Recovery Scams
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        Be wary of &quot;recovery specialists&quot; who approach
                        victims offering to retrieve lost funds for an upfront
                        fee. These are often secondary scams targeting desperate
                        victims.
                      </p>
                    </div>
                  </div>
                </div>

                <p>
                  While recovery of funds from crypto scams is unfortunately
                  rare, your reporting helps protect others and contributes to
                  the eventual identification and prosecution of perpetrators.
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
                  href="/education/intro"
                  className="bg-gray-600/30 hover:bg-gray-600/50 rounded-lg p-4 transition-all duration-300 flex flex-col h-full"
                >
                  <h3 className="font-semibold text-white mb-2 text-lg flex items-center">
                    <span className="text-[#d6973e] mr-2">01</span> Introduction
                    to Rug Pulls
                  </h3>
                  <p className="text-gray-300 text-sm mb-3 flex-grow">
                    Understand the basics of rug pulls and why they&apos;re
                    dangerous.
                  </p>
                  <span className="text-[#d6973e] text-sm flex items-center mt-auto">
                    Continue reading <RiArrowRightLine className="ml-1" />
                  </span>
                </Link>

                <Link
                  href="/education/identify-scams"
                  className="bg-gray-600/30 hover:bg-gray-600/50 rounded-lg p-4 transition-all duration-300 flex flex-col h-full"
                >
                  <h3 className="font-semibold text-white mb-2 text-lg flex items-center">
                    <span className="text-[#d6973e] mr-2">02</span> Identifying
                    Scams
                  </h3>
                  <p className="text-gray-300 text-sm mb-3 flex-grow">
                    Learn to spot the warning signs of potential rug pulls
                    before investing.
                  </p>
                  <span className="text-[#d6973e] text-sm flex items-center mt-auto">
                    Continue reading <RiArrowRightLine className="ml-1" />
                  </span>
                </Link>

                <Link
                  href="/education/exit-scams"
                  className="bg-gray-600/30 hover:bg-gray-600/50 rounded-lg p-4 transition-all duration-300 flex flex-col h-full"
                >
                  <h3 className="font-semibold text-white mb-2 text-lg flex items-center">
                    <span className="text-[#d6973e] mr-2">03</span> Exiting
                    Safely
                  </h3>
                  <p className="text-gray-300 text-sm mb-3 flex-grow">
                    Strategies for safely exiting a project if you suspect
                    fraud.
                  </p>
                  <span className="text-[#d6973e] text-sm flex items-center mt-auto">
                    Continue reading <RiArrowRightLine className="ml-1" />
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
                    View analyses <RiArrowRightLine className="ml-1" />
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6 md:space-y-8">
            {/* Key Reporting Links */}
            <div className="bg-gray-500/5 border-gray-500/20 border rounded-lg p-4 md:p-8">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">
                Key Reporting Resources
              </h3>

              <div className="space-y-3">
                <a
                  href="https://www.ic3.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-[#d6973e] transition-colors"
                >
                  <RiExternalLinkLine className="mr-2" />
                  <span>FBI Internet Crime Complaint Center</span>
                </a>
                <a
                  href="https://www.sec.gov/tcr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-[#d6973e] transition-colors"
                >
                  <RiExternalLinkLine className="mr-2" />
                  <span>SEC Tip, Complaint, or Referral</span>
                </a>
                <a
                  href="https://reportfraud.ftc.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-[#d6973e] transition-colors"
                >
                  <RiExternalLinkLine className="mr-2" />
                  <span>FTC Fraud Reporting</span>
                </a>
                <a
                  href="https://cryptoscamdb.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-[#d6973e] transition-colors"
                >
                  <RiExternalLinkLine className="mr-2" />
                  <span>CryptoScamDB</span>
                </a>
                <a
                  href="https://www.globalantiscam.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-[#d6973e] transition-colors"
                >
                  <RiExternalLinkLine className="mr-2" />
                  <span>Global Anti-Scam Organization</span>
                </a>
              </div>
            </div>

            {/* Report Template */}
            <div className="bg-gray-500/5 border-gray-500/20 border rounded-lg p-4 md:p-8">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">
                Scam Report Template
              </h3>

              <p className="text-sm text-gray-300 mb-4">
                Download our template to help structure your scam report. A
                well-organized report increases the chances of action.
              </p>

              <button className="w-full bg-[#d6973e] hover:bg-[#c08536] text-gray-900 py-2 px-4 rounded-sm text-sm font-medium transition-all duration-300 mb-3">
                Download Report Template
              </button>

              <div className="text-xs text-gray-400">
                PDF format • Includes sections for all required information •
                Compatible with most reporting platforms
              </div>
            </div>

            {/* Recovery Stats */}
            <div className="bg-gray-500/5 border-gray-500/20 border rounded-lg p-4 md:p-8">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">
                Reporting Impact Statistics
              </h3>

              <div className="space-y-4">
                <div className="border-b border-gray-500/20 pb-3">
                  <div className="text-3xl font-bold text-[#d6973e] mb-1">
                    95%
                  </div>
                  <div className="text-sm text-gray-300">
                    Of crypto scams go unreported to official authorities
                  </div>
                </div>

                <div className="border-b border-gray-500/20 pb-3">
                  <div className="text-3xl font-bold text-[#d6973e] mb-1">
                    14%
                  </div>
                  <div className="text-sm text-gray-300">
                    Recovery rate for scams reported within 24 hours
                  </div>
                </div>

                <div>
                  <div className="text-3xl font-bold text-[#d6973e] mb-1">
                    67%
                  </div>
                  <div className="text-sm text-gray-300">
                    Reduction in victim count when scams are reported early
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gray-500/5 border-gray-500/20 border rounded-lg p-4 md:p-8">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-4">
                Report a Scam to Us
              </h3>

              <p className="text-gray-300 text-sm mb-4">
                Help us document and analyze potential rug pulls to warn the
                community.
              </p>

              <div className="space-y-3">
                <button className="w-full bg-[#d6973e] hover:bg-[#c08536] text-gray-900 py-2 px-4 rounded-sm text-sm font-medium transition-all duration-300">
                  Submit a Project for Analysis
                </button>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-900/30 rounded-lg p-4 md:p-6">
              <div className="text-xs md:text-sm text-yellow-200">
                <strong>Disclaimer:</strong> This educational content is for
                informational purposes only and should not be considered
                financial or legal advice. Always consult with appropriate
                professionals before taking legal action.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
