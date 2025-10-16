import React from 'react';
import PackageBanner from '../PackagePagesReusableComponents/PackageBanner';
import dedicatedBannerImage from '@/assets/images/dedicatedBannerImage.png';
import DedicatedHostingPlans from './DedicatedHostingPlans/DedicatedHostingPlans';
import FaqSection from '../../../shared/FaqSection/FaqSection';
import { vpsHostingFaqs } from '@/constant/faqData';
import { BenefitsSection } from './BenefitsSection/BenefitsSection';
import { DedicatedServerSection } from './DedicatedServerSection/DedicatedServerSection';

const DedicatedHostingPageComponent = () => {
  return (
    <div>
      <PackageBanner
        title="High-Performance Dedicated Servers "
        description="Whether you're hosting websites, applications, or running complex workloads, our dedicated servers deliver the stability and scalability you need."
        buttonText="Get Started"
        buttonLink="#plans"
        imageSrc={dedicatedBannerImage.src}
        imageAlt="Hand holding device with cloud computing visualization"
      />
      <DedicatedHostingPlans />
      <BenefitsSection />
      <DedicatedServerSection />
      <FaqSection
        title="FAQs of GPU Hosting, Dedicated Server with VPS"
        description="GPUs are optimized for tasks like video rendering, AI processing, and scientific simulations, providing faster processing speeds."
        faqs={vpsHostingFaqs}
      />
    </div>
  );
};

export default DedicatedHostingPageComponent;
