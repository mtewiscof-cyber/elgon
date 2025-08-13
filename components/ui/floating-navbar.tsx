"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import Image from 'next/image';
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import CustomUserButton from '../CustomUserButton';

export const FloatingNav = ({
  navItems,
  className,
  cartComponent,
  user,
  clerkLoaded,
  clerkUser,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
  cartComponent: React.ReactNode;
  user: any;
  clerkLoaded: boolean;
  clerkUser: any;
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div
      className={cn(
        "flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full dark:bg-black bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] px-6 py-3 items-center justify-center space-x-6",
        className
      )}
    >
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center text-decoration-none text-inherit"
      >
        <Image
          src="/Main Logo.png"
          alt="Mt.Elgon Women Logo Icon"
          width={128}
          height={128}
          priority
          className="object-contain transition-all duration-200 hover:scale-105"
        />
      </Link>

      {/* Navigation Items */}
      <div className="flex items-center space-x-6">
        {navItems.map((navItem: any, idx: number) => (
          <a
            key={`link=${idx}`}
            href={navItem.link}
            className={cn(
              "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500 transition-colors duration-200 text-sm font-medium"
            )}
          >
            <span className="block sm:hidden">{navItem.icon}</span>
            <span className="hidden sm:block">{navItem.name}</span>
          </a>
        ))}
      </div>

      {/* Cart */}
      <div className="flex items-center">
        {cartComponent}
      </div>

      {/* User Actions */}
      <div className="flex items-center">
        {isMounted ? (
          <>
            <SignedIn>
              <CustomUserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="inline-flex items-center px-3 py-2 bg-amber-100 text-amber-900 rounded-full font-medium text-xs hover:bg-amber-200 transition-colors duration-200 shadow-sm">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" aria-hidden />
        )}
      </div>
    </div>
  );
};
