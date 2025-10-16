
import UserSettingsPageComponent from '@/components/pages/user/UserSettingsPageComponent/UserSettingsPageComponent';
import WithAuth from '@/role-wrappers/WithAuth';
import React from 'react';

const SettingsPage = () => {
  return (
    <WithAuth>
      <UserSettingsPageComponent />
    </WithAuth>
  );
};

export default SettingsPage;
