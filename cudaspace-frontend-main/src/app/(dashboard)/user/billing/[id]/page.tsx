import OrderDetailsPageComponent from '@/components/pages/user/OrderDetailsPageComponent/OrderDetailsPageComponent';
import WithAuth from '@/role-wrappers/WithAuth';
import React from 'react';

const OrderDetailsPage = ({ params }: any) => {
  const { id } = params;
  return (
    <WithAuth>
      <OrderDetailsPageComponent id={id} />
    </WithAuth>
  );
};

export default OrderDetailsPage;
