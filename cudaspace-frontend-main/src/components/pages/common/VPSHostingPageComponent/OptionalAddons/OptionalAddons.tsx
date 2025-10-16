'use client';

import SectionHead from '@/components/shared/SectionHead/SectionHead';
import MyContainer from '@/components/ui/MyContainer/MyContainer';
import { useState } from 'react';

interface AddonOption {
  id: string;
  title: string;
  price: string;
  priceDetails: string;
  description?: string;
  limit?: string;
  selected?: boolean;
}

export default function OptionalAddons() {
  const [addons, setAddons] = useState<AddonOption[]>([
    {
      id: 'cpu',
      title: 'Additional CPU Core',
      price: '$2.00',
      priceDetails: '/month/core',
      limit: 'Upgrade limited to 16 cores',
      selected: false,
    },
    {
      id: 'memory',
      title: 'Additional Memory',
      price: '$2.00',
      priceDetails: '/month/GB',
      limit: 'Upgrade limited to 32GB',
      selected: false,
    },
    {
      id: 'ssd',
      title: 'Additional SSD Disk Space',
      price: '$2.00',
      priceDetails: '/month/20GB',
      description: 'NVMe SSD Drive',
      limit: 'Upgrade limited to 400GB',
      selected: false,
    },
    {
      id: 'ip',
      title: 'additional Dedicated IP',
      price: '$2.00',
      priceDetails: '/month/IP',
      description: 'IPv4 or IPv6',
      limit: 'Maximum 8 per package',
      selected: false,
    },
    {
      id: 'bandwidth',
      title: 'Bandwidth upgrade',
      price: 'Upgrade to',
      priceDetails: '1000Mbps/Shared',
      description: '$10.00/month',
      limit: 'Maximum 8 per package',
      selected: false,
    },
    {
      id: 'image',
      title: 'Image/vhdx Download',
      price: '$25.00',
      priceDetails: '/server one time fee',
      description: 'Understanding Your Server\'s Bandwidth',
      selected: false,
    },
  ]);

  const toggleAddon = (id: string) => {
    setAddons(
      addons.map((addon) => {
        if (addon.id === id) {
          return { ...addon, selected: !addon.selected };
        }
        return addon;
      }),
    );
  };

  return (
    <section className="py-8 md:py-12">
      <MyContainer>
        <SectionHead
          title="Optional Add one VPS Server"
          description="Make server administration effortless with user-friendly control panels such as cPanel or Plesk."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {addons.map((addon) => (
            <div
              key={addon.id}
              // onClick={() => toggleAddon(addon.id)}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                addon.selected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <h3 className="font-medium text-gray-900 mb-2">{addon.title}</h3>
              <div className="flex flex-wrap items-baseline mb-1">
                <span className="text-blue-600 font-medium">{addon.price}</span>
                <span className="text-gray-500 text-sm ml-1">
                  {addon.priceDetails}
                </span>
              </div>
              {addon.description && (
                <p className="text-sm text-gray-600 mb-1">
                  {addon.description}
                </p>
              )}
              {addon.limit && (
                <p className="text-xs text-gray-500">{addon.limit}</p>
              )}
            </div>
          ))}
        </div>
      </MyContainer>
    </section>
  );
}
