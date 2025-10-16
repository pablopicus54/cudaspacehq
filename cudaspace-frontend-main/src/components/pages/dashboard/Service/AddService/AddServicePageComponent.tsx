'use client';
import { useRouter } from 'next/navigation';
import AddServiceForm from './add-service-form';
import { useCreateServiceMutation } from '@/redux/features/services/servicesApi';
import { handleAsyncWithToast } from '@/utils/handleAsyncWithToast';

export default function AddServicePageComponent() {
  const [createServiceMutation] = useCreateServiceMutation();
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    console.log('values', values);
 
  const data = {
      packageType: values.packageType,
      serviceName: values.serviceName,
      promotianal: values.promotional,
      perMonthPrice: Number(values.perMonthPrice),
      perYearPrice: Number(values.perYearPrice),
      perQuarterPrice: Number(values.perQuarterPrice),
      serviceDetails: values.serviceDetails,
      serviceType: values.serviceType,
      vpsType : values.vpsType,
      serverType : values.serverType,
      packageStatus: values.packageStatus,
    };

  
    
    const formData = new FormData();
    formData.append('package', values.uploadMainImage[0].originFileObj);
    formData.append('data', JSON.stringify(data));


    const response = await handleAsyncWithToast(async () => {
      
      return createServiceMutation(formData);
    });

    if (response?.data?.success) {
      router.push('/dashboard/service');
    }

   
    // router.push("/published-services");
  };

  const handleCancel = () => {
    router.push('/dashboard/service');
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
      <AddServiceForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </main>
  );
}
