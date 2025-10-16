'use client';
import Loading from '@/components/ui/Loading/Loading';
import {
  useGetAllPurchasedServersForCurrentUserQuery,
  useGetPurchasedServersForCurrentUserQuery,
} from '@/redux/features/user-dashboard/user-dashboard.api';
import { ServiceAccordion } from './ServiceAccordion/ServiceAccordion';

const MyServicesPageComponent = () => {
  const {
    data: response,
    isLoading,
    isFetching,
  } = useGetAllPurchasedServersForCurrentUserQuery(undefined);

  const myPurchasedServices =
    response?.data?.map((item: any) => ({
      id: item?.package?.id,
      packageType: item?.package?.packageType,
      serviceName: item?.package?.serviceName,
      perMonthPrice: item?.package?.perMonthPrice,
      serviceDetails: item?.package?.serviceDetails,
      promotianal: item?.package?.promotianal,
      vpsType: item?.package?.vpsType,
      serverType: item?.package?.serverType,
      packageImage: item?.package?.packageImage,
      stripePriceId: item?.package?.stripePriceId,
      productId: item?.package?.productId,
      totalSales: item?.package?.totalSales,
      totalReveneue: item?.package?.totalReveneue,
      packageStatus: item?.package?.packageStatus,
      createdAt: item?.package?.createdAt,
      updatedAt: item?.package?.updatedAt,
    })) || [];
  if (isLoading || isFetching) {
    return <Loading />;
  }
  return (
    <div className="min-h-screen py-6 px-3">
      <h1 className="text-2xl font-semibold text-text-primary mb-6">
        My Services
      </h1>
      <ServiceAccordion items={myPurchasedServices} />
    </div>
  );
};

export default MyServicesPageComponent;
