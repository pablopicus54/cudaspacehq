'use client';

import { useEffect } from 'react';

const TawkWrapper = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Avoid injecting multiple times
    if (document.getElementById('tawk-script')) return;

    // Initialize Tawk globals
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).Tawk_API = (window as any).Tawk_API || {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).Tawk_LoadStart = new Date();

    const s1 = document.createElement('script');
    s1.id = 'tawk-script';
    s1.async = true;
    s1.src = 'https://embed.tawk.to/68f06071965b721956897ea0/1j7lfhf5j';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');

    const s0 = document.getElementsByTagName('script')[0];
    s0?.parentNode?.insertBefore(s1, s0);
  }, []);

  return null;
};

export default TawkWrapper;