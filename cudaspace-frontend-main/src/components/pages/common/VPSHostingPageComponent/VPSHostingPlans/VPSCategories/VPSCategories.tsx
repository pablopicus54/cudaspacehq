'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import vps1 from '@/assets/images/vps1.png';
import vps2 from '@/assets/images/vps2.png';
import vps3 from '@/assets/images/vps3.png';
import vps4 from '@/assets/images/vps4.png';

type VpsCategory =
  | 'Windows Desktop VPS'
  | 'Windows Server VPS'
  | 'Linux VPS'
  | 'GPU VPS';

interface VpsCategoryProps {
  onCategoryChange?: (category: VpsCategory) => void;
  defaultCategory?: VpsCategory;
}

export default function VpsCategories({
  onCategoryChange,
  defaultCategory = 'Windows Desktop VPS',
}: VpsCategoryProps) {
  const [activeCategory, setActiveCategory] =
    useState<VpsCategory>(defaultCategory);

  const handleCategoryChange = (category: VpsCategory) => {
    setActiveCategory(category);
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  const categories: { name: VpsCategory; icon: string }[] = [
    {
      name: 'Windows Desktop VPS',
      icon: vps1.src,
    },
    {
      name: 'Windows Server VPS',
      icon: vps2.src,
    },
    {
      name: 'Linux VPS',
      icon: vps3.src,
    },
    {
      name: 'GPU VPS',
      icon: vps4.src,
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
