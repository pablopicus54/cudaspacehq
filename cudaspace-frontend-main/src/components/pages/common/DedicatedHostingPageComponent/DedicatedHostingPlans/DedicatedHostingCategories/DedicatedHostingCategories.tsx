'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import dedicated1 from '@/assets/images/dedicated1.png';
import dedicated2 from '@/assets/images/dedicated2.png';
import dedicated3 from '@/assets/images/dedicated3.png';
import dedicated4 from '@/assets/images/dedicated4.png';

type DedicatedHostingCategory =
  | 'NVMe Server'
  | 'SSD Server'
  | 'HDD Server'
  | 'RAID Server';

interface DedicatedHostingCategoryProps {
  onCategoryChange?: (category: DedicatedHostingCategory) => void;
  defaultCategory?: DedicatedHostingCategory;
}

export default function DedicatedHostingCategories({
  onCategoryChange,
  defaultCategory = 'NVMe Server',
}: DedicatedHostingCategoryProps) {
  const [activeCategory, setActiveCategory] =
    useState<DedicatedHostingCategory>(defaultCategory);

  const handleCategoryChange = (category: DedicatedHostingCategory) => {
    setActiveCategory(category);
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  const categories: { name: DedicatedHostingCategory; icon: string }[] = [
    {
      name: 'NVMe Server',
      icon: dedicated1.src,
    },
    {
      name: 'SSD Server',
      icon: dedicated2.src,
    },
    {
      name: 'HDD Server',
      icon: dedicated3.src,
    },
    {
      name: 'RAID Server',
      icon: dedicated4.src,
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="flex flex-wrap gap-4 justify-center">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => handleCategoryChange(category.name)}
            className={cn(
              'flex items-center justify-center flex-col px-6 py-4 rounded-xl border transition-colors min-w-[180px]',
              activeCategory === category.name
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-text-primary border-gray-200 hover:border-blue-300',
            )}
          >
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center mb-2',
                activeCategory === category.name ? 'bg-blue-500' : 'bg-gray-100',
              )}
            >
              <div className="relative w-6 h-6">
                <Image
                  src={category.icon || '/placeholder.svg'}
                  alt={category.name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <span className="text-sm font-medium">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
