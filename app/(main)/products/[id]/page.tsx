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
    <div className="container section">
      <div className="product-detail">
        <Link href="/products" className="btn btn-text mb-4">
          &larr; Back to Products
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          {/* Product Image */}
          <div className="product-image">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="rounded-lg shadow-md"
                style={{ 
                  width: '100%', 
                  height: 'auto', 
                  maxHeight: '500px',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div 
                className="rounded-lg bg-primary"
                style={{ 
                  width: '100%', 
                  height: '400px',
                  backgroundColor: 'var(--primary)'
                }}
              ></div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="product-info">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            <p className="text-gray-700 mb-4">Origin: {product.origin}</p>
            
            {grower && (
              <p className="text-gray-600 mb-4">
                From: <span className="font-medium">{grower.name}</span>
                {grower.farmName && ` - ${grower.farmName}`}
              </p>
            )}
            
            <div className="price text-2xl font-bold mb-6">
              ${product.price.toFixed(2)} <span className="text-sm font-normal text-gray-600">/ {product.weight}</span>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p>{product.description}</p>
            </div>
            
            {/* Tasting Notes */}
            {product.tastingNotes && product.tastingNotes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Tasting Notes</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tastingNotes.map((note, i) => (
                    <span key={i} className="badge badge-accent px-3 py-1">
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Certifications */}
            {product.certifications && product.certifications.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Certifications</h3>
                <div className="flex flex-wrap gap-2">
                  {product.certifications.map((cert, i) => (
                    <span key={i} className="badge badge-neutral px-3 py-1">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Stock */}
            <div className="mb-6">
              <p className="font-medium">
                {product.stock > 0 ? (
                  <span className="text-green-600">In Stock ({product.stock} available)</span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Order Button */}
              {canOrder ? (
                <button 
                  onClick={() => setShowOrderForm(true)}
                  className="btn btn-primary w-full py-3"
                  disabled={product.stock <= 0}
                >
                  {product.stock > 0 ? 'Order Now' : 'Out of Stock'}
                </button>
              ) : (
                <div className="w-full">
                  {!clerkUser ? (
                    <Link href="/sign-in" className="btn btn-primary w-full py-3 text-center block">
                      Sign In to Order
                    </Link>
                  ) : user?.role !== 'customer' ? (
                    <div className="text-center p-3 bg-gray-100 rounded-lg">
                      <p className="text-gray-600">Customer account required to place orders</p>
                      <Link href="/onboarding" className="text-blue-600 hover:underline">
                        Complete your profile
                      </Link>
                    </div>
                  ) : (
                    <button 
                      className="btn btn-primary w-full py-3 opacity-50 cursor-not-allowed"
                      disabled
                    >
                      Loading...
                    </button>
                  )}
                </div>
              )}
              
              {/* Message Grower Button */}
              {canMessage ? (
                <button 
                  onClick={() => setShowMessageForm(true)}
                  className="btn btn-secondary w-full py-3"
                >
                  Message Grower
                </button>
              ) : grower?.userId && (
                <div className="w-full">
                  {!clerkUser ? (
                    <Link href="/sign-in" className="btn btn-secondary w-full py-3 text-center block">
                      Sign In to Message Grower
                    </Link>
                  ) : (
                    <div className="text-center p-3 bg-gray-100 rounded-lg">
                      <p className="text-gray-600">Sign in to message the grower</p>
                    </div>
                  )}
                </div>
              )}
              
              {!grower?.userId && (
                <p className="text-sm text-gray-500 text-center">
                  Grower contact not available
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Additional Product Information */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">About This Coffee</h2>
          
          {grower && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">About the Grower</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">{grower.name}</h4>
                  {grower.farmName && <p className="text-gray-600 mb-2">Farm: {grower.farmName}</p>}
                  <p className="text-gray-600 mb-2">Location: {grower.location}</p>
                  {grower.elevation && <p className="text-gray-600 mb-2">Elevation: {grower.elevation}m</p>}
                </div>
                <div>
                  {grower.coffeeVarieties && grower.coffeeVarieties.length > 0 && (
                    <div className="mb-3">
                      <h5 className="font-medium mb-1">Coffee Varieties:</h5>
                      <p className="text-gray-600">{grower.coffeeVarieties.join(', ')}</p>
                    </div>
                  )}
                  {grower.processingMethods && grower.processingMethods.length > 0 && (
                    <div className="mb-3">
                      <h5 className="font-medium mb-1">Processing Methods:</h5>
                      <p className="text-gray-600">{grower.processingMethods.join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>
              {grower.story && (
                <div className="mt-4 pt-4 border-t">
                  <h5 className="font-medium mb-2">Grower's Story:</h5>
                  <p className="text-gray-700">{grower.story}</p>
                </div>
              )}
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Brewing Recommendations</h3>
            <p>
              For the best flavor experience, we recommend brewing this coffee using a pour-over method with water at 200°F (93°C). 
              Use 15g of coffee to 250ml of water for a balanced cup. Adjust to taste.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">From Farm to Cup</h3>
            <p>
              This coffee is grown by women farmers in the Mt. Elgon region of Uganda at elevations between 1,700 and 2,000 meters above sea level. 
              The rich volcanic soil and favorable climate of Mt. Elgon create ideal growing conditions for exceptional coffee.
            </p>
            <p className="mt-4">
              Our farmers use sustainable farming practices and are committed to environmental stewardship. 
              By purchasing this coffee, you are directly supporting the livelihoods of women farmers and their families.
            </p>
          </div>
        </div>
      </div>

      {/* Order Form Modal */}
      {showOrderForm && (
        <OrderForm
          product={product}
          onClose={() => setShowOrderForm(false)}
          onOrderSuccess={handleOrderSuccess}
        />
      )}

      {/* Message Form Modal */}
      {showMessageForm && grower && (
        <MessageForm
          product={product}
          grower={grower}
          onClose={() => setShowMessageForm(false)}
          onMessageSuccess={handleMessageSuccess}
        />
      )}
    </div>
  );
} 