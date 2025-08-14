"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from "../convex/_generated/api";
import { FaHeart } from 'react-icons/fa';

const WishlistIcon = () => {
  const wishlist = useQuery(api.wishlist.getWishlist) || [];
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const wishlistCount = Array.isArray(wishlist) ? wishlist.length : 0;

  if (!isMounted) {
    return (
      <Link
        href="/wishlist"
        className="relative flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 hover:bg-amber-200 transition-colors duration-200"
      >
        <FaHeart className="text-amber-600 text-lg" />
      </Link>
    );
  }

  return (
    <Link
      href="/wishlist"
      className="relative flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 hover:bg-amber-200 transition-colors duration-200"
      aria-label="Go to wishlist"
    >
      <FaHeart className="text-amber-600 text-lg" />
      {wishlistCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {wishlistCount}
        </span>
      )}
    </Link>
  );
};

export default WishlistIcon;


