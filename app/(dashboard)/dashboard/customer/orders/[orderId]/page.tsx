'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import { normalizeShippingAddress } from '@/lib/utils';

const CustomerOrderDetailPage = () => {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string | undefined; // Get the orderId from the URL

  // Fetch the user document from Convex to get the role
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

  // Fetch the specific order details
  const order = useQuery(
    api.orders.getOrder,
    orderId ? { orderId: orderId as any } : 'skip' // Pass orderId if available
  );

  // Show a loading state while data is loading or if not authenticated/authorized
  if (!clerkLoaded || !isUserLoaded || !clerkUser || user?.role !== 'customer' || order === undefined) {
    return <div className="container section">Loading or Access Denied...</div>;
  }

   if (!order) {
      return <div className="container section">Order not found.</div>;
   }

  return (
    <div className="page-content container section">
      <h1 style={{ color: 'var(--primary)' }}>Order Details</h1>
      <p className="lead">Details for Order ID: {order._id.toString()}</p>

      <div className="card" style={{ marginTop: 'var(--spacing-lg)' }}>
        <h3>Order Summary</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div><span className="font-semibold">Order ID:</span> {order._id.toString()}</div>
            <div><span className="font-semibold">Total Amount:</span> {order.totalAmount}</div>
            <div><span className="font-semibold">Status:</span> {order.status}</div>
            <div><span className="font-semibold">Payment Status:</span> {order.paymentStatus}</div>
            <div><span className="font-semibold">Created At:</span> {new Date(order.createdAt).toLocaleString()}</div>
             {order.updatedAt && <div><span className="font-semibold">Updated At:</span> {new Date(order.updatedAt).toLocaleString()}</div>}
         </div>
      </div>

      {order.shippingAddress && (
         <div className="card" style={{ marginTop: 'var(--spacing-lg)' }}>
            <h3>Shipping Address</h3>
             <div>
                {(() => {
                  const normalizedAddress = normalizeShippingAddress(order.shippingAddress);
                  return `${normalizedAddress?.address || ''}, ${normalizedAddress?.city || ''}, ${normalizedAddress?.state || ''}, ${normalizedAddress?.zipCode || ''}, ${normalizedAddress?.country || ''}`;
                })()}
             </div>
         </div>
      )}

      <div className="card" style={{ marginTop: 'var(--spacing-lg)' }}>
         <h3>Items</h3>
         {order.items.length === 0 ? (
            <div>No items in this order.</div>
         ) : (
            <div className="overflow-x-auto">
                {/* Table for larger screens */}
                <table className="min-w-full bg-white hidden md:table">
                   <thead>
                      <tr>
                         <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Product ID</th>{/* Link to product details later? */ }
                         <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Quantity</th>
                         <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Price at Purchase</th>
                      </tr>
                   </thead>
                   <tbody>
                      {order.items.map((item, index) => (
                         <tr key={index} className="border-b border-gray-200">
                            <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{item.productId.toString()}</td>
                            <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{item.quantity}</td>
                            <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">{item.priceAtPurchase}</td>
                         </tr>
                      ))}
                   </tbody>
                </table>

                 {/* Stacked view for smaller screens */}
                <div className="md:hidden">
                   {order.items.map((item, index) => (
                     <div key={index} className="card mb-md p-md border border-gray-200">
                        <div className="mb-sm"><span className="font-semibold">Product ID:</span> {item.productId.toString()}</div>
                        <div className="mb-sm"><span className="font-semibold">Quantity:</span> {item.quantity}</div>
                        <div><span className="font-semibold">Price at Purchase:</span> {item.priceAtPurchase}</div>
                     </div>
                   ))}
                </div>

            </div>
         )}
      </div>

    </div>
  );
};

export default CustomerOrderDetailPage; 