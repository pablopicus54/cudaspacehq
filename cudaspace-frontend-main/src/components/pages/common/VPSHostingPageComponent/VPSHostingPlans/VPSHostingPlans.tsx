'use client';
import HostingCard from '@/components/shared/HostingCard/HostingCard';
import SectionHead from '@/components/shared/SectionHead/SectionHead';
import MyContainer from '@/components/ui/MyContainer/MyContainer';
import { useEffect, useState } from 'react';
import VpsCategories from './VPSCategories/VPSCategories';
import { hostingPlans } from '@/constant/GPUPlanData';
import { Pagination } from 'antd';
import { THostingPackage } from '@/types/service-package';
import { useGetAllPackageQuery } from '@/redux/features/package/package.user.api';
import Image from 'next/image';
import vps1 from '@/assets/images/vps1.png';
import vps2 from '@/assets/images/vps2.png';
import vps3 from '@/assets/images/vps3.png';
import vps4 from '@/assets/images/vps4.png';
import { cn } from '@/lib/utils';

type VpsCategory =
  | 'Windows Desktop VPS'
  | 'Windows Server VPS'
  | 'Linux VPS'
  | 'GPU VPS';
type VpsCategoryValue =
  | 'WINDOWS_DESKTOP_VPS'
  | 'WINDOWS_SERVER_VPS'
  | 'LINUX_VPS'
  | 'GPU_VPS';

const categories: {
  name: VpsCategory;
  value: VpsCategoryValue;
  icon: string;
}[] = [
  {
    name: 'Windows Desktop VPS',
    value: 'WINDOWS_DESKTOP_VPS',
    icon: vps1.src,
  },
  {
    name: 'Windows Server VPS',
    value: 'WINDOWS_SERVER_VPS',
    icon: vps2.src,
  },
  {
    name: 'Linux VPS',
    value: 'LINUX_VPS',
    icon: vps3.src,
  },
  {
    name: 'GPU VPS',
    value: 'GPU_VPS',
    icon: vps4.src,
  },
];

const VPSHostingPlans = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [activeCategory, setActiveCategory] = useState<VpsCategoryValue | null>(
    null,
  );
  const [objectQuery, setObjectQuery] = useState<
    { name: string; value: string | number }[]
  >([
    { name: 'page', value: page },
    { name: 'limit', value: pageSize },
    { name: 'packageType', value: 'VPS_HOSTING' },
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
      { name: 'packageType', value: 'VPS_HOSTING' },
    ];

    if (activeCategory) {
      newQuery.push({ name: 'vpsType', value: activeCategory });
    }

    setObjectQuery(newQuery);
  }, [page, pageSize, activeCategory]);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [activeCategory]);

  const {
    data: packagesResponse,
    isLoading,
    isFetching,
  } = useGetAllPackageQuery(objectQuery, {
    refetchOnMountOrArgChange: true,
  });

  const packages: THostingPackage[] = packagesResponse?.data?.data || [];

  const handleCategoryChange = (category: VpsCategoryValue) => {
    setActiveCategory(category);
  };

  return (
    <div id="plans" className="my-10 md:my-16">
      <SectionHead
        title="VPS Hosting Plans"
        description="Maximize efficiency with powerful VPS solutions that deliver top-tier performance at an affordable price!"
      />
      <MyContainer>
        {/* Category Tabs */}
        <div className="w-full max-w-4xl mx-auto mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategoryChange(category.value)}
                className={cn(
                  'flex items-center justify-center flex-col px-6 py-4 rounded-xl border transition-colors min-w-[180px]',
                  activeCategory === category.value
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-text-primary border-gray-200 hover:border-blue-300',
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center mb-2',
                    activeCategory === category.value
                      ? 'bg-blue-500'
                      : 'bg-gray-100',
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

export default VPSHostingPlans;
