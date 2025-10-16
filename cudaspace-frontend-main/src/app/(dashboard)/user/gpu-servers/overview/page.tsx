import GPUOverViewAndManagement from '@/components/pages/user/GPUServersPageComponent/OverViewAndManagement/OverViewAndManagement';
import WithAuth from '@/role-wrappers/WithAuth';

const VirtualServerOverViewPage = () => {
  return (
    <WithAuth>
      <GPUOverViewAndManagement />
    </WithAuth>
  );
};

export default VirtualServerOverViewPage;
