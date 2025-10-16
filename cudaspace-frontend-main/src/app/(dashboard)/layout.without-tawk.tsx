import DashboardLayout from '@/components/pages/dashboard/DashboardLayout';
import DashboardWrapper from '@/role-wrappers/DashboardWrapper';

import { ReactNode } from 'react';

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <DashboardWrapper>
      <DashboardLayout>{children}</DashboardLayout>
    </DashboardWrapper>
  );
};

export default layout;
