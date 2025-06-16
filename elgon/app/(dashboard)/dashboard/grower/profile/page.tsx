'use client';

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function GrowerProfilePage() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  
  // Fetch the Convex user document
  const convexUser = useQuery(api.users.getUserByUserId);
  
  // Fetch the grower profile if we have a user ID
  const growerProfile = useQuery(
    api.growers.getGrowerByUserId,
    convexUser?._id ? { userId: convexUser._id } : "skip"
  );

  if (!clerkLoaded || !convexUser || !growerProfile) {
    return <div className="p-4">Loading profile data...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Grower Profile</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">User Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Name</p>
            <p className="font-medium">{clerkUser?.firstName} {clerkUser?.lastName}</p>
          </div>
          <div>
            <p className="text-gray-600">Email</p>
            <p className="font-medium">{convexUser.email}</p>
          </div>
          {/* Additional user information can be added here */}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Grower Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Farm Name</p>
            <p className="font-medium">{growerProfile.farmName || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-gray-600">Location</p>
            <p className="font-medium">{growerProfile.location}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-600">Farm Location Details</p>
            <p className="font-medium">{growerProfile.farmLocationDetails || 'Not specified'}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-600">Story</p>
            <p className="font-medium">{growerProfile.story || 'No story provided yet.'}</p>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Coffee Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Coffee Varieties</p>
              <p className="font-medium">
                {growerProfile.coffeeVarieties?.length 
                  ? growerProfile.coffeeVarieties.join(', ') 
                  : 'No varieties specified'}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Processing Methods</p>
              <p className="font-medium">
                {growerProfile.processingMethods?.length 
                  ? growerProfile.processingMethods.join(', ') 
                  : 'No methods specified'}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Certifications</p>
              <p className="font-medium">
                {growerProfile.certifications?.length 
                  ? growerProfile.certifications.join(', ') 
                  : 'No certifications'}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Elevation</p>
              <p className="font-medium">
                {growerProfile.elevation 
                  ? `${growerProfile.elevation} meters` 
                  : 'Not specified'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 