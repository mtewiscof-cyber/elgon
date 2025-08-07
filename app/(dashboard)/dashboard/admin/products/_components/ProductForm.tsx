import { useState } from "react";
import { UploadButton } from "@/utils/uploadthing";
import { toast } from "sonner";

export interface ProductFormProps {
  initialValues: {
    name: string;
    description: string;
    origin: string;
    tastingNotes: string[];
    certifications: string[];
    price: number;
    weight: string;
    stock: number;
    imageUrl: string;
    growerId: string;
    featured: boolean;
  };
  growers: Array<{ _id: string; name: string }>;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
  mode: "add" | "edit";
}

export default function ProductForm({ initialValues, growers, onSubmit, isSubmitting, mode }: ProductFormProps) {
  const [productData, setProductData] = useState(initialValues);
  const [tempTastingNote, setTempTastingNote] = useState("");
  const [tempCertification, setTempCertification] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox" && e.target instanceof HTMLInputElement) {
      setProductData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else {
      setProductData(prev => ({
        ...prev,
        [name]: name === "price" || name === "stock" ? parseFloat(value) : value
      }));
    }
  };

  const handleAddTastingNote = () => {
    if (tempTastingNote.trim()) {
      setProductData(prev => ({
        ...prev,
        tastingNotes: [...prev.tastingNotes, tempTastingNote.trim()]
      }));
      setTempTastingNote("");
    }
  };
  const handleRemoveTastingNote = (index: number) => {
    setProductData(prev => ({
      ...prev,
      tastingNotes: prev.tastingNotes.filter((_, i) => i !== index)
    }));
  };
  const handleAddCertification = () => {
    if (tempCertification.trim()) {
      setProductData(prev => ({
        ...prev,
        certifications: [...prev.certifications, tempCertification.trim()]
      }));
      setTempCertification("");
    }
  };
  const handleRemoveCertification = (index: number) => {
    setProductData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (res: any) => {
    if (res && res[0]) {
      setProductData(prev => ({ ...prev, imageUrl: res[0].url }));
      toast.success("Image uploaded successfully!");
    }
  };

  const handleImageRemove = () => {
    setProductData(prev => ({ ...prev, imageUrl: "" }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSubmit(productData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <input type="text" name="name" value={productData.name} onChange={handleInputChange} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Origin *</label>
            <input type="text" name="origin" value={productData.origin} onChange={handleInputChange} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea name="description" value={productData.description} onChange={handleInputChange} rows={4} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
      </div>
      {/* Product Details */}
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h2 className="text-lg font-semibold mb-4">Product Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (UGX) *</label>
            <input type="number" name="price" min="0" step="1" value={productData.price || ""} onChange={handleInputChange} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight *</label>
            <input type="text" name="weight" value={productData.weight} onChange={handleInputChange} placeholder="e.g., 12 oz, 1 lb" className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Initial Stock *</label>
            <input type="number" name="stock" min="0" step="1" value={productData.stock || ""} onChange={handleInputChange} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Grower</label>
          <select name="growerId" value={productData.growerId} onChange={handleInputChange} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select a grower (optional)</option>
            {growers.map(grower => (
              <option key={grower._id} value={grower._id}>{grower.name}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center mt-2">
          <input type="checkbox" name="featured" checked={productData.featured} onChange={handleInputChange} id="featured" className="mr-2" />
          <label htmlFor="featured" className="text-sm font-medium text-gray-700">Featured Product</label>
        </div>
      </div>
      {/* Tasting Notes & Certifications */}
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h2 className="text-lg font-semibold mb-4">Tasting Notes & Certifications</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tasting Notes</label>
          <div className="flex space-x-2">
            <input type="text" value={tempTastingNote} onChange={e => setTempTastingNote(e.target.value)} className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Add a tasting note" />
            <button type="button" onClick={handleAddTastingNote} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Add</button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {productData.tastingNotes.map((note, index) => (
              <span key={index} className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                {note}
                <button type="button" onClick={() => handleRemoveTastingNote(index)} className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none">&times;</button>
              </span>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Certifications</label>
          <div className="flex space-x-2">
            <input type="text" value={tempCertification} onChange={e => setTempCertification(e.target.value)} className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Add a certification" />
            <button type="button" onClick={handleAddCertification} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Add</button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {productData.certifications.map((cert, index) => (
              <span key={index} className="inline-flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                {cert}
                <button type="button" onClick={() => handleRemoveCertification(index)} className="ml-1 text-green-500 hover:text-green-700 focus:outline-none">&times;</button>
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* Product Image */}
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h2 className="text-lg font-semibold mb-4">Product Image</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Product Image *</label>
          {productData.imageUrl ? (
            <div className="mb-4">
              <div className="relative w-40 h-40 rounded-md overflow-hidden">
                <img src={productData.imageUrl} alt="Product preview" className="object-cover w-full h-full" />
                <button type="button" onClick={handleImageRemove} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none">&times;</button>
              </div>
            </div>
          ) : (
            <UploadButton
              endpoint="productImage"
              onClientUploadComplete={handleImageUpload}
              onUploadError={error => { toast.error(`Error uploading image: ${error.message}`); }}
              config={{ mode: "auto" }}
            />
          )}
        </div>
      </div>
      {/* Submit Button */}
      <div className="flex justify-end">
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400">
          {isSubmitting ? (mode === "add" ? "Creating..." : "Updating...") : (mode === "add" ? "Create Product" : "Update Product")}
        </button>
      </div>
    </form>
  );
} 