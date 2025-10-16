'use client';

import { useEffect, useState } from 'react';
import { CopyIcon, EyeIcon, EyeOffIcon, RefreshIcon, PowerIcon } from './icons';
import { toast } from 'sonner';
import {
  useGetCredentialsQuery,
  useGetServerCurrentStatusQuery,
  useSendRequestToAdminMutation,
} from '@/redux/features/user-dashboard/user-dashboard.api';
import { useGetSingleOrderQuery } from '@/redux/features/user-dashboard/user-dashboard.api';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Loading from '@/components/ui/Loading/Loading';
import { cn } from '@/lib/utils';
import Swal from 'sweetalert2';
import { useSendResetPassNotifyMutation } from '@/redux/features/notification/notification.api';
import { handleAsyncWithToast } from '@/utils/handleAsyncWithToast';
import moment from 'moment';

type ServerInfo = {
  id: string;
  primaryIp: string;
  loginPassword: string;
  accessPort: string;
  loginName: string;
  operatingSystem: string;
  orderId: string;
};

type TTab = 'overview' | 'management';

export default function VSOverViewAndManagement() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab');
  const serverId = searchParams.get('serverId');
  if (!serverId) {
    router.back();
  }
  const [activeTab, setActiveTab] = useState<TTab>(
    initialTab === 'overview' || initialTab === 'management'
      ? (initialTab as TTab)
      : 'overview',
  );
  const [showPassword, setShowPassword] = useState(false);

  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetCredentialsQuery(serverId, { skip: !serverId });
  const server: ServerInfo = response?.data || {};

  const {
    data: responseOfStatus,
    isLoading: isStatusLoading,
    isFetching: isStatusFetching,
  } = useGetServerCurrentStatusQuery(server?.id, {
    skip: !serverId && !server,
  });

  // Fetch order details for billing information
  const { data: singleOrderResp } = useGetSingleOrderQuery(server?.orderId, {
    skip: !server?.orderId,
  });
  const orderDetails = singleOrderResp?.data || {};
  const purchaseDate = orderDetails?.createdAt ? moment(orderDetails.createdAt) : null;
  const periodEnd = orderDetails?.currentPeriodEnd ? moment(orderDetails.currentPeriodEnd) : null;

  // Infer billing cycle when backend doesn't provide it
  const amount: number | undefined = typeof orderDetails?.amount === 'number' ? orderDetails.amount : undefined;
  const pkg = orderDetails?.package || {};
  const priceMatches = (a?: number | null, b?: number | null) => {
    if (a == null || b == null) return false;
    return Math.abs(Number(a) - Number(b)) < 0.01;
  };
  const inferredCycle: string | undefined =
    priceMatches(amount, pkg?.perYearPrice) ? 'YEAR' :
    priceMatches(amount, pkg?.perQuarterPrice) ? 'QUARTER' :
    priceMatches(amount, pkg?.perMonthPrice) ? 'MONTH' : undefined;
  const cycle: string | undefined = orderDetails?.billingCycle || inferredCycle;

  const nextRenewal = periodEnd
    ?? (purchaseDate && cycle
      ? (cycle === 'YEAR'
        ? purchaseDate.clone().add(1, 'year')
        : cycle === 'QUARTER'
          ? purchaseDate.clone().add(3, 'month')
          : purchaseDate.clone().add(1, 'month'))
      : null);
  const daysRemaining = nextRenewal ? Math.max(nextRenewal.diff(moment(), 'days'), 0) : null;
  const cycleLabel = cycle === 'YEAR' ? 'Yearly' : cycle === 'QUARTER' ? 'Quarterly' : cycle === 'MONTH' ? 'Monthly' : cycle || 'N/A';
  const addedDays = cycle === 'YEAR' ? 365 : cycle === 'QUARTER' ? 90 : cycle === 'MONTH' ? 30 : null;

  const [sendResetPassReq] = useSendResetPassNotifyMutation();

  const handleResetPasswordRequest = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Send Request!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await handleAsyncWithToast(async () => {
          return sendResetPassReq({ orderId: server?.orderId });
        });
        if (res?.data?.success) {
          Swal.fire({
            title: 'Sent!',
            text: 'Your request has been sent.',
            icon: 'success',
          });
        }
      }
    });
  };

  // Sync tab state with URL params
  const handleTabChange = (tab: TTab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', tab);
    if (serverId) params.set('serverId', serverId);
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}?${params.toString()}`,
    );
  };

  // Keep activeTab in sync with URL changes (e.g., browser navigation)
  // This effect ensures UI updates if the user navigates via browser controls
  // and the tab param changes.
   
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'overview' || tabParam === 'management') {
      setActiveTab(tabParam as TTab);
    }
     
  }, [searchParams]);

  if (isLoading || isFetching || isStatusLoading || isStatusFetching) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen py-6 px-3">
      <h1 className="text-2xl font-semibold text-text-primary mb-6">
        Virtual Servers
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-48 shrink-0">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <button
              className={`w-full text-left px-6 py-4 ${
                activeTab === 'overview'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => handleTabChange('overview')}
            >
              Overview
            </button>
            <button
              className={`w-full text-left px-6 py-4 ${
                activeTab === 'management'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => handleTabChange('management')}
            >
              Server Management
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {activeTab === 'overview' ? (
              <OverviewTab
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                server={server}
              />
            ) : (
              <ManagementTab statusData={responseOfStatus?.data} />
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 border-t pt-6">
        <h3 className="text-md font-medium text-text-primary mb-2">Billing & Renewal</h3>
        <p className="text-gray-600 mb-4">Manage your service renewal and add funds to your account wallet.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm text-gray-500">Billing Cycle</div>
            <div className="font-medium text-text-primary">{cycleLabel}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Purchase Date</div>
            <div className="font-medium text-text-primary">{purchaseDate ? purchaseDate.format('YYYY-MM-DD') : 'N/A'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Next Renewal</div>
            <div className="font-medium text-text-primary">
              {nextRenewal ? nextRenewal.format('YYYY-MM-DD') : 'N/A'}
              {typeof daysRemaining === 'number' ? ` (${daysRemaining} days left)` : ''}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Added Days</div>
            <div className="font-medium text-text-primary">{typeof addedDays === 'number' ? `${addedDays} days` : 'N/A'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">New Invoice</div>
            <div className="font-medium text-text-primary">
              {orderDetails?.invoiceUrl ? (
                <a href={orderDetails.invoiceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View New Invoice</a>
              ) : (
                <span className="text-gray-400">Not issued</span>
              )}
            </div>
          </div>
        </div>
        <Link
          href={`/checkout?packageId=${orderDetails?.package?.id}&orderId=${orderDetails?.orderId}`}
          className="inline-flex items-center px-4 py-2 rounded-md bg-blue-primary text-white hover:bg-blue-600"
        >
          Renew
        </Link>
      </div>
    </div>
  );
}

type OverviewTabProps = {
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  server: ServerInfo;
};

function OverviewTab({
  showPassword,
  setShowPassword,
  server,
}: OverviewTabProps) {
  const [sendRequestToAdmin] = useSendRequestToAdminMutation();
  const sendRequest = async (action: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Send Request!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await handleAsyncWithToast(async () => {
          return sendRequestToAdmin({ orderId: server?.orderId, action });
        });
        if (res?.data?.success) {
          Swal.fire({
            title: 'Sent!',
            text: 'Your request has been sent.',
            icon: 'success',
          });
        }
      }
    });
  };
  return (
    <div>
      <h2 className="text-lg font-medium text-blue-700 mb-6">
        Server Connection Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary IP
          </label>
          <div className="relative">
            <input
              type="text"
              value={server?.primaryIp}
              readOnly
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 focus:outline-0"
            />
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => {
                navigator.clipboard.writeText(server?.primaryIp);
                toast.success('Copied to clipboard');
              }}
            >
              <CopyIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Access Port
          </label>
          <input
            type="text"
            value={server?.accessPort}
            readOnly
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 focus:outline-0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            type="text"
            value={server?.loginName}
            readOnly
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 focus:outline-0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Login Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={server?.loginPassword}
              readOnly
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 focus:outline-0"
            />
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          <div className="mt-1">
            <button
              onClick={() => sendRequest('resetPass')}
              className="text-red-500 text-sm hover:underline"
            >
              Reset Password request
            </button>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Operating System
          </label>
          <input
            type="text"
            value={server?.operatingSystem}
            readOnly
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 focus:outline-0"
          />
        </div>
      </div>
    </div>
  );
}

type ManagementTabProps = {
  statusData: {
    id: string;
    package: {
      serviceName: string;
    };
    status: string;
  };
};

function ManagementTab({ statusData }: ManagementTabProps) {
  const [sendRequestToAdmin] = useSendRequestToAdminMutation();

  const sendRequest = async (action: string) => {
    const res = await handleAsyncWithToast(async () => {
      return sendRequestToAdmin({ orderId: statusData?.id, action });
    });

    if (res?.data?.success) {
      toast.success(res?.data?.message);
    } else {
      toast.error(res?.data?.message);
    }
  };
  return (
    <div>
      <h2 className="text-lg font-medium text-blue-700 mb-6">Server Control</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                Server Name
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                Status
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-3 px-4 text-gray-700">
                {statusData?.package?.serviceName}
              </td>
              <td className="py-3 px-4">
                <span
                  className={cn('text-gray-500 font-medium', {
                    'text-green-500': statusData?.status === 'active',
                  })}
                >
                  {statusData?.status}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex space-x-2">
                  <button
                    disabled={statusData?.status === 'Running'}
                    onClick={() => sendRequest('restart')}
                    className="p-2 disabled:cursor-not-allowed disabled:text-green-300 bg-gray-100 rounded-md text-green-500 hover:bg-gray-200"
                  >
                    <RefreshIcon className="h-5 w-5" />
                  </button>
                  <button
                    disabled={statusData?.status === 'Stopped'}
                    onClick={() => sendRequest('stop')}
                    className="p-2 disabled:cursor-not-allowed disabled:text-red-300 bg-gray-100 rounded-md text-red-500 hover:bg-gray-200"
                  >
                    <PowerIcon className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
