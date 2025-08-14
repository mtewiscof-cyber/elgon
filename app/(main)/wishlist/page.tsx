"use client";

import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { slugify, formatPrice } from "@/lib/utils";

export default function WishlistPage() {
	const wishlist = useQuery(api.wishlist.getWishlist) || [];
	const toggleWishlist = useMutation(api.wishlist.toggleWishlist);

	return (
		<main className="min-h-[60vh] container mx-auto px-4 pb-16 pt-24 md:pt-44">
			<div className="mb-8">
				<h1 className="text-3xl font-semibold">Your Wishlist</h1>
				<p className="text-gray-600">Items you saved for later.</p>
			</div>
            <div className="rounded-2xl border bg-white dark:bg-black/40">
				{wishlist.length === 0 ? (
					<div className="p-6 text-center text-gray-600">
						<p className="mb-6">Your wishlist is empty.</p>
						<Link href="/products" className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-900 rounded-full font-medium text-sm hover:bg-amber-200 transition-colors duration-200">Browse products</Link>
					</div>
                ) : (
                    <ul className="divide-y">
                        {wishlist.map((item: any) => (
                            <WishlistRow key={item._id} item={item} />
                        ))}
                    </ul>
                )}
			</div>
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
        <li className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
                <div className="w-14 h-14 relative rounded bg-gray-100 overflow-hidden">
                    <Image src={imageSrc} alt={product?.name || 'Product'} fill className="object-contain p-1" />
                </div>
                <div className="flex-1">
                    <Link href={href} className="text-sm font-medium hover:text-amber-700 transition-colors">
                        {product?.name || 'Product'}
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">
                        {product?.price ? formatPrice(product.price) : 'Price unavailable'}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button 
                    onClick={handleAddToCart}
                    className="px-3 py-1.5 bg-amber-100 text-amber-900 rounded-full text-xs font-medium hover:bg-amber-200 transition-colors"
                >
                    Add to Cart
                </button>
                <button 
                    onClick={() => toggleWishlist({ productId: item.productId })} 
                    className="text-red-600 text-xs hover:text-red-700 transition-colors"
                >
                    Remove
                </button>
            </div>
        </li>
    );
}


