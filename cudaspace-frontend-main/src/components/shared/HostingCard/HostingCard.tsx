'use client';

import planImage from '@/assets/images/planImage.png';
import MyButton from '@/components/ui/MyButton/MyButton';
import { THostingPackage } from '@/types/service-package';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface HostingCardProps {
  plan: THostingPackage;
}

export default function HostingCard({ plan }: HostingCardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<
    'Month' | 'Quarter' | 'Year'
  >('Month');
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header Image */}
      <div className="w-full h-48 bg-blue-800 relative">
        <Image
          src={planImage}
          // src={plan?.packageImage}
          alt="Cloud computing illustration"
          fill
          className="object-cover"
        />
        {plan?.promotianal ? (
          <div className="absolute top-0 right-0 bg-green-600 text-white px-3 py-2 rounded-md">
            <p className="text-[12px]">Promotional</p>
          </div>
        ) : (
          ''
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {plan?.serviceName}
        </h3>

        {/* Specifications */}
        <ul className="space-y-2 mb-6">
          {plan?.serviceDetails?.map((s, idx: number) => (
            <li key={idx} className="flex items-start">
              <svg
                className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span>{s}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto">
          {/* Price */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center">
              <span className="text-2xl font-bold">$</span>
              <span className="text-5xl font-bold">
                {selectedPeriod === 'Month'
                  ? plan?.perMonthPrice?.toFixed(2)
                  : selectedPeriod === 'Quarter'
                  ? plan?.perQuarterPrice?.toFixed(2)
                  : selectedPeriod === 'Year'
                  ? plan?.perYearPrice?.toFixed(2)
                  : null}
                {/* plan?.perYearPrice?.toFixed(2) */}
              </span>
              <span className="text-gray-500 ml-1">
                /
                {selectedPeriod === 'Month'
                  ? 'month'
                  : selectedPeriod === 'Quarter'
                  ? 'quarter'
                  : selectedPeriod === 'Year'
                  ? 'year'
                  : null}
              </span>
            </div>
          </div>

          {/* Period Selection */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-full bg-gray-200 p-1">
              {(['Month', 'Quarter', 'Year'] as const).map((period) => (
                <button
                  key={period}
                  className={`px-4 py-1 text-sm rounded-full ${
                    selectedPeriod === period
                      ? 'bg-white text-text-primary shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Order Button */}
          <Link href={`/checkout?packageId=${plan?.id}`}>
            <MyButton
              label="Order Now"
              className={`rounded-full ${
                plan?.promotianal ? '!bg-green-600' : ''
              }`}
              fullWidth
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
