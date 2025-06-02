"use client";

import Link from 'next/link';
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from 'next/image';
import { useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { FaBars, FaTimes } from 'react-icons/fa';

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const user = useQuery(api.users.getUserByUserId, clerkUser ? {} : "skip");

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav
      className="premium-nav"
      style={{
        backgroundColor: 'rgba(255, 248, 239, 0.85)',
        padding: '0.7rem 1.2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderRadius: '0 0 10px 10px',
        backdropFilter: 'blur(10px)',
        boxShadow: 'var(--shadow-sm)',
        minHeight: 64,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <Link
          href="/"
          style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
        >
          <Image
            src="/Main Logo.png"
            alt="Mt.Elgon Women Logo Icon"
            width={110}
            height={110}
            style={{ objectFit: 'contain', marginRight: '0.5rem', transition: 'width 0.2s, height 0.2s' }}
            className="nav-logo"
          />
        </Link>
      </div>
      {/* Hamburger menu for mobile */}
      <button
        onClick={toggleMenu}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--primary)',
          fontSize: '2rem',
          cursor: 'pointer',
          display: 'none',
        }}
        className="mobile-menu-button"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>
      {/* Navigation links */}
      <ul
        style={{
          display: 'flex',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '1.5rem',
          flexGrow: 1,
          minWidth: '200px',
          transition: 'max-height 0.3s ease-in-out, opacity 0.3s ease-in-out',
        }}
        className={menuOpen ? 'menu-open' : 'menu-closed'}
      >
        <li>
          <Link
            href="/"
            style={{
              color: 'var(--primary)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              fontWeight: 500,
              padding: '0.5rem 1rem',
              borderRadius: 6,
              transition: 'background 0.2s',
            }}
          >
            <span style={{ marginLeft: '0.25rem' }}>Home</span>
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            style={{
              color: 'var(--primary)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              fontWeight: 500,
              padding: '0.5rem 1rem',
              borderRadius: 6,
              transition: 'background 0.2s',
            }}
          >
            <span style={{ marginLeft: '0.25rem' }}>About & Impact</span>
          </Link>
        </li>
        <li>
          <Link
            href="/products"
            style={{
              color: 'var(--primary)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              fontWeight: 500,
              padding: '0.5rem 1rem',
              borderRadius: 6,
              transition: 'background 0.2s',
            }}
          >
            <span style={{ marginLeft: '0.25rem' }}>Products & Education</span>
          </Link>
        </li>
        <li>
          <Link
            href="/blog"
            style={{
              color: 'var(--primary)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              fontWeight: 500,
              padding: '0.5rem 1rem',
              borderRadius: 6,
              transition: 'background 0.2s',
            }}
          >
            <span style={{ marginLeft: '0.25rem' }}>Blog & Contact</span>
          </Link>
        </li>
        <li>
          <Link
            href="/contact"
            style={{
              color: 'var(--primary)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              fontWeight: 500,
              padding: '0.5rem 1rem',
              borderRadius: 6,
              transition: 'background 0.2s',
            }}
          >
            <span style={{ marginLeft: '0.25rem' }}>Contact</span>
          </Link>
        </li>
        {clerkLoaded && clerkUser && user && ["customer", "grower", "admin"].includes(user.role) && (
          <li>
            <Link
              href={
                user.role === "customer"
                  ? "/dashboard/customer"
                  : user.role === "grower"
                  ? "/dashboard/grower"
                  : "/dashboard/admin"
              }
              style={{
                color: 'var(--secondary)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                fontWeight: 600,
                background: 'var(--accent)',
                borderRadius: '9999px',
                padding: '0.5rem 1.5rem',
                marginLeft: '0.5rem',
                boxShadow: 'var(--shadow-sm)',
                transition: 'background 0.2s',
              }}
            >
              Dashboard
            </Link>
          </li>
        )}
      </ul>
      {/* User actions */}
      <div style={{ flexShrink: 0 }} className={menuOpen ? 'menu-open' : 'menu-closed'}>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--primary)',
                padding: '0.8rem 2rem',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1rem',
                transition: 'background 0.2s',
              }}
            >
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
      </div>
      {/* Responsive styles for mobile */}
      <style jsx global>{`
        @media (max-width: 900px) {
          .premium-nav {
            padding: 0.7rem 0.5rem !important;
          }
        }
        @media (max-width: 768px) {
          .premium-nav {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 0.5rem !important;
            min-height: 56px !important;
          }
          .nav-logo {
            width: 70px !important;
            height: 70px !important;
          }
          .mobile-menu-button {
            display: block !important;
            position: absolute;
            right: 1.2rem;
            top: 1.2rem;
            z-index: 1100;
          }
          .menu-closed {
            display: none !important;
          }
          .menu-open {
            display: flex !important;
            flex-direction: column !important;
            gap: 0.7rem !important;
            background: rgba(255, 248, 239, 0.98);
            position: absolute;
            top: 64px;
            left: 0;
            right: 0;
            padding: 1.2rem 0.5rem 1rem 0.5rem;
            border-radius: 0 0 12px 12px;
            box-shadow: var(--shadow-md);
            z-index: 1050;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navigation;
