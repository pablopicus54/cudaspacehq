import DedicatedServersPageComponent from '@/components/pages/user/DedicatedServersPageComponent/DedicatedServersPageComponent';
import WithAuth from '@/role-wrappers/WithAuth';
import React from 'react';

const DedicatedServersPage = () => {
  return (
    <WithAuth>
      <DedicatedServersPageComponent />
    </WithAuth>
  );
};

export default DedicatedServersPage;
