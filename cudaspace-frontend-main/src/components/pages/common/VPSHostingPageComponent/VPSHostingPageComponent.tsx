import React from 'react';
import PackageBanner from '../PackagePagesReusableComponents/PackageBanner';
import vpsBannerImage from '@/assets/images/vpsBannerImage.png';
import VPSHostingPlans from './VPSHostingPlans/VPSHostingPlans';
import OptionalAddons from './OptionalAddons/OptionalAddons';
import WhyChooseUsVps from './WhyChooseUsVps/WhyChooseUsVps';
import FaqSection from '../../../shared/FaqSection/FaqSection';
import { vpsHostingFaqs } from '@/constant/faqData';

const VPSHostingPageComponent = () => {
  return (
    <div>
      <PackageBanner
        title="Reliable and Scalable VPS Hosting"
        description="VPS Hosting provides dedicated resources, improved performance, and full control, offering scalability, security, and flexibility for growing businesses and developers."
        buttonText="Get Started"
        buttonLink="#plans"
        imageSrc={vpsBannerImage?.src}
        imageAlt="Hand holding device with cloud computing visualization"
      />
      <VPSHostingPlans />
      <OptionalAddons />
      <WhyChooseUsVps />
      <FaqSection
        title="FAQs of GPU Hosting, Dedicated Server with VPS"
        description="GPUs are optimized for tasks like video rendering, AI processing, and scientific simulations, providing faster processing speeds."
        faqs={vpsHostingFaqs}
      />
    </div>
  );
};

export default VPSHostingPageComponent;
