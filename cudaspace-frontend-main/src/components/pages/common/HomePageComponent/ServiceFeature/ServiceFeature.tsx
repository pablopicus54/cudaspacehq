import SectionHead from '@/components/shared/SectionHead/SectionHead';
import MyContainer from '@/components/ui/MyContainer/MyContainer';
import { Settings, ShieldCheck, User } from 'lucide-react';
import type React from 'react';

interface ServiceFeature {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Create an array of service features
const serviceFeatures: ServiceFeature[] = [
  {
    id: 'support',
    icon: <User className="h-8 w-8" />,
    title: '24/7 Expert Customer Support',
    description:
      'we believe great customer support never sleeps. Our team of dedicated experts is available 24/7 to assist you with any questions,',
  },
  {
    id: 'uptime',
    icon: <ShieldCheck className="h-8 w-8" />,
    title: '99.9% Uptime Guarentee',
    description:
      'we back our services with a 99.9% uptime guarantee — ensuring your website, applications, and services stay up and running smoothly.',
  },
  {
    id: 'control-panel',
    icon: <Settings className="h-8 w-8" />,
    title: 'Easy-to-Use Control Panel',
    description:
      'Take full control of your services with our intuitive, user-friendly control panel. Designed with simplicity in mind, our platform makes managing your website',
  },
];

const ServiceFeature = () => {
  return (
    <main className="py-10 md:py-12">
      <MyContainer>
        <SectionHead
          title="Full Time Service"
          description="From handling technical issues to offering proactive maintenance and
            tailored services, we are committed to delivering the highest
            standards of care and efficiency."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {serviceFeatures.map((feature) => (
            <div
              key={feature.id}
              className="border border-gray-200 rounded-lg p-6 flex flex-col items-start hover:shadow-md transition-shadow"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </MyContainer>
    </main>
  );
};

export default ServiceFeature;
