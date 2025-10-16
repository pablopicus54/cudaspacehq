import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

const MyContainer = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('max-w-[1200px] w-[90%] mx-auto', className)}>
      {children}
    </div>
  );
};

export default MyContainer;
