import UserManagementPageComponent from '@/components/pages/dashboard/UserManagement/UserManagementPageComponent';
import WithAdmin from '@/role-wrappers/WithAdmin';

const UserManagementPage = () => {
  return (
    <WithAdmin>
      <UserManagementPageComponent />
    </WithAdmin>
  );
};

export default UserManagementPage;
