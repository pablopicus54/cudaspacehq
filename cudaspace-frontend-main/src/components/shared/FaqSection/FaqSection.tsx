'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FaqItem } from '@/constant/faqData';
import MyContainer from '@/components/ui/MyContainer/MyContainer';
import SectionHead from '@/components/shared/SectionHead/SectionHead';

interface FaqSectionProps {
  title: string;
  description: string;
  faqs: FaqItem[];
}

export default function FaqSection({
  title,
  description,
  faqs,
}: FaqSectionProps) {
  const [openItems, setOpenItems] = useState<number[]>([0]); // First item open by default

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  return (
    <section className="py-8 md:py-12">
      <MyContainer>
        <SectionHead
          title="FAQs of GPU Hosting, Dedicated Server with GPU"
          description="GPUs are optimized for tasks like video rendering, AI processing, and scientific simulations, providing faster processing speeds."
        />

        <div className="grid md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                className="flex justify-between items-center w-full p-6 text-left"
                onClick={() => toggleItem(index)}
                aria-expanded={openItems.includes(index)}
              >
                <h3 className="text-lg font-medium text-gray-900">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openItems.includes(index) ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openItems.includes(index) ? 'max-h-96 p-6 pt-0' : 'max-h-0'
                }`}
              >
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </MyContainer>
    </section>
  );
}
