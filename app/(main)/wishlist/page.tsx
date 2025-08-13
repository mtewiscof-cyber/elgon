"use client";

import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { slugify } from "@/lib/utils";

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
    const product = products.find((p: any) => p._id === item.productId);
    const href = product ? `/products/${slugify(product.name)}` : `/products/${item.productId}`;
    return (
        <li className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="w-14 h-14 relative rounded bg-gray-100 overflow-hidden">
                    {product?.imageUrl && (
                        <Image src={product.imageUrl} alt={product?.name || 'Product'} fill className="object-contain p-1" />
                    )}
                </div>
                <Link href={href} className="text-sm font-medium">{product?.name || 'Product'}</Link>
            </div>
            <button onClick={() => toggleWishlist({ productId: item.productId })} className="text-red-600 text-sm">Remove</button>
        </li>
    );
}


