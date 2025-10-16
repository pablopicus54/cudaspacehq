import WithAuth from '@/role-wrappers/WithAuth';
import WalletPageComponent from '@/components/pages/user/WalletPageComponent/WalletPageComponent';

const WalletPage = () => {
  return (
    <WithAuth>
      <WalletPageComponent />
    </WithAuth>
  );
};

export default WalletPage;