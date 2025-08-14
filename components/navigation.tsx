"use client";

import Link from 'next/link';
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Image from 'next/image';
import { useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { FaBars, FaTimes, FaInfoCircle, FaBox, FaBlog, FaNewspaper, FaEnvelope } from 'react-icons/fa';
import CartIcon from './CartIcon';
import WishlistIcon from './WishlistIcon';
import CustomUserButton from './CustomUserButton';
import { FloatingNav } from './ui/floating-navbar';
import { cn } from "@/lib/utils";

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const user = useQuery(api.users.getUserByUserId, clerkUser ? {} : "skip");

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Navigation items for the floating navbar
  const navItems = [
    {
      name: "Our Story",
      link: "/about",
      icon: <FaInfoCircle className="w-4 h-4" />
    },
    {
      name: "Products",
      link: "/products",
      icon: <FaBox className="w-4 h-4" />
    },
    {
      name: "Blog",
      link: "/blog",
      icon: <FaBlog className="w-4 h-4" />
    },
    {
      name: "News",
      link: "/news",
      icon: <FaNewspaper className="w-4 h-4" />
    },
    {
      name: "Contact",
      link: "/contact",
      icon: <FaEnvelope className="w-4 h-4" />
    }
  ];

  return (
    <>
      {/* Floating Navigation Bar */}
      <FloatingNav 
        navItems={navItems}
        className="hidden md:flex"
        cartComponent={
          <div className="flex items-center gap-2">
            <WishlistIcon />
            <CartIcon />
          </div>
        }
        user={user}
        clerkLoaded={clerkLoaded}
        clerkUser={clerkUser}
      />

      {/* Mobile Navigation Bar - Fixed at top for mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50">
        <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link
                  href="/"
                  className="flex items-center text-decoration-none text-inherit"
                >
                  <Image
                    src="/Main Logo.png"
                    alt="Mt.Elgon Women Logo Icon"
                    width={60}
                    height={60}
                    className="object-contain transition-all duration-200 hover:scale-105"
                  />
                </Link>
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center space-x-3">
                <WishlistIcon />
                <CartIcon />
                <button
                  onClick={toggleMenu}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500 transition-colors duration-200"
                  aria-expanded="false"
                  aria-label="Toggle menu"
                >
                  {menuOpen ? (
                    <FaTimes className="block h-6 w-6" />
                  ) : (
                    <FaBars className="block h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <div className={cn(
            "transition-all duration-300 ease-in-out overflow-hidden",
            menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}>
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.link}
                  onClick={closeMenu}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              ))}

              {/* Mobile User Actions */}
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex justify-center">
                  <SignedIn>
                    <CustomUserButton />
                  </SignedIn>
                  
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-900 rounded-full font-medium text-sm hover:bg-amber-200 transition-colors duration-200">
                        Sign In
                      </button>
                    </SignInButton>
                  </SignedOut>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navigation;
