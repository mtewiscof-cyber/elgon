'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const AdminInventoryPage = () => {
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

  // Fetch inventory data
  const inventory = useQuery(api.inventory.listInventory);

  if (!clerkLoaded || !isUserLoaded || !clerkUser) {
    return <div className="container section">Loading or Authenticating...</div>;
  }

  if (user?.role !== 'admin') {
     return <div className="container section">Access Denied. You are not an admin.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 style={{ color: 'var(--primary)' }}>Admin - Inventory</h1>
      <p className="lead">View product inventory levels.</p>

      <div className="card" style={{ marginTop: 'var(--spacing-lg)' }}>
        <h3>Inventory List</h3>
        {inventory === undefined ? (
          <div>Loading inventory...</div>
        ) : inventory.length === 0 ? (
           <div>No inventory found.</div>
         ) : (
          <div className="overflow-x-auto">
            {/* Table for larger screens */}
            <table className="min-w-full bg-white hidden md:table">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Inventory ID</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Product ID</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Grower ID</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Quantity Available</th>
                  {/* Add more headers as needed */}
                </tr>
              </thead>
              <tbody>
                {inventory.map(i => (
                  <tr key={i._id.toString()} className="border-b border-gray-200">
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{i._id.toString()}</td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{i.productId.toString()}</td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{i.growerId ? i.growerId.toString() : 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{i.quantityAvailable}</td>
                    {/* Add more cells as needed */}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Stacked view for smaller screens */}
            <div className="md:hidden">
              {inventory.map(i => (
                <div key={i._id.toString()} className="card mb-md p-md border border-gray-200">
                  <div className="mb-sm"><span className="font-semibold">Inventory ID:</span> {i._id.toString()}</div>
                  <div className="mb-sm"><span className="font-semibold">Product ID:</span> {i.productId.toString()}</div>
                  <div className="mb-sm"><span className="font-semibold">Grower ID:</span> {i.growerId ? i.growerId.toString() : 'N/A'}</div>
                  <div><span className="font-semibold">Quantity Available:</span> {i.quantityAvailable}</div>
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

export default AdminInventoryPage; 