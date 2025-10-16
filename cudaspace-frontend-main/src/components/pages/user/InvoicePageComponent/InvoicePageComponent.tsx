'use client';

import { DownloadIcon, MailIcon } from './icons';
import Link from 'next/link';
import { useGetSingleOrderQuery } from '@/redux/features/user-dashboard/user-dashboard.api';

const InvoicePageComponent = ({ id }: { id: string }) => {
  const { data, isLoading, isFetching } = useGetSingleOrderQuery(id);
  const order = data?.data;

  if (isLoading || isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading invoice…</div>
      </div>
    );
  }

  const invoiceUrl = order?.invoiceUrl as string | undefined;

  return (
    <div className="min-h-screen py-4">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Invoice {order?.orderId ? `#${order.orderId}` : ''}</h1>
          <div className="flex space-x-3">
            {invoiceUrl && (
              <Link
                href={invoiceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-green-600 rounded-md hover:bg-green-700 transition-colors"
              >
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download
              </Link>
            )}
            {/* Placeholder for email action */}
            <button className="flex items-center px-4 py-2 bg-purple-600 rounded-md opacity-70 cursor-not-allowed">
              <MailIcon className="h-4 w-4 mr-2" />
              Email
            </button>
          </div>
        </div>

        {!invoiceUrl ? (
          <div className="p-6">
            <div className="text-center text-gray-600">
              Invoice not issued yet for this order.
            </div>
          </div>
        ) : (
          <div className="p-0">
            <iframe
              src={invoiceUrl}
              title={`Invoice ${order?.orderId}`}
              className="w-full h-[80vh]"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoicePageComponent;
