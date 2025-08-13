import React from "react";
import Link from "next/link";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function DashboardHeader() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      {/* Logo / Title */}
      <div className="flex items-center space-x-3">
        <Link href="/dashboard">
          <span className="text-xl font-bold text-amber-900 tracking-tight hover:text-amber-700 transition-colors duration-200">
            Mt.Elgon Dashboard
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:flex items-center space-x-6">
        <Link href="/dashboard" className="text-gray-700 hover:text-amber-900 font-medium transition-colors duration-200">
          Home
        </Link>
        <Link href="/dashboard/profile" className="text-gray-700 hover:text-amber-900 font-medium transition-colors duration-200">
          Profile
        </Link>
        <Link href="/dashboard/support" className="text-gray-700 hover:text-amber-900 font-medium transition-colors duration-200">
          Support
        </Link>
      </nav>

      {/* User Actions */}
      <div className="flex items-center space-x-4">
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
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
