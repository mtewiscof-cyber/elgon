"use client";

import Link from 'next/link';
import { FaShoppingCart } from 'react-icons/fa';
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useUser } from "@clerk/nextjs";

const CartIcon = () => {
  const { user: clerkUser } = useUser();
  const user = useQuery(api.users.getUserByUserId, clerkUser ? {} : "skip");
  
  // For now, we'll show a simple cart icon
  // In the future, this could be enhanced to show cart count and items
  const cartItemCount = 0; // This would be fetched from cart state

  return (
    <Link
      href="/products"
      className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[var(--accent)] hover:bg-[var(--accent)]/80 transition-colors duration-200 cart-icon"
      style={{
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <FaShoppingCart className="text-[var(--primary)] text-lg" />
      {cartItemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[var(--primary)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {cartItemCount}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
