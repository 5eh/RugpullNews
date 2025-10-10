import { Suspense } from "react";
import Loading from "../components/loading";
import SponsorTier from "../components/SponsorTier";
import SponsorshipPackages from "../components/SponsorshipPackages";
import DonationForm from "../components/DonationForm";
import { goldSponsors, silverSponsors } from "../data/sponsors";
// import {  bronzeSponsors } from "../data/sponsors";

export default function SponsorsPage() {
  return (
    <main className="px-4 py-6 pb-24 md:pb-6 relative">
      <h1 className="text-3xl font-bold text-center mb-8 font-title">
        Our Sponsors
      </h1>
      <p className="text-center max-w-2xl mx-auto mb-12 text-white">
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
        <SponsorTier
          title="Gold Sponsors"
          sponsors={goldSponsors}
          tierClass="text-yellow-400"
          description="Key sponsors who inspired, maintained, or impacted our journey to making this wild web safer."
        />

        <SponsorTier
          title="Silver Sponsors"
          sponsors={silverSponsors}
          tierClass="text-gray-300"
          description="Key partners who help us expand our coverage and enhance our platform."
        />

        {/*<SponsorTier
          title="Bronze Sponsors"
          sponsors={bronzeSponsors}
          tierClass="text-amber-700"
          description="Valuable contributors who support our mission to identify and report on cryptocurrency scams."
        />*/}

        <SponsorshipPackages />

        <DonationForm />
      </Suspense>
    </main>
  );
}
