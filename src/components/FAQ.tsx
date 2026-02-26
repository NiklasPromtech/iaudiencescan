import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  const supportedChains = [
    { name: 'Ethereum', icon: '/lovable-uploads/915f1590-0372-4e21-bdbd-d0c98b338f6f.png' },
    { name: 'Polygon', icon: '/lovable-uploads/6ec4e23f-c59e-4106-b9f9-395586a7c47d.png' },
    { name: 'BNB Smart Chain (BSC)', icon: '/lovable-uploads/4afdeabf-1539-422b-9189-10277e1ad902.png' },
    { name: 'Avalanche C-Chain', icon: '/lovable-uploads/e261f7ad-1d1a-46de-90d6-0df473c9e0a1.png' },
    { name: 'Fantom', icon: '/lovable-uploads/4772c2e1-0d72-46ab-b794-e4caae22b177.png' },
    { name: 'Arbitrum', icon: '/lovable-uploads/bd550364-de3d-40a7-8b96-a1b03f324520.png' },
    { name: 'Base', icon: '/lovable-uploads/c7efd782-8b9e-4e4c-95eb-d9f7a0241e46.png' },
  ];

  const aboutFaqs = [
    {
      question: "What does the scan include?",
      answer: "A breakdown of token holders, wallet segments, social media community overlaps, and recommended targeting moves. You'll see which X/Telegram communities your holders are active in, their transaction patterns, and suggested marketing strategies."
    },
    {
      question: "Do I need to connect a wallet?",
      answer: "No wallet connect needed — just enter your contract address. Our analysis is completely permissionless and doesn't require any personal wallet connection."
    },
    {
      question: "How much does it cost?",
      answer: "Starting from $199 / month for 5 scans, you will be able to get a weekly update of how your community is changing and new opportunities. We offer a customer advisory discount for selected users, so reach out to see if you are a good fit to help us grow AudienceScan."
    },
    {
      question: "What chains are supported?",
      answer: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">We support the following blockchain networks:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {supportedChains.map((chain, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border border-border bg-muted/30">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500/80 to-primary/60 flex items-center justify-center p-1.5">
                  <img
                    src={chain.icon}
                    alt={`${chain.name} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-medium text-foreground">{chain.name}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">More chains being added regularly based on community demand. If your chain isn't here, reach out at support@audiencescan.io</p>
        </div>
      )
    },
    {
      question: "Can I export the data?",
      answer: "Yes! Export audience segments in CSV format for use in Google Ads, Drippi.ai, or any other marketing tool. Premium users get additional export formats."
    }
  ];

  const whyFaqs = [
    {
      question: "Why not just use Google Analytics?",
      answer: "GA tracks page views and sessions but has zero wallet awareness. It can't tell you which visitors hold your token, which wallet extensions they use, or which on-chain communities they belong to. AudienceScan starts where GA stops — connecting web traffic to wallet behavior and giving you crypto-native audience segments you can actually target."
    },
    {
      question: "Why not just use Dune?",
      answer: "Dune is great for querying raw blockchain data, but it requires SQL knowledge and doesn't connect on-chain activity to off-chain marketing channels. AudienceScan does that bridge automatically — linking holder wallets to X communities, Telegram groups, and ad platforms so you get actionable targeting, not just dashboards."
    },
    {
      question: "Can I use AudienceScan without running paid ads?",
      answer: "Absolutely. The tracking tag and audience scans work independently of any ad spend. Many teams use AudienceScan purely for community intelligence — understanding who their holders are, where they came from, and how the audience is shifting over time."
    },
    {
      question: "Is my data private and secure?",
      answer: "Yes. We never ask users to connect wallets. All analysis is based on publicly available on-chain data and aggregated browser signals. No PII is collected or stored. Your dashboard data is private to your team."
    },
    {
      question: "How is this different from a blockchain explorer?",
      answer: "Explorers show individual transactions. AudienceScan aggregates thousands of wallets into behavioral segments, detects bots, maps community overlaps, and turns all of that into marketing actions — things no explorer does."
    }
  ];

  const renderSection = (title: string, faqs: typeof aboutFaqs, prefix: string) => (
    <div className="mb-12 last:mb-0">
      <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-6">
        {title}
      </h3>
      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`${prefix}-${index}`}
            className="border border-border px-6 data-[state=open]:border-primary/30 transition-colors"
          >
            <AccordionTrigger className="text-left text-sm font-semibold hover:text-primary transition-colors hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pt-2">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );

  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-4">
          FAQ
        </p>
        <h2 className="font-bold text-3xl md:text-4xl text-foreground mb-12">
          Frequently Asked Questions
        </h2>

        {renderSection("About AudienceScan", aboutFaqs, "about")}
        {renderSection("Why AudienceScan?", whyFaqs, "why")}

        <div className="border border-border p-6 mt-12">
          <p className="text-sm text-muted-foreground">
            Still have questions? Reach us at{" "}
            <a href="mailto:support@audiencescan.io" className="text-primary hover:underline">
              support@audiencescan.io
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
