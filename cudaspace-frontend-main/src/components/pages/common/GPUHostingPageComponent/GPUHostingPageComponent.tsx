import gpuBannerImage from '@/assets/images/gpuBannerImage.png';
import { gpuHostingFaqs } from '@/constant/faqData';
import FaqSection from '../../../shared/FaqSection/FaqSection';
import PackageBanner from '../PackagePagesReusableComponents/PackageBanner';
import CPUHostingPlans from './CPUHostingPlans/CPUHostingPlans';
import WhyChooseUs from './WhyChooseUs/WhyChooseUs';

const GPUHostingPageComponent = () => {
  return (
    <div>
      <PackageBanner
        title="Boost Performance with Scalable GPU Hosting"
        description="Our GPU hosting offers the power and reliability needed for fast processing of data-heavy tasks, machine learning, and high-performance applications."
        buttonText="Get Started"
        buttonLink="#plans"
        imageSrc={gpuBannerImage.src}
        imageAlt="Hand holding device with cloud computing visualization"
      />
      <CPUHostingPlans />
      <WhyChooseUs />
      <FaqSection
        title="FAQs of GPU Hosting, Dedicated Server with GPU"
        description="GPUs are optimized for tasks like video rendering, AI processing, and scientific simulations, providing faster processing speeds."
        faqs={gpuHostingFaqs}
      />
      {/* <ContactForm /> */}
    </div>
  );
};

export default GPUHostingPageComponent;
