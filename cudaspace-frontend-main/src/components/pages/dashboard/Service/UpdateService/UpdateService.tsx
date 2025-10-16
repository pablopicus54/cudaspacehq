'use client';
import { useParams, useRouter } from 'next/navigation';
import {
  useCreateServiceMutation,
  useGetSingleServiceQuery,
  useUpdateServiceMutation,
} from '@/redux/features/services/servicesApi';
import { handleAsyncWithToast } from '@/utils/handleAsyncWithToast';
import AddServiceForm from '../AddService/add-service-form';

export default function UpdateService() {
  const serviceId = useParams().serviceId;
  const { data, isLoading } = useGetSingleServiceQuery(serviceId, {
    skip: !serviceId,
  });

  const [updateServiceMutation] = useUpdateServiceMutation();
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    const data = {
      packageType: values.packageType,
      serviceName: values.serviceName,
      promotianal: values.promotional,
      perMonthPrice: Number(values.perMonthPrice),
      perYearPrice: Number(values.perYearPrice),
      perQuarterPrice: Number(values.perQuarterPrice),
      serviceDetails: values.serviceDetails,
      serviceType: values.serviceType,
      vpsType: values.vpsType,
      serverType: values.serverType,
      packageStatus: values.packageStatus,
    };

    const formData = new FormData();
    formData.append('package', values.uploadMainImage[0].originFileObj);
    formData.append('data', JSON.stringify(data));

    const response = await handleAsyncWithToast(async () => {
      return updateServiceMutation({ formData, id: serviceId });
    });

    if (response?.data?.success) {
      router.push('/dashboard/service');
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/service');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
      <AddServiceForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        defaultValue={data?.data}
      />
    </main>
  );
}
