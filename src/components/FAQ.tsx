import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Coins, Triangle, Hexagon, Mountain, Ghost, Zap, Database } from "lucide-react";

const FAQ = () => {
  const supportedChains = [
    { name: 'Ethereum', icon: Coins, id: '1' },
    { name: 'Polygon', icon: Triangle, id: '137' },
    { name: 'BNB Smart Chain (BSC)', icon: Hexagon, id: '56' },
    { name: 'Avalanche C-Chain', icon: Mountain, id: '43114' },
    { name: 'Fantom', icon: Ghost, id: '250' },
    { name: 'Arbitrum', icon: Zap, id: '42161' },
    { name: 'Base', icon: Database, id: '8453' }
  ];

  const faqs = [
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
      answer: "Free for the first 100 scans. After that, pricing tiers will apply based on usage volume and advanced features. We'll announce pricing details soon."
    },
    {
      question: "What chains are supported?",
      answer: (
        <div className="space-y-4">
          <p className="text-p2 text-muted-foreground">We support the following blockchain networks:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {supportedChains.map((chain, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <chain.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <span className="font-medium text-foreground">{chain.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">ID: {chain.id}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-p3 text-muted-foreground">More chains being added regularly based on community demand.</p>
        </div>
      )
    },
    {
      question: "How accurate is the social media data?",
      answer: "Our AI models analyze on-chain patterns and cross-reference with public social graphs to provide highly accurate community overlap insights with 85%+ confidence scores."
    },
    {
      question: "Can I export the data?",
      answer: "Yes! Export audience segments in CSV format for use in Google Ads, Drippi.ai, or any other marketing tool. Premium users get additional export formats."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-h2 font-bold mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-p1 text-muted-foreground max-w-3xl mx-auto">
            Everything you need to know about AudienceScan
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border-2 border-primary/10 rounded-lg px-6 hover:border-primary/30 transition-smooth"
              >
                <AccordionTrigger className="text-left text-tag font-semibold hover:text-primary transition-smooth">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-p2 text-muted-foreground leading-relaxed pt-2">
                  {typeof faq.answer === 'string' ? faq.answer : faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;