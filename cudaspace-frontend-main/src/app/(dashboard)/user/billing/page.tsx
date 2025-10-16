import BillingPageComponent from '@/components/pages/user/BillingPageComponent/BillingPageComponent';
import WithAuth from '@/role-wrappers/WithAuth';
import React from 'react';

const BillingPage = () => {
  return (
    <WithAuth>
      <BillingPageComponent />
    </WithAuth>
  );
};

export default BillingPage;
