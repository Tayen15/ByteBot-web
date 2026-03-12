'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboardSubpath = pathname !== '/dashboard' && pathname?.startsWith('/dashboard');

  return (
    <>
      {!isDashboardSubpath && <Navbar />}
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      {!isDashboardSubpath && <Footer />}
    </>
  );
}
