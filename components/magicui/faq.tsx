import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
  
  const faqs = [
    {
      question: "What is Solana Snapshot Tool?",
      answer:
        "Solana Snapshot Tool is a specialized platform that allows you to take instant snapshots of any Solana smart contract. It provides real-time data about token holders, balances, and contract states on the Solana blockchain.",
    },
    {
      question: "How do I take a snapshot?",
      answer:
        "Simply enter the contract address of the Solana token or program you want to analyze. Our tool will automatically fetch and compile all relevant data, providing you with a comprehensive snapshot that you can download or view online.",
    },
    {
      question: "What information is included in the snapshot?",
      answer:
        "Our snapshots include token holder addresses, balance distributions, transaction history, and other relevant contract data. All information is timestamped and verified against the Solana blockchain for accuracy.",
    },
    {
      question: "How often can I take snapshots?",
      answer:
        "You can take snapshots as frequently as needed. Our tool processes requests in real-time, allowing you to capture contract states at any moment. This is particularly useful for tracking changes over time or verifying holder distributions.",
    },
    {
      question: "Is the snapshot data accurate?",
      answer:
        "Yes, all data is pulled directly from the Solana blockchain using RPC nodes. We ensure high accuracy by cross-referencing multiple data sources and maintaining direct connections to the Solana network.",
    },
  ];
  
  export function FAQs() {
    return (
      <section id="faq">
        <div className="container px-4 md:px-6 w-full py-12 md:py-24 lg:py-32">
          <div className="text-center space-y-4 py-6 mx-auto">
            <h2 className="text-[14px] text-primary font-mono font-medium tracking-tight">
              FAQ
            </h2>
            <h4 className="text-[42px] font-medium mb-2 text-balance max-w-3xl mx-auto tracking-tighter">
              Common Questions About Snapshot Tool
            </h4>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="rounded-xl border border-gray-200 shadow-sm transition-all hover:border-primary [&[data-state=open]]:border-primary"
                >
                  <AccordionTrigger className="px-4 py-4 text-base sm:text-lg font-medium text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-sm sm:text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    );
  }
  