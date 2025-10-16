'use client';
import TableLoading from '@/components/shared/TableLoading/TableLoading';
import {
  useGetAllUserQuery,
  useUpdateUserStatusMutation,
} from '@/redux/features/user/userApi';
import { handleAsyncWithToast } from '@/utils/handleAsyncWithToast';
import { Button, Pagination } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const UserManagementPageComponent = () => {
  const router = useRouter();
  const [updateUserStatusMutation] = useUpdateUserStatusMutation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
  } = useGetAllUserQuery(objectQuery);

  useEffect(() => {
    setObjectQuery([
      { name: 'page', value: page },
      { name: 'limit', value: pageSize },
    ]);
  }, [page, pageSize]);

  const handleStatusChange = async (id: string, status: string) => {
    await handleAsyncWithToast(async () => {
      return updateUserStatusMutation({ id, formData: { userStatus: status } });
    });
  };

  if (isLoading || isFetching) {
    return <TableLoading />;
  }

  return (
    <main className="flex-1 overflow-hidden overflow-x-auto p-4 ">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      {/* Clients List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-text-primary">
            Clients List
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  User ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Services
                </th>
                {/* <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Billing
                </th> */}
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Account Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {response?.data?.data?.map((client: any) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td
                    onClick={() =>
                      router.push(
                        `/dashboard/user-management/user-service/${client.id}`,
                      )
                    }
                    className="hover:cursor-pointer px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600"
                  >
                    {client.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                    {client.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.services}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`${
                        client.billing === "Paid"
                          ? "text-green-500"
                          : "text-orange-500"
                      } font-medium`}
                    >
                      {client.billing}
                    </span>
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        client.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {client.status === 'ACTIVE' ? (
                        <Button
                          onClick={() =>
                            handleStatusChange(client.id, 'INACTIVE')
                          }
                          className="p-1 px-3 rounded border border-red-200 text-red-600 hover:bg-blue-50 transition-colors"
                          aria-label="Edit"
                        >
                          Block
                        </Button>
                      ) : (
                        <Button
                          onClick={() =>
                            handleStatusChange(client.id, 'ACTIVE')
                          }
                          className="p-1 px-3 rounded border border-green-200 text-green-600 hover:bg-blue-50 transition-colors"
                          aria-label="Edit"
                        >
                          Unblock
                        </Button>
                      )}
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

export default UserManagementPageComponent;
