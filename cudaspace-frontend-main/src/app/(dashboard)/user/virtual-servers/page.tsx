import VirtualServersPageComponent from '@/components/pages/user/VirtualServersPageComponent/VirtualServersPageComponent';
import WithAuth from '@/role-wrappers/WithAuth';
import React from 'react';

const VirtualServersPage = () => {
  return (
    <WithAuth>
      <VirtualServersPageComponent />
    </WithAuth>
  );
};

export default VirtualServersPage;
