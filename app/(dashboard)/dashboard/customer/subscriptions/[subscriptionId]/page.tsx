'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import { Id } from '@/convex/_generated/dataModel';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

const CustomerSubscriptionDetailPage = () => {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const router = useRouter();
  const params = useParams();
  const subscriptionId = params.subscriptionId as string | undefined;

  // Fetch the user document from Convex to get the role and user ID
  const user = useQuery(api.users.getUserByUserId);
  const isUserLoaded = user !== undefined;

   // Fetch the customer document for the user to get customerId
  const customer = useQuery(
    api.customers.getCustomerByUserId,
    user?._id ? { userId: user._id } : 'skip'
  );
  const isCustomerLoaded = customer !== undefined;

  // Redirect if user data is loaded and user is not authenticated or not a customer
  useEffect(() => {
    if (clerkLoaded && isUserLoaded) {
      if (!clerkUser || user?.role !== 'customer') {
        router.push('/');
      } else if (user?.role === 'customer' && !isCustomerLoaded && customer === null) {
            router.push('/onboarding/customer');
      }
    }
  }, [clerkLoaded, isUserLoaded, isCustomerLoaded, clerkUser, user, customer, router]);

  // Fetch the specific subscription details
  const subscription = useQuery(
    api.subscriptions.getSubscription,
    subscriptionId ? { subscriptionId: subscriptionId as Id<"subscriptions"> } : 'skip'
  );

  // Fetch product and other details
  const product = useQuery(
    api.products.getProductById,
    subscription?.productId ? { productId: subscription.productId } : 'skip'
  );

  // Mutations
  const cancelSubscription = useMutation(api.subscriptions.cancelSubscription);
  const pauseSubscription = useMutation(api.subscriptions.pauseSubscription);
  const resumeSubscription = useMutation(api.subscriptions.resumeSubscription);

  // Show a loading state while data is loading or if not authenticated/authorized
  if (!clerkLoaded || !isUserLoaded || !clerkUser || user?.role !== 'customer' || !isCustomerLoaded || subscription === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Loading Subscription...</h2>
          <p className="text-gray-500">Fetching subscription details...</p>
        </div>
      </div>
    );
  }

   if (!subscription) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="text-red-500 text-5xl mb-4">📋</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Subscription Not Found</h2>
          <p className="text-gray-600 mb-4">The subscription you're looking for doesn't exist or has been removed.</p>
          <Link href="/dashboard/customer/subscriptions" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Back to Subscriptions
          </Link>
        </div>
      </div>
    );
   }

   // Authorization check: Ensure the fetched subscription belongs to the logged-in customer
   if (customer?._id.toString() !== subscription.customerId.toString()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="text-red-500 text-5xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You do not have permission to view this subscription.</p>
          <Link href="/dashboard/customer/subscriptions" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Back to Subscriptions
          </Link>
        </div>
      </div>
    );
  }

  const handleSubscriptionAction = async (action: 'cancel' | 'pause' | 'resume') => {
    try {
      const id = subscription._id;
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
      router.push('/dashboard/customer/subscriptions');
    } catch (error) {
      console.error(`Failed to ${action} subscription:`, error);
      alert(`Failed to ${action} subscription. Please try again.`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/customer/subscriptions" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Subscriptions
          </Link>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription Details</h1>
              <p className="text-gray-600">Manage your coffee subscription</p>
            </div>
            <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}>
              {subscription.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Product Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Product Information</h2>
              
              {product ? (
                <div className="flex flex-col sm:flex-row gap-6">
                  {product.imageUrl && (
                    <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div><span className="font-medium">Origin:</span> {product.origin}</div>
                      <div><span className="font-medium">Weight:</span> {product.weight}</div>
                      <div><span className="font-medium">Price:</span> {formatPrice(product.price)}</div>
                      <div><span className="font-medium">Stock:</span> {product.stock} available</div>
                    </div>

                    {product.tastingNotes && product.tastingNotes.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Tasting Notes</h4>
                        <div className="flex flex-wrap gap-2">
                          {product.tastingNotes.map((note, index) => (
                            <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                              {note}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">Loading product information...</div>
              )}
            </div>

            {/* Subscription Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Subscription Details</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Frequency</h3>
                  <p className="text-gray-600 capitalize">{subscription.frequency}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Start Date</h3>
                  <p className="text-gray-600">{new Date(subscription.startDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
                
                {subscription.endDate && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">End Date</h3>
                    <p className="text-gray-600">{new Date(subscription.endDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Contact Information</h3>
                  <div className="space-y-1 text-gray-600">
                    <p>{subscription.shippingAddress.name}</p>
                    <p>{subscription.shippingAddress.email}</p>
                    <p>{subscription.shippingAddress.phone}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Delivery Address</h3>
                  <div className="space-y-1 text-gray-600">
                    <p>{subscription.shippingAddress.address}</p>
                    <p>{subscription.shippingAddress.city}, {subscription.shippingAddress.state} {subscription.shippingAddress.zipCode}</p>
                    <p>{subscription.shippingAddress.country}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Manage Subscription</h3>
              
              <div className="space-y-3">
                {subscription.status === 'active' && (
                  <>
                    <button
                      onClick={() => handleSubscriptionAction('pause')}
                      className="w-full px-4 py-3 text-yellow-600 border border-yellow-600 rounded-lg hover:bg-yellow-50 transition-colors"
                    >
                      Pause Subscription
                    </button>
                    <button
                      onClick={() => handleSubscriptionAction('cancel')}
                      className="w-full px-4 py-3 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Cancel Subscription
                    </button>
                  </>
                )}
                
                {subscription.status === 'paused' && (
                  <>
                    <button
                      onClick={() => handleSubscriptionAction('resume')}
                      className="w-full px-4 py-3 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      Resume Subscription
                    </button>
                    <button
                      onClick={() => handleSubscriptionAction('cancel')}
                      className="w-full px-4 py-3 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Cancel Subscription
                    </button>
                  </>
                )}
                
                {subscription.status === 'cancelled' && (
                  <div className="text-center text-gray-500 py-4">
                    This subscription has been cancelled
                  </div>
                )}
              </div>
            </div>

            {/* Next Delivery */}
            {subscription.status === 'active' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Next Delivery</h3>
                <p className="text-green-700 text-sm">
                  Your next delivery is scheduled based on your {subscription.frequency} subscription. 
                  We'll send you a notification before each shipment.
                </p>
              </div>
            )}

            {/* Help & Support */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Need Help?</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium text-blue-800">Update Address</h4>
                  <p className="text-blue-700">Contact support to update your shipping address</p>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800">Change Frequency</h4>
                  <p className="text-blue-700">Modify your delivery schedule anytime</p>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800">Questions?</h4>
                  <p className="text-blue-700">Our support team is here to help</p>
                </div>
              </div>
            </div>
          </div>
          </div>
    </div>
  );
};

export default CustomerSubscriptionDetailPage; 