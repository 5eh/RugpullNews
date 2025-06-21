import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  RiArrowLeftLine,
  RiSearchLine,
  RiAlertLine,
  RiExternalLinkLine,
  RiArrowRightLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiUserSearchLine,
  RiLockLine,
  RiCodeLine,
  RiMoneyDollarCircleLine,
} from "react-icons/ri";

export default function IdentifyScamsPage() {
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
            <span className="text-[#d6973e]">Identifying Scams</span>
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
              alt="Identifying Crypto Scams"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold font-title text-white mb-6 leading-tight">
            How to Identify Crypto Rug Pulls
          </h1>

          <div className="text-lg text-gray-300 font-subtitle leading-relaxed max-w-4xl">
            Learn to spot the warning signs of potential scams before investing.
            This guide covers key red flags in team profiles, tokenomics,
            marketing tactics, and technical implementations.
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
          {/* Left Column */}
          <div className="col-span-1 md:col-span-2">
            <div className="bg-gray-500/5 border-gray-500/20 border rounded-lg p-4 md:p-8 mb-8">
              <h2 className="text-xl md:text-2xl font-semibold font-subtitle text-white mb-4 md:mb-6 flex items-center">
                <RiSearchLine className="mr-3 text-[#d6973e]" />
                Common Red Flags in Project Teams
              </h2>

              <div className="text-gray-300 leading-relaxed mb-8 text-base md:text-lg whitespace-pre-line max-w-prose">
                <p className="mb-4">
                  The team behind a project is often the most critical factor in
                  determining its legitimacy. Here are key warning signs to
                  watch for:
                </p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <RiCloseCircleLine className="text-red-400 mr-3 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">
                        Anonymous or Pseudonymous Teams
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        While anonymity isn&apos;t automatically suspicious in
                        crypto, a complete lack of verifiable identities can be
                        a red flag, especially when combined with other warning
                        signs. Look for teams that have established reputations,
                        even if using pseudonyms.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <RiCloseCircleLine className="text-red-400 mr-3 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">
                        Fake Team Profiles
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        Some scammers create fictional team members with stolen
                        photos. Always reverse-image search profile pictures and
                        cross-reference claimed credentials with LinkedIn or
                        other professional networks.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <RiCloseCircleLine className="text-red-400 mr-3 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">
                        Limited or Non-existent Track Record
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        Be wary of teams with no previous experience in
                        blockchain or relevant industries. Legitimate projects
                        typically highlight their team&apos;s background and
                        expertise.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <RiCloseCircleLine className="text-red-400 mr-3 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">
                        Unresponsive to Community Questions
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        Teams that avoid answering tough questions about
                        tokenomics, security, or technical details might be
                        hiding something. Legitimate teams engage transparently
                        with their community.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-600/30 rounded-lg p-4 md:p-6 my-6">
                  <h3 className="font-semibold text-white mb-3 text-lg flex items-center">
                    <RiUserSearchLine className="mr-2 text-[#d6973e]" /> Team
                    Verification Checklist
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <RiCheckboxCircleLine className="text-green-400 mr-3 mt-1" />
                      <span>
                        Verify team members on professional networks like
                        LinkedIn
                      </span>
                    </li>
                    <li className="flex items-start">
                      <RiCheckboxCircleLine className="text-green-400 mr-3 mt-1" />
                      <span>
                        Check for previous projects and their outcomes
                      </span>
                    </li>
                    <li className="flex items-start">
                      <RiCheckboxCircleLine className="text-green-400 mr-3 mt-1" />
                      <span>
                        Look for interviews, conference appearances, or other
                        public engagements
                      </span>
                    </li>
                    <li className="flex items-start">
                      <RiCheckboxCircleLine className="text-green-400 mr-3 mt-1" />
                      <span>
                        Search for the team&apos;s GitHub repositories and code
                        contributions
                      </span>
                    </li>
                    <li className="flex items-start">
                      <RiCheckboxCircleLine className="text-green-400 mr-3 mt-1" />
                      <span>
                        Evaluate their engagement on social media and community
                        channels
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <h2 className="text-xl md:text-2xl font-semibold font-subtitle text-white mb-4 md:mb-6 flex items-center">
                <RiMoneyDollarCircleLine className="mr-3 text-[#d6973e]" />
                Suspicious Tokenomics and Distribution
              </h2>

              <div className="text-gray-300 leading-relaxed mb-8 text-base md:text-lg whitespace-pre-line max-w-prose">
                <p className="mb-4">
                  Tokenomics - how tokens are distributed and used within a
                  project - can reveal potential rug pull intentions:
                </p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <RiCloseCircleLine className="text-red-400 mr-3 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">
                        Excessive Team Allocations
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        When developers and team members hold a
                        <span className="text-[#d6973e] font-medium">
                          {" "}
                          large percentage{" "}
                        </span>
                        of tokens (often over 20-30% without vesting), they can
                        dump them all at once, causing prices to collapse.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <RiCloseCircleLine className="text-red-400 mr-3 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">
                        Locked Liquidity for Very Short Periods
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        Projects that lock liquidity for only days or weeks
                        instead of months or years may be planning a quick exit.
                        Check liquidity locks on tools like Unicrypt or
                        Team.Finance.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <RiCloseCircleLine className="text-red-400 mr-3 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">
                        Hidden Minting Functions
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        Some tokens include hidden functions that allow
                        developers to create unlimited new tokens, diluting
                        value. Always review the contract code or use token
                        scanning tools.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <RiCloseCircleLine className="text-red-400 mr-3 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">
                        Unrealistic Tokenomics
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        Extremely high total supplies (quadrillions), very high
                        transaction taxes, or promises of unsustainable yields
                        are often signs of projects designed to fail.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-xl md:text-2xl font-semibold font-subtitle text-white mb-4 md:mb-6 flex items-center">
                <RiCodeLine className="mr-3 text-[#d6973e]" />
                Smart Contract Red Flags
              </h2>

              <div className="text-gray-300 leading-relaxed mb-8 text-base md:text-lg whitespace-pre-line max-w-prose">
                <p className="mb-4">
                  The smart contract code itself can contain malicious functions
                  designed to enable rug pulls:
                </p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <RiCloseCircleLine className="text-red-400 mr-3 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">
                        Unverified Contract Code
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        If the contract code isn&apos;t verified on block
                        explorers like Etherscan or BscScan, you can&apos;t
                        inspect what it actually does.{" "}
                        <span className="text-[#d6973e] font-medium">
                          Always check for verified contracts.
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <RiCloseCircleLine className="text-red-400 mr-3 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">
                        Honeypot Functions
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        These are functions that allow only certain addresses
                        (usually the developers) to sell tokens, while regular
                        users cannot. Use honeypot checkers like honeypot.is
                        before investing.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <RiCloseCircleLine className="text-red-400 mr-3 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">
                        Backdoor Functions
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        Hidden functions that let developers change critical
                        parameters, like transaction taxes or trading
                        limitations, after launch.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <RiCloseCircleLine className="text-red-400 mr-3 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">
                        No Security Audit
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        Lack of a security audit from reputable firms like
                        CertiK, Hacken, or PeckShield is concerning for any
                        project handling significant funds.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-600/30 rounded-lg p-4 md:p-6 my-6">
                  <h3 className="font-semibold text-white mb-3 text-lg flex items-center">
                    <RiLockLine className="mr-2 text-[#d6973e]" /> Tools for
                    Contract Verification
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <RiCheckboxCircleLine className="text-green-400 mr-3 mt-1" />
                      <span>
                        <span className="text-white">Token Sniffer</span> -
                        Automated contract analysis
                      </span>
                    </li>
                    <li className="flex items-start">
                      <RiCheckboxCircleLine className="text-green-400 mr-3 mt-1" />
                      <span>
                        <span className="text-white">RugDoc</span> - Contract
                        scanning and risk assessment
                      </span>
                    </li>
                    <li className="flex items-start">
                      <RiCheckboxCircleLine className="text-green-400 mr-3 mt-1" />
                      <span>
                        <span className="text-white">Honeypot.is</span> - Checks
                        if tokens can be sold
                      </span>
                    </li>
                    <li className="flex items-start">
                      <RiCheckboxCircleLine className="text-green-400 mr-3 mt-1" />
                      <span>
                        <span className="text-white">BSCheck.eu</span> -
                        Identifies common scam patterns
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <h2 className="text-xl md:text-2xl font-semibold font-subtitle text-white mb-4 md:mb-6 flex items-center">
                <RiAlertLine className="mr-3 text-[#d6973e]" />
                Marketing and Promotion Warning Signs
              </h2>

              <div className="text-gray-300 leading-relaxed text-base md:text-lg whitespace-pre-line max-w-prose">
                <p className="mb-4">
                  How a project markets itself can reveal a lot about its
                  intentions:
                </p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <RiCloseCircleLine className="text-red-400 mr-3 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">
                        Excessive Promises of Returns
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        Claims like &quot100x guaranteed&quot;, or &quot10%
                        daily returns&quot are massive red flags. No legitimate
                        project can guarantee specific returns.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <RiCloseCircleLine className="text-red-400 mr-3 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">
                        Artificial Urgency
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        &quotLimited time only&quot or &quotlast chance to
                        buy&quot messaging designed to pressure investors into
                        making hasty decisions without proper research.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <RiCloseCircleLine className="text-red-400 mr-3 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">
                        Paid Promotions Without Disclosure
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        Influencers promoting a token without disclosing
                        they&apos;re being paid, or projects that rely
                        exclusively on paid promotion rather than organic
                        growth.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <RiCloseCircleLine className="text-red-400 mr-3 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">
                        Copycat Projects
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        Projects that closely mimic successful projects&apos;
                        names, logos, or websites but offer no real innovation
                        or improvements.
                      </p>
                    </div>
                  </div>
                </div>

                <p>
                  Remember that identifying potential scams requires looking at
                  multiple factors in combination. While a single red flag might
                  have an explanation, multiple warning signs usually indicate
                  serious problems.
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
                    Continue reading <RiArrowRightLine className="ml-1" />
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
            {/* Due Diligence Checklist */}
            <div className="bg-gray-500/5 border-gray-500/20 border rounded-lg p-4 md:p-8">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">
                Quick Due Diligence Checklist
              </h3>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="check1"
                    className="w-4 h-4 rounded border-gray-500"
                  />
                  <label
                    htmlFor="check1"
                    className="ml-2 text-gray-300 text-sm"
                  >
                    Verified team identities/reputation
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="check2"
                    className="w-4 h-4 rounded border-gray-500"
                  />
                  <label
                    htmlFor="check2"
                    className="ml-2 text-gray-300 text-sm"
                  >
                    Contract verified on block explorer
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="check3"
                    className="w-4 h-4 rounded border-gray-500"
                  />
                  <label
                    htmlFor="check3"
                    className="ml-2 text-gray-300 text-sm"
                  >
                    Liquidity locked for 6+ months
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="check4"
                    className="w-4 h-4 rounded border-gray-500"
                  />
                  <label
                    htmlFor="check4"
                    className="ml-2 text-gray-300 text-sm"
                  >
                    Reasonable team token allocation
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="check5"
                    className="w-4 h-4 rounded border-gray-500"
                  />
                  <label
                    htmlFor="check5"
                    className="ml-2 text-gray-300 text-sm"
                  >
                    Contract passed security audit
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="check6"
                    className="w-4 h-4 rounded border-gray-500"
                  />
                  <label
                    htmlFor="check6"
                    className="ml-2 text-gray-300 text-sm"
                  >
                    No excessive transaction taxes
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="check7"
                    className="w-4 h-4 rounded border-gray-500"
                  />
                  <label
                    htmlFor="check7"
                    className="ml-2 text-gray-300 text-sm"
                  >
                    Clear, realistic roadmap
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="check8"
                    className="w-4 h-4 rounded border-gray-500"
                  />
                  <label
                    htmlFor="check8"
                    className="ml-2 text-gray-300 text-sm"
                  >
                    No unrealistic return promises
                  </label>
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-4">
                This checklist doesn&apos;t guarantee safety but can help
                identify obvious red flags
              </p>
            </div>

            {/* Scam Checking Tools */}
            <div className="bg-gray-500/5 border-gray-500/20 border rounded-lg p-4 md:p-8">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">
                Essential Scam Checking Tools
              </h3>

              <div className="space-y-3">
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
                  href="https://rugdoc.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-[#d6973e] transition-colors"
                >
                  <RiExternalLinkLine className="mr-2" />
                  <span>RugDoc</span>
                </a>
                <a
                  href="https://honeypot.is/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-[#d6973e] transition-colors"
                >
                  <RiExternalLinkLine className="mr-2" />
                  <span>Honeypot.is</span>
                </a>
                <a
                  href="https://bscheck.eu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-[#d6973e] transition-colors"
                >
                  <RiExternalLinkLine className="mr-2" />
                  <span>BSCheck.eu</span>
                </a>
                <a
                  href="https://explorer.bitquery.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-[#d6973e] transition-colors"
                >
                  <RiExternalLinkLine className="mr-2" />
                  <span>Bitquery Explorer</span>
                </a>
                <a
                  href="https://www.certik.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-[#d6973e] transition-colors"
                >
                  <RiExternalLinkLine className="mr-2" />
                  <span>CertiK Audits</span>
                </a>
              </div>
            </div>

            {/* Case Studies */}
            <div className="bg-gray-500/5 border-gray-500/20 border rounded-lg p-4 md:p-8">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">
                Recent Rug Pull Case Studies
              </h3>

              <div className="space-y-4">
                <div className="border-b border-gray-500/20 pb-3">
                  <h4 className="font-medium text-[#d6973e]">
                    SQUID Token (2021)
                  </h4>
                  <p className="text-sm text-gray-300 mt-1">
                    $3.3M taken when developers suddenly drained liquidity.
                    Classic pump-and-dump scheme tied to a trending Netflix
                    show.
                  </p>
                </div>

                <div className="border-b border-gray-500/20 pb-3">
                  <h4 className="font-medium text-[#d6973e]">
                    AnubisDAO (2021)
                  </h4>
                  <p className="text-sm text-gray-300 mt-1">
                    $60M lost when a developer allegedly got &quotphished&quot
                    and funds disappeared within 24 hours of launch.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-[#d6973e]">
                    SafeMoon (2022)
                  </h4>
                  <p className="text-sm text-gray-300 mt-1">
                    Alleged slow-motion rug pull with team members selling large
                    amounts of tokens after hyping the project.
                  </p>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-400">
                These case studies demonstrate how even popular projects can
                turn out to be scams
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gray-500/5 border-gray-500/20 border rounded-lg p-4 md:p-8">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-4">
                Suspect a Scam?
              </h3>

              <p className="text-gray-300 text-sm mb-4">
                If you&apos;ve identified a potential rug pull, report it to
                help protect the community.
              </p>

              <div className="space-y-3">
                <Link href="/education/report-scams">
                  <button className="w-full bg-[#d6973e] hover:bg-[#c08536] text-gray-900 py-2 px-4 rounded-sm text-sm font-medium transition-all duration-300">
                    Learn How to Report
                  </button>
                </Link>
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
