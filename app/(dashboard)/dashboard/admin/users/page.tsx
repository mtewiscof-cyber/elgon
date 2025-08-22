'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const AdminUsersPage = () => {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [editingRole, setEditingRole] = useState<string>('');
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  // Fetch the user document from Convex to get the role
  const user = useQuery(api.users.getUserByUserId);
  const isUserLoaded = user !== undefined;

  // Fetch users data
  const users = useQuery(api.users.listUsers);

  // Mutation for changing user role
  const changeUserRole = useMutation(api.users.changeUserRole);

  // Redirect if user data is loaded and user is not an admin
  useEffect(() => {
    if (clerkLoaded && isUserLoaded) {
      if (!clerkUser || user?.role !== 'admin') {
        router.push('/');
      }
    }
  }, [clerkLoaded, isUserLoaded, clerkUser, user, router]);

  if (!clerkLoaded || !isUserLoaded || !clerkUser) {
    return <div className="container section">Loading or Authenticating...</div>;
  }

  if (user?.role !== 'admin') {
     return <div className="container section">Access Denied. You are not an admin.</div>;
  }

  const handleUserClick = (userData: any) => {
    setSelectedUser(userData);
    setEditingRole(userData.role || 'user');
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedUser(null);
    setEditingRole('');
  };

  const handleRoleChange = async () => {
    if (!selectedUser || editingRole === selectedUser.role) return;
    
    setIsUpdatingRole(true);
    try {
      await changeUserRole({
        id: selectedUser._id,
        role: editingRole,
      });
      
      // Close the modal and refresh the page to show updated data
      closeDetails();
      window.location.reload(); // Simple refresh for now
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role. Please try again.');
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'grower':
        return 'bg-green-100 text-green-800';
      case 'customer':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'grower':
        return 'Grower';
      case 'customer':
        return 'Customer';
      default:
        return 'User';
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Admin - Users</h1>
          <p className="text-gray-600 text-lg">View and manage all user accounts</p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="text-sm text-gray-500">
            Total Users: {users?.length || 0}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">User List</h3>
          
          {users === undefined ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg">No users found.</p>
              <p className="text-sm">Users will appear here once they create accounts.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Mobile-first card layout */}
              <div className="grid gap-4 md:hidden">
                {users.map((userData) => (
                  <div 
                    key={userData._id.toString()} 
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleUserClick(userData)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                          {userData.firstName?.[0] || userData.email?.[0] || 'U'}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {userData.firstName && userData.lastName 
                              ? `${userData.firstName} ${userData.lastName}`
                              : userData.email || 'Unknown User'
                            }
                          </h4>
                          <p className="text-sm text-gray-600">{userData.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(userData.role || 'user')}`}>
                          {getRoleDisplayName(userData.role || 'user')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Phone:</span>
                        <span className="ml-1 text-gray-600">{userData.phoneNumber || 'Not provided'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Address:</span>
                        <span className="ml-1 text-gray-600">
                          {userData.address ? `${userData.address.city}, ${userData.address.state}` : 'Not provided'}
                        </span>
                      </div>
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
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((userData) => (
                      <tr 
                        key={userData._id.toString()} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleUserClick(userData)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold mr-3">
                              {userData.firstName?.[0] || userData.email?.[0] || 'U'}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {userData.firstName && userData.lastName 
                                  ? `${userData.firstName} ${userData.lastName}`
                                  : 'Unknown User'
                                }
                              </div>
                              <div className="text-sm text-gray-500">{userData.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(userData.role || 'user')}`}>
                            {getRoleDisplayName(userData.role || 'user')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {userData.phoneNumber || 'Not provided'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {userData.address ? (
                            <div>
                              <div>{userData.address.street}</div>
                              <div className="text-gray-500">
                                {userData.address.city}, {userData.address.state} {userData.address.zip}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400">Not provided</span>
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

      {/* User Details Modal */}
      {showDetails && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">User Details</h3>
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
                      {selectedUser.firstName && selectedUser.lastName 
                        ? `${selectedUser.firstName} ${selectedUser.lastName}`
                        : 'Not provided'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedUser.phoneNumber || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Role</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getRoleBadgeColor(selectedUser.role || 'user')}`}>
                      {getRoleDisplayName(selectedUser.role || 'user')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Role Management */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Role Management</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Change Role</label>
                    <select
                      value={editingRole}
                      onChange={(e) => setEditingRole(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    >
                      <option value="user">User</option>
                      <option value="customer">Customer</option>
                      <option value="grower">Grower</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={handleRoleChange}
                      disabled={editingRole === selectedUser.role || isUpdatingRole}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      {isUpdatingRole ? 'Updating...' : 'Update Role'}
                    </button>
                    <button
                      onClick={closeDetails}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                  
                  <div className="text-xs text-gray-500 bg-yellow-50 p-3 rounded-md">
                    <p><strong>Note:</strong> Changing a user's role will affect their access to different parts of the system.</p>
                    <p className="mt-1">• <strong>Admin:</strong> Full system access</p>
                    <p className="mt-1">• <strong>Grower:</strong> Access to grower-specific features</p>
                    <p className="mt-1">• <strong>Customer:</strong> Access to customer features</p>
                    <p className="mt-1">• <strong>User:</strong> Basic access only</p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              {selectedUser.address && (
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Address Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-900">{selectedUser.address.street}</p>
                    <p className="text-sm text-gray-900">
                      {selectedUser.address.city}, {selectedUser.address.state} {selectedUser.address.zip}
                    </p>
                    <p className="text-sm text-gray-900">{selectedUser.address.country}</p>
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

export default AdminUsersPage; 