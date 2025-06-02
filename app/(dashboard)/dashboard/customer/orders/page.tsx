'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

const CustomerOrdersPage = () => {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const router = useRouter();

  // Fetch the user document from Convex to get the role and user ID
  const user = useQuery(api.users.getUserByUserId);
  const isUserLoaded = user !== undefined;

  // Redirect if user data is loaded and user is not authenticated or not a customer
  useEffect(() => {
    if (clerkLoaded && isUserLoaded) {
      if (!clerkUser || user?.role !== 'customer') {
        router.push('/');
      }
    }
  }, [clerkLoaded, isUserLoaded, clerkUser, user, router]);

  // Fetch orders data for the authenticated user
  const orders = useQuery(api.orders.listOrdersByUserId);

  // Show a loading state while user data is loading or if not authenticated/authorized
  if (!clerkLoaded || !isUserLoaded || !clerkUser || user?.role !== 'customer') {
    return <div className="container section">Loading or Access Denied...</div>;
  }

  return (
    <div className="page-content container section">
      <h1 style={{ color: 'var(--primary)' }}>Your Orders</h1>
      <p className="lead">View your order history.</p>

      <div className="card" style={{ marginTop: 'var(--spacing-lg)' }}>
        <h3>Order History</h3>
        {orders === undefined ? (
          <div>Loading orders...</div>
        ) : orders.length === 0 ? (
           <div>No orders found.</div>
         ) : (
          <div className="overflow-x-auto">
            {/* Table for larger screens */}
            <table className="min-w-full bg-white hidden md:table">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Total Amount</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Payment Status</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Created At</th>
                   <th className="px-6 py-3 border-b-2 border-gray-300"></th>{/* For View Details button */}
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id.toString()} className="border-b border-gray-200">
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{o._id.toString()}</td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{o.totalAmount}</td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{o.status}</td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{o.paymentStatus}</td>
                    <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-no-wrap text-right text-sm leading-5 font-medium">
                       <Link href={`/customer/orders/${o._id.toString()}`} className="text-primary hover:underline">
                          View Details
                       </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Stacked view for smaller screens */}
            <div className="md:hidden">
              {orders.map(o => (
                <div key={o._id.toString()} className="card mb-md p-md border border-gray-200">
                  <div className="mb-sm"><span className="font-semibold">Order ID:</span> {o._id.toString()}</div>
                  <div className="mb-sm"><span className="font-semibold">Total Amount:</span> {o.totalAmount}</div>
                  <div className="mb-sm"><span className="font-semibold">Status:</span> {o.status}</div>
                  <div className="mb-sm"><span className="font-semibold">Payment Status:</span> {o.paymentStatus}</div>
                  <div className="mb-sm"><span className="font-semibold">Created At:</span> {new Date(o.createdAt).toLocaleDateString()}</div>
                   <div className="mt-4 text-right">
                       <Link href={`/customer/orders/${o._id.toString()}`} className="text-primary hover:underline">
                          View Details
                       </Link>
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

export default CustomerOrdersPage; 