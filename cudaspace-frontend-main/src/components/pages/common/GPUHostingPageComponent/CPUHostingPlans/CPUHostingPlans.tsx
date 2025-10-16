'use client';
import HostingCard from '@/components/shared/HostingCard/HostingCard';
import SectionHead from '@/components/shared/SectionHead/SectionHead';
import MyContainer from '@/components/ui/MyContainer/MyContainer';
import {
  CPUMemory,
  CPUScenario,
  GPUClassify,
  GPUModel,
  PlanCategory,
} from '@/constant/GPUPlanData';
import { cn } from '@/lib/utils';
import { useGetAllPackageQuery } from '@/redux/features/package/package.user.api';
import { THostingPackage } from '@/types/service-package';
import { Pagination } from 'antd';
import { useEffect, useState } from 'react';

// Arrays for our filter options
const categories: PlanCategory[] = ['All Plans', 'New Arrivals', 'Promotion'];
const gpuClassifies: GPUClassify[] = ['Desktop', 'Datacenter', 'Workstation'];
const cpuScenarios: CPUScenario[] = [
  'Live Streaming',
  'AI & Deep Learning',
  'Android Emulator',
  'CAD/CCI/DCC',
  'Video Editing',
  '3D Rendering',
  'HD Gaming',
];
const cpuMemories: CPUMemory[] = [
  '1 GB',
  '2 GB',
  '4 GB',
  '6 GB',
  '8 GB',
  '16 GB',
  '24 GB',
  '32 GB',
  '40 GB',
  '48 GB',
  '72 GB',
  '74 GB',
  '80 GB',
  '128 GB',
];
const gpuModels: GPUModel[] = [
  'GT 710',
  'CT 730',
  'K620',
  'P600',
  'P620',
  'P1000',
  'T1000',
  'GTX 1650',
  'GTX 1660',
  'RTX 2060',
  'RTX 3060',
  'RTX 4000',
  'RTX A5000',
  'RTX A6600',
  'RTX 4060',
  'RTX 4090',
  'RTX 5050',
  'RTX 5060',
  'K80',
  'V100',
  'A40',
  'A100',
  'H100',
];

