import GPUServersPageComponent from '@/components/pages/user/GPUServersPageComponent/GPUServersPageComponent';
import WithAuth from '@/role-wrappers/WithAuth';
import React from 'react';

const GPUServersPage = () => {
  return (
    <WithAuth>
      <GPUServersPageComponent />
    </WithAuth>
  );
};

export default GPUServersPage;
