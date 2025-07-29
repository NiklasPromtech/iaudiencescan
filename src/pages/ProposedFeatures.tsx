import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, MessageCircle, Users, Copy, Plus, Phone, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ProposedFeatures = () => {
  const features = [
    {
      title: "Auto Refresh",
      icon: RefreshCw,
      description: "Tool aimed at token owners, where a users select a token \"As their own\" and then we will re-run the scan on a weekly or bi-weekly basis and send them and update on how things have changed since they last checked",
      status: "proposed"
    },
    {
      title: "DM Direct TG Users from the Platform", 
      icon: MessageCircle,
      description: "Some simple script that lets you select e.g a Telegram handle, you write in your number, we ask you for the verification code and then we send a DM to all the users, over a period of time (To avoid getting you banned) we would recommend something like 20 messages a day just to you don't get overwhelmed",
      status: "proposed"
    },
    {
      title: "DM X through Drippi.ai",
      icon: Users,
      description: "Simple tutorial of how you setup a Drippi campaign based on the data in the report",
      status: "proposed"
    },
    {
      title: "Copy to Clipboard for AI Question",
      icon: Copy,
      description: "Basically a button that copies data from the study to the clipboard. With the most valuable information. With a box where you add in \"Your question\" [Maybe we even have some templated questions that you can copy directly or that it works similar to the Invite box. Where you get a window that opens up, and you then press copy to clipboard, and then (One of those, but for scans)]",
      status: "proposed"
    },
    {
      title: "Add Wallets Manually",
      icon: Plus,
      description: "Simply make it possible to add a list of wallets manually (comma separated or something like that)",
      status: "proposed"
    },
    {
      title: "Pre-approval of Invalid Tokens",
      icon: ShieldCheck,
      description: "Add pre-approval of tokens that we know won't work (e.g addresses, or tokens that don't have enough transactions)",
      status: "proposed"
    }
  ];

  const inProgress = [
    {
      title: "Clean Marketing Tokens",
      icon: RefreshCw,
      description: "Cleaning out marketing tokens from the analysis (e.g token that contain a webpage link or \"claim now\" type text.",
      status: "in-progress"
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