const CPUHostingPlans = () => {
  // State for active filters
  const [activeCategory, setActiveCategory] =
    useState<PlanCategory>('All Plans');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [newArrivals, setNewArrivals] = useState<string>('');
  const [promotional, setPromotional] = useState('');
  const [serviceDetails, setServiceDetails] = useState<string[]>([]);
  const [objectQuery, setObjectQuery] = useState<
    { name: string; value: string | number }[]
  >([
    { name: 'page', value: page },
    { name: 'limit', value: pageSize },
    { name: 'packageType', value: 'GPU_HOSTING' },
  ]);

  // Handle pagination changes
  const handlePaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
  };

  // Update query when search/filter parameters change
  useEffect(() => {
    const newQuery: { name: string; value: string | number }[] = [
      { name: 'page', value: page },
      { name: 'limit', value: pageSize },
      { name: 'packageType', value: 'GPU_HOSTING' },
    ];

    if (newArrivals) {
      newQuery.push({ name: 'newArrivals', value: newArrivals });
    }

    if (promotional) {
      newQuery.push({ name: 'promotional', value: promotional });
    }

    if (serviceDetails) {
      serviceDetails?.map((s) => {
        return newQuery.push({
          name: 'serviceDetails',
          value: s,
        });
      });
    }

    setObjectQuery(newQuery);
  }, [
    page,
    pageSize,
    newArrivals,
    promotional,
    activeCategory,
    serviceDetails,
  ]);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [newArrivals, promotional, activeCategory, serviceDetails]);

  const {
    data: packagesResponse,
    isLoading,
    isFetching,
  } = useGetAllPackageQuery(objectQuery, {
    refetchOnMountOrArgChange: true,
  });

  const packages: THostingPackage[] = packagesResponse?.data?.data || [];

  const handleAddServiceDetails = (tag: string) => {
    if (serviceDetails?.includes(tag)) {
      const newServiceDetails = serviceDetails?.filter((s) => s !== tag);
      setServiceDetails(newServiceDetails);
      return;
    }
    setServiceDetails([...serviceDetails, tag]);
  };

  return (
    <div id="plans" className="my-10 md:my-16">
      <SectionHead
        title="30+ Strong CPU Hosting Plans for Demanding Tasks"
        description="Our robust CPU hosting solutions are designed to handle the most demanding tasks with ease. Whether you're running complex databases, high-performance applications, or intensive computational processes"
      />
      <MyContainer>
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setNewArrivals(category === 'New Arrivals' ? 'true' : '');
                setPromotional(category === 'Promotion' ? 'true' : '');
              }}
              className={cn(
                'px-3 md:px-6 py-2 rounded-full text-sm font-medium transition-colors',
                activeCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* what we have */}
        <div className="mb-8 gap-6 grid grid-cols-2 lg:grid-cols-3">
          {/* GPU Card Classify */}
          {/* <div className="flex flex-col">
            <h3 className="text-lg font-medium mb-3">GPU Card Classify</h3>
            <div className="flex flex-col w-fit gap-2">
              {gpuClassifies.map((classify) => (
                <button
                  key={classify}
                  onClick={() => handleAddServiceDetails(classify)}
                  className={cn(
                    'px-4 py-2 cursor-pointer rounded-full text-sm border transition-colors bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
                    {
                      'ring-1 ring-primary bg-blue-50':
                        serviceDetails?.includes(classify),
                    }
                  )}
                >
                  {classify}
                </button>
              ))}
            </div>
          </div> */}

          {/* CPU Use Scenario */}
          <div className="flex flex-col">
            <h3 className="text-lg font-medium mb-3">CPU Use Scenario</h3>
            <div className="flex flex-col w-fit gap-2">
              {cpuScenarios.map((scenario) => (
                <button
                  key={scenario}
                  onClick={() => handleAddServiceDetails(scenario)}
                  className={cn(
                    'px-4 py-2 cursor-pointer rounded-full text-sm border transition-colors bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
                    {
                      'ring-1 ring-primary bg-blue-50':
                        serviceDetails?.includes(scenario),
                    },
                  )}
                >
                  {scenario}
                </button>
              ))}
            </div>
          </div>

          {/* CPU Memory */}
          <div className="flex flex-col">
            <h3 className="text-lg font-medium mb-3">GPU Memory</h3>
            <div className="grid grid-cols-2 w-fit gap-2">
              {cpuMemories.map((memory) => (
                <button
                  key={memory}
                  onClick={() => handleAddServiceDetails(memory)}
                  className={cn(
                    'px-4 py-2 cursor-pointer rounded-full text-sm border transition-colors bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
                    {
                      'ring-1 ring-primary bg-blue-50':
                        serviceDetails?.includes(memory),
                    },
                  )}
                >
                  {memory}
                </button>
              ))}
            </div>
          </div>

          {/* GPU Card Model */}
          <div className="flex flex-col">
            <h3 className="text-lg font-medium mb-3">GPU Card Model</h3>
            <div className="grid grid-cols-2 w-fit gap-2">
              {gpuModels.map((model) => (
                <button
                  key={model}
                  onClick={() => handleAddServiceDetails(model)}
                  className={cn(
                    'px-4 py-2 cursor-pointer rounded-full text-sm border transition-colors bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
                    {
                      'ring-1 ring-primary bg-blue-50':
                        serviceDetails?.includes(model),
                    },
                  )}
                >
                  {model}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Display Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading || isFetching
            ? [1, 2, 3].map((e) => (
                <div
                  key={e}
                  className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden animate-pulse"
                >
                  {/* Header Image Skeleton */}
                  <div className="w-full h-48 bg-gray-300 relative">
                    <div className="w-full h-full bg-gray-400 animate-pulse"></div>
                  </div>

                  {/* Card Content Skeleton */}
                  <div className="p-5">
                    {/* Title Skeleton */}
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-4 animate-pulse"></div>

                    {/* Specifications Skeleton */}
                    <ul className="space-y-2 mb-6">
                      {[...Array(5)].map((_, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <div className="w-5 h-5 bg-gray-300 rounded-full animate-pulse"></div>
                          <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                        </li>
                      ))}
                    </ul>

                    {/* Price Skeleton */}
                    <div className="text-center mb-4">
                      <div className="flex items-center justify-center space-x-1">
                        <div className="h-6 w-8 bg-gray-300 rounded animate-pulse"></div>
                        <div className="h-8 w-20 bg-gray-300 rounded animate-pulse"></div>
                        <div className="h-6 w-12 bg-gray-300 rounded animate-pulse"></div>
                      </div>
                    </div>

                    {/* Order Button Skeleton */}
                    <div className="h-10 bg-gray-300 rounded-full animate-pulse"></div>
                  </div>
                </div>
              ))
            : ''}
          {!isFetching && !isFetching && packages.length > 0 ? (
            packages.map((plan: THostingPackage, idx: number) => (
              <HostingCard key={idx} plan={plan} />
              // <HostingCard
              //   key={idx}
              //   title="Express GPU"
              //   gpuModel="K620"
              //   ram="80GB"
              //   cpuCores={6}
              //   storage="1200GB"
              //   bandwidth="100Mbps"
              //   operatingSystem="Linux/Windows 10"
              //   dedicatedCpu="GeForce CT730"
              //   cudaCores={384}
              //   gpuMemory="20GB DDR3"
              //   fp32Performance="0.692 TFLOPS"
              //   price={21.0}
              // />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No plans match your filters
              </h3>
              <p className="text-gray-500">
                Try adjusting your filter criteria to see more options.
              </p>
            </div>
          )}
        </div>
        <div className="p-4 w-full flex justify-center items-center mt-6">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={packagesResponse?.data?.meta?.total}
            onChange={handlePaginationChange}
            className="custom-pagination"
            // showSizeChanger
            // pageSizeOptions={[5, 10, 20, 50]}
          />
        </div>
      </MyContainer>
    </div>
  );
};

export default CPUHostingPlans;
