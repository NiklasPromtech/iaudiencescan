import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CaseStudies = () => {
  const caseStudies = [
    {
      title: "DV360 Campaign – Smart Contract Targeting",
      summary: "We scanned a bridge contract on Ethereum used to convert stablecoins into a native token. The campaign ran on DV360.",
      clientType: "Layer 1 protocol aiming to let devs build apps on Bitcoin.",
      results: {
        audienceScan: "$6.09",
        baseline: "$37.83",
        metric: "CPA"
      },
      improvement: "84% lower CPA using AudienceScan",
      screenshot: "DV360 - Screenshot (GoBob).png"
    },
    {
      title: "Telegram Campaign – Token-Based Channel Targeting", 
      summary: "We scanned the client's official token on the Base chain, and used that to drive targeting on Telegram.",
      clientType: "NFT project linked to real-world assets.",
      results: {
        audienceScan: "€0.21",
        baseline: "€0.62", 
        metric: "CPA"
      },
      improvement: "66% more cost-efficient using AudienceScan",
      screenshot: "Telegram - Screenshot (RWA).png"
    },
    {
      title: "X Campaign – BSC Token Targeting for Lead Gen",
      summary: "We scanned the client's official token on BSC, using it to drive influencer signups.",
      clientType: "Web3 platform helping micro-influencers earn revenue.",
      results: {
        leads: "659 vs. 36",
        subscriptions: "93 vs. 8",
        costPerSub: "€13.11 vs. €31.25"
      },
      improvement: "3× more conversions at 60% lower cost",
      screenshot: "X - Screenshot (ChirpPad).png"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-h1 font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Case Studies
            </h1>
            <p className="text-p1 text-muted-foreground max-w-3xl mx-auto">
              Real campaign results showcasing the power of AudienceScan targeting across different platforms
            </p>
          </div>

          <div className="grid gap-8 md:gap-12">
            {caseStudies.map((study, index) => (
              <Card key={index} className="p-8 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div>
                    <h2 className="text-h3 font-bold mb-4 text-foreground">
                      {study.title}
                    </h2>
                    
                    <div className="mb-6">
                      <h3 className="text-p2 font-semibold mb-2 text-foreground">Summary:</h3>
                      <p className="text-p2 text-muted-foreground mb-4">
                        {study.summary}
                      </p>
                      
                      <h3 className="text-p2 font-semibold mb-2 text-foreground">Client Type:</h3>
                      <p className="text-p2 text-muted-foreground">
                        {study.clientType}
                      </p>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-p2 font-semibold mb-4 text-foreground">Results:</h3>
                      <div className="space-y-2 text-p2">
                        {study.results.metric && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">AudienceScan {study.results.metric}:</span>
                              <span className="font-semibold text-primary">{study.results.audienceScan}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Baseline {study.results.metric}:</span>
                              <span className="font-semibold text-foreground">{study.results.baseline}</span>
                            </div>
                          </>
                        )}
                        {study.results.leads && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Leads:</span>
                              <span className="font-semibold text-foreground">{study.results.leads}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Subscriptions:</span>
                              <span className="font-semibold text-foreground">{study.results.subscriptions}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Cost per Subscription:</span>
                              <span className="font-semibold text-foreground">{study.results.costPerSub}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-p2 font-semibold text-primary">
                        {study.improvement}
                      </span>
                    </div>
                  </div>

                  <div className="bg-muted/20 rounded-lg p-4 border border-border/50">
                    <div className="text-center text-muted-foreground">
                      <div className="aspect-video bg-muted/50 rounded border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                        <span className="text-p3">{study.screenshot}</span>
                      </div>
                      <p className="text-p3 mt-2">Campaign Screenshot</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CaseStudies;