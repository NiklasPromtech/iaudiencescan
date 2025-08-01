import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Partnerships from "@/components/Partnerships";
import ProvenResults from "@/components/ProvenResults";
import MoneyBackGuarantee from "@/components/MoneyBackGuarantee";
import FAQ from "@/components/FAQ";
import Resources from "@/components/Resources";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <section id="features">
        <Features />
      </section>
      <HowItWorks />
      <section id="partnerships">
        <Partnerships />
      </section>
      <ProvenResults />
      <MoneyBackGuarantee />
      <section id="faq">
        <FAQ />
      </section>
      <Resources />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
