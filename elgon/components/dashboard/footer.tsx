import React from 'react';
import Link from 'next/link';

export default function DashboardFooter() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} Mt.Elgon Women in Specialty Coffee. All rights reserved.
          </p>
        </div>
        <div className="flex space-x-6">
          <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-700">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-700">
            Terms of Service
          </Link>
          <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-700">
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
}
