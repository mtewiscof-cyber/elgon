'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const AdminCustomersPage = () => {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const router = useRouter();

  // Fetch the user document from Convex to get the role
  const user = useQuery(api.users.getUserByUserId);
  const isUserLoaded = user !== undefined;

  // Redirect if user data is loaded and user is not an admin
  useEffect(() => {
    if (clerkLoaded && isUserLoaded) {
      if (!clerkUser || user?.role !== 'admin') {
        router.push('/');
      }
    }
  }, [clerkLoaded, isUserLoaded, clerkUser, user, router]);

  // Fetch customers data
  const customers = useQuery(api.customers.listCustomers);

  if (!clerkLoaded || !isUserLoaded || !clerkUser) {
    return <div className="container section">Loading or Authenticating...</div>;
  }

  if (user?.role !== 'admin') {
     return <div className="container section">Access Denied. You are not an admin.</div>;
  }

  return (
    <div className="page-content container section">
      <h1 style={{ color: 'var(--primary)' }}>Admin - Customers</h1>
      <p className="lead">View and manage customer profiles.</p>

      <div className="card" style={{ marginTop: 'var(--spacing-lg)' }}>
        <h3>Customer List</h3>
        {customers === undefined ? (
          <div>Loading customers...</div>
        ) : customers.length === 0 ? (
           <div>No customers found.</div>
         ) : (
          <div className="overflow-x-auto">
            {/* Table for larger screens */}
            <table className="min-w-full bg-white hidden md:table">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">User ID</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Is Company</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Company Name</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Company Role</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Company Phone</th>
                  {/* Add more headers as needed, e.g., coffee preferences, contact info */}
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c._id.toString()} className="border-b border-gray-200">
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{c.userId ? c.userId.toString() : 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{c.isCompany ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{c.companyName || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{c.companyRole || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{c.companyPhoneNumber || 'N/A'}</td>
                    {/* Add more cells as needed */}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Stacked view for smaller screens */}
            <div className="md:hidden">
              {customers.map(c => (
                <div key={c._id.toString()} className="card mb-md p-md border border-gray-200">
                  <div className="mb-sm"><span className="font-semibold">User ID:</span> {c.userId ? c.userId.toString() : 'N/A'}</div>
                  <div className="mb-sm"><span className="font-semibold">Is Company:</span> {c.isCompany ? 'Yes' : 'No'}</div>
                  <div className="mb-sm"><span className="font-semibold">Company Name:</span> {c.companyName || 'N/A'}</div>
                  <div className="mb-sm"><span className="font-semibold">Company Role:</span> {c.companyRole || 'N/A'}</div>
                  <div className="mb-sm"><span className="font-semibold">Company Phone:</span> {c.companyPhoneNumber || 'N/A'}</div>
                  {/* Add more fields as needed */}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCustomersPage; 