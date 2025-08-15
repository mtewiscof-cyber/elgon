"use client";

import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatPrice } from "@/lib/utils";
import { useMemo } from "react";
import Image from "next/image";
import { useQuery as useConvexQuery } from "convex/react";
import AuthGuard from "@/components/AuthGuard";

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
		<main className="min-h-[60vh] container mx-auto px-4 pb-16 pt-32 md:pt-72">
			<div className="mb-8 pt-16">
				<h1 className="text-3xl font-semibold text-gray-900">Your Cart</h1>
				<p className="text-gray-600 mt-2">Review your items and proceed to checkout.</p>
			</div>

			<AuthGuard
				fallback={
					<div className="max-w-2xl mx-auto">
						<div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-8 text-center">
							<div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
								<svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
								</svg>
							</div>
							<h2 className="text-xl font-semibold text-gray-900 mb-3">Your cart is waiting for you</h2>
							<p className="text-gray-600 mb-6">
								Sign in to view your cart items, manage quantities, and proceed to checkout.
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
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Cart items */}
					<div className="lg:col-span-2">
						<div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
							{cart.length === 0 ? (
								<div className="p-8 text-center text-gray-600">
									<p className="mb-6 text-lg">Your cart is currently empty.</p>
									<div className="flex items-center justify-center gap-3">
										<Link href="/products" className="inline-flex items-center px-6 py-3 bg-amber-100 text-amber-900 rounded-full font-medium text-sm hover:bg-amber-200 transition-colors duration-200">Browse products</Link>
									</div>
								</div>
							) : (
								<ul className="divide-y divide-gray-100">
									{cart.map((item: any) => {
										const product = products.find((p: any) => p._id === item.productId);
										const imageSrc = product?.imageUrl 
											? Array.isArray(product.imageUrl) 
												? (product.imageUrl[0] || '/coffee1.jpg') 
												: (product.imageUrl || '/coffee1.jpg')
											: '/coffee1.jpg';
										return (
										<li key={item._id} className="p-6 flex items-center gap-4">
											<div className="w-20 h-20 rounded-lg bg-gray-100 relative overflow-hidden flex-shrink-0">
												<Image src={imageSrc} alt={product?.name || 'Product'} fill className="object-contain p-2" />
											</div>
											<div className="flex-1 min-w-0">
												<h3 className="font-semibold text-gray-900 text-lg mb-1">{product?.name || 'Product'}</h3>
												<div className="text-sm text-gray-500 mb-3">Qty: {item.quantity}</div>
												<div className="text-lg font-medium text-gray-900">{formatPrice((product?.price || 0) * item.quantity)}</div>
											</div>
											<div className="flex items-center gap-3 flex-shrink-0">
												<div className="flex items-center border border-gray-300 rounded-full">
													<button 
														onClick={() => updateCartItem({ cartItemId: item._id, quantity: Math.max(1, item.quantity - 1) })} 
														className="w-8 h-8 rounded-l-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
													>
														−
													</button>
													<span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
													<button 
														onClick={() => updateCartItem({ cartItemId: item._id, quantity: item.quantity + 1 })} 
														className="w-8 h-8 rounded-r-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
													>
														+
													</button>
												</div>
												<button 
													onClick={() => removeFromCart({ cartItemId: item._id })} 
													className="text-red-600 text-sm hover:text-red-700 transition-colors font-medium"
												>
													Remove
												</button>
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
						<div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 sticky top-24">
							<h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
							<div className="space-y-4 text-sm">
								<div className="flex justify-between items-center">
									<span className="text-gray-600">Subtotal</span>
									<span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-gray-600">Shipping</span>
									<span className="text-gray-600">Calculated at checkout</span>
								</div>
								<div className="flex justify-between items-center pt-4 border-t border-gray-200">
									<span className="text-lg font-semibold text-gray-900">Total</span>
									<span className="text-xl font-bold text-gray-900">{formatPrice(subtotal)}</span>
								</div>
							</div>
							<Link 
								href="/checkout" 
								className="mt-6 w-full inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold text-sm bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors duration-200 shadow-sm"
							>
								Proceed to checkout
							</Link>
						</div>
					</aside>
				</div>
			</AuthGuard>
		</main>
	);
}


