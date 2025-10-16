'use client';
import { useGetAllOrdersQuery, useUpdateStatusMutation } from '@/redux/features/order/orderApi';
import { handleAsyncWithToast } from '@/utils/handleAsyncWithToast';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import ServerOrderModal from './ManageOrders/server-order-modal';


export default function RecentOrdersTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  const openModal = (service: any) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);

 

  const [objectQuery, setObjectQuery] = useState<
    { name: string; value: any }[]
  >([
    { name: 'page', value: page },
    { name: 'limit', value: pageSize },
  ]);

  
  useEffect(() => {
    setObjectQuery([
      { name: 'page', value: page },
      { name: 'limit', value: pageSize },
    ]);
  }, [page, pageSize]);


  const {data : getAllOrdersQuery} =  useGetAllOrdersQuery(objectQuery);
  const [updateStatusMutation] = useUpdateStatusMutation();

    const handleCancel = async (id: string) => {
      const result = await Swal.fire({
        title: 'Are you sure?',
        // text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, Cancel it!',
      });
  
      if (result.isConfirmed) {
        const response = await handleAsyncWithToast(async () => {
          return updateStatusMutation(id);
        });
  
        if (response?.data?.success) {
         setPage(1);
        }
      }
    };


  return (
    <div>
       {/* Server Order Modal */}
            <ServerOrderModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              id={selectedService?.id}
            />
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Recent Order</h2>
        <Link href="/dashboard/manage-orders" className="text-blue-600 text-sm hover:underline">
          See all
        </Link>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Client Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Service Type</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {getAllOrdersQuery?.data?.data?.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order?.orderId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order?.user?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order?.package?.packageType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      {order?.status}
                    </span>
                  </td>
       

                  <td className="px-6 py-4 whitespace-nowrap  text-sm">
                      {order.status === 'Running' ? (
                        <button 
                         onClick={() => handleCancel(order.id)}
                        className="px-4 py-1 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors">
                          Cancel
                        </button>
                      ) : (
                        <button
                          onClick={() => openModal(order)}
                          className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
                        >
                          Manage
                        </button>
                      )}
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
