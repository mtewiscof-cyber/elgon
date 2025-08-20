'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import DashboardNavigation from '@/components/dashboard/navigation';

export default function DashboardLayout({
  children,
}: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Determine which role dashboard we're in
  let currentRole = 'unknown';
  if (pathname.includes('/dashboard/grower')) {
    currentRole = 'grower';
  } else if (pathname.includes('/dashboard/customer')) {
    currentRole = 'customer';
  } else if (pathname.includes('/dashboard/admin')) {
    currentRole = 'admin';
  }
  
  return (
    <div className="min-h-screen">
      <DashboardNavigation userRole={currentRole as 'admin' | 'grower' | 'customer'} />
      {children}
    </div>
  );
} 