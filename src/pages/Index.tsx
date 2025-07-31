import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import ProvenResults from "@/components/ProvenResults";
import MoneyBackGuarantee from "@/components/MoneyBackGuarantee";
import Resources from "@/components/Resources";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <HowItWorks />
      <ProvenResults />
      <MoneyBackGuarantee />
      <Resources />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
