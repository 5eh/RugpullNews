"use client";

import React, { useState } from "react";
import Link from "next/link";

function IdentifyScamsPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    if (expandedSection === sectionId) {
      setExpandedSection(null);
    } else {
      setExpandedSection(sectionId);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 font-title">
        How to Identify Crypto Scams & Rug Pulls
      </h1>

      <div className="bg-gray-800/30 p-6 rounded-lg mb-10 border border-red-800/30">
        <h2 className="text-xl font-bold mb-3 text-red-300">Warning</h2>
        <p className="text-gray-300">
          The cryptocurrency space is rife with scams and fraudulent projects
          designed to separate you from your money. This guide will help you
          identify common red flags and protect yourself, but remember: if
          something sounds too good to be true, it probably is. Always conduct
          thorough research before investing in any project.
        </p>
      </div>

      <div className="space-y-8 mb-12">
        <div className="border-b border-gray-700/50 pb-4 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-white font-title">
            Table of Contents
          </h2>
          <ul className="space-y-2 text-gray-300">
            <li className="hover:text-[#d6973e] transition-colors">
              <a href="#introduction" className="flex items-center">
                <span className="mr-2">01.</span> Introduction to Crypto Scams
              </a>
            </li>
            <li className="hover:text-[#d6973e] transition-colors">
              <a href="#team-transparency" className="flex items-center">
                <span className="mr-2">02.</span> Team & Transparency Red Flags
              </a>
            </li>
            <li className="hover:text-[#d6973e] transition-colors">
              <a href="#tokenomics" className="flex items-center">
                <span className="mr-2">03.</span> Tokenomics & Distribution
                Warning Signs
              </a>
            </li>
            <li className="hover:text-[#d6973e] transition-colors">
              <a href="#smart-contracts" className="flex items-center">
                <span className="mr-2">04.</span> Smart Contract Vulnerabilities
              </a>
            </li>
            <li className="hover:text-[#d6973e] transition-colors">
              <a href="#marketing" className="flex items-center">
                <span className="mr-2">05.</span> Marketing & Community Red
                Flags
              </a>
            </li>
            <li className="hover:text-[#d6973e] transition-colors">
              <a href="#defi-nft" className="flex items-center">
                <span className="mr-2">06.</span> DeFi & NFT-Specific Scams
              </a>
            </li>
            <li className="hover:text-[#d6973e] transition-colors">
              <a href="#tools" className="flex items-center">
                <span className="mr-2">07.</span> Tools to Detect Scams
              </a>
            </li>
            <li className="hover:text-[#d6973e] transition-colors">
              <a href="#action-plan" className="flex items-center">
                <span className="mr-2">08.</span> Your Scam Detection Action
                Plan
              </a>
            </li>
          </ul>
        </div>

        {/* Introduction */}
        <section id="introduction" className="scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4 text-white font-title">
            01. Introduction to Crypto Scams
          </h2>
          <div className="bg-gray-800/20 p-6 rounded-lg mb-4">
            <p className="mb-4 text-gray-300">
              The cryptocurrency market has experienced explosive growth,
              attracting not just legitimate innovators but also bad actors
              looking to exploit the hype and technical complexity. Scams in the
              crypto space are more sophisticated than traditional scams, often
              leveraging technical jargon, FOMO (fear of missing out), and the
              promise of financial freedom.
            </p>
            <p className="mb-4 text-gray-300">
              According to blockchain analytics firm Chainalysis, cryptocurrency
              scams cost investors over $7.7 billion in 2021 alone, with rug
              pulls becoming increasingly common. A &quot;rug pull&quot; occurs
              when crypto developers abandon a project and run away with
              investors&apos; funds, typically after pumping the token&apos;s
              price.
            </p>
            <h3 className="text-xl font-bold mt-6 mb-3 text-red-300">
              Common Types of Crypto Scams
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>
                <strong className="text-white">Rug Pulls:</strong> Developers
                create a seemingly legitimate token, raise funds, then disappear
                with the money while the token value crashes to zero.
              </li>
              <li>
                <strong className="text-white">Pump and Dumps:</strong> Scammers
                artificially inflate the price of a low-value token through
                false statements and social media hype, then sell their shares
                at the peak.
              </li>
              <li>
                <strong className="text-white">Fake ICOs/Token Sales:</strong>{" "}
                Fraudulent initial coin offerings that raise funds for
                non-existent projects or copy legitimate projects.
              </li>
              <li>
                <strong className="text-white">Ponzi/Pyramid Schemes:</strong>{" "}
                Projects that promise high yields but actually pay early
                investors with funds from new investors.
              </li>
              <li>
                <strong className="text-white">Phishing Scams:</strong> Fake
                websites, emails, or social media accounts that trick users into
                revealing private keys or sending crypto to scammers.
              </li>
              <li>
                <strong className="text-white">Airdrop Scams:</strong> Fake
                airdrops that require users to send crypto or private
                information to receive &quot;free&quot; tokens.
              </li>
            </ul>
            <div
              className="mt-6 cursor-pointer text-[#d6973e] font-medium"
              onClick={() => toggleSection("introductionFull")}
            >
              {expandedSection === "introductionFull"
                ? "Show Less ↑"
                : "Read More About Scam Prevalence ↓"}
            </div>
            {expandedSection === "introductionFull" && (
              <div className="mt-4 border-t border-gray-700/50 pt-4">
                <p className="mb-4 text-gray-300">
                  A Federal Trade Commission report noted that from October 2020
                  through March 2021, reports of crypto-related scams increased
                  nearly 1,000% compared to the same period a year earlier. The
                  anonymity and irreversibility of blockchain transactions make
                  crypto particularly attractive to scammers.
                </p>
                <p className="mb-4 text-gray-300">
                  Many victims never report being scammed due to embarrassment
                  or resignation that their funds cannot be recovered, meaning
                  the actual impact is likely much higher than reported figures.
                </p>
                <p className="text-gray-300">
                  The key to protecting yourself is developing a critical eye
                  and learning to recognize the warning signs before investing.
                  Let&apos;s explore these red flags in detail.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Team & Transparency */}
        <section id="team-transparency" className="scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4 text-white font-title">
            02. Team & Transparency Red Flags
          </h2>
          <div className="bg-gray-800/20 p-6 rounded-lg mb-4">
            <h3 className="text-xl font-bold mb-3 text-red-300">
              Anonymous or Unverifiable Team
            </h3>
            <p className="mb-4 text-gray-300">
              While anonymity isn&apos;t always a red flag (Satoshi Nakamoto,
              the creator of Bitcoin, remains anonymous), for new projects, an
              anonymous team should prompt extra scrutiny.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>
                Look for projects with doxxed (publicly identified) team members
                with verifiable backgrounds in blockchain, finance, or relevant
                technical fields.
              </li>
              <li>
                Search for team members on LinkedIn, GitHub, and other
                professional platforms to verify their credentials and past
                experience.
              </li>
              <li>
                Check if the team has been involved in previous successful
                projects or, conversely, failed projects or scams.
              </li>
              <li>
                Be wary of teams that use fake identities or stock photos for
                team members—a reverse image search can help identify this.
              </li>
            </ul>
            <h3 className="text-xl font-bold mt-6 mb-3 text-red-300">
              Lack of Transparency
            </h3>
            <p className="mb-4 text-gray-300">
              Legitimate projects are typically transparent about their
              operations, progress, and usage of funds.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>
                Verify if the project has a clear, detailed whitepaper that
                explains the technology, use case, token economics, and roadmap.
              </li>
              <li>
                Check if the project provides regular updates through official
                channels such as their website, blog, or social media.
              </li>
              <li>
                Look for transparency regarding how funds are being used, such
                as through public wallets or regular financial reports.
              </li>
              <li>
                Be wary of projects that consistently miss deadlines without
                explanation or projects that suddenly change their focus or
                roadmap.
              </li>
            </ul>
            <h3 className="text-xl font-bold mt-6 mb-3 text-red-300">
              No Legal Entity or Unclear Jurisdiction
            </h3>
            <p className="mb-4 text-gray-300">
              Legitimate projects typically operate as registered legal entities
              in jurisdictions with clear regulatory frameworks.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>
                Check if the project is associated with a registered company and
                in which jurisdiction it operates.
              </li>
              <li>
                Be cautious of projects registered in jurisdictions known for
                lax regulations or those that are unclear about their legal
                status.
              </li>
              <li>
                Look for terms of service and privacy policies that specify the
                governing law and jurisdiction for disputes.
              </li>
            </ul>
            <div
              className="mt-6 cursor-pointer text-[#d6973e] font-medium"
              onClick={() => toggleSection("teamFull")}
            >
              {expandedSection === "teamFull"
                ? "Show Less ↑"
                : "Read More About Team Verification ↓"}
            </div>
            {expandedSection === "teamFull" && (
              <div className="mt-4 border-t border-gray-700/50 pt-4">
                <h3 className="text-xl font-bold mb-3 text-white">
                  Advanced Team Verification
                </h3>
                <p className="mb-4 text-gray-300">
                  For larger investments, consider these additional verification
                  steps:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>
                    Attend AMAs (Ask Me Anything) sessions to gauge how team
                    members respond to challenging questions.
                  </li>
                  <li>
                    Look for interviews with team members on reputable crypto
                    media outlets.
                  </li>
                  <li>
                    Check if team members speak at industry conferences or
                    contribute to open-source projects.
                  </li>
                  <li>
                    Review the team&apos;s GitHub activity to assess code
                    quality and development frequency.
                  </li>
                  <li>
                    For teams that claim to have partnerships, verify these
                    claims directly with the partnering organizations.
                  </li>
                </ul>
                <p className="mt-4 text-gray-300">
                  Remember that even projects with seemingly legitimate teams
                  can be scams, so always cross-reference with other red flags
                  in this guide.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Tokenomics & Distribution */}
        <section id="tokenomics" className="scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4 text-white font-title">
            03. Tokenomics & Distribution Warning Signs
          </h2>
          <div className="bg-gray-800/20 p-6 rounded-lg mb-4">
            <h3 className="text-xl font-bold mb-3 text-red-300">
              Highly Concentrated Token Distribution
            </h3>
            <p className="mb-4 text-gray-300">
              One of the most common characteristics of rug pulls is a highly
              concentrated token supply, where a few wallets control a large
              percentage of the tokens.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>
                Use blockchain explorers like Etherscan to check token
                distribution among top wallets.
              </li>
              <li>
                Be wary if team wallets or a small number of addresses hold more
                than 50% of the token supply.
              </li>
              <li>
                Watch for wallets with large holdings that are not clearly
                identified (e.g., not labeled as exchange wallets, team wallets,
                or treasury).
              </li>
            </ul>
            <h3 className="text-xl font-bold mt-6 mb-3 text-red-300">
              Unrealistic Tokenomics
            </h3>
            <p className="mb-4 text-gray-300">
              Projects with unsustainable tokenomics often collapse once the
              initial hype fades.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>
                Be skeptical of extreme token supplies (either very large or
                very small) without logical justification.
              </li>
              <li>
                Question extraordinarily high staking or yield farming rewards
                (e.g., 30%+ APY) that don&apos;t have a clear, sustainable
                source.
              </li>
              <li>
                Watch for projects that continuously mint new tokens without
                value-adding mechanisms to offset the inflation.
              </li>
              <li>
                Be wary of projects that rely solely on new investors coming in
                to maintain token value (resembling a Ponzi scheme).
              </li>
            </ul>
            <h3 className="text-xl font-bold mt-6 mb-3 text-red-300">
              Locked Liquidity and Vesting Concerns
            </h3>
            <p className="mb-4 text-gray-300">
              The way a project handles liquidity and token vesting can reveal a
              lot about its long-term intentions.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>
                Check if liquidity is locked and for how long. Short liquidity
                lock periods (less than 6 months) can be a red flag.
              </li>
              <li>
                Verify if the team&apos;s tokens are subject to vesting periods.
                Projects where team tokens have no vesting or very short vesting
                periods increase the risk of a dump.
              </li>
              <li>
                Look for projects that use third-party services like
                Team.Finance or TrustSwap for transparent token locks.
              </li>
              <li>
                Be cautious of projects that don&apos;t clearly explain their
                token release schedule or change it frequently.
              </li>
            </ul>
            <div
              className="mt-6 cursor-pointer text-[#d6973e] font-medium"
              onClick={() => toggleSection("tokenomicsFull")}
            >
              {expandedSection === "tokenomicsFull"
                ? "Show Less ↑"
                : "Read More About Tokenomics Analysis ↓"}
            </div>
            {expandedSection === "tokenomicsFull" && (
              <div className="mt-4 border-t border-gray-700/50 pt-4">
                <h3 className="text-xl font-bold mb-3 text-white">
                  Transaction Tax Red Flags
                </h3>
                <p className="mb-4 text-gray-300">
                  Many scam tokens implement high transaction taxes that benefit
                  the creators or make it difficult to sell.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>
                    Watch for asymmetric buy/sell taxes (e.g., 5% to buy but 25%
                    to sell), which discourage selling.
                  </li>
                  <li>
                    Be cautious of &quot;reflection&quot; tokens with extremely
                    high redistribution rates that primarily benefit early
                    holders or large wallets.
                  </li>
                  <li>
                    Check if transaction taxes go to clearly defined purposes
                    (development, marketing, etc.) rather than unspecified
                    wallets.
                  </li>
                  <li>
                    Research honeypot tokens that allow buying but completely
                    prevent selling through code manipulation.
                  </li>
                </ul>
                <h3 className="text-xl font-bold mt-6 mb-3 text-white">
                  Liquidity Analysis Tools
                </h3>
                <p className="mb-4 text-gray-300">
                  Several tools can help you analyze token liquidity and
                  distribution:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>
                    <strong>Dextools:</strong> Provides trading charts,
                    liquidity information, and holder data for tokens on
                    decentralized exchanges.
                  </li>
                  <li>
                    <strong>Dexscreener:</strong> Offers quick liquidity and
                    trading volume analytics across multiple chains.
                  </li>
                  <li>
                    <strong>TokenSniffer:</strong> Automatically analyzes
                    contract code for common scam patterns and checks for token
                    copies.
                  </li>
                  <li>
                    <strong>RugDoc:</strong> Provides rugpull risk assessment
                    and liquidity lock verification.
                  </li>
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Smart Contract Vulnerabilities */}
        <section id="smart-contracts" className="scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4 text-white font-title">
            04. Smart Contract Vulnerabilities
          </h2>
          <div className="bg-gray-800/20 p-6 rounded-lg mb-4">
            <h3 className="text-xl font-bold mb-3 text-red-300">
              Unverified Contracts
            </h3>
            <p className="mb-4 text-gray-300">
              Smart contracts should be verified on blockchain explorers,
              allowing anyone to review the code.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>
                Always check if the project&apos;s smart contracts are verified
                on block explorers like Etherscan, BscScan, or PolygonScan.
              </li>
              <li>
                Unverified contracts are a major red flag as they prevent code
                review and hide potential malicious functions.
              </li>
              <li>
                Even for verified contracts, check when they were verified —
                contracts verified immediately after deployment are preferable
                to those verified much later.
              </li>
            </ul>
            <h3 className="text-xl font-bold mt-6 mb-3 text-red-300">
              Dangerous Contract Functions
            </h3>
            <p className="mb-4 text-gray-300">
              Several contract functions can allow developers to manipulate the
              token or drain funds.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>
                <strong>Mint Functions:</strong> Uncapped or admin-controlled
                minting allows creators to create an unlimited number of tokens,
                diluting value.
              </li>
              <li>
                <strong>Ownership Functions:</strong> Functions that allow
                changing ownership or transferring control of critical contract
                functions can be abused.
              </li>
              <li>
                <strong>Fee Manipulation:</strong> Functions that allow changing
                transaction fees or taxes without limits or governance.
              </li>
              <li>
                <strong>Blacklist Functions:</strong> While sometimes legitimate
                for compliance, blacklist functions that can block specific
                addresses from selling can be misused.
              </li>
              <li>
                <strong>Proxy Contracts:</strong> Upgradeable contracts can be
                legitimate but also allow developers to change the entire
                contract functionality.
              </li>
            </ul>
            <h3 className="text-xl font-bold mt-6 mb-3 text-red-300">
              No Security Audits
            </h3>
            <p className="mb-4 text-gray-300">
              Security audits by reputable firms help identify and fix
              vulnerabilities in smart contracts.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>
                Check if the project has undergone audits by recognized security
                firms like CertiK, Hacken, or PeckShield.
              </li>
              <li>
                Verify the audit reports by checking the security firm&apos;s
                official website or repository.
              </li>
              <li>
                Be aware that audits don&apos;t guarantee safety but reduce
                risk. Even audited projects can have exploits or backdoors.
              </li>
              <li>
                Look for projects that have undergone multiple audits or
                continuous auditing as they develop.
              </li>
            </ul>
            <div
              className="mt-6 cursor-pointer text-[#d6973e] font-medium"
              onClick={() => toggleSection("contractFull")}
            >
              {expandedSection === "contractFull"
                ? "Show Less ↑"
                : "Read More About Contract Analysis ↓"}
            </div>
            {expandedSection === "contractFull" && (
              <div className="mt-4 border-t border-gray-700/50 pt-4">
                <h3 className="text-xl font-bold mb-3 text-white">
                  DIY Contract Analysis
                </h3>
                <p className="mb-4 text-gray-300">
                  Even without deep technical knowledge, you can perform basic
                  contract analysis:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>
                    Use tools like Token Sniffer to scan for contract
                    similarities with known scams.
                  </li>
                  <li>
                    Check the contract creation date and initial transactions to
                    ensure it matches the project&apos;s claimed timeline.
                  </li>
                  <li>
                    Look for &quot;honeypot&quot; detectors that can identify
                    contracts that prevent selling.
                  </li>
                  <li>
                    Examine ownership renunciation — while sometimes positive,
                    some scammers renounce ownership after inserting backdoors.
                  </li>
                </ul>
                <h3 className="text-xl font-bold mt-6 mb-3 text-white">
                  Common Smart Contract Scams
                </h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>
                    <strong>Hidden Mint Functions:</strong> Code that allows
                    creators to create new tokens silently, often hidden in
                    complex functions.
                  </li>
                  <li>
                    <strong>Liquidity Draining:</strong> Functions that allow
                    developers to remove liquidity despite claims of
                    &quot;locked liquidity.&quot;
                  </li>
                  <li>
                    <strong>Flash Loan Attack Vulnerabilities:</strong> Code
                    vulnerabilities that allow attackers to manipulate price
                    using flash loans.
                  </li>
                  <li>
                    <strong>Hard-coded Addresses:</strong> Functions that
                    secretly send funds to developer wallets during
                    transactions.
                  </li>
                  <li>
                    <strong>Time-lock Bypasses:</strong> Code that appears to
                    lock functions for a period but contains workarounds.
                  </li>
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Marketing & Community */}
        <section id="marketing" className="scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4 text-white font-title">
            05. Marketing & Community Red Flags
          </h2>
          <div className="bg-gray-800/20 p-6 rounded-lg mb-4">
            <h3 className="text-xl font-bold mb-3 text-red-300">
              Excessive Promises and Hype
            </h3>
            <p className="mb-4 text-gray-300">
              Unrealistic promises of returns or revolutionary technology are
              classic warning signs.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>
                Be extremely cautious of projects promising guaranteed returns
                or using phrases like &quot;no risk&quot; or &quot;guaranteed
                profits.&quot;
              </li>
              <li>
                Watch for exaggerated claims about partnerships with major
                companies without verifiable proof.
              </li>
              <li>
                Be skeptical of projects claiming to &quot;revolutionize&quot;
                multiple industries simultaneously without clear expertise in
                those areas.
              </li>
              <li>
                Question aggressive price predictions that aren&apos;t backed by
                solid fundamentals or clear value creation.
              </li>
            </ul>
            <h3 className="text-xl font-bold mt-6 mb-3 text-red-300">
              Artificial Community Engagement
            </h3>
            <p className="mb-4 text-gray-300">
              Many scam projects create a false impression of community interest
              and engagement.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>
                Look for signs of bot activity in Telegram groups or Discord
                servers, such as generic messages or unnatural conversation
                patterns.
              </li>
              <li>
                Check social media followers for suspicious patterns like
                accounts created recently or with little activity.
              </li>
              <li>
                Be wary of communities where critical questions are immediately
                deleted or questioners are banned.
              </li>
              <li>
                Evaluate the quality of discussion — legitimate communities
                discuss technology and use cases, not just price and &quot;when
                moon.&quot;
              </li>
            </ul>
            <h3 className="text-xl font-bold mt-6 mb-3 text-red-300">
              Paid Promotions Without Disclosure
            </h3>
            <p className="mb-4 text-gray-300">
              Undisclosed paid promotions from influencers are both unethical
              and potentially illegal.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>
                Be skeptical of sudden, coordinated promotion by multiple
                influencers without disclosure of payment.
              </li>
              <li>
                Check if influencers promoting the project have a history of
                promoting scams or failed projects.
              </li>
              <li>
                Watch for influencers who never mention risks or downsides,
                presenting only positive aspects.
              </li>
              <li>
                Research if the project relies almost exclusively on influencer
                marketing rather than building actual utility.
              </li>
            </ul>
            <div
              className="mt-6 cursor-pointer text-[#d6973e] font-medium"
              onClick={() => toggleSection("marketingFull")}
            >
              {expandedSection === "marketingFull"
                ? "Show Less ↑"
                : "Read More About Marketing Tactics ↓"}
            </div>
            {expandedSection === "marketingFull" && (
              <div className="mt-4 border-t border-gray-700/50 pt-4">
                <h3 className="text-xl font-bold mb-3 text-white">
                  Urgency and FOMO Tactics
                </h3>
                <p className="mb-4 text-gray-300">
                  Scammers often create artificial urgency to push victims into
                  making hasty decisions.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>
                    Be wary of extremely limited token sales with countdown
                    timers designed to rush decisions.
                  </li>
                  <li>
                    Question &quot;once in a lifetime&quot; opportunity claims
                    or assertions that you&apos;ll &quot;miss out forever&quot;
                    if you don&apos;t act immediately.
                  </li>
                  <li>
                    Be cautious of projects that continuously announce
                    &quot;last chance&quot; opportunities that keep extending.
                  </li>
                  <li>
                    Watch for artificial price pumps right before public sales
                    to create FOMO.
                  </li>
                </ul>
                <h3 className="text-xl font-bold mt-6 mb-3 text-white">
                  Celebrity Endorsements
                </h3>
                <p className="mb-4 text-gray-300">
                  Fake or misleading celebrity endorsements are common in crypto
                  scams.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>
                    Verify celebrity endorsements through the celebrity&apos;s
                    official channels, not just the project&apos;s claims.
                  </li>
                  <li>
                    Be aware that many scammers use fake images or manipulated
                    videos of celebrities to create the impression of
                    endorsement.
                  </li>
                  <li>
                    Remember that celebrities promoting crypto often have little
                    technical understanding and may be paid promoters.
                  </li>
                  <li>
                    Consider why a legitimate project would need celebrity
                    endorsements rather than standing on its technical merits.
                  </li>
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* DeFi & NFT Scams */}
        <section id="defi-nft" className="scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4 text-white font-title">
            06. DeFi & NFT-Specific Scams
          </h2>
          <div className="bg-gray-800/20 p-6 rounded-lg mb-4">
            <h3 className="text-xl font-bold mb-3 text-red-300">
              DeFi Project Red Flags
            </h3>
            <p className="mb-4 text-gray-300">
              Decentralized Finance (DeFi) projects have unique risk factors due
              to their complexity.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>
                <strong className="text-white">Unsustainable APYs:</strong>{" "}
                Yields that seem too good to be true (e.g., thousands of percent
                APY) without clear revenue sources.
              </li>
              <li>
                <strong className="text-white">No Timelock/Multisig:</strong>{" "}
                Admin keys controlled by a single wallet without timelock or
                multisignature security.
              </li>
              <li>
                <strong className="text-white">Copied Code:</strong> Projects
                that simply fork established protocols without significant
                improvements or security enhancements.
              </li>
              <li>
                <strong className="text-white">Economic Flaws:</strong>{" "}
                Tokenomics that rely on perpetual new deposits or unrealistic
                growth assumptions.
              </li>
              <li>
                <strong className="text-white">Impersonation:</strong> Projects
                with names/interfaces very similar to established DeFi platforms
                to confuse users.
              </li>
            </ul>

            <h3 className="text-xl font-bold mt-6 mb-3 text-red-300">
              NFT Project Warning Signs
            </h3>
            <p className="mb-4 text-gray-300">
              NFT scams have exploded in popularity as the market has grown.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>
                <strong className="text-white">
                  Copied or AI-Generated Art:
                </strong>{" "}
                Projects using stolen, plagiarized, or entirely AI-generated
                artwork without originality.
              </li>
              <li>
                <strong className="text-white">Misleading Roadmaps:</strong>{" "}
                Grandiose promises of games, metaverse integration, or utilities
                without technical expertise to deliver.
              </li>
              <li>
                <strong className="text-white">False Scarcity:</strong> Claims
                of limited supply while creators maintain the ability to mint
                more NFTs.
              </li>
              <li>
                <strong className="text-white">Wash Trading:</strong> Artificial
                transaction volume created by the same people buying and selling
                between their own wallets.
              </li>
              <li>
                <strong className="text-white">Fake Pre-Sales:</strong>{" "}
                Non-existent whitelists or pre-sales to create the illusion of
                demand.
              </li>
            </ul>
            <div
              className="mt-6 cursor-pointer text-[#d6973e] font-medium"
              onClick={() => toggleSection("defiNftFull")}
            >
              {expandedSection === "defiNftFull"
                ? "Show Less ↑"
                : "Read More About DeFi & NFT Scams ↓"}
            </div>
            {expandedSection === "defiNftFull" && (
              <div className="mt-4 border-t border-gray-700/50 pt-4">
                <h3 className="text-xl font-bold mb-3 text-white">
                  Flash Loan Attack Warning Signs
                </h3>
                <p className="mb-4 text-gray-300">
                  Flash loan attacks exploit price oracle vulnerabilities or
                  temporary market imbalances.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>
                    Projects with single price oracles rather than time-weighted
                    average prices (TWAPs) or multiple oracles.
                  </li>
                  <li>
                    Very low liquidity pools that could be easily manipulated
                    with moderate capital.
                  </li>
                  <li>
                    DeFi protocols that don&apos;t implement slippage protection
                    or circuit breakers for extreme price movements.
                  </li>
                  <li>
                    Projects that don&apos;t explain how they protect against
                    common attack vectors like flash loans in their
                    documentation.
                  </li>
                </ul>

                <h3 className="text-xl font-bold mt-6 mb-3 text-white">
                  NFT Rug Pull Tactics
                </h3>
                <p className="mb-4 text-gray-300">
                  NFT rug pulls have some unique characteristics:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>
                    <strong>Metadata Manipulation:</strong> After minting,
                    developers change the NFT metadata to significantly less
                    valuable images.
                  </li>
                  <li>
                    <strong>Discord Hacks:</strong> Scammers hack project
                    Discord servers to post fake &quot;stealth mint&quot; links
                    that steal crypto.
                  </li>
                  <li>
                    <strong>False Reveal Promises:</strong> Projects that keep
                    delaying their &quot;reveal&quot; date while selling the
                    promise of valuable traits.
                  </li>
                  <li>
                    <strong>Community Fund Misappropriation:</strong> Projects
                    collecting funds for &quot;community treasury&quot; that
                    disappear without delivering promised benefits.
                  </li>
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Tools to Detect Scams */}
        <section id="tools" className="scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4 text-white font-title">
            07. Tools to Detect Scams
          </h2>
          <div className="bg-gray-800/20 p-6 rounded-lg mb-4">
            <h3 className="text-xl font-bold mb-3 text-red-300">
              Contract Analysis Tools
            </h3>
            <p className="mb-4 text-gray-300">
              Several tools can help identify potential contract vulnerabilities
              or scams.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>
                <strong className="text-white">TokenSniffer:</strong> Analyzes
                smart contracts for suspicious functions and similarity to known
                scams.
              </li>
              <li>
                <strong className="text-white">RugDoc:</strong> Provides risk
                assessments for DeFi protocols and projects.
              </li>
              <li>
                <strong className="text-white">
                  CertiK Security Leaderboard:
                </strong>{" "}
                Lists projects that have undergone security audits and their
                scores.
              </li>
              <li>
                <strong className="text-white">PeckShield:</strong> Offers
                real-time security monitoring and alerts for DeFi protocols.
              </li>
            </ul>

            <h3 className="text-xl font-bold mt-6 mb-3 text-red-300">
              Blockchain Analysis Tools
            </h3>
            <p className="mb-4 text-gray-300">
              Examine on-chain activity to spot suspicious patterns.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>
                <strong className="text-white">Etherscan/BscScan/etc.:</strong>{" "}
                Blockchain explorers to view token contracts, holder
                distribution, and transaction history.
              </li>
              <li>
                <strong className="text-white">Dextools:</strong> Trading charts
                and liquidity information for tokens on decentralized exchanges.
              </li>
              <li>
                <strong className="text-white">GlassNode:</strong> On-chain
                analytics for major cryptocurrencies.
              </li>
              <li>
                <strong className="text-white">Nansen:</strong> Analytics
                platform that labels wallets and tracks fund flows.
              </li>
            </ul>

            <h3 className="text-xl font-bold mt-6 mb-3 text-red-300">
              Community Resources
            </h3>
            <p className="mb-4 text-gray-300">
              Community-driven platforms can provide additional perspectives on
              project legitimacy.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>
                <strong className="text-white">
                  CryptoMoonShots Red Flags:
                </strong>{" "}
                Community-sourced warnings about potential scam projects.
              </li>
              <li>
                <strong className="text-white">RugPull Detector:</strong>{" "}
                Community-driven databases of known scam tokens and addresses.
              </li>
              <li>
                <strong className="text-white">
                  CoinMarketCap Watchlists:
                </strong>{" "}
                Custom watchlists to track projects and compare metrics.
              </li>
              <li>
                <strong className="text-white">
                  Twitter Crypto Security Accounts:
                </strong>{" "}
                Follow security researchers who frequently identify scams.
              </li>
            </ul>
            <div
              className="mt-6 cursor-pointer text-[#d6973e] font-medium"
              onClick={() => toggleSection("toolsFull")}
            >
              {expandedSection === "toolsFull"
                ? "Show Less ↑"
                : "Read More About Advanced Tools ↓"}
            </div>
            {expandedSection === "toolsFull" && (
              <div className="mt-4 border-t border-gray-700/50 pt-4">
                <h3 className="text-xl font-bold mb-3 text-white">
                  Advanced Technical Tools
                </h3>
                <p className="mb-4 text-gray-300">
                  For those with technical knowledge, these tools provide deeper
                  insights:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-300">
                  <li>
                    <strong>Slither:</strong> Static analysis framework for
                    Solidity to detect common vulnerabilities.
                  </li>
                  <li>
                    <strong>MythX:</strong> Security analysis platform for
                    Ethereum smart contracts.
                  </li>
                  <li>
                    <strong>DeFi Safety:</strong> Process security reviews that
                    examine the overall security practices of projects.
                  </li>
                  <li>
                    <strong>Tenderly:</strong> Smart contract monitoring and
                    alerting platform.
                  </li>
                </ul>

                <h3 className="text-xl font-bold mt-6 mb-3 text-white">
                  Using Multiple Tools Together
                </h3>
                <p className="mb-4 text-gray-300">
                  The most effective approach is to use multiple tools and
                  cross-reference their findings:
                </p>
                <ol className="list-decimal pl-6 space-y-2 text-gray-300">
                  <li>
                    Start with blockchain explorers to check basic token metrics
                    and holder distribution.
                  </li>
                  <li>
                    Use automated scanning tools like TokenSniffer to identify
                    common contract vulnerabilities.
                  </li>
                  <li>
                    Check community resources for any reported issues or
                    concerns.
                  </li>
                  <li>
                    For larger investments, consider hiring a security
                    professional for a thorough review.
                  </li>
                  <li>
                    Always compare findings across multiple sources before
                    making investment decisions.
                  </li>
                </ol>
              </div>
            )}
          </div>
        </section>

        {/* Action Plan */}
        <section id="action-plan" className="scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4 text-white font-title">
            08. Your Scam Detection Action Plan
          </h2>
          <div className="bg-gray-800/20 p-6 rounded-lg mb-4">
            <p className="mb-6 text-gray-300">
              Use this systematic approach to evaluate any crypto project before
              investing:
            </p>

            <div className="mb-6 border border-gray-700/50 rounded-lg p-4">
              <h3 className="text-xl font-bold mb-2 text-[#d6973e]">
                Step 1: Initial Research (10-15 minutes)
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>
                  Review the project website for professionalism and clarity
                </li>
                <li>
                  Check team information and verify at least key team members
                </li>
                <li>
                  Read the whitepaper to understand the project&apos;s purpose
                  and tokenomics
                </li>
                <li>
                  Review social media presence (activity level, follower
                  authenticity)
                </li>
                <li>
                  Search for the project name + &quot;scam&quot; or &quot;rug
                  pull&quot; on Google
                </li>
              </ul>
            </div>

            <div className="mb-6 border border-gray-700/50 rounded-lg p-4">
              <h3 className="text-xl font-bold mb-2 text-[#d6973e]">
                Step 2: Technical Assessment (15-20 minutes)
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>
                  Check contract verification on the relevant blockchain
                  explorer
                </li>
                <li>Analyze token distribution and top holders</li>
                <li>Verify liquidity locking and team token vesting</li>
                <li>Run the contract through automated analysis tools</li>
                <li>Check for security audits from reputable firms</li>
              </ul>
            </div>

            <div className="mb-6 border border-gray-700/50 rounded-lg p-4">
              <h3 className="text-xl font-bold mb-2 text-[#d6973e]">
                Step 3: Community Evaluation (10 minutes)
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>
                  Join Telegram/Discord groups and observe communication style
                </li>
                <li>
                  Ask specific technical questions to gauge team responsiveness
                </li>
                <li>Check if critical questions are answered or censored</li>
                <li>Assess the quality of community discussions</li>
                <li>Look for bot-like activity or artificial engagement</li>
              </ul>
            </div>

            <div className="mb-6 border border-gray-700/50 rounded-lg p-4">
              <h3 className="text-xl font-bold mb-2 text-[#d6973e]">
                Step 4: Red Flag Summary (5 minutes)
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>
                  Compile all potential red flags identified during research
                </li>
                <li>Weigh the severity of each red flag</li>
                <li>Consider the project&apos;s risk-to-reward ratio</li>
                <li>Set maximum risk exposure if you decide to invest</li>
                <li>Document your findings for future reference</li>
              </ul>
            </div>

            <div
              className="mt-6 cursor-pointer text-[#d6973e] font-medium"
              onClick={() => toggleSection("actionFull")}
            >
              {expandedSection === "actionFull"
                ? "Show Less ↑"
                : "Read More About Investment Safety ↓"}
            </div>
            {expandedSection === "actionFull" && (
              <div className="mt-4 border-t border-gray-700/50 pt-4">
                <h3 className="text-xl font-bold mb-3 text-white">
                  The 10 Commandments of Crypto Investment Safety
                </h3>
                <ol className="list-decimal pl-6 space-y-2 text-gray-300">
                  <li>
                    Never invest more than you can afford to lose completely
                  </li>
                  <li>
                    Always diversify your crypto portfolio across different
                    projects and risk levels
                  </li>
                  <li>
                    Use hardware wallets for significant holdings and separate
                    wallets for interacting with new projects
                  </li>
                  <li>
                    Never share your private keys or seed phrases with anyone,
                    including project team members
                  </li>
                  <li>
                    Be especially cautious of projects where selling is
                    difficult or heavily taxed
                  </li>
                  <li>
                    Take profits regularly on successful investments rather than
                    being greedy
                  </li>
                  <li>
                    Be more concerned with avoiding losses than missing
                    potential gains
                  </li>
                  <li>
                    Always verify information from multiple independent sources
                  </li>
                  <li>
                    Assume every direct message about crypto investments is a
                    scam until proven otherwise
                  </li>
                  <li>
                    Trust your instincts—if something feels wrong, it probably
                    is
                  </li>
                </ol>

                <p className="mt-6 text-gray-300">
                  Remember: In crypto, the responsibility for due diligence
                  falls entirely on you. There&apos;s no customer service to
                  call if you&apos;re scammed, and funds lost to rug pulls are
                  almost never recovered.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Conclusion */}
      <div className="bg-gray-800/30 p-6 rounded-lg border border-gray-700/50 mb-10">
        <h2 className="text-2xl font-bold mb-3 text-white font-title">
          Conclusion: Stay Vigilant
        </h2>
        <p className="mb-4 text-gray-300">
          The crypto space is constantly evolving, and so are the tactics of
          scammers. No single red flag is definitive proof of a scam, but
          multiple warning signs should significantly increase your caution.
          Remember that legitimate projects prioritize transparency, security,
          and building long-term value—not hype, unrealistic promises, or
          aggressive marketing tactics.
        </p>
        <p className="text-gray-300">
          If you&apos;ve been scammed, consider reporting it to relevant
          authorities and sharing your experience to help others. Visit our{" "}
          <Link
            href="/education/exit-scams"
            className="text-[#d6973e] hover:underline"
          >
            guide on what to do if you&apos;ve been scammed
          </Link>{" "}
          for next steps.
        </p>
      </div>

      <div className="text-center p-6 border-t border-gray-700/50">
        <h3 className="text-lg font-medium mb-3 text-white">
          Was this guide helpful?
        </h3>
        <p className="mb-4 text-gray-300">
          Have additional questions about identifying crypto scams?
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/whistleblowing"
            className="px-5 py-2 bg-gray-800 hover:bg-gray-700 rounded-md text-white transition-all duration-300"
          >
            Report a Scam
          </Link>
          <Link
            href="/education"
            className="px-5 py-2 border border-[#d6973e] hover:bg-[#d6973e]/10 rounded-md text-[#d6973e] transition-all duration-300"
          >
            More Education
          </Link>
        </div>
      </div>
    </main>
  );
}

export default IdentifyScamsPage;
