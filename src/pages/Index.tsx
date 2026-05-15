import { useEffect } from "react";
import { captureUtms } from "@/lib/utmify";
import TopBar from "@/components/sales/TopBar";
import HeroProduct from "@/components/sales/HeroProduct";
import TrustBadges from "@/components/sales/TrustBadges";
import PainPoints from "@/components/sales/PainPoints";
import Benefits from "@/components/sales/Benefits";
import Ingredients from "@/components/sales/Ingredients";
import PricingKits from "@/components/sales/PricingKits";
import Testimonials from "@/components/sales/Testimonials";
import UrgencyBanner from "@/components/sales/UrgencyBanner";
import Guarantees from "@/components/sales/Guarantees";
import FAQ from "@/components/sales/FAQ";
import FinalCTA from "@/components/sales/FinalCTA";
import Footer from "@/components/sales/Footer";
import StickyCart from "@/components/sales/StickyCart";

const Index = () => {
  useEffect(() => { captureUtms(); }, []);

  return (
    <div className="min-h-screen bg-background max-w-[768px] mx-auto">
      <TopBar />
      <HeroProduct />
      <TrustBadges />
      <PainPoints />
      <Benefits />
      <Ingredients />
      <PricingKits />
      <Testimonials />
      <UrgencyBanner />
      <Guarantees />
      <FAQ />
      <FinalCTA />
      <Footer />
      <StickyCart />
    </div>
  );
};

export default Index;
