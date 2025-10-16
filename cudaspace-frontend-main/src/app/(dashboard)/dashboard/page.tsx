import DashboardPageComponent from '@/components/pages/dashboard/DashboardPageComponent';
import WithAdmin from '@/role-wrappers/WithAdmin';
import React from 'react';

const DashboardPage = () => {
  return (
    <WithAdmin>
      <DashboardPageComponent />
    </WithAdmin>
  );
};

export default DashboardPage;
