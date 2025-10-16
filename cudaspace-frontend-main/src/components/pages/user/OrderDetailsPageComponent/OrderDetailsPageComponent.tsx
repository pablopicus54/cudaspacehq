'use client';
import Loading from '@/components/ui/Loading/Loading';
import {
  useGetSingleOrderQuery,
  useUpdateOrderHostnameMutation,
} from '@/redux/features/user-dashboard/user-dashboard.api';
import React, { useEffect, useState } from 'react';
import { handleAsyncWithToast } from '@/utils/handleAsyncWithToast';

const OrderDetailsPageComponent = ({ id }: { id: string }) => {
  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetSingleOrderQuery(id, { skip: !id });

  const [updateOrderHostname] = useUpdateOrderHostnameMutation();

  const orderData = response?.data;

  const [hostName, setHostName] = useState('');

  useEffect(() => {
    if (orderData?.userName) {
      setHostName(orderData.userName);
    }
  }, [orderData?.userName]);

  if (isLoading || isFetching) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen w-full py-6 px-3">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Order Details
      </h1>
      <div className="bg-white rounded-lg">
        <div className="max-w-4xl p-3 md:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-800">
              {orderData?.serviceName}
            </h2>
            <p className="text-sm text-gray-500">
              {orderData?.package?.packageType}
            </p>
          </div>
          <div className="rounded-lg shadow-sm p-3 md:p-6 mb-6 border border-gray-300">
            <div className="mb-6">
              <h3 className="text-xl font-medium text-gray-700 mb-3">
                Plan Basis
              </h3>

              <div className="border rounded-md border-gray-200">
                {orderData?.package?.serviceDetails?.map((s: string) => (
                  <div
                    key={s}
                    className="grid grid-cols-2 ps-3 py-3 border-b border-gray-200"
                  >
                    <div className="text-gray-800">{s}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Server Name <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  placeholder="Enter hostname"
                  className="w-full bg-gray-100 p-3 rounded-md border border-gray-200"
                />
                <button
                  className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-60"
                  disabled={!hostName?.trim() || !orderData?.id}
                  onClick={async () => {
                    await handleAsyncWithToast(
                      () =>
                        updateOrderHostname({
                          orderId: orderData?.id,
                          userName: hostName.trim(),
                        }) as any,
                      'Updating hostname…',
                      'Hostname updated',
                      'Failed to update hostname',
                    );
                    await refetch();
                  }}
                >
                  Save
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                This is the hostname you provided during order. You can edit it.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-center text-primary mb-4">
              Order Summary
            </h3>
            <div className="space-y-2 divide-y divide-gray-200">
              <div className="grid grid-cols-2 py-2">
                <div className="text-gray-600">Product</div>
                <div className="text-gray-800">
                  {orderData?.package?.serviceName}
                </div>
              </div>
              <div className="grid grid-cols-2 py-2">
                <div className="text-gray-600">Order ID</div>
                <div className="text-gray-800">{orderData?.orderId}</div>
              </div>
              <div className="grid grid-cols-2 py-2">
                <div className="text-gray-600">Status</div>
                <div className="text-gray-800">{orderData?.status}</div>
              </div>
              <div className="grid grid-cols-2 py-2">
                <div className="text-gray-600">Billing Cycle</div>
                <div className="text-gray-800">Monthly</div>
              </div>
              <div className="grid grid-cols-2 py-2">
                <div className="text-gray-600">Monthly Price</div>
                <div className="text-gray-800">
                  ${orderData?.package?.perMonthPrice ?? orderData?.amount}
                </div>
              </div>
              <div className="grid grid-cols-2 py-2">
                <div className="text-gray-600">Plan setup Fee</div>
                <div className="text-gray-800">$0.00</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPageComponent;
