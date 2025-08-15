import { useUser } from "@clerk/nextjs";
import { useCallback } from "react";

export function useAuth() {
  const { user, isLoaded, isSignedIn } = useUser();

  const requireAuth = useCallback((action: () => void, fallback?: () => void) => {
    if (!isLoaded) return; // Still loading
    
    if (isSignedIn && user) {
      action();
    } else if (fallback) {
      fallback();
    }
  }, [isLoaded, isSignedIn, user]);

  return {
    user,
    isLoaded,
    isSignedIn,
    requireAuth,
    isAuthenticated: isSignedIn && !!user
  };
}
