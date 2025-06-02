'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useAuth } from '@clerk/nextjs';
import { Id } from '@/convex/_generated/dataModel';

// Hardcoded options for checkboxes
const COFFEE_VARIETIES = ['Arabica', 'Robusta', 'Liberica', 'Excelsa', 'Geisha', 'SL28', 'SL34'];
const PROCESSING_METHODS = ['Washed', 'Natural', 'Honey', 'Wet-hulled', 'Pulped Natural'];
const CERTIFICATIONS = ['Organic', 'Fair Trade', 'Rainforest Alliance', 'UTZ', 'Bird Friendly'];

const GrowerOnboardingPage = () => {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();

  // Fetch the currently authenticated user document
  const user = useQuery(api.users.getUserByUserId, userId ? {} : 'skip');
  const isLoadingUser = user === undefined && isLoaded;

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    story: '',
    imageUrl: '',
    farmName: '',
    farmLocationDetails: '',
    coffeeVarieties: [] as string[], // Now an array for checkboxes
    processingMethods: [] as string[], // Now an array for checkboxes
    certifications: [] as string[], // Now an array for checkboxes
    elevation: '',
  });

  const [step, setStep] = useState(1); // Added step state

  const createGrower = useMutation(api.growers.createGrower);
  const changeUserRole = useMutation(api.users.changeUserRole);

  // Redirect if already onboarded or not signed in
  useEffect(() => {
    if (isLoaded && user && user.role === 'grower') {
      router.push('/'); // Adjust path as needed
    }
  }, [isLoaded, user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target; // Added type here
    const isCheckbox = type === 'checkbox' && e.target instanceof HTMLInputElement; // Added type check for checkbox

    if (isCheckbox) {
      const fieldName = name as keyof typeof formData; // Cast name to keyof formData
      const checked = (e.target as HTMLInputElement).checked;

      setFormData(prev => ({
        ...prev,
        [fieldName]: checked
          ? [...(prev[fieldName] as string[]), value]
          : ((prev[fieldName] as string[])).filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || value : value // Convert elevation to number if applicable
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !user) return; // Ensure user is loaded and authenticated

    try {
      await createGrower({
        name: formData.name,
        location: formData.location,
        story: formData.story || undefined, // Make optional fields undefined if empty
        imageUrl: formData.imageUrl || undefined,
        farmName: formData.farmName || undefined,
        farmLocationDetails: formData.farmLocationDetails || undefined,
        coffeeVarieties: formData.coffeeVarieties.length > 0 ? formData.coffeeVarieties : undefined, // Use array directly
        processingMethods: formData.processingMethods.length > 0 ? formData.processingMethods : undefined, // Use array directly
        certifications: formData.certifications.length > 0 ? formData.certifications : undefined, // Use array directly
        elevation: typeof formData.elevation === 'number' && !isNaN(formData.elevation) ? formData.elevation : undefined, // Ensure elevation is a valid number
      });
      
      // After successful grower creation, change the user's role to 'grower'
      if (user) {
        await changeUserRole({ id: user._id, role: 'grower' });
      }
      
      router.push('/grower/thank-you'); // Redirect to grower thank-you page after successful onboarding
    } catch (error) {
      console.error('Failed to create grower profile:', error);
      alert('Failed to create grower profile.');
    }
  };

  if (!isLoaded || isLoadingUser) {
    return <div className="container section items-center justify-center">Loading...</div>; // Loading state
  }

  // User is signed in and no grower profile exists or user doesn't have grower role, show form
  if (!user || user.role !== 'grower') {
    return (
      <div className="page-content container section">
        <h1>Grower Onboarding</h1>
        <p className="lead">Please provide details about your farm and coffee production.</p>
        
        <div className="card" style={{ maxWidth: '600px', margin: '2rem auto' }}>
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal and Farm Information */}
            {step === 1 && (
              <div>
                <h3>Personal and Farm Information</h3>
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Your Name</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--primary)' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="farmName" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Farm Name (Optional)</label>
                  <input type="text" id="farmName" name="farmName" value={formData.farmName} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--primary)' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="location" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Location (District/Region)</label>
                  <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--primary)' }} placeholder="e.g., Mbale, Eastern Uganda" />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="farmLocationDetails" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Specific Farm Location Details (Optional)</label>
                  <textarea id="farmLocationDetails" name="farmLocationDetails" value={formData.farmLocationDetails} onChange={handleChange} rows={3} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--primary)', resize: 'vertical' }} placeholder="e.g., Near Bududa town, slopes of Mt. Elgon" />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="story" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Your Story / About Your Farm (Optional)</label>
                  <textarea id="story" name="story" value={formData.story} onChange={handleChange} rows={5} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--primary)', resize: 'vertical' }} placeholder="Tell us about your journey as a coffee grower..." />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="imageUrl" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Profile Image URL (Optional)</label>
                  <input type="text" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--primary)' }} placeholder="Link to an image of you or your farm" />
                </div>
                <button type="button" onClick={() => setStep(step + 1)} className="btn btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>Next</button>
              </div>
            )}

            {/* Step 2: Coffee Production Details */}
            {step === 2 && (
              <div>
                <h3>Coffee Production Details (Optional)</h3>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Coffee Varieties Grown</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {COFFEE_VARIETIES.map(variety => (
                      <label key={variety} style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                          type="checkbox"
                          name="coffeeVarieties"
                          value={variety}
                          checked={formData.coffeeVarieties.includes(variety)}
                          onChange={handleChange}
                          style={{ marginRight: '0.25rem' }}
                        />
                        {variety}
                      </label>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Processing Methods Used</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {PROCESSING_METHODS.map(method => (
                      <label key={method} style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                          type="checkbox"
                          name="processingMethods"
                          value={method}
                          checked={formData.processingMethods.includes(method)}
                          onChange={handleChange}
                          style={{ marginRight: '0.25rem' }}
                        />
                        {method}
                      </label>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Certifications</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {CERTIFICATIONS.map(cert => (
                      <label key={cert} style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                          type="checkbox"
                          name="certifications"
                          value={cert}
                          checked={formData.certifications.includes(cert)}
                          onChange={handleChange}
                          style={{ marginRight: '0.25rem' }}
                        />
                        {cert}
                      </label>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="elevation" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Elevation (in meters, Optional)</label>
                  <input type="number" id="elevation" name="elevation" value={formData.elevation} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--border-radius)', border: '1px solid var(--primary)' }} placeholder="e.g., 1800" />
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
  } else {
    // If user exists and has grower role, return null (redirect handled by useEffect)
    return null;
  }
};

export default GrowerOnboardingPage;
