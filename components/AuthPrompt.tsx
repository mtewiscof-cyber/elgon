"use client";

import { SignInButton } from "@clerk/nextjs";
import { ReactNode } from "react";

interface AuthPromptProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  showSignUp?: boolean;
  className?: string;
}

export default function AuthPrompt({ 
  title = "Sign in required",
  description = "Please sign in to access this feature.",
  icon,
  showSignUp = true,
  className = ""
}: AuthPromptProps) {
  return (
    <div className={`text-center py-8 px-4 ${className}`}>
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          {icon && (
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {icon}
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm">
            {description}
          </p>
        </div>
        
        <SignInButton mode="modal">
          <button className="w-full bg-amber-600 text-white py-3 px-6 rounded-full font-medium hover:bg-amber-700 transition-colors duration-200">
            Sign In
          </button>
        </SignInButton>
        
        {showSignUp && (
          <p className="text-xs text-gray-500 mt-4">
            Don't have an account?{" "}
            <SignInButton mode="modal">
              <button className="text-amber-600 hover:text-amber-700 font-medium">
                Sign up here
              </button>
            </SignInButton>
          </p>
        )}
      </div>
    </div>
  );
}
