'use client';
import React from 'react';
import { ServerIcon, ShoppingCartIcon } from './icons';
import { useGetUserDashboardStatsQuery } from '@/redux/features/user-dashboard/user-dashboard.api';

const UserDashboardPageComponent = () => {
  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetUserDashboardStatsQuery(undefined);
  const data = response?.data || {};
  const { activeServer, pendingOrder } = data;
  return (
    <div className="min-h-screen py-6 px-3">
      <h1 className="text-3xl font-semibold text-text-primary mb-6">
        Dashboard
      </h1>

      {!isLoading && !isFetching ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Active Server Card */}
          <div className="bg-white rounded-[12px] shadow-md p-6 flex items-center">
            <div className="w-16 h-16 p-3 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <ServerIcon className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Server</p>
              <p className="text-3xl font-bold text-text-primary">
                {activeServer || 0}
              </p>
            </div>
          </div>

          {/* Pending Orders Card */}
          <div className="bg-white rounded-[12px] shadow-md p-6 flex items-center">
            <div className="w-16 h-16 p-3 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <ShoppingCartIcon className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Pending Orders
              </p>
              <p className="text-3xl font-bold text-text-primary">
                {pendingOrder || 0}
              </p>
            </div>
          </div>

          

          {/* Invoices Due Card */}
          {/* <div className="bg-white rounded-[12px] shadow-md p-6 flex items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
            <FileTextIcon className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Invoices Due</p>
            <p className="text-3xl font-bold text-text-primary">0</p>
          </div>
        </div> */}

          {/* Support Tickets Card */}
          {/* <div className="bg-white rounded-[12px] shadow-md p-6 flex items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
            <HeadphonesIcon className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Support Tickets</p>
            <p className="text-3xl font-bold text-text-primary">0</p>
          </div>
        </div> */}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(2)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-[12px] shadow-md p-6 flex items-center"
              >
                <div className="w-16 h-16 bg-gray-200 animate-pulse rounded-full mr-4"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-300 animate-pulse rounded w-1/3"></div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboardPageComponent;
