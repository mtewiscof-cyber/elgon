"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";

// --- Modern, Compact Order Form ---
interface OrderFormProps {
  product: any;
  onClose: () => void;
  onOrderSuccess: () => void;
}

function OrderForm({ product, onClose, onOrderSuccess }: OrderFormProps) {
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

  const totalAmount = product.price;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      await createOrder({
        userId: user._id,
        items: [{
          productId: product._id,
          quantity: 1,
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-y-auto">
        <div className="p-5">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-[var(--primary)] tracking-tight">Quick Order</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-[var(--primary)] text-xl transition"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div className="mb-3 flex items-center gap-3 bg-[var(--accent)]/40 rounded-xl px-3 py-2">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-12 h-12 rounded-lg object-cover border border-[var(--accent)]"
              />
            ) : (
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[var(--accent)] text-2xl text-[var(--primary)]">☕</div>
            )}
            <div>
              <div className="font-bold text-[var(--primary)] text-base">{product.name}</div>
              <div className="text-xs text-[var(--secondary)]">{product.origin}</div>
              <div className="text-[var(--secondary)] text-xs">{product.weight}</div>
            </div>
            <div className="ml-auto text-[var(--primary)] font-bold text-base">${product.price.toFixed(2)}</div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Full Name"
                value={shippingAddress.name}
                onChange={e => setShippingAddress(prev => ({ ...prev, name: e.target.value }))}
                className="col-span-2 bg-[var(--light-bg)] border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--primary)]"
                required
                autoFocus
              />
              <input
                type="email"
                placeholder="Email"
                value={shippingAddress.email}
                onChange={e => setShippingAddress(prev => ({ ...prev, email: e.target.value }))}
                className="col-span-2 bg-[var(--light-bg)] border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--primary)]"
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                value={shippingAddress.phone}
                onChange={e => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                className="col-span-2 bg-[var(--light-bg)] border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--primary)]"
                required
              />
              <input
                type="text"
                placeholder="Street Address"
                value={shippingAddress.address}
                onChange={e => setShippingAddress(prev => ({ ...prev, address: e.target.value }))}
                className="col-span-2 bg-[var(--light-bg)] border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--primary)]"
                required
              />
              <input
                type="text"
                placeholder="City"
                value={shippingAddress.city}
                onChange={e => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                className="bg-[var(--light-bg)] border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--primary)]"
                required
              />
              <input
                type="text"
                placeholder="State"
                value={shippingAddress.state}
                onChange={e => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                className="bg-[var(--light-bg)] border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--primary)]"
                required
              />
              <input
                type="text"
                placeholder="ZIP"
                value={shippingAddress.zipCode}
                onChange={e => setShippingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                className="bg-[var(--light-bg)] border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--primary)]"
                required
              />
              <input
                type="text"
                placeholder="Country"
                value={shippingAddress.country}
                onChange={e => setShippingAddress(prev => ({ ...prev, country: e.target.value }))}
                className="bg-[var(--light-bg)] border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--primary)]"
                required
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-[var(--secondary)] text-sm">Total</span>
              <span className="text-[var(--primary)] font-bold text-lg">${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 rounded-lg bg-gray-100 text-[var(--secondary)] font-medium hover:bg-gray-200 transition text-sm"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-lg bg-[var(--primary)] text-white font-semibold hover:bg-[var(--secondary)] transition text-sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Placing...' : 'Place Order'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// --- Modern, Compact Message Form ---
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="p-5">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-[var(--primary)] tracking-tight">Message Grower</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-[var(--primary)] text-xl transition"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div className="mb-3 flex items-center gap-3 bg-[var(--accent)]/40 rounded-xl px-3 py-2">
            <div>
              <div className="font-bold text-[var(--primary)] text-base">{product.name}</div>
              <div className="text-xs text-[var(--secondary)]">To: {grower?.name || 'Grower'}</div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-2">
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Ask about this coffee or farming practices..."
              rows={3}
              className="w-full bg-[var(--light-bg)] border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--primary)] resize-none"
              required
            />
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 rounded-lg bg-gray-100 text-[var(--secondary)] font-medium hover:bg-gray-200 transition text-sm"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition text-sm"
                disabled={isSubmitting || !message.trim()}
              >
                {isSubmitting ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// --- Modern, Compact Product Detail Page ---
export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user: clerkUser } = useUser();
  const productId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);

  const user = useQuery(api.users.getUserByUserId);

  const product = useQuery(api.products.getProductById, {
    productId: productId as Id<"products">
  });

  const grower = useQuery(
    api.growers.getGrower,
    product?.growerId ? { growerId: product.growerId } : 'skip'
  );

  useEffect(() => {
    if (product !== undefined) {
      setIsLoading(false);
    }
  }, [product]);

  const handleOrderSuccess = () => {
    alert("Order placed successfully! You can view your orders in your dashboard.");
    if (user?.role === 'customer') {
      router.push('/dashboard/customer/orders');
    }
  };

  const handleMessageSuccess = () => {
    alert("Message sent successfully! The grower will respond soon.");
  };

  const canOrder = clerkUser && user?.role === 'customer';
  const canMessage = clerkUser && user && grower?.userId;

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

  if (isLoading || !product) {
    return (
      <div className="container section">
        <div className="flex justify-center items-center" style={{ minHeight: '400px' }}>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container section product-detail-page" style={{ maxWidth: 700, margin: '0 auto' }}>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 px-2 py-3 text-sm text-[var(--secondary)]">
        <Link href="/products" className="hover:underline font-medium">Shop</Link>
        <span>/</span>
        <span className="text-[var(--primary)] font-semibold">{product.name}</span>
      </div>
      {/* Product Card */}
      <div className="flex flex-col md:flex-row gap-4 bg-white rounded-2xl shadow-lg p-4 mb-5">
        {/* Image */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="rounded-xl w-full max-w-xs object-cover aspect-[3/2] border border-[var(--accent)]"
              style={{ background: '#fff' }}
            />
          ) : (
            <div className="flex items-center justify-center rounded-xl bg-[var(--accent)] w-full max-w-xs aspect-[3/2] text-5xl text-[var(--primary)]">
              ☕
            </div>
          )}
        </div>
        {/* Info */}
        <div className="flex flex-col gap-2 w-full md:w-1/2 justify-center">
          <h1 className="text-[var(--primary)] text-2xl font-bold leading-tight">{product.name}</h1>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="bg-[var(--accent)] text-[var(--primary)] rounded-lg px-3 py-1 font-bold text-base">${product.price.toFixed(2)} <span className="font-normal text-xs">/ {product.weight}</span></span>
            <span className={`rounded-lg px-3 py-1 font-medium text-xs ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{product.stock > 0 ? 'In stock' : 'Out of stock'}</span>
            <span className="bg-[var(--secondary)] text-white rounded-lg px-3 py-1 font-medium text-xs">{product.origin}</span>
            {grower && <span className="bg-[var(--primary)] text-white rounded-lg px-3 py-1 font-medium text-xs">{grower.name}</span>}
          </div>
          {product.tastingNotes && product.tastingNotes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {product.tastingNotes.map((note, i) => (
                <span key={i} className="bg-[var(--accent)] text-[var(--primary)] rounded px-2 py-0.5 text-xs font-medium">{note}</span>
              ))}
            </div>
          )}
          <p className="text-[var(--secondary)] text-sm mt-2 line-clamp-3">{product.description}</p>
          <div className="flex gap-2 mt-3">
            {canOrder ? (
              <button
                onClick={() => setShowOrderForm(true)}
                className="flex-1 h-10 rounded-lg bg-[var(--primary)] text-white font-semibold text-sm hover:bg-[var(--secondary)] transition"
                disabled={product.stock <= 0}
              >
                {product.stock > 0 ? 'Order Now' : 'Out of Stock'}
              </button>
            ) : (
              <div className="flex-1">
                {!clerkUser ? (
                  <Link href="/sign-in" className="block h-10 rounded-lg bg-[var(--primary)] text-white font-semibold text-sm flex items-center justify-center hover:bg-[var(--secondary)] transition">
                    Sign In to Order
                  </Link>
                ) : user?.role !== 'customer' ? (
                  <div className="text-center p-2 bg-gray-100 rounded-lg text-xs">
                    <span className="text-gray-600">Customer account required</span>
                    <Link href="/onboarding/customer" className="text-blue-600 hover:underline ml-1">
                      Complete profile
                    </Link>
                  </div>
                ) : (
                  <button
                    className="block w-full h-10 rounded-lg bg-gray-300 text-white font-semibold text-sm cursor-not-allowed"
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
                className="flex-1 h-10 rounded-lg bg-[var(--accent)] text-[var(--primary)] font-semibold text-sm hover:bg-[var(--secondary)] hover:text-white transition"
              >
                Message Grower
              </button>
            )}
          </div>
        </div>
      </div>
      {/* About */}
      <div className="bg-[var(--light-bg)] rounded-xl p-4 mb-4">
        <h2 className="text-[var(--primary)] text-lg font-bold mb-1">About this coffee</h2>
        <p className="text-[var(--primary)] text-sm">{product.description}</p>
      </div>
      {/* Details */}
      <div className="grid grid-cols-2 gap-3 bg-white rounded-xl p-4 shadow-sm text-sm mb-4">
        <div>
          <div className="text-[var(--secondary)] font-medium">Origin</div>
          <div className="text-[var(--primary)]">{product.origin}</div>
        </div>
        <div>
          <div className="text-[var(--secondary)] font-medium">Weight</div>
          <div className="text-[var(--primary)]">{product.weight}</div>
        </div>
        <div>
          <div className="text-[var(--secondary)] font-medium">Price</div>
          <div className="text-[var(--primary)]">${product.price.toFixed(2)}</div>
        </div>
        {product.tastingNotes && product.tastingNotes.length > 0 && (
          <div className="col-span-2">
            <div className="text-[var(--secondary)] font-medium">Tasting Notes</div>
            <div className="text-[var(--primary)]">{product.tastingNotes.join(', ')}</div>
          </div>
        )}
      </div>
      {/* Modals */}
      {showOrderForm && (
        <OrderForm product={product} onClose={() => setShowOrderForm(false)} onOrderSuccess={handleOrderSuccess} />
      )}
      {showMessageForm && grower && (
        <MessageForm product={product} grower={grower} onClose={() => setShowMessageForm(false)} onMessageSuccess={handleMessageSuccess} />
      )}
      {/* Modern, vivid, compact responsive tweaks */}
      <style jsx global>{`
        .product-detail-page {
          font-family: 'Inter', system-ui, sans-serif;
        }
        @media (max-width: 700px) {
          .product-detail-page {
            padding: 0.5rem !important;
          }
        }
        @media (max-width: 600px) {
          .product-detail-page .flex-row {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
}