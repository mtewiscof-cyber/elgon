'use client';

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { normalizeShippingAddress } from '@/lib/utils';

export default function GrowerOrdersPage() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  // Fetch the user and grower information
  const convexUser = useQuery(api.users.getUserByUserId);
  const growerProfile = useQuery(
    api.growers.getGrowerByUserId,
    convexUser?._id ? { userId: convexUser._id } : "skip"
  );
  
  // Fetch all products to find the ones associated with this grower
  const products = useQuery(api.products.listProducts);
  
  // Fetch all orders (we'll filter them for this grower's products)
  const orders = useQuery(api.orders.listOrders);
  
  if (!clerkLoaded || !convexUser || !growerProfile || !products || !orders) {
    return <div className="p-4">Loading orders data...</div>;
  }
  
  // Filter products that belong to this grower
  const growerProductIds = products
    .filter(product => product.growerId && product.growerId.toString() === growerProfile._id.toString())
    .map(product => product._id.toString());
  
  // Filter orders that contain any of this grower's products
  const relevantOrders = orders.filter(order => {
    // Check if any item in the order contains a product from this grower
    return order.items.some(item => 
      growerProductIds.includes(item.productId.toString())
    );
  });
  
  // Sort orders by creation date (most recent first)
  const sortedOrders = [...relevantOrders].sort((a, b) => b.createdAt - a.createdAt);
  
  const toggleExpand = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };
  
  // Function to get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Function to format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Coffee Orders</h2>
        </div>
        
        {sortedOrders.length === 0 ? (
          <p className="text-gray-600">You don't have any orders yet.</p>
        ) : (
          <div className="space-y-4">
            {sortedOrders.map((order) => {
              // Get only the items in this order that contain this grower's products
              const growerItems = order.items.filter(item => 
                growerProductIds.includes(item.productId.toString())
              );
              
              // Calculate subtotal for just this grower's items
              const growerSubtotal = growerItems.reduce(
                (sum, item) => sum + (item.priceAtPurchase * item.quantity), 
                0
              );
              
              // Find product names for the items
              const productNames = growerItems.map(item => {
                const product = products.find(p => p._id.toString() === item.productId.toString());
                return product ? product.name : 'Unknown Product';
              });
              
              return (
                <div 
                  key={order._id.toString()} 
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div 
                    className="flex justify-between items-center p-4 cursor-pointer bg-gray-50"
                    onClick={() => toggleExpand(order._id.toString())}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium">Order #{order._id.toString().substring(0, 8)}</h3>
                        <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {formatDate(order.createdAt)} • ${growerSubtotal.toFixed(2)}
                      </p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800">
                      {expandedOrder === order._id.toString() ? 'Hide Details' : 'Show Details'}
                    </button>
                  </div>
                  
                  {expandedOrder === order._id.toString() && (
                    <div className="p-4 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-gray-600">Order Date</p>
                          <p className="font-medium">{formatDate(order.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Status</p>
                          <p className="font-medium">{order.status}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Payment Status</p>
                          <p className="font-medium">{order.paymentStatus}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Subtotal (Your Products)</p>
                          <p className="font-medium">${growerSubtotal.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-gray-600 mb-2">Shipping Address</p>
                        {order.shippingAddress ? (
                          <div className="text-sm">
                            {(() => {
                              const normalizedAddress = normalizeShippingAddress(order.shippingAddress);
                              return (
                                <>
                                  <p>{normalizedAddress?.address || 'No address'}</p>
                                  <p>{normalizedAddress?.city || ''}, {normalizedAddress?.state || ''} {normalizedAddress?.zipCode || ''}</p>
                                  <p>{normalizedAddress?.country || ''}</p>
                                </>
                              );
                            })()}
                          </div>
                        ) : (
                          <p>No shipping address provided</p>
                        )}
                      </div>
                      
                      <div>
                        <p className="text-gray-600 mb-2">Order Items (Your Products)</p>
                        <div className="space-y-2">
                          {growerItems.map((item, index) => {
                            const product = products.find(p => p._id.toString() === item.productId.toString());
                            return (
                              <div key={index} className="flex justify-between items-center p-2 border-b border-gray-100">
                                <div>
                                  <p className="font-medium">{product?.name || 'Unknown Product'}</p>
                                  <p className="text-sm text-gray-600">
                                    ${item.priceAtPurchase.toFixed(2)} × {item.quantity}
                                  </p>
                                </div>
                                <p className="font-medium">
                                  ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 