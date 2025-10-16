'use client';
import { DataTable } from '@/components/ui/DataTable/DataTable';
import Loading from '@/components/ui/Loading/Loading';
import { cn } from '@/lib/utils';
import { useGetPurchasedServersForCurrentUserQuery } from '@/redux/features/user-dashboard/user-dashboard.api';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

// Define the type for our data
type GPUServer = {
  id: string;
  name: string;
  hostName?: string;
  orderId: string;
  price: string;
  status: string;
};

const GPUServersPageComponent = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [objectQuery, setObjectQuery] = useState<
    { name: string; value: string | number }[]
  >([
    { name: 'page', value: page },
    { name: 'limit', value: pageSize },
    { name: 'packageType', value: 'GPU_HOSTING' },
  ]);

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetPurchasedServersForCurrentUserQuery(objectQuery);

  const servers = response?.data?.data || [];

  const formattedServers: GPUServer[] = servers.map(
    (server: any, index: number) => ({
      id: server?.id, // or use server.id if needed
      name: server.package?.serviceName || 'Unknown Package',
      hostName: server.PackageCredentials?.loginName || 'Not Given',
      orderId: `#${server.orderId || 'N/A'}`,
      price: `$${server?.amount || 0}`,
      status: server?.status,
    }),
  );
  // Define columns for the table
  const columns = [
    { header: 'Name', accessor: (server: GPUServer) => server.name },
    { header: 'Hostname', accessor: (server: GPUServer) => server.hostName },
    {
      header: 'Order ID',
      accessor: (server: GPUServer) => (
        <a
          href={`/user/billing/${server.id}`}
          className="text-blue-600 hover:underline"
        >
          {server.orderId}
        </a>
      ),
    },
    { header: 'Price', accessor: (server: GPUServer) => server.price },
    {
      header: 'Status',
      accessor: (server: GPUServer) => (
        <p
          className={cn('text-yellow-600', {
            'text-primary': server?.status === 'Running',
          })}
        >
          {server.status}
        </p>
      ),
    },
  ];

  // Handle row click
  const handleRowClick = (server: GPUServer) => {
    console.log('Row clicked:', server);
  };

  // Render actions menu
  const renderActions = (server: GPUServer, closeMenu: () => void) => {
    return (
      <>
        <button
          title={
            server?.status === 'Pending'
              ? 'You can view credentials whenever the order is accepted.'
              : ''
          }
          disabled={server?.status === 'Pending'}
          onClick={() => {
            // console.log('Overview clicked for:', server);
            router.push(
              `/user/gpu-servers/overview?serverId=${server?.id}`,
            );
            closeMenu();
          }}
          className="block disabled:cursor-not-allowed w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Overview
        </button>
        {/* <button
              onClick={() => {
                console.log('Restart clicked for:', server);
                closeMenu();
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Restart
            </button>
            <button
              onClick={() => {
                console.log('Delete clicked for:', server);
                closeMenu();
              }}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Delete
            </button> */}
      </>
    );
  };

  if (isLoading || isFetching) {
    return <Loading />;
  }

  return (
    <div className="py-6 px-3">
      <DataTable
        title="GPU Servers"
        navigateInfo={{
          btnLabel: 'Purchase new server',
          btnHref: '/pricing/gpu-hosting',
        }}
        data={formattedServers}
        columns={columns}
        keyField="id"
        onRowClick={handleRowClick}
        renderActions={renderActions}
      />
    </div>
  );
};

export default GPUServersPageComponent;
