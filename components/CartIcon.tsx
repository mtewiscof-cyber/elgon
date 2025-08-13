"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaShoppingCart } from 'react-icons/fa';
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

const CartIcon = () => {
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
      <Link
        href="/cart"
        className="relative flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 hover:bg-amber-200 transition-colors duration-200"
      >
        <FaShoppingCart className="text-amber-600 text-lg" />
      </Link>
    );
  }

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
