'use client';

import React from 'react';
import DashboardNavigation from '@/components/dashboard/navigation';
import DashboardFooter from '@/components/dashboard/footer';

export default function GrowerDashboardLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation sidebar with sticky header */}
      <DashboardNavigation userRole="grower" />
      
      {/* Main content */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        <main className="flex-1 p-4 md:p-6 lg:p-8 pt-20 lg:pt-20 md:pt-20">
          {children}
        </main>
        <DashboardFooter />
      </div>
    </div>
  );
} 