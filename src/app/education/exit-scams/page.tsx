import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  RiArrowLeftLine,
  RiAlertLine,
  RiDoorOpenLine,
  RiExternalLinkLine,
  RiArrowRightLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiTimeLine,
  RiShieldLine,
  RiRefreshLine,
} from "react-icons/ri";

export default function ExitScamsPage() {
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
            <span className="text-[#d6973e]">Exiting Safely</span>
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
              alt="Exiting Crypto Scams Safely"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold font-title text-white mb-6 leading-tight">
            How to Exit Potential Rug Pulls Safely
          </h1>

          <div className="text-lg text-gray-300 font-subtitle leading-relaxed max-w-4xl">
            When you suspect a project might be fraudulent, knowing how to exit
            properly can mean the difference between salvaging your investment
            and losing everything. Learn strategies for a safe exit without
            triggering panic or making costly mistakes.
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
          {/* Left Column */}
          <div className="col-span-1 md:col-span-2">
            <div className="bg-gray-500/5 border-gray-500/20 border rounded-lg p-4 md:p-8 mb-8">
              <h2 className="text-xl md:text-2xl font-semibold font-subtitle text-white mb-4 md:mb-6 flex items-center">
                <RiAlertLine className="mr-3 text-[#d6973e]" />
                Warning Signs That It&apos;s Time to Exit
              </h2>

              <div className="text-gray-300 leading-relaxed mb-8 text-base md:text-lg whitespace-pre-line max-w-prose">
                <p className="mb-4">
                  Before discussing exit strategies, let&apos;s review key
                  indicators that suggest it may be time to exit a project:
                </p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <RiCloseCircleLine className="text-red-400 mr-3 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">
                        Team Communication Changes
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        Developers becoming unresponsive, avoiding direct
                        questions, or showing sudden changes in communication
                        style or frequency.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <RiCloseCircleLine className="text-red-400 mr-3 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">
                        Missed Roadmap Milestones
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        Multiple delayed or missed deadlines without clear
                        explanation, especially for critical development
                        milestones.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <RiCloseCircleLine className="text-red-400 mr-3 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">
                        Unusual Wallet Movements
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        Large transfers from developer or team wallets to
                        exchanges, or unlocking of tokens ahead of schedule.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <RiCloseCircleLine className="text-red-400 mr-3 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">
                        Increasing Restrictions on Selling
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        New limitations on trading, increased transaction taxes,
                        or other mechanisms that make it harder to sell tokens.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <RiCloseCircleLine className="text-red-400 mr-3 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">
                        Community Sentiment Shift
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        Legitimate critical questions being censored or users
                        being banned from official channels for asking
                        reasonable questions.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="mb-4">
                  If you notice several of these warning signs, it may be time
                  to consider an exit strategy. Remember that{" "}
                  <span className="text-[#d6973e] font-medium">
                    early action is key
                  </span>{" "}
                  - in potential rug pulls, those who exit first typically lose
                  the least.
                </p>
              </div>

              <h2 className="text-xl md:text-2xl font-semibold font-subtitle text-white mb-4 md:mb-6 flex items-center">
                <RiDoorOpenLine className="mr-3 text-[#d6973e]" />
                Strategic Exit Techniques
              </h2>

              <div className="text-gray-300 leading-relaxed mb-8 text-base md:text-lg whitespace-pre-line max-w-prose">
                <p className="mb-4">
                  When exiting a potentially fraudulent project, your approach
                  matters. Here are effective strategies to consider:
                </p>

                <div className="space-y-6 mb-6">
                  <div className="bg-gray-600/30 rounded-lg p-4 md:p-6">
                    <h3 className="font-semibold text-white mb-3 text-lg flex items-center">
                      <RiTimeLine className="mr-2 text-[#d6973e]" /> The Staged
                      Exit
                    </h3>
                    <p className="text-sm text-gray-300 mb-3">
                      Rather than selling your entire position at once (which
                      could result in higher slippage and lower returns),
                      consider selling in smaller portions over a short period.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <RiCheckboxCircleLine className="text-green-400 mr-3 mt-1" />
                        <span>
                          Divide your holdings into 3-5 portions and sell at
                          regular intervals
                        </span>
                      </li>
                      <li className="flex items-start">
                        <RiCheckboxCircleLine className="text-green-400 mr-3 mt-1" />
                        <span>
                          This reduces the impact of price volatility on your
                          overall exit
                        </span>
                      </li>
                      <li className="flex items-start">
                        <RiCheckboxCircleLine className="text-green-400 mr-3 mt-1" />
                        <span>
                          Consider selling 25-30% immediately if you strongly
                          suspect a rug pull
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-600/30 rounded-lg p-4 md:p-6">
                    <h3 className="font-semibold text-white mb-3 text-lg flex items-center">
                      <RiShieldLine className="mr-2 text-[#d6973e]" /> The
                      Silent Exit
                    </h3>
                    <p className="text-sm text-gray-300 mb-3">
                      Avoid announcing your exit in community channels or social
                      media before completing your sales. This prevents:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <RiCheckboxCircleLine className="text-green-400 mr-3 mt-1" />
                        <span>
                          Team members front-running your exit by selling before
                          you
                        </span>
                      </li>
                      <li className="flex items-start">
                        <RiCheckboxCircleLine className="text-green-400 mr-3 mt-1" />
                        <span>
                          Potential harassment or targeting by project defenders
                        </span>
                      </li>
                      <li className="flex items-start">
                        <RiCheckboxCircleLine className="text-green-400 mr-3 mt-1" />
                        <span>
                          Only discuss concerns or share experiences after
                          securing your exit
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-600/30 rounded-lg p-4 md:p-6">
                    <h3 className="font-semibold text-white mb-3 text-lg flex items-center">
                      <RiRefreshLine className="mr-2 text-[#d6973e]" /> The
                      Strategic Swap
                    </h3>
                    <p className="text-sm text-gray-300 mb-3">
                      In some cases, directly swapping to stable assets might be
                      better than converting to ETH/BNB first:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <RiCheckboxCircleLine className="text-green-400 mr-3 mt-1" />
                        <span>
                          If possible, swap directly to stablecoins (USDT, USDC,
                          DAI) to lock in value
                        </span>
                      </li>
                      <li className="flex items-start">
                        <RiCheckboxCircleLine className="text-green-400 mr-3 mt-1" />
                        <span>
                          Consider using multiple DEXs if liquidity is spread
                          across platforms
                        </span>
                      </li>
                      <li className="flex items-start">
                        <RiCheckboxCircleLine className="text-green-400 mr-3 mt-1" />
                        <span>
                          Set appropriate slippage - higher than normal but not
                          excessive
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <p>
                  Remember that{" "}
                  <span className="text-[#d6973e] font-medium">
                    timing is critical
                  </span>
                  . If you&apos;re 70-80% confident a project is fraudulent,
                  it&apos;s better to exit with a partial loss than risk losing
                  everything in a complete rug pull.
                </p>
              </div>

              <h2 className="text-xl md:text-2xl font-semibold font-subtitle text-white mb-4 md:mb-6 flex items-center">
                <RiAlertLine className="mr-3 text-[#d6973e]" />
                Common Exit Mistakes to Avoid
              </h2>

              <div className="text-gray-300 leading-relaxed text-base md:text-lg whitespace-pre-line max-w-prose">
                <p className="mb-4">
                  Even when exiting, there are pitfalls that can cost you
                  significantly:
                </p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <RiCloseCircleLine className="text-red-400 mr-3 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">
                        Panic Selling at Market Lows
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        Rushing to sell immediately after a large price drop
                        often locks in maximum losses. If possible, wait for
                        small recoveries between your exit tranches.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <RiCloseCircleLine className="text-red-400 mr-3 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">
                        Setting Unrealistic Price Targets
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        Holding out for a return to all-time highs when red
                        flags are present. Accept that some loss may be
                        inevitable to avoid a total loss.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <RiCloseCircleLine className="text-red-400 mr-3 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">
                        Ignoring Gas Fees During Emergencies
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        During mass exits, network congestion can spike gas
                        fees. Keep some native chain tokens (ETH, BNB, etc.)
                        reserved specifically for exit transactions.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <RiCloseCircleLine className="text-red-400 mr-3 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-medium">
                        Falling for &quot;Buy the Dip&quot; Manipulation
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        Scammers often encourage &quot;buying the dip&quot;
                        during early stages of a rug pull. Don&apos;t increase
                        your exposure when warning signs are present.
                      </p>
                    </div>
                  </div>
                </div>

                <p>
                  After exiting, take time to document your experience. This can
                  help others avoid similar situations and may be valuable if
                  legal actions emerge against the project.
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
            {/* Emergency Exit Checklist */}
            <div className="bg-gray-500/5 border-gray-500/20 border rounded-lg p-4 md:p-8">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">
                Emergency Exit Checklist
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
                    Check wallet for sufficient gas funds
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
                    Verify token contract allows selling
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
                    Set reasonable slippage (2-10%)
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
                    Determine swap path (token→stable or token→ETH/BNB)
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
                    Decide on exit portion (25-100%)
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
                    Execute swap and confirm transaction
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
                    Move funds to secure wallet if necessary
                  </label>
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-4">
                Use this checklist when you need to exit a project quickly due
                to potential fraud
              </p>
            </div>

            {/* Exit Tools */}
            <div className="bg-gray-500/5 border-gray-500/20 border rounded-lg p-4 md:p-8">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">
                Useful Exit Tools
              </h3>

              <div className="space-y-3">
                <a
                  href="https://debank.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-[#d6973e] transition-colors"
                >
                  <RiExternalLinkLine className="mr-2" />
                  <span>DeBank (Portfolio Tracker)</span>
                </a>
                <a
                  href="https://app.1inch.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-[#d6973e] transition-colors"
                >
                  <RiExternalLinkLine className="mr-2" />
                  <span>1inch (DEX Aggregator)</span>
                </a>
                <a
                  href="https://etherscan.io/gastracker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-[#d6973e] transition-colors"
                >
                  <RiExternalLinkLine className="mr-2" />
                  <span>Etherscan Gas Tracker</span>
                </a>
                <a
                  href="https://app.uniswap.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-[#d6973e] transition-colors"
                >
                  <RiExternalLinkLine className="mr-2" />
                  <span>Uniswap</span>
                </a>
                <a
                  href="https://pancakeswap.finance/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-300 hover:text-[#d6973e] transition-colors"
                >
                  <RiExternalLinkLine className="mr-2" />
                  <span>PancakeSwap</span>
                </a>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-500/5 border-gray-500/20 border rounded-lg p-4 md:p-8">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">
                Exit Strategy Stats
              </h3>

              <div className="space-y-4">
                <div className="border-b border-gray-500/20 pb-3">
                  <div className="text-3xl font-bold text-[#d6973e] mb-1">
                    94%
                  </div>
                  <div className="text-sm text-gray-300">
                    Of investors who identify rug pulls early recover at least
                    50% of their investment
                  </div>
                </div>

                <div className="border-b border-gray-500/20 pb-3">
                  <div className="text-3xl font-bold text-[#d6973e] mb-1">
                    12-24
                  </div>
                  <div className="text-sm text-gray-300">
                    Hours is the average time between first major red flags and
                    complete liquidity removal
                  </div>
                </div>

                <div>
                  <div className="text-3xl font-bold text-[#d6973e] mb-1">
                    30%
                  </div>
                  <div className="text-sm text-gray-300">
                    Average token price drop in first selling wave before
                    temporary recovery
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gray-500/5 border-gray-500/20 border rounded-lg p-4 md:p-8">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-4">
                Need Help With an Exit?
              </h3>

              <p className="text-gray-300 text-sm mb-4">
                Join our community for real-time support when dealing with
                potential scams.
              </p>

              <div className="space-y-3">
                <button className="w-full bg-[#d6973e] hover:bg-[#c08536] text-gray-900 py-2 px-4 rounded-sm text-sm font-medium transition-all duration-300">
                  Join Discord Community
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
