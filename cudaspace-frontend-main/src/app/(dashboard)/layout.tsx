import DashboardLayout from '@/components/pages/dashboard/DashboardLayout';
import DashboardWrapper from '@/role-wrappers/DashboardWrapper';
import TawkWrapper from '@/components/shared/TawkWrapper/TawkWrapper';

import { ReactNode } from 'react';

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <DashboardWrapper>
      <DashboardLayout>{children}</DashboardLayout>
      <TawkWrapper />
    </DashboardWrapper>
  );
};

export default layout;