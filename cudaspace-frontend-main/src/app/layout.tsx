import MyContextProvider from '@/lib/MyContextProvider';
import SessionProviderForNextAuth from '@/nextAuth/SessionProviderForNextAuth';
import Providers from '@/Providers/Providers';
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import SocketProvider from '@/Providers/SocketProvider';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Secure and Affordable Cloud services provider- Cudaspace',
  description:
    'Cudaspace delivers secure, scalable, and budget-friendly cloud services tailored for businesses of all sizes. Experience reliable cloud storage, hosting, and backup solutions with top-tier security and support.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${montserrat.variable} antialiased`}
      >
        <MyContextProvider>
          <SessionProviderForNextAuth>
            <Providers>
              <SocketProvider>
                <Toaster richColors position="bottom-right" />
                {children}
              </SocketProvider>
            </Providers>
          </SessionProviderForNextAuth>
        </MyContextProvider>
      </body>
    </html>
  );
}