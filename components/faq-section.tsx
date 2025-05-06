"use client"

import { CustomAccordion, CustomAccordionItem } from "@/components/custom-accordion"
import { FadeIn } from "@/components/fade-in"

export function FaqSection() {
  const faqs = [
    {
      question: "How does Insightflo's AI-driven follow-up work?",
      answer:
        "Insightflo uses proprietary interview data to fine-tune cutting edge LLM's to automatically generate best in class follow-up questions. This creates a conversational experience that feels like a real interview, helping you gather deeper insights from every respondent without manual intervention.",
    },
    {
      question: "Can I customize the types of follow-up questions?",
      answer:
        "Yes, you can set parameters for the types of follow-ups you want. You can focus on clarification, elaboration, examples, or specific themes relevant to your research goals. Our AI adapts to your preferences while maintaining a natural conversation flow.",
    },
    {
      question: "How does pricing work?",
      answer:
        "Insightflo offers tiered pricing based on the number of survey responses and advanced features you need. We have plans for individuals, research teams, and enterprises. All plans include our core AI interview technology, with higher tiers offering advanced analytics and integration capabilities.",
    },
    {
      question: "Is my survey data secure?",
      answer:
        "Absolutely. We take data security seriously. All data is encrypted both in transit and at rest. We comply with GDPR, CCPA, and other privacy regulations. You maintain ownership of your data, and Insightflo never uses it to train our models without explicit permission.",
    },
    {
      question: "Can I export my data to other platforms?",
      answer:
        "Yes, Insightflo supports exports in multiple formats including CSV, Excel, SPSS, and direct integrations with platforms like Tableau, PowerBI, and popular CRMs. This makes it easy to incorporate your insights into your existing workflows.",
    },
  ]

  return (
    <section className="w-full py-10 md:py-12 lg:py-24 bg-gray-50">
      <div className="container px-4 md:px-6">
        <FadeIn>
          <div className="mx-auto max-w-3xl space-y-3 md:space-y-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Frequently Asked Questions</h2>
            <p className="text-base md:text-lg text-gray-600">
              Everything you need to know about Insightflo's AI-driven insights platform.
            </p>
          </div>
        </FadeIn>
        <FadeIn delay={300}>
          <div className="mx-auto mt-6 md:mt-8 max-w-3xl">
            <CustomAccordion className="w-full">
              {faqs.map((faq, index) => (
                <CustomAccordionItem
                  key={index}
                  value={`item-${index}`}
                  title={
                    <span className="text-left text-sm md:text-base font-medium text-gray-900">{faq.question}</span>
                  }
                  className="hover:bg-gray-100 transition-colors duration-200 rounded-md"
                >
                  <div className="text-sm md:text-base text-gray-600">{faq.answer}</div>
                </CustomAccordionItem>
              ))}
            </CustomAccordion>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
