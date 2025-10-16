import { ReactNode } from 'react';

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative">
      <div className="">{children}</div>
    </div>
  );
};

export default layout;
