import React from "react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import CustomUserButton from "../CustomUserButton";

export default function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      {/* Logo / Title - hidden on small screens */}
      <div className="hidden sm:flex items-center space-x-3">
        <Link href="/dashboard">
          <span className="text-xl font-bold text-amber-900 tracking-tight hover:text-amber-700 transition-colors duration-200">
            Mt.Elgon Dashboard
          </span>
        </Link>
      </div>

      {/* Spacer to push user actions to the right on small screens */}
      <div className="flex-1"></div>

      {/* User Actions */}
      <div className="flex items-center space-x-4">
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
    </header>
  );
}
