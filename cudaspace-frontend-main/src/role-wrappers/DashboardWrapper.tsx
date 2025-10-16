 
'use client';

import Loading from '@/components/ui/Loading/Loading';
import { logout, selectCurrentToken } from '@/redux/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { verifyToken } from '@/utils/verifyToken';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

const DashboardWrapper = ({
  redirect,
  children,
}: {
  redirect?: string;
  children: ReactNode;
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true); // Loading state
  const token = useAppSelector(selectCurrentToken); // Check for token
  const user: any | null = token ? verifyToken(token) : null;

  useEffect(() => {
    if (!token) {
      dispatch(logout());
      const redirectQuery = redirect ? `?redirect=${encodeURIComponent(redirect)}` : '';
      router.replace(`/auth/login${redirectQuery}`); // Redirect if not authenticated
    } else {
      setLoading(false); // Stop loading once authenticated
    }
  }, [router, token, dispatch, user, redirect]);

  if (loading) {
    return <Loading />;
  }

  return children; // Render the children if authenticated
};

export default DashboardWrapper;
