
import VSOverViewAndManagement from '@/components/pages/user/VirtualServersPageComponent/OverViewAndManagement/OverViewAndManagement';
import WithAuth from '@/role-wrappers/WithAuth';
import React from 'react';

const VirtualServerOverViewPage = () => {
  return (
    <WithAuth>
      <VSOverViewAndManagement />
    </WithAuth>
  );
};

export default VirtualServerOverViewPage;
