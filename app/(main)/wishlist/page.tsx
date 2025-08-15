"use client";

import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { slugify, formatPrice } from "@/lib/utils";
import AuthGuard from "@/components/AuthGuard";

export default function WishlistPage() {
	const wishlist = useQuery(api.wishlist.getWishlist) || [];
	const toggleWishlist = useMutation(api.wishlist.toggleWishlist);

	return (
		<main className="min-h-[60vh] container mx-auto px-4 pb-16 pt-32 md:pt-72">
			<div className="mb-8 pt-16">
				<h1 className="text-3xl font-semibold text-gray-900">Your Wishlist</h1>
				<p className="text-gray-600 mt-2">Items you saved for later.</p>
			</div>
            
            <AuthGuard
                fallback={
                    <div className="max-w-2xl mx-auto">
                        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-8 text-center">
                            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Your wishlist is waiting for you</h2>
                            <p className="text-gray-600 mb-6">
                                Sign in to view your saved items, add them to cart, and manage your wishlist.
                            </p>
                            <div className="space-y-3">
                                <Link 
                                    href="/products" 
                                    className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-medium text-sm hover:bg-gray-200 transition-colors duration-200"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                }
            >
                <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                    {wishlist.length === 0 ? (
                        <div className="p-8 text-center text-gray-600">
                            <p className="mb-6 text-lg">Your wishlist is empty.</p>
                            <Link href="/products" className="inline-flex items-center px-6 py-3 bg-amber-100 text-amber-900 rounded-full font-medium text-sm hover:bg-amber-200 transition-colors duration-200">Browse products</Link>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {wishlist.map((item: any) => (
                                <WishlistRow key={item._id} item={item} />
                            ))}
                        </ul>
                    )}
                </div>
            </AuthGuard>
		</main>
	);
}

function WishlistRow({ item }: { item: any }) {
    const products = useQuery(api.products.listProducts) || [];
    const toggleWishlist = useMutation(api.wishlist.toggleWishlist);
    const addToCart = useMutation(api.cart.addToCart);
    const product = products.find((p: any) => p._id === item.productId);
    const href = product ? `/products/${slugify(product.name)}` : `/products/${item.productId}`;
    const imageSrc: string = product?.imageUrl 
        ? Array.isArray(product.imageUrl) 
            ? (product.imageUrl[0] || '/coffee1.jpg') 
            : (product.imageUrl || '/coffee1.jpg')
        : '/coffee1.jpg';

    const handleAddToCart = async () => {
        try {
            await addToCart({ productId: item.productId, quantity: 1 });
            // Remove from wishlist after successfully adding to cart
            await toggleWishlist({ productId: item.productId });
        } catch (error) {
            console.error("Failed to add to cart:", error);
        }
    };

    return (
        <li className="p-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
                <div className="w-20 h-20 relative rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    <Image src={imageSrc} alt={product?.name || 'Product'} fill className="object-contain p-2" />
                </div>
                <div className="flex-1 min-w-0">
                    <Link href={href} className="text-lg font-semibold text-gray-900 hover:text-amber-700 transition-colors block mb-2">
                        {product?.name || 'Product'}
                    </Link>
                    <p className="text-lg font-medium text-gray-900">
                        {product?.price ? formatPrice(product.price) : 'Price unavailable'}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
                <button 
                    onClick={handleAddToCart}
                    className="px-4 py-2 bg-amber-100 text-amber-900 rounded-full text-sm font-medium hover:bg-amber-200 transition-colors"
                >
                    Add to Cart
                </button>
                <button 
                    onClick={() => toggleWishlist({ productId: item.productId })} 
                    className="text-red-600 text-sm hover:text-red-700 transition-colors font-medium"
                >
                    Remove
                </button>
            </div>
        </li>
    );
}


