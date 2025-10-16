 
'use client';

import Loading from '@/components/ui/Loading/Loading';
import { logout, selectCurrentToken } from '@/redux/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { verifyToken } from '@/utils/verifyToken';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

const WithAuth = ({ children, redirect }: { children: ReactNode; redirect?: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true); // Loading state
  const token = useAppSelector(selectCurrentToken); // Check for token
  const user: any | null = token ? verifyToken(token) : null;

  useEffect(() => {
    const redirectTarget = redirect || pathname || '/';
    const encodedRedirect = encodeURIComponent(redirectTarget);

    if (!token) {
      dispatch(logout());
      router.replace(`/auth/login?redirect=${encodedRedirect}`); // Redirect if not authenticated
    } else if (user && user.role === 'ADMIN') {
      dispatch(logout());
      router.replace(`/auth/login?redirect=${encodedRedirect}`);
    } else {
      setLoading(false); // Stop loading once authenticated
    }
  }, [router, token, dispatch, user, pathname, redirect]);

  if (loading) {
    return <Loading />;
  }

  return children; // Render the children if authenticated
};

export default WithAuth;
