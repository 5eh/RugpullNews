"use client";

import { Suspense } from "react";
import Loading from "../components/loading";
import SponsorTier from "../components/SponsorTier";
import SponsorshipPackages from "../components/SponsorshipPackages";
import DonationForm from "../components/DonationForm";
import { goldSponsors, silverSponsors, bronzeSponsors } from "../data/sponsors";

export default function SponsorsPage() {
  return (
    <main className="px-4 py-6 pb-24 md:pb-6 relative mx-auto">
      <style jsx global>{`
        /* Enhanced border and hover effects for sponsor cards */
        .border-yellow-700\/50:hover {
          background-color: rgba(161, 98, 7, 0.15);
        }
        .border-gray-600\/50:hover {
          background-color: rgba(75, 85, 99, 0.15);
        }
        .border-amber-800\/50:hover {
          background-color: rgba(146, 64, 14, 0.15);
        }
      `}</style>
      <h1 className="text-3xl font-bold text-center mb-8 font-title">
        Our Sponsors
      </h1>
      <p className="text-center max-w-2xl mx-auto mb-12 text-gray-400">
        These organizations help make Rugpull News possible. Their support
        enables us to continue providing quality reporting and analysis on
        cryptocurrency scams and security issues.
      </p>

      <Suspense
        fallback={
          <div className="flex justify-center items-center py-20">
            <Loading />
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center">
          <SponsorTier
            title="Gold Sponsors"
            sponsors={goldSponsors}
            tierClass="text-yellow-400"
            description="Our premier supporters who make our in-depth reporting and analysis possible."
          />

          <SponsorTier
            title="Silver Sponsors"
            sponsors={silverSponsors}
            tierClass="text-gray-300"
            description="Key partners who help us expand our coverage and enhance our platform."
          />

          <SponsorTier
            title="Bronze Sponsors"
            sponsors={bronzeSponsors}
            tierClass="text-amber-700"
            description="Valuable contributors who support our mission to identify and report on cryptocurrency scams."
          />
        </div>

        {/* Become a Sponsor CTA */}
        <div className="mx-auto">
          <SponsorshipPackages />
        </div>

        {/* Donation CTA */}
        <div className="mx-auto">
          <DonationForm />
        </div>
      </Suspense>
    </main>
  );
}
