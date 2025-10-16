import SectionHead from '@/components/shared/SectionHead/SectionHead';
import MyContainer from '@/components/ui/MyContainer/MyContainer';

interface SecurityCardProps {
  title: string;
  description: string;
}

function SecurityCard({ title, description }: SecurityCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

export default function NetworkSecuritySection() {
  const securityCards = [
    {
      id: 1,
      title: 'How to Secure VPS',
      description:
        'Securing your VPS is essential to protect your data and prevent unauthorized access. Start by updating your system regularly, using strong SSH keys instead of passwords, and configuring a firewall like UFW.',
    },
    {
      id: 2,
      title: 'Windows Server Security',
      description:
        'Start by applying regular updates, enabling the firewall, and using strong user access controls. Disable unnecessary services, enforce strong password policies, and secure Remote Desktop access.',
    },
    {
      id: 3,
      title: 'Windows VPS Firewall Setup',
      description:
        'Setting up a firewall on your Windows VPS is a key step in securing your server.',
    },
    {
      id: 4,
      title: 'Windows Server Breach Detection',
      description:
        'Start by applying regular updates, enabling the firewall, and using strong user access controls. Disable unnecessary services, enforce strong password policies, and secure Remote Desktop access.',
    },
  ];

  return (
    <section className="w-full py-8 md:py-10">
      <MyContainer>
        <SectionHead
          title="Network and Security"
          description="A strong network and robust security measures are the foundation of reliable server hosting."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {securityCards.map((card) => (
            <SecurityCard
              key={card.id}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </MyContainer>
    </section>
  );
}
