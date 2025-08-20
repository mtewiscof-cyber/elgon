'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Id } from '@/convex/_generated/dataModel';
import { formatPrice } from '@/lib/utils';

const AdminInventoryPage = () => {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'low' | 'out'>('all');
  const [editingItem, setEditingItem] = useState<Id<"inventory"> | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(0);

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

  // Fetch enhanced inventory data with product details
  const inventoryWithDetails = useQuery(api.inventory.getInventoryWithDetails);
  
  // Mutations
  const updateInventory = useMutation(api.inventory.updateInventory);
  const syncInventory = useMutation(api.inventory.syncInventoryWithProducts);

  // Handle inventory update
  const handleUpdateInventory = async (inventoryId: Id<"inventory">, quantity: number) => {
    try {
      await updateInventory({
        inventoryId,
        quantityAvailable: quantity,
      });
      setEditingItem(null);
      setNewQuantity(0);
    } catch (error) {
      console.error('Failed to update inventory:', error);
      alert('Failed to update inventory. Please try again.');
    }
  };

  // Handle sync inventory
  const handleSyncInventory = async () => {
    try {
      await syncInventory();
      alert('Inventory synced successfully!');
    } catch (error) {
      console.error('Failed to sync inventory:', error);
      alert('Failed to sync inventory. Please try again.');
    }
  };

  // Start editing
  const startEditing = (item: any) => {
    setEditingItem(item._id);
    setNewQuantity(item.quantityAvailable);
  };

  if (!clerkLoaded || !isUserLoaded || !clerkUser) {
    return <div className="container section">Loading or Authenticating...</div>;
  }

  if (user?.role !== 'admin') {
     return <div className="container section">Access Denied. You are not an admin.</div>;
  }

  // Filter inventory based on search and status
  const filteredInventory = inventoryWithDetails?.filter(item => {
    const matchesSearch = !searchTerm || 
      item.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product?.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.grower?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'low' && item.lowStock && !item.outOfStock) ||
      (filterStatus === 'out' && item.outOfStock);
    
    return matchesSearch && matchesStatus;
  }) || [];

  // Calculate stats
  const totalItems = inventoryWithDetails?.length || 0;
  const lowStockItems = inventoryWithDetails?.filter(item => item.lowStock && !item.outOfStock).length || 0;
  const outOfStockItems = inventoryWithDetails?.filter(item => item.outOfStock).length || 0;
  const totalValue = inventoryWithDetails?.reduce((sum, item) => 
    sum + (item.quantityAvailable * (item.product?.price || 0)), 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 style={{ color: 'var(--primary)' }}>Inventory Management</h1>
          <p className="lead">Monitor and manage product inventory levels.</p>
        </div>
        <button
          onClick={handleSyncInventory}
          className="btn btn-secondary"
        >
          🔄 Sync with Products
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalItems}</div>
            <div className="text-sm text-gray-600">Total Items</div>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{lowStockItems}</div>
            <div className="text-sm text-gray-600">Low Stock</div>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{outOfStockItems}</div>
            <div className="text-sm text-gray-600">Out of Stock</div>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{formatPrice(totalValue)}</div>
            <div className="text-sm text-gray-600">Total Value</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by product name, origin, or grower..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'low' | 'out')}
              className="p-2 border rounded-lg"
            >
              <option value="all">All Items</option>
              <option value="low">Low Stock Only</option>
              <option value="out">Out of Stock Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="card">
        <h3 className="mb-4">Inventory Details</h3>
        {inventoryWithDetails === undefined ? (
          <div>Loading inventory...</div>
        ) : filteredInventory.length === 0 ? (
           <div>No inventory items found matching your criteria.</div>
         ) : (
          <div className="overflow-x-auto">
            {/* Table for larger screens */}
            <table className="min-w-full bg-white hidden lg:table">
              <thead>
                <tr>
                  <th className="px-4 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Origin</th>
                  <th className="px-4 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Grower</th>
                  <th className="px-4 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Value</th>
                  <th className="px-4 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map(item => (
                  <tr key={item._id.toString()} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm">
                      <div className="font-medium text-gray-900">{item.product?.name || 'Unknown Product'}</div>
                      <div className="text-xs text-gray-500">{item.product?.weight}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">{item.product?.origin || 'N/A'}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{item.grower?.name || 'Direct'}</td>
                    <td className="px-4 py-4 text-sm">
                      {editingItem === item._id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={newQuantity}
                            onChange={(e) => setNewQuantity(Number(e.target.value))}
                            className="w-20 p-1 border rounded text-sm"
                            min="0"
                          />
                          <button
                            onClick={() => handleUpdateInventory(item._id, newQuantity)}
                            className="text-green-600 hover:text-green-800 text-xs"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => setEditingItem(null)}
                            className="text-red-600 hover:text-red-800 text-xs"
                          >
                            ✗
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.quantityAvailable}</span>
                          <span className="text-xs text-gray-500">units</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.outOfStock 
                          ? 'bg-red-100 text-red-800' 
                          : item.lowStock 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.outOfStock ? 'Out of Stock' : item.lowStock ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {formatPrice(item.quantityAvailable * (item.product?.price || 0))}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      {editingItem !== item._id && (
                        <button
                          onClick={() => startEditing(item)}
                          className="text-blue-600 hover:text-blue-800 text-xs"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Card view for smaller screens */}
            <div className="lg:hidden space-y-4">
              {filteredInventory.map(item => (
                <div key={item._id.toString()} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.product?.name || 'Unknown Product'}</h4>
                      <p className="text-sm text-gray-600">{item.product?.origin} • {item.product?.weight}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.outOfStock 
                        ? 'bg-red-100 text-red-800' 
                        : item.lowStock 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {item.outOfStock ? 'Out of Stock' : item.lowStock ? 'Low Stock' : 'In Stock'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Grower:</span>
                      <div className="font-medium">{item.grower?.name || 'Direct'}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Stock:</span>
                      {editingItem === item._id ? (
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="number"
                            value={newQuantity}
                            onChange={(e) => setNewQuantity(Number(e.target.value))}
                            className="w-20 p-1 border rounded text-sm"
                            min="0"
                          />
                          <button
                            onClick={() => handleUpdateInventory(item._id, newQuantity)}
                            className="text-green-600 hover:text-green-800 text-xs"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => setEditingItem(null)}
                            className="text-red-600 hover:text-red-800 text-xs"
                          >
                            ✗
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{item.quantityAvailable} units</div>
                          <button
                            onClick={() => startEditing(item)}
                            className="text-blue-600 hover:text-blue-800 text-xs"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="text-gray-600">Value:</span>
                      <div className="font-medium">{formatPrice(item.quantityAvailable * (item.product?.price || 0))}</div>
                    </div>
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

export default AdminInventoryPage; 