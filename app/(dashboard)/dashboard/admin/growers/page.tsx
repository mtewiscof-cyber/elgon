'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const AdminGrowersPage = () => {
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

  // Fetch growers data
  const growers = useQuery(api.growers.listGrowers);

  if (!clerkLoaded || !isUserLoaded || !clerkUser) {
    return <div className="container section">Loading or Authenticating...</div>;
  }

  if (user?.role !== 'admin') {
     return <div className="container section">Access Denied. You are not an admin.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 style={{ color: 'var(--primary)' }}>Admin - Growers</h1>
      <p className="lead">View and manage grower profiles.</p>

      <div className="card" style={{ marginTop: 'var(--spacing-lg)' }}>
        <h3>Grower List</h3>
        {growers === undefined ? (
          <div>Loading growers...</div>
        ) : growers.length === 0 ? (
           <div>No growers found.</div>
         ) : (
          <div className="overflow-x-auto">
            {/* Table for larger screens */}
            <table className="min-w-full bg-white hidden md:table">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Farm Name</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">User ID</th>
                  {/* Add more headers as needed, e.g., story, coffee varieties */}
                </tr>
              </thead>
              <tbody>
                {growers.map(g => (
                  <tr key={g._id.toString()} className="border-b border-gray-200">
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{g.name}</td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{g.location}</td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{g.farmName || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{g.userId ? g.userId.toString() : 'N/A'}</td>
                    {/* Add more cells as needed */}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Stacked view for smaller screens */}
            <div className="md:hidden">
              {growers.map(g => (
                <div key={g._id.toString()} className="card mb-md p-md border border-gray-200">
                  <div className="mb-sm"><span className="font-semibold">Name:</span> {g.name}</div>
                  <div className="mb-sm"><span className="font-semibold">Location:</span> {g.location}</div>
                  <div className="mb-sm"><span className="font-semibold">Farm Name:</span> {g.farmName || 'N/A'}</div>
                  <div><span className="font-semibold">User ID:</span> {g.userId ? g.userId.toString() : 'N/A'}</div>
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

export default AdminGrowersPage; 