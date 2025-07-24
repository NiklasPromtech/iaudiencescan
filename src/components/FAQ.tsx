import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
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
      answer: "Base, Ethereum, Arbitrum, and Solana with more chains coming soon. We're continuously expanding our multi-chain support."
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
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
                <AccordionTrigger className="text-left font-semibold hover:text-primary transition-smooth">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                  {faq.answer}
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