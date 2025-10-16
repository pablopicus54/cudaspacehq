'use client';
import { useGetSingleUserQuery } from '@/redux/features/user/userApi';
import { Check } from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react';

const UserServicePageComponent = () => {
  const userId = useParams().userId;
const {data} = useGetSingleUserQuery(userId);
  console.log(data?.data?.user);

  // Service options data
  const serviceOptions = [
    {
      title: 'Multi-CPU Dedicated server-2xRTX 4060',
      specs: [
        '80GB RAM',
        '6 CPU Cores',
        '1200GB SSD',
        '100Mbps Unmetered Bandwidth',
        'Operating System: Linux/Windows 10',
        'Dedicated CPU: GeForce CT730',
        'CUDA Cores: 384',
        'GPU Memory: 20GB DDR3',
        'FP32 Performance: 0.692 TFLOPS',
        'Renewal Date: 31 May 2025',
      ],
    },
    {
      title: 'Express GPU - K620',
      specs: [
        '80GB RAM',
        '6 CPU Cores',
        '1200GB SSD',
        '100Mbps Unmetered Bandwidth',
        'Operating System: Linux/Windows 10',
        'Dedicated CPU: GeForce CT730',
        'CUDA Cores: 384',
        'GPU Memory: 20GB DDR3',
        'FP32 Performance: 0.692 TFLOPS',
        'Renewal Date: 31 May 2025',
      ],
    },
    {
      title: 'Express Windows Server VPS',
      specs: [
        '80GB RAM',
        '6 CPU Cores',
        '1200GB SSD',
        '100Mbps Unmetered Bandwidth',
        'Operating System: Linux/Windows 10',
        'Dedicated CPU: GeForce CT730',
        'CUDA Cores: 384',
        'GPU Memory: 20GB DDR3',
        'FP32 Performance: 0.692 TFLOPS',
        'Renewal Date: 31 May 2025',
      ],
    },
  ];
  return (
    <main className="flex-1 overflow-y-auto p-4 ">
      <h1 className="text-2xl font-bold mb-6">User service</h1>

      {/* User Details */}
      <div className="mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-md">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">
            User Details
          </h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">User ID:</span> {userId}
            </p>
            <p>
              <span className="font-medium">Name:</span> {data?.data?.user?.name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {data?.data?.user?.email}
            </p>
            <p>
              <span className="font-medium">Service uses:</span>{' '}
              {data?.data?.user?.serviceUses}
            </p>
         
            <p>
              <span className="font-medium">Account Status:</span>{' '}
              <span className="text-green-500">{data?.data?.user?.status}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Service Details */}
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-4">
          Service Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceOptions.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <h3 className="font-semibold text-text-primary mb-4">
                {service.title}
              </h3>
              <ul className="space-y-2">
                {service.specs.map((spec, specIndex) => (
                  <li key={specIndex} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-600">{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default UserServicePageComponent;
