'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

const AdminProductsPage = () => {
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

  // Fetch products data
  const products = useQuery(api.products.listProducts);

  if (!clerkLoaded || !isUserLoaded || !clerkUser) {
    return <div className="container section">Loading or Authenticating...</div>;
  }

  if (user?.role !== 'admin') {
     return <div className="container section">Access Denied. You are not an admin.</div>;
  }

  return (
    <div className="page-content container section">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Admin - Products</h1>
        <Link 
          href="/dashboard/admin/products/add" 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add New Product
        </Link>
      </div>
      <p className="lead mb-6">View and manage product listings.</p>

      <div className="card bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Product List</h3>
        {products === undefined ? (
          <div>Loading products...</div>
        ) : products.length === 0 ? (
           <div>No products found.</div>
         ) : (
          <div className="overflow-x-auto">
            {/* Table for larger screens */}
            <table className="min-w-full bg-white hidden md:table">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Grower ID</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id.toString()} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-no-wrap">
                      {p.imageUrl && (
                        <img 
                          src={p.imageUrl} 
                          alt={p.name} 
                          className="h-10 w-10 object-cover rounded"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{p.name}</td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">${p.price}</td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{p.stock}</td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{p.growerId ? p.growerId.toString() : 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5">
                      <button className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                      <button className="text-red-600 hover:text-red-800">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Stacked view for smaller screens */}
            <div className="md:hidden space-y-4">
              {products.map(p => (
                <div key={p._id.toString()} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    {p.imageUrl && (
                      <img 
                        src={p.imageUrl} 
                        alt={p.name} 
                        className="h-12 w-12 object-cover rounded mr-2"
                      />
                    )}
                    <h4 className="font-medium text-lg">{p.name}</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-sm mb-3">
                    <div><span className="font-semibold">Price:</span> ${p.price}</div>
                    <div><span className="font-semibold">Stock:</span> {p.stock}</div>
                    <div><span className="font-semibold">Grower ID:</span> {p.growerId ? p.growerId.toString() : 'N/A'}</div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200">Edit</button>
                    <button className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductsPage; 