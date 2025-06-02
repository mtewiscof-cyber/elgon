"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";

// Order Form Component
interface OrderFormProps {
  product: any;
  onClose: () => void;
  onOrderSuccess: () => void;
}

function OrderForm({ product, onClose, onOrderSuccess }: OrderFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Uganda'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const user = useQuery(api.users.getUserByUserId);
  const createOrder = useMutation(api.orders.createOrder);

  const totalAmount = product.price * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      await createOrder({
        userId: user._id,
        items: [{
          productId: product._id,
          quantity,
          priceAtPurchase: product.price
        }],
        totalAmount,
        shippingAddress,
        status: "pending",
        paymentStatus: "pending",
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      
      onOrderSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to create order:", error);
      alert("Failed to create order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Place Order</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold">{product.name}</h4>
            <p className="text-sm text-gray-600">{product.origin}</p>
            <p className="font-bold">${product.price.toFixed(2)} / {product.weight}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full p-2 border rounded-lg"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Available: {product.stock}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Shipping Information</h4>
              
              <input
                type="text"
                placeholder="Full Name"
                value={shippingAddress.name}
                onChange={(e) => setShippingAddress(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                required
              />

              <input
                type="email"
                placeholder="Email Address"
                value={shippingAddress.email}
                onChange={(e) => setShippingAddress(prev => ({ ...prev, email: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                required
              />

              <input
                type="tel"
                placeholder="Phone Number"
                value={shippingAddress.phone}
                onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                required
              />
              
              <input
                type="text"
                placeholder="Street Address"
                value={shippingAddress.address}
                onChange={(e) => setShippingAddress(prev => ({ ...prev, address: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                required
              />
              
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="City"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                  className="p-2 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="State"
                  value={shippingAddress.state}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                  className="p-2 border rounded-lg"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={shippingAddress.zipCode}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                  className="p-2 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={shippingAddress.country}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, country: e.target.value }))}
                  className="p-2 border rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Total:</span>
                <span className="text-xl font-bold">${totalAmount.toFixed(2)}</span>
              </div>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  disabled={isSubmitting || quantity > product.stock}
                >
                  {isSubmitting ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Message Form Component
interface MessageFormProps {
  product: any;
  grower: any;
  onClose: () => void;
  onMessageSuccess: () => void;
}

function MessageForm({ product, grower, onClose, onMessageSuccess }: MessageFormProps) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const user = useQuery(api.users.getUserByUserId);
  const sendMessage = useMutation(api.messages.sendMessage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !grower?.userId) return;

    setIsSubmitting(true);
    try {
      await sendMessage({
        senderId: user._id,
        recipientId: grower.userId,
        content: `Regarding product "${product.name}": ${message}`,
        sentAt: Date.now()
      });
      
      onMessageSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Message Grower</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold">About: {product.name}</h4>
            <p className="text-sm text-gray-600">To: {grower?.name || 'Grower'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Your Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask questions about the coffee, farming practices, or anything else..."
                rows={4}
                className="w-full p-3 border rounded-lg resize-none"
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                disabled={isSubmitting || !message.trim()}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const productId = params.id as string;
  
  // State for loading and modals
  const [isLoading, setIsLoading] = useState(true);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);
  
  // Fetch user data
  const user = useQuery(api.users.getUserByUserId);
  
  // Fetch product data
  const product = useQuery(api.products.getProductById, { 
    productId: productId as Id<"products"> 
  });
  
  // Fetch grower data (if product has a grower)
  const grower = useQuery(
    api.growers.getGrower,
    product?.growerId ? { growerId: product.growerId } : 'skip'
  );
  
  // Update loading state when data is fetched
  useEffect(() => {
    if (product !== undefined) {
      setIsLoading(false);
    }
  }, [product]);

  // Handle order success
  const handleOrderSuccess = () => {
    alert("Order placed successfully! You can view your orders in your dashboard.");
    if (user?.role === 'customer') {
      router.push('/dashboard/customer/orders');
    }
  };

  // Handle message success
  const handleMessageSuccess = () => {
    alert("Message sent successfully! The grower will respond soon.");
  };

  // Check if user can order (must be authenticated with customer role)
  const canOrder = clerkUser && user?.role === 'customer';
  const canMessage = clerkUser && user && grower?.userId;

  // Handle if product doesn't exist
  if (!isLoading && !product) {
    return (
      <div className="container section">
        <div className="text-center">
          <h2>Product Not Found</h2>
          <p>The product you are looking for doesn't exist or has been removed.</p>
          <Link href="/products" className="btn btn-primary mt-4">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }
  
  // Render loading state
  if (isLoading || !product) {
    return (
      <div className="container section">
        <div className="flex justify-center items-center" style={{ minHeight: '400px' }}>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }
  
  // We know product exists at this point
  return (
    <div className="container section product-detail-page">
      <Link href="/products" className="btn btn-text mb-4" style={{ fontWeight: 500, color: 'var(--secondary)' }}>
        &larr; Back to Products
      </Link>
      <div
        className="product-detail-hero"
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '2.5rem',
          alignItems: 'flex-start',
          background: 'var(--light-bg)',
          borderRadius: 'var(--border-radius)',
          boxShadow: 'var(--shadow-md)',
          padding: '2rem',
          marginBottom: '2rem',
          flexWrap: 'wrap',
        }}
      >
        {/* Product Image */}
        <div
          className="product-image"
          style={{
            flex: '1 1 320px',
            minWidth: 0,
            maxWidth: 480,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f1d3b2 60%, #fff8ef 100%)',
            borderRadius: 'var(--border-radius)',
            boxShadow: 'var(--shadow-lg)',
            padding: '1.5rem',
            margin: '0 auto',
          }}
        >
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="rounded-lg shadow-md"
              style={{
                width: '100%',
                maxWidth: 340,
                height: 'auto',
                objectFit: 'cover',
                borderRadius: 'var(--border-radius)',
                boxShadow: 'var(--shadow-md)',
                background: '#fff',
              }}
            />
          ) : (
            <div
              style={{
                width: 220,
                height: 220,
                background: 'var(--accent)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 64,
                color: 'var(--primary)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              ☕
            </div>
          )}
        </div>
        {/* Product Info */}
        <div
          className="product-info"
          style={{
            flex: '2 1 340px',
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem',
            justifyContent: 'center',
          }}
        >
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>{product.name}</h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.7rem', alignItems: 'center', marginBottom: 8 }}>
            <span
              style={{
                background: 'var(--accent)',
                color: 'var(--primary)',
                borderRadius: 16,
                padding: '0.3rem 1rem',
                fontWeight: 600,
                fontSize: '1.1rem',
              }}
            >
              ${product.price.toFixed(2)} / {product.weight}
            </span>
            <span
              style={{
                background: product.stock > 0 ? 'var(--light-bg)' : '#ffeaea',
                color: product.stock > 0 ? 'var(--secondary)' : '#c00',
                borderRadius: 16,
                padding: '0.3rem 1rem',
                fontWeight: 500,
                fontSize: '1rem',
              }}
            >
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.7rem', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ background: 'var(--secondary)', color: 'white', borderRadius: 16, padding: '0.3rem 1rem', fontWeight: 500, fontSize: '1rem' }}>
              {product.origin}
            </span>
            {grower && (
              <span style={{ background: 'var(--primary)', color: 'white', borderRadius: 16, padding: '0.3rem 1rem', fontWeight: 500, fontSize: '1rem' }}>
                {grower.name}
              </span>
            )}
          </div>
          {product.tastingNotes && product.tastingNotes.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: 8 }}>
              {product.tastingNotes.slice(0, 4).map((note, i) => (
                <span key={i} style={{ background: 'var(--accent)', color: 'var(--primary)', borderRadius: 12, padding: '0.2rem 0.8rem', fontSize: '0.95rem', fontWeight: 500 }}>{note}</span>
              ))}
              {product.tastingNotes.length > 4 && (
                <span style={{ background: 'var(--light-bg)', color: 'var(--primary)', borderRadius: 12, padding: '0.2rem 0.8rem', fontSize: '0.95rem', fontWeight: 500 }}>+{product.tastingNotes.length - 4} more</span>
              )}
            </div>
          )}
          <p style={{ fontSize: '1.1rem', color: 'var(--foreground)', marginBottom: 8, lineHeight: 1.6 }}>{product.description}</p>
          {/* Action Buttons */}
          <div className="cta-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.7rem', marginTop: 12, alignItems: 'stretch' }}>
            {canOrder ? (
              <button
                onClick={() => setShowOrderForm(true)}
                className="btn btn-primary cta-btn"
                style={{ minWidth: 130, fontWeight: 600, fontSize: '0.98rem', borderRadius: 16, padding: '0.7rem 1.2rem', height: 48 }}
                disabled={product.stock <= 0}
              >
                {product.stock > 0 ? 'Order Now' : 'Out of Stock'}
              </button>
            ) : (
              <div style={{ width: 130, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {!clerkUser ? (
                  <Link href="/sign-in" className="btn btn-primary cta-btn" style={{ width: '100%', fontWeight: 600, fontSize: '0.98rem', borderRadius: 16, padding: '0.7rem 1.2rem', height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Sign In to Order
                  </Link>
                ) : user?.role !== 'customer' ? (
                  <div className="text-center p-2 bg-gray-100 rounded-lg" style={{ fontSize: '0.97rem', height: 40, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <span className="text-gray-600" style={{ fontSize: '0.97rem' }}>Customer account required to place orders</span>
                    <Link href="/onboarding/customer" className="text-blue-600 hover:underline" style={{ fontSize: '0.97rem' }}>
                      Complete your profile
                    </Link>
                  </div>
                ) : (
                  <button
                    className="btn btn-primary cta-btn opacity-50 cursor-not-allowed"
                    style={{ width: '100%', fontWeight: 600, fontSize: '0.98rem', borderRadius: 16, padding: '0.7rem 1.2rem', height: 40 }}
                    disabled
                  >
                    Loading...
                  </button>
                )}
              </div>
            )}
            {canMessage && (
              <button
                onClick={() => setShowMessageForm(true)}
                className="btn btn-secondary cta-btn"
                style={{ minWidth: 130, fontWeight: 600, fontSize: '0.98rem', borderRadius: 16, padding: '0.7rem 1.2rem', height: 48 }}
              >
                Message Grower
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Modals */}
      {showOrderForm && (
        <OrderForm product={product} onClose={() => setShowOrderForm(false)} onOrderSuccess={handleOrderSuccess} />
      )}
      {showMessageForm && grower && (
        <MessageForm product={product} grower={grower} onClose={() => setShowMessageForm(false)} onMessageSuccess={handleMessageSuccess} />
      )}
      {/* Responsive styles for mobile */}
      <style jsx global>{`
        @media (max-width: 900px) {
          .product-detail-hero {
            padding: 1.2rem !important;
            gap: 1.2rem !important;
          }
        }
        @media (max-width: 768px) {
          .product-detail-hero {
            flex-direction: column !important;
            padding: 1rem !important;
            gap: 1rem !important;
          }
          .product-image {
            padding: 0.5rem !important;
            max-width: 100% !important;
          }
          .product-info {
            gap: 0.7rem !important;
          }
          .cta-actions {
            flex-direction: column !important;
            gap: 0.7rem !important;
          }
          .cta-btn {
            width: 100% !important;
            min-width: 0 !important;
            max-width: 100% !important;
            height: 44px !important;
            font-size: 1rem !important;
            padding: 0.7rem 1.2rem !important;
          }
        }
      `}</style>
    </div>
  );
} 