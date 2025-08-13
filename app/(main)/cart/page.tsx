"use client";

import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatPrice } from "@/lib/utils";
import { useMemo } from "react";
import Image from "next/image";
import { useQuery as useConvexQuery } from "convex/react";

export default function CartPage() {
	const cart = useQuery(api.cart.getCart) || [];
	const products = useConvexQuery(api.products.listProducts) || [];
	const updateCartItem = useMutation(api.cart.updateCartItem);
	const removeFromCart = useMutation(api.cart.removeFromCart);

    const subtotal = useMemo(() => {
        return cart.reduce((sum: number, item: any) => {
            const product = products.find((p: any) => p._id === item.productId);
            const price = product?.price || 0;
            return sum + price * item.quantity;
        }, 0);
    }, [cart, products]);

	return (
		<main className="min-h-[60vh] container mx-auto px-4 pb-16 pt-24 md:pt-44">
			<div className="mb-8">
				<h1 className="text-3xl font-semibold">Your Cart</h1>
				<p className="text-gray-600">Review your items and proceed to checkout.</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Cart items */}
				<div className="lg:col-span-2">
					<div className="rounded-2xl border bg-white dark:bg-black/40">
						{cart.length === 0 ? (
							<div className="p-6 text-center text-gray-600">
								<p className="mb-6">Your cart is currently empty.</p>
								<div className="flex items-center justify-center gap-3">
									<Link href="/products" className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-900 rounded-full font-medium text-sm hover:bg-amber-200 transition-colors duration-200">Browse products</Link>
								</div>
							</div>
						) : (
							<ul className="divide-y">
                                {cart.map((item: any) => {
                                    const product = products.find((p: any) => p._id === item.productId);
                                    return (
                                    <li key={item._id} className="p-4 flex items-center gap-4">
                                        <div className="w-16 h-16 rounded bg-gray-100 relative overflow-hidden">
                                            {product?.imageUrl && (
                                                <Image src={product.imageUrl} alt={product?.name || 'Product'} fill className="object-contain p-1" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">{product?.name || 'Product'}</p>
                                            <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                                        </div>
										<div className="flex items-center gap-2">
											<button onClick={() => updateCartItem({ cartItemId: item._id, quantity: Math.max(1, item.quantity - 1) })} className="w-8 h-8 rounded-full border">-</button>
											<button onClick={() => updateCartItem({ cartItemId: item._id, quantity: item.quantity + 1 })} className="w-8 h-8 rounded-full border">+</button>
											<button onClick={() => removeFromCart({ cartItemId: item._id })} className="text-red-600 text-sm">Remove</button>
										</div>
									</li>
                                    )
                                })}
							</ul>
						)}
					</div>
				</div>

				{/* Order summary */}
				<aside className="lg:col-span-1">
					<div className="rounded-2xl border bg-white dark:bg-black/40 p-6">
						<h2 className="text-lg font-semibold mb-4">Order Summary</h2>
						<div className="space-y-2 text-sm text-gray-600">
							<div className="flex justify-between">
								<span>Subtotal</span>
								<span>{formatPrice(subtotal)}</span>
							</div>
							<div className="flex justify-between">
								<span>Shipping</span>
								<span>Calculated at checkout</span>
							</div>
							<div className="flex justify-between font-medium pt-2 border-t">
								<span>Total</span>
								<span>{formatPrice(subtotal)}</span>
							</div>
						</div>
						<Link href="/checkout" className="mt-6 w-full inline-flex items-center justify-center px-4 py-2 rounded-full font-medium text-sm bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors duration-200">
							Proceed to checkout
						</Link>
					</div>
				</aside>
			</div>
		</main>
	);
}


