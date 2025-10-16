'use client';
export const dynamic = 'force-dynamic';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CheckoutPageComponent from '@/components/pages/common/CheckoutPageComponent/CheckoutPageComponent';
import WithAuth from '@/role-wrappers/WithAuth';

const CheckoutPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageId = searchParams.get('packageId');
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (!packageId) {
      router.back();
    }
  }, [packageId, router]);

  return (
    <WithAuth
      redirect={`/checkout?packageId=${packageId ?? ''}${orderId ? `&orderId=${orderId}` : ''}`}
    >
      <CheckoutPageComponent />
    </WithAuth>
  );
};

export default CheckoutPage;
