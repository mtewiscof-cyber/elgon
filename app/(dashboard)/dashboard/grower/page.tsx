'use client';

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function GrowerDashboardPage() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const [greeting, setGreeting] = useState('');
  
  // Fetch the user and grower information
  const convexUser = useQuery(api.users.getUserByUserId);
  const growerProfile = useQuery(
    api.growers.getGrowerByUserId,
    convexUser?._id ? { userId: convexUser._id } : "skip"
  );
  
  // Fetch all products and inventory
  const products = useQuery(api.products.listProducts);
  const inventory = useQuery(api.inventory.listInventory);
  
  // Fetch all orders
  const orders = useQuery(api.orders.listOrders);
  
  // Fetch conversations for message count
  const conversations = useQuery(api.messages.getUserConversations);

  // Generate time-based greeting
  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting('Good Morning');
    } else if (currentHour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);
  
  // Check if all data is loaded
  const isDataLoaded = clerkLoaded && convexUser && growerProfile && products && inventory && orders;
  
  if (!isDataLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 max-w-md bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Loading Dashboard...</h2>
          <p className="text-gray-500">Fetching your grower data.</p>
        </div>
      </div>
    );
  }
  
  // Since products no longer have growerId, we'll show all products
  // In a real application, you might want to implement a different way to associate products with growers
  const growerProducts = products;
  
  // Filter orders that contain any of this grower's products
  const growerProductIds = growerProducts.map(product => product._id.toString());
  const relevantOrders = orders.filter(order => {
    return order.items.some(item => 
      growerProductIds.includes(item.productId.toString())
    );
  });
  
  // Calculate metrics
  const totalProducts = growerProducts.length;
  const totalOrdersCount = relevantOrders.length;
  const recentOrders = [...relevantOrders]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);
  
  // Calculate total revenue from all orders
  const totalRevenue = relevantOrders.reduce((total, order) => {
    const orderRevenue = order.items.reduce((sum, item) => {
      if (growerProductIds.includes(item.productId.toString())) {
        return sum + (item.priceAtPurchase * item.quantity);
      }
      return sum;
    }, 0);
    return total + orderRevenue;
  }, 0);
  
  // Calculate total inventory count
  const totalInventoryCount = inventory.reduce((total, item) => total + item.quantityAvailable, 0);
  
  // Calculate low stock items (less than 10 units)
  const lowStockItems = inventory.filter(item => item.quantityAvailable < 10);
  
  // Calculate total unread messages
  const totalUnreadMessages = conversations?.reduce((total, conv) => total + conv.unreadCount, 0) || 0;
  
  // Format date for orders
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Grower action cards with icons
  const growerCards = [
    {
      title: 'Profile',
      description: 'Manage your grower profile and business information.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
        </svg>
      ),
      link: '/dashboard/grower/profile',
    },
    {
      title: 'Messages',
      description: 'View and respond to messages from customers and administrators.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.678 3.348-3.97z" clipRule="evenodd" />
        </svg>
      ),
      link: '/dashboard/grower/messages',
      count: totalUnreadMessages,
      showBadge: totalUnreadMessages > 0,
    },
    {
      title: 'Orders',
      description: 'View and manage orders for your coffee products.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z" clipRule="evenodd" />
          <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zm9.586 4.594a.75.75 0 00-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 00-1.06 1.06l1.5 1.5a.75.75 0 001.116-.062l3-3.75z" clipRule="evenodd" />
        </svg>
      ),
      link: '/dashboard/grower/orders',
      count: totalOrdersCount,
    },
    {
      title: 'Inventory',
      description: 'Manage your coffee inventory and stock levels.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
          <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375z" />
          <path fillRule="evenodd" d="M3.087 9l.54 9.176A3 3 0 006.62 21h10.757a3 3 0 002.995-2.824L20.913 9H3.087zm6.163 3.75A.75.75 0 0110 12h4a.75.75 0 010 1.5h-4a.75.75 0 01-.75-.75z" clipRule="evenodd" />
        </svg>
      ),
      link: '/dashboard/grower/inventory',
      count: totalInventoryCount,
    },
  ];
  
  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg p-6 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">{greeting}, {clerkUser?.firstName || 'Grower'}</h1>
            <p className="opacity-90">Welcome to your grower dashboard</p>
          </div>
          <div className="hidden md:block">
            <span className="text-xs font-medium bg-white bg-opacity-20 px-3 py-1 rounded-full">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
      
      {/* Dashboard metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-600">
                <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd" />
                <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Unread Messages</p>
              <p className="text-2xl font-bold">{totalUnreadMessages}</p>
            </div>
            <div className={`p-3 rounded-full ${totalUnreadMessages > 0 ? 'bg-red-100' : 'bg-gray-100'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 ${totalUnreadMessages > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.678 3.348-3.97z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Orders</p>
              <p className="text-2xl font-bold">{totalOrdersCount}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-600">
                <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Products</p>
              <p className="text-2xl font-bold">{totalProducts}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-purple-600">
                <path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93zM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.033z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Low Stock Items</p>
              <p className="text-2xl font-bold">{lowStockItems.length}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-600">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Grower action cards */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Manage Your Business</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {growerCards.map((card, index) => (
            <Link href={card.link} key={index}>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                    {card.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">{card.title}</h3>
                      {card.count !== undefined && card.count > 0 && (
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                          card.showBadge 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {card.count}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm mt-1">{card.description}</p>
                    {card.title === 'Messages' && card.count === 0 && (
                      <p className="text-green-600 text-xs mt-1">✓ All messages read</p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Recent Orders & Inventory Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <Link href="/dashboard/grower/orders" className="text-blue-600 text-sm hover:underline">
              View All
            </Link>
          </div>
          
          {recentOrders.length === 0 ? (
            <p className="text-gray-500">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map(order => {
                // Calculate the subtotal for this grower's items in the order
                const orderTotal = order.items.reduce((sum, item) => {
                  if (growerProductIds.includes(item.productId.toString())) {
                    return sum + (item.priceAtPurchase * item.quantity);
                  }
                  return sum;
                }, 0);
                
                return (
                  <div key={order._id.toString()} className="flex justify-between items-center border-b pb-3">
                    <div>
                      <p className="font-medium">Order #{order._id.toString().substring(0, 8)}</p>
                      <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${orderTotal.toFixed(2)}</p>
                      <p className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 inline-block">
                        {order.status}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Inventory Status */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Low Stock Inventory</h2>
            <Link href="/dashboard/grower/inventory" className="text-blue-600 text-sm hover:underline">
              Manage Inventory
            </Link>
          </div>
          
          {lowStockItems.length === 0 ? (
            <p className="text-gray-500">All products are well-stocked</p>
          ) : (
            <div>
              <p className="text-sm text-gray-500 mb-2">
                {lowStockItems.length} product(s) with low stock
              </p>
              <div className="space-y-3">
                {lowStockItems.map(item => {
                  const product = products.find(p => p._id.toString() === item.productId.toString());
                  return (
                    <div key={item._id.toString()} className="flex justify-between items-center border-b pb-3">
                      <div>
                        <p className="font-medium">{product?.name || 'Unknown Product'}</p>
                        <div className="flex items-center">
                          <div className={`h-2 w-16 bg-gray-200 rounded-full overflow-hidden`}>
                            <div 
                              className={`h-full ${item.quantityAvailable < 5 ? 'bg-red-500' : 'bg-yellow-500'}`}
                              style={{ width: `${Math.min(item.quantityAvailable * 10, 100)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 ml-2">
                            {item.quantityAvailable} units left
                          </p>
                        </div>
                      </div>
                      <Link 
                        href="/dashboard/grower/inventory" 
                        className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Update
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
