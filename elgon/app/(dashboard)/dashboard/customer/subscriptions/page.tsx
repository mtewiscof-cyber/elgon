'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Id } from '@/convex/_generated/dataModel';
import Link from 'next/link';

// Subscription Form Component
interface SubscriptionFormProps {
  onClose: () => void;
  onSuccess: () => void;
  customerId: Id<"customers">;
}

function SubscriptionForm({ onClose, onSuccess, customerId }: SubscriptionFormProps) {
  const [selectedProduct, setSelectedProduct] = useState<Id<"products"> | null>(null);
  const [frequency, setFrequency] = useState('monthly');
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
  const [error, setError] = useState('');
  
  const user = useQuery(api.users.getUserByUserId);
  const products = useQuery(api.products.listProducts);
  const createSubscription = useMutation(api.subscriptions.createSubscription);

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setShippingAddress(prev => ({
        ...prev,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.email || '',
        phone: user.phoneNumber || '',
        ...(user.address && {
          address: user.address.street || '',
          city: user.address.city || '',
          state: user.address.state || '',
          zipCode: user.address.zip || '',
          country: user.address.country || 'Uganda'
        })
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) {
      setError('Please select a product');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      await createSubscription({
        customerId,
        productId: selectedProduct,
        frequency,
        startDate: Date.now(),
        status: "active",
        shippingAddress
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to create subscription:", error);
      setError("Failed to create subscription. Please check your information and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (products === undefined) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Loading products...</p>
        </div>
      </div>
    );
  }

  const availableProducts = products?.filter(p => p.stock > 0) || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Start New Subscription</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Coffee Product <span className="text-red-500">*</span>
              </label>
              {availableProducts.length === 0 ? (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800">No products are currently available for subscription. Please check back later.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 max-h-40 overflow-y-auto">
                  {availableProducts.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => setSelectedProduct(product._id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedProduct === product._id 
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">{product.name}</h4>
                          <p className="text-sm text-gray-600">{product.origin}</p>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                          <p className="text-xs text-green-600 mt-1">{product.stock} in stock</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">${product.price.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">{product.weight}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Frequency Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Delivery Frequency <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'weekly', label: 'Weekly', desc: 'Every 7 days', price: '10% off' },
                  { value: 'bi-weekly', label: 'Bi-weekly', desc: 'Every 14 days', price: '5% off' },
                  { value: 'monthly', label: 'Monthly', desc: 'Every 30 days', price: '15% off' }
                ].map((option) => (
                  <div
                    key={option.value}
                    onClick={() => setFrequency(option.value)}
                    className={`p-3 border rounded-lg cursor-pointer text-center transition-all ${
                      frequency === option.value 
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.desc}</div>
                    <div className="text-xs text-green-600 font-medium">{option.price}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Shipping Information</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={shippingAddress.name}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, name: e.target.value }))}
                  className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                
                <input
                  type="email"
                  placeholder="Email Address"
                  value={shippingAddress.email}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, email: e.target.value }))}
                  className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <input
                type="tel"
                placeholder="Phone Number"
                value={shippingAddress.phone}
                onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />

              <input
                type="text"
                placeholder="Street Address"
                value={shippingAddress.address}
                onChange={(e) => setShippingAddress(prev => ({ ...prev, address: e.target.value }))}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                  className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  placeholder="State"
                  value={shippingAddress.state}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                  className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={shippingAddress.zipCode}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                  className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={shippingAddress.country}
                  onChange={(e) => setShippingAddress(prev => ({ ...prev, country: e.target.value }))}
                  className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting || !selectedProduct || availableProducts.length === 0}
              >
                {isSubmitting ? 'Creating Subscription...' : 'Start Subscription'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const CustomerSubscriptionsPage = () => {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const router = useRouter();
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);
  const [error, setError] = useState('');

  // Fetch the user document from Convex to get the role and user ID
  const user = useQuery(api.users.getUserByUserId);
  const isUserLoaded = user !== undefined;

  // Create customer mutation for auto-creation
  const createCustomer = useMutation(api.customers.createCustomer);

  // Redirect if user data is loaded and user is not authenticated or not a customer
  useEffect(() => {
    if (clerkLoaded && isUserLoaded) {
      if (!clerkUser || user?.role !== 'customer') {
        router.push('/');
      }
    }
  }, [clerkLoaded, isUserLoaded, clerkUser, user, router]);

   // Fetch the customer document for the user to get customerId
  const customer = useQuery(
    api.customers.getCustomerByUserId,
    user?._id ? { userId: user._id } : 'skip'
  );
  const isCustomerLoaded = customer !== undefined;

  // Auto-create customer record if user is a customer but no customer record exists
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
  
  useEffect(() => {
    const autoCreateCustomer = async () => {
      if (isUserLoaded && isCustomerLoaded && user?.role === 'customer' && customer === null && !isCreatingCustomer) {
        setIsCreatingCustomer(true);
        try {
          await createCustomer({});
          // Customer record will be refetched automatically by Convex
        } catch (error) {
          console.error('Failed to create customer record:', error);
          setError('Failed to initialize customer account. Please refresh the page.');
        } finally {
          setIsCreatingCustomer(false);
        }
      }
    };

    autoCreateCustomer();
  }, [isUserLoaded, isCustomerLoaded, user, customer, createCustomer, isCreatingCustomer]);

  // Fetch subscriptions data for the customer
  const subscriptions = useQuery(
    api.subscriptions.listSubscriptionsByCustomer,
    customer?._id ? { customerId: customer._id } : 'skip'
  );

  // Fetch products for subscription display
  const products = useQuery(api.products.listProducts);

  // Mutations
  const cancelSubscription = useMutation(api.subscriptions.cancelSubscription);
  const pauseSubscription = useMutation(api.subscriptions.pauseSubscription);
  const resumeSubscription = useMutation(api.subscriptions.resumeSubscription);

  // Show a loading state while data is loading or if not authenticated/authorized
  if (!clerkLoaded || !isUserLoaded || !clerkUser || user?.role !== 'customer' || !isCustomerLoaded || isCreatingCustomer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">
            {isCreatingCustomer ? 'Setting up your account...' : 'Loading Subscriptions...'}
          </h2>
          <p className="text-gray-500">
            {isCreatingCustomer ? 'Creating your customer profile...' : 'Accessing your subscription dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  // Show error if customer creation failed
  if (customer === null && error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Setup Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const handleSubscriptionAction = async (subscriptionId: string, action: 'cancel' | 'pause' | 'resume') => {
    try {
      const id = subscriptionId as Id<"subscriptions">;
      switch (action) {
        case 'cancel':
          await cancelSubscription({ subscriptionId: id });
          break;
        case 'pause':
          await pauseSubscription({ subscriptionId: id });
          break;
        case 'resume':
          await resumeSubscription({ subscriptionId: id });
          break;
      }
    } catch (error) {
      console.error(`Failed to ${action} subscription:`, error);
      alert(`Failed to ${action} subscription. Please try again.`);
    }
  };

  const handleSubscriptionSuccess = () => {
    alert("Subscription created successfully! Your first delivery will be scheduled soon.");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Create a products map for quick lookup
  const productsMap = new Map(products?.map(p => [p._id, p]) || []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Coffee Subscriptions</h1>
              <p className="text-gray-600">Manage your recurring coffee deliveries</p>
            </div>
            <button
              onClick={() => setShowSubscriptionForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Start New Subscription
            </button>
          </div>
        </div>

        {/* Subscriptions List */}
        <div className="bg-white rounded-lg shadow-sm">
          {subscriptions === undefined ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading your subscriptions...</p>
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">☕</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No subscriptions yet</h3>
              <p className="text-gray-500 mb-6">Start your first coffee subscription to enjoy regular deliveries of premium coffee</p>
              <button
                onClick={() => setShowSubscriptionForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Your First Subscription
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {subscriptions.map((subscription) => {
                const product = productsMap.get(subscription.productId);
                return (
                  <div key={subscription._id} className="p-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {product?.name || 'Unknown Product'}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                            {subscription.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Origin:</span> {product?.origin || 'Unknown'}
                          </div>
                          <div>
                            <span className="font-medium">Frequency:</span> {subscription.frequency}
                          </div>
                          <div>
                            <span className="font-medium">Started:</span> {new Date(subscription.startDate).toLocaleDateString()}
                          </div>
                        </div>

                        {product?.price && (
                          <div className="mt-2">
                            <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                            <span className="text-gray-500 ml-2">per delivery ({product.weight})</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        {subscription.status === 'active' && (
                          <>
                            <button
                              onClick={() => handleSubscriptionAction(subscription._id, 'pause')}
                              className="px-4 py-2 text-yellow-600 border border-yellow-600 rounded-lg hover:bg-yellow-50 transition-colors"
                            >
                              Pause
                            </button>
                            <button
                              onClick={() => handleSubscriptionAction(subscription._id, 'cancel')}
                              className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {subscription.status === 'paused' && (
                          <>
                            <button
                              onClick={() => handleSubscriptionAction(subscription._id, 'resume')}
                              className="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
                            >
                              Resume
                            </button>
                            <button
                              onClick={() => handleSubscriptionAction(subscription._id, 'cancel')}
                              className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        <Link
                          href={`/dashboard/customer/subscriptions/${subscription._id}`}
                          className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-center"
                        >
                          View Details
                       </Link>
                   </div>
                </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm p-8 mt-8 border border-blue-100">
          <h3 className="text-blue-800 text-xl font-semibold mb-6 flex items-center gap-2">
            ☕ Subscription Benefits
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            <div className="bg-white/70 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <span className="text-lg">💰</span> Save Money
              </h4>
              <ul className="space-y-2 text-blue-700">
                <li>• 10% off regular prices</li>
                <li>• No delivery fees</li>
                <li>• Exclusive subscriber discounts</li>
              </ul>
            </div>
            <div className="bg-white/70 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <span className="text-lg">📅</span> Convenience
              </h4>
              <ul className="space-y-2 text-blue-700">
                <li>• Never run out of coffee</li>
                <li>• Flexible delivery schedule</li>
                <li>• Pause or cancel anytime</li>
              </ul>
            </div>
            <div className="bg-white/70 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <span className="text-lg">🌟</span> Quality
              </h4>
              <ul className="space-y-2 text-blue-700">
                <li>• Fresh roasted coffee</li>
                <li>• Premium beans</li>
                <li>• Direct from growers</li>
              </ul>
            </div>
            <div className="bg-white/70 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <span className="text-lg">🤝</span> Impact
              </h4>
              <ul className="space-y-2 text-blue-700">
                <li>• Support women farmers</li>
                <li>• Sustainable practices</li>
                <li>• Fair trade principles</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Form Modal */}
      {showSubscriptionForm && customer && (
        <SubscriptionForm
          customerId={customer._id}
          onClose={() => setShowSubscriptionForm(false)}
          onSuccess={handleSubscriptionSuccess}
        />
      )}
    </div>
  );
};

export default CustomerSubscriptionsPage; 