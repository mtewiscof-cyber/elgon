'use client';

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { formatPrice } from '@/lib/utils';

export default function GrowerInventoryPage() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [editingInventory, setEditingInventory] = useState<string | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(0);

  // Fetch the user and grower information
  const convexUser = useQuery(api.users.getUserByUserId);
  const growerProfile = useQuery(
    api.growers.getGrowerByUserId,
    convexUser?._id ? { userId: convexUser._id } : "skip"
  );

  // Fetch products associated with this grower
  const products = useQuery(
    api.products.listProducts
  );

  // Fetch inventory for this grower
  const inventory = useQuery(
    api.inventory.getInventoryByGrower,
    growerProfile?._id ? { growerId: growerProfile._id } : "skip"
  );

  // Mutation to update inventory
  const updateInventory = useMutation(api.inventory.updateInventory);

  if (!clerkLoaded || !convexUser || !growerProfile || !products || !inventory) {
    return <div className="p-4">Loading inventory data...</div>;
  }

  // Filter products that belong to this grower
  const growerProducts = products.filter(
    product => product.growerId && product.growerId.toString() === growerProfile._id.toString()
  );

  // Get inventory items with product details
  const inventoryWithProducts = inventory.map(item => {
    const product = products.find(p => p._id.toString() === item.productId.toString());
    return {
      ...item,
      product
    };
  });

  const handleUpdateInventory = async (inventoryId: Id<"inventory">) => {
    if (newQuantity < 0) return;
    
    await updateInventory({
      inventoryId,
      quantityAvailable: newQuantity
    });
    
    setEditingInventory(null);
    setNewQuantity(0);
  };

  const toggleExpand = (productId: string) => {
    if (expandedProduct === productId) {
      setExpandedProduct(null);
    } else {
      setExpandedProduct(productId);
    }
  };

  const startEditing = (inventoryId: string, currentQuantity: number) => {
    setEditingInventory(inventoryId);
    setNewQuantity(currentQuantity);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Inventory</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Coffee Products</h2>
        </div>
        
        {inventoryWithProducts.length === 0 ? (
          <p className="text-gray-600">You don't have any products in your inventory yet.</p>
        ) : (
          <div className="space-y-4">
            {inventoryWithProducts.map((item) => (
              <div 
                key={item._id.toString()} 
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <div 
                  className="flex justify-between items-center p-4 cursor-pointer bg-gray-50"
                  onClick={() => toggleExpand(item._id.toString())}
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product?.name || 'Unknown Product'}</h3>
                    <p className="text-sm text-gray-600">
                      Stock: {item.quantityAvailable} units
                    </p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800">
                    {expandedProduct === item._id.toString() ? 'Hide Details' : 'Show Details'}
                  </button>
                </div>
                
                {expandedProduct === item._id.toString() && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-600">Product Name</p>
                        <p className="font-medium">{item.product?.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Origin</p>
                        <p className="font-medium">{item.product?.origin}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Price</p>
                        <p className="font-medium">{formatPrice(item.product?.price)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Weight</p>
                        <p className="font-medium">{item.product?.weight}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-600">Description</p>
                      <p>{item.product?.description}</p>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-600">Tasting Notes</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {item.product?.tastingNotes.map((note, index) => (
                          <span 
                            key={index} 
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-600">Certifications</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {item.product?.certifications.map((cert, index) => (
                          <span 
                            key={index} 
                            className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm"
                          >
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-gray-600 mb-2">Update Inventory</p>
                      
                      {editingInventory === item._id.toString() ? (
                        <div className="flex gap-2">
                          <input
                            type="number"
                            className="border border-gray-300 rounded px-3 py-2 w-24"
                            value={newQuantity}
                            min={0}
                            onChange={(e) => setNewQuantity(parseInt(e.target.value) || 0)}
                          />
                          <button
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            onClick={() => handleUpdateInventory(item._id)}
                          >
                            Save
                          </button>
                          <button
                            className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
                            onClick={() => setEditingInventory(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                          onClick={() => startEditing(item._id.toString(), item.quantityAvailable)}
                        >
                          Update Quantity
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 