'use client';
import TableLoading from '@/components/shared/TableLoading/TableLoading';
import { cn } from '@/lib/utils';
import { useDeleteServiceMutation, useGetAllServicesQuery } from '@/redux/features/services/servicesApi';
import { formatName } from '@/utils/formatName';
import { handleAsyncWithToast } from '@/utils/handleAsyncWithToast';
import { Button, Pagination } from 'antd';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const ServicePageComponent = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
const [deleteServiceMutation] = useDeleteServiceMutation();
  const handlePaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const [objectQuery, setObjectQuery] = useState<
    { name: string; value: any }[]
  >([
    { name: 'page', value: page },
    { name: 'limit', value: pageSize },
  ]);

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetAllServicesQuery(objectQuery);

  useEffect(() => {
    setObjectQuery([
      { name: 'page', value: page },
      { name: 'limit', value: pageSize },
    ]);
  }, [page, pageSize]);


  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      const response = await handleAsyncWithToast(async () => {
        return deleteServiceMutation(id);
      });

      if (response?.data?.success) {
       setPage(1);
      }
    }
  };


  if (isLoading || isFetching) {
    return <TableLoading />;
  }
  return (
    <main className="flex-1 overflow-y-auto p-4 ">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Published Services</h1>
        <Link href={'/dashboard/service/add-service'}>
          <Button
            type="primary"
            icon={<PlusCircle size={16} />}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add Service
          </Button>
        </Link>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Package Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Total Sale
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Total Revenue
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {response?.data?.data?.map((service: any) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {service?.serviceName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatName(service?.packageType)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn('px-2 py-1 text-xs font-medium rounded-full  ',
                      service?.packageStatus === 'PUBLISHED'
                        ? 'text-green-800 bg-green-100'
                        : 'text-orange-800 bg-red-100',
                    )}>
                      {service?.packageStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                    {service.totalSales}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                    {service.totalReveneue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                <div className="flex gap-2">
                <button className="text-white bg-blue-primary rounded-md px-3 py-1">
                    <Link
                      href={`/dashboard/service/update/${service.id}`}
                      className=""
                    >
                      Edit
                    </Link>
                  </button>
                  {/* <button
                    onClick={() => handleDelete(service.id)}
                  className="text-white bg-red-500 rounded-md px-3 py-1">
                   
                      Delete
                
                  </button> */}
                </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center my-4">
            <Pagination
              current={page}
              pageSize={pageSize}
              total={response?.data?.meta?.total}
              onChange={handlePaginationChange}
              // showSizeChanger
              // pageSizeOptions={[5, 10, 20, 50]}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ServicePageComponent;
