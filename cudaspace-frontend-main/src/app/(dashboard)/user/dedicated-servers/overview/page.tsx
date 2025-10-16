import DedicatedOverViewAndManagement from '@/components/pages/user/DedicatedServersPageComponent/OverViewAndManagement/OverViewAndManagement';
import WithAuth from '@/role-wrappers/WithAuth';
import React from 'react';

const DedicatedServerOverViewPage = () => {
  return (
    <WithAuth>
      <DedicatedOverViewAndManagement />
    </WithAuth>
  );
};

export default DedicatedServerOverViewPage;
