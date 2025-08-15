"use client";

import { useUser } from "@clerk/nextjs";
import { ReactNode } from "react";
import AuthPrompt from "./AuthPrompt";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  requireAuth?: boolean;
}

export default function AuthGuard({ 
  children, 
  fallback,
  requireAuth = true 
}: AuthGuardProps) {
  const { user, isLoaded } = useUser();

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  // If authentication is not required, show children
  if (!requireAuth) {
    return <>{children}</>;
  }

  // If user is authenticated, show children
  if (user) {
    return <>{children}</>;
  }

  // If user is not authenticated, show fallback or default auth prompt
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default authentication prompt
  return (
    <AuthPrompt 
      title="Sign in required"
      description="Please sign in to access this feature and manage your cart and wishlist."
    />
  );
}
