import { NextUIProvider } from '@nextui-org/react';
import type { ReactNode } from 'react';

export const metadata = {
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
