 
'use client';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { verifyToken } from '@/utils/verifyToken';
import { logout, selectCurrentToken } from '@/redux/features/auth/authSlice';
import Loading from '@/components/ui/Loading/Loading';

const WithAdmin = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true); // Loading state
  const token = useAppSelector(selectCurrentToken); // Check for token
  const user: any | null = token ? verifyToken(token) : null;

  useEffect(() => {
    if (!token) {
      dispatch(logout());
      const redirect = encodeURIComponent(pathname || '/');
      router.replace(`/auth/login?redirect=${redirect}`); // Redirect if not authenticated
    } else if (user && user.role !== 'ADMIN') {
      dispatch(logout());
      const redirect = encodeURIComponent(pathname || '/');
      router.replace(`/auth/login?redirect=${redirect}`);
    } else {
      setLoading(false); // Stop loading once authenticated
    }
  }, [router, token, user, dispatch, pathname]);

  if (loading) {
    return <Loading />;
  }

  return children; // Render the children if authenticated
};

export default WithAdmin;