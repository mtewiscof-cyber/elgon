'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const AdminUsersPage = () => {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser(); // Use different names for Clerk user/loaded state
  const router = useRouter();

  // Fetch the user document from Convex to get the role
  const user = useQuery(api.users.getUserByUserId);
  const isUserLoaded = user !== undefined; // User is loaded if the query returns a value (can be null if not authenticated)

  // Redirect if user data is loaded and user is not an admin
  useEffect(() => {
    // Wait for both Clerk user status and Convex user data to load
    if (clerkLoaded && isUserLoaded) {
      if (!clerkUser || user?.role !== 'admin') {
        // Redirect to home or an unauthorized page if not authenticated or not admin
        router.push('/'); // Or '/unauthorized'
      }
    }
  }, [clerkLoaded, isUserLoaded, clerkUser, user, router]);

  // Fetch users data
  const users = useQuery(api.users.listUsers);

  // Show a loading state while user data is loading or if not authenticated
  if (!clerkLoaded || !isUserLoaded || !clerkUser) {
    return <div className="container section">Loading or Authenticating...</div>;
  }

  // After loading, check if the user is an admin before rendering the dashboard
  if (user?.role !== 'admin') {
     // This case should ideally be handled by the useEffect redirect, but included as a fallback render
     return <div className="container section">Access Denied. You are not an admin.</div>;
  }

  // Admin user is loaded, display users data
  return (
    <div className="page-content container section">
      <h1 style={{ color: 'var(--primary)' }}>Admin - Users</h1>
      <p className="lead">View and manage all user accounts.</p>

      <div className="card" style={{ marginTop: 'var(--spacing-lg)' }}>
        <h3>User List</h3>
        {users === undefined ? (
          <div>Loading users...</div>
        ) : users.length === 0 ? (
           <div>No users found.</div>
         ) : (
          <div className="overflow-x-auto">
            {/* Table for larger screens */}
            <table className="min-w-full bg-white hidden md:table">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">First Name</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Last Name</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Phone</th>
                  {/* Add more headers for other fields like address if needed */}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id.toString()} className="border-b border-gray-200">
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{u.email}</td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{u.role || 'user'}</td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{u.firstName || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{u.lastName || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{u.phoneNumber || 'N/A'}</td>
                    {/* Add more cells for other fields */}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Stacked view for smaller screens */}
            <div className="md:hidden">
              {users.map(u => (
                <div key={u._id.toString()} className="card mb-md p-md border border-gray-200">
                  <div className="mb-sm"><span className="font-semibold">Email:</span> {u.email}</div>
                  <div className="mb-sm"><span className="font-semibold">Role:</span> {u.role || 'user'}</div>
                  <div className="mb-sm"><span className="font-semibold">First Name:</span> {u.firstName || 'N/A'}</div>
                  <div className="mb-sm"><span className="font-semibold">Last Name:</span> {u.lastName || 'N/A'}</div>
                  <div><span className="font-semibold">Phone:</span> {u.phoneNumber || 'N/A'}</div>
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

export default AdminUsersPage; 