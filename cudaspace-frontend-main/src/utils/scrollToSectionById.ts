'use client';

import { useRouter } from 'next/navigation';

// for single page navigation
// use:
// const handleScrollToSubscription = () => {
//   scrollToSection("sales-benefits");
// };

export const scrollToSection = (sectionId: string) => {
  if (typeof window === 'undefined') return;

  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
};

// for different page navigation
// use:
// const ScrollToSectionOnPage = useScrollToSectionOnPage();
// const handleScrollToSubscription = () => {
//   ScrollToSectionOnPage("/", "sales-benefits");
// };

export const useScrollToSectionOnPage = () => {
  const router = useRouter();

  const scrollToSectionOnPage = (path: string, sectionId: string) => {
    router.push(`${path}?sectionId=${sectionId}`);

    setTimeout(() => {
      if (typeof window === 'undefined') return;

      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);
  };

  return scrollToSectionOnPage;
};
