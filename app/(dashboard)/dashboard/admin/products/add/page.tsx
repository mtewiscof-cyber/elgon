'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { UploadButton } from "@/utils/uploadthing";

export default function AddProductPage() {
  const router = useRouter();
  
  // Fetch the user document from Convex to get the role
  const user = useQuery(api.users.getUserByUserId);
  const isUserLoaded = user !== undefined;
  
  // Fetch growers for the dropdown
  const growers = useQuery(api.growers.listGrowers) || [];

  // Mutation to create a product
  const createProduct = useMutation(api.products.createProduct);
  
  // Form state
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    origin: "",
    tastingNotes: [] as string[],
    certifications: [] as string[],
    price: 0,
    weight: "",
    stock: 0,
    imageUrl: "",
    growerId: ""
  });
  
  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempTastingNote, setTempTastingNote] = useState("");
  const [tempCertification, setTempCertification] = useState("");
  
  // Redirect if user data is loaded and user is not an admin
  useEffect(() => {
    if (isUserLoaded) {
      if (user?.role !== 'admin') {
        router.push('/');
      }
    }
  }, [isUserLoaded, user, router]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? parseFloat(value) : value
    }));
  };
  
  // Handle adding tasting notes
  const handleAddTastingNote = () => {
    if (tempTastingNote.trim()) {
      setProductData(prev => ({
        ...prev,
        tastingNotes: [...prev.tastingNotes, tempTastingNote.trim()]
      }));
      setTempTastingNote("");
    }
  };
  
  // Handle removing tasting notes
  const handleRemoveTastingNote = (index: number) => {
    setProductData(prev => ({
      ...prev,
      tastingNotes: prev.tastingNotes.filter((_, i) => i !== index)
    }));
  };
  
  // Handle adding certifications
  const handleAddCertification = () => {
    if (tempCertification.trim()) {
      setProductData(prev => ({
        ...prev,
        certifications: [...prev.certifications, tempCertification.trim()]
      }));
      setTempCertification("");
    }
  };
  
  // Handle removing certifications
  const handleRemoveCertification = (index: number) => {
    setProductData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form data
    if (!productData.name || !productData.description || !productData.origin || 
        !productData.price || !productData.weight || !productData.imageUrl) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create the product in Convex
      const result = await createProduct({
        name: productData.name,
        description: productData.description,
        origin: productData.origin,
        tastingNotes: productData.tastingNotes,
        certifications: productData.certifications,
        price: productData.price,
        weight: productData.weight,
        imageUrl: productData.imageUrl,
        stock: productData.stock,
        growerId: productData.growerId ? productData.growerId as any : undefined
      });
      
      // If we successfully created the product
      if (result) {
        toast.success("Product created successfully!");
        
        // Navigate back to the products page
        setTimeout(() => {
          router.push("/dashboard/admin/products");
        }, 1000); // Small delay to ensure the toast is seen
      } else {
        // Something went wrong but no error was thrown
        toast.error("Failed to create product. Please try again.");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Redirect if user is not an admin
  if (isUserLoaded && user?.role !== 'admin') {
    return <div className="container section">Access Denied. You are not an admin.</div>;
  }
  
  // Show loading if user data is not loaded yet
  if (!isUserLoaded) {
    return <div className="container section">Loading...</div>;
  }
  
  return (
    <div className="container section">
      <h1 className="text-2xl font-bold mb-6">Add New Coffee Product</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={productData.name}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Origin *
              </label>
              <input
                type="text"
                name="origin"
                value={productData.origin}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={productData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        
        {/* Product Details */}
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <h2 className="text-lg font-semibold mb-4">Product Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (USD) *
              </label>
              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                value={productData.price || ""}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight *
              </label>
              <input
                type="text"
                name="weight"
                value={productData.weight}
                onChange={handleInputChange}
                placeholder="e.g., 12 oz, 1 lb"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initial Stock *
              </label>
              <input
                type="number"
                name="stock"
                min="0"
                step="1"
                value={productData.stock || ""}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grower
            </label>
            <select
              name="growerId"
              value={productData.growerId}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a grower (optional)</option>
              {growers.map(grower => (
                <option key={grower._id.toString()} value={grower._id.toString()}>
                  {grower.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Tasting Notes & Certifications */}
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <h2 className="text-lg font-semibold mb-4">Tasting Notes & Certifications</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tasting Notes
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={tempTastingNote}
                onChange={(e) => setTempTastingNote(e.target.value)}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a tasting note"
              />
              <button
                type="button"
                onClick={handleAddTastingNote}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {productData.tastingNotes.map((note, index) => (
                <span key={index} className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  {note}
                  <button
                    type="button"
                    onClick={() => handleRemoveTastingNote(index)}
                    className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Certifications
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={tempCertification}
                onChange={(e) => setTempCertification(e.target.value)}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a certification"
              />
              <button
                type="button"
                onClick={handleAddCertification}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {productData.certifications.map((cert, index) => (
                <span key={index} className="inline-flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                  {cert}
                  <button
                    type="button"
                    onClick={() => handleRemoveCertification(index)}
                    className="ml-1 text-green-500 hover:text-green-700 focus:outline-none"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Product Image */}
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <h2 className="text-lg font-semibold mb-4">Product Image</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Product Image *
            </label>
            
            {productData.imageUrl ? (
              <div className="mb-4">
                <div className="relative w-40 h-40 rounded-md overflow-hidden">
                  <img 
                    src={productData.imageUrl} 
                    alt="Product preview" 
                    className="object-cover w-full h-full" 
                  />
                  <button
                    type="button"
                    onClick={() => setProductData(prev => ({ ...prev, imageUrl: "" }))}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                  >
                    &times;
                  </button>
                </div>
              </div>
            ) : (
              <UploadButton
                endpoint="productImage"
                onClientUploadComplete={(res) => {
                  if (res && res[0]) {
                    setProductData(prev => ({ ...prev, imageUrl: res[0].url }));
                    toast.success("Image uploaded successfully!");
                  }
                }}
                onUploadError={(error: Error) => {
                  toast.error(`Error uploading image: ${error.message}`);
                }}
                config={{
                  mode: "auto"
                }}
              />
            )}
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.push("/dashboard/admin/products")}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md mr-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400"
          >
            {isSubmitting ? "Creating..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
} 