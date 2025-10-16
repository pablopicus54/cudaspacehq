import SectionHead from '@/components/shared/SectionHead/SectionHead';
import MyContainer from '@/components/ui/MyContainer/MyContainer';
import { languageModels } from '@/constant/languageModels';
import Image from 'next/image';
import React from 'react';

const LanguageModels = () => {
  return (
    <section className="py-10 md:py-16 bg-gray-50">
      <MyContainer>
        <SectionHead
          title="Optimized AI hosting for Scalable Language Models"
          description="Our CPU dedicated servers provide powerful hardware for hosting large language models (LLMS)
with up to 405 billion parameters, ensuring smooth performance for tasks like NLP, generate AI
and analytics"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {languageModels?.map((model, index) => (
            <div
              key={index}
              className="w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm"
            >
              {/* Top section with image - replace with your actual image */}
              <div className="relative h-48 w-full">
                <Image
                  src={model?.image}
                  alt="GPU Model"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 384px"
                />
              </div>

              {/* Bottom section with model name */}
              <div className="p-6 bg-white">
                <h3 className="text-xl font-semibold text-center text-text-primary">
                  {model?.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </MyContainer>
    </section>
  );
};

export default LanguageModels;
