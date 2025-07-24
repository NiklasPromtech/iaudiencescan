import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      {/* SEO Meta Tags */}
      <title>AudienceScan - Web3 Audience Analysis Tool</title>
      <meta name="description" content="Turn blockchain data into marketing signal. Free audience analysis for Web3 projects. Analyze token holders, find community overlaps, and get actionable insights." />
      <meta name="keywords" content="Web3 marketing, blockchain analytics, token analysis, audience insights, crypto marketing, DeFi marketing" />
      <meta property="og:title" content="AudienceScan - Web3 Audience Analysis Tool" />
      <meta property="og:description" content="Turn blockchain data into marketing signal. Free audience analysis for Web3 projects." />
      <meta property="og:type" content="website" />
      
      <div className="min-h-screen bg-background">
        <Header />
        <Hero />
        <Features />
        <HowItWorks />
        <FAQ />
        <CTA />
        <Footer />
      </div>
    </>
  );
};

export default Index;
