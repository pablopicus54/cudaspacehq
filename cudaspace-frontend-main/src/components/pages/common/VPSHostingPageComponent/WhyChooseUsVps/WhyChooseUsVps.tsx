import Image from 'next/image';
import WhyChooseUsVpsImage from '@/assets/images/WhyChooseUsVpsImage.png';
import MyContainer from '@/components/ui/MyContainer/MyContainer';
import SectionHead from '@/components/shared/SectionHead/SectionHead';

export default function WhyChooseUsVps() {
  return (
    <section className="py-8 md:py-12">
      <MyContainer>
        <SectionHead
          title="Why Choose Us"
          description="Our database solutions are designed to scale with your business,
            ensuring seamless growth without compromising on performance."
        />

        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="lg:w-1/2 space-y-6">
            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2">
                Blazing Fast VPS Hosting
              </h3>
              <p className="text-gray-600">
                Experience lightning-fast performance with our high-speed VPS
                servers—perfect for websites, apps, and projects that demand
                speed and reliability.
              </p>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2">
                Full Control. Zero Limits.
              </h3>
              <p className="text-gray-600">
                Unlock complete flexibility with our VPS hosting. You have full
                root access and the freedom to customize your server without any
                restrictions.
              </p>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2">
                Power, Performance, Precision.
              </h3>
              <p className="text-gray-600">
                Harness the full potential of high-performance VPS
                hosting—designed for speed, reliability, and flawless execution
                on every task.
              </p>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-2">
                Scalable VPS for Any Project
              </h3>
              <p className="text-gray-600">
                Easily scale your VPS hosting to match the growth of your
                project, from small startups to large enterprises, with seamless
                performance at every stage.
              </p>
            </div>
          </div>

          <div className="lg:w-1/2">
            <div className="rounded-3xl overflow-hidden h-full w-full flex items-center justify-end">
              <Image
                src={WhyChooseUsVpsImage.src}
                alt="VPS Server Infrastructure"
                width={500}
                height={400}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </MyContainer>
    </section>
  );
}
