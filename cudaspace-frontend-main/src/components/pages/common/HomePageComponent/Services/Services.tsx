import SectionHead from '@/components/shared/SectionHead/SectionHead';
import MyContainer from '@/components/ui/MyContainer/MyContainer';
import { IServiceCard, servicesData } from '@/constant/services';
import Image from 'next/image';
import React from 'react';

const Services = () => {
  return (
    <main className="py-10 md:py-16 bg-gray-50">
      <MyContainer>
        <SectionHead
          title="Versatile Solutions for All Applications"
          description='Versatile Solutions for All Applications" offers adaptable and innovative products or services designed to meet a wide range of needs across various industries, ensuring efficiency, reliability, and performance in any context.'
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {servicesData.map((service: IServiceCard, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row overflow-hidden rounded-lg border border-gray-200 bg-white"
            >
              {/* Image section */}
              <div className="relative h-48 w-full md:h-auto md:w-2/5">
                <Image
                  src={service?.imageSrc || '/placeholder.svg'}
                  alt={service?.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 384px"
                />
              </div>

              {/* Content section */}
              <div className="flex flex-col p-4 md:w-3/5">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">
                  {service?.title}
                </h3>
                <p className="text-gray-700 text-sm">{service?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </MyContainer>
    </main>
  );
};

export default Services;
