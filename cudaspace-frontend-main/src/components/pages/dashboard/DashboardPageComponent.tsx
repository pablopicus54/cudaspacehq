'use client';

import { BiMessageSquare } from 'react-icons/bi';
import { FaDollarSign } from 'react-icons/fa';
import { GrServerCluster } from 'react-icons/gr';
import { MdOutlinePeopleAlt } from 'react-icons/md';
import RecentOrdersTable from './recent-orders-table';
import { useGetAllDashboardCountsQuery } from '@/redux/features/dashboard/dashboardApi';

const DashboardPageComponent = () => {
  const {data : getAllDashboardCountsQuery} =  useGetAllDashboardCountsQuery(undefined);
  return (
    <main className="flex-1 overflow-y-auto p-4 ">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex flex-row-reverse items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold mt-1">{getAllDashboardCountsQuery?.data?.totalUser }</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <MdOutlinePeopleAlt className="w-5 h-5 text-red-500" />
            </div>
          </div>
        </div>

        {/* Active Server */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex flex-row-reverse items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Server</p>
              <p className="text-2xl font-bold mt-1">{getAllDashboardCountsQuery?.data?.activeServer}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <GrServerCluster className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex flex-row-reverse items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold mt-1">${getAllDashboardCountsQuery?.data?.total}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <FaDollarSign className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Pending Tickets */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex flex-row-reverse items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Tickets</p>
              <p className="text-2xl font-bold mt-1">{getAllDashboardCountsQuery?.data?.pendingTickets}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <BiMessageSquare className="w-5 h-5 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <RecentOrdersTable />

      {/* Server Status */}
      {/* <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Server Status</h2>
        <ServerStatusCards />
      </div> */}
    </main>
  );
};

export default DashboardPageComponent;
