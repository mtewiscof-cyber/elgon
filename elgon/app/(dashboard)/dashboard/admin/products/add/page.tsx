'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import ProductForm from "../_components/ProductForm";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Redirect if user data is loaded and user is not an admin
  useEffect(() => {
    if (isUserLoaded) {
      if (user?.role !== 'admin') {
        router.push('/');
      }
    }
  }, [isUserLoaded, user, router]);
  
  // Prepare initial values for the form
  const initialValues = {
    name: "",
    description: "",
    origin: "",
    tastingNotes: [],
    certifications: [],
    price: 0,
    weight: "",
    stock: 0,
    imageUrl: "",
    growerId: "",
    featured: false,
  };
  // Handle form submission
  const handleSubmit = async (data: typeof initialValues) => {
    if (!data.name || !data.description || !data.origin || !data.price || !data.weight || !data.imageUrl) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      setIsSubmitting(true);
      const result = await createProduct({
        ...data,
        growerId: data.growerId ? data.growerId as any : undefined,
      });
      if (result) {
        toast.success("Product created successfully!");
        setTimeout(() => {
          router.push("/dashboard/admin/products");
        }, 1000);
      } else {
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
      <ProductForm
        initialValues={initialValues}
        growers={growers}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        mode="add"
      />
    </div>
  );
} 