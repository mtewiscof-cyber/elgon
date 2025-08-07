"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaShoppingCart } from 'react-icons/fa';

const FixedShopButton = () => {
  const pathname = usePathname();
  
  // Don't show on products page or dashboard pages
  if (pathname === '/products' || pathname.startsWith('/dashboard')) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link
        href="/products"
        className="group flex items-center gap-3 bg-[var(--primary)] text-white px-6 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-[var(--primary)]/90"
        style={{
          boxShadow: '0 8px 32px 0 rgba(80,60,120,0.25)',
        }}
      >
        <FaShoppingCart className="text-lg group-hover:animate-bounce" />
        <span className="font-semibold text-base">Shop Now</span>
      </Link>
    </div>
  );
};

export default FixedShopButton;
