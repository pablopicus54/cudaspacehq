'use client';
import { DataTable } from '@/components/ui/DataTable/DataTable';
import Loading from '@/components/ui/Loading/Loading';
import {
  useConfirmRestartOrStopMutation,
  useGetAllPendingTaskQuery,
} from '@/redux/features/dashboard/dashboardApi';
import { handleAsyncWithToast } from '@/utils/handleAsyncWithToast';
import { Pagination } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

// Type definition for each issue/task
type Issue = {
  id: string;
  issueType: 'stop' | 'restart' | 'resetPass';
  link: string;
  packageName: string;
  primaryIp: string;
  loginPassword: string;
  loginName: string;
  isResolved: boolean;
  userId: string;
};

const PendingTaskPageComponent = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const router = useRouter();
  const [confirmRestartOrStop] = useConfirmRestartOrStopMutation();

  const [objectQuery, setObjectQuery] = useState<
    { name: string; value: string | number }[]
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

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetAllPendingTaskQuery(objectQuery);

  const issueData: Issue[] = response?.data?.data || [];

  // Define table columns for the Issue data
  const columns = [
    {
      header: 'Issue Type',
      accessor: (issue: Issue) => issue?.issueType?.toUpperCase(),
    },
    // {
    //   header: 'Link',
    //   accessor: (issue: Issue) => (
    //     <a
    //       href={issue.link}
    //       target="_blank"
    //       rel="noopener noreferrer"
    //       className="text-blue-600 hover:underline"
    //     >
    //       View
    //     </a>
    //   ),
    // },
    {
      header: 'Package Name',
      accessor: (issue: Issue) => issue.packageName,
    },
    {
      header: 'Primary IP',
      accessor: (issue: Issue) => issue.primaryIp || 'Not Given',
    },
    {
      header: 'Username',
      accessor: (issue: Issue) => issue.loginName || 'Not Given',
    },
    {
      header: 'Login Password',
      accessor: (issue: Issue) => issue.loginPassword || 'Not Given',
    },
  ];

  // Render actions menu
  const renderActions = (issue: Issue, closeMenu: () => void) => {
    return (
      <>
        {issue?.issueType === 'stop' || issue?.issueType === 'restart' ? (
          <button
            title={
              issue?.issueType === 'stop' || issue?.issueType === 'restart'
                ? 'If you did it manually then mark it confirmed'
                : ''
            }
            disabled={issue?.issueType !== 'stop'}
            onClick={async () => {
              await handleAsyncWithToast(async () => {
                return confirmRestartOrStop(issue?.id);
              });
              closeMenu();
            }}
            className="block disabled:cursor-not-allowed w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Confirm
          </button>
        ) : (
          ''
        )}
        {issue?.issueType === 'resetPass' ? (
          <button
            title={
              issue?.issueType === 'resetPass'
                ? 'You can reset password from here!'
                : ''
            }
            onClick={() => {
              router.push(issue?.link);
              closeMenu();
            }}
            className="block disabled:cursor-not-allowed w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Manage
          </button>
        ) : (
          ''
        )}
      </>
    );
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleRowClick = (issue: Issue) => {
    console.log('Row clicked:', issue);
  };

  if (isLoading || isFetching) {
    return <Loading />;
  }

  return (
    <div className="py-6 px-3">
      <DataTable<Issue>
        title="Pending Tasks"
        data={issueData}
        columns={columns}
        renderActions={renderActions}
        keyField="id"
        onRowClick={handleRowClick}
      />
      <div className="p-4 w-full flex justify-center items-center mt-6">
        <Pagination
          current={page}
          pageSize={pageSize}
          total={response?.data?.meta?.total}
          onChange={handlePaginationChange}
          className="custom-pagination"
        />
      </div>
    </div>
  );
};

export default PendingTaskPageComponent;
