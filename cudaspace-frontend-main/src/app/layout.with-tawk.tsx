import MyContextProvider from '@/lib/MyContextProvider';
import SessionProviderForNextAuth from '@/nextAuth/SessionProviderForNextAuth';
import Providers from '@/Providers/Providers';
import type { Metadata } from 'next';
import Script from 'next/script';
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
  description: 'Cudaspace delivers secure, scalable, and budget-friendly cloud services tailored for businesses of all sizes. Experience reliable cloud storage, hosting, and backup solutions with top-tier security and support.',
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
                {/* Tawk.to Live Chat */}
                <Script id="tawk-to" strategy="afterInteractive">
                  {`
                  var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
                  (function(){
                    var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                    s1.async=true;
                    s1.src='https://embed.tawk.to/68f06071965b721956897ea0/1j7lfhf5j';
                    s1.charset='UTF-8';
                    s1.setAttribute('crossorigin','*');
                    s0.parentNode.insertBefore(s1,s0);
                  })();
                  `}
                </Script>
              </SocketProvider>
            </Providers>
          </SessionProviderForNextAuth>
        </MyContextProvider>
      </body>
    </html>
  );
}
