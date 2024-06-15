import { NextUIProvider } from '@nextui-org/react';
import type { ReactNode } from 'react';
import type { Metadata } from 'next'
import './globals.css'; // Path to your global CSS file

export const metadata: Metadata = {
  title: 'Sales Calculator',
  description: 'Calculate sales steps and average premium per initial contact',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NextUIProvider>
          {children}
        </NextUIProvider>
      </body>
    </html>
  );
}
