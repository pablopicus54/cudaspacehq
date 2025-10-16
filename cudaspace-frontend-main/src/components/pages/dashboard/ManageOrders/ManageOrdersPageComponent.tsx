'use client';
import { Check, X } from 'lucide-react';
import ServerOrderModal from '@/components/pages/dashboard/ManageOrders/server-order-modal';
import ExtendTimeModal from '@/components/pages/dashboard/ManageOrders/extend-time-modal';
import { useEffect, useState } from 'react';
import { Input, Pagination } from 'antd';
import {
  useGetAllOrdersQuery,
  useUpdateStatusMutation,
} from '@/redux/features/order/orderApi';
import moment from 'moment';
import { IoClose } from 'react-icons/io5';
import { FaRegWindowClose } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { handleAsyncWithToast } from '@/utils/handleAsyncWithToast';
import { useSearchParams } from 'next/navigation';

// Sample data for invoices

export default function ManageOrdersPageComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExtendOpen, setIsExtendOpen] = useState(false);
  const searchParams = useSearchParams();
  const [selectedService, setSelectedService] = useState<any>(null);
  const [extendOrder, setExtendOrder] = useState<any>(null);
  const id = searchParams.get('id');

  useEffect(() => {
    if (id) {
      setSelectedService({ id });
      setIsModalOpen(true);
    }
  }, [id]);

  const openModal = (service: any) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const openExtendModal = (order: any) => {
    setExtendOrder(order);
    setIsExtendOpen(true);
  };

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);
  const [searchTerm, setSearchTerm] = useState('');

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const [objectQuery, setObjectQuery] = useState<
    { name: string; value: any }[]
  >([
    { name: 'page', value: page },
    { name: 'limit', value: pageSize },
    { name: 'searchTerm', value: searchTerm },
  ]);

  useEffect(() => {
    setObjectQuery([
      { name: 'page', value: page },
      { name: 'limit', value: pageSize },
      { name: 'searchTerm', value: searchTerm },
    ]);
  }, [page, pageSize, searchTerm]);

  const { data: getAllOrdersQuery } = useGetAllOrdersQuery(objectQuery);
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
    <main className="flex-1 overflow-y-auto p-4 ">
      <h1 className="text-2xl font-bold mb-6">Manage Order</h1>
      <div className="mb-4 flex items-center gap-3">
        <Input.Search
          placeholder="Search by invoice ID"
          onSearch={(val) => setSearchTerm(val)}
          allowClear
          enterButton
        />
      </div>
      {/* Server Order Modal */}
      <ServerOrderModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          const params = new URLSearchParams(searchParams.toString());
          params.delete('id');
          const newUrl = `${window.location.pathname}?${params.toString()}`;
          window.history.replaceState(null, '', newUrl);
        }}
        id={selectedService?.id}
      />
      <ExtendTimeModal
        isOpen={isExtendOpen}
        onClose={() => setIsExtendOpen(false)}
        order={extendOrder || {}}
      />
      {/* Invoices */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-blue-600">Invoices</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Invoice ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Client Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Hostname
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Total Price
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Invoice Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Expiration Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Remaining Days
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">New Invoice</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {getAllOrdersQuery?.data?.data?.map(
                (invoice: any, index: number) => (
                  <tr
                    key={invoice?.id ?? invoice?.orderId ?? index}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {invoice.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      {invoice?.user?.name ?? 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      {invoice?.userName ?? 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`${
                          invoice.status === 'Running'
                            ? 'text-green-500'
                            : 'text-orange-500'
                        } font-medium`}
                      >
                        {invoice.status}
                      </span>
                      {(invoice?.invoiceUrl || ['finished','confirmed'].includes(String(invoice?.status))) && (
                        <span className="ml-2 inline-block px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-600">Renewed</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      ${invoice.amount}
                    </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {moment(invoice.createdAt).format('YYYY-MM-DD')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {(() => {
                    const cycle = invoice?.billingCycle;
                    const base = moment(invoice.createdAt);
                    const fallbackExp = cycle === 'YEAR'
                      ? base.clone().add(1, 'year')
                      : cycle === 'QUARTER'
                      ? base.clone().add(3, 'month')
                      : base.clone().add(1, 'month');
                    const dbExp = invoice?.currentPeriodEnd ? moment(invoice.currentPeriodEnd) : null;
                    const exp = dbExp ? moment.max(dbExp, fallbackExp) : fallbackExp;
                    return exp.format('YYYY-MM-DD');
                  })()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {(() => {
                    const cycle = invoice?.billingCycle;
                    const base = moment(invoice.createdAt);
                    const fallbackExp = cycle === 'YEAR'
                      ? base.clone().add(1, 'year')
                      : cycle === 'QUARTER'
                      ? base.clone().add(3, 'month')
                      : base.clone().add(1, 'month');
                    const dbExp = invoice?.currentPeriodEnd ? moment(invoice.currentPeriodEnd) : null;
                    const exp = dbExp ? moment.max(dbExp, fallbackExp) : fallbackExp;
                    const daysLeft = Math.max(exp.diff(moment(), 'days'), 0);
                    return `${daysLeft} days`;
                  })()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {invoice?.invoiceUrl ? (
                    <a
                      href={invoice.invoiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View New Invoice
                    </a>
                  ) : (
                    <span className="text-gray-400">Not issued</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap  text-sm">
                      <div className="flex gap-2">
                        {invoice.status === 'Running' ? (
                          <button
                            onClick={() => handleCancel(invoice.id)}
                            className="px-4 py-1 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors"
                          >
                            Cancel
                          </button>
                        ) : (
                          <button
                            onClick={() => openModal(invoice)}
                            className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
                          >
                            Manage
                          </button>
                        )}
                        <button
                          onClick={() => openExtendModal(invoice)}
                          className="px-3 py-1 bg-amber-600 text-white text-xs font-medium rounded hover:bg-amber-700 transition-colors"
                        >
                          Extend
                        </button>
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
          <div className="flex justify-center my-4">
            <Pagination
              current={page}
              pageSize={pageSize}
              total={getAllOrdersQuery?.data?.meta?.total}
              onChange={handlePaginationChange}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
