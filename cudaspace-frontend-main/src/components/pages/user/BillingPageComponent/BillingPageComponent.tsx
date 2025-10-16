'use client';
import { DataTable } from '@/components/ui/DataTable/DataTable';
import Loading from '@/components/ui/Loading/Loading';
import { useGetAllOrderQuery } from '@/redux/features/user-dashboard/user-dashboard.api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

// Define the type for our data
type Order = {
  id: string | number;
  orderId: string;
  status: string;
  total: string;
  orderDate: string;
  invoiceUrl?: string;
  action: string[];
};

const BillingPageComponent = () => {
  const router = useRouter();
  // Define columns for the table
  const columns = [
    { header: 'Order ID', accessor: (order: Order) => order.orderId },
    { header: 'Status', accessor: (order: Order) => order.status },
    { header: 'Total', accessor: (order: Order) => order.total },
    { header: 'Order Date', accessor: (order: Order) => order.orderDate },
  ];

  // Handle row click
  const handleRowClick = (order: Order) => {
    console.log('Row clicked:', order);
  };

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetAllOrderQuery(undefined);

  const orders =
    response?.data?.data?.map((order: any, index: number) => ({
      id: order?.id,
      orderId: `#${order?.orderId}`,
      status: order?.status === 'Running' ? 'Paid' : order?.status,
      total: `$${order?.amount}`,
      orderDate: order?.createdAt.split('T')[0],
      invoiceUrl: order?.invoiceUrl,
      action: ['Details', 'Invoice'],
    })) || [];

  // Render actions menu
  const renderActions = (order: Order, closeMenu: () => void) => {
    return (
      <>
        <button
          onClick={() => {
            router.push(`/user/billing/${order?.id}`);
            closeMenu();
          }}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Details
        </button>
        {order?.invoiceUrl ? (
          <button
            onClick={() => {
              router.push(`/user/billing/invoice/${order?.id}`);
              closeMenu();
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            New Invoice
          </button>
        ) : (
          <button
            disabled
            className="block w-full text-left px-4 py-2 text-sm text-gray-400 cursor-not-allowed"
          >
            New Invoice (Not issued)
          </button>
        )}
      </>
    );
  };

  if (isLoading || isFetching) {
    return <Loading />;
  }

  return (
    <div className="py-6 px-3">
      <DataTable
        title="Orders"
        data={orders}
        columns={columns}
        keyField="id"
        onRowClick={handleRowClick}
        renderActions={renderActions}
      />
    </div>
  );
};

export default BillingPageComponent;
