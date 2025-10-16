import React from 'react';
import ResourcesBanner from './ResourcesBanner/ResourcesBanner';
import Blogs from './Blogs/Blogs';
import NetworkSecuritySection from './NetworkSecuritySection/NetworkSecuritySection';
import FaqSection from '../../../shared/FaqSection/FaqSection';
import { vpsHostingFaqs } from '@/constant/faqData';

const ResourcesPageComponent = () => {
  return (
    <div>
      <ResourcesBanner />
      <Blogs />
      <NetworkSecuritySection />
      <FaqSection
        title="FAQs of GPU Hosting, Dedicated Server with VPS"
        description="GPUs are optimized for tasks like video rendering, AI processing, and scientific simulations, providing faster processing speeds."
        faqs={vpsHostingFaqs}
      />
    </div>
  );
};

export default ResourcesPageComponent;
