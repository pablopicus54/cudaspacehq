'use client';

import { useState } from 'react';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  CheckIcon,
} from '@/components/pages/user/MyServicesPageComponent/icons';

export interface PurchasedService {
  id: string;
  packageType: string;
  serviceName: string;
  perMonthPrice: number;
  serviceDetails: string[];
  promotianal: boolean;
  vpsType: string | null;
  serverType: string | null;
  packageImage: string;
  stripePriceId: string;
  productId: string;
  totalSales: number | null;
  totalReveneue: number | null;
  packageStatus: string;
  createdAt: string;
  updatedAt: string;
}

type ServiceAccordionProps = {
  items: PurchasedService[];
  defaultExpanded?: string;
};

export function ServiceAccordion({
  items,
  defaultExpanded,
}: ServiceAccordionProps) {
  const [expandedItem, setExpandedItem] = useState(
    defaultExpanded || items[0]?.id || '',
  );

  const toggleAccordion = (id: string) => {
    setExpandedItem(expandedItem === id ? '' : id);
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="rounded-lg overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-4 bg-blue-100 text-blue-700 font-medium"
            onClick={() => toggleAccordion(item.id)}
          >
            <span>{item.serviceName}</span>
            {expandedItem === item.id ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </button>

          {expandedItem === item.id && (
            <div className="bg-white p-6">
              <div className="flex items-center mb-4">
                <div className="w-4 h-4 rounded-full bg-green-500 mr-3"></div>
                <span className="text-blue-700 font-medium">
                  {item.packageType}
                </span>
              </div>

              <ul className="space-y-2">
                {item.serviceDetails.map((spec, index) => (
                  <li key={index} className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
