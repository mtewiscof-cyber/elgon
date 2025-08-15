# Authentication System for Elgon Coffee

This document describes the authentication system implemented for the Elgon Coffee e-commerce platform, specifically for cart and wishlist functionality.

## Overview

The authentication system ensures that users must be signed in to:
- Add items to cart
- Add items to wishlist
- View cart contents
- View wishlist contents
- Proceed to checkout

## Components

### 1. AuthGuard
A wrapper component that protects content behind authentication.

```tsx
import AuthGuard from "@/components/AuthGuard";

<AuthGuard>
  {/* Protected content - only shown to authenticated users */}
  <CartItems />
</AuthGuard>
```

**Props:**
- `children`: Content to show when authenticated
- `fallback`: Custom content to show when not authenticated
- `requireAuth`: Whether authentication is required (default: true)

### 2. AuthPrompt
A reusable authentication prompt component.

```tsx
import AuthPrompt from "@/components/AuthPrompt";

<AuthPrompt 
  title="Sign in to continue"
  description="Please sign in to access your cart."
  icon={<CartIcon />}
/>
```

**Props:**
- `title`: Prompt title
- `description`: Prompt description
- `icon`: Optional icon to display
- `showSignUp`: Whether to show sign-up option (default: true)
- `className`: Additional CSS classes

### 3. useAuth Hook
A custom hook for authentication state management.

```tsx
import { useAuth } from "@/hooks/useAuth";

const { user, isLoaded, isSignedIn, requireAuth } = useAuth();

requireAuth(
  () => addToCart(productId), // Action when authenticated
  () => showSignInModal()     // Fallback when not authenticated
);
```

## Implementation Details

### Cart Icon
- Shows cart count for authenticated users
- Shows sign-in button for unauthenticated users
- Includes tooltip explaining authentication requirement

### Wishlist Icon
- Shows wishlist count for authenticated users
- Shows sign-in button for unauthenticated users
- Includes tooltip explaining authentication requirement

### Product Pages
- Add to cart button shows "Sign in to add to cart" for unauthenticated users
- Wishlist button shows sign-in prompt for unauthenticated users
- Both buttons trigger Clerk authentication modal when clicked

### Protected Pages
- **Cart Page**: Shows authentication prompt for unauthenticated users
- **Wishlist Page**: Shows authentication prompt for unauthenticated users
- **Checkout Page**: Requires authentication to proceed

## User Experience

1. **Unauthenticated users** see clear prompts explaining they need to sign in
2. **Authentication flow** is seamless with Clerk's modal system
3. **Visual feedback** through tooltips and button text changes
4. **Consistent messaging** across all protected features

## Backend Security

- All cart and wishlist operations require valid authentication
- Convex functions check `auth.getUserIdentity()` before processing requests
- Unauthenticated requests return empty arrays or throw errors

## Mobile Responsiveness

All authentication components are mobile-responsive and follow the existing design system:
- Proper touch targets for mobile devices
- Responsive layouts and spacing
- Consistent with the amber color scheme

## Usage Examples

### Basic Authentication Guard
```tsx
<AuthGuard>
  <UserDashboard />
</AuthGuard>
```

### Custom Fallback
```tsx
<AuthGuard
  fallback={
    <div className="text-center">
      <h2>Please sign in to continue</h2>
      <p>This feature requires authentication.</p>
    </div>
  }
>
  <ProtectedFeature />
</AuthGuard>
```

### Conditional Authentication
```tsx
<AuthGuard requireAuth={false}>
  <PublicContent />
</AuthGuard>
```

## Future Enhancements

- Guest cart functionality (optional)
- Social authentication options
- Remember user preferences
- Progressive web app authentication
