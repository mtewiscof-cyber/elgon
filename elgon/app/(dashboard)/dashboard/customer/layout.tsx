'use client';

import React from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DashboardNavigation from '@/components/dashboard/navigation';
import DashboardFooter from '@/components/dashboard/footer';

export default function CustomerDashboardLayout({
  children,
}: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const router = useRouter();

  // Fetch the user document from Convex to get the role
  const user = useQuery(api.users.getUserByUserId);
  const isUserLoaded = user !== undefined;

  // Redirect if user data is loaded and user is not authenticated or not a customer
  useEffect(() => {
    if (clerkLoaded && isUserLoaded) {
      if (!clerkUser || user?.role !== 'customer') {
        router.push('/'); // Redirect to home or an unauthorized page
      }
    }
  }, [clerkLoaded, isUserLoaded, clerkUser, user, router]);

  // Show a loading state while user data is loading or if not authenticated
  if (!clerkLoaded || !isUserLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 max-w-md bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-gray-500">Please wait while we authenticate your session.</p>
        </div>
      </div>
    );
  }

  // After loading, check if the user is a customer before rendering the dashboard
  if (!clerkUser || user?.role !== 'customer') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 max-w-md bg-white rounded-lg shadow-md">
          <div className="flex justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-red-500">
              <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-4">You don't have permission to access the customer dashboard.</p>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation sidebar */}
      <DashboardNavigation userRole="customer" />
      
      {/* Main content */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        <main className="flex-1 p-4 md:p-6 lg:p-8 pt-16 lg:pt-4 md:pt-6">
          {children}
        </main>
        <DashboardFooter />
      </div>
    </div>
  );
}
