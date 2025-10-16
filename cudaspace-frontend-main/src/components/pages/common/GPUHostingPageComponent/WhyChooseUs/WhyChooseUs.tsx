import SectionHead from '@/components/shared/SectionHead/SectionHead';
import MyContainer from '@/components/ui/MyContainer/MyContainer';
import Image from 'next/image';
import whyChooseUs1 from '@/assets/images/whyChooseUs1.png';
import whyChooseUs2 from '@/assets/images/whyChooseUs2.png';

export default function WhyChooseUs() {
  return (
    <section className="py-8 md:py-10">
      <MyContainer>
        <SectionHead
          title="Why Choose Us"
          description="Our database solutions are designed to scale with your business, ensuring seamless growth without compromising on performance."
        />

        <div className="flex flex-col lg:flex-row items-center gap-8 mb-16">
          <div className="lg:w-1/2">
            <p className="text-gray-700 leading-relaxed">
              We prioritize the protection of your data with robust security
              measures, ensuring that your sensitive information is kept safe
              from unauthorized access or breaches. We follow the best industry
              standards and compliance protocols to safeguard your data at all
              times.
            </p>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="relative">
              <Image
                src={whyChooseUs1}
                alt="Server stacks visualization"
                width={400}
                height={250}
                className="rounded-lg object-cover"
              />
              <Image
                src={whyChooseUs2}
                alt="CPU processor chip"
                width={300}
                height={200}
                className="hidden md:block absolute -bottom-10 -right-10 rounded-lg shadow-xl object-cover"
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* VPS Server */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-4">VPS Server</h3>
            <p className="text-gray-600">
              Our VPS server are built on cutting-edge hardware, offering
              exceptional performance to meet the demands of your applications.
            </p>
          </div>

          {/* GPU Server */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-4">GPU Server</h3>
            <p className="text-gray-600">
              Our VPS server are built on cutting-edge hardware, offering
              exceptional performance to meet the demands of your applications.
            </p>
          </div>

          {/* Dedicated Server */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-4">Dedicated Server</h3>
            <p className="text-gray-600">
              Our VPS server are built on cutting-edge hardware, offering
              exceptional performance to meet the demands of your applications.
            </p>
          </div>
        </div>
      </MyContainer>
    </section>
  );
}
