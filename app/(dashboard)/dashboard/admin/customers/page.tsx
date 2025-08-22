'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const AdminCustomersPage = () => {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const router = useRouter();
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

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

  // Fetch customers data with user details
  const customers = useQuery(api.customers.listCustomersWithUserDetails);

  if (!clerkLoaded || !isUserLoaded || !clerkUser) {
    return <div className="container section">Loading or Authenticating...</div>;
  }

  if (user?.role !== 'admin') {
     return <div className="container section">Access Denied. You are not an admin.</div>;
  }

  const handleCustomerClick = (customer: any) => {
    setSelectedCustomer(customer);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedCustomer(null);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Admin - Customers</h1>
          <p className="text-gray-600 text-lg">View and manage customer profiles</p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="text-sm text-gray-500">
            Total Customers: {customers?.length || 0}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Customer List</h3>
          
          {customers === undefined ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg">No customers found.</p>
              <p className="text-sm">Customers will appear here once they create profiles.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Mobile-first card layout */}
              <div className="grid gap-4 md:hidden">
                {customers.map((customer) => (
                  <div 
                    key={customer._id.toString()} 
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleCustomerClick(customer)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                          {customer.user?.firstName?.[0] || customer.user?.email?.[0] || 'C'}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {customer.user?.firstName && customer.user?.lastName 
                              ? `${customer.user.firstName} ${customer.user.lastName}`
                              : customer.user?.email || 'Unknown User'
                            }
                          </h4>
                          <p className="text-sm text-gray-600">{customer.user?.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          customer.isCompany ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {customer.isCompany ? 'Company' : 'Individual'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Role:</span>
                        <span className="ml-1 text-gray-600">{customer.user?.role || 'customer'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Wholesale:</span>
                        <span className="ml-1 text-gray-600">{customer.isWholesale ? 'Yes' : 'No'}</span>
                      </div>
                      {customer.companyName && (
                        <div className="col-span-2">
                          <span className="font-medium text-gray-700">Company:</span>
                          <span className="ml-1 text-gray-600">{customer.companyName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop table layout */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preferences
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customers.map((customer) => (
                      <tr 
                        key={customer._id.toString()} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleCustomerClick(customer)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold mr-3">
                              {customer.user?.firstName?.[0] || customer.user?.email?.[0] || 'C'}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {customer.user?.firstName && customer.user?.lastName 
                                  ? `${customer.user.firstName} ${customer.user.lastName}`
                                  : 'Unknown User'
                                }
                              </div>
                              <div className="text-sm text-gray-500">{customer.user?.email}</div>
                              <div className="text-xs text-gray-400">Role: {customer.user?.role || 'customer'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            customer.isCompany ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {customer.isCompany ? 'Company' : 'Individual'}
                          </span>
                          {customer.isWholesale && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Wholesale
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {customer.companyName || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {customer.coffeePreferences ? (
                            <div className="space-y-1">
                              {customer.coffeePreferences.roastLevel && (
                                <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  Roast: {customer.coffeePreferences.roastLevel}
                                </div>
                              )}
                              {customer.coffeePreferences.origin && customer.coffeePreferences.origin.length > 0 && (
                                <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  Origins: {customer.coffeePreferences.origin.slice(0, 2).join(', ')}
                                  {customer.coffeePreferences.origin.length > 2 && '...'}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">No preferences</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-primary hover:text-primary-dark transition-colors">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Customer Details Modal */}
      {showDetails && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Customer Details</h3>
                <button
                  onClick={closeDetails}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4 space-y-6">
              {/* User Information */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">User Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedCustomer.user?.firstName && selectedCustomer.user?.lastName 
                        ? `${selectedCustomer.user.firstName} ${selectedCustomer.user.lastName}`
                        : 'Not provided'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCustomer.user?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCustomer.user?.role || 'customer'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCustomer.user?.phoneNumber || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Customer Profile</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Customer Type</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedCustomer.isCompany ? 'Company' : 'Individual'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Wholesale</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCustomer.isWholesale ? 'Yes' : 'No'}</p>
                  </div>
                  {selectedCustomer.companyName && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Company Name</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedCustomer.companyName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Company Role</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedCustomer.companyRole || 'Not specified'}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Coffee Preferences */}
              {selectedCustomer.coffeePreferences && (
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Coffee Preferences</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedCustomer.coffeePreferences.roastLevel && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Preferred Roast Level</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedCustomer.coffeePreferences.roastLevel}</p>
                      </div>
                    )}
                    {selectedCustomer.coffeePreferences.origin && selectedCustomer.coffeePreferences.origin.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Preferred Origins</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedCustomer.coffeePreferences.origin.join(', ')}</p>
                      </div>
                    )}
                    {selectedCustomer.coffeePreferences.flavorProfiles && selectedCustomer.coffeePreferences.flavorProfiles.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Flavor Profiles</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedCustomer.coffeePreferences.flavorProfiles.join(', ')}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Company Address */}
              {selectedCustomer.companyAddress && (
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Company Address</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-900">{selectedCustomer.companyAddress.street}</p>
                    <p className="text-sm text-gray-900">
                      {selectedCustomer.companyAddress.city}, {selectedCustomer.companyAddress.state} {selectedCustomer.companyAddress.zip}
                    </p>
                    <p className="text-sm text-gray-900">{selectedCustomer.companyAddress.country}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomersPage; 