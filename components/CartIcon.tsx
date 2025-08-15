"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaShoppingCart } from 'react-icons/fa';
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";

const CartIcon = () => {
  const { user, isLoaded } = useUser();
  const cart = useQuery(api.cart.getCart) || [];
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const cartItemCount = Array.isArray(cart)
    ? cart.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0)
    : 0;

  if (!isMounted) {
    return (
      <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 hover:bg-amber-200 transition-colors duration-200">
        <FaShoppingCart className="text-amber-600 text-lg" />
      </div>
    );
  }

  // If user is not authenticated, show sign-in prompt on hover
  if (!user && isLoaded) {
    return (
      <div className="relative group">
        <SignInButton mode="modal">
          <button className="relative flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 hover:bg-amber-200 transition-colors duration-200">
            <FaShoppingCart className="text-amber-600 text-lg" />
          </button>
        </SignInButton>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          Sign in to view cart
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    );
  }

  // If user is authenticated, show cart with count
  return (
    <Link
      href="/cart"
      className="relative flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 hover:bg-amber-200 transition-colors duration-200"
    >
      <FaShoppingCart className="text-amber-600 text-lg" />
      {cartItemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {cartItemCount}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
