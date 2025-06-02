'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@clerk/nextjs';
import { Id } from '@/convex/_generated/dataModel';

// Hardcoded options for checkboxes
const COFFEE_ORIGINS = ['Uganda', 'Ethiopia', 'Kenya', 'Colombia', 'Brazil', 'Indonesia', 'Guatemala', 'Costa Rica', 'Rwanda', 'Burundi'];
const FLAVOR_PROFILES = ['Fruity', 'Floral', 'Chocolatey', 'Nutty', 'Spicy', 'Sweet', 'Citrus', 'Berry', 'Caramel', 'Smoky'];

const CustomerOnboardingPage = () => {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();

  // Fetch the currently authenticated user document
  const user = useQuery(api.users.getUserByUserId, userId ? {} : 'skip');
  const isLoadingUser = user === undefined && isLoaded; // Corrected variable name

  const [formData, setFormData] = useState({
    coffeePreferences: {
      roastLevel: '',
      origin: [] as string[], // Now an array for checkboxes
      flavorProfiles: [] as string[], // Now an array for checkboxes
    },
    isWholesale: false,
    isCompany: false,
    companyName: '',
    companyRole: '',
    companyAddress: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    },
    companyPhoneNumber: '',
  });

  const [step, setStep] = useState(1); // Added step state

  const createCustomer = useMutation(api.customers.createCustomer);
  const changeUserRole = useMutation(api.users.changeUserRole);

  // Redirect if already onboarded or not signed in
  useEffect(() => {
    // Wait for auth and user data to load
    if (isLoaded && user && user.role === 'customer') {
      router.push('/'); // Adjust path as needed
    }
  }, [isLoaded, user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // Check if the target is an input element to safely access 'checked'
    const isCheckbox = type === 'checkbox' && e.target instanceof HTMLInputElement;

    if (name.startsWith('coffeePreferences.') && isCheckbox) {
      const prefName = name.split('.')[1] as keyof typeof formData.coffeePreferences;
      const checked = (e.target as HTMLInputElement).checked; // Access checked safely
      setFormData(prev => ({
        ...prev,
        coffeePreferences: {
          ...prev.coffeePreferences,
          [prefName]: checked
            ? [...(prev.coffeePreferences[prefName] as string[]), value]
            : (prev.coffeePreferences[prefName] as string[]).filter(item => item !== value)
        }
      }));
    } else if (name.startsWith('coffeePreferences.')) {
       const prefName = name.split('.')[1] as keyof typeof formData.coffeePreferences;
       setFormData(prev => ({
         ...prev,
         coffeePreferences: {
           ...prev.coffeePreferences,
           [prefName]: value
         }
       }));
    } else if (name.startsWith('companyAddress.')) {
       const addressPart = name.split('.')[1] as keyof typeof formData.companyAddress;
       setFormData(prev => ({
         ...prev,
         companyAddress: {
           ...prev.companyAddress,
           [addressPart]: value
         }
       }));
    } else if (isCheckbox) {
      // Handle top-level boolean checkboxes (isWholesale, isCompany)
       const checked = (e.target as HTMLInputElement).checked; // Access checked safely
       setFormData(prev => ({
         ...prev,
         [name]: checked
       }));
    } else {
      // Handle other text/textarea inputs
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !user) return; // Ensure user is loaded and authenticated

    try {
      await createCustomer({
        isWholesale: formData.isWholesale,
        isCompany: formData.isCompany,
        companyName: formData.companyName || undefined,
        companyRole: formData.companyRole || undefined,
        companyAddress: formData.isCompany && formData.companyAddress.street ? formData.companyAddress : undefined, // Only include address if it's a company and address is provided
        companyPhoneNumber: formData.companyPhoneNumber || undefined,
        coffeePreferences: { // Data is already in array format for submission
          roastLevel: formData.coffeePreferences.roastLevel || undefined,
          origin: formData.coffeePreferences.origin.length > 0 ? formData.coffeePreferences.origin : undefined,
          flavorProfiles: formData.coffeePreferences.flavorProfiles.length > 0 ? formData.coffeePreferences.flavorProfiles : undefined,
        }
      });
      
      // After successful customer creation, change the user's role to 'customer'
      if (user) {
        await changeUserRole({ id: user._id, role: 'customer' });
      }
      
      router.push('/customer/thank-you'); // Redirect to customer thank-you page after successful onboarding
    } catch (error) {
      console.error('Failed to create customer profile:', error);
      alert('Failed to create customer profile.');
    }
  };

  // Show loading state while auth and user data are loading, or if not authenticated
  if (!isLoaded || isLoadingUser || !userId) {
    return <div className="container section items-center justify-center">Loading...</div>; // Loading state
  }

  // User is signed in and has the 'customer' role, return null (redirect handled by useEffect)
  if (user && user.role === 'customer') {
    return null;
  }

  // User is signed in and doesn't have the 'customer' role yet, show onboarding steps
  return (
    <div className="page-content container section">
      <h1>Customer Onboarding</h1>
      <p className="lead">Please provide some details to complete your customer profile.</p>

      <div className="card" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <form onSubmit={handleSubmit}>
          {/* Step 1: Account Type */}
          {step === 1 && (
            <div>
              <h3>Account Type</h3>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', fontWeight: '500' }}>
                  <input type="checkbox" name="isWholesale" checked={formData.isWholesale} onChange={handleChange} style={{ marginRight: '0.5rem' }} />
                  Wholesale Customer
                </label>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', fontWeight: '500' }}>
                  <input type="checkbox" name="isCompany" checked={formData.isCompany} onChange={handleChange} style={{ marginRight: '0.5rem' }} />
                  Representing a Company/Business
                </label>
              </div>
              <button type="button" onClick={() => setStep(step + 1)} className="btn btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>Next</button>
            </div>
          )}

          {/* Step 2: Coffee Preferences */}
          {step === 2 && (
            <div>
              <h3>Coffee Preferences (Optional)</h3>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="roastLevel" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Preferred Roast Level</label>
                <input type="text" id="roastLevel" name="coffeePreferences.roastLevel" value={formData.coffeePreferences.roastLevel} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--primary)' }} placeholder="e.g., Medium, Dark" />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Preferred Origin(s)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {COFFEE_ORIGINS.map(origin => (
                    <label key={origin} style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        type="checkbox"
                        name="coffeePreferences.origin"
                        value={origin}
                        checked={formData.coffeePreferences.origin.includes(origin)}
                        onChange={handleChange}
                        style={{ marginRight: '0.25rem' }}
                      />
                      {origin}
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Flavor Profiles</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                   {FLAVOR_PROFILES.map(flavor => (
                    <label key={flavor} style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        type="checkbox"
                        name="coffeePreferences.flavorProfiles"
                        value={flavor}
                        checked={formData.coffeePreferences.flavorProfiles.includes(flavor)}
                        onChange={handleChange}
                        style={{ marginRight: '0.25rem' }}
                      />
                      {flavor}
                    </label>
                  ))}
                </div>
              </div>
              {/* Navigation buttons for Step 2 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                 <button type="button" onClick={() => setStep(step - 1)} className="btn btn-secondary">Previous</button>
                 {formData.isCompany ? (
                   <button type="button" onClick={() => setStep(step + 1)} className="btn btn-secondary">Next</button>
                 ) : (
                   <button type="submit" className="btn btn-primary">Complete Onboarding</button>
                 )}
              </div>
            </div>
          )}

          {/* Step 3: Company Details (Conditional) */}
          {step === 3 && formData.isCompany && (
            <div>
              <h3>Company Details (Optional)</h3>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="companyName" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Company Name</label>
                <input type="text" id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--primary)' }} />
              </div>
               <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="companyRole" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Your Role at Company</label>
                <input type="text" id="companyRole" name="companyRole" value={formData.companyRole} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--primary)' }} />
               </div>
               <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="companyPhoneNumber" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Company Phone Number</label>
                <input type="text" id="companyPhoneNumber" name="companyPhoneNumber" value={formData.companyPhoneNumber} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--primary)' }} />
               </div>
               {/* Company Address */}
               <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="companyAddress.street" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Company Street Address</label>
                <input type="text" id="companyAddress.street" name="companyAddress.street" value={formData.companyAddress.street} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--primary)' }} />
               </div>
                <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                   <div style={{ flex: 1 }}>
                     <label htmlFor="companyAddress.city" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>City</label>
                      <input type="text" id="companyAddress.city" name="companyAddress.city" value={formData.companyAddress.city} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--primary)' }} />
                   </div>
                   <div style={{ flex: 1 }}>
                      <label htmlFor="companyAddress.state" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>State/Province</label>
                      <input type="text" id="companyAddress.state" name="companyAddress.state" value={formData.companyAddress.state} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--primary)' }} />
                   </div>
                </div>
                <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                     <label htmlFor="companyAddress.zip" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Zip/Postal Code</label>
                     <input type="text" id="companyAddress.zip" name="companyAddress.zip" value={formData.companyAddress.zip} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--primary)' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                     <label htmlFor="companyAddress.country" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Country</label>
                     <input type="text" id="companyAddress.country" name="companyAddress.country" value={formData.companyAddress.country} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--primary)' }} />
                  </div>
                </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                   <button type="button" onClick={() => setStep(step - 1)} className="btn btn-secondary">Previous</button>
                   <button type="submit" className="btn btn-primary">Complete Onboarding</button>
                </div>
              </div>
            )}
        </form>
      </div>
    </div>
  );
};

export default CustomerOnboardingPage;
