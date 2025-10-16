import UserDashboardPageComponent from '@/components/pages/user/UserDashboardPageComponent/UserDashboardPageComponent';
import WithAuth from '@/role-wrappers/WithAuth';
import React from 'react';

const UserDashboardPage = () => {
  return (
    <WithAuth>
      <UserDashboardPageComponent />
    </WithAuth>
  );
};

export default UserDashboardPage;
