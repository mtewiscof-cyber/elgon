"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useMemo } from "react";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import AuthGuard from "@/components/AuthGuard";
import Link from "next/link";

export default function CheckoutPage() {
  const { user } = useUser();
  const router = useRouter();
  const cart = useQuery(api.cart.getCart) || [];
  const products = useQuery(api.products.listProducts) || [];
  const createOrder = useMutation(api.orders.createOrder);
  const clearCart = useMutation(api.cart.clearCart);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    name: user?.fullName || "",
    email: user?.emailAddresses?.[0]?.emailAddress || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "Uganda",
    zipCode: "",
  });

  const cartItems = useMemo(() => {
    return cart.map(item => {
      const product = products.find(p => p._id === item.productId);
      return {
        ...item,
        product,
        total: (product?.price || 0) * item.quantity
      };
    });
  }, [cart, products]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.total, 0);
  }, [cartItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsProcessing(true);
    try {
      const orderItems = cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.product?.price || 0,
      }));

      // The createOrder mutation will handle getting the user ID from auth context
      await createOrder({
        items: orderItems,
        totalAmount: subtotal,
        shippingAddress: {
          name: shippingInfo.name,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          country: shippingInfo.country,
          zipCode: shippingInfo.zipCode,
        },
        status: "pending",
        paymentStatus: "pending",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      await clearCart();
      router.push("/dashboard/customer/orders");
    } catch (error) {
      console.error("Order creation failed:", error);
      alert("Failed to create order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen container mx-auto px-4 pb-16 pt-24 md:pt-44">
      <div className="mb-8 pt-20">
        <h1 className="text-3xl font-semibold">Checkout</h1>
        <p className="text-gray-600">Complete your order</p>
      </div>

      <AuthGuard
        fallback={
          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-8 text-center">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Sign in to checkout</h2>
              <p className="text-gray-600 mb-6">
                Please sign in to complete your purchase and manage your orders.
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
        {cart.length === 0 ? (
          <div className="text-center">
            <h1 className="text-3xl font-semibold mb-4">Checkout</h1>
            <p className="text-gray-600 mb-8">Your cart is empty.</p>
            <a href="/products" className="inline-flex items-center px-6 py-3 bg-amber-100 text-amber-900 rounded-full font-medium hover:bg-amber-200 transition-colors">
              Browse Products
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Shipping Form */}
            <div className="rounded-2xl border bg-white p-6">
              <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.name}
                      onChange={e => setShippingInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={shippingInfo.email}
                      onChange={e => setShippingInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    required
                    value={shippingInfo.phone}
                    onChange={e => setShippingInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.address}
                    onChange={e => setShippingInfo(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.city}
                      onChange={e => setShippingInfo(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State/Region</label>
                    <input
                      type="text"
                      required
                      value={shippingInfo.state}
                      onChange={e => setShippingInfo(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">ZIP Code</label>
                    <input
                      type="text"
                      value={shippingInfo.zipCode}
                      onChange={e => setShippingInfo(prev => ({ ...prev, zipCode: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Country</label>
                  <select
                    required
                    value={shippingInfo.country}
                    onChange={e => setShippingInfo(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="Uganda">Uganda</option>
                    <option value="Tanzania">Tanzania</option>
                    <option value="Rwanda">Rwanda</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full mt-6 px-6 py-3 bg-amber-100 text-amber-900 rounded-full font-medium hover:bg-amber-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Processing..." : `Place Order - ${formatPrice(subtotal)}`}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="rounded-2xl border bg-white p-6">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map(item => {
                  const imageSrc = item.product?.imageUrl 
                    ? Array.isArray(item.product.imageUrl) 
                      ? (item.product.imageUrl[0] || '/coffee1.jpg') 
                      : (item.product.imageUrl || '/coffee1.jpg')
                    : '/coffee1.jpg';
                  
                  return (
                    <div key={item._id} className="flex items-center gap-3 pb-4 border-b border-gray-100 last:border-b-0">
                      <div className="w-12 h-12 rounded bg-gray-100 relative overflow-hidden">
                        <Image src={imageSrc} alt={item.product?.name || 'Product'} fill className="object-contain p-1" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product?.name || 'Product'}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-sm">{formatPrice(item.total)}</p>
                    </div>
                  );
                })}
              </div>
              
              <div className="space-y-2 text-sm border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2 border-t">
                  <span>Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </AuthGuard>
    </main>
  );
}
