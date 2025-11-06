import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, MessageCircle, Users, Copy, Plus, Phone, ShieldCheck, Rocket, CheckCircle, Edit3 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ProposedFeatures = () => {
  const features = [
    {
      title: "Direct Messaging (Telegram)",
      icon: MessageCircle,
      description: "A feature that enables direct outreach to Telegram users from within the platform. You'll input your phone number, verify your account, and AudienceScan will handle sending messages gradually (e.g., ~20 per day) to avoid spam flags and keep outreach manageable.",
      status: "proposed"
    },
    {
      title: "Direct Messaging (X via Drippi.ai)",
      icon: Users,
      description: "SA guided workflow showing how to launch a Drippi campaign using AudienceScan data. This tutorial-based feature helps you reach relevant X (Twitter) users efficiently, turning audience insights into real conversations.",
      status: "proposed"
    },
    {
      title: "AI-Friendly Copy to Clipboard",
      icon: Copy,
      description: "A one-click button to extract the most valuable data from a study into your clipboard. You can then paste this into AI tools to generate insights or next steps. We're considering adding ready-made prompt templates for quick use.",
      status: "proposed"
    }
  ];

  const inProgress = [
    {
      title: "Auto Refresh",
      icon: RefreshCw,
      description: "A tool designed for token owners to \"claim\" their token within AudienceScan. Once set, we'll automatically re-run the scan weekly or bi-weekly and deliver an updated report highlighting key changes and new insights since the last analysis.",
      status: "in-progress"
    }
  ];

  const completed = [
    {
      title: "Editable Study Names",
      icon: Edit3,
      description: "You can now rename any AudienceScan study after it's been created. This makes it easier to keep your workspace organized — for example, you can update generic study names into something more descriptive like 'ETH whales – July Campaign' or 'Polygon DeFi segment' without having to re-run a scan.",
      status: "completed"
    },
    {
      title: "Holder-Based Analysis",
      icon: Users,
      description: "AudienceScan now supports analyzing wallets that hold a token in addition to those that transact with it. This unlocks a deeper layer of audience insights by capturing long-term investors, not just active traders. You can compare behaviors between holders and transactors, spot overlaps, and identify communities that are loyal vs. those that are speculative.",
      status: "completed"
    },
    {
      title: "Manual Wallet Upload",
      icon: Plus,
      description: "An option to import wallets manually (comma-separated list or file upload) for analysis. This makes it easy to combine your own data with AudienceScan results.",
      status: "completed"
    },
    {
      title: "Invalid Token Pre-Approval",
      icon: ShieldCheck,
      description: "An automated filter that flags or blocks addresses and tokens known to have too few transactions or be incompatible with AudienceScan before a scan is run.",
      status: "completed"
    },
    {
      title: "Launchpads",
      icon: Rocket,
      description: "A module that surfaces which launchpads tokens (e.g., PinkSale, DAO Maker, etc.) the scan returns. Useful for spotting patterns in go-to-market strategies, cross-token overlaps, and community behavior tied to early-stage offerings.",
      status: "completed"
    },
    {
      title: "Marketing Token Cleanup",
      icon: RefreshCw,
      description: "We're actively improving how AudienceScan filters out irrelevant tokens (such as those with spammy names like \"claim now\" or containing URLs), ensuring cleaner and more accurate datasets in every scan.",
      status: "completed"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Proposed Features</h1>
            <p className="text-xl text-muted-foreground">
              Upcoming features and improvements we're considering for AudienceScan
            </p>
          </div>

          {/* Proposed Features */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Proposed Features</h2>
            <div className="grid gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <feature.icon className="h-6 w-6 text-primary" />
                      {feature.title}
                      <Badge variant="secondary" className="ml-auto">Proposed</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Completed Features */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Completed</h2>
            <p className="text-muted-foreground mb-6">Features and improvements already live in AudienceScan</p>
            <div className="grid gap-6">
              {completed.map((feature, index) => (
                <Card key={index} className="border-green-500/20 bg-green-50/50 dark:bg-green-950/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <feature.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                      {feature.title}
                      <Badge variant="outline" className="ml-auto border-green-500/50 text-green-700 dark:text-green-300">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* In Progress */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Being Worked On</h2>
            <div className="grid gap-6">
              {inProgress.map((feature, index) => (
                <Card key={index} className="border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <feature.icon className="h-6 w-6 text-primary" />
                      {feature.title}
                      <Badge variant="default" className="ml-auto">In Progress</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section>
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Phone className="h-6 w-6 text-primary" />
                  Have a Feature Request?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Contact us if you want to add something to this list. We're always looking for new ways to improve AudienceScan and make it more valuable for our users.
                </p>
                <div className="flex gap-4">
                  <a 
                    href="https://t.me/audienceScan" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg transition-colors"
                  >
                    Contact us on Telegram
                  </a>
                  <a 
                    href="https://x.com/AudienceScanIO" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-muted hover:bg-muted/80 px-4 py-2 rounded-lg transition-colors"
                  >
                    Reach out on X
                  </a>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProposedFeatures;