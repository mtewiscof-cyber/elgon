'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Id } from '@/convex/_generated/dataModel';

// Add type for coffeePreferences
type CoffeePreferences = {
  roastLevel?: string;
  origin?: string[];
  flavorProfiles?: string[];
};

const CustomerProfilePage = () => {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const router = useRouter();

  // Fetch the user document from Convex to get the role and user ID
  const user = useQuery(api.users.getUserByUserId);
  const isUserLoaded = user !== undefined; // User is loaded if the query returns a value (can be null if not authenticated)

  // Fetch the customer document for the user
  const customer = useQuery(
    api.customers.getCustomerByUserId,
    user?._id ? { userId: user._id } : 'skip' // Pass user._id if user is loaded
  );
  const isCustomerLoaded = customer !== undefined;

  const updateUserMutation = useMutation(api.users.updateUser);
  const updateCustomerMutation = useMutation(api.customers.updateCustomer);

  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: { street: '', city: '', state: '', zip: '', country: '' },
  });
  const [customerData, setCustomerData] = useState({
    isWholesale: false,
    isCompany: false,
    companyName: '',
    companyRole: '',
    companyPhoneNumber: '',
    companyAddress: { street: '', city: '', state: '', zip: '', country: '' },
    coffeePreferences: {} as CoffeePreferences,
  });

  // Populate form data when user and customer data are loaded
  useEffect(() => {
    if (user) {
      setUserData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || { street: '', city: '', state: '', zip: '', country: '' },
      });
    }
    if (customer) {
      setCustomerData({
        isWholesale: customer.isWholesale || false,
        isCompany: customer.isCompany || false,
        companyName: customer.companyName || '',
        companyRole: customer.companyRole || '',
        companyPhoneNumber: customer.companyPhoneNumber || '',
        companyAddress: customer.companyAddress || { street: '', city: '', state: '', zip: '', country: '' },
        coffeePreferences: customer.coffeePreferences || {},
      });
    }
  }, [user, customer]);

  // Redirect if user data is loaded and user is not authenticated or not a customer
  useEffect(() => {
    // Wait for both Clerk user status and Convex user data to load
    if (clerkLoaded && isUserLoaded) {
      // If clerkUser is null, they are not authenticated
      // If user is null or role is not 'customer', they are not authorized for customer dashboard
      if (!clerkUser || user?.role !== 'customer') {
        router.push('/'); // Redirect to home or an unauthorized page
      } else if (user?.role === 'customer' && !isCustomerLoaded && customer === null) {
        // If user is a customer but customer data is null, they might need to complete onboarding
        // Check if they have the 'customer' role but no customer document
        if (user?.role === 'customer' && customer === null) {
            // Redirect to customer onboarding if they are a customer but no customer document exists
             router.push('/onboarding/customer');
        }
      }
    }
  }, [clerkLoaded, isUserLoaded, isCustomerLoaded, clerkUser, user, customer, router]);

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

   const handleCustomerInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // For checkboxes, use checked property
    const checked = (e.target as HTMLInputElement).type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setCustomerData(prev => ({
      ...prev,
      [name]: checked !== undefined ? checked : value
    }));
  };

   const handleCompanyAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({
      ...prev,
      companyAddress: {
        ...prev.companyAddress,
        [name]: value
      }
    }));
  };

   const handleCoffeePreferencesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setCustomerData(prev => ({
         ...prev,
         coffeePreferences: {
            ...prev.coffeePreferences,
            [name]: value
         }
      }));
   };

   const handleCoffeePreferencesArrayChange = (name: 'origin' | 'flavorProfiles', value: string) => {
       setCustomerData(prev => ({
         ...prev,
         coffeePreferences: {
            ...prev.coffeePreferences,
            [name]: value.split(',').map(item => item.trim())
         }
      }));
   }

  const handleSave = async () => {
    if (!user?._id || (customer === null && !customerData.isCompany && !customerData.isWholesale && Object.values(customerData.coffeePreferences).every(val => (Array.isArray(val) ? val.length === 0 : !val)))) {
       // If user exists but customer is null and no customer-specific data is provided, only update user
        if (user?._id) {
            try {
                await updateUserMutation({ id: user._id, ...userData });
                setIsEditing(false);
            } catch (error) {
                console.error("Failed to update user:", error);
                alert("Failed to update user profile.");
            }
        }
    } else if (user?._id && customer?._id) {
       // If both user and customer documents exist, update both
        try {
            await updateUserMutation({ id: user._id, ...userData });
            await updateCustomerMutation({ customerId: customer._id, ...customerData });
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update profiles:", error);
             alert("Failed to update profiles.");
        }
    } else if (user?._id && customer === null) {
       // If user exists but customer does not, and customer-specific data is provided, create customer and update user
       // Note: Creating customer should ideally be done during onboarding. This case might indicate an issue.
       // For now, we'll just update the user profile.
        try {
            await updateUserMutation({ id: user._id, ...userData });
            setIsEditing(false);
        } catch (error) {
             console.error("Failed to update user (customer document missing):", error);
             alert("Failed to update user profile. Customer document is missing.");
        }
    }
  };

  // Show a loading state while user data is loading or if not authenticated/authorized
  // Adjusted loading check to account for potential null customer for a 'customer' role
  if (!clerkLoaded || !isUserLoaded || !clerkUser || (user?.role === 'customer' && customer === undefined)) {
     return <div className="container section">Loading or Authenticating...</div>;
  }

  // After loading, check if the user is a customer before rendering the dashboard
   if (user?.role !== 'customer') {
      // This case should ideally be handled by the useEffect redirect, but included as a fallback render
      return <div className="container section">Access Denied. You are not a customer.</div>;
   }

   // User is loaded and is a customer (customer document may be null if onboarding is incomplete)
  return (
    <div className="page-content container section">
      <h1 style={{ color: 'var(--primary)' }}>Your Profile</h1>
      <p className="lead">View and manage your profile information.</p>

      <div className="card" style={{ marginTop: 'var(--spacing-lg)' }}>
        <h3>User Details</h3>
         {!isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div><span className="font-semibold">Email:</span> {user?.email}</div>
                <div><span className="font-semibold">Role:</span> {user?.role || 'user'}</div>
                <div><span className="font-semibold">First Name:</span> {user?.firstName || 'N/A'}</div>
                <div><span className="font-semibold">Last Name:</span> {user?.lastName || 'N/A'}</div>
                <div><span className="font-semibold">Phone:</span> {user?.phoneNumber || 'N/A'}</div>
                {user?.address && (
                   <div className="md:col-span-2">
                      <span className="font-semibold">Address:</span> {user.address.street}, {user.address.city}, {user.address.state}, {user.address.zip}, {user.address.country}
                   </div>
                )}
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                 <div>
                   <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                    <input type="text" id="firstName" name="firstName" value={userData.firstName} onChange={handleUserInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                 </div>
                  <div>
                   <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input type="text" id="lastName" name="lastName" value={userData.lastName} onChange={handleUserInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                 </div>
                 <div>
                   <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input type="text" id="phoneNumber" name="phoneNumber" value={userData.phoneNumber} onChange={handleUserInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                 </div>
                  {/* Address Fields */}
                 <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div>
                       <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street</label>
                       <input type="text" id="street" name="street" value={userData.address.street} onChange={handleUserAddressChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                    </div>
                    <div>
                       <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                       <input type="text" id="city" name="city" value={userData.address.city} onChange={handleUserAddressChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                    </div>
                     <div>
                       <label htmlFor="state" className="block text-sm font-medium text-gray-700">State / Province</label>
                       <input type="text" id="state" name="state" value={userData.address.state} onChange={handleUserAddressChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                    </div>
                     <div>
                       <label htmlFor="zip" className="block text-sm font-medium text-gray-700">Zip / Postal Code</label>
                       <input type="text" id="zip" name="zip" value={userData.address.zip} onChange={handleUserAddressChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                    </div>
                     <div className="md:col-span-2">
                       <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                       <input type="text" id="country" name="country" value={userData.address.country} onChange={handleUserAddressChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                    </div>
                 </div>
            </div>
         )}
      </div>

       {customer && (
          <div className="card" style={{ marginTop: 'var(--spacing-lg)' }}>
            <h3>Customer Details</h3>
             {!isEditing ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                   <div><span className="font-semibold">Is Wholesale:</span> {customer.isWholesale ? 'Yes' : 'No'}</div>
                   {customer.isCompany && (
                      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-md">
                         <div><span className="font-semibold">Is Company:</span> Yes</div>
                         <div><span className="font-semibold">Company Name:</span> {customer.companyName || 'N/A'}</div>
                         <div><span className="font-semibold">Company Role:</span> {customer.companyRole || 'N/A'}</div>
                         <div><span className="font-semibold">Company Phone:</span> {customer.companyPhoneNumber || 'N/A'}</div>
                         {customer.companyAddress && (
                            <div className="md:col-span-2">
                               <span className="font-semibold">Company Address:</span> {customer.companyAddress.street}, {customer.companyAddress.city}, {customer.companyAddress.state}, {customer.companyAddress.zip}, {customer.companyAddress.country}
                            </div>
                         )}
                      </div>
                   )}
                   {customer.coffeePreferences && (
                      <div className="md:col-span-2">
                         <span className="font-semibold">Coffee Preferences:</span>
                          <ul className="list-disc list-inside ml-4">
                            {customer.coffeePreferences.roastLevel && <li>Roast Level: {customer.coffeePreferences.roastLevel}</li>}
                            {(customer.coffeePreferences.origin?.length ?? 0) > 0 && <li>Origin(s): {customer.coffeePreferences.origin?.join(', ')}</li>}
                            {(customer.coffeePreferences.flavorProfiles?.length ?? 0) > 0 && <li>Flavor Profile(s): {customer.coffeePreferences.flavorProfiles?.join(', ')}</li>}
                          </ul>
                      </div>
                   )}
                </div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                   <div className="md:col-span-2">
                       <label htmlFor="isWholesale" className="flex items-center">
                           <input type="checkbox" id="isWholesale" name="isWholesale" checked={customerData.isWholesale} onChange={handleCustomerInputChange} className="mr-2 rounded border-gray-300 text-primary shadow-sm focus:border-primary focus:ring-primary" />
                           <span className="text-sm font-medium text-gray-700">Is Wholesale Customer</span>
                       </label>
                   </div>
                    <div className="md:col-span-2">
                       <label htmlFor="isCompany" className="flex items-center">
                           <input type="checkbox" id="isCompany" name="isCompany" checked={customerData.isCompany} onChange={handleCustomerInputChange} className="mr-2 rounded border-gray-300 text-primary shadow-sm focus:border-primary focus:ring-primary" />
                           <span className="text-sm font-medium text-gray-700">Is Company</span>
                       </label>
                   </div>

                   {customerData.isCompany && (
                      <>
                         <div>
                           <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
                            <input type="text" id="companyName" name="companyName" value={customerData.companyName} onChange={handleCustomerInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                         </div>
                          <div>
                           <label htmlFor="companyRole" className="block text-sm font-medium text-gray-700">Company Role</label>
                            <input type="text" id="companyRole" name="companyRole" value={customerData.companyRole} onChange={handleCustomerInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                         </div>
                          <div>
                           <label htmlFor="companyPhoneNumber" className="block text-sm font-medium text-gray-700">Company Phone</label>
                            <input type="text" id="companyPhoneNumber" name="companyPhoneNumber" value={customerData.companyPhoneNumber} onChange={handleCustomerInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                         </div>
                         {/* Company Address Fields */}
                         <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-md">
                            <div>
                               <label htmlFor="companyStreet" className="block text-sm font-medium text-gray-700">Company Street</label>
                               <input type="text" id="companyStreet" name="street" value={customerData.companyAddress.street} onChange={handleCompanyAddressChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                            </div>
                            <div>
                               <label htmlFor="companyCity" className="block text-sm font-medium text-gray-700">Company City</label>
                               <input type="text" id="companyCity" name="city" value={customerData.companyAddress.city} onChange={handleCompanyAddressChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                            </div>
                             <div>
                               <label htmlFor="companyState" className="block text-sm font-medium text-gray-700">Company State / Province</label>
                               <input type="text" id="companyState" name="state" value={customerData.companyAddress.state} onChange={handleCompanyAddressChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                            </div>
                             <div>
                               <label htmlFor="companyZip" className="block text-sm font-medium text-gray-700">Company Zip / Postal Code</label>
                               <input type="text" id="companyZip" name="zip" value={customerData.companyAddress.zip} onChange={handleCompanyAddressChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                            </div>
                             <div className="md:col-span-2">
                               <label htmlFor="companyCountry" className="block text-sm font-medium text-gray-700">Company Country</label>
                               <input type="text" id="companyCountry" name="country" value={customerData.companyAddress.country} onChange={handleCompanyAddressChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                            </div>
                         </div>
                      </>
                   )}

                   {/* Coffee Preferences */}
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-md">
                        <div>
                           <label htmlFor="roastLevel" className="block text-sm font-medium text-gray-700">Preferred Roast Level</label>
                            <select id="roastLevel" name="roastLevel" value={customerData.coffeePreferences?.roastLevel ?? ''} onChange={handleCoffeePreferencesChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm">
                               <option value="">Select...</option>
                               <option value="light">Light</option>
                               <option value="medium">Medium</option>
                               <option value="dark">Dark</option>
                            </select>
                        </div>
                         <div>
                           <label htmlFor="origin" className="block text-sm font-medium text-gray-700">Preferred Origins (comma-separated)</label>
                            <input type="text" id="origin" name="origin" value={customerData.coffeePreferences?.origin?.join(', ') ?? ''} onChange={(e) => handleCoffeePreferencesArrayChange('origin', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                         </div>
                          <div className="md:col-span-2">
                           <label htmlFor="flavorProfiles" className="block text-sm font-medium text-gray-700">Preferred Flavor Profiles (comma-separated)</label>
                            <input type="text" id="flavorProfiles" name="flavorProfiles" value={customerData.coffeePreferences?.flavorProfiles?.join(', ') ?? ''} onChange={(e) => handleCoffeePreferencesArrayChange('flavorProfiles', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                         </div>
                    </div>

                </div>
             )}
          </div>
       )}

      <div className="mt-6 flex justify-end">
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="btn btn-secondary">Edit Profile</button>
        ) : (
          <> {/* Use a fragment for multiple buttons */}
            <button onClick={() => {
               setIsEditing(false);
                // Reset form data if cancelling (optional, could also keep changes)
                if (user) {
                   setUserData({
                     firstName: user.firstName || '',
                     lastName: user.lastName || '',
                     phoneNumber: user.phoneNumber || '',
                     address: user.address || { street: '', city: '', state: '', zip: '', country: '' },
                   });
                 }
                 if (customer) {
                   setCustomerData({
                      isWholesale: customer.isWholesale || false,
                      isCompany: customer.isCompany || false,
                      companyName: customer.companyName || '',
                      companyRole: customer.companyRole || '',
                      companyPhoneNumber: customer.companyPhoneNumber || '',
                      companyAddress: customer.companyAddress || { street: '', city: '', state: '', zip: '', country: '' },
                      coffeePreferences: customer.coffeePreferences || {},
                   });
                 }
            }} className="btn btn-secondary mr-4">Cancel</button>
            <button onClick={handleSave} className="btn btn-primary">Save Changes</button>
          </>
        )}
      </div>

    </div>
  );
};

export default CustomerProfilePage; 