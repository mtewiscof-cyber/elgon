"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser, useClerk } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { FaUser, FaSignOutAlt, FaTachometerAlt, FaCog } from 'react-icons/fa';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CustomUserButton = () => {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { signOut } = useClerk();
  const user = useQuery(api.users.getUserByUserId, clerkUser ? {} : "skip");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!clerkLoaded || !clerkUser || !isMounted) {
    return null;
  }

  const handleSignOut = () => {
    signOut(() => {
      // Redirect to home page after sign out
      window.location.href = "/";
    });
  };

  const getDashboardLink = () => {
    if (!user || !user.role) return null;
    
    switch (user.role) {
      case "customer":
        return "/dashboard/customer";
      case "grower":
        return "/dashboard/grower";
      case "admin":
        return "/dashboard/admin";
      default:
        return null;
    }
  };

  const dashboardLink = getDashboardLink();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-2 rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2">
          {clerkUser.imageUrl ? (
            <Image
              src={clerkUser.imageUrl}
              alt={clerkUser.fullName || "User"}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
              <FaUser className="w-4 h-4 text-amber-600" />
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-56" align="end" forceMount>

        
        <DropdownMenuSeparator />
        
        {dashboardLink && (
          <DropdownMenuItem asChild>
            <Link href={dashboardLink} className="cursor-pointer">
              <FaTachometerAlt className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
        >
          <FaSignOutAlt className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomUserButton;
