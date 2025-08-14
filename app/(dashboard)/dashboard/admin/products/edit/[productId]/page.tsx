'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import ProductForm from "../../_components/ProductForm";
import { Id } from '@/convex/_generated/dataModel';
import { useQuery as useConvexQuery } from 'convex/react';
import { api as convexApi } from '@/convex/_generated/api';

export default function EditProductPage() {
  const router = useRouter();
  const { productId } = useParams() as { productId: string };
  const user = useQuery(api.users.getUserByUserId);
  const isUserLoaded = user !== undefined;
  const growers = useConvexQuery(convexApi.growers.listGrowers) || [];
  const updateProduct = useMutation(api.products.updateProduct);
  const product = useQuery(
    api.products.getProductById,
    productId ? { productId: productId as Id<'products'> } : 'skip'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isUserLoaded) {
      if (user?.role !== 'admin') {
        router.push('/');
      }
    }
  }, [isUserLoaded, user, router]);

  if (!isUserLoaded || !product || !growers) {
    return <div className="container section">Loading...</div>;
  }

  const initialValues = {
    name: product.name || '',
    description: product.description || '',
    origin: product.origin || '',
    tastingNotes: product.tastingNotes || [],
    certifications: product.certifications || [],
    price: product.price || 0,
    weight: product.weight || '',
    stock: product.stock || 0,
    imageUrl: product.imageUrl || '',
    growerId: product.growerId ? product.growerId.toString() : '',
    featured: product.featured || false,
  };

  const handleSubmit = async (data: typeof initialValues) => {
    setIsSubmitting(true);
    try {
      await updateProduct({
        productId: productId as Id<'products'>,
        ...data,
        growerId: data.growerId ? data.growerId as any : undefined,
      });
      toast.success('Product updated successfully!');
      setTimeout(() => {
        router.push('/dashboard/admin/products');
      }, 1000);
    } catch (error) {
      toast.error('Failed to update product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
      <ProductForm
        initialValues={initialValues}
        growers={growers}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        mode="edit"
      />
    </div>
  );
} 