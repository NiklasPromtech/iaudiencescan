import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Rocket, Coins, Wallet, Building } from "lucide-react";

interface WizardOption {
  id: string;
  icon: React.ReactNode;
  label: string;
  smallText: string;
  title: string;
  cta: string;
}

const wizardOptions: WizardOption[] = [
  {
    id: "agency",
    icon: <Building2 className="w-8 h-8" />,
    label: "Agency",
    smallText: "Win more pitches",
    title: "Build Web3 pitches and GTMs backed by real on-chain behavior",
    cta: "Validate your next Web3 pitch",
  },
  {
    id: "launchpad",
    icon: <Rocket className="w-8 h-8" />,
    label: "Launchpads",
    smallText: "Attract the right tokens",
    title: "Show token teams you already understand their audience",
    cta: "Show audience demand to token teams",
  },
  {
    id: "token",
    icon: <Coins className="w-8 h-8" />,
    label: "Token owners",
    smallText: "Grow token adoption",
    title: "Find the communities your users are already part of — and reach more like them",
    cta: "Find where your next users are",
  },
  {
    id: "wallet",
    icon: <Wallet className="w-8 h-8" />,
    label: "Web3 wallets",
    smallText: "Find more wallet users",
    title: "Use your existing users' wallets to find where similar users already are",
    cta: "Upload wallets to find more users",
  },
  {
    id: "cex",
    icon: <Building className="w-8 h-8" />,
    label: "CEX",
    smallText: "Find your next token listing",
    title: "Identify high-signal tokens by analyzing where users of other CEXs transact",
    cta: "Discover listing opportunities",
  },
];

const Wizard = () => {
  const [selectedOption, setSelectedOption] = useState<WizardOption | null>(null);

  if (selectedOption) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-2xl w-full text-center space-y-8">
          <button
            onClick={() => setSelectedOption(null)}
            className="text-white/50 hover:text-white text-sm mb-8 inline-flex items-center gap-2"
          >
            ← Back
          </button>
          
          <p className="text-purple-400 text-sm uppercase tracking-wider">
            {selectedOption.smallText}
          </p>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            {selectedOption.title}
          </h1>
          
          <Button
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg mt-8"
          >
            ✅ {selectedOption.cta}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            What best describes you?
          </h1>
          <p className="text-white/60">
            Select your role to see how AudienceScan can help
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wizardOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedOption(option)}
              className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 rounded-xl p-6 text-left transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="text-purple-400 mb-4">
                  {option.icon}
                </div>
                <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-purple-400 transition-colors" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-1">
                {option.label}
              </h3>
              <p className="text-white/50 text-sm">
                {option.smallText}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wizard;
