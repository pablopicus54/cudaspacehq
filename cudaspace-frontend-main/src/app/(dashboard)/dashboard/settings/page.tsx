import UserSettingsPageComponent from '@/components/pages/user/UserSettingsPageComponent/UserSettingsPageComponent';
import AdminStripeSettings from '@/components/pages/admin/AdminStripeSettings/AdminStripeSettings';
import WithAdmin from '@/role-wrappers/WithAdmin';

const SettingsPage = () => {
  return (
    <WithAdmin>
      <AdminStripeSettings />
      <UserSettingsPageComponent />
    </WithAdmin>
  );
};

export default SettingsPage;